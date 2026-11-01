#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'catalog');
const BT = String.fromCharCode(96);
const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');
const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const readText = (p) => fs.readFileSync(p, 'utf8');
const exists = (p) => fs.existsSync(p);

function walk(dir, filter, acc) {
  acc = acc || [];
  if (!exists(dir)) return acc;
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of items) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, filter, acc);
    else if (filter(p)) acc.push(p);
  }
  return acc;
}

function frontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const out = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([^:]{1,40}):\s*(.*)$/);
    if (kv) out[kv[1].trim()] = kv[2].trim();
  }
  return out;
}

const entries = [];
const push = (e) => entries.push(e);

// ---------------------------------------------------------------- shotcraft
const shotRoot = path.join(ROOT, 'engines/shotcraft/references/shots');
for (const file of walk(shotRoot, (p) => p.endsWith('.md'))) {
  const fm = frontmatter(readText(file));
  if (!fm.name) continue;
  push({
    source: 'shotcraft',
    collection: 'shot-card',
    id: fm.name,
    title: fm['一句话'] || fm.name,
    category: path.basename(path.dirname(file)),
    summary: fm['适用'] || '',
    duration: fm['时长'] || '',
    energy: fm['能量'] || '',
    path: rel(file),
    use: 'Remotion 镜头配方卡：读全文，再按“参考实现”定位 demos/ 源码，copy 进工程再改参数',
  });
}

// ------------------------------------------------------------- wise-motion
const wiseReg = path.join(ROOT, 'engines/wise-motion/catalog/registry.json');
if (exists(wiseReg)) {
  const reg = readJson(wiseReg);
  const catName = new Map();
  for (const c of reg.categories || []) catName.set(c.id || c.slug || c.name, c.name || c.id);
  for (const e of reg.effects || []) {
    const docPath = path.join(ROOT, 'engines/wise-motion/references/effects', e.id + '.md');
    push({
      source: 'wise-motion',
      collection: 'motion-entry',
      id: e.id,
      title: e.name || e.id,
      category: catName.get(e.category) || e.category || '',
      kind: e.kind || '',
      summary: e.summary || '',
      tags: e.aliases || [],
      behaviors: e.behaviors || [],
      durationMs: typeof e.duration_ms === 'number' ? e.duration_ms : null,
      loop: !!e.loop,
      sourcePath: (e.source && e.source.path) || '',
      factory: (e.source && e.source.factory) || '',
      license: (e.source && e.source.license) || '',
      doc: exists(docPath) ? rel(docPath) : '',
      use: 'node engines/wise-motion/scripts/show.mjs ' + e.id + ' 看预览与源码入口；export.mjs 导出到工程',
    });
  }
}

// ----------------------------------------------------------- claude-motion
const cm = path.join(ROOT, 'engines/claude-motion/references');
function cmAdd(file, mapper) {
  const p = path.join(cm, file);
  if (!exists(p)) return;
  const d = readJson(p);
  const list = d.cases || d.engines || d.scenes || d.models || d.extensions || [];
  for (const item of list) push(mapper(item));
}
cmAdd('case-catalog.json', (c) => ({
  source: 'claude-motion',
  collection: 'animation-case',
  id: c.id,
  title: c.title || c.id,
  titleZh: (c.description && c.description.zh) || '',
  category: (c.style && c.style.zh) || (c.style && c.style.slug) || '',
  summary: (c.description && (c.description.zh || c.description.en)) || '',
  tags: [c.style && c.style.slug, c.style && c.style.en, c.style && c.style.category].filter(Boolean),
  path: c.paths && c.paths.entry ? 'engines/claude-motion/' + c.paths.entry : '',
  license: (c.source && c.source.license) || '',
  upstream: (c.source && c.source.url) || '',
  use: 'node engines/claude-motion/scripts/prepare-case.mjs --case ' + c.id + ' --out <作品目录>',
}));
cmAdd('engine-catalog.json', (e) => ({
  source: 'claude-motion',
  collection: 'production-engine',
  id: e.id,
  title: e.title || e.id,
  tags: e.tags || [],
  summary: e.status || '',
  path: e.template ? 'engines/claude-motion/' + e.template : '',
  preview: e.preview ? 'engines/claude-motion/' + e.preview : '',
  use: 'node engines/claude-motion/scripts/create-engine.mjs --engine ' + e.id + ' --out <新目录>',
}));
cmAdd('scene-catalog.json', (s) => ({
  source: 'claude-motion',
  collection: 'scene-starter',
  id: s.id,
  title: s.title || s.id,
  kind: s.kind || '',
  tags: s.tags || [],
  summary: s.retained || '',
  path: s.path ? 'engines/claude-motion/' + s.path : '',
  license: s.license || '',
  upstream: s.source || '',
  use: 'node engines/claude-motion/scripts/create-scene.mjs --scene ' + s.id + ' --out <新目录>',
}));
cmAdd('model-catalog.json', (m) => ({
  source: 'claude-motion',
  collection: 'object-model',
  id: m.id,
  title: m.title || m.id,
  kind: m.kind || '',
  summary: typeof m.modelOrigin === 'string' ? m.modelOrigin : '',
  upstream: m.source || '',
  license: Array.isArray(m.license) ? m.license.map((l) => l.license).join(', ') : (m.license || ''),
  use: 'node engines/claude-motion/scripts/create-model.mjs --model ' + m.id + ' --out <新目录>',
}));
cmAdd('extension-catalog.json', (e) => ({
  source: 'claude-motion',
  collection: 'source-component',
  id: e.id,
  title: e.title || e.id,
  tags: e.tags || [],
  summary: e.status || '',
  path: e.template ? 'engines/claude-motion/' + e.template : '',
  preview: e.preview ? 'engines/claude-motion/' + e.preview : '',
  use: 'node engines/claude-motion/scripts/create-extension.mjs --extension ' + e.id + ' --out <新目录>',
}));
const cmSrc = path.join(cm, 'source-index.json');
if (exists(cmSrc)) {
  for (const s of readJson(cmSrc).sources || []) {
    push({
      source: 'claude-motion',
      collection: 'research-source',
      id: s.repo,
      title: s.repo,
      category: s.style || '',
      kind: s.kind || '',
      summary: s.reuse || '',
      tags: [s.style, s.kind].filter(Boolean),
      upstream: s.url || '',
      license: s.license || '',
      use: '只读研究清单：已收录但未接成可调用案例，不要当作可运行案例',
    });
  }
}

