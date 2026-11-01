#!/usr/bin/env node
// Markdown + code-span path checker for the merged skill.
// node scripts/check-links.mjs [--all] [--json]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TICK = String.fromCharCode(96);
const SPAN = new RegExp(TICK + '([^' + TICK + '\\n]+)' + TICK, 'g');
const all = process.argv.includes('--all');
const asJson = process.argv.includes('--json');

function walk(dir, acc) {
  acc = acc || [];
  if (!fs.existsSync(dir)) return acc;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.toLowerCase().endsWith('.md')) acc.push(p);
  }
  return acc;
}

const targets = [];
for (const f of ['SKILL.md', 'README.md', 'LICENSES.md']) {
  const p = path.join(ROOT, f);
  if (fs.existsSync(p)) targets.push(p);
}
for (const f of walk(path.join(ROOT, 'references'))) targets.push(f);
const engineRoot = path.join(ROOT, 'engines');
const engines = fs.existsSync(engineRoot)
  ? fs.readdirSync(engineRoot, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)
  : [];
for (const e of engines) {
  const p = path.join(engineRoot, e, 'ENGINE.md');
  if (fs.existsSync(p)) targets.push(p);
  if (all) for (const f of walk(path.join(engineRoot, e))) targets.push(f);
}

const LINK = /\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
const KNOWN = /^(engines|scripts|references|catalog)\//;
const ROOTFILE = /^(spec\.json|SKILL\.md|README\.md|LICENSES\.md)$/;
const PLACEHOLDER = /[<>*\{\[\]$]/;
const problems = [];
let checked = 0;

for (const file of targets) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    for (const m of lines[i].matchAll(LINK)) {
      let target = m[1];
      if (/^(https?:|mailto:|tel:|data:)/i.test(target)) continue;
      if (target.startsWith('#')) continue;
      target = target.split('#')[0];
      if (!target) continue;
      checked += 1;
      let decoded = target;
      try { decoded = decodeURI(target); } catch (err) { decoded = target; }
      const abs = path.resolve(path.dirname(file), decoded);
      if (!fs.existsSync(abs)) {
        problems.push({
          file: path.relative(ROOT, file).split(path.sep).join('/'),
          line: i + 1,
          target,
          reason: abs.startsWith(ROOT) ? '目标不存在' : '指向仓库外',
        });
      }
    }
    for (const m of lines[i].matchAll(SPAN)) {
      const span = m[1].trim();
      if (!span || span.includes(' ') || PLACEHOLDER.test(span)) continue;
      const head = span.split(/[?#]/)[0];
      if (!KNOWN.test(head) && !ROOTFILE.test(head)) continue;
      checked += 1;
      const local = path.resolve(path.dirname(file), head);
      if (!fs.existsSync(path.resolve(ROOT, head)) && !fs.existsSync(local)) {
        problems.push({ file: path.relative(ROOT, file).split(path.sep).join('/'), line: i + 1, target: head, reason: '代码里的路径不存在' });
      }
    }
  }
}

const grouped = {};
for (const p of problems) {
  grouped[p.file] = grouped[p.file] || [];
  grouped[p.file].push(p);
}

if (asJson) {
  console.log(JSON.stringify({ files: targets.length, links: checked, broken: problems.length, problems }, null, 2));
} else {
  console.log('检查 ' + targets.length + ' 个文档，' + checked + ' 条路径引用');
  if (!problems.length) {
    console.log('全部可达。');
  } else {
    for (const f of Object.keys(grouped)) {
      console.log('');
      console.log(f + '  (' + grouped[f].length + ')');
      for (const p of grouped[f].slice(0, 12)) console.log('  L' + p.line + '  ' + p.reason + '  -> ' + p.target);
      if (grouped[f].length > 12) console.log('  ...还有 ' + (grouped[f].length - 12) + ' 条');
    }
    console.log('');
    console.log('合计 ' + problems.length + ' 条问题。');
  }
}
process.exit(problems.length ? 1 : 0);
