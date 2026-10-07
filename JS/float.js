(function () {
  if (window.__floatLoaded) return;
  window.__floatLoaded = true;

  const MESSENGER_URL = 'https://m.me/lyphucthien1803';

  const css = `
  .fb-wrap{position:fixed;right:20px;bottom:20px;z-index:9999;display:flex;flex-direction:column;gap:12px;align-items:center}
  .fb-btn{width:54px;height:54px;border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;position:relative;text-decoration:none;
    box-shadow:0 8px 22px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.35);transition:transform .25s cubic-bezier(.34,1.56,.64,1),box-shadow .25s}
  .fb-btn:hover{transform:translateY(-3px) scale(1.08);box-shadow:0 14px 28px rgba(0,0,0,.34),inset 0 1px 0 rgba(255,255,255,.35)}
  .fb-btn:active{transform:scale(.96)}
  .fb-btn svg{width:26px;height:26px;fill:#fff;filter:drop-shadow(0 1px 2px rgba(0,0,0,.25))}
  .fb-messenger{background:linear-gradient(135deg,#00c6ff 0%,#0078ff 52%,#a334fa 100%)}
  @media(max-width:600px){.fb-wrap{right:12px;bottom:12px}.fb-btn{width:48px;height:48px}}
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const root = document.createElement('div');
  root.innerHTML = `
    <div class="fb-wrap">
      <a class="fb-btn fb-messenger" href="${MESSENGER_URL}" target="_blank" rel="noopener" aria-label="Messenger" title="Chat Messenger">
        <svg viewBox="0 0 24 24"><path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.14.26.35.27.57l.05 1.78c.02.57.6.94 1.12.71l1.99-.88c.17-.07.36-.09.53-.04.91.25 1.87.38 2.9.38 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm6 7.46l-2.94 4.66c-.47.74-1.47.93-2.17.4l-2.34-1.75a.6.6 0 0 0-.72 0l-3.16 2.4c-.42.32-.97-.19-.69-.64l2.94-4.66c.47-.74 1.47-.93 2.17-.4l2.34 1.75a.6.6 0 0 0 .72 0l3.16-2.4c.42-.32.97.19.69.64z"/></svg>
      </a>
    </div>
  `;
  document.body.appendChild(root);

})();
