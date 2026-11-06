#!/usr/bin/env node
// 把 wise 视频底部录进去的播放器控制条裁掉：crop 上部 76%，再缩放到 1280 宽。
// 用 .cropped.json 记录已处理，避免重复裁切。
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'gallery', 'videos');
const MAN = path.join(DIR, '.cropped.json');
let done = {};
try { done = JSON.parse(fs.readFileSync(MAN, 'utf8')); } catch (e) {}
let qc = {};
try { qc = JSON.parse(fs.readFileSync(path.join(DIR, '_qc.json'), 'utf8')); } catch (e) {}

const files = fs.readdirSync(DIR).filter((f) => f.startsWith('wise-') && f.endsWith('.mp4'));
let n = 0, skip = 0, fail = 0;
for (const f of files) {
  const id = f.replace(/^wise-/, '').replace(/\.mp4$/, '');
  if (qc[id] && qc[id].ok === false) { skip += 1; continue; }
  if (done[f]) { skip += 1; continue; }
  const src = path.join(DIR, f);
  const tmp = path.join(DIR, '.tmp2-' + f);
  const code = await new Promise((res) => {
    const p = spawn('ffmpeg', ['-y', '-v', 'error', '-i', src,
      '-vf', 'crop=iw:ih*0.76:0:0,scale=1280:-2', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '23', '-movflags', '+faststart', tmp], { stdio: 'ignore' });
    p.on('close', res);
  });
  if (code === 0 && fs.existsSync(tmp) && fs.statSync(tmp).size > 10000) {
    fs.rmSync(src); fs.renameSync(tmp, src);
    done[f] = Date.now(); n += 1;
  } else { fs.rmSync(tmp, { force: true }); fail += 1; }
}
fs.writeFileSync(MAN, JSON.stringify(done, null, 1), 'utf8');
console.log('[crop] 处理 ' + n + '，跳过 ' + skip + '，失败 ' + fail);
