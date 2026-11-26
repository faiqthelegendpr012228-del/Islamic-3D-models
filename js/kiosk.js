/* =====================================================================
   kiosk.js  —  Self-running tour for the exhibition stand
   ---------------------------------------------------------------------
   Start it in any of these ways:
     • press K on the keyboard (homepage or any exhibit)
     • open the site with ?kiosk at the end of the link
     • click the "▶ Auto tour" button at the bottom of the homepage
   What it does, in a loop:
     1. slowly scrolls the homepage from space to the sea floor
     2. opens each exhibit and plays its narrated video (first 4 steps)
     3. goes back to the homepage and starts again
   Any touch, click or key press hands the site to the visitor.
   After 90 seconds with nobody touching it, the tour starts again
   by itself (and clears the wallet and passport for the next person).
   ===================================================================== */

(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const ORDER = ["clock", "sky", "atm", "market", "waqf", "ocean"];
  const STEPS_PER_TOPIC = 4;           // keep the loop moving: about a minute per exhibit
  const IDLE_RESTART = 90 * 1000;      // restart after 90 s of no interaction

  let running = false, armed = false;  // armed = kiosk was switched on at least once
  let timers = [], idleTimer = null, token = 0;

  // ---------- the little badge in the corner ----------
  const badge = document.createElement("div");
  badge.id = "kiosk-badge";
  badge.innerHTML = `<span class="kb-dot"></span><span data-i18n="kiosk.badge">Auto tour playing · touch anywhere to explore yourself</span>`;
  document.body.appendChild(badge);

  function later(fn, ms) { const t = setTimeout(fn, ms); timers.push(t); return t; }
  function clearAll() { timers.forEach(clearTimeout); timers = []; }

  function goHome() {
    if (window.VIDEO) VIDEO.stop();
    const homeBtn = document.querySelector('.nav-btn[data-view="home"]');
    if (document.body.dataset.screen !== "screen-topics" && homeBtn) homeBtn.click();
    ["journey", "passport", "certificate", "video-choice"].forEach((id) => { const m = $(id); if (m) m.classList.remove("open"); });
  }

  /** 1. scroll the dive slowly, stop by stop */
  function scrollDive(my, done) {
    goHome();
    const scroller = $("screen-topics");
    const stops = ["stop-hero"].concat(ORDER.map((id) => "stop-" + id), ["stop-end"]);
    let i = 0;
    (function next() {
      if (my !== token) return;
      if (i >= stops.length) { later(done, 1500); return; }
      const el = $(stops[i++]);
      if (el) scroller.scrollTo({ top: el.offsetTop, behavior: "smooth" });
      later(next, i === 1 ? 3500 : 3000);
    })();
  }

  /** 2. open each exhibit and play part of its video */
  function playTopics(my, k, done) {
    if (my !== token) return;
    if (k >= ORDER.length) { done(); return; }
    window.APP_ENTER(ORDER[k]);
    later(() => {
      if (my !== token) return;
      if (!window.VIDEO) { later(() => playTopics(my, k + 1, done), 15000); return; }
      let moved = false;
      const nextTopic = () => { if (moved || my !== token) return; moved = true; VIDEO.onend = null; later(() => playTopics(my, k + 1, done), 1200); };
      VIDEO.onend = nextTopic;
      VIDEO.tour();
      // stop after STEPS_PER_TOPIC steps (watch the step counter)
      const watch = setInterval(() => {
        if (my !== token) { clearInterval(watch); return; }
        const c = ($("vb-count") || {}).textContent || "";
        const n = parseInt(c, 10);
        if (n > STEPS_PER_TOPIC) { clearInterval(watch); nextTopic(); }
      }, 500);
      timers.push(watch);
      later(nextTopic, 100000);          // safety net: never stay on one exhibit too long
    }, 1800);
  }

  function loop(my) {
    if (my !== token) return;
    scrollDive(my, () => playTopics(my, 0, () => loop(my)));
  }

  function start() {
    if (running) return;
    running = armed = true;
    token++;
    clearTimeout(idleTimer);
    try { sessionStorage.setItem("signs-systems-kiosk", "1"); } catch (e) { /* ignore */ }
    // fresh visitor: clear wallet and passport
    if (window.PASSPORT) PASSPORT.newVisitor(); else if (window.WALLET) WALLET.reset();
    document.body.classList.add("kiosk");
    loop(token);
  }

  function stop() {
    if (!running) return;
    running = false; token++;
    clearAll();
    if (window.VIDEO) { VIDEO.onend = null; VIDEO.stop(); }
    document.body.classList.remove("kiosk");
    armIdle();
  }

  function armIdle() {
    clearTimeout(idleTimer);
    if (armed && !running) idleTimer = setTimeout(start, IDLE_RESTART);
  }

  // Any interaction hands control to the visitor (and resets the idle timer).
  // A short grace period after start ignores the click that started it.
  let startedAt = 0;
  const origStart = start;
  function startNow() { startedAt = Date.now(); origStart(); }
  ["pointerdown", "keydown", "wheel", "touchstart"].forEach((ev) =>
    window.addEventListener(ev, (e) => {
      if (ev === "keydown" && (e.key === "k" || e.key === "K") && !e.target.closest("input, textarea, select")) return;
      if (running && Date.now() - startedAt > 800) stop();
      else armIdle();
    }, { capture: true, passive: true }));

  window.addEventListener("keydown", (e) => {
    if ((e.key === "k" || e.key === "K") && !e.ctrlKey && !e.metaKey && !e.altKey && !e.target.closest("input, textarea, select")) {
      running ? stop() : startNow();
    }
  });

  window.KIOSK = { start: startNow, stop, get running() { return running; } };

  // start automatically with ?kiosk, or if it was on before a reload
  let wasOn = false;
  try { wasOn = sessionStorage.getItem("signs-systems-kiosk") === "1"; } catch (e) { /* ignore */ }
  if (/[?&]kiosk\b/.test(location.search) || wasOn) setTimeout(startNow, 1500);
})();
