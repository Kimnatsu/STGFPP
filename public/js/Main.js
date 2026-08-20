/* ============================================================
   FPP v2 — Main.js
   Main.html: 홈 / 캐릭터 / 현질 서폿 캐릭터 / PvP 패치
   ============================================================ */
(function () {
  'use strict';

  var S = { chars: [], supports: [], pvps: [], banners: [], patches: [], events: [], boards: [], loaded: false };
  var F = { tab: 'char', grade: 'all', attr: 'all', type: 'all', sort: 'id', fav: false, q: '' };

  function loadAll(force) {
    if (S.loaded && !force) return Promise.resolve();
    if (!FB.ready) return Promise.reject(new Error('Firebase SDK 없음'));
    return Promise.all([
      FB.getCharacters(), FB.getSupportCharacters(), FB.getPvpPatches(),
      FB.getBanners(), FB.getPatchNotes(), FB.getEvents(), FB.getBoards()
    ]).then(function (r) {
      S.chars = r[0]; S.supports = r[1]; S.pvps = r[2];
      S.banners = r[3]; S.patches = r[4]; S.events = r[5]; S.boards = r[6];
      S.loaded = true;
      window.__FPP_CHARS = S.chars;
      window.__FPP_SUPPORTS = S.supports;
    });
  }
  function findChar(id, tab) {
    var pool = tab === 'support' ? S.supports : S.chars;
    var c = pool.filter(function (x) { return String(x.id) === String(id); })[0];
    return c || S.chars.concat(S.supports).filter(function (x) { return String(x.id) === String(id); })[0] || null;
  }

  /* ================= 목록 행 (패치노트/게시판 공용 구조) ================= */
  function rowHTML(o) {
    return '<li class="lst-row" data-go="' + UI.esc(o.go) + '" tabindex="0" role="button" aria-label="' + UI.esc(o.title) + '">' +
      '<div class="lst-main"><div class="lst-l1"><span class="badge ' + (o.badgeCls || 'badge--patch') + '">' + UI.esc(o.badge) + '</span>' +
      '<span class="lst-title">' + UI.esc(o.title) + '</span></div>' +
      '<div class="lst-l2"><span>' + UI.esc(o.author) + '</span><span>·</span><span>' + UI.esc(UI.fmtDate(o.date)) + '</span></div></div>' +
      (UI.isNew(o.date || o.ts) ? '<span class="lst-new">NEW</span>' : '') + '</li>';
  }
  function bindRows(root) {
    root.querySelectorAll('.lst-row').forEach(function (r) {
      var go = function () { location.href = r.getAttribute('data-go'); };
      r.addEventListener('click', go);
      r.addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); });
    });
  }

  /* ================= HOME ================= */
  function renderHome() {
    UI.setActiveNav('home');
    UI.fillBanner(document.getElementById('homeBannerMedia'), document.getElementById('homeBannerDots'), S.banners, function (b) {
      if (b.link) location.href = b.link;
    });
    UI.ticker(document.getElementById('homeTicker'), S.patches.slice(0, 8).map(function (p) { return { date: UI.fmtDate(p.date), title: p.title }; }));

    /* 이벤트 존재 여부 → 그리드 클래스 + Box 표시 */
    var ongoing = S.events.filter(function (e) { return e.status === 'ing'; });
    var grid = document.getElementById('homeGrid');
    var hasEvent = ongoing.length > 0;
    grid.classList.toggle('no-event', !hasEvent);
    var boxEvent = document.getElementById('boxEvent');
    if (hasEvent) boxEvent.style.display = '';
    else boxEvent.style.display = 'none';

    /* 패치노트 Box — 이벤트 없음 + 데스크톱이면 확장(12개) */
    var pnList = document.getElementById('homePatchList');
    var pnMax = (hasEvent || !UI.isDesktop()) ? 5 : 12;
    if (!S.patches.length) UI.empty(pnList, { title: '등록된 패치노트가 없습니다.' });
    else {
      pnList.innerHTML = '<ul class="lst">' + S.patches.slice(0, pnMax).map(function (p) {
        return rowHTML({ badge: '패치노트', badgeCls: 'badge--patch', title: p.title, author: p.author, date: p.date, ts: p.ts, go: 'Community.html#patch/view/' + p.docId });
      }).join('') + '</ul>';
      bindRows(pnList);
    }

    /* PvP Box — 원형 캐릭터 + 반걸침 뱃지 (최대 12 / 모바일 CSS로 8) */
    var pvpGrid = document.getElementById('homePvpGrid');
    var order = { buff: 0, nerf: 1, fix: 2 };
    var groups = S.pvps.slice().sort(function (a, b) { return (order[a.type] || 9) - (order[b.type] || 9); });
    var orbs = [];
    groups.some(function (g) {
      g.items.forEach(function (it) {
        var kind = ['buff', 'nerf', 'fix'].indexOf(it.type) > -1 ? it.type : (g.type || 'fix');
        var c = g.charId != null ? findChar(g.charId) : null;
        orbs.push({ charId: g.charId, kind: kind, name: (c && c.name) || g.name || '캐릭터', image: (c && c.image) || g.image, group: g });
      });
      return orbs.length >= 12;
    });
    orbs = orbs.slice(0, 12);
    if (!orbs.length) UI.empty(pvpGrid, { title: 'PvP 패치 데이터가 없습니다.' });
    else {
      var bname = { buff: '버프', nerf: '너프', fix: '기능수정' };
      var bcls = { buff: 'badge--buff', nerf: 'badge--nerf', fix: 'badge--fix' };
      pvpGrid.innerHTML = orbs.map(function (o, i) {
        return '<button class="orb" type="button" data-i="' + i + '" aria-label="' + UI.esc(o.name) + ' — ' + bname[o.kind] + '">' +
          '<span class="orb-img"><img src="' + UI.esc(o.image || UI.PLACEHOLDER_IMG) + '" alt="' + UI.esc(o.name) + '" loading="lazy" onerror="this.src=\'' + UI.PLACEHOLDER_IMG + '\'">' +
          '<span class="orb-badge badge ' + bcls[o.kind] + '">' + bname[o.kind] + '</span></span>' +
          '<span class="orb-name">' + UI.esc(o.name) + '</span></button>';
      }).join('');
      pvpGrid.querySelectorAll('.orb').forEach(function (b) {
        b.addEventListener('click', function () {
          var o = orbs[Number(b.getAttribute('data-i'))];
          route('pvp');
          var c = o.charId != null ? findChar(o.charId) : null;
          openCharDetail(c || { name: o.name, image: o.image, id: o.charId }, { patchGroup: o.group });
        });
      });
    }

    /* 이벤트 Box — 진행 중만, 롤링 */
    var roll = document.getElementById('homeEventRoll');
    if (hasEvent) {
      roll.innerHTML = ongoing.map(function (e, i) {
        var img = e.image ? '<img src="' + UI.esc(e.image) + '" alt="" loading="lazy" onerror="this.style.display=\'none\'">' : '';
        return '<button class="roll-card' + (i === 0 ? ' on' : '') + '" type="button" data-ev="' + UI.esc(e.docId) + '" aria-label="' + UI.esc(e.title) + '">' + img +
          '<span class="roll-scrim"><strong>' + UI.esc(e.title) + '</strong>' +
          '<span>' + (e.startDate || e.endDate ? UI.esc(UI.fmtDate(e.startDate) + (e.endDate ? ' ~ ' + UI.fmtDate(e.endDate) : '')) : '진행 중') + '</span></span></button>';
      }).join('') + (ongoing.length > 1 ? '<div class="roll-dots">' + ongoing.map(function (_, i) { return '<button type="button" class="' + (i === 0 ? 'on' : '') + '" aria-label="이벤트 ' + (i + 1) + '"></button>'; }).join('') + '</div>' : '');
      var cards = roll.querySelectorAll('.roll-card');
      var dots = roll.querySelectorAll('.roll-dots button');
      var idx = 0, timer = null;
      function show(n) {
        idx = (n + cards.length) % cards.length;
        cards.forEach(function (c, i) { c.classList.toggle('on', i === idx); });
        dots.forEach(function (d, i) { d.classList.toggle('on', i === idx); });
      }
      if (cards.length > 1) timer = setInterval(function () { show(idx + 1); }, 4200);
      dots.forEach(function (d, i) { d.addEventListener('click', function () { show(i); if (timer) clearInterval(timer); }); });
      roll.parentElement.addEventListener('mouseenter', function () { if (timer) clearInterval(timer); });
      roll.parentElement.addEventListener('mouseleave', function () { if (cards.length > 1 && !timer) timer = setInterval(function () { show(idx + 1); }, 4200); });
      cards.forEach(function (c) {
        c.addEventListener('click', function () { location.href = 'Community.html#event/view/' + c.getAttribute('data-ev'); });
      });
    }

    /* 커뮤니티 Box */
    var bList = document.getElementById('homeBoardList');
    if (!S.boards.length) UI.empty(bList, { title: '게시글이 없습니다.' });
    else {
      var catCls = { '자유': 'badge--free', '정보': 'badge--info', '질문': 'badge--q', '자랑': 'badge--brag' };
      bList.innerHTML = '<ul class="lst">' + S.boards.slice(0, 5).map(function (b) {
        return rowHTML({ badge: b.category, badgeCls: catCls[b.category] || 'badge--free', title: b.title, author: b.author, date: b.date, ts: b.ts, go: 'Community.html#board/view/' + b.docId });
      }).join('') + '</ul>';
      bindRows(bList);
    }

    var goPvp = document.getElementById('goPvpPage');
    if (goPvp && !goPvp.dataset.bound) {
      goPvp.dataset.bound = '1';
      goPvp.addEventListener('click', function () { route('pvp'); });
    }
    UI.watchReveals(document.getElementById('view-home'));
  }

  /* ================= CHARACTERS ================= */
  function setTab(tab) {
    F.tab = tab;
    var tc = document.getElementById('charTabChar'), ts = document.getElementById('charTabSupport');
    if (tc) tc.classList.toggle('is-on', tab === 'char');
    if (ts) ts.classList.toggle('is-on', tab === 'support');
  }
  function syncFavBtn() {
    var b = document.getElementById('fFav');
    if (b) {
      b.classList.toggle('is-on', F.fav);
      b.setAttribute('aria-pressed', String(F.fav));
    }
  }
  function fillSelect(sel, options, allLabel) {
    if (!sel) return;
    sel.innerHTML = '<option value="all">' + allLabel + '</option>' +
      options.map(function (o) { return '<option value="' + UI.esc(o) + '">' + UI.esc(o) + '</option>'; }).join('');
  }
  function buildFilterOptions() {
    var pool = F.tab === 'support' ? S.supports : S.chars;
    var grades = [], attrs = [];
    pool.forEach(function (c) {
      if (c.grade && grades.indexOf(c.grade) < 0) grades.push(c.grade);
      if (c.attr && attrs.indexOf(c.attr) < 0) attrs.push(c.attr);
    });
    fillSelect(document.getElementById('fGrade'), grades.sort(), '등급 전체');
    fillSelect(document.getElementById('fAttr'), attrs.sort(), '속성 전체');
    document.getElementById('fType').innerHTML =
      '<option value="all">타입 전체</option><option value="force">힘</option><option value="ki">기</option><option value="sim">속</option>';
    document.getElementById('fSort').innerHTML =
      '<option value="id">번호순</option><option value="name">이름순</option><option value="grade">등급순</option>';
  }
  function filteredChars() {
    var pool = (F.tab === 'support' ? S.supports : S.chars).slice();
    if (F.grade !== 'all') pool = pool.filter(function (c) { return String(c.grade || '') === F.grade; });
    if (F.attr !== 'all') pool = pool.filter(function (c) { return String(c.attr || '') === F.attr; });
    if (F.type !== 'all') pool = pool.filter(function (c) { return c.type === F.type; });
    if (F.fav) {
      var favs = F.tab === 'support' ? UI.favCache().supports : UI.favCache().chars;
      pool = pool.filter(function (c) { return favs.map(String).indexOf(String(c.id)) > -1; });
    }
    if (F.q) {
      var q = F.q.toLowerCase();
      pool = pool.filter(function (c) { return (c.name || '').toLowerCase().indexOf(q) > -1; });
    }
    if (F.sort === 'name') pool.sort(function (a, b) { return (a.name || '').localeCompare(b.name || '', 'ko'); });
    else if (F.sort === 'grade') pool.sort(function (a, b) { return String(a.grade || '').localeCompare(String(b.grade || '')); });
    else pool.sort(function (a, b) { return (a.id || 0) - (b.id || 0); });
    return pool;
  }
  function renderChars() {
    var grid = document.getElementById('charGrid');
    var list = filteredChars();
    if (!list.length) {
      UI.empty(grid, F.fav && !F.q
        ? { title: '즐겨찾기한 캐릭터가 없습니다.', desc: '캐릭터 카드의 별을 눌러 추가해보세요.', btnText: '즐겨찾기 필터 해제', btnHref: '#' }
        : { title: '조건에 맞는 캐릭터가 없습니다.' });
      if (F.fav) {
        var btn = grid.querySelector('.btn');
        if (btn) btn.addEventListener('click', function (e) { e.preventDefault(); F.fav = false; syncFavBtn(); renderChars(); });
      }
      return;
    }
    var kind = F.tab === 'support' ? 'support' : 'char';
    grid.innerHTML = list.map(function (c) {
      var fav = UI.isFav(kind, c.id);
      return '<article class="char-card rv" data-id="' + UI.esc(c.id) + '" tabindex="0" role="button" aria-label="' + UI.esc(c.name) + '">' +
        '<button class="char-fav' + (fav ? ' on' : '') + '" type="button" data-fav="' + UI.esc(c.id) + '" aria-label="즐겨찾기" aria-pressed="' + fav + '">' +
        (fav ? UI.IC.starFill : UI.IC.star) + '</button>' +
        '<div class="char-img"><img src="' + UI.esc(c.image || UI.PLACEHOLDER_IMG) + '" alt="' + UI.esc(c.name) + '" loading="lazy" onerror="this.src=\'' + UI.PLACEHOLDER_IMG + '\'"></div>' +
        '<div class="char-tx"><b>' + UI.esc(c.name) + '</b>' +
        '<span class="char-badges">' +
        (c.grade ? '<em class="badge badge--grade">' + UI.esc(c.grade) + '</em>' : '') +
        (c.attr ? '<em class="badge badge--attr">' + UI.esc(c.attr) + '</em>' : '') +
        (c.type ? '<em class="badge badge--type">' + UI.esc(FB.typeName(c.type)) + '</em>' : '') +
        '</span></div></article>';
    }).join('');
    grid.querySelectorAll('.char-card').forEach(function (card) {
      var id = card.getAttribute('data-id');
      var open = function () { openCharDetail(findChar(id, F.tab) || { id: id, name: '캐릭터' + id }); };
      card.addEventListener('click', function (e) { if (e.target.closest('.char-fav')) return; open(); });
      card.addEventListener('keydown', function (e) { if (e.key === 'Enter') open(); });
    });
    grid.querySelectorAll('[data-fav]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        var id = b.getAttribute('data-fav');
        var willBeOn = !UI.isFav(kind, id);
        b.classList.toggle('on', willBeOn);
        b.innerHTML = willBeOn ? UI.IC.starFill : UI.IC.star;
        b.setAttribute('aria-pressed', String(willBeOn));
        UI.toggleFav(kind, Number(id) === id || /^\d+$/.test(id) ? Number(id) : id);
        if (F.fav) renderChars();
      });
    });
    UI.watchReveals(grid);
  }
  function patchListHTML(patches, highlightGroup) {
    var bname = { buff: '버프', nerf: '너프', fix: '기능수정' };
    var bcls = { buff: 'badge--buff', nerf: 'badge--nerf', fix: 'badge--fix' };
    return patches.map(function (p) {
      var isHl = highlightGroup && p._gid === highlightGroup;
      return '<li class="cd-patch' + (isHl ? ' hl' : '') + '"><span class="badge ' + (bcls[p.type] || 'badge--fix') + '">' + (bname[p.type] || p.type) + '</span>' +
        '<span class="cd-patch-tx">' + UI.esc(p.text) + '</span><time>' + UI.esc(UI.fmtDate(p.date)) + '</time></li>';
    }).join('');
  }
  function openCharDetail(c, opts) {
    opts = opts || {};
    var kind = F.tab === 'support' ? 'support' : 'char';
    var fav = UI.isFav(kind, c.id);
    var skills = c.skills || [];
    var supSkills = c.supportSkills || [];
    var tips = c.tips || [];
    var recent = (c.recentPatches || []).map(function (p) {
      return typeof p === 'string' ? { text: p, type: 'fix', date: '' } : ({ text: p.text || p.title || '', type: p.type || 'fix', date: p.date || '' });
    }).filter(function (p) { return p.text; });

    /* 이 캐릭터의 전체 PvP 패치 히스토리 */
    var hist = [];
    S.pvps.forEach(function (g) {
      if (g.charId != null && String(g.charId) === String(c.id)) {
        g.items.forEach(function (it, i) { hist.push({ text: it.text, type: it.type, date: g.date, _gid: g.docId + '_' + i }); });
      }
    });
    var hlId = null;
    if (opts.patchGroup) {
      opts.patchGroup.items.forEach(function (it) {
        hist.unshift({ text: it.text, type: it.type, date: opts.patchGroup.date, _gid: 'hl_' + hist.length });
      });
      hlId = null; /* 그룹 전체 강조 대신 상단 고정 표시 */
    }

    var m = UI.openModal({
      title: c.name || '캐릭터',
      body: '<div class="cd-top"><span class="cd-img"><img src="' + UI.esc(c.image || UI.PLACEHOLDER_IMG) + '" alt="' + UI.esc(c.name || '') + '" onerror="this.src=\'' + UI.PLACEHOLDER_IMG + '\'"></span>' +
        '<div class="cd-id"><span class="char-badges">' +
        (c.grade ? '<em class="badge badge--grade">' + UI.esc(c.grade) + '</em>' : '') +
        (c.attr ? '<em class="badge badge--attr">' + UI.esc(c.attr) + '</em>' : '') +
        (c.type ? '<em class="badge badge--type">' + UI.esc(FB.typeName(c.type)) + '</em>' : '') +
        '</span>' + (c.desc ? '<p class="cd-desc">' + UI.esc(c.desc) + '</p>' : '') +
        '<button class="btn ' + (fav ? 'btn--gold' : 'btn--ghost') + ' btn--sm" id="cdFav" type="button">' +
        (fav ? UI.IC.starFill : UI.IC.star) + ' <span id="cdFavTx">' + (fav ? '즐겨찾기 해제' : '즐겨찾기 추가') + '</span></button></div></div>' +
        (skills.length ? '<div class="cd-sec"><h4>스킬</h4><ul class="cd-list">' + skills.map(function (s) {
          var nm = typeof s === 'string' ? s : (s.name || s.title || '');
          var ds = typeof s === 'string' ? '' : (s.desc || s.description || '');
          return '<li><b>' + UI.esc(nm) + '</b>' + (ds ? '<small>' + UI.esc(ds) + '</small>' : '') + '</li>';
        }).join('') + '</ul></div>' : '') +
        (supSkills.length ? '<div class="cd-sec"><h4>서폿 스킬</h4><ul class="cd-list">' + supSkills.map(function (s) {
          var nm = typeof s === 'string' ? s : (s.name || s.title || '');
          var ds = typeof s === 'string' ? '' : (s.desc || s.description || '');
          return '<li><b>' + UI.esc(nm) + '</b>' + (ds ? '<small>' + UI.esc(ds) + '</small>' : '') + '</li>';
        }).join('') + '</ul></div>' : '') +
        (hist.length ? '<div class="cd-sec"><h4>PvP 패치 히스토리</h4><ul class="cd-patches">' + patchListHTML(hist, hlId) + '</ul></div>'
          : (recent.length ? '<div class="cd-sec"><h4>최근 패치</h4><ul class="cd-patches">' + patchListHTML(recent) + '</ul></div>' : '')) +
        (tips.length ? '<div class="cd-sec"><h4>활용 팁</h4><ul class="cd-list">' + tips.map(function (tp) {
          var tx = typeof tp === 'string' ? tp : (tp.text || tp.title || '');
          return '<li><small>' + UI.esc(tx) + '</small></li>';
        }).join('') + '</ul></div>' : '')
    });
    var favBtn = m.body.querySelector('#cdFav');
    favBtn.addEventListener('click', function () {
      var nowOn = !UI.isFav(kind, c.id);
      UI.toggleFav(kind, /^\d+$/.test(String(c.id)) ? Number(c.id) : c.id);
      var tx = m.body.querySelector('#cdFavTx');
      if (tx) tx.textContent = nowOn ? '즐겨찾기 해제' : '즐겨찾기 추가';
      favBtn.classList.toggle('btn--gold', nowOn);
      favBtn.classList.toggle('btn--ghost', !nowOn);
      favBtn.innerHTML = (nowOn ? UI.IC.starFill : UI.IC.star) + ' <span id="cdFavTx">' + (nowOn ? '즐겨찾기 해제' : '즐겨찾기 추가') + '</span>';
      if (!document.getElementById('view-characters').hidden) renderChars();
    });
  }
  function bindCharPage() {
    var tc = document.getElementById('charTabChar'), ts = document.getElementById('charTabSupport');
    if (tc) tc.addEventListener('click', function () { setTab('char'); buildFilterOptions(); renderChars(); });
    if (ts) ts.addEventListener('click', function () { setTab('support'); buildFilterOptions(); renderChars(); });
    ['fGrade', 'fAttr', 'fType', 'fSort'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('change', function () {
        F[id.slice(1).toLowerCase()] = el.value;
        renderChars();
      });
    });
    var fav = document.getElementById('fFav');
    if (fav) fav.addEventListener('click', function () { F.fav = !F.fav; syncFavBtn(); renderChars(); });
    var sch = document.getElementById('fSearch');
    if (sch) {
      var tm = null;
      sch.addEventListener('input', function () {
        clearTimeout(tm);
        tm = setTimeout(function () { F.q = sch.value.trim(); renderChars(); }, 250);
      });
    }
    var rf = document.getElementById('fRefresh');
    if (rf) rf.addEventListener('click', function () {
      F.grade = 'all'; F.attr = 'all'; F.type = 'all'; F.sort = 'id'; F.fav = false; F.q = '';
      if (sch) sch.value = '';
      buildFilterOptions(); syncFavBtn(); renderChars();
      UI.toast('필터를 초기화했습니다.');
    });
  }

  /* ================= PVP PAGE ================= */
  function renderPvp() {
    UI.setActiveNav('pvp');
    var cols = { buff: document.getElementById('buffCol'), nerf: document.getElementById('nerfCol'), fix: document.getElementById('fixCol') };
    var bname = { buff: '버프', nerf: '너프', fix: '기능수정' };
    ['buff', 'nerf', 'fix'].forEach(function (kind) {
      var colEl = cols[kind];
      if (!colEl) return;
      var groups = S.pvps.filter(function (g) { return g.type === kind; });
      if (!groups.length) {
        colEl.innerHTML = '<div class="empty" style="padding:18px 10px"><p>' + bname[kind] + ' 내역이 없습니다.</p></div>';
        return;
      }
      colEl.innerHTML = groups.map(function (g) {
        var c = g.charId != null ? findChar(g.charId) : null;
        var name = (c && c.name) || g.name || ('캐릭터 No.' + g.charId);
        var img = (c && c.image) || g.image || UI.PLACEHOLDER_IMG;
        return '<article class="pvp-group rv" data-gid="' + UI.esc(g.docId) + '" tabindex="0" role="button" aria-label="' + UI.esc(name) + ' ' + bname[kind] + '">' +
          '<header class="pvp-gh"><span class="pvp-ava"><img src="' + UI.esc(img) + '" alt="" loading="lazy" onerror="this.src=\'' + UI.PLACEHOLDER_IMG + '\'"></span>' +
          '<div class="pvp-gt"><b>' + UI.esc(name) + '</b><time>' + UI.esc(UI.fmtDate(g.date)) + ' · ' + g.items.length + '건</time></div>' +
          '<span class="pvp-more">›</span></header>' +
          '<ul class="pvp-items">' + g.items.map(function (it) {
            return '<li>' + UI.esc(it.text) + '</li>';
          }).join('') + '</ul></article>';
      }).join('');
      colEl.querySelectorAll('.pvp-group').forEach(function (el) {
        var gid = el.getAttribute('data-gid');
        var g = groups.filter(function (x) { return x.docId === gid; })[0];
        var open = function () {
          var c = g && g.charId != null ? findChar(g.charId) : null;
          openCharDetail(c || { id: g.charId, name: g.name || '캐릭터', image: g.image }, { patchGroup: g });
        };
        el.addEventListener('click', open);
        el.addEventListener('keydown', function (e) { if (e.key === 'Enter') open(); });
      });
    });
    UI.watchReveals(document.getElementById('view-pvp'));
  }

  /* ================= 라우팅 ================= */
  var VIEWS = { home: 'view-home', characters: 'view-characters', pvp: 'view-pvp' };
  function route(name, params) {
    name = VIEWS[name] ? name : 'home';
    Object.keys(VIEWS).forEach(function (k) {
      document.getElementById(VIEWS[k]).hidden = k !== name;
    });
    window.scrollTo({ top: 0 });
    if (!S.loaded) return; /* 데이터 로드 전에는 스켈레톤 유지 */
    if (name === 'home') renderHome();
    if (name === 'characters') {
      UI.setActiveNav('characters');
      if (params) {
        if (params.tab) setTab(params.tab === 'support' ? 'support' : 'char');
        if (params.fav) { F.fav = true; syncFavBtn(); }
        buildFilterOptions();
        renderChars();
        if (params.char) {
          var c = findChar(params.char, params.tab);
          if (c) openCharDetail(c);
          else UI.toast('요청한 캐릭터를 찾을 수 없습니다.', 'err');
        }
      } else { buildFilterOptions(); renderChars(); }
      UI.watchReveals(document.getElementById('view-characters'));
    }
    if (name === 'pvp') renderPvp();
  }
  function parseHash() {
    var h = location.hash.replace(/^#/, '') || 'home';
    var qIdx = h.indexOf('?');
    var name = qIdx > -1 ? h.slice(0, qIdx) : h;
    var params = {};
    if (qIdx > -1) {
      h.slice(qIdx + 1).split('&').forEach(function (kv) {
        var p = kv.split('=');
        if (p[0]) params[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || '');
      });
    }
    return { name: name, params: params };
  }

  /* ================= 페이지 전용 배너 ================= */
  function pageBanners() {
    function byPage(key) {
      return S.banners.filter(function (b) {
        var p = b.page || '';
        return String(p).toLowerCase().indexOf(key) > -1;
      });
    }
    var cb = byPage('char'), pb = byPage('pvp');
    UI.fillBanner(document.getElementById('charBannerMedia'), null, cb.length ? cb : S.banners.slice(0, 1));
    UI.fillBanner(document.getElementById('pvpBannerMedia'), null, pb.length ? pb : S.banners.slice(0, 1));
  }

  /* ================= 부팅 ================= */
  function start() {
    bindCharPage();
    UI.skelGrid(document.getElementById('charGrid'), 8);
    UI.skelRows(document.getElementById('homePatchList'), 4);
    UI.skelRows(document.getElementById('homeBoardList'), 4);
    var pg = document.getElementById('homePvpGrid');
    if (pg) pg.innerHTML = '<div class="skel" style="height:150px;margin:10px"></div>';
    var er = document.getElementById('homeEventRoll');
    if (er) er.innerHTML = '<div class="skel" style="height:120px;margin:8px"></div>';

    var r = parseHash();
    route(r.name, r.params);

    loadAll().then(function () {
      pageBanners();
      var r2 = parseHash();
      route(r2.name, r2.params);
    }).catch(function (e) {
      UI.toast((FB.errMsg ? FB.errMsg(e) : '오류') + ' — 임시로 빈 목록을 표시합니다.', 'err');
      ['homePatchList', 'homeBoardList'].forEach(function (id) {
        UI.empty(document.getElementById(id), { title: '데이터를 불러오지 못했습니다.', desc: '네트워크 또는 Firebase 연결을 확인해 주세요.' });
      });
      UI.empty(document.getElementById('homePvpGrid'), { title: 'PvP 패치를 불러오지 못했습니다.' });
      UI.empty(document.getElementById('homeEventRoll'), { title: '이벤트를 불러오지 못했습니다.' });
      UI.empty(document.getElementById('charGrid'), { title: '캐릭터를 불러오지 못했습니다.' });
    });

    window.addEventListener('hashchange', function () {
      var rr = parseHash();
      route(rr.name, rr.params);
    });
    document.addEventListener('fpp:fav-changed', function () {
      if (!document.getElementById('view-characters').hidden) renderChars();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
