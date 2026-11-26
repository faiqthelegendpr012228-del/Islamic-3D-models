/* =====================================================================
   passport.js  —  Explorer's Passport: one stamp per exhibit
   ---------------------------------------------------------------------
   • Score 4/5 or more in an exhibit's quiz → that exhibit's stamp.
   • All six stamps → a certificate with the visitor's name (printable).
   • Saved in the browser (localStorage) like the wallet.
   • "New visitor" clears the passport AND the wallet.
   ===================================================================== */

(function () {
  "use strict";
  const KEY = "signs-systems-passport-v1";
  const PASS = 0.8;                                   // 4 out of 5
  const ORDER = ["clock", "sky", "atm", "market", "waqf", "ocean"];   // same order as the dive

  let S = { stamps: {}, name: "" };
  try { const saved = JSON.parse(localStorage.getItem(KEY)); if (saved) S = Object.assign(S, saved); } catch (e) { /* storage blocked */ }

  const listeners = [];
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ }
    updateChip();
    listeners.forEach((fn) => { try { fn(S); } catch (e) { console.error(e); } });
    if ($("passport").classList.contains("open")) renderPassport();
  }
  const $ = (id) => document.getElementById(id);
  const topicById = (id) => (window.TOPICS || []).find((t) => t.id === id);
  const fmtDate = (t) => new Date(t).toLocaleDateString(window.I18N && I18N.lang === "ar" ? "ar-AE" : "en-GB", { day: "numeric", month: "long", year: "numeric" });

  const P = {
    PASS,
    get count() { return Object.keys(S.stamps).length; },
    has(id) { return !!S.stamps[id]; },
    stamp(id) { return S.stamps[id]; },
    onChange(fn) { listeners.push(fn); },

    /** Called by the quiz when it finishes. Returns "new", "kept" or "fail". */
    award(id, score, total) {
      if (score / total < PASS) return "fail";
      const old = S.stamps[id];
      if (old && old.score >= score) return "kept";
      S.stamps[id] = { score, total, t: Date.now() };
      save();
      return old ? "kept" : "new";
    },
    newVisitor() {
      S = { stamps: {}, name: "" };
      save();
      if (window.WALLET) WALLET.reset();
    },
    open() { renderPassport(); $("passport").classList.add("open"); },
    close() { $("passport").classList.remove("open"); },

    /** HTML for one round stamp (used in the passport, quiz result and certificate) */
    stampHtml(id, small) {
      const t = topicById(id), st = S.stamps[id];
      if (!t) return "";
      return `<div class="stamp ${st ? "got" : "empty"} ${small ? "small" : ""}" style="--c:${t.accent}">
                <div class="stamp-ring"><span class="stamp-icon">${t.icon}</span>
                <span class="stamp-text">${st ? "VISITED" : "?"}</span></div></div>`;
    }
  };
  window.PASSPORT = P;

  // ---------- floating passport button ----------
  const chip = $("passport-chip");
  function updateChip() {
    chip.innerHTML = `<span class="wc-icon">🛂</span><span class="wc-bal">${P.count}/6</span><span class="wc-steps">Explorer's passport</span>`;
    chip.classList.remove("bump"); void chip.offsetWidth; chip.classList.add("bump");
  }
  chip.addEventListener("click", P.open);
  updateChip();
  chip.classList.remove("bump");

  // ---------- passport screen ----------
  function renderPassport() {
    const body = $("passport-body");
    const done = P.count === 6;
    body.innerHTML = `
      <div class="kicker">Signs &amp; Systems</div>
      <h2>🛂 Explorer's passport</h2>
      <p class="j-intro">Score <b>4 out of 5</b> or more in an exhibit's quiz to earn its stamp. Collect all six for your certificate.</p>
      <div class="pp-grid">
        ${ORDER.map((id) => {
          const t = topicById(id), st = S.stamps[id];
          return `<div class="pp-slot ${st ? "got" : ""}">
            ${P.stampHtml(id)}
            <div class="pp-title">${t.title}</div>
            ${st ? `<div class="pp-meta">${st.score}/${st.total} · ${fmtDate(st.t)}</div>`
                 : `<button class="btn ghost small pp-go" data-go="${id}">Take the quiz ▶</button>`}
          </div>`;
        }).join("")}
      </div>
      <div class="pp-progress"><div style="width:${P.count / 6 * 100}%"></div></div>
      ${done ? `
        <div class="result-box good pp-cert">
          <b>🌟 All six stamps collected!</b> Type your name for your certificate.
          <div class="pp-name-row"><input type="text" id="pp-name" maxlength="40" placeholder="Your full name" value="${(S.name || "").replace(/"/g, "&quot;")}">
          <button class="btn accent" id="pp-cert">🎓 Get my certificate</button></div>
        </div>` : `<div class="how" style="text-align:center">${6 - P.count} stamp${6 - P.count === 1 ? "" : "s"} to go.</div>`}
      <div class="j-actions">
        <button class="btn ghost small" id="pp-reset">↺ New visitor (clears passport &amp; wallet)</button>
        <button class="btn small" id="pp-close">Close</button>
      </div>`;
    body.querySelectorAll(".pp-go").forEach((b) => b.onclick = () => { P.close(); window.APP_QUIZ && window.APP_QUIZ(b.dataset.go); });
    body.querySelector("#pp-close").onclick = P.close;
    body.querySelector("#pp-reset").onclick = (e) => {
      if (e.target.dataset.armed && Date.now() - +e.target.dataset.armed < 3000) { P.newVisitor(); return; }
      e.target.dataset.armed = Date.now(); e.target.textContent = "Tap again to clear everything";
    };
    const certBtn = body.querySelector("#pp-cert");
    if (certBtn) certBtn.onclick = () => {
      const name = body.querySelector("#pp-name").value.trim();
      if (!name) { body.querySelector("#pp-name").focus(); return; }
      S.name = name; save(); showCertificate();
    };
  }

  // ---------- certificate ----------
  function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
  function showCertificate() {
    const cfg = window.APP_CONFIG || {};
    const last = Math.max(...Object.values(S.stamps).map((s) => s.t));
    $("certificate-body").innerHTML = `
      <div class="cert">
        <div class="cert-inner">
          <div class="kicker">${esc(cfg.schoolName || "")}</div>
          <div class="cert-title">Certificate of Exploration</div>
          <div class="cert-sub">This certifies that</div>
          <div class="cert-name">${esc(S.name)}</div>
          <div class="cert-text">explored all six exhibits of <b>Signs &amp; Systems</b>, an interactive Islamic studies museum,
            and passed every quiz, from the Moon's orbit to the bottom of the sea.</div>
          <div class="cert-stamps">${ORDER.map((id) => P.stampHtml(id, true)).join("")}</div>
          <div class="cert-foot">
            <div><div class="cert-line">${fmtDate(last)}</div><div class="label-sm">Date</div></div>
            <div class="cert-seal">✦</div>
            <div><div class="cert-line">${esc((cfg.members || []).map((m) => m.name).join(", "))}</div><div class="label-sm">Museum creator</div></div>
          </div>
        </div>
      </div>
      <div class="cert-actions no-print">
        <button class="btn accent" id="cert-print">🖨️ Print / save as PDF</button>
        <button class="btn ghost" id="cert-close">Close</button>
      </div>`;
    $("cert-print").onclick = () => window.print();
    $("cert-close").onclick = () => $("certificate").classList.remove("open");
    P.close();
    $("certificate").classList.add("open");
  }
  P.certificate = showCertificate;

  ["passport", "certificate"].forEach((id) =>
    $(id).addEventListener("click", (e) => { if (e.target.id === id) $(id).classList.remove("open"); }));
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") { P.close(); $("certificate").classList.remove("open"); } });
})();
