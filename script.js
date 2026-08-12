const tracks=[
 {title:"Midnight Drive",artist:"KSTUDIO Selects",type:"Album",year:"2026",desc:"Synth-pop malam yang smooth untuk perjalanan panjang dan lampu kota.",img:"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=85"},
 {title:"Blue Hours",artist:"Luna Vale",type:"Album",year:"2026",desc:"Dreamy alternative pop untuk sore yang tenang.",img:"https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=85"},
 {title:"After Rain",artist:"Mira Sol",type:"Single",year:"2026",desc:"Melody hangat dengan nuansa acoustic modern.",img:"https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=85"},
 {title:"Neon Hearts",artist:"The Violets",type:"Album",year:"2025",desc:"Electro-pop penuh energi dengan chorus yang catchy.",img:"https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=900&q=85"},
 {title:"Cloud Nine",artist:"Aria Bloom",type:"Album",year:"2026",desc:"A dreamy collection made for slow mornings.",img:"https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=900&q=85"}
];
const playlists=[
 {name:"Late Night",desc:"For 2AM thoughts",img:"https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=85"},
 {name:"Main Character",desc:"Feel like the star",img:"https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=85"},
 {name:"Soft Sunday",desc:"Slow & easy",img:"https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=85"},
 {name:"Energy Boost",desc:"Turn it all the way up",img:"https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=900&q=85"}
];
const artists=[
 ["Luna Vale","https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"],
 ["Mira Sol","https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"],
 ["Aria Bloom","https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=400&q=80"],
 ["The Violets","https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"],
 ["Nova Rey","https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&q=80"]
];

function render(){
 document.getElementById("playlistGrid").innerHTML=playlists.map(p=>`<article class="playlist" data-name="${p.name}"><img src="${p.img}" alt="${p.name}"><div class="playlist-content"><h3>${p.name}</h3><p>${p.desc}</p></div></article>`).join("");
 document.getElementById("albumGrid").innerHTML=tracks.map(t=>`<article class="music" data-track="${t.title}"><div class="cover"><img src="${t.img}" alt="${t.title}" loading="lazy"><button class="play-mini">▶</button></div><h3>${t.title}</h3><p>${t.artist} • ${t.year}</p></article>`).join("");
 document.getElementById("artistGrid").innerHTML=artists.map(a=>`<article class="artist"><img src="${a[1]}" alt="${a[0]}" loading="lazy"><b>${a[0]}</b><small>Artist</small></article>`).join("");
}
render();

const $=id=>document.getElementById(id);
function toast(s){$("toast").textContent=s;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),2100)}
function play(name){
 const t=tracks.find(x=>x.title===name)||tracks[0];
 $("playerTitle").textContent=t.title;$("playerArtist").textContent=t.artist;$("playerImg").src=t.img;
 $("player").style.display="grid";$("toggle").textContent="Ⅱ";toast("Playing: "+t.title);
}
function modal(name){
 const t=tracks.find(x=>x.title===name)||tracks[0];
 $("modalImage").src=t.img;$("modalImage").alt=t.title;$("modalType").textContent=`${t.type} • ${t.year}`;
 $("modalTitle").textContent=t.title;$("modalDesc").textContent=t.desc;$("modal").classList.add("open");
 $("modalPlay").onclick=()=>{ $("modal").classList.remove("open");play(t.title); };
}
document.addEventListener("click",e=>{
 const m=e.target.closest("[data-track]"); if(m) {e.stopPropagation();play(m.dataset.track)}
 const p=e.target.closest("[data-play]"); if(p) play(p.dataset.play);
 const info=e.target.closest("[data-info]"); if(info) modal(info.dataset.info);
 const pl=e.target.closest(".playlist"); if(pl) toast("Playlist opened: "+pl.dataset.name);
});
$("modalClose").onclick=()=>$("modal").classList.remove("open");
$("modal").addEventListener("click",e=>{if(e.target.id==="modal")$("modal").classList.remove("open")});
$("toggle").onclick=()=>{$("toggle").textContent=$("toggle").textContent==="▶"?"Ⅱ":"▶";toast($("toggle").textContent==="Ⅱ"?"Playing":"Paused")};
$("prev").onclick=()=>toast("Previous track");
$("next").onclick=()=>toast("Next track");
$("closePlayer").onclick=()=>{$("player").style.display="none"};
$("profile").onclick=()=>toast("Profile demo: KN");
$("libraryBtn").onclick=()=>toast("Library demo — pilih album untuk menyimpannya.");
$("menu").onclick=()=>{$("nav").style.display=$("nav").style.display==="flex"?"none":"flex";$("nav").style.cssText="position:absolute;top:64px;left:0;right:0;padding:20px;background:#06111ff5;flex-direction:column;gap:18px;border-bottom:1px solid rgba(255,255,255,.09)"};

$("searchOpen").onclick=()=>{$("searchOverlay").classList.add("open");$("searchInput").focus()};
$("searchClose").onclick=()=>$("searchOverlay").classList.remove("open");
$("searchInput").addEventListener("input",()=>{
 const q=$("searchInput").value.toLowerCase().trim();
 const r=tracks.filter(t=>(t.title+" "+t.artist).toLowerCase().includes(q));
 $("results").innerHTML=q?(r.length?r.map(t=>`<div class="result" data-result="${t.title}"><b>${t.title}</b><br><small>${t.artist} • ${t.type} • ${t.year}</small></div>`).join(""):"<p style='color:#8190a4'>No results found.</p>"):"<p style='color:#8190a4;margin-top:25px'>Search your favorite songs, artists, or albums.</p>";
});
$("results").addEventListener("click",e=>{const x=e.target.closest("[data-result]");if(x){$("searchOverlay").classList.remove("open");modal(x.dataset.result)}});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){$("searchOverlay").classList.remove("open");$("modal").classList.remove("open")}});
