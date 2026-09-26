(function () {
  const toast = m => (window.showToast ? showToast(m) : alert(m));
  let mode = 'login';

  const overlay = document.createElement('div');
  overlay.className = 'auth-overlay';
  overlay.innerHTML = `
    <div class="auth-box" role="dialog" aria-modal="true">
      <button type="button" class="auth-close" aria-label="Đóng">×</button>

      <h2 class="auth-title" data-el="title">Đăng Nhập</h2>
      <p class="auth-subtitle" data-el="subtitle">Chào mừng bạn quay trở lại!</p>

      <form data-el="form" novalidate>
        <div class="auth-field">
          <label for="authUser" data-el="userLabel">Tài Khoản / Email / SĐT <span class="req">*</span></label>
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
        <button type="button" class="auth-social-btn" data-social="qr">
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
    </div>`;
  document.body.appendChild(overlay);

  const el = k => overlay.querySelector(`[data-el="${k}"]`);
  const form = el('form'), errBox = el('error'), submitBtn = el('submit');
  const confirmWrap = el('confirmWrap'), agreeRow = el('agreeRow'), rememberRow = el('rememberRow');
  const userInput = el('userInput'), passInput = el('passInput');

  const TEXT = {
    login: {
      title: 'Đăng Nhập',
      subtitle: 'Chào mừng bạn quay trở lại!',
      userLabel: 'Tài Khoản / Email / SĐT',
      userPlaceholder: 'Nhập tài khoản, email hoặc SĐT',
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

  function open(m) {
    setMode(m);
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => userInput.focus(), 50);
  }

  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    errBox.textContent = '';
  }

  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  el('title').closest('.auth-box').querySelector('.auth-close').addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('open')) close(); });

  el('forgotBtn').addEventListener('click', () => toast('Tính năng khôi phục mật khẩu sẽ được thêm sau.'));
  overlay.querySelectorAll('[data-social]').forEach(b =>
    b.addEventListener('click', () => {
      const label = b.dataset.social === 'qr' ? 'Quét Mã QR' : 'Google';
      toast('Đăng nhập bằng ' + label + ' sẽ được thêm sau.');
    })
  );

  form.addEventListener('submit', e => {
    e.preventDefault();
    const u = userInput.value.trim();
    const p = passInput.value;
    const reg = mode === 'register';

    if (reg ? !/^[a-zA-Z0-9_]{3,20}$/.test(u) : !u) {
      errBox.textContent = reg ? 'Tên đăng nhập 3-20 ký tự: chữ, số, dấu _' : 'Vui lòng nhập tài khoản, email hoặc SĐT.';
      return;
    }
    if (p.length < 6) { errBox.textContent = 'Mật khẩu phải từ 6 ký tự trở lên.'; return; }
    if (reg && p !== document.getElementById('authPass2').value) { errBox.textContent = 'Mật khẩu nhập lại không khớp.'; return; }
    if (reg && !document.getElementById('authAgree').checked) { errBox.textContent = 'Bạn cần đồng ý với Điều khoản.'; return; }

    errBox.textContent = '';
    submitBtn.disabled = true;
    setTimeout(() => {
      submitBtn.disabled = false;
      close();
      toast('Giao diện demo — chưa kết nối server.');
    }, 300);
  });

  document.addEventListener('click', e => {
    const t = e.target.closest('[data-modal]');
    if (t) open(t.dataset.modal);
  });

  window.LPT_AUTH_MODAL = { open, close };
})();
