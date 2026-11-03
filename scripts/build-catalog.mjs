#!/usr/bin/env node
// Builds the unified taxonomy: catalog/index.json + catalog/styles.json + catalog/INDEX.md + catalog/assets-index.json
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

const MEDIUMS = {
  'M1-video': { label: '视频成片（MP4 + 可渲染源码）', engines: ['onetake', 'shotcraft', 'mg-motion', 'motion-showreel', 'claude-motion'] },
  'M2-web-video': { label: '网页视频演示（点击驱动 16:9，可录屏）', engines: ['web-video-presentation'] },
  'M3-web-artifact': { label: '网页/UI 制品（页面·仪表盘·原型·deck·数据可视化）', engines: ['web-design-engineer'] },
  'M4-article': { label: '长文文章（单文件 HTML，离线可分享）', engines: ['beautiful-article'] },
  'M5-image': { label: '静态图（海报·信息图·产品图·分镜·UI mockup）', engines: ['gpt-image-2'] },
  'M6-motion-source': { label: '动效素材（单动作/转场的真实源码）', engines: ['wise-motion'] },
  'M7-retrieval': { label: '知识库检索（本地目录答问，带出处）', engines: ['kb-retriever'] },
  'M8-shot': { label: '镜头配方（单镜头编排与实现）', engines: ['shotcraft'] },
};

const ENGINE_META = {
  onetake: { family: 'video', medium: 'M1-video', runtime: 'Python + Chrome 逐帧', length: '10–30s（配音演示 ~60s）' },
  shotcraft: { family: 'video', medium: 'M1-video', runtime: 'Remotion / Node', length: '30s–3min 多镜头' },
  'mg-motion': { family: 'video', medium: 'M1-video', runtime: 'Chrome 逐帧 + ffmpeg', length: '5–30s' },
  'motion-showreel': { family: 'video', medium: 'M1-video', runtime: 'Node + 浏览器逐帧', length: '10s–20min（分章节）' },
  'claude-motion': { family: 'video', medium: 'M1-video', runtime: 'Node >=22 + Playwright', length: '10–30s' },
  'web-video-presentation': { family: 'web', medium: 'M2-web-video', runtime: 'HTML + 浏览器', length: '逐点击推进' },
  'web-design-engineer': { family: 'web', medium: 'M3-web-artifact', runtime: 'HTML/CSS/JS/React', length: '单页制品' },
  'beautiful-article': { family: 'web', medium: 'M4-article', runtime: 'reacticle 单文件', length: '长文' },
  'gpt-image-2': { family: 'image', medium: 'M5-image', runtime: '三模式（本地/宿主/顾问）', length: '单图或系列' },
  'wise-motion': { family: 'source', medium: 'M6-motion-source', runtime: '只导出源码', length: '单动作' },
  'kb-retriever': { family: 'retrieval', medium: 'M7-retrieval', runtime: 'grep / pdfplumber / pandas', length: '按需' },
};

