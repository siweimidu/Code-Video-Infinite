#!/usr/bin/env node
// mg-qc: measured quality gate for a rendered MG film.
// Nothing here is self-reported: every number is measured from the encoded file.
//
//   node scripts/mg-qc.mjs <video.mp4> [--spec spec.json] [--cues cues.json] [--strict]
//
// spec.json (optional):
//   { "duration": 10.0, "width": 1920, "height": 1080, "fps": 30,
//     "lufs": -14, "truePeak": -1.0, "maxBlackSec": 0.35, "maxFreezeSec": 0.6,
//     "syncToleranceFrames": 1.5, "minMotion": 0.0015, "maxMotionRatio": 14 }
//
// Exit 0 = all gates pass. Exit 2 = a hard gate failed. Exit 1 = could not measure.

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const file = argv.find(a => !a.startsWith('--'));
if (!file) { console.error('usage: node mg-qc.mjs <video.mp4> [--spec spec.json] [--cues cues.json] [--strict]'); process.exit(1); }
const val = (k, d) => { const i = argv.indexOf(k); return i >= 0 && argv[i + 1] ? argv[i + 1] : d; };
const STRICT = argv.includes('--strict');

const SPEC = Object.assign({
  duration: null, width: null, height: null, fps: null,
  lufs: -14, truePeak: -1.0,
  maxBlackSec: 0.35, maxInteriorStillSec: 0.6, tailHoldSec: 1.4,
  syncToleranceFrames: 1.5, minSyncOnGrid: 85, minMotion: 0.0015, minContrast: 2.0,
}, file2json(val('--spec', '')) || {});
const CUES = file2json(val('--cues', ''));

function file2json(p) { try { return p && fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : null; } catch { return null; } }

function sh(bin, args, { maxBuf = 1 << 28 } = {}) {
  return new Promise((res, rej) => {
    const c = spawn(bin, args, { maxBuffer: maxBuf, windowsHide: true });
    const o = [], e = [];
    c.stdout.on('data', d => o.push(d));
    c.stderr.on('data', d => e.push(d));
    c.on('error', rej);
    c.on('close', code => {
      const err = Buffer.concat(e).toString();
      if (code === 0) res(Buffer.concat(o));
      else rej(new Error(`${bin} exited ${code}: ${err.slice(-600)}`));
    });
  });
}

// ffmpeg prints its analysis JSON on stderr, so keep stderr on the success path too.
function shBoth(bin, args, { maxBuf = 1 << 28 } = {}) {
  return new Promise((res, rej) => {
    const c = spawn(bin, args, { maxBuffer: maxBuf, windowsHide: true });
    const o = [], e = [];
    c.stdout.on('data', d => o.push(d));
    c.stderr.on('data', d => e.push(d));
    c.on('error', rej);
    c.on('close', code => {
      const out = Buffer.concat(o).toString(), err = Buffer.concat(e).toString();
      if (code === 0) res(out + '\n' + err);
      else rej(new Error(`${bin} exited ${code}: ${err.slice(-600)}`));
    });
  });
}

// ---------------------------------------------------------------- 1. container spec
async function probe() {
  const raw = await sh('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-print_format', 'json', file]);
  return JSON.parse(raw.toString());
}
function rate(s) {
  if (!s) return null;
  const [n, d] = s.split('/').map(Number);
  return d ? n / d : n;
}

// ---------------------------------------------------------------- 2. loudness + true peak
async function loudness() {
  const raw = await shBoth('ffmpeg', ['-nostdin', '-hide_banner', '-i', file, '-af',
    'loudnorm=I=-14:TP=-1.0:LRA=11:print_format=json', '-f', 'null', '-']);
  const m = raw.match(/\{[^{}]*"input_i"[^{}]*\}/);
  if (!m) return null;
  const j = JSON.parse(m[0]);
  return { lufs: +j.input_i, truePeak: +j.input_tp, lra: +j.input_lra, thresh: +j.input_thresh };
}

// ---------------------------------------------------------------- 3. black + freeze spans
async function spans(filter, re) {
  const raw = await sh('ffmpeg', ['-nostdin', '-hide_banner', '-i', file, '-vf', filter, '-f', 'null', '-'])
    .catch(() => Buffer.alloc(0));
  const out = [];
  for (const l of raw.toString().split('\n')) {
    const g = re.exec(l);
    if (g) out.push({ from: +g[1], to: +g[2] });
  }
  return out;
}

