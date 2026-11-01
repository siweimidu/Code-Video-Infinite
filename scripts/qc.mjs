#!/usr/bin/env node
// One gate for all five engines.
//   node scripts/qc.mjs measure <video> [--json]
//   node scripts/qc.mjs gate <video> [--spec spec.json] [--json]
//   node scripts/qc.mjs delegate <engine> -- <该引擎自己的闸参数>
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const cmd = argv.shift();

const DEFAULT_SPEC = {
  width: 1920,
  height: 1080,
  fps: 30,
  lufs: -14,
  lufsTolerance: 2.5,
  truePeakMax: -1.0,
  frozenRatioMax: 0.85,
  blackSecondsMax: 0.8,
  requireAudio: true,
};

// ffmpeg writes its measurements to stderr, so merge both streams.
function run(bin, args) {
  const r = spawnSync(bin, args, { encoding: 'utf8', maxBuffer: 128 * 1024 * 1024 });
  return String(r.stdout || '') + String(r.stderr || '');
}

function ffprobe(file) {
  const raw = run('ffprobe', ['-v', 'error', '-print_format', 'json', '-show_format', '-show_streams', file]);
  let d = {};
  try { d = JSON.parse(raw); } catch { return null; }
  const v = (d.streams || []).find((s) => s.codec_type === 'video') || {};
  const a = (d.streams || []).find((s) => s.codec_type === 'audio') || null;
  const fpsRaw = v.avg_frame_rate || v.r_frame_rate || '0/0';
  const [n, dn] = fpsRaw.split('/').map(Number);
  return {
    duration: Number(d.format && d.format.duration) || 0,
    bytes: Number(d.format && d.format.size) || 0,
    container: (d.format && d.format.format_name) || '',
    width: v.width || 0,
    height: v.height || 0,
    fps: dn ? Math.round((n / dn) * 1000) / 1000 : 0,
    videoCodec: v.codec_name || '',
    audioCodec: a ? a.codec_name || '' : '',
    audioSampleRate: a ? Number(a.sample_rate) || 0 : 0,
  };
}

function loudness(file) {
  const out = run('ffmpeg', ['-nostats', '-hide_banner', '-i', file, '-map', '0:a:0', '-af', 'ebur128=peak=true', '-f', 'null', '-']);
  const tail = out.slice(Math.max(0, out.lastIndexOf('Summary')));
  const grab = (re) => { const m = tail.match(re); return m ? Number(m[1]) : null; };
  return {
    lufs: grab(/I:\s*(-?[\d.]+)\s*LUFS/),
    lra: grab(/LRA:\s*(-?[\d.]+)\s*LU/),
    truePeak: grab(/Peak:\s*(-?[\d.]+)\s*dBFS/),
  };
}

function blackAndFreeze(file) {
  const out = run('ffmpeg', ['-nostats', '-hide_banner', '-i', file, '-an',
    '-vf', 'blackdetect=d=0.1:pix_th=0.10,freezedetect=n=0.003:d=0.5', '-f', 'null', '-']);
  const blacks = [];
  for (const m of out.matchAll(/black_start:([\d.]+)\s+black_end:([\d.]+)\s+black_duration:([\d.]+)/g)) {
    blacks.push({ start: Number(m[1]), end: Number(m[2]), duration: Number(m[3]) });
  }
  const freezes = [];
  for (const m of out.matchAll(/freeze_start:\s*([\d.]+)[\s\S]*?freeze_duration:\s*([\d.]+)/g)) {
    freezes.push({ start: Number(m[1]), duration: Number(m[2]) });
  }
  return {
    blackSeconds: blacks.reduce((s, b) => s + b.duration, 0),
    longestBlack: blacks.reduce((s, b) => Math.max(s, b.duration), 0),
    blackSegments: blacks.length,
    frozenSeconds: freezes.reduce((s, f) => s + f.duration, 0),
    freezeSegments: freezes.length,
  };
}

function measure(file) {
  if (!fs.existsSync(file)) { console.error('找不到文件: ' + file); process.exit(2); }
  const base = ffprobe(file);
  if (!base) { console.error('ffprobe 读不了: ' + file); process.exit(2); }
  const loud = base.audioCodec ? loudness(file) : { lufs: null, lra: null, truePeak: null };
  const vis = blackAndFreeze(file);
  return Object.assign(base, loud, vis, {
    frozenRatio: base.duration ? Math.round((vis.frozenSeconds / base.duration) * 1000) / 1000 : 0,
  });
}

