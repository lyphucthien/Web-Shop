(function () {
  const tabs = document.querySelectorAll('.lg-tab');
  const form = document.getElementById('lgForm');
  const err = document.getElementById('lgError');
  const submitBtn = document.getElementById('lgSubmit');
  const confirmWrap = document.getElementById('lgConfirmWrap');
  const passInput = document.getElementById('lgPass');
  const sub = document.getElementById('lgSub');
  const switchLine = document.getElementById('lgSwitch');
  let mode = 'dang-nhap';

  function currentTab() {
    return location.pathname.replace(/\/+$/, '').split('/').pop();
  }

  function setMode(m) {
    mode = m === 'dang-ky' ? 'dang-ky' : 'dang-nhap';
    const reg = mode === 'dang-ky';
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === mode));
    confirmWrap.hidden = !reg;
    submitBtn.textContent = reg ? 'Tạo Tài Khoản' : 'Đăng Nhập';
    passInput.autocomplete = reg ? 'new-password' : 'current-password';
    sub.textContent = reg ? 'Tạo tài khoản mới chỉ trong vài giây' : 'Đăng nhập để mua hàng và xem số dư';
    switchLine.innerHTML = reg
      ? 'Đã có tài khoản? <a href="/tai-khoan/dang-nhap">Đăng nhập</a>'
      : 'Chưa có tài khoản? <a href="/tai-khoan/dang-ky">Đăng ký ngay</a>';
    document.title = (reg ? 'Đăng Ký' : 'Đăng Nhập') + '〡LPTSHOP';
    err.textContent = '';
  }

  tabs.forEach(t => t.addEventListener('click', () => {
    setMode(t.dataset.tab);
    history.pushState(null, '', '/tai-khoan/' + mode);
  }));

  window.addEventListener('popstate', () => setMode(currentTab()));

  setMode(currentTab());
  if (currentTab() !== mode) history.replaceState(null, '', '/tai-khoan/' + mode);

  document.getElementById('lgEye').addEventListener('click', () => {
    passInput.type = passInput.type === 'password' ? 'text' : 'password';
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const u = document.getElementById('lgUser').value.trim();
    const p = passInput.value;
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(u)) { err.textContent = 'Tên đăng nhập 3-20 ký tự: chữ, số, dấu _'; return; }
    if (p.length < 6) { err.textContent = 'Mật khẩu phải từ 6 ký tự trở lên.'; return; }
    if (mode === 'dang-ky' && p !== document.getElementById('lgPass2').value) { err.textContent = 'Mật khẩu nhập lại không khớp.'; return; }
    err.textContent = '';

    showToast('Giao diện demo — chưa kết nối server.');
  });
})();
