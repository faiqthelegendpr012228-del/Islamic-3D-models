/* =====================================================================
   dive.js  —  The homepage: one scroll from space to the sea floor
   ---------------------------------------------------------------------
   The six exhibits sit on one vertical journey:
     Space (Cosmic Clock) → Atmosphere (Sky Shield) → The Town
     (ATM, Market, Waqf) → The Sea (Ocean Depth Explorer)
   Each stop shows the exhibit, its key lesson and an "Enter" button
   that opens the normal start screen (app.js → window.APP_OPEN).
   ===================================================================== */

(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);

  // Order of the journey + the "where are we" label for each stop
  const STOPS = [
    { id: "clock",  zone: "space",  zoneName: "Space",        depth: "384,400 km up" },
    { id: "sky",    zone: "sky",    zoneName: "Atmosphere",   depth: "100 km up" },
    { id: "atm",    zone: "town",   zoneName: "The Town",     depth: "Ground level" },
    { id: "market", zone: "town",   zoneName: "The Market",   depth: "Ground level" },
    { id: "waqf",   zone: "town",   zoneName: "The Village",  depth: "Ground level" },
    { id: "ocean",  zone: "sea",    zoneName: "The Deep Sea", depth: "1,000 m down" }
  ];

  function topicById(id) { return window.TOPICS.find((t) => t.id === id); }

  // Small decorative scenery for each zone (pure CSS/SVG, no images)
  function scenery(zone, i) {
    if (zone === "space") {
      return `<div class="sc-stars"></div><div class="sc-stars s2"></div>
              <div class="sc-sun parallax" data-speed="0.25"></div>
              <div class="sc-moon parallax" data-speed="0.45"></div>`;
    }
    if (zone === "sky") {
      return `<div class="sc-earth parallax" data-speed="0.2"></div>
              <div class="sc-cloud c1 parallax" data-speed="0.5"></div>
              <div class="sc-cloud c2 parallax" data-speed="0.35"></div>
              <div class="sc-meteor"></div><div class="sc-meteor m2"></div>`;
    }
    if (zone === "town") {
      return (i === 2 ? `<div class="sc-cloud c3 parallax" data-speed="0.4"></div>` : "") +
        `<svg class="sc-skyline" viewBox="0 0 1200 220" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 220 V150 H70 V120 H130 V150 H190 V100 H215 V60 L225 40 L235 60 V100 H260 V150 H320
                   V130 Q370 70 420 130 V150 H480 V115 H560 V150 H610 V90 H690 V150 H760
                   V125 Q800 85 840 125 V150 H900 V105 H930 V55 L940 35 L950 55 V105 H980 V150
                   H1040 V120 H1110 V150 H1200 V220 Z"/>
        </svg>`;
    }
    // sea
    return `<svg class="sc-wave" viewBox="0 0 1200 60" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 30 Q75 0 150 30 T300 30 T450 30 T600 30 T750 30 T900 30 T1050 30 T1200 30 V60 H0Z"/>
            </svg>
            <div class="sc-bubbles"><span></span><span></span><span></span><span></span><span></span><span></span></div>
            <div class="sc-rays"></div>`;
  }

  const usedRefs = new Set();

  function stopHtml(s, i) {
    const t = topicById(s.id);
    if (!t) return "";
    // show a verse/lesson not already shown at an earlier stop
    const refId = t.refs.find((r) => !usedRefs.has(r) && window.REFERENCES[r] && window.REFERENCES[r].lesson) || t.refs[0];
    usedRefs.add(refId);
    const firstRef = window.REFERENCES[refId];
    const refNames = t.refs.slice(0, 3).map((r) => window.REFERENCES[r].ref.replace(/ \(.*\)/, "")).join(" · ");
    const side = i % 2 === 0 ? "left" : "right";
    return `
      <section class="dive-stop zone-${s.zone}" id="stop-${s.id}" data-index="${i}" style="--c:${t.accent}">
        <div class="sc">${scenery(s.zone, i)}</div>
        <article class="stop-card ${side}">
          <div class="stop-meta"><span class="stop-num">${i + 1}</span>${s.zoneName} · ${t.category}<span class="stop-badge">🛂 Stamped</span></div>
          <div class="stop-icon">${t.icon}</div>
          <h2>${t.title}</h2>
          <p class="stop-sub">${t.subtitle}</p>
          ${firstRef && firstRef.lesson ? `<blockquote class="stop-lesson">“${firstRef.lesson}”<cite>${firstRef.ref}</cite></blockquote>` : ""}
          <div class="stop-refs">📖 ${refNames}</div>
          <button class="btn accent stop-enter" data-topic="${t.id}">Enter exhibit ▶</button>
        </article>
      </section>`;
  }

  function build() {
    const root = $("dive");
    if (!root || !window.TOPICS) return;
    const cfg = window.APP_CONFIG || {};

    root.innerHTML = `
      <section class="dive-stop dive-hero zone-space" id="stop-hero">
        <div class="sc"><div class="sc-stars"></div><div class="sc-stars s2"></div></div>
        <div class="hero-inner">
          <div class="kicker">${cfg.schoolName || "Islamic Studies Project"}</div>
          <h1 class="title-xl">Signs &amp; Systems</h1>
          <p class="subtitle">Don't just read the Qur'an's teachings. Explore them.</p>
          <div class="divider">✦</div>
          <p class="hero-text">Six interactive 3D exhibits on one journey, from the Moon's orbit to the bottom of the sea.
             Scroll down to begin the dive.</p>
          <button class="btn ghost small hero-kiosk" id="hero-kiosk" title="The website plays all six exhibits by itself (or press K)">▶ Auto tour</button>
          <div class="hero-scroll" aria-hidden="true"><span></span></div>
        </div>
      </section>
      ${STOPS.map(stopHtml).join("")}
      <section class="dive-stop dive-end zone-floor" id="stop-end">
        <div class="screen-inner">
          <div class="kicker">The sea floor</div>
          <h2 class="end-title">You've reached the bottom</h2>
          <p class="subtitle">From the sky above to the depths below: <i>signs for people who reflect.</i> Jump straight to any exhibit:</p>
          <div id="topic-list"></div>
          <button class="btn ghost" id="dive-top">↑ Back to space</button>
          <div class="end-tools">
            <button class="btn ghost small" id="dive-glossary">📚 Glossary</button>
            <button class="btn ghost small" id="dive-kiosk" title="The website plays all six exhibits by itself (or press K)">▶ Auto tour</button>
          </div>
          <p class="credit-line">${(cfg.members || []).map((m) => m.name).join(" · ")} · ${cfg.className || ""}</p>
        </div>
      </section>`;

    // Side rail: one dot per stop
    $("dive-rail").innerHTML =
      `<div class="rail-depth" id="rail-depth">Start</div>` +
      STOPS.map((s) => {
        const t = topicById(s.id);
        return `<button class="rail-dot" data-target="stop-${s.id}" style="--c:${t.accent}" title="${t.title}">
                  <span class="rail-label">${t.icon} ${t.title}</span></button>`;
      }).join("");

    // Buttons
    root.querySelectorAll(".stop-enter").forEach((b) =>
      b.addEventListener("click", () => window.APP_OPEN && window.APP_OPEN(b.dataset.topic)));
    $("dive-rail").querySelectorAll(".rail-dot").forEach((b) =>
      b.addEventListener("click", () => $(b.dataset.target).scrollIntoView({ behavior: "smooth" })));
    $("dive-top").addEventListener("click", () => $("stop-hero").scrollIntoView({ behavior: "smooth" }));
    $("dive-kiosk").addEventListener("click", () => window.KIOSK && KIOSK.start());
    $("hero-kiosk").addEventListener("click", () => window.KIOSK && KIOSK.start());
    $("dive-glossary").addEventListener("click", () => window.GLOSSARY && GLOSSARY.open());

    // Cards fade/slide in when they come into view; the rail follows along
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        const idx = e.target.dataset.index;
        const dots = $("dive-rail").querySelectorAll(".rail-dot");
        dots.forEach((d, j) => d.classList.toggle("on", String(j) === idx));
        const stop = STOPS[idx];
        $("rail-depth").textContent = stop ? stop.depth : (e.target.id === "stop-end" ? "Sea floor" : "Start");
        $("dive-rail").classList.toggle("hidden", e.target.id === "stop-hero");
      });
    }, { threshold: 0.45 });
    root.querySelectorAll(".dive-stop").forEach((s) => io.observe(s));

    // Passport stamps shown on the cards and the rail
    function showStamps() {
      if (!window.PASSPORT) return;
      STOPS.forEach((st, j) => {
        const has = PASSPORT.has(st.id);
        const card = root.querySelector(`#stop-${st.id} .stop-card`);
        if (card) card.classList.toggle("stamped", has);
        const dot = $("dive-rail").querySelectorAll(".rail-dot")[j];
        if (dot) dot.classList.toggle("stamped", has);
      });
    }
    if (window.PASSPORT) PASSPORT.onChange(showStamps);
    showStamps();

    // Gentle parallax on the scenery
    const scroller = $("screen-topics");
    const layers = root.querySelectorAll(".parallax");
    let ticking = false;
    scroller.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        layers.forEach((el) => {
          const stop = el.closest(".dive-stop");
          const offset = stop.getBoundingClientRect().top;
          el.style.transform = `translateY(${(-offset * parseFloat(el.dataset.speed)).toFixed(1)}px)`;
        });
        ticking = false;
      });
    }, { passive: true });
  }

  build();
})();
