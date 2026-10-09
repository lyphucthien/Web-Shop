(function(){
  var I = function(d){ return '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>'; };
  var ICON_HISTORY = I('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><polyline points="3 3 3 8 8 8"/><polyline points="12 7 12 12 15 14"/>');
  var HISTORY_ITEMS = [
    { icon: ICON_HISTORY, text: "Lịch Sử Mua Tài Khoản", href: "/tai-khoan/lich-su-mua-acc" },
    { icon: I('<line x1="9" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="9" y1="18" x2="21" y2="18"/><line x1="3.5" y1="6" x2="3.51" y2="6"/><line x1="3.5" y1="12" x2="3.51" y2="12"/><line x1="3.5" y1="18" x2="3.51" y2="18"/>'), text: "Lịch Sử Dùng Dịch Vụ", href: "/tai-khoan/lich-su-dich-vu" },
    { icon: I('<line x1="6" y1="11" x2="10" y2="11"/><line x1="8" y1="9" x2="8" y2="13"/><line x1="15" y1="12" x2="15.01" y2="12"/><line x1="18" y1="10" x2="18.01" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258A4 4 0 0 0 17.32 5z"/>'), text: "Lịch Sử Chơi MiniGame", href: "/tai-khoan/lich-su-minigame" },
    { icon: I('<circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/>'), text: "Lịch Sử Nạp Tiền", href: "/tai-khoan/lich-su-nap-tien" },
    { icon: I('<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>'), text: "Lịch Sử Rút Vật Phẩm", href: "/tai-khoan/lich-su-rut-vat-pham" },
  ];
  var HISTORY_HTML = HISTORY_ITEMS.map(function(it){
    var toast = it.href === "#" ? ' data-toast="' + it.text + ' sẽ được thêm sau."' : '';
    return '<a href="' + it.href + '" class="nav-dropdown-item"' + toast + '>' + it.icon + it.text + '</a>';
  }).join("\n            ");

  var CATEGORY_ITEMS = [
    { icon: I('<path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/>'), text: "Key System", href: "#" },
    { icon: I('<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>'), text: "Reset HWID", href: "#" },
    { icon: I('<path fill="currentColor" stroke="none" fill-rule="evenodd" transform="translate(2.9 2.9) scale(.76)" d="M18.926 23.998 0 18.892 5.075.002 24 5.108ZM15.348 10.09l-5.282-1.453-1.414 5.273 5.282 1.453 1.414-5.273Z"/>'), text: "Roblox", href: "#" },
    { icon: I('<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>'), text: "Túi Mù", href: "#" },
    { icon: I('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 12h18"/><path d="M12 3v18"/>'), text: "Other", href: "#" },
  ];
  var CATEGORY_HTML = CATEGORY_ITEMS.map(function(it){
    var toast = it.href === "#" ? ' data-toast="' + it.text + ' sẽ được thêm sau."' : '';
    return '<a href="' + it.href + '" class="nav-dropdown-item"' + toast + '>' + it.icon + it.text + '</a>';
  }).join("\n            ");

  var HEADER = `
  <header class="site-header">
    <div class="topbar">
      <div class="container topbar-inner">
        <a href="/" class="brand-image brand-home" aria-label="Trang chủ">
          <img src="" alt="LPT Shop" onerror="this.style.display='none'">
        </a>

        <div class="search-box">
          <input type="search" placeholder="Tìm kiếm tài khoản, danh mục..." aria-label="Tìm kiếm">
          <button type="button" data-toast="Tìm kiếm đang ở chế độ demo." aria-label="Tìm kiếm">⌕</button>
        </div>

        <div class="top-actions">
          <button class="circle-btn icon-accent" id="themeToggle" aria-label="Đổi Giao Diện Sáng/Tối">
            <svg class="icon-moon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            <svg class="icon-sun" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          </button>
          <button class="circle-btn icon-accent" aria-label="Ngôn Ngữ">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          </button>
          <button class="circle-btn icon-accent" data-toast="Danh sách theo dõi sẽ được thêm sau." aria-label="Lịch Sử">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
          <button class="circle-btn notification icon-accent" data-toast="Giỏ hàng đang ở chế độ demo." aria-label="Danh Sách Yêu Thích">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
            <i>0</i>
          </button>
          <div class="acc-wrap">
            <button class="circle-btn icon-accent no-tip" aria-label="Tài Khoản">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </button>
            <div class="acc-dropdown">
              <div class="acc-avatar">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <p class="acc-guest-title">Khách truy cập</p>
              <button type="button" class="acc-login-btn" data-modal="login">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                &nbsp;Đăng Nhập
              </button>
              <button type="button" class="acc-register-btn" data-modal="register">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="17" y1="11" x2="23" y2="11"/></svg>
                &nbsp;Đăng Ký
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <nav class="main-nav">
      <div class="container nav-inner">
        <a href="/" class="nav-item" data-nav="home">TRANG CHỦ</a>
        <div class="nav-item-wrap">
          <a href="#" class="nav-item" data-toast="Danh mục sẽ được thêm sau.">DANH MỤC <span class="nav-caret"></span></a>
          <div class="nav-dropdown nav-dropdown-category">
            ${CATEGORY_HTML}
          </div>
        </div>
        <div class="nav-item-wrap">
          <a href="/nap-tien/chuyen-khoan" class="nav-item" data-nav="nap-tien">NẠP TIỀN <span class="nav-caret"></span></a>
          <div class="nav-dropdown">
            <a href="/nap-tien/nap-the" class="nav-dropdown-item"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="6" y1="15" x2="10" y2="15"/></svg>NẠP THẺ CÀO</a>
            <a href="/nap-tien/chuyen-khoan" class="nav-dropdown-item"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>CHUYỂN KHOẢN</a>
          </div>
        </div>
        <div class="nav-item-wrap">
          <a href="/tai-khoan/lich-su-mua-acc" class="nav-item">LỊCH SỬ <span class="nav-caret"></span></a>
          <div class="nav-dropdown nav-dropdown-history">
            ${HISTORY_HTML}
          </div>
        </div>
        <a href="/cap-bac" class="nav-item" data-nav="cap-bac">CẤP BẬC</a>
        <a href="/tin-tuc" class="nav-item" data-nav="tin-tuc">TIN TỨC</a>
      </div>
    </nav>
  </header>`;

  var FOOTER = `
  <footer class="footer">
    <div class="footer-main">
      <div class="container footer-grid">
        <div class="footer-about">
          <a href="/" class="footer-logo">
            <img src="" alt="lptshop.com" onerror="this.style.display='none'">
          </a>
          <h3>LPTSHOP.COM - SHOP BÁN ACC ĐA LOẠI GAME<br>ĐÚNG MÔ TẢ, AN TÂM TRẢI NGHIỆM, BẢO MẬT 100% </h3>
          <p>LPTSHOP.COM - Hệ Thống Bán Acc Đa Loại Game. Mua ngay!</p>
          <p>Giá cả phải chăng - Chất lượng - An toàn</p>
        </div>
        <div>
          <h4>LIÊN KẾT NHANH</h4>
          <a href="#" data-modal="login">Tài khoản của tôi</a>
          <a href="#" data-toast="Danh sách yêu thích sẽ được thêm sau.">Danh sách yêu thích</a>
          <a href="#" data-toast="Sản phẩm mới sẽ được thêm sau.">Sản phẩm mới</a>
        </div>
        <div>
          <h4>LIÊN HỆ</h4>
          <p class="contact-line notranslate" translate="no">Hotline: facebook.com/lyphucthien180312</p>
          <p class="contact-line notranslate" translate="no">Email: lythien180312@gmail.com</p>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container">© Bản Quyền Thuộc Về LPTSHOP - Phiên bản: 1.0.0</div>
    </div>
  </footer>

  <div id="toast" class="toast"></div>`;

  var SCRIPTS = ["/JS/auto-translate.js","/JS/lang-menu.js","/JS/script.js","/JS/modal-auth.js","/JS/user-menu.js"];

  function fill(id, html){
    var el = document.getElementById(id);
    if(el) el.outerHTML = html;
  }
  fill("site-header", HEADER);
  fill("site-footer", FOOTER);

  var p = location.pathname.replace(/\/+$/, "") || "/";
  var key = p === "/" || p === "/index.html" ? "home"
          : p.indexOf("/nap-tien") === 0     ? "nap-tien"
          : p.indexOf("/cap-bac") === 0      ? "cap-bac"
          : p.indexOf("/tin-tuc") === 0      ? "tin-tuc" : "";
  if(key){
    var a = document.querySelector('.nav-item[data-nav="' + key + '"]');
    if(a) a.classList.add("active");
  }

  // Nút Messenger
  (function () {
    if (window.__floatLoaded) return;
    window.__floatLoaded = true;
    var MESSENGER_URL = 'https://m.me/lyphucthien180312';

    var style = document.createElement('style');
    style.textContent =
      '.fb-wrap{position:fixed;right:20px;bottom:20px;z-index:9999;display:flex;flex-direction:column;gap:12px;align-items:center}' +
      '.fb-btn{width:54px;height:54px;border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;position:relative;text-decoration:none;' +
        'box-shadow:0 8px 22px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.35);transition:transform .25s cubic-bezier(.34,1.56,.64,1),box-shadow .25s}' +
      '.fb-btn:hover{transform:translateY(-3px) scale(1.08);box-shadow:0 14px 28px rgba(0,0,0,.34),inset 0 1px 0 rgba(255,255,255,.35)}' +
      '.fb-btn:active{transform:scale(.96)}' +
      '.fb-btn svg{width:26px;height:26px;fill:#fff;filter:drop-shadow(0 1px 2px rgba(0,0,0,.25))}' +
      '.fb-messenger{background:linear-gradient(135deg,#00c6ff 0%,#0078ff 52%,#a334fa 100%)}' +
      '@media(max-width:600px){.fb-wrap{right:12px;bottom:12px}.fb-btn{width:48px;height:48px}}';
    document.head.appendChild(style);

    var wrap = document.createElement('div');
    wrap.className = 'fb-wrap';
    wrap.innerHTML =
      '<a class="fb-btn fb-messenger" href="' + MESSENGER_URL + '" target="_blank" rel="noopener" aria-label="Messenger">' +
        '<svg viewBox="0 0 24 24"><path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.14.26.35.27.57l.05 1.78c.02.57.6.94 1.12.71l1.99-.88c.17-.07.36-.09.53-.04.91.25 1.87.38 2.9.38 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm6 7.46l-2.94 4.66c-.47.74-1.47.93-2.17.4l-2.34-1.75a.6.6 0 0 0-.72 0l-3.16 2.4c-.42.32-.97-.19-.69-.64l2.94-4.66c.47-.74 1.47-.93 2.17-.4l2.34 1.75a.6.6 0 0 0 .72 0l3.16-2.4c.42-.32.97.19.69.64z"/></svg>' +
      '</a>';
    document.body.appendChild(wrap);
  })();

  SCRIPTS.forEach(function(src){
    document.write('<script src="' + src + '"><\/script>');
  });
})();
