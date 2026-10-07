(function () {
  if (window.__floatLoaded) return;
  window.__floatLoaded = true;

  const MESSENGER_URL = 'https://m.me/lyphucthien1803';
  const HINT = 'Hỗ trợ: YouTube, SoundCloud, Spotify và link nhạc trực tiếp (.mp3, .ogg, .wav, .m4a)';

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

  /* ===== Panel ===== */
  .fb-panel{--fb-bg:none;position:fixed;right:84px;bottom:20px;width:320px;max-width:calc(100vw - 110px);z-index:9998;overflow:hidden;
    background:var(--panel,#fff);color:var(--text,#222);border:1px solid var(--line,#e5e9ee);border-radius:14px;
    box-shadow:0 10px 30px rgba(0,0,0,.25);padding:14px;font-family:Inter,system-ui,sans-serif;
    transform:translateX(40px);opacity:0;visibility:hidden;pointer-events:none;
    transition:transform .3s ease,opacity .3s ease,visibility .3s,color .4s,border-color .4s}
  .fb-panel.open{transform:translateX(0);opacity:1;visibility:visible;pointer-events:auto}
  .fb-panel>*{position:relative;z-index:1}

  .fb-panel::before{content:"";position:absolute;inset:-24px;z-index:0;opacity:0;transition:opacity .6s;pointer-events:none;
    background:linear-gradient(rgba(10,15,25,.45),rgba(10,15,25,.75)),var(--fb-bg) center/cover no-repeat;
    filter:blur(16px) saturate(1.25)}
  .fb-panel.has-art::before{opacity:1}
  .fb-panel.has-art{color:#fff;border-color:rgba(255,255,255,.2)}
  .fb-panel.has-art .fb-sub,.fb-panel.has-art .fb-msg,.fb-panel.has-art h4 span{color:rgba(255,255,255,.78)}
  .fb-panel.has-art .fb-msg.err{color:#ff8a80}
  .fb-panel.has-art input[type=text]{background:rgba(255,255,255,.14);color:#fff;border-color:rgba(255,255,255,.3)}
  .fb-panel.has-art input[type=text]::placeholder{color:rgba(255,255,255,.65)}
  .fb-panel.has-art .fb-toggle{background:rgba(255,255,255,.2);color:#fff}
  .fb-panel.has-art .fb-change{border-color:rgba(255,255,255,.4);color:#fff}
  .fb-panel.has-art .fb-back{color:#9bd0ff}

  .fb-panel h4{margin:0 0 10px;font-size:14px;display:flex;justify-content:space-between;align-items:center}
  .fb-panel h4 span{cursor:pointer;font-size:20px;line-height:1;color:var(--muted,#888)}
  .fb-panel h4 span:hover{color:inherit}

  .fb-view{display:none}
  .fb-view.show{display:block;animation:fb-in .25s ease}
  @keyframes fb-in{from{opacity:0;transform:translateX(18px)}to{opacity:1;transform:none}}

  .fb-row{display:flex;gap:6px}
  .fb-panel input[type=text]{flex:1;min-width:0;border:1px solid var(--line,#d5d9de);background:var(--bg,#fff);color:var(--text,#222);
    border-radius:8px;padding:9px 10px;font-size:13px;outline:none}
  .fb-panel input[type=text]:focus{border-color:#4da6e8}
  .fb-go{background:#4da6e8;color:#fff;border:none;border-radius:8px;padding:0 14px;font-weight:700;font-size:13px;cursor:pointer}
  .fb-go:hover{background:#2b7fd1}
  .fb-back{margin-top:10px;background:none;border:none;color:#4da6e8;font-size:12px;font-weight:600;cursor:pointer;padding:0;display:none}
  .fb-back.show{display:inline-block}

  .fb-now{display:flex;gap:10px;align-items:center}
  .fb-thumb{width:72px;height:72px;border-radius:10px;flex:none;background:linear-gradient(135deg,#4da6e8,#2b7fd1) center/cover no-repeat;
    display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,.3)}
  .fb-thumb svg{width:30px;height:30px;fill:#fff}
  .fb-thumb.has-img svg{display:none}
  .fb-info{min-width:0;flex:1}
  .fb-title{font-weight:700;font-size:13px;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;word-break:break-word}
  .fb-sub{font-size:11px;color:var(--muted,#777);margin-top:3px}
  .fb-embed{margin-top:12px}
  .fb-embed:empty{display:none}
  .fb-embed iframe{display:block;width:100%;border:0;border-radius:12px}
  .fb-ctrl{display:flex;align-items:center;gap:10px;margin-top:12px}
  .fb-view.sp .fb-ctrl{display:none}
  .fb-toggle{background:var(--green-soft,#eef3f8);color:var(--text,#222);border:none;border-radius:8px;padding:7px 12px;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap}
  .fb-ctrl input[type=range]{flex:1;min-width:0;accent-color:#4da6e8}
  .fb-change{margin-top:10px;width:100%;background:none;border:1px dashed var(--line,#cfd6dd);color:var(--text,#222);border-radius:8px;padding:7px;font-size:12px;font-weight:600;cursor:pointer}
  .fb-change:hover{border-color:#4da6e8;color:#4da6e8}

  .fb-msg{margin-top:8px;font-size:12px;color:var(--muted,#777);min-height:16px;line-height:1.4}
  .fb-msg.err{color:#d93025}
  @media(max-width:600px){.fb-wrap{right:12px;bottom:12px}.fb-btn{width:46px;height:46px}.fb-panel{right:70px;bottom:12px}}
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // ---------- HTML ----------
  const NOTE = '<svg viewBox="0 0 24 24"><path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z"/></svg>';
  const root = document.createElement('div');
  root.innerHTML = `
    <div class="fb-wrap">
      <a class="fb-btn fb-messenger" href="${MESSENGER_URL}" target="_blank" rel="noopener" aria-label="Messenger" title="Chat Messenger">
        <svg viewBox="0 0 24 24"><path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.14.26.35.27.57l.05 1.78c.02.57.6.94 1.12.71l1.99-.88c.17-.07.36-.09.53-.04.91.25 1.87.38 2.9.38 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm6 7.46l-2.94 4.66c-.47.74-1.47.93-2.17.4l-2.34-1.75a.6.6 0 0 0-.72 0l-3.16 2.4c-.42.32-.97-.19-.69-.64l2.94-4.66c.47-.74 1.47-.93 2.17-.4l2.34 1.75a.6.6 0 0 0 .72 0l3.16-2.4c.42-.32.97.19.69.64z"/></svg>
      </a>
      <button class="fb-btn fb-music" id="fbMusicBtn" aria-label="Music" title="Music">${NOTE}</button>
    </div>

    <div class="fb-panel" id="fbPanel">
      <h4><b>🎵 Phát nhạc</b><span id="fbClose" title="Đóng">×</span></h4>

      <div class="fb-view show" id="fbViewInput">
        <div class="fb-row">
          <input type="text" id="fbUrl" placeholder="Dán link YouTube, SoundCloud, Spotify, .mp3..." autocomplete="off">
          <button class="fb-go" id="fbGo">Enter</button>
        </div>
        <button class="fb-back" id="fbBack">← Quay lại bài đang phát</button>
      </div>

      <div class="fb-view" id="fbViewPlayer">
        <div class="fb-now">
          <div class="fb-thumb" id="fbThumb">${NOTE}</div>
          <div class="fb-info">
            <div class="fb-title" id="fbTitle">Đang tải...</div>
            <div class="fb-sub" id="fbSub">YouTube</div>
          </div>
        </div>
        <div class="fb-embed" id="fbEmbed"></div>
        <div class="fb-ctrl">
          <button class="fb-toggle" id="fbToggle">⏸ Dừng</button>
          <input type="range" id="fbVol" min="0" max="100" value="40" aria-label="Âm lượng">
        </div>
        <button class="fb-change" id="fbChange">Đổi bài khác</button>
      </div>

      <div class="fb-msg" id="fbMsg">${HINT}</div>
    </div>

    <audio id="fbAudio" loop preload="none"></audio>
    <div style="position:fixed;right:0;bottom:0;width:200px;height:200px;overflow:hidden;opacity:0;pointer-events:none;z-index:-1">
      <div id="fbYT"></div>
      <div id="fbSC"></div>
    </div>
  `;
  document.body.appendChild(root);

  // ---------- LOGIC ----------
  const $ = (id) => document.getElementById(id);
  const btn = $('fbMusicBtn'), panel = $('fbPanel'), input = $('fbUrl'),
        go = $('fbGo'), toggle = $('fbToggle'), vol = $('fbVol'),
        msg = $('fbMsg'), audio = $('fbAudio'),
        viewInput = $('fbViewInput'), viewPlayer = $('fbViewPlayer'),
        backBtn = $('fbBack'), changeBtn = $('fbChange'),
        thumb = $('fbThumb'), titleEl = $('fbTitle'), subEl = $('fbSub'),
        embed = $('fbEmbed');

  let mode = null;
  let session = 0;
  let yt = null, ytReady = false, wantId = null;
  let sc = null, scReady = false;
  let volume = 0.4;
  audio.volume = volume;

  function say(text, err) { msg.textContent = text; msg.className = 'fb-msg' + (err ? ' err' : ''); }
  function setPlaying(on) {
    btn.classList.toggle('playing', on);
    toggle.textContent = on ? '⏸ Dừng' : '▶ Phát';
  }

  function applyCover(url) {
    panel.style.setProperty('--fb-bg', 'url("' + url + '")');
    panel.classList.add('has-art');
    thumb.style.backgroundImage = 'url("' + url + '")';
    thumb.classList.add('has-img');
  }
  function clearCover() {
    panel.classList.remove('has-art');
    panel.style.removeProperty('--fb-bg');
    thumb.style.backgroundImage = '';
    thumb.classList.remove('has-img');
  }

  function setCover(urls, token) {
    const list = urls.filter(Boolean);
    (function next(i) {
      if (i >= list.length) return;
      const im = new Image();
      im.onload = () => {
        if (token !== session) return;
        if (im.naturalWidth < 200) return next(i + 1);
        applyCover(list[i]);
      };
      im.onerror = () => next(i + 1);
      im.src = list[i];
    })(0);
  }

  function showView(name) {
    viewInput.classList.toggle('show', name === 'input');
    viewPlayer.classList.toggle('show', name === 'player');
    if (name === 'input') {
      backBtn.classList.toggle('show', !!mode);
      input.value = '';
      setTimeout(() => input.focus(), 50);
      say(HINT);
    }
  }

  btn.addEventListener('click', () => panel.classList.toggle('open'));
  $('fbClose').addEventListener('click', () => panel.classList.remove('open'));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') panel.classList.remove('open'); });
  changeBtn.addEventListener('click', () => showView('input'));
  backBtn.addEventListener('click', () => showView('player'));

  function ytId(url) {
    const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/);
    return m ? m[1] : null;
  }
  const isSC = (url) => /^https?:\/\/(?:www\.|m\.|on\.)?(?:soundcloud\.com|snd\.sc)\//i.test(url);
  function spInfo(url) {
    const m = url.match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?(track|album|playlist|episode|show|artist)\/([A-Za-z0-9]+)/);
    return m ? { type: m[1], id: m[2] } : null;
  }

  function loadScript(id, src, ready, cb) {
    if (ready()) return cb();
    let s = $(id);
    if (!s) { s = document.createElement('script'); s.id = id; s.src = src; document.head.appendChild(s); }
    s.addEventListener('load', cb);
  }
  function loadYTApi(cb) {
    if (window.YT && YT.Player) return cb();
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { if (prev) prev(); cb(); };
    if (!$('fbYTapi')) {
      const s = document.createElement('script');
      s.id = 'fbYTapi';
      s.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(s);
    }
  }
  function loadSCApi(cb) {
    loadScript('fbSCapi', 'https://w.soundcloud.com/player/api.js', () => window.SC && SC.Widget, cb);
  }

  function stopAll() {
    audio.pause();
    if (yt && ytReady && yt.pauseVideo) yt.pauseVideo();
    if (sc && scReady) sc.pause();
    embed.innerHTML = '';
    setPlaying(false);
  }

  // ===== YouTube =====
  function playYT(id, token) {
    subEl.textContent = 'YouTube';
    titleEl.textContent = 'Đang tải tên bài...';
    setCover([
      'https://img.youtube.com/vi/' + id + '/maxresdefault.jpg',
      'https://img.youtube.com/vi/' + id + '/hqdefault.jpg'
    ], token);
    fetch('https://www.youtube.com/oembed?format=json&url=' + encodeURIComponent('https://www.youtube.com/watch?v=' + id))
      .then((r) => r.json())
      .then((d) => { if (token === session && d.title) { titleEl.textContent = d.title; if (d.author_name) subEl.textContent = d.author_name + ' · YouTube'; } })
      .catch(() => { if (token === session) titleEl.textContent = 'Video YouTube'; });

    loadYTApi(() => {
      if (token !== session) return;
      if (yt && ytReady) {
        yt.loadVideoById(id);
      } else if (!yt) {
        yt = new YT.Player('fbYT', {
          width: 200, height: 200,
          playerVars: { autoplay: 1, playsinline: 1 },
          events: {
            onReady: (e) => { ytReady = true; e.target.setVolume(volume * 100); if (mode === 'yt') e.target.loadVideoById(wantId); },
            onStateChange: (e) => {
              if (mode !== 'yt') return;
              if (e.data === 1) { setPlaying(true); say('Đang phát'); }
              else if (e.data === 2) setPlaying(false);
              else if (e.data === 0) { e.target.seekTo(0); e.target.playVideo(); }
            },
            onError: () => { if (mode === 'yt') { setPlaying(false); say('Video này không phát được (bị chặn nhúng hoặc link sai). Bấm "Đổi bài khác".', true); } }
          }
        });
      }
    });
  }

  // ===== SoundCloud =====
  function scSound(token) {
    if (!sc) return;
    sc.getCurrentSound((s) => {
      if (!s || token !== session || mode !== 'sc') return;
      titleEl.textContent = s.title || 'Bài SoundCloud';
      subEl.textContent = (s.user && s.user.username ? s.user.username + ' · ' : '') + 'SoundCloud';
      const big = (u) => u ? u.replace('-large', '-t500x500') : null;
      setCover([big(s.artwork_url), big(s.user && s.user.avatar_url)], token);
    });
  }
  function playSC(url, token) {
    subEl.textContent = 'SoundCloud';
    titleEl.textContent = 'Đang tải tên bài...';
    loadSCApi(() => {
      if (token !== session) return;
      if (sc && scReady) {
        sc.load(url, { auto_play: true, callback: () => { scSound(token); sc.setVolume(volume * 100); sc.play(); } });
        return;
      }
      if (sc) return;
      const f = document.createElement('iframe');
      f.width = 200; f.height = 200; f.allow = 'autoplay';
      f.src = 'https://w.soundcloud.com/player/?url=' + encodeURIComponent(url) +
              '&auto_play=true&hide_related=true&show_comments=false&visual=false';
      $('fbSC').appendChild(f);
      sc = SC.Widget(f);
      sc.bind(SC.Widget.Events.READY, () => {
        scReady = true;
        sc.setVolume(volume * 100);
        if (mode === 'sc') { scSound(session); sc.play(); }
      });
      sc.bind(SC.Widget.Events.PLAY, () => { if (mode === 'sc') { setPlaying(true); say('Đang phát'); } });
      sc.bind(SC.Widget.Events.PAUSE, () => { if (mode === 'sc') setPlaying(false); });
      sc.bind(SC.Widget.Events.FINISH, () => { if (mode === 'sc') { sc.seekTo(0); sc.play(); } });
      sc.bind(SC.Widget.Events.ERROR, () => { if (mode === 'sc') { setPlaying(false); say('Không phát được bài SoundCloud này (riêng tư hoặc bị chặn). Bấm "Đổi bài khác".', true); } });
    });
  }

  // ===== Spotify =====
  function playSP(info, url, token) {
    subEl.textContent = 'Spotify';
    titleEl.textContent = 'Đang tải tên bài...';
    const h = (info.type === 'track' || info.type === 'episode') ? 152 : 232;
    embed.innerHTML = '<iframe src="https://open.spotify.com/embed/' + info.type + '/' + info.id + '?theme=0" height="' + h +
      '" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>';
    say('Bấm ▶ trong khung Spotify để nghe (Spotify không cho tự phát; chưa đăng nhập thì chỉ nghe thử 30 giây).');
    fetch('https://open.spotify.com/oembed?url=' + encodeURIComponent(url))
      .then((r) => r.json())
      .then((d) => {
        if (token !== session) return;
        if (d.title) titleEl.textContent = d.title;
        if (d.thumbnail_url) setCover([d.thumbnail_url], token);
      })
      .catch(() => { if (token === session) titleEl.textContent = 'Spotify'; });
  }

  // ===== Link nhạc trực tiếp =====
  function playAudio(url) {
    let name = url;
    try { name = decodeURIComponent(new URL(url).pathname.split('/').filter(Boolean).pop() || url); } catch (e) {}
    titleEl.textContent = name;
    subEl.textContent = 'Link nhạc trực tiếp';
    audio.src = url;
    audio.play()
      .then(() => { setPlaying(true); say('Đang phát'); })
      .catch(() => { setPlaying(false); say('Không phát được link này. Chỉ hỗ trợ YouTube, SoundCloud, Spotify và link nhạc trực tiếp. Bấm "Đổi bài khác".', true); });
  }

  function play(url) {
    url = (url || '').trim();
    if (!/^https?:\/\//i.test(url)) return say('Link phải bắt đầu bằng https://', true);

    stopAll();
    clearCover();
    const token = ++session;
    const id = ytId(url), spot = spInfo(url);

    if (id) mode = 'yt';
    else if (isSC(url)) mode = 'sc';
    else if (spot) mode = 'sp';
    else mode = 'audio';

    wantId = id;
    viewPlayer.classList.toggle('sp', mode === 'sp');
    showView('player');
    say('Đang tải...');

    if (mode === 'yt') playYT(id, token);
    else if (mode === 'sc') playSC(url, token);
    else if (mode === 'sp') playSP(spot, url, token);
    else playAudio(url);
  }

  go.addEventListener('click', () => play(input.value));
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); play(input.value); } });

  toggle.addEventListener('click', () => {
    if (mode === 'audio') {
      if (audio.paused) audio.play().then(() => setPlaying(true)); else { audio.pause(); setPlaying(false); }
    } else if (mode === 'yt' && yt && ytReady) {
      if (yt.getPlayerState() === 1) yt.pauseVideo(); else yt.playVideo();
    } else if (mode === 'sc' && sc && scReady) {
      sc.toggle();
    }
  });

  audio.addEventListener('pause', () => { if (mode === 'audio') setPlaying(false); });
  audio.addEventListener('play', () => { if (mode === 'audio') setPlaying(true); });

  vol.addEventListener('input', () => {
    volume = vol.value / 100;
    audio.volume = volume;
    if (yt && ytReady && yt.setVolume) yt.setVolume(vol.value);
    if (sc && scReady) sc.setVolume(vol.value);
  });
})();
