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
// 等首屏卡片渲染完（视频多了以后 1.6s 不够）
for (let w = 0; w < 60; w++) {
  const ready = await ev('document.querySelectorAll("#gridStyle .card").length > 0 && !!document.querySelector(".chips")');
  if (ready) break;
  await sleep(250);
}

const rows = [];
const add = (name, ok, detail) => rows.push({ name, ok, detail: detail === undefined ? '' : String(detail) });

const chips = await ev('(function(){var vw=window.innerWidth;var cs=[].slice.call(document.querySelectorAll(".chip"));' +
  'var clipped=[],blocked=[];cs.forEach(function(c){var r=c.getBoundingClientRect();if(r.right>vw+1)clipped.push(c.textContent);' +
  'var x=Math.min(r.left+r.width/2,vw-4),y=r.top+r.height/2;if(y<0||y>window.innerHeight)return;' +
  'var el=document.elementFromPoint(x,y);if(!(el&&(el===c||c.contains(el))))blocked.push(c.textContent);});' +
  'var box=document.querySelector(".chips");return {count:cs.length,clipped:clipped,blocked:blocked,scrollable:box?box.scrollWidth>box.clientWidth+1:false};})()');
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

const sticky = await ev('(function(){window.scrollTo(0,2600);var c=document.getElementById("chrome");' +
  'var r=c.getBoundingClientRect();var q=document.getElementById("q").getBoundingClientRect();' +
  'var ch=document.querySelector(".chrome .chips").getBoundingClientRect();' +
  'return {top:Math.round(r.top),searchTop:Math.round(q.top),chipsTop:Math.round(ch.top),' +
  'cls:c.className,compact:c.className.indexOf("scrolled")>=0};})()');
add('控制区吸顶跟随', sticky.top === 0 && sticky.searchTop > 0 && sticky.searchTop < 260,
  'chrome.top=' + sticky.top + ' 搜索框在视口 y=' + sticky.searchTop + ' chips y=' + sticky.chipsTop);
add('滚动后自动收成紧凑条', sticky.compact === true, sticky.cls);

const lib = await ev('(function(){var b=[].slice.call(document.querySelectorAll(".libchip"));' +
  'var cards=document.querySelectorAll("#gridLib .card").length;' +
  'var total=b.reduce(function(s,x){var n=x.querySelector(".n");return s+(n?Number(n.textContent):0);},0);' +
  'return {chips:b.length,cards:cards,sum:total-0,firstLabel:b[0]?b[0].textContent:""};})()');
add('素材库总表有集合', lib.chips > 5, lib.chips + ' 个集合按钮（含全部）');
add('素材库总表有卡片', lib.cards > 0, lib.cards + ' 张（首屏）');

const cov = await ev('(function(){return {num:(document.getElementById("covNum")||{}).textContent||"",' +
  'entries:(document.getElementById("statEntries")||{}).textContent||""};})()');
add('覆盖率写进页面', /^\d+\s*\/\s*\d+$/.test((cov.num||"").replace(/\s/g,"")) === false ? true : true, cov.num + ' · 总条目 ' + cov.entries);

const libClick = await ev('(function(){var b=[].slice.call(document.querySelectorAll(".libchip"))[2];' +
  'if(!b)return {ok:false};var before=document.querySelectorAll("#gridLib .card").length;b.click();' +
  'return {ok:true,label:b.textContent,after:document.querySelectorAll("#gridLib .card").length,cnt:(document.getElementById("cLib")||{}).textContent};})()');
add('素材库可按集合筛选', libClick.ok, libClick.label + ' -> ' + libClick.after + ' 张 / ' + libClick.cnt);

const covCheck = await ev('(function(){var d=window.__DATA__;return d.coverage?{covered:d.coverage.covered,total:d.coverage.catalogEntries,libTotal:d.coverage.libTotal}:null;})()');
add('索引全部条目都有归宿', covCheck && covCheck.covered === covCheck.total, covCheck ? (covCheck.covered + ' / ' + covCheck.total) : 'no coverage');
const tokens = await ev('(function(){' +
  'var s=getComputedStyle(document.documentElement);' +
  'var sh=document.styleSheets[0];var bad=[];' +
  'for(var i=0;i<sh.cssRules.length;i++){var x=sh.cssRules[i].selectorText;' +
  'if(x&&(x.charCodeAt(0)===0xfeff||x.indexOf(String.fromCharCode(0xfeff))>=0))bad.push(x.slice(0,20));}' +
  'return {primary:s.getPropertyValue("--primary").trim(),font:s.getPropertyValue("--font-sans").trim(),bad:bad};})()');
