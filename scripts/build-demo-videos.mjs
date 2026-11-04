#!/usr/bin/env node
// 把 claude-motion 的源码 demo（HTML + WebGL）录成**本地 mp4**，直接用播放器就能看。
// 做法：CDP Page.startScreencast 抓帧 → ffmpeg 合成。需要先起 serve：
//   node scripts/serve.mjs --port 8095 --root engines/claude-motion/assets/cases/lemo-opuscar
// node scripts/build-demo-videos.mjs [--port 8095] [--seconds 5] [--slug art-deco] [--force]
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'gallery', 'demos');
const STYLES = path.join(ROOT, 'engines/claude-motion/assets/cases/lemo-opuscar/styles');
const TMP = path.join(os.tmpdir(), 'cvi-demo-frames');

const argv = process.argv.slice(2);
const num = (f, d) => { const i = argv.indexOf(f); return i >= 0 && argv[i + 1] !== undefined ? Number(argv[i + 1]) : d; };
const str = (f, d) => { const i = argv.indexOf(f); return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : d; };
const PORT = num('--port', 8095);
const SECONDS = num('--seconds', 5);
const FORCE = argv.includes('--force');
const ONLY = str('--slug', null);
const DEBUG_PORT = num('--cdp', 9430);

if (!fs.existsSync(STYLES)) { console.error('缺 styles 目录'); process.exit(2); }

let slugs = fs.readdirSync(STYLES, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .filter((s) => fs.existsSync(path.join(STYLES, s, 'demo', 'index.html')));
if (ONLY) slugs = [ONLY];
fs.mkdirSync(OUT, { recursive: true });
const todo = slugs.filter((s) => FORCE || !fs.existsSync(path.join(OUT, 'claude-' + s + '.mp4')));
console.log('[demos] ' + todo.length + ' / ' + slugs.length + ' 个待录（每个 ' + SECONDS + 's）');
if (!todo.length) process.exit(0);

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].find((p) => fs.existsSync(p));
if (!CHROME) { console.log('[demos] 没找到 Chrome'); process.exit(0); }

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'cvi-demo-'));
const proc = spawn(CHROME, ['--headless=new', '--hide-scrollbars', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
  '--window-size=1280,720', '--autoplay-policy=no-user-gesture-required',
  '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows',
  '--remote-debugging-port=' + DEBUG_PORT, '--user-data-dir=' + profile, 'about:blank'], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target = null;
for (let i = 0; i < 60 && !target; i++) {
  await sleep(250);
  try {
    const list = await (await fetch('http://127.0.0.1:' + DEBUG_PORT + '/json')).json();
    target = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
  } catch (e) { /* 等 */ }
}
if (!target) { console.log('[demos] CDP 连不上'); proc.kill(); process.exit(1); }

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => { ws.onopen = r; });
let msgId = 0;
const pending = new Map();
let captureFrames = null;
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.method === 'Page.screencastFrame' && captureFrames) {
    captureFrames.push(m.params.data);
    send('Page.screencastFrameAck', { sessionId: m.params.metadata && m.params.metadata.sessionId ? m.params.metadata.sessionId : m.params.sessionId });
    return;
  }
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
};
function send(method, params) {
  return new Promise((res) => { const i = ++msgId; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params: params || {} })); });
}

function sh(cmd, args) {
  return new Promise((res) => {
    const p = spawn(cmd, args, { stdio: 'ignore' });
    p.on('close', (code) => res(code));
  });
}

let ok = 0, fail = 0;
const t0 = Date.now();
for (let i = 0; i < todo.length; i++) {
  const slug = todo[i];
  const url = 'http://localhost:' + PORT + '/styles/' + slug + '/demo/index.html';
  await send('Page.navigate', { url: url });
  await sleep(3500);                       // 等 three.js 场景与字体就绪
  const frames = [];
  const startedAt = Date.now();
  while (Date.now() - startedAt < SECONDS * 1000) {
    const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 80, fromSurface: true });
    if (shot.result && shot.result.data) frames.push(shot.result.data);
  }
  if (frames.length < 10) { fail += 1; console.log('  ' + slug + ' 帧太少(' + frames.length + ')，跳过'); continue; }

  const dir = path.join(TMP, slug);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  frames.forEach((b64, idx) => {
    fs.writeFileSync(path.join(dir, String(idx).padStart(5, '0') + '.jpg'), Buffer.from(b64, 'base64'));
  });
  const fps = Math.max(12, Math.min(30, Math.round(frames.length / SECONDS)));
  const outFile = path.join(OUT, 'claude-' + slug + '.mp4');
  const code = await sh('ffmpeg', ['-y', '-v', 'error', '-framerate', String(fps),
    '-i', path.join(dir, '%05d.jpg'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '23',
    '-movflags', '+faststart', outFile]);
  fs.rmSync(dir, { recursive: true, force: true });
  if (code === 0 && fs.existsSync(outFile)) {
    ok += 1;
    console.log('  OK ' + slug + '  ' + frames.length + ' 帧 @' + fps + 'fps  ' + Math.round(fs.statSync(outFile).size / 1024) + 'KB');
  } else { fail += 1; console.log('  FAIL ' + slug); }
  if ((i + 1) % 5 === 0) {
    const per = (Date.now() - t0) / (i + 1) / 1000;
    console.log('[demos] ' + (i + 1) + '/' + todo.length + ' · ' + per.toFixed(1) + 's/个 · 剩余约 ' + Math.round(per * (todo.length - i - 1) / 60) + ' 分钟');
  }
}
console.log('[demos] 完成：成功 ' + ok + '，失败 ' + fail);
ws.close();
proc.kill();
