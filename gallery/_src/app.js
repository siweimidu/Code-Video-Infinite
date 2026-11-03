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
  var state = { q: '', cat: '全部', realOnly: false, moveLimit: 72 };

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
      '<div class="sub">' + sub + '</div></div></div>';
  }
  function cardGif(g) {
    return '<div class="card" tabindex="0" role="button" data-open="g:' + esc(g.path) + '">' +
      '<div class="media"><img loading="lazy" src="' + g.src + '" alt="">' +
      '<span class="tagbadge real">动图</span><span class="corner">' + g.mb + 'MB</span></div>' +
      '<div class="body"><div class="name">' + esc(g.name) + '</div>' +
      '<div class="sub">' + esc(g.path) + '</div></div></div>';
  }
  function cardFamily(f) {
    var media = f.preview
      ? '<img loading="lazy" src="' + f.preview + '" alt=""><span class="tagbadge real">真实案例帧</span>'
      : swatch(f) + '<span class="tagbadge demo">示意</span>';
    var tags = f.mood.slice(0, 3).map(function (m) {
      return '<span class="tag">' + esc(m) + '</span>';
    }).join('') + f.libs.map(function (l) {
      return '<span class="tag k">' + esc(l) + '</span>';
    }).join('');
    return '<div class="card" tabindex="0" role="button" data-open="f:' + esc(f.id) + '" data-real="' + (f.preview ? 1 : 0) + '">' +
      '<div class="media">' + media + '</div>' +
      '<div class="body"><div class="name">' + esc(f.name) + '</div>' +
      '<div class="sub">' + esc(f.one || f.cat) + '</div>' +
      '<div class="tags">' + tags + '</div></div></div>';
  }
  var Q = String.fromCharCode(34);
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
  function cardShot(c) {
    var lv = energyLevel(c.en);
    var media;
    if (c.poster) {
      media = "<div class=" + Q + "media" + Q + "><img loading=" + Q + "lazy" + Q + " src=" + Q + c.poster + Q + " alt=" + Q + Q + ">" +
        "<span class=" + Q + "tagbadge" + Q + ">真实静帧</span>" + (c.d ? "<span class=" + Q + "corner" + Q + ">" + esc(c.d) + "</span>" : "") + "</div>";
    } else {
      var hue = hueOf(c.cat || c.id);
      var g1 = "radial-gradient(120% 110% at 18% 0%,hsl(" + hue + ",62%,94%),transparent 62%)";
      var g2 = "linear-gradient(165deg,#ffffff,#f5f5f7)";
      media = "<div class=" + Q + "media" + Q + "><div style=" + Q + "position:absolute;inset:0;background:" + g1 + "," + g2 + Q + "></div>" +
        "<div style=" + Q + "position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--font-mono);font-size:12px;letter-spacing:.06em;color:hsl(" + hue + ",40%,56%)" + Q + ">" + esc(c.cat || "") + "</div>" +
        "<span class=" + Q + "tagbadge demo" + Q + ">配方卡</span></div>";
    }
    var tags = "<span class=" + Q + "tag k" + Q + ">" + esc(c.cat) + "</span>" +
      (c.d ? "<span class=" + Q + "tag" + Q + ">" + esc(c.d) + "</span>" : "") +
      (lv ? "<span class=" + Q + "tag" + Q + ">" + energyBar(lv) + "</span>" : "");
    return "<div class=" + Q + "card" + Q + " tabindex=" + Q + "0" + Q + " role=" + Q + "button" + Q + " data-open=" + Q + "s:" + esc(c.id) + Q + ">" + media +
      "<div class=" + Q + "body" + Q + "><div class=" + Q + "name" + Q + ">" + esc(c.id) + "</div>" +
      "<div class=" + Q + "sub" + Q + ">" + esc(c.t) + "</div>" +
      "<div class=" + Q + "tags" + Q + ">" + tags + "</div></div></div>";
  }
  function cardMove(m) {
    return '<div class="card" tabindex="0" role="button" data-open="m:' + esc(m.id) + '">' +
      '<div class="body" style="padding-top:18px"><div class="name">' + esc(m.id) + '</div>' +
      '<div class="sub">' + esc(m.t) + '</div>' +
      '<div class="tags"><span class="tag k">' + esc(m.cat) + '</span>' +
      '<span class="tag">' + m.ms + 'ms</span>' + (m.loop ? '<span class="tag">循环</span>' : '') + '</div></div></div>';
  }
  function cardTool(t) {
    var media = t.cover
      ? '<img loading="lazy" src="' + t.cover + '" alt="">'
      : swatch({ pal: ['#ffffff', '#1d1d1f', '#0a84ff'], cat: '界面与屏幕', name: t.id });
    return '<div class="card" tabindex="0" role="button" data-open="t:' + esc(t.id) + '">' +
      '<div class="media">' + media + '</div>' +
      '<div class="body"><div class="name">' + esc(t.id) + '</div>' +
      '<div class="sub">' + esc(t.medium) + '</div></div></div>';
  }

  function renderChips() {
    var cats = ["全部"];
    D.families.forEach(function (f) { if (cats.indexOf(f.cat) < 0) cats.push(f.cat); });
    cats.sort(function (a, b) {
      return a === "全部" ? -1 : b === "全部" ? 1 : a.localeCompare(b, "zh");
    });
    $("#chips").innerHTML = cats.map(function (c) {
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
  function hit(s) {
    if (!state.q) return true;
    return String(s).toLowerCase().indexOf(state.q.toLowerCase()) >= 0;
  }

  function render() {
    $('#gridFilm').innerHTML = D.videos.map(cardFilm).concat(D.gifs.map(cardGif)).join('') || '<p class="empty">没有样片</p>';
    var fams = D.families.filter(function (f) {
      if (state.cat !== '全部' && f.cat !== state.cat) return false;
      if (state.realOnly && !f.preview) return false;
      return hit(f.name + ' ' + f.cat + ' ' + (f.one || '') + ' ' + f.mood.join(' ') + ' ' + f.id);
    });
    $('#gridStyle').innerHTML = fams.map(cardFamily).join('') || '<p class="empty">这个分类下没有匹配的风格族</p>';
    $('#cStyle').textContent = fams.length + ' / ' + D.totals.families;
    $('#cFilm').textContent = D.videos.length + ' 段视频 · ' + D.gifs.length + ' 个动图';
    var shots = D.shotCards.filter(function (c) { return !state.realOnly && hit(c.id + ' ' + c.t + ' ' + c.cat); });
    $('#gridShot').innerHTML = shots.slice(0, 160).map(cardShot).join('') || '<p class="empty">没有</p>';
    $('#cShot').textContent = shots.length + ' / ' + D.totals.shotCards;
    var moves = D.motions.filter(function (m) { return !state.realOnly && hit(m.id + ' ' + m.t + ' ' + m.cat); });
    $('#gridMove').innerHTML = moves.slice(0, state.moveLimit).map(cardMove).join('') || '<p class="empty">没有</p>';
    $('#cMove').textContent = moves.length + ' 条命中';
    $('#moreWrap').style.display = moves.length > state.moveLimit ? 'block' : 'none';
    $('#gridTool').innerHTML = D.tools.filter(function (t) { return !state.realOnly && hit(t.id + ' ' + t.medium); }).map(cardTool).join('');
  }

  function findObj(kind, id) {
    if (kind === 'f') return D.families.filter(function (x) { return x.id === id; })[0];
    if (kind === 'v' || kind === 'g') return D.videos.concat(D.gifs).filter(function (x) { return x.path === id; })[0];
    if (kind === 's') return D.shotCards.filter(function (x) { return x.id === id; })[0];
    if (kind === 'm') return D.motions.filter(function (x) { return x.id === id; })[0];
    if (kind === 't') return D.tools.filter(function (x) { return x.id === id; })[0];
  }

  function openDetail(attr) {
    var kind = attr.slice(0, 1), id = attr.slice(2), o = findObj(kind, id);
    if (!o) return;
    var h = '';
    if (kind === 'f') {
      h += '<div class="kv"><b>分类</b><span>' + esc(o.cat) + '</span><b>情绪</b><span>' + esc(o.mood.join(' / ') || '—') +
        '</span><b>实现库</b><span>' + esc(o.libs.join(' , ')) + '</span></div>';
      if (o.one) h += '<h4>一句话</h4><p class="sub">' + esc(o.one) + '</p>';
      h += '<h4>这个族在各库里的实现</h4><pre>' + esc(o.impls.map(function (i) {
        return i.library + ':' + i.id + NL + '  ' + i.path + (i.note ? '  — ' + i.note : '');
      }).join(NL + NL)) + '</pre>';
      var first = o.impls[0] || {};
      h += '<h4>怎么用</h4><pre>' + esc('node scripts/do.mjs "<你的需求>"' + NL +
        '# 在 brief.md 里写这一行：' + NL +
        '风格：' + o.id + '（' + first.library + ':' + first.id + '）') + '</pre>';
      if (o.preview) h += '<h4>真实案例帧</h4><img src="' + o.preview + '" style="width:100%;border-radius:12px;border:1px solid var(--border)">';
    } else if (kind === 'v' || kind === 'g') {
      h += kind === 'v'
        ? '<video src="' + o.src + '" controls autoplay loop style="width:100%;border-radius:12px;background:#000"></video>'
        : '<img src="' + o.src + '" style="width:100%;border-radius:12px">';
      h += '<h4>文件</h4><pre>' + esc(o.path + NL + o.mb + ' MB') + '</pre>';
    } else if (kind === 's') {
      h += '<div class="kv"><b>分类</b><span>' + esc(o.cat) + '</span><b>时长</b><span>' + esc(o.d) +
        '</span><b>能量</b><span>' + esc(o.en) + '</span></div>';
      h += '<h4>适用</h4><p class="sub">' + esc(o.t) + '</p>';
      h += '<h4>怎么用</h4><pre>' + esc('读卡全文：' + o.p + NL +
        '# 再按卡里「参考实现」去 demos/ 找源码，copy 进工程改参数') + '</pre>';
    } else if (kind === 'm') {
      h += '<div class="kv"><b>分类</b><span>' + esc(o.cat) + '</span><b>时长</b><span>' + o.ms +
        'ms</span><b>循环</b><span>' + (o.loop ? '是' : '否') + '</span></div>';
      h += '<h4>怎么用</h4><pre>' + esc('node engines/wise-motion/scripts/show.mjs ' + o.id + ' --details' + NL +
        'node engines/wise-motion/scripts/export.mjs ' + o.id + ' --out-dir <你的工程>') + '</pre>';
    } else if (kind === 't') {
      h += '<p class="sub">' + esc(o.t) + '</p>';
      h += '<h4>入口</h4><pre>' + esc('读：' + o.p + NL + '形态：' + o.medium) + '</pre>';
    }
    $('#mTitle').textContent = kind === 'f' ? o.name : (o.name || o.id || o.t);
    $('#mBody').innerHTML = h;
    $('#modal').classList.add('on');
    document.body.style.overflow = 'hidden';
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
  $('#more').addEventListener('click', function () { state.moveLimit += 96; render(); });

  $('#statFamilies').textContent = D.totals.families;
  $('#statPreview').textContent = D.totals.withPreview;
  $('#statVideo').textContent = D.totals.videos;
  $('#statShot').textContent = D.totals.shotCards;
  $('#statMove').textContent = D.totals.motions;
  $('#gen').textContent = '生成于 ' + D.generatedAt + ' · node scripts/build-gallery.mjs';
  /* ---------------- 素材库总表（覆盖索引里每一类素材） ---------------- */
  var libState = { key: "all", limit: 60 };
  function libKeyOf(collKey, id) { return collKey + "|" + id; }
  function cardLib(coll, it) {
    var media;
    if (it.poster) {
      media = "<div class=" + Q + "media" + Q + "><img loading=" + Q + "lazy" + Q + " src=" + Q + it.poster + Q + " alt=" + Q + Q + ">" +
        "<span class=" + Q + "tagbadge real" + Q + ">预览" + "</span></div>";
    } else {
      var hue = hueOf(coll.label + it.cat);
      var g1 = "radial-gradient(120% 110% at 18% 0%,hsl(" + hue + ",58%,94%),transparent 62%)";
      var g2 = "linear-gradient(165deg,#ffffff,#f5f5f7)";
      media = "<div class=" + Q + "media" + Q + "><div style=" + Q + "position:absolute;inset:0;background:" + g1 + "," + g2 + Q + "></div>" +
        "<div class=" + Q + "tile" + Q + " style=" + Q + "color:hsl(" + hue + ",38%,56%)" + Q + ">" + esc(it.cat || coll.label) + "</div>" +
        "<span class=" + Q + "tagbadge demo" + Q + ">无预览</span></div>";
    }
    var meta = it.n ? "<span class=" + Q + "tag" + Q + ">" + it.n + "ms</span>" : "";
    return "<div class=" + Q + "card" + Q + " tabindex=" + Q + "0" + Q + " role=" + Q + "button" + Q + " data-lib=" + Q + esc(libKeyOf(coll.key, it.id)) + Q + ">" + media +
      "<div class=" + Q + "body" + Q + "><div class=" + Q + "name" + Q + ">" + esc(it.title || it.id) + "</div>" +
      "<div class=" + Q + "sub" + Q + ">" + esc(it.sum || (it.cat ? it.cat : coll.label)) + "</div>" +
      "<div class=" + Q + "tags" + Q + "><span class=" + Q + "tag k" + Q + ">" + esc(coll.label) + "</span>" +
      (it.cat ? "<span class=" + Q + "tag" + Q + ">" + esc(it.cat) + "</span>" : "") + meta + "</div></div></div>";
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

  var baseRender = render;
  render = function () { baseRender(); renderLib(); };

  document.addEventListener("click", function (e) {
    var lc = e.target.closest && e.target.closest(".libchip");
    if (lc) { libState.key = lc.getAttribute("data-key"); libState.limit = 60; renderLibChips(); renderLib(); return; }
    if (e.target.id === "libMore") { libState.limit += 96; renderLib(); return; }
    var card = e.target.closest && e.target.closest("[data-lib]");
    if (card) { var v = card.getAttribute("data-lib").split("|"); openLib(v[0], v[1]); return; }
  });

  /* 滚动后收起导航链接，把整条控制区变成紧凑吸顶条 */
  var chromeEl = document.getElementById("chrome");
  function onScroll() { if (chromeEl) chromeEl.className = "chrome" + (window.scrollY > 120 ? " scrolled" : ""); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if ($("#statEntries")) $("#statEntries").textContent = D.coverage ? D.coverage.catalogEntries : D.totals.entries;
  if ($("#covNum")) $("#covNum").textContent = D.coverage ? (D.coverage.covered + " / " + D.coverage.catalogEntries) : String(D.totals.entries);
  renderLibChips();
  renderChips();
  render();
})();