const FAMILIES = [
  { id: 'art-deco', name: '装饰艺术', cat: '图形与排版', mood: ['庄重', '精致'], members: [['motion-showreel', 'art-deco'], ['claude-motion', 'art-deco']] },
  { id: 'blueprint', name: '蓝图 / 工程制图', cat: '图形与排版', mood: ['精确', '理性'], members: [['motion-showreel', 'blueprint'], ['claude-motion', 'blueprint']] },
  { id: 'anchor-hud', name: '全息 / 赛博 HUD', cat: '界面与屏幕', mood: ['冷静', '未来感'], members: [['motion-showreel', 'hologram-hud'], ['claude-motion', 'hologram-hud'], ['mg-motion', 'style-22']] },
  { id: 'one-line', name: '一笔线描', cat: '图形与排版', mood: ['简洁', '轻巧'], members: [['motion-showreel', 'one-line'], ['claude-motion', 'one-line'], ['mg-motion', 'style-02']] },
  { id: 'flat-vector', name: '扁平矢量', cat: '图形与排版', mood: ['清晰', '亲和'], members: [['motion-showreel', 'flat-vector'], ['claude-motion', 'pictogram-motion'], ['mg-motion', 'style-01']] },
  { id: 'swiss-grid', name: '瑞士网格 / 包豪斯', cat: '图形与排版', mood: ['理性', '克制'], members: [['motion-showreel', 'swiss-editorial'], ['claude-motion', 'swiss-motion'], ['mg-motion', 'style-09']] },
  { id: 'kinetic-type', name: '巨字 / 动态排版', cat: '图形与排版', mood: ['冲击', '躁动'], members: [['motion-showreel', 'kinetic-brutalist'], ['motion-showreel', 'cinematic-title'], ['claude-motion', 'spy-titles'], ['claude-motion', 'silent-film']] },
  { id: 'print-ink', name: '孔版 / 丝网 / 半调印刷', cat: '印刷与版画', mood: ['温暖', '手作'], members: [['motion-showreel', 'risograph-print'], ['claude-motion', 'risograph'], ['claude-motion', 'silkscreen-poster'], ['claude-motion', 'halftone-dossier']] },
  { id: 'engraving', name: '铜版 / 木刻', cat: '印刷与版画', mood: ['精细', '沉静'], members: [['motion-showreel', 'copperplate-engraving'], ['claude-motion', 'engraving'], ['claude-motion', 'woodcut']] },
  { id: 'collage', name: '拼贴 / 剪贴', cat: '手作', mood: ['活泼', '潮流'], members: [['motion-showreel', 'editorial-collage'], ['motion-showreel', 'mixed-media-era'], ['mg-motion', 'style-06']] },
  { id: 'paper', name: '纸艺（剪纸/立体书/纸灯）', cat: '手作', mood: ['温暖', '精巧'], members: [['motion-showreel', 'paper-cut'], ['claude-motion', 'paper-cutout'], ['claude-motion', 'paper-popup'], ['claude-motion', 'paper-lantern'], ['claude-motion', 'papercut-red']] },
  { id: 'crayon', name: '蜡笔 / 儿童绘本', cat: '手作', mood: ['童趣', '温暖'], members: [['motion-showreel', 'crayon-storybook'], ['claude-motion', 'crayon-book'], ['claude-motion', 'urban-sketch']] },
  { id: 'painting', name: '绘画（厚涂/水彩/速写）', cat: '插画与绘画', mood: ['浓烈', '怀旧'], members: [['motion-showreel', 'painterly'], ['motion-showreel', 'soft-organic'], ['claude-motion', 'impasto'], ['claude-motion', 'watercolor']] },
  { id: 'ink-wash', name: '水墨 / 东方', cat: '东方传统', mood: ['意境', '沉静'], members: [['motion-showreel', 'ink-wash'], ['claude-motion', 'ink-wash'], ['motion-showreel', 'guochao']] },
  { id: 'ukiyo-e', name: '浮世绘', cat: '东方传统', mood: ['平和', '有力'], members: [['motion-showreel', 'ukiyo-e'], ['claude-motion', 'ukiyoe']] },
  { id: 'illuminated', name: '泥金手抄本', cat: '东方传统', mood: ['珍重', '静谧'], members: [['motion-showreel', 'illuminated-manuscript']] },
  { id: 'shadow-puppet', name: '皮影 / 剪影戏', cat: '东方传统', mood: ['温暖', '戏剧感'], members: [['motion-showreel', 'shadow-puppet'], ['claude-motion', 'shadow-puppet']] },
  { id: 'stained-glass', name: '彩绘玻璃', cat: '3D 与材质', mood: ['通透', '静谧'], members: [['motion-showreel', 'stained-glass'], ['claude-motion', 'stained-glass']] },
  { id: 'glass-material', name: '玻璃 / 弥散渐变', cat: '3D 与材质', mood: ['高级', '精密'], members: [['motion-showreel', 'glass-material'], ['claude-motion', 'glass-product'], ['mg-motion', 'style-12']] },
  { id: 'toy-3d', name: '3D 渲染 / 玩具 / 积木', cat: '3D 与材质', mood: ['亲和', '愉快'], members: [['motion-showreel', 'soft-3d-toy'], ['claude-motion', 'brick-toy'], ['claude-motion', 'lowpoly-island'], ['mg-motion', 'style-04']] },
  { id: 'tilt-shift', name: '移轴微缩', cat: '3D 与材质', mood: ['精巧', '专注'], members: [['motion-showreel', 'tilt-shift-miniature'], ['claude-motion', 'tilt-shift']] },
  { id: 'liquid', name: '液态流动', cat: '生成与抽象', mood: ['迷幻', '流动'], members: [['motion-showreel', 'liquid-shader'], ['mg-motion', 'style-07']] },
  { id: 'morph', name: '形变 / 概念变形', cat: '生成与抽象', mood: ['清楚', '专注'], members: [['motion-showreel', 'concept-morph'], ['mg-motion', 'style-08']] },
  { id: 'generative', name: '生成几何 / 粒子场', cat: '生成与抽象', mood: ['催眠', '宏大'], members: [['motion-showreel', 'generative-geometry'], ['motion-showreel', 'particle-field']] },
  { id: 'iso', name: '等轴 2.5D', cat: '界面与产品', mood: ['清晰', '俏皮'], members: [['motion-showreel', 'isometric-infographic'], ['claude-motion', 'iso-infographic'], ['mg-motion', 'style-03']] },
  { id: 'data-motion', name: '数据叙事', cat: '界面与产品', mood: ['可信', '利落'], members: [['motion-showreel', 'data-motion'], ['claude-motion', 'dataviz']] },
  { id: 'minimal-ui', name: '产品 UI / 极简界面', cat: '界面与产品', mood: ['精致', '友好'], members: [['motion-showreel', 'minimal-ui'], ['claude-motion', 'living-screencast']] },
  { id: 'keynote', name: '暗色发布会', cat: '界面与产品', mood: ['隆重', '高级'], members: [['motion-showreel', 'dark-keynote'], ['claude-motion', 'dark-keynote']] },
  { id: 'retro-screen', name: '复古屏幕（CRT/VHS/ASCII）', cat: '复古与屏幕', mood: ['怀旧', '诡异'], members: [['motion-showreel', 'crt-vhs'], ['motion-showreel', 'terminal-ascii'], ['claude-motion', 'ascii-crt'], ['claude-motion', 'backrooms']] },
  { id: 'glitch', name: '故障艺术', cat: '复古与屏幕', mood: ['叛逆', '紧张'], members: [['motion-showreel', 'glitch-digital']] },
  { id: 'pixel', name: '像素 / 复古游戏', cat: '复古与屏幕', mood: ['怀旧', '可爱'], members: [['motion-showreel', 'pixel-game'], ['motion-showreel', 'pixel-diorama'], ['claude-motion', 'pixel-art'], ['claude-motion', 'pixel-rpg'], ['claude-motion', 'microgame'], ['mg-motion', 'style-20']] },
  { id: 'synthwave', name: 'Synthwave / 复古未来', cat: '复古与屏幕', mood: ['热烈', '复古未来'], members: [['motion-showreel', 'synthwave-neon'], ['mg-motion', 'style-10']] },
  { id: 'toon', name: '卡通 / 赛璐璐', cat: '插画与漫画', mood: ['热血', '幽默'], members: [['motion-showreel', 'comic-pop'], ['motion-showreel', 'cel-anime-80s'], ['claude-motion', 'cel-anime-80s'], ['claude-motion', 'anime-cel'], ['claude-motion', 'scifi-toon'], ['claude-motion', 'midcentury-toon']] },
  { id: 'rubber-hose', name: '橡皮管动画', cat: '插画与漫画', mood: ['诙谐', '活泼'], members: [['motion-showreel', 'rubber-hose'], ['claude-motion', 'rubber-hose']] },
  { id: 'whiteboard', name: '白板讲解', cat: '讲解与科普', mood: ['亲近', '清晰'], members: [['motion-showreel', 'whiteboard-explainer'], ['claude-motion', 'whiteboard'], ['mg-motion', 'style-19']] },
  { id: 'variety', name: '综艺花字', cat: '讲解与科普', mood: ['热闹'], members: [['mg-motion', 'style-18']] },
  { id: 'game-show', name: '综艺节奏 / 游戏化', cat: '讲解与科普', mood: ['快节奏'], members: [['claude-motion', 'game-show']] },
  { id: 'hd2d', name: 'HD-2D 像素立体', cat: '复古与屏幕', mood: ['怀旧', '沉浸'], members: [['claude-motion', 'hd-2d']] },
];

