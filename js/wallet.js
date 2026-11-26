/* =====================================================================
   wallet.js  —  ONE wallet shared by the three finance exhibits
   ---------------------------------------------------------------------
   The visitor's money travels through the Financial Contracts topics:
     1. ATM     → withdraw savings, pay zakat, refuse an interest loan
     2. Market  → invest halal (Mudarabah / Musharakah), get the share back
     3. Waqf    → give part of it away as a waqf that keeps giving
   The balance and history are saved in the browser (localStorage), so
   they survive moving between exhibits and reloading the page.
   The "My money journey" screen shows the whole story with a verse
   for each step. A Reset button clears it for the next visitor.
   ===================================================================== */

(function () {
  "use strict";
  const KEY = "signs-systems-wallet-v1";
  const START_SAVINGS = 50000;          // savings held for a lunar year (above the nisab)

  // ---------- state ----------
  function blank() {
    return { balance: 0, history: [], earned: false, zakatPaid: false, refusedLoan: false,
             invested: 0, investOpen: false, returned: null, waqf: 0, waqfAsset: "" };
  }
  let S = blank();
  try { const saved = JSON.parse(localStorage.getItem(KEY)); if (saved) S = Object.assign(blank(), saved); } catch (e) { /* storage blocked: keep in memory */ }

  const listeners = [];
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ }
    updateChip();
    for (let i = listeners.length - 1; i >= 0; i--) {
      let keep = true;
      try { keep = listeners[i](S) !== false; } catch (e) { console.error(e); }
      if (!keep) listeners.splice(i, 1);
    }
    if (document.getElementById("journey").classList.contains("open")) renderJourney();
    chip.classList.remove("bump"); void chip.offsetWidth; chip.classList.add("bump");
  }
  function log(kind, amount, note) {
    S.history.push({ kind, amount, note, t: Date.now() });
  }
  function money(n) {
    const cur = (window.APP_CONFIG && window.APP_CONFIG.currency) || "AED ";
    const a = Math.round(Math.abs(n));
    return (n < 0 ? "−" : "") + cur + a.toLocaleString("en-US");
  }

  // ---------- the public API used by the scene files ----------
  const W = {
    START_SAVINGS,
    get state() { return S; },
    get balance() { return S.balance; },
    money,
    onChange(fn) { listeners.push(fn); },

    /** ATM: withdraw the year's savings into the wallet (once) */
    earn() {
      if (S.earned) return false;
      S.earned = true; S.balance += START_SAVINGS;
      log("earn", START_SAVINGS, "Savings withdrawn at the Halal ATM (held for one lunar year)");
      save(); return true;
    },
    /** ATM: pay 2.5% zakat if the balance is at or above the nisab */
    payZakat(nisab) {
      if (!S.earned || S.zakatPaid) return 0;
      if (S.balance < nisab) return -1;
      const z = Math.round(S.balance * 0.025 * 100) / 100;
      S.balance -= z; S.zakatPaid = true;
      log("zakat", -z, "Zakat paid (2.5%) to the eight groups of 9:60");
      save(); return z;
    },
    /** ATM: an interest loan is refused (nothing is added) */
    refuseLoan() {
      if (!S.refusedLoan) { S.refusedLoan = true; log("riba", 0, "Interest loan refused: riba is forbidden (2:275)"); save(); }
    },
    /** Market: move money from the wallet into a halal business */
    invest(amount, shopName, contract) {
      if (S.investOpen || amount <= 0 || amount > S.balance) return false;
      S.balance -= amount; S.invested = amount; S.investOpen = true;
      log("invest", -amount, `Invested in the ${shopName} (${contract})`);
      save(); return true;
    },
    /** Market: close the deal, the investor's capital plus share of profit (or minus loss) comes back */
    closeInvestment(result, years) {
      if (!S.investOpen) return false;
      const back = Math.max(0, S.invested + result);
      S.balance += back; S.investOpen = false; S.returned = { back, result, years };
      log("return", back, `Investment closed after ${years} year(s): ${result >= 0 ? "profit" : "loss"} ${money(result)}`);
      save(); return back;
    },
    /** Waqf: give part of the wallet away as a permanent endowment */
    endow(amount, assetName) {
      if (amount <= 0 || amount > S.balance) return false;
      S.balance -= amount; S.waqf += amount; S.waqfAsset = assetName;
      log("waqf", -amount, `Endowed as a waqf: ${assetName}`);
      save(); return true;
    },
    reset() { S = blank(); save(); },

    /** Show or hide the floating wallet button */
    showChip(on) { document.getElementById("wallet-chip").classList.toggle("show", !!on); },
    open() { renderJourney(); document.getElementById("journey").classList.add("open"); },
    close() { document.getElementById("journey").classList.remove("open"); }
  };
  window.WALLET = W;

  // ---------- floating wallet button ----------
  const chip = document.getElementById("wallet-chip");
  function updateChip() {
    const done = [S.earned, S.returned !== null, S.waqf > 0].filter(Boolean).length;
    chip.innerHTML = `<span class="wc-icon">💳</span><span class="wc-bal">${money(S.balance)}</span><span class="wc-steps">${done}/3 · My money journey</span>`;
  }
  chip.addEventListener("click", W.open);
  updateChip();

  // ---------- the "My money journey" screen ----------
  function ref(id) { return (window.REFERENCES || {})[id] || {}; }

  function stepCard(n, icon, title, topicId, done, statusHtml, refId) {
    const r = ref(refId);
    return `
      <div class="j-step ${done ? "done" : ""}">
        <div class="j-num">${done ? "✓" : n}</div>
        <div class="j-body">
          <div class="j-title">${icon} ${title}</div>
          <div class="j-status">${statusHtml}</div>
          ${r.lesson ? `<div class="j-verse">“${r.lesson}” <cite>${r.ref}</cite></div>` : ""}
        </div>
        <button class="btn ${done ? "ghost" : "accent"} small j-go" data-go="${topicId}">${done ? "Revisit" : "Go ▶"}</button>
      </div>`;
  }

  function renderJourney() {
    const el = document.getElementById("journey-body");
    const ret = S.returned;
    const s1 = !S.earned ? "Withdraw your savings at the ATM, then purify them with zakat."
      : `Withdrew ${money(START_SAVINGS)}. ${S.zakatPaid ? "Zakat paid ✓." : "<b>Zakat not paid yet.</b>"} ${S.refusedLoan ? "Interest loan refused ✓." : ""}`;
    const s2 = S.investOpen ? `${money(S.invested)} is working in the market. Simulate some years, then close the deal.`
      : ret ? `Invested ${money(S.invested)} for ${ret.years} year(s) and got back ${money(ret.back)} (${ret.result >= 0 ? "profit" : "loss"} ${money(ret.result)}). Profit and risk were shared.`
      : "Screen a shop, choose Mudarabah or Musharakah, and invest from your wallet.";
    const s3 = S.waqf > 0 ? `Gave ${money(S.waqf)} as a waqf (${S.waqfAsset}). The asset stays; its benefit keeps flowing.`
      : "Choose an asset in the Waqf village and endow part of your money.";
    const complete = S.earned && ret && S.waqf > 0;

    el.innerHTML = `
      <div class="kicker">Financial Contracts</div>
      <h2>💳 My money journey</h2>
      <p class="j-intro">One pot of money, three Islamic ways to handle it: <b>purify</b> it, <b>grow</b> it fairly, and <b>give</b> it for generations.</p>
      <div class="j-balance"><div class="label-sm">In your wallet</div><div class="big-number">${money(S.balance)}</div></div>
      ${complete ? `<div class="result-box good j-complete">🌟 <b>Journey complete!</b> From ${money(START_SAVINGS)} of savings you paid zakat, grew your money without riba, and left a waqf that keeps giving after you.</div>` : ""}
      ${stepCard(1, "🏧", "Earn &amp; purify", "atm", S.earned && S.zakatPaid, s1, "tawbah60")}
      ${stepCard(2, "🏪", "Grow it fairly", "market", !!ret, s2, "nisa29")}
      ${stepCard(3, "🕌", "Give for generations", "waqf", S.waqf > 0, s3, "muslim1631")}
      ${S.history.length ? `<div class="label-sm" style="margin-top:18px">History</div>
        <ul class="j-history">${S.history.slice().reverse().map((h) =>
          `<li><span>${h.note}</span><b class="${h.amount < 0 ? "neg" : h.amount > 0 ? "pos" : ""}">${h.amount ? (h.amount > 0 ? "+" : "") + money(h.amount) : "—"}</b></li>`).join("")}</ul>` : ""}
      <div class="j-actions">
        <button class="btn ghost small" id="j-reset">↺ Reset for the next visitor</button>
        <button class="btn small" id="j-close">Close</button>
      </div>`;
    el.querySelectorAll(".j-go").forEach((b) => b.onclick = () => { W.close(); window.APP_ENTER && window.APP_ENTER(b.dataset.go); });
    el.querySelector("#j-reset").onclick = () => { if (confirmReset()) W.reset(); };
    el.querySelector("#j-close").onclick = W.close;
  }

  // a two-tap reset (no browser dialog, which can block kiosk mode)
  let armed = 0;
  function confirmReset() {
    const b = document.getElementById("j-reset");
    if (Date.now() - armed < 3000) { armed = 0; return true; }
    armed = Date.now(); b.textContent = "Tap again to reset"; return false;
  }

  document.getElementById("journey").addEventListener("click", (e) => { if (e.target.id === "journey") W.close(); });
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") W.close(); });
})();

/* Homepage: the page ends exactly where the bottom button bar starts. */
(function () {
  const hud = document.getElementById("hud");
  if (!hud || !window.ResizeObserver) return;
  const set = () => {
    if (document.body.dataset.screen !== "screen-topics") return;
    const h = Math.ceil(hud.getBoundingClientRect().height);
    if (h) document.documentElement.style.setProperty("--dive-bar-h", h + "px");
  };
  new ResizeObserver(set).observe(hud);
  new MutationObserver(set).observe(document.body, { attributes: true, attributeFilter: ["data-screen"] });
})();
