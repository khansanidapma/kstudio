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


/* =========================================================
   KSTUDIO AUTO-SCROLL + KARAOKE READER
   ========================================================= */
(() => {
  const IDLE_DELAY = 2000;
  const SCROLL_PX_PER_SECOND = 78; // ~2x the previous speed
  const TOP_RESET_MS = 260;
  const BOTTOM_GAP = 6;
  const SPEECH_RATE = 1.0;

  let idleTimer = null;
  let raf = null;
  let autoScrolling = false;
  let resetting = false;
  let lastFrame = 0;
  let currentElement = null;
  let spokenElement = null;

  const style = document.createElement("style");
  style.textContent = `
    .kstudio-karaoke-active {
      background: linear-gradient(
        transparent 12%,
        rgba(247,214,208,.85) 12%,
        rgba(247,214,208,.85) 88%,
        transparent 88%
      ) !important;
      border-radius: .25em;
      box-decoration-break: clone;
      -webkit-box-decoration-break: clone;
    }
    .kstudio-auto-status {
      position: fixed;
      right: 18px;
      bottom: 105px;
      z-index: 99999;
      padding: 8px 13px;
      border-radius: 999px;
      background: rgba(255,255,255,.94);
      color: #704354;
      box-shadow: 0 8px 28px rgba(60,30,45,.15);
      font: 700 12px/1.2 system-ui,sans-serif;
      opacity: 0;
      transform: translateY(6px);
      transition: .2s ease;
      pointer-events: none;
    }
    .kstudio-auto-status.show { opacity: 1; transform: translateY(0); }
  `;
  document.head.appendChild(style);

  const status = document.createElement("div");
  status.className = "kstudio-auto-status";
  status.textContent = "🎤 Karaoke reading";
  document.body.appendChild(status);

  function pageHeight() {
    return Math.max(
      document.documentElement.scrollHeight,
      document.body ? document.body.scrollHeight : 0
    );
  }

  function clearHighlight() {
    if (currentElement) currentElement.classList.remove("kstudio-karaoke-active");
    currentElement = null;
  }

  function stopVoice() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    clearHighlight();
    spokenElement = null;
  }

  function stopAutoScroll() {
    autoScrolling = false;
    resetting = false;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    lastFrame = 0;
    status.classList.remove("show");
    stopVoice();
  }

  function isReadable(el) {
    if (!el || !el.textContent || el.textContent.trim().length < 3) return false;
    if (el.closest("script,style,noscript,nav,button,input,textarea,select,[aria-hidden='true']")) return false;
    const r = el.getBoundingClientRect();
    return r.width > 10 && r.height > 0;
  }

  function getCandidate() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, {
      acceptNode(el) {
        if (!isReadable(el)) return NodeFilter.FILTER_REJECT;
        const tag = el.tagName;
        if (["P","H1","H2","H3","H4","LI","B","SPAN"].includes(tag)) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_SKIP;
      }
    });

    let best = null, bestScore = Infinity;
    const target = window.innerHeight * 0.38;
    let el;
    while ((el = walker.nextNode())) {
      const r = el.getBoundingClientRect();
      if (r.bottom < 30 || r.top > window.innerHeight - 30) continue;
      const score = Math.abs((r.top + r.height / 2) - target);
      if (score < bestScore) {
        bestScore = score;
        best = el;
      }
    }
    return best;
  }

  function speak(el) {
    if (!el || el === spokenElement || !("speechSynthesis" in window)) return;

    clearHighlight();
    window.speechSynthesis.cancel();

    spokenElement = el;
    currentElement = el;
    el.classList.add("kstudio-karaoke-active");

    const text = el.innerText.trim().replace(/\s+/g, " ");
    if (!text) return;

    const u = new SpeechSynthesisUtterance(text);
    u.lang = document.documentElement.lang || "id-ID";
    u.rate = SPEECH_RATE;
    u.pitch = 1;
    u.volume = 1;

    u.onend = () => {
      if (currentElement === el) clearHighlight();
    };
    u.onerror = () => {
      if (currentElement === el) clearHighlight();
    };

    window.speechSynthesis.speak(u);
  }

  function karaoke() {
    if (!autoScrolling || resetting) return;
    const candidate = getCandidate();
    if (candidate && candidate !== spokenElement) speak(candidate);
  }

  function resetToTop() {
    resetting = true;
    const start = window.scrollY;
    const started = performance.now();

    function step(now) {
      const t = Math.min(1, (now - started) / TOP_RESET_MS);
      const eased = 1 - Math.pow(1 - t, 3);
      window.scrollTo(0, Math.round(start * (1 - eased)));

      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        window.scrollTo(0, 0);
        stopVoice();
        spokenElement = null;
        resetting = false;
        if (autoScrolling) {
          lastFrame = performance.now();
          raf = requestAnimationFrame(scrollStep);
        }
      }
    }
    requestAnimationFrame(step);
  }

  function scrollStep(now) {
    if (!autoScrolling || resetting) return;

    if (!lastFrame) lastFrame = now;
    const dt = Math.min(50, now - lastFrame);
    lastFrame = now;

    const maxScroll = pageHeight() - window.innerHeight;

    if (maxScroll <= BOTTOM_GAP) {
      raf = requestAnimationFrame(scrollStep);
      return;
    }

    if (window.scrollY >= maxScroll - BOTTOM_GAP) {
      resetToTop();
      return;
    }

    window.scrollBy(0, SCROLL_PX_PER_SECOND * dt / 1000);
    karaoke();
    raf = requestAnimationFrame(scrollStep);
  }

  function startAutoScroll() {
    if (autoScrolling || pageHeight() <= window.innerHeight + BOTTOM_GAP) return;
    autoScrolling = true;
    status.classList.add("show");
    lastFrame = performance.now();
    raf = requestAnimationFrame(scrollStep);
  }

  function userActivity() {
    if (autoScrolling) stopAutoScroll();
    clearTimeout(idleTimer);
    idleTimer = setTimeout(startAutoScroll, IDLE_DELAY);
  }

  ["mousemove","mousedown","wheel","touchstart","touchmove","pointerdown","keydown","click"].forEach(type => {
    window.addEventListener(type, userActivity, {passive: true});
  });

  window.addEventListener("scroll", () => {
    if (!autoScrolling && !resetting) {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(startAutoScroll, IDLE_DELAY);
    }
  }, {passive: true});

  window.addEventListener("resize", () => {
    if (!autoScrolling) userActivity();
  }, {passive: true});

  // Initial 2-second inactivity countdown.
  clearTimeout(idleTimer);
  idleTimer = setTimeout(startAutoScroll, IDLE_DELAY);
})();

