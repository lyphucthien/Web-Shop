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
      { t: 'Lịch sử mua tài khoản', href: '#' },
      { t: 'Lịch sử dùng dịch vụ', href: '#' },
      { t: 'Lịch sử chơi minigame', href: '#' },
      { t: 'Lịch sử nạp tiền', href: '#' },
      { t: 'Lịch sử rút vật phẩm', href: '#' }
    ]}
  ];

  var css = '' +
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
      var soon = it.href === '#' ? ' data-um-toast="' + esc(it.t) + ' sẽ được thêm sau."' : '';
      return '<a class="um-a" href="' + it.href + '"' + soon + '>' + esc(it.t) + '</a>';
    }).join('');
  }

  function render(dropdown, box) {
    var username = (box.querySelector('.acc-guest-title') || {}).textContent || '';
    if (box.getAttribute('data-um') === username) return; // đã render rồi
    box.setAttribute('data-um', username);
    dropdown.classList.add('um-mega');
    dropdown.querySelectorAll('.acc-avatar').forEach(function (n) { n.style.display = 'none'; });

    box.innerHTML =
      '<div class="um-hello">Xin chào, ' + esc(username) + '<small>Tài khoản LPTSHOP</small></div>' +
      '<div class="um-grid">' +
        '<div class="um-col">' + LEFT.map(section).join('') + '</div>' +
        '<div class="um-col">' + RIGHT.map(section).join('') +
          '<div class="um-h">Khác</div>' +
          '<button type="button" class="um-a um-out" data-um-logout>' + LOGOUT_ICON + 'Đăng xuất</button>' +
        '</div>' +
      '</div>';
  }

  function clearMega(dropdown) {
    dropdown.classList.remove('um-mega');
    dropdown.querySelectorAll('.acc-avatar').forEach(function (n) { n.style.display = ''; });
  }

  function sync() {
    var dropdown = document.querySelector('.acc-dropdown');
    if (!dropdown) return;
    var box = dropdown.querySelector('[data-el="userBox"]');
    if (box) render(dropdown, box);
    else clearMega(dropdown);
  }

  document.addEventListener('click', function (e) {
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
    sync();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
