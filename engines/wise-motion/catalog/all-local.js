/* 全部本地素材面板（注入 wise 目录页） */
(function () {
  var D = window.__ALL_LOCAL__;
  if (!D) return;
  var css = document.createElement('style');
  css.textContent = [
    '#al-fab{position:fixed;right:22px;bottom:22px;z-index:9999;border:0;border-radius:999px;padding:12px 18px;',
    'background:#111;color:#fff;font:600 13px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;cursor:pointer;',
    'box-shadow:0 10px 30px -10px rgba(0,0,0,.55);opacity:.92}',
    '#al-fab:hover{opacity:1;transform:translateY(-1px)}',
    '#al-wrap{position:fixed;inset:0;z-index:10000;background:rgba(8,10,14,.88);backdrop-filter:blur(10px);display:none;',
    'font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC",sans-serif;color:#111}',
    '#al-wrap.on{display:flex;align-items:center;justify-content:center;padding:32px}',
    '#al{width:min(1080px,100%);max-height:86vh;background:#fff;border-radius:18px;display:flex;flex-direction:column;overflow:hidden}',
    '#al-h{display:flex;align-items:center;gap:14px;padding:18px 22px;border-bottom:1px solid #e6e6e8}',
    '#al-h b{font-size:16px}#al-h span{color:#8a8a8e;font-size:12.5px}',
    '#al-q{flex:1;border:1px solid #e2e2e5;border-radius:999px;padding:9px 14px;font-size:13px;outline:none}',
    '#al-x{border:0;background:#f2f2f4;border-radius:999px;padding:9px 16px;font-size:13px;cursor:pointer}',
    '#al-list{overflow:auto;padding:8px 10px 18px}',
    '.al-g{padding:14px 12px 6px;font-size:12px;font-weight:700;color:#6e6e73;letter-spacing:.04em;text-transform:uppercase}',
    '.al-row{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:10px}',
    '.al-row:hover{background:#f5f5f7}',
    '.al-row .nm{flex:1;min-width:0;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.al-row .sub{color:#8a8a8e;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:38%}',
    '.al-row .eng{font-size:11px;color:#0066cc;background:#eef5ff;border-radius:6px;padding:3px 7px}',
    '.al-row button{border:0;background:#0066cc;color:#fff;border-radius:999px;padding:6px 12px;font-size:12px;cursor:pointer}',
  ].join('');
  document.head.appendChild(css);

  var fab = document.createElement('button');
  fab.id = 'al-fab';
  fab.textContent = '全部本地素材 ' + D.total;
  document.body.appendChild(fab);

  var wrap = document.createElement('div');
  wrap.id = 'al-wrap';
  wrap.innerHTML = '<div id="al"><div id="al-h"><b>本地全部素材</b><span>' + D.total + ' 条 · 来自 9 个引擎</span>' +
    '<input id="al-q" placeholder="搜索 id / 标题 / 分类…"><button id="al-x">关闭</button></div><div id="al-list"></div></div>';
  document.body.appendChild(wrap);

  var list = wrap.querySelector('#al-list');
  var q = wrap.querySelector('#al-q');
  var groups = {};
  D.entries.forEach(function (e) { (groups[e.cn] = groups[e.cn] || []).push(e); });
  var order = ['动效条目', '镜头卡', '源码动画案例', '风格族', 'MG 风格', '动效函数', '场景起点', '源码组件', '物件模型', '出图模板', '研究清单', '网页设计学校', '制作系统', '工具'];

  function render(kw) {
    kw = (kw || '').trim().toLowerCase();
    var html = '';
    order.forEach(function (g) {
      var rows = (groups[g] || []).filter(function (e) {
        if (!kw) return true;
        return (e.id + ' ' + e.t + ' ' + e.sub + ' ' + e.eng).toLowerCase().indexOf(kw) >= 0;
      });
      if (!rows.length) return;
      html += '<div class="al-g">' + g + ' · ' + rows.length + '</div>';
      rows.slice(0, 400).forEach(function (e) {
        var isWise = e.eng === 'wise-motion' && e.c === 'motion-entry';
        html += '<div class="al-row"><span class="nm">' + escapeHtml(e.t) + '</span><span class="sub">' + escapeHtml(e.sub || '') + '</span>' +
          '<span class="eng">' + e.eng + '</span>' +
          (isWise ? '<button data-wise="' + e.id + '">在播放器打开</button>'
                  : '<a href="../../gallery/index.html?q=' + encodeURIComponent(e.id) + '" target="_blank" style="text-decoration:none"><button>选片台查看</button></a>') +
          '</div>';
      });
    });
    list.innerHTML = html || '<div class="al-g">没有匹配</div>';
  }
  function escapeHtml(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  fab.addEventListener('click', function () { wrap.classList.add('on'); render(q.value); q.focus(); });
  wrap.querySelector('#al-x').addEventListener('click', function () { wrap.classList.remove('on'); });
  wrap.addEventListener('click', function (e) { if (e.target === wrap) wrap.classList.remove('on'); });
  q.addEventListener('input', function () { render(q.value); });
  list.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-wise]') : null;
    if (!b) return;
    location.hash = b.getAttribute('data-wise');
    wrap.classList.remove('on');
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') wrap.classList.remove('on'); });
})();
