#!/usr/bin/env node
// Unified retrieval across all five engines' catalogs.
// node scripts/find.mjs "<需求>" [--source X] [--collection Y] [--limit N] [--json] [--stats]
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
  argv.splice(i, v && !v.startsWith('--') ? 2 : 1);
  return v && !v.startsWith('--') ? v : true;
}
const asJson = !!takeFlag('--json', false);
const stats = !!takeFlag('--stats', false);
const source = takeFlag('--source', null);
const collection = takeFlag('--collection', null);
const limit = Number(takeFlag('--limit', 10)) || 10;
const query = argv.join(' ').trim();

if (!fs.existsSync(INDEX)) {
  console.error('catalog/index.json 不存在，先跑: node scripts/build-catalog.mjs');
  process.exit(2);
}
const data = JSON.parse(fs.readFileSync(INDEX, 'utf8'));
const entries = data.entries || [];

if (stats || !query) {
  console.log('总条目 ' + entries.length);
  for (const k of Object.keys(data.totals.bySource).sort()) console.log('  ' + k.padEnd(16) + data.totals.bySource[k]);
  console.log('-- 集合 --');
  for (const k of Object.keys(data.totals.byCollection).sort()) console.log('  ' + k.padEnd(20) + data.totals.byCollection[k]);
  if (!query && !stats) console.log('\n用法: node scripts/find.mjs "<需求，中英文均可>" [--source ...] [--collection ...] [--limit N] [--json]');
  process.exit(0);
}

const norm = (s) => String(s == null ? '' : s).toLowerCase();
const tokens = query.split(/[\s,，、\/;；]+/).map((t) => t.trim()).filter(Boolean);
if (!tokens.length) tokens.push(query);

const scored = [];
for (const e of entries) {
  if (source && e.source !== source) continue;
  if (collection && e.collection !== collection) continue;
  const id = norm(e.id);
  const title = norm(e.title) + ' ' + norm(e.titleZh);
  const cat = norm(e.category) + ' ' + norm((e.tags || []).join(' ')) + ' ' + norm(e.kind);
  const sum = norm(e.summary);
  const use = norm(e.use);
  let score = 0;
  let hits = 0;
  for (const t of tokens) {
    const q = t.toLowerCase();
    let s = 0;
    if (id === q) s += 120;
    else if (id.includes(q)) s += 45;
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
  console.log(JSON.stringify({ query, tokens, total: scored.length, results: top.map((x) => Object.assign({ score: x.score }, x.e)) }, null, 2));
  process.exit(0);
}

if (!top.length) {
  console.log('没有命中: ' + query);
  console.log('换个说法，或用 --source / --collection 放宽；先看目录: node scripts/find.mjs --stats');
  process.exit(1);
}
console.log('查询 "' + query + '" → 命中 ' + scored.length + ' 条，显示前 ' + top.length + ' 条\n');
for (const { e, score } of top) {
  const meta = [e.source, e.collection, e.category || e.kind || ''].filter(Boolean).join(' · ');
  const line1 = e.title && norm(e.title) !== norm(e.id) ? e.id + ' — ' + String(e.title).slice(0, 90) : e.id;
  console.log('[' + String(score).padStart(4) + '] ' + line1);
  console.log('       ' + meta);
  const detail = [];
  if (e.duration) detail.push('时长 ' + e.duration);
  if (e.energy) detail.push('能量 ' + e.energy);
  if (e.durationMs) detail.push(e.durationMs + 'ms');
  if (e.loop) detail.push('循环');
  if (detail.length) console.log('       ' + detail.join(' · '));
  if (e.summary) console.log('       ' + String(e.summary).replace(/\s+/g, ' ').slice(0, 160));
  if (e.doc) console.log('       文档 ' + e.doc);
  if (e.path) console.log('       源码 ' + e.path);
  if (e.use) console.log('       用法 ' + e.use);
  console.log('');
}
