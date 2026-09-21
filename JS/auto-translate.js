(function () {
  const SRC = 'vi';
  const LANGS = 'vi,en,zh-CN,zh-TW,ko,ja,th,km,lo,ru,fr,de';

  let lang = SRC;
  try { lang = localStorage.getItem('lpt_lang') || SRC; } catch (e) {}

  ['.lang-flags', '.lang-tooltip'].forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.setAttribute('translate', 'no');
      el.classList.add('notranslate');
    });
  });

  function setCookie(l) {
    const host = location.hostname;
    const expire = 'Thu, 01 Jan 1970 00:00:00 GMT';
    if (l === SRC) {
      document.cookie = `googtrans=; expires=${expire}; path=/`;
      document.cookie = `googtrans=; expires=${expire}; path=/; domain=${host}`;
      document.cookie = `googtrans=; expires=${expire}; path=/; domain=.${host}`;
    } else {
      const v = `/${SRC}/${l}`;
      document.cookie = `googtrans=${v}; path=/`;
      document.cookie = `googtrans=${v}; path=/; domain=${host}`;
    }
  }

  function getCombo() {
    return document.querySelector('select.goog-te-combo');
  }

  function forceCombo(tries) {
    const c = getCombo();
    if (c) {
      if (c.value !== lang) {
        c.value = lang;
        c.dispatchEvent(new Event('change'));
      }
    } else if (tries > 0) {
      setTimeout(() => forceCombo(tries - 1), 300);
    }
  }

  function loadGoogle() {
    if (window.__gtLoading) return;
    window.__gtLoading = true;

    const holder = document.createElement('div');
    holder.id = 'google_translate_element';
    document.body.appendChild(holder);

    window.googleTranslateElementInit = function () {
      new google.translate.TranslateElement(
        { pageLanguage: SRC, includedLanguages: LANGS, autoDisplay: false },
        'google_translate_element'
      );
      setTimeout(() => forceCombo(20), 500);
    };

    const s = document.createElement('script');
    s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.async = true;
    s.onerror = () => {
      if (typeof showToast === 'function') {
        showToast('Không tải được Google Translate. Hãy kiểm tra mạng hoặc tắt tiện ích chặn quảng cáo.');
      }
    };
    document.head.appendChild(s);
  }

  setCookie(lang);
  if (lang !== SRC) loadGoogle();

  document.addEventListener('lptlangchange', (e) => {
    lang = e.detail.lang;
    setCookie(lang);

    const c = getCombo();
    if (lang !== SRC && c) {
      c.value = lang;
      c.dispatchEvent(new Event('change'));
    } else {
      setTimeout(() => location.reload(), 350);
    }
  });
})();