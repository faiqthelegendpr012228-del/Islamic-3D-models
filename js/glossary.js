/* =====================================================================
   glossary.js  —  Dotted-underline key terms + pop-up card + full list
   ---------------------------------------------------------------------
   Key Islamic terms (js/glossary-data.js) are underlined wherever they
   appear in the info panels, references, real-life cards, quizzes and
   the money journey. Hover (or tap on a phone) to see the Arabic word,
   its meaning and a 🔊 button that plays the Arabic pronunciation.
   The 📚 button opens the whole glossary for revision.
   ===================================================================== */
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const TERMS = window.GLOSSARY_TERMS || [];
  const BY_ID = {}; TERMS.forEach((t) => (BY_ID[t.id] = t));
  const lang = () => (window.I18N && I18N.lang) || "en";
  const stripHarakat = (s) => s.replace(/[ً-ْٰ]/g, "");

  // ---------- matching ----------
  function buildIndex(l) {
    const keys = [];
    TERMS.forEach((t) => {
      if (l === "ar") {
        const base = stripHarakat(t.ar);
        keys.push([base, t.id]);
        if (base.startsWith("ال")) keys.push([base.slice(2), t.id]);
        else keys.push(["ال" + base, t.id]);
      } else t.match.forEach((m) => keys.push([m.toLowerCase(), t.id]));
    });
    keys.sort((a, b) => b[0].length - a[0].length);
    const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const alt = keys.map((k) => esc(k[0])).join("|");
    const re = l === "ar"
      ? new RegExp(`(?<![\\u0621-\\u064A])(${alt})(?![\\u0621-\\u064A])`, "g")
      : new RegExp(`\\b(${alt})\\b`, "gi");
    const map = {}; keys.forEach(([k, id]) => (map[k] = id));
    return { re, map };
  }
  const INDEX = { en: buildIndex("en"), ar: buildIndex("ar") };

  const SKIP = "button, a, input, select, textarea, script, style, .gl, .gl-skip, h1, h2, h3, h4, .field, .label-sm, code";
  function highlight(root) {
    if (!root || !root.isConnected) return;
    const ix = INDEX[lang()] || INDEX.en;
    const seen = new Set(Array.from(root.querySelectorAll(".gl")).map((e) => e.dataset.g));
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (!n.nodeValue.trim() || (n.parentElement && n.parentElement.closest(SKIP)) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT)
    });
    const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const text = node.nodeValue; ix.re.lastIndex = 0;
      let m, last = 0, frag = null;
      while ((m = ix.re.exec(text))) {
        const key = lang() === "ar" ? m[1] : m[1].toLowerCase();
        const id = ix.map[key] || ix.map[stripHarakat(key)];
        if (!id || seen.has(id)) continue;      // underline only the first time a term appears
        seen.add(id);
        frag = frag || document.createDocumentFragment();
        frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        const span = document.createElement("span");
        span.className = "gl"; span.dataset.g = id; span.tabIndex = 0; span.textContent = m[1];
        frag.appendChild(span);
        last = m.index + m[1].length;
      }
      if (frag) { frag.appendChild(document.createTextNode(text.slice(last))); node.parentNode.replaceChild(frag, node); }
    });
  }

  // watch the places where text appears and underline new content
  const WATCH = ["info-body", "refs-body", "life-body", "quiz-body", "journey-body", "tools", "myth-body"];
  const pending = new Set(); let timer = null;
  function schedule(el) { pending.add(el); clearTimeout(timer); timer = setTimeout(() => { pending.forEach((e) => { obs.disconnect(); highlight(e); }); pending.clear(); observeAll(); }, 60); }
  const obs = new MutationObserver((muts) => muts.forEach((m) => { const root = WATCH.map($).find((w) => w && w.contains(m.target)); if (root) schedule(root); }));
  function observeAll() { WATCH.forEach((id) => { const el = $(id); if (el) obs.observe(el, { childList: true, subtree: true }); }); }
  observeAll();

  // ---------- pop-up card ----------
  const tip = document.createElement("div");
  tip.id = "gl-tip"; tip.setAttribute("role", "tooltip");
  document.body.appendChild(tip);
  const audio = new Audio(); audio.preload = "none";
  function play(id) { audio.src = `audio/glossary/${id}.mp3`; audio.currentTime = 0; audio.play().catch(() => {}); }

  let openFor = null, hideTimer = null;
  function show(span) {
    const t = BY_ID[span.dataset.g]; if (!t) return;
    clearTimeout(hideTimer);
    const ar = lang() === "ar";
    tip.innerHTML = `
      <div class="gt-head"><span class="gt-term">${t.term}</span><span class="gt-ar" lang="ar" dir="rtl">${t.ar}</span></div>
      <div class="gt-def" ${ar ? 'dir="rtl" lang="ar"' : ""}>${ar ? t.arDef : t.en}</div>
      <button class="gt-play" type="button">🔊 ${ar ? "استمع" : "Hear it in Arabic"}</button>`;
    tip.querySelector(".gt-play").onclick = (e) => { e.stopPropagation(); play(t.id); };
    tip.classList.add("show");
    const r = span.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight;
    let x = Math.min(Math.max(8, r.left + r.width / 2 - w / 2), innerWidth - w - 8);
    let y = r.top - h - 10; if (y < 8) y = r.bottom + 10;
    tip.style.left = x + "px"; tip.style.top = y + "px";
    openFor = span;
  }
  function hide() { tip.classList.remove("show"); openFor = null; }
  document.addEventListener("mouseover", (e) => {
    const s = e.target.closest && e.target.closest(".gl");
    if (s && matchMedia("(hover: hover)").matches) show(s);
    else if (openFor && !e.target.closest("#gl-tip")) { clearTimeout(hideTimer); hideTimer = setTimeout(hide, 250); }
  });
  document.addEventListener("click", (e) => {
    const s = e.target.closest && e.target.closest(".gl");
    if (s) { e.preventDefault(); e.stopPropagation(); openFor === s && !matchMedia("(hover: hover)").matches ? hide() : show(s); return; }
    if (!e.target.closest("#gl-tip")) hide();
  }, true);
  document.addEventListener("focusin", (e) => { if (e.target.classList && e.target.classList.contains("gl")) show(e.target); });
  window.addEventListener("scroll", hide, true);
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") { hide(); closeList(); } });

  // ---------- full glossary page ----------
  const modal = document.createElement("section");
  modal.id = "glossary"; modal.className = "modal";
  modal.innerHTML = `<div class="modal-body" id="glossary-body"></div>`;
  document.body.appendChild(modal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeList(); });
  function closeList() { modal.classList.remove("open"); }
  function openList() {
    const ar = lang() === "ar";
    const body = $("glossary-body");
    body.innerHTML = `
      <div class="kicker">Signs &amp; Systems</div>
      <h2>📚 ${ar ? "المصطلحات" : "Glossary"}</h2>
      <input type="search" id="gl-search" placeholder="${ar ? "ابحث عن مصطلح…" : "Search a word…"}" ${ar ? 'dir="rtl"' : ""}>
      <div class="gl-grid" id="gl-grid"></div>
      <div class="j-actions"><span></span><button class="btn small" id="gl-close">${ar ? "إغلاق" : "Close"}</button></div>`;
    const render = (q) => {
      q = (q || "").trim().toLowerCase();
      $("gl-grid").innerHTML = TERMS.filter((t) => !q || t.term.toLowerCase().includes(q) || stripHarakat(t.ar).includes(stripHarakat(q)) || t.en.toLowerCase().includes(q))
        .map((t) => `<div class="gl-card">
            <div class="gt-head"><span class="gt-term">${t.term}</span><span class="gt-ar" lang="ar" dir="rtl">${t.ar}</span></div>
            <div class="gt-def" ${ar ? 'dir="rtl" lang="ar"' : ""}>${ar ? t.arDef : t.en}</div>
            <button class="gt-play" data-p="${t.id}" type="button">🔊</button></div>`).join("") || `<p class="how">${ar ? "لا توجد نتائج." : "No matches."}</p>`;
      $("gl-grid").querySelectorAll("[data-p]").forEach((b) => (b.onclick = () => play(b.dataset.p)));
    };
    render("");
    $("gl-search").oninput = (e) => render(e.target.value);
    $("gl-close").onclick = closeList;
    modal.classList.add("open");
  }

  window.GLOSSARY = { open: openList, close: closeList, refresh: () => WATCH.forEach((id) => highlight($(id))) };
})();
