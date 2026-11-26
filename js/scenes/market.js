/* =====================================================================
   scenes/market.js  —  TOPIC 5: Islamic Business Investment Simulator
   ---------------------------------------------------------------------
   3D objects: a circular marketplace with 8 shops, a scanning beam for
   halal screening, and 4 coin towers in the centre that grow or shrink
   with each simulated year:
     Islamic contract →  Investor  |  Entrepreneur
     Interest loan    →  Lender    |  Borrower
   ===================================================================== */

TOPIC_SCENES.market = function (ctx) {
  const { THREE, scene, camera, controls } = ctx;
  const money = ctx.money;

  scene.background = new THREE.Color(0xf2d9a8);
  scene.fog = new THREE.Fog(0xf2d9a8, 30, 70);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xb08850, 0.95));
  const sun = new THREE.DirectionalLight(0xfff0d0, 0.8); sun.position.set(-8, 18, 10); scene.add(sun);

  // ground with a star-patterned plaza
  const ground = new THREE.Mesh(new THREE.CircleGeometry(30, 64), H3.mat(0xd9b77e, { roughness: 1 }));
  ground.rotation.x = -Math.PI / 2; scene.add(ground);
  const plaza = new THREE.Mesh(new THREE.CircleGeometry(7, 8), H3.mat(0xc79a5b, { roughness: 1 }));
  plaza.rotation.x = -Math.PI / 2; plaza.position.y = 0.01; scene.add(plaza);
  const plaza2 = new THREE.Mesh(new THREE.CircleGeometry(7, 8), H3.mat(0xb98a4e, { roughness: 1 }));
  plaza2.rotation.x = -Math.PI / 2; plaza2.rotation.z = Math.PI / 8; plaza2.position.y = 0.005; scene.add(plaza2);
  const fountain = H3.cyl(1.0, 1.2, 0.5, 0xe8e2d0, 0, 0.25, 0, 8); scene.add(fountain);
  scene.add(H3.cyl(0.85, 0.85, 0.52, 0x3fa9d6, 0, 0.27, 0, 8));

  // ---------------- Shops ----------------
  const SHOPS = [
    { id: "bakery", name: "Bakery", icon: "🥖", color: 0xf0b86e, halal: true, why: "Making and selling bread is honest, useful trade.", growth: 1 },
    { id: "books", name: "Bookshop", icon: "📚", color: 0x7aa7e0, halal: true, why: "Selling books spreads knowledge: permitted trade.", growth: 0.9 },
    { id: "bikes", name: "Bike Repair", icon: "🚲", color: 0x6cc28f, halal: true, why: "A real service people need, paid fairly.", growth: 1.1 },
    { id: "tech", name: "Phone Repair", icon: "📱", color: 0xb28cff, halal: true, why: "Repairing devices is a skilled, permitted service.", growth: 1.2 },
    { id: "casino", name: "Casino", icon: "🎰", color: 0xd04848, halal: false, why: "Gambling is forbidden: 'intoxicants, gambling… so avoid it' (5:90).", ref: "maidah90" },
    { id: "liquor", name: "Liquor Store", icon: "🍺", color: 0x8a5a3a, halal: false, why: "Selling alcohol (intoxicants) is forbidden (5:90).", ref: "maidah90" },
    { id: "pork", name: "Pork Butcher", icon: "🥩", color: 0xc77f8f, halal: false, why: "The flesh of swine is forbidden (2:173).", ref: "baqarah173" },
    { id: "lender", name: "Payday Lender", icon: "💸", color: 0x5a6070, halal: false, why: "Its whole business is lending at interest, which is riba (2:275).", ref: "baqarah275" }
  ];
  function awningTexture(color) {
    const c = document.createElement("canvas"); c.width = 128; c.height = 32;
    const g = c.getContext("2d");
    for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? "#ffffff" : "#" + color.toString(16).padStart(6, "0"); g.fillRect(i * 16, 0, 16, 32); }
    return new THREE.CanvasTexture(c);
  }
  SHOPS.forEach((s, i) => {
    const a = (i / SHOPS.length) * Math.PI * 2 + Math.PI / 8;
    const g = new THREE.Group();
    g.position.set(Math.sin(a) * 12, 0, Math.cos(a) * 12);
    g.rotation.y = a + Math.PI;                 // face the plaza
    g.add(H3.box(3.4, 2.6, 2.6, 0xf3e6cc, 0, 1.3, 0));
    g.add(H3.box(3.6, 0.3, 2.8, s.color, 0, 2.75, 0));
    g.add(H3.box(1.0, 1.6, 0.05, 0x5a3b22, 0, 0.8, 1.31));
    g.add(H3.box(0.9, 0.8, 0.05, 0x9fd8ff, -1.05, 1.2, 1.31)); g.add(H3.box(0.9, 0.8, 0.05, 0x9fd8ff, 1.05, 1.2, 1.31));
    const awn = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 0.9), new THREE.MeshStandardMaterial({ map: awningTexture(s.color), side: THREE.DoubleSide }));
    awn.position.set(0, 2.2, 1.6); awn.rotation.x = -0.6; g.add(awn);
    const sign = H3.sign(s.icon + " " + s.name, 3.2, 0.7, { w: 512, h: 112, font: "bold 56px Segoe UI, Segoe UI Emoji", bg: "#0f2236", fg: "#f6f2e7" });
    sign.position.set(0, 3.35, 1.0); g.add(sign);
    // result badge (✓ or ✗) shown after screening
    const badge = H3.sign(s.halal ? "✓" : "✗", 1.2, 1.2, { w: 128, h: 128, font: "bold 110px Segoe UI", bg: s.halal ? "#2f9b70" : "#c0392b", fg: "#fff", border: "#fff" });
    badge.position.set(0, 4.7, 1.0); badge.visible = false; g.add(badge);
    scene.add(g);
    s.group = g; s.badge = badge;
    ctx.clickable(g, () => screen(s.id));
    ctx.hotspot(new THREE.Vector3(Math.sin(a) * 10.4, 4.3, Math.cos(a) * 10.4), s.icon + " " + s.name, () => screen(s.id));
  });

  // scanning beam (a glowing ring that sweeps down over the shop)
  const scanRing = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.08, 8, 48), new THREE.MeshBasicMaterial({ color: 0x3ddc97 }));
  scanRing.rotation.x = Math.PI / 2; scanRing.visible = false; scene.add(scanRing);

  // ---------------- Coin towers ----------------
  const towerDefs = [
    { key: "inv", name: "Investor", color: 0x2fbf9b, x: -3.6 },
    { key: "ent", name: "Entrepreneur", color: 0x4fa8ff, x: -1.4 },
    { key: "lend", name: "Interest lender", color: 0xff6b6b, x: 1.4 },
    { key: "borr", name: "Borrower", color: 0xffa94d, x: 3.6 }
  ];
  const towers = {};
  towerDefs.forEach((t) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 1, 24), H3.mat(t.color, { metalness: 0.6, roughness: 0.3 }));
    m.position.set(t.x, 0.5, 4.2); m.scale.y = 0.05; scene.add(m);
    const label = ctx.hotspot(new THREE.Vector3(t.x, 0, 4.2), t.name, () => ctx.info(t.key === "lend" || t.key === "borr" ? "loan" : contract), { offset: new THREE.Vector3(0, 0.6, 0) });
    towers[t.key] = { mesh: m, label, target: 0.05, value: 0, name: t.name };
  });

  // ---------------- Camera ----------------
  camera.position.set(0, 13, 22);
  controls.target.set(0, 1, 0);
  controls.maxPolarAngle = Math.PI / 2 - 0.08;
  controls.minDistance = 6; controls.maxDistance = 45;

  // ---------------- Simulation state ----------------
  let shop = null;                 // selected (halal) shop
  let contract = "mudarabah";
  let capInv = 10000;              // investor's money
  let capEnt = 0;                  // entrepreneur's money (Musharakah only)
  let ratio = 60;                  // investor's % share of profit
  const LOAN_RATE = 0.10;          // interest loan for comparison: 10% per year
  let years = [];                  // results of each simulated year

  // =====================================================================
  // RIGHT PANEL
  // =====================================================================
  ctx.tools.innerHTML = `
    <h3>🏪 Investment Simulator</h3>
    <div class="how">${ctx.topic.howTo}</div>
    <div id="m-wallet"></div>
    <div class="tool-section" id="m-step1">
      <div class="label-sm">Step 1 · Halal screening</div>
      <div id="m-screen" class="result-box">Click any shop in the market to screen it.</div>
    </div>
    <div id="m-sim" style="opacity:0.4;pointer-events:none">
      <div class="tool-section">
        <div class="label-sm">Step 2 · Choose a contract</div>
        <div class="seg"><button data-c="mudarabah" class="on">Mudarabah</button><button data-c="musharakah">Musharakah</button></div>
        <div id="m-cdesc" class="how"></div>
        <div class="field">Investor's money <input type="number" id="m-inv" value="10000" min="500" step="500"></div>
        <div class="field" id="m-entrow" style="display:none">Entrepreneur's money <input type="number" id="m-ent" value="5000" min="0" step="500"></div>
        <div class="label-sm">Profit share: investor <b id="m-rv">60</b>% · entrepreneur <b id="m-rv2">40</b>%</div>
        <input type="range" id="m-ratio" min="10" max="90" step="5" value="60">
      </div>
      <div class="tool-section">
        <div class="label-sm">Step 3 · Simulate a year</div>
        <div class="tool-row">
          <button class="btn small" style="background:#3ddc97;border-color:#3ddc97" data-y="0.3">😀 Good year +30%</button>
          <button class="btn small" data-y="0.08">🙂 Normal +8%</button>
          <button class="btn small" style="background:#ff6b6b;border-color:#ff6b6b" data-y="-0.2">😟 Bad year −20%</button>
        </div>
        <div class="tool-row"><button class="btn ghost small" id="m-rand">🎲 Random 5 years</button><button class="btn ghost small" id="m-reset">↺ Reset</button></div>
      </div>
      <div class="tool-section">
        <div class="label-sm">Side-by-side after <b id="m-ny">0</b> year(s): total gain or loss</div>
        <div class="bars" id="m-bars"></div>
        <div class="bar-labels"><div>Investor</div><div>Entrepreneur</div><div>Interest lender</div><div>Borrower</div></div>
        <div id="m-log"></div>
        <div class="tool-row"><button class="btn ghost small" id="m-consent">🤝 Mutual consent (4:29)</button><button class="btn ghost small" id="m-loaninfo">⚖️ Why not interest?</button></div>
      </div>
    </div>`;
  const $t = (id) => ctx.tools.querySelector(id);
  ctx.tools.querySelectorAll("[data-c]").forEach((b) => b.onclick = () => setContract(b.dataset.c));
  ctx.tools.querySelectorAll("[data-y]").forEach((b) => b.onclick = () => simulate(+b.dataset.y));
  $t("#m-inv").oninput = (e) => { capInv = Math.max(0, +e.target.value || 0); resetSim(); };
  $t("#m-ent").oninput = (e) => { capEnt = Math.max(0, +e.target.value || 0); resetSim(); };
  $t("#m-ratio").oninput = (e) => { ratio = +e.target.value; $t("#m-rv").textContent = ratio; $t("#m-rv2").textContent = 100 - ratio; resetSim(); };
  $t("#m-rand").onclick = () => { for (let i = 0; i < 5; i++) simulate([0.3, 0.15, 0.08, -0.05, -0.2][Math.floor(Math.random() * 5)]); };
  $t("#m-reset").onclick = resetSim;
  $t("#m-consent").onclick = () => ctx.info("consent");
  $t("#m-loaninfo").onclick = () => ctx.info("loan");

  // ---------- SHARED WALLET (step 2 of "My money journey") ----------
  const W = window.WALLET;
  const wBox = $t("#m-wallet");
  function walletYears() { return years.reduce((a, y) => a + y.inv, 0); }
  function renderWallet() {
    if (!wBox.isConnected) return false;
    const st = W.state;
    let html = `<div class="wallet-box"><div class="wb-head"><span class="label-sm">💳 Your wallet · step 2</span><span class="wb-bal">${money(st.balance)}</span></div>`;
    if (!st.earned) {
      html += `<div class="wb-note">Your wallet is empty. Start at the Halal ATM to withdraw your savings.</div>
               <button class="btn ghost small" id="w-atm">🏧 Go to the ATM ▶</button>`;
    } else if (st.investOpen) {
      const share = walletYears();
      html += `<div class="wb-note">${money(st.invested)} invested in the ${shop ? shop.name : "business"}. Simulate some years below, then close the deal.</div>
               <button class="btn accent" id="w-close" ${years.length ? "" : "disabled"}>💰 Close the deal: ${years.length ? "get back " + money(Math.max(0, st.invested + share)) : "simulate a year first"}</button>`;
    } else if (st.returned) {
      html += `<div class="wb-note">✅ Investment closed: ${st.returned.result >= 0 ? "profit" : "loss"} of ${money(st.returned.result)} after ${st.returned.years} year(s). The risk was shared, not pushed onto one side.</div>
               <button class="btn accent" id="w-next">🕌 Next: give for generations in the Waqf village ▶</button>`;
    } else if (!shop) {
      html += `<div class="wb-note">Click a shop in the market to screen it. Only a halal business can receive your money.</div>`;
    } else {
      const amt = Math.min(capInv, st.balance);
      html += `<button class="btn accent" id="w-invest" ${amt > 0 ? "" : "disabled"}>💳 Invest ${money(amt)} from my wallet</button>
               <div class="wb-note">Into the ${shop.name} as <b>${contract === "mudarabah" ? "Mudarabah" : "Musharakah"}</b>. Change the amount or contract below first if you like.</div>`;
    }
    wBox.innerHTML = html + `</div>`;
    const on = (id, fn) => { const b = wBox.querySelector(id); if (b) b.onclick = fn; };
    on("#w-atm", () => window.APP_ENTER("atm"));
    on("#w-next", () => window.APP_ENTER("waqf"));
    on("#w-invest", () => {
      const amt = Math.min(capInv, st.balance);
      if (W.invest(amt, shop.name, contract === "mudarabah" ? "Mudarabah" : "Musharakah")) {
        capInv = amt; $t("#m-inv").value = amt; $t("#m-inv").disabled = true;
        resetSim();
        ctx.toast("💳 " + money(amt) + " invested. Now simulate some years.");
      }
    });
    on("#w-close", () => {
      const back = W.closeInvestment(walletYears(), years.length);
      $t("#m-inv").disabled = false;
      ctx.toast("💰 " + money(back) + " returned to your wallet.");
    });
  }
  W.onChange(renderWallet);
  // keep the wallet box in step with screening, contract and simulated years
  const _render = render;
  render = function () { _render(); renderWallet(); };
  if (W.state.investOpen) { capInv = W.state.invested; $t("#m-inv").value = capInv; $t("#m-inv").disabled = true; }
  renderWallet();

  /** Step 1: halal screening of a shop */
  function screen(id) {
    const s = SHOPS.find((x) => x.id === id);
    // scanning animation
    const p = s.group.position;
    scanRing.visible = true;
    scanRing.material.color.set(0xe8c36a);
    ctx.tween(1.0, (k) => { scanRing.position.set(p.x, 4.5 - k * 4.2, p.z); }, () => {
      scanRing.visible = false;
      s.badge.visible = true;
      ctx.tween(0.4, (k) => s.badge.scale.setScalar(0.2 + k * 0.8));
    });
    $t("#m-screen").className = "result-box " + (s.halal ? "good" : "bad");
    if (s.halal) {
      shop = s;
      $t("#m-screen").innerHTML = `<b>${s.icon} ${s.name}: ✅ PASSED</b><br>${s.why}<br><small>No alcohol, gambling, pork or interest-based income.</small>`;
      $t("#m-sim").style.opacity = 1; $t("#m-sim").style.pointerEvents = "auto";
      resetSim();
      ctx.toast(`✅ ${s.name} passed halal screening. Now choose a contract.`);
    } else {
      $t("#m-screen").innerHTML = `<b>${s.icon} ${s.name}: ❌ REJECTED</b><br>${s.why}<br><button class="btn ghost small" id="m-why" style="margin-top:6px">📖 Show the verse</button>`;
      $t("#m-why").onclick = () => ctx.info("screening");
      ctx.toast(`❌ ${s.name} fails halal screening. We cannot invest here.`);
    }
  }

  function setContract(c) {
    contract = c;
    ctx.tools.querySelectorAll("[data-c]").forEach((b) => b.classList.toggle("on", b.dataset.c === c));
    $t("#m-entrow").style.display = c === "musharakah" ? "" : "none";
    capEnt = c === "musharakah" ? Math.max(0, +$t("#m-ent").value || 0) : 0;
    $t("#m-cdesc").innerHTML = c === "mudarabah"
      ? "<b>Mudarabah:</b> the investor gives money, the entrepreneur gives skill. Profit is split by the agreed ratio. A money loss falls on the investor; the entrepreneur loses their effort."
      : "<b>Musharakah:</b> both partners invest money. Profit is split by the agreed ratio. Losses are shared <b>in proportion to each partner's money</b>.";
    resetSim();
  }

  function resetSim() { years = []; render(); }

  /** Simulate one year with business return r (e.g. 0.3 = +30%) */
  function simulate(r) {
    if (!shop) return;
    const capital = capInv + capEnt;
    const result = capital * r * (shop.growth || 1);          // profit (+) or loss (−) of the business
    let inv = 0, ent = 0;
    if (result >= 0) { inv = result * ratio / 100; ent = result * (100 - ratio) / 100; }
    else if (contract === "mudarabah") { inv = result; ent = 0; }                     // investor carries the money loss
    else { inv = result * capInv / capital; ent = result * capEnt / capital; }       // shared by capital
    // the same business financed by an interest loan of the same amount
    const interest = capInv * LOAN_RATE;
    const lend = interest;                    // lender is paid no matter what
    const borr = result - interest;           // borrower keeps what's left, or goes into debt
    years.push({ r, result, inv, ent, lend, borr });
    render();
  }

  function render() {
    const sum = (k) => years.reduce((a, y) => a + y[k], 0);
    const totals = { inv: sum("inv"), ent: sum("ent"), lend: sum("lend"), borr: sum("borr") };
    $t("#m-ny").textContent = years.length;
    const max = Math.max(1, ...Object.values(totals).map(Math.abs));
    const colors = { inv: "#2fbf9b", ent: "#4fa8ff", lend: "#ff6b6b", borr: "#ffa94d" };
    $t("#m-bars").innerHTML = Object.keys(totals).map((k) => {
      const v = totals[k];
      return `<div class="bar"><div class="val" style="color:${v < 0 ? "#ff6b6b" : "inherit"}">${money(v)}</div><div class="fill" style="height:${Math.abs(v) / max * 100}%;background:${v < 0 ? "repeating-linear-gradient(45deg,#ff6b6b,#ff6b6b 6px,#7a1f1f 6px,#7a1f1f 12px)" : colors[k]}"></div></div>`;
    }).join("");
    const last = years[years.length - 1];
    $t("#m-log").innerHTML = last ? `
      <div class="result-box ${last.result >= 0 ? "good" : "bad"}"><b>Year ${years.length}: business ${last.result >= 0 ? "profit" : "loss"} ${money(last.result)}</b><br>
      ${contract === "mudarabah" ? "Mudarabah" : "Musharakah"}: investor ${money(last.inv)}, entrepreneur ${money(last.ent)}${last.result < 0 && contract === "mudarabah" ? " (loses effort, not money)" : ""}.<br>
      Interest loan: lender <b>+${money(last.lend)}</b> guaranteed, borrower ${money(last.borr)}.</div>
      <div class="how">${last.result < 0 ? "⚖️ In the Islamic contract the risk is shared. With interest, the lender still gains while the borrower sinks into debt." : "Both partners share the success according to their agreement."}</div>` : `<div class="how">Press a year button to start.</div>`;
    // update the 3D coin towers (height ∝ total, red if negative)
    Object.keys(totals).forEach((k) => {
      const t = towers[k];
      t.target = Math.max(0.05, Math.abs(totals[k]) / max * 6);
      t.mesh.material.color.set(totals[k] < 0 ? 0x8b1e1e : towerDefs.find((d) => d.key === k).color);
      t.label.el.innerHTML = `${t.name}<br>${money(totals[k])}`;
    });
  }

  setContract("mudarabah");

  // ---------------- Animation ----------------
  function update(dt, time) {
    Object.values(towers).forEach((t) => {
      t.mesh.scale.y += (t.target - t.mesh.scale.y) * Math.min(1, dt * 4);   // smooth growth
      t.mesh.position.y = t.mesh.scale.y / 2;
      t.label.offset.y = t.mesh.scale.y + 0.6;
    });
    SHOPS.forEach((s) => { if (s.badge.visible) s.badge.position.y = 4.7 + Math.sin(time * 3) * 0.1; });
  }

  // ---------------- Presentation actions ----------------
  const shopView = (id) => {
    const p = SHOPS.find((s) => s.id === id).group.position;
    ctx.flyTo(new THREE.Vector3(p.x * 0.35, 7, p.z * 0.35 + 6), new THREE.Vector3(p.x, 2, p.z), 1.5);
  };
  const towerView = () => ctx.flyTo(new THREE.Vector3(0, 7, 15), new THREE.Vector3(0, 2.5, 4), 1.5);
  const actions = {
    intro() { ctx.flyTo(new THREE.Vector3(0, 13, 22), new THREE.Vector3(0, 1, 0), 1.5); ctx.info("consent"); },
    screenCasino() { shopView("casino"); screen("casino"); ctx.later(() => screen("liquor"), 1400); ctx.later(() => ctx.info("screening"), 1500); },
    pickBakery() {
      shopView("bakery"); screen("bakery"); setContract("mudarabah");
      capInv = 10000; $t("#m-inv").value = 10000; ratio = 60; $t("#m-ratio").value = 60; $t("#m-rv").textContent = 60; $t("#m-rv2").textContent = 40;
      resetSim(); ctx.info("mudarabah");
    },
    goodYear() { if (!shop) screen("bakery"); towerView(); simulate(0.3); },
    badYear() { if (!shop) screen("bakery"); towerView(); simulate(-0.2); },
    musharakah() {
      if (!shop) screen("bakery");
      $t("#m-ent").value = 5000; setContract("musharakah"); towerView();
      simulate(0.3); ctx.later(() => simulate(-0.2), 1200); ctx.info("musharakah");
    },
    compareLoan() { towerView(); if (!years.length) { if (!shop) screen("bakery"); simulate(0.3); simulate(-0.2); } ctx.info("loan"); },
    outro() { ctx.flyTo(new THREE.Vector3(0, 13, 22), new THREE.Vector3(0, 1, 0), 1.5); }
  };

  return { update, actions };
};
