#!/usr/bin/env node
// 网页类产物的交付前闸（M2 网页视频 / M3 网页制品 / M4 长文）
// node scripts/check-web.mjs <file.html> [--json] [--max-mb 8] [--allow-cdn]
import fs from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const asJson = argv.includes('--json');
const allowCdn = argv.includes('--allow-cdn');
let maxMb = 8;
{
  const i = argv.indexOf('--max-mb');
  if (i !== -1 && argv[i + 1]) maxMb = Number(argv[i + 1]) || 8;
}
const file = argv.filter((a) => !a.startsWith('--') && !/^\d+$/.test(a))[0];
if (!file || !fs.existsSync(file)) {
  console.error('用法: node scripts/check-web.mjs <file.html> [--max-mb 8] [--allow-cdn] [--json]');
  process.exit(2);
}

const html = fs.readFileSync(file, 'utf8');
const bytes = Buffer.byteLength(html);
const checks = [];
const add = (key, state, detail, hint) => checks.push({ key, state, detail, hint: hint || '' });

// 1 单文件 / 外部依赖
const extRefs = [];
for (const m of html.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/gi)) {
  const u = m[1];
  if (/^(https?:)?\/\//i.test(u) || /^data:/i.test(u) || u.startsWith('#') || u.startsWith('mailto:')) {
    if (/^(https?:)?\/\//i.test(u)) extRefs.push(u);
  }
}
const remoteAssets = extRefs.filter((u) => /\.(js|css|woff2?|ttf|png|jpe?g|webp|svg|mp4)(\?|$)/i.test(u));
add('single-file', remoteAssets.length === 0 || allowCdn ? 'PASS' : 'WARN',
  remoteAssets.length ? remoteAssets.length + ' 个外部资源' : '无外部资源引用（可离线打开）',
  '要可离线分享就把资源内联；确实要走 CDN 就加 --allow-cdn 并在交付说明里写明');

// 2 体积
add('size', bytes <= maxMb * 1024 * 1024 ? 'PASS' : 'WARN', (bytes / 1024 / 1024).toFixed(2) + ' MB',
  '单页超过 ' + maxMb + 'MB 时打开会卡；把大图压到 webp 或拆页');

// 3 基础 HTML 结构
const hasTitle = /<title>[^<]{2,}<\/title>/i.test(html);
const hasLang = /<html[^>]+lang\s*=/i.test(html);
const hasViewport = /name\s*=\s*["']viewport["']/i.test(html);
add('title', hasTitle ? 'PASS' : 'FAIL', hasTitle ? '有' : '缺 <title>');
add('lang', hasLang ? 'PASS' : 'WARN', hasLang ? '有' : '缺 <html lang>', '中文页面写 lang="zh-CN"');
add('viewport', hasViewport ? 'PASS' : 'WARN', hasViewport ? '有' : '缺 viewport', '移动端打开会缩放错');

// 4 可读性 / 设计底线
const inlineStyle = (html.match(/style\s*=\s*["']/gi) || []).length;
const styleBlocks = (html.match(/<style/gi) || []).length;
add('css', styleBlocks > 0 || inlineStyle > 0 ? 'PASS' : 'WARN', 'style 块 ' + styleBlocks + ' 个 / 行内 ' + inlineStyle + ' 处');
const emoji = (html.match(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu) || []).length;
add('emoji', emoji <= 3 ? 'PASS' : 'WARN', emoji + ' 个 emoji', '标题里堆 emoji 是典型的 AI 味；用图形或图标替代');
const fonts = new Set();
for (const m of html.matchAll(/font-family\s*:\s*([^;}]+)/gi)) fonts.add(m[1].trim().slice(0, 40));
add('fonts', fonts.size <= 3 ? 'PASS' : 'WARN', fonts.size + ' 组 font-family', '超过 3 组字体就会散；正文一套 + 标题一套足够');

// 5 动画确定性（视频类页面）
const hasTimeApi = /requestAnimationFrame|__seek|renderAt|setInterval/.test(html);
add('time-api', hasTimeApi ? 'PASS' : 'WARN', hasTimeApi ? '有动画/时间驱动入口' : '没有时间驱动入口', '如果这张页面要录屏成视频，必须有可 seek 的纯时间入口');

// 6 占位符残留
const todo = (html.match(/TODO|FIXME|lorem ipsum|占位|placeholder text/gi) || []).length;
add('placeholder', todo === 0 ? 'PASS' : 'WARN', todo ? todo + ' 处未清理' : '无', '交付前把 lorem/占位文案换成真内容');

const fails = checks.filter((c) => c.state === 'FAIL');
const warns = checks.filter((c) => c.state === 'WARN');
if (asJson) {
  console.log(JSON.stringify({ file, bytes, checks, ok: fails.length === 0 }, null, 2));
} else {
  console.log('检查 ' + path.basename(file) + '  (' + (bytes / 1024).toFixed(1) + ' KB)');
  for (const c of checks) {
    const mark = c.state === 'PASS' ? 'OK  ' : c.state === 'WARN' ? 'WARN' : 'FAIL';
    console.log('  ' + mark + '  ' + c.key.padEnd(13) + c.detail);
    if (c.state !== 'PASS' && c.hint) console.log('        → ' + c.hint);
  }
  console.log('\n' + (fails.length ? 'FAIL ' + fails.length : '无致命问题') + (warns.length ? ' · WARN ' + warns.length : '') + ' · 共 ' + checks.length + ' 项');
}
process.exit(fails.length ? 1 : 0);
