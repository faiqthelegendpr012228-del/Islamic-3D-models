/* =====================================================================
   scenes/waqf.js  —  TOPIC 3: Waqf, a charity that keeps giving
   ---------------------------------------------------------------------
   3D objects: a village (houses appear as the years pass), the donated
   asset in the centre (well / school / orchard / hospital), villagers
   walking to it, and glowing "benefit" particles flowing to every home.
   The timeline slider (0–300 years) drives everything.
   ===================================================================== */

TOPIC_SCENES.waqf = function (ctx) {
  const { THREE, scene, camera, controls } = ctx;

  scene.background = new THREE.Color(0x9fd3f0);
  scene.fog = new THREE.Fog(0x9fd3f0, 30, 70);
  const hemi = new THREE.HemisphereLight(0xffffff, 0x5f7f3f, 0.75);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff1d6, 0.9);
  sun.position.set(10, 20, 8);
  scene.add(sun);

  // ground and a winding path
  const ground = new THREE.Mesh(new THREE.CircleGeometry(30, 64), H3.mat(0x7fb661, { roughness: 1 }));
  ground.rotation.x = -Math.PI / 2; scene.add(ground);
  const plaza = new THREE.Mesh(new THREE.CircleGeometry(3.4, 40), H3.mat(0xd8c49a, { roughness: 1 }));
  plaza.rotation.x = -Math.PI / 2; plaza.position.y = 0.01; scene.add(plaza);
  // a geometric star tile in the plaza (two rotated squares)
  for (let r = 0; r < 2; r++) {
    const sq = new THREE.Mesh(new THREE.RingGeometry(2.6, 2.85, 4, 1), new THREE.MeshBasicMaterial({ color: 0xb8913c }));
    sq.rotation.x = -Math.PI / 2; sq.rotation.z = r * Math.PI / 4 + Math.PI / 4; sq.position.y = 0.02; scene.add(sq);
  }

  // ---------------- Assets that can be donated ----------------
  const ASSETS = {
    well:     { name: "Water Well", icon: "💧", initial: 120, perYear: 20, unit: "people given clean water", color: 0x4fa8ff },
    school:   { name: "School",     icon: "🏫", initial: 40,  perYear: 40, unit: "students taught", color: 0xb28cff },
    orchard:  { name: "Orchard",    icon: "🌳", initial: 60,  perYear: 50, unit: "people fed with fruit", color: 0xff9f5a },
    hospital: { name: "Hospital",   icon: "🏥", initial: 100, perYear: 400, unit: "patients treated", color: 0xff6b6b }
  };
  let assetKey = null;
  let assetGroup = null;

  function buildAsset(key) {
    const g = new THREE.Group();
    if (key === "well") {
      g.add(H3.cyl(1.1, 1.2, 1.0, 0x9a9187, 0, 0.5, 0, 24));
      g.add(H3.cyl(0.9, 0.9, 1.02, 0x2a6fd6, 0, 0.52, 0, 24, { emissive: 0x0a2a66 }));
      g.add(H3.box(0.15, 1.8, 0.15, 0x6b4a2b, -1.0, 1.4, 0)); g.add(H3.box(0.15, 1.8, 0.15, 0x6b4a2b, 1.0, 1.4, 0));
      const axle = H3.cyl(0.08, 0.08, 2.2, 0x6b4a2b, 0, 2.1, 0, 8); axle.rotation.z = Math.PI / 2; g.add(axle);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(1.7, 0.9, 4), H3.mat(0xb5442e)); roof.position.y = 2.7; roof.rotation.y = Math.PI / 4; g.add(roof);
      g.add(H3.cyl(0.2, 0.17, 0.3, 0x8a5a2b, 0, 1.6, 0, 10));
    } else if (key === "school") {
      g.add(H3.box(4, 2, 2.6, 0xf3dfa6, 0, 1, 0));
      g.add(H3.box(1, 1.4, 0.05, 0x5a3b22, 0, 0.7, 1.31));
      const dome = new THREE.Mesh(new THREE.SphereGeometry(0.9, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), H3.mat(0x2fbf9b, { metalness: 0.3 })); dome.position.y = 2; g.add(dome);
      g.add(H3.cyl(0.25, 0.3, 3.6, 0xf3dfa6, 1.8, 1.8, -1.0, 12));
      const cap = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.6, 12), H3.mat(0x2fbf9b)); cap.position.set(1.8, 3.9, -1.0); g.add(cap);
      for (let i = -1; i <= 1; i += 2) g.add(H3.box(0.6, 0.6, 0.05, 0x7fd3ff, i * 1.3, 1.2, 1.31));
      const s = H3.sign("MADRASA · WAQF", 2.4, 0.4, { w: 512, h: 90, font: "bold 50px Segoe UI", bg: "#0f2236", fg: "#e8c36a" }); s.position.set(0, 1.75, 1.32); g.add(s);
    } else if (key === "orchard") {
      for (let x = -1; x <= 1; x++) for (let z = -1; z <= 1; z++) {
        const t = H3.tree(0x2f8f3a, 1.1); t.position.set(x * 1.4, 0, z * 1.4); g.add(t);
        for (let f = 0; f < 4; f++) {
          const a = f * 1.6 + x + z;
          g.add(H3.sphere(0.09, 0xff8c1a, x * 1.4 + Math.cos(a) * 0.35, 0.9 + Math.sin(f) * 0.15, z * 1.4 + Math.sin(a) * 0.35, null, 8));
        }
      }
      for (let i = 0; i < 4; i++) {           // fence around it
        const f = H3.box(4.4, 0.35, 0.06, 0xa8743a, 0, 0.2, 2.2);
        const p = new THREE.Group(); p.add(f); p.rotation.y = i * Math.PI / 2; g.add(p);
      }
    } else if (key === "hospital") {
      g.add(H3.box(4, 2.6, 2.4, 0xf7f7f2, 0, 1.3, 0));
      g.add(H3.box(4.2, 0.2, 2.6, 0x2fbf9b, 0, 2.7, 0));
      g.add(H3.box(1.2, 1.2, 0.05, 0x7fd3ff, 0, 0.6, 1.21));
      for (let i = -1; i <= 1; i += 2) for (let j = 0; j < 2; j++) g.add(H3.box(0.6, 0.5, 0.05, 0x7fd3ff, i * 1.3, 0.8 + j * 1.0, 1.21));
      // red crescent sign
      const c = document.createElement("canvas"); c.width = c.height = 128;
      const gg = c.getContext("2d"); gg.fillStyle = "#fff"; gg.fillRect(0, 0, 128, 128);
      gg.fillStyle = "#e03131"; gg.beginPath(); gg.arc(64, 64, 44, 0, Math.PI * 2); gg.fill();
      gg.fillStyle = "#fff"; gg.beginPath(); gg.arc(80, 58, 38, 0, Math.PI * 2); gg.fill();
      const sign = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.8), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c) }));
      sign.position.set(0, 2.05, 1.22); g.add(sign);
    }
    return g;
  }

  // ---------------- Village houses (appear over time) ----------------
  const houses = [];
  let seed = 11;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const wallColors = [0xe8d5b0, 0xf0c9a0, 0xdcc7a1, 0xf3e3c3, 0xe6b98c];
  const roofColors = [0xb5442e, 0x8f3a2a, 0x2f7f9b, 0x6d4fc2, 0x2f9b70];
  for (let i = 0; i < 64; i++) {
    const ring = 5.5 + Math.floor(i / 12) * 2.6;
    const a = (i % 12) / 12 * Math.PI * 2 + Math.floor(i / 12) * 0.26 + (rnd() - 0.5) * 0.15;
    const h = H3.house(wallColors[i % 5], roofColors[(i * 3) % 5], 0.9 + rnd() * 0.35);
    h.position.set(Math.cos(a) * ring, 0, Math.sin(a) * ring);
    h.rotation.y = -a - Math.PI / 2;      // face the centre
    h.visible = false; h.scale.setScalar(0.001);
    scene.add(h);
    houses.push({ mesh: h, appearYear: i < 6 ? 0 : (i - 6) * 4.7 + rnd() * 3, grown: 0 });
  }
  // trees around the edge that grow taller over the centuries
  const trees = [];
  for (let i = 0; i < 30; i++) {
    const a = rnd() * Math.PI * 2, r = 17 + rnd() * 9;
    const t = H3.tree(0x3f9d4a, 1); t.position.set(Math.cos(a) * r, 0, Math.sin(a) * r); scene.add(t); trees.push(t);
  }

  // ---------------- Villagers walking to the asset ----------------
  const people = [];
  const shirt = [0x2f9b70, 0x4fa8ff, 0xe8c36a, 0xb28cff, 0xff9f5a, 0xff6b6b];
  for (let i = 0; i < 36; i++) {
    const p = H3.person(shirt[i % shirt.length]); p.visible = false; scene.add(p);
    people.push({ mesh: p, house: i % 64, t: rnd(), speed: 0.08 + rnd() * 0.08 });
  }

  // the trustee (mutawalli) stands next to the asset
  const trustee = H3.person(0x1b3a57); trustee.scale.setScalar(1.3); trustee.position.set(2.4, 0, 2.2); scene.add(trustee);
  const trusteeHat = H3.cyl(0.13, 0.13, 0.12, 0xffffff, 0, 0.72, 0, 12); trustee.add(trusteeHat);

  // ---------------- Benefit particles (asset → homes) ----------------
  const particles = [];
  const dot = H3.dotTexture();
  for (let i = 0; i < 40; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: dot, color: 0x4fa8ff, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    s.scale.setScalar(0.5); scene.add(s);
    particles.push({ s, house: i, t: rnd() });
  }

  // repair sparkle on the asset
  const sparkle = H3.glow(0xffe066, 5); sparkle.position.set(0, 1.5, 0); sparkle.material.opacity = 0; scene.add(sparkle);

  // ---------------- Hotspots ----------------
  ctx.hotspot(new THREE.Vector3(0, 4.6, 0), "🔒 Asset preserved", "asset");
  ctx.hotspot(trustee, "🧑‍💼 Trustee (mutawalli)", "trustee", { offset: new THREE.Vector3(0, 1.4, 0) });
  ctx.hotspot(new THREE.Vector3(-6.5, 2.4, 3), "👨‍👩‍👧 Beneficiaries", "people");
  ctx.hotspot(new THREE.Vector3(6.2, 2.4, -4), "❓ What is waqf?", "waqf");
  ctx.hotspot(new THREE.Vector3(-5, 2.4, -6), "📜 Waqf in history", "history");

  // ---------------- Camera ----------------
  camera.position.set(0, 14, 20);
  controls.target.set(0, 0, 0);
  controls.maxPolarAngle = Math.PI / 2 - 0.08;
  controls.minDistance = 6; controls.maxDistance = 45;

  // ---------------- Right panel ----------------
  ctx.tools.innerHTML = `
    <h3>🕌 Waqf Village</h3>
    <div class="how">${ctx.topic.howTo}</div>
    <div class="tool-section">
      <div class="label-sm">1 · Donate an asset as waqf</div>
      <div class="tool-row">${Object.keys(ASSETS).map((k) => `<button class="btn ghost small" data-a="${k}">${ASSETS[k].icon} ${ASSETS[k].name}</button>`).join("")}</div>
    </div>
    <div class="tool-section">
      <div class="label-sm">2 · Move through time</div>
      <div style="display:flex;justify-content:space-between;align-items:baseline"><div class="big-number" id="w-year">Year 0</div><div id="w-gen">Generation 1</div></div>
      <input type="range" id="w-slider" min="0" max="300" value="0" step="1">
      <div class="tool-row"><button class="btn accent small" id="w-play">▶ Play 300 years</button><button class="btn ghost small" id="w-reset">↺ Year 0</button></div>
      <div id="w-era" class="how"></div>
    </div>
    <div class="result-box good">
      <div class="label-sm" id="w-unit">Choose an asset above</div>
      <div class="big-number" id="w-count">0</div>
      <div id="w-status">The asset: <b>preserved ✓</b> · Benefit: <b>given away ✓</b> · Donor's reward: <b>continuing ✓</b></div>
    </div>
    <div class="tool-row"><button class="btn ghost small" id="w-hadith">📜 Sahih Muslim 1631</button><button class="btn ghost small" id="w-umar">📜 Umar's waqf</button><button class="btn ghost small" id="w-love">📖 3:92</button></div>`;
  const $t = (id) => ctx.tools.querySelector(id);
  ctx.tools.querySelectorAll("[data-a]").forEach((b) => b.onclick = () => donate(b.dataset.a));
  $t("#w-slider").oninput = (e) => setYear(+e.target.value);
  $t("#w-play").onclick = () => playTo(300, 20);
  $t("#w-reset").onclick = () => setYear(0);
  $t("#w-hadith").onclick = () => ctx.info("people");
  $t("#w-umar").onclick = () => ctx.info("waqf");
  $t("#w-love").onclick = () => ctx.info("love");

  let year = 0, lastRepair = 0;

  function donate(key) {
    if (assetGroup) scene.remove(assetGroup);
    assetKey = key;
    assetGroup = buildAsset(key);
    scene.add(assetGroup);
    ctx.clickable(assetGroup, () => ctx.info("asset"));
    ctx.tools.querySelectorAll("[data-a]").forEach((b) => b.classList.toggle("accent", b.dataset.a === key));
    particles.forEach((p) => p.s.material.color.set(ASSETS[key].color));
    // "drop in" animation
    ctx.tween(0.8, (k) => { assetGroup.scale.setScalar(Math.max(0.01, k)); assetGroup.position.y = (1 - k) * 4; });
    ctx.toast(`${ASSETS[key].icon} ${ASSETS[key].name} donated as waqf, for the sake of Allah`);
    setYear(year);
  }

  /** How many people have benefited after `y` years (simple model, grows as the village grows) */
  function benefited(y) {
    const a = ASSETS[assetKey];
    return Math.round(a.initial + a.perYear * (y + (y * y) / 200));
  }

  function eraText(y) {
    if (y === 0) return "Year 0: the asset is donated. The donor gives up ownership for the sake of Allah.";
    if (y < 30) return "The donor's children use the waqf. The trustee looks after it.";
    if (y < 60) return "The donor has passed away, but the reward continues as sadaqah jariyah.";
    if (y < 120) return "Grandchildren and great-grandchildren benefit. The village keeps growing.";
    if (y < 200) return "Five or more generations later, the asset is still preserved and still giving.";
    return "Centuries later, like al-Qarawiyyin (859 CE), the waqf is still serving people.";
  }

  function setYear(y) {
    year = y;
    $t("#w-slider").value = y;
    $t("#w-year").textContent = "Year " + Math.round(y);
    $t("#w-gen").textContent = "Generation " + (1 + Math.floor(y / 25));
    $t("#w-era").textContent = eraText(Math.round(y));
    if (assetKey) {
      $t("#w-unit").textContent = ASSETS[assetKey].icon + " " + ASSETS[assetKey].unit;
      $t("#w-count").textContent = benefited(y).toLocaleString("en-US");
    }
    // the trustee repairs the asset every 40 years using waqf income
    const rep = Math.floor(y / 40);
    if (assetKey && rep > lastRepair) {
      ctx.tween(1.2, (k) => { sparkle.material.opacity = Math.sin(k * Math.PI) * 0.9; });
      ctx.toast("🔧 Year " + rep * 40 + ": the trustee repairs the " + ASSETS[assetKey].name.toLowerCase() + " using waqf income");
    }
    lastRepair = rep;
    // grass gets a little greener and trees taller as the centuries pass
    trees.forEach((t, i) => t.scale.setScalar(0.8 + Math.min(1.2, y / 150) * (0.6 + (i % 3) * 0.2)));
  }

  function playTo(target, seconds) {
    const from = year;
    lastRepair = Math.floor(from / 40);
    ctx.tween(seconds, (k) => setYear(Math.round(H3.lerp(from, target, k))), null, "year");
  }

  // ---------------- Animation ----------------
  function update(dt, time) {
    // houses pop up when their year arrives
    let visibleHouses = 0;
    houses.forEach((h) => {
      const show = year >= h.appearYear;
      if (show) { h.mesh.visible = true; h.grown = Math.min(1, h.grown + dt * 2); visibleHouses++; }
      else { h.grown = Math.max(0, h.grown - dt * 3); if (h.grown <= 0) h.mesh.visible = false; }
      h.mesh.scale.setScalar(Math.max(0.001, H3.ease(h.grown)));
    });
    const active = houses.filter((h) => h.mesh.visible);
    // villagers walk from their house to the asset and back
    const nPeople = assetKey ? Math.min(people.length, 4 + Math.floor(visibleHouses * 0.6)) : 0;
    people.forEach((p, i) => {
      p.mesh.visible = i < nPeople && active.length > 0;
      if (!p.mesh.visible) return;
      const home = active[p.house % active.length].mesh.position;
      p.t = (p.t + dt * p.speed) % 2;
      const k = p.t < 1 ? p.t : 2 - p.t;                     // 0 → 1 → 0 (there and back)
      const goal = home.clone().multiplyScalar(0.28);          // stop at the edge of the plaza
      p.mesh.position.lerpVectors(home, goal, H3.ease(k));
      p.mesh.position.y = Math.abs(Math.sin(time * 8 + i)) * 0.06;     // little walking bounce
      p.mesh.lookAt(p.t < 1 ? goal.x : home.x, 0, p.t < 1 ? goal.z : home.z);
    });
    // benefit particles flow from the asset to homes
    particles.forEach((p, i) => {
      p.s.visible = !!assetKey && active.length > 0;
      if (!p.s.visible) return;
      const home = active[(p.house + Math.floor(time / 3)) % active.length].mesh.position;
      p.t = (p.t + dt * 0.35) % 1;
      p.s.position.set(home.x * p.t, 1.8 + Math.sin(p.t * Math.PI) * 2.5, home.z * p.t);
      p.s.material.opacity = Math.sin(p.t * Math.PI);
    });
    trustee.rotation.y = Math.sin(time * 0.7) * 0.6;
  }

  // ---------------- Presentation actions ----------------
  const actions = {
    intro() { ctx.flyTo(new THREE.Vector3(0, 14, 20), new THREE.Vector3(0, 0, 0), 1.5); ctx.info("waqf"); },
    showUmar() { ctx.flyTo(new THREE.Vector3(-8, 8, 12), new THREE.Vector3(0, 0, 0), 1.5); ctx.info("waqf"); },
    donateWell() { setYear(0); donate("well"); ctx.flyTo(new THREE.Vector3(4, 6, 9), new THREE.Vector3(0, 1, 0), 1.5); },
    time50() { if (assetKey !== "well") donate("well"); playTo(50, 4); ctx.flyTo(new THREE.Vector3(0, 12, 17), new THREE.Vector3(0, 0, 0), 2); },
    time150() { if (!assetKey) donate("well"); playTo(150, 5); ctx.flyTo(new THREE.Vector3(14, 16, 16), new THREE.Vector3(0, 0, 0), 2); },
    showHadith() { ctx.info("people"); },
    school300() { donate("school"); playTo(300, 6); ctx.flyTo(new THREE.Vector3(-12, 18, 20), new THREE.Vector3(0, 0, 0), 2); ctx.later(() => ctx.info("history"), 400); },
    outro() { ctx.flyTo(new THREE.Vector3(0, 14, 20), new THREE.Vector3(0, 0, 0), 1.5); ctx.info("love"); }
  };

  setYear(0);
  return { update, actions };
};
