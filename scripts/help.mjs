#!/usr/bin/env node
// 一屏速查卡：记不住形态/引擎/风格时看这个。
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './lib/router.mjs';

const CH = path.join(ROOT, 'CHEATSHEET.md');
const QS = path.join(ROOT, 'QUICKSTART.md');
const wantFull = process.argv.includes('--full');
if (wantFull) {
  const p = CH;
  if (fs.existsSync(p)) { console.log(fs.readFileSync(p, 'utf8')); process.exit(0); }
}

const L = (s) => console.log(s === undefined ? '' : s);
L('');
L('  Code-Video-Infinite · 一屏速查');
L('  你只需要说人话。记不住形态/引擎/风格都正常——判读交给脚本。');
L('');
L('  三条命令');
L('    node scripts/do.mjs "<随便一句话>"     建工程骨架（brief/NEXT/plan/spec），然后照 NEXT.md 做');
L('    node scripts/do.mjs --ask               不想写命令？回答 7 个问题，一样建骨架');
L('    node scripts/help.mjs                   这一页');
L('    node scripts/pick.mjs "<一句话>"        只想看判读，不建文件');
L('    node scripts/find.mjs "<关键词>"        找素材（加 --medium / --engine 收窄）');
L('');
L('  你可以这么说（照抄改词就行）');
L('    视频   做个 20 秒发布动效 / 一支 3 分钟产品宣传片 / 12 分钟章节式讲解视频');
L('    网页   给我做个能点的落地页 / 后台仪表盘 / 单文件演示稿');
L('    网页视频  用网页做个点一下就翻一页的演示，我要录屏');
L('    长文   把这个 PDF 做成一页能分享的网页长文');
L('    图     要一张竖版发布会海报 / 季度财报信息图 / 产品主视觉');
L('    源码   只要那个卡片反向滚动的动效源码，放进我的工程');
L('    检索   从我的资料库里找上季度复购率');
L('');
L('  八种交付形态（脚本会自动判，你只需知道有这些）');
L('    M1 视频成片      onetake / shotcraft / mg-motion / motion-showreel / claude-motion');
L('    M2 网页视频      web-video-presentation');
L('    M3 网页制品      web-design-engineer');
L('    M4 长文          beautiful-article');
L('    M5 静态图        gpt-image-2');
L('    M6 动效源码      wise-motion');
L('    M7 知识检索      kb-retriever');
L('    M8 镜头配方      shotcraft（做 M1 的零件）');
L('');
L('  风格：39 个族，按「三方向」给（A 贴合 / B 换语言 / C 大胆）。');
L('    说不清风格就这样说：「要高级感」「要赛博」「要中国风」「要像杂志」「要可爱」——都能落到具体族。');
L('    也可以直接点名：赛博 HUD / 暗色发布会 / 瑞士网格 / 浮世绘 / 像素 / 铜版画 / 纸艺 / 数据叙事 …');
L('');
L('  记忆负担为零的做法');
L('    1) 只记一条：node scripts/do.mjs "<你要什么>"');
L('    2) 判读不对就说「不对，我要的是 …」，或加 --medium M3-web-artifact 之类');
L('    3) 交付前照 NEXT.md 跑闸；不确定再 node scripts/help.mjs');
L('');
L('  更多');
L('    CHEATSHEET.md   A4 一页（可打印）');
L('    QUICKSTART.md   三个 5 分钟走查（视频 / 网页 / 图）');
L('    references/taxonomy.md  完整分类学（要深挖时再看）');
L('');
if (fs.existsSync(CH)) L('  (node scripts/help.mjs --full 打印完整速查表)');
L('');
