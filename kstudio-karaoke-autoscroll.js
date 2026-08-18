
/* KStudio Auto Scroll + Karaoke Reader
   - Starts after 2 seconds of inactivity
   - Auto-scrolls at 2x the previous baseline
   - At bottom, quickly returns to top and repeats
   - Uses browser SpeechSynthesis for text-to-speech
   - Highlights the text currently being read
*/
(function () {
  'use strict';

  const IDLE_DELAY = 2000;
  const SCROLL_PX_PER_FRAME = 1.6; // ~2x a gentle 0.8 px/frame baseline
  const TOP_RESET_DURATION = 280;
  const SPEECH_RATE = 1.0;

  let idleTimer = null;
  let raf = null;
  let autoScrolling = false;
  let resetting = false;
  let lastActivity = Date.now();
  let speechStartedForNode = null;
  let currentNode = null;
  let currentUtterance = null;

  const style = document.createElement('style');
  style.textContent = `
    .kstudio-karaoke-active {
      background: linear-gradient(transparent 12%, rgba(247,214,208,.72) 12%, rgba(247,214,208,.72) 88%, transparent 88%);
      border-radius: .18em;
      transition: background .18s ease;
    }
    .kstudio-karaoke-status {
      position: fixed;
      right: 16px;
      bottom: 86px;
      z-index: 99999;
      padding: 8px 12px;
      border-radius: 999px;
      font: 600 12px/1.2 system-ui, sans-serif;
      background: rgba(255,255,255,.9);
      color: #6f4050;
      box-shadow: 0 6px 22px rgba(80,30,50,.12);
      backdrop-filter: blur(8px);
      pointer-events: none;
      opacity: 0;
      transform: translateY(5px);
      transition: .2s ease;
    }
    .kstudio-karaoke-status.show {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  const status = document.createElement('div');
  status.className = 'kstudio-karaoke-status';
  status.textContent = '🎤 Karaoke reading';
  document.body.appendChild(status);

  function showStatus(show) {
    status.classList.toggle('show', !!show);
  }

  function stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    currentUtterance = null;
    if (currentNode) currentNode.classList.remove('kstudio-karaoke-active');
    currentNode = null;
    speechStartedForNode = null;
  }

  function isReadable(el) {
    if (!el || !el.textContent || el.textContent.trim().length < 2) return false;
    if (el.closest('script,style,noscript,nav,button,input,textarea,select,[aria-hidden="true"]')) return false;
    const r = el.getBoundingClientRect();
    return r.height > 0 && r.width > 0;
  }

  function getTextNodes(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const p = node.parentElement;
        if (!p || !isReadable(p)) return NodeFilter.FILTER_REJECT;
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);
    return nodes;
  }

  function visibleTextNode() {
    const nodes = getTextNodes(document.body);
    const viewportCenter = window.innerHeight * 0.42;
    let best = null;
    let bestScore = Infinity;

    for (const node of nodes) {
      const r = node.parentElement.getBoundingClientRect();
      const center = r.top + r.height / 2;
      const visible = r.bottom > 40 && r.top < window.innerHeight - 40;
      if (!visible) continue;
      const score = Math.abs(center - viewportCenter);
      if (score < bestScore) {
        bestScore = score;
        best = node;
      }
    }
    return best;
  }

  function speakNode(node) {
    if (!node || node === speechStartedForNode || !('speechSynthesis' in window)) return;

    stopSpeech();
    speechStartedForNode = node;

    const text = node.nodeValue.trim().replace(/\s+/g, ' ');
    if (!text) return;

    node.parentElement.classList.add('kstudio-karaoke-active');
    currentNode = node.parentElement;

    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = SPEECH_RATE;
    utter.pitch = 1;
    utter.volume = 1;
    utter.lang = document.documentElement.lang || 'id-ID';

    utter.onend = () => {
      if (currentNode) currentNode.classList.remove('kstudio-karaoke-active');
      currentNode = null;
      currentUtterance = null;
    };
    utter.onerror = () => {
      if (currentNode) currentNode.classList.remove('kstudio-karaoke-active');
      currentNode = null;
      currentUtterance = null;
    };

    currentUtterance = utter;
    window.speechSynthesis.speak(utter);
  }

  function readVisible() {
    if (!autoScrolling) return;
    const node = visibleTextNode();
    if (node && node !== speechStartedForNode) speakNode(node);
  }

  function goTopFast() {
    resetting = true;
    const start = window.scrollY;
    const startTime = performance.now();

    function step(now) {
      const t = Math.min(1, (now - startTime) / TOP_RESET_DURATION);
      const eased = 1 - Math.pow(1 - t, 3);
      window.scrollTo(0, start * (1 - eased));
      if (t < 1) requestAnimationFrame(step);
      else {
        window.scrollTo(0, 0);
        resetting = false;
        speechStartedForNode = null;
        stopSpeech();
      }
    }
    requestAnimationFrame(step);
  }

  function tick() {
    if (!autoScrolling || resetting) return;

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 2) {
      raf = requestAnimationFrame(tick);
      return;
    }

    if (window.scrollY >= maxScroll - 2) {
      goTopFast();
      setTimeout(() => {
        if (autoScrolling) {
          speechStartedForNode = null;
          raf = requestAnimationFrame(tick);
        }
      }, TOP_RESET_DURATION + 40);
      return;
    }

    window.scrollBy(0, SCROLL_PX_PER_FRAME);
    readVisible();
    raf = requestAnimationFrame(tick);
  }

  function startAutoScroll() {
    if (autoScrolling) return;
    autoScrolling = true;
    showStatus(true);
    speechStartedForNode = null;
    raf = requestAnimationFrame(tick);
  }

  function stopAutoScroll() {
    autoScrolling = false;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    showStatus(false);
    stopSpeech();
  }

  function armIdleTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(startAutoScroll, IDLE_DELAY);
  }

  function activity() {
    lastActivity = Date.now();
    if (autoScrolling) stopAutoScroll();
    armIdleTimer();
  }

  ['mousemove','mousedown','wheel','touchstart','touchmove','keydown','pointerdown','pointermove'].forEach(evt => {
    window.addEventListener(evt, activity, {passive: true});
  });

  window.addEventListener('scroll', () => {
    // Ignore the scroll event generated by our own animation.
    if (!autoScrolling && !resetting) armIdleTimer();
  }, {passive: true});

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAutoScroll();
    else armIdleTimer();
  });

  armIdleTimer();
})();
