#!/usr/bin/env node
// 把 shotcraft 的镜头卡 demo 渲染成 mp4（Remotion 真渲染，30fps 流畅，不是录屏）。
// node scripts/build-shot-videos.mjs [--limit N] [--slug id] [--force] [--scale 0.667] [--crf 26]
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEMOS = path.join(ROOT, 'engines/shotcraft/demos');
const OUT = path.join(ROOT, 'gallery', 'videos');
const PROJ = path.join(os.tmpdir(), 'cvi-remotion');
const argv = process.argv.slice(2);
const num = (f, d) => { const i = argv.indexOf(f); return i >= 0 && argv[i + 1] !== undefined ? Number(argv[i + 1]) : d; };
const str = (f, d) => { const i = argv.indexOf(f); return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : d; };
const LIMIT = num('--limit', 0), SCALE = num('--scale', 0.667), CRF = num('--crf', 26), CONC = num('--concurrency', 4);
const ONLY = str('--slug', null), FORCE = argv.includes('--force');
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome'].find((p) => fs.existsSync(p));

function collect() {
  const out = [];
  for (const cat of fs.readdirSync(DEMOS, { withFileTypes: true })) {
    if (!cat.isDirectory() || cat.name.startsWith('_')) continue;
    const dir = path.join(DEMOS, cat.name);
    for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!d.isDirectory()) continue;
      const files = fs.readdirSync(path.join(dir, d.name)).filter((f) => f.endsWith('.tsx'));
      if (files.length) out.push({ slug: d.name, file: path.join(dir, d.name, files[0]) });
    }
  }
  return out;
}

async function harness(demos) {
  const SRC = path.join(PROJ, 'src');
  for (const s of ['fixtures', 'textures', 'extra', 'demos']) fs.mkdirSync(path.join(SRC, s), { recursive: true });
  fs.mkdirSync(path.join(PROJ, 'public/textures/live'), { recursive: true });
  for (const f of fs.readdirSync(path.join(DEMOS, '_fixtures'))) fs.copyFileSync(path.join(DEMOS, '_fixtures', f), path.join(SRC, 'fixtures', f));
  const tj = path.join(DEMOS, '_textures', 'live-layout.json');
  if (fs.existsSync(tj)) fs.copyFileSync(tj, path.join(SRC, 'textures/live-layout.json'));
  for (const f of fs.readdirSync(path.join(DEMOS, '_textures'))) {
    if (/\.(png|jpe?g|webp)$/i.test(f)) fs.copyFileSync(path.join(DEMOS, '_textures', f), path.join(PROJ, 'public/textures/live', f));
  }
  const lib = path.join(ROOT, 'engines/shotcraft/assets/lib');
  for (const name of ['ClipCard', 'VerticalTicker']) {
    for (const ext of ['.tsx', '.ts']) {
      const s = path.join(lib, name + ext);
      if (fs.existsSync(s)) { fs.copyFileSync(s, path.join(SRC, 'extra', name + ext)); break; }
    }
  }
  fs.writeFileSync(path.join(PROJ, 'package.json'), JSON.stringify({
    name: 'cvi-remotion-harness', private: true, version: '1.0.0',
    dependencies: { '@remotion/bundler': '4.0.484', '@remotion/renderer': '4.0.484', '@remotion/motion-blur': '4.0.484', react: '19.2.7', 'react-dom': '19.2.7', remotion: '4.0.484' },
    devDependencies: { '@types/react': '19.2.17', typescript: '6.0.3' },
  }, null, 2));
  fs.writeFileSync(path.join(PROJ, 'tsconfig.json'), JSON.stringify({
    compilerOptions: { target: 'ES2020', module: 'ESNext', moduleResolution: 'bundler', jsx: 'react-jsx', strict: false, skipLibCheck: true, esModuleInterop: true, allowJs: true, resolveJsonModule: true, noEmit: true }, include: ['src'],
  }, null, 2));
  const L = ["import React from 'react';", "import { Composition } from 'remotion';"];
  demos.forEach((d, i) => {
    let code = fs.readFileSync(d.file, 'utf8');
    code = code.split("'../../_fixtures/").join("'../fixtures/").split('"../../_fixtures/').join('"../fixtures/');
    code = code.split("'../../_textures/").join("'../textures/").split('"../../_textures/').join('"../textures/');
    code = code.split("'../../../assets/lib/").join("'../extra/").split('"../../../assets/lib/').join('"../extra/');
    code = code.split("'./VerticalTicker'").join("'../extra/VerticalTicker'");
    fs.writeFileSync(path.join(SRC, 'demos', d.slug + '.tsx'), code);
    L.push('import * as demo' + i + " from './demos/" + d.slug + "';");
  });
  L.push('');
  L.push("const pickComp = (m: any) => Object.keys(m).map((k) => (m as any)[k]).find((v) => typeof v === 'function');");
  L.push("const pickDur = (m: any) => { const n = Object.keys(m).map((k) => (m as any)[k]).filter((v) => typeof v === 'number'); return n.length ? (n[0] as number) : 150; };");
  L.push('export const RemotionRoot: React.FC = () => (<>');
  demos.forEach((d, i) => L.push('  <Composition id="' + d.slug + '" component={pickComp(demo' + i + ') as any} durationInFrames={pickDur(demo' + i + ')} fps={30} width={1920} height={1080} />'));
  L.push('</>);');
  fs.writeFileSync(path.join(SRC, 'Root.tsx'), L.join('\n'));
  fs.writeFileSync(path.join(SRC, 'index.ts'), "import { registerRoot } from 'remotion';\nimport { RemotionRoot } from './Root';\nregisterRoot(RemotionRoot);\n");
}

