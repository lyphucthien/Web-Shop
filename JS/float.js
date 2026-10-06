(function () {
  if (window.__floatLoaded) return;
  window.__floatLoaded = true;

  const MESSENGER_URL = 'https://m.me/lyphucthien1803';

  const css = `
  .fb-wrap{position:fixed;right:20px;bottom:20px;z-index:9999;display:flex;flex-direction:column;gap:12px;align-items:flex-end}
  .fb-btn{width:52px;height:52px;border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;
    box-shadow:0 4px 14px rgba(0,0,0,.25);transition:transform .2s,box-shadow .2s;text-decoration:none;position:relative}
  .fb-btn:hover{transform:translateY(-3px) scale(1.06);box-shadow:0 8px 20px rgba(0,0,0,.3)}
  .fb-btn svg{width:26px;height:26px;fill:#fff}
  .fb-messenger{background:linear-gradient(135deg,#00b2ff,#006aff 60%,#a033ff)}
  .fb-music{background:linear-gradient(135deg,#4da6e8,#2b7fd1)}
  .fb-music.playing svg{animation:fb-spin 3s linear infinite}
  .fb-music.playing::after{content:"";position:absolute;inset:-4px;border-radius:50%;border:2px solid #4da6e8;opacity:.6;animation:fb-pulse 1.6s ease-out infinite}
  @keyframes fb-spin{to{transform:rotate(360deg)}}
  @keyframes fb-pulse{0%{transform:scale(1);opacity:.6}100%{transform:scale(1.35);opacity:0}}

  /* Panel nhạc: trượt ngang sang trái */
  .fb-panel{position:fixed;right:84px;bottom:20px;width:300px;max-width:calc(100vw - 110px);background:#fff;border-radius:14px;
    box-shadow:0 10px 30px rgba(0,0,0,.25);padding:14px;font-family:Inter,system-ui,sans-serif;color:#222;z-index:9998;
    transform:translateX(40px);opacity:0;pointer-events:none;transition:transform .3s ease,opacity .3s ease}
  .fb-panel.open{transform:translateX(0);opacity:1;pointer-events:auto}
  .fb-panel h4{margin:0 0 10px;font-size:14px;display:flex;justify-content:space-between;align-items:center}
  .fb-panel h4 span{cursor:pointer;font-size:18px;line-height:1;color:#888}
  .fb-row{display:flex;gap:6px}
  .fb-panel input[type=text]{flex:1;min-width:0;border:1px solid #d5d9de;border-radius:8px;padding:8px 10px;font-size:13px;outline:none}
  .fb-panel input[type=text]:focus{border-color:#4da6e8}
  .fb-go{background:#4da6e8;color:#fff;border:none;border-radius:8px;padding:0 12px;font-weight:600;font-size:13px;cursor:pointer}
  .fb-go:hover{background:#2b7fd1}
  .fb-ctrl{display:flex;align-items:center;gap:10px;margin-top:10px}
  .fb-toggle{background:#eef3f8;border:none;border-radius:8px;padding:6px 12px;font-size:13px;font-weight:600;cursor:pointer}
  .fb-ctrl input[type=range]{flex:1}
  .fb-msg{margin-top:8px;font-size:12px;color:#777;min-height:16px}
  .fb-msg.err{color:#d93025}
  @media(max-width:600px){.fb-wrap{right:12px;bottom:12px}.fb-btn{width:46px;height:46px}.fb-panel{right:70px;bottom:12px}}
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
      <button class="fb-btn fb-music" id="fbMusicBtn" aria-label="Music" title="Music">
        <svg viewBox="0 0 24 24"><path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z"/></svg>
      </button>
    </div>

    <div class="fb-panel" id="fbPanel">
      <h4>🎵 Phát nhạc <span id="fbClose">×</span></h4>
      <div class="fb-row">
        <input type="text" id="fbUrl" placeholder="Dán link YouTube hoặc .mp3...">
        <button class="fb-go" id="fbGo">Phát</button>
      </div>
      <div class="fb-ctrl">
        <button class="fb-toggle" id="fbToggle">⏸ Dừng</button>
        <input type="range" id="fbVol" min="0" max="100" value="40">
      </div>
      <div class="fb-msg" id="fbMsg">Hỗ trợ link YouTube và link nhạc trực tiếp (.mp3, .ogg, .wav, .m4a)</div>
    </div>

    <audio id="fbAudio" loop preload="none"></audio>
    <div style="position:fixed;left:-9999px;top:0;width:200px;height:200px;overflow:hidden"><div id="fbYT"></div></div>
  `;
  document.body.appendChild(root);

  const $ = (id) => document.getElementById(id);
  const btn = $('fbMusicBtn'), panel = $('fbPanel'), input = $('fbUrl'),
        go = $('fbGo'), toggle = $('fbToggle'), vol = $('fbVol'),
        msg = $('fbMsg'), audio = $('fbAudio');

  let mode = null;
  let yt = null;
  let volume = 0.4;
  audio.volume = volume;

  function say(text, err) { msg.textContent = text; msg.className = 'fb-msg' + (err ? ' err' : ''); }
  function setPlaying(on) {
    btn.classList.toggle('playing', on);
    toggle.textContent = on ? '⏸ Dừng' : '▶ Phát';
  }

  btn.addEventListener('click', () => panel.classList.toggle('open'));
  $('fbClose').addEventListener('click', () => panel.classList.remove('open'));

  function ytId(url) {
    const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/);
    return m ? m[1] : null;
  }

  function loadYTApi(cb) {
    if (window.YT && YT.Player) return cb();
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { if (prev) prev(); cb(); };
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(s);
  }

  function stopAll() {
    audio.pause();
    if (yt && yt.pauseVideo) yt.pauseVideo();
    setPlaying(false);
  }

  function play(url) {
    url = url.trim();
    if (!/^https?:\/\//i.test(url)) return say('Link phải bắt đầu bằng http:// hoặc https://', true);
    stopAll();
    const id = ytId(url);

    if (id) {
      mode = 'yt';
      say('Đang tải video...');
      loadYTApi(() => {
        if (yt && yt.loadVideoById) {
          yt.loadVideoById(id);
        } else {
          yt = new YT.Player('fbYT', {
            width: 200, height: 200, videoId: id,
            playerVars: { autoplay: 1, playsinline: 1 },
            events: {
              onReady: (e) => { e.target.setVolume(volume * 100); e.target.playVideo(); },
              onStateChange: (e) => {
                if (e.data === 1) { setPlaying(true); say('Đang phát'); }
                if (e.data === 2) setPlaying(false);
                if (e.data === 0) { e.target.seekTo(0); e.target.playVideo(); } // lặp lại
              },
              onError: () => say('Video này không phát được (bị chặn nhúng hoặc link sai)', true)
            }
          });
        }
      });
    } else {
      mode = 'audio';
      audio.src = url;
      audio.play()
        .then(() => { setPlaying(true); say('Đang phát'); })
        .catch(() => say('Không phát được link này, kiểm tra lại URL', true));
    }
    try { localStorage.setItem('fbMusicUrl', url); } catch (e) {}
  }

  go.addEventListener('click', () => play(input.value));
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') play(input.value); });

  toggle.addEventListener('click', () => {
    if (mode === 'audio') {
      if (audio.paused) audio.play().then(() => setPlaying(true)); else { audio.pause(); setPlaying(false); }
    } else if (mode === 'yt' && yt) {
      if (yt.getPlayerState() === 1) yt.pauseVideo(); else yt.playVideo();
    } else if (input.value.trim()) {
      play(input.value);
    }
  });

  audio.addEventListener('pause', () => { if (mode === 'audio') setPlaying(false); });
  audio.addEventListener('play', () => { if (mode === 'audio') setPlaying(true); });

  vol.addEventListener('input', () => {
    volume = vol.value / 100;
    audio.volume = volume;
    if (yt && yt.setVolume) yt.setVolume(vol.value);
  });

  try { const last = localStorage.getItem('fbMusicUrl'); if (last) input.value = last; } catch (e) {}
})();
