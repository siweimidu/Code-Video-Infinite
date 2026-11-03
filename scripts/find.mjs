#!/usr/bin/env node
// 跨引擎检索（分面：形态 / 引擎 / 集合）
// node scripts/find.mjs "<关键词>" [--medium M1-video] [--engine shotcraft] [--collection shot-card] [--limit N] [--json] [--stats]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const INDEX = path.join(ROOT, 'catalog/index.json');
const argv = process.argv.slice(2);

function takeFlag(name, def) {
  const i = argv.indexOf(name);
  if (i === -1) return def;
  const v = argv[i + 1];
  if (v && !v.startsWith('--')) { argv.splice(i, 2); return v; }
  argv.splice(i, 1);
  return true;
}
const asJson = !!takeFlag('--json', false);
const stats = !!takeFlag('--stats', false);
const medium = takeFlag('--medium', null);
const engine = takeFlag('--engine', null) || takeFlag('--source', null);
const collection = takeFlag('--collection', null);
const limit = Number(takeFlag('--limit', 10)) || 10;
const query = argv.join(' ').trim();

if (!fs.existsSync(INDEX)) {
  console.error('catalog/index.json 不存在，先跑: node scripts/build-catalog.mjs');
  process.exit(2);
}
const data = JSON.parse(fs.readFileSync(INDEX, 'utf8'));
const entries = (data.entries || []).slice();
// 把统一风格族也接进检索（族名/情绪/实现都能命中）
const STY = path.join(ROOT, 'catalog/styles.json');
if (fs.existsSync(STY)) {
  const sty = JSON.parse(fs.readFileSync(STY, 'utf8'));
  for (const fam of sty.families || []) {
    entries.push({
      engine: 'styles', medium: 'M1-video', collection: 'style-family', id: fam.id,
      title: fam.name, category: fam.category,
      summary: '风格族 · ' + (fam.mood || []).join('/') + ' · 实现 ' + fam.implementations.map((i) => i.library + ':' + i.id).join(' , '),
      tags: (fam.mood || []).concat(fam.implementations.map((i) => i.library + ':' + i.id)),
      path: (fam.implementations[0] || {}).path || '',
      use: 'node scripts/pick.mjs "<需求>" 会把它排进三个方向；实现看 path',
    });
  }
}

if (stats || !query) {
  console.log('总条目 ' + entries.length);
  console.log('-- 形态 --');
  for (const k of Object.keys(data.totals.byMedium).sort()) console.log('  ' + k.padEnd(18) + data.totals.byMedium[k]);
  console.log('-- 引擎 --');
  for (const k of Object.keys(data.totals.byEngine).sort()) console.log('  ' + k.padEnd(24) + data.totals.byEngine[k]);
  console.log('-- 集合 --');
  for (const k of Object.keys(data.totals.byCollection).sort()) console.log('  ' + k.padEnd(20) + data.totals.byCollection[k]);
  if (!query && !stats) console.log('\n用法: node scripts/find.mjs "<关键词>" [--medium ...] [--engine ...] [--collection ...]');
  process.exit(0);
}

const norm = (s) => String(s == null ? '' : s).toLowerCase();
const tokens = query.split(/[\s,，、\/;；]+/).map((t) => t.trim()).filter(Boolean);
if (!tokens.length) tokens.push(query);

const scored = [];
for (const e of entries) {
  if (medium && e.medium !== medium) continue;
  if (engine && e.engine !== engine) continue;
  if (collection && e.collection !== collection) continue;
  const id = norm(e.id);
  const title = norm(e.title) + ' ' + norm(e.titleZh);
  const cat = norm(e.category) + ' ' + norm((e.tags || []).join(' ')) + ' ' + norm(e.kind);
  const sum = norm(e.summary);
  const use = norm(e.use);
  let score = 0, hits = 0;
  for (const t of tokens) {
    const q = t.toLowerCase();
    let s = 0;
    if (id === q) s += 120; else if (id.includes(q)) s += 45;
    if (title.includes(q)) s += 30;
    if (cat.includes(q)) s += 18;
    if (sum.includes(q)) s += 8;
    if (use.includes(q)) s += 4;
    if (s > 0) hits += 1;
    score += s;
  }
  if (hits === 0) continue;
  score += hits * 5 - (tokens.length - hits) * 6;
  scored.push({ e, score });
}
scored.sort((a, b) => b.score - a.score || String(a.e.id).localeCompare(String(b.e.id)));
const top = scored.slice(0, limit);

if (asJson) {
  console.log(JSON.stringify({ query, tokens, facets: { medium, engine, collection }, total: scored.length, results: top.map((x) => Object.assign({ score: x.score }, x.e)) }, null, 2));
  process.exit(0);
}
if (!top.length) {
  console.log('没有命中: ' + query);
  console.log('换个说法，或用 --medium / --engine / --collection 放宽；先看目录: node scripts/find.mjs --stats');
  process.exit(1);
}
console.log('查询 "' + query + '" → 命中 ' + scored.length + ' 条，显示前 ' + top.length + ' 条\n');
for (const r of top) {
  const e = r.e;
  const meta = [e.engine, e.medium, e.collection, e.category || e.kind || ''].filter(Boolean).join(' · ');
  const line1 = e.title && norm(e.title) !== norm(e.id) ? e.id + ' — ' + String(e.title).slice(0, 90) : e.id;
  console.log('[' + String(r.score).padStart(4) + '] ' + line1);
  console.log('       ' + meta);
  const detail = [];
  if (e.duration) detail.push('时长 ' + e.duration);
  if (e.energy) detail.push('能量 ' + e.energy);
  if (e.durationMs) detail.push(e.durationMs + 'ms');
  if (e.loop) detail.push('循环');
  if (detail.length) console.log('       ' + detail.join(' · '));
  if (e.summary) console.log('       ' + String(e.summary).replace(/\s+/g, ' ').slice(0, 160));
  if (e.doc) console.log('       文档 ' + e.doc);
  if (e.path) console.log('       入口 ' + e.path);
  if (e.use) console.log('       用法 ' + e.use);
  console.log('');
}
