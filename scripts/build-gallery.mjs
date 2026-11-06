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
const stripBom = (s) => (s.charCodeAt(0) === 0xfeff ? s.slice(1) : s);

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
    audio: hasAudio(abs),
    ...probeMeta(abs),
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

const posterRoot = path.join(engRoot, 'shotcraft/gallery/media/poster');
const localShotRoot = path.join(OUT, 'shots');
const posterOf = (id) => {
  const own = path.join(localShotRoot, id + '.jpg');      // 我们自己用 Remotion 渲的静帧优先
  if (exists(own)) return 'shots/' + id + '.jpg';
  const p = path.join(posterRoot, id + '.jpg');
  return exists(p) ? url(p) : null;
};
/* ---------- 镜头卡：md 全文与参考实现源码（直接内嵌，不在弹层里让用户去找文件） ---------- */
function escHtml(s) {
  return String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}
function inlineMd(s) {
  return escHtml(s).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>');
}
function mdToHtml(md) {
  const lines = md.replace(/^---[\s\S]*?---\s*/, '').split(/\r?\n/);
  const out = [];
  let list = null, table = null, para = null;
  const flush = () => {
    if (list) { out.push('<ul>' + list.join('') + '</ul>'); list = null; }
    if (table) { out.push(table); table = null; }
    if (para) { out.push('<p>' + inlineMd(para.join('')) + '</p>'); para = null; }
  };
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) { flush(); continue; }
    if (/^\|/.test(line)) {
      const cells = line.split('|').slice(1, -1).map((c) => c.trim());
      if (cells.every((c) => /^:?-{3,}:?$/.test(c))) continue;
      if (!table) {
        table = '<table><tbody>';
      }
      table += '<tr>' + cells.map((c) => '<td>' + inlineMd(c) + '</td>').join('') + '</tr>';
      continue;
    }
    if (table) { table += '</tbody></table>'; out.push(table); table = null; }
    if (/^###\s+/.test(line)) { flush(); out.push('<h4>' + inlineMd(line.replace(/^###\s+/, '')) + '</h4>'); continue; }
    if (/^##\s+/.test(line)) { flush(); out.push('<h3>' + inlineMd(line.replace(/^##\s+/, '')) + '</h3>'); continue; }
    if (/^[-*]\s+/.test(line)) { if (!list) list = []; list.push('<li>' + inlineMd(line.replace(/^[-*]\s+/, '')) + '</li>'); continue; }
    if (!para) para = [];
    para.push(line.trim());
  }
  flush();
  return out.join('');
}
function demoCodeOf(category, id) {
  const dir = path.join(engRoot, 'shotcraft/demos', category || '', id);
  try {
    const f = fs.readdirSync(dir).find((x) => x.endsWith('.tsx'));
    if (!f) return null;
    return fs.readFileSync(path.join(dir, f), 'utf8').split(/\r?\n/).slice(0, 90).join('\n');
  } catch (e) { return null; }
}
const shotCards = entries.filter((e) => e.collection === 'shot-card').map((e) => {
  let md = '';
  try { md = fs.readFileSync(path.join(ROOT, e.path || ""), "utf8"); } catch (err) { md = ""; }
  return {
    id: e.id, t: String(e.title || '').slice(0, 140), cat: e.category || '',
    d: e.duration || '', en: e.energy || '', p: e.path || '', poster: posterOf(e.id),
    mdHtml: md ? mdToHtml(md) : "", code: demoCodeOf(e.category, e.id),
  };
});
const motions = entries.filter((e) => e.collection === 'motion-entry').map((e) => ({
  id: e.id, t: e.title || e.id, cat: e.category || '', ms: e.durationMs || 0,
  loop: !!e.loop, doc: e.doc || e.path || '',
}));
const tools = entries.filter((e) => e.collection === 'tool').map((e) => ({
  id: e.id, medium: e.medium, t: String(e.summary || '').slice(0, 240), cover: coverOf(e.id), p: e.path,
}));

/* ---------- 预览图索引：claude-motion 的 scenes/extensions/production/models 各自带 preview ---------- */
const cmPreview = {};
for (const dir of ["scenes", "extensions", "production", "models"]) {
  const d = path.join(engRoot, "claude-motion/assets", dir);
  if (!exists(d)) continue;
  for (const sub of fs.readdirSync(d, { withFileTypes: true })) {
    if (!sub.isDirectory()) continue;
    for (const f of ["preview.png", "preview.webp", "preview.jpg", "cover.png"]) {
      const p = path.join(d, sub.name, f);
      if (exists(p)) { cmPreview[sub.name] = url(p); break; }
    }
  }
}