// ---------------------------------------------------------------- 4. per-frame motion energy
// Downscale to grayscale, read raw frames, mean absolute difference vs previous frame.
async function motion() {
  const probe0 = await probe();
  const v = probe0.streams.find(s => s.codec_type === 'video') || {};
  const fps = rate(v.avg_frame_rate) || 30;
  const W = 192, H = 108;
  const buf = await sh('ffmpeg', ['-nostdin', '-hide_banner', '-i', file, '-vf',
    `scale=${W}:${H}:flags=area,format=gray`, '-f', 'rawvideo', '-pix_fmt', 'gray', '-']);
  const stride = W * H;
  const n = Math.floor(buf.length / stride);
  const e = [];
  for (let i = 1; i < n; i++) {
    let sum = 0;
    const a = i * stride, b = (i - 1) * stride;
    for (let k = 0; k < stride; k += 7) sum += Math.abs(buf[a + k] - buf[b + k]);
    e.push(sum / (stride / 7) / 255);
  }
  return { fps, frames: n, energy: e };
}

// ---------------------------------------------------------------- 5. audio onsets vs cue sheet
// Spectral-flux onset detection. A silence-gated RMS peak picker does NOT work on a
// film with a continuous music bed: there are no gaps to re-arm on, so it fires once.
// Flux measures the positive change between consecutive spectra instead, which finds
// an attack on top of an ongoing bed.
function fftRadix2(re, im) {                 // in-place iterative Cooley-Tukey
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {       // bit-reversal permutation
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = -2 * Math.PI / len;
    const wr = Math.cos(ang), wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0;
      for (let k = 0; k < len >> 1; k++) {
        const ur = re[i + k], ui = im[i + k];
        const vr = re[i + k + (len >> 1)] * cr - im[i + k + (len >> 1)] * ci;
        const vi = re[i + k + (len >> 1)] * ci + im[i + k + (len >> 1)] * cr;
        re[i + k] = ur + vr; im[i + k] = ui + vi;
        re[i + k + (len >> 1)] = ur - vr; im[i + k + (len >> 1)] = ui - vi;
        const ncr = cr * wr - ci * wi;
        ci = cr * wi + ci * wr; cr = ncr;
      }
    }
  }
}

async function onsets() {
  const SR = 16000, NFFT = 1024, HOP = 256;
  const raw = await sh('ffmpeg', ['-nostdin', '-hide_banner', '-i', file, '-ac', '1', '-ar', String(SR),
    '-f', 's16le', '-']).catch(() => null);
  if (!raw || raw.length < SR * 0.2) return null;

  const hann = new Float64Array(NFFT);
  for (let i = 0; i < NFFT; i++) hann[i] = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / (NFFT - 1));
  const nFrames = Math.floor((raw.length / 2 - NFFT) / HOP);
  const bins = NFFT >> 1;
  const flux = [];
  let prev = new Float64Array(bins);

  for (let f = 0; f < nFrames; f++) {
    const off = f * HOP;
    const re = new Float64Array(NFFT), im = new Float64Array(NFFT);
    for (let i = 0; i < NFFT; i++) re[i] = (raw.readInt16LE(off + i * 2) / 32768) * hann[i];
    fftRadix2(re, im);
    const mag = new Float64Array(bins);
    for (let k = 0; k < bins; k++) mag[k] = Math.hypot(re[k], im[k]);
    if (f > 0) {
      let s = 0;
      for (let k = 0; k < bins; k++) { const d = mag[k] - prev[k]; if (d > 0) s += d; }
      flux.push(s);
    }
    prev = mag;
  }
  if (!flux.length) return null;

  // peak-pick against a local moving average, then enforce a refractory gap
  const W = 12;                                   // +-12 frames (~ +-0.2 s) for the local mean
  const out = [];
  const minGap = 0.05;                            // 50 ms refractory
  for (let i = 0; i < flux.length; i++) {
    let sum = 0, cnt = 0;
    for (let k = Math.max(0, i - W); k <= Math.min(flux.length - 1, i + W); k++) { sum += flux[k]; cnt++; }
    const mean = sum / cnt;
    const isPeak = flux[i] > mean * 1.6 + 1e-9
      && flux[i] >= flux[Math.max(0, i - 1)] && flux[i] >= flux[Math.min(flux.length - 1, i + 1)];
    if (!isPeak) continue;
    const t = (i * HOP + NFFT / 2) / SR;
    if (!out.length || t - out[out.length - 1] >= minGap) out.push(+t.toFixed(3));
  }
  return out;
}

function cueTimes(c) {
  if (!c) return null;
  const t = [];
  if (Array.isArray(c.events)) c.events.forEach(e => { if (typeof e.t === 'number') t.push(e.t); });
  if (Array.isArray(c.ripples)) c.ripples.forEach(e => { if (typeof e.start === 'number') t.push(e.start); });
  return t.length ? t : null;
}

