#!/usr/bin/env node
// 一句话需求 → 生产计划（交付形态 / 引擎 / 3 个风格方向 / 素材起点 / 流水线 / 闸 / 交付）
// node scripts/pick.mjs "<需求>" [--medium M1-video] [--json] [--quiet]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const asJson = argv.includes('--json');
const quiet = argv.includes('--quiet');
let forcedMedium = null;
{
  const i = argv.indexOf('--medium');
  if (i !== -1 && argv[i + 1]) { forcedMedium = argv[i + 1]; argv.splice(i, 2); }
  else { const j = argv.indexOf('--medium'); if (j !== -1) argv.splice(j, 1); }
}
const brief = argv.filter((a) => !a.startsWith('--')).join(' ').trim();

const idxPath = path.join(ROOT, 'catalog/index.json');
const styPath = path.join(ROOT, 'catalog/styles.json');
if (!fs.existsSync(idxPath) || !fs.existsSync(styPath)) {
  console.error('缺 catalog/，先跑：node scripts/build-catalog.mjs');
  process.exit(2);
}
const idx = JSON.parse(fs.readFileSync(idxPath, 'utf8'));
const sty = JSON.parse(fs.readFileSync(styPath, 'utf8'));
const entries = idx.entries || [];

// ---------------------------------------------------------------- 判读词表
const MEDIUM_HINTS = {
  'M1-video': ['视频', '片子', '短片', '动效', '宣传片', '发布片', '片头', 'teaser', 'promo', 'trailer', '广告', '介绍视频', '功能演示', '演示视频', '讲解视频', '混剪', 'mp4', '成片', '作品集', 'showreel', 'reel', 'motion', 'video', '动画短片', 'mv'],
  'M2-web-video': ['网页当视频', '网页做视频', '点击翻页', '点击驱动', '录屏', '动态ppt', '不像ppt', '口播稿', 'presentation', '翻页演示', '可交互解说'],
  'M3-web-artifact': ['网页', '网站', '落地页', 'landing', '页面', 'dashboard', '仪表盘', '原型', 'prototype', 'ui', 'mockup', 'deck', '幻灯片', '数据可视化', '可视化', '图表', 'chart', '前端', 'html', '组件库', '设计系统', '官网'],
  'M4-article': ['文章', '长文', '稿件', '博客', 'briefing', '解释文', '复盘', '方案分析', 'article', '网页文章', '单文件', '把链接做成', '把pdf做成', '把docx做成', '阅读版'],
  'M5-image': ['海报', '封面', '信息图', 'infographic', '产品图', '主视觉', '分镜图', '插画', '头像', 'banner', '缩略图', '图标', '出图', '生图', '图片', 'image', 'poster', 'keyvisual', 'kv'],
  'M6-motion-source': ['只要源码', '动效源码', '要这个动效', '动作源码', '转场源码', '素材库', '复用动作', '条目源码'],
  'M7-retrieval': ['知识库', '检索', '查资料', '文件里找', '文档里找', '资料里', '回答我', '根据材料'],
};

const ENGINE_HINTS = {
  onetake: ['节奏', '不像ppt', '承接', '运镜', '快门', '合成音效', '15秒', '20秒', '30秒', '发布片', '技能演示', '多语言', '英文版', '日语版', '配音', '产品动效', 'lift', 'oracle'],
  shotcraft: ['产品宣传片', '真实页面', '网页捕获', '页面捕获', '多镜头', 'remotion', '剪映', '社交平台发布', '影视感', '电影感', '3分钟', '官网展示', '镜头卡', '镜头'],
  'mg-motion': ['mg', '风格混搭', '混搭', '签名技法', '评审', '机器闸', '扁平', '线描', '等轴', '包豪斯', '赛博', '像素风', 'hud', '综艺花字', '贴纸', '玻璃拟态', 'synthwave'],
  'motion-showreel': ['20分钟', '长视频', '长篇', '章节', '口播', 'tts', 'bgm', '配乐', '生成艺术', '作品集', '讲解视频', '教程视频', '40种风格', '分章节'],
  'claude-motion': ['3d', '模型', '物件', '角色', '动物', '机械', '纸艺', '场景', '源码案例', '材质', 'glb', 'three.js', '可运行场景'],
  'web-video-presentation': ['网页当视频', '点击', '录屏', '口播稿', '大纲', '逐屏', '伪视频'],
  'web-design-engineer': ['网页', '仪表盘', '原型', 'ui', 'deck', '设计系统', '可视化', '组件', '官网', '产品页'],
  'beautiful-article': ['文章', '长文', '链接', 'pdf', 'docx', '阅读'],
  'gpt-image-2': ['海报', '信息图', '出图', '生图', '模板', '主视觉', 'kv', '插画'],
  'kb-retriever': ['知识库', '检索', 'grep', '资料'],
};

