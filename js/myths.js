/* =====================================================================
   myths.js  —  "Myth or Fact?" swipe cards (🃏 button in the top bar)
   Swipe left = MYTH, swipe right = FACT, or use the two buttons.
   The card then shows the answer, a short explanation and its source.
   ===================================================================== */
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const ar = () => window.I18N && I18N.lang === "ar";
  const T = (en, a) => (ar() ? a : en);
  let deck = [], i = 0, score = 0, answered = false;

  function shuffle(a) { const b = a.slice(); for (let k = b.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [b[k], b[j]] = [b[j], b[k]]; } return b; }
  const txt = (c) => (ar() && c.ar ? c.ar : c);

  function start(topicId) {
    deck = shuffle((window.MYTHS || {})[topicId] || []);
    i = 0; score = 0; render();
  }

  function render() {
    const body = $("myth-body");
    if (!body) return;
    if (!deck.length) { body.innerHTML = `<div class="quiz-card"><p>${T("No cards for this topic yet.", "لا توجد بطاقات لهذا الموضوع بعد.")}</p></div>`; return; }
    if (i >= deck.length) {
      body.innerHTML = `<div class="quiz-card myth-end" ${ar() ? 'dir="rtl"' : ""}>
        <div class="quiz-progress">${T("ALL CARDS DONE", "انتهت البطاقات")}</div>
        <div class="score-big">${score} / ${deck.length}</div>
        <p>${score === deck.length ? T("You can spot a myth! 🌟", "أحسنت! تعرف الحقيقة من الخرافة 🌟") : T("Good effort. Try again to beat your score!", "محاولة جيدة! أعد المحاولة لتحسين نتيجتك")}</p>
        <div class="quiz-actions" style="justify-content:center"><button class="btn accent" id="my-again">↺ ${T("Shuffle and play again", "اخلط والعب من جديد")}</button></div></div>`;
      $("my-again").onclick = () => { deck = shuffle(deck); i = 0; score = 0; render(); };
      return;
    }
    answered = false;
    const c = deck[i], t = txt(c);
    body.innerHTML = `
      <div class="myth-wrap" ${ar() ? 'dir="rtl"' : ""}>
        <div class="quiz-progress">🃏 ${T("MYTH OR FACT?", "خرافة أم حقيقة؟")} · ${i + 1} / ${deck.length} · ${T("SCORE", "النتيجة")} ${score}</div>
        <div class="myth-stage">
          <div class="myth-hint left">❌ ${T("MYTH", "خرافة")}</div>
          <div class="myth-card" id="my-card"><div class="myth-s">“${t.s}”</div><div class="myth-swipe">${T("Swipe ← myth · fact →", "اسحب ← خرافة · حقيقة →")}</div></div>
          <div class="myth-hint right">✅ ${T("FACT", "حقيقة")}</div>
        </div>
        <div class="myth-btns">
          <button class="btn myth-no" id="my-myth">❌ ${T("Myth", "خرافة")}</button>
          <button class="btn myth-yes" id="my-fact">✅ ${T("Fact", "حقيقة")}</button>
        </div>
        <div id="my-result"></div>
      </div>`;
    $("my-myth").onclick = () => answer(false);
    $("my-fact").onclick = () => answer(true);
    dragify($("my-card"));
  }

  function answer(saidFact) {
    if (answered) return; answered = true;
    const c = deck[i], t = txt(c), right = saidFact === c.fact;
    if (right) score++;
    const card = $("my-card");
    card.classList.add(c.fact ? "is-fact" : "is-myth", "flip");
    card.style.transform = "";
    $("my-myth").disabled = $("my-fact").disabled = true;
    $("my-result").innerHTML = `
      <div class="result-box ${right ? "good" : "bad"} myth-why">
        <b>${right ? T("✅ Correct!", "✅ صحيح!") : T("❌ Not quite.", "❌ ليس تماما.")} ${T("It's a", "إنها")} ${c.fact ? T("FACT", "حقيقة") : T("MYTH", "خرافة")}.</b><br>${t.why}
        <div class="myth-ref">📖 ${c.ref}</div>
      </div>
      <div class="quiz-actions"><button class="btn accent" id="my-next">${i === deck.length - 1 ? T("See score", "النتيجة") : T("Next card ▶", "البطاقة التالية ◀")}</button></div>`;
    $("my-next").onclick = () => { i++; render(); };
  }

  // swipe / drag the card left (myth) or right (fact)
  function dragify(card) {
    let x0 = null, dx = 0;
    card.addEventListener("pointerdown", (e) => { if (answered) return; x0 = e.clientX; dx = 0; card.setPointerCapture(e.pointerId); card.classList.add("dragging"); });
    card.addEventListener("pointermove", (e) => {
      if (x0 === null) return;
      dx = e.clientX - x0;
      card.style.transform = `translateX(${dx}px) rotate(${dx / 18}deg)`;
      card.classList.toggle("lean-fact", dx > 40); card.classList.toggle("lean-myth", dx < -40);
    });
    const end = () => {
      if (x0 === null) return;
      x0 = null; card.classList.remove("dragging", "lean-fact", "lean-myth");
      if (Math.abs(dx) > 90) answer(dx > 0); else card.style.transform = "";
    };
    card.addEventListener("pointerup", end); card.addEventListener("pointercancel", end);
  }

  window.MYTH_CARDS = { start };
})();
