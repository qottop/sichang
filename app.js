/* เกาะสีชัง prototype — HTML/CSS/JS ล้วน ข้อมูลอยู่ใน data.js, สถานะเก็บใน localStorage */
(function () {
  'use strict';
  const D = DATA, I = I18N;
  const KEY = 'sichang_proto_v1';
  const BOOKING_POINTS = D.bookingPoints || 30;
  const $ = s => document.querySelector(s);
  const view = $('#view'), topEl = $('#top'), navEl = $('#nav'), modalEl = $('#modal'), toastsEl = $('#toasts'), offEl = $('#offline');

  /* ---------- state ---------- */
  function defaults() {
    return { user: null, lang: 'th', notif: true, points: 0, log: [], checkins: {}, missions: {}, redeemed: [], bookings: [], ride: null, seq: 1 };
  }
  function load() { try { return Object.assign(defaults(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { return defaults(); } }
  let S = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } }

  let route = { name: 'home' }, stack = [], afterFn = null, timers = [], modalFn = null, lastKey = '';
  let mapLayer = 'food', bookTab = 'activity', bookCat = 'all', bookPrice = 'all';
  let form = null, draft = null, payMethod = 'promptpay', ferryDir = 'in', authMode = 'login';
  let rideForm = { pick: 'pier', drop: 'beach', type: 'tricycle' };

  const ITEMS = D.activities.map(a => Object.assign({ kind: 'activity' }, a)).concat(D.services.map(s => Object.assign({ kind: 'service' }, s)));
  const itemById = id => ITEMS.find(i => i.id === id);

  /* ---------- helpers ---------- */
  const pad = n => String(n).padStart(2, '0');
  const ymd = (d = new Date()) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function t(k, vars) {
    let s = (I[S.lang] && I[S.lang][k]) || I.th[k] || k;
    if (vars) for (const v in vars) s = s.split('{' + v + '}').join(vars[v]);
    return s;
  }
  const L = o => (o == null ? '' : (typeof o === 'object' ? (o[S.lang] || o.th) : o));
  const money = n => Number(n).toLocaleString('en-US') + ' ' + t('baht');
  const fmtTs = ts => { const d = new Date(ts); return ymd(d) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()); };

  function addPoints(n, src, label) {
    S.points += n;
    S.log.unshift({ t: Date.now(), n: n, src: src, label: label });
    save();
  }

  function toast(msg, type, kind) {
    if (kind === 'remind' && !S.notif) return;
    if (kind === 'booking' && !S.notif) return;
    const el = document.createElement('div');
    el.className = 'toast ' + (type || '');
    el.textContent = msg;
    while (toastsEl.children.length >= 3) toastsEl.removeChild(toastsEl.firstChild);
    toastsEl.appendChild(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 320); }, 2800);
  }

  function clearTimers() { timers.forEach(id => { clearTimeout(id); clearInterval(id); }); timers = []; }
  function openModal(html) { modalEl.innerHTML = '<div class="sheet">' + html + '</div>'; modalEl.hidden = false; }
  function closeModal() { modalEl.hidden = true; modalEl.innerHTML = ''; modalFn = null; }

  /* ---------- island SVG (วาดเอง) ---------- */
  const ISL = 'M70 190 C60 130 110 80 170 70 C230 55 300 80 330 130 C360 180 340 240 290 270 C240 300 160 305 110 270 C85 250 72 225 70 190 Z';
  function tree(x, y, s) {
    s = s || 1;
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><rect x="-1.6" y="0" width="3.2" height="10" rx="1" fill="#8a5a2b"/><circle cy="-2" r="7" fill="#2e8b3e"/><circle cx="-3" cy="-5" r="4" fill="#3da552"/></g>';
  }
  function islandSVG(inner) {
    const trees = [[118, 175, 1], [135, 150, 1.1], [205, 168, 1], [232, 196, 1.1], [255, 168, 1], [112, 238, .9], [320, 190, .9], [196, 238, 1], [290, 128, 1], [150, 105, .9], [232, 130, 1]];
    return '<svg class="island" viewBox="0 0 400 340" role="img" aria-label="Ko Sichang map">' +
      '<defs><linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fe3f3"/><stop offset="1" stop-color="#1b9ac4"/></linearGradient>' +
      '<radialGradient id="grass" cx=".5" cy=".4" r=".7"><stop offset="0" stop-color="#9bdc72"/><stop offset="1" stop-color="#4fa64a"/></radialGradient></defs>' +
      '<rect width="400" height="340" fill="url(#sea)"/>' +
      '<g class="waves" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2" stroke-linecap="round">' +
      '<path d="M18 120q10-8 20 0t20 0"/><path d="M30 300q10-8 20 0t20 0"/><path d="M345 285q10-8 20 0t20 0"/><path d="M355 150q10-8 20 0t20 0"/><path d="M20 210q10-8 20 0t20 0"/><path d="M180 322q10-8 20 0t20 0"/><path d="M300 52q10-8 20 0t20 0"/></g>' +
      '<circle cx="352" cy="38" r="22" fill="#ffe27a"/><circle cx="352" cy="38" r="30" fill="#ffe27a" opacity=".3"/>' +
      '<g class="cloud" fill="#fff" opacity=".9"><ellipse cx="70" cy="40" rx="26" ry="10"/><ellipse cx="88" cy="34" rx="18" ry="10"/><ellipse cx="55" cy="36" rx="14" ry="8"/></g>' +
      '<path d="' + ISL + '" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="12"/>' +
      '<path d="' + ISL + '" fill="#f6e3b0"/>' +
      '<path d="' + ISL + '" fill="url(#grass)" transform="translate(200 185) scale(.86) translate(-200 -185)"/>' +
      '<path d="M120 205 Q165 100 215 150 Q250 90 300 175 Q220 215 120 205Z" fill="#6bb85a" opacity=".85"/>' +
      '<path d="M215 150 Q250 90 300 175 Q270 160 215 150Z" fill="#4c9a49" opacity=".9"/>' +
      trees.map(a => tree(a[0], a[1], a[2])).join('') +
      '<g class="boat" transform="translate(30 270)"><path d="M0 8 L36 8 L30 18 L6 18 Z" fill="#ff7a59"/><rect x="16" y="-8" width="2.5" height="16" fill="#6b4a2a"/><path d="M19 -8 L19 6 L32 6 Z" fill="#fff"/></g>' +
      (inner || '') + '</svg>';
  }
  function pin(x, y, icon, label, act, id, done) {
    return '<g class="pin" data-act="' + act + '" data-id="' + id + '" transform="translate(' + x + ' ' + y + ')" tabindex="0" role="button">' +
      '<circle class="pulse" r="18"/><circle class="pb ' + (done ? 'done' : '') + '" r="15"/>' +
      '<text class="pi" y="6" text-anchor="middle">' + icon + '</text>' +
      (label ? '<text class="pl" y="33" text-anchor="middle">' + esc(label) + '</text>' : '') +
      (done ? '<circle cx="12" cy="-12" r="7" fill="#22c55e"/><text x="12" y="-9" text-anchor="middle" class="pc">✓</text>' : '') + '</g>';
  }

  /* ---------- navigation ---------- */
  const TAB_OF = { home: 'home', missions: 'home', points: 'home', rewards: 'home', maps: 'maps', book: 'book', detail: 'book', checkout: 'book', status: 'book', provider: 'book', travel: 'travel', ride: 'travel', driver: 'travel', settings: 'settings' };
  function go(name, arg, replace) { if (!replace) stack.push(route); route = { name: name, arg: arg }; render(); }
  function goTab(name) { stack = []; route = { name: name }; render(); }
  function back() { route = stack.pop() || { name: 'home' }; render(); }

  function renderTop() {
    const showBack = stack.length > 0 && route.name !== 'login';
    topEl.innerHTML = (showBack ? '<button class="back" data-act="back" aria-label="' + t('back') + '">‹</button>' : '<span class="logo">🏝️</span>') +
      '<h1>' + esc(t('title_' + route.name)) + '</h1>' +
      '<div class="langseg"><button data-act="lang" data-v="th" class="' + (S.lang === 'th' ? 'on' : '') + '">ไทย</button><button data-act="lang" data-v="en" class="' + (S.lang === 'en' ? 'on' : '') + '">EN</button></div>';
  }
  function renderNav() {
    navEl.hidden = route.name === 'login';
    navEl.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.to === TAB_OF[route.name]));
    navEl.querySelectorAll('[data-nl]').forEach(s => { s.textContent = t(s.dataset.nl); });
  }

  /* ---------- bookings progress (จำลอง) ---------- */
  function advanceBookings() {
    let changed = false;
    S.bookings.forEach(b => {
      if (b.status === 'pending' && Date.now() - b.created >= 5000) { b.status = 'confirmed'; changed = true; }
    });
    if (changed) { save(); toast(t('booking_confirmed'), 'ok', 'booking'); }
  }

  /* ---------- render ---------- */
  function render() {
    clearTimers(); afterFn = null;
    if (!S.user && route.name !== 'login') { route = { name: 'login' }; stack = []; }
    advanceBookings();
    document.documentElement.lang = S.lang;
    const pages = { login: pLogin, home: pHome, missions: pMissions, points: pPoints, rewards: pRewards, maps: pMaps, book: pBook, detail: pDetail, checkout: pCheckout, status: pStatus, provider: pProvider, travel: pTravel, ride: pRide, driver: pDriver, settings: pSettings };
    const html = (pages[route.name] || pHome)();
    view.innerHTML = html;
    const key = route.name + '|' + route.arg;
    if (key !== lastKey) { view.scrollTop = 0; lastKey = key; }
    renderTop(); renderNav();
    if (afterFn) afterFn();
  }

  /* ================= Flow 2: Home / ภารกิจ / คะแนน / รางวัล ================= */
  function pHome() {
    const pins = D.spots.map(s => pin(s.x, s.y, s.icon, L(s.name), 'spot', s.id, !!S.checkins[s.id + '|' + ymd()])).join('');
    const name = S.user.guest ? t('guest_user') : S.user.name;
    return '<div class="hero"><div><h2>' + t('hello') + ' ' + esc(name) + ' 👋</h2><p>' + t('welcome_sub') + '</p></div><div class="pts">⭐ ' + S.points + '</div></div>' +
      '<div class="quick">' +
      '<button data-act="go" data-to="missions"><span>🗝️</span>' + t('qb_missions') + '</button>' +
      '<button data-act="go" data-to="points"><span>⭐</span>' + t('qb_points') + '</button>' +
      '<button data-act="go" data-to="rewards"><span>🎁</span>' + t('qb_rewards') + '</button></div>' +
      '<div class="mapcard">' + islandSVG(pins) + '</div>' +
      '<p class="muted center">👆 ' + t('tap_hint') + '</p>';
  }
  function spotModal(id) {
    const s = D.spots.find(x => x.id === id), key = id + '|' + ymd(), done = !!S.checkins[key];
    modalFn = () => spotModal(id);
    openModal('<div class="grab"></div><div class="row"><div class="thumb">' + s.icon + '</div><div class="grow"><h3>' + esc(L(s.name)) + '</h3><div class="muted">' + t('checkin_rule', { n: D.checkinPoints }) + '</div></div></div>' +
      '<p>' + esc(L(s.desc)) + '</p>' +
      '<button class="btn block" data-act="checkin" data-kind="spot" data-id="' + id + '" ' + (done ? 'disabled' : '') + '>' + (done ? '✓ ' + t('checked') : '📍 ' + t('checkin')) + '</button>' +
      '<button class="btn ghost block mt" data-act="closeModal">' + t('close') + '</button>');
  }
  function doCheckin(kind, id) {
    let key, name, src;
    if (kind === 'spot') { const s = D.spots.find(x => x.id === id); key = id + '|' + ymd(); name = L(s.name); src = id === 'waste' ? 'waste' : 'checkin'; }
    else { const p = D.pins.find(x => x.id === id); key = 'p_' + id + '|' + ymd(); name = L(p.name); src = p.layer === 'waste' ? 'waste' : 'checkin'; }
    if (S.checkins[key]) return;
    S.checkins[key] = true;
    addPoints(D.checkinPoints, src, name);
    toast(t('checkin_ok', { n: D.checkinPoints }), 'ok');
    render(); if (modalFn) modalFn();
  }

  function pMissions() {
    const done = D.missions.filter(m => S.missions[m.id]).length, total = D.missions.length;
    return '<div class="card"><div class="row between"><h3>🗝️ ' + t('progress') + '</h3><b class="price">' + done + '/' + total + '</b></div>' +
      '<div class="bar"><i style="width:' + Math.round(done / total * 100) + '%"></i></div>' +
      '<p class="muted mt">' + (done === total ? t('mission_all') : t('mission_hint')) + ' · ' + t('mission_bonus', { n: D.missionBonus }) + '</p></div>' +
      D.missions.map(m => {
        const on = !!S.missions[m.id];
        return '<button class="mission ' + (on ? 'done' : '') + '" data-act="mission" data-id="' + m.id + '"><span class="check ' + (on ? 'on' : '') + '">' + (on ? '✓' : '') + '</span><span class="grow">' + esc(L(m.title)) + '</span><b class="price">+' + m.points + '</b></button>';
      }).join('');
  }
  function doMission(id) {
    const m = D.missions.find(x => x.id === id);
    if (!m || S.missions[id]) return;
    S.missions[id] = true; save();
    addPoints(m.points, 'mission', L(m.title));
    toast(t('mission_get', { n: m.points }), 'ok');
    if (D.missions.every(x => S.missions[x.id]) && !S.missions._bonus) {
      S.missions._bonus = true; save();
      addPoints(D.missionBonus, 'mission', t('mission_all'));
      toast(t('mission_bonus', { n: D.missionBonus }), 'ok');
    }
    render();
  }

  const SRC = ['mission', 'waste', 'booking', 'checkin'];
  const SRC_ICON = { mission: '🗝️', waste: '♻️', booking: '🎫', checkin: '📍', redeem: '🎁' };
  function pPoints() {
    const sums = {}; SRC.forEach(s => { sums[s] = 0; });
    S.log.forEach(e => { if (e.n > 0 && sums[e.src] != null) sums[e.src] += e.n; });
    const max = Math.max.apply(null, SRC.map(s => sums[s]).concat([1]));
    return '<div class="card center"><div class="muted">' + t('total_points') + '</div><div class="big">⭐ ' + S.points + '</div>' +
      '<button class="btn mt" data-act="go" data-to="rewards">🎁 ' + t('go_rewards') + '</button></div>' +
      '<div class="card"><h3>' + t('by_source') + '</h3>' +
      SRC.map(s => '<div class="srcrow"><div class="row between"><span>' + SRC_ICON[s] + ' ' + t('src_' + s) + '</span><b>' + sums[s] + '</b></div><div class="bar"><i style="width:' + Math.round(sums[s] / max * 100) + '%"></i></div></div>').join('') + '</div>' +
      '<div class="card"><h3>' + t('history') + '</h3>' +
      (S.log.length ? S.log.slice(0, 40).map(e => '<div class="log"><div class="grow">' + SRC_ICON[e.src] + ' ' + esc(e.label) + '<div class="muted">' + t('src_' + e.src) + ' · ' + fmtTs(e.t) + '</div></div><b class="' + (e.n > 0 ? 'plus' : 'minus') + '">' + (e.n > 0 ? '+' : '') + e.n + '</b></div>').join('') : '<p class="muted">' + t('no_history') + '</p>') + '</div>';
  }

  function genCode() { const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let s = 'SC-'; for (let i = 0; i < 6; i++) s += c[Math.floor(Math.random() * c.length)]; return s; }
  function pRewards() {
    return '<div class="card row between"><div><div class="muted">' + t('my_points') + '</div><div class="big">⭐ ' + S.points + '</div></div></div>' +
      D.rewards.map(r => '<div class="item" style="cursor:default"><div class="thumb">' + r.emoji + '</div><div class="grow"><b>' + esc(L(r.name)) + '</b><div class="muted">' + esc(L(r.shop)) + '</div><div class="price">' + t('cost') + ' ' + r.cost + ' ' + t('pts') + '</div></div>' +
        '<button class="btn sm" data-act="redeem" data-id="' + r.id + '" ' + (S.points < r.cost ? 'disabled' : '') + '>' + (S.points < r.cost ? t('not_enough') : t('redeem')) + '</button></div>').join('') +
      '<div class="card"><h3>🎟️ ' + t('my_codes') + '</h3>' +
      (S.redeemed.length ? S.redeemed.map(c => { const r = D.rewards.find(x => x.id === c.id); return '<div class="log"><div class="grow">' + r.emoji + ' ' + esc(L(r.name)) + '<div class="muted">' + esc(L(r.shop)) + ' · ' + fmtTs(c.t) + '</div></div><b>' + c.code + '</b></div>'; }).join('') : '<p class="muted">' + t('no_codes') + '</p>') + '</div>';
  }
  function doRedeem(id) {
    const r = D.rewards.find(x => x.id === id);
    if (!r) return;
    if (S.points < r.cost) { toast(t('not_enough'), 'warn'); return; }
    const code = genCode();
    addPoints(-r.cost, 'redeem', L(r.name));
    S.redeemed.unshift({ id: id, code: code, t: Date.now() }); save();
    render();
    openModal('<div class="grab"></div><div class="center"><div style="font-size:54px">' + r.emoji + '</div><h3>' + t('redeem_done') + '</h3><p>' + esc(L(r.name)) + '<br><span class="muted">' + esc(L(r.shop)) + '</span></p>' +
      '<div class="muted">' + t('code') + '</div><div class="code">' + code + '</div><p class="muted">' + t('show_code') + '</p></div><button class="btn block" data-act="closeModal">' + t('ok') + '</button>');
  }

  /* ================= Flow 3: Maps ================= */
  const LAYERS = ['food', 'history', 'waste'];
  const LAYER_ICON = { food: '🍤', history: '🏛️', waste: '♻️' };
  function pMaps() {
    const pins = D.pins.filter(p => p.layer === mapLayer).map(p => pin(p.x, p.y, p.icon, L(p.name), 'pin', p.id, !!S.checkins['p_' + p.id + '|' + ymd()])).join('');
    return '<div class="chips">' + LAYERS.map(l => '<button class="chip ' + (l === mapLayer ? 'on' : '') + '" data-act="layer" data-v="' + l + '">' + LAYER_ICON[l] + ' ' + t('layer_' + l) + '</button>').join('') + '</div>' +
      '<div class="mapcard">' + islandSVG(pins) + '</div><p class="muted center">👆 ' + t('tap_hint') + '<br>' + t('sample_note') + ' · ' + t('mock_note') + '</p>';
  }
  function pinModal(id) {
    const p = D.pins.find(x => x.id === id), key = 'p_' + id + '|' + ymd(), done = !!S.checkins[key];
    modalFn = () => pinModal(id);
    let body = '';
    if (p.layer === 'food') body = '<p>🍽️ <b>' + t('menu_rec') + ':</b> ' + esc(L(p.menu)) + '</p><p>💰 <b>' + t('price_range') + ':</b> ' + esc(L(p.price)) + '</p>';
    else if (p.layer === 'history') body = '<p>📖 <b>' + t('story') + ':</b> ' + esc(L(p.story)) + '</p>';
    else body = '<p>🗑️ <b>' + t('bin_types') + ':</b> ' + esc(L(p.bins)) + '</p>';
    openModal('<div class="grab"></div><div class="row"><div class="thumb">' + p.icon + '</div><div class="grow"><h3>' + esc(L(p.name)) + '</h3><div class="muted">' + t('layer_' + p.layer) + '</div></div></div>' + body +
      '<div class="row mt"><button class="btn ghost grow" data-act="navigate" data-id="' + id + '">🧭 ' + t('navigate') + '</button>' +
      '<button class="btn grow" data-act="checkin" data-kind="pin" data-id="' + id + '" ' + (done ? 'disabled' : '') + '>' + (done ? '✓ ' + t('checked') : '📍 ' + t('checkin')) + '</button></div>' +
      '<button class="btn ghost block mt" data-act="closeModal">' + t('close') + '</button>');
  }

  /* ================= Flow 4: จอง / จ้างบริการ ================= */
  function tideExtrema() {
    const v = D.tide, out = [];
    for (let h = 1; h < v.length - 1; h++) {
      if (v[h] > v[h - 1] && v[h] >= v[h + 1]) out.push({ h: h, v: v[h], type: 'high' });
      if (v[h] < v[h - 1] && v[h] <= v[h + 1]) out.push({ h: h, v: v[h], type: 'low' });
    }
    return out;
  }
  function tideNow() {
    const n = new Date(), hf = n.getHours() + n.getMinutes() / 60, h0 = Math.floor(hf), h1 = Math.min(24, h0 + 1);
    return { hf: hf, v: D.tide[h0] + (D.tide[h1] - D.tide[h0]) * (hf - h0) };
  }
  const hh = h => pad(h) + ':00';

  function pBook() {
    const cats = bookTab === 'activity' ? ['all', 'sea', 'land', 'culture'] : ['all', 'guide', 'photo', 'boat'];
    const items = ITEMS.filter(i => i.kind === bookTab && (bookCat === 'all' || i.cat === bookCat) &&
      (bookPrice === 'all' || (bookPrice === 'low' && i.price <= 500) || (bookPrice === 'mid' && i.price > 500 && i.price <= 1000) || (bookPrice === 'high' && i.price > 1000)));
    return '<div class="seg"><button class="' + (bookTab === 'activity' ? 'on' : '') + '" data-act="btab" data-v="activity">🏄 ' + t('tab_activities') + '</button><button class="' + (bookTab === 'service' ? 'on' : '') + '" data-act="btab" data-v="service">🧑‍🤝‍🧑 ' + t('tab_services') + '</button></div>' +
      '<div class="chips">' + cats.map(c => '<button class="chip ' + (c === bookCat ? 'on' : '') + '" data-act="bcat" data-v="' + c + '">' + (c === 'all' ? t('all') : t('cat_' + c)) + '</button>').join('') + '</div>' +
      '<label class="field"><span>💰 ' + t('price_all') + '</span><select data-change="bookPrice">' +
      [['all', 'price_all'], ['low', 'price_low'], ['mid', 'price_mid'], ['high', 'price_high']].map(o => '<option value="' + o[0] + '" ' + (bookPrice === o[0] ? 'selected' : '') + '>' + t(o[1]) + '</option>').join('') + '</select></label>' +
      (items.length ? items.map(i => '<button class="item" data-act="item" data-id="' + i.id + '"><div class="thumb">' + i.emoji + '</div><div class="grow"><b>' + esc(L(i.name)) + '</b><div class="muted">' + t('cat_' + i.cat) + ' · ⭐ ' + i.provider.rating + '</div><div class="price">' + money(i.price) + ' <span class="muted">' + (i.kind === 'activity' ? t('per_person') : t('per_trip')) + '</span></div></div><span>›</span></button>').join('') : '<p class="muted center">' + t('no_items') + '</p>');
  }
  function itemTotal(it, f) { return it.price * (it.kind === 'activity' ? f.people : 1); }
  function pDetail() {
    const it = itemById(route.arg);
    if (!it) return '<p>?</p>';
    if (!form || form.id !== it.id) form = { id: it.id, date: ymd(), time: D.timeSlots[0], people: 1 };
    let tideBox = '';
    if (it.sea) {
      const ex = tideExtrema(), hi = ex.filter(e => e.type === 'high').sort((a, b) => b.v - a.v)[0], lo = ex.filter(e => e.type === 'low').sort((a, b) => a.v - b.v)[0];
      tideBox = '<div class="warn">🌊 <b>' + t('tide_warn') + '</b><br>' + t('tide_high_at') + ' ' + hh(hi.h) + ' (' + hi.v + ' ' + t('meter') + ') · ' + t('tide_low_at') + ' ' + hh(lo.h) + ' (' + lo.v + ' ' + t('meter') + ')<br><span class="muted">' + t('tide_advice') + ' (' + t('mock_note') + ')</span></div>';
    }
    return '<div class="thumb hero2">' + it.emoji + '</div><h2 style="margin:0 0 4px">' + esc(L(it.name)) + '</h2>' +
      '<div class="price" style="font-size:20px">' + money(it.price) + ' <span class="muted" style="font-size:13px">' + (it.kind === 'activity' ? t('per_person') : t('per_trip')) + '</span></div>' +
      '<p>' + esc(L(it.desc)) + '</p>' + tideBox +
      '<button class="item" data-act="provider" data-id="' + it.id + '"><div class="avatar">' + it.provider.emoji + '</div><div class="grow"><div class="muted">' + t('provider') + '</div><b>' + esc(L(it.provider.name)) + '</b><div class="muted">⭐ ' + it.provider.rating + ' (' + it.provider.reviews + ' ' + t('reviews') + ')</div></div><span>›</span></button>' +
      '<div class="card"><label class="field"><span>📅 ' + t('date') + '</span><input type="date" data-change="date" min="' + ymd() + '" value="' + form.date + '"></label>' +
      '<label class="field"><span>⏰ ' + t('time') + '</span><select data-change="time">' + D.timeSlots.map(s => '<option ' + (form.time === s ? 'selected' : '') + '>' + s + '</option>').join('') + '</select></label>' +
      (it.kind === 'activity' ? '<div class="field"><span>👥 ' + t('people') + '</span><div class="stepper"><button data-act="people" data-v="-1">−</button><b>' + form.people + '</b><button data-act="people" data-v="1">+</button></div></div>' : '') +
      '<div class="row between"><span>' + t('total') + '</span><b class="price" style="font-size:20px">' + money(itemTotal(it, form)) + '</b></div></div>' +
      '<button class="btn block" data-act="toCheckout">🎫 ' + t('book_now') + '</button>';
  }
  function pCheckout() {
    if (!draft) return pBook();
    const it = itemById(draft.id), total = itemTotal(it, draft);
    return '<div class="card"><h3>🧾 ' + t('booking_summary') + '</h3><div class="row"><div class="thumb">' + it.emoji + '</div><div class="grow"><b>' + esc(L(it.name)) + '</b><div class="muted">' + draft.date + ' · ' + draft.time + (it.kind === 'activity' ? ' · 👥 ' + draft.people : '') + '</div></div></div>' +
      '<div class="row between mt"><span>' + t('total') + '</span><b class="price" style="font-size:20px">' + money(total) + '</b></div><p class="muted">' + t('booking_pts_note', { n: BOOKING_POINTS }) + '</p></div>' +
      '<div class="card"><h3>' + t('pay_method') + '</h3>' +
      [['promptpay', 'pay_promptpay', '📱'], ['card', 'pay_card', '💳'], ['cash', 'pay_cash', '💵']].map(m => '<label class="field row" style="cursor:pointer"><input type="radio" name="pay" data-change="pay" value="' + m[0] + '" ' + (payMethod === m[0] ? 'checked' : '') + ' style="width:auto"> <span style="margin:0">' + m[2] + ' ' + t(m[1]) + '</span></label>').join('') +
      '<p class="muted">' + t('pay_note') + '</p></div>' +
      '<button class="btn coral block" data-act="pay">' + t('pay_now') + ' · ' + money(total) + '</button>';
  }
  function doPay() {
    if (!draft) return;
    const it = itemById(draft.id);
    const b = { id: 'B' + String(1000 + S.seq++), itemId: it.id, date: draft.date, time: draft.time, people: draft.people, total: itemTotal(it, draft), pay: payMethod, status: 'pending', created: Date.now() };
    S.bookings.unshift(b); save(); draft = null; form = null;
    toast(t('booking_ok'), 'ok', 'booking');
    go('status', b.id, true);
  }
  function pStatus() {
    const b = S.bookings.find(x => x.id === route.arg);
    if (!b) return '<p class="muted center">' + t('no_booking') + '</p>';
    const it = itemById(b.itemId), idx = { pending: 0, confirmed: 1, done: 2 }[b.status];
    const labels = ['st_pending', 'st_confirmed', 'st_done'];
    if (b.status === 'pending') {
      const wait = Math.max(200, 5000 - (Date.now() - b.created) + 100);
      afterFn = () => { timers.push(setTimeout(render, wait)); };
    }
    return '<div class="card"><div class="row between"><h3>' + t('booking_code') + ' ' + b.id + '</h3><span class="badge ' + b.status + '">' + t(labels[idx]) + '</span></div>' +
      '<div class="steps">' + labels.map((l, i) => '<div class="step ' + (i < idx ? 'done' : i === idx ? (idx === 2 ? 'done' : 'now') : '') + '"><i>' + (i < idx || (i === idx && idx === 2) ? '✓' : i + 1) + '</i><div><b>' + t(l) + '</b>' + (i === idx && b.status === 'pending' ? '<div class="muted">' + t('pending_note') + '</div>' : '') + '</div></div>').join('') + '</div>' +
      (b.status === 'confirmed' ? '<button class="btn block" data-act="finish" data-id="' + b.id + '">✅ ' + t('mark_done') + '</button><p class="muted center">' + t('booking_pts_note', { n: BOOKING_POINTS }) + '</p>' : '') + '</div>' +
      '<div class="card"><div class="row"><div class="thumb">' + it.emoji + '</div><div class="grow"><b>' + esc(L(it.name)) + '</b><div class="muted">' + b.date + ' · ' + b.time + (it.kind === 'activity' ? ' · 👥 ' + b.people : '') + '</div><div class="price">' + money(b.total) + '</div></div></div></div>' +
      '<button class="btn ghost block" data-act="provider" data-id="' + it.id + '">👤 ' + t('view_provider') + '</button>';
  }
  function doFinish(id) {
    const b = S.bookings.find(x => x.id === id);
    if (!b || b.status !== 'confirmed') return;
    b.status = 'done'; save();
    addPoints(BOOKING_POINTS, 'booking', L(itemById(b.itemId).name));
    toast(t('done_pts', { n: BOOKING_POINTS }), 'ok');
    render();
  }
  function pProvider() {
    const it = itemById(route.arg);
    if (!it) return '<p>?</p>';
    const p = it.provider;
    return '<div class="card center"><div class="avatar lg" style="margin:0 auto 8px">' + p.emoji + '</div><h2 style="margin:4px 0">' + esc(L(p.name)) + '</h2>' +
      '<div class="muted">' + esc(L(it.name)) + '</div>' +
      '<div class="row mt" style="justify-content:center;gap:24px"><div><div class="big" style="font-size:28px">⭐ ' + p.rating + '</div><div class="muted">' + t('rating') + '</div></div><div><div class="big" style="font-size:28px">' + p.reviews + '</div><div class="muted">' + t('reviews') + '</div></div></div></div>' +
      '<div class="card row between"><div><div class="muted">📞 ' + t('phone') + '</div><b>' + p.phone + '</b></div><a class="btn sm" style="text-decoration:none" href="tel:' + p.phone.replace(/[^0-9]/g, '') + '">' + t('call') + '</a></div>';
  }

  /* ================= Flow 5: เดินทาง ================= */
  function nextDep(list, now) {
    now = now || new Date();
    const mins = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
    for (let i = 0; i < list.length; i++) {
      const p = list[i].split(':'), m = +p[0] * 60 + +p[1];
      if (m > mins) return { time: list[i], tomorrow: false, ms: (m - mins) * 60000 };
    }
    const p = list[0].split(':');
    return { time: list[0], tomorrow: true, ms: ((24 * 60 - mins) + +p[0] * 60 + +p[1]) * 60000 };
  }
  function fmtCd(ms) { const s = Math.max(0, Math.floor(ms / 1000)); return pad(Math.floor(s / 3600)) + ':' + pad(Math.floor(s % 3600 / 60)) + ':' + pad(s % 60); }

  function tideChart() {
    const W = 380, H = 180, l = 30, r = 12, tp = 22, bt = 28, v = D.tide;
    const mn = Math.min.apply(null, v) - 0.2, mx = Math.max.apply(null, v) + 0.2;
    const X = h => l + h / 24 * (W - l - r), Y = val => tp + (mx - val) / (mx - mn) * (H - tp - bt);
    const pts = v.map((val, h) => X(h).toFixed(1) + ' ' + Y(val).toFixed(1));
    const line = 'M' + pts.join(' L'), area = line + ' L' + X(24) + ' ' + (H - bt) + ' L' + X(0) + ' ' + (H - bt) + ' Z';
    const nw = tideNow();
    let s = '<svg class="tide" viewBox="0 0 ' + W + ' ' + H + '"><defs><linearGradient id="tg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0ea5c6" stop-opacity=".55"/><stop offset="1" stop-color="#0ea5c6" stop-opacity=".05"/></linearGradient></defs>';
    [0, 4, 8, 12, 16, 20, 24].forEach(h => { s += '<line x1="' + X(h) + '" x2="' + X(h) + '" y1="' + tp + '" y2="' + (H - bt) + '" stroke="#d7eaf1"/><text x="' + X(h) + '" y="' + (H - 10) + '" font-size="10" text-anchor="middle" fill="#6b8794">' + pad(h) + '</text>'; });
    s += '<path d="' + area + '" fill="url(#tg)"/><path d="' + line + '" fill="none" stroke="#0b6e99" stroke-width="3" stroke-linejoin="round"/>';
    tideExtrema().forEach(e => {
      s += '<circle cx="' + X(e.h) + '" cy="' + Y(e.v) + '" r="4" fill="' + (e.type === 'high' ? '#ff7a59' : '#0b6e99') + '"/><text x="' + X(e.h) + '" y="' + (Y(e.v) + (e.type === 'high' ? -8 : 15)) + '" font-size="10" font-weight="700" text-anchor="middle" fill="#17323f">' + hh(e.h) + ' · ' + e.v + '</text>';
    });
    s += '<line x1="' + X(nw.hf) + '" x2="' + X(nw.hf) + '" y1="' + tp + '" y2="' + (H - bt) + '" stroke="#ff7a59" stroke-width="2" stroke-dasharray="4 3"/><circle cx="' + X(nw.hf) + '" cy="' + Y(nw.v) + '" r="5.5" fill="#fff" stroke="#ff7a59" stroke-width="3"/></svg>';
    return s;
  }
  function pTravel() {
    const list = ferryDir === 'in' ? D.ferry.toIsland : D.ferry.toMainland, nx = nextDep(list), nw = tideNow();
    afterFn = () => {
      timers.push(setInterval(() => { const el = $('#cd'); if (el) el.textContent = fmtCd(nextDep(list).ms); }, 1000));
    };
    return '<div class="seg"><button class="' + (ferryDir === 'in' ? 'on' : '') + '" data-act="fdir" data-v="in">' + t('ferry_in') + '</button><button class="' + (ferryDir === 'out' ? 'on' : '') + '" data-act="fdir" data-v="out">' + t('ferry_out') + '</button></div>' +
      '<div class="next"><div>⛴️ ' + t('next_dep') + (nx.tomorrow ? ' (' + t('tomorrow') + ')' : '') + '</div><div class="t">' + nx.time + '</div><div class="cd">' + t('countdown') + ' <span id="cd">' + fmtCd(nx.ms) + '</span></div></div>' +
      '<div class="card"><div class="row between"><h3>📋 ' + t('schedule') + '</h3><span class="muted">' + t('fare') + ' ' + D.ferry.fare + ' ' + t('baht') + ' · ' + t('mock_note') + '</span></div><div class="times">' +
      list.map(x => '<span class="' + (!nx.tomorrow && x === nx.time ? 'nx' : (!nx.tomorrow && x < nx.time) || nx.tomorrow ? 'past' : '') + '">' + x + '</span>').join('') + '</div></div>' +
      '<div class="card"><div class="row between"><h3>🌊 ' + t('tide_today') + '</h3><span class="muted">' + t('now_level') + ' ' + nw.v.toFixed(2) + ' ' + t('meter') + '</span></div>' + tideChart() +
      '<div class="muted center">🟠 ' + t('high') + ' · 🔵 ' + t('low') + ' · ' + t('mock_note') + '</div></div>' +
      '<button class="btn coral block" data-act="go" data-to="ride">🛺 ' + t('call_ride') + '</button>';
  }

  function spotOpts(selected) { return D.spots.filter(s => s.id !== 'waste').map(s => '<option value="' + s.id + '" ' + (s.id === selected ? 'selected' : '') + '>' + s.icon + ' ' + esc(L(s.name)) + '</option>').join(''); }
  function pRide() {
    return '<div class="card"><label class="field"><span>📍 ' + t('ride_pick') + '</span><select data-change="pick">' + spotOpts(rideForm.pick) + '</select></label>' +
      '<label class="field"><span>🏁 ' + t('ride_drop') + '</span><select data-change="drop">' + spotOpts(rideForm.drop) + '</select></label>' +
      '<div class="field"><span>🚗 ' + t('ride_type') + '</span><div class="seg" style="margin:0"><button class="' + (rideForm.type === 'tricycle' ? 'on' : '') + '" data-act="vtype" data-v="tricycle">🛺 ' + t('ride_tricycle') + '</button><button class="' + (rideForm.type === 'moto' ? 'on' : '') + '" data-act="vtype" data-v="moto">🏍️ ' + t('ride_moto') + '</button></div></div></div>' +
      '<button class="btn block" data-act="sendRide">📨 ' + t('send_req') + '</button>';
  }
  function doSendRide() {
    if (rideForm.pick === rideForm.drop) { toast(t('same_place'), 'warn'); return; }
    const arr = D.drivers[rideForm.type];
    S.ride = { pick: rideForm.pick, drop: rideForm.drop, type: rideForm.type, driver: arr[S.seq++ % arr.length], start: Date.now(), seen: -1 };
    save(); go('driver', null, true);
  }
  function pDriver() {
    const r = S.ride;
    if (!r) return '<div class="card center"><p class="muted">' + t('no_ride') + '</p><button class="btn" data-act="go" data-to="ride">' + t('new_ride') + '</button></div>';
    const step = Math.min(2, Math.floor((Date.now() - r.start) / 5000)), dr = r.driver;
    if (r.seen !== step) { r.seen = step; save(); toast(t('ride_t' + step), step === 2 ? 'ok' : '', 'remind'); }
    if (step < 2) afterFn = () => { timers.push(setInterval(() => { if (Math.min(2, Math.floor((Date.now() - r.start) / 5000)) !== step) render(); }, 1000)); };
    const ps = D.spots.find(s => s.id === r.pick), ds = D.spots.find(s => s.id === r.drop);
    return '<div class="card"><div class="row"><div class="avatar">' + dr.emoji + '</div><div class="grow"><b style="font-size:17px">' + esc(S.lang === 'th' ? dr.name : dr.nameEn) + '</b><div class="muted">' + (r.type === 'tricycle' ? '🛺 ' + t('ride_tricycle') : '🏍️ ' + t('ride_moto')) + '</div><div class="muted">🔖 ' + t('plate') + ': <b>' + esc(dr.plate) + '</b></div></div>' +
      '<a class="btn sm" style="text-decoration:none" href="tel:' + dr.phone.replace(/[^0-9]/g, '') + '">📞 ' + t('call') + '</a></div><div class="muted mt">' + t('phone') + ': ' + dr.phone + '</div></div>' +
      '<div class="card"><div class="muted">📍 ' + esc(L(ps.name)) + ' → 🏁 ' + esc(L(ds.name)) + '</div><div class="steps mt">' +
      [0, 1, 2].map(i => '<div class="step ' + (i < step ? 'done' : i === step ? (step === 2 ? 'done' : 'now') : '') + '"><i>' + (i < step || (i === step && step === 2) ? '✓' : i + 1) + '</i><div><b>' + t('ride_st' + i) + '</b>' + (i === step ? '<div class="muted">' + t('ride_t' + i) + '</div>' : '') + '</div></div>').join('') + '</div><p class="muted">' + t('ride_auto') + '</p></div>' +
      '<div class="row"><button class="btn ghost grow" data-act="newRide">' + t('new_ride') + '</button>' + (step < 2 ? '<button class="btn danger grow" data-act="cancelRide">' + t('cancel_ride') + '</button>' : '') + '</div>';
  }

  /* ================= Flow 1: บัญชี ================= */
  function pLogin() {
    const su = authMode === 'signup';
    return '<div class="center" style="padding:10px 0 14px"><div style="font-size:64px">🏝️</div><h2 style="margin:4px 0">' + t('welcome_title') + '</h2><p class="muted">' + t('welcome_sub') + '</p></div>' +
      '<div class="card"><div class="seg"><button class="' + (!su ? 'on' : '') + '" data-act="amode" data-v="login">' + t('login') + '</button><button class="' + (su ? 'on' : '') + '" data-act="amode" data-v="signup">' + t('signup') + '</button></div>' +
      '<label class="field"><span>✉️ ' + t('email') + '</span><input id="em" type="email" autocomplete="off" placeholder="name@example.com"></label>' +
      '<label class="field"><span>🔒 ' + t('password') + '</span><input id="pw" type="password" autocomplete="off" placeholder="••••"></label>' +
      '<button class="btn block" data-act="auth">' + (su ? t('signup') : t('login')) + '</button><p class="muted center">' + t('login_note') + '</p>' +
      '<button class="btn ghost block" data-act="amode" data-v="' + (su ? 'login' : 'signup') + '">' + (su ? t('has_account') : t('no_account')) + '</button></div>' +
      '<button class="btn coral block" data-act="guest">🧳 ' + t('guest') + '</button>' +
      '<div class="card center mt"><div class="muted">' + t('choose_lang') + '</div><div class="seg mt" style="margin-bottom:0"><button class="' + (S.lang === 'th' ? 'on' : '') + '" data-act="lang" data-v="th">🇹🇭 ไทย</button><button class="' + (S.lang === 'en' ? 'on' : '') + '" data-act="lang" data-v="en">🇬🇧 English</button></div></div>';
  }
  function doAuth() {
    const em = ($('#em').value || '').trim(), pw = $('#pw').value || '';
    if (!/^\S+@\S+\.\S+$/.test(em)) { toast(t('err_email'), 'err'); return; }
    if (pw.length < 4) { toast(t('err_pw'), 'err'); return; }
    S.user = { email: em, name: em.split('@')[0], guest: false }; save();
    toast(t('welcome_toast', { n: S.user.name }), 'ok');
    goTab('home');
  }
  function pSettings() {
    const u = S.user, name = u.guest ? t('guest_user') : u.name;
    return '<div class="card row"><div class="avatar">' + (u.guest ? '🧳' : '😊') + '</div><div class="grow"><b style="font-size:17px">' + esc(name) + '</b><div class="muted">' + esc(u.guest ? 'Guest' : u.email) + '</div></div></div>' +
      '<button class="item" data-act="go" data-to="points"><div class="thumb">⭐</div><div class="grow"><b>' + t('my_points') + '</b><div class="price">' + S.points + ' ' + t('pts') + '</div></div><span>›</span></button>' +
      '<div class="card"><h3>🌐 ' + t('lang_label') + '</h3><div class="seg" style="margin:0"><button class="' + (S.lang === 'th' ? 'on' : '') + '" data-act="lang" data-v="th">🇹🇭 ไทย</button><button class="' + (S.lang === 'en' ? 'on' : '') + '" data-act="lang" data-v="en">🇬🇧 English</button></div></div>' +
      '<div class="card"><h3>🔔 ' + t('notif') + '</h3><div class="seg" style="margin:0"><button class="' + (S.notif ? 'on' : '') + '" data-act="notif" data-v="1">' + t('notif_on') + '</button><button class="' + (!S.notif ? 'on' : '') + '" data-act="notif" data-v="0">' + t('notif_off') + '</button></div></div>' +
      '<div class="card"><h3>🎫 ' + t('booking_hist') + '</h3>' +
      (S.bookings.length ? S.bookings.map(b => { const it = itemById(b.itemId); return '<button class="item" style="box-shadow:none;background:#f2fbfe" data-act="status" data-id="' + b.id + '"><div class="thumb" style="width:46px;height:46px;font-size:24px">' + it.emoji + '</div><div class="grow"><b>' + esc(L(it.name)) + '</b><div class="muted">' + b.date + ' · ' + b.time + '</div></div><span class="badge ' + b.status + '">' + t({ pending: 'st_pending', confirmed: 'st_confirmed', done: 'st_done' }[b.status]) + '</span></button>'; }).join('') : '<p class="muted">' + t('no_booking') + '</p>') + '</div>' +
      '<button class="btn danger block" data-act="logout">🚪 ' + t('logout') + '</button>';
  }

  /* ---------- SOS ---------- */
  function sosModal() {
    modalFn = sosModal;
    openModal('<div class="grab"></div><h3>🆘 ' + t('sos_title') + '</h3><p class="muted">' + t('sos_desc') + '</p>' +
      D.emergency.map(e => '<a class="item" style="text-decoration:none;color:inherit" href="tel:' + e.phone.replace(/[^0-9]/g, '') + '"><div class="thumb">' + e.icon + '</div><div class="grow"><b>' + esc(L(e.name)) + '</b></div><b class="price" style="font-size:18px">' + e.phone + '</b></a>').join('') +
      '<button class="btn ghost block" data-act="closeModal">' + t('close') + '</button>');
  }

  /* ---------- events ---------- */
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]');
    if (!el) return;
    const a = el.dataset.act, d = el.dataset;
    switch (a) {
      case 'tab': goTab(d.to); break;
      case 'go': go(d.to, d.arg); break;
      case 'back': back(); break;
      case 'lang': S.lang = d.v; save(); render(); if (!modalEl.hidden && modalFn) modalFn(); break;
      case 'closeModal': closeModal(); break;
      case 'closeModalBg': if (e.target === el) closeModal(); break;
      case 'sos': sosModal(); break;
      case 'spot': spotModal(d.id); break;
      case 'pin': pinModal(d.id); break;
      case 'checkin': doCheckin(d.kind, d.id); break;
      case 'navigate': { const p = D.pins.find(x => x.id === d.id); toast(t('nav_started', { n: L(p.name) }), ''); break; }
      case 'mission': doMission(d.id); break;
      case 'redeem': doRedeem(d.id); break;
      case 'layer': mapLayer = d.v; render(); break;
      case 'btab': bookTab = d.v; bookCat = 'all'; render(); break;
      case 'bcat': bookCat = d.v; render(); break;
      case 'item': form = { id: d.id, date: ymd(), time: D.timeSlots[0], people: 1 }; go('detail', d.id); break;
      case 'provider': go('provider', d.id); break;
      case 'people': form.people = Math.max(1, Math.min(20, form.people + (+d.v))); render(); break;
      case 'toCheckout':
        if (!form.date || form.date < ymd()) { toast(t('date'), 'warn'); break; }
        draft = Object.assign({}, form); go('checkout'); break;
      case 'pay': doPay(); break;
      case 'finish': doFinish(d.id); break;
      case 'status': go('status', d.id); break;
      case 'fdir': ferryDir = d.v; render(); break;
      case 'vtype': rideForm.type = d.v; render(); break;
      case 'sendRide': doSendRide(); break;
      case 'newRide': go('ride', null, true); break;
      case 'cancelRide': S.ride = null; save(); toast(t('ride_cancelled'), ''); go('ride', null, true); break;
      case 'amode': authMode = d.v; render(); break;
      case 'auth': doAuth(); break;
      case 'guest': S.user = { email: '', name: 'Guest', guest: true }; save(); toast(t('welcome_toast', { n: t('guest_user') }), 'ok'); goTab('home'); break;
      case 'notif': S.notif = d.v === '1'; save(); render(); break;
      case 'logout': S.user = null; save(); closeModal(); stack = []; route = { name: 'login' }; render(); toast(t('logout_ok'), ''); break;
    }
  });
  document.addEventListener('change', e => {
    const el = e.target.closest('[data-change]');
    if (!el) return;
    const k = el.dataset.change, v = el.value;
    if (k === 'bookPrice') { bookPrice = v; render(); }
    else if (k === 'date') { form.date = v; }
    else if (k === 'time') { form.time = v; }
    else if (k === 'pay') { payMethod = v; }
    else if (k === 'pick') { rideForm.pick = v; }
    else if (k === 'drop') { rideForm.drop = v; }
  });
  document.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('pin')) { e.preventDefault(); e.target.dispatchEvent(new MouseEvent('click', { bubbles: true })); }
  });

  /* ---------- offline + ferry reminder ---------- */
  try { localStorage.setItem('sichang_offline_cache', JSON.stringify({ savedAt: Date.now(), pins: D.pins, spots: D.spots, ferry: D.ferry, tide: D.tide })); } catch (e) { /* ignore */ }
  function updateOffline() { offEl.textContent = t('offline'); offEl.hidden = navigator.onLine !== false; }
  window.addEventListener('online', updateOffline);
  window.addEventListener('offline', updateOffline);

  const reminded = {};
  function checkFerry() {
    if (!S.user) return;
    const n = nextDep(D.ferry.toIsland);
    if (!n.tomorrow && n.ms <= 30 * 60000 && !reminded[n.time]) {
      reminded[n.time] = 1;
      toast(t('remind_ferry', { t: n.time, m: Math.max(1, Math.ceil(n.ms / 60000)) }), 'warn', 'remind');
    }
  }
  setInterval(checkFerry, 15000); setTimeout(checkFerry, 1500);
  setInterval(() => { if (!offEl.hidden) offEl.textContent = t('offline'); }, 2000);

  /* ---------- start ---------- */
  route = S.user ? { name: 'home' } : { name: 'login' };
  updateOffline();
  render();
})();