const all = collect();
fs.mkdirSync(OUT, { recursive: true });
let targets = ONLY ? all.filter((d) => d.slug === ONLY) : all.filter((d) => FORCE || !fs.existsSync(path.join(OUT, 'shot-' + d.slug + '.mp4')));
if (LIMIT) targets = targets.slice(0, LIMIT);
console.log('[shot-video] demo ' + all.length + '，本次 ' + targets.length);
if (!targets.length) process.exit(0);

if (argv.includes('--rebuild') || !fs.existsSync(path.join(PROJ, 'node_modules'))) {
  console.log('[shot-video] 生成工程…');
  await harness(all);
  if (!fs.existsSync(path.join(PROJ, 'node_modules'))) {
    await new Promise((res) => {
      const p = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['install', '--no-audit', '--no-fund'], { cwd: PROJ, stdio: 'inherit', shell: process.platform === 'win32' });
      p.on('close', res);
    });
  }
} else {
  await harness(all);
}

process.chdir(PROJ);
const req = createRequire(path.join(PROJ, 'package.json'));
const { bundle } = req('@remotion/bundler');
const { selectComposition, renderMedia } = req('@remotion/renderer');
console.log('[shot-video] bundle…');
const serveUrl = await bundle({ entryPoint: path.join(PROJ, 'src/index.ts') });
console.log('[shot-video] bundle ok');

let ok = 0, fail = 0;
const t0 = Date.now();
for (let i = 0; i < targets.length; i++) {
  const d = targets[i];
  const outFile = path.join(OUT, 'shot-' + d.slug + '.mp4');
  try {
    const composition = await selectComposition({ serveUrl, id: d.slug, browserExecutable: CHROME || null });
    await renderMedia({
      composition, serveUrl, codec: 'h264', outputLocation: outFile,
      scale: SCALE, crf: CRF, concurrency: CONC, browserExecutable: CHROME || null, overwrite: true,
      muted: true,
    });
    ok += 1;
  } catch (e) {
    fail += 1;
    console.log('  FAIL ' + d.slug + ' :: ' + String((e && e.message) || e).slice(0, 120));
  }
  if ((i + 1) % 5 === 0 || i === targets.length - 1) {
    const per = (Date.now() - t0) / (i + 1) / 1000;
    console.log('[shot-video] ' + (i + 1) + '/' + targets.length + ' · ' + per.toFixed(1) + 's/条 · 剩余约 ' + Math.round(per * (targets.length - i - 1) / 60) + ' 分钟');
  }
}
console.log('[shot-video] 完成：成功 ' + ok + ' 失败 ' + fail);
