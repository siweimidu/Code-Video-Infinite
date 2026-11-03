#!/usr/bin/env node
// 一句话需求 → 直接建好工程骨架（brief.md / plan.json / plan.md / spec.json / NEXT.md）
import fs from 'node:fs';
import path from 'node:path';
import { analyse, ROOT } from './lib/router.mjs';

const argv = process.argv.slice(2);
const dry = argv.includes('--dry');
const ask = argv.includes('--ask');
const flags = {};
for (const k of ['--dir', '--medium', '--engine']) {
  const i = argv.indexOf(k);
  if (i !== -1) { flags[k.slice(2)] = argv[i + 1]; argv.splice(i, 2); }
}
let brief = argv.filter((a) => !a.startsWith('--')).join(' ').trim();

const QUESTIONS = [
  ['要做什么（一句话，越随便越好）', '做一支 20 秒产品发布动效'],
  ['时长 / 篇幅', '20 秒'],
  ['画幅 / 尺寸', '16:9 横版'],
  ['声音：无 / 配音 / 配乐 / 都要', '配乐 + 音效'],
  ['素材从哪来：你给 / 我造 / 用真实页面', '你给截图'],
  ['投放在哪：官网 / 朋友圈 / 抖音小红书 / 内部汇报', '官网首屏'],
  ['品牌约束（logo、主色、禁项），没有写「无」', '主色 #0E7C86，不用真商标'],
];

async function wizard() {
  if (!process.stdin.isTTY) {
    const chunks = [];
    for await (const c of process.stdin) chunks.push(c);
    const lines = Buffer.concat(chunks).toString('utf8').split(/\r?\n/).map((s) => s.trim());
    const answers = [];
    QUESTIONS.forEach((q, i) => answers.push(lines[i] || q[1]));
    console.log('（管道输入：读到 ' + lines.filter((x) => x).length + ' 行，其余用默认值）');
    return answers;
  }
  const rl = await import('node:readline/promises');
  const iface = rl.createInterface({ input: process.stdin, output: process.stdout });
  const answers = [];
  console.log('');
  console.log('七个问题，直接回车用默认值。答案会写进 brief.md，之后不用再问。');
  console.log('');
  for (const q of QUESTIONS) {
    const a = (await iface.question(q[0] + '  [' + q[1] + ']: ')).trim();
    answers.push(a || q[1]);
  }
  iface.close();
  return answers;
}

function slugify(s) {
  const base = String(s || 'work').replace(/[^0-9A-Za-z\u4e00-\u9fa5]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 24);
  const d = new Date();
  const stamp = d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
  return (base || 'work') + '-' + stamp;
}
function writeIfAbsent(file, content) {
  if (fs.existsSync(file)) return false;
  fs.writeFileSync(file, content, 'utf8');
  return true;
}

