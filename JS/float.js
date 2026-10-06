(() => {
    if (window.__floatLoaded) return;
    window.__floatLoaded = true;

    const MESSENGER = "https://m.me/lyphucthien1803";
    const $ = id => document.getElementById(id);

    // ---------- STYLE ----------
    const style = document.createElement("style");
    style.textContent = `
        .fb-wrap{position:fixed;right:20px;bottom:20px;z-index:99999;display:flex;flex-direction:column;gap:12px}
        .fb-btn{width:52px;height:52px;border:0;border-radius:50%;padding:0;cursor:pointer;
            display:flex;align-items:center;justify-content:center;position:relative;
            box-shadow:0 5px 18px #0004;transition:.2s}
        .fb-btn:hover{transform:translateY(-3px) scale(1.05)}
        .fb-btn svg{width:27px;height:27px;fill:#fff}
        .fb-messenger{background:linear-gradient(135deg,#00b2ff,#006aff 60%,#a033ff)}
        .fb-music{background:linear-gradient(135deg,#4da6e8,#2b7fd1)}
        .fb-music.playing svg{animation:fbspin 2.5s linear infinite}
        .fb-music.playing:after{content:"";position:absolute;inset:-4px;border:2px solid #4da6e8;
            border-radius:50%;animation:fbpulse 1.5s ease-out infinite}
        @keyframes fbspin{to{transform:rotate(360deg)}}
        @keyframes fbpulse{0%{transform:scale(1);opacity:.6}100%{transform:scale(1.35);opacity:0}}
        .fb-panel{position:fixed;right:84px;bottom:20px;width:310px;max-width:calc(100vw - 105px);
            padding:14px;background:#fff;color:#222;border-radius:14px;box-shadow:0 10px 35px #0004;
            font:13px Inter,Arial,sans-serif;z-index:99998;opacity:0;visibility:hidden;
            transform:translateX(18px);transition:.25s}
        .fb-panel.open{opacity:1;visibility:visible;transform:none}
        .fb-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;font-weight:700}
        .fb-close{border:0;background:none;font-size:22px;color:#888;cursor:pointer;padding:0 2px}
        .fb-row{display:flex;gap:6px}
        .fb-url{flex:1;min-width:0;border:1px solid #d5d9de;border-radius:8px;padding:9px 10px;outline:0}
        .fb-url:focus{border-color:#4da6e8}
        .fb-go,.fb-toggle{border:0;border-radius:8px;cursor:pointer;font-weight:600}
        .fb-go{padding:0 13px;background:#4da6e8;color:#fff}
        .fb-go:hover{background:#2b7fd1}
        .fb-controls{display:flex;align-items:center;gap:9px;margin-top:10px}
        .fb-toggle{padding:7px 12px;background:#eef3f8;color:#222}
        .fb-vol{flex:1}
        .fb-msg{margin-top:8px;min-height:16px;color:#777;font-size:12px}
        .fb-msg.error{color:#d93025}
        .fb-yt{position:fixed;left:-10000px;top:-10000px;width:1px;height:1px;pointer-events:none}
        @media(max-width:600px){
            .fb-wrap{right:12px;bottom:12px}
            .fb-btn{width:46px;height:46px}
            .fb-panel{right:68px;bottom:12px;width:300px}
        }
    `;
    document.head.appendChild(style);

    // ---------- HTML ----------
    const root = document.createElement("div");
    root.innerHTML = `
        <div class="fb-wrap">
            <a class="fb-btn fb-messenger" href="${MESSENGER}" target="_blank"
               rel="noopener noreferrer" aria-label="Messenger" title="Chat Messenger">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.14.26.35.27.57l.05 1.78c.02.57.6.94 1.12.71l1.99-.88c.17-.07.36-.09.53-.04.91.25 1.87.38 2.9.38 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm6 7.46-2.94 4.66c-.47.74-1.47.93-2.17.4l-2.34-1.75a.6.6 0 0 0-.72 0l-3.16 2.4c-.42.32-.97-.19-.69-.64l2.94-4.66c.47-.74 1.47-.93 2.17-.4l2.34 1.75a.6.6 0 0 0 .72 0l3.16-2.4c.42-.32.97-.19.69.64z"/>
                </svg>
            </a>

            <button class="fb-btn fb-music" id="fbMusicBtn" type="button"
                    aria-label="Music" title="Phát nhạc">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z"/>
                </svg>
            </button>
        </div>

        <div class="fb-panel" id="fbPanel">
            <div class="fb-head">
                <span>🎵 Phát nhạc</span>
                <button class="fb-close" id="fbClose" type="button" aria-label="Đóng">×</button>
            </div>

            <div class="fb-row">
                <input class="fb-url" id="fbUrl" type="text"
                       placeholder="Dán link YouTube hoặc .mp3">
                <button class="fb-go" id="fbGo" type="button">Phát</button>
            </div>

            <div class="fb-controls">
                <button class="fb-toggle" id="fbToggle" type="button">▶ Phát</button>
                <input class="fb-vol" id="fbVol" type="range" min="0" max="100" value="40">
            </div>

            <div class="fb-msg" id="fbMsg">
                Hỗ trợ YouTube và link audio trực tiếp.
            </div>
        </div>

        <audio id="fbAudio" preload="none"></audio>
        <div class="fb-yt" id="fbYT"></div>
    `;
    document.body.appendChild(root);

    const btn = $("fbMusicBtn");
    const panel = $("fbPanel");
    const close = $("fbClose");
    const input = $("fbUrl");
    const go = $("fbGo");
    const toggle = $("fbToggle");
    const vol = $("fbVol");
    const msg = $("fbMsg");
    const audio = $("fbAudio");

    let mode = null;
    let player = null;
    let apiLoading = false;
    let apiReady = false;
    let apiQueue = [];
    let volume = Number(localStorage.getItem("fbMusicVolume") || 40) / 100;
    let requestId = 0;

    vol.value = Math.round(volume * 100);
    audio.volume = volume;

    const say = (text, error = false) => {
        msg.textContent = text;
        msg.className = "fb-msg" + (error ? " error" : "");
    };

    const setPlaying = playing => {
        btn.classList.toggle("playing", playing);
        toggle.textContent = playing ? "⏸ Dừng" : "▶ Phát";
    };

    // ---------- YOUTUBE ----------
    function getYoutubeId(url) {
        try {
            const u = new URL(url);
            const host = u.hostname.replace(/^www\./, "");
            const path = u.pathname.split("/").filter(Boolean);

            if (host === "youtu.be" && /^[\w-]{11}$/.test(path[0] || "")) {
                return path[0];
            }

            if (host === "youtube.com") {
                const v = u.searchParams.get("v");
                if (/^[\w-]{11}$/.test(v || "")) return v;

                if (["embed", "shorts", "live"].includes(path[0]) &&
                    /^[\w-]{11}$/.test(path[1] || "")) {
                    return path[1];
                }
            }

            return null;
        } catch {
            return null;
        }
    }

    function loadYoutubeApi(callback) {
        if (apiReady && window.YT?.Player) {
            callback();
            return;
        }

        apiQueue.push(callback);

        if (apiLoading) return;
        apiLoading = true;

        window.onYouTubeIframeAPIReady = () => {
            apiReady = true;
            const queue = apiQueue.splice(0);

            queue.forEach(fn => {
                try {
                    fn();
                } catch (e) {
                    console.error(e);
                }
            });
        };

        if (!document.querySelector(
            'script[src="https://www.youtube.com/iframe_api"]'
        )) {
            const script = document.createElement("script");
            script.src = "https://www.youtube.com/iframe_api";
            script.async = true;

            script.onerror = () => {
                apiLoading = false;
                apiQueue = [];
                say("Không tải được YouTube API.", true);
            };

            document.head.appendChild(script);
        }
    }

    function ensurePlayer(videoId, id) {
        if (id !== requestId) return;

        if (player?.loadVideoById) {
            player.loadVideoById(videoId);
            return;
        }

        player = new YT.Player("fbYT", {
            width: 1,
            height: 1,
            videoId,

            playerVars: {
                autoplay: 1,
                controls: 0,
                playsinline: 1,
                rel: 0
            },

            events: {
                onReady: e => {
                    if (id !== requestId) return;

                    e.target.setVolume(volume * 100);
                    e.target.playVideo();
                },

                onStateChange: e => {
                    if (id !== requestId) return;

                    if (e.data === YT.PlayerState.PLAYING) {
                        setPlaying(true);
                        say("Đang phát");
                    } else if (e.data === YT.PlayerState.PAUSED) {
                        setPlaying(false);
                    } else if (e.data === YT.PlayerState.ENDED) {
                        e.target.seekTo(0, true);
                        e.target.playVideo();
                    }
                },

                onError: () => {
                    if (id === requestId) {
                        setPlaying(false);
                        say(
                            "Video không thể phát hoặc bị chặn nhúng.",
                            true
                        );
                    }
                }
            }
        });
    }

    // ---------- PLAYBACK ----------
    function stopAll() {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();

        if (player?.pauseVideo) {
            player.pauseVideo();
        }

        setPlaying(false);
    }

    function play(url) {
        url = url.trim();

        if (!url) {
            say("Hãy nhập link nhạc.", true);
            return;
        }

        let parsed;

        try {
            parsed = new URL(url);

            if (!/^https?:$/.test(parsed.protocol)) {
                throw new Error();
            }
        } catch {
            say("Link không hợp lệ.", true);
            return;
        }

        const id = ++requestId;

        stopAll();

        const youtubeId = getYoutubeId(url);

        if (youtubeId) {
            mode = "yt";
            say("Đang tải YouTube...");

            loadYoutubeApi(() => {
                ensurePlayer(youtubeId, id);
            });
        } else {
            mode = "audio";
            audio.src = url;

            audio.play()
                .then(() => {
                    if (id !== requestId) return;

                    setPlaying(true);
                    say("Đang phát");
                })
                .catch(() => {
                    if (id === requestId) {
                        setPlaying(false);
                        say("Không phát được link audio.", true);
                    }
                });
        }

        try {
            localStorage.setItem("fbMusicUrl", url);
        } catch {}
    }

    // ---------- EVENTS ----------
    btn.onclick = () => {
        panel.classList.toggle("open");
    };

    close.onclick = () => {
        panel.classList.remove("open");
    };

    go.onclick = () => {
        play(input.value);
    };

    input.onkeydown = e => {
        if (e.key === "Enter") {
            play(input.value);
        }
    };

    toggle.onclick = () => {
        if (mode === "audio") {
            if (audio.paused) {
                audio.play()
                    .then(() => setPlaying(true))
                    .catch(() => say("Không thể phát.", true));
            } else {
                audio.pause();
            }

            return;
        }

        if (mode === "yt" && player) {
            const state = player.getPlayerState();

            if (state === YT.PlayerState.PLAYING) {
                player.pauseVideo();
            } else {
                player.playVideo();
            }

            return;
        }

        if (input.value.trim()) {
            play(input.value);
        }
    };

    audio.onplay = () => {
        if (mode === "audio") {
            setPlaying(true);
        }
    };

    audio.onpause = () => {
        if (mode === "audio") {
            setPlaying(false);
        }
    };

    audio.onerror = () => {
        if (mode === "audio") {
            setPlaying(false);
            say(
                "Link audio lỗi hoặc máy chủ không cho phép phát trực tiếp.",
                true
            );
        }
    };

    vol.oninput = () => {
        volume = Number(vol.value) / 100;
        audio.volume = volume;

        if (player?.setVolume) {
            player.setVolume(Number(vol.value));
        }

        try {
            localStorage.setItem("fbMusicVolume", vol.value);
        } catch {}
    };

    try {
        input.value = localStorage.getItem("fbMusicUrl") || "";
    } catch {}
})();
