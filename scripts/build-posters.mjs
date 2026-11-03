#!/usr/bin/env node
// 生成 gallery/posters/*.jpg（取片长 35% 处的一帧）+ gallery/posters/meta.json（时长/尺寸/唯一名）
// 需要 ffmpeg / ffprobe 在 PATH；没有就跳过（不阻塞 gallery 生成）。
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'gallery', 'posters');
const ENG = path.join(ROOT, 'engines');

function walk(dir, acc) {
  acc = acc || [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc); else acc.push(p);
  }
  return acc;
}
function has(bin) {
  try { execFileSync(bin, ['-version'], { stdio: 'ignore' }); return true; } catch (e) { return false; }
}
if (!has('ffmpeg') || !has('ffprobe')) {
  console.log('[posters] 没有 ffmpeg/ffprobe，跳过（gallery 仍可生成，只是没有封面帧）');
  process.exit(0);
}

const MARKETING = /garden-skills[\\/](website|dist)[\\/]/i;
const vids = walk(ENG).filter((f) => /\.(mp4|webm)$/i.test(f) && !MARKETING.test(f));
fs.mkdirSync(OUT, { recursive: true });

const meta = {};
let made = 0;
for (const f of vids) {
  const rel = path.relative(ENG, f).split(path.sep).join('/');
  const parts = rel.split('/');
  const dir = parts.length > 1 ? parts[parts.length - 2] : 'root';
  const base = path.basename(f, path.extname(f));
  const key = (dir + '__' + base).replace(/[^0-9A-Za-z_.-]+/g, '-');
  const jpg = path.join(OUT, key + '.jpg');

  let duration = 0;
  try {
    const probe = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nk=1:nw=1', f], { encoding: 'utf8' });
    duration = Math.round(Number(probe.trim()) * 100) / 100 || 0;
  } catch (e) { duration = 0; }

  const at = duration ? Math.min(Math.max(duration * 0.35, 0.6), duration - 0.2) : 1.2;
  if (!fs.existsSync(jpg)) {
    try {
      execFileSync('ffmpeg', ['-y', '-v', 'error', '-ss', String(at), '-i', f, '-frames:v', '1', '-vf', 'scale=720:-2', '-q:v', '4', jpg], { stdio: 'ignore' });
      if (fs.existsSync(jpg)) made += 1;
    } catch (e) { /* 单条失败不影响整体 */ }
  }
  meta[key] = { rel, dir, base, duration, at: Math.round(at * 100) / 100, poster: fs.existsSync(jpg) ? key + '.jpg' : null };
}

fs.writeFileSync(path.join(OUT, 'meta.json'), JSON.stringify(meta, null, 2), 'utf8');
console.log('[posters] ' + Object.keys(meta).length + ' 条视频，+ ' + made + ' 张新封面帧');