const STYLE_HINTS = [
  { ids: ['anchor-hud', 'synthwave'], words: ['赛博', '科幻', '未来', '科技感', 'hud', '全息', 'cyber', 'scifi', '仪盘', '数据界面'] },
  { ids: ['retro-screen', 'glitch'], words: ['复古', '怀旧', 'crt', 'vhs', '故障', 'glitch', '老电视', 'ascii', '终端'] },
  { ids: ['ink-wash', 'ukiyo-e', 'illuminated'], words: ['中国风', '国潮', '东方', '水墨', '国画', '浮世绘', '和风', '古风', '禅'] },
  { ids: ['keynote'], words: ['发布会', '旗舰', '隆重', 'keynote'] },
  { ids: ['glass-material'], words: ['玻璃', '弥散', '质感', 'premium', '奢华', '极简高级'] },
  { ids: ['print-ink', 'swiss-grid'], words: ['出版', '杂志', '报纸', '书籍', '编辑感', '排版考究', 'editorial', '纸感'] },
  { ids: ['toy-3d', 'crayon', 'toy'], words: ['可爱', '玩具', '积木', '童趣', '萌', '软胶', 'kids'] },
  { ids: ['painting', 'collage', 'paper'], words: ['手绘', '水彩', '油画', '厚涂', '拼贴', '剪纸', '纸艺', '速写', '绘本'] },
  { ids: ['data-motion', 'iso'], words: ['数据', '图表', '增长', '报表', '财报', '指标', '等轴', '信息图'] },
  { ids: ['minimal-ui', 'swiss-grid', 'flat-vector'], words: ['极简', '干净', '留白', '瑞士', '网格', '扁平', '克制', 'professional', 'b2b'] },
  { ids: ['pixel', 'hd2d'], words: ['像素', '游戏', '8bit', '复古游戏', 'rpg'] },
  { ids: ['print-ink', 'engraving'], words: ['印刷', '丝网', '孔版', '铜版', '木刻', '版画', 'riso', '报纸'] },
  { ids: ['toon', 'rubber-hose'], words: ['卡通', '动漫', '赛璐璐', '二次元', '美式', 'disney', 'rubber'] },
  { ids: ['kinetic-type', 'variety'], words: ['大字', '巨字', '字体', '排版', '综艺', '花字', '金句', '口号'] },
  { ids: ['whiteboard', 'game-show'], words: ['科普', '讲解', '白板', '教学', '解释'] },
  { ids: ['generative', 'liquid', 'morph'], words: ['生成', '粒子', '流体', '液态', '抽象', '变形', '生成艺术'] },
  { ids: ['art-deco', 'kinetic-type'], words: ['装饰艺术', 'artdeco', '年代', '1920', '盖茨比'] },
  { ids: ['blueprint'], words: ['蓝图', '工程图', '结构', '原理', '剖面', '装配'] },
  { ids: ['one-line'], words: ['线描', '一笔', '线条', 'outline'] },
  { ids: ['shadow-puppet', 'stained-glass', 'tilt-shift'], words: ['皮影', '剪影', '玻璃彩绘', '微缩', '移轴'] },
];

