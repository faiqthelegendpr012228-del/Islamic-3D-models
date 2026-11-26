/* =====================================================================
   video.js  —  "Watch video": a narrated, self-playing 3D explainer
   ---------------------------------------------------------------------
   Each topic already has 8 Presentation Mode steps (content.js) that move
   the 3D model. The video player plays them back like a film:
     • the model animates by itself, step after step
     • a recorded narrator reads each step (4 English voices + Arabic),
       from audio/<voice>/<topic>/<step>.mp3 with timings in js/narration.js;
       if a clip can't load, the browser's own voice is used instead
     • subtitles show the words, highlighting the sentence being spoken
     • play / pause, back, next, mute and a progress bar
   If config.js lists a recorded video for the topic (videos: {...}),
   the visitor can choose between that video and the narrated tour.
   ===================================================================== */

(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const APP = () => window.APP_API;
  const synth = window.speechSynthesis;

  let playing = false, active = false, muted = false;
  let stepIndex = 0, token = 0, waitTimer = null;
  let voice = null;

  // ---------- pick a clear English voice ----------
  function pickVoice() {
    if (!synth) return;
    const vs = synth.getVoices().filter((v) => /^en/i.test(v.lang));
    const prefer = [/natural/i, /google uk english/i, /google us english/i, /aria|jenny|guy|sonia|libby|ryan/i, /en-gb/i, /en-us/i];
    for (const re of prefer) { const v = vs.find((x) => re.test(x.name) || re.test(x.lang)); if (v) { voice = v; return; } }
    voice = vs[0] || null;
  }
  if (synth) { pickVoice(); synth.onvoiceschanged = pickVoice; }

  // make the text easier for a computer voice to read
  function forSpeech(t) {
    return t.replace(/ﷺ/g, " peace be upon him ")
            .replace(/(\d+):(\d+)(?:[–-](\d+))?/g, (m, a, b, c) => `${a}, verse ${b}${c ? " to " + c : ""}`)
            .replace(/˹|˺/g, "");
  }
  function sentences(t) { return (t.match(/[^.!?؟]+[.!?؟]+["'”’»]*\s*|[^.!?؟]+$/g) || [t]).map((x) => x.trim()).filter(Boolean); }

  // ---------- recorded narration: language + voice ----------
  const N = window.NARRATION || { voices: {} };
  const audio = new Audio();
  audio.preload = "auto";
  let usingClip = false;
  let prefs = { lang: "en", voice: "en-michael" };
  try { Object.assign(prefs, JSON.parse(localStorage.getItem("signs-systems-voice")) || {}); } catch (e) { /* ignore */ }
  function savePrefs() { try { localStorage.setItem("signs-systems-voice", JSON.stringify(prefs)); } catch (e) { /* ignore */ } }
  function voiceKey() {
    if (prefs.lang === "ar") return Object.keys(N.voices).find((k) => N.voices[k].lang === "ar") || "";
    return N.voices[prefs.voice] ? prefs.voice : (Object.keys(N.voices).find((k) => N.voices[k].lang === "en") || "");
  }

  // ---------- the player bar (built once) ----------
  const bar = document.createElement("div");
  bar.id = "video-bar";
  bar.innerHTML = `
    <div class="vb-top"><span class="vb-badge">🎬 VIDEO</span><span class="vb-title" id="vb-title"></span><span class="vb-count" id="vb-count"></span></div>
    <div class="vb-caption" id="vb-caption"></div>
    <div class="vb-segs" id="vb-segs"></div>
    <div class="vb-controls">
      <button class="vb-btn" id="vb-prev" title="Back">⏮</button>
      <button class="vb-btn big" id="vb-play" title="Play / pause">⏸</button>
      <button class="vb-btn" id="vb-next" title="Next">⏭</button>
      <button class="vb-btn" id="vb-mute" title="Sound on / off">🔊</button>
      <div class="vb-seg" id="vb-lang"><button data-lang="en">English</button><button data-lang="ar" lang="ar">العربية</button></div>
      <select class="vb-select" id="vb-voice" title="Narrator voice"></select>
      <span class="vb-spacer"></span>
      <button class="vb-btn" id="vb-close" title="Close video">✕ Close</button>
    </div>
    <div class="vb-end" id="vb-end"></div>`;
  $("app").appendChild(bar);

  const chooser = document.createElement("section");
  chooser.id = "video-choice"; chooser.className = "modal";
  chooser.innerHTML = `<div class="modal-body" id="video-choice-body"></div>`;
  document.body.appendChild(chooser);
  chooser.addEventListener("click", (e) => { if (e.target === chooser) closeChooser(); });

  $("vb-play").onclick = () => (playing ? pause() : resume());
  $("vb-prev").onclick = () => go(Math.max(0, stepIndex - 1));
  $("vb-next").onclick = () => go(stepIndex + 1);
  $("vb-mute").onclick = () => {
    muted = !muted; $("vb-mute").textContent = muted ? "🔇" : "🔊";
    if (usingClip) audio.muted = muted; else go(stepIndex);
  };
  const enVoices = Object.keys(N.voices).filter((k) => N.voices[k].lang === "en");
  $("vb-voice").innerHTML = enVoices.map((k) => `<option value="${k}">🎙️ ${N.voices[k].label}</option>`).join("");
  $("vb-voice").onchange = (e) => { prefs.voice = e.target.value; savePrefs(); go(stepIndex); };
  $("vb-lang").querySelectorAll("button").forEach((b) => b.onclick = () => { prefs.lang = b.dataset.lang; savePrefs(); syncSettings(); go(stepIndex); });
  function syncSettings() {
    $("vb-lang").querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.lang === prefs.lang));
    $("vb-voice").value = voiceKey();
    $("vb-voice").style.display = prefs.lang === "ar" || !enVoices.length ? "none" : "";
    $("vb-lang").style.display = Object.keys(N.voices).some((k) => N.voices[k].lang === "ar") ? "" : "none";
    bar.classList.toggle("rtl", prefs.lang === "ar");
  }
  syncSettings();
  $("vb-close").onclick = () => VIDEO.stop();
  window.addEventListener("keydown", (e) => {
    if (!active) return;
    if (e.key === " ") { e.preventDefault(); $("vb-play").click(); }
    if (e.key === "ArrowRight") $("vb-next").click();
    if (e.key === "ArrowLeft") $("vb-prev").click();
    if (e.key === "Escape") VIDEO.stop();
  });

  function steps() { return (APP().topic && APP().topic.steps) || []; }

  function cancelAudio() {
    token++;
    audio.pause(); audio.onended = audio.ontimeupdate = audio.onerror = null;
    clearTimeout(waitTimer);
    if (synth) synth.cancel();
  }

  /** Show and play step i */
  function go(i) {
    const st = steps();
    cancelAudio();
    if (i >= st.length) { finish(); return; }
    stepIndex = i;
    $("vb-end").classList.remove("show");
    const s = st[i], tid = APP().topic.id;
    const vk = voiceKey(), V = N.voices[vk];
    const ar = prefs.lang === "ar" && V && V.lang === "ar";
    const text = ar && V.text && V.text[tid] ? V.text[tid][i] : s.say;
    const title = ar ? `${(V.titles && V.titles[tid]) || ""} · ${i + 1}` : s.title;
    $("vb-count").textContent = `${i + 1} / ${st.length}`;
    $("vb-segs").innerHTML = st.map((_, j) => `<span class="${j < i ? "done" : j === i ? "now" : ""}"><i></i></span>`).join("");
    const parts = sentences(text);
    $("vb-caption").setAttribute("dir", ar ? "rtl" : "ltr");
    $("vb-caption").setAttribute("lang", ar ? "ar" : "en");
    $("vb-caption").innerHTML = `<b>${title}</b> ` + parts.map((p, j) => `<span data-s="${j}">${p}</span>`).join(" ");
    APP().closeInfo();
    APP().clearTimers();
    APP().runAction(s.action);
    // the action may open the info panel; keep the screen clean while the video plays
    setTimeout(() => active && APP().closeInfo(), 60);
    playing = true; $("vb-play").textContent = "⏸";
    if (!playClip(vk, tid, i, parts)) speakParts(parts, 0, token, text, ar);
  }

  /** Play the recorded clip for this step. Returns false if there is none. */
  function playClip(vk, tid, i, parts) {
    usingClip = false;
    const V = N.voices[vk];
    const meta = V && V.timings && V.timings[tid] && V.timings[tid][i];
    if (!meta) return false;
    const my = token;
    usingClip = true;
    audio.src = `audio/${vk}/${tid}/${i + 1}.mp3`;
    audio.muted = muted;
    markSentence(0);
    progress(meta.duration);
    audio.ontimeupdate = () => {
      if (my !== token) return;
      const t = audio.currentTime + 0.05;
      markSentence(meta.starts.filter((x) => x <= t).length - 1);
    };
    audio.onended = () => {
      if (my !== token) return;
      markSentence(-1);
      waitTimer = setTimeout(() => { if (my === token && playing) go(stepIndex + 1); }, 700);
    };
    const fallback = () => {          // file missing / offline: use the computer voice or timed subtitles
      if (my !== token) return;
      usingClip = false;
      audio.onended = audio.ontimeupdate = audio.onerror = null;
      speakParts(parts, 0, my, parts.join(" "), V.lang === "ar");
    };
    audio.onerror = fallback;
    const p = audio.play();
    if (p && p.catch) p.catch((err) => { if (err && err.name !== "AbortError") fallback(); });
    // load the next step's clip in the background so it starts instantly
    const nextMeta = V.timings[tid][i + 1];
    if (nextMeta) { const pre = new Audio(); pre.preload = "auto"; pre.src = `audio/${vk}/${tid}/${i + 2}.mp3`; }
    return true;
  }

  function markSentence(j) {
    $("vb-caption").querySelectorAll("span[data-s]").forEach((el) => el.classList.toggle("on", +el.dataset.s === j));
  }
  function progress(seconds) {   // animate the current segment's fill
    const fill = $("vb-segs").querySelector(".now i");
    if (!fill) return;
    fill.style.transition = "none"; fill.style.width = "0%";
    void fill.offsetWidth;
    fill.style.transition = `width ${seconds}s linear`; fill.style.width = "100%";
  }

  /** Speak sentence by sentence (long single utterances can stop early in Chrome) */
  function speakParts(parts, j, myToken, full, timedOnly) {
    if (myToken !== token || !active) return;
    if (j === 0) {
      const words = full.split(/\s+/).length;
      progress(Math.max(4, words / 2.5));
    }
    if (j >= parts.length) {
      markSentence(-1);
      waitTimer = setTimeout(() => { if (myToken === token && playing) go(stepIndex + 1); }, 900);
      return;
    }
    markSentence(j);
    const next = () => speakParts(parts, j + 1, myToken, full, timedOnly);
    if (muted || !synth || timedOnly) {
      const secs = Math.max(1.8, parts[j].split(/\s+/).length / 2.6);
      waitTimer = setTimeout(next, secs * 1000);
      return;
    }
    const u = new SpeechSynthesisUtterance(forSpeech(parts[j]));
    if (voice) u.voice = voice;
    u.lang = (voice && voice.lang) || "en-GB";
    u.rate = 0.98; u.pitch = 1;
    let started = false, done = false;
    const t0 = Date.now();
    const expected = Math.max(1.8, parts[j].split(/\s+/).length / 2.6) * 1000;
    // If speech "ends" far too quickly (no real voice), wait for a normal reading time instead.
    const once = () => {
      if (done) return; done = true;
      const elapsed = Date.now() - t0;
      if (elapsed < expected * 0.35) waitTimer = setTimeout(next, expected - elapsed);
      else next();
    };
    u.onstart = () => { started = true; };
    u.onend = once;
    u.onerror = (e) => { if (e.error !== "interrupted" && e.error !== "canceled") once(); };
    synth.speak(u);
    // Some computers have no voices installed: if speech never starts,
    // carry on with timed subtitles instead of getting stuck.
    waitTimer = setTimeout(() => {
      if (myToken !== token || started || done || !playing) return;
      done = true; synth.cancel();
      const secs = Math.max(1.8, parts[j].split(/\s+/).length / 2.6);
      waitTimer = setTimeout(next, Math.max(0, secs * 1000 - 2000));
    }, 2000);
  }

  function pause() {
    playing = false; $("vb-play").textContent = "▶";
    clearTimeout(waitTimer);
    if (usingClip) audio.pause();
    else if (synth) synth.pause();
    const fill = $("vb-segs").querySelector(".now i");
    if (fill) { const w = getComputedStyle(fill).width; fill.style.transition = "none"; fill.style.width = w; }
  }
  function resume() {
    if (!playing && usingClip && audio.src && !audio.ended && audio.currentTime > 0) {
      playing = true; $("vb-play").textContent = "⏸"; audio.play();
      const fill = $("vb-segs").querySelector(".now i");
      if (fill && audio.duration) {
        fill.style.transition = `width ${Math.max(0.1, audio.duration - audio.currentTime)}s linear`; fill.style.width = "100%";
      }
    } else if (!playing && synth && synth.paused && synth.speaking) {
      playing = true; $("vb-play").textContent = "⏸"; synth.resume();
    } else go(stepIndex);   // simplest: replay the current step
  }

  function finish() {
    cancelAudio();
    playing = false; $("vb-play").textContent = "↺";
    $("vb-segs").querySelectorAll("span").forEach((s) => (s.className = "done"));
    const t = APP().topic;
    $("vb-end").innerHTML = `
      <div class="vb-end-title">That was <b>${t.title}</b> 🎬</div>
      <div class="vb-end-actions">
        <button class="btn accent" id="vb-quiz">❓ Take the quiz and earn the stamp</button>
        <button class="btn ghost" id="vb-again">↺ Watch again</button>
        <button class="btn ghost" id="vb-explore">🧭 Explore the model</button>
      </div>`;
    $("vb-end").classList.add("show");
    $("vb-quiz").onclick = () => { VIDEO.stop(); APP().setView("quiz"); };
    $("vb-again").onclick = () => go(0);
    $("vb-explore").onclick = () => VIDEO.stop();
    $("vb-play").onclick = () => (playing ? pause() : (stepIndex >= steps().length - 1 && !playing && $("vb-end").classList.contains("show") ? go(0) : resume()));
  }

  // ---------- recorded videos (optional, from config.js) ----------
  function recordedUrl() {
    const v = (window.APP_CONFIG && window.APP_CONFIG.videos) || {};
    const t = APP().topic;
    return t && v[t.id] ? String(v[t.id]).trim() : "";
  }
  function embedHtml(url) {
    const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
    if (yt) return `<iframe src="https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0&autoplay=1" allow="autoplay; encrypted-media; fullscreen" allowfullscreen title="Video"></iframe>`;
    return `<video src="${url}" controls autoplay playsinline></video>`;
  }
  function closeChooser() {
    chooser.classList.remove("open");
    const frame = chooser.querySelector("iframe, video");
    if (frame) frame.remove();   // stops the sound
  }
  function showChooser(url) {
    const t = APP().topic;
    $("video-choice-body").innerHTML = `
      <div class="kicker">${t.category}</div>
      <h2>🎬 ${t.title}</h2>
      <div class="vc-options">
        <button class="vc-opt" id="vc-tour"><span>🧭</span><b>Narrated 3D tour</b><small>The model moves by itself while a voice explains (about 2 min)</small></button>
        <button class="vc-opt" id="vc-rec"><span>🎥</span><b>Recorded video</b><small>Our own video about this topic</small></button>
      </div>
      <div id="vc-player"></div>
      <div class="j-actions"><span></span><button class="btn small" id="vc-close">Close</button></div>`;
    $("vc-tour").onclick = () => { closeChooser(); startTour(); };
    $("vc-rec").onclick = () => { $("vc-player").innerHTML = `<div class="vc-frame">${embedHtml(url)}</div>`; };
    $("vc-close").onclick = closeChooser;
    chooser.classList.add("open");
  }

  // ---------- public ----------
  function startTour() {
    APP().setView("explore");          // closes quiz/refs overlays (and calls stop() first)
    active = true;
    document.body.classList.add("video-mode");
    document.querySelectorAll(".nav-btn").forEach((b) => b.classList.toggle("on", b.dataset.view === "video"));
    $("vb-title").textContent = APP().topic.title;
    syncSettings();
    $("vb-play").onclick = () => (playing ? pause() : resume());
    APP().resize();
    if (synth) synth.cancel();
    go(0);
  }

  const VIDEO = {
    start() {
      if (!APP() || !APP().topic) return;
      const url = recordedUrl();
      if (url) showChooser(url); else startTour();
    },
    stop() {
      closeChooser();
      if (!active) return;
      active = false; playing = false;
      cancelAudio();
      document.body.classList.remove("video-mode");
      $("vb-end").classList.remove("show");
      document.querySelectorAll(".nav-btn").forEach((b) => b.classList.toggle("on", b.dataset.view === "explore"));
      if (APP()) APP().resize();
    },
    get playing() { return active; }
  };
  window.VIDEO = VIDEO;
})();
