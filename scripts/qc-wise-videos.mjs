#!/usr/bin/env node
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'gallery', 'videos');
const OUT = path.join(DIR, '_qc.json');

function frame(file, at) {
  return new Promise((res) => {
    const p = spawn('ffmpeg', ['-v', 'error', '-ss', String(at), '-i', file, '-frames:v', '1',
      '-vf', 'scale=32:18', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'], { stdio: ['ignore', 'pipe', 'ignore'] });
    const chunks = [];
    p.stdout.on('data', (d) => chunks.push(d));
    p.on('close', () => {
      const buf = Buffer.concat(chunks);
      if (buf.length < 576) return res(null);
      let s = 0, s2 = 0;
      for (const v of buf) { s += v; s2 += v * v; }
      const mean = s / buf.length;
      return res({ mean, sd: Math.sqrt(Math.max(0, s2 / buf.length - mean * mean)) });
    });
  });
}

const files = fs.readdirSync(DIR).filter((f) => f.startsWith('wise-') && f.endsWith('.mp4'));
const qc = {};
let ok = 0, bad = 0;
for (const f of files) {
  const id = f.replace(/^wise-/, '').replace(/\.mp4$/, '');
  const pts = [0.1, 0.6, 1.2, 1.8, 2.4, 3.0, 3.6, 4.2];
  const vals = [];
  for (const t of pts) { const v = await frame(path.join(DIR, f), t); if (v) vals.push(v); }
  if (vals.length < 4) { qc[id] = { ok: false, reason: 'noframes' }; bad++; continue; }
  const means = vals.map((v) => v.mean).sort((x, y) => x - y);
  const med = means[Math.floor(means.length / 2)];
  const maxSd = Math.max(...vals.map((v) => v.sd));
  const first = vals[0].mean;
  const good = first >= 6 && med >= 10 && maxSd >= 5;
  qc[id] = { ok: good, first: Math.round(first), med: Math.round(med), sd: Math.round(maxSd) };
  if (good) ok++; else bad++;
}
fs.writeFileSync(OUT, JSON.stringify(qc, null, 1), 'utf8');
console.log('[qc] 合格 ' + ok + '，不合格 ' + bad);
