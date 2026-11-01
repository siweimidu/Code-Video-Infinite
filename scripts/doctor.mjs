#!/usr/bin/env node
// Environment + packaging self-check for Code-Video-Infinite.
// node scripts/doctor.mjs [--json]
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const asJson = process.argv.includes('--json');
const rows = [];
const add = (name, state, detail, fix) => rows.push({ name, state, detail: detail || '', fix: fix || '' });

function which(bin) {
  const exts = process.platform === 'win32' ? ['.exe', '.cmd', '.bat', ''] : [''];
  const dirs = (process.env.PATH || '').split(path.delimiter);
  for (const d of dirs) {
    for (const ext of exts) {
      const p = path.join(d, bin + ext);
      try { if (fs.statSync(p).isFile()) return p; } catch { /* keep looking */ }
    }
  }
  return null;
}

function version(bin, args) {
  const winShim = process.platform === 'win32' && /\.(cmd|bat)$/i.test(bin);
  try {
    const out = winShim
      ? execFileSync(process.env.ComSpec || 'cmd.exe', ['/c', bin, ...args], { encoding: 'utf8', timeout: 20000 })
      : execFileSync(bin, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 20000 });
    return (out.split(/\r?\n/).find((l) => l.trim()) || '').trim();
  } catch (e) {
    return '';
  }
}

// --- runtime ---------------------------------------------------------------
const nodeMajor = Number(process.versions.node.split('.')[0]);
add('node', nodeMajor >= 20 ? 'PASS' : 'FAIL', process.version + ' (要求 ≥ 20，claude-motion 要 ≥ 22)',
  'winget install OpenJS.NodeJS.LTS 或用 nvm 装 22+');

for (const bin of ['ffmpeg', 'ffprobe']) {
  const p = which(bin);
  add(bin, p ? 'PASS' : 'FAIL', p ? version(p, ['-version']).slice(0, 60) : '未找到',
    'winget install Gyan.FFmpeg，装完重开终端');
}
const py = which('python') || which('python3');
add('python', py ? 'PASS' : 'FAIL', py ? version(py, ['--version']) : '未找到', 'winget install Python.Python.3.11');
for (const bin of ['npm', 'npx', 'git']) {
  const p = which(bin);
  add(bin, p ? 'PASS' : 'WARN', p ? version(p, ['--version']).slice(0, 40) : '未找到', '随 Node.js / Git 一起安装');
}

// --- browser (frame capture needs a real Chromium) -------------------------
const browserCandidates = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
];
const playwrightCache = path.join(os.homedir(), process.platform === 'win32' ? 'AppData/Local/ms-playwright' : '.cache/ms-playwright');
let chromium = null;
for (const p of browserCandidates) if (fs.existsSync(p)) { chromium = p; break; }
let pw = null;
try {
  pw = fs.readdirSync(playwrightCache).filter((d) => /chromium/i.test(d)).map((d) => path.join(playwrightCache, d))[0] || null;
} catch { /* no playwright cache */ }
add('chromium', chromium || pw ? 'PASS' : 'WARN',
  chromium || pw || '未找到系统 Chrome/Edge，也没有 Playwright Chromium',
  'mg-motion 需要 Chrome：设 MG_CHROME；claude-motion 需 npx playwright install chromium');

// --- engine payload -------------------------------------------------------
const engines = [
  ['onetake', 'engines/onetake/lib/motion.js', 'HTML composition + 逐帧渲染 + 运镜/声音'],
  ['shotcraft', 'engines/shotcraft/template/package.json', 'Remotion 产品片 + 124 镜头卡'],
  ['claude-motion', 'engines/claude-motion/references/case-catalog.json', '47 源码案例 + 组件/模型/场景'],
  ['mg-motion', 'engines/mg-motion/mg-styles-15/harness/render.mjs', '15 种 MG 风格 + 逐帧渲染 + 机器闸'],
  ['wise-motion', 'engines/wise-motion/catalog/registry.json', '462 动效条目 + 源码导出'],
];
for (const [name, marker, note] of engines) {
  const ok = fs.existsSync(path.join(ROOT, marker));
  const doc = fs.existsSync(path.join(ROOT, 'engines', name, 'ENGINE.md'));
  add('engine:' + name, ok && doc ? 'PASS' : 'FAIL', ok && doc ? note : '缺少 ' + marker + ' 或 ENGINE.md', '重新完整解压仓库（不要只拷部分目录）');
}

// --- unified layer --------------------------------------------------------
const idx = path.join(ROOT, 'catalog/index.json');
if (fs.existsSync(idx)) {
  const d = JSON.parse(fs.readFileSync(idx, 'utf8'));
  add('catalog', d.entries.length > 800 ? 'PASS' : 'WARN', d.entries.length + ' 条 / ' + Object.keys(d.totals.byCollection).length + ' 个集合',
    'node scripts/build-catalog.mjs');
} else {
  add('catalog', 'FAIL', 'catalog/index.json 缺失', 'node scripts/build-catalog.mjs');
}
const ai = path.join(ROOT, 'catalog/assets-index.json');
if (fs.existsSync(ai)) {
  const d = JSON.parse(fs.readFileSync(ai, 'utf8'));
  add('assets', 'PASS', d.totals.files + ' 个素材 / ' + (d.totals.bytes / 1024 / 1024).toFixed(1) + ' MB');
} else {
  add('assets', 'WARN', 'assets-index.json 缺失（不影响做片）', 'node scripts/build-catalog.mjs');
}

// --- report ---------------------------------------------------------------
if (asJson) {
  console.log(JSON.stringify({ platform: process.platform, node: process.version, rows }, null, 2));
} else {
  const width = Math.max(...rows.map((r) => r.name.length)) + 2;
  for (const r of rows) {
    const mark = r.state === 'PASS' ? 'OK  ' : r.state === 'WARN' ? 'WARN' : 'FAIL';
    console.log(mark + '  ' + r.name.padEnd(width) + String(r.detail).slice(0, 96));
    if (r.state !== 'PASS' && r.fix) console.log('      → ' + r.fix);
  }
  const fail = rows.filter((r) => r.state === 'FAIL').length;
  const warn = rows.filter((r) => r.state === 'WARN').length;
  console.log('\n' + (fail ? 'FAIL ' + fail : '全部通过') + (warn ? ' · WARN ' + warn : '') + ' · 共 ' + rows.length + ' 项');
  console.log('引擎用法见 SKILL.md；单引擎纵深文档在 engines/<engine>/ENGINE.md');
}
process.exit(rows.some((r) => r.state === 'FAIL') ? 1 : 0);
