#!/usr/bin/env node
// 路由回归自检：改词表/改权重后跑一遍，确认判读没退化。
import { analyse } from './lib/router.mjs';

const CASES = [
  ['做一支 20 秒产品发布动效', 'M1-video', null],
  ['把这个 PDF 链接做成一页网页长文，出版物质感', 'M4-article', 'beautiful-article'],
  ['要一张赛博朋克风的 AI 产品发布会海报，竖版', 'M5-image', 'gpt-image-2'],
  ['只想要那个卡片反向滚动动效的源码，放进我的工程', 'M6-motion-source', 'wise-motion'],
  ['帮我从本地知识库里找上季度的复购率数据', 'M7-retrieval', 'kb-retriever'],
  ['给投资人看的能点击的网页演示', 'M3-web-artifact', null],
  ['用网页做个点一下就翻一页的演示，我要录屏', 'M2-web-video', 'web-video-presentation'],
  ['做一支 12 分钟的章节式讲解视频，带口播和配乐', 'M1-video', 'motion-showreel'],
  ['要会动的 3D 角色和动物，材质好一点', 'M1-video', 'claude-motion'],
  ['用我们真实网页画面做一支产品宣传片，多镜头', 'M1-video', 'shotcraft'],
  ['给我做个后台仪表盘页面', 'M3-web-artifact', 'web-design-engineer'],
  ['做一张季度财报信息图', 'M5-image', 'gpt-image-2'],
  ['用赛博 HUD 风格做一支 MG 动效片', 'M1-video', 'mg-motion'],
  ['像素风游戏片头，8bit 那种', 'M1-video', null],
  ['一份能发朋友圈的复盘文档', 'M4-article', null],
  ['单文件 HTML 演示稿，能放映', 'M3-web-artifact', null],
  ['要一张产品主视觉，竖版', 'M5-image', 'gpt-image-2'],
  ['做个白板讲解科普视频', 'M1-video', null],
  ['给我一支 30 秒的片，要很炫很酷', 'M1-video', null],
  ['公司官网的落地页，极简专业', 'M3-web-artifact', 'web-design-engineer'],
];

let pass = 0;
const fails = [];
for (const c of CASES) {
  const brief = c[0], wantMedium = c[1], wantEngine = c[2];
  const p = analyse(brief);
  const okMedium = p.reading.medium === wantMedium;
  const okEngine = !wantEngine || p.reading.engine === wantEngine;
  if (okMedium && okEngine) { pass += 1; continue; }
  fails.push({
    brief,
    medium: { want: wantMedium, got: p.reading.medium },
    engine: { want: wantEngine || '(any)', got: p.reading.engine },
  });
}
const total = CASES.length;
if (!fails.length) {
  console.log('路由自检：' + pass + '/' + total + ' 通过');
  process.exit(0);
}
console.log('路由自检：' + pass + '/' + total + ' 通过，' + fails.length + ' 条不符');
for (const f of fails) {
  console.log('');
  console.log('  需求: ' + f.brief);
  console.log('    形态 期望 ' + f.medium.want + '  实际 ' + f.medium.got + (f.medium.want === f.medium.got ? '  ok' : '  <-- 不符'));
  if (f.engine.want !== '(any)') console.log('    引擎 期望 ' + f.engine.want + '  实际 ' + f.engine.got + (f.engine.want === f.engine.got ? '  ok' : '  <-- 不符'));
}
process.exit(1);
