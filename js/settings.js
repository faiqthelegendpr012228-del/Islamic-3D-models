/* =====================================================================
   settings.js  —  ⚙ Settings: easy-read options + "works with no Wi-Fi"
   ---------------------------------------------------------------------
   Easy-read: bigger text, dyslexia-friendly font (OpenDyslexic),
   high contrast, calm mode (less movement). Saved on this device.
   Offline: shows what is saved, "Save everything" downloads all voices
   and 3D models, and "Install" adds the site to the home screen.
   The saved options are applied early by a tiny script in index.html.
   ===================================================================== */
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const isAr = () => window.I18N && I18N.lang === "ar";
  const L = (en, ar) => (isAr() ? ar : en);
  const KEY = "signs-systems-easyread";
  const root = document.documentElement;

  let ez = { size: 0, dys: false, hc: false, calm: false };
  try { Object.assign(ez, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) { /* ignore */ }
  function apply() {
    root.classList.toggle("ez-l", ez.size === 1);
    root.classList.toggle("ez-xl", ez.size === 2);
    root.classList.toggle("ez-dys", ez.dys);
    root.classList.toggle("ez-hc", ez.hc);
    root.classList.toggle("ez-calm", ez.calm);
    try { localStorage.setItem(KEY, JSON.stringify(ez)); } catch (e) { /* ignore */ }
    // the 3D view and the top bar need to re-measure after a text-size change
    setTimeout(() => window.dispatchEvent(new Event("resize")), 50);
  }

  // ---------- offline (service worker) ----------
  const canOffline = "serviceWorker" in navigator && /^https?:$/.test(location.protocol);
  let installEvt = null;
  if (canOffline) {
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }
  window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); installEvt = e; refreshOffline(); });
  window.addEventListener("appinstalled", () => { installEvt = null; refreshOffline(); });
  const standalone = () => matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  function ask(msg) {
    return new Promise((res) => {
      const sw = navigator.serviceWorker && navigator.serviceWorker.controller;
      if (!sw) return res(null);
      const ch = new MessageChannel();
      ch.port1.onmessage = (e) => res(e.data);
      sw.postMessage(msg, [ch.port2]);
      setTimeout(() => res(null), 8000);
    });
  }

  async function refreshOffline() {
    const box = $("st-offline");
    if (!box) return;
    if (!canOffline) {
      box.innerHTML = `<p class="how">${L(
        "Offline saving works on the published website (the github.io link), not when the file is opened straight from a folder.",
        "الحفظ دون إنترنت يعمل على الموقع المنشور (رابط github.io)، وليس عند فتح الملف مباشرة من مجلد.")}</p>`;
      return;
    }
    const s = await ask("status");
    let html = "";
    if (!s) {
      html += `<p>⏳ ${L("Getting ready… The site saves itself in the background the first time it opens. Reopen this panel in a moment.", "جارٍ التجهيز… يحفظ الموقع نفسه في الخلفية عند فتحه أول مرة. افتح هذه اللوحة بعد لحظة.")}</p>`;
    } else {
      const coreOk = s.core >= s.coreTotal - 1;
      html += `<p>${coreOk ? "✅ " + L("The website is saved on this device. It will open even with no Wi-Fi.", "الموقع محفوظ على هذا الجهاز، وسيفتح حتى دون إنترنت.")
                            : "⏳ " + L(`Saving the website… (${s.core} of ${s.coreTotal} files)`, `جارٍ حفظ الموقع… (${s.core} من ${s.coreTotal} ملفًا)`)}</p>
        <p>🔊 ${L(`Voices and 3D models saved: ${s.saved} of ${s.total}. Anything you play is saved automatically.`, `الأصوات والنماذج المحفوظة: ${s.saved} من ${s.total}. كل ما تشغّله يُحفظ تلقائيًا.`)}</p>
        ${s.saved < s.total ? `<button class="btn small" id="st-saveall">⬇ ${L(`Save everything now (about ${s.mb} MB)`, `احفظ كل شيء الآن (نحو ${s.mb} ميغابايت)`)}</button>
          <div class="how">${L("Do this once on the exhibition laptop, on good Wi-Fi.", "افعل ذلك مرة واحدة على حاسوب المعرض مع إنترنت جيد.")}</div>` : "✅ " + L("Everything is saved.", "كل شيء محفوظ.")}
        <div class="st-bar" id="st-bar" hidden><span></span></div>`;
    }
    if (standalone()) html += `<p>📲 ${L("Running as an app.", "يعمل كتطبيق.")}</p>`;
    else if (installEvt) html += `<button class="btn ghost small" id="st-install">📲 ${L("Install as an app", "ثبّته كتطبيق")}</button>`;
    else if (isIOS) html += `<p class="how">📲 ${L("On iPhone or iPad: tap Share, then “Add to Home Screen”.", "على آيفون أو آيباد: اضغط مشاركة ثم «إضافة إلى الشاشة الرئيسية».")}</p>`;
    else html += `<p class="how">📲 ${L("To install: open the browser menu (⋮) and choose “Install app” or “Add to Home screen”.", "للتثبيت: افتح قائمة المتصفح (⋮) واختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».")}</p>`;
    box.innerHTML = html;

    const save = $("st-saveall");
    if (save) save.onclick = () => {
      save.disabled = true;
      const bar = $("st-bar"); bar.hidden = false;
      const ch = new MessageChannel();
      ch.port1.onmessage = (e) => {
        const d = e.data;
        if (d.progress) bar.firstElementChild.style.width = Math.round(100 * d.progress / d.total) + "%";
        if (d.finished) refreshOffline();
      };
      navigator.serviceWorker.controller.postMessage("save-all", [ch.port2]);
    };
    const inst = $("st-install");
    if (inst) inst.onclick = async () => { installEvt.prompt(); await installEvt.userChoice; installEvt = null; refreshOffline(); };
  }

  // ---------- the panel ----------
  function build() {
    const m = document.createElement("section");
    m.id = "settings"; m.className = "modal no-tr"; m.setAttribute("role", "dialog");
    m.setAttribute("aria-label", L("Settings", "الإعدادات"));
    m.innerHTML = `<div class="modal-body st">
      <button class="x-close" aria-label="Close">✕</button>
      <h2>⚙ ${L("Settings", "الإعدادات")}</h2>
      <h3>👓 ${L("Easy-read", "قراءة أسهل")}</h3>
      <div class="st-row"><span>${L("Text size", "حجم النص")}</span>
        <div class="seg" id="st-size">
          <button data-s="0">A</button><button data-s="1" style="font-size:1.15em">A</button><button data-s="2" style="font-size:1.3em">A</button>
        </div></div>
      <label class="st-row st-toggle"><span>${L("Dyslexia-friendly font", "خط مناسب لعُسر القراءة")}<small>${L("OpenDyslexic, with more space between letters and lines", "OpenDyslexic مع مسافات أكبر بين الحروف والأسطر")}</small></span><input type="checkbox" data-ez="dys"></label>
      <label class="st-row st-toggle"><span>${L("High contrast", "تباين عالٍ")}<small>${L("Black, white and yellow; no see-through panels", "أسود وأبيض وأصفر دون لوحات شفافة")}</small></span><input type="checkbox" data-ez="hc"></label>
      <label class="st-row st-toggle"><span>${L("Calm mode", "وضع هادئ")}<small>${L("Turns off moving effects and animations", "يوقف المؤثرات والحركات")}</small></span><input type="checkbox" data-ez="calm"></label>
      <div class="st-preview">${L("Preview: “Indeed, in the creation of the heavens and the earth … are signs for people of understanding.” (3:190)", "معاينة: ﴿إِنَّ فِي خَلْقِ السَّمَاوَاتِ وَالْأَرْضِ … لَآيَاتٍ لِّأُولِي الْأَلْبَابِ﴾ (آل عمران ١٩٠)")}</div>
      <button class="btn ghost small" id="st-reset">↺ ${L("Back to normal", "العودة إلى الوضع العادي")}</button>
      <h3>📶 ${L("Works with no Wi-Fi", "يعمل دون إنترنت")}</h3>
      <div id="st-offline"></div>
    </div>`;
    document.body.appendChild(m);
    m.addEventListener("click", (e) => { if (e.target === m || e.target.classList.contains("x-close")) m.classList.remove("open"); });
    m.querySelectorAll("[data-s]").forEach((b) => b.onclick = () => { ez.size = +b.dataset.s; apply(); sync(); });
    m.querySelectorAll("[data-ez]").forEach((c) => c.onchange = () => { ez[c.dataset.ez] = c.checked; apply(); });
    $("st-reset").onclick = () => { ez = { size: 0, dys: false, hc: false, calm: false }; apply(); sync(); };
    return m;
  }
  function sync() {
    const m = $("settings");
    m.querySelectorAll("[data-s]").forEach((b) => b.classList.toggle("on", +b.dataset.s === ez.size));
    m.querySelectorAll("[data-ez]").forEach((c) => (c.checked = !!ez[c.dataset.ez]));
  }
  function open() {
    if (!$("settings")) build();
    sync(); refreshOffline();
    $("settings").classList.add("open");
  }

  // ---------- buttons: a pill on the homepage, a button in the exhibit top bar ----------
  function addButtons() {
    const pill = document.createElement("button");
    pill.id = "settings-pill"; pill.className = "no-tr";
    pill.innerHTML = `⚙ <span>${L("Settings", "الإعدادات")}</span>`;
    pill.title = L("Easy-read options and offline mode", "خيارات القراءة السهلة والعمل دون إنترنت");
    pill.onclick = open;
    document.body.appendChild(pill);
    const tb = $("topbar");
    if (tb) {
      const b = document.createElement("button");
      b.className = "nav-btn settings-btn no-tr"; b.textContent = "⚙ " + L("Settings", "الإعدادات");
      b.onclick = open;
      const lang = tb.querySelector(".lang-btn");
      tb.insertBefore(b, lang || null);
    }
  }

  apply();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", addButtons); else addButtons();
  window.SETTINGS = { open, get easyRead() { return Object.assign({}, ez); } };
})();
