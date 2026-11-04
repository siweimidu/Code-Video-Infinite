#!/usr/bin/env node
// 给 wise 的 462 个动效条目批量抓「真实预览帧」，存成 gallery/covers/wise-<id>.jpg
// 做法：起一个 headless Chrome，逐个 hash 打开 catalog/index.html#<id>，等动画跑起来，截 .#preview 区域。
// node scripts/build-covers.mjs [--limit N] [--wait 2600] [--shard 0 --of 2] [--force]
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'gallery', 'covers');
const CATALOG = path.join(ROOT, 'engines/wise-motion/catalog/index.html');
const portArg = process.argv.indexOf('--port');
const PORT = portArg >= 0 ? Number(process.argv[portArg + 1]) : 9340;

const argv = process.argv.slice(2);
const num = (flag, def) => { const i = argv.indexOf(flag); return i >= 0 && argv[i + 1] !== undefined ? Number(argv[i + 1]) : def; };
const LIMIT = num('--limit', 0);
const WAIT = num('--wait', 2600);
const SHARD = num('--shard', 0);
const OF = num('--of', 1);
const FORCE = argv.includes('--force');
const SCALE = num('--scale', 0.625);

if (!fs.existsSync(CATALOG)) { console.error('缺 wise catalog/index.html'); process.exit(2); }
if (!fs.existsSync(path.join(ROOT, 'engines/wise-motion/catalog/registry.json'))) { console.error('缺 registry.json'); process.exit(2); }
fs.mkdirSync(OUT, { recursive: true });

const reg = JSON.parse(fs.readFileSync(path.join(ROOT, 'engines/wise-motion/catalog/registry.json'), 'utf8'));
let ids = (reg.effects || []).map((e) => e.id).filter(Boolean);
ids = ids.filter((_, i) => i % OF === SHARD);
if (LIMIT) ids = ids.slice(0, LIMIT);
const MIN_BYTES = num('--min-bytes', 2600);
const RETRY_BLANK = argv.includes('--retry-blank');
const coverSize = (id) => { const p = path.join(OUT, 'wise-' + id + '.jpg'); return fs.existsSync(p) ? fs.statSync(p).size : -1; };
const todo = ids.filter((id) => {
  const size = coverSize(id);
  if (FORCE) return true;
  if (RETRY_BLANK) return size < MIN_BYTES;
  return size < 0;
});

console.log('[covers] shard ' + SHARD + '/' + OF + ' → ' + todo.length + ' 张待抓（总 ' + ids.length + '）');
if (!todo.length) process.exit(0);

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].find((p) => fs.existsSync(p));
if (!CHROME) { console.log('[covers] 没找到 Chrome，跳过'); process.exit(0); }

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'cvi-covers-'));
const proc = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars',
  '--remote-debugging-port=' + PORT, '--user-data-dir=' + profile, '--window-size=1680,1050', 'about:blank'], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target = null;
for (let i = 0; i < 60 && !target; i++) {
  await sleep(250);
  try {
    const list = await (await fetch('http://127.0.0.1:' + PORT + '/json')).json();
    target = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
  } catch (e) { /* 等 */ }
}
if (!target) { console.log('[covers] CDP 连不上'); proc.kill(); process.exit(1); }

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => { ws.onopen = r; });
let msgId = 0;
const pending = new Map();
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
const send = (method, params) => new Promise((res) => { const i = ++msgId; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params: params || {} })); });
const ev = async (expr) => {
  const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
  return r.result && r.result.result ? r.result.result.value : null;
};
const fileUrl = 'file:///' + CATALOG.split(path.sep).join('/');

let ok = 0, fail = 0, blank = 0;
const t0 = Date.now();
for (let i = 0; i < todo.length; i++) {
  const id = todo[i];
  await send('Page.navigate', { url: fileUrl + '#' + id });
  await sleep(WAIT);
  const box = await ev('(function(){var e=document.querySelector("#preview");if(!e)return null;var r=e.getBoundingClientRect();' +
    'if(r.width<300)return null;return {x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)};})()');
  if (!box) { fail += 1; continue; }
  // 播放器控制条压在预览底部，裁掉下面 26%，只留画面
  const visible = Math.round(box.h * 0.74);
  const clip = { x: box.x, y: box.y, width: box.w, height: visible, scale: SCALE };
  const first = await send('Page.captureScreenshot', { format: 'jpeg', quality: 80, clip: clip });
  await sleep(750);
  const second = await send('Page.captureScreenshot', { format: 'jpeg', quality: 80, clip: clip });
  const a = first.result && first.result.data ? Buffer.from(first.result.data, 'base64') : null;
  const b = second.result && second.result.data ? Buffer.from(second.result.data, 'base64') : null;
  const buf = !a ? b : !b ? a : (b.length > a.length ? b : a);
  if (!buf) { fail += 1; continue; }
  if (buf.length < 3000) { blank += 1; }
  fs.writeFileSync(path.join(OUT, 'wise-' + id + '.jpg'), buf);
  ok += 1;
  if ((i + 1) % 20 === 0 || i === todo.length - 1) {
    const per = (Date.now() - t0) / (i + 1) / 1000;
    console.log('[covers] ' + (i + 1) + '/' + todo.length + ' · ' + per.toFixed(2) + 's/张 · 剩余约 ' + Math.round(per * (todo.length - i - 1) / 60) + ' 分钟');
  }
}
console.log('[covers] shard ' + SHARD + ' 完成：成功 ' + ok + '，失败 ' + fail + '，疑似空帧 ' + blank);
ws.close();
proc.kill();