// -------------------------------------------------- 决定性分流（先判形态）
// 命中即定，避免"网页"这种词把长文/图片的活抢走。
const DECISIVE = [
  { medium: 'M4-article', words: ['长文', '文章', '网页文章', '阅读版', 'briefing', '把链接做成', '把pdf做成', '把docx做成', 'pdf 链接做成', '成一篇'] },
  { medium: 'M7-retrieval', words: ['知识库', '资料里找', '文件里找', '文档里找', '从材料里', '检索一下'] },
  { medium: 'M5-image', words: ['海报', '封面图', '信息图', '出图', '生图', '主视觉', 'kv', '分镜图', '头像图', '缩略图'] },
  { medium: 'M2-web-video', words: ['网页当视频', '网页做视频', '点击翻页', '点击驱动', '录屏', '动态ppt', '口播稿', '不像ppt'] },
  { medium: 'M6-motion-source', words: ['只要源码', '动效源码', '动作源码', '转场源码', '复用这个动作'] },
  { medium: 'M6-motion-source', all: ['源码'], any: ['放进', '工程', '复用', '接入', '不要成片', '只要', '我的项目'] },
  { medium: 'M3-web-artifact', words: ['仪表盘', 'dashboard', '落地页', '官网', '设计系统', '原型', 'prototype', 'ui mockup', '设计稿', '后台页面', '看板', '数据可视化', '网页', '页面'] },
];

// ---------------------------------------------------------------- 打分
const norm = (s) => String(s == null ? '' : s).toLowerCase();
const text = norm(brief);

function scoreByHints(hints) {
  const out = {};
  for (const key of Object.keys(hints)) {
    let s = 0;
    for (const w of hints[key]) if (text.includes(norm(w))) s += w.length > 2 ? 3 : 2;
    out[key] = s;
  }
  return out;
}

const mediumScores = scoreByHints(MEDIUM_HINTS);
let decisive = null;
for (const rule of DECISIVE) {
  const hitWords = rule.words ? rule.words.some((w) => text.includes(norm(w))) : false;
  const hitCompound = rule.all ? rule.all.every((w) => text.includes(norm(w))) && rule.any.some((w) => text.includes(norm(w))) : false;
  if (hitWords || hitCompound) { decisive = rule.medium; break; }
}
if (decisive) for (const k of Object.keys(mediumScores)) mediumScores[k] = k === decisive ? 50 : Math.min(mediumScores[k], 4);
if (forcedMedium && mediumScores[forcedMedium] !== undefined) {
  for (const k of Object.keys(mediumScores)) mediumScores[k] = k === forcedMedium ? 99 : 0;
}
const mediumRank = Object.keys(mediumScores).sort((a, b) => mediumScores[b] - mediumScores[a]);
const topMedium = mediumScores[mediumRank[0]] > 0 ? mediumRank[0] : 'M1-video';
const runnerUp = mediumRank.length > 1 ? mediumScores[mediumRank[1]] : 0;
const mediumConfident = !!decisive || (mediumScores[mediumRank[0]] > 0 && (runnerUp === 0 || mediumScores[mediumRank[0]] - runnerUp >= 2));

const mediumEngines = (idx.mediums[topMedium] || {}).engines || [];
const engineScores = {};
for (const e of mediumEngines) engineScores[e] = scoreByHints({ x: ENGINE_HINTS[e] || [] }).x || 0;
// 视频类：把同族引擎也算进候选，按能力词打分
if (topMedium === 'M1-video') {
  for (const e of ['onetake', 'shotcraft', 'mg-motion', 'motion-showreel', 'claude-motion']) {
    if (engineScores[e] === undefined) engineScores[e] = scoreByHints({ x: ENGINE_HINTS[e] || [] }).x || 0;
  }
}
const engineRank = Object.keys(engineScores).sort((a, b) => engineScores[b] - engineScores[a]);
const primaryEngine = engineRank[0];

