/* ===== LANGUAGE MENU — cờ tròn quốc gia + tooltip tên nước theo ngôn ngữ đã chọn ===== */
(function () {
  const TOOLTIP_DELAY = 350; // ms giữ chuột trước khi hiện tên nước (đặt 0 = hiện ngay)

  // [mã nước, mã ngôn ngữ]
  const COUNTRIES = [
    ['vn','vi'],['us','en'],['gb','en'],['cn','zh-CN'],['tw','zh-TW'],['hk','zh-HK'],['kr','ko'],['jp','ja'],
    ['th','th'],['kh','km'],['la','lo'],['mm','my'],['ru','ru'],['fr','fr'],['de','de'],['es','es'],
    ['pt','pt'],['br','pt-BR'],['it','it'],['id','id'],['my','ms'],['sg','en'],['ph','fil'],['in','hi'],
    ['pk','ur'],['bd','bn'],['lk','si'],['np','ne'],['sa','ar'],['ae','ar'],['eg','ar'],['tr','tr'],
    ['ir','fa'],['il','he'],['ua','uk'],['pl','pl'],['nl','nl'],['be','nl'],['se','sv'],['no','nb'],
    ['dk','da'],['fi','fi'],['gr','el'],['cz','cs'],['sk','sk'],['hu','hu'],['ro','ro'],['bg','bg'],
    ['rs','sr'],['hr','hr'],['si','sl'],['at','de'],['ch','de'],['ie','en'],['au','en'],['nz','en'],
    ['ca','en'],['mx','es'],['ar','es'],['cl','es'],['co','es'],['pe','es'],['ve','es'],['cu','es'],
    ['za','en'],['ng','en'],['ke','sw'],['et','am'],['tz','sw'],['gh','en'],['ma','ar'],['dz','ar'],
    ['tn','ar'],['kz','kk'],['uz','uz'],['mn','mn'],['ge','ka'],['am','hy'],['az','az'],['lt','lt'],
    ['lv','lv'],['ee','et'],['is','is'],['al','sq'],['mk','mk'],['ba','bs'],['by','be'],['md','ro'],
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

  /* Tên nước theo ngôn ngữ đang chọn (trình duyệt tự dịch) */
  function countryName(cc) {
    try {
      return new Intl.DisplayNames([currentLang], { type: 'region' }).of(cc.toUpperCase());
    } catch (e) {
      return cc.toUpperCase();
    }
  }

  /* Xếp hình phễu: hàng trên đông, hàng dưới ít dần */
  function render() {
    const mobile = window.innerWidth < 700;
    let count = mobile ? 12 : 18;
    const step = mobile ? 1 : 2;
    let i = 0, html = '', row = 0;
    while (i < COUNTRIES.length && count > 0) {
      let rowHtml = '';
      for (let k = 0; k < count && i < COUNTRIES.length; k++, i++) {
        const [cc, lang] = COUNTRIES[i];
        const jx = ((i * 37) % 7) - 3, jy = ((i * 53) % 7) - 3;      // lệch nhẹ cho tự nhiên
        rowHtml += `<button type="button" class="lang-flag-btn${cc === currentCC ? ' active' : ''}"
          data-cc="${cc}" data-lang="${lang}" aria-label="${cc.toUpperCase()}"
          style="--jx:${jx}px;--jy:${jy}px;--d:${i * 8}ms">
          <img src="${FLAG_URL(cc)}" alt="" draggable="false"></button>`;
      }
      html += `<div class="lang-row">${rowHtml}</div>`;
      count -= step; row++;
    }
    menu.innerHTML = html;
  }

  function open() {
    render();
    const r = trigger.getBoundingClientRect();
    menu.style.top = (r.bottom + 10) + 'px';
    requestAnimationFrame(() => menu.classList.add('open'));
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

  /* Chọn quốc gia -> đổi ngôn ngữ */
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
    if (typeof showToast === 'function') showToast('Đã chọn: ' + countryName(currentCC));
    document.dispatchEvent(new CustomEvent('lptlangchange', { detail: { lang: currentLang, cc: currentCC } }));
  });

  /* Tooltip tên nước */
  let tipTimer;
  function hideTip() { clearTimeout(tipTimer); tip.classList.remove('show'); }

  function showTip(b) {
    tip.textContent = countryName(b.dataset.cc);
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
