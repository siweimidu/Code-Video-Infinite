#!/usr/bin/env node
// 质检 wise 本地视频：抽 3 帧（用 raw gray 像素）算平均亮度与方差，结果写 gallery/videos/_qc.json
// 页面构建时读这个文件，把太黑/静止的视频排除（自动退回静帧+入口）。
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'gallery', 'videos');
const OUT = path.join(DIR, '_qc.json');

function grayFrame(file, at) {
  return new Promise((res) => {
    const p = spawn('ffmpeg', ['-v', 'error', '-ss', String(at), '-i', file, '-frames:v', '1',
      '-vf', 'scale=32:18', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'], { stdio: ['ignore', 'pipe', 'ignore'] });
    const chunks = [];
    p.stdout.on('data', (d) => chunks.push(d));
    p.on('close', () => {
      const buf = Buffer.concat(chunks);
      if (buf.length < 32 * 18) return res(null);
      let sum = 0, sum2 = 0;
      for (const v of buf) { sum += v; sum2 += v * v; }
      const mean = sum / buf.length;
      const sd = Math.sqrt(Math.max(0, sum2 / buf.length - mean * mean));
      res({ mean, sd });
    });
  });
}

const files = fs.readdirSync(DIR).filter((f) => f.startsWith('wise-') && f.endsWith('.mp4'));
const qc = {};
let ok = 0, bad = 0;
for (const f of files) {
  const id = f.replace(/^wise-/, '').replace(/\.mp4$/, '');
  const a = await grayFrame(path.join(DIR, f), 0.4);
  const b = await grayFrame(path.join(DIR, f), 1.6);
  const c = await grayFrame(path.join(DIR, f), 2.8);
  if (!a || !b || !c) { qc[id] = { ok: false, reason: 'noframes' }; bad += 1; continue; }
  const maxMean = Math.max(a.mean, b.mean, c.mean);
  const maxSd = Math.max(a.sd, b.sd, c.sd);
  const staticAll = Math.max(a.sd, b.sd, c.sd) < 3 && Math.abs(a.mean - b.mean) < 2 && Math.abs(b.mean - c.mean) < 2;
  const good = maxMean >= 8 && maxSd >= 3 && !staticAll;
  qc[id] = { ok: good, mean: Math.round(maxMean), sd: Math.round(maxSd) };
  if (good) ok += 1; else bad += 1;
}
fs.writeFileSync(OUT, JSON.stringify(qc, null, 1), 'utf8');
console.log('[qc] 合格 ' + ok + '，不合格 ' + bad + '（写入 _qc.json，构建时自动排除）');
