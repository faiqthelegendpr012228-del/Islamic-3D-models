/* =====================================================================
   toolkit.js  —  🧰 Toolkit: one place for all the study tools
   ---------------------------------------------------------------------
   The 🧰 button (bottom bar) opens a grid: Glossary, Zakat calculator,
   Prayer times, Then & now, Revision sheets, Settings.
   It also adds a "More for this exhibit" row to the Real Life page.
   ===================================================================== */
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const isAr = () => window.I18N && I18N.lang === "ar";
  const L = (en, ar) => (isAr() ? ar : en);

  const TOOLS = [
    { id: "glossary", icon: "📚", en: "Glossary", ar: "المصطلحات", den: "Islamic terms with meaning and pronunciation", dar: "مصطلحات إسلامية بمعناها ونطقها", go: () => window.GLOSSARY && GLOSSARY.open() },
    { id: "zakat", icon: "🧮", en: "Zakat calculator", ar: "حاسبة الزكاة", den: "Work out your family's zakat, gold in grams", dar: "احسب زكاة عائلتك، والذهب بالغرام", go: () => window.ZAKAT && ZAKAT.open() },
    { id: "prayer", icon: "🕌", en: "Prayer times today", ar: "أوقات الصلاة اليوم", den: "Worked out from the Sun, for any UAE city", dar: "محسوبة من موقع الشمس لأي مدينة إماراتية", go: () => window.PRAYER && PRAYER.open() },
    { id: "timeline", icon: "🕰", en: "Then & now", ar: "بين الأمس واليوم", den: "Each verse beside the year science measured it", dar: "كل آية بجانب سنة قياسها علميًا", go: () => window.TIMELINE && TIMELINE.open() },
    { id: "revision", icon: "🖨", en: "Revision sheets", ar: "أوراق المراجعة", den: "One printable page per exhibit, with answer key", dar: "صفحة للطباعة لكل معرض مع مفتاح الإجابات", go: () => window.open("revision.html" + (isAr() ? "?lang=ar" : ""), "_blank") },
    { id: "settings", icon: "⚙", en: "Settings", ar: "الإعدادات", den: "Bigger text, dyslexia font, contrast, offline", dar: "نص أكبر، خط لعُسر القراءة، تباين، دون إنترنت", go: () => window.SETTINGS && SETTINGS.open() }
  ];

  function open() {
    let m = $("toolkit");
    if (!m) {
      m = document.createElement("section");
      m.id = "toolkit"; m.className = "modal no-tr"; m.setAttribute("role", "dialog");
      document.body.appendChild(m);
      m.addEventListener("click", (e) => { if (e.target === m || e.target.classList.contains("x-close")) m.classList.remove("open"); });
    }
    m.innerHTML = `<div class="modal-body tk">
      <button class="x-close" aria-label="Close">✕</button>
      <h2>🧰 ${L("Toolkit", "صندوق الأدوات")}</h2>
      <p class="j-intro">${L("Tools to use at home, in class and for revision.", "أدوات للبيت والصف والمراجعة.")}</p>
      <div class="tk-grid">${TOOLS.map((t) => `<button class="tk-tile" data-tool="${t.id}">
          <span class="tk-icon">${t.icon}</span><b>${L(t.en, t.ar)}</b><small>${L(t.den, t.dar)}</small></button>`).join("")}</div></div>`;
    m.querySelectorAll("[data-tool]").forEach((b) => b.onclick = () => {
      m.classList.remove("open");
      TOOLS.find((t) => t.id === b.dataset.tool).go();
    });
    m.classList.add("open");
  }

  // ---------- the 🧰 chip in the bottom bar ----------
  const chip = document.createElement("button");
  chip.id = "toolkit-chip"; chip.className = "hud-chip show no-tr";
  chip.title = L("Glossary, Zakat calculator, prayer times, revision sheets and more", "المصطلحات وحاسبة الزكاة وأوقات الصلاة وأوراق المراجعة وغيرها");
  chip.innerHTML = `🧰 <span class="wc-steps">${L("Toolkit", "الأدوات")}</span>`;
  chip.onclick = open;
  const gl = $("glossary-chip");
  if (gl) gl.replaceWith(chip); else if ($("hud")) $("hud").appendChild(chip);

  // ---------- "More for this exhibit" on the Real Life page ----------
  window.LIFE_EXTRA = function (topic, body) {
    const btns = [];
    if (topic.id === "atm") btns.push(["zakat", "🧮", L("Family Zakat calculator", "حاسبة الزكاة للعائلة")]);
    if (topic.id === "clock") btns.push(["prayer", "🕌", L("Prayer times today", "أوقات الصلاة اليوم")]);
    if (window.TIMELINE && TIMELINE.has(topic.id)) btns.push(["timeline", "🕰", L("Then & now timeline", "خط زمني: بين الأمس واليوم")]);
    btns.push(["revision", "🖨", L("Revision sheet", "ورقة المراجعة")]);
    const div = document.createElement("div");
    div.className = "life-extra no-tr";
    div.innerHTML = `<h3>${L("More for this exhibit", "المزيد لهذا المعرض")}</h3>
      <div class="tool-row">${btns.map(([id, ic, label]) => `<button class="btn small" data-x="${id}">${ic} ${label}</button>`).join("")}</div>`;
    div.querySelectorAll("[data-x]").forEach((b) => b.onclick = () => {
      const id = b.dataset.x;
      if (id === "timeline") TIMELINE.open(topic.id);
      else if (id === "revision") window.open(`revision.html?topic=${topic.id}${isAr() ? "&lang=ar" : ""}`, "_blank");
      else TOOLS.find((t) => t.id === id).go();
    });
    body.appendChild(div);
  };

  window.TOOLKIT = { open };
})();