// 风格族打分
const familyScores = new Map();
for (const f of sty.families) {
  let s = 0;
  const hay = norm([f.id, f.name, f.category, (f.mood || []).join(' '), f.implementations.map((i) => i.note || '').join(' ')].join(' '));
  for (const tok of brief.split(/[\s,，、\/;；]+/).filter(Boolean)) {
    const t = norm(tok);
    if (t.length >= 2 && hay.includes(t)) s += 4;
  }
  for (const h of STYLE_HINTS) {
    if (!h.ids.includes(f.id)) continue;
    for (const w of h.words) if (text.includes(norm(w))) s += 6;
  }
  if (s > 0) familyScores.set(f.id, s);
}
// 三个方向：贴合 / 换语言 / 大胆，且不同分类
const ranked = Array.from(familyScores.entries()).sort((a, b) => b[1] - a[1]).map((kv) => kv[0]);
const famById = new Map(sty.families.map((f) => [f.id, f]));
const picks = [];
const usedCat = new Set();
for (const id of ranked) {
  const f = famById.get(id);
  if (!f || usedCat.has(f.category)) continue;
  usedCat.add(f.category);
  picks.push(f);
  if (picks.length === 3) break;
}
// 需求里没提到任何风格时：给三种差距最大的默认方向
{
  const BOLD = ['generative', 'print-ink', 'kinetic-type', 'anchor-hud', 'collage', 'liquid', 'glitch'];
  if (picks.length === 2) {
    for (const id of BOLD) {
      const f2 = famById.get(id);
      if (f2 && !usedCat.has(f2.category)) { picks.push(f2); break; }
    }
    if (picks.length === 2) {
      for (const id of BOLD) {
        const f2 = famById.get(id);
        if (f2 && !picks.some((p) => p.id === f2.id)) { picks.push(f2); break; }
      }
    }
  }
}
{
  const NEUTRAL = ['minimal-ui', 'data-motion', 'one-line', 'flat-vector', 'swiss-grid', 'keynote'];
  while (picks.length < 3) {
    const next = NEUTRAL.map((id) => famById.get(id)).find((x) => x && !picks.some((p) => p.id === x.id));
    if (!next) break;
    picks.push(next);
  }
}
if (!picks.length) {
  const fallback = ['minimal-ui', 'kinetic-type', 'generative', 'anchor-hud', 'painting', 'print-ink'];
  for (const id of fallback) {
    const f = famById.get(id);
    if (f && !picks.some((p) => p.id === f.id)) picks.push(f);
    if (picks.length === 3) break;
  }
}

// 素材起点：按需求词命中集合挑 4 条
function pickEntries(collection, n) {
  const pool = entries.filter((e) => e.collection === collection);
  if (!pool.length) return [];
  const tokens = brief.split(/[\s,，、\/;；]+/).map(norm).filter((t) => t.length >= 2);
  const scored = pool.map((e) => {
    const hay = norm([e.id, e.title, e.category, e.summary, (e.tags || []).join(' ')].join(' '));
    let s = 0;
    for (const t of tokens) if (hay.includes(t)) s += 3;
    return { e, s };
  }).sort((a, b) => b.s - a.s);
  return scored.filter((x) => x.s > 0).slice(0, n).map((x) => x.e);
}

const shotCards = pickEntries('shot-card', 3);
const motionVerbs = pickEntries('motion-entry', 3);
const imageTpl = topMedium === 'M5-image' ? pickEntries('image-template', 2) : [];
const tools = entries.filter((e) => e.collection === 'tool');

const GATE = {
  'M1-video': 'node scripts/qc.mjs gate <video> --spec spec.json ＋ 引擎自带闸（mg-qc / verify_promo）＋ 独立 subagent 评审',
  'M2-web-video': '逐章验收 + 录屏回看（references/quality-gates.md 的网页闸）',
  'M3-web-artifact': 'node scripts/check-web.mjs <file.html> ＋ Pre-delivery Checklist ＋ 截图回看',
  'M4-article': 'node scripts/check-web.mjs <file.html> ＋ 三视角终审（结构/可读/事实）',
  'M5-image': '逐张 read_image 看：主体是否可辨认、文字是否错字、构图是否留白、是否像 AI 味',
  'M6-motion-source': '导出后直接在目标工程跑一遍，确认时长/循环/透明背景/许可',
  'M7-retrieval': '每条结论标出处（文件 + 位置），找不到就说找不到',
  'M8-shot': 'node scripts/qc.mjs gate <video>',
};
const DELIVER = {
  'M1-video': 'MP4（终版规格）+ 可渲染源码 + 七项报告（概念/beat sheet/技法/风格/技术路线/实测数字/top-3 弱点）',
  'M2-web-video': 'script.md + outline.md + 可录屏网页 +（可选）口播音频 + 录屏文件 + 章节清单',
  'M3-web-artifact': '单页 HTML（或 React 工程）+ 关键状态截图 + 设计说明（Design Read 五档）',
  'M4-article': '单文件 HTML 长文 + 源 Markdown + 配图许可清单',
  'M5-image': 'PNG/系列 + 命名规范的 prompt 存档 + 用例编号',
  'M6-motion-source': '导出目录（源码 + 接入说明）+ 依赖与许可说明',
  'M7-retrieval': '答案 + 出处清单 + 不确定项',
  'M8-shot': '镜头实现（TSX/JS）+ 参数表 + 实测截图',
};

