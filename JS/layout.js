(function(){
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
        <a href="#" class="nav-item" data-toast="Danh mục sẽ được thêm sau.">DANH MỤC <span class="nav-caret"></span></a>
        <div class="nav-item-wrap">
          <a href="/nap-tien/chuyen-khoan" class="nav-item" data-nav="nap-tien">NẠP TIỀN <span class="nav-caret"></span></a>
          <div class="nav-dropdown">
            <a href="/nap-tien/nap-the" class="nav-dropdown-item"><span class="nav-dropdown-icon">🎫</span>NẠP THẺ CÀO</a>
            <a href="/nap-tien/chuyen-khoan" class="nav-dropdown-item"><span class="nav-dropdown-icon">🏦</span>CHUYỂN KHOẢN</a>
          </div>
        </div>
        <a href="#" class="nav-item" data-toast="Lịch sử giao dịch sẽ được thêm sau.">LỊCH SỬ <span class="nav-caret"></span></a>
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
          <a href="/favorites">Danh sách yêu thích</a>
          <a href="/new">Sản phẩm mới</a>
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

  var SCRIPTS = ["/JS/script.js", "/JS/modal-auth.js", "/JS/lang-menu.js", "/JS/auto-translate.js"];

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

  SCRIPTS.forEach(function(src){
    document.write('<script src="' + src + '"><\/script>');
  });
})();
