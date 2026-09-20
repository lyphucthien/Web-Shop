(function () {
  const SRC = 'vi';
  const LANGS = 'vi,en,zh-CN,zh-TW,ko,ja,th,km,lo,ru,fr,de';

  let lang = SRC;
  try { lang = localStorage.getItem('lpt_lang') || SRC; } catch (e) {}

  ['.lang-flags', '.lang-tooltip', '.brand-image', '.footer-logo'].forEach(sel => {
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

  setCookie(lang);

  if (lang !== SRC) {
    const holder = document.createElement('div');
    holder.id = 'google_translate_element';
    document.body.appendChild(holder);

    window.googleTranslateElementInit = function () {
      new google.translate.TranslateElement(
        { pageLanguage: SRC, includedLanguages: LANGS, autoDisplay: false },
        'google_translate_element'
      );
    };

    const s = document.createElement('script');
    s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.async = true;
    document.head.appendChild(s);
  }

  document.addEventListener('lptlangchange', (e) => {
    setCookie(e.detail.lang);
    setTimeout(() => location.reload(), 350);
  });
})();
