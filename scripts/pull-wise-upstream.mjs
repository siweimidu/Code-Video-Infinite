#!/usr/bin/env node
// 用 GitHub API 拉取官方 WiseWong6/wise-motion 的 catalog，与本地比对（--apply 时才写入）
// node scripts/pull-wise-upstream.mjs [--apply]
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LOCAL = path.join(ROOT, 'engines/wise-motion/catalog');
const APPLY = process.argv.includes('--apply');
const token = execSync('gh auth token', { encoding: 'utf8' }).trim();
const H = { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json', 'User-Agent': 'cvi' };

const treeRes = await fetch('https://api.github.com/repos/WiseWong6/wise-motion/git/trees/main?recursive=1', { headers: H });
if (!treeRes.ok) { console.error('tree 拉取失败', treeRes.status); process.exit(1); }
const tree = await treeRes.json();
const files = tree.tree.filter((t) => t.type === 'blob' && t.path.startsWith('catalog/'));
console.log('[upstream] catalog 文件数:', files.length);

let missing = 0, differ = 0, same = 0;
const todo = [];
for (const f of files) {
  const rel = f.path.slice('catalog/'.length);
  const local = path.join(LOCAL, rel);
  if (!fs.existsSync(local)) { missing += 1; todo.push(f); continue; }
  const sz = fs.statSync(local).size;
  if (sz !== f.size) { differ += 1; todo.push(f); } else { same += 1; }
}
console.log('[upstream] 本地缺失 ' + missing + '，大小不同 ' + differ + '，一致 ' + same);
console.log('[upstream] 待处理示例:', todo.slice(0, 8).map((f) => f.path + ' (' + f.size + ')').join(' | '));

if (!APPLY) process.exit(0);

/* 下载所有待处理文件（blob API，base64） */
let ok = 0, fail = 0;
for (const f of todo) {
  const rel = f.path.slice('catalog/'.length);
  const out = path.join(LOCAL, rel);
  try {
    const r = await fetch('https://api.github.com/repos/WiseWong6/wise-motion/git/blobs/' + f.sha, { headers: H });
    if (!r.ok) throw new Error(String(r.status));
    const j = await r.json();
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, Buffer.from(j.content, j.encoding === 'base64' ? 'base64' : 'utf8'));
    ok += 1;
    if (ok % 50 === 0) console.log('[upstream] 已写 ' + ok + '/' + todo.length);
  } catch (e) { fail += 1; console.log('  FAIL ' + f.path + ' ' + e.message); }
}
console.log('[upstream] 写入完成: ' + ok + ' 成功, ' + fail + ' 失败');
