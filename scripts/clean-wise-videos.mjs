#!/usr/bin/env node
// 把 wise 录屏底部 28% 裁掉（那是 wise 播放器自带的控制条），只留画面
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'gallery', 'videos');
const MAN = path.join(DIR, '.clean.json');
let done = {};
try { done = JSON.parse(fs.readFileSync(MAN, 'utf8')); } catch (e) {}
const force = process.argv.includes('--force');

const files = fs.readdirSync(DIR).filter((f) => f.startsWith('wise-') && f.endsWith('.mp4'));
let n = 0, skip = 0, fail = 0;
for (const f of files) {
  if (!force && done[f]) { skip += 1; continue; }
  const src = path.join(DIR, f);
  const tmp = path.join(DIR, '.c-' + f);
  const code = await new Promise((res) => {
    const p = spawn('ffmpeg', ['-y', '-v', 'error', '-i', src,
      '-vf', 'crop=iw:trunc(ih*0.72/2)*2:0:0', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '23', '-movflags', '+faststart', tmp], { stdio: 'ignore' });
    p.on('close', res);
  });
  if (code === 0 && fs.existsSync(tmp) && fs.statSync(tmp).size > 3000) {
    fs.rmSync(src); fs.renameSync(tmp, src);
    done[f] = true; n += 1;
  } else { fs.rmSync(tmp, { force: true }); fail += 1; }
}
fs.writeFileSync(MAN, JSON.stringify(done), 'utf8');
console.log('[clean] 处理 ' + n + '，跳过 ' + skip + '，失败 ' + fail);
