(function () {
  if (window.__floatLoaded) return;
  window.__floatLoaded = true;

  const MESSENGER_URL = 'https://m.me/lyphucthien1803';
  const HIST_KEY = 'MusicHistory';
  const HIST_MAX = 5;

  const css = `
  .fb-wrap{position:fixed;right:20px;bottom:20px;z-index:9999;display:flex;flex-direction:column;gap:12px;align-items:center}
  .fb-btn{width:54px;height:54px;border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;position:relative;text-decoration:none;
    box-shadow:0 8px 22px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.35);transition:transform .25s cubic-bezier(.34,1.56,.64,1),box-shadow .25s}
  .fb-btn:hover{transform:translateY(-3px) scale(1.08);box-shadow:0 14px 28px rgba(0,0,0,.34),inset 0 1px 0 rgba(255,255,255,.35)}
  .fb-btn:active{transform:scale(.96)}
  .fb-btn svg{width:26px;height:26px;fill:#fff;filter:drop-shadow(0 1px 2px rgba(0,0,0,.25))}
  .fb-messenger{background:linear-gradient(135deg,#00c6ff 0%,#0078ff 52%,#a334fa 100%)}
  .fb-music{background:linear-gradient(135deg,#59b4f0,#2b7fd1)}
  .fb-beq{display:none;align-items:flex-end;gap:3px;height:20px}
  .fb-beq u{width:4px;height:5px;border-radius:2px;background:#fff;display:block;box-shadow:0 1px 3px rgba(0,0,0,.25)}
  .fb-music.playing>svg{display:none}
  .fb-music.playing .fb-beq{display:flex}
  .fb-music.playing .fb-beq u{animation:fb-eq2 .85s ease-in-out infinite}
  .fb-beq u:nth-child(2){animation-delay:.2s!important}.fb-beq u:nth-child(3){animation-delay:.4s!important}.fb-beq u:nth-child(4){animation-delay:.1s!important}
  @keyframes fb-eq2{0%,100%{height:5px}50%{height:20px}}
  .fb-music.playing::before,.fb-music.playing::after{content:"";position:absolute;inset:-4px;border-radius:50%;border:2px solid #59b4f0;opacity:.7;animation:fb-pulse 2s ease-out infinite;pointer-events:none}
  .fb-music.playing::after{animation-delay:1s}
  @keyframes fb-pulse{0%{transform:scale(1);opacity:.7}100%{transform:scale(1.5);opacity:0}}

  .fb-panel{--fb-bg:none;--fb-ac:#4da6e8;position:fixed;right:88px;bottom:20px;width:340px;max-width:calc(100vw - 112px);z-index:9998;overflow:hidden;
    background:var(--panel,#fff);color:var(--text,#1f2937);border:1px solid var(--line,#e5e9ee);border-radius:22px;
    box-shadow:0 24px 60px rgba(0,0,0,.32),0 4px 14px rgba(0,0,0,.12);padding:16px;font-family:Inter,system-ui,sans-serif;
    transform-origin:100% 100%;transform:translateX(46px) scale(.94);opacity:0;visibility:hidden;pointer-events:none;
    transition:transform .42s cubic-bezier(.22,1,.36,1),opacity .28s,visibility .42s,color .5s,border-color .5s}
  .fb-panel.open{transform:none;opacity:1;visibility:visible;pointer-events:auto}
  .fb-panel>*{position:relative;z-index:1}

  .fb-panel::before{content:"";position:absolute;inset:-30px;z-index:0;opacity:0;transition:opacity .8s;pointer-events:none;
    background:linear-gradient(rgba(8,12,22,.38),rgba(8,12,22,.78)),var(--fb-bg) center/cover no-repeat;filter:blur(20px) saturate(1.35)}
  .fb-panel.has-art::before{opacity:1}
  .fb-panel.has-art{color:#fff;border-color:rgba(255,255,255,.22);--fb-ac:#fff}
  .fb-panel.has-art .fb-sub,.fb-panel.has-art .fb-msg,.fb-panel.has-art .fb-time,.fb-panel.has-art .fb-hlabel,.fb-panel.has-art .fb-x,.fb-panel.has-art .fb-head small{color:rgba(255,255,255,.72)}
  .fb-panel.has-art .fb-msg.err{color:#ff9b93}

  .fb-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
  .fb-head b{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:800;letter-spacing:.2px}
  .fb-head b i{width:26px;height:26px;border-radius:8px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#59b4f0,#2b7fd1)}
  .fb-head b i svg{width:14px;height:14px;fill:#fff}
  .fb-x{width:28px;height:28px;border:none;border-radius:50%;background:rgba(127,127,127,.14);color:var(--muted,#6b7280);font-size:18px;line-height:1;cursor:pointer;transition:background .2s,transform .2s}
  .fb-x:hover{background:rgba(127,127,127,.28);transform:rotate(90deg)}

  .fb-view{display:none}
  .fb-view.show{display:block;animation:fb-in .38s cubic-bezier(.22,1,.36,1)}
  @keyframes fb-in{from{opacity:0;transform:translateX(22px)}to{opacity:1;transform:none}}

  .fb-field{display:flex;align-items:center;gap:8px;background:var(--bg,#f1f5f9);border:1px solid var(--line,#e2e8f0);border-radius:999px;padding:5px 5px 5px 14px;transition:border-color .2s,box-shadow .2s}
  .fb-field:focus-within{border-color:#4da6e8;box-shadow:0 0 0 3px rgba(77,166,232,.22)}
  .fb-field>svg{width:16px;height:16px;flex:none;stroke:var(--muted,#6b7280);fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
  .fb-field input{flex:1;min-width:0;border:none;background:none;outline:none;color:inherit;font:500 13px Inter,system-ui,sans-serif;padding:7px 0}
  .fb-field input::placeholder{color:var(--muted,#94a3b8)}
  .fb-go{display:flex;align-items:center;gap:6px;border:none;border-radius:999px;padding:9px 15px;cursor:pointer;color:#fff;font:800 12px Inter,system-ui,sans-serif;
    background:linear-gradient(135deg,#59b4f0,#2b7fd1);box-shadow:0 4px 12px rgba(43,127,209,.4);transition:transform .2s,box-shadow .2s}
  .fb-go:hover{transform:translateY(-1px);box-shadow:0 7px 16px rgba(43,127,209,.5)}
  .fb-go svg{width:13px;height:13px;stroke:#fff;fill:none;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}
  .fb-chips{display:flex;flex-wrap:wrap;gap:5px;margin-top:12px}
  .fb-chips i{font-style:normal;display:inline-flex;align-items:center;gap:5px;font-size:10.5px;font-weight:700;padding:5px 8px;border-radius:999px;background:rgba(127,127,127,.12)}
  .fb-chips i::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--c);box-shadow:0 0 8px var(--c)}
  .fb-hlabel{display:flex;align-items:center;justify-content:space-between;margin:16px 2px 6px;font-size:11px;font-weight:800;letter-spacing:.6px;text-transform:uppercase;color:var(--muted,#6b7280)}
  .fb-hlabel button{background:none;border:none;color:inherit;font:inherit;text-transform:none;letter-spacing:0;cursor:pointer;opacity:.85}
  .fb-hlabel button:hover{text-decoration:underline}
    .fb-hi{display:flex;align-items:center;gap:10px;padding:6px;border-radius:12px;cursor:pointer;transition:background .15s}
  .fb-hi:hover{background:rgba(127,127,127,.16)}
  .fb-hi .th{width:38px;height:38px;border-radius:9px;flex:none;background:linear-gradient(135deg,#59b4f0,#2b7fd1) center/cover no-repeat;display:flex;align-items:center;justify-content:center}
  .fb-hi .th svg{width:16px;height:16px;fill:#fff}
  .fb-hi .th.has-img svg{display:none}
  .fb-hi .tx{min-width:0;flex:1}
  .fb-hi .tt{font-size:12.5px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .fb-hi .ss{font-size:11px;opacity:.65;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .fb-back{margin-top:12px;background:none;border:none;color:var(--fb-ac);font:700 12px Inter,system-ui,sans-serif;cursor:pointer;padding:0;display:none}
  .fb-back.show{display:inline-block}
  .fb-panel.has-art .fb-field{background:rgba(255,255,255,.14);border-color:rgba(255,255,255,.3)}
  .fb-panel.has-art .fb-field>svg{stroke:rgba(255,255,255,.75)}
  .fb-panel.has-art .fb-field input::placeholder{color:rgba(255,255,255,.62)}
  .fb-panel.has-art .fb-chips i{background:rgba(255,255,255,.14)}
  .fb-panel.has-art .fb-x{background:rgba(255,255,255,.16)}

  .fb-now{display:flex;gap:14px;align-items:center}
  .fb-thumb{width:96px;height:96px;border-radius:18px;flex:none;position:relative;
    background:linear-gradient(135deg,#59b4f0,#2b7fd1) center/cover no-repeat;display:flex;align-items:center;justify-content:center;
    box-shadow:0 14px 28px rgba(0,0,0,.4),0 0 0 1px rgba(255,255,255,.18);transition:transform .5s cubic-bezier(.22,1,.36,1)}
  .fb-view.is-playing .fb-thumb{transform:scale(1.04)}
  .fb-thumb svg{width:38px;height:38px;fill:#fff}
  .fb-thumb.has-img svg{display:none}
  .fb-info{min-width:0;flex:1}
  .fb-title{font-weight:800;font-size:15px;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;word-break:break-word}
  .fb-sub{display:flex;align-items:center;gap:8px;font-size:11.5px;color:var(--muted,#6b7280);margin-top:6px}
  .fb-sub span{min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .fb-eq{display:inline-flex;align-items:flex-end;gap:2px;height:13px;flex:none}
  .fb-eq u{width:3px;height:3px;border-radius:2px;background:currentColor;display:block}
  .fb-view.is-playing .fb-eq u{animation:fb-eq .9s ease-in-out infinite}
  .fb-eq u:nth-child(2){animation-delay:.18s!important}.fb-eq u:nth-child(3){animation-delay:.36s!important}.fb-eq u:nth-child(4){animation-delay:.09s!important}
  @keyframes fb-eq{0%,100%{height:3px}50%{height:13px}}

  .fb-embed{margin-top:14px}
  .fb-embed:empty{display:none}
  .fb-embed iframe{display:block;width:100%;border:0;border-radius:14px}

  .fb-prog{margin-top:18px}
  .fb-prog input{-webkit-appearance:none;appearance:none;width:100%;height:5px;border-radius:99px;outline:none;cursor:pointer;display:block;margin:0;
    background:linear-gradient(to right,var(--fb-ac) var(--pct,0%),rgba(127,127,127,.32) var(--pct,0%))}
  .fb-prog input::-webkit-slider-thumb{-webkit-appearance:none;width:13px;height:13px;border-radius:50%;background:#fff;box-shadow:0 1px 6px rgba(0,0,0,.45);border:2px solid var(--fb-ac);transition:transform .15s}
  .fb-prog input::-moz-range-thumb{width:11px;height:11px;border-radius:50%;background:#fff;border:2px solid var(--fb-ac);box-shadow:0 1px 6px rgba(0,0,0,.45)}
  .fb-prog input:hover::-webkit-slider-thumb{transform:scale(1.25)}
  .fb-time{display:flex;justify-content:space-between;margin-top:7px;font-size:11px;font-weight:600;color:var(--muted,#6b7280);font-variant-numeric:tabular-nums}

  .fb-open{display:inline-block;margin-top:8px;font-size:11.5px;font-weight:700;color:var(--fb-ac);text-decoration:none;opacity:.85}
  .fb-open:hover{opacity:1;text-decoration:underline}
  .fb-ctrl{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:10px;margin-top:12px}
  .fb-vol{display:flex;align-items:center;gap:6px;min-width:0}
  .fb-ib{width:30px;height:30px;flex:none;border:none;border-radius:50%;background:none;color:inherit;cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:.8;transition:background .2s,opacity .2s}
  .fb-ib:hover{background:rgba(127,127,127,.2);opacity:1}
  .fb-ib svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
  .fb-vol input{-webkit-appearance:none;appearance:none;flex:1;min-width:0;width:100%;height:4px;border-radius:99px;outline:none;cursor:pointer;margin:0;
    background:linear-gradient(to right,var(--fb-ac) var(--vp,40%),rgba(127,127,127,.32) var(--vp,40%))}
  .fb-vol input::-webkit-slider-thumb{-webkit-appearance:none;width:11px;height:11px;border-radius:50%;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.5)}
  .fb-vol input::-moz-range-thumb{width:11px;height:11px;border:none;border-radius:50%;background:#fff}
  .fb-toggle{width:56px;height:56px;border:none;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#fff;
    background:linear-gradient(135deg,#59b4f0,#2b7fd1);box-shadow:0 10px 22px rgba(43,127,209,.5),inset 0 1px 0 rgba(255,255,255,.4);transition:transform .2s cubic-bezier(.34,1.56,.64,1)}
  .fb-toggle:hover{transform:scale(1.08)}.fb-toggle:active{transform:scale(.94)}
  .fb-toggle svg{width:24px;height:24px;fill:#fff}
  .fb-toggle .ic-pause{display:none}
  .fb-view.is-playing .fb-toggle .ic-play{display:none}
  .fb-view.is-playing .fb-toggle .ic-pause{display:block}
  .fb-panel.has-art .fb-toggle{background:#fff;color:#111;box-shadow:0 10px 24px rgba(0,0,0,.45)}
  .fb-panel.has-art .fb-toggle svg{fill:#111}
  .fb-change{justify-self:end;display:flex;align-items:center;gap:6px;border:1px solid rgba(127,127,127,.35);background:none;color:inherit;border-radius:999px;padding:7px 12px;font:700 11.5px Inter,system-ui,sans-serif;cursor:pointer;transition:background .2s,border-color .2s;white-space:nowrap}
  .fb-change:hover{background:rgba(127,127,127,.18);border-color:var(--fb-ac)}
  .fb-change svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
  .fb-panel.has-art .fb-change{border-color:rgba(255,255,255,.45)}
  .fb-view.sp .fb-prog,.fb-view.sp .fb-ctrl .fb-vol,.fb-view.sp .fb-ctrl .fb-toggle{display:none}
  .fb-view.sp .fb-ctrl{grid-template-columns:1fr}

  .fb-msg{margin-top:12px;font-size:12px;color:var(--muted,#6b7280);line-height:1.45}
  .fb-msg:empty{display:none}
  .fb-msg.err{color:#d93025}
  @media(max-width:600px){.fb-wrap{right:12px;bottom:12px}.fb-btn{width:48px;height:48px}.fb-panel{right:72px;bottom:12px}}
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
      <button class="fb-btn fb-music" id="fbMusicBtn" aria-label="Music" title="Music">${NOTE}<span class="fb-beq"><u></u><u></u><u></u><u></u></span></button>
    </div>

    <div class="fb-panel" id="fbPanel">
      <div class="fb-head">
        <b><i>${NOTE}</i>Music Player</b>
        <button type="button" class="fb-x" id="fbClose" aria-label="Đóng">×</button>
      </div>

      <div class="fb-view show" id="fbViewInput">
        <div class="fb-field">
          <svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.7-1.7"/></svg>
          <input type="text" id="fbUrl" placeholder="Dán link nhạc vào đây..." autocomplete="off" spellcheck="false">
          <button type="button" class="fb-go" id="fbGo">Enter <svg viewBox="0 0 24 24"><polyline points="9 10 4 15 9 20"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/></svg></button>
        </div>
        <div class="fb-chips">
          <i style="--c:#ff3b3b">YouTube</i><i style="--c:#ff5500">SoundCloud</i>
          <i style="--c:#1ed760">Spotify</i><i style="--c:#fa2d48">Apple Music</i>
          <i style="--c:#a855f7">Zing MP3</i><i style="--c:#f59e0b">Link File Nhạc</i>
        </div>
        <div class="fb-hist" id="fbHist"></div>
        <button type="button" class="fb-back" id="fbBack">← Quay lại bài đang phát</button>
      </div>

      <div class="fb-view" id="fbViewPlayer">
        <div class="fb-now">
          <div class="fb-thumb" id="fbThumb">${NOTE}</div>
          <div class="fb-info">
            <div class="fb-title" id="fbTitle">Đang tải...</div>
            <div class="fb-sub"><span class="fb-eq"><u></u><u></u><u></u><u></u></span><span id="fbSub">YouTube</span></div>
          </div>
        </div>
        <div class="fb-embed" id="fbEmbed"></div>
        <div class="fb-prog">
          <input type="range" id="fbProg" min="0" max="1000" value="0" aria-label="Tua">
          <div class="fb-time"><span id="fbCur">0:00</span><span id="fbDur">--:--</span></div>
        </div>
        <div class="fb-ctrl">
          <div class="fb-vol">
            <button type="button" class="fb-ib" id="fbMute" aria-label="Tắt tiếng">
              <svg viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path id="fbVolWave" d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/></svg>
            </button>
            <input type="range" id="fbVol" min="0" max="100" value="40" aria-label="Âm lượng">
          </div>
          <button type="button" class="fb-toggle" id="fbToggle" aria-label="Phát / Dừng">
            <svg class="ic-play" viewBox="0 0 24 24"><path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14z"/></svg>
            <svg class="ic-pause" viewBox="0 0 24 24"><rect x="6" y="4.5" width="4.2" height="15" rx="1.3"/><rect x="13.8" y="4.5" width="4.2" height="15" rx="1.3"/></svg>
          </button>
          <button type="button" class="fb-change" id="fbChange">
            <svg viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>Đổi bài
          </button>
        </div>
      </div>

      <div class="fb-msg" id="fbMsg"></div>
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
        embed = $('fbEmbed'), prog = $('fbProg'), tCur = $('fbCur'), tDur = $('fbDur'),
        muteBtn = $('fbMute'), volWave = $('fbVolWave'),
        histEl = $('fbHist');

  let mode = null;
  let session = 0;
  let curUrl = '';
  let yt = null, ytReady = false, wantId = null;
  let sc = null, scReady = false, scDur = 0;
  let volume = 0.4, lastVol = 0.4, seeking = false;
  audio.volume = volume;

  const NOTE_SM = '<svg viewBox="0 0 24 24"><path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z"/></svg>';
  function say(text, err) { msg.textContent = text || ''; msg.className = 'fb-msg' + (err ? ' err' : ''); }
  function setPlaying(on) {
    btn.classList.toggle('playing', on);
    viewPlayer.classList.toggle('is-playing', on);
  }
  const fmt = (s) => {
    if (!isFinite(s) || s < 0) return '--:--';
    s = Math.floor(s);
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
    return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(r).padStart(2, '0');
  };

  // ----- lịch sử phát gần đây -----
  function histGet() { try { return JSON.parse(localStorage.getItem(HIST_KEY)) || []; } catch (e) { return []; } }
  function histPut(list) { try { localStorage.setItem(HIST_KEY, JSON.stringify(list.slice(0, HIST_MAX))); } catch (e) {} }
  function histSet(url, patch) {
    if (!url) return;
    const list = histGet();
    let it = list.find((x) => x.url === url);
    if (!it) { it = { url: url }; list.unshift(it); }
    Object.assign(it, patch);
    histPut(list);
  }
  function histTouch(url) {
    const list = histGet();
    const i = list.findIndex((x) => x.url === url);
    const it = i >= 0 ? list.splice(i, 1)[0] : { url: url };
    list.unshift(it);
    histPut(list);
  }
  function histRender() {
    const list = histGet();
    histEl.innerHTML = '';
    if (!list.length) return;
    const lab = document.createElement('div');
    lab.className = 'fb-hlabel';
    lab.innerHTML = '<span>Phát gần đây</span>';
    const clr = document.createElement('button');
    clr.type = 'button'; clr.textContent = 'Xóa';
    clr.onclick = (e) => { e.stopPropagation(); histPut([]); histRender(); };
    lab.appendChild(clr);
    histEl.appendChild(lab);
    list.forEach((it) => {
      const row = document.createElement('div');
      row.className = 'fb-hi';
      const th = document.createElement('div');
      th.className = 'th' + (it.cover ? ' has-img' : '');
      if (it.cover) th.style.backgroundImage = 'url("' + it.cover + '")';
      th.innerHTML = NOTE_SM;
      const tx = document.createElement('div');
      tx.className = 'tx';
      const tt = document.createElement('div'); tt.className = 'tt'; tt.textContent = it.title || it.url;
      const ss = document.createElement('div'); ss.className = 'ss'; ss.textContent = it.sub || '';
      tx.appendChild(tt); if (it.sub) tx.appendChild(ss);
      row.appendChild(th); row.appendChild(tx);
      row.onclick = () => play(it.url);
      histEl.appendChild(row);
    });
  }
  function setTitle(t, sub) {
    if (t) titleEl.textContent = t;
    if (sub) subEl.textContent = sub;
    histSet(curUrl, { title: t || undefined, sub: sub || undefined });
  }

  function applyCover(url) {
    panel.style.setProperty('--fb-bg', 'url("' + url + '")');
    panel.classList.add('has-art');
    thumb.style.backgroundImage = 'url("' + url + '")';
    thumb.classList.add('has-img');
    histSet(curUrl, { cover: url });
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

  function paint(el, pct, prop) { el.style.setProperty(prop || '--pct', pct + '%'); }
  function upd(p, d) {
    tCur.textContent = fmt(p);
    if (!isFinite(d) || d <= 0) { tDur.textContent = '--:--'; prog.value = 0; paint(prog, 0); return; }
    tDur.textContent = fmt(d);
    const v = Math.min(1000, Math.max(0, (p / d) * 1000));
    prog.value = v; paint(prog, v / 10);
  }
  function tick() {
    if (seeking || !mode || mode === 'sp') return;
    try {
      if (mode === 'audio') upd(audio.currentTime, audio.duration);
      else if (mode === 'yt' && yt && ytReady && yt.getDuration) upd(yt.getCurrentTime(), yt.getDuration());
      else if (mode === 'sc' && sc && scReady) sc.getPosition((ms) => { if (!seeking) upd(ms / 1000, scDur / 1000); });
    } catch (e) {}
  }
  setInterval(tick, 400);
  prog.addEventListener('input', () => {
    seeking = true;
    const f = prog.value / 1000;
    paint(prog, prog.value / 10);
    const d = mode === 'audio' ? audio.duration : mode === 'yt' && ytReady ? yt.getDuration() : scDur / 1000;
    if (isFinite(d)) tCur.textContent = fmt(f * d);
  });
  prog.addEventListener('change', () => {
    const f = prog.value / 1000;
    try {
      if (mode === 'audio' && isFinite(audio.duration)) audio.currentTime = f * audio.duration;
      else if (mode === 'yt' && ytReady) yt.seekTo(f * yt.getDuration(), true);
      else if (mode === 'sc' && scReady) sc.seekTo(f * scDur);
    } catch (e) {}
    seeking = false;
  });

  function applyVolume(v) {
    volume = v;
    audio.volume = v;
    if (yt && ytReady && yt.setVolume) yt.setVolume(v * 100);
    if (sc && scReady) sc.setVolume(v * 100);
    vol.value = Math.round(v * 100);
    paint(vol, Math.round(v * 100), '--vp');
    volWave.style.display = v === 0 ? 'none' : '';
  }
  vol.addEventListener('input', () => { const v = vol.value / 100; if (v > 0) lastVol = v; applyVolume(v); });
  muteBtn.addEventListener('click', () => { if (volume > 0) { lastVol = volume; applyVolume(0); } else applyVolume(lastVol || 0.4); });
  applyVolume(volume);

  function showView(name) {
    viewInput.classList.toggle('show', name === 'input');
    viewPlayer.classList.toggle('show', name === 'player');
    if (name === 'input') {
      backBtn.classList.toggle('show', !!mode);
      input.value = '';
      histRender();
      say('');
      setTimeout(() => input.focus(), 60);
    }
  }
  btn.addEventListener('click', () => panel.classList.toggle('open'));
  $('fbClose').addEventListener('click', () => panel.classList.remove('open'));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') panel.classList.remove('open'); });
  changeBtn.addEventListener('click', () => showView('input'));
  backBtn.addEventListener('click', () => showView('player'));
  histRender();

  // ----- nhận diện link -----
  function ytId(url) {
    const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/);
    return m ? m[1] : null;
  }
  const isSC = (url) => /^https?:\/\/(?:www\.|m\.|on\.)?(?:soundcloud\.com|snd\.sc)\//i.test(url);
  function spInfo(url) {
    const m = url.match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?(track|album|playlist|episode|show|artist)\/([A-Za-z0-9]+)/);
    return m ? { type: m[1], id: m[2] } : null;
  }

  function extInfo(url) {
    let m = url.match(/^https?:\/\/(?:classical\.)?music\.apple\.com\/([a-z]{2})\/(album|playlist|song|station)\/([^/?#]+)/i);

    if (m) {
      const song = /[?&]i=\d+/.test(url) || m[2] === 'song';

      return {
        site: 'Apple Music',
        cc: m[1],
        name: m[3],
        src: url.replace(/^(https?:\/\/)(?:classical\.)?music\.apple\.com/i,'$1embed.music.apple.com'),
        h: song ? 175 : 450,
        sandbox:'allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation'};
    }

    m = url.match(/^https?:\/\/(?:www\.|m\.)?zingmp3\.vn\/(bai-hat|album|playlist)\/([^/]+)\/([A-Za-z0-9]{8})(?:\.html)?/i);

    if (m) {
      const kind = m[1] === 'bai-hat' ? 'song' : 'playlist';

      return {
        site: 'Zing MP3',
        name: m[2],
        src: 'https://zingmp3.vn/embed/' + kind + '/' + m[3] + '?start=false',
        h: kind === 'song' ? 150 : 300
      };
    }

    return null;
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
  const loadSCApi = (cb) => loadScript('fbSCapi', 'https://w.soundcloud.com/player/api.js', () => window.SC && SC.Widget, cb);

  function stopAll() {
    audio.pause();
    if (yt && ytReady && yt.pauseVideo) yt.pauseVideo();
    if (sc && scReady) sc.pause();
    embed.innerHTML = '';
    setPlaying(false);
    upd(0, 0);
  }

  // ===== YouTube =====
  function playYT(id, token) {
    subEl.textContent = 'YouTube';
    titleEl.textContent = 'Đang tải tên bài...';
    setCover(['https://img.youtube.com/vi/' + id + '/maxresdefault.jpg', 'https://img.youtube.com/vi/' + id + '/hqdefault.jpg'], token);
    fetch('https://www.youtube.com/oembed?format=json&url=' + encodeURIComponent('https://www.youtube.com/watch?v=' + id))
      .then((r) => r.json())
      .then((d) => { if (token === session && d.title) setTitle(d.title, (d.author_name ? d.author_name + ' · ' : '') + 'YouTube'); })
      .catch(() => { if (token === session) setTitle('Video YouTube', 'YouTube'); });

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
              if (e.data === 1) { setPlaying(true); say(''); }
              else if (e.data === 2) setPlaying(false);
              else if (e.data === 0) { e.target.seekTo(0); e.target.playVideo(); }
            },
            onError: () => { if (mode === 'yt') { setPlaying(false); say('Video này không phát được (bị chặn nhúng hoặc link sai). Bấm "Đổi bài".', true); } }
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
      scDur = s.duration || 0;
      setTitle(s.title || 'Bài SoundCloud', (s.user && s.user.username ? s.user.username + ' · ' : '') + 'SoundCloud');
      const big = (u) => (u ? u.replace('-large', '-t500x500') : null);
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
      f.src = 'https://w.soundcloud.com/player/?url=' + encodeURIComponent(url) + '&auto_play=true&hide_related=true&show_comments=false&visual=false';
      $('fbSC').appendChild(f);
      sc = SC.Widget(f);
      sc.bind(SC.Widget.Events.READY, () => { scReady = true; sc.setVolume(volume * 100); if (mode === 'sc') { scSound(session); sc.play(); } });
      sc.bind(SC.Widget.Events.PLAY, () => { if (mode === 'sc') { setPlaying(true); say(''); } });
      sc.bind(SC.Widget.Events.PAUSE, () => { if (mode === 'sc') setPlaying(false); });
      sc.bind(SC.Widget.Events.FINISH, () => { if (mode === 'sc') { sc.seekTo(0); sc.play(); } });
      sc.bind(SC.Widget.Events.ERROR, () => { if (mode === 'sc') { setPlaying(false); say('Không phát được bài SoundCloud này (riêng tư hoặc bị chặn). Bấm "Đổi bài".', true); } });
    });
  }

  // ===== Spotify =====
  function playSP(info, url, token) {
    subEl.textContent = 'Spotify';
    titleEl.textContent = 'Đang tải tên bài...';
    const h = info.type === 'track' || info.type === 'episode' ? 152 : 232;
    embed.innerHTML = '<iframe src="https://open.spotify.com/embed/' + info.type + '/' + info.id + '?theme=0" height="' + h +
      '" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>';
    say('Bấm ▶ trong khung Spotify để nghe (Spotify không cho tự phát; chưa đăng nhập thì chỉ nghe thử 30 giây).');
    fetch('https://open.spotify.com/oembed?url=' + encodeURIComponent(url))
      .then((r) => r.json())
      .then((d) => {
        if (token !== session) return;
        if (d.title) setTitle(d.title, 'Spotify');
        if (d.thumbnail_url) setCover([d.thumbnail_url], token);
      })
      .catch(() => { if (token === session) setTitle('Spotify', 'Spotify'); });
  }


  // ===== Apple Music / Zing MP3 =====
  function playExt(info, url, token) {
    let nice = info.name;
    try { nice = decodeURIComponent(info.name).replace(/-/g, ' '); } catch (e) {}
    setTitle(nice, info.site);

    const f = document.createElement('iframe');
    f.src = info.src;
    f.height = info.h;
    f.loading = 'lazy';
    f.allow = 'autoplay *; encrypted-media *; fullscreen *; clipboard-write';
    if (info.sandbox) f.setAttribute('sandbox', info.sandbox);
    embed.innerHTML = '';
    embed.appendChild(f);
    const a = document.createElement('a');
    a.className = 'fb-open'; a.href = url; a.target = '_blank'; a.rel = 'noopener';
    a.textContent = 'Không hiện? Mở link gốc ↗';
    embed.appendChild(a);
    say('Bấm ▶ trong khung để nghe (' + info.site + ' không cho tự phát).');

    if (info.site === 'Apple Music') {
      const idm = url.match(/[?&]i=(\d+)/) || url.match(/\/(\d{5,})(?:[?#]|$)/);
      if (!idm) return;
      fetch('https://itunes.apple.com/lookup?id=' + idm[1] + '&country=' + info.cc)
        .then((r) => r.json())
        .then((d) => {
          const it = d.results && d.results[0];
          if (!it || token !== session) return;
          setTitle(it.trackName || it.collectionName, (it.artistName ? it.artistName + ' · ' : '') + 'Apple Music');
          if (it.artworkUrl100) setCover([it.artworkUrl100.replace(/\d+x\d+bb/, '600x600bb')], token);
        })
        .catch(() => {});
    }
  }

  // ===== Link nhạc trực tiếp =====
  function playAudio(url) {
    let name = url;
    try { name = decodeURIComponent(new URL(url).pathname.split('/').filter(Boolean).pop() || url); } catch (e) {}
    setTitle(name, 'Link nhạc trực tiếp');
    audio.src = url;
    audio.play()
      .then(() => { setPlaying(true); say(''); })
      .catch(() => { setPlaying(false); say('Không phát được link này. Hỗ trợ YouTube, SoundCloud, Spotify, Apple Music, Zing MP3 và link file nhạc trực tiếp.',true);});
  }

  // ===== Nhận link, đổi giao diện =====
  function play(url) {
    url = (url || '').trim();
    if (!/^https?:\/\//i.test(url)) return say('Link phải bắt đầu bằng http:// hoặc https://', true);

    stopAll();
    clearCover();
    const token = ++session;
    const id = ytId(url), spot = spInfo(url), ext = extInfo(url);
    curUrl = url;
    histTouch(url);

    if (id) mode = 'yt';
    else if (isSC(url)) mode = 'sc';
    else if (spot || ext) mode = 'sp';
    else mode = 'audio';

    wantId = id;
    scDur = 0;
    viewPlayer.classList.toggle('sp', mode === 'sp');
    showView('player');
    say('');

    if (mode === 'yt') playYT(id, token);
    else if (mode === 'sc') playSC(url, token);
    else if (mode === 'sp') (spot ? playSP(spot, url, token) : playExt(ext, url, token));
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
})();