// ---------------------------------------------------------------- mg-motion
const mgStyles = path.join(ROOT, 'engines/mg-motion/references/styles.md');
if (exists(mgStyles)) {
  const lines = readText(mgStyles).split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^##\s+(\d{2})\s*·\s*(.+)$/);
    if (!m) continue;
    const body = [];
    for (let k = i + 1; k < lines.length && !/^##\s/.test(lines[k]); k++) {
      if (lines[k].trim()) body.push(lines[k].trim());
    }
    push({
      source: 'mg-motion',
      collection: 'mg-style',
      id: 'style-' + m[1],
      title: m[2].trim(),
      category: 'MG 风格',
      summary: body.slice(0, 2).join(' ').slice(0, 240),
      path: 'engines/mg-motion/references/styles.md',
      use: '按 references/styles.md 的签名技法写 renderAt(t)；混搭读 references/blending.md',
    });
  }
}

// ------------------------------------------------------------------ onetake
const otLib = path.join(ROOT, 'engines/onetake/references/motion-library.md');
if (exists(otLib)) {
  const lines = readText(otLib).split(/\r?\n/);
  let section = '';
  for (const line of lines) {
    const h = line.match(/^##\s+(.+)$/);
    if (h) { section = h[1].trim(); continue; }
    if (!section || section === 'Applying a move') continue;
    const row = line.match(/^\|\s*(.+?)\(/);
    if (!row) continue;
    const name = row[1].replace(/[^A-Za-z0-9_$.]/g, '');
    if (!name || name === 'move') continue;
    const cells = line.split('|');
    push({
      source: 'onetake',
      collection: 'move',
      id: name,
      title: name,
      category: section,
      summary: (cells[3] || '').trim(),
      path: 'engines/onetake/references/motion-library.md',
      use: 'window.OM.' + name + '(t, t0, ...) 纯时间函数；曲线按 t80 选，见 engines/onetake/lib/motion.js',
    });
  }
}
const otLooks = path.join(ROOT, 'engines/onetake/looks/looks.json');
if (exists(otLooks)) {
  const d = readJson(otLooks);
  const looks = d.looks && typeof d.looks === 'object' ? Object.keys(d.looks) : [];
  for (const name of looks) {
    const v = d.looks[name] || {};
    push({
      source: 'onetake',
      collection: 'look',
      id: name,
      title: name,
      category: 'look',
      summary: v.about || v.note || '',
      path: 'engines/onetake/looks/looks.json',
      use: 'python3 engines/onetake/scripts/look.py apply <name> -> look.js（概念轮按名选，不静默套用）',
    });
  }
}

// --------------------------------------------------------------------- write
entries.sort((a, b) => (a.source + a.collection + a.id).localeCompare(b.source + b.collection + b.id));
const byCollection = {};
for (const e of entries) byCollection[e.collection] = (byCollection[e.collection] || 0) + 1;
const bySource = {};
for (const e of entries) bySource[e.source] = (bySource[e.source] || 0) + 1;

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify({
  schemaVersion: 1,
  generatedBy: 'scripts/build-catalog.mjs',
  totals: { entries: entries.length, bySource, byCollection },
  entries,
}), 'utf8');

const md = [];
md.push('# 统一索引 · Code-Video-Infinite', '');
md.push('由 ' + BT + 'node scripts/build-catalog.mjs' + BT + ' 从五个引擎各自的真实目录生成，不要手改。');
md.push('', '检索用 ' + BT + 'node scripts/find.mjs <需求>' + BT + '；本文件只是清单。', '');
md.push('## 总量', '', '| 来源 | 条目 |', '| --- | --- |');
for (const k of Object.keys(bySource).sort()) md.push('| ' + k + ' | ' + bySource[k] + ' |');
md.push('| **合计** | **' + entries.length + '** |', '');
const COLL = {
  'shot-card': '镜头配方卡（shotcraft）',
  'motion-entry': '动效条目 · 通用动作词汇（wise-motion）',
  'animation-case': '动画源码案例（claude-motion）',
  'production-engine': '可运行制作系统（claude-motion）',
  'scene-starter': '场景起点（claude-motion）',
  'source-component': '源码组件（claude-motion）',
  'object-model': '物件模型（claude-motion）',
  'research-source': '研究清单 · 未接通源码（claude-motion）',
  'mg-style': 'MG 风格 · 签名技法（mg-motion）',
  move: '动效函数 · lib/motion.js（onetake）',
  look: '起始 look（onetake）',
};
for (const c of Object.keys(byCollection).sort()) {
  md.push('## ' + (COLL[c] || c), '', '| id | 名称 / 一句话 | 分类 | 时长 / 能量 | 入口 |', '| --- | --- | --- | --- | --- |');
  for (const e of entries) {
    if (e.collection !== c) continue;
    const t = String(e.title || '').replace(/\|/g, '/').slice(0, 80);
    const extra = [e.duration, e.energy, e.durationMs ? e.durationMs + 'ms' : ''].filter(Boolean).join(' · ');
    md.push('| ' + BT + e.id + BT + ' | ' + t + ' | ' + String(e.category || '').replace(/\|/g, '/') + ' | ' + extra + ' | ' + BT + (e.path || e.doc || '') + BT + ' |');
  }
  md.push('');
}
fs.writeFileSync(path.join(OUT, 'INDEX.md'), md.join('\n'), 'utf8');

// ------------------------------------------------------------- assets index
const KIND = [
  [/\.(woff2?|ttf|otf)$/i, 'font'],
  [/\.(glb|gltf|bin)$/i, 'model'],
  [/\.(mp3|wav|flac|m4a|ogg|aiff?)$/i, 'audio'],
  [/\.(mp4|webm|mov|mkv)$/i, 'video'],
  [/\.(png|jpe?g|webp|gif|avif)$/i, 'image'],
  [/\.(hdr|exr)$/i, 'environment'],
];
const kindOf = (p) => (KIND.find((k) => k[0].test(p)) || [null, 'other'])[1];
const assets = [];
for (const f of walk(path.join(ROOT, 'engines'), () => true)) {
  const kind = kindOf(f);
  if (kind === 'other') continue;
  const size = fs.statSync(f).size;
  if (size < 32 * 1024) continue;
  assets.push({ kind, bytes: size, path: rel(f) });
}
assets.sort((a, b) => b.bytes - a.bytes);
const bytesByKind = {};
for (const a of assets) bytesByKind[a.kind] = (bytesByKind[a.kind] || 0) + a.bytes;
fs.writeFileSync(path.join(OUT, 'assets-index.json'), JSON.stringify({
  schemaVersion: 1,
  note: '全量素材清单（≥32KB 的字体/模型/音频/视频/图片/HDR）。素材随仓库分发；逐引擎许可见 LICENSES.md。',
  totals: { files: assets.length, bytes: assets.reduce((s, a) => s + a.bytes, 0), bytesByKind },
  assets,
}), 'utf8');

console.log('[build-catalog] entries=' + entries.length + ' bySource=' + JSON.stringify(bySource));
console.log('[build-catalog] byCollection=' + JSON.stringify(byCollection));
console.log('[build-catalog] assets=' + assets.length + ' bytesByKind=' + JSON.stringify(bytesByKind));
