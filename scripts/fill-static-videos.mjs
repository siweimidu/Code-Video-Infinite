#!/usr/bin/env node
// 给「没有录到视频」的动作补一条本地 mp4：
//   - 有封面：用封面做 3 秒轻微推近（Ken Burns），保证卡片一定有视频
//   - 没封面：生成深色字幕卡（写 id + 分类），标注为无声预览
// node scripts/fill-static-videos.mjs [--limit N] [--force]
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const VID = path.join(ROOT, 'gallery', 'videos');
const COV = path.join(ROOT, 'gallery', 'covers');
const CAT = path.join(ROOT, 'catalog', 'index.json');
const args = process.argv.slice(2);
const LIMIT = (() => { const i = args.indexOf('--limit'); return i >= 0 ? Number(args[i + 1]) : 0; })();
const FORCE = args.includes('--force');

const entries = JSON.parse(fs.readFileSync(CAT, 'utf8')).entries;
const motions = entries.filter((e) => e.collection === 'motion-entry');
let todo = motions.filter((m) => FORCE || !fs.existsSync(path.join(VID, 'wise-' + m.id + '.mp4')));
if (LIMIT) todo = todo.slice(0, LIMIT);
console.log('[fill] 需要补 ' + todo.length + ' / ' + motions.length);

const FONT = ['C:/Windows/Fonts/msyh.ttc', 'C:/Windows/Fonts/msyhbd.ttc', 'C:/Windows/Fonts/arial.ttf'].find((p) => fs.existsSync(p));
let made = 0, slate = 0, fail = 0;
for (let i = 0; i < todo.length; i++) {
  const m = todo[i];
  const out = path.join(VID, 'wise-' + m.id + '.mp4');
  const cover = path.join(COV, 'wise-' + m.id + '.jpg');
  let code = 1;
  if (fs.existsSync(cover)) {
    code = await new Promise((res) => {
      const p = spawn('ffmpeg', ['-y', '-v', 'error', '-loop', '1', '-i', cover,
        '-vf', 'scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,zoompan=z=min(zoom+0.0006\\,1.08):d=90:s=1280x720:fps=30',
        '-t', '3', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '24', '-movflags', '+faststart', out], { stdio: 'ignore' });
      p.on('close', res);
    });
    if (code === 0) made += 1; else fail += 1;
  } else if (FONT) {
    const label = (m.title || m.id).replace(/[:'\\]/g, ' ').slice(0, 40);
    code = await new Promise((res) => {
      const p = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'lavfi', '-i', 'color=c=0x0b0d12:s=1280x720:d=3:r=30',
        '-vf', 'drawtext=fontfile=' + FONT + ':text=' + label + ':fontcolor=0xffffff:fontsize=40:x=(w-text_w)/2:y=(h-text_h)/2-20,' +
        'drawtext=fontfile=' + FONT + ':text=' + (m.id || '') + ':fontcolor=0x8a8a8e:fontsize=22:x=(w-text_w)/2:y=(h-text_h)/2+40',
        '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '24', '-movflags', '+faststart', out], { stdio: 'ignore' });
      p.on('close', res);
    });
    if (code === 0) slate += 1; else fail += 1;
  } else { fail += 1; }
  if ((i + 1) % 50 === 0) console.log('[fill] ' + (i + 1) + '/' + todo.length);
}
console.log('[fill] 完成：封面视频 ' + made + '，字幕卡 ' + slate + '，失败 ' + fail);
