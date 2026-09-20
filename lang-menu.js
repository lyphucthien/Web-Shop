(function () {
  const TOOLTIP_DELAY = 250;
  const OFFSET_X = 0;
  const OFFSET_Y = -40;

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

  const btn = document.querySelector('button[aria-label="Ngôn Ngữ"]');
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

  if (!COUNTRIES.some(c => c[0] === currentCC)) {
    currentCC = 'vn';
    currentLang = 'vi';
  }

  function langName(cc) {
    const f = COUNTRIES.find(c => c[0] === cc);
    if (!f) return cc.toUpperCase();
    try {
      const dn = new Intl.DisplayNames([currentLang], { type: 'language' });
      const name = dn.of(f[1]);
      if (name) return name.charAt(0).toUpperCase() + name.slice(1);
    } catch (e) {}
    return f[2];
  }

  const ARCS = [
    { r: 100, a0: 38, size: 33 },
    { r: 158, a0: 22, size: 33 },
  ];

  function render() {
    const cur = COUNTRIES.find(c => c[0] === currentCC) || COUNTRIES[0];
    const others = COUNTRIES.filter(c => c[0] !== cur[0]);
    const inner = others.slice(0, 4);
    inner.splice(2, 0, cur);
    const groups = [inner, others.slice(4)];

    let html = '', idx = 0;
    groups.forEach((g, gi) => {
      const { r, size, a0 } = ARCS[gi];
      g.forEach((c, k) => {
        const t = g.length === 1 ? 0.5 : k / (g.length - 1);
        const deg = (180 - a0) - t * (180 - 2 * a0);
        const ang = deg * Math.PI / 180;
        const x = Math.round(Math.cos(ang) * r);
        const y = Math.round(Math.sin(ang) * r);
        const isCur = c[0] === cur[0];
        html += `<button type="button" class="lang-flag-btn${isCur ? ' active' : ''}"
          data-cc="${c[0]}" data-lang="${c[1]}" aria-label="${c[2]}"
          style="--s:${isCur ? 40 : size}px;--x:${x}px;--y:${y}px;--d:${idx++ * 25}ms">
          <img src="${FLAG_URL(c[0])}" alt="" draggable="false"></button>`;
      });
    });
    menu.innerHTML = html;
  }

  function open() {
    render();
    const r = trigger.getBoundingClientRect();
    const reach = ARCS[ARCS.length - 1].r + 22;
    let cx = r.left + r.width / 2;
    cx = Math.max(reach + 8, Math.min(cx, window.innerWidth - reach - 8));
    menu.style.left = (cx + OFFSET_X) + 'px';
    menu.style.top  = (r.top + r.height / 2 + OFFSET_Y) + 'px';
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
