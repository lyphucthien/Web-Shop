(function () {
  const LANGS = [
    { lang: 'vi',    flag: 'vn', label: 'Tiếng Việt',  country: 'Việt Nam' },
    { lang: 'en',    flag: 'us', label: 'English',     country: 'United States' },
    { lang: 'zh-CN', flag: 'cn', label: '简体中文',      country: '中国' },
    { lang: 'zh-TW', flag: 'tw', label: '繁體中文',      country: '台灣' },
    { lang: 'ko',    flag: 'kr', label: '한국어',        country: '대한민국' },
    { lang: 'ja',    flag: 'jp', label: '日本語',        country: '日本' },
    { lang: 'th',    flag: 'th', label: 'ไทย',          country: 'ประเทศไทย' },
    { lang: 'km',    flag: 'kh', label: 'ភាសាខ្មែរ',     country: 'កម្ពុជា' },
    { lang: 'lo',    flag: 'la', label: 'ພາສາລາວ',      country: 'ປະເທດລາວ' },
    { lang: 'ru',    flag: 'ru', label: 'Русский',     country: 'Россия' },
    { lang: 'fr',    flag: 'fr', label: 'Français',    country: 'France' },
    { lang: 'de',    flag: 'de', label: 'Deutsch',     country: 'Deutschland' },
    { lang: 'es',    flag: 'es', label: 'Español',     country: 'España' },
    { lang: 'pt',    flag: 'pt', label: 'Português',   country: 'Portugal' },
    { lang: 'it',    flag: 'it', label: 'Italiano',    country: 'Italia' },
    { lang: 'id',    flag: 'id', label: 'Indonesia',   country: 'Indonesia' },
    { lang: 'ms',    flag: 'my', label: 'Melayu',      country: 'Malaysia' },
    { lang: 'ar',    flag: 'sa', label: 'العربية',      country: 'المملكة العربية السعودية' },
    { lang: 'hi',    flag: 'in', label: 'हिन्दी',        country: 'भारत' },
    { lang: 'tr',    flag: 'tr', label: 'Türkçe',      country: 'Türkiye' },
  ];

  const TOOLTIP_DELAY = 500;

  const btn = document.querySelector('button[aria-label="Ngôn ngữ"]');
  if (!btn) return;

  btn.removeAttribute('data-toast');
  const clone = btn.cloneNode(true);
  btn.parentNode.replaceChild(clone, btn);

  const wrap = document.createElement('div');
  wrap.className = 'lang-wrap';
  clone.parentNode.insertBefore(wrap, clone);
  wrap.appendChild(clone);

  const menu = document.createElement('div');
  menu.className = 'lang-menu';
  menu.setAttribute('role', 'listbox');
  wrap.appendChild(menu);

  const tip = document.createElement('div');
  tip.className = 'lang-tooltip';
  document.body.appendChild(tip);

  let current = 'vi';
  try { current = localStorage.getItem('lpt_lang') || 'vi'; } catch (e) {}
  if (!LANGS.some(l => l.lang === current)) current = 'vi';

  const flagImg = (code) =>
    `<img class="lang-flag" src="https://flagcdn.com/w40/${code}.png" srcset="https://flagcdn.com/w80/${code}.png 2x" alt="" loading="lazy" draggable="false">`;

  function render() {
    menu.innerHTML = LANGS.map(l => `
      <button type="button" class="lang-item${l.lang === current ? ' active' : ''}" role="option"
              data-lang="${l.lang}" aria-selected="${l.lang === current}">
        ${flagImg(l.flag)}<span>${l.label}</span>
      </button>`).join('');
  }
  render();

  function open()  { menu.classList.add('open'); }
  function close() { menu.classList.remove('open'); hideTip(); }

  clone.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.contains('open') ? close() : open();
  });
  document.addEventListener('click', (e) => { if (!wrap.contains(e.target)) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  menu.addEventListener('scroll', hideTip);

  menu.addEventListener('click', (e) => {
    const item = e.target.closest('.lang-item');
    if (!item) return;
    current = item.dataset.lang;
    try { localStorage.setItem('lpt_lang', current); } catch (err) {}
    document.documentElement.lang = current;
    render();
    close();
    const l = LANGS.find(x => x.lang === current);
    if (typeof showToast === 'function') showToast('Đã chọn: ' + l.label);
    document.dispatchEvent(new CustomEvent('lptlangchange', { detail: { lang: current } }));
  });

  let tipTimer;
  function hideTip() { clearTimeout(tipTimer); tip.classList.remove('show'); }

  menu.addEventListener('mouseover', (e) => {
    const item = e.target.closest('.lang-item');
    if (!item || item.contains(e.relatedTarget)) return;
    hideTip();
    tipTimer = setTimeout(() => {
      const l = LANGS.find(x => x.lang === item.dataset.lang);
      if (!l) return;
      tip.textContent = l.country;
      tip.classList.add('show');
      const r = item.getBoundingClientRect();
      const tw = tip.offsetWidth, th = tip.offsetHeight;
      let left = r.left - tw - 10;
      if (left < 8) left = Math.min(r.right + 10, window.innerWidth - tw - 8);
      tip.style.left = left + 'px';
      tip.style.top  = (r.top + r.height / 2 - th / 2) + 'px';
    }, TOOLTIP_DELAY);
  });
  menu.addEventListener('mouseout', (e) => {
    const item = e.target.closest('.lang-item');
    if (item && !item.contains(e.relatedTarget)) hideTip();
  });
  menu.addEventListener('mouseleave', hideTip);
})();
