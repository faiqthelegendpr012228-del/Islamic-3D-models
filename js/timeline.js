/* =====================================================================
   timeline.js  —  "Then & now" for the three Scientific Miracles exhibits
   ---------------------------------------------------------------------
   Each exhibit: the verse (revealed 610–632 CE) beside the year science
   measured or explained the same thing. Like the exhibits themselves,
   it keeps "what the verse says" and "what science found" side by side,
   and says honestly when something was already known before Islam.
   ⚠ Teacher check: please confirm the wording before the exhibition.
   ===================================================================== */
(function () {
  "use strict";
  const isAr = () => window.I18N && I18N.lang === "ar";
  const L = (en, ar) => (isAr() ? ar : en);
  const REVEALED = 632;    // revelation completed

  const DATA = {
    sky: {
      verses: ["anbiya32", "tariq11"],
      events: [
        { year: 1798, en: "Two German students, Brandes and Benzenberg, measure how high meteors burn up: tens of kilometres up, inside the atmosphere.",
          ar: "طالبان ألمانيان، براندس وبنتسنبرغ، يقيسان ارتفاع احتراق الشهب: عشرات الكيلومترات داخل الغلاف الجوي." },
        { year: 1913, en: "French physicists Charles Fabry and Henri Buisson discover the ozone layer, which blocks the Sun's most harmful UV rays.",
          ar: "الفيزيائيان الفرنسيان شارل فابري وهنري بويسون يكتشفان طبقة الأوزون التي تحجب أخطر الأشعة فوق البنفسجية." },
        { year: 1958, en: "The satellite Explorer 1 finds the Van Allen belts: Earth's magnetic field traps charged particles from space.",
          ar: "القمر الصناعي إكسبلورر 1 يكتشف حزامَي فان ألن: المجال المغناطيسي للأرض يحبس الجسيمات المشحونة القادمة من الفضاء." }
      ]
    },
    clock: {
      verses: ["yasin38", "yasin40", "yunus5"],
      events: [
        { year: -450, before: true,
          en: "Already known before Islam: Greek thinkers such as Anaxagoras taught that the Moon shines with reflected sunlight.",
          ar: "معروف قبل الإسلام: علّم مفكرون يونانيون مثل أناكساغوراس أن القمر يضيء بضوء الشمس المنعكس." },
        { year: 1609, en: "Johannes Kepler shows that planets travel in fixed oval orbits, each on its own path.",
          ar: "يوهانس كبلر يبيّن أن الكواكب تسير في مدارات بيضاوية ثابتة، لكلٍّ منها مساره." },
        { year: 1783, en: "William Herschel shows that the Sun itself is moving through space, carrying the planets with it.",
          ar: "وليام هيرشل يبيّن أن الشمس نفسها تتحرك في الفضاء حاملةً الكواكب معها." },
        { year: 1927, en: "Jan Oort shows the Sun orbits the centre of our galaxy, the Milky Way: one orbit takes about 230 million years.",
          ar: "يان أورت يبيّن أن الشمس تدور حول مركز مجرتنا درب التبانة، وتستغرق الدورة نحو 230 مليون سنة." }
      ]
    },
    ocean: {
      verses: ["nur40", "rahman19", "rahman20"],
      events: [
        { year: 1872, en: "HMS Challenger begins the first worldwide survey of the deep ocean, measuring temperature and saltiness at depth (1872–1876).",
          ar: "السفينة إتش إم إس تشالنجر تبدأ أول مسح عالمي لأعماق المحيط، وتقيس الحرارة والملوحة في الأعماق (1872–1876)." },
        { year: 1904, en: "Vagn Walfrid Ekman explains internal waves: hidden waves deep below the surface waves, where water layers meet.",
          ar: "فاغن فالفريد إكمان يفسّر الأمواج الداخلية: أمواج خفية تحت أمواج السطح حيث تلتقي طبقات الماء." },
        { year: 1934, en: "William Beebe and Otis Barton dive 923 m in the bathysphere and describe the total darkness of the deep sea.",
          ar: "وليام بيب وأوتيس بارتون يغوصان 923 مترًا في كرة الأعماق ويصفان الظلام التام في أعماق البحر." }
      ]
    }
  };

  function refLine(k) {
    const r = window.REFERENCES && REFERENCES[k];
    if (!r) return "";
    const ra = window.REFERENCES_AR && REFERENCES_AR[k];
    return `<div class="tl-verse"><div class="arabic">${r.arabic || ""}</div>
      ${isAr() ? "" : `<div class="tl-tr">“${r.translation}”</div>`}
      <div class="label-sm">${isAr() && ra && ra.ref ? ra.ref : r.ref}</div></div>`;
  }

  function topicTitle(id) {
    if (isAr() && window.TOPICS_AR && TOPICS_AR[id] && TOPICS_AR[id].title) return TOPICS_AR[id].title;
    const t = (window.TOPICS || []).find((x) => x.id === id);
    return t ? t.title : id;
  }
  function icon(id) { const t = (window.TOPICS || []).find((x) => x.id === id); return t ? t.icon : ""; }

  function render(body, id) {
    const d = DATA[id];
    body.querySelectorAll("[data-tl]").forEach((b) => b.classList.toggle("on", b.dataset.tl === id));
    const yr = (y) => (y < 0 ? L(`about ${-y} BCE`, `نحو ${-y} ق.م`) : y);
    body.querySelector(".tl-body").innerHTML = `
      <div class="tl-line">
        ${d.events.filter((e) => e.before).map((e) => `
          <div class="tl-item before"><div class="tl-year">${yr(e.year)}</div><div class="tl-text">${L(e.en, e.ar)}</div></div>`).join("")}
        <div class="tl-item then"><div class="tl-year">610–632 ${L("CE", "م")}</div>
          <div class="tl-text"><b>${L("The Qur'an is revealed", "نزول القرآن الكريم")}</b>${d.verses.map(refLine).join("")}</div></div>
        ${d.events.filter((e) => !e.before).map((e) => `
          <div class="tl-item now"><div class="tl-year">${e.year}<small>${L(`${(e.year - REVEALED).toLocaleString()} years later`, `بعد ${(e.year - REVEALED).toLocaleString("ar-AE")} سنة`)}</small></div>
            <div class="tl-text">${L(e.en, e.ar)}</div></div>`).join("")}
      </div>
      <p class="tl-note">${L(
        "How to read this: the Qur'an is a book of guidance, not a science textbook. Muslims reflect on how its descriptions fit what science later measured, and scholars discuss how far such links should be taken. Think about it, check the sources, and decide for yourself.",
        "كيف تقرأ هذا: القرآن كتاب هداية وليس كتاب علوم. يتأمل المسلمون في انسجام أوصافه مع ما قاسه العلم لاحقًا، ويناقش العلماء إلى أي حدّ تُحمل هذه الروابط. فكّر، وراجع المصادر، وكوّن رأيك بنفسك.")}</p>`;
  }

  function open(id) {
    id = DATA[id] ? id : "sky";
    let m = document.getElementById("timeline-modal");
    if (!m) {
      m = document.createElement("section");
      m.id = "timeline-modal"; m.className = "modal no-tr"; m.setAttribute("role", "dialog");
      m.innerHTML = `<div class="modal-body tl">
        <button class="x-close" aria-label="Close">✕</button>
        <h2>🕰 ${L("Then & now", "بين الأمس واليوم")}</h2>
        <p class="j-intro">${L("Each verse beside the year science measured the same thing.", "كل آية بجانب السنة التي قاس فيها العلم الشيء نفسه.")}</p>
        <div class="seg tl-tabs">${Object.keys(DATA).map((k) => `<button data-tl="${k}">${icon(k)} ${topicTitle(k)}</button>`).join("")}</div>
        <div class="tl-body"></div></div>`;
      document.body.appendChild(m);
      m.addEventListener("click", (e) => { if (e.target === m || e.target.classList.contains("x-close")) m.classList.remove("open"); });
      m.querySelectorAll("[data-tl]").forEach((b) => b.onclick = () => render(m, b.dataset.tl));
    }
    render(m, id);
    m.classList.add("open");
  }

  window.TIMELINE = { open, DATA, has: (id) => !!DATA[id] };
})();
