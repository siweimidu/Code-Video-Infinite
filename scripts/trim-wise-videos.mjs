#!/usr/bin/env node
// 把录到的 wise 视频统一裁掉底部（wise 自带控制条被录进画面），并缩放回 1280x720。
// 用清单文件避免重复裁切。node scripts/trim-wise-videos.mjs [--force]
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'gallery', 'videos');
const MANIFEST = path.join(DIR, '.trimmed.json');
const force = process.argv.includes('--force');
if (!fs.existsSync(DIR)) process.exit(0);

let done = {};
try { done = JSON.parse(fs.readFileSync(MANIFEST, 'utf8')); } catch (e) { done = {}; }

const files = fs.readdirSync(DIR).filter((f) => f.startsWith('wise-') && f.endsWith('.mp4'));
let n = 0, skip = 0, fail = 0;
for (const f of files) {
  if (!force && done[f]) { skip += 1; continue; }
  const src = path.join(DIR, f);
  const tmp = path.join(DIR, '.tmp-' + f);
  const code = await new Promise((res) => {
    const p = spawn('ffmpeg', ['-y', '-v', 'error', '-i', src,
      '-vf', 'crop=iw*0.78:ih*0.78:0:0,scale=1280:720', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '23', '-movflags', '+faststart', tmp], { stdio: 'ignore' });
    p.on('close', res);
  });
  if (code === 0 && fs.existsSync(tmp) && fs.statSync(tmp).size > 10000) {
    fs.rmSync(src);
    fs.renameSync(tmp, src);
    done[f] = Date.now();
    n += 1;
  } else {
    fs.rmSync(tmp, { force: true });
    fail += 1;
  }
}
fs.writeFileSync(MANIFEST, JSON.stringify(done, null, 1), 'utf8');
console.log('[trim] 处理 ' + n + '，跳过 ' + skip + '，失败 ' + fail);
