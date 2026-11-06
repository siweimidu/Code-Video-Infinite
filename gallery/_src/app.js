/* 选片台 · 客户端逻辑（构建时内联进 index.html）。数据来自 window.__DATA__ */
(function () {
  var D = window.__DATA__;
  var NL = String.fromCharCode(10);
  var $ = function (s) { return document.querySelector(s); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  };
  var state = { q: '', cat: '全部', realOnly: false, playOnly: false, moveLimit: 472 };
  var Q = String.fromCharCode(34);   // 双引号，避免 HTML 属性里转义地狱

  function rgba(c, a) {
    var m = /^#?([0-9a-f]{6})$/i.exec(c || '');
    if (!m) return 'rgba(0,0,0,' + a + ')';
    var n = parseInt(m[1], 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }

  /* 没有真实案例帧时给一张浅色「示意瓦片」：白底 + 分类 tint + 极淡纹理 + 家族首字水印 */
  function swatch(f) {
    var p = f.pal || [];
    var tint = p[2] || '#8e8e93';
    var cat = f.cat || '';
    var pat = 'radial-gradient(120% 110% at 16% 0%,' + rgba(tint, 0.16) + ',transparent 62%)';
    if (/印刷|版画/.test(cat)) pat = 'radial-gradient(circle at 1px 1px,' + rgba(tint, 0.26) + ' 1.1px,transparent 1.6px)';
    else if (/复古|屏幕/.test(cat)) pat = 'repeating-linear-gradient(0deg,' + rgba(tint, 0.1) + ' 0 1px,transparent 1px 5px)';
    else if (/生成|抽象/.test(cat)) pat = 'conic-gradient(from 210deg,' + rgba(tint, 0.2) + ',transparent 42%,' + rgba(tint, 0.1) + ' 72%,transparent)';
    else if (/3D|材质/.test(cat)) pat = 'radial-gradient(110% 84% at 28% 18%,' + rgba(tint, 0.24) + ',transparent 58%)';
    else if (/东方|手作/.test(cat)) pat = 'repeating-linear-gradient(45deg,' + rgba(tint, 0.08) + ' 0 6px,transparent 6px 12px)';
    else if (/插画|漫画/.test(cat)) pat = 'repeating-conic-gradient(from 45deg,' + rgba(tint, 0.1) + ' 0 25%,transparent 0 50%)';
    var bg = 'linear-gradient(165deg,#ffffff 0%,#f5f5f7 100%)';
    var nm = String(f.name || f.id || '');
    var cjk = nm.match(/[\u4e00-\u9fa5]/g);
    var glyph = cjk && cjk.length ? cjk.slice(0, 2).join('') : nm.replace(/[^A-Za-z0-9]/g, '').slice(0, 2).toUpperCase();
    var layer1 = '<div style="position:absolute;inset:0;background:' + pat + ',' + bg + '"></div>';
    var layer2 = '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;' +
      'font-size:34px;font-weight:600;letter-spacing:.08em;color:' + rgba(tint, 0.4) + '">' + esc(glyph) + '</div>';
    return layer1 + layer2;
  }

  function cardFilm(v) {
    var poster = v.poster ? ' poster="' + v.poster + '"' : '';
    var meta = v.kind === 'onetake' ? '案例片' : 'wise';
    var sub = esc(v.path) + (v.duration ? ' · ' + Math.round(v.duration) + 's' : '') + ' · ' + v.mb + 'MB';
    return '<div class="card" tabindex="0" role="button" data-open="v:' + esc(v.path) + '">' +
      '<div class="media"><video src="' + v.src + '"' + poster + ' muted loop playsinline preload="metadata"' +
      ' onmouseover="this.play()" onmouseout="this.pause()"></video>' +
      '<span class="tagbadge real">真实样片</span><span class="corner">' + meta + '</span></div>' +
      '<div class="body"><div class="name">' + esc(v.name) + '</div>' +
      '<div class="sub">' + sub + '</div>' +
      '<div class="tags">' + (v.audio ? '<span class="tag play">🔊 有声音</span>' : '<span class="tag">🔇 无音轨</span>') + '</div></div></div>';
  }
  function cardGif(g) {
    return '<div class="card" tabindex="0" role="button" data-open="g:' + esc(g.path) + '">' +
      '<div class="media"><img loading="lazy" src="' + g.src + '" alt="">' +
      '<span class="tagbadge real">动图</span><span class="corner">' + g.mb + 'MB</span></div>' +
      '<div class="body"><div class="name">' + esc(g.name) + '</div>' +
      '<div class="sub">' + esc(g.path) + '</div></div></div>';
  }
  function cardFamily(f) {
    var media = f.preview ? ("<div class=" + Q + "media" + Q + "><img loading=" + Q + "lazy" + Q + " src=" + Q + f.preview + Q + " alt=" + Q + Q + ">" +
      "<span class=" + Q + "tagbadge real" + Q + ">真实案例帧</span></div>") : "";
    var tags = f.mood.slice(0, 3).map(function (m) {
      return "<span class=" + Q + "tag" + Q + ">" + esc(m) + "</span>";
    }).join("") + f.libs.map(function (l) {
      return "<span class=" + Q + "tag k" + Q + ">" + esc(l) + "</span>";
    }).join("");
    return "<div class=" + Q + "card" + Q + " tabindex=" + Q + "0" + Q + " role=" + Q + "button" + Q + " data-cat=" + Q + esc(f.cat) + Q + " data-open=" + Q + "f:" + esc(f.id) + Q + " data-real=" + Q + (f.preview ? 1 : 0) + Q + ">" + media +
      "<div class=" + Q + "body" + Q + (media ? "" : " tight") + Q + "><div class=" + Q + "name" + Q + ">" + esc(f.name) + "</div>" +
      "<div class=" + Q + "sub" + Q + ">" + esc(f.one || f.cat) + "</div>" +
      "<div class=" + Q + "tags" + Q + ">" + tags + "</div></div></div>";
  }
  function energyLevel(en) {
    var t = String(en || "");
    if (/中高/.test(t)) return 3;
    if (/高/.test(t)) return 4;
    if (/中/.test(t)) return 2;
    if (/低/.test(t)) return 1;
    return 0;
  }
  function energyBar(lv) {
    if (!lv) return "";
    var bars = "";
    for (var i = 1; i <= 4; i++) {
      bars += "<i style=" + Q + "display:block;width:3px;height:" + (4 + i * 2) + "px;border-radius:1px;background:" + (i <= lv ? "var(--foreground)" : "var(--border)") + Q + "></i>";
    }
    return "<span style=" + Q + "display:inline-flex;align-items:flex-end;gap:2px;height:14px" + Q + " title=" + Q + "能量 " + lv + "/4" + Q + ">" + bars + "</span>";
  }
  function hueOf(s) {
    var h = 0, str = String(s || "");
    for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 360;
    return h;
  }
  function shortDur(s) {
    var m = String(s || '').match(/(\d+(?:\.\d+)?)\s*(?:s|秒)/);
    if (m) return m[1] + 's';
    var t = String(s || '').replace(/\s+/g, '');
    return t.length > 8 ? t.slice(0, 8) : t;
  }
  function cardShot(c) {
    var lv = energyLevel(c.en);
    var media = c.poster ? ("<div class=" + Q + "media" + Q + "><img loading=" + Q + "lazy" + Q + " src=" + Q + c.poster + Q + " alt=" + Q + Q + ">" +
      (c.d ? "<span class=" + Q + "corner" + Q + ">" + esc(shortDur(c.d)) + "</span>" : "") + "</div>") : "";
    var tags = "<span class=" + Q + "tag k" + Q + ">" + esc(c.cat) + "</span>" +
      (c.d ? "<span class=" + Q + "tag" + Q + ">" + esc(shortDur(c.d)) + "</span>" : "") +
      (lv ? "<span class=" + Q + "tag" + Q + ">" + energyBar(lv) + "</span>" : "");
    return "<div class=" + Q + "card" + Q + " tabindex=" + Q + "0" + Q + " role=" + Q + "button" + Q + " data-open=" + Q + "s:" + esc(c.id) + Q + ">" + media +
      "<div class=" + Q + "body" + Q + (media ? "" : " tight") + Q + "><div class=" + Q + "name" + Q + ">" + esc(c.id) + "</div>" +
      "<div class=" + Q + "sub" + Q + ">" + esc(c.t) + "</div>" +
      "<div class=" + Q + "tags" + Q + ">" + tags + "</div></div></div>";
  }
  function durLabel(ms) {
    if (!ms) return "";
    if (ms >= 1000) return (Math.round(ms / 100) / 10) + "s";
    return Math.round(ms) + "ms";
  }
  function cardMove(m) {
    var media = m.cover ? ("<div class=" + Q + "media" + Q + "><img loading=" + Q + "lazy" + Q + " src=" + Q + m.cover + Q + " alt=" + Q + Q + ">" +
      "<span class=" + Q + "tagbadge real" + Q + ">真实预览帧</span>" +
      (m.ms ? "<span class=" + Q + "corner" + Q + ">" + durLabel(m.ms) + "</span>" : "") + "</div>") : "";
    var tags = "<span class=" + Q + "tag k" + Q + ">" + esc(m.cat) + "</span>" +
      (m.player ? "<span class=" + Q + "tag play" + Q + ">▶ 可试播</span>" : "") +
      (m.loop ? "<span class=" + Q + "tag" + Q + ">循环</span>" : "");
    return "<div class=" + Q + "card" + Q + " tabindex=" + Q + "0" + Q + " role=" + Q + "button" + Q + " data-open=" + Q + "m:" + esc(m.id) + Q + ">" + media +
      "<div class=" + Q + "body" + Q + (media ? "" : " tight") + Q + "><div class=" + Q + "name" + Q + ">" + esc(m.id) + "</div>" +
      "<div class=" + Q + "sub" + Q + ">" + esc(m.t) + "</div>" +
      "<div class=" + Q + "tags" + Q + ">" + tags + "</div></div></div>";
  }
  function cardTool(t) {
    var media = t.cover ? ("<div class=" + Q + "media" + Q + "><img loading=" + Q + "lazy" + Q + " src=" + Q + t.cover + Q + " alt=" + Q + Q + "></div>") : "";
    return "<div class=" + Q + "card" + Q + " tabindex=" + Q + "0" + Q + " role=" + Q + "button" + Q + " data-open=" + Q + "t:" + esc(t.id) + Q + ">" + media +
      "<div class=" + Q + "body" + Q + (media ? "" : " tight") + Q + "><div class=" + Q + "name" + Q + ">" + esc(t.id) + "</div>" +
      "<div class=" + Q + "sub" + Q + ">" + esc(t.medium) + "</div></div></div>";
  }
  function renderChips() {
    var cats = ["全部"];
    D.families.forEach(function (f) { if (cats.indexOf(f.cat) < 0) cats.push(f.cat); });
    cats.sort(function (a, b) {
      return a === "全部" ? -1 : b === "全部" ? 1 : a.localeCompare(b, "zh");
    });
    var chipNote = '<span class="chipnote">分类仅作用于风格族</span>';
    $("#chips").innerHTML = chipNote + cats.map(function (c) {
      var n = c === "全部" ? D.families.length : D.families.filter(function (f) { return f.cat === c; }).length;
      var on = state.cat === c;
      return "<button class=" + Q + "chip" + (on ? " on" : "") + Q + " data-cat=" + Q + esc(c) + Q +
        " aria-pressed=" + Q + (on ? "true" : "false") + Q + ">" + esc(c) +
        "<span class=" + Q + "n" + Q + ">" + n + "</span></button>";
    }).join("");
    var note = $("#filterNote");
    if (!note) return;
    if (state.cat === "全部") { note.className = "filterNote"; note.innerHTML = ""; return; }
    var cnt = D.families.filter(function (f) { return f.cat === state.cat; }).length;
    note.className = "filterNote on";
    note.innerHTML = "已筛选 <b>" + esc(state.cat) + "</b>（" + cnt + " 个风格族）" +
      "<button id=" + Q + "clearFilter" + Q + ">清除筛选</button>";
  }
  function scrollToStyles() {
    var el = document.getElementById("styles");
    if (!el) return;
    var top = el.getBoundingClientRect().top;
    if (top > window.innerHeight * 0.55 || top < 0) {
      window.scrollTo({ top: el.offsetTop - 130, behavior: "smooth" });
    }
  }
  function canPlay(kind, item) {
    if (kind === 'video' || kind === 'gif') return true;
    if (!item || !item.player) return false;
    if (item.playerKind === 'module') return false;   // 需要装依赖，本机播不了
    return true;
  }
  function hit(s) {
    if (!state.q) return true;
    return String(s).toLowerCase().indexOf(state.q.toLowerCase()) >= 0;
  }

  function render() {
    var playOnly = state.playOnly;
    var secOf = function (id) { return document.getElementById(id); };
    var show = function (id, on) { var el = secOf(id); if (el) el.style.display = on ? "" : "none"; };

    $("#gridFilm").innerHTML = D.videos.map(cardFilm).concat(D.gifs.map(cardGif)).join("") || "<p class=" + Q + "empty" + Q + ">没有样片</p>";

    var fams = playOnly ? [] : D.families.filter(function (f) {
      if (state.cat !== "全部" && f.cat !== state.cat) return false;
      if (state.realOnly && !f.preview) return false;
      return hit(f.name + " " + f.cat + " " + (f.one || "") + " " + f.mood.join(" ") + " " + f.id);
    });
    $("#gridStyle").innerHTML = fams.map(cardFamily).join("") || ("<p class=" + Q + "empty" + Q + ">" + (playOnly ? "风格族是静态条目，播不了；关掉「只看能播放的」再看" : "这个分类下没有匹配的风格族") + "</p>");
    $("#cStyle").textContent = fams.length + " / " + D.totals.families;
    show("styles", !playOnly);

    var shots = playOnly ? [] : D.shotCards.filter(function (c) { return !state.realOnly || c.poster ? true : true; })
      .filter(function (c) { return hit(c.id + " " + c.t + " " + c.cat); })
      .filter(function (c) { return !state.realOnly || !!c.poster; });
    $("#gridShot").innerHTML = shots.slice(0, 160).map(cardShot).join("") || ("<p class=" + Q + "empty" + Q + ">" + (playOnly ? "镜头卡是静帧，播不了；关掉「只看能播放的」再看" : "没有") + "</p>");
    $("#cShot").textContent = shots.length + " / " + D.totals.shotCards;
    show("shots", !playOnly);

    var moves = D.motions.filter(function (m) {
      if (playOnly && !canPlay("move", m)) return false;
      return hit(m.id + " " + m.t + " " + m.cat);
    });
    $("#gridMove").innerHTML = moves.slice(0, state.moveLimit).map(cardMove).join("") || "<p class=" + Q + "empty" + Q + ">没有</p>";
    $("#cMove").textContent = moves.length + " 条命中" + (playOnly ? "（都可试播）" : "");
    $("#moreWrap").style.display = moves.length > state.moveLimit ? "block" : "none";

    var tools = playOnly ? [] : D.tools.filter(function (t) { return hit(t.id + " " + t.medium); });
    $("#gridTool").innerHTML = tools.map(cardTool).join("");
    show("tools", !playOnly);

    $("#cFilm").textContent = D.videos.length + " 段视频 · " + D.gifs.length + " 个动图" + (playOnly ? "（全部可播）" : "");
  }
  function findObj(kind, id) {
    if (kind === 'f') return D.families.filter(function (x) { return x.id === id; })[0];
    if (kind === 'v' || kind === 'g') return D.videos.concat(D.gifs).filter(function (x) { return x.path === id; })[0];
    if (kind === 's') return D.shotCards.filter(function (x) { return x.id === id; })[0];
    if (kind === 'm') return D.motions.filter(function (x) { return x.id === id; })[0];
    if (kind === 't') return D.tools.filter(function (x) { return x.id === id; })[0];
  }

  function vplayer(src, poster, opts) {
    opts = opts || {};
    return '<div class="vp' + (opts.crop ? ' crop-bar' : '') + '" data-loop="' + (opts.loop === false ? '0' : '1') + '" data-audio="' + (opts.audio ? '1' : '0') + '">' +
      '<video src="' + src + '"' + (poster ? ' poster="' + poster + '"' : '') + ' playsinline preload="metadata"></video>' +
      '<button class="vp-big" type="button" aria-label="播放">▶</button>' +
      '<div class="vp-bar">' +
        '<button class="vp-toggle" type="button" aria-label="播放/暂停">▶</button>' +
        '<div class="vp-track"><div class="vp-fill"></div></div>' +
        '<span class="vp-time">0.0 / 0.0</span>' +
        '<button class="vp-mute" type="button" aria-label="静音">' + (opts.audio ? '🔊' : '🔇') + '</button>' +
        '<button class="vp-fs" type="button" aria-label="全屏">⤢</button>' +
      '</div>' +
    '</div>';
  }
  function details(title, body) {
    return '<details class="fold"><summary>' + title + '</summary><pre>' + body + '</pre></details>';
  }
  var COPY = {};
  function toast(msg) {
    var t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.className = 'on';
    clearTimeout(t._h); t._h = setTimeout(function () { t.className = ''; }, 1600);
  }
  function doCopy(key) {
    var text = COPY[key] || '';
    var done = function () { toast(key === 'code' ? '已复制视频代码' : '已复制'); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(function () { fallback(); });
    } else { fallback(); }
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      ta.remove(); done();
    }
  }
  function abtn(label, kind, key) {
    return '<button class="abtn ' + (kind === 'primary' ? 'primary' : '') + '" type="button" data-copy="' + key + '">' + label + '</button>';
  }
  function openDetail(attr) {
    var kind = attr.slice(0, 1), id = attr.slice(2), o = findObj(kind, id);
    if (!o) return;
    var body = '', acts = [];
    COPY = {};
    if (kind === 's') {
      if (o.video) body += vplayer(o.video, o.poster, { audio: false, loop: true }) + '<div style="height:20px"></div>';
      else if (o.poster) body += '<img class="dimg" src="' + o.poster + '" alt="" style="margin-bottom:22px">';
      body += '<div class="article">' + (o.mdHtml || '<p class="lead">' + esc(o.t) + '</p>') + '</div>';
      COPY.prompt = o.mdRaw || o.t;
      COPY.code = o.code || '';
      acts.push(abtn('复制提示词', 'primary', 'prompt'));
      if (o.code) acts.push(abtn('复制视频代码', '', 'code'));
      if (o.code) body += details('参考实现源码（前 90 行）', esc(o.code));
    } else if (kind === 'm') {
      if (o.video) body += vplayer(o.video, o.cover, { audio: false, loop: true });
      else if (o.cover) body += '<img class="dimg" src="' + o.cover + '" alt="">';
      body += '<div class="kv" style="margin-top:20px"><b>分类</b><span>' + esc(o.cat) + '</span><b>时长</b><span>' + durLabel(o.ms) + '</span><b>循环</b><span>' + (o.loop ? '是' : '否') + '</span></div>';
      body += '<p class="lead">' + (o.video ? '本地 mp4（30fps），页内直接播放。' : '暂无本地录像，用右上角入口到播放器里看。') + '</p>';
      COPY.prompt = o.t + '（' + o.id + '）' + NL + 'node engines/wise-motion/scripts/export.mjs ' + o.id + ' --out-dir <你的工程>';
      COPY.code = 'node engines/wise-motion/scripts/show.mjs ' + o.id + ' --details' + NL + 'node engines/wise-motion/scripts/export.mjs ' + o.id + ' --out-dir <你的工程>';
      acts.push(abtn('复制提示词', 'primary', 'prompt'));
      acts.push(abtn('复制视频代码', '', 'code'));
      if (o.video) acts.push('<a class="abtn" href="' + o.video + '" target="_blank">新页面播放</a>');
      else if (o.player) acts.push('<a class="abtn" href="' + o.player + '" target="_blank">完整播放器</a>');
    } else if (kind === 'v') {
      body += vplayer(o.src, null, { audio: !!o.audio, loop: false });
      body += '<div class="kv" style="margin-top:20px"><b>音轨</b><span>' + (o.audio ? 'aac 立体声' : '无音轨') + '</span><b>大小</b><span>' + o.mb + ' MB</span></div>';
      body += '<p class="lead">' + (o.audio ? '有声音。若浏览器拦截自动播放，点一下画面即可。' : '这段素材本身没有音轨。') + '</p>';
      body += details('文件路径', esc(o.path));
      COPY.prompt = o.path;
      acts.push('<a class="abtn primary" href="' + o.src + '" target="_blank">新页面播放</a>');
      acts.push('<a class="abtn" href="' + o.src + '" download>下载</a>');
    } else if (kind === 'f') {
      if (o.preview) body += '<img class="dimg" src="' + o.preview + '" alt="">';
      body += '<div class="kv" style="margin-top:18px"><b>分类</b><span>' + esc(o.cat) + '</span><b>情绪</b><span>' + esc(o.mood.join(' / ') || '—') + '</span><b>实现库</b><span>' + esc(o.libs.join(' , ')) + '</span></div>';
      if (o.one) body += '<p class="lead">' + esc(o.one) + '</p>';
      body += details('各库实现（' + o.impls.length + '）', esc(o.impls.map(function (i) { return i.library + ':' + i.id + NL + '  ' + i.path; }).join(NL + NL)));
      COPY.prompt = '风格：' + o.id + '（' + (o.impls[0] ? o.impls[0].library + ':' + o.impls[0].id : '') + '）';
      acts.push(abtn('复制风格行', 'primary', 'prompt'));
    } else if (kind === 't') {
      body += '<p class="lead">' + esc(o.t) + '</p>';
      body += details('入口', esc('读：' + o.p + NL + '形态：' + o.medium));
      COPY.prompt = o.p;
      acts.push(abtn('复制路径', 'primary', 'prompt'));
    }
    $('#mTitle').textContent = kind === 'f' ? o.name : (o.name || o.id || o.t);
    $('#mActions').innerHTML = acts.join('');
    $('#mBody').innerHTML = body;
    $('#modal').classList.add('on');
    document.body.style.overflow = 'hidden';
    wirePlayers();
  }
  function wirePlayers() {
    [].slice.call(document.querySelectorAll('#mBody .vp')).forEach(function (vp) {
      var v = vp.querySelector('video');
      var big = vp.querySelector('.vp-big');
      var tg = vp.querySelector('.vp-toggle');
      var fill = vp.querySelector('.vp-fill');
      var time = vp.querySelector('.vp-time');
      var mute = vp.querySelector('.vp-mute');
      var fsb = vp.querySelector('.vp-fs');
      var loop = vp.getAttribute('data-loop') !== '0';
      v.loop = loop;
      if (vp.getAttribute('data-audio') !== '1') v.muted = true;
      var fmt = function (t) { return (Math.round(t * 10) / 10).toFixed(1) + 's'; };
      var paint = function () {
        var d = v.duration || 0;
        fill.style.width = d ? (v.currentTime / d * 100) + '%' : '0%';
        time.textContent = fmt(v.currentTime) + ' / ' + fmt(d);
        var playing = !v.paused;
        tg.textContent = playing ? '❚❚' : '▶';
        if (big) big.style.display = playing ? 'none' : 'block';
      };
      var toggle = function () { if (v.paused) v.play().catch(function () {}); else v.pause(); };
      [big, tg].forEach(function (b) { if (b) b.addEventListener('click', toggle); });
      v.addEventListener('timeupdate', paint);
      v.addEventListener('loadedmetadata', paint);
      v.addEventListener('play', paint);
      v.addEventListener('pause', paint);
      var track = vp.querySelector(".vp-track");
      var seekTo = function (clientX) {
        var r = track.getBoundingClientRect();
        var x = Math.min(Math.max(clientX - r.left, 0), r.width);
        if (v.duration) { v.currentTime = (x / r.width) * v.duration; paint(); }
      };
      var dragging = false;
      track.addEventListener('pointerdown', function (e) {
        dragging = true; track.setPointerCapture(e.pointerId); seekTo(e.clientX); e.preventDefault();
      });
      track.addEventListener('pointermove', function (e) { if (dragging) seekTo(e.clientX); });
      track.addEventListener('pointerup', function (e) { dragging = false; try { track.releasePointerCapture(e.pointerId); } catch (err) {} });
      track.addEventListener('pointercancel', function () { dragging = false; });
      vp.addEventListener('mousemove', function (e) { if (dragging) seekTo(e.clientX); });
      mute.addEventListener('click', function () {
        v.muted = !v.muted;
        mute.textContent = v.muted ? '🔇' : '🔊';
      });
      fsb.addEventListener('click', function () {
        if (document.fullscreenElement) document.exitFullscreen();
        else if (vp.requestFullscreen) vp.requestFullscreen();
      });
      paint();
      if (vp.getAttribute('data-autoplay') !== '0') v.play().catch(function () { /* 等用户点 */ });
    });
  }
  function tryPlayVideo() {
    var v = document.querySelector('#mBody video');
    if (!v) return;
    var btn = document.querySelector("#mBody .bigplay");
    var hide = function () { if (btn) btn.style.display = "none"; };
    v.addEventListener('playing', hide);
    if (btn) {
      btn.addEventListener('click', function () { v.play().catch(function () {}); });
    }
    v.muted = false;
    var pr = v.play();
    if (pr && pr.then) pr.then(hide).catch(function () { /* 等用户点大按钮 */ });
  }
  function closeDetail() {
    $('#modal').classList.remove('on');
    document.body.style.overflow = '';
  }

  document.addEventListener('click', function (e) {
    var chip = e.target.closest && e.target.closest('.chip');
    if (chip) {
      state.cat = chip.getAttribute("data-cat");
      renderChips();
      render();
      scrollToStyles();
      return;
    }
    var cf = e.target.id === "clearFilter" ? e.target : (e.target.closest ? e.target.closest("#clearFilter") : null);
    if (cf) {
      state.cat = "全部";
      renderChips();
      render();
      return;
    }
    var card = e.target.closest && e.target.closest('[data-open]');
    if (card) { openDetail(card.getAttribute('data-open')); return; }
    if (e.target.id === 'modal' || e.target.id === 'mClose') closeDetail();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDetail();
    if (e.key === 'Enter') {
      var a = document.activeElement;
      if (a && a.getAttribute && a.getAttribute('data-open')) openDetail(a.getAttribute('data-open'));
    }
  });
  $('#q').addEventListener('input', function (e) { state.q = e.target.value.trim(); render(); });
  $('#realOnly').addEventListener('change', function (e) { state.realOnly = e.target.checked; render(); });
$('#playOnly').addEventListener('change', function (e) { state.playOnly = e.target.checked; if (e.target.checked) state.realOnly = false; render(); });
  $('#more').addEventListener('click', function () { state.moveLimit += 96; render(); });

  $('#statFamilies').textContent = D.totals.families;
  $('#statPreview').textContent = D.totals.withPreview;
  $('#statVideo').textContent = D.totals.videos;
  $('#statShot').textContent = D.totals.shotCards;
  $('#statMove').textContent = D.totals.motions;
  $('#gen').textContent = '生成于 ' + D.generatedAt + ' · node scripts/build-gallery.mjs';
  /* ---------------- 素材库总表（覆盖索引里每一类素材） ---------------- */
  var libState = { key: "all", limit: 1000 };
  function libKeyOf(collKey, id) { return collKey + "|" + id; }
  function cardLib(coll, it) {
    var media = it.poster ? ("<div class=" + Q + "media" + Q + "><img loading=" + Q + "lazy" + Q + " src=" + Q + it.poster + Q + " alt=" + Q + Q + ">" +
      "<span class=" + Q + "tagbadge real" + Q + ">预览</span></div>") : "";
    var playTag = it.player ? ("<span class=" + Q + "tag play" + Q + ">" + (it.playerKind === "module" ? "▶ 需装依赖" : "▶ 可试播") + "</span>") : "";
    var meta = it.n ? "<span class=" + Q + "tag" + Q + ">" + durLabel(it.n) + "</span>" : "";
    return "<div class=" + Q + "card" + Q + " tabindex=" + Q + "0" + Q + " role=" + Q + "button" + Q + " data-lib=" + Q + esc(libKeyOf(coll.key, it.id)) + Q + ">" + media +
      "<div class=" + Q + "body" + Q + (media ? "" : " tight") + Q + "><div class=" + Q + "name" + Q + ">" + esc(it.title || it.id) + "</div>" +
      "<div class=" + Q + "sub" + Q + ">" + esc(it.sum || (it.cat ? it.cat : coll.label)) + "</div>" +
      "<div class=" + Q + "tags" + Q + "><span class=" + Q + "tag k" + Q + ">" + esc(coll.label) + "</span>" +
      (it.cat ? "<span class=" + Q + "tag" + Q + ">" + esc(it.cat) + "</span>" : "") + playTag + meta + "</div></div></div>";
  }
  function renderLibChips() {
    var bar = $("#libbar");
    if (!bar) return;
    var all = D.library.reduce(function (s, c) { return s + c.count; }, 0);
    var html = "<button class=" + Q + "libchip" + (libState.key === "all" ? " on" : "") + Q + " data-key=" + Q + "all" + Q + ">全部<span class=" + Q + "n" + Q + ">" + all + "</span></button>";
    D.library.forEach(function (c) {
      html += "<button class=" + Q + "libchip" + (libState.key === c.key ? " on" : "") + Q + " data-key=" + Q + esc(c.key) + Q + ">" + esc(c.label) +
        "<span class=" + Q + "n" + Q + ">" + c.count + "</span></button>";
    });
    bar.innerHTML = html;
  }
  function renderLib() {
    var grid = $("#gridLib");
    if (!grid) return;
    var pool = [];
    D.library.forEach(function (c) {
      if (libState.key !== "all" && libState.key !== c.key) return;
      c.items.forEach(function (it) {
        if (state.realOnly && !it.poster) return;
    if (state.playOnly && !canPlay('lib', it)) return;
        if (!hit([it.id, it.title, it.cat, it.sum, c.label].join(" "))) return;
        pool.push({ coll: c, it: it });
      });
    });
    grid.innerHTML = pool.slice(0, libState.limit).map(function (x) { return cardLib(x.coll, x.it); }).join("") ||
      "<p class=" + Q + "empty" + Q + ">这个条件下没有条目</p>";
    var c = $("#cLib");
    if (c) c.textContent = pool.length + " 条命中" + (pool.length > libState.limit ? "（显示前 " + libState.limit + "）" : "");
    var w = $("#libMoreWrap");
    if (w) w.style.display = pool.length > libState.limit ? "block" : "none";
  }
  function openLib(key, id) {
    var coll = D.library.filter(function (c) { return c.key === key; })[0];
    if (!coll) return;
    var it = coll.items.filter(function (x) { return x.id === id; })[0];
    if (!it) return;
    var h = "";
    h += "<div class=" + Q + "kv" + Q + "><b>类别</b><span>" + esc(coll.label) + "</span>" +
      (it.cat ? "<b>分类</b><span>" + esc(it.cat) + "</span>" : "") +
      "<b>id</b><span>" + esc(it.id) + "</span></div>";
    if (it.sum) h += "<h4>说明</h4><p class=" + Q + "sub" + Q + " style=" + Q + "-webkit-line-clamp:unset;display:block" + Q + ">" + esc(it.sum) + "</p>";
    if (it.hint) h += "<h4>怎么用</h4><pre>" + esc(it.hint) + "</pre>";
    if (it.path) h += "<h4>入口</h4><pre>" + esc(it.path) + "</pre>";
    if (it.link) h += "<h4>来源</h4><p class=" + Q + "libmeta" + Q + ">" + esc(it.link) + "</p>";
    if (it.poster) h += "<h4>预览</h4><img src=" + Q + it.poster + Q + " style=" + Q + "width:100%;border-radius:12px;border:1px solid var(--border)" + Q + ">";
    $("#mTitle").textContent = it.title || it.id;
    $("#mBody").innerHTML = h;
    $("#modal").classList.add("on");
    document.body.style.overflow = "hidden";
  }

  function renderAll() {
    var body = $("#allBody");
    if (!body || !D.allEntries) return;
    var q = (state.q || "").trim().toLowerCase();
    var rows = D.allEntries.filter(function (e) {
      if (!q) return true;
      return (e.id + " " + e.title + " " + e.coll + " " + e.cat).toLowerCase().indexOf(q) >= 0;
    });
    body.innerHTML = rows.map(function (e) {
      return "<tr><td class=" + Q + "c" + Q + ">" + esc(e.coll) + "</td><td class=" + Q + "t" + Q + ">" + esc(e.title) +
        "</td><td>" + esc(e.cat || "—") + "</td><td class=" + Q + "p" + Q + ">" + esc(e.path || "—") + "</td></tr>";
    }).join("");
    var c = $("#cAll");
    if (c) c.textContent = rows.length + " / " + D.allEntries.length + " 条";
  }
  function spy() {
    var chips = [].slice.call(document.querySelectorAll(".chip[data-cat]"));
    var cards = [].slice.call(document.querySelectorAll("#gridStyle .card"));
    if (chips.length && cards.length && state.cat === "全部") {
      var active = null;
      for (var i = 0; i < cards.length; i++) {
        if (cards[i].getBoundingClientRect().top <= 260) active = cards[i].getAttribute("data-cat");
        else break;
      }
      if (!active) active = cards[0].getAttribute("data-cat");
      chips.forEach(function (c) { c.classList.toggle("on", c.getAttribute("data-cat") === active); });
    }
    var secs = ["all", "films", "styles", "shots", "moves", "library", "tools"];
    var cur = null;
    secs.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= 200) cur = id;
    });
    [].slice.call(document.querySelectorAll(".raillinks a")).forEach(function (l) {
      l.classList.toggle("on", l.getAttribute("href") === "#" + cur);
    });
  }
  var baseRender = render;
  render = function () { baseRender(); renderLib(); renderAll(); };

  document.addEventListener("click", function (e) {
    var stat = e.target.closest && e.target.closest("a.statp[data-real]");
    if (stat) {
      var c = document.getElementById("realOnly");
      if (c && !c.checked) { c.checked = true; state.realOnly = true; render(); }
    }
  });
  document.addEventListener("click", function (e) {
    var lc = e.target.closest && e.target.closest(".libchip");
    if (lc) { libState.key = lc.getAttribute("data-key"); libState.limit = 1000; renderLibChips(); renderLib(); return; }
    if (e.target.id === "libMore") { libState.limit += 96; renderLib(); return; }
    var card = e.target.closest && e.target.closest("[data-lib]");
    if (card) {
      var v = card.getAttribute("data-lib").split("|");
      openLib(v[0], v[1]);
      setTimeout(function () { injectPlayer("l:" + v[0] + "|" + v[1]); }, 0);
      return;
    }
  });

  /* 滚动后收起导航链接，把整条控制区变成紧凑吸顶条 */
  var chromeEl = document.getElementById("chrome");
  function onScroll() { if (chromeEl) chromeEl.className = "chrome" + (window.scrollY > 120 ? " scrolled" : ""); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if ($("#statEntries")) $("#statEntries").textContent = D.coverage ? D.coverage.catalogEntries : D.totals.entries;
  var navCounts = {
    entries: D.totals.entries,
    films: D.videos.length + D.gifs.length,
    families: D.families.length,
    shots: D.shotCards.length,
    moves: D.motions.length,
    library: D.library.reduce(function (n, c) { return n + c.items.length; }, 0),
    tools: D.tools.length
  };
  [].slice.call(document.querySelectorAll(".sectn")).forEach(function (b) {
    var k = b.getAttribute("data-k");
    if (navCounts[k] !== undefined) b.textContent = navCounts[k];
  });
  [].slice.call(document.querySelectorAll(".navn")).forEach(function (b) {
    var k = b.getAttribute("data-k");
    if (navCounts[k] !== undefined) b.textContent = navCounts[k];
  });
  if ($("#statNote")) {
    var libTotal = D.library.reduce(function (n, c) { return n + c.items.length; }, 0);
    var styleCount = (D.coverage && D.coverage.styleCount) || 104;
    $("#statNote").textContent = "口径：" + D.shotCards.length + " 张镜头卡 ＋ " + D.motions.length + " 条动作 ＋ " + D.tools.length + " 个工具 ＋ " + libTotal + " 条素材库（含 " + styleCount + " 个风格实现）＝ " + D.totals.entries + " 条索引，全部可在本页看到；另有 " + D.families.length + " 张风格族卡是分组视图、" + (D.videos.length + D.gifs.length) + " 个视频/动图样片是演示资产。";
  }
  if ($("#covNum")) $("#covNum").textContent = D.coverage ? (D.coverage.covered + " / " + D.coverage.catalogEntries) : String(D.totals.entries);
  /* ---------------- 播放器：详情里直接看/试播 ---------------- */
  function addPlayBadge(html, kind) {
    if (!html) return html;
    var i = html.lastIndexOf("</div>");
    if (i < 0) return html;
    return html.slice(0, i) + "<span class=" + Q + "tagbadge pm" + Q + ">▶ 可播放</span>" + html.slice(i);
  }
  function isFile() { return location.protocol === "file:"; }
  function moduleHint(src) {
    var pre = '<pre style=' + Q + 'margin:10px 0 0' + Q + '>cd engines/claude-motion' + NL + 'npm ci' + NL + 'cd ../..' + NL + 'node scripts/serve.mjs' + NL + '# 然后访问 http://localhost:8088/' + esc(src) + '</pre>';
    var link = '<a href=' + Q + src + Q + ' target=' + Q + '_blank' + Q + '>先在新窗口打开试试</a>';
    return '<div class=' + Q + 'playnote' + Q + '>这是源码级 demo（ES module + 本地字体），要先装依赖、补字体，再用本地服务打开：' + pre + link + '</div>';
  }
  function playerBlock(src, kind, label, cover) {
    var head = '<h4>播放</h4>';
    if (kind === 'module') return head + moduleHint(src);
    // 不再内嵌第三方播放器（会带进它的整套界面，控制条还会压在画面上）
    // 只展示我们抓到的真实预览帧，播放交给原播放器。
    var poster = cover ? '<div class="frame poster"><img src="' + cover + '" alt=""></div>' : '';
    return head + poster +
      '<p class="playnote"><a class="playbtn" href="' + src + '" target="_blank" rel="noopener">▶ 在播放器里播放</a>' +
      ' <span>（新窗口打开 wise 播放器，动效实时渲染）</span></p>' +
      '<p class="playnote">该目录多数动效本身无音轨（462 条中 22 条带音效）</p>';
  }
  function fitCrop() {
    [].slice.call(document.querySelectorAll('.frame.crop')).forEach(function (wrap) {
      var shift = wrap.querySelector('.shift');
      if (!shift) return;
      var s = (wrap.clientWidth || 772) / 772;
      shift.style.transform = 'scale(' + s + ')';
      shift.style.left = (-429 * s) + 'px';
      shift.style.top = (-259 * s) + 'px';
    });
  }
  window.addEventListener('resize', fitCrop);
  var spyTick = false;
  window.addEventListener('scroll', function () {
    if (spyTick) return;
    spyTick = true;
    requestAnimationFrame(function () { spyTick = false; spy(); });
  }, { passive: true });
  function injectPlayer(attr, cover) {
    var kind = attr.slice(0, 1), id = attr.slice(2), src = null, pkind = "classic", label = "";
    if (kind === "m") {
      var mv = D.motions.filter(function (x) { return x.id === id; })[0];
      if (mv && mv.player) { src = mv.player; pkind = mv.playerKind || "classic"; label = "wise 动作播放器"; }
    } else if (kind === "l") {
      var parts = id.split("|");
      var coll = D.library.filter(function (c) { return c.key === parts[0]; })[0];
      var it = coll && coll.items.filter(function (x) { return x.id === parts[1]; })[0];
      if (it && it.player) { src = it.player; pkind = it.playerKind || "classic"; label = coll.label; }
    }
    if (!src) return;
    var body = $("#mBody");
    if (!body || body.querySelector(".frame") || body.querySelector(".playnote")) return;
    body.insertAdjacentHTML("afterbegin", playerBlock(src, pkind, label, cover));
    setTimeout(fitCrop, 60);
  }
  document.addEventListener("click", function (e) {
    var card = e.target.closest && e.target.closest("[data-open]");
    if (!card) return;
    var attr = card.getAttribute("data-open");
    if (attr.slice(0, 2) === 'l:') setTimeout(function () { injectPlayer(attr); }, 0);
  });
  // ?q= 深链：从「全部本地素材」面板跳过来时带上搜索词
  (function () {
    var q0 = new URLSearchParams(location.search).get('q');
    if (q0) { state.q = q0; var qi = $('#q'); if (qi) qi.value = q0; }
  })();
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('[data-copy]');
    if (!btn) return;
    doCopy(btn.getAttribute('data-copy'));
  });
  renderLibChips();
  renderChips();
  render();
})();
