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
        <button class="btn accent" id="cert-share">📤 Share as a picture</button>
        <button class="btn" id="cert-print">🖨️ Print / save as PDF</button>
        <button class="btn ghost" id="cert-close">Close</button>
      </div>`;
    $("cert-print").onclick = () => window.print();
    $("cert-share").onclick = () => shareImage(last);
    $("cert-close").onclick = () => $("certificate").classList.remove("open");
    P.close();
    $("certificate").classList.add("open");
  }
  P.certificate = showCertificate;

  // ---------- share the certificate as a picture (WhatsApp, Instagram …) ----------
  function shareImage(last, noQR) {
    const cfg = window.APP_CONFIG || {};
    const ar = window.I18N && I18N.lang === "ar";
    const T = (en, a) => (ar ? a : en);
    const W = 1080, H = 1350, c = document.createElement("canvas");
    c.width = W; c.height = H;
    const g = c.getContext("2d");
    const font = (w, px, fam) => `${w} ${px}px ${fam || (ar ? "'Segoe UI', 'Noto Naskh Arabic', Tahoma, sans-serif" : "'Segoe UI', Poppins, system-ui, Arial, sans-serif")}`;
    g.direction = ar ? "rtl" : "ltr";
    // background
    const bg = g.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#0c1d44"); bg.addColorStop(0.55, "#08131f"); bg.addColorStop(1, "#04121c");
    g.fillStyle = bg; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 140; i++) { g.fillStyle = `rgba(255,255,255,${Math.random() * 0.5})`; g.fillRect(Math.random() * W, Math.random() * H * 0.6, 2, 2); }
    g.strokeStyle = "#e8c36a"; g.lineWidth = 6; g.strokeRect(40, 40, W - 80, H - 80);
    g.strokeStyle = "rgba(232,195,106,0.45)"; g.lineWidth = 2; g.strokeRect(58, 58, W - 116, H - 116);
    g.textAlign = "center";
    const text = (s, y, f, col) => { g.font = f; g.fillStyle = col; g.fillText(s, W / 2, y); };
    const wrap = (s, y, f, col, maxW, lh) => {
      g.font = f; g.fillStyle = col;
      const words = s.split(" "); let line = "", yy = y;
      for (const w of words) {
        const test = line ? line + " " + w : w;
        if (g.measureText(test).width > maxW && line) { g.fillText(line, W / 2, yy); line = w; yy += lh; } else line = test;
      }
      g.fillText(line, W / 2, yy); return yy;
    };
    text((cfg.schoolName || "").toUpperCase(), 140, font(700, 26), "#e8c36a");
    text(T("Certificate of Exploration", "شهادة استكشاف"), 225, font(800, 66), "#f6f2e7");
    text(T("This certifies that", "تشهد هذه الشهادة بأن"), 300, font(400, 32), "#b8c4d2");
    // name, shrunk to fit
    let px = 92; g.font = font(800, px); while (g.measureText(S.name).width > W - 200 && px > 40) { px -= 4; g.font = font(800, px); }
    text(S.name, 410, font(800, px), "#f3dfa6");
    g.fillStyle = "#e8c36a"; g.fillRect(W / 2 - 220, 440, 440, 3);
    const y2 = wrap(T("explored all six exhibits of Signs & Systems, an interactive Islamic studies museum, and passed every quiz.",
                      "استكشف المعارض الستة في «دلائل وأنظمة»، المتحف التفاعلي للتربية الإسلامية، ونجح في جميع الاختبارات."),
                    510, font(400, 34), "#f6f2e7", W - 220, 48);
    // six stamps
    const topics = window.TOPICS || [];
    const r = 66, gap = 36, rowW = 3 * (2 * r) + 2 * gap;
    ORDER.forEach((id, i) => {
      const t = topics.find((x) => x.id === id) || {};
      const cx = W / 2 - rowW / 2 + r + (i % 3) * (2 * r + gap), cy = y2 + 130 + Math.floor(i / 3) * (2 * r + 34);
      g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.fillStyle = "rgba(255,255,255,0.06)"; g.fill();
      g.lineWidth = 6; g.strokeStyle = t.accent || "#e8c36a"; g.stroke();
      g.setLineDash([6, 8]); g.lineWidth = 2; g.beginPath(); g.arc(cx, cy, r - 12, 0, Math.PI * 2); g.stroke(); g.setLineDash([]);
      g.font = font(400, 58, "'Segoe UI Emoji','Apple Color Emoji','Noto Color Emoji',sans-serif"); g.textBaseline = "middle";
      g.fillStyle = "#fff"; g.fillText(t.icon || "✦", cx, cy + 2); g.textBaseline = "alphabetic";
    });
    // date + QR
    const yq = 990;
    text(fmtDate(last), yq + 20, font(700, 32), "#f6f2e7");
    text(T("Explore it yourself:", "استكشفه بنفسك:"), yq + 68, font(400, 28), "#b8c4d2");
    text("faiqthelegendpr012228-del.github.io/Islamic-3D-models", yq + 104, font(600, 26), "#f3dfa6");
    const finish = () => { try { c.toBlob(async (blob) => {
      const file = new File([blob], "signs-and-systems-certificate.png", { type: "image/png" });
      try {
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: T("My Signs & Systems certificate", "شهادتي من دلائل وأنظمة"),
            text: T("I explored all six exhibits of Signs & Systems!", "استكشفت المعارض الستة في دلائل وأنظمة!") });
          return;
        }
      } catch (e) { if (e && e.name === "AbortError") return; }
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = file.name;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    }, "image/png"); } catch (e) { if (!noQR) shareImage(last, true); } };   // opened from a file: no QR
    if (noQR) { finish(); return; }
    const qr = new Image();
    qr.onload = () => { g.drawImage(qr, W / 2 - 70, yq + 130, 140, 140); finish(); };
    qr.onerror = finish;
    qr.src = "images/site-qr.png";
    window.__lastCertCanvas = c;   // used by the test script
  }

  ["passport", "certificate"].forEach((id) =>
    $(id).addEventListener("click", (e) => { if (e.target.id === id) $(id).classList.remove("open"); }));
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") { P.close(); $("certificate").classList.remove("open"); } });
})();
