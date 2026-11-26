/* =====================================================================
   scenes/atm.js  —  TOPIC 1: Halal Finance ATM
   ---------------------------------------------------------------------
   3D objects: the ATM (with a live canvas screen and 4 big keys),
   four sadaqah "causes", and two sorting bins (HALAL / HARAM).
   Right panel: four tabs — Zakat, Riba Check, Sadaqah, Sort Game.
   ===================================================================== */

TOPIC_SCENES.atm = function (ctx) {
  const { THREE, scene, camera, controls } = ctx;
  const money = ctx.money;

  // ---------------- Scene, lights, floor & patterned wall ----------------
  scene.background = new THREE.Color(0x0a1724);
  scene.fog = new THREE.Fog(0x0a1724, 18, 40);
  scene.add(new THREE.HemisphereLight(0xdfefff, 0x1a2a3a, 0.9));
  const sun = new THREE.DirectionalLight(0xffffff, 0.8);
  sun.position.set(5, 10, 8);
  scene.add(sun);

  const floor = new THREE.Mesh(new THREE.CircleGeometry(16, 48), H3.mat(0x17293b, { roughness: 0.9 }));
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // Wall texture: Islamic 8-pointed star tiles drawn on a canvas
  function patternTexture() {
    const c = document.createElement("canvas"); c.width = c.height = 256;
    const g = c.getContext("2d");
    g.fillStyle = "#0f2a3d"; g.fillRect(0, 0, 256, 256);
    g.strokeStyle = "#e8c36a"; g.globalAlpha = 0.35; g.lineWidth = 3;
    for (let ix = 0; ix < 2; ix++) for (let iy = 0; iy < 2; iy++) {
      const cx = 64 + ix * 128, cy = 64 + iy * 128;
      for (let r = 0; r < 2; r++) {          // two squares, one rotated 45° = 8-point star
        g.save(); g.translate(cx, cy); g.rotate(r * Math.PI / 4);
        g.strokeRect(-36, -36, 72, 72); g.restore();
      }
      g.beginPath(); g.arc(cx, cy, 14, 0, Math.PI * 2); g.stroke();
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(8, 3);
    return t;
  }
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(32, 12), new THREE.MeshStandardMaterial({ map: patternTexture(), roughness: 1, color: 0x8899aa }));
  wall.position.set(0, 6, -3);
  scene.add(wall);

  // ---------------- The ATM ----------------
  const atm = new THREE.Group();
  scene.add(atm);
  atm.add(H3.box(3.2, 5.4, 1.8, 0x14644f, 0, 2.7, 0, { metalness: 0.4, roughness: 0.4 }));       // body
  atm.add(H3.box(3.4, 0.25, 2.0, 0xe8c36a, 0, 5.5, 0, { metalness: 0.7, roughness: 0.3 }));      // gold top trim
  atm.add(H3.box(3.4, 0.25, 2.0, 0xe8c36a, 0, 0.12, 0, { metalness: 0.7, roughness: 0.3 }));     // gold base trim
  // header sign
  const header = H3.sign(["☪ HALAL ATM"], 2.8, 0.6, { w: 512, h: 110, font: "bold 64px Segoe UI", bg: "#0b1f17", fg: "#e8c36a" });
  header.position.set(0, 5.0, 0.91); atm.add(header);

  // Screen: a canvas we redraw whenever the mode changes
  const scrCanvas = document.createElement("canvas"); scrCanvas.width = 800; scrCanvas.height = 520;
  const scrTex = new THREE.CanvasTexture(scrCanvas);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 1.62), new THREE.MeshBasicMaterial({ map: scrTex }));
  screen.position.set(0, 3.75, 0.95);     // just in front of the bezel
  atm.add(screen);
  atm.add(H3.box(2.7, 1.82, 0.05, 0x05110c, 0, 3.75, 0.9));    // screen bezel

  /** Draw a title + lines of text on the ATM screen */
  function drawScreen(title, lines, color) {
    const g = scrCanvas.getContext("2d");
    const grd = g.createLinearGradient(0, 0, 0, 520);
    grd.addColorStop(0, "#0c3b4d"); grd.addColorStop(1, "#06202b");
    g.fillStyle = grd; g.fillRect(0, 0, 800, 520);
    g.fillStyle = color || "#3ddc97"; g.fillRect(0, 0, 800, 90);
    g.fillStyle = "#04121c"; g.font = "bold 52px Segoe UI, Arial"; g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText(title, 400, 46);
    g.fillStyle = "#f6f2e7"; g.font = "bold 50px Segoe UI, Arial";
    (lines || []).forEach((l, i) => g.fillText(l, 400, 160 + i * 88));
    scrTex.needsUpdate = true;
  }
  drawScreen("Assalamu alaikum", ["Welcome to the Halal ATM", "Choose a key below ↓", "Zakat · Riba · Sadaqah · Sort"]);

  // Four big keys under the screen
  const keyDefs = [
    { id: "zakat", label: "ZAKAT", color: "#3ddc97", x: -0.7, y: 2.55 },
    { id: "riba", label: "RIBA CHECK", color: "#ff6b6b", x: 0.7, y: 2.55 },
    { id: "sadaqah", label: "SADAQAH", color: "#e8c36a", x: -0.7, y: 2.0 },
    { id: "sort", label: "SORT GAME", color: "#4fa8ff", x: 0.7, y: 2.0 }
  ];
  const keyMeshes = {};
  keyDefs.forEach((k) => {
    const tex = H3.textTexture(k.label, { w: 256, h: 96, bg: k.color, fg: "#04121c", font: "bold 40px Segoe UI", border: null });
    const mats = [H3.mat(k.color), H3.mat(k.color), H3.mat(k.color), H3.mat(k.color), new THREE.MeshBasicMaterial({ map: tex }), H3.mat(k.color)];
    const key = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.42, 0.14), mats);
    key.position.set(k.x, k.y, 0.95);
    atm.add(key);
    keyMeshes[k.id] = key;
    ctx.clickable(key, () => { pressKey(key); openTab(k.id); });
  });
  // card slot + cash slot (coins come out of the cash slot)
  atm.add(H3.box(0.9, 0.08, 0.1, 0x05110c, 0.9, 1.45, 0.92));
  atm.add(H3.box(1.6, 0.18, 0.12, 0x05110c, -0.4, 1.4, 0.92));
  const slotPos = new THREE.Vector3(-0.4, 1.4, 1.1);

  function pressKey(m) {   // little "push in" animation
    ctx.tween(0.25, (k) => { m.position.z = 0.95 - Math.sin(k * Math.PI) * 0.08; });
  }

  // ---------------- Sadaqah causes ----------------
  const causes = [
    { id: "water", name: "Clean Water", icon: "💧", pos: new THREE.Vector3(-5.2, 0, 1.2), color: 0x4fa8ff, total: 0 },
    { id: "food", name: "Food Bank", icon: "🍞", pos: new THREE.Vector3(-3.6, 0, 3.6), color: 0xff9f5a, total: 0 },
    { id: "school", name: "School Books", icon: "📚", pos: new THREE.Vector3(3.6, 0, 3.6), color: 0xb28cff, total: 0 },
    { id: "orphans", name: "Orphan Care", icon: "🤲", pos: new THREE.Vector3(5.2, 0, 1.2), color: 0x3ddc97, total: 0 }
  ];
  causes.forEach((c) => {
    const g = new THREE.Group(); g.position.copy(c.pos);
    g.add(H3.cyl(0.9, 1.0, 0.4, 0x22384f, 0, 0.2, 0, 24));                  // pedestal
    if (c.id === "water") {                                                  // a little well
      g.add(H3.cyl(0.45, 0.45, 0.5, 0x8a8f99, 0, 0.65, 0, 16));
      g.add(H3.cyl(0.38, 0.38, 0.52, 0x2a6fd6, 0, 0.66, 0, 16));
      g.add(H3.box(0.06, 0.8, 0.06, 0x6b4a2b, -0.4, 1.2, 0)); g.add(H3.box(0.06, 0.8, 0.06, 0x6b4a2b, 0.4, 1.2, 0));
      const roof = new THREE.Mesh(new THREE.ConeGeometry(0.65, 0.4, 4), H3.mat(0xb5442e)); roof.position.y = 1.75; roof.rotation.y = Math.PI / 4; g.add(roof);
    } else if (c.id === "food") {
      g.add(H3.box(0.8, 0.6, 0.6, 0xa8743a, 0, 0.7, 0));
      g.add(H3.sphere(0.18, 0xff6b3d, -0.2, 1.1, 0)); g.add(H3.sphere(0.18, 0xffd43b, 0.15, 1.1, 0.1)); g.add(H3.sphere(0.16, 0x69db7c, 0.05, 1.12, -0.15));
    } else if (c.id === "school") {
      const h = H3.house(0xf3dfa6, 0x7048c8, 0.9); h.position.y = 0.4; g.add(h);
    } else {
      const h = H3.house(0xd8f5e6, 0x2f9b70, 0.9); h.position.y = 0.4; g.add(h);
    }
    scene.add(g);
    c.group = g;
    c.count = 0;   // coins piled at this cause
    ctx.hotspot(new THREE.Vector3(c.pos.x, 2.4, c.pos.z), c.icon + " " + c.name, () => { openTab("sadaqah"); giveSadaqah(c.id, 10); });
  });

  // ---------------- Coins ----------------
  const coinGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.05, 20);
  const coinMat = H3.mat(0xf2c94c, { metalness: 0.9, roughness: 0.25, emissive: 0x3a2a00 });
  const flyingCoins = [];

  function launchCoin(cause, delay) {
    const coin = new THREE.Mesh(coinGeo, coinMat);
    coin.position.copy(slotPos);
    coin.visible = false;
    scene.add(coin);
    const pileY = 0.45 + Math.min(cause.count, 25) * 0.055;
    const end = new THREE.Vector3(cause.pos.x + (Math.random() - 0.5) * 0.5, pileY, cause.pos.z + 0.6 + (Math.random() - 0.5) * 0.3);
    cause.count++;
    flyingCoins.push({ coin, start: slotPos.clone(), end, t: -delay, dur: 1.2 });
  }

  // ---------------- Sorting bins ----------------
  function bin(label, color, x) {
    const g = new THREE.Group();
    g.position.set(x, 0, 4.6);
    g.add(H3.box(1.6, 1.0, 1.0, color, 0, 0.5, 0, { transparent: true, opacity: 0.85 }));
    const s = H3.sign(label, 1.6, 0.5, { w: 320, h: 100, bg: color === 0x2f9b70 ? "#2f9b70" : "#c0392b", fg: "#fff", font: "bold 60px Segoe UI", border: null });
    s.position.set(0, 1.35, 0); g.add(s);
    scene.add(g);
    return g;
  }
  const binHalal = bin("HALAL ✓", 0x2f9b70, -1.6);
  const binHaram = bin("HARAM ✗", 0xc0392b, 1.6);
  binHalal.visible = binHaram.visible = false;
  const flyingCards = [];

  // ---------------- Hotspots on the ATM ----------------
  ctx.hotspot(new THREE.Vector3(-1.9, 4.6, 0.9), "Why an ATM?", "atm");
  ctx.hotspot(new THREE.Vector3(2.3, 3.75, 0.9), "📖 Learn: this screen", () => ctx.info(currentTab || "atm"));

  // ---------------- Camera ----------------
  camera.position.set(0, 4, 13);
  controls.target.set(0, 2.4, 0);
  controls.maxPolarAngle = Math.PI / 2 - 0.05;    // don't go under the floor
  controls.minDistance = 4; controls.maxDistance = 22;

  // =====================================================================
  // RIGHT PANEL (tabs)
  // =====================================================================
  const T = ctx.tools;
  T.innerHTML = `
    <h3>🏧 Halal Finance ATM</h3>
    <div class="how">${ctx.topic.howTo}</div>
    <div id="atm-wallet"></div>
    <div class="seg" id="atm-tabs">
      <button data-t="zakat">Zakat</button><button data-t="riba">Riba</button>
      <button data-t="sadaqah">Sadaqah</button><button data-t="sort">Sort</button>
    </div>
    <div id="atm-tab"></div>`;
  T.querySelectorAll("#atm-tabs button").forEach((b) => b.onclick = () => openTab(b.dataset.t));
  const tabEl = T.querySelector("#atm-tab");

  // ---------- SHARED WALLET (step 1 of "My money journey") ----------
  const W = window.WALLET;
  const wBox = T.querySelector("#atm-wallet");
  function renderWallet() {
    if (!wBox.isConnected) return false;            // topic closed: stop listening
    const st = W.state, nisab = ctx.config.defaultNisab;
    let html = `<div class="wallet-box"><div class="wb-head"><span class="label-sm">💳 Your wallet · step 1</span><span class="wb-bal">${money(st.balance)}</span></div>`;
    if (!st.earned) {
      html += `<button class="btn accent" id="w-earn">💼 Withdraw my savings (${money(W.START_SAVINGS)})</button>
               <div class="wb-note">Savings you have held for one full lunar year.</div>`;
    } else if (!st.zakatPaid) {
      html += `<button class="btn accent" id="w-zakat">🕌 Pay zakat from my wallet (2.5%)</button>
               <div class="wb-note">Your savings are above the nisab (${money(nisab)}), so zakat is due.</div>`;
    } else {
      html += `<div class="wb-note">✅ Savings withdrawn and purified with zakat.</div>
               <button class="btn accent" id="w-next">🏪 Next: grow it fairly in the Market ▶</button>`;
    }
    if (st.earned) html += `<button class="btn ghost small" id="w-loan">🏦 Ask for a ${money(20000)} interest loan</button>`;
    wBox.innerHTML = html + `</div>`;
    const on = (id, fn) => { const b = wBox.querySelector(id); if (b) b.onclick = fn; };
    on("#w-earn", () => {
      W.earn();
      for (let i = 0; i < 6; i++) launchCoin(causes[i % causes.length], i * 0.1);
      drawScreen("WITHDRAWAL", ["Savings: " + money(W.START_SAVINGS), "Held for one lunar year", "Next: pay zakat"], "#3ddc97");
      ctx.toast("💼 " + money(W.START_SAVINGS) + " added to your wallet");
    });
    on("#w-zakat", () => {
      const z = W.payZakat(nisab);
      if (z > 0) {
        drawScreen("ZAKAT PAID", ["2.5% of your savings", "Zakat: " + money(z), "To the 8 groups of 9:60"], "#3ddc97");
        ctx.toast("🕌 Zakat of " + money(z) + " paid. Your wealth is purified.");
        ctx.info("zakat");
      } else if (z === -1) ctx.toast("ℹ️ Your balance is below the nisab, so no zakat is due.");
    });
    on("#w-loan", () => {
      W.refuseLoan();
      drawScreen("LOAN REFUSED", ["Interest = riba", "2:275 Trade ✓  Riba ✗", "Try Murabaha instead"], "#ff6b6b");
      ctx.toast("❌ The Halal ATM refuses interest loans: riba is forbidden (2:275).");
      ctx.info("riba");
    });
    on("#w-next", () => window.APP_ENTER("market"));
  }
  W.onChange(renderWallet);
  renderWallet();
  let currentTab = "";

  function openTab(t) {
    currentTab = t;
    T.querySelectorAll("#atm-tabs button").forEach((b) => b.classList.toggle("on", b.dataset.t === t));
    binHalal.visible = binHaram.visible = (t === "sort");
    if (t === "zakat") renderZakat();
    if (t === "riba") renderRiba();
    if (t === "sadaqah") renderSadaqah();
    if (t === "sort") renderSort();
  }

  // ---------- ZAKAT CALCULATOR ----------
  function renderZakat() {
    tabEl.innerHTML = `
      <div class="tool-section">
        <div class="label-sm">Your wealth (held for one lunar year)</div>
        <div class="field">💵 Cash & bank savings <input type="number" id="z-cash" value="0" min="0"></div>
        <div class="field">🥇 Gold & silver value <input type="number" id="z-gold" value="0" min="0"></div>
        <div class="field">📦 Business stock / shares <input type="number" id="z-stock" value="0" min="0"></div>
        <div class="field">🤝 Money others owe you <input type="number" id="z-owed" value="0" min="0"></div>
        <div class="field">➖ Debts due now <input type="number" id="z-debt" value="0" min="0"></div>
        <div class="field">⚖️ Nisab (85 g gold) <input type="number" id="z-nisab" value="${ctx.config.defaultNisab}" min="0" step="0.01"></div>
        <div class="how">Nisab changes with the gold price. Check today's value.</div>
        <button class="btn accent" id="z-calc" style="width:100%">Calculate Zakat</button>
      </div>
      <div id="z-out"></div>
      <button class="btn ghost small" id="z-who" style="width:100%">Who receives zakat? (9:60)</button>
      <button class="btn small" id="z-family" style="width:100%;margin-top:6px">🧮 Full family calculator (gold in grams)</button>`;
    tabEl.querySelector("#z-calc").onclick = calcZakat;
    tabEl.querySelector("#z-who").onclick = showRecipients;
    tabEl.querySelector("#z-family").onclick = () => window.ZAKAT && ZAKAT.open();
    tabEl.querySelectorAll("input").forEach((i) => i.oninput = calcZakat);
    drawScreen("ZAKAT", ["Enter your savings", "on the right-hand panel", "Zakat = 2.5% above nisab"]);
  }
  function calcZakat() {
    const v = (id) => Math.max(0, +tabEl.querySelector(id).value || 0);
    const total = v("#z-cash") + v("#z-gold") + v("#z-stock") + v("#z-owed") - v("#z-debt");
    const nisab = v("#z-nisab");
    const due = total >= nisab && total > 0;
    const zakat = due ? total * 0.025 : 0;
    tabEl.querySelector("#z-out").innerHTML = `
      <div class="result-box ${due ? "good" : ""}">
        <div class="label-sm">Zakatable wealth</div><div style="font-size:1.4rem;font-weight:800">${money(total)}</div>
        <div class="label-sm" style="margin-top:6px">Zakat due (2.5%)</div><div class="big-number">${money(zakat)}</div>
        <div>${due ? "✅ Above the nisab: zakat is due." : "ℹ️ Below the nisab: no zakat is due this year."}</div>
      </div>`;
    drawScreen("ZAKAT RESULT", ["Wealth: " + money(total), "Nisab: " + money(nisab), due ? "Zakat due: " + money(zakat) : "Below nisab: none due"], due ? "#3ddc97" : "#e8c36a");
  }
  function showRecipients() {
    drawScreen("ZAKAT RECIPIENTS 9:60", ["Poor · Needy · Collectors", "Hearts reconciled · Captives", "Debtors · Cause of Allah", "Stranded travellers"], "#3ddc97");
    ctx.info("zakat");
  }

  // ---------- RIBA CHECK ----------
  function renderRiba() {
    tabEl.innerHTML = `
      <div class="tool-section">
        <div class="label-sm">You need to buy a ${ctx.money(10000)} car</div>
        <div class="field">Price / loan amount <input type="number" id="r-amt" value="10000" min="100"></div>
        <div class="field">Interest rate (% per year) <input type="number" id="r-rate" value="12" min="0" max="50"></div>
        <div class="field">Years <input type="number" id="r-years" value="3" min="1" max="10"></div>
        <div class="label-sm" style="margin-top:8px">Months paid late: <b id="r-late-v">0</b></div>
        <input type="range" id="r-late" min="0" max="24" value="0">
      </div>
      <div class="bars" id="r-bars"></div>
      <div class="bar-labels"><div>Interest loan (riba)</div><div>Murabaha (fixed price)</div><div>Qard Hasan (goodly loan)</div></div>
      <div id="r-out"></div>
      <button class="btn ghost small" id="r-why" style="width:100%">Why is riba forbidden?</button>`;
    tabEl.querySelectorAll("input").forEach((i) => i.oninput = calcRiba);
    tabEl.querySelector("#r-why").onclick = () => ctx.info("riba");
    calcRiba();
  }
  function calcRiba() {
    const amt = Math.max(0, +tabEl.querySelector("#r-amt").value || 0);
    const rate = Math.max(0, +tabEl.querySelector("#r-rate").value || 0) / 100;
    const years = Math.max(1, +tabEl.querySelector("#r-years").value || 1);
    const late = +tabEl.querySelector("#r-late").value;
    tabEl.querySelector("#r-late-v").textContent = late;
    // Interest loan: compound interest, and extra interest keeps adding for every late month
    const interestTotal = amt * Math.pow(1 + rate, years) * Math.pow(1 + rate / 12, late);
    // Murabaha: the bank buys the car and sells it for a price agreed ONCE (same profit rate for the example).
    // Lateness does NOT increase the price.
    const murabaha = amt * (1 + rate * years * 0.85);
    const qard = amt;
    const max = Math.max(interestTotal, murabaha, qard);
    const bar = (v, c) => `<div class="bar"><div class="val">${money(v)}</div><div class="fill" style="height:${(v / max) * 100}%;background:${c}"></div></div>`;
    tabEl.querySelector("#r-bars").innerHTML = bar(interestTotal, "#ff6b6b") + bar(murabaha, "#3ddc97") + bar(qard, "#4fa8ff");
    tabEl.querySelector("#r-out").innerHTML = `
      <div class="result-box bad"><b>Interest loan:</b> money is rented out for a guaranteed extra. ${late ? `Being ${late} months late adds <b>${money(interestTotal - amt * Math.pow(1 + rate, years))}</b> more, and the debt keeps growing.` : "Try the late-payment slider ↑"}</div>
      <div class="result-box good"><b>Murabaha:</b> the bank really buys the car, takes the risk of owning it, and sells it to you at a price fixed in advance. Paying late does <b>not</b> increase it.</div>
      <div class="result-box"><b>Qard Hasan:</b> a friend or family member lends and you return exactly what you borrowed.</div>`;
    drawScreen("RIBA CHECK", ["Interest: " + money(interestTotal), "Murabaha: " + money(murabaha) + " (fixed)", "Qard Hasan: " + money(qard), "2:275 Trade ✓  Riba ✗"], "#ff6b6b");
  }

  // ---------- SADAQAH ----------
  let totalGiven = 0;
  function renderSadaqah() {
    tabEl.innerHTML = `
      <div class="tool-section">
        <div class="label-sm">Amount per donation</div>
        <div class="seg" id="s-amt"><button data-a="1">${money(1)}</button><button data-a="5">${money(5)}</button><button data-a="10" class="on">${money(10)}</button><button data-a="50">${money(50)}</button></div>
        <div class="label-sm" style="margin-top:10px">Choose a cause (or click it in 3D)</div>
        ${causes.map((c) => `<button class="btn ghost" data-c="${c.id}" style="width:100%;margin:5px 0;justify-content:space-between">${c.icon} ${c.name} <span id="s-t-${c.id}">${money(c.total)}</span></button>`).join("")}
      </div>
      <div class="result-box good">
        <div class="label-sm">Total given</div><div class="big-number" id="s-total">${money(totalGiven)}</div>
        <div>🌾 The Qur'an's parable (2:261): one seed grows <b>7 ears × 100 grains = 700</b>. Allah multiplies reward for whom He wills.</div>
      </div>`;
    tabEl.querySelectorAll("#s-amt button").forEach((b) => b.onclick = () => {
      tabEl.querySelectorAll("#s-amt button").forEach((x) => x.classList.remove("on")); b.classList.add("on");
    });
    tabEl.querySelectorAll("[data-c]").forEach((b) => b.onclick = () => {
      const a = +tabEl.querySelector("#s-amt .on").dataset.a;
      giveSadaqah(b.dataset.c, a);
    });
    drawScreen("SADAQAH", ["Give any amount, any time", "Choose a cause", "Watch your coins travel!"], "#e8c36a");
  }
  function giveSadaqah(id, amount) {
    const c = causes.find((x) => x.id === id);
    c.total += amount; totalGiven += amount;
    const n = Math.min(8, 2 + Math.round(Math.log2(amount + 1)));
    for (let i = 0; i < n; i++) launchCoin(c, i * 0.12);
    const el = document.getElementById("s-t-" + id); if (el) el.textContent = money(c.total);
    const tot = document.getElementById("s-total"); if (tot) tot.textContent = money(totalGiven);
    drawScreen("JAZAKALLAH KHAIR", ["You gave " + money(amount), "to " + c.name, "Total given: " + money(totalGiven)], "#e8c36a");
  }

  // ---------- HALAL / HARAM SORTING GAME ----------
  const items = [
    { t: "Selling home-made cakes at a fair price", halal: true, why: "Fair trade by mutual consent is permitted (2:275, 4:29)." },
    { t: "Taking a loan with 15% yearly interest", halal: false, why: "A guaranteed extra charged on a loan is riba (2:275)." },
    { t: "Buying a lottery ticket", halal: false, why: "The lottery is gambling, which is forbidden (5:90)." },
    { t: "Paying 2.5% zakat on savings", halal: true, why: "Zakat is a pillar of Islam (9:60)." },
    { t: "Hiding a crack in a phone you are selling", halal: false, why: "Cheating removes true consent; trade must be fair (4:29)." },
    { t: "Renting out a shop for a fixed monthly rent", halal: true, why: "Rent is payment for using a real asset, not interest on money." },
    { t: "Lending a friend money and asking only the same amount back", halal: true, why: "This is a Qard Hasan (goodly loan): no extra is charged." },
    { t: "Betting money on a football match", halal: false, why: "Betting is gambling (5:90)." },
    { t: "Buying a car through a fixed-price Murabaha", halal: true, why: "A real sale with a fixed price agreed in advance." },
    { t: "Charging a friend extra because they repaid late", halal: false, why: "An increase for delay is riba (2:278–279)." }
  ];
  let sortOrder = [], sortI = 0, sortScore = 0;
  function renderSort(reset) {
    if (reset || !sortOrder.length) { sortOrder = items.slice().sort(() => Math.random() - 0.5); sortI = 0; sortScore = 0; }
    if (sortI >= sortOrder.length) {
      tabEl.innerHTML = `<div class="result-box good"><div class="label-sm">Finished!</div><div class="big-number">${sortScore} / ${sortOrder.length}</div></div>
        <button class="btn accent" id="g-again" style="width:100%">Play again</button>`;
      tabEl.querySelector("#g-again").onclick = () => renderSort(true);
      drawScreen("GAME OVER", ["Score: " + sortScore + " / " + sortOrder.length, "MashaAllah!"], "#4fa8ff");
      return;
    }
    const it = sortOrder[sortI];
    tabEl.innerHTML = `
      <div class="label-sm">Transaction ${sortI + 1} of ${sortOrder.length} · Score ${sortScore}</div>
      <div class="result-box" style="font-size:1.25rem;font-weight:700">${it.t}</div>
      <div class="tool-row"><button class="btn" style="background:#2f9b70;border-color:#2f9b70;color:#fff" id="g-h">✓ HALAL</button>
      <button class="btn" style="background:#c0392b;border-color:#c0392b;color:#fff" id="g-x">✗ HARAM</button></div>
      <div id="g-fb"></div>`;
    tabEl.querySelector("#g-h").onclick = () => answerSort(true);
    tabEl.querySelector("#g-x").onclick = () => answerSort(false);
    drawScreen("HALAL OR HARAM?", wrap(it.t, 24), "#4fa8ff");
  }
  function answerSort(saidHalal) {
    const it = sortOrder[sortI];
    const right = saidHalal === it.halal;
    if (right) sortScore++;
    // fly a 3D card into the correct bin
    const card = H3.box(0.8, 0.5, 0.05, it.halal ? 0x3ddc97 : 0xff6b6b, 0, 2.3, 1.2);
    scene.add(card);
    flyingCards.push({ card, start: card.position.clone(), end: new THREE.Vector3(it.halal ? -1.6 : 1.6, 0.6, 4.6), t: 0, dur: 1 });
    tabEl.querySelectorAll("button").forEach((b) => b.disabled = true);
    tabEl.querySelector("#g-fb").innerHTML = `<div class="result-box ${right ? "good" : "bad"}">${right ? "✅ Correct!" : "❌ Not quite."} It is <b>${it.halal ? "HALAL" : "HARAM"}</b>. ${it.why}</div>
      <button class="btn accent" id="g-next" style="width:100%">Next ▶</button>`;
    tabEl.querySelector("#g-next").onclick = () => { sortI++; renderSort(); };
  }
  function wrap(text, n) {       // split long text into lines for the ATM screen
    const words = text.split(" "), lines = [""];
    words.forEach((w) => { if ((lines[lines.length - 1] + " " + w).length > n) lines.push(w); else lines[lines.length - 1] += (lines[lines.length - 1] ? " " : "") + w; });
    return lines.slice(0, 4);
  }

  openTab("zakat");

  // =====================================================================
  // ANIMATION (called every frame)
  // =====================================================================
  function update(dt, time) {
    header.material.color.setScalar(0.85 + Math.sin(time * 2) * 0.15);   // gentle glowing header
    // flying coins follow an arc from the cash slot to the cause
    for (let i = flyingCoins.length - 1; i >= 0; i--) {
      const f = flyingCoins[i];
      f.t += dt;
      if (f.t < 0) continue;
      f.coin.visible = true;
      const k = Math.min(1, f.t / f.dur);
      f.coin.position.lerpVectors(f.start, f.end, k);
      f.coin.position.y += Math.sin(k * Math.PI) * 2.5;
      f.coin.rotation.x += dt * 12;
      if (k >= 1) { f.coin.rotation.set(0, 0, 0); flyingCoins.splice(i, 1); }
    }
    for (let i = flyingCards.length - 1; i >= 0; i--) {
      const f = flyingCards[i];
      f.t += dt;
      const k = Math.min(1, f.t / f.dur);
      f.card.position.lerpVectors(f.start, f.end, k);
      f.card.position.y += Math.sin(k * Math.PI) * 1.5;
      f.card.rotation.z += dt * 6;
      if (k >= 1) { scene.remove(f.card); flyingCards.splice(i, 1); }
    }
  }

  // =====================================================================
  // PRESENTATION MODE ACTIONS (names match content.js "steps")
  // =====================================================================
  const front = () => ctx.flyTo(new THREE.Vector3(0, 4, 13), new THREE.Vector3(0, 2.4, 0), 1.5);
  const close = () => ctx.flyTo(new THREE.Vector3(1.5, 3.4, 6.5), new THREE.Vector3(0, 3.0, 0), 1.5);
  const actions = {
    intro() { front(); drawScreen("Assalamu alaikum", ["Welcome to the Halal ATM", "Money is an amanah (trust)", "from Allah"]); },
    showRibaVerse() { front(); drawScreen("SURAH AL-BAQARAH 2:275", ["Allah has permitted trade", "and has forbidden interest"], "#e8c36a"); ctx.info("atm"); },
    zakatDemo() {
      close(); openTab("zakat");
      const set = (id, v) => tabEl.querySelector(id).value = v;
      set("#z-cash", 45000); set("#z-gold", 12000); set("#z-stock", 0); set("#z-owed", 2000); set("#z-debt", 4000);
      calcZakat(); pressKey(keyMeshes.zakat);
    },
    zakatRecipients() { close(); openTab("zakat"); showRecipients(); },
    ribaDemo() {
      close(); openTab("riba"); pressKey(keyMeshes.riba);
      const s = tabEl.querySelector("#r-late");
      ctx.tween(3, (k) => { if (s.isConnected) { s.value = Math.round(k * 12); calcRiba(); } }, null, "riba");
    },
    ribaHadith() { front(); openTab("riba"); ctx.info("riba"); drawScreen("SAHIH MUSLIM 1598", ["Taker · Payer · Writer", "Two witnesses", "\"They are all equal\""], "#ff6b6b"); },
    sadaqahDemo() {
      ctx.flyTo(new THREE.Vector3(0, 6, 13), new THREE.Vector3(0, 1.5, 1), 1.5);
      openTab("sadaqah"); pressKey(keyMeshes.sadaqah);
      giveSadaqah("water", 10);
      ctx.later(() => giveSadaqah("food", 10), 700);
      ctx.later(() => giveSadaqah("school", 10), 1400);
      ctx.later(() => giveSadaqah("orphans", 10), 2100);
    },
    sortDemo() {
      ctx.flyTo(new THREE.Vector3(0, 5, 12), new THREE.Vector3(0, 1.8, 2), 1.5);
      openTab("sort"); renderSort(true); pressKey(keyMeshes.sort);
    }
  };

  return { update, actions };
};