function gate(file, specPath) {
  const spec = Object.assign({}, DEFAULT_SPEC);
  if (specPath) {
    if (!fs.existsSync(specPath)) { console.error('找不到 spec: ' + specPath); process.exit(2); }
    Object.assign(spec, JSON.parse(fs.readFileSync(specPath, 'utf8')));
  }
  const m = measure(file);
  const checks = [];
  const add = (key, want, got, pass, note) => checks.push({ key, want, got, state: pass ? 'PASS' : 'FAIL', note: note || '' });
  add('width', spec.width, m.width, m.width === spec.width);
  add('height', spec.height, m.height, m.height === spec.height);
  add('fps', spec.fps, m.fps, Math.abs(m.fps - spec.fps) < 0.05);
  if (spec.requireAudio) add('audio', '有音轨', m.audioCodec || '无', !!m.audioCodec);
  if (m.lufs != null) {
    add('lufs', spec.lufs + ' ± ' + spec.lufsTolerance, m.lufs,
      Math.abs(m.lufs - spec.lufs) <= spec.lufsTolerance, '响度目标；低于下限=太轻，高于上限=太响');
    add('truePeak', '≤ ' + spec.truePeakMax + ' dBTP', m.truePeak,
      m.truePeak != null && m.truePeak <= spec.truePeakMax, 'AAC 编码后还会抬一点，留 1 dB 余量');
  } else if (spec.requireAudio) {
    add('lufs', spec.lufs + ' ± ' + spec.lufsTolerance, '无音轨', false);
  }
  add('black', '≤ ' + spec.blackSecondsMax + 's', m.blackSeconds.toFixed(2) + 's', m.blackSeconds <= spec.blackSecondsMax);
  add('frozen', '≤ ' + Math.round(spec.frozenRatioMax * 100) + '% 时长', Math.round(m.frozenRatio * 100) + '%',
    m.frozenRatio <= spec.frozenRatioMax, '太高=像 PPT；太低=没有留白让爆点落下');
  const fails = checks.filter((c) => c.state === 'FAIL');
  return { file, spec, metrics: m, checks, ok: fails.length === 0 };
}

function delegate(engine, rest) {
  const map = {
    'mg-motion': ['node', ['engines/mg-motion/scripts/mg-qc.mjs']],
    onetake: ['python', ['engines/onetake/scripts/verify_promo.py']],
  };
  const entry = map[engine];
  if (!entry) {
    console.log(engine + ' 没有独立机器闸。用它自己的交付清单：');
    for (const f of ['engines/' + engine + '/ENGINE.md']) {
      if (fs.existsSync(path.join(ROOT, f))) console.log('  ' + f);
    }
    console.log('通用机器闸仍可用: node scripts/qc.mjs gate <video>');
    process.exit(0);
  }
  const [bin, base] = entry;
  const args = base.concat(rest);
  console.log('执行: ' + bin + ' ' + args.join(' '));
  try {
    execFileSync(bin, args, { cwd: ROOT, stdio: 'inherit' });
  } catch (e) {
    process.exit(e.status || 1);
  }
}

if (!cmd || cmd === '-h' || cmd === '--help') {
  console.log('用法:');
  console.log('  node scripts/qc.mjs measure <video> [--json]     实测时长/画幅/fps/LUFS/真峰值/黑帧/静帧');
  console.log('  node scripts/qc.mjs gate <video> [--spec s.json]  按默认或给定 spec 出 PASS/FAIL');
  console.log('  node scripts/qc.mjs delegate mg-motion|onetake -- <参数…>  调该引擎自己的闸');
  process.exit(cmd ? 0 : 2);
}

if (cmd === 'measure' || cmd === 'gate') {
  const rest = argv.filter((a) => a !== '--json');
  const file = rest[0];
  if (!file) { console.error('缺少 <video>'); process.exit(2); }
  const specIdx = rest.indexOf('--spec');
  const specPath = specIdx !== -1 ? rest[specIdx + 1] : null;
  const result = cmd === 'measure' ? measure(file) : gate(file, specPath);
  if (argv.includes('--json')) { console.log(JSON.stringify(result, null, 2)); process.exit(cmd === 'gate' && !result.ok ? 1 : 0); }
  const m = cmd === 'measure' ? result : result.metrics;
  console.log('文件 ' + file);
  console.log('  ' + m.width + 'x' + m.height + ' · ' + m.fps + 'fps · ' + m.duration.toFixed(2) + 's · ' + (m.bytes / 1024 / 1024).toFixed(1) + 'MB · ' + m.videoCodec + (m.audioCodec ? ' + ' + m.audioCodec : ' · 无声'));
  if (m.lufs != null) console.log('  响度 ' + m.lufs + ' LUFS · LRA ' + m.lra + ' LU · 真峰值 ' + m.truePeak + ' dBTP');
  console.log('  黑帧 ' + m.blackSeconds.toFixed(2) + 's (最长 ' + m.longestBlack.toFixed(2) + 's) · 静帧 ' + m.frozenSeconds.toFixed(2) + 's (' + Math.round(m.frozenRatio * 100) + '%)');
  if (cmd === 'gate') {
    console.log('\n闸门:');
    for (const c of result.checks) console.log('  ' + (c.state === 'PASS' ? 'OK  ' : 'FAIL') + '  ' + c.key.padEnd(9) + '要 ' + String(c.want).padEnd(16) + '实测 ' + c.got + (c.state === 'FAIL' && c.note ? '  ← ' + c.note : ''));
    console.log('\n' + (result.ok ? '通过。' : '未通过，改片子或改 spec，不要绕过闸。'));
  }
  process.exit(cmd === 'gate' && !result.ok ? 1 : 0);
}

if (cmd === 'delegate') {
  const engine = argv[0];
  const rest = argv.slice(argv.indexOf('--') + 1);
  delegate(engine, argv.includes('--') ? rest : []);
  process.exit(0);
}

console.error('未知命令: ' + cmd);
process.exit(2);
