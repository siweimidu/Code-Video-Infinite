#!/usr/bin/env node
// wise 动效录制器 v2：reload iframe 让动效从 0 开始，再录 3-6 秒，按真实时间戳重采样到 30fps。
// 依赖静态服务：node scripts/serve.mjs --port 8099
// 用法：node scripts/build-wise-videos.mjs [--shard 0 --of 4] [--port 9790] [--force] [--limit N]
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'gallery', 'videos');
const argv = process.argv.slice(2);
const num = (f, d) => { const i = argv.indexOf(f); return i >= 0 && argv[i + 1] !== undefined ? Number(argv[i + 1]) : d; };
const SHARD = num('--shard', 0), OF = num('--of', 1), LIMIT = num('--limit', 0);
const PORT = num('--port', 9790), HTTP = num('--http', 8099);
const FORCE = argv.includes('--force');
const FPS = 30;

const reg = JSON.parse(fs.readFileSync(path.join(ROOT, 'engines/wise-motion/catalog/registry.json'), 'utf8'));
let ids = (reg.effects || []).map((e) => e.id).filter(Boolean);
const durOf = (id) => {
  const e = (reg.effects || []).find((x) => x.id === id) || {};
  return Math.min(8, Math.max(2.5, (e.duration_ms || 3000) / 1000 + 0.4));
};
ids = ids.filter((_, i) => i % OF === SHARD);
if (LIMIT) ids = ids.slice(0, LIMIT);
fs.mkdirSync(OUT, { recursive: true });
const todo = ids.filter((id) => FORCE || !fs.existsSync(path.join(OUT, 'wise-' + id + '.mp4')));
console.log('[wise2] shard ' + SHARD + '/' + OF + ' 待录 ' + todo.length);
if (!todo.length) process.exit(0);

const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome'].find((p) => fs.existsSync(p));

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'cvi-w2-'));
const proc = spawn(CHROME, ['--headless=new', '--hide-scrollbars', '--window-size=1680,1050',
  '--disable-background-timer-throttling', '--disable-renderer-backgrounding',
  '--remote-debugging-port=' + PORT, '--user-data-dir=' + profile, 'about:blank'], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target = null;
for (let i = 0; i < 200 && !target; i++) { await sleep(250); try { const l = await (await fetch('http://127.0.0.1:' + PORT + '/json')).json(); target = l.find((t) => t.type === 'page' && t.webSocketDebuggerUrl); } catch (e) {} }
if (!target) { console.log('[wise2] CDP 连不上'); proc.kill(); process.exit(1); }

let frames = [];
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => { ws.onopen = r; });
let id = 0; const pending = new Map();
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.method === 'Page.screencastFrame') {
    frames.push({ d: m.params.data, ts: m.params.metadata.timestamp });
    send('Page.screencastFrameAck', { sessionId: m.params.sessionId });
    return;
  }
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
};
const send = (m, p) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method: m, params: p || {} })); });
const ev = async (x) => { const r = await send('Runtime.evaluate', { expression: x, returnByValue: true, awaitPromise: true }); return r.result && r.result.result ? r.result.result.value : null; };

const base = 'file:///' + path.join(ROOT, 'engines/wise-motion/catalog/index.html').split(path.sep).join('/');
let ok = 0, fail = 0;
const t0 = Date.now();
for (let i = 0; i < todo.length; i++) {
  const eid = todo[i];
  const dur = durOf(eid);
  try {
    await send('Page.navigate', { url: base + '?r=' + Date.now() + '#' + eid });
    let ready = false;
    for (let w = 0; w < 50 && !ready; w++) { await sleep(150); ready = await ev('!!document.querySelector("#preview iframe")'); }
    if (!ready) { fail++; continue; }
    const box = await ev('(function(){var e=document.querySelector("#preview");var r=e.getBoundingClientRect();return {x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)};})()');
    await sleep(250);
    frames = [];
    await send('Page.startScreencast', { format: 'jpeg', quality: 88, maxWidth: 1680, maxHeight: 1050, everyNthFrame: 1 });
    await sleep((dur + 0.6) * 1000);
    await send('Page.stopScreencast');
    const raw = frames.filter((x) => x && x.d);
    if (raw.length < 30) { fail++; console.log('  ' + eid + ' 帧少 ' + raw.length); continue; }
    // 按时间戳重采样到 30fps
    const tA = raw[0].ts, tB = raw[raw.length - 1].ts;
    const durReal = Math.max(0.5, tB - tA);
    const n = Math.round(durReal * FPS);
    const picked = [];
    let j = 0;
    for (let k = 0; k < n; k++) {
      const want = tA + k / FPS;
      while (j < raw.length - 2 && Math.abs(raw[j + 1].ts - want) <= Math.abs(raw[j].ts - want)) j++;
      picked.push(raw[j].d);
    }
    const dir = path.join(os.tmpdir(), 'cvi-w2f', eid.replace(/[^a-z0-9-]/gi, '_'));
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
    picked.forEach((b, k) => fs.writeFileSync(path.join(dir, String(k).padStart(5, '0') + '.jpg'), Buffer.from(b, 'base64')));
    const out = path.join(OUT, 'wise-' + eid + '.mp4');
    const cw = Math.round(box.w), chh = Math.round(box.h);
    const filter = 'crop=' + cw + ':' + chh + ':' + Math.round(box.x) + ':' + Math.round(box.y) + ',crop=iw:ih*0.76:0:0,scale=1280:-2';
    const code = await new Promise((res) => {
      const p = spawn('ffmpeg', ['-y', '-v', 'error', '-framerate', String(FPS), '-i', path.join(dir, '%05d.jpg'),
        '-vf', filter, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-movflags', '+faststart', out], { stdio: 'ignore' });
      p.on('close', res);
    });
    fs.rmSync(dir, { recursive: true, force: true });
    if (code === 0 && fs.existsSync(out)) ok++; else fail++;
  } catch (e) { fail++; }
  if ((i + 1) % 10 === 0 || i === todo.length - 1) {
    const per = (Date.now() - t0) / (i + 1) / 1000;
    console.log('[wise2] ' + (i + 1) + '/' + todo.length + ' · ' + per.toFixed(1) + 's/条 · 剩余 ' + Math.round(per * (todo.length - i - 1) / 60) + ' 分钟');
  }
}
console.log('[wise2] 完成 成功 ' + ok + ' 失败 ' + fail);
ws.close(); proc.kill();