function walk(dir, filter, acc) {
  acc = acc || [];
  if (!exists(dir)) return acc;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
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
function mdTableRows(file) {
  if (!exists(file)) return [];
  const rows = [];
  let group = '';
  for (const line of readText(file).split(/\r?\n/)) {
    const s = line.trim();
    if (!s.startsWith('|')) continue;
    const cells = s.replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
    if (cells.length < 3) continue;
    const fileCell = cells.find((c) => c.includes('.md'));
    if (!fileCell) continue;
    const slug = fileCell.split('.').join('').split(BT).join('').trim();
    if (!slug || slug.startsWith('_')) continue;
    if (cells[0].replace(/\*/g, '').trim()) group = cells[0].replace(/\*/g, '').trim();
    rows.push({ slug, group, cells });
  }
  return rows;
}

const entries = [];
const push = (e) => entries.push(e);

const shotRoot = path.join(ROOT, 'engines/shotcraft/references/shots');
for (const file of walk(shotRoot, (p) => p.endsWith('.md'))) {
  const fm = frontmatter(readText(file));
  if (!fm.name) continue;
  push({
    engine: 'shotcraft', medium: 'M8-shot', collection: 'shot-card', id: fm.name,
    title: fm['一句话'] || fm.name, category: path.basename(path.dirname(file)),
    summary: fm['适用'] || '', duration: fm['时长'] || '', energy: fm['能量'] || '',
    path: rel(file), use: '读卡全文，再按“参考实现”定位 demos/ 源码，copy 进工程改参数',
  });
}

const wiseReg = path.join(ROOT, 'engines/wise-motion/catalog/registry.json');
if (exists(wiseReg)) {
  const reg = readJson(wiseReg);
  const catName = new Map();
  for (const c of reg.categories || []) catName.set(c.id || c.slug || c.name, c.name || c.id);
  for (const e of reg.effects || []) {
    const docPath = path.join(ROOT, 'engines/wise-motion/references/effects', e.id + '.md');
    push({
      engine: 'wise-motion', medium: 'M6-motion-source', collection: 'motion-entry', id: e.id,
      title: e.name || e.id, category: catName.get(e.category) || e.category || '', kind: e.kind || '',
      summary: e.summary || '', tags: e.aliases || [], behaviors: e.behaviors || [],
      durationMs: typeof e.duration_ms === 'number' ? e.duration_ms : null, loop: !!e.loop,
      sourcePath: (e.source && e.source.path) || '', license: (e.source && e.source.license) || '',
      doc: exists(docPath) ? rel(docPath) : '',
      use: 'node engines/wise-motion/scripts/show.mjs ' + e.id + ' → export.mjs 导出源码',
    });
  }
}

const cm = path.join(ROOT, 'engines/claude-motion/references');
const claudeStyles = new Map();
function cmAdd(file, mapper) {
  const p = path.join(cm, file);
  if (!exists(p)) return;
  const d = readJson(p);
  const list = d.cases || d.engines || d.scenes || d.models || d.extensions || [];
  for (const item of list) push(mapper(item));
}
cmAdd('case-catalog.json', (c) => {
  const st = c.style || {};
  if (st.slug) claudeStyles.set(st.slug, { zh: st.zh, en: st.en, category: st.category });
  return {
    engine: 'claude-motion', medium: 'M1-video', collection: 'animation-case', id: c.id,
    title: c.title || c.id, titleZh: (c.description && c.description.zh) || '',
    category: st.zh || st.slug || '', styleId: st.slug || '',
    summary: (c.description && (c.description.zh || c.description.en)) || '',
    tags: [st.slug, st.en, st.category].filter(Boolean),
    path: c.paths && c.paths.entry ? 'engines/claude-motion/' + c.paths.entry : '',
    license: (c.source && c.source.license) || '', upstream: (c.source && c.source.url) || '',
    use: 'node engines/claude-motion/scripts/prepare-case.mjs --case ' + c.id + ' --out <作品目录>',
  };
});
cmAdd('engine-catalog.json', (e) => ({
  engine: 'claude-motion', medium: 'M1-video', collection: 'production-engine', id: e.id,
  title: e.title || e.id, tags: e.tags || [], summary: e.status || '',
  path: e.template ? 'engines/claude-motion/' + e.template : '',
  use: 'node engines/claude-motion/scripts/create-engine.mjs --engine ' + e.id + ' --out <新目录>',
}));
cmAdd('scene-catalog.json', (s) => ({
  engine: 'claude-motion', medium: 'M1-video', collection: 'scene-starter', id: s.id,
  title: s.title || s.id, kind: s.kind || '', tags: s.tags || [], summary: s.retained || '',
  path: s.path ? 'engines/claude-motion/' + s.path : '', license: s.license || '', upstream: s.source || '',
  use: 'node engines/claude-motion/scripts/create-scene.mjs --scene ' + s.id + ' --out <新目录>',
}));
cmAdd('model-catalog.json', (m) => ({
  engine: 'claude-motion', medium: 'M1-video', collection: 'object-model', id: m.id,
  title: m.title || m.id, kind: m.kind || '',
  summary: typeof m.modelOrigin === 'string' ? m.modelOrigin : '', upstream: m.source || '',
  license: Array.isArray(m.license) ? m.license.map((l) => l.license).join(', ') : (m.license || ''),
  use: 'node engines/claude-motion/scripts/create-model.mjs --model ' + m.id + ' --out <新目录>',
}));
cmAdd('extension-catalog.json', (e) => ({
  engine: 'claude-motion', medium: 'M1-video', collection: 'source-component', id: e.id,
  title: e.title || e.id, tags: e.tags || [], summary: e.status || '',
  path: e.template ? 'engines/claude-motion/' + e.template : '',
  use: 'node engines/claude-motion/scripts/create-extension.mjs --extension ' + e.id + ' --out <新目录>',
}));
const cmSrc = path.join(cm, 'source-index.json');
if (exists(cmSrc)) {
  for (const s of readJson(cmSrc).sources || []) {
    push({
      engine: 'claude-motion', medium: 'M1-video', collection: 'research-source', id: s.repo,
      title: s.repo, category: s.style || '', kind: s.kind || '', summary: s.reuse || '',
      tags: [s.style, s.kind].filter(Boolean), upstream: s.url || '', license: s.license || '',
      use: '只读研究清单：已收录但未接成可调用案例',
    });
  }
}

const mgStyles = path.join(ROOT, 'engines/mg-motion/references/styles.md');
const mgStyleList = [];
if (exists(mgStyles)) {
  const lines = readText(mgStyles).split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^##\s+(\d{2})\s*·\s*(.+)$/);
    if (!m) continue;
    const body = [];
    for (let k = i + 1; k < lines.length && !/^##\s/.test(lines[k]); k++) if (lines[k].trim()) body.push(lines[k].trim());
    const id = 'style-' + m[1];
    mgStyleList.push({ id, title: m[2].trim() });
    push({
      engine: 'mg-motion', medium: 'M1-video', collection: 'mg-style', id,
      title: m[2].trim(), category: 'MG 风格', summary: body.slice(0, 2).join(' ').slice(0, 240),
      path: 'engines/mg-motion/references/styles.md',
      use: '按签名技法写 renderAt(t)；混搭读 engines/mg-motion/references/blending.md',
    });
  }
}

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
      engine: 'onetake', medium: 'M1-video', collection: 'move', id: name, title: name,
      category: section, summary: (cells[3] || '').trim(),
      path: 'engines/onetake/references/motion-library.md',
      use: 'window.OM.' + name + '(t, t0, ...) 纯时间函数；曲线按 t80 选',
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
      engine: 'onetake', medium: 'M1-video', collection: 'look', id: name, title: name,
      category: 'look', summary: v.about || v.note || '', path: 'engines/onetake/looks/looks.json',
      use: 'python engines/onetake/scripts/look.py apply <name> → look.js',
    });
  }
}

