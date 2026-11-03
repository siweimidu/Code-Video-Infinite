#!/usr/bin/env node
// 把设计系统用的两款 OFL 字体（DM Sans / JetBrains Mono）的 latin 子集下载到 gallery/fonts/，
// 并生成 gallery/_src/fonts.css（构建时内联进 index.html）。已存在则跳过，可反复运行。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'gallery', 'fonts');
const CSSOUT = path.join(ROOT, 'gallery', '_src', 'fonts.css');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

const FAMILIES = [
  { name: 'DM Sans', query: 'DM+Sans:wght@400;500;600', slug: 'dmsans' },
  { name: 'JetBrains Mono', query: 'JetBrains+Mono:wght@400;500', slug: 'jbmono' },
];

const LICENSES = [
  { file: 'OFL-DMSans.txt', url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/dmsans/OFL.txt' },
  { file: 'OFL-JetBrainsMono.txt', url: 'https://raw.githubusercontent.com/JetBrains/JetBrainsMono/master/OFL.txt' },
];

fs.mkdirSync(DIR, { recursive: true });
fs.mkdirSync(path.dirname(CSSOUT), { recursive: true });

const faces = [];

for (const fam of FAMILIES) {
  const cssUrl = 'https://fonts.googleapis.com/css2?family=' + fam.query + '&display=swap';
  let css = '';
  try {
    const res = await fetch(cssUrl, { headers: { 'User-Agent': UA } });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    css = await res.text();
  } catch (e) {
    console.log('[fonts] 取 ' + fam.name + ' CSS 失败: ' + e.message);
    continue;
  }
  const blocks = css.split('@font-face').slice(1);
  for (const b of blocks) {
    const weight = (b.match(/font-weight:\s*(\d+)/) || [])[1];
    const urlM = b.match(/url\((https:\/\/[^)]+\.woff2)\)/);
    const range = (b.match(/unicode-range:\s*([^;]+);/) || [])[1] || '';
    if (!weight || !urlM) continue;
    if (!/U\+0000-00FF/i.test(range)) continue; // 只要 latin 子集
    const file = fam.slug + '-' + weight + '.woff2';
    const dest = path.join(DIR, file);
    if (!fs.existsSync(dest)) {
      try {
        const bin = await fetch(urlM[1], { headers: { 'User-Agent': UA } });
        if (!bin.ok) throw new Error('HTTP ' + bin.status);
        fs.writeFileSync(dest, Buffer.from(await bin.arrayBuffer()));
      } catch (e) {
        console.log('[fonts] 下载 ' + file + ' 失败: ' + e.message);
        continue;
      }
    }
    faces.push({ family: fam.name, weight, file, bytes: fs.statSync(dest).size });
  }
}

for (const lic of LICENSES) {
  const dest = path.join(DIR, lic.file);
  if (fs.existsSync(dest)) continue;
  try {
    const res = await fetch(lic.url, { headers: { 'User-Agent': UA } });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    fs.writeFileSync(dest, await res.text(), 'utf8');
  } catch (e) {
    fs.writeFileSync(path.join(DIR, 'NOTICE.md'),
      '# 字体来源与许可\n\n本目录字体均为 SIL Open Font License 1.1：\n\n' +
      '- DM Sans — https://fonts.google.com/specimen/DM+Sans（OFL 全文：https://github.com/google/fonts/blob/main/ofl/dmsans/OFL.txt）\n' +
      '- JetBrains Mono — https://www.jetbrains.com/lp/mono/（OFL 全文：https://github.com/JetBrains/JetBrainsMono/blob/master/OFL.txt）\n\n' +
      '仅取 latin 子集（woff2），用于 gallery/index.html 的标题与数字；中文回落到系统字体。\n' +
      '下载失败的许可原文请按上面链接获取。\n', 'utf8');
  }
}

const css = faces.map((f) =>
  '@font-face{font-family:"' + f.family + '";font-style:normal;font-weight:' + f.weight +
  ';font-display:swap;src:url("fonts/' + f.file + '") format("woff2");}'
).join('\n');
fs.writeFileSync(CSSOUT, css + '\n', 'utf8');

console.log('[fonts] ' + faces.length + ' 个 face → gallery/fonts/  ' +
  Math.round(faces.reduce((s, f) => s + f.bytes, 0) / 1024) + ' KB');
for (const f of faces) console.log('  ' + f.family + ' ' + f.weight + '  ' + f.file + '  ' + Math.round(f.bytes / 1024) + ' KB');