async function main() {
  let answers = null;
  if (ask) { answers = await wizard(); if (!brief) brief = answers[0]; }
  if (!brief) {
    console.error('用法: node scripts/do.mjs "<一句话需求>"   或   node scripts/do.mjs --ask');
    console.error('想看怎么用: node scripts/help.mjs');
    process.exit(2);
  }
  const plan = analyse(brief, { medium: flags.medium, engine: flags.engine });
  const outDir = path.resolve(flags.dir || path.join(process.cwd(), 'out', slugify(brief)));
  const engine = plan.reading.engine;
  const style0 = plan.styleDirections[0];

  const b = [
    '# Brief', '',
    '> 由 scripts/do.mjs 生成。这是这一单的唯一真相源：先把它填满，再开工。', '',
    '## 用户原话', '', brief, '',
    '## 七件事', '', '| 项 | 内容 |', '| --- | --- |',
    '| 时长 / 篇幅 | ' + (answers ? answers[1] : '_待填_') + ' |',
    '| 画幅 / 尺寸 | ' + (answers ? answers[2] : '_待填_') + ' |',
    '| 声音 | ' + (answers ? answers[3] : '_待填_') + ' |',
    '| 素材来源 | ' + (answers ? answers[4] : '_待填_') + ' |',
    '| 投放位 | ' + (answers ? answers[5] : '_待填_') + ' |',
    '| 品牌约束 | ' + (answers ? answers[6] : '_待填_') + ' |', '',
    '## 判读', '',
    '- 交付形态：' + plan.reading.medium + ' · ' + plan.reading.mediumLabel,
    '- 引擎：' + engine + (plan.engines[0] && plan.engines[0].runtime ? '（' + plan.engines[0].runtime + '）' : ''),
    '- 判读置信：' + (plan.reading.mediumConfident ? '高' : '低 —— 先问用户一句再往下走'), '',
    '## 风格（开工前必须写死这一行）', '',
    '风格：' + (style0 ? style0.id : '_未定_') + '（' + (style0 && style0.implementations[0] ? style0.implementations[0].library + ':' + style0.implementations[0].id : '') + '）', '',
    '候选方向（A 贴合 / B 换语言 / C 大胆，必须不同分类）：', '',
  ];
  for (const d of plan.styleDirections) b.push('- ' + d.role + ' ' + d.name + ' [' + d.category + ']  ' + d.implementations.map((i) => i.library + ':' + i.id).join(', '));
  b.push('', '保留：_2-3 个辨识信号_  ·  舍弃：_这个风格最俗的版本_  ·  改造：_改了什么，为什么_', '',
    '## 闸', '', plan.gate, '', '## 交付', '', plan.deliver, '');

  const n = [
    '# NEXT（照着做）', '',
    '## 1. 先确认判读', '',
    plan.reading.mediumConfident ? '- 置信高，可直接开工。' : '- 置信低：先问用户「你要的是 ' + plan.reading.mediumLabel + ' 对吗？」，再往下走。', '',
    '## 2. 只读这三处', '',
    '1. references/taxonomy.md 里 ' + plan.reading.medium + ' 与 ' + engine + ' 那两行',
    '2. references/pipeline.md 第 0 段 + 对应形态那一行',
    '3. engines/' + engine + '/ENGINE.md', '',
    '## 3. 开工命令', '',
  ];
  for (const c of plan.kickoff || []) n.push('- ' + c);
  n.push('', '## 4. 素材起点', '');
  for (const c of plan.starters.shotCards) n.push('- 镜头卡 ' + c.id + '  ' + c.path);
  for (const m of plan.starters.motionVerbs) n.push('- 动作 ' + m.id + '  ' + (m.path || ''));
  for (const t of plan.starters.imageTemplates) n.push('- 出图模板 ' + t.id + '  ' + t.path);
  n.push('', '## 5. 交付前', '', '- 闸：' + plan.gate, '- 交付：' + plan.deliver,
    '- 自检：node scripts/check-web.mjs <file.html>（网页/文章）或 node scripts/qc.mjs gate <video> --spec spec.json（视频）',
    '', '## 6. 不确定时', '', '- node scripts/help.mjs', '- node scripts/find.mjs "<关键词>" --medium ' + plan.reading.medium, '');

  if (dry) {
    console.log('');
    console.log('[dry-run] 会写到: ' + outDir);
    console.log('  brief.md / NEXT.md / plan.json / plan.md / spec.json');
    console.log('判读: ' + plan.reading.medium + ' · ' + engine + (plan.reading.mediumConfident ? '' : '  <- 置信低，先确认'));
    console.log('');
    return;
  }
  fs.mkdirSync(outDir, { recursive: true });
  const created = [];
  if (writeIfAbsent(path.join(outDir, 'brief.md'), b.join('\n'))) created.push('brief.md');
  if (writeIfAbsent(path.join(outDir, 'NEXT.md'), n.join('\n'))) created.push('NEXT.md');
  if (writeIfAbsent(path.join(outDir, 'plan.json'), JSON.stringify(plan, null, 2))) created.push('plan.json');
  if (writeIfAbsent(path.join(outDir, 'plan.md'), '# 生产计划\n\n- 形态：' + plan.reading.medium + '\n- 引擎：' + engine + '\n- 风格：' + plan.styleDirections.map((d) => d.role + ' ' + d.name).join(' / ') + '\n- 闸：' + plan.gate + '\n')) created.push('plan.md');
  const specSrc = path.join(ROOT, 'spec.json');
  if (fs.existsSync(specSrc) && writeIfAbsent(path.join(outDir, 'spec.json'), fs.readFileSync(specSrc, 'utf8'))) created.push('spec.json');

  console.log('');
  console.log('已建好：' + outDir);
  console.log('  ' + (created.length ? created.join(' · ') : '（已存在，未覆盖）'));
  console.log('');
  console.log('判读：' + plan.reading.medium + ' · ' + engine + (plan.reading.mediumConfident ? '' : '   <- 置信低，先确认'));
  console.log('风格：' + plan.styleDirections.map((d) => d.role + ' ' + d.name).join('  |  '));
  console.log('');
  console.log('接着做：');
  console.log('  1) 补齐 ' + path.join(outDir, 'brief.md'));
  console.log('  2) 照 ' + path.join(outDir, 'NEXT.md') + ' 走');
  console.log('  3) 交付前跑闸：' + plan.gate);
  console.log('');
}
main().catch((e) => { console.error('出错: ' + e.message); process.exit(1); });
