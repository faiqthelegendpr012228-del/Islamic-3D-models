/* =====================================================================
   zakat.js  —  Family Zakat calculator (works anywhere on the site)
   ---------------------------------------------------------------------
   Gold and silver are entered in grams by carat; the calculator works
   out the pure metal, checks the nisab (85 g gold or 595 g silver) and
   gives 2.5%. Numbers stay on this device (saved in the browser only).
   Open with ZAKAT.open() or the link ?zakat
   ===================================================================== */
(function () {
  "use strict";
  const cfg = window.APP_CONFIG || {};
  const isAr = () => window.I18N && I18N.lang === "ar";
  const L = (en, ar) => (isAr() ? ar : en);
  const KEY = "signs-systems-zakat";
  const NISAB_GOLD_G = 85, NISAB_SILVER_G = 595, RATE = 0.025;

  const FIELDS = [
    { group: "money", id: "cash",   icon: "💵", en: "Cash at home",                     ar: "النقد في البيت" },
    { group: "money", id: "bank",   icon: "🏦", en: "Bank and savings accounts",        ar: "الحسابات البنكية والمدخرات" },
    { group: "money", id: "invest", icon: "📈", en: "Shares and investments (today's value)", ar: "الأسهم والاستثمارات (قيمتها اليوم)" },
    { group: "money", id: "stock",  icon: "📦", en: "Business stock for sale",          ar: "بضاعة تجارية معدّة للبيع" },
    { group: "money", id: "owed",   icon: "🤝", en: "Money people owe you (will be repaid)", ar: "ديون لك يُتوقع سدادها" },
    { group: "gold",  id: "g24",    icon: "🥇", en: "24 carat gold (grams)",            ar: "ذهب عيار 24 (غرام)", karat: 24 },
    { group: "gold",  id: "g22",    icon: "🥇", en: "22 carat gold (grams)",            ar: "ذهب عيار 22 (غرام)", karat: 22 },
    { group: "gold",  id: "g21",    icon: "🥇", en: "21 carat gold (grams)",            ar: "ذهب عيار 21 (غرام)", karat: 21 },
    { group: "gold",  id: "g18",    icon: "🥇", en: "18 carat gold (grams)",            ar: "ذهب عيار 18 (غرام)", karat: 18 },
    { group: "gold",  id: "silver", icon: "🥈", en: "Silver (grams)",                   ar: "الفضة (غرام)" },
    { group: "minus", id: "debts",  icon: "➖", en: "Debts and bills due now",          ar: "ديون وفواتير مستحقة الآن" }
  ];

  let v = { goldPrice: cfg.goldPricePerGram || 496.75, silverPrice: cfg.silverPricePerGram || 7.14, standard: "gold", year: true };
  FIELDS.forEach((f) => (v[f.id] = 0));
  try { Object.assign(v, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) { /* ignore */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* ignore */ } };

  const money = (n) => (isAr() ? "" : "AED ") + Math.round(n).toLocaleString(isAr() ? "ar-AE" : "en-US") + (isAr() ? " درهم" : "");
  const money2 = (n) => (isAr() ? "" : "AED ") + n.toLocaleString(isAr() ? "ar-AE" : "en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + (isAr() ? " درهم" : "");

  function calc() {
    const num = (k) => Math.max(0, +v[k] || 0);
    const pureGold = ["g24", "g22", "g21", "g18"].reduce((s, k) => s + num(k) * (+k.slice(1)) / 24, 0);
    const goldValue = pureGold * num("goldPrice");
    const silverValue = num("silver") * num("silverPrice");
    const moneyTotal = ["cash", "bank", "invest", "stock", "owed"].reduce((s, k) => s + num(k), 0);
    const total = Math.max(0, moneyTotal + goldValue + silverValue - num("debts"));
    const nisab = v.standard === "silver" ? NISAB_SILVER_G * num("silverPrice") : NISAB_GOLD_G * num("goldPrice");
    const due = v.year && total >= nisab && total > 0;
    return { pureGold, goldValue, silverValue, moneyTotal, debts: num("debts"), total, nisab, due, zakat: due ? total * RATE : 0 };
  }

  function build() {
    const m = document.createElement("section");
    m.id = "zakat-modal"; m.className = "modal no-tr"; m.setAttribute("role", "dialog");
    m.setAttribute("aria-label", L("Family Zakat calculator", "حاسبة الزكاة للعائلة"));
    const field = (f) => `<label class="zk-field"><span>${f.icon} ${L(f.en, f.ar)}</span>
        <input type="number" inputmode="decimal" min="0" step="any" data-k="${f.id}" value="${v[f.id] || ""}" placeholder="0"></label>`;
    m.innerHTML = `<div class="modal-body zk">
      <button class="x-close" aria-label="Close">✕</button>
      <h2>🧮 ${L("Family Zakat calculator", "حاسبة الزكاة للعائلة")}</h2>
      <p class="j-intro">${L(
        "Add up what your family owns, and the calculator checks the nisab and works out the 2.5% zakat. Your numbers stay on this device.",
        "اجمع ما تملكه عائلتك، وستتحقق الحاسبة من النصاب وتحسب الزكاة بنسبة 2.5٪. أرقامك تبقى على هذا الجهاز فقط.")}</p>
      <div class="zk-cols">
        <div>
          <h3>💰 ${L("Money and things for sale", "المال والبضائع")}</h3>
          ${FIELDS.filter((f) => f.group === "money").map(field).join("")}
          <h3>➖ ${L("Take away", "اطرح")}</h3>
          ${FIELDS.filter((f) => f.group === "minus").map(field).join("")}
        </div>
        <div>
          <h3>🥇 ${L("Gold and silver", "الذهب والفضة")}</h3>
          ${FIELDS.filter((f) => f.group === "gold").map(field).join("")}
          <div class="zk-prices">
            <label class="zk-field"><span>${L("24 carat gold price (AED per gram)", "سعر غرام الذهب عيار 24 (درهم)")}</span><input type="number" step="any" min="0" data-k="goldPrice" value="${v.goldPrice}"></label>
            <label class="zk-field"><span>${L("Silver price (AED per gram)", "سعر غرام الفضة (درهم)")}</span><input type="number" step="any" min="0" data-k="silverPrice" value="${v.silverPrice}"></label>
            <div class="how">${L("Prices change every day. Type today's price for an exact answer.", "الأسعار تتغير يوميًا. اكتب سعر اليوم لنتيجة دقيقة.")}</div>
          </div>
        </div>
      </div>
      <div class="zk-options">
        <div class="seg zk-std">
          <button data-std="gold">${L("Nisab by gold (85 g)", "النصاب بالذهب (85 غ)")}</button>
          <button data-std="silver">${L("Nisab by silver (595 g)", "النصاب بالفضة (595 غ)")}</button>
        </div>
        <label class="zk-check"><input type="checkbox" data-k="year" ${v.year ? "checked" : ""}> ${L(
          "We have owned this amount for one full lunar (Hijri) year",
          "ملكنا هذا المبلغ مدة سنة هجرية كاملة")}</label>
      </div>
      <div id="zk-out"></div>
      <div class="zk-actions">
        <button class="btn small" id="zk-print">🖨 ${L("Print for my family", "اطبعها لعائلتي")}</button>
        <button class="btn ghost small" id="zk-clear">↺ ${L("Clear", "مسح")}</button>
        <button class="btn ghost small" id="zk-who">📖 ${L("Who receives zakat? (9:60)", "من يستحق الزكاة؟ (9:60)")}</button>
      </div>
      <p class="zk-small">${L(
        "Nisab: most scholars say zakat is due when savings reach the value of 85 g of gold or 595 g of silver, held for a lunar year. Many recommend the silver nisab because it is lower, so more people give and the poor benefit. This is a learning tool. For your family's actual zakat, ask a scholar or the UAE zakat authority (Awqaf), especially for business, shares or debts.",
        "النصاب: يرى أكثر العلماء أن الزكاة تجب إذا بلغ المال قيمة 85 غرامًا من الذهب أو 595 غرامًا من الفضة وحال عليه الحول. ويفضّل كثيرون نصاب الفضة لأنه أقل فيزكّي عدد أكبر وينتفع الفقراء. هذه أداة تعليمية؛ لزكاة عائلتك الفعلية اسأل عالمًا أو الهيئة المختصة بالزكاة، خاصة في التجارة والأسهم والديون.")}</p>
    </div>`;
    document.body.appendChild(m);

    m.addEventListener("click", (e) => { if (e.target === m || e.target.classList.contains("x-close")) m.classList.remove("open"); });
    m.querySelectorAll("input[data-k]").forEach((i) => {
      i.addEventListener("input", () => { v[i.dataset.k] = i.type === "checkbox" ? i.checked : i.value; save(); render(); });
    });
    m.querySelectorAll("[data-std]").forEach((b) => b.onclick = () => { v.standard = b.dataset.std; save(); render(); });
    m.querySelector("#zk-clear").onclick = () => {
      FIELDS.forEach((f) => (v[f.id] = 0));
      m.querySelectorAll("input[data-k]").forEach((i) => { if (FIELDS.some((f) => f.id === i.dataset.k)) i.value = ""; });
      save(); render();
    };
    m.querySelector("#zk-print").onclick = () => { document.body.classList.add("print-zakat"); window.print(); };
    window.addEventListener("afterprint", () => document.body.classList.remove("print-zakat"));
    m.querySelector("#zk-who").onclick = () => {
      const out = m.querySelector("#zk-recipients");
      if (out) { out.remove(); return; }
      m.querySelector("#zk-out").insertAdjacentHTML("afterend", `<div id="zk-recipients" class="result-box">
        <b>${L("The eight groups in Surah At-Tawbah 9:60", "الأصناف الثمانية في سورة التوبة 9:60")}</b>
        <div class="arabic">${(window.REFERENCES && REFERENCES.tawbah60 && REFERENCES.tawbah60.arabic) || ""}</div>
        <div>${L("The poor · the needy · zakat workers · those whose hearts are being brought closer · freeing captives · people in debt · in the cause of Allah · stranded travellers",
                  "الفقراء · المساكين · العاملون عليها · المؤلفة قلوبهم · في الرقاب · الغارمون · في سبيل الله · ابن السبيل")}</div></div>`);
    };
    return m;
  }

  function render() {
    const m = document.getElementById("zakat-modal");
    m.querySelectorAll("[data-std]").forEach((b) => b.classList.toggle("on", b.dataset.std === v.standard));
    const r = calc();
    const row = (label, val) => `<div class="zk-row"><span>${label}</span><b>${val}</b></div>`;
    let verdict;
    if (r.total <= 0) verdict = L("Type your family's amounts above to begin.", "اكتب مبالغ عائلتك في الأعلى للبدء.");
    else if (!v.year) verdict = L("ℹ️ Zakat becomes due once wealth above the nisab has been owned for a full lunar year.", "ℹ️ تجب الزكاة عندما يحول الحول على مال بلغ النصاب.");
    else if (r.due) verdict = L("✅ Above the nisab: zakat is due.", "✅ بلغ المال النصاب: الزكاة واجبة.");
    else verdict = L("ℹ️ Below the nisab: no zakat is due this year. Sadaqah (voluntary charity) is always welcome.", "ℹ️ لم يبلغ المال النصاب: لا زكاة هذا العام، والصدقة مستحبة دائمًا.");
    m.querySelector("#zk-out").innerHTML = `<div class="result-box ${r.due ? "good" : ""}">
      ${row(L("Money, investments and stock", "المال والاستثمارات والبضائع"), money(r.moneyTotal))}
      ${row(L(`Gold (${r.pureGold.toFixed(1)} g pure gold)`, `الذهب (${r.pureGold.toFixed(1)} غ ذهب خالص)`), money(r.goldValue))}
      ${row(L("Silver", "الفضة"), money(r.silverValue))}
      ${r.debts ? row(L("Minus debts due now", "ناقص الديون المستحقة"), "−" + money(r.debts)) : ""}
      <hr>
      ${row(L("Zakatable wealth", "المال الخاضع للزكاة"), money(r.total))}
      ${row(L(`Nisab (${v.standard === "silver" ? "595 g silver" : "85 g gold"})`, `النصاب (${v.standard === "silver" ? "595 غ فضة" : "85 غ ذهب"})`), money(r.nisab))}
      <div class="zk-due"><span>${L("Zakat due (2.5%)", "الزكاة الواجبة (2.5٪)")}</span><b class="big-number">${money2(r.zakat)}</b></div>
      <div>${verdict}</div>
    </div>`;
  }

  function open() {
    if (!document.getElementById("zakat-modal")) build();
    render();
    document.getElementById("zakat-modal").classList.add("open");
  }

  window.ZAKAT = { open, calc: () => calc() };
  if (/[?&]zakat\b/.test(location.search)) window.addEventListener("load", () => setTimeout(open, 600));
})();
