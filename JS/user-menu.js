(function () {
  var I = function (d) {
    return '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>';
  };
  var LOGOUT_ICON = I('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>');

  var LEFT = [
    { title: 'Tài khoản', items: [
      { t: 'Thông tin tài khoản', href: '#' },
      { t: 'Ví của tôi', href: '#' },
      { t: 'Nạp tiền', href: '/nap-tien/chuyen-khoan' },
      { t: 'Cấp bậc VIP', href: '/cap-bac' },
      { t: 'Bảo mật tài khoản', href: '#' }
    ]},
    { title: 'Dịch vụ', items: [
      { t: 'Key System', href: '#' },
      { t: 'Reset HWID', href: '#' },
      { t: 'Túi Mù', href: '#' }
    ]}
  ];
  var RIGHT = [
    { title: 'Lịch sử', items: [
      { t: 'Lịch Sử Mua Tài Khoản', href: '#' },
      { t: 'Lịch Sử Dùng Dịch Vụ', href: '#' },
      { t: 'Lịch Sử Chơi MiniGame', href: '#' },
      { t: 'Lịch Sử Nạp Tiền', href: '#' },
      { t: 'Lịch Sử Rút Vật Phẩm', href: '#' }
    ]}
  ];

  function historySection() {
    var src = document.querySelectorAll('.nav-dropdown-history .nav-dropdown-item');
    if (!src.length) return RIGHT[0];
    var items = [];
    src.forEach(function (a) {
      items.push({
        t: a.textContent.replace(/\s+/g, ' ').trim(),
        href: a.getAttribute('href') || '#',
        toast: a.getAttribute('data-toast')
      });
    });
    return { title: 'Lịch sử', items: items };
  }

  var css = '' +
  '.acc-wrap .acc-dropdown{transition:opacity .18s ease,transform .18s ease,visibility .18s ease}' +
  '.acc-dropdown.um-mega{width:480px;max-width:calc(100vw - 24px);padding:0;text-align:left;overflow:visible}' +
  '.acc-dropdown.um-mega::after{content:"";position:absolute;left:0;right:0;top:-16px;height:16px}' +
  '.um-hello{padding:14px 22px 10px;font-weight:800;font-size:15px;color:var(--text);border-bottom:1px solid var(--line)}' +
  '.um-hello small{display:block;font-weight:600;font-size:12px;color:var(--muted)}' +
  '.um-grid{display:grid;grid-template-columns:1fr 1fr}' +
  '.um-col{padding:12px 14px 14px}' +
  '.um-col+.um-col{border-left:1px solid var(--line)}' +
  '.um-h{margin:10px 8px 4px;font-size:12px;font-weight:800;letter-spacing:.4px;text-transform:uppercase;color:var(--green)}' +
  '.um-h:first-child{margin-top:2px}' +
  '.um-a{display:flex;align-items:center;gap:10px;width:100%;padding:8px;border:0;background:none;border-radius:8px;cursor:pointer;' +
    'color:var(--text);text-decoration:none;font:inherit;font-size:14px;text-align:left;transition:.15s}' +
  '.um-a::before{content:"\\203A";color:var(--muted);font-size:15px;line-height:1}' +
  '.um-a:hover{background:var(--green-soft);color:var(--green-dark)}' +
  '.um-out{color:#e8344f}.um-out::before{content:none}.um-out svg{flex:none}' +
  '.um-out:hover{background:rgba(232,52,79,.1);color:#e8344f}' +
  'html[data-theme="dark"] .um-a:hover{background:var(--surface-hover,rgba(255,255,255,.08))}' +
  '@media(max-width:640px){.acc-dropdown.um-mega{width:300px;right:-40px;max-height:78vh;overflow:auto}' +
    '.um-grid{grid-template-columns:1fr}.um-col+.um-col{border-left:0;border-top:1px solid var(--line)}}';
  var style = document.createElement('style');
  style.id = 'um-style';
  style.textContent = css;
  document.head.appendChild(style);

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function section(sec) {
    return '<div class="um-h">' + sec.title + '</div>' + sec.items.map(function (it) {
      var soon = it.href === '#' ? ' data-um-toast="' + esc(it.toast || (it.t + ' sẽ được thêm sau.')) + '"' : '';
      return '<a class="um-a" href="' + it.href + '"' + soon + '>' + esc(it.t) + '</a>';
    }).join('');
  }

  function render(dropdown, box) {
    var titleEl = box.querySelector('.acc-guest-title');
    if (!titleEl) return;
    var username = titleEl.textContent || '';
    dropdown.classList.add('um-mega');
    hideGuest(dropdown);

    box.innerHTML =
      '<div class="um-hello">Xin chào, ' + esc(username) + '<small>Tài khoản LPTSHOP</small></div>' +
      '<div class="um-grid">' +
        '<div class="um-col">' + LEFT.map(section).join('') + '</div>' +
        '<div class="um-col">' + [historySection()].map(section).join('') +
          '<div class="um-h">Khác</div>' +
          '<button type="button" class="um-a um-out" data-um-logout>' + LOGOUT_ICON + 'Đăng xuất</button>' +
        '</div>' +
      '</div>';
    var h = hintGet();
    if (!h || h.u !== username) hintSet({ u: username });
    ensureBalance(username);
  }

  var GUEST_SEL = '.acc-avatar,.acc-guest-title,.acc-login-btn,.acc-register-btn';
  function setGuestDisplay(dropdown, value) {
    Array.prototype.forEach.call(dropdown.children, function (n) {
      if (n.matches(GUEST_SEL)) n.style.display = value;
    });
  }
  function hideGuest(dropdown) { setGuestDisplay(dropdown, 'none'); }

  function clearMega(dropdown) {
    dropdown.classList.remove('um-mega');
    setGuestDisplay(dropdown, '');
  }

  var CURRENCY = { vn:'VND', us:'USD', cn:'CNY', tw:'TWD', kr:'KRW', jp:'JPY', th:'THB', kh:'KHR', la:'LAK', ru:'RUB', fr:'EUR', de:'EUR' };
  var LOCALE   = { vn:'vi-VN', us:'en-US', cn:'zh-CN', tw:'zh-TW', kr:'ko-KR', jp:'ja-JP', th:'th-TH', kh:'km-KH', la:'lo-LA', ru:'ru-RU', fr:'fr-FR', de:'de-DE' };
  var FALLBACK = { VND:1, USD:0.0000385, CNY:0.000275, TWD:0.00125, KRW:0.053, JPY:0.0057, THB:0.00125, KHR:0.155, LAK:0.83, RUB:0.0033, EUR:0.000033 };
  var ZERO_DEC = { VND:1, KRW:1, JPY:1, KHR:1, LAK:1, RUB:0 };

  var HINT = 'lpt_user_hint';
  function hintGet() { try { return JSON.parse(localStorage.getItem(HINT)); } catch (e) { return null; } }
  function hintSet(obj) { try { localStorage.setItem(HINT, JSON.stringify(obj)); } catch (e) {} }
  function hintClear() { try { localStorage.removeItem(HINT); } catch (e) {} }

  var state = { user: null, text: null };

  function getCC() {
    var cc = 'vn';
    try { cc = localStorage.getItem('lpt_cc') || 'vn'; } catch (e) {}
    return CURRENCY[cc] ? cc : 'vn';
  }

  function getRate(cur) {
    if (cur === 'VND') return Promise.resolve(1);
    var cached = null;
    try { cached = JSON.parse(localStorage.getItem('lpt_rates')); } catch (e) {}
    if (cached && cached.r && cached.r[cur] && Date.now() - cached.t < 12 * 3600 * 1000) {
      return Promise.resolve(cached.r[cur]);
    }
    return fetch('https://open.er-api.com/v6/latest/VND')
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!d || !d.rates || !d.rates[cur]) throw new Error('no rate');
        try { localStorage.setItem('lpt_rates', JSON.stringify({ t: Date.now(), r: d.rates })); } catch (e) {}
        return d.rates[cur];
      })
      .catch(function () { return FALLBACK[cur] || 1; });
  }

  function money(vnd, cc) {
    var cur = CURRENCY[cc];
    return getRate(cur).then(function (rate) {
      var amount = vnd * rate;
      try {
        return new Intl.NumberFormat(LOCALE[cc], {
          style: 'currency', currency: cur,
          minimumFractionDigits: ZERO_DEC[cur] ? 0 : 2,
          maximumFractionDigits: ZERO_DEC[cur] ? 0 : 2
        }).format(amount);
      } catch (e) {
        return Math.round(amount).toLocaleString() + ' ' + cur;
      }
    });
  }

  function applyStrip() {
    if (!state.text) return;
    var small = document.querySelector('.login-strip .login-copy small');
    if (small && small.textContent.indexOf('Chúc bạn mua sắm') === 0) small.textContent = state.text;
  }

  function ensureBalance(username) {
    if (state.user === username) { applyStrip(); return; }
    state.user = username;
    state.text = null;
    fetch('/api/auth/balance', { credentials: 'same-origin' })
      .then(function (r) { if (!r.ok) throw new Error('bal'); return r.json(); })
      .then(function (d) { return money(Number(d.balance) || 0, getCC()); })
      .then(function (txt) {
        if (state.user !== username) return;
        state.text = 'Số Dư Còn Lại: ' + txt;
        var hh = hintGet();
        if (hh && hh.u === username) { hh.t = state.text; hintSet(hh); }
        applyStrip();
      })
      .catch(function () {});
  }

  function preShow() {
    var h = hintGet();
    if (!h || !h.u) return;

    var dd = document.querySelector('.acc-dropdown');
    if (dd && !dd.querySelector('[data-el="userBox"]')) {
      var box = document.createElement('div');
      box.setAttribute('data-el', 'userBox');
      var t = document.createElement('p');
      t.className = 'acc-guest-title';
      t.textContent = h.u;
      box.appendChild(t);
      dd.appendChild(box);
      sync();
    }

    var strip = document.querySelector('.login-strip');
    var copy = strip && strip.querySelector('.login-copy');
    var actions = strip && strip.querySelector('.login-actions');
    var strong = copy && copy.querySelector('strong');
    var small = copy && copy.querySelector('small');
    if (strong && small && actions && actions.querySelector('.login-btn')) {
      strong.textContent = 'Xin chào, ' + h.u + '!';
      small.textContent = h.t || 'Chúc bạn mua sắm vui vẻ tại LPTSHOP.';
      actions.innerHTML = '<button class="register-btn" data-el="stripLogout">Đăng Xuất</button>';
      actions.querySelector('button').addEventListener('click', function () {
        hintClear();
        if (window.LPT_AUTH && window.LPT_AUTH.logout) window.LPT_AUTH.logout();
      });
    }

    fetch('/api/auth/me', { credentials: 'include' })
      .then(function (r) { if (!r.ok) hintClear(); })
      .catch(function () {});
  }

  function sync() {
    var dropdown = document.querySelector('.acc-dropdown');
    if (!dropdown) return;
    var box = dropdown.querySelector('[data-el="userBox"]');
    if (box) render(dropdown, box);
    else { clearMega(dropdown); state.user = null; state.text = null; }
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-um-logout],[data-el="stripLogout"]')) hintClear();
    var soon = e.target.closest('[data-um-toast]');
    if (soon) {
      e.preventDefault();
      if (window.showToast) window.showToast(soon.getAttribute('data-um-toast'));
      return;
    }
    if (e.target.closest('[data-um-logout]')) {
      e.preventDefault();
      if (window.LPT_AUTH && window.LPT_AUTH.logout) window.LPT_AUTH.logout();
    }
  });

  var scheduled = false;
  function queue() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(function () { scheduled = false; sync(); });
  }
  function start() {
    var dropdown = document.querySelector('.acc-dropdown');
    if (!dropdown) return;
    new MutationObserver(queue).observe(dropdown, { childList: true, subtree: true, characterData: true });
    var strip = document.querySelector('.login-strip');
    if (strip) new MutationObserver(applyStrip).observe(strip, { childList: true, subtree: true, characterData: true });
    sync();
  }
  preShow();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
