const tracks=[
 {title:"Bloom Again",artist:"Luna Vale",duration:"0:24",mood:"Dreamy",tone:261.63},
 {title:"Velvet Sky",artist:"Raka Sora",duration:"0:24",mood:"Chill",tone:220.00},
 {title:"Soft Focus",artist:"Mira June",duration:"0:24",mood:"Focus",tone:329.63},
 {title:"Afterglow",artist:"North & Co.",duration:"0:24",mood:"Energy",tone:392.00},
 {title:"Sunday Air",artist:"Luna Vale",duration:"0:24",mood:"Chill",tone:246.94},
 {title:"Pink Horizon",artist:"Mira June",duration:"0:24",mood:"Dreamy",tone:293.66}
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
function updateButton(){playPause.textContent=isPlaying?"Ⅱ":"▶"}
function play(i){
  load(i);
  startSynth(currentIndex);
  updateButton();
}
function fmt(s){if(!isFinite(s))return"0:00";return `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}`}
function toast(msg){const el=document.getElementById("toast");el.textContent=msg;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2600)}
renderTracks(); load(0);

document.addEventListener("click",e=>{
  const p=e.target.closest("[data-play]"); if(p){play(Number(p.dataset.play))}
});
let isPlaying=false;
playPause.onclick=()=>{
  if(!isPlaying){ startSynth(currentIndex); isPlaying=true; updateButton(); }
  else { stopSynth(); if(synthCtx) synthCtx.suspend(); isPlaying=false; updateButton(); }
};
document.getElementById("next").onclick=()=>play((currentIndex+1)%tracks.length);
document.getElementById("prev").onclick=()=>play((currentIndex-1+tracks.length)%tracks.length);
audio.addEventListener("loadedmetadata",()=>duration.textContent=fmt(audio.duration));
audio.addEventListener("timeupdate",()=>{current.textContent=fmt(audio.currentTime);progress.value=audio.duration?(audio.currentTime/audio.duration)*100:0});
audio.addEventListener("ended",()=>play((currentIndex+1)%tracks.length));
progress.oninput=()=>{current.textContent=fmt((progress.value/100)*synthDuration)};
document.getElementById("volume").oninput=e=>{if(synthGain)synthGain.gain.value=e.target.value*.11};
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