// ------------------------------------------------------- garden-skills
const GARDEN = path.join(ROOT, 'engines/garden-skills/skills');
const TOOL_MEDIUM = {
  'motion-showreel': 'M1-video', 'web-video-presentation': 'M2-web-video',
  'web-design-engineer': 'M3-web-artifact', 'beautiful-article': 'M4-article',
  'gpt-image-2': 'M5-image', 'kb-retriever': 'M7-retrieval',
};
if (exists(GARDEN)) {
  for (const dir of fs.readdirSync(GARDEN, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    const name = dir.name;
    const base = path.join(GARDEN, name);
    const man = exists(path.join(base, 'manifest.json')) ? readJson(path.join(base, 'manifest.json')) : {};
    const skillFile = exists(path.join(base, 'SKILL.md')) ? readText(path.join(base, 'SKILL.md')) : '';
    const fm = frontmatter(skillFile);
    const desc = String(fm.description || man.description || '').replace(/^["']|["']$/g, '');
    push({
      engine: 'garden-skills', medium: TOOL_MEDIUM[name] || 'M1-video', collection: 'tool', id: name,
      title: man.category || name, category: man.category || '',
      summary: desc.slice(0, 400), tags: (man.compat || []).slice(0, 4),
      path: rel(path.join(base, 'SKILL.md')),
      use: '读该引擎内的分工指南：' + rel(path.join(base, 'SKILL.md')),
    });
  }
}

const showreelStyles = [];
if (exists(GARDEN)) {
  for (const r of mdTableRows(path.join(GARDEN, 'motion-showreel/references/styles/INDEX.md'))) {
    showreelStyles.push({ slug: r.slug, group: r.group, one: r.cells[2] || '', tech: r.cells[3] || '', mood: r.cells[r.cells.length - 1] || '' });
    push({
      engine: 'motion-showreel', medium: 'M1-video', collection: 'style', id: r.slug, title: r.slug,
      category: r.group, summary: r.cells[2] || '',
      tags: [r.group, r.cells[r.cells.length - 1], r.cells[3]].filter(Boolean),
      path: rel(path.join(GARDEN, 'motion-showreel/references/styles', r.slug + '.md')),
      use: '读该风格文件（本质/辨识信号/运动/声音/坑），只读选中的 1–2 个',
    });
  }
}
for (const [slug, st] of claudeStyles) {
  push({
    engine: 'claude-motion', medium: 'M1-video', collection: 'style', id: 'claude:' + slug,
    title: st.zh || slug, category: st.cat || '', summary: st.en || '',
    tags: [slug, st.en, st.cat].filter(Boolean), path: 'engines/claude-motion/references/case-catalog.json',
    use: 'node scripts/find.mjs "<风格>" --collection animation-case 找源码案例',
  });
}
for (const s of mgStyleList) {
  push({
    engine: 'mg-motion', medium: 'M1-video', collection: 'style', id: 'mg:' + s.id, title: s.title,
    category: 'MG 签名技法', summary: '', tags: ['MG'], path: 'engines/mg-motion/references/styles.md',
    use: '写 renderAt(t) 时按该节技法实现',
  });
}
const webSchools = [];
{
  const f = path.join(GARDEN, 'web-design-engineer/SKILL.md');
  if (exists(f)) {
    let on = false;
    for (const line of readText(f).split(/\r?\n/)) {
      if (/School library/i.test(line)) { on = true; continue; }
      if (!on) continue;
      if (/^##\s/.test(line)) break;
      const s = line.trim();
      if (!s.startsWith('|')) continue;
      const cells = s.replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.replace(/\*\*/g, '').trim());
      if (cells.length < 4 || /^-+$/.test(cells[0]) || /^School$/i.test(cells[0])) continue;
      webSchools.push({ id: cells[0], vibe: cells[1], anchors: cells[2], bestFor: cells[3] });
    }
  }
  for (const sc of webSchools) {
    push({
      engine: 'web-design-engineer', medium: 'M3-web-artifact', collection: 'design-school',
      id: sc.id, title: sc.id, category: '网页设计学校', summary: sc.vibe,
      tags: [sc.bestFor, sc.anchors].filter(Boolean).map((x) => String(x).slice(0, 80)),
      path: 'engines/garden-skills/skills/web-design-engineer/SKILL.md',
      use: '按 Design Read 五档标尺给 3 个不同行的方向，再定设计系统',
    });
  }
}
const imageCats = [];
{
  const refs = path.join(GARDEN, 'gpt-image-2/references');
  if (exists(refs)) {
    for (const d of fs.readdirSync(refs, { withFileTypes: true })) {
      if (!d.isDirectory()) continue;
      const files = walk(path.join(refs, d.name), (p) => p.endsWith('.md'));
      imageCats.push({ id: d.name, templates: files.length });
      push({
        engine: 'gpt-image-2', medium: 'M5-image', collection: 'image-template', id: d.name,
        title: d.name, category: '出图模板类', summary: files.length + ' 个模板',
        tags: ['gpt-image-2', d.name],
        path: 'engines/garden-skills/skills/gpt-image-2/references/' + d.name,
        use: '先读 prompt-writing.md，再挑该类模板；Mode 由 check-mode.js 决定',
      });
    }
  }
}

entries.sort((a, b) => (a.collection + a.id).localeCompare(b.collection + b.id));
const byCollection = {}, byMedium = {}, byEngine = {};
for (const e of entries) {
  byCollection[e.collection] = (byCollection[e.collection] || 0) + 1;
  byMedium[e.medium] = (byMedium[e.medium] || 0) + 1;
  byEngine[e.engine] = (byEngine[e.engine] || 0) + 1;
}

const famIndex = new Map();
const families = [];
for (const f of FAMILIES) {
  const rec = { id: f.id, name: f.name, category: f.cat || '', mood: f.mood || [], implementations: [], libraries: [] };
  for (const pair of f.members) {
    const lib = pair[0], mid = pair[1];
    const impl = { library: lib, id: mid };
    if (lib === 'motion-showreel') impl.path = 'engines/garden-skills/skills/motion-showreel/references/styles/' + mid + '.md';
    else if (lib === 'claude-motion') {
      impl.path = 'engines/claude-motion/references/case-catalog.json';
      const st = claudeStyles.get(mid);
      impl.note = st ? (st.zh || mid) : mid;
    } else if (lib === 'mg-motion') {
      impl.path = 'engines/mg-motion/references/styles.md';
      const m = mgStyleList.find((x) => x.id === mid);
      impl.note = m ? m.title : mid;
    }
    rec.implementations.push(impl);
    if (!rec.libraries.includes(lib)) rec.libraries.push(lib);
    famIndex.set(lib + ':' + mid, f.id);
  }
  families.push(rec);
}
for (const r of showreelStyles) {
  if (famIndex.has('motion-showreel:' + r.slug)) continue;
  families.push({
    id: r.slug, name: r.slug, category: r.group, mood: [r.mood].filter(Boolean),
    libraries: ['motion-showreel'],
    implementations: [{ library: 'motion-showreel', id: r.slug, path: 'engines/garden-skills/skills/motion-showreel/references/styles/' + r.slug + '.md', note: r.one }],
  });
}
for (const [slug, st] of claudeStyles) {
  if (famIndex.has('claude-motion:' + slug)) continue;
  families.push({
    id: 'claude:' + slug, name: st.zh || slug, category: st.cat || '', mood: [],
    libraries: ['claude-motion'],
    implementations: [{ library: 'claude-motion', id: slug, path: 'engines/claude-motion/references/case-catalog.json', note: st.en || slug }],
  });
}
for (const s of mgStyleList) {
  if (famIndex.has('mg-motion:' + s.id)) continue;
  families.push({
    id: 'mg:' + s.id, name: s.title, category: 'MG 签名技法', mood: [],
    libraries: ['mg-motion'],
    implementations: [{ library: 'mg-motion', id: s.id, path: 'engines/mg-motion/references/styles.md', note: s.title }],
  });
}
families.sort((a, b) => String(a.category).localeCompare(String(b.category)) || a.id.localeCompare(b.id));

const styles = {
  schemaVersion: 2,
  generatedBy: 'scripts/build-catalog.mjs',
  howToUse: '一个风格族 = 同一套视觉规则在多个库里的实现。先选族，再挑 1-2 个实现。没有族的条目是单库风格，同样可用。',
  axes: [
    { id: 'code-motion-style', label: '代码动效风格族（跨 motion-showreel / claude-motion / mg-motion）', count: families.filter((f) => f.libraries.length > 1).length },
    { id: 'showreel-style', label: 'motion-showreel 风格库', count: showreelStyles.length },
    { id: 'claude-case-style', label: 'claude-motion 案例风格', count: claudeStyles.size },
    { id: 'mg-technique', label: 'mg-motion 签名技法', count: mgStyleList.length },
    { id: 'web-school', label: '网页设计学校', count: webSchools.length },
    { id: 'image-template', label: '出图模板类', count: imageCats.length },
  ],
  totals: { families: families.length, showreel: showreelStyles.length, claude: claudeStyles.size, mg: mgStyleList.length, webSchools: webSchools.length, imageCategories: imageCats.length },
  families,
  singles: {
    showreel: showreelStyles,
    claude: Array.from(claudeStyles.entries()).map((kv) => ({ id: kv[0], zh: kv[1].zh, en: kv[1].en, category: kv[1].category })),
    mg: mgStyleList,
    webSchools,
    imageCategories: imageCats,
  },
};

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'styles.json'), JSON.stringify(styles), 'utf8');
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify({
  schemaVersion: 2,
  generatedBy: 'scripts/build-catalog.mjs',
  totals: { entries: entries.length, byEngine, byMedium, byCollection },
  mediums: MEDIUMS,
  engines: ENGINE_META,
  entries,
}), 'utf8');

