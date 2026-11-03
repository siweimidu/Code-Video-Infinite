#!/usr/bin/env node
// 生成 gallery/index.html（单文件、可 file:// 直接打开）
// 输入：catalog/index.json + catalog/styles.json + engines/ 真实文件 + gallery/_src/{shell.html,style.css,app.js}
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'gallery');
const SRC = path.join(OUT, '_src');
const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const exists = (p) => fs.existsSync(p);
const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');
const url = (p) => '../' + rel(p);
const posix = (p) => p.split(path.sep).join('/');

function walk(dir, acc) {
  acc = acc || [];
  if (!exists(dir)) return acc;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc); else acc.push(p);
  }
  return acc;
}

if (!exists(path.join(ROOT, 'catalog/index.json'))) {
  console.error('缺 catalog/index.json，先跑 node scripts/build-catalog.mjs');
  process.exit(2);
}

const idx = readJson(path.join(ROOT, 'catalog/index.json'));
const sty = readJson(path.join(ROOT, 'catalog/styles.json'));
const entries = idx.entries || [];
const engRoot = path.join(ROOT, 'engines');
const all = walk(engRoot);
const styleMeta = new Map();
for (const e of entries) if (e.collection === 'style') styleMeta.set(e.id, e);
const MARKETING = /garden-skills\/(website|dist)\//i;

const posterMeta = exists(path.join(OUT, 'posters/meta.json')) ? readJson(path.join(OUT, 'posters/meta.json')) : {};
const videos = Object.keys(posterMeta).map((key) => {
  const m = posterMeta[key];
  const abs = path.join(engRoot, m.rel);
  const kind = m.rel.indexOf('onetake/cases/') >= 0 ? 'onetake' : 'wise';
  const generic = /^(movie|preview|out|final|main|video)$/i.test(m.base);
  const dup = m.dir.toLowerCase().indexOf(m.base.toLowerCase()) >= 0;
  const title = generic || dup ? m.dir : (m.dir === m.base ? m.base : m.dir + ' · ' + m.base);
  return {
    src: url(abs), name: title, key, kind,
    label: kind === 'onetake' ? 'onetake 案例片' : 'wise 影片',
    poster: m.poster ? 'posters/' + m.poster : null,
    duration: m.duration || 0,
    mb: Math.round((fs.statSync(abs).size / 1048576) * 10) / 10,
    path: m.rel,
  };
}).filter((v) => v.mb > 0.5).sort((a, b) => b.mb - a.mb);
const gifs = all
  .filter((f) => /\.gif$/i.test(f) && !MARKETING.test(posix(f)))
  .map((f) => ({ src: url(f), name: path.basename(f, '.gif'), mb: Math.round((fs.statSync(f).size / 1048576) * 10) / 10, path: rel(f) }))
  .filter((g) => g.mb > 0.3)
  .sort((a, b) => b.mb - a.mb);

const previews = new Map();
for (const f of all) {
  const pf = posix(f);
  if (!/\/claude-motion\/assets\/cases\/previews\/[^/]+\.(png|webp|jpg)$/i.test(pf)) continue;
  previews.set(path.basename(f).replace(/\.(png|webp|jpg)$/i, ''), url(f));
}
const coverOf = (skill) => {
  const p = path.join(engRoot, 'garden-skills/dist/imgs/covers', skill + '.webp');
  return exists(p) ? url(p) : null;
};

const PAL = {
  '图形与排版': ['#ffffff', '#1d1d1f', '#c9a227'],
  '印刷与版画': ['#ffffff', '#1d1d1f', '#b6472f'],
  '手作': ['#ffffff', '#1d1d1f', '#d98f4b'],
  '插画与漫画': ['#ffffff', '#1d1d1f', '#e8503a'],
  '插画与绘画': ['#ffffff', '#1d1d1f', '#c2410c'],
  '东方传统': ['#ffffff', '#1d1d1f', '#8f2f24'],
  '3D 与材质': ['#ffffff', '#1d1d1f', '#5b8cff'],
  '生成与抽象': ['#ffffff', '#1d1d1f', '#7c5cff'],
  '界面与屏幕': ['#ffffff', '#1d1d1f', '#0a84ff'],
  '界面与产品': ['#ffffff', '#1d1d1f', '#34c759'],
  '复古与屏幕': ['#ffffff', '#1d1d1f', '#ff2d95'],
  '讲解与科普': ['#ffffff', '#1d1d1f', '#ff9f0a'],
};
const palOf = (cat) => {
  for (const k of Object.keys(PAL)) if (String(cat).indexOf(k) >= 0) return PAL[k];
  return ['#ffffff', '#1d1d1f', '#8e8e93'];
};

const families = (sty.families || []).map((f) => {
  let preview = null;
  for (const i of f.implementations) {
    if (i.library !== 'claude-motion') continue;
    for (const c of ['lemo-' + i.id, 'expansion-' + i.id, i.id]) if (previews.has(c)) { preview = previews.get(c); break; }
    if (preview) break;
  }
  let one = '';
  for (const i of f.implementations) {
    const key = i.library === 'motion-showreel' ? i.id : i.library + ':' + i.id;
    const m = styleMeta.get(key);
    if (m && m.summary) { one = m.summary; break; }
  }
  return {
    id: f.id, name: f.name, cat: f.category || '未分类',
    mood: f.mood || [], libs: f.libraries || [], impls: f.implementations || [],
    preview, pal: palOf(f.category), one,
  };
});

const shotCards = entries.filter((e) => e.collection === 'shot-card').map((e) => ({
  id: e.id, t: String(e.title || '').slice(0, 140), cat: e.category || '',
  d: e.duration || '', en: e.energy || '', p: e.path || '',
}));
const motions = entries.filter((e) => e.collection === 'motion-entry').map((e) => ({
  id: e.id, t: e.title || e.id, cat: e.category || '', ms: e.durationMs || 0,
  loop: !!e.loop, doc: e.doc || e.path || '',
}));
const tools = entries.filter((e) => e.collection === 'tool').map((e) => ({
  id: e.id, medium: e.medium, t: String(e.summary || '').slice(0, 240), cover: coverOf(e.id), p: e.path,
}));

const DATA = {
  generatedAt: new Date().toISOString().slice(0, 10),
  totals: {
    families: families.length,
    withPreview: families.filter((f) => f.preview).length,
    videos: videos.length, gifs: gifs.length,
    shotCards: shotCards.length, motions: motions.length, tools: tools.length,
    entries: entries.length,
  },
  families, videos, gifs, shotCards, motions, tools,
};

const shell = fs.readFileSync(path.join(SRC, 'shell.html'), 'utf8');
const css = fs.readFileSync(path.join(SRC, 'style.css'), 'utf8');
const app = fs.readFileSync(path.join(SRC, 'app.js'), 'utf8');

const html = shell
  .split('<!--CSS-->').join(css)
  .split('<!--DATA-->').join(JSON.stringify(DATA))
  .split('<!--APP-->').join(app);

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.html'), html, 'utf8');
console.log('[gallery] gallery/index.html  ' + Math.round(Buffer.byteLength(html) / 1024) + ' KB');
console.log('[gallery] families=' + families.length + ' real=' + DATA.totals.withPreview +
  ' videos=' + videos.length + ' gifs=' + gifs.length + ' shots=' + shotCards.length + ' moves=' + motions.length);
