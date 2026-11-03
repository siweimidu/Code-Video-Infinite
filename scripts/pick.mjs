#!/usr/bin/env node
// 一句话需求 → 生产计划（人读版）。核心逻辑在 scripts/lib/router.mjs
import { analyse } from './lib/router.mjs';

const argv = process.argv.slice(2);
const asJson = argv.includes('--json');
const quiet = argv.includes('--quiet');
const flags = {};
for (const k of ['--medium', '--engine']) {
  const i = argv.indexOf(k);
  if (i !== -1) { flags[k.slice(2)] = argv[i + 1]; argv.splice(i, 2); }
}
const brief = argv.filter((a) => !a.startsWith('--')).join(' ').trim();
if (!brief) {
  console.error('用法: node scripts/pick.mjs "<一句话需求>" [--medium …] [--json]');
  console.error('想看怎么用: node scripts/help.mjs');
  process.exit(2);
}
const plan = analyse(brief, { medium: flags.medium, engine: flags.engine });
if (asJson) { console.log(JSON.stringify(plan, null, 2)); process.exit(0); }

const line = (s) => console.log(s === undefined ? '' : s);
line('');
line('需求：' + brief);
line('判读：' + plan.reading.mediumLabel + (plan.reading.mediumConfident ? '' : '   <- 信号偏弱，先向用户确认一句再开工'));
if (!quiet) {
  const alt = plan.reading.mediumAlternatives.filter((m) => m !== plan.reading.medium);
  if (alt.length) line('备选形态：' + alt.join(' / ') + '（判读不对就用 --medium 指定）');
}
line('');
const e0 = plan.engines[0] || {};
line('引擎：' + plan.reading.engine + (e0.runtime ? '  (' + e0.runtime + ' · ' + e0.length + ')' : ''));
if (!quiet && plan.engines.length > 1) line('      备选 ' + plan.engines.slice(1).map((e) => e.id).join(' / '));
line('');
line('风格方向（三个不同分类）：');
for (const d of plan.styleDirections) {
  line('  ' + d.role + '  ' + d.name + '  [' + d.category + ']' + (d.mood && d.mood.length ? '  情绪 ' + d.mood.join('/') : ''));
  for (const i of d.implementations.slice(0, 2)) line('         ' + i.library + ':' + i.id + '  ' + i.path + (i.note ? '  — ' + String(i.note).slice(0, 40) : ''));
}
if (plan.starters.shotCards.length) { line(''); line('镜头起点：'); for (const c of plan.starters.shotCards) line('  ' + c.id + '  ' + c.path); }
if (plan.starters.motionVerbs.length) { line(''); line('动作起点（可直接导出源码）：'); for (const m of plan.starters.motionVerbs) line('  ' + m.id + '  ' + (m.path || '')); }
if (plan.starters.imageTemplates.length) { line(''); line('出图模板类：'); for (const t of plan.starters.imageTemplates) line('  ' + t.id + '  ' + t.path); }
line('');
line('闸：' + plan.gate);
line('交付：' + plan.deliver);
line('');
line('下一步：');
line('  node scripts/do.mjs "' + brief + '"    <- 直接建工程骨架');
line('  node scripts/help.mjs                     <- 一屏速查');
line('');
