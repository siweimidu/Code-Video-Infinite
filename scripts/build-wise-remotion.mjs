#!/usr/bin/env node
// 用 wise 自带的 Remotion 工程源码逐帧渲染 mp4（不是录屏）。
// 仅处理 source.remotion 带完整 files 的条目。
// 用法：node scripts/build-wise-remotion.mjs --id curve-path [--force] | --all
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'gallery', 'videos');
const PROJ = path.join(os.tmpdir(), 'wise-remotion');
const argv = process.argv.slice(2);
const arg = (f) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : null; };
const ONLY = arg('--id');
const ALL = argv.includes('--all');
const FORCE = argv.includes('--force');

global.MotionRemotionSources = {};
eval(fs.readFileSync(path.join(ROOT, 'engines/wise-motion/catalog/remotion-sources.js'), 'utf8'));
const SRC = globalThis.MotionRemotionSources;
const reg = JSON.parse(fs.readFileSync(path.join(ROOT, 'engines/wise-motion/catalog/registry.json'), 'utf8'));
const effects = (reg.effects || []).filter((e) => e.source && e.source.remotion && e.source.remotion.files);
fs.mkdirSync(OUT, { recursive: true });

let targets = ONLY ? effects.filter((e) => e.id === ONLY) : (ALL ? effects : []);
console.log('[remotion] 可用源码条目 ' + effects.length + '，本次 ' + targets.length);
if (!targets.length) process.exit(0);

function buildProject(group) {
  fs.mkdirSync(PROJ, { recursive: true });
  for (const e of effects) {
    for (const rel of e.source.remotion.files) {
      let code = null;
      try { code = SRC[rel]; } catch (err) { code = null; }
      if (typeof code !== 'string') continue;
      const dest = path.join(PROJ, 'src', rel);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, code);
    }
  }
  for (const e of effects) {
    for (const b of (e.source.remotion.binary_files || [])) {
      const src = path.join(ROOT, 'engines/wise-motion', b.source);
      if (!fs.existsSync(src)) continue;
      for (const rel of [path.join('public', b.target), path.join('public', 'public', b.target), b.target]) {
        const dest = path.join(PROJ, rel);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(src, dest);
      }
    }
  }
  if (!fs.existsSync(path.join(PROJ, 'package.json'))) {
    fs.writeFileSync(path.join(PROJ, 'package.json'), JSON.stringify({
      name: 'wise-remotion-harness', private: true, version: '1.0.0',
      dependencies: { remotion: '4.0.532', react: '19.3.0', 'react-dom': '19.3.0', '@remotion/cli': '4.0.532' },
      devDependencies: { '@types/react': '19.2.17', typescript: '6.0.3' },
    }, null, 2));
    fs.writeFileSync(path.join(PROJ, 'tsconfig.json'), JSON.stringify({
      compilerOptions: { target: 'ES2020', module: 'ESNext', moduleResolution: 'bundler', jsx: 'react-jsx', strict: false, skipLibCheck: true, esModuleInterop: true, allowJs: true, resolveJsonModule: true, noEmit: true },
      include: ['src'],
    }, null, 2));
  }
  const comp = group[0].source.remotion.component;
  const exp = group[0].source.remotion.export_name;
  const lines = ["import React from 'react';", "import { Composition } from 'remotion';",
    "import { " + exp + " as Comp } from './" + comp.replace(/\.jsx?$/, '') + "';",
    'export const RemotionRoot: React.FC = () => (<>'];
  group.forEach((e) => {
    const rm = e.source.remotion;
    const fps = rm.fps || 60;
    const dur = Math.max(1, Math.round(((e.duration_ms || 3000) / 1000) * fps));
    lines.push('  <Composition id="' + e.id + '" component={Comp as any} durationInFrames={' + dur + '} fps={' + fps + '} width={' + (rm.width || 1920) + '} height={' + (rm.height || 1080) + '} />');
  });
  lines.push('</>);');
  fs.mkdirSync(path.join(PROJ, 'src'), { recursive: true });
  fs.writeFileSync(path.join(PROJ, 'src/Root.tsx'), lines.join('\n'));
  fs.writeFileSync(path.join(PROJ, 'src/index.ts'), "import { registerRoot } from 'remotion';\nimport { RemotionRoot } from './Root';\nregisterRoot(RemotionRoot);\n");
}
if (!fs.existsSync(path.join(PROJ, 'node_modules'))) {
  console.log('[remotion] npm install…');
  await new Promise((res) => {
    const p = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['install', '--no-audit', '--no-fund'], { cwd: PROJ, stdio: 'inherit', shell: process.platform === 'win32' });
    p.on('close', res);
  });
}
let ok = 0, fail = 0;
const groups = {};
for (const e of targets) {
  const key = e.source.remotion.component;
  (groups[key] = groups[key] || []).push(e);
}
for (const key of Object.keys(groups)) {
  const group = groups[key];
  buildProject(group);
  for (const e of group) {
    const out = path.join(OUT, 'wise-' + e.id + '.mp4');
    if (!FORCE && fs.existsSync(out)) continue;
    const rm = e.source.remotion;
    const fps = rm.fps || 60;
    const args = ['remotion', 'render', 'src/index.ts', e.id, out, '--fps=' + fps, '--width=' + (rm.width || 1920), '--height=' + (rm.height || 1080), '--log=error'];
    const code = await new Promise((res) => {
      const p = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', args, { cwd: PROJ, stdio: 'ignore', shell: process.platform === 'win32' });
      p.on('close', res);
    });
    if (code === 0 && fs.existsSync(out)) { ok++; console.log('  OK ' + e.id + '  ' + Math.round(fs.statSync(out).size / 1024) + 'KB'); }
    else { fail++; console.log('  FAIL ' + e.id); }
  }
}
console.log('[remotion] 完成 ' + ok + ' 失败 ' + fail);
