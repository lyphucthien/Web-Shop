(function () {
  const TOOLTIP_DELAY = 250;

  const COUNTRIES = [
    ['vn','vi','Tiếng Việt'],
    ['us','en','English'],
    ['cn','zh-CN','简体中文'],
    ['tw','zh-TW','繁體中文'],
    ['kr','ko','한국어'],
    ['jp','ja','日本語'],
    ['th','th','ไทย'],
    ['kh','km','ភាសាខ្មែរ'],
    ['la','lo','ພາສາລາວ'],
    ['ru','ru','Русский'],
    ['fr','fr','Français'],
    ['de','de','Deutsch'],
  ];

  const FLAG_URL = (cc) => `https://hatscripts.github.io/circle-flags/flags/${cc}.svg`;

  const btn = document.querySelector('button[aria-label="Ngôn ngữ"]');
  if (!btn) return;

  btn.removeAttribute('data-toast');
  const trigger = btn.cloneNode(true);
  btn.parentNode.replaceChild(trigger, btn);

  const wrap = document.createElement('div');
  wrap.className = 'lang-wrap';
  trigger.parentNode.insertBefore(wrap, trigger);
  wrap.appendChild(trigger);

  const menu = document.createElement('div');
  menu.className = 'lang-flags';
  document.body.appendChild(menu);

  const tip = document.createElement('div');
  tip.className = 'lang-tooltip';
  document.body.appendChild(tip);

  let currentCC = 'vn', currentLang = 'vi';
  try {
    currentCC = localStorage.getItem('lpt_cc') || 'vn';
    currentLang = localStorage.getItem('lpt_lang') || 'vi';
  } catch (e) {}

  // nếu mã lưu cũ không nằm trong 12 nước này thì về Việt Nam
  if (!COUNTRIES.some(c => c[0] === currentCC)) {
    currentCC = 'vn';
    currentLang = 'vi';
  }

  function langName(cc) {
    const f = COUNTRIES.find(c => c[0] === cc);
    return f ? f[2] : cc.toUpperCase();
  }

  function render() {
    const list = COUNTRIES.filter(c => c[0] !== currentCC);
    const rows = [5, 4, 2];
    let i = 0, html = '';

    for (const count of rows) {
      let rowHtml = '';
      for (let k = 0; k < count && i < list.length; k++, i++) {
        const [cc, lang, name] = list[i];
        const jx = ((i * 37) % 5) - 2, jy = ((i * 53) % 5) - 2;
        rowHtml += `<button type="button" class="lang-flag-btn"
          data-cc="${cc}" data-lang="${lang}" aria-label="${name}"
          style="--jx:${jx}px;--jy:${jy}px;--d:${i * 25}ms">
          <img src="${FLAG_URL(cc)}" alt="" draggable="false"></button>`;
      }
      html += `<div class="lang-row">${rowHtml}</div>`;
    }

    // cờ đang chọn ở mũi nhọn
    const cur = COUNTRIES.find(c => c[0] === currentCC) || COUNTRIES[0];
    html += `<div class="lang-row"><button type="button" class="lang-flag-btn active"
      data-cc="${cur[0]}" data-lang="${cur[1]}" aria-label="${cur[2]}"
      style="--jx:0px;--jy:0px;--d:${list.length * 25}ms">
      <img src="${FLAG_URL(cur[0])}" alt="" draggable="false"></button></div>`;

    menu.innerHTML = html;
  }

  function open() {
    render();
    const r = trigger.getBoundingClientRect();
    menu.style.top = (r.bottom + 10) + 'px';
    requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('open')));
  }

  function close() { menu.classList.remove('open'); hideTip(); }

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.contains('open') ? close() : open();
  });
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !wrap.contains(e.target)) close();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  window.addEventListener('resize', close);
  window.addEventListener('scroll', close, { passive: true });

  menu.addEventListener('click', (e) => {
    const b = e.target.closest('.lang-flag-btn');
    if (!b) return;
    currentCC = b.dataset.cc;
    currentLang = b.dataset.lang;
    try {
      localStorage.setItem('lpt_cc', currentCC);
      localStorage.setItem('lpt_lang', currentLang);
    } catch (err) {}
    document.documentElement.lang = currentLang;
    close();
    if (typeof showToast === 'function') showToast('Đã chọn: ' + langName(currentCC));
    document.dispatchEvent(new CustomEvent('lptlangchange', { detail: { lang: currentLang, cc: currentCC } }));
  });

  let tipTimer;
  function hideTip() { clearTimeout(tipTimer); tip.classList.remove('show'); }

  function showTip(b) {
    tip.textContent = langName(b.dataset.cc);
    tip.classList.add('show');
    const r = b.getBoundingClientRect();
    const tw = tip.offsetWidth, th = tip.offsetHeight;
    let left = r.left + r.width / 2 - tw / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - tw - 8));
    let top = r.top - th - 10;
    if (top < 8) top = r.bottom + 10;
    tip.style.left = left + 'px';
    tip.style.top = top + 'px';
  }

  menu.addEventListener('mouseover', (e) => {
    const b = e.target.closest('.lang-flag-btn');
    if (!b || b.contains(e.relatedTarget)) return;
    hideTip();
    tipTimer = setTimeout(() => showTip(b), TOOLTIP_DELAY);
  });
  menu.addEventListener('mouseout', (e) => {
    const b = e.target.closest('.lang-flag-btn');
    if (b && !b.contains(e.relatedTarget)) hideTip();
  });
  menu.addEventListener('mouseleave', hideTip);
})();
