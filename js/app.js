/* =====================================================================
   app.js  —  The "engine" that runs every topic
   ---------------------------------------------------------------------
   What this file does:
     1. Builds the topic chooser and start screen from content.js.
     2. Creates ONE Three.js renderer, camera and OrbitControls.
     3. Loads the chosen topic's scene file (js/scenes/xxx.js) and gives
        it a "ctx" (context) object full of helper functions.
     4. Runs the animation loop (about 60 frames per second).
     5. Handles clicks on 3D objects (raycasting) and floating hotspots.
     6. Shows the info panel, references, real-life, quiz, credits and
        Presentation Mode.
   ===================================================================== */

(function () {
  "use strict";

  const CFG = window.APP_CONFIG;
  const $ = (id) => document.getElementById(id);

  // ---------- Safety check: Three.js must load from the internet ----------
  if (typeof THREE === "undefined" || !THREE.OrbitControls) {
    $("loading").innerHTML = "<div style='max-width:640px;text-align:center'>⚠️ The 3D engine could not load.<br><small>Please connect to the internet (Three.js is loaded from a CDN) and reload the page.</small></div>";
    return;
  }
  $("loading").classList.add("hide");

  // =====================================================================
  // STATE
  // =====================================================================
  let topic = null;        // the current topic object from content.js
  let sceneApi = null;     // what the scene file returned (update, actions…)
  let hotspots = [];       // floating labels attached to 3D positions
  let clickables = [];     // {object, fn} — 3D meshes the user can click
  let tweens = [];         // running smooth animations
  let currentView = "explore";

  // =====================================================================
  // 1. TOPIC CHOOSER
  // =====================================================================

  function buildTopicList() {
    const cats = [...new Set(TOPICS.map((t) => t.category))];
    let html = "";
    cats.forEach((cat) => {
      html += `<h2 class="cat-title">✦ ${cat}</h2><div class="topic-grid">`;
      TOPICS.forEach((t, i) => {
        if (t.category !== cat) return;
        const refNames = t.refs.slice(0, 3).map((r) => REFERENCES[r].ref.replace(/ \(.*\)/, "")).join(" · ");
        html += `<button class="topic-card" style="--c:${t.accent}" data-topic="${t.id}">
          <span class="t-num">${i + 1}</span>
          <div class="t-icon">${t.icon}</div>
          <h3>${t.title}</h3>
          <p>${t.subtitle}</p>
          <div class="t-refs">📖 ${refNames}</div>
        </button>`;
      });
      html += "</div>";
    });
    $("topic-list").innerHTML = html;
    $("topic-list").querySelectorAll(".topic-card").forEach((b) =>
      b.addEventListener("click", () => showStart(b.dataset.topic)));
  }

  function showScreen(id) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    $("app").classList.remove("active");
    if (id === "app") $("app").classList.add("active");
    else $(id).classList.add("active");
    document.body.dataset.screen = id;
    // the wallet button shows on the homepage and in the finance exhibits
    if (window.WALLET) WALLET.showChip(id === "screen-topics" || (id === "app" && topic && topic.category === "Financial Contracts"));
  }

  // =====================================================================
  // 2. START SCREEN
  // =====================================================================
  function showStart(id) {
    topic = TOPICS.find((t) => t.id === id) || TOPICS[0];
    document.documentElement.style.setProperty("--accent", topic.accent);
    $("start-icon").textContent = topic.icon;
    $("start-cat").textContent = topic.category;
    $("start-title").textContent = topic.title;
    $("start-sub").textContent = topic.subtitle;
    $("start-class").textContent = CFG.className + " · " + CFG.teacherName;
    $("start-members").innerHTML = CFG.members
      .map((m, i) => `<div class="member-chip">${m.name}<small>${CFG.members.length === 1 ? "Presenter" : "Member " + (i + 1)}</small></div>`).join("");
    location.hash = topic.id;
    showScreen("screen-start");
  }

  window.APP_OPEN = showStart;   // used by the dive homepage (dive.js)
  window.APP_ENTER = (id) => openTopic(id);   // used by the wallet journey (wallet.js)
  window.APP_QUIZ = (id) => { openTopic(id); setView("quiz"); };   // used by the passport (passport.js)

  $("btn-back-topics").onclick = () => { location.hash = ""; showScreen("screen-topics"); };
  $("btn-start").onclick = () => openTopic(topic.id);

  // =====================================================================
  // 3. THREE.JS SETUP (created once, reused by every topic)
  // =====================================================================
  const canvas = $("scene-canvas");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  // Limit pixel ratio so it runs smoothly on school laptops
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 5000);
  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;        // smooth "glide" when you let go
  controls.dampingFactor = 0.08;

  let scene = new THREE.Scene();
  const clock = new THREE.Clock();

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Shift the picture left so the 3D model sits in the middle of the area
    // NOT covered by the right-hand panel (the canvas still fills the screen).
    const panelOpen = currentView === "explore" && w > 860;
    if (panelOpen) camera.setViewOffset(w, h, (Math.min(440, w * 0.4) + 32) / 2, 0, w, h);
    else camera.clearViewOffset();
    camera.updateProjectionMatrix();
  }
  // The top bar wraps onto 2 rows on narrower screens. Measure its real height
  // so the side panels and overlays always start just below it.
  function measureTopbar() {
    document.documentElement.style.setProperty("--topbar-h", $("topbar").offsetHeight + "px");
  }
  if (window.ResizeObserver) new ResizeObserver(measureTopbar).observe($("topbar"));
  window.addEventListener("resize", measureTopbar);
  measureTopbar();
  window.addEventListener("resize", resize);
  resize();

  // =====================================================================
  // 4. THE CONTEXT ("ctx") GIVEN TO EACH SCENE FILE
  // =====================================================================
  function makeCtx() {
    return {
      THREE, scene, camera, controls, renderer, topic, config: CFG,
      tools: $("tools"),

      /** Format money with the currency from config.js */
      money(n) {
        const neg = n < 0;
        // whole numbers show no decimals; amounts like 41,437.50 keep 2 decimals
        const a = Math.round(Math.abs(n) * 100) / 100;
        const opts = Number.isInteger(a) ? {} : { minimumFractionDigits: 2, maximumFractionDigits: 2 };
        return (neg ? "−" : "") + CFG.currency + a.toLocaleString("en-US", opts);
      },

      /** Open the info panel for topic.info[key] */
      info: (key) => showInfo(key),

      /** Show a short notification at the top */
      toast,

      /** Make a 3D object clickable */
      clickable(object, fn) { clickables.push({ object, fn }); },

      /**
       * Add a floating label that follows a 3D point.
       * target: THREE.Vector3 or an Object3D;  onClick: info key string or function
       * opts.offset: Vector3 added to the position; opts.visible(): return false to hide
       */
      hotspot(target, text, onClick, opts) {
        opts = opts || {};
        const el = document.createElement("button");
        el.className = "hotspot";
        el.innerHTML = text;
        el.onclick = (e) => {
          e.stopPropagation();
          if (typeof onClick === "string") showInfo(onClick); else if (onClick) onClick();
        };
        $("labels").appendChild(el);
        const h = { el, target, offset: opts.offset || new THREE.Vector3(), visible: opts.visible, hideBehind: opts.hideBehind };
        hotspots.push(h);
        return h;
      },
      removeHotspot(h) {
        h.el.remove();
        hotspots = hotspots.filter((x) => x !== h);
      },

      /** Smoothly move the camera to a new position looking at a target */
      flyTo(pos, target, seconds) {
        const p0 = camera.position.clone(), t0 = controls.target.clone();
        const p1 = new THREE.Vector3().copy(pos), t1 = new THREE.Vector3().copy(target);
        tween(seconds || 1.5, (k) => {
          camera.position.lerpVectors(p0, p1, k);
          controls.target.lerpVectors(t0, t1, k);
        }, null, "camera");
      },

      /** Run fn(progress 0→1) over `seconds`, then call done().
          Give a "tag" so a new animation with the same tag replaces the old one. */
      tween,

      /** Like setTimeout, but cancelled automatically when the step or topic changes */
      later(fn, ms) { timers.push(setTimeout(fn, ms)); },

      /** Change which view is showing (explore/refs/life/quiz…) */
      view: (v) => setView(v),

      /** Build a reference card HTML (used in tool panels) */
      refCard
    };
  }

  function tween(seconds, fn, done, tag) {
    if (tag) tweens = tweens.filter((tw) => tw.tag !== tag);
    tweens.push({ t: 0, dur: Math.max(0.01, seconds), fn, done, tag });
  }
  let timers = [];
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  // =====================================================================
  // 5. OPEN A TOPIC (build its 3D scene)
  // =====================================================================
  function openTopic(id) {
    topic = TOPICS.find((t) => t.id === id);
    document.documentElement.style.setProperty("--accent", topic.accent);
    clearScene();

    $("tb-icon").textContent = topic.icon;
    $("tb-cat").textContent = topic.category;
    $("tb-title").textContent = topic.title;
    $("tools").innerHTML = "";

    // default camera; each scene sets its own
    camera.position.set(0, 5, 12);
    controls.target.set(0, 0, 0);
    controls.minDistance = 1; controls.maxDistance = 500;
    controls.maxPolarAngle = Math.PI;
    controls.enablePan = true;

    $("scene-note").textContent = "Drag to rotate · Scroll to zoom · Right-drag to move";
    showScreen("app");
    resize();

    const builder = TOPIC_SCENES[topic.id];
    sceneApi = builder(makeCtx()) || {};
    controls.update();

    buildRefsView();
    buildLifeView();
    setView("explore");
  }

  /** Remove everything from the previous topic and free GPU memory */
  function clearScene() {
    stopPresentation();
    if (sceneApi && sceneApi.dispose) sceneApi.dispose();
    scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach((m) => { if (m.map) m.map.dispose(); m.dispose(); });
      }
    });
    scene = new THREE.Scene();
    hotspots.forEach((h) => h.el.remove());
    hotspots = []; clickables = []; tweens = [];
    clearTimers();
    sceneApi = null;
    closeInfo();
  }

  // =====================================================================
  // 6. ANIMATION LOOP
  // =====================================================================
  const tmpV = new THREE.Vector3();
  function loop() {
    requestAnimationFrame(loop);
    if (!$("app").classList.contains("active")) return;
    const dt = Math.min(clock.getDelta(), 0.05);   // seconds since last frame
    const time = clock.elapsedTime;

    // run tweens (copy the list first, because a tween may start another one)
    tweens.slice().forEach((tw) => {
      if (tweens.indexOf(tw) < 0) return;
      tw.t += dt;
      const k = Math.min(1, tw.t / tw.dur);
      tw.fn(H3.ease(k));
      if (k >= 1) { tweens = tweens.filter((x) => x !== tw); if (tw.done) tw.done(); }
    });

    if (sceneApi && sceneApi.update) sceneApi.update(dt, time);
    controls.update();
    renderer.render(scene, camera);
    updateHotspots();
  }

  /** Move each HTML hotspot label to where its 3D point appears on screen */
  function updateHotspots() {
    const w = window.innerWidth, h = window.innerHeight;
    const camDir = new THREE.Vector3();
    hotspots.forEach((hs) => {
      if (hs.target.isObject3D) hs.target.getWorldPosition(tmpV); else tmpV.copy(hs.target);
      tmpV.add(hs.offset);
      let show = !(hs.visible && !hs.visible());
      // hide labels on the far side of a sphere (e.g. behind the Earth)
      if (show && hs.hideBehind) {
        camDir.copy(camera.position).sub(hs.hideBehind);
        const p = tmpV.clone().sub(hs.hideBehind);
        if (p.dot(camDir) < 0) show = false;
      }
      const v = tmpV.project(camera);
      if (v.z > 1 || v.z < -1) show = false;
      hs.el.style.display = show ? "flex" : "none";
      if (show) {
        hs.el.style.left = ((v.x + 1) / 2) * w + "px";
        hs.el.style.top = ((1 - v.y) / 2) * h + "px";
      }
    });
  }
  loop();

  // =====================================================================
  // 7. CLICKING 3D OBJECTS (raycasting)
  // A "ray" is fired from the camera through the mouse position; the first
  // clickable object it hits gets its function called.
  // =====================================================================
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let downPos = null;

  function pick(e) {
    const r = canvas.getBoundingClientRect();
    mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const objs = clickables.map((c) => c.object).filter((o) => o.visible);
    const hits = raycaster.intersectObjects(objs, true);
    if (!hits.length) return null;
    // walk up from the hit mesh to find which registered object it belongs to
    let o = hits[0].object;
    while (o) {
      const c = clickables.find((c) => c.object === o);
      if (c) return c;
      o = o.parent;
    }
    return null;
  }
  canvas.addEventListener("pointerdown", (e) => { downPos = { x: e.clientX, y: e.clientY }; });
  canvas.addEventListener("pointerup", (e) => {
    if (!downPos) return;
    const moved = Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y);
    downPos = null;
    if (moved > 6) return;                // it was a drag (rotate), not a click
    const c = pick(e);
    if (c) c.fn();
  });
  canvas.addEventListener("pointermove", (e) => {
    if (e.buttons) return;
    canvas.style.cursor = pick(e) ? "pointer" : "grab";
  });

  // =====================================================================
  // 8. INFO PANEL + REFERENCE CARDS
  // =====================================================================
  /** HTML for one Qur'an / Hadith reference (Arabic placeholder if not pasted yet) */
  function refCard(id) {
    const r = REFERENCES[id];
    if (!r) return `<div class="ref-card">Missing reference: ${id}</div>`;
    const isPlaceholder = !r.arabic || r.arabic.indexOf(window.ARABIC_PLACEHOLDER) === 0;
    const arabic = isPlaceholder
      ? `<div class="arabic placeholder">📝 ARABIC TEXT PLACEHOLDER: copy from <u>${r.link.replace("https://", "")}</u> and paste into js/references.js → "${id}"</div>`
      : `<div class="arabic">${r.arabic}</div>`;
    const src = r.type === "quran" ? "Translation: Sahih International" : "Translation: sunnah.com";
    return `<div class="ref-card">
      <div class="ref-type">${r.type === "quran" ? "📖 Qur'an" : "📜 Hadith"}</div>
      <div class="ref-title">${r.ref}</div>
      ${arabic}
      <div class="ref-text">“${r.translation}”</div>
      <div class="ref-src">${src} · <a href="${r.link}" target="_blank" rel="noopener">verify: ${r.link.replace("https://", "")}</a></div>
    </div>`;
  }

  function showInfo(key) {
    const it = topic.info[key];
    if (!it) return;
    let html = `<h2>${it.title}</h2>`;
    html += `<div class="box science"><div class="box-tag">${topic.category === "Scientific Miracles" ? "🔬 The science" : "💡 Explanation"}</div>${it.text}</div>`;
    if (it.note) html += `<div class="box reflect"><div class="box-tag">💭 Reflection</div><p>${it.note}</p></div>`;
    if (it.refs && it.refs.length) {
      html += `<div class="label-sm" style="margin-top:16px">Islamic reference${it.refs.length > 1 ? "s" : ""}</div>`;
      html += it.refs.map(refCard).join("");
    }
    $("info-body").innerHTML = html;
    $("info").classList.add("open");
    $("info").scrollTop = 0;
  }
  function closeInfo() { $("info").classList.remove("open"); }
  $("info-close").onclick = closeInfo;

  function toast(msg, ms) {
    const t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove("show"), ms || 2600);
  }

  // =====================================================================
  // 9. VIEWS: explore / references / real life / quiz / credits
  // =====================================================================
  document.querySelectorAll(".nav-btn").forEach((b) => b.addEventListener("click", () => setView(b.dataset.view)));

  function setView(v) {
    if (v === "home") { clearScene(); location.hash = ""; showScreen("screen-topics"); return; }
    if (v === "present") { startPresentation(); return; }
    currentView = v;
    document.querySelectorAll(".nav-btn").forEach((b) => b.classList.toggle("on", b.dataset.view === v));
    ["refs", "life", "quiz", "credits"].forEach((n) => $("view-" + n).classList.toggle("open", n === v));
    $("tools").style.display = v === "explore" ? "" : "none";
    resize();
    if (v !== "explore") closeInfo();
    if (v === "quiz") startQuiz();
    if (v === "credits") buildCredits();
    if (v !== "explore" && presenting) stopPresentation();
  }

  function buildRefsView() {
    $("refs-body").innerHTML = `
      <h2>📖 Qur'an &amp; Hadith References</h2>
      <p class="lead">Every verse and hadith used in <b>${topic.title}</b>. All references are stored in <code>js/references.js</code> for checking.</p>
      <div class="ref-grid">${topic.refs.map(refCard).join("")}</div>`;
  }

  function buildLifeView() {
    $("life-body").innerHTML = `
      <h2>🏠 Real-Life Connection</h2>
      <p class="lead">How this teaching applies to students and families <b>today</b>. Click a card for a challenge to try this week.</p>
      <div class="life-grid">${topic.realLife.map((r, i) => `
        <div class="life-card" data-i="${i}">
          <div class="li-icon">${r.icon}</div>
          <h3>${r.title}</h3>
          <p>${r.text}</p>
          <div class="li-try">✅ This week's challenge: try this with your family and share what happened!</div>
        </div>`).join("")}
      </div>`;
    $("life-body").querySelectorAll(".life-card").forEach((c) => c.addEventListener("click", () => c.classList.toggle("flipped")));
  }

  function buildCredits() {
    const colors = ["#2fbf9b", "#4fa8ff", "#e0b04a", "#b28cff"];
    $("credits-body").innerHTML = `
      <h2>⭐ Credits</h2>
      <p class="lead">${topic.icon} ${topic.title}<br>${CFG.schoolName} · ${CFG.className} · ${CFG.teacherName}</p>
      <div class="credits-grid">${CFG.members.map((m, i) => `
        <div class="credit-card">
          <div class="avatar" style="background:${colors[i % 4]}">${(m.name.trim()[0] || "?").toUpperCase()}</div>
          <h3>${m.name}</h3><p>${m.role}</p>
        </div>`).join("")}
      </div>
      <div class="result-box" style="max-width:800px;margin:20px auto">
        <b>Islamic sources:</b> ${topic.refs.map((r) => REFERENCES[r].ref).join(" · ")}<br>
        <small>Qur'an translation: Sahih International (quran.com). Hadith: sunnah.com.<br>
        3D graphics: Three.js (open-source). Models are simplified and not to scale.</small>
      </div>
      <div style="text-align:center;margin-top:20px">
        <button class="btn accent" id="cr-again">↺ Back to the model</button>
        <button class="btn ghost" id="cr-home">⌂ Choose another topic</button>
      </div>
      <p style="text-align:center;font-size:2rem;margin-top:30px">جزاكم الله خيرا<br><span style="font-size:1rem;color:var(--muted)">JazakumAllahu khayran: may Allah reward you with goodness</span></p>`;
    $("cr-again").onclick = () => setView("explore");
    $("cr-home").onclick = () => setView("home");
  }

  // =====================================================================
  // 10. QUIZ
  // =====================================================================
  let quizIndex = 0, quizScore = 0;
  function startQuiz() { quizIndex = 0; quizScore = 0; renderQuiz(); }

  function renderQuiz() {
    const qs = topic.quiz;
    const body = $("quiz-body");
    if (quizIndex >= qs.length) {
      const pct = quizScore / qs.length;
      // Explorer's passport: 4/5 or more earns this exhibit's stamp
      const P = window.PASSPORT;
      const res = P ? P.award(topic.id, quizScore, qs.length) : "fail";
      const stampBox = !P ? "" : res === "fail"
        ? `<div class="quiz-stamp">${P.stampHtml(topic.id)}<p>Score <b>${Math.ceil(P.PASS * qs.length)} or more</b> to earn this exhibit's passport stamp.</p></div>`
        : `<div class="quiz-stamp">${P.stampHtml(topic.id).replace('class="stamp got', 'class="stamp got thump')}
             <p>${res === "new" ? "🛂 <b>Stamp earned!</b>" : "🛂 You already have this stamp."} ${P.count}/6 collected${P.count === 6 ? ": your certificate is ready!" : ""}</p></div>`;
      body.innerHTML = `<div class="quiz-card" style="text-align:center">
        <div class="quiz-progress">QUIZ COMPLETE</div>
        <div class="score-big">${quizScore} / ${qs.length}</div>
        <p style="font-size:1.4rem">${pct === 1 ? "MashaAllah! Perfect score! 🌟" : pct >= 0.6 ? "Great work! 👏" : "Good try! Explore the model again and retry. 💪"}</p>
        ${stampBox}
        <div class="quiz-actions" style="justify-content:center">
          <button class="btn ghost" id="qz-retry">↺ Try again</button>
          ${P ? `<button class="btn accent" id="qz-passport">🛂 ${P.count === 6 ? "Get my certificate" : "Open my passport"}</button>` : ""}
          <button class="btn ghost" id="qz-home">🌍 Next exhibit</button>
        </div></div>`;
      $("qz-retry").onclick = startQuiz;
      if ($("qz-passport")) $("qz-passport").onclick = () => P.open();
      $("qz-home").onclick = () => setView("home");
      return;
    }
    const q = qs[quizIndex];
    body.innerHTML = `<div class="quiz-card">
      <div class="quiz-progress">QUESTION ${quizIndex + 1} OF ${qs.length} · SCORE ${quizScore}</div>
      <div class="quiz-q">${q.q}</div>
      <div class="quiz-options">${q.options.map((o, i) =>
        `<button class="quiz-opt" data-i="${i}"><span class="letter">${"ABCD"[i]}</span>${o}</button>`).join("")}</div>
      <div class="quiz-feedback" id="qz-fb"></div>
      <div class="quiz-actions"><button class="btn accent" id="qz-next" style="display:none">${quizIndex === qs.length - 1 ? "See score" : "Next question ▶"}</button></div>
    </div>`;
    body.querySelectorAll(".quiz-opt").forEach((b) => b.addEventListener("click", () => {
      const i = +b.dataset.i;
      body.querySelectorAll(".quiz-opt").forEach((x) => {
        x.disabled = true;
        if (+x.dataset.i === q.answer) x.classList.add("right");
      });
      if (i === q.answer) { quizScore++; $("qz-fb").innerHTML = "✅ <b>Correct!</b> " + q.explain; }
      else { b.classList.add("wrong"); $("qz-fb").innerHTML = "❌ <b>Not quite.</b> " + q.explain; }
      $("qz-next").style.display = "";
    }));
    $("qz-next").onclick = () => { quizIndex++; renderQuiz(); };
  }

  // =====================================================================
  // 11. PRESENTATION MODE (guided demo, ~2 minutes, 8 steps)
  // =====================================================================
  let presenting = false, stepIndex = 0, presentStart = 0, timerInt = null;

  function startPresentation() {
    setView("explore");
    presenting = true;
    document.body.classList.add("presenting");
    document.querySelectorAll(".nav-btn").forEach((b) => b.classList.toggle("on", b.dataset.view === "present"));
    $("present").classList.add("open");
    resize();
    stepIndex = 0;
    presentStart = Date.now();
    clearInterval(timerInt);
    timerInt = setInterval(updateTimer, 500);
    runStep();
  }

  function stopPresentation() {
    if (!presenting) return;
    presenting = false;
    document.body.classList.remove("presenting");
    $("present").classList.remove("open");
    clearInterval(timerInt);
    clearTimers();
    resize();
    document.querySelectorAll(".nav-btn").forEach((b) => b.classList.toggle("on", b.dataset.view === currentView));
  }

  function runStep() {
    const steps = topic.steps;
    const s = steps[stepIndex];
    // Steps are written for members 1–4. If config.js lists fewer people,
    // the steps are shared out between them (1 person = presents every step).
    const count = Math.max(1, CFG.members.length);
    const idx = (s.member - 1) % count;
    const m = CFG.members[idx] || { name: "Member " + s.member };
    $("sp-name").textContent = m.name;
    $("sp-num").textContent = count === 1 ? "Presenter" : "Member " + (idx + 1);
    $("pr-title").textContent = s.title;
    $("pr-say").textContent = s.say;
    $("pr-step").textContent = `Step ${stepIndex + 1} / ${steps.length}`;
    $("pr-progress").style.width = ((stepIndex + 1) / steps.length) * 100 + "%";
    $("pr-back").disabled = stepIndex === 0;
    $("pr-next").textContent = stepIndex === steps.length - 1 ? "Start Quiz ▶" : "Next ▶";
    closeInfo();
    clearTimers();                    // cancel delayed effects from the previous step
    // run the scene animation for this step
    if (sceneApi && sceneApi.actions && sceneApi.actions[s.action]) {
      try { sceneApi.actions[s.action](); } catch (err) { console.error("Step action failed:", s.action, err); }
    }
  }

  function updateTimer() {
    const sec = Math.floor((Date.now() - presentStart) / 1000);
    $("pr-timer").textContent = Math.floor(sec / 60) + ":" + String(sec % 60).padStart(2, "0") + " / ~2:00";
  }

  $("pr-next").onclick = () => {
    if (stepIndex < topic.steps.length - 1) { stepIndex++; runStep(); }
    else { stopPresentation(); setView("quiz"); }
  };
  $("pr-back").onclick = () => { if (stepIndex > 0) { stepIndex--; runStep(); } };
  $("pr-exit").onclick = () => { stopPresentation(); setView("explore"); };

  // keyboard shortcuts for presenting with a clicker / arrow keys
  window.addEventListener("keydown", (e) => {
    if (!presenting) return;
    if (e.key === "ArrowRight" || e.key === "PageDown") $("pr-next").click();
    if (e.key === "ArrowLeft" || e.key === "PageUp") $("pr-back").click();
    if (e.key === "Escape") $("pr-exit").click();
  });

  // =====================================================================
  // 12. STARTUP — open the topic chooser, or a topic from the URL (#ocean)
  // =====================================================================
  buildTopicList();
  const fromHash = location.hash.replace("#", "");
  if (TOPICS.some((t) => t.id === fromHash)) showStart(fromHash);
  else showScreen("screen-topics");

  // ---------------------------------------------------------------------
  // Self-test (used only by the developer): open index.html?autotest
  // It opens every topic, runs every Presentation step, every info panel
  // and the quiz, then prints the result to the browser console.
  // ---------------------------------------------------------------------
  if (location.search.indexOf("autotest") >= 0) {
    window.__errors = [];
    window.addEventListener("error", (e) => window.__errors.push(e.message));
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      for (const t of TOPICS) {
        try {
          openTopic(t.id);
          await wait(400);
          Object.keys(t.info).forEach(showInfo);
          startPresentation();
          for (let i = 0; i < t.steps.length; i++) {
            if (!sceneApi.actions || !sceneApi.actions[t.steps[i].action]) window.__errors.push(t.id + ": missing action " + t.steps[i].action);
            stepIndex = i; runStep(); await wait(700);
          }
          setView("quiz"); document.querySelector(".quiz-opt").click();
          setView("life"); setView("refs"); setView("credits"); setView("explore");
          console.log("AUTOTEST topic ok: " + t.id);
        } catch (err) { window.__errors.push(t.id + ": " + err.message); console.error(err); }
      }
      console.log(window.__errors.length ? "AUTOTEST FAIL: " + window.__errors.join(" | ") : "AUTOTEST PASS");
      document.title = window.__errors.length ? "AUTOTEST FAIL" : "AUTOTEST PASS";
    })();
  }
})();
