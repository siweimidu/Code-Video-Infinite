#!/usr/bin/env node
// 选片台回归自检（需要本机 Chrome）。用 CDP 打开 gallery/index.html，检查：
//   1 chips 全部可见、没被其它元素挡住
//   2 点一个分类 chip 后，风格族数量真的变了
//   3 「清除筛选」能回到全部
//   4 字体真的加载了（DM Sans / JetBrains Mono）
//   5 有图卡片加载出真实图片（naturalWidth > 0）
// node scripts/check-gallery.mjs [--port 9321]
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PAGE = path.join(ROOT, 'gallery', 'index.html');
const argPort = process.argv.indexOf('--port');
const PORT = argPort > 0 ? Number(process.argv[argPort + 1]) : 9321;

if (!fs.existsSync(PAGE)) { console.error('缺 gallery/index.html，先跑 node scripts/build-gallery.mjs'); process.exit(2); }

const CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
];
const CHROME = CANDIDATES.find((p) => fs.existsSync(p));
if (!CHROME) { console.log('[check-gallery] 没找到 Chrome/Edge，跳过（这不是页面坏了）'); process.exit(0); }

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'cvi-check-'));
const url = 'file:///' + PAGE.split(path.sep).join('/');
const proc = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars',
  '--remote-debugging-port=' + PORT, '--user-data-dir=' + profile, '--window-size=1440,900', url], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target = null;
for (let i = 0; i < 48 && !target; i++) {
  await sleep(250);
  try {
    const list = await (await fetch('http://127.0.0.1:' + PORT + '/json')).json();
    target = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
  } catch (e) { /* 等浏览器起来 */ }
}
if (!target) { console.log('[check-gallery] CDP 连不上，跳过'); proc.kill(); process.exit(0); }

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((res) => { ws.onopen = res; });
let id = 0;
const pending = new Map();
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
const send = (method, params) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params: params || {} })); });
const ev = async (expr) => {
  const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
  if (r.result && r.result.exceptionDetails) throw new Error('page eval failed: ' + JSON.stringify(r.result.exceptionDetails).slice(0, 200));
  return r.result && r.result.result ? r.result.result.value : null;
};
await sleep(1600);

const rows = [];
const add = (name, ok, detail) => rows.push({ name, ok, detail: detail === undefined ? '' : String(detail) });

const chips = await ev('(function(){var vw=window.innerWidth;var cs=[].slice.call(document.querySelectorAll(".chip"));' +
  'var clipped=[],blocked=[];cs.forEach(function(c){var r=c.getBoundingClientRect();if(r.right>vw+1)clipped.push(c.textContent);' +
  'var x=Math.min(r.left+r.width/2,vw-4),y=r.top+r.height/2;if(y<0||y>window.innerHeight)return;' +
  'var el=document.elementFromPoint(x,y);if(!(el&&(el===c||c.contains(el))))blocked.push(c.textContent);});' +
  'return {count:cs.length,clipped:clipped,blocked:blocked,scrollable:document.querySelector(".chips").scrollWidth>document.querySelector(".chips").clientWidth+1};})()');
add('chips 数量', chips.count > 0, chips.count + ' 个');
add('chips 不被裁切', chips.clipped.length === 0, chips.clipped.join(', '));
add('chips 不被遮挡', chips.blocked.length === 0, chips.blocked.join(', '));
add('chips 不需要横向滚动', chips.scrollable === false, chips.scrollable ? '仍可横向滚动（会有看不到的 chip）' : '');

const click = await ev('(function(){var cs=[].slice.call(document.querySelectorAll(".chip"));' +
  'var chip=cs.find(function(c){return c.getAttribute("data-cat")!=="全部";});' +
  'var before=document.querySelector("#cStyle").textContent;chip.click();' +
  'var after=document.querySelector("#cStyle").textContent;' +
  'var note=document.querySelector("#filterNote");' +
  'return {cat:chip.getAttribute("data-cat"),before:before,after:after,cards:document.querySelectorAll("#gridStyle .card").length,' +
  'noteOn:!!note&&note.className.indexOf("on")>=0,noteText:note?note.textContent:""};})()');
add('点分类能过滤', click.before !== click.after, click.cat + ': ' + click.before + ' -> ' + click.after);
add('过滤后有结果卡片', click.cards > 0, click.cards + ' 张');
add('过滤后有「已筛选」提示', click.noteOn && click.noteText.indexOf(click.cat) >= 0, click.noteText.slice(0, 40));

const scrollY = await ev('new Promise(function(res){setTimeout(function(){res(Math.round(window.scrollY));},900);})');
add('点了会自动滚到结果区', scrollY > 100, 'scrollY=' + scrollY);

const clear = await ev('(function(){var b=document.getElementById("clearFilter");if(!b)return {ok:false};b.click();' +
  'return {ok:true,after:document.querySelector("#cStyle").textContent};})()');
add('清除筛选可用', clear.ok && clear.after.indexOf('/') >= 0, clear.ok ? clear.after : '没有清除按钮');

const fonts = await ev('new Promise(function(res){document.fonts.ready.then(function(){res({dm:document.fonts.check(\'600 40px "DM Sans"\'),jb:document.fonts.check(\'400 12px "JetBrains Mono"\')});});})');
add('DM Sans 已加载', !!fonts.dm, fonts.dm ? 'ok' : '未加载');
add('JetBrains Mono 已加载', !!fonts.jb, fonts.jb ? 'ok' : '未加载');

const imgs = await ev('(function(){var all=[].slice.call(document.querySelectorAll("#gridStyle img, #gridFilm img, #gridFilm video"));' +
  'var ok=all.filter(function(el){return el.tagName==="VIDEO"?true:(el.complete&&el.naturalWidth>0);}).length;return {total:all.length,ok:ok};})()');
add('媒体真的加载出来', imgs.ok > 0, imgs.ok + '/' + imgs.total);

const jsErrors = await ev('(window.__err|0)');
add('页面无脚本错误', !jsErrors, String(jsErrors));

let fails = 0;
for (const r of rows) {
  if (!r.ok) fails += 1;
  console.log((r.ok ? 'OK   ' : 'FAIL ') + r.name.padEnd(24) + r.detail);
}
console.log('');
console.log(fails ? ('选片台自检：' + fails + ' 项不通过') : ('选片台自检：全部通过（' + rows.length + ' 项）'));
ws.close();
proc.kill();
process.exit(fails ? 1 : 0);
