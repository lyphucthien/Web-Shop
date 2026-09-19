(function () {
  const TOOLTIP_DELAY = 250;

  const LANGS = [
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

  function langName(cc) {
    const f = LANGS.find(l => l[0] === cc);
    return f ? f[2] : cc.toUpperCase();
  }

  function open() {
    const r = trigger.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;

    const mobile = window.innerWidth < 700;
    const R = mobile ? 78 : 100;
    const size = mobile ? 30 : 36;
    menu.style.setProperty('--fs', size + 'px');
    
    const start = -25, end = 205, n = LANGS.length;
    const pts = LANGS.map((_, i) => {
      const a = (start + (end - start) * i / (n - 1)) * Math.PI / 180;
      return { x: R * Math.cos(a), y: R * Math.sin(a) };
    });

    let dx = 0;
    const minX = cx + Math.min(...pts.map(p => p.x)) - size / 2 - 6;
    const maxX = cx + Math.max(...pts.map(p => p.x)) + size / 2 + 6;
    if (minX < 0) dx = -minX;
    else if (maxX > window.innerWidth) dx = window.innerWidth - maxX;

    menu.style.left = cx + 'px';
    menu.style.top = cy + 'px';

    menu.innerHTML = LANGS.map(([cc, lang], i) => `
      <button type="button" class="lang-flag-btn${cc === currentCC ? ' active' : ''}"
        data-cc="${cc}" data-lang="${lang}" aria-label="${langName(cc)}"
        style="--x:${(pts[i].x + dx).toFixed(1)}px;--y:${pts[i].y.toFixed(1)}px;--d:${i * 25}ms">
        <img src="${FLAG_URL(cc)}" alt="" draggable="false"></button>`).join('');

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
    let top = r.bottom + 10;
    if (top + th > window.innerHeight - 8) top = r.top - th - 10;
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