/* ---------- 素材库总表：把 index.json 里「没有专属展区」的集合全部收进来 ---------- */
const num = (v) => (typeof v === "number" ? v : 0);
const libDefs = [
  { key: "animation-case", label: "源码动画案例", hint: (e) => "node engines/claude-motion/scripts/prepare-case.mjs --case " + e.id + " --out <作品目录>",
    poster: (e) => { const s = String(e.styleId || ""); if (!s) return null; for (const c of ["lemo-" + s, "expansion-" + s, s]) if (previews.has(c)) return previews.get(c); return null; } },
  { key: "production-engine", label: "制作系统", hint: (e) => "node engines/claude-motion/scripts/create-engine.mjs --engine " + e.id + " --out <新目录>", poster: (e) => cmPreview[e.id] || null },
  { key: "scene-starter", label: "场景起点", hint: (e) => "node engines/claude-motion/scripts/create-scene.mjs --scene " + e.id + " --out <新目录>", poster: (e) => cmPreview[e.id] || null },
  { key: "source-component", label: "源码组件", hint: (e) => "node engines/claude-motion/scripts/create-extension.mjs --extension " + e.id + " --out <新目录>", poster: (e) => cmPreview[e.id] || null },
  { key: "object-model", label: "物件模型", hint: (e) => "node engines/claude-motion/scripts/create-model.mjs --model " + e.id + " --out <新目录>", poster: (e) => cmPreview[e.id] || null },
  { key: "mg-style", label: "MG 签名技法", hint: (e) => "读 engines/mg-motion/references/styles.md 对应小节，写进 renderAt(t)", poster: () => null },
  { key: "move", label: "动效函数", hint: (e) => "window.OM." + e.id + "(t, t0, ...) 纯时间函数", poster: () => null,
    player: (e) => url(path.join(engRoot, "onetake/gallery/gallery.html")) + "?demo=" + e.id + "&play", playerKind: "classic" },
  { key: "look", label: "起始 look", hint: (e) => "python engines/onetake/scripts/look.py apply " + e.id, poster: () => null },
  { key: "design-school", label: "网页设计学校", hint: () => "按 Design Read 五档标尺给三个不同行的方向", poster: () => null },
  { key: "image-template", label: "出图模板类", hint: (e) => "读 " + (e.path || "") + "，再按模板槽位填 prompt", poster: () => null },
  { key: "style", label: "风格实现", hint: (e) => "按 references/style-library.md 选族，再读 " + (e.path || "") + " 的实现", poster: () => null },
  { key: "research-source", label: "研究清单（只读）", hint: () => "已收录但未接成可调用案例，不要当可运行案例", poster: () => null },
];
const library = libDefs.map((d) => {
  const items = entries.filter((e) => e.collection === d.key).map((e) => ({
    id: e.id,
    title: String(e.title || e.titleZh || e.id).slice(0, 120),
    cat: e.category || "",
    sum: String(e.summary || "").slice(0, 220),
    path: e.path || e.doc || "",
    hint: (() => { try { return d.hint(e); } catch (err) { return ""; } })(),
    poster: (() => { try { return d.poster(e); } catch (err) { return null; } })(),
    link: e.upstream || "",
    player: (() => { try { return d.player ? d.player(e) : null; } catch (err) { return null; } })(),
    playerKind: d.playerKind || null,
    n: num(e.durationMs),
  }));
  return { key: d.key, label: d.label, count: items.length, items };
}).filter((c) => c.count > 0);

/* ---------- 全部条目（1023 条一行一条，供「全部条目」表视图） ---------- */
const COLL_LABEL = { style: "风格实现", "shot-card": "镜头卡", "motion-entry": "动作", tool: "工具" };
for (const d of libDefs) COLL_LABEL[d.key] = d.label;
const allEntries = entries.map((e) => ({
  id: e.id,
  title: String(e.title || e.titleZh || e.id).slice(0, 90),
  coll: COLL_LABEL[e.collection] || e.collection,
  cat: e.category || "",
  path: String(e.path || e.doc || "").slice(0, 110),
}));
const libTotal = library.reduce((s, c) => s + c.count, 0);
const dedicated = entries.filter((e) => ["shot-card", "motion-entry", "tool"].indexOf(e.collection) >= 0).length;
const styleCount = entries.filter((e) => e.collection === "style").length;
const covered = libTotal + dedicated;   // style 已并入 library，不再重复计
/* ---------- 可播放资源：wise 播放器 / onetake 播放器 / claude demo ---------- */
const PLAYERS = {
  wise: (id) => url(path.join(engRoot, "wise-motion/catalog/index.html")) + "#" + id,
  onetake: (name) => url(path.join(engRoot, "onetake/gallery/gallery.html")) + "?demo=" + name + "&play",
  claude: (entryPath) => (entryPath ? "../" + entryPath : null),
};

