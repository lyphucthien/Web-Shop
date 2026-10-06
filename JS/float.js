(()=>{if(window.__floatLoaded)return;window.__floatLoaded=1;
const M='https://m.me/lyphucthien1803',s=document.createElement('style');
s.textContent=`.fb{position:fixed;right:20px;bottom:20px;z-index:9999;display:flex;flex-direction:column;gap:10px}.b{width:50px;height:50px;border:0;border-radius:50%;cursor:pointer;color:#fff}.ms{background:#06f}.mu{background:#287fd1}.p{position:fixed;right:80px;bottom:20px;width:290px;padding:12px;background:#fff;border-radius:12px;box-shadow:0 8px 25px #0004;font:13px Arial;display:none}.on{display:block}.r{display:flex;gap:5px}.r input{flex:1}.ct{display:flex;gap:8px;margin-top:8px}.ct input{flex:1}.msg{margin-top:7px;color:#777}`;
document.head.appendChild(s);
const r=document.createElement('div');r.innerHTML=`<div class=fb><a class="b ms" href="${M}" target=_blank>💬</a><button class="b mu" id=mb>🎵</button></div><div class=p id=pn><b>🎵 Phát nhạc</b><span id=cl style="float:right">×</span><div class=r><input id=in placeholder="Link YouTube hoặc .mp3"><button id=go>Phát</button></div><div class=ct><button id=tg>▶ Phát</button><input id=vl type=range min=0 max=100 value=40></div><div class=msg id=mg>Hỗ trợ YouTube và audio</div></div><audio id=au loop></audio><div id=yt style="position:fixed;left:-9999px"></div>`;
document.body.appendChild(r);
const $=x=>document.getElementById(x),mb=$('mb'),pn=$('pn'),i=$('in'),go=$('go'),tg=$('tg'),vl=$('vl'),mg=$('mg'),au=$('au');
let mode=null,player=null,volume=.4,loading=false;
const say=(x,e)=>{mg.textContent=x;mg.className='msg'+(e?' e':'')},state=x=>tg.textContent=x?'⏸ Dừng':'▶ Phát';
function yid(u){try{let x=new URL(u),p=x.pathname.split('/').filter(Boolean),v=x.searchParams.get('v');if(x.hostname==='youtu.be')return p[0];if(/(^|\\.)youtube\\.com$/.test(x.hostname))return v||((['embed','shorts','live'].includes(p[0]))?p[1]:null)}catch{}}
function api(cb){if(window.YT?.Player)return cb();if(!loading){loading=true;window.onYouTubeIframeAPIReady=()=>cb();let s=document.createElement('script');s.src='https://www.youtube.com/iframe_api';document.head.appendChild(s)}else{let t=setInterval(()=>{if(window.YT?.Player){clearInterval(t);cb()}},100)}}
function stop(){au.pause();player?.pauseVideo?.();state(0)}
function play(u){u=u.trim();if(!/^https?:\/\//i.test(u))return say('Link không hợp lệ',1);stop();let id=yid(u);
if(id){mode='yt';say('Đang tải...');api(()=>{if(player)player.loadVideoById(id);else player=new YT.Player('yt',{width:200,height:200,videoId:id,playerVars:{autoplay:1,controls:0,playsinline:1},events:{onReady:e=>{e.target.setVolume(volume*100);e.target.playVideo()},onStateChange:e=>{if(e.data===1){state(1);say('Đang phát')}else if(e.data===2)state(0)},onError:()=>say('Video không phát được',1)}})})}
else{mode='au';au.src=u;au.play().then(()=>{state(1);say('Đang phát')}).catch(()=>say('Không phát được audio',1))}
try{localStorage.fbMusicUrl=u}catch{}}
mb.onclick=()=>pn.classList.toggle('on');$('cl').onclick=()=>pn.classList.remove('on');go.onclick=()=>play(i.value);i.onkeydown=e=>e.key==='Enter'&&play(i.value);
tg.onclick=()=>mode==='au'?(au.paused?au.play():au.pause()):mode==='yt'&&player?(player.getPlayerState()===1?player.pauseVideo():player.playVideo()):i.value&&play(i.value);
au.onplay=()=>mode==='au'&&state(1);au.onpause=()=>mode==='au'&&state(0);vl.oninput=()=>{volume=vl.value/100;au.volume=volume;player?.setVolume?.(+vl.value)};
try{i.value=localStorage.fbMusicUrl||''}catch{};})();
