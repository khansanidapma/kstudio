const tracks=[
 {title:"Bloom Again",artist:"Luna Vale",duration:"0:24",mood:"Dreamy",src:"assets/audio/bloom-again.wav"},
 {title:"Velvet Sky",artist:"Raka Sora",duration:"0:24",mood:"Chill",src:"assets/audio/velvet-sky.wav"},
 {title:"Soft Focus",artist:"Mira June",duration:"0:24",mood:"Focus",src:"assets/audio/soft-focus.wav"},
 {title:"Afterglow",artist:"North & Co.",duration:"0:24",mood:"Energy",src:"assets/audio/afterglow.wav"},
 {title:"Sunday Air",artist:"Luna Vale",duration:"0:24",mood:"Chill",src:"assets/audio/sunday-air.wav"},
 {title:"Pink Horizon",artist:"Mira June",duration:"0:24",mood:"Dreamy",src:"assets/audio/pink-horizon.wav"}
];
const audio=document.getElementById("audio"), list=document.getElementById("trackList");
const title=document.getElementById("playerTitle"), artist=document.getElementById("playerArtist"), cover=document.getElementById("playerCover");
const playPause=document.getElementById("playPause"), progress=document.getElementById("progress"), current=document.getElementById("currentTime"), duration=document.getElementById("duration");
let currentIndex=0,isPlaying=false;

function renderTracks(filter=""){
 const items=tracks.filter(t=>!filter||`${t.title} ${t.artist} ${t.mood}`.toLowerCase().includes(filter.toLowerCase()));
 list.innerHTML=items.map(t=>{const i=tracks.indexOf(t);return `<article class="track"><div class="track-cover" style="background:${i%2?'linear-gradient(135deg,#F4C2C2,#A9DCCB)':'linear-gradient(135deg,#E88BAA,#F8D7E3)'}"></div><div><b>${t.title}</b><span>${t.artist} · ${t.mood}</span></div><span class="time">${t.duration}</span><button class="play-small" data-play="${i}" aria-label="Play ${t.title}">▶</button></article>`}).join("");
}
function load(i){currentIndex=(i+tracks.length)%tracks.length;const t=tracks[currentIndex];title.textContent=t.title;artist.textContent=t.artist;cover.style.background=currentIndex%2?"linear-gradient(135deg,#F4C2C2,#A9DCCB)":"linear-gradient(135deg,#E88BAA,#F8D7E3)";audio.src=t.src;audio.load();progress.value=0;current.textContent="0:00";duration.textContent=t.duration;updateButton()}
function play(i){load(i);audio.play().catch(()=>toast("Klik tombol Play untuk memulai musik."))}
function fmt(s){return isFinite(s)?`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}`:"0:00"}
function updateButton(){playPause.textContent=audio.paused?"▶":"Ⅱ"}

renderTracks();load(0);audio.volume=.75;
document.addEventListener("click",e=>{const p=e.target.closest("[data-play]");if(p)play(Number(p.dataset.play))});
playPause.onclick=()=>audio.paused?audio.play():audio.pause();
document.getElementById("next").onclick=()=>play(currentIndex+1);
document.getElementById("prev").onclick=()=>play(currentIndex-1);
audio.addEventListener("loadedmetadata",()=>duration.textContent=fmt(audio.duration));
audio.addEventListener("timeupdate",()=>{current.textContent=fmt(audio.currentTime);progress.value=audio.duration?audio.currentTime/audio.duration*100:0});
audio.addEventListener("play",updateButton);audio.addEventListener("pause",updateButton);audio.addEventListener("ended",()=>play(currentIndex+1));
progress.oninput=()=>{if(audio.duration)audio.currentTime=progress.value/100*audio.duration};
document.getElementById("volume").oninput=e=>audio.volume=e.target.value;
document.getElementById("searchInput").oninput=e=>renderTracks(e.target.value);
document.getElementById("shuffleBtn").onclick=()=>play(Math.floor(Math.random()*tracks.length));
document.querySelectorAll(".mood-card").forEach(b=>b.onclick=()=>{document.getElementById("searchInput").value=b.dataset.mood;renderTracks(b.dataset.mood);document.getElementById("trackList").scrollIntoView({behavior:"smooth",block:"center"})});
document.getElementById("themeToggle").onclick=()=>{document.body.classList.toggle("dark");localStorage.setItem("kstudio-dark",document.body.classList.contains("dark"))};
if(localStorage.getItem("kstudio-dark")==="true")document.body.classList.add("dark");
document.getElementById("menuToggle").onclick=()=>document.getElementById("sidebar").classList.toggle("open");
document.getElementById("waButton").onclick=()=>window.open("https://wa.me/6285150902999?text=Halo%20KSTUDIO,%20saya%20ingin%20bertanya%20tentang%20layanan%20KSTUDIO.","_blank","noopener");
document.getElementById("notifications").onclick=()=>toast("You're all caught up ✦");
document.getElementById("viewAll").onclick=()=>{document.getElementById("searchInput").value="";renderTracks();toast("Menampilkan semua rilisan")};
document.addEventListener("keydown",e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();document.getElementById("searchInput").focus()}});