const md = [];
md.push('# 统一索引 · Code-Video-Infinite', '');
md.push('由 ' + BT + 'node scripts/build-catalog.mjs' + BT + ' 从各引擎真实目录生成，不要手改。');
md.push('检索：' + BT + 'node scripts/pick.mjs "<一句话需求>"' + BT + ' 出生产计划；' + BT + 'node scripts/find.mjs "<关键词>"' + BT + ' 找素材。', '');
md.push('## 一、交付形态 × 条目数', '', '| 形态 | 说明 | 条目 |', '| --- | --- | --- |');
for (const k of Object.keys(MEDIUMS)) md.push('| ' + BT + k + BT + ' | ' + MEDIUMS[k].label + ' | ' + (byMedium[k] || 0) + ' |');
md.push('', '## 二、引擎 × 条目数', '', '| 引擎 | 条目 |', '| --- | --- |');
for (const k of Object.keys(byEngine).sort()) md.push('| ' + k + ' | ' + byEngine[k] + ' |');
md.push('| **合计** | **' + entries.length + '** |', '');
md.push('## 三、风格族（' + families.length + '）', '', '同一风格在多个库里的实现并列，选 1-2 个用。', '',
  '| 族 | 名称 | 分类 | 情绪 | 实现 |', '| --- | --- | --- | --- | --- |');