const plan = {
  brief,
  reading: {
    medium: topMedium,
    mediumLabel: (idx.mediums[topMedium] || {}).label || '',
    mediumConfident,
    mediumAlternatives: mediumRank.filter((m) => mediumScores[m] > 0).slice(0, 3),
    engine: primaryEngine,
    engineAlternatives: engineRank.slice(0, 3),
  },
  engines: engineRank.slice(0, 3).map((e) => Object.assign({ id: e, score: engineScores[e] }, idx.engines[e] || {})),
  styleDirections: picks.map((f, i) => ({
    role: ['A 贴合', 'B 换语言', 'C 大胆'][i],
    id: f.id, name: f.name, category: f.category, mood: f.mood,
    implementations: f.implementations,
  })),
  starters: {
    shotCards: shotCards.map((e) => ({ id: e.id, title: e.title, path: e.path, use: e.use })),
    motionVerbs: motionVerbs.map((e) => ({ id: e.id, title: e.title, path: e.doc || e.path, use: e.use })),
    imageTemplates: imageTpl.map((e) => ({ id: e.id, path: e.path })),
  },
  gate: GATE[topMedium],
  deliver: DELIVER[topMedium],
  next: [
    'node scripts/find.mjs "<更具体的关键词>" --medium ' + topMedium,
    'node scripts/doctor.mjs',
    '读 references/pipeline.md 的第 0 段开始做',
  ],
};

if (asJson) {
  console.log(JSON.stringify(plan, null, 2));
  process.exit(0);
}

const line = (s) => console.log(s);
line('');
line('需求：' + (brief || '(空)'));
line('判读：' + plan.reading.mediumLabel + (mediumConfident ? '' : '  ← 信号偏弱，先向用户确认一句再开工'));
if (!quiet) {
  const alt = plan.reading.mediumAlternatives.filter((m) => m !== topMedium);
  if (alt.length) line('备选形态：' + alt.join(' / ') + '（若判读不对，用 --medium 指定）');
}
line('');
line('引擎：' + primaryEngine + '  ' + (idx.engines[primaryEngine] ? ('(' + idx.engines[primaryEngine].runtime + ' · ' + idx.engines[primaryEngine].length + ')') : ''));
if (!quiet && plan.engines.length > 1) {
  line('      备选 ' + plan.engines.slice(1).map((e) => e.id).join(' / '));
}
line('');
line('风格方向（三个不同分类，不要三个都同一路）：');
for (const d of plan.styleDirections) {
  line('  ' + d.role + '  ' + d.name + '  [' + d.category + ']' + (d.mood && d.mood.length ? '  情绪 ' + d.mood.join('/') : ''));
  for (const i of d.implementations.slice(0, 3)) line('         ' + i.library + ':' + i.id + '  ' + i.path + (i.note ? '  — ' + String(i.note).slice(0, 40) : ''));
}
if (plan.starters.shotCards.length) {
  line('');
  line('镜头起点（读卡全文再实现）：');
  for (const c of plan.starters.shotCards) line('  ' + c.id + '  ' + c.path);
}
if (plan.starters.motionVerbs.length) {
  line('');
  line('动作起点（可直接导出源码）：');
  for (const m of plan.starters.motionVerbs) line('  ' + m.id + '  ' + (m.path || ''));
}
if (plan.starters.imageTemplates.length) {
  line('');
  line('出图模板类：');
  for (const t of plan.starters.imageTemplates) line('  ' + t.id + '  ' + t.path);
}
line('');
line('闸：' + plan.gate);
line('交付：' + plan.deliver);
line('');
line('下一步：');
for (const n of plan.next) line('  ' + n);
line('');