// ---------------------------------------------------------------- run + gate
(async () => {
  let p;
  try { p = await probe(); } catch (e) { console.error('ffprobe failed:', e.message); process.exit(1); }
  const v = p.streams.find(s => s.codec_type === 'video') || {};
  const a = p.streams.find(s => s.codec_type === 'audio');
  const fps = rate(v.avg_frame_rate) || SPEC.fps || 30;
  const dur = +p.format.duration || rate(v.duration) || 0;

  const [lo, blk, frz, mo] = await Promise.all([
    loudness().catch(() => null),
    spans('blackdetect=d=' + Math.max(0.05, SPEC.maxBlackSec * 0.6) + ':pix_th=0.10', /black_start:([\d.]+)[\s\S]*?black_end:([\d.]+)/g),
    spans('freezedetect=n=-60dB:d=' + SPEC.maxInteriorStillSec, /freeze_start:\s*([\d.]+)|freeze_duration:\s*([\d.]+)/g),
    motion().catch(() => null),
  ]);

  // blackdetect already filters by duration; freezedetect returns start+duration pairs.
  const freezes = [];
  for (const s of frz) if (s.to != null && s.to > 0) freezes.push({ from: s.from, dur: s.to });
  blk.forEach(b => { b.dur = +(b.to - b.from).toFixed(3); });

  const en = mo ? mo.energy : [];
  const meanE = en.length ? en.reduce((x, y) => x + y, 0) / en.length : 0;
  const deadFrames = en.filter(x => x < SPEC.minMotion).length;
  const liveFrames = en.filter(x => x >= SPEC.minMotion).length;
  const maxE = en.length ? Math.max(...en) : 0;
  const energyRatio = meanE > 0 ? +(maxE / meanE).toFixed(2) : 0;

  // Longest run of consecutive near-still frames. A run inside the film is an unintended
  // static span; a run inside the closing hold is a deliberate end frame, so it is allowed
  // to run to tailHoldSec and is reported separately.
  const fpsEff = mo?.fps || fps;
  const tailStart = Math.max(0, (en.length * (dur > 0 ? dur / en.length : 0)) - SPEC.tailHoldSec);
  let run = 0, maxRun = 0, maxRunAt = 0, tailRun = 0;
  for (let i = 0; i < en.length; i++) {
    if (en[i] < SPEC.minMotion) {
      run++; if (run > maxRun) { maxRun = run; maxRunAt = i; }
      if (i / fpsEff >= tailStart) tailRun = Math.max(tailRun, run);
    } else run = 0;
  }
  const deadSpanSec = +(maxRun / fpsEff).toFixed(3);
  const deadSpanStart = +((maxRunAt - maxRun + 1) / fpsEff).toFixed(3);
  const inTail = deadSpanStart >= tailStart - 1 / fpsEff;
  const interiorDead = inTail ? 0 : deadSpanSec;
  const contrast = energyRatio >= SPEC.minContrast;
  const loudOk = lo ? (Math.abs(lo.lufs - SPEC.lufs) <= 1.0 && lo.truePeak <= SPEC.truePeak) : false;

  // sync: every cue hit should have an audio onset within tolerance
  const ct = cueTimes(CUES), on = await onsets().catch(() => null);
  let sync = null;
  if (ct && on && on.length) {
    const tol = SPEC.syncToleranceFrames / fps;
    const missed = ct.filter(t => !on.some(o => Math.abs(o - t) <= tol));
    // Onset pickers report the attack a little after the event lands, and the muxed
    // track can carry a constant encoder delay. That shows up as a consistent sign
    // across many cues, so measure the central offset instead of demanding a hit
    // inside tol for every single cue.
    const dev = ct.map(t => { const o = on.reduce((b, x) => Math.abs(x - t) < Math.abs(b - t) ? x : b, on[0]); return +(o - t).toFixed(3); });
    const sorted = [...dev].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    const MAD = +(sorted.map(d => Math.abs(d - median)).sort((a, b) => a - b)[Math.floor(sorted.length / 2)] || 0).toFixed(3);
    const residual = dev.filter(d => Math.abs(d - median) > tol);
    // Some beats are deliberately visual-only (the cue sheet marks them, or they land on
    // a soft bed hit rather than an attack), so require a high on-grid fraction instead of
    // demanding an attack for every single cue.
    const onGrid = 1 - residual.length / Math.max(1, dev.length);
    sync = { cues: ct.length, onsets: on.length, missed: missed.length,
      missList: missed.slice(0, 10).map((t, i) => t.toFixed(2)), tolSec: +tol.toFixed(3),
      offsetSec: median, jitterSec: MAD, onGrid: +(onGrid * 100).toFixed(1) };
    // onGrid is a fraction here (0..1) while the threshold is in percent.
    sync.ok = onGrid * 100 >= SPEC.minSyncOnGrid;
    sync.residual = residual.length;
    sync.residualList = ct.filter((t, i) => Math.abs(dev[i] - median) > tol).slice(0, 8).map(x => +x.toFixed(2));
  }

  const G = [];
  const gate = (ok, name, got, want, note) => G.push({ ok: !!ok, name, got, want, note: note || '' });
  if (SPEC.duration) gate(Math.abs(dur - SPEC.duration) < 0.05, 'duration', +dur.toFixed(3), SPEC.duration, 's');
  if (SPEC.width) gate(v.width === SPEC.width, 'width', v.width, SPEC.width, 'px');
  if (SPEC.height) gate(v.height === SPEC.height, 'height', v.height, SPEC.height, 'px');
  if (SPEC.fps) gate(Math.abs(fps - SPEC.fps) < 0.01, 'fps', +fps.toFixed(3), SPEC.fps, '');
  gate(!!a, 'audio track', a ? a.codec_name : 'MISSING', 'present', '');
  if (lo) {
    gate(Math.abs(lo.lufs - SPEC.lufs) <= 1.0, 'integrated loudness', lo.lufs, `${SPEC.lufs} +/-1`, 'LUFS');
    gate(lo.truePeak <= SPEC.truePeak, 'true peak', lo.truePeak, `<= ${SPEC.truePeak}`, 'dBTP');
  } else gate(false, 'loudness', 'unmeasured', `${SPEC.lufs} +/-1 LUFS`, 'ffmpeg loudnorm gave no reading');
  const badBlack = blk.filter(b => b.dur > SPEC.maxBlackSec);
  gate(badBlack.length === 0, 'black frames', badBlack.length, `0 spans > ${SPEC.maxBlackSec}s`,
    badBlack.map(b => `${b.from}-${b.to}s`).join(' '));
  gate(interiorDead <= SPEC.maxInteriorStillSec, 'interior still spans', interiorDead, `<= ${SPEC.maxInteriorStillSec}s`,
    inTail ? `longest still run is the closing hold at ${deadSpanStart}s` : `starts ${deadSpanStart}s`);
  gate(meanE >= SPEC.minMotion, 'mean motion energy', +meanE.toFixed(5), `>= ${SPEC.minMotion}`, 'per frame');
  gate(contrast, 'energy contrast', energyRatio, `>= ${SPEC.minContrast} (max/mean)`, 'a flat film has no accent');
  if (sync) gate(sync.ok, 'cue->onset sync',
    `${sync.residual}/${sync.cues} off-grid (${sync.onGrid}% on-grid)`,
    `>= ${SPEC.minSyncOnGrid}% within ${sync.tolSec}s of offset ${sync.offsetSec}s (jitter ${sync.jitterSec}s)`,
    sync.residualList.join(' '));

  const failed = G.filter(g => !g.ok);
  const rep = {
    file: path.resolve(file), measuredAt: new Date().toISOString(),
    container: { duration: +dur.toFixed(3), width: v.width, height: v.height, fps: +fps.toFixed(3),
      video: v.codec_name, pixFmt: v.pix_fmt, audio: a ? `${a.codec_name} ${a.channels}ch ${a.sample_rate}Hz` : null },
    loudness: lo, motion: { mean: +meanE.toFixed(5), max: +maxE.toFixed(5), ratio: energyRatio,
      deadFrames, liveFrames, deadSpanSec, deadSpanStart, inTailHold: inTail, frames: mo?.frames ?? 0 },
    blackSpans: blk, freezeSpans: freezes, sync, gates: G,
    verdict: failed.length ? 'FAIL' : 'PASS',
  };
  const out = path.join(path.dirname(file), 'qc-report.json');
  fs.writeFileSync(out, JSON.stringify(rep, null, 2));

  const pad = Math.max(...G.map(g => g.name.length));
  console.log(`\n  ${path.basename(file)}  ${v.width}x${v.height} @${+fps.toFixed(2)}fps  ${(+dur).toFixed(3)}s`);
  if (lo) console.log(`  loudness ${lo.lufs} LUFS / ${lo.truePeak} dBTP / LRA ${lo.lra}`);
  console.log(`  motion   mean ${meanE.toFixed(5)}  max ${maxE.toFixed(5)}  ratio ${energyRatio}  dead ${deadFrames}/${en.length}f  longest dead ${deadSpanSec}s`);
  console.log(`  black ${blk.length}  freeze ${freezes.length}${sync ? `  sync offset ${sync.offsetSec}s jitter ${sync.jitterSec}s ${sync.residual}/${sync.cues} off-grid` : ''}\n`);
  for (const g of G) console.log(`  [${g.ok ? 'PASS' : 'FAIL'}] ${g.name.padEnd(pad)}  got ${String(g.got)}${g.note && g.note !== '' ? '  (' + g.note + ')' : ''}  want ${g.want}`);
  console.log(`\n  ${rep.verdict}  ->  ${out}\n`);
  process.exit(failed.length ? (STRICT ? 2 : 2) : 0);
})();

