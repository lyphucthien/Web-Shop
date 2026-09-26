(function () {
  const toast = m => (window.showToast ? showToast(m) : alert(m));
  let mode = 'login';

  const overlay = document.createElement('div');
  overlay.className = 'auth-overlay';
  overlay.innerHTML = `
    <div class="auth-box" role="dialog" aria-modal="true">
      <button type="button" class="auth-close" aria-label="Đóng">×</button>

      <div data-el="mainView">
        <h2 class="auth-title" data-el="title">Đăng Nhập</h2>
        <p class="auth-subtitle" data-el="subtitle">Chào mừng bạn quay trở lại!</p>

        <form data-el="form" novalidate>
          <div class="auth-field">
            <label for="authUser" data-el="userLabel">Tên Đăng Nhập <span class="req">*</span></label>
            <input id="authUser" type="text" maxlength="30" autocomplete="username" data-el="userInput">
          </div>

          <div class="auth-field">
            <label for="authPass">Mật Khẩu <span class="req">*</span></label>
            <input id="authPass" type="password" maxlength="64" autocomplete="current-password" data-el="passInput">
          </div>

          <div class="auth-field" data-el="confirmWrap" hidden>
            <label for="authPass2">Nhập Lại Mật Khẩu <span class="req">*</span></label>
            <input id="authPass2" type="password" maxlength="64" autocomplete="new-password" placeholder="Nhập lại mật khẩu">
          </div>

          <div class="auth-row" data-el="rememberRow">
            <label class="auth-remember">
              <input type="checkbox" id="authRemember"> Ghi nhớ
            </label>
            <button type="button" class="auth-forgot" data-el="forgotBtn">Quên mật khẩu?</button>
          </div>

          <label class="auth-agree" data-el="agreeRow" hidden>
            <input type="checkbox" id="authAgree">
            <span>Tôi đồng ý với <a href="#" data-el="termsLink">Điều khoản</a></span>
          </label>

          <div class="auth-error" data-el="error"></div>

          <button type="submit" class="auth-submit" data-el="submit">Đăng Nhập</button>
        </form>

        <div class="auth-divider">Hoặc</div>

        <div class="auth-social">
          <button type="button" class="auth-social-btn" data-social="google">
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.8 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.5 6 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.5 6 29.5 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"/><path fill="#4CAF50" d="M24 44c5.4 0 10.3-1.9 14-5.3l-6.5-5.5C29.4 34.8 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.6 5.1C9.6 39.6 16.3 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.9 2.6-2.6 4.8-4.8 6.2l6.5 5.5C40.8 36.9 44 31 44 24c0-1.3-.1-2.7-.4-3.5z"/></svg>
            Google
          </button>
          <button type="button" class="auth-social-btn" data-el="qrTrigger">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              <line x1="14" y1="14" x2="14" y2="14.01"/><line x1="17.5" y1="14" x2="17.5" y2="17.5"/><line x1="14" y1="17.5" x2="17.5" y2="17.5"/>
              <line x1="14" y1="21" x2="17.5" y2="21"/><line x1="21" y1="14" x2="21" y2="17.5"/><line x1="21" y1="21" x2="21" y2="21.01"/>
            </svg>
            Quét Mã QR
          </button>
        </div>

        <p class="auth-switch" data-el="switch">
          Chưa có tài khoản? <button type="button" data-el="switchBtn">Đăng ký ngay</button>
        </p>
      </div>

      <div class="auth-qr-view" data-el="qrView" hidden>
        <h2 class="auth-title">Đăng Nhập Bằng QR</h2>
        <p class="auth-subtitle">Dùng điện thoại đã đăng nhập để quét mã bên dưới</p>

        <div class="auth-qr-box">
          <img data-el="qrImg" alt="Mã QR đăng nhập" width="200" height="200">
          <div class="auth-qr-overlay" data-el="qrOverlay" hidden>
            <span data-el="qrOverlayText">Đang tạo mã mới...</span>
          </div>
        </div>

        <p class="auth-qr-hint" data-el="qrHint">Mở app / trình duyệt trên điện thoại đã đăng nhập LPTSHOP, quét mã này để xác nhận.</p>
        <p class="auth-qr-timer" data-el="qrTimer"></p>

        <button type="button" class="auth-qr-cancel" data-el="qrCancel">← Quay lại đăng nhập bằng mật khẩu</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const el = k => overlay.querySelector(`[data-el="${k}"]`);
  const form = el('form'), errBox = el('error'), submitBtn = el('submit');
  const confirmWrap = el('confirmWrap'), agreeRow = el('agreeRow'), rememberRow = el('rememberRow');
  const userInput = el('userInput'), passInput = el('passInput');
  const mainView = el('mainView'), qrView = el('qrView');
  const qrImg = el('qrImg'), qrOverlay = el('qrOverlay'), qrOverlayText = el('qrOverlayText'), qrTimer = el('qrTimer');

  const TEXT = {
    login: {
      title: 'Đăng Nhập',
      subtitle: 'Chào mừng bạn quay trở lại!',
      userLabel: 'Tên Đăng Nhập',
      userPlaceholder: 'Nhập tên đăng nhập',
      submit: 'Đăng Nhập',
      switchText: 'Chưa có tài khoản?',
      switchBtn: 'Đăng ký ngay',
    },
    register: {
      title: 'Đăng Ký Tài Khoản',
      subtitle: 'Tạo tài khoản miễn phí ngay hôm nay',
      userLabel: 'Tên Đăng Nhập',
      userPlaceholder: 'Nhập tên đăng nhập',
      submit: 'Đăng Ký',
      switchText: 'Đã có tài khoản?',
      switchBtn: 'Đăng nhập',
    }
  };

  function setMode(m) {
    mode = m === 'register' ? 'register' : 'login';
    const t = TEXT[mode];
    const reg = mode === 'register';

    el('title').textContent = t.title;
    el('subtitle').textContent = t.subtitle;
    el('userLabel').innerHTML = t.userLabel + ' <span class="req">*</span>';
    userInput.placeholder = t.userPlaceholder;
    passInput.placeholder = reg ? 'Tối thiểu 6 ký tự' : '';
    passInput.autocomplete = reg ? 'new-password' : 'current-password';
    submitBtn.textContent = t.submit;

    confirmWrap.hidden = !reg;
    rememberRow.hidden = reg;
    agreeRow.hidden = !reg;

    el('switch').innerHTML = '';
    el('switch').append(t.switchText + ' ');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = t.switchBtn;
    btn.addEventListener('click', () => setMode(reg ? 'login' : 'register'));
    el('switch').append(btn);

    errBox.textContent = '';
    form.reset();
  }

  function showMainView() {
    stopQrPolling();
    qrView.hidden = true;
    mainView.hidden = false;
  }

  function open(m) {
    setMode(m);
    showMainView();
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => userInput.focus(), 50);
  }

  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    errBox.textContent = '';
    stopQrPolling();
  }

  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  overlay.querySelector('.auth-close').addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('open')) close(); });

  el('forgotBtn').addEventListener('click', () => toast('Tính năng khôi phục mật khẩu sẽ được thêm sau.'));

  overlay.querySelector('[data-social="google"]').addEventListener('click', () =>
    toast('Đăng nhập bằng Google sẽ được thêm sau.')
  );

  // ===================== GỌI API THẬT =====================

  async function apiCall(url, opts) {
    const res = await fetch(url, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      ...opts,
    });
    let data = {};
    try { data = await res.json(); } catch (e) { /* no body */ }
    if (!res.ok) throw new Error(data.error || 'Đã có lỗi xảy ra, vui lòng thử lại.');
    return data;
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const u = userInput.value.trim();
    const p = passInput.value;
    const reg = mode === 'register';

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(u)) {
      errBox.textContent = 'Tên đăng nhập 3-20 ký tự: chữ, số, dấu _';
      return;
    }
    if (p.length < 6) { errBox.textContent = 'Mật khẩu phải từ 6 ký tự trở lên.'; return; }
    if (reg && p !== document.getElementById('authPass2').value) {
      errBox.textContent = 'Mật khẩu nhập lại không khớp.'; return;
    }
    if (reg && !document.getElementById('authAgree').checked) {
      errBox.textContent = 'Bạn cần đồng ý với Điều khoản.'; return;
    }

    errBox.textContent = '';
    submitBtn.disabled = true;

    try {
      if (reg) {
        await apiCall('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify({ username: u, password: p, confirmPassword: document.getElementById('authPass2').value }),
        });
        // Đăng ký xong thì đăng nhập luôn cho tiện
        const data = await apiCall('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ username: u, password: p }),
        });
        close();
        toast('Đăng ký thành công! Xin chào ' + data.username + '.');
        window.LPT_AUTH.refreshUI();
      } else {
        const data = await apiCall('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ username: u, password: p }),
        });
        close();
        toast('Đăng nhập thành công! Xin chào ' + data.username + '.');
        window.LPT_AUTH.refreshUI();
      }
    } catch (err) {
      errBox.textContent = err.message;
    } finally {
      submitBtn.disabled = false;
    }
  });

  // ===================== ĐĂNG NHẬP BẰNG QR =====================

  let qrPollTimer = null;
  let qrCountdownTimer = null;
  let currentSid = null;

  function stopQrPolling() {
    if (qrPollTimer) { clearInterval(qrPollTimer); qrPollTimer = null; }
    if (qrCountdownTimer) { clearInterval(qrCountdownTimer); qrCountdownTimer = null; }
    currentSid = null;
  }

  function renderQrImage(sid) {
    const confirmUrl = `${location.origin}/xac-nhan-dang-nhap?sid=${sid}`;
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(confirmUrl)}`;
  }

  function startCountdown(seconds) {
    let remain = seconds;
    qrTimer.textContent = `Mã hết hạn sau ${remain}s`;
    qrCountdownTimer = setInterval(() => {
      remain -= 1;
      if (remain <= 0) {
        qrTimer.textContent = 'Mã đã hết hạn.';
        clearInterval(qrCountdownTimer);
        return;
      }
      qrTimer.textContent = `Mã hết hạn sau ${remain}s`;
    }, 1000);
  }

  async function startQrFlow() {
    stopQrPolling();
    qrOverlay.hidden = false;
    qrOverlayText.textContent = 'Đang tạo mã QR...';
    errBox.textContent = '';

    try {
      const { sid, expiresIn } = await apiCall('/api/auth/qr/create', { method: 'POST' });
      currentSid = sid;
      renderQrImage(sid);
      qrOverlay.hidden = true;
      startCountdown(expiresIn);

      qrPollTimer = setInterval(async () => {
        if (!currentSid) return;
        try {
          const data = await apiCall(`/api/auth/qr/status?sid=${currentSid}`, { method: 'GET' });

          if (data.status === 'confirmed' && data.claimToken) {
            stopQrPolling();
            qrOverlay.hidden = false;
            qrOverlayText.textContent = 'Đang đăng nhập...';
            const claimed = await apiCall('/api/auth/qr/claim', {
              method: 'POST',
              body: JSON.stringify({ claimToken: data.claimToken }),
            });
            close();
            toast('Đăng nhập bằng QR thành công! Xin chào ' + claimed.username + '.');
            window.LPT_AUTH.refreshUI();
          } else if (data.status === 'expired') {
            stopQrPolling();
            qrOverlay.hidden = false;
            qrOverlayText.textContent = 'Mã đã hết hạn, đang tạo mã mới...';
            setTimeout(startQrFlow, 900);
          }
        } catch (err) {
          // lỗi tạm thời khi poll thì bỏ qua, thử lại ở lượt sau
        }
      }, 2500);
    } catch (err) {
      qrOverlay.hidden = true;
      errBox.textContent = err.message;
    }
  }

  el('qrTrigger').addEventListener('click', () => {
    mainView.hidden = true;
    qrView.hidden = false;
    startQrFlow();
  });

  el('qrCancel').addEventListener('click', showMainView);

  // ===================== MỞ MODAL TỪ NÚT data-modal =====================

  document.addEventListener('click', e => {
    const t = e.target.closest('[data-modal]');
    if (t) open(t.dataset.modal);
  });

  window.LPT_AUTH_MODAL = { open, close };

  // ===================== ĐỒNG BỘ GIAO DIỆN THEO TRẠNG THÁI ĐĂNG NHẬP =====================

  function buildLoggedInAccDropdown(username) {
    const dropdown = document.querySelector('.acc-dropdown');
    if (!dropdown) return;

    dropdown.querySelectorAll('[data-el="guest"]').forEach(n => n.remove());
    let box = dropdown.querySelector('[data-el="userBox"]');
    if (!box) {
      box = document.createElement('div');
      box.dataset.el = 'userBox';
      dropdown.appendChild(box);
    }
    box.innerHTML = `
      <p class="acc-guest-title">${username}</p>
      <button type="button" class="acc-login-btn" data-el="logoutBtn">Đăng Xuất</button>
    `;
    box.querySelector('[data-el="logoutBtn"]').addEventListener('click', doLogout);
  }

  function restoreGuestAccDropdown() {
    const dropdown = document.querySelector('.acc-dropdown');
    if (!dropdown) return;
    const box = dropdown.querySelector('[data-el="userBox"]');
    if (box) box.remove();
    dropdown.querySelectorAll('.acc-guest-title, .acc-login-btn, .acc-register-btn').forEach(n => {
      n.hidden = false;
    });
  }

  function updateLoginStrip(username) {
    const strip = document.querySelector('.login-strip');
    if (!strip) return;
    const copy = strip.querySelector('.login-copy');
    const actions = strip.querySelector('.login-actions');
    if (!copy || !actions) return;

    if (username) {
      copy.querySelector('strong').textContent = `Xin chào, ${username}!`;
      copy.querySelector('small').textContent = 'Chúc bạn mua sắm vui vẻ tại LPTSHOP.';
      actions.innerHTML = `<button class="register-btn" data-el="stripLogout">Đăng Xuất</button>`;
      actions.querySelector('[data-el="stripLogout"]').addEventListener('click', doLogout);
    } else {
      copy.querySelector('strong').textContent = 'Xin chào!';
      copy.querySelector('small').textContent = 'Vui lòng đăng nhập để thực hiện mua hàng và xem số dư';
      actions.innerHTML = `
        <button class="login-btn" data-modal="login">Đăng Nhập</button>
        <button class="register-btn" data-modal="register">Đăng Ký</button>
      `;
    }
  }

  async function doLogout() {
    try { await apiCall('/api/auth/logout', { method: 'POST' }); } catch (e) { /* ignore */ }
    toast('Đã đăng xuất.');
    window.LPT_AUTH.refreshUI();
  }

  async function refreshUI() {
    try {
      const data = await apiCall('/api/auth/me', { method: 'GET' });
      buildLoggedInAccDropdown(data.username);
      updateLoginStrip(data.username);
    } catch (err) {
      restoreGuestAccDropdown();
      updateLoginStrip(null);
    }
  }

  window.LPT_AUTH = { refreshUI, logout: doLogout };

  document.addEventListener('DOMContentLoaded', refreshUI);
  if (document.readyState !== 'loading') refreshUI();
})();