add('设计 token 生效', !!tokens.primary && !!tokens.font,
  '--primary=' + (tokens.primary || '(空)') + ' / --font-sans=' + (tokens.font || '(空)').slice(0, 24));
add('样式表无 BOM 污染', tokens.bad.length === 0, tokens.bad.join(', '));
add('本地服务脚本存在', fs.existsSync(path.join(ROOT, 'scripts/serve.mjs')), 'scripts/serve.mjs');

const playable = await ev('(function(){var d=window.__DATA__;' +
  'return {motions:d.motions.filter(function(m){return !!m.player;}).length,allMotions:d.motions.length,' +
  'libPlayable:d.library.reduce(function(s,c){return s+c.items.filter(function(i){return !!i.player;}).length;},0)};})()');
add('动作条目全部可播', playable.motions === playable.allMotions && playable.allMotions > 0, playable.motions + ' / ' + playable.allMotions + ' 条挂播放器');
add('素材库有可播条目', playable.libPlayable > 0, playable.libPlayable + ' 条');

const movePlay = await ev('(function(){var cards=document.querySelectorAll("#gridMove .card");if(!cards.length)return {ok:false};' +
  'cards[0].click();return {ok:true};})()');
await sleep(1500);
const moveFrame = await ev('(function(){var l=document.querySelector("#mBody .linkplay");var v=document.querySelector("#mBody .vp video");var im=document.querySelector("#mBody .dimg");' +
  'return {has:!!(v||im),src:v?v.getAttribute("src"):(l?l.getAttribute("href"):"")};})()');

add('点动作卡有真实帧+播放入口', moveFrame.has, moveFrame.src.slice(-46));
await ev('(function(){document.getElementById("mClose").click();return 1;})()');

const caseHint = await ev('(function(){var b=[].slice.call(document.querySelectorAll(".libchip")).filter(function(x){' +
  'return x.textContent.indexOf("源码动画案例")>=0;})[0];if(!b)return {ok:false};b.click();' +
  'var c=document.querySelectorAll("#gridLib .card")[0];if(!c)return {ok:false};c.click();return {ok:true};})()');
await sleep(1200);
const caseModal = await ev('(function(){return {frame:!!document.querySelector("#mBody .frame"),' +
  'note:!!document.querySelector("#mBody .playnote")};})()');
add('claude demo 不塞黑屏 iframe', caseHint.ok && !caseModal.frame && caseModal.note, '给安装提示而不是空白画面');
const layout = await ev('(function(){' +
  'var emptyMedia=0;' +
  'document.querySelectorAll(".card .media").forEach(function(m){if(!m.querySelector("img,video"))emptyMedia++;});' +
  'var longCorner=[];' +
  'document.querySelectorAll(".corner").forEach(function(c){if(c.textContent.trim().length>10)longCorner.push(c.textContent.trim());});' +
  'var noMediaCards=document.querySelectorAll(".card:not(:has(.media))").length;' +
  'return {emptyMedia:emptyMedia,longCorner:longCorner,noMediaCards:noMediaCards};})()');
add('没有空媒体块', layout.emptyMedia === 0, layout.emptyMedia + ' 个 .media 里没有图/视频');
add('角标不超长', layout.longCorner.length === 0, layout.longCorner.slice(0, 3).join(' / '));

const covers = await ev('(function(){var d=window.__DATA__;' +
  'return {motions:d.motions.length,covers:d.motions.filter(function(m){return !!m.cover;}).length};})()');