for (const f of families) md.push('| ' + BT + f.id + BT + ' | ' + f.name + ' | ' + (f.category || '') + ' | ' + (f.mood || []).join('/') + ' | ' + f.implementations.map((i) => i.library + ':' + i.id).join(' · ') + ' |');
md.push('', '## 四、按集合列条目', '');
const COLL = {
  'shot-card': '镜头配方卡（shotcraft）', 'motion-entry': '动效条目（wise-motion）',
  'animation-case': '源码案例（claude-motion）', 'production-engine': '制作系统（claude-motion）',
  'scene-starter': '场景起点（claude-motion）', 'source-component': '源码组件（claude-motion）',
  'object-model': '物件模型（claude-motion）', 'research-source': '研究清单（claude-motion）',
  'mg-style': 'MG 风格（mg-motion）', move: '动效函数（onetake）', look: '起始 look（onetake）',
  style: '风格条目（跨库）', tool: '工具型 skill（garden-skills）', 'design-school': '网页设计学校',
  'image-template': '出图模板类',
};
for (const c of Object.keys(byCollection).sort()) {
  md.push('### ' + (COLL[c] || c) + '（' + byCollection[c] + '）', '', '| id | 名称 / 一句话 | 分类 | 形态 | 入口 |', '| --- | --- | --- | --- | --- |');
  for (const e of entries) {
    if (e.collection !== c) continue;
    const t = String(e.title || '').replace(/\|/g, '/').slice(0, 70);
    md.push('| ' + BT + e.id + BT + ' | ' + t + ' | ' + String(e.category || '').replace(/\|/g, '/') + ' | ' + e.medium + ' | ' + BT + (e.path || e.doc || '') + BT + ' |');
  }
  md.push('');
}
fs.writeFileSync(path.join(OUT, 'INDEX.md'), md.join('\n'), 'utf8');

const KIND = [
  [/\.(woff2?|ttf|otf)$/i, 'font'], [/\.(glb|gltf|bin)$/i, 'model'],
  [/\.(mp3|wav|flac|m4a|ogg|aiff?)$/i, 'audio'], [/\.(mp4|webm|mov|mkv)$/i, 'video'],
  [/\.(png|jpe?g|webp|gif|avif|svg)$/i, 'image'], [/\.(hdr|exr)$/i, 'environment'],
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
  schemaVersion: 2,
  note: '全量素材清单（>=32KB）。素材随仓库分发；逐引擎许可见 LICENSES.md。',
  totals: { files: assets.length, bytes: assets.reduce((s, a) => s + a.bytes, 0), bytesByKind },
  assets,
}), 'utf8');

console.log('[build-catalog] entries=' + entries.length + ' byMedium=' + JSON.stringify(byMedium));
console.log('[build-catalog] byCollection=' + JSON.stringify(byCollection));
console.log('[build-catalog] styles families=' + families.length + ' showreel=' + showreelStyles.length + ' claude=' + claudeStyles.size + ' mg=' + mgStyleList.length + ' schools=' + webSchools.length + ' imageCats=' + imageCats.length);
console.log('[build-catalog] assets=' + assets.length);