/* 给 library 的每个条目补 player（能真播的才给） */
for (const coll of library) {
  for (const it of coll.items) {
    if (coll.key === "animation-case" && it.path && /\.html$/.test(it.path)) {
      it.player = "../" + it.path;
      it.playerKind = "module";   // claude 的 demo 用 type=module，file:// 会被拦，需要本地服务
    }
  }
}

/* motions（wise 462 条）与 move（onetake 35 条）都能在播放器里真播 */
for (const m of motions) {
  m.player = PLAYERS.wise(m.id);
  m.playerKind = "classic";
}
for (const mv of entries.filter((e) => e.collection === "move")) {
  const hit = motions.length ? null : null;
}
/* ---------- 视频音轨探测（ffprobe） ---------- */
import { spawnSync } from 'node:child_process';
function probeMeta(file) {
  const d = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], { encoding: 'utf8' });
  const v = spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', file], { encoding: 'utf8' });
  const dur = parseFloat((d.stdout || '').trim()) || 0;
  const res = (v.stdout || '').trim().split(',')[0] ? (v.stdout || '').trim().split(',')[0] + 'x' + (v.stdout || '').trim().split(',')[1] : '';
  return { dur: Math.round(dur * 10) / 10, res };
}
function hasAudio(file) {
  const r = spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'a', '-show_entries', 'stream=codec_name', '-of', 'csv=p=0', file], { encoding: 'utf8' });
  return !!(r.stdout && r.stdout.trim());
}
/* ---------- wise 封面：build-covers.mjs 抓的真实预览帧 ---------- */
const COVER_DIR = path.join(OUT, "covers");
const COVER_MIN_BYTES = 2600;   // 小于这个体积基本是黑帧/纯色，当作没有封面
const coverOfEffect = (id) => {
  const p = path.join(COVER_DIR, "wise-" + id + ".jpg");
  if (!exists(p)) return null;
  if (fs.statSync(p).size < COVER_MIN_BYTES) return null;
  return "covers/wise-" + id + ".jpg";
};
const videoOfEffect = (id) => {
  const p = path.join(OUT, 'videos', 'wise-' + id + '.mp4');
  return exists(p) && fs.statSync(p).size > 6000 ? "videos/wise-" + id + ".mp4" : null;
};
for (const m of motions) { m.cover = coverOfEffect(m.id); m.video = videoOfEffect(m.id); }
const coveredMotions = motions.filter((m) => m.cover).length;
const DATA = {
  generatedAt: new Date().toISOString().slice(0, 10),
  totals: {
    families: families.length,
    withPreview: families.filter((f) => f.preview).length,
    videos: videos.length, gifs: gifs.length,
    shotCards: shotCards.length, shotWithPoster: shotCards.filter((c) => c.poster).length,
    motions: motions.length, coveredMotions,
    tools: tools.length,
    entries: entries.length,
  },
  families, videos, gifs, shotCards, motions, tools,
  library,
  allEntries,
  coverage: { catalogEntries: entries.length, dedicated, styleCount, libTotal, covered },
};

const shell = stripBom(fs.readFileSync(path.join(SRC, 'shell.html'), 'utf8'));
const fontCss = exists(path.join(SRC, 'fonts.css')) ? stripBom(fs.readFileSync(path.join(SRC, 'fonts.css'), 'utf8')) : '';
const css = fontCss + stripBom(fs.readFileSync(path.join(SRC, 'style.css'), 'utf8'));
const app = stripBom(fs.readFileSync(path.join(SRC, 'app.js'), 'utf8'));

const html = shell
  .split('<!--CSS-->').join(css)
  .split('<!--DATA-->').join(JSON.stringify(DATA))
  .split('<!--APP-->').join(app);

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.html'), html, 'utf8');
console.log('[gallery] gallery/index.html  ' + Math.round(Buffer.byteLength(html) / 1024) + ' KB');
console.log('[gallery] families=' + families.length + ' real=' + DATA.totals.withPreview +
  ' videos=' + videos.length + ' gifs=' + gifs.length + ' shots=' + shotCards.length + ' moves=' + motions.length);
