/* =====================================================================
   prayer.js  —  Today's prayer times, worked out on the page
   ---------------------------------------------------------------------
   No internet needed: the times come from the Sun's position for the
   date and place (the same maths prayer apps use, from praytimes.org).
   Method: UAE / Dubai — Fajr and Isha when the Sun is 18.2° below the
   horizon, plus the small minute adjustments used in UAE timetables.
   Official mosque timetables (Awqaf) can differ by a minute or two.

   PRAYER.times(date, place, asrFactor)  → { fajr, sunrise, dhuhr, … } in hours
   PRAYER.widget(element)               → draws the "today" card
   ===================================================================== */
(function () {
  "use strict";

  const PLACES = [
    { id: "sharjah",   en: "Sharjah",        ar: "الشارقة",      lat: 25.3463, lng: 55.4209 },
    { id: "dubai",     en: "Dubai",          ar: "دبي",          lat: 25.2048, lng: 55.2708 },
    { id: "ajman",     en: "Ajman",          ar: "عجمان",        lat: 25.4052, lng: 55.5136 },
    { id: "abudhabi",  en: "Abu Dhabi",      ar: "أبوظبي",       lat: 24.4539, lng: 54.3773 },
    { id: "alain",     en: "Al Ain",         ar: "العين",        lat: 24.2075, lng: 55.7447 },
    { id: "uaq",       en: "Umm Al Quwain",  ar: "أم القيوين",   lat: 25.5647, lng: 55.5552 },
    { id: "rak",       en: "Ras Al Khaimah", ar: "رأس الخيمة",   lat: 25.8007, lng: 55.9762 },
    { id: "fujairah",  en: "Fujairah",       ar: "الفجيرة",      lat: 25.1288, lng: 56.3265 }
  ];
  const UAE_TZ = 4;
  const ANGLE = 18.2;
  const ADJUST = { sunrise: -3, dhuhr: 3, asr: 3, maghrib: 3 };   // minutes

  // ---------- small maths helpers (degrees) ----------
  const d2r = Math.PI / 180, r2d = 180 / Math.PI;
  const sin = (d) => Math.sin(d * d2r), cos = (d) => Math.cos(d * d2r), tan = (d) => Math.tan(d * d2r);
  const asin = (x) => Math.asin(x) * r2d, acos = (x) => Math.acos(x) * r2d, atan2 = (y, x) => Math.atan2(y, x) * r2d;
  const acot = (x) => Math.atan(1 / x) * r2d;
  const fix = (a, b) => { a = a - b * Math.floor(a / b); return a < 0 ? a + b : a; };

  function julian(y, m, d) {
    if (m <= 2) { y -= 1; m += 12; }
    const A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
  }
  /** Sun's declination and the equation of time for a Julian date */
  function sun(jd) {
    const D = jd - 2451545.0;
    const g = fix(357.529 + 0.98560028 * D, 360);
    const q = fix(280.459 + 0.98564736 * D, 360);
    const L = fix(q + 1.915 * sin(g) + 0.020 * sin(2 * g), 360);
    const e = 23.439 - 0.00000036 * D;
    const RA = atan2(cos(e) * sin(L), cos(L)) / 15;
    return { decl: asin(sin(e) * sin(L)), eqt: q / 15 - fix(RA, 24) };
  }

  /** Prayer times (hours, local clock time) for a date and place */
  function times(date, place, asrFactor) {
    asrFactor = asrFactor || 1;
    const lat = place.lat, lng = place.lng, tz = place.tz != null ? place.tz : UAE_TZ;
    const jd = julian(date.getFullYear(), date.getMonth() + 1, date.getDate()) - lng / (15 * 24);
    const midDay = (t) => fix(12 - sun(jd + t).eqt, 24);
    const angleTime = (angle, t, before) => {
      const decl = sun(jd + t).decl, noon = midDay(t);
      const T = acos((-sin(angle) - sin(decl) * sin(lat)) / (cos(decl) * cos(lat))) / 15;
      return noon + (before ? -T : T);
    };
    const asrTime = (t) => {
      const decl = sun(jd + t).decl;
      return angleTime(-acot(asrFactor + tan(Math.abs(lat - decl))), t);
    };
    // two passes: first guess, then refine using the Sun's position at that time
    let t = { fajr: 5, sunrise: 6, dhuhr: 12, asr: 13, maghrib: 18, isha: 18 };
    for (let i = 0; i < 2; i++) {
      const f = (h) => h / 24;
      t = {
        fajr: angleTime(ANGLE, f(t.fajr), true),
        sunrise: angleTime(0.833, f(t.sunrise), true),
        dhuhr: midDay(f(t.dhuhr)),
        asr: asrTime(f(t.asr)),
        maghrib: angleTime(0.833, f(t.maghrib)),
        isha: angleTime(ANGLE, f(t.isha))
      };
    }
    const out = {};
    for (const k in t) out[k] = t[k] + tz - lng / 15 + (ADJUST[k] || 0) / 60;
    return out;
  }

  const ORDER = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];
  const NAMES = {
    fajr: ["Fajr", "الفجر"], sunrise: ["Sunrise", "الشروق"], dhuhr: ["Dhuhr", "الظهر"],
    asr: ["Asr", "العصر"], maghrib: ["Maghrib", "المغرب"], isha: ["Isha", "العشاء"]
  };
  const COLORS = { fajr: "#6c7bff", sunrise: "#ffb347", dhuhr: "#ffe066", asr: "#ffa94d", maghrib: "#ff6b6b", isha: "#b28cff" };
  const hm = (h) => { const m = Math.round(fix(h, 24) * 60) % 1440; return String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0"); };

  // ---------- the card ----------
  const isAr = () => window.I18N && I18N.lang === "ar";
  const L = (en, ar) => (isAr() ? ar : en);
  const KEY = "signs-systems-prayer";
  let prefs = { place: "sharjah", asr: 1 };
  try { Object.assign(prefs, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) { /* ignore */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch (e) { /* ignore */ } };

  function hijri(date) {
    try {
      return new Intl.DateTimeFormat(isAr() ? "ar-SA-u-ca-islamic-umalqura" : "en-u-ca-islamic-umalqura",
        { day: "numeric", month: "long", year: "numeric" }).format(date);
    } catch (e) { return ""; }
  }
  function placeOf() {
    if (prefs.place === "here" && prefs.here) return prefs.here;
    return PLACES.find((p) => p.id === prefs.place) || PLACES[0];
  }

  function widget(el, opts) {
    opts = opts || {};
    el.classList.add("pt-card", "no-tr");
    let timer = null, last = null;
    function draw() {
      if (!el.isConnected) { clearInterval(timer); return; }
      const now = new Date(), place = placeOf();
      const tz = place.tz != null ? place.tz : UAE_TZ;
      // clock time at that place, as hours
      const here = new Date(now.getTime() + (now.getTimezoneOffset() + tz * 60) * 60000);
      const nowH = here.getHours() + here.getMinutes() / 60 + here.getSeconds() / 3600;
      const t = times(here, place, prefs.asr);
      let next = ORDER.find((k) => k !== "sunrise" && t[k] > nowH);
      let left = next ? t[next] - nowH : null;
      if (!next) { next = "fajr"; left = times(new Date(here.getTime() + 864e5), place, prefs.asr).fajr + 24 - nowH; }
      let current = null;
      ORDER.forEach((k) => { if (k !== "sunrise" && t[k] <= nowH) current = k; });
      if (!current) current = "isha";
      if (t.sunrise <= nowH && nowH < t.dhuhr) current = null;     // after sunrise: no obligatory prayer
      const hh = Math.floor(left), mm = Math.floor((left - hh) * 60);
      const inTxt = hh ? L(`${hh} h ${mm} min`, `${hh} س ${mm} د`) : L(`${mm} min`, `${mm} دقيقة`);
      const name = place.en ? L(place.en, place.ar) : L("your location", "موقعك");

      el.innerHTML = `
        <div class="pt-head">
          <div><div class="label-sm">${L("Today in", "اليوم في")} ${name}</div>
            <div class="pt-date">${now.toLocaleDateString(isAr() ? "ar-AE" : "en-GB", { weekday: "long", day: "numeric", month: "long" })}</div>
            <div class="pt-hijri">${hijri(here)}</div></div>
          <div class="pt-next"><div class="label-sm">${L("Next", "التالية")}</div>
            <b style="color:${COLORS[next]}">${NAMES[next][isAr() ? 1 : 0]}</b>
            <div>${L("in", "بعد")} ${inTxt}</div></div>
        </div>
        <div class="pt-grid">
          ${ORDER.map((k) => `<div class="pt-row ${k === current ? "now" : ""} ${k === "sunrise" ? "sr" : ""}" style="--pc:${COLORS[k]}">
              <span>${NAMES[k][isAr() ? 1 : 0]}</span><b>${hm(t[k])}</b></div>`).join("")}
        </div>
        <div class="pt-controls">
          <select class="pt-place" aria-label="${L("City", "المدينة")}">
            ${PLACES.map((p) => `<option value="${p.id}" ${p.id === prefs.place ? "selected" : ""}>${L(p.en, p.ar)}</option>`).join("")}
            <option value="here" ${prefs.place === "here" ? "selected" : ""}>📍 ${L("My location", "موقعي")}</option>
          </select>
          <select class="pt-asr" aria-label="Asr">
            <option value="1" ${prefs.asr == 1 ? "selected" : ""}>${L("Asr: standard", "العصر: الجمهور")}</option>
            <option value="2" ${prefs.asr == 2 ? "selected" : ""}>${L("Asr: Hanafi", "العصر: الحنفي")}</option>
          </select>
          ${opts.onShow ? `<button class="btn small pt-show">🌍 ${L("Show now on the Earth", "اعرض الآن على الأرض")}</button>` : ""}
        </div>
        <div class="pt-note">${L(
          "Worked out on this page from the Sun's position (UAE method, Sun 18.2° below the horizon for Fajr and Isha). Always follow your local mosque or the official Awqaf timetable, which can differ by a minute or two.",
          "محسوبة في هذه الصفحة من موقع الشمس (الطريقة الإماراتية: الشمس ‎18.2°‎ تحت الأفق للفجر والعشاء). اتبع دائمًا مسجدك أو تقويم الأوقاف الرسمي، فقد يختلف بدقيقة أو اثنتين.")}</div>`;

      el.querySelector(".pt-place").onchange = (e) => {
        if (e.target.value === "here") return locate();
        prefs.place = e.target.value; save(); draw();
      };
      el.querySelector(".pt-asr").onchange = (e) => { prefs.asr = +e.target.value; save(); draw(); };
      const show = el.querySelector(".pt-show");
      if (show) show.onclick = () => opts.onShow({ times: t, nowH, place, current, next });
      last = { times: t, nowH, place, current, next };
      if (opts.onDraw) opts.onDraw(last);
    }
    function locate() {
      if (!navigator.geolocation) { draw(); return; }
      navigator.geolocation.getCurrentPosition((pos) => {
        prefs.place = "here";
        prefs.here = { lat: +pos.coords.latitude.toFixed(4), lng: +pos.coords.longitude.toFixed(4), tz: -new Date().getTimezoneOffset() / 60 };
        save(); draw();
      }, () => { prefs.place = "sharjah"; save(); draw(); }, { timeout: 10000 });
    }
    draw();
    timer = setInterval(draw, 30000);
    return { redraw: draw, stop: () => clearInterval(timer), get last() { return last; } };
  }

  /** A pop-up with just the card (used from the Toolkit) */
  function open() {
    let m = document.getElementById("prayer-modal");
    if (!m) {
      m = document.createElement("section");
      m.id = "prayer-modal"; m.className = "modal no-tr"; m.setAttribute("role", "dialog");
      m.innerHTML = `<div class="modal-body"><button class="x-close" aria-label="Close">✕</button>
        <h2>🕌 ${L("Prayer times today", "أوقات الصلاة اليوم")}</h2><div class="pt-slot"></div>
        <button class="btn ghost small pt-go">🌙 ${L("See how it works in the Cosmic Clock", "شاهد كيف تُحسب في الساعة الكونية")}</button></div>`;
      document.body.appendChild(m);
      m.addEventListener("click", (e) => { if (e.target === m || e.target.classList.contains("x-close")) m.classList.remove("open"); });
      m.querySelector(".pt-go").onclick = () => { m.classList.remove("open"); window.APP_ENTER && APP_ENTER("clock"); setTimeout(() => window.CLOCK_TODAY && CLOCK_TODAY(), 900); };
    }
    widget(m.querySelector(".pt-slot"));
    m.classList.add("open");
  }

  window.PRAYER = { times, widget, open, PLACES, hm };
})();
