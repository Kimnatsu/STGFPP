/* ============================================================
   FPP v2 — common.js (공통 UI 레이어)
   헤더/내비게이션/팝업/프로필/설정/i18n/공유/스켈레톤 등
   ============================================================ */
(function () {
  'use strict';

  /* ================= 아이콘 (인라인 SVG) ================= */
  var IC = {
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M12 3l2.7 5.6 6.1.8-4.5 4.3 1.1 6L12 16.9 6.6 19.7l1.1-6L3.2 9.4l6.1-.8z" stroke-linejoin="round"/></svg>',
    starFill: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.4L12 17.4l-5.8 3 1.1-6.4L2.6 9.4l6.5-.9z"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="12" cy="12" r="3.4"/><path d="M19 12a7 7 0 0 0-.14-1.4l2-1.55-2-3.46-2.36.95a7 7 0 0 0-2.42-1.4L13.7 2.6h-3.4l-.38 2.54a7 7 0 0 0-2.42 1.4l-2.36-.95-2 3.46 2 1.55A7 7 0 0 0 5 12c0 .48.05.94.14 1.4l-2 1.55 2 3.46 2.36-.95a7 7 0 0 0 2.42 1.4l.38 2.54h3.4l.38-2.54a7 7 0 0 0 2.42-1.4l2.36.95 2-3.46-2-1.55c.09-.46.14-.92.14-1.4z" stroke-linejoin="round"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"><path d="M4 6.5h16M4 12h16M4 17.5h10"/></svg>',
    x: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M4 11l8-7 8 7v9h-6v-6h-4v6H4z" stroke-linejoin="round"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-3.6 4.4-5.5 8-5.5s6.5 1.9 8 5.5" stroke-linecap="round"/></svg>',
    swords: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M4 4l7 7M4 4v4M4 4h4M20 4l-7 7M20 4v4M20 4h-4M7 14l-3 3M17 14l3 3M8.5 12.5L5 16l3 3 3.5-3.5M15.5 12.5L19 16l-3 3-3.5-3.5"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5z" stroke-linejoin="round"/></svg>',
    cs: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M5 13a7 7 0 0 1 14 0v3a2 2 0 0 1-2 2h-1v-5h3M5 13v3a2 2 0 0 0 2 2h1v-5H5" stroke-linejoin="round"/><path d="M18 18a4 4 0 0 1-4 3h-2" stroke-linecap="round"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6zM10 19a2 2 0 0 0 4 0" stroke-linejoin="round"/></svg>',
    note: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h5" stroke-linejoin="round" stroke-linecap="round"/></svg>',
    heart: '<svg viewBox="0 0 24 24"><path d="M12 20.4l-7.2-7A4.8 4.8 0 0 1 12 6.6a4.8 4.8 0 0 1 7.2 6.8z"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="6" cy="12" r="2.6"/><circle cx="17.5" cy="5.5" r="2.6"/><circle cx="17.5" cy="18.5" r="2.6"/><path d="M8.4 10.8l6.8-4M8.4 13.2l6.8 4"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21" stroke-linecap="round"/></svg>',
    logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M14 4H6v16h8M10 12h11M17 8l4 4-4 4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 5l-7 7 7 7"/></svg>'
  };

  var LOGO_SVG = '<svg viewBox="0 0 64 64" width="30" height="30"><circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" stroke-width="3.4"/><path d="M32 13c-8 0-13.5 5.7-13.5 12.4 0 4.8 2.8 8.6 6.7 10.5v5.9l3.8-1.9 3 2.9 3-2.9 3.8 1.9v-5.9c3.9-1.9 6.7-5.7 6.7-10.5C45.5 18.7 40 13 32 13z" fill="currentColor"/><circle cx="26.3" cy="25.5" r="3.2" fill="var(--bg-2,#0b1a2b)"/><circle cx="37.7" cy="25.5" r="3.2" fill="var(--bg-2,#0b1a2b)"/><path d="M27.5 33h9" stroke="var(--bg-2,#0b1a2b)" stroke-width="2.3" stroke-linecap="round"/></svg>';

  /* 프로필 아바타 (SVG data URI) */
  function ava(bg, fg, face) {
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="' + bg + '"/>' + face + '</svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }
  var HAT = '<ellipse cx="32" cy="30" rx="17" ry="6" fill="#f5b942"/><path d="M21 30a11 11 0 0 1 22 0z" fill="#f5b942"/><rect x="21" y="27" width="22" height="4" fill="#c8532f"/><circle cx="27" cy="40" r="2.4" fill="#12283e"/><circle cx="37" cy="40" r="2.4" fill="#12283e"/><path d="M27 46q5 4 10 0" stroke="#12283e" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
  var SWORD = '<circle cx="32" cy="26" r="11" fill="#eaf3fc"/><path d="M20 22q12-10 24 0l-3 4q-9-6-18 0z" fill="#3ecf8e"/><circle cx="27" cy="28" r="2" fill="#12283e"/><circle cx="37" cy="28" r="2" fill="#12283e"/><path d="M14 46l36-12-2-4-36 12z" fill="#9db4ca"/>';
  var NAVI = '<circle cx="32" cy="28" r="11" fill="#ffd479"/><path d="M22 24a10 10 0 0 1 20 0l2 4H20z" fill="#56a9e6"/><circle cx="32" cy="24" r="3" fill="#eaf3fc"/><circle cx="28" cy="31" r="1.8" fill="#12283e"/><circle cx="36" cy="31" r="1.8" fill="#12283e"/><path d="M28 36q4 3 8 0" stroke="#12283e" stroke-width="2" fill="none" stroke-linecap="round"/>';
  var COOK = '<circle cx="32" cy="30" r="11" fill="#eaf3fc"/><path d="M24 20q2-6 8-6t8 6q3 1 2 5H22q-1-4 2-5z" fill="#ffffff"/><circle cx="28" cy="31" r="2" fill="#12283e"/><circle cx="37" cy="31" r="2" fill="#12283e"/><path d="M30 24q4-3 6 1" stroke="#f5b942" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M28 38h9" stroke="#12283e" stroke-width="2.4" stroke-linecap="round"/>';
  var DEER = '<circle cx="32" cy="30" r="11" fill="#c98d5f"/><path d="M22 20l-4-7 6 3M42 20l4-7-6 3" stroke="#8a5a33" stroke-width="2.6" fill="none" stroke-linecap="round"/><circle cx="28" cy="30" r="2" fill="#12283e"/><circle cx="36" cy="30" r="2" fill="#12283e"/><ellipse cx="32" cy="36" rx="4" ry="3" fill="#e8c9a8"/><circle cx="32" cy="35" r="1.4" fill="#12283e"/>';
  var ROBO = '<rect x="20" y="20" width="24" height="20" rx="5" fill="#9db4ca"/><rect x="25" y="26" width="5" height="5" rx="1" fill="#56a9e6"/><rect x="34" y="26" width="5" height="5" rx="1" fill="#56a9e6"/><path d="M27 36h10" stroke="#12283e" stroke-width="2.4" stroke-linecap="round"/><path d="M32 20v-5" stroke="#9db4ca" stroke-width="2.6"/><circle cx="32" cy="13" r="2.6" fill="#f5b942"/>';
  var AVATARS = [
    ava('#123a5e', '#f5b942', HAT),
    ava('#0f3d33', '#3ecf8e', SWORD),
    ava('#3d2c12', '#ffd479', NAVI),
    ava('#402028', '#e8484f', COOK),
    ava('#2e2418', '#c98d5f', DEER),
    ava('#1c2733', '#9db4ca', ROBO)
  ];
  var PLACEHOLDER_IMG = AVATARS[0];

  /* ================= i18n ================= */
  var DICT = {
    ko: { home: '홈', characters: '캐릭터', pvpPatch: 'PvP 패치', community: '커뮤니티', customerService: '고객센터', patchnote: '패치노트', shortcut: '바로가기', login: '로그인', signup: '회원가입', logout: '로그아웃', settings: '설정', favorites: '즐겨찾기', comHome: '커뮤니티 홈', board: '게시판', event: '이벤트', mainHome: '메인 홈' },
    en: { home: 'Home', characters: 'Characters', pvpPatch: 'PvP Patch', community: 'Community', customerService: 'Support', patchnote: 'Patch Notes', shortcut: 'More', login: 'Log in', signup: 'Sign up', logout: 'Log out', settings: 'Settings', favorites: 'Favorites', comHome: 'Community', board: 'Board', event: 'Events', mainHome: 'Main Home' }
  };
  function getLang() { try { return localStorage.getItem('fpp_lang') || 'ko'; } catch (e) { return 'ko'; } }
  function t(key) { return (DICT[getLang()] && DICT[getLang()][key]) || DICT.ko[key] || key; }
  function applyI18n() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
  }

  /* ================= 기본 유틸 ================= */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function fmtDate(v) {
    var s = typeof v === 'string' ? v.slice(0, 10) : (FB && FB.dateKey ? FB.dateKey(v) : '');
    if (!s) return '';
    var p = s.split('-');
    return p.length === 3 ? p[0] + '.' + p[1] + '.' + p[2] : s;
  }
  function isNew(v) {
    var s = typeof v === 'string' ? v.slice(0, 10) : (FB && FB.dateKey ? FB.dateKey(v) : '');
    if (!s) return false;
    var d = new Date(s + 'T00:00:00');
    if (isNaN(d.getTime())) return false;
    return (Date.now() - d.getTime()) < 7 * 86400 * 1000;
  }
  function renderContent(text) {
    var html = esc(text || '');
    html = html.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener" style="color:var(--blue)">$1</a>');
    html = html.split(/\n/).map(function (line) {
      if (/^##\s?/.test(line)) return '<h3 style="font-family:var(--font-d);font-size:19px;margin:18px 0 8px">' + line.replace(/^##\s?/, '') + '</h3>';
      if (/^#\s?/.test(line)) return '<h2 style="font-family:var(--font-d);font-size:22px;margin:20px 0 10px">' + line.replace(/^#\s?/, '') + '</h2>';
      if (!line.trim()) return '';
      return '<p>' + line + '</p>';
    }).join('');
    return html || '<p>내용이 없습니다.</p>';
  }
  function isDesktop() { return window.matchMedia('(min-width:768px)').matches; }

  /* ================= 토스트 ================= */
  function toast(msg, kind) {
    var root = document.getElementById('toastRoot');
    if (!root) return;
    if (!root.classList.contains('toast-root')) root.classList.add('toast-root');
    var el = document.createElement('div');
    el.className = 'toast' + (kind === 'err' ? ' toast--err' : kind === 'ok' ? ' toast--ok' : '');
    el.textContent = msg;
    root.appendChild(el);
    requestAnimationFrame(function () { el.classList.add('show'); });
    setTimeout(function () {
      el.classList.remove('show');
      setTimeout(function () { el.remove(); }, 350);
    }, 3000);
  }

  /* ================= 모달 ================= */
  function openModal(opts) {
    var back = document.createElement('div');
    back.className = 'modal-back';
    back.innerHTML = '<div class="modal" role="dialog" aria-modal="true" aria-label="' + esc(opts.title || '') + '">' +
      '<div class="modal-head"><h3 class="modal-title">' + esc(opts.title || '') + '</h3>' +
      '<button class="modal-x" type="button" aria-label="닫기">' + IC.x + '</button></div>' +
      '<div class="modal-body">' + (opts.body || '') + '</div></div>';
    document.body.appendChild(back);
    requestAnimationFrame(function () { back.classList.add('show'); });
    function close() {
      back.classList.remove('show');
      setTimeout(function () { back.remove(); }, 280);
      document.removeEventListener('keydown', onKey);
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    back.addEventListener('click', function (e) { if (e.target === back) close(); });
    back.querySelector('.modal-x').addEventListener('click', close);
    document.addEventListener('keydown', onKey);
    return { back: back, body: back.querySelector('.modal-body'), close: close };
  }

  /* ================= 팝업 (앵커 기반) ================= */
  var openPops = [];
  function closeAllPopups() {
    openPops.slice().forEach(function (p) { try { p.remove(); } catch (e) {} });
    openPops = [];
  }
  function popup(anchor, opts) {
    closeAllPopups();
    var pop = document.createElement('div');
    pop.className = 'pop' + (opts.cls ? ' ' + opts.cls : '');
    pop.setAttribute('role', 'dialog');
    pop.innerHTML = (opts.title ? '<div class="pop-title"><span>' + esc(opts.title) + '</span><button class="modal-x pop-x" type="button" aria-label="닫기">' + IC.x + '</button></div>' : '') +
      '<div class="pop-body">' + (opts.body || '') + '</div>';
    document.body.appendChild(pop);
    var r = anchor.getBoundingClientRect();
    var w = opts.width || 300;
    pop.style.width = w + 'px';
    var left = Math.min(Math.max(10, r.right - w), window.innerWidth - w - 10);
    pop.style.left = left + 'px';
    var top = r.bottom + 8;
    if (top + 380 > window.innerHeight) top = Math.max(10, r.top - 8 - Math.min(380, window.innerHeight - 20));
    pop.style.top = top + 'px';
    requestAnimationFrame(function () { pop.classList.add('show'); });
    var x = pop.querySelector('.pop-x');
    if (x) x.addEventListener('click', function () { pop.remove(); });
    setTimeout(function () {
      var onDoc = function (e) {
        if (!pop.contains(e.target) && !anchor.contains(e.target)) {
          pop.remove();
          openPops = openPops.filter(function (p) { return p !== pop; });
          document.removeEventListener('click', onDoc, true);
        }
      };
      document.addEventListener('click', onDoc, true);
    }, 0);
    window.addEventListener('resize', function h() { pop.remove(); window.removeEventListener('resize', h); });
    openPops.push(pop);
    return pop;
  }

  /* ================= 스크롤 리빌 ================= */
  var io = null;
  function watchReveals(root) {
    root = root || document;
    var els = Array.prototype.slice.call(root.querySelectorAll('.rv:not(.on)'));
    var vh = window.innerHeight || document.documentElement.clientHeight || 800;
    /* 1) 이미 뷰포트에 있고 실제로 렌더링된 요소는 즉시 표시 (결정적) */
    var rest = [];
    els.forEach(function (e) {
      var shown = false;
      try {
        var r = e.getBoundingClientRect();
        shown = e.offsetParent !== null && r.bottom > -40 && r.top < vh + 40 && r.width > 0;
      } catch (err) { shown = true; }
      if (shown) e.classList.add('on'); else rest.push(e);
    });
    if (!rest.length) return;
    /* 2) 나머지는 IntersectionObserver로 스크롤 리빌 */
    if (!('IntersectionObserver' in window)) { rest.forEach(function (e) { e.classList.add('on'); }); return; }
    if (!io) {
      io = new IntersectionObserver(function (ents) {
        ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('on'); io.unobserve(en.target); } });
      }, { threshold: 0.05, rootMargin: '0px 0px 60px 0px' });
    }
    rest.forEach(function (e) { io.observe(e); });
  }
  function forceRevealAll() {
    document.querySelectorAll('.rv:not(.on)').forEach(function (e) { e.classList.add('on'); });
  }

  /* ================= 스켈레톤 / 빈 상태 ================= */
  function skelRows(el, n) {
    if (!el) return;
    var h = '';
    for (var i = 0; i < (n || 4); i++) {
      h += '<div class="skel-row"><div class="skel skel-c" style="width:38px;height:38px;flex:none"></div>' +
        '<div style="flex:1;display:flex;flex-direction:column;gap:7px;justify-content:center">' +
        '<div class="skel" style="height:13px;width:' + (72 - i * 7) + '%"></div>' +
        '<div class="skel" style="height:10px;width:38%"></div></div></div>';
    }
    el.innerHTML = h;
  }
  function skelCards(el, n) {
    if (!el) return;
    var h = '<div class="cards cards--board">';
    for (var i = 0; i < (n || 3); i++) {
      h += '<div class="card"><div class="skel" style="height:120px"></div><div class="card-body"><div class="skel" style="height:15px;width:82%"></div><div class="skel" style="height:11px;width:45%"></div></div></div>';
    }
    el.innerHTML = h + '</div>';
  }
  function skelGrid(el, n) {
    if (!el) return;
    var h = '';
    for (var i = 0; i < (n || 8); i++) {
      h += '<div class="char-card"><div class="skel skel-c" style="width:70%;aspect-ratio:1;margin:10px auto 0"></div><div class="skel" style="height:12px;width:60%;margin:10px auto 14px"></div></div>';
    }
    el.innerHTML = h;
  }
  function empty(el, opts) {
    if (!el) return;
    opts = opts || {};
    el.innerHTML = '<div class="empty"><svg viewBox="0 0 64 64" width="46" height="46" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><circle cx="32" cy="32" r="26" stroke-dasharray="5 7"/><path d="M24 26l5 5-5 5M34 38h8" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '<p>' + esc(opts.title || '데이터가 없습니다.') + '</p>' +
      (opts.desc ? '<small>' + esc(opts.desc) + '</small>' : '') +
      (opts.btnText ? '<a class="btn btn--ghost btn--sm" style="margin-top:10px" href="' + esc(opts.btnHref || '#') + '">' + esc(opts.btnText) + '</a>' : '') + '</div>';
  }

  /* ================= 배너 / 티커 ================= */
  function fillBanner(mediaEl, dotsEl, items, onClick) {
    if (!mediaEl) return;
    items = (items || []).filter(function (b) { return b && b.image; });
    if (!items.length) { mediaEl.innerHTML = ''; if (dotsEl) dotsEl.innerHTML = ''; return; }
    mediaEl.innerHTML = items.map(function (b, i) {
      return '<div class="bimg' + (i === 0 ? ' on' : '') + '" data-link="' + esc(b.link || '') + '" role="button" tabindex="' + (b.link ? '0' : '-1') + '" aria-label="' + esc(b.title || '배너') + '">' +
        '<img src="' + esc(b.image) + '" alt="' + esc(b.title || '') + '" loading="' + (i === 0 ? 'eager' : 'lazy') + '" onerror="this.style.display=\'none\'">' +
        (b.title ? '<div class="banner-tag"><span class="banner-tag-txt">' + esc(b.title) + '</span>' + (b.tag ? '<small class="banner-tag-sub">' + esc(b.tag) + '</small>' : '') + '</div>' : '') + '</div>';
    }).join('');
    var idx = 0, timer = null;
    var slides = mediaEl.querySelectorAll('.bimg');
    var dots = [];
    if (dotsEl) {
      dotsEl.innerHTML = items.length > 1 ? items.map(function (_, i) { return '<button type="button" class="' + (i === 0 ? 'on' : '') + '" aria-label="배너 ' + (i + 1) + '"></button>'; }).join('') : '';
      dots = Array.prototype.slice.call(dotsEl.querySelectorAll('button'));
    }
    function show(n) {
      idx = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle('on', i === idx); });
      dots.forEach(function (d, i) { d.classList.toggle('on', i === idx); });
    }
    function go(n) {
      var link = slides[n].getAttribute('data-link');
      if (link && onClick) onClick(items[n]);
      else if (link) location.href = link;
    }
    slides.forEach(function (s, i) {
      s.addEventListener('click', function () { go(i); });
      s.addEventListener('keydown', function (e) { if (e.key === 'Enter') go(i); });
    });
    dots.forEach(function (d, i) { d.addEventListener('click', function () { show(i); restart(); }); });
    function restart() {
      if (timer) clearInterval(timer);
      if (slides.length > 1) timer = setInterval(function () { show(idx + 1); }, 5200);
    }
    restart();
    mediaEl.addEventListener('mouseenter', function () { if (timer) clearInterval(timer); });
    mediaEl.addEventListener('mouseleave', restart);
  }
  function ticker(el, items) {
    if (!el) return;
    if (!items.length) { el.style.display = 'none'; return; }
    el.style.display = '';
    var one = items.map(function (it) {
      return '<span class="tk-item"><b>' + esc(it.date) + '</b>' + esc(it.title) + '<i aria-hidden="true">✦</i></span>';
    }).join('');
    el.innerHTML = '<div class="tk-track">' + one + one + '</div>';
  }

  /* ================= 공유 ================= */
  function share(title, url) {
    url = url || location.href;
    if (navigator.share) {
      navigator.share({ title: title || 'FPP v2', url: url }).catch(function () {});
      return;
    }
    var ta = document.createElement('textarea');
    ta.value = url;
    ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) {}
    ta.remove();
    if (navigator.clipboard && !ok) {
      navigator.clipboard.writeText(url).then(function () { toast('링크가 복사되었습니다.', 'ok'); }, function () { toast('복사 실패 — ' + url); });
    } else {
      toast(ok ? '링크가 복사되었습니다.' : ('링크: ' + url), ok ? 'ok' : '');
    }
  }

  /* ================= 테마 ================= */
  function getTheme() { try { return localStorage.getItem('fpp_theme') || 'dark'; } catch (e) { return 'dark'; } }
  function setTheme(v) {
    try { localStorage.setItem('fpp_theme', v); } catch (e) {}
    document.documentElement.setAttribute('data-theme', v);
    if (currentUser && userDoc) {
      var s = userDoc.settings || {};
      s.theme = v;
      FB.updateUserDoc(currentUser.uid, { settings: s }).catch(function () {});
    }
  }

  /* ================= 인증 상태 ================= */
  var currentUser = null, userDoc = null, authListeners = [];
  function onAuth(fn) { authListeners.push(fn); }
  function emitAuth() { authListeners.forEach(function (fn) { fn(currentUser, userDoc); }); }
  function refreshUserDoc() {
    if (!currentUser) return Promise.resolve(null);
    return FB.getUserDoc(currentUser.uid).then(function (d) { userDoc = d; return d; });
  }

  /* ================= 즐겨찾기 ================= */
  var favCache = { chars: [], supports: [] };
  function loadFavs() {
    if (!currentUser) { favCache = { chars: [], supports: [] }; return Promise.resolve(favCache); }
    return FB.getFavs(currentUser.uid).then(function (f) { favCache = f; return f; }).catch(function () { return favCache; });
  }
  function toggleFav(kind, id) {
    if (!currentUser) { toast('로그인 후 이용할 수 있습니다.'); setTimeout(function () { location.href = 'Login.html'; }, 700); return Promise.resolve(false); }
    var key = kind === 'support' ? 'supports' : 'chars';
    var arr = favCache[key].slice();
    var i = arr.indexOf(id);
    var nowOn = i < 0;
    if (nowOn) {
      if (arr.length >= 16) { toast('즐겨찾기는 최대 16개까지 가능합니다.', 'err'); return Promise.resolve(false); }
      arr.push(id);
    } else arr.splice(i, 1);
    favCache[key] = arr;
    document.dispatchEvent(new CustomEvent('fpp:fav-changed', { detail: { kind: kind, id: id, on: nowOn } }));
    var patch = {}; patch[kind === 'support' ? 'favSupports' : 'favChars'] = arr;
    return FB.updateUserDoc(currentUser.uid, patch).then(function () { return nowOn; })
      .catch(function (e) { toast(FB.errMsg(e), 'err'); return nowOn; });
  }
  function isFav(kind, id) { return favCache[kind === 'support' ? 'supports' : 'chars'].indexOf(id) > -1; }

  /* ================= 내비게이션 정의 ================= */
  var PAGE = document.body.getAttribute('data-page') || 'main';
  function mainNav() {
    return [
      { key: 'home', icon: IC.home, label: t('home'), href: 'Main.html#home', hash: '#home' },
      { key: 'characters', icon: IC.user, label: t('characters'), href: 'Main.html#characters', hash: '#characters' },
      { key: 'pvp', icon: IC.swords, label: t('pvpPatch'), href: 'Main.html#pvp', hash: '#pvp' },
      { key: 'community', icon: IC.chat, label: t('community'), href: 'Community.html', ext: true },
      { key: 'cs', icon: IC.cs, label: t('customerService'), href: 'CustomerService.html', ext: true }
    ];
  }
  function comNav() {
    return [
      { key: 'comhome', icon: IC.home, label: t('comHome'), href: 'Community.html#home', hash: '#home' },
      { key: 'patch', icon: IC.note, label: t('patchnote'), href: 'Community.html#patch', hash: '#patch' },
      { key: 'board', icon: IC.chat, label: t('board'), href: 'Community.html#board', hash: '#board' },
      { key: 'event', icon: IC.star, label: t('event'), href: 'Community.html#event', hash: '#event' },
      { key: 'mainhome', icon: IC.back, label: t('mainHome'), href: 'Main.html#home', ext: true }
    ];
  }
  function bottomNav() {
    if (PAGE === 'community') return comNav();
    if (PAGE === 'cs') return [{ key: 'cs', icon: IC.cs, label: t('customerService'), href: 'CustomerService.html', active: true }];
    return mainNav().filter(function (n) { return !n.ext || n.key === 'community'; });
  }
  function setActiveNav(key) {
    document.querySelectorAll('.dnav').forEach(function (a) { a.classList.toggle('active', a.getAttribute('data-key') === key); });
    document.querySelectorAll('.btab').forEach(function (a) { a.classList.toggle('active', a.getAttribute('data-key') === key); });
    document.querySelectorAll('.dr-item').forEach(function (a) { a.classList.toggle('active', a.getAttribute('data-key') === key); });
  }

  /* ================= 렌더: 헤더/내비/드로어 ================= */
  function renderHeader() {
    var hd = document.getElementById('appHeader');
    if (!hd) return;
    var u = currentUser;
    var nick = (userDoc && userDoc.nickname) || (u && u.displayName) || '';
    var icon = userDoc && userDoc.profileIcon != null ? AVATARS[userDoc.profileIcon] : null;
    hd.innerHTML = '<div class="hd-in">' +
      (PAGE === 'main' || PAGE === 'community' || PAGE === 'cs' ? '<button class="icon-btn hamburger" id="hamburgerBtn" type="button" aria-label="전체 메뉴 열기">' + IC.menu + '</button>' : '') +
      '<a class="logo" href="Main.html#home" aria-label="FPP 홈으로"><span class="logo-mark">' + LOGO_SVG + '</span><span class="logo-txt">FPP</span></a>' +
      '<span class="hd-spacer"></span>' +
      '<div class="hd-actions">' +
      '<button class="icon-btn" id="favBtn" type="button" aria-label="' + t('favorites') + '" title="' + t('favorites') + '">' + IC.star + '</button>' +
      '<button class="icon-btn" id="setBtn" type="button" aria-label="' + t('settings') + '" title="' + t('settings') + '">' + IC.gear + '</button>' +
      (u
        ? '<button class="hd-avatar" id="profileBtn" type="button" aria-label="프로필 메뉴"><img src="' + (icon || PLACEHOLDER_IMG) + '" alt=""></button>'
        : '<span class="hd-auth"><a class="btn btn--ghost btn--sm" href="Login.html#signup">' + t('signup') + '</a>' +
          '<a class="btn btn--gold btn--sm" href="Login.html">' + t('login') + '</a></span>') +
      '</div></div>';
    var hb = document.getElementById('hamburgerBtn');
    if (hb) hb.addEventListener('click', toggleDrawer);
    document.getElementById('favBtn').addEventListener('click', function () { favPopup(this); });
    document.getElementById('setBtn').addEventListener('click', function () {
      if (isDesktop()) setPopup(this); else location.href = 'Setting.html';
    });
    var pb = document.getElementById('profileBtn');
    if (pb) pb.addEventListener('click', function () { profilePopup(this); });
  }
  function renderDeskNav() {
    var nav = document.getElementById('desktopNav');
    if (!nav) return;
    var items = PAGE === 'community' ? comNav() : mainNav();
    nav.innerHTML = '<div class="desk-nav-in">' + items.map(function (n) {
      var active = (PAGE === 'community' && n.key === 'comhome' && location.hash.replace('#', '') === 'home') ||
        location.hash.indexOf(n.hash || '@') === 0 && n.hash;
      return '<a class="dnav' + (active ? ' active' : '') + '" data-key="' + n.key + '" href="' + n.href + '">' + n.label + '</a>';
    }).join('') + '</div>';
  }
  function renderBottomTabs() {
    var tabs = document.getElementById('bottomTabs');
    if (!tabs) return;
    tabs.innerHTML = bottomNav().map(function (n) {
      return '<a class="btab" data-key="' + n.key + '" href="' + n.href + '" aria-label="' + n.label + '">' + n.icon + '<span>' + n.label + '</span></a>';
    }).join('');
  }
  function renderDrawer() {
    var dr = document.getElementById('navDrawer');
    if (!dr) return;
    var items = PAGE === 'community' ? comNav() : mainNav();
    dr.innerHTML = '<div class="drawer-logo">' + LOGO_SVG + '<b>FPP</b></div>' +
      items.map(function (n) { return '<a class="dr-item" data-key="' + n.key + '" href="' + n.href + '">' + n.icon + '<span>' + n.label + '</span></a>'; }).join('') +
      '<div class="drawer-foot"><span>Grand Line Log — FPP v2</span></div>';
    dr.querySelectorAll('.dr-item').forEach(function (a) { a.addEventListener('click', closeDrawer); });
  }
  function toggleDrawer() {
    var dr = document.getElementById('navDrawer'), bd = document.getElementById('drawerBackdrop');
    var open = dr.classList.toggle('open');
    if (bd) { bd.hidden = false; requestAnimationFrame(function () { bd.classList.toggle('show', open); }); }
    dr.setAttribute('aria-hidden', String(!open));
  }
  function closeDrawer() {
    var dr = document.getElementById('navDrawer'), bd = document.getElementById('drawerBackdrop');
    if (dr) { dr.classList.remove('open'); dr.setAttribute('aria-hidden', 'true'); }
    if (bd) { bd.classList.remove('show'); setTimeout(function () { bd.hidden = true; }, 300); }
  }

  /* ================= 즐겨찾기 팝업 ================= */
  function avatarOf(i) { return AVATARS[i] || PLACEHOLDER_IMG; }
  function favPopup(anchor) {
    var body = '<div class="fav-tabs"><button class="fav-tab is-on" data-ft="char" type="button">' + t('characters') + '</button>' +
      '<button class="fav-tab" data-ft="support" type="button">현질 서폿 캐릭터</button></div><div class="fav-body" id="favBody"></div>';
    var pop = popup(anchor, { title: t('favorites'), body: body, width: 340 });
    var fb = pop.querySelector('#favBody');
    function paint(kind) {
      var ids = kind === 'support' ? favCache.supports : favCache.chars;
      var list = (window.__FPP_CHARS || []).concat(window.__FPP_SUPPORTS || []);
      if (!ids.length) {
        fb.innerHTML = '<div class="empty" style="padding:22px 8px"><p>' + t('favorites') + '한 캐릭터 없음</p><small>추가해보세요</small>' +
          '<a class="btn btn--gold btn--sm" style="margin-top:10px" href="Main.html#characters?tab=' + (kind === 'support' ? 'support' : 'char') + '">페이지 이동</a></div>';
        return;
      }
      fb.innerHTML = '<div class="fav-grid">' + ids.slice(0, 16).map(function (id) {
        var c = list.find ? list.find(function (x) { return String(x.id) === String(id); }) : null;
        return '<button class="fav-cell" type="button" data-id="' + esc(id) + '" data-kind="' + kind + '" aria-label="' + esc((c && c.name) || '캐릭터 ' + id) + '">' +
          '<span class="fav-img"><img src="' + esc((c && c.image) || PLACEHOLDER_IMG) + '" alt="" onerror="this.src=\'' + PLACEHOLDER_IMG + '\'"></span>' +
          '<small>' + esc((c && c.name) || ('No.' + id)) + '</small></button>';
      }).join('') + '</div>';
      fb.querySelectorAll('.fav-cell').forEach(function (b) {
        b.addEventListener('click', function () {
          var kind2 = b.getAttribute('data-kind');
          location.href = 'Main.html#characters?tab=' + (kind2 === 'support' ? 'support' : 'char') + '&fav=1&char=' + encodeURIComponent(b.getAttribute('data-id'));
        });
      });
    }
    pop.querySelectorAll('.fav-tab').forEach(function (tb) {
      tb.addEventListener('click', function () {
        pop.querySelectorAll('.fav-tab').forEach(function (x) { x.classList.toggle('is-on', x === tb); });
        paint(tb.getAttribute('data-ft'));
      });
    });
    var ensureChars = Promise.resolve();
    if (!window.__FPP_CHARS) {
      ensureChars = FB.getCharacters().then(function (c) { window.__FPP_CHARS = c; return FB.getSupportCharacters(); })
        .then(function (s) { window.__FPP_SUPPORTS = s; }).catch(function () { window.__FPP_CHARS = window.__FPP_CHARS || []; window.__FPP_SUPPORTS = window.__FPP_SUPPORTS || []; });
    }
    ensureChars.then(function () { paint('char'); });
  }

  /* ================= 설정 ================= */
  var deferredInstall = null;
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferredInstall = e; });

  function noticeModal() {
    var m = openModal({ title: '공지사항', body: '<div id="ntcBox"><div class="skel-row"><div class="skel" style="height:14px;width:70%"></div></div><div class="skel-row"><div class="skel" style="height:14px;width:55%"></div></div></div>' });
    FB.getNotices().then(function (list) {
      var box = m.body.querySelector('#ntcBox');
      if (!list.length) { box.innerHTML = '<div class="empty"><p>등록된 공지사항이 없습니다.</p></div>'; return; }
      box.innerHTML = list.map(function (n) {
        return '<button class="ntc-row" type="button" data-i="' + esc(n.docId) + '"><span class="ntc-t">' + (n.category ? '<span class="badge badge--patch">' + esc(n.category) + '</span>' : '') + esc(n.title) + '</span><span class="ntc-m">' + esc(n.author) + ' · ' + esc(fmtDate(n.date)) + '</span></button>';
      }).join('');
      box.querySelectorAll('.ntc-row').forEach(function (r) {
        r.addEventListener('click', function () {
          var n = list.find(function (x) { return x.docId === r.getAttribute('data-i'); });
          openModal({ title: n.title, body: '<div class="detail-body" style="padding:6px 2px">' + renderContent(n.content) + '</div>' });
        });
      });
    }).catch(function (e) { m.body.querySelector('#ntcBox').innerHTML = '<div class="empty"><p>' + esc(FB.errMsg(e)) + '</p></div>'; });
  }
  function notifyModal() {
    var cur = (userDoc && userDoc.settings && userDoc.settings.notifications) || { patchnote: true, favorite: true, event: true, comment: true };
    var items = [
      { k: 'patchnote', t: '패치노트', d: '새 패치노트가 등록되면 알려드려요' },
      { k: 'favorite', t: '즐겨찾기', d: '즐겨찾기한 캐릭터의 패치가 있으면 알려드려요' },
      { k: 'event', t: '이벤트', d: '새 이벤트가 시작되면 알려드려요' },
      { k: 'comment', t: '댓글', d: '내 글에 댓글이 달리면 알려드려요' }
    ];
    var m = openModal({
      title: '알림 설정',
      body: items.map(function (it) {
        return '<label class="tgl-row"><span class="tgl-tx"><strong>' + it.t + '</strong><small>' + it.d + '</small></span>' +
          '<span class="tgl"><input type="checkbox" data-k="' + it.k + '"' + (cur[it.k] !== false ? ' checked' : '') + ' aria-label="' + it.t + ' 알림"><i></i></span></label>';
      }).join('') + '<p class="pick-note">설정값은 Firebase 사용자 정보에 저장됩니다.</p>'
    });
    m.body.querySelectorAll('input[type=checkbox]').forEach(function (cb) {
      cb.addEventListener('change', function () {
        if (!currentUser) { toast('로그인 후 저장할 수 있습니다.', 'err'); cb.checked = cur[cb.getAttribute('data-k')] !== false; return; }
        var s = (userDoc && userDoc.settings) || {};
        var n = s.notifications || {};
        n[cb.getAttribute('data-k')] = cb.checked;
        s.notifications = n;
        if (userDoc) userDoc.settings = s;
        FB.updateUserDoc(currentUser.uid, { settings: s }).then(function () { toast('알림 설정이 저장되었습니다.', 'ok'); })
          .catch(function (e) { toast(FB.errMsg(e), 'err'); });
      });
    });
  }
  function themeModal() {
    var cur = getTheme();
    var m = openModal({
      title: '테마 변경',
      body: '<div class="pick-grid">' +
        '<button class="pick' + (cur === 'dark' ? ' is-on' : '') + '" data-th="dark" type="button"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M20 13.5A8.5 8.5 0 0 1 10.5 4 8.5 8.5 0 1 0 20 13.5z" stroke-linejoin="round"/></svg>다크</button>' +
        '<button class="pick' + (cur === 'light' ? ' is-on' : '') + '" data-th="light" type="button"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5 5l1.8 1.8M17.2 17.2L19 19M19 5l-1.8 1.8M6.8 17.2L5 19" stroke-linecap="round"/></svg>라이트</button>' +
        '</div>'
    });
    m.body.querySelectorAll('.pick').forEach(function (b) {
      b.addEventListener('click', function () {
        setTheme(b.getAttribute('data-th'));
        m.body.querySelectorAll('.pick').forEach(function (x) { x.classList.toggle('is-on', x === b); });
        toast('테마가 적용되었습니다.', 'ok');
      });
    });
  }
  function appIconModal() {
    var icons = [
      { k: 'navy', c: 'icon-navy' }, { k: 'gold', c: 'icon-gold' }, { k: 'red', c: 'icon-red' }, { k: 'teal', c: 'icon-teal' }
    ];
    var cur = (userDoc && userDoc.settings && userDoc.settings.appIcon) || 'navy';
    var mk = function (c) { return '<span class="icon-prev ' + c + '">' + LOGO_SVG + '</span>'; };
    var m = openModal({
      title: '앱 아이콘 변경',
      body: '<div class="pick-grid">' + icons.map(function (ic) {
        return '<button class="pick pick--icon' + (cur === ic.k ? ' is-on' : '') + '" data-ic="' + ic.k + '" type="button">' + mk(ic.c) + ic.k + '</button>';
      }).join('') + '</div>' +
        '<button class="btn btn--gold btn--block" id="mkShortcut" type="button" style="margin-top:16px">바탕화면 바로가기 만들기</button>' +
        '<p class="pick-note">선택한 앱 아이콘은 바탕화면 바로가기 생성 시 적용됩니다.</p>'
    });
    m.body.querySelectorAll('.pick').forEach(function (b) {
      b.addEventListener('click', function () {
        cur = b.getAttribute('data-ic');
        m.body.querySelectorAll('.pick').forEach(function (x) { x.classList.toggle('is-on', x === b); });
        if (currentUser && userDoc) {
          var s = userDoc.settings || {}; s.appIcon = cur; userDoc.settings = s;
          FB.updateUserDoc(currentUser.uid, { settings: s }).catch(function () {});
        }
        toast('앱 아이콘이 선택되었습니다.');
      });
    });
    m.body.querySelector('#mkShortcut').addEventListener('click', function () {
      if (deferredInstall) {
        deferredInstall.prompt();
        deferredInstall.userChoice.then(function (ch) {
          toast(ch.outcome === 'accepted' ? '바로가기가 설치되었습니다.' : '설치가 취소되었습니다.', ch.outcome === 'accepted' ? 'ok' : '');
          deferredInstall = null;
        });
      } else {
        openModal({ title: '바로가기 안내', body: '<p style="font-size:14px;line-height:1.8;color:var(--text-2)">이 브라우저는 자동 바로가기 생성을 지원하지 않습니다.<br><b style="color:var(--text)">브라우저 메뉴 → "홈 화면에 추가" / "설치"</b>를 이용하면 선택한 앱 아이콘이 적용됩니다.</p>' });
      }
    });
  }
  function langModal() {
    var cur = getLang();
    var m = openModal({
      title: '언어 변경',
      body: '<div class="pick-grid">' +
        '<button class="pick' + (cur === 'ko' ? ' is-on' : '') + '" data-lg="ko" type="button">한국어</button>' +
        '<button class="pick' + (cur === 'en' ? ' is-on' : '') + '" data-lg="en" type="button">English</button></div>'
    });
    m.body.querySelectorAll('.pick').forEach(function (b) {
      b.addEventListener('click', function () {
        try { localStorage.setItem('fpp_lang', b.getAttribute('data-lg')); } catch (e) {}
        applyI18n();
        renderHeader(); renderDeskNav(); renderBottomTabs(); renderDrawer();
        m.body.querySelectorAll('.pick').forEach(function (x) { x.classList.toggle('is-on', x === b); });
        toast('언어가 변경되었습니다.', 'ok');
      });
    });
  }
  var SET_ACTIONS = {
    notice: noticeModal,
    notify: notifyModal,
    theme: themeModal,
    appIcon: appIconModal,
    lang: langModal
  };
  function setPopup(anchor) {
    var items = [
      { k: 'notice', ic: IC.note, t: '공지사항' },
      { k: 'notify', ic: IC.bell, t: '알림 설정' },
      { k: 'theme', ic: IC.gear, t: '테마 변경' },
      { k: 'appIcon', ic: IC.home, t: '앱 아이콘 변경' },
      { k: 'lang', ic: IC.chat, t: '언어 변경' }
    ];
    var pop = popup(anchor, { title: t('settings'), body: items.map(function (it) {
      return '<button class="pop-item" data-set="' + it.k + '" type="button">' + it.ic + '<span>' + it.t + '</span></button>';
    }).join(''), width: 230, cls: 'pop--menu' });
    pop.querySelectorAll('.pop-item').forEach(function (b) {
      b.addEventListener('click', function () {
        pop.remove();
        SET_ACTIONS[b.getAttribute('data-set')]();
      });
    });
  }

  /* ================= 프로필 ================= */
  function profilePopup(anchor) {
    var u = currentUser, ud = userDoc || {};
    var body = '<div class="profile-card">' +
      '<span class="profile-ava"><img src="' + esc(avatarOf(ud.profileIcon)) + '" alt="프로필"></span>' +
      '<div class="profile-tx"><b>' + esc(ud.nickname || u.displayName || '선원') + '</b><small>' + esc(u.email || '') + '</small></div>' +
      '<div class="profile-stats">' +
      '<span><b>' + (ud.postCount || 0) + '</b><small>게시글</small></span>' +
      '<span><b>' + (ud.commentCount || 0) + '</b><small>댓글</small></span>' +
      '<span><b>' + (ud.likeCount || 0) + '</b><small>좋아요</small></span>' +
      '</div></div>' +
      '<div class="pop-actions">' +
      '<button class="btn btn--ghost btn--block" id="pfInfo" type="button">내 정보</button>' +
      '<button class="btn btn--danger-ghost btn--block" id="pfOut" type="button">' + IC.logout + ' 로그아웃</button></div>';
    var pop = popup(anchor, { body: body, width: 300 });
    pop.querySelector('#pfInfo').addEventListener('click', function () { pop.remove(); myInfoModal(); });
    pop.querySelector('#pfOut').addEventListener('click', function () {
      FB.auth().signOut().then(function () {
        toast('로그아웃되었습니다.');
        setTimeout(function () { location.href = 'Main.html#home'; }, 500);
      });
    });
  }
  function myInfoModal() {
    var u = currentUser, ud = userDoc || {};
    var m = openModal({
      title: '내 정보',
      body: '<div class="myinfo">' +
        '<div class="myinfo-sec"><span class="myinfo-lb">프로필 아이콘</span>' +
        '<div class="ava-grid">' + AVATARS.map(function (a, i) {
          return '<button class="ava-pick' + ((ud.profileIcon || 0) === i ? ' is-on' : '') + '" data-av="' + i + '" type="button" aria-label="프로필 아이콘 ' + (i + 1) + '"><img src="' + a + '" alt=""></button>';
        }).join('') + '</div></div>' +
        '<div class="myinfo-sec myinfo-row"><span class="myinfo-lb">닉네임</span>' +
        '<span class="myinfo-nick"><b id="miNick">' + esc(ud.nickname || '선원') + '</b>' +
        '<button class="btn btn--ghost btn--sm" id="miNickBtn" type="button">변경</button></span></div>' +
        '<div class="myinfo-sec myinfo-row"><span class="myinfo-lb">로그인 이메일</span>' +
        '<span class="myinfo-mail">' + esc(u.email || '—') + '</span></div>' +
        '<button class="btn btn--danger-ghost btn--block" id="miWithdraw" type="button" style="margin-top:18px">탈퇴하기</button>' +
        '</div>'
    });
    m.body.querySelectorAll('.ava-pick').forEach(function (b) {
      b.addEventListener('click', function () {
        var idx = Number(b.getAttribute('data-av'));
        m.body.querySelectorAll('.ava-pick').forEach(function (x) { x.classList.toggle('is-on', x === b); });
        if (!u) return;
        FB.updateUserDoc(u.uid, { profileIcon: idx }).then(function () {
          if (userDoc) userDoc.profileIcon = idx;
          renderHeader();
          toast('프로필 아이콘이 변경되었습니다.', 'ok');
        }).catch(function (e) { toast(FB.errMsg(e), 'err'); });
      });
    });
    function bindNickBtn() {
      var btn = m.body.querySelector('#miNickBtn');
      if (!btn) return;
      btn.addEventListener('click', function () {
        var nickEl = m.body.querySelector('#miNick');
        if (nickEl.querySelector('input')) return;
        var cur = (userDoc && userDoc.nickname) || '';
        nickEl.innerHTML = '<input id="miNickIn" maxlength="16" value="' + esc(cur) + '" style="width:130px"> ' +
          '<button class="btn btn--gold btn--sm" id="miNickSave" type="button">저장</button>';
        m.body.querySelector('#miNickSave').addEventListener('click', function () {
          var v = m.body.querySelector('#miNickIn').value.trim();
          if (!v) { toast('닉네임을 입력해 주세요.', 'err'); return; }
          FB.updateUserDoc(u.uid, { nickname: v }).then(function () {
            if (userDoc) userDoc.nickname = v;
            nickEl.innerHTML = '<b>' + esc(v) + '</b> <button class="btn btn--ghost btn--sm" id="miNickBtn" type="button">변경</button>';
            renderHeader();
            toast('닉네임이 변경되었습니다.', 'ok');
            bindNickBtn();
          }).catch(function (e) { toast(FB.errMsg(e), 'err'); });
        });
      });
    }
    bindNickBtn();
    m.body.querySelector('#miWithdraw').addEventListener('click', function () {
      var c = openModal({
        title: '탈퇴하기',
        body: '<p style="font-size:14px;line-height:1.8;color:var(--text-2)">정말 탈퇴하시겠습니까?<br>탈퇴 시 <b style="color:#ff8b90">계정이 삭제</b>되며, 동일한 이메일로는 24시간 동안 다시 가입할 수 없습니다.<br>작성한 게시글·댓글은 별도로 삭제되지 않을 수 있습니다.</p>' +
          '<div class="fld-row mt16"><button class="btn btn--ghost" id="wdNo" type="button" style="flex:1">취소</button>' +
          '<button class="btn btn--danger" id="wdYes" type="button" style="flex:1">탈퇴 확정</button></div>'
      });
      c.body.querySelector('#wdNo').addEventListener('click', c.close);
      c.body.querySelector('#wdYes').addEventListener('click', function () {
        FB.withdraw(currentUser).then(function () {
          c.close(); m.close();
          toast('탈퇴가 완료되었습니다. 이용해주셔서 감사합니다.');
          setTimeout(function () { location.href = 'Main.html#home'; }, 700);
        }).catch(function (e) { toast(FB.errMsg(e), 'err'); });
      });
    });
  }

  /* ================= 부팅 ================= */
  function boot() {
    renderHeader();
    renderDeskNav();
    renderBottomTabs();
    renderDrawer();
    applyI18n();
    watchReveals();
    setTimeout(forceRevealAll, 900);
    window.addEventListener('load', forceRevealAll);
    var bd = document.getElementById('drawerBackdrop');
    if (bd) bd.addEventListener('click', closeDrawer);
    if (!FB.ready) {
      toast('Firebase SDK를 불러오지 못했습니다. 네트워크를 확인해 주세요.', 'err');
    } else {
      FB.auth().onAuthStateChanged(function (u) {
        currentUser = u;
        userDoc = null;
        if (u) {
          FB.ensureUserDoc(u).then(function (d) { userDoc = d; emitAuth(); return loadFavs(); }).catch(function () { emitAuth(); });
        } else { favCache = { chars: [], supports: [] }; emitAuth(); }
        renderHeader();
      });
    }
  }

  /* ================= 공개 ================= */
  window.UI = {
    IC: IC, LOGO_SVG: LOGO_SVG, PLACEHOLDER_IMG: PLACEHOLDER_IMG,
    t: t, applyI18n: applyI18n,
    fmtDate: fmtDate, isNew: isNew, esc: esc, renderContent: renderContent,
    toast: toast, openModal: openModal, popup: popup, closeAllPopups: closeAllPopups,
    watchReveals: watchReveals,
    skelRows: skelRows, skelCards: skelCards, skelGrid: skelGrid, empty: empty,
    fillBanner: fillBanner, ticker: ticker, share: share,
    avatarOf: avatarOf, AVATARS: AVATARS,
    currentUser: function () { return currentUser; },
    userDoc: function () { return userDoc; },
    onAuth: onAuth, refreshUserDoc: refreshUserDoc,
    setActiveNav: setActiveNav,
    isDesktop: isDesktop,
    isFav: isFav,
    loadFavs: loadFavs, toggleFav: toggleFav, favCache: function () { return favCache; },
    SET_ACTIONS: SET_ACTIONS,
    getTheme: getTheme, setTheme: setTheme
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
