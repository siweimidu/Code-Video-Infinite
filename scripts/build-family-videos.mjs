#!/usr/bin/env node
// 39 个风格族 → 每条一个本地 mp4。
// 来源优先级：族内实现的真实录屏 > 族封面/镜头卡静帧推近 > 深色字幕卡
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const VID = path.join(ROOT, 'gallery', 'videos');
const SHOTS = path.join(ROOT, 'gallery', 'shots');
const HTML = path.join(ROOT, 'gallery', 'index.html');
const FORCE = process.argv.includes('--force');
const FONT = ['C:/Windows/Fonts/msyh.ttc', 'C:/Windows/Fonts/arial.ttf'].find((p) => fs.existsSync(p));

const html = fs.readFileSync(HTML, 'utf8');
const m = html.match(/window\.__DATA__=([\s\S]*?);<\/script>/);
const DATA = JSON.parse(m[1]);
const fams = DATA.families || [];
const has = (p) => { try { return fs.existsSync(p) && fs.statSync(p).size > 5000; } catch (e) { return false; } };

let copied = 0, ken = 0, slate = 0, skip = 0, fail = 0;
for (const f of fams) {
  const out = path.join(VID, 'family-' + f.id + '.mp4');
  if (!FORCE && has(out)) { skip += 1; continue; }
  let src = null;
  for (const i of f.impls || f.implementations || []) {
    const id = typeof i === 'string' ? i.split(':')[1] : i.id;
    const cand = path.join(VID, 'wise-' + id + '.mp4');
    if (has(cand)) { src = cand; break; }
  }
  if (!src && f.preview) {
    const p = path.join(ROOT, 'gallery', String(f.preview).replace(/^\/+/, ''));
    if (has(p)) src = p;
  }
  if (!src) {
    for (const i of f.impls || f.implementations || []) {
      const id = typeof i === 'string' ? i.split(':')[1] : i.id;
      const cand = path.join(SHOTS, id + '.jpg');
      if (has(cand)) { src = cand; break; }
    }
  }
  if (src && /\.mp4$/i.test(src)) { fs.copyFileSync(src, out); copied += 1; continue; }
  if (src) {
    const code = await new Promise((res) => {
      const p = spawn('ffmpeg', ['-y', '-v', 'error', '-loop', '1', '-i', src,
        '-vf', 'scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,zoompan=z=min(zoom+0.0006\\,1.08):d=90:s=1280x720:fps=30',
        '-t', '3', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '24', '-movflags', '+faststart', out], { stdio: 'ignore' });
      p.on('close', res);
    });
    if (code === 0) ken += 1; else fail += 1;
    continue;
  }
  if (FONT) {
    const label = String(f.name || f.id).replace(/[:'\\]/g, ' ').slice(0, 26);
    const code = await new Promise((res) => {
      const p = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'lavfi', '-i', 'color=c=0x0b0d12:s=1280x720:d=3:r=30',
        '-vf', 'drawtext=fontfile=' + FONT + ':text=' + label + ':fontcolor=0xffffff:fontsize=44:x=(w-text_w)/2:y=(h-text_h)/2',
        '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '24', '-movflags', '+faststart', out], { stdio: 'ignore' });
      p.on('close', res);
    });
    if (code === 0) slate += 1; else fail += 1;
  } else fail += 1;
}
console.log('[family] 复制录屏 ' + copied + '，静帧推近 ' + ken + '，字幕卡 ' + slate + '，跳过 ' + skip + '，失败 ' + fail);