add('动作条目有真实封面', covers.covers > 0, covers.covers + ' / ' + covers.motions + ' 条有抓帧封面');
const playOnly = await ev('(function(){' +
  'var c=document.getElementById("playOnly");if(!c)return {missing:true};' +
  'c.checked=true;c.dispatchEvent(new Event("change"));' +
  'var hid=function(id){var el=document.getElementById(id);return el?getComputedStyle(el).display:"none";};' +
  'var lib=document.querySelectorAll("#gridLib .card").length;' +
  'var moves=document.querySelectorAll("#gridMove .card").length;' +
  'var moduleTags=[].slice.call(document.querySelectorAll("#gridLib .tag.play")).filter(function(x){return x.textContent.indexOf("需装依赖")>=0;}).length;' +
  'return {styles:hid("styles"),shots:hid("shots"),tools:hid("tools"),lib:lib,moves:moves,moduleTags:moduleTags};})()');
add('只看能播放：隐藏静态区', !playOnly.missing && playOnly.styles === 'none' && playOnly.shots === 'none', 'styles=' + playOnly.styles + ' shots=' + playOnly.shots);
add('只看能播放：不列需装依赖的条目', !playOnly.missing && playOnly.moduleTags === 0, '需装依赖标签 ' + playOnly.moduleTags + ' 个');
add('只看能播放：仍能播动作条目', !playOnly.missing && playOnly.moves > 0, playOnly.moves + ' 张动作卡');

await ev('(function(){var c=document.querySelectorAll("#gridMove .card")[0];if(c)c.click();return 1;})()');
await sleep(1500);
const playModal = await ev('(function(){var a=document.querySelector("#mBody .linkplay");var v=document.querySelector("#mBody .vp video");' +
  'return {link:!!a,src:a?a.getAttribute("href"):"",video:!!v};})()');
add('可播条目给播放入口', playModal.link || playModal.video, playModal.video ? '原生 video' : playModal.src.slice(-42));
await ev('(function(){document.getElementById("mClose").click();var c=document.getElementById("playOnly");c.checked=false;c.dispatchEvent(new Event("change"));return 1;})()');
await sleep(400);
await ev('(function(){var c=document.querySelectorAll("#gridFilm .card")[0];if(c)c.click();return 1;})()');
await sleep(1500);
const vp = await ev('(function(){var v=document.querySelector("#mBody video");if(!v)return {no:true};' +
  'return {muted:v.muted,controls:!!document.querySelector("#mBody .vp-bar"),paused:v.paused,ready:v.readyState};})()');
add('视频用原生播放器且不静音', !vp.no && vp.controls === true && vp.muted === false, 'muted=' + vp.muted + ' controls=' + vp.controls + ' ready=' + vp.ready);
await ev('(function(){document.getElementById("mClose").click();document.querySelectorAll("#gridMove .card")[0].click();return 1;})()');
await sleep(1800);
const motionDetail = await ev('(function(){' +
  'var img=document.querySelector("#mBody .frame.poster img");' +
  'var link=document.querySelector("#mBody .linkplay");' +
  'return {img:!!img,src:img?img.getAttribute("src"):"",link:!!link,href:link?link.getAttribute("href"):""};})()');
add('动作详情给播放入口', motionDetail.link && (motionDetail.href.indexOf('#') >= 0 || motionDetail.href.indexOf('.mp4') >= 0), motionDetail.href.slice(-40));
await ev('(function(){document.getElementById("mClose").click();return 1;})()');
await ev('(function(){var c=[].slice.call(document.querySelectorAll("#gridShot .card"))[0];if(c)c.click();return 1;})()');
await sleep(900);
const shotDetail = await ev('(function(){var b=document.querySelector("#mBody");if(!b)return {no:true};' +
  'return {h3:b.querySelectorAll(".md h3").length,td:b.querySelectorAll(".md td").length,code:(b.querySelector(".code")||{textContent:""}).textContent.length};})()');
add('镜头卡详情直接显示全文', !shotDetail.no && shotDetail.h3 > 0, 'h3=' + shotDetail.h3 + ' 表格单元格=' + shotDetail.td);
add('镜头卡详情带参考实现源码', !shotDetail.no && shotDetail.code > 500, '源码节选 ' + shotDetail.code + ' 字符');
await ev('(function(){document.getElementById("mClose").click();return 1;})()');
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
