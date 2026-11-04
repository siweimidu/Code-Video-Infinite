#!/usr/bin/env node
// 补齐 claude-motion 各 demo 缺的本地字体：解析 demo/fonts/fonts.css 里的 @font-face，
// 缺哪个就按 家族名 + 字重 去 Google Fonts 取 TTF，存成 CSS 里写的那个文件名。
// node scripts/fetch-demo-fonts.mjs [--slug art-deco] [--dry]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const STYLES = path.join(ROOT, 'engines/claude-motion/assets/cases/lemo-opuscar/styles');
const argv = process.argv.slice(2);
const only = (() => { const i = argv.indexOf('--slug'); return i >= 0 ? argv[i + 1] : null; })();
const DRY = argv.includes('--dry');
const UA = 'Mozilla/5.0 (Linux; U; Android 4.0.3; en-us; Galaxy Nexus Build/ICL53F) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30';   // Android UA 才会拿到 .ttf

function walkDemos() {
  const out = [];
  for (const d of fs.readdirSync(STYLES, { withFileTypes: true })) {
    if (!d.isDirectory()) continue;
    const demo = path.join(STYLES, d.name, 'demo');
    const css = path.join(demo, 'fonts', 'fonts.css');
    if (fs.existsSync(css)) out.push({ slug: d.name, demo, css });
  }
  return out;
}

function parseFaces(cssText) {
  const faces = [];
  const blocks = cssText.split('@font-face').slice(1);
  for (const b of blocks) {
    const fam = (b.match(/font-family:\s*['"]?([^'";]+)['"]?/) || [])[1];
    const weight = (b.match(/font-weight:\s*(\d+)/) || [])[1] || '400';
    const style = (b.match(/font-style:\s*([a-z]+)/) || [])[1] || 'normal';
    const url = (b.match(/url\(['"]?([^'")]+)['"]?\)/) || [])[1];
    if (fam && url) faces.push({ family: fam.trim(), weight, style, file: url });
  }
  return faces;
}

const ALIASES = { poiret: "Poiret One", josefin: "Josefin Sans", josefinsans: "Josefin Sans",
  ibmplexsans: "IBM Plex Sans", ibmplexmono: "IBM Plex Mono", ibmplexsanscondensed: "IBM Plex Sans Condensed",
  spacemono: "Space Mono", worksans: "Work Sans", dmsans: "DM Sans", dmserifdisplay: "DM Serif Display" };

async function tryFamily(fam, weight) {
  const famQ = fam.trim().replace(/\s+/g, "+");
  const url = "https://fonts.googleapis.com/css2?family=" + famQ + ":wght@" + weight;
  let res;
  try { res = await fetch(url, { headers: { "User-Agent": UA } }); } catch (e) { return null; }
  if (!res.ok) return null;
  const css = await res.text();
  const m = css.match(/url\((https:\/\/[^)]+\.ttf)\)/);
  if (!m) return null;
  const bin = await fetch(m[1], { headers: { "User-Agent": UA } });
  if (!bin.ok) return null;
  return Buffer.from(await bin.arrayBuffer());
}

async function fetchTtf(family, weight) {
  const base = family.trim();
  const key = base.toLowerCase().replace(/[^a-z0-9]/g, "");
  const cands = [ALIASES[key], base, base + " Sans", base + " Serif", base + " One", base + " Mono"]
    .filter(Boolean).filter((v, i, a) => a.indexOf(v) === i);
  for (const name of cands) {
    const buf = await tryFamily(name, weight);
    if (buf) return buf;
  }
  return null;
}
const demos = walkDemos().filter((d) => !only || d.slug === only);
let got = 0, skipped = 0, failed = 0;
for (const d of demos) {
  const faces = parseFaces(fs.readFileSync(d.css, 'utf8'));
  const missing = faces.filter((f) => {
    const p = path.join(d.demo, 'fonts', f.file);
    return !fs.existsSync(p) || fs.statSync(p).size < 2000;
  });
  if (!missing.length) { skipped += 1; continue; }
  const res = [];
  for (const f of missing) {
    if (DRY) { res.push(f.file + '(dry)'); continue; }
    const buf = await fetchTtf(f.family, f.weight);
    if (!buf) { failed += 1; res.push(f.file + '(失败)'); continue; }
    fs.writeFileSync(path.join(d.demo, 'fonts', f.file), buf);
    got += 1;
    res.push(f.file);
  }
  console.log('[' + d.slug + '] ' + res.join(', '));
}
console.log('字体补全：新增 ' + got + '，跳过（已齐）' + skipped + '，失败 ' + failed);
