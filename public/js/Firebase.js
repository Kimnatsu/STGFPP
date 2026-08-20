/* ============================================================
   FPP v2 — Firebase.js
   기존 Firebase 프로젝트(fighting-path-patch)에 "연결"만 한다.
   데이터는 절대 삭제/변경하지 않으며, 읽기 + Firestore 규칙이
   허용하는 범위(좋아요/댓글/사용자 문서)의 쓰기만 수행한다.
   ============================================================ */
(function () {
  'use strict';

  /* ---- 기존 프로젝트 설정 (기존 저장소 firebase.js와 동일 프로젝트) ---- */
  var firebaseConfig = {
    apiKey: "AIzaSyCF1o7_h-70-HwfC_5YoxOmTJFTBfFa04w",
    authDomain: "fighting-path-patch.firebaseapp.com",
    projectId: "fighting-path-patch",
    storageBucket: "fighting-path-patch.firebasestorage.app",
    messagingSenderId: "1071337898551",
    appId: "1:1071337898551:web:d6f2c10f0f29e430a675b2",
    measurementId: "G-VMY3PHGN4C"
  };

  var app = null, db = null, auth = null, ready = false;
  try {
    if (window.firebase && firebase.apps) {
      app = firebase.initializeApp(firebaseConfig);
      db = firebase.firestore();
      auth = firebase.auth();
      try { auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL); } catch (e) {}
      ready = true;
    }
  } catch (err) {
    console.error('[FPP] Firebase init failed:', err);
  }

  /* ================= 공통 유틸 ================= */
  function tsToDate(v) {
    if (!v) return null;
    try {
      if (typeof v.toDate === 'function') return v.toDate();
      if (v.seconds) return new Date(v.seconds * 1000);
      var d = new Date(v);
      return isNaN(d.getTime()) ? null : d;
    } catch (e) { return null; }
  }
  function dateKey(v) {
    if (!v) return '';
    var d = tsToDate(v);
    if (d) return d.toISOString().slice(0, 10);
    if (typeof v === 'string') return v.slice(0, 10);
    return '';
  }
  function pick(d /*, keys... */) {
    for (var i = 1; i < arguments.length; i++) {
      var v = d[arguments[i]];
      if (v !== undefined && v !== null && v !== '') return v;
    }
    return null;
  }
  function errMsg(e) {
    if (!e) return 'Firebase 요청 중 오류가 발생했습니다.';
    var c = e.code || e.message || '';
    var map = {
      'auth/invalid-credential': '아이디 또는 비밀번호가 올바르지 않습니다.',
      'auth/wrong-password': '비밀번호가 올바르지 않습니다.',
      'auth/user-not-found': '가입되지 않은 이메일입니다.',
      'auth/invalid-email': '이메일 형식이 올바르지 않습니다.',
      'auth/email-already-in-use': '이미 사용 중인 이메일입니다.',
      'auth/weak-password': '비밀번호는 6자 이상이어야 합니다.',
      'auth/too-many-requests': '시도 횟수가 많습니다. 잠시 후 다시 시도해 주세요.',
      'auth/network-request-failed': '네트워크 연결을 확인해 주세요.',
      'auth/popup-closed-by-user': '로그인 창이 닫혔습니다.',
      'auth/operation-not-allowed': '해당 로그인 방식이 비활성화되어 있습니다.',
      'auth/requires-recent-login': '보안을 위해 다시 로그인한 뒤 시도해 주세요.',
      'permission-denied': 'Firestore 규칙에 의해 요청이 거부되었습니다.',
      'unavailable': 'Firebase 서비스를 사용할 수 없습니다. 잠시 후 다시 시도해 주세요.'
    };
    return map[c] || ('오류가 발생했습니다. (' + c + ')');
  }
  function serverNow() { return firebase.firestore.FieldValue.serverTimestamp(); }
  function inc(n) { return firebase.firestore.FieldValue.increment(n); }

  /* ================= 정규화 ================= */
  function normChar(d, docId) {
    return {
      docId: docId,
      id: d.id != null ? d.id : docId,
      name: pick(d, 'name', 'characterName', 'title') || '이름 미상',
      image: pick(d, 'image', 'imageUrl', 'img', 'icon'),
      grade: pick(d, 'grade', 'tier', 'rank'),
      attr: pick(d, 'attr', 'attribute', 'element'),
      type: pick(d, 'type') || '',
      desc: pick(d, 'desc', 'description', 'summary') || '',
      skills: d.skills || d.skillList || [],
      supportSkills: d.supportSkills || [],
      tips: d.tips || [],
      recentPatches: d.recentPatches || []
    };
  }
  function typeName(t) { return { force: '힘', ki: '기', sim: '속' }[t] || t || ''; }

  /* ================= 읽기 API ================= */
  function col(name) { return db.collection(name); }
  function docs(snap, withId) {
    return snap.docs.map(function (d) {
      var data = d.data() || {};
      return withId ? ({ docId: d.id, _ref: d.ref }, data) : data;
    });
  }
  function mapDocs(snap, fn) {
    return snap.docs.map(function (d) { return fn(d.data() || {}, d.id); });
  }

  function getCharacters() {
    if (!ready) return Promise.reject(new Error('Firebase 미준비'));
    return col('characters').get().then(function (s) {
      return mapDocs(s, normChar)
        .sort(function (a, b) { return (a.id || 0) - (b.id || 0); });
    });
  }
  function getSupportCharacters() {
    if (!ready) return Promise.reject(new Error('Firebase 미준비'));
    return col('supportCharacters').get().then(function (s) {
      return mapDocs(s, normChar).sort(function (a, b) { return (a.id || 0) - (b.id || 0); });
    });
  }

  /* pvpPatch: 문서 1개 = 캐릭터 1명의 패치 묶음 {type, patches[], charId, patchDate|displayStart|updatedAt} */
  function getPvpPatches() {
    if (!ready) return Promise.reject(new Error('Firebase 미준비'));
    return col('pvpPatch').get().then(function (s) {
      var nowKST = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 16);
      var out = [];
      s.docs.forEach(function (doc) {
        var d = doc.data() || {};
        if (d.visible === false) return;
        if (d.displayStart && nowKST < String(d.displayStart).slice(0, 16)) return; /* 예약 패치 */
        var raw = d.patches || [];
        var items = raw.map(function (p) {
          return typeof p === 'string' ? { type: d.type || 'fix', text: p } : ({ type: (p && p.type) || d.type || 'fix', text: (p && p.text) || '' });
        }).filter(function (p) { return p.text; });
        if (!items.length) return;
        var dk = d.patchDate ? String(d.patchDate).slice(0, 10) : (d.displayStart ? String(d.displayStart).slice(0, 10) : dateKey(d.updatedAt) || dateKey(d.createdAt));
        out.push({
          docId: doc.id,
          type: d.type || items[0].type || 'fix',
          charId: d.charId != null ? d.charId : null,
          name: pick(d, 'name', 'characterName') || '',
          image: pick(d, 'image', 'imageUrl', 'img'),
          date: dk,
          items: items
        });
      });
      out.sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
      return out;
    });
  }

  function getPatchNotes() {
    if (!ready) return Promise.reject(new Error('Firebase 미준비'));
    return col('patchNotes').get().then(function (s) {
      return mapDocs(s, function (d, id) {
        return {
          docId: id,
          title: pick(d, 'title', 'name') || '제목 없음',
          author: pick(d, 'author', 'writer', 'adminName') || 'FPP',
          date: dateKey(pick(d, 'date', 'patchDate')) || dateKey(d.createdAt) || dateKey(d.updatedAt),
          ts: tsToDate(d.createdAt || d.date || d.updatedAt),
          content: pick(d, 'content', 'text', 'body', 'html') || '',
          likeCount: d.likeCount || 0
        };
      })
        .filter(function (p) { return p.title; })
        .sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
    });
  }

  function normBanner(d, id) {
    return {
      docId: id,
      image: pick(d, 'imageUrl', 'image', 'bannerUrl', 'img'),
      title: pick(d, 'title', 'name') || '',
      tag: pick(d, 'tag', 'subTitle', 'subtitle') || '',
      page: pick(d, 'page', 'type', 'location') || '',
      link: pick(d, 'link', 'url', 'href') || '',
      order: d.order || 0
    };
  }
  function getBanners() {
    if (!ready) return Promise.reject(new Error('Firebase 미준비'));
    return col('banners').get().then(function (s) {
      return mapDocs(s, normBanner)
        .filter(function (b) { return b.image; })
        .sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
    });
  }
  function getEventBanners() {
    if (!ready) return Promise.reject(new Error('Firebase 미준비'));
    return col('eventBanners').get().then(function (s) {
      return mapDocs(s, normBanner)
        .filter(function (b) { return b.image; })
        .sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
    });
  }

  function getNotices() {
    if (!ready) return Promise.reject(new Error('Firebase 미준비'));
    return col('notices').get().then(function (s) {
      return mapDocs(s, function (d, id) {
        return {
          docId: id,
          title: pick(d, 'title', 'question', 'name') || '제목 없음',
          author: pick(d, 'author', 'writer') || 'FPP',
          date: dateKey(pick(d, 'date')) || dateKey(d.createdAt) || dateKey(d.updatedAt),
          content: pick(d, 'content', 'text', 'body', 'answer', 'html') || '',
          category: pick(d, 'category', 'type') || ''
        };
      }).sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
    });
  }

  function eventStatus(d) {
    if (d.status === 'ing' || d.status === 'end') return d.status;
    var end = d.endDate || d.endAt || d.displayEnd;
    if (end) {
      var ek = String(end).slice(0, 10);
      var today = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
      return ek < today ? 'end' : 'ing';
    }
    var st = d.startDate || d.startAt || d.displayStart;
    if (st) {
      var sk = String(st).slice(0, 10);
      var today2 = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
      return sk > today2 ? 'end' : 'ing';
    }
    return 'ing';
  }
  function getEvents() {
    if (!ready) return Promise.reject(new Error('Firebase 미준비'));
    return col('events').get().then(function (s) {
      return mapDocs(s, function (d, id) {
        return {
          docId: id,
          title: pick(d, 'title', 'name') || '제목 없음',
          author: pick(d, 'author', 'writer') || 'FPP',
          date: dateKey(pick(d, 'date')) || dateKey(d.createdAt) || dateKey(d.updatedAt),
          ts: tsToDate(d.createdAt || d.date || d.updatedAt),
          content: pick(d, 'content', 'text', 'body', 'html') || '',
          image: pick(d, 'image', 'imageUrl', 'img', 'banner'),
          startDate: dateKey(pick(d, 'startDate', 'startAt', 'displayStart')),
          endDate: dateKey(pick(d, 'endDate', 'endAt', 'displayEnd')),
          status: eventStatus(d),
          likeCount: d.likeCount || 0,
          commentCount: d.commentCount || 0
        };
      })
        .filter(function (e) { return e.title; })
        .sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
    });
  }

  function getBoards() {
    if (!ready) return Promise.reject(new Error('Firebase 미준비'));
    return col('boards').get().then(function (s) {
      return mapDocs(s, function (d, id) {
        return {
          docId: id,
          title: pick(d, 'title', 'name') || '제목 없음',
          text: pick(d, 'text', 'content', 'body') || '',
          category: pick(d, 'prefix', 'category') || '자유',
          author: pick(d, 'authorName', 'author', 'nickname') || '선원',
          uid: d.uid || '',
          date: dateKey(d.createdAt) || dateKey(pick(d, 'date')) || dateKey(d.editedAt),
          ts: tsToDate(d.createdAt || d.editedAt || d.date),
          images: d.images || [],
          likedBy: d.likedBy || [],
          likeCount: d.likeCount != null ? d.likeCount : (d.likedBy ? d.likedBy.length : 0),
          commentCount: d.commentCount || 0
        };
      }).sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
    });
  }

  /* ================= 댓글 ================= */
  function commentCol(type) { return col(type === 'board' ? 'boardComments' : 'eventComments'); }
  function parentKey(type) { return type === 'board' ? 'boardId' : 'eventId'; }

  function getComments(type, targetId) {
    if (!ready) return Promise.reject(new Error('Firebase 미준비'));
    return commentCol(type).get().then(function (s) {
      var key = parentKey(type);
      return mapDocs(s, function (d, id) {
        return {
          docId: id,
          uid: d.uid || '',
          text: d.text || '',
          authorName: d.authorName || d.author || '선원',
          authorIcon: d.authorIcon != null ? d.authorIcon : 0,
          createdAt: d.createdAt || null,
          target: d[key] != null ? d[key] : (d.targetId != null ? d.targetId : null)
        };
      })
        .filter(function (c) { return c.target == targetId; })
        .sort(function (a, b) {
          var at = a.createdAt && a.createdAt.seconds ? a.createdAt.seconds : 0;
          var bt = b.createdAt && b.createdAt.seconds ? b.createdAt.seconds : 0;
          return at - bt;
        });
    });
  }
  function addComment(type, targetId, text, user, udoc) {
    if (!ready) return Promise.reject(new Error('Firebase 미준비'));
    var payload = {};
    payload.uid = user.uid;
    payload.text = text;
    payload.authorName = (udoc && udoc.nickname) || user.displayName || '선원';
    payload.authorIcon = (udoc && udoc.profileIcon != null) ? udoc.profileIcon : 0;
    payload.createdAt = serverNow();
    payload[parentKey(type)] = targetId;
    var parentRef = col(type === 'board' ? 'boards' : 'events').doc(targetId);
    return commentCol(type).add(payload).then(function () {
      /* 규칙이 허용하는 commentCount 증가만 시도 (실패해도 무시) */
      return parentRef.update({ commentCount: inc(1) }).catch(function () {
        return parentRef.set({ commentCount: 1 }, { merge: true }).catch(function () {});
      });
    });
  }
  function deleteComment(type, docId) {
    if (!ready) return Promise.reject(new Error('Firebase 미준비'));
    var ref = commentCol(type).doc(docId);
    return ref.get().then(function (snap) {
      var d = snap.data() || {};
      var target = d[parentKey(type)] != null ? d[parentKey(type)] : d.targetId;
      return ref.delete().then(function () {
        if (target != null) {
          return col(type === 'board' ? 'boards' : 'events').doc(String(target))
            .update({ commentCount: inc(-1) }).catch(function () {});
        }
      });
    });
  }

  /* ================= 좋아요 ================= */
  function getLikeDoc(type, id) {
    if (!ready) return Promise.reject(new Error('Firebase 미준비'));
    return col('likes').doc(type + '_' + id).get().then(function (s) {
      var d = s.data();
      return d ? { likedBy: d.likedBy || [], likeCount: d.likeCount != null ? d.likeCount : (d.likedBy || []).length } : null;
    });
  }
  /* patchNotes / events — likes 컬렉션 토글 */
  function toggleGenericLike(type, id, uid) {
    if (!ready) return Promise.reject(new Error('Firebase 미준비'));
    var ref = col('likes').doc(type + '_' + id);
    return db.runTransaction(function (tx) {
      return tx.get(ref).then(function (snap) {
        var d = snap.data() || { likedBy: [] };
        var arr = d.likedBy || [];
        var liked = arr.indexOf(uid) > -1;
        var newArr = liked ? arr.filter(function (x) { return x !== uid; }) : arr.concat([uid]);
        tx.set(ref, { likedBy: newArr, likeCount: newArr.length }, { merge: true });
        return !liked;
      });
    });
  }
  /* boards — 문서 내부 likedBy 배열 토글 (규칙 허용 범위) */
  function toggleBoardLike(docId, uid, nowLiked) {
    if (!ready) return Promise.reject(new Error('Firebase 미준비'));
    var ref = col('boards').doc(docId);
    return ref.get().then(function (snap) {
      var d = snap.data() || {};
      var arr = d.likedBy || [];
      var liked = arr.indexOf(uid) > -1;
      if (nowLiked != null) liked = nowLiked;
      var newArr = liked ? arr.filter(function (x) { return x !== uid; }) : arr.concat([uid]);
      return ref.update({ likedBy: newArr, likeCount: newArr.length }).then(function () { return !liked; });
    });
  }
  function bumpUserLikeCount(uid, delta) {
    if (!ready) return;
    col('users').doc(uid).update({ likeCount: inc(delta) }).catch(function () {});
  }

  /* ================= 사용자 ================= */
  var USER_DEFAULTS = {
    nickname: '', email: '', profileIcon: 0,
    postCount: 0, commentCount: 0, likeCount: 0,
    favChars: [], favSupports: [],
    settings: {
      theme: 'dark', lang: 'ko', appIcon: 'navy',
      notifications: { patchnote: true, favorite: true, event: true, comment: true }
    }
  };
  function getUserDoc(uid) {
    if (!ready) return Promise.reject(new Error('Firebase 미준비'));
    return col('users').doc(uid).get().then(function (s) { return s.exists ? s.data() : null; });
  }
  function ensureUserDoc(user, extra) {
    if (!ready) return Promise.reject(new Error('Firebase 미준비'));
    var ref = col('users').doc(user.uid);
    return ref.get().then(function (snap) {
      if (snap.exists) {
        var d = snap.data() || {};
        var merged = {};
        Object.keys(USER_DEFAULTS).forEach(function (k) { if (d[k] === undefined) merged[k] = USER_DEFAULTS[k]; });
        if (Object.keys(merged).length) return ref.set(merged, { merge: true }).then(function () { return getUserDoc(user.uid); });
        return d;
      }
      var email = user.email || '';
      var fresh = {
        nickname: (extra && extra.nickname) || user.displayName || (email ? email.split('@')[0] : '선원'),
        email: email,
        profileIcon: 0,
        postCount: 0, commentCount: 0, likeCount: 0,
        favChars: [], favSupports: [],
        settings: USER_DEFAULTS.settings,
        createdAt: serverNow()
      };
      return ref.set(fresh, { merge: true }).then(function () { return fresh; });
    });
  }
  function updateUserDoc(uid, patch) {
    if (!ready) return Promise.reject(new Error('Firebase 미준비'));
    delete patch.uid; delete patch.createdAt; /* 규칙: 변경 불가 필드 */
    return col('users').doc(uid).set(patch, { merge: true });
  }
  function getUserStats(uid) {
    return getUserDoc(uid).then(function (d) {
      return {
        postCount: (d && d.postCount) || 0,
        commentCount: (d && d.commentCount) || 0,
        likeCount: (d && d.likeCount) || 0
      };
    });
  }
  function withdraw(user) {
    if (!ready) return Promise.reject(new Error('Firebase 미준비'));
    /* 규칙상 users 문서 삭제는 관리자만 가능 → 계정(Auth) 삭제로 처리 */
    return user.delete();
  }

  /* ================= 즐겨찾기 ================= */
  function getFavs(uid) {
    return getUserDoc(uid).then(function (d) {
      return { chars: (d && d.favChars) || [], supports: (d && d.favSupports) || [] };
    });
  }
  function saveFavs(uid, chars, supports) {
    return updateUserDoc(uid, { favChars: chars, favSupports: supports });
  }

  /* ================= 고객센터 1:1 문의 ================= */
  var LS_KEY = 'fpp_my_inquiries';
  function addInquiry(data, user) {
    if (!ready) return Promise.reject(new Error('Firebase 미준비'));
    var payload = {
      title: data.title, content: data.content, contact: data.contact || (user && user.email) || '',
      uid: user ? user.uid : 'guest', createdAt: serverNow(), status: '접수완료'
    };
    return col('inquiries').add(payload).then(function (ref) {
      return { docId: ref.id, title: payload.title, content: payload.content, date: new Date().toISOString().slice(0, 10), status: '접수완료', remote: true };
    }).catch(function () {
      /* 규칙에 inquiries 컬렉션이 없는 프로젝트 대비 로컬 폴백 */
      var list = [];
      try { list = JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch (e) {}
      var item = { docId: 'L' + Date.now(), title: payload.title, content: payload.content, contact: payload.contact, date: new Date().toISOString().slice(0, 10), status: '접수완료(기기)', remote: false };
      list.unshift(item);
      try { localStorage.setItem(LS_KEY, JSON.stringify(list.slice(0, 30))); } catch (e) {}
      return item;
    });
  }
  function getMyInquiries(user) {
    var local = [];
    try { local = JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch (e) {}
    if (!ready || !user) return Promise.resolve(local);
    return col('inquiries').where('uid', '==', user.uid).get().then(function (s) {
      var remote = mapDocs(s, function (d, id) {
        return { docId: id, title: d.title, content: d.content, date: dateKey(d.createdAt), status: d.status || '접수완료', remote: true };
      }).sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
      return remote.concat(local);
    }).catch(function () { return local; });
  }

  /* ================= 공개 ================= */
  window.FB = {
    ready: ready,
    auth: function () { return auth; },
    errMsg: errMsg, dateKey: dateKey, tsToDate: tsToDate,
    typeName: typeName,
    getBanners: getBanners,
    getEventBanners: getEventBanners,
    getCharacters: getCharacters,
    getSupportCharacters: getSupportCharacters,
    getPvpPatches: getPvpPatches,
    getPatchNotes: getPatchNotes,
    getNotices: getNotices,
    getEvents: getEvents,
    getBoards: getBoards,
    getComments: getComments,
    addComment: addComment,
    deleteComment: deleteComment,
    toggleBoardLike: toggleBoardLike,
    getLikeDoc: getLikeDoc,
    toggleGenericLike: toggleGenericLike,
    bumpUserLikeCount: bumpUserLikeCount,
    ensureUserDoc: ensureUserDoc,
    getUserDoc: getUserDoc,
    updateUserDoc: updateUserDoc,
    getUserStats: getUserStats,
    withdraw: withdraw,
    getFavs: getFavs,
    saveFavs: saveFavs,
    addInquiry: addInquiry,
    getMyInquiries: getMyInquiries
  };
  document.dispatchEvent(new CustomEvent('fpp:fb-ready', { detail: { ready: ready } }));
})();
