const tracks=[
 {title:"Bloom Again",artist:"Luna Vale",duration:"3:12",mood:"Dreamy",src:"https://cdn.pixabay.com/download/audio/2022/03/15/audio_8c0f6a2f72.mp3"},
 {title:"Velvet Sky",artist:"Raka Sora",duration:"2:48",mood:"Chill",src:"https://cdn.pixabay.com/download/audio/2022/10/30/audio_946f2a16f0.mp3"},
 {title:"Soft Focus",artist:"Mira June",duration:"3:36",mood:"Focus",src:"https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3"},
 {title:"Afterglow",artist:"North & Co.",duration:"3:04",mood:"Energy",src:"https://cdn.pixabay.com/download/audio/2022/08/23/audio_2d4d0f0e8d.mp3"},
 {title:"Sunday Air",artist:"Luna Vale",duration:"2:31",mood:"Chill",src:"https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a7342d.mp3"},
 {title:"Pink Horizon",artist:"Mira June",duration:"3:20",mood:"Dreamy",src:"https://cdn.pixabay.com/download/audio/2022/02/23/audio_d1718ab7c0.mp3"}
];

const audio=document.getElementById("audio"), list=document.getElementById("trackList");
const title=document.getElementById("playerTitle"), artist=document.getElementById("playerArtist"), cover=document.getElementById("playerCover");
const playPause=document.getElementById("playPause"), progress=document.getElementById("progress"), current=document.getElementById("currentTime"), duration=document.getElementById("duration");
let currentIndex=0;

function renderTracks(filter=""){
  const items=tracks.filter(t=>!filter||`${t.title} ${t.artist} ${t.mood}`.toLowerCase().includes(filter.toLowerCase()));
  list.innerHTML=items.map(t=>{
    const i=tracks.indexOf(t);
    return `<article class="track"><div class="track-cover" style="background:${i%2?'linear-gradient(135deg,#F4C2C2,#A9DCCB)':'linear-gradient(135deg,#E88BAA,#F8D7E3)'}"></div>
      <div><b>${t.title}</b><span>${t.artist} · ${t.mood}</span></div><span class="time">${t.duration}</span>
      <button class="play-small" data-play="${i}" aria-label="Play ${t.title}">▶</button></article>`
  }).join("");
}
function load(i,auto=false){
  currentIndex=(i+tracks.length)%tracks.length; const t=tracks[currentIndex];
  audio.src=t.src; title.textContent=t.title; artist.textContent=t.artist;
  cover.style.background=currentIndex%2?"linear-gradient(135deg,#F4C2C2,#A9DCCB)":"linear-gradient(135deg,#E88BAA,#F8D7E3)";
  if(auto) audio.play().catch(()=>toast("Tekan Play untuk memulai audio")); updateButton();
}
function updateButton(){playPause.textContent=audio.paused?"▶":"Ⅱ"}
function play(i){load(i); audio.play().then(updateButton).catch(()=>toast("Audio demo siap — tekan Play lagi jika browser memblokir autoplay"))}
function fmt(s){if(!isFinite(s))return"0:00";return `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}`}
function toast(msg){const el=document.getElementById("toast");el.textContent=msg;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2600)}
renderTracks(); load(0);

document.addEventListener("click",e=>{
  const p=e.target.closest("[data-play]"); if(p){play(Number(p.dataset.play))}
});
playPause.onclick=()=>{if(audio.paused) audio.play().then(updateButton); else audio.pause();updateButton()};
document.getElementById("next").onclick=()=>play((currentIndex+1)%tracks.length);
document.getElementById("prev").onclick=()=>play((currentIndex-1+tracks.length)%tracks.length);
audio.addEventListener("loadedmetadata",()=>duration.textContent=fmt(audio.duration));
audio.addEventListener("timeupdate",()=>{current.textContent=fmt(audio.currentTime);progress.value=audio.duration?(audio.currentTime/audio.duration)*100:0});
audio.addEventListener("ended",()=>play((currentIndex+1)%tracks.length));
progress.oninput=()=>{if(audio.duration)audio.currentTime=(progress.value/100)*audio.duration};
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
