#!/usr/bin/env node
// 生成“全部本地素材”数据（供 wise 目录页的全量面板使用）
// node scripts/build-all-local.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const idx = JSON.parse(fs.readFileSync(path.join(ROOT, 'catalog/index.json'), 'utf8'));
const LABELS = {
  'motion-entry': '动效条目', 'shot-card': '镜头卡', 'animation-case': '源码动画案例',
  'style': '风格族', 'mg-style': 'MG 风格', 'move': '动效函数', 'scene-starter': '场景起点',
  'source-component': '源码组件', 'object-model': '物件模型', 'image-template': '出图模板',
  'research-source': '研究清单', 'design-school': '网页设计学校', 'production-engine': '制作系统', 'tool': '工具',
};
const entries = idx.entries.map((e) => ({
  id: e.id, c: e.collection, cn: LABELS[e.collection] || e.collection,
  eng: e.engine, t: e.title || e.id, sub: e.category || e.titleZh || '', p: e.path || '',
}));
const out = 'window.__ALL_LOCAL__ = ' + JSON.stringify({ total: entries.length, entries }) + ';\n';
fs.writeFileSync(path.join(ROOT, 'engines/wise-motion/catalog/all-local-data.js'), out, 'utf8');
console.log('[all-local] entries=' + entries.length + ' bytes=' + out.length);
