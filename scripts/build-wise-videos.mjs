#!/usr/bin/env node
// 把 wise 的动效预览录成本地 mp4（只录 #preview 画面区），供 gallery 用原生播放器播放。
// 用法：node scripts/build-wise-videos.mjs [--shard 0 --of 4] [--limit N] [--seconds 4] [--force]
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'gallery', 'videos');
const CATALOG = path.join(ROOT, 'engines/wise-motion/catalog/index.html');
const argv = process.argv.slice(2);
const num = (f, d) => { const i = argv.indexOf(f); return i >= 0 && argv[i + 1] !== undefined ? Number(argv[i + 1]) : d; };
const SHARD = num('--shard', 0), OF = num('--of', 1);
const LIMIT = num('--limit', 0), SECONDS = num('--seconds', 4), PORT = num('--port', 9500);
const FORCE = argv.includes('--force');
const RESCUE = argv.includes('--missing-only');

if (!fs.existsSync(CATALOG)) { console.error('缺 wise catalog'); process.exit(2); }
const reg = JSON.parse(fs.readFileSync(path.join(ROOT, 'engines/wise-motion/catalog/registry.json'), 'utf8'));
fs.mkdirSync(OUT, { recursive: true });

let ids = (reg.effects || []).map((e) => e.id).filter(Boolean);
ids = ids.filter((_, i) => i % OF === SHARD);
if (LIMIT) ids = ids.slice(0, LIMIT);
const todo = ids.filter((id) => FORCE || !fs.existsSync(path.join(OUT, 'wise-' + id + '.mp4')));
console.log('[wise-video] shard ' + SHARD + '/' + OF + ' → ' + todo.length + ' 条待录');
if (!todo.length) process.exit(0);

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].find((p) => fs.existsSync(p));
if (!CHROME) { console.log('[wise-video] 没找到 Chrome'); process.exit(0); }

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'cvi-wise-'));
const proc = spawn(CHROME, ['--headless=new', '--hide-scrollbars',
  '--window-size=1680,1050', '--remote-debugging-port=' + PORT, '--user-data-dir=' + profile, 'about:blank'], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target = null;
for (let i = 0; i < 240 && !target; i++) {
  await sleep(250);
  try { const l = await (await fetch('http://127.0.0.1:' + PORT + '/json')).json(); target = l.find((t) => t.type === 'page' && t.webSocketDebuggerUrl); } catch (e) {}
}
if (!target) { console.log('[wise-video] CDP 连不上'); proc.kill(); process.exit(1); }

let captureFrames = null;
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => { ws.onopen = r; });
let id = 0; const pending = new Map();
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.method === 'Page.screencastFrame' && captureFrames) {
    captureFrames.push({ d: m.params.data, ts: (m.params.metadata && m.params.metadata.timestamp) || Date.now() / 1000 });
    send('Page.screencastFrameAck', { sessionId: m.params.sessionId });
    return;
  }
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
};
const send = (m, p) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method: m, params: p || {} })); });
const ev = async (x) => { const r = await send('Runtime.evaluate', { expression: x, returnByValue: true }); return r.result && r.result.result ? r.result.result.value : null; };

const fileUrl = 'file:///' + CATALOG.split(path.sep).join('/');
const TMP = path.join(os.tmpdir(), 'cvi-wise-frames');
let ok = 0, fail = 0;
const t0 = Date.now();

for (let i = 0; i < todo.length; i++) {
  const eid = todo[i];
  await send('Page.navigate', { url: fileUrl + '?r=' + i + '#' + eid });
  let box = null;
  for (let w = 0; w < 45 && !box; w++) {
    await sleep(200);
    box = await ev('(function(){var e=document.querySelector("#preview");if(!e)return null;var r=e.getBoundingClientRect();' +
      'if(r.width<300)return null;return {x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)};})()');
  }
  await sleep(600);   // 让动效真正跑起来再开始录
  if (!box) { fail += 1; continue; }
  captureFrames = [];
  await send('Page.startScreencast', { format: 'jpeg', quality: 80, maxWidth: 1680, maxHeight: 1050, everyNthFrame: 1 });
  await sleep(SECONDS * 1000);
  await send('Page.stopScreencast');
  const raw = (captureFrames || []).filter(function (x) { return x && x.d; });
  captureFrames = null;
  const targetFps = 30;
  const frames = [];
  if (raw.length >= 2) {
    const t0 = raw[0].ts, t1 = raw[raw.length - 1].ts;
    const dur = Math.max(0.2, t1 - t0);
    const n = Math.max(2, Math.round(dur * targetFps));
    let j = 0;
    for (let k = 0; k < n; k++) {
      const want = t0 + (k / targetFps);
      while (j < raw.length - 2 && Math.abs(raw[j + 1].ts - want) <= Math.abs(raw[j].ts - want)) j += 1;
      frames.push(raw[j].d);
    }
  }
  if (frames.length < 12) { fail += 1; console.log('  ' + eid + ' 帧太少 ' + frames.length); continue; }
  const dir = path.join(TMP, eid.replace(/[^a-z0-9-]/gi, '_'));
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  frames.forEach((b, k) => fs.writeFileSync(path.join(dir, String(k).padStart(5, '0') + '.jpg'), Buffer.from(b, 'base64')));
  const fps = 30;
  const out = path.join(OUT, 'wise-' + eid + '.mp4');
  const code = await new Promise((res) => {
    const CROP = 'crop=772:434:429:259,scale=1280:-2';   // 固定预览区，去掉底部 18% 控制条
    const filter = CROP;
    const p = spawn('ffmpeg', ['-y', '-v', 'error', '-framerate', String(fps), '-i', path.join(dir, '%05d.jpg'),
      '-vf', filter, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '24', '-movflags', '+faststart', out], { stdio: 'ignore' });
    p.on('close', res);
  });
  fs.rmSync(dir, { recursive: true, force: true });
  if (code === 0 && fs.existsSync(out)) { ok += 1; }
  else { fail += 1; console.log('  FAIL ' + eid); }
  if ((i + 1) % 10 === 0 || i === todo.length - 1) {
    const per = (Date.now() - t0) / (i + 1) / 1000;
    console.log('[wise-video] ' + (i + 1) + '/' + todo.length + ' · ' + per.toFixed(1) + 's/条 · 剩余约 ' + Math.round(per * (todo.length - i - 1) / 60) + ' 分钟');
  }
}
console.log('[wise-video] shard ' + SHARD + ' 完成：成功 ' + ok + ' 失败 ' + fail);
ws.close();
proc.kill();
