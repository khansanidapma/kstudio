const tracks=[["Pink Moon","KSTUDIO Selects","Playlist","Soft pink pop for little happy moments.","assets/pink-moon.svg"],["Sugar Rush","Luna Vale","Album","Sweet, sparkly pop with a little extra energy.","assets/sugar-rush.svg"],["Cloudy Sunday","Mira Sol","Album","Warm acoustic songs for a slow morning.","assets/cloudy-sunday.svg"],["Bubblegum Nights","The Violets","Album","Dreamy neon pop for late-night walks.","assets/bubblegum-nights.svg"],["Little Things","Aria Bloom","Single","A tiny song about noticing the good things.","assets/little-things.svg"]];
const artists=[["Luna Vale","assets/luna.svg"],["Mira Sol","assets/mira.svg"],["Aria Bloom","assets/aria.svg"],["The Violets","assets/violets.svg"],["Nova Rey","assets/nova.svg"]];
const $=x=>document.getElementById(x);
$("albumsGrid").innerHTML=tracks.map(t=>`<article class="music" onclick="play('${t[0]}')"><div class="cover"><img src="${t[4]}" alt="${t[0]}"></div><h3>${t[0]}</h3><p>${t[1]} • ${t[2]}</p></article>`).join("");
$("artistsGrid").innerHTML=artists.map(a=>`<article class="artist"><img src="${a[1]}" alt="${a[0]}"><b>${a[0]}</b><small>Artist</small></article>`).join("");
function toast(t){$("toast").textContent=t;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),1800)}
function play(name){const t=tracks.find(x=>x[0]===name)||tracks[0];$("pimg").src=t[4];$("ptitle").textContent=t[0];$("partist").textContent=t[1];$("player").style.display="flex";toast("Playing ♡ "+t[0])}
function openModal(name){const t=tracks.find(x=>x[0]===name)||tracks[0];$("mimg").src=t[4];$("mtype").textContent=t[2];$("mtitle").textContent=t[0];$("mdesc").textContent=t[3];$("modal").classList.add("open");$("mplay").onclick=()=>{play(t[0]);closeModal()}}
function closeModal(){$("modal").classList.remove("open")}
$("playBtn").onclick=()=>toast("Music player demo ♡");
$("searchBtn").onclick=()=>toast("Search feature coming soon ♡");