#!/usr/bin/env node
// 对「预览是 <video>」的 wise 动效：直接截取它播放的本地源片段（与 wise 完全一致）。
// 用法：node scripts/build-wise-from-clips.mjs [--ids a,b,c]
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'gallery', 'videos');
const argv = process.argv.slice(2);
const idsArg = (() => { const i = argv.indexOf('--ids'); return i >= 0 ? argv[i + 1].split(',') : null; })();
const PORT = 9900;

const reg = JSON.parse(fs.readFileSync(path.join(ROOT, 'engines/wise-motion/catalog/registry.json'), 'utf8'));
const all = (reg.effects || []).map((e) => e.id);
const targets = idsArg || all;

const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'].find((p) => fs.existsSync(p));
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'cvi-clip-'));
const proc = spawn(CHROME, ['--headless=new', '--hide-scrollbars', '--window-size=1680,1050', '--remote-debugging-port=' + PORT, '--user-data-dir=' + profile, 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target = null;
for (let i = 0; i < 80 && !target; i++) { await sleep(250); try { const l = await (await fetch('http://127.0.0.1:' + PORT + '/json')).json(); target = l.find((t) => t.type === 'page' && t.webSocketDebuggerUrl); } catch (e) {} }
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => { ws.onopen = r; });
let id = 0; const pending = new Map();
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
const send = (m, p) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method: m, params: p || {} })); });
const ev = async (x) => { const r = await send('Runtime.evaluate', { expression: x, returnByValue: true, awaitPromise: true }); return r.result && r.result.result ? r.result.result.value : null; };

let ok = 0, fail = 0, skip = 0;
for (const eid of targets) {
  await send('Page.navigate', { url: 'http://localhost:8099/engines/wise-motion/catalog/index.html#' + eid });
  await sleep(2200);
  const info = await ev('(function(){var v=document.querySelector("#preview video");if(!v)return null;return {src:v.currentSrc||v.src,dur:v.duration};})()');
  if (!info || !info.src) { skip += 1; continue; }
  const u = new URL(info.src);
  const local = path.join(ROOT, decodeURIComponent(u.pathname.replace(/^\/+/, '')));
  const hash = u.hash.replace('#t=', '');
  const [a, b] = hash.split(',').map(Number);
  if (!fs.existsSync(local)) { fail += 1; console.log('  MISS ' + eid + ' ' + local); continue; }
  const out = path.join(OUT, 'wise-' + eid + '.mp4');
  const args = ['-y', '-v', 'error'];
  if (Number.isFinite(a)) args.push('-ss', String(a));
  if (Number.isFinite(b)) args.push('-to', String(b));
  args.push('-i', local, '-an', '-c:v', 'libx264', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out);
  const code = await new Promise((res) => { const p = spawn('ffmpeg', args, { stdio: 'ignore' }); p.on('close', res); });
  if (code === 0 && fs.existsSync(out) && fs.statSync(out).size > 10000) { ok += 1; }
  else { fail += 1; console.log('  FAIL ' + eid); }
}
console.log('[clips] 成功 ' + ok + ' 失败 ' + fail + ' 跳过(非video) ' + skip);
ws.close();
proc.kill();
