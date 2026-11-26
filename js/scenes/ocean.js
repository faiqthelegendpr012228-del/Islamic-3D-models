/* =====================================================================
   scenes/ocean.js  —  TOPIC 6: Ocean Depth Explorer
   ---------------------------------------------------------------------
   DIVE MODE: a submarine dives from 0 m to about 10,900 m.
     • Each colour of sunlight fades at its own depth (red first, blue last).
     • Surface waves at the top; internal waves on the pycnocline below them.
     • Creatures in each zone, a depth ruler and a depth gauge.
     Depth → height uses a square-root scale so the shallow zones get more
     space on screen (y = −√depth).
   TWO SEAS MODE: an estuary where fresh river water meets salty sea water,
     with the boundary (halocline / salt wedge) and a salinity probe.
   ===================================================================== */

TOPIC_SCENES.ocean = function (ctx) {
  const { THREE, scene, camera, controls } = ctx;
  const yOf = (d) => -Math.sqrt(Math.max(0, d));      // depth (m) → scene height
  const MAX_DEPTH = 10900;

  scene.background = new THREE.Color(0x2aa7c9);
  scene.fog = new THREE.FogExp2(0x2aa7c9, 0.02);
  const hemi = new THREE.HemisphereLight(0xffffff, 0x0a3550, 1.0); scene.add(hemi);
  const sunL = new THREE.DirectionalLight(0xffffff, 0.8); sunL.position.set(5, 30, 10); scene.add(sunL);

  const dive = new THREE.Group(); scene.add(dive);       // everything for the dive
  const seas = new THREE.Group(); seas.position.set(400, 0, 0); seas.visible = false; scene.add(seas);

  // =====================================================================
  // DIVE MODE OBJECTS
  // =====================================================================
  // ---- Surface waves (moving vertices) ----
  const surfGeo = new THREE.PlaneGeometry(160, 160, 70, 70);
  surfGeo.rotateX(-Math.PI / 2);
  const surface = new THREE.Mesh(surfGeo, new THREE.MeshStandardMaterial({ color: 0x1f8fb8, transparent: true, opacity: 0.75, side: THREE.DoubleSide, roughness: 0.2, metalness: 0.1 }));
  dive.add(surface);
  const surfBase = surfGeo.attributes.position.array.slice();

  // ---- Clouds above the sea ("over which are clouds") ----
  for (let i = 0; i < 9; i++) {
    const c = new THREE.Group();
    for (let j = 0; j < 4; j++) c.add(H3.sphere(1.6 + Math.random(), 0xffffff, j * 1.6 - 2.4, Math.random() * 0.6, Math.random() * 1.2, { roughness: 1, emissive: 0x666666 }));
    c.position.set((Math.random() - 0.5) * 70, 14 + Math.random() * 5, -10 - Math.random() * 30);
    dive.add(c);
  }

  // ---- Internal waves on the pycnocline (around 100–150 m) ----
  const PYC = 120;
  const intGeo = new THREE.PlaneGeometry(160, 160, 50, 50);
  intGeo.rotateX(-Math.PI / 2);
  const internal = new THREE.Mesh(intGeo, new THREE.MeshStandardMaterial({ color: 0x0f4e7a, transparent: true, opacity: 0.55, side: THREE.DoubleSide, emissive: 0x08304f }));
  internal.position.y = yOf(PYC);
  dive.add(internal);
  const intLines = new THREE.Mesh(intGeo, new THREE.MeshBasicMaterial({ color: 0x7fd3ff, wireframe: true, transparent: true, opacity: 0.3 }));   // same geometry drawn as a grid
  intLines.position.y = yOf(PYC);
  dive.add(intLines);
  const intBase = intGeo.attributes.position.array.slice();

  // ---- Depth ruler with zone labels ----
  const zones = [
    { key: "sunlight", name: "☀️ Sunlight Zone", from: 0, to: 200 },
    { key: "twilight", name: "🌆 Twilight Zone", from: 200, to: 1000 },
    { key: "midnight", name: "🌑 Midnight Zone", from: 1000, to: 4000 },
    { key: "abyss", name: "⛰️ Abyssal Zone", from: 4000, to: 6000 },
    { key: "hadal", name: "🕳️ Hadal Zone", from: 6000, to: 11000 }
  ];
  const ruler = H3.cyl(0.08, 0.08, -yOf(MAX_DEPTH), 0xe8c36a, -6, yOf(MAX_DEPTH) / 2, -2, 8, { emissive: 0xe8c36a, emissiveIntensity: 0.6 });
  dive.add(ruler);
  [10, 50, 100, 200, 500, 1000, 2000, 4000, 6000, 8000, 10900].forEach((d) => {
    const tick = H3.box(0.8, 0.06, 0.06, 0xe8c36a, -6, yOf(d), -2, { emissive: 0xe8c36a, emissiveIntensity: 0.6 });
    dive.add(tick);
    const lbl = H3.sign(d.toLocaleString("en-US") + " m", 1.6, 0.4, { w: 256, h: 64, font: "bold 40px Segoe UI", bg: null, fg: "#e8c36a", border: null, transparent: true });
    lbl.position.set(-7.4, yOf(d), -2); dive.add(lbl);
  });
  zones.forEach((z) => {
    ctx.hotspot(new THREE.Vector3(-6, yOf(z.from) - 0.6, -2), `${z.name} · ${z.from.toLocaleString("en-US")}–${z.to.toLocaleString("en-US")} m`, z.key, { visible: () => mode === "dive" });
  });
  ctx.hotspot(new THREE.Vector3(6, 0.8, -4), "🌊 Surface waves", "internal", { visible: () => mode === "dive" });
  ctx.hotspot(new THREE.Vector3(6, yOf(PYC) + 0.6, -4), "〰️ Internal waves", "internal", { visible: () => mode === "dive" });

  // ---- The deep sea floor (Challenger Deep) ----
  const floor = new THREE.Mesh(new THREE.CircleGeometry(60, 40), H3.mat(0x2b2b33, { roughness: 1 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = yOf(10935) - 0.5; dive.add(floor);
  for (let i = 0; i < 25; i++) {
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.4 + Math.random() * 1.2), H3.mat(0x3a3a44, { roughness: 1 }));
    rock.position.set((Math.random() - 0.5) * 30, floor.position.y, (Math.random() - 0.5) * 30 - 4); dive.add(rock);
  }

  // ---- Creatures (simple shapes + glowing lights for deep animals) ----
  const creatures = [];
  function fish(color, len, opts) {
    opts = opts || {};
    const g = new THREE.Group();
    const body = H3.sphere(0.5, color, 0, 0, 0, opts.mat); body.scale.set(len, 0.45, 0.35); g.add(body);
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.6, 4), H3.mat(color, opts.mat));
    tail.rotation.z = Math.PI / 2; tail.position.x = -len * 0.55; g.add(tail);
    g.add(H3.sphere(0.06, 0x111111, len * 0.35, 0.08, 0.15, null, 6));
    return g;
  }
  function addCreature(name, depth, x, z, build, zoneKey, motion) {
    const g = build();
    g.position.set(x, yOf(depth), z);
    dive.add(g);
    creatures.push({ g, base: g.position.clone(), motion: motion || "swim", phase: Math.random() * 6 });
    ctx.hotspot(g, name + " · " + depth.toLocaleString("en-US") + " m", zoneKey, { offset: new THREE.Vector3(0, 1.1, 0), visible: () => mode === "dive" });
    return g;
  }
  const glowSprite = (c, s) => H3.glow(c, s);

  addCreature("🐬 Dolphin", 15, 4, -1, () => { const f = fish(0x8a9bb0, 3.2); const fin = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.6, 4), H3.mat(0x8a9bb0)); fin.position.y = 0.35; f.add(fin); return f; }, "sunlight");
  addCreature("🐢 Sea turtle", 45, -3, 1.5, () => {
    const g = new THREE.Group();
    const shell = H3.sphere(0.8, 0x4f7f3a); shell.scale.set(1, 0.4, 0.8); g.add(shell);
    g.add(H3.sphere(0.25, 0x8fb070, 0.9, 0, 0));
    [[0.5, 0.6], [0.5, -0.6], [-0.5, 0.6], [-0.5, -0.6]].forEach((p) => { const fl = H3.box(0.5, 0.06, 0.25, 0x8fb070, p[0], -0.05, p[1]); g.add(fl); });
    return g;
  }, "sunlight");
  // a school of small fish
  addCreature("🐟 Fish school", 30, 2, 3, () => {
    const g = new THREE.Group();
    for (let i = 0; i < 14; i++) { const f = fish(0xffc94a, 0.9); f.scale.setScalar(0.5); f.position.set(Math.random() * 3, Math.random() * 1.5, Math.random() * 1.5); g.add(f); }
    return g;
  }, "sunlight");
  addCreature("✨ Lanternfish", 500, 3, 0, () => {
    const g = fish(0x2a3a4a, 1.4);
    for (let i = 0; i < 4; i++) { const s = glowSprite(0x7fe7ff, 0.35); s.position.set(-0.3 + i * 0.25, -0.15, 0.18); g.add(s); }
    return g;
  }, "twilight");
  addCreature("🎐 Jellyfish", 750, -2.5, 1, () => {
    const g = new THREE.Group();
    const bell = new THREE.Mesh(new THREE.SphereGeometry(0.7, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0xc77dff, transparent: true, opacity: 0.6 }));
    g.add(bell);
    for (let i = 0; i < 8; i++) { const t = H3.cyl(0.02, 0.02, 1.6, 0xe0b3ff, Math.cos(i) * 0.4, -0.8, Math.sin(i) * 0.4, 4, { emissive: 0xc77dff }); g.add(t); }
    g.add(glowSprite(0xd29bff, 2.2));
    return g;
  }, "twilight", "bob");
  addCreature("🎣 Anglerfish", 2000, 3, 0.5, () => {
    const g = new THREE.Group();
    const body = H3.sphere(0.8, 0x1a1a22); g.add(body);
    const jaw = H3.box(0.9, 0.08, 0.9, 0xdddddd, 0.5, -0.25, 0); g.add(jaw);
    const rod = H3.cyl(0.03, 0.03, 0.9, 0x333333, 0.5, 0.9, 0, 4); rod.rotation.z = -0.7; g.add(rod);
    const lure = glowSprite(0x9dffb0, 1.1); lure.position.set(1.0, 1.25, 0); g.add(lure);
    return g;
  }, "midnight");
  addCreature("🐍 Gulper eel", 2800, -3, 0, () => {
    const g = new THREE.Group();
    for (let i = 0; i < 10; i++) g.add(H3.sphere(0.25 - i * 0.015, 0x141418, -i * 0.35, Math.sin(i * 0.7) * 0.2, 0, null, 8));
    const mouth = H3.sphere(0.5, 0x101014, 0.35, 0, 0); mouth.scale.set(1, 0.8, 0.6); g.add(mouth);
    const tip = glowSprite(0xff5fa2, 0.6); tip.position.set(-3.5, 0, 0); g.add(tip);
    return g;
  }, "midnight");
  addCreature("🦿 Tripod fish", 4700, 2.5, 0, () => {
    const g = fish(0x6a6f78, 1.8);
    [-0.6, 0.6].forEach((x) => { const leg = H3.cyl(0.03, 0.03, 1.4, 0x6a6f78, x, -0.8, 0, 4); g.add(leg); });
    return g;
  }, "abyss", "still");
  addCreature("🩷 Snailfish", 8000, -2.5, 0.5, () => fish(0xf3c6d0, 1.6, { mat: { transparent: true, opacity: 0.8, emissive: 0x3a2028 } }), "hadal");

  // ---- Submarine ----
  const sub = new THREE.Group();
  const subBody = H3.cyl(0.9, 0.9, 3.6, 0xffc93c, 0, 0, 0, 24, { metalness: 0.3, roughness: 0.4 }); subBody.rotation.z = Math.PI / 2; sub.add(subBody);
  sub.add(H3.sphere(0.9, 0xffc93c, 1.8, 0, 0, { metalness: 0.3, roughness: 0.4 }));
  sub.add(H3.sphere(0.9, 0xffc93c, -1.8, 0, 0, { metalness: 0.3, roughness: 0.4 }));
  sub.add(H3.box(1.1, 0.8, 0.7, 0xe8a91a, 0.2, 1.0, 0));
  [-0.8, 0, 0.8].forEach((x) => sub.add(H3.sphere(0.22, 0x9fe8ff, x, 0.1, 0.82, { emissive: 0x2a6f8f })));
  const prop = new THREE.Group();
  [0, 1, 2].forEach((i) => { const b = H3.box(0.06, 0.9, 0.2, 0x555555); b.rotation.x = (i * Math.PI * 2) / 3; prop.add(b); });
  prop.position.x = -2.8; sub.add(prop);
  const subLight = new THREE.SpotLight(0xfff2c0, 0, 40, 0.5, 0.5, 1);
  subLight.position.set(2.6, 0, 0); sub.add(subLight);
  const lightTarget = new THREE.Object3D(); lightTarget.position.set(12, -1.5, 0); sub.add(lightTarget); subLight.target = lightTarget;
  const headlamp = H3.glow(0xfff2c0, 1.4); headlamp.position.set(2.7, 0, 0); sub.add(headlamp);
  sub.position.set(0, 0.3, 0);
  dive.add(sub);
  ctx.clickable(sub, () => ctx.info("light"));

  // bubbles behind the sub
  const bubbles = [];
  for (let i = 0; i < 20; i++) { const b = H3.glow(0xdff6ff, 0.25); dive.add(b); bubbles.push({ s: b, t: Math.random() }); }

  // =====================================================================
  // TWO SEAS MODE OBJECTS (an estuary: river meets sea)
  // =====================================================================
  const L = 22, Hgt = 8, D = 8;     // size of the water "tank"
  // glass tank outline
  seas.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(L, Hgt, D)), new THREE.LineBasicMaterial({ color: 0xe8c36a })));
  seas.children[0].position.y = -Hgt / 2;
  const seabed = H3.box(L, 0.3, D, 0xc9b27c, 0, -Hgt - 0.15, 0); seas.add(seabed);
  // the boundary (salt wedge): low on the river side (left), high on the sea side (right)
  const interfaceY = (x) => -Hgt + 0.6 + ((x + L / 2) / L) * (Hgt - 2.2);
  // fresh water region (above the boundary) and salt water region (below), built from a custom shape
  function region(above, color, opacity) {
    const shape = new THREE.Shape();
    if (above) { shape.moveTo(-L / 2, 0); shape.lineTo(L / 2, 0); shape.lineTo(L / 2, interfaceY(L / 2)); shape.lineTo(-L / 2, interfaceY(-L / 2)); }
    else { shape.moveTo(-L / 2, interfaceY(-L / 2)); shape.lineTo(L / 2, interfaceY(L / 2)); shape.lineTo(L / 2, -Hgt); shape.lineTo(-L / 2, -Hgt); }
    const geo = new THREE.ExtrudeGeometry(shape, { depth: D, bevelEnabled: false });
    geo.translate(0, 0, -D / 2);
    return new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color, transparent: true, opacity, depthWrite: false, side: THREE.DoubleSide }));
  }
  const freshMesh = region(true, 0x5fd4a8, 0.35); seas.add(freshMesh);
  const saltMesh = region(false, 0x1f4fa8, 0.5); seas.add(saltMesh);
  // the shimmering barrier sheet
  const barGeo = new THREE.PlaneGeometry(Math.hypot(L, Hgt - 2.2), D, 40, 10);
  const barrier = new THREE.Mesh(barGeo, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false }));
  barrier.rotation.x = -Math.PI / 2;
  const bar = new THREE.Group(); bar.add(barrier);
  bar.position.set(0, interfaceY(0), 0);
  bar.rotation.z = Math.atan2(Hgt - 2.2, L);
  seas.add(bar);
  const barBase = barGeo.attributes.position.array.slice();
  // particles: fresh (green) above, salty (blue) below; they bounce off the barrier
  const parts = [];
  for (let i = 0; i < 160; i++) {
    const fresh = i % 2 === 0;
    const s = H3.glow(fresh ? 0x9dffd0 : 0x6fa8ff, 0.35);
    let x, y;
    do { x = (Math.random() - 0.5) * (L - 1); y = -Math.random() * (Hgt - 0.4) - 0.2; } while (fresh ? y < interfaceY(x) + 0.3 : y > interfaceY(x) - 0.3);
    s.position.set(x, y, (Math.random() - 0.5) * (D - 1));
    seas.add(s);
    parts.push({ s, fresh, v: new THREE.Vector3((fresh ? 1 : -1) * (0.4 + Math.random() * 0.5), (Math.random() - 0.5) * 0.3, (Math.random() - 0.5) * 0.3) });
  }
  // labels
  const riverSign = H3.sign("🏞️ RIVER (fresh)", 5, 1, { w: 512, h: 100, font: "bold 52px Segoe UI", bg: "#0f2236", fg: "#9dffd0" }); riverSign.position.set(-L / 2 + 3, 1.4, 0); seas.add(riverSign);
  const seaSign = H3.sign("🌊 SEA (salty)", 5, 1, { w: 512, h: 100, font: "bold 52px Segoe UI", bg: "#0f2236", fg: "#8cc6ff" }); seaSign.position.set(L / 2 - 3, 1.4, 0); seas.add(seaSign);
  const seasVis = () => mode === "seas";
  ctx.hotspot(new THREE.Vector3(400 - 6, -1.2, D / 2), "Fresh & sweet water", "barrier", { visible: seasVis });
  ctx.hotspot(new THREE.Vector3(400 + 6, -6.5, D / 2), "Salty & bitter water", "barrier", { visible: seasVis });
  ctx.hotspot(new THREE.Vector3(400 + 0, interfaceY(0), D / 2), "🚧 Barrier (halocline)", "barrier", { visible: seasVis });
  // salinity probe
  const probe = new THREE.Group();
  probe.add(H3.cyl(0.05, 0.05, 9, 0xdddddd, 0, 4.5, 0, 6));
  const probeTip = H3.sphere(0.25, 0xff6b6b, 0, 0, 0, { emissive: 0xff3030, emissiveIntensity: 0.6 }); probe.add(probeTip);
  probe.position.set(2, -1, D / 2 - 1); seas.add(probe);

  // =====================================================================
  // LIGHT & COLOUR MODEL
  // Each colour fades exponentially: I = e^(−depth / L). The L values
  // (metres) are chosen so red is ~gone by 10 m, orange ~30 m,
  // yellow ~50 m, green ~100 m, and blue lasts the longest.
  // =====================================================================
  const BANDS = [
    { name: "Red", css: "#ff6b6b", rgb: [1.0, 0.15, 0.1], L: 3.2 },
    { name: "Orange", css: "#ffa94d", rgb: [1.0, 0.55, 0.1], L: 8 },
    { name: "Yellow", css: "#ffe066", rgb: [1.0, 0.95, 0.3], L: 14 },
    { name: "Green", css: "#69db7c", rgb: [0.2, 0.85, 0.4], L: 28 },
    { name: "Blue", css: "#74c0fc", rgb: [0.1, 0.45, 1.0], L: 110 }
  ];
  const bandI = (b, d) => Math.exp(-d / b.L);
  function waterColor(d) {
    let r = 0, g = 0, b = 0;
    BANDS.forEach((band) => { const k = bandI(band, d); r += band.rgb[0] * k; g += band.rgb[1] * k; b += band.rgb[2] * k; });
    // water itself adds a blue-green tint; overall brightness falls with depth
    const s = 0.28;
    return new THREE.Color(Math.min(1, r * s * 0.6), Math.min(1, g * s * 0.9 + 0.02), Math.min(1, b * s + 0.03));
  }
  const lightPct = (d) => Math.round(100 * BANDS.reduce((a, b) => a + bandI(b, d), 0) / BANDS.length);
  const zoneOf = (d) => zones.find((z) => d < z.to) || zones[zones.length - 1];

  // =====================================================================
  // RIGHT PANEL
  // =====================================================================
  ctx.tools.innerHTML = `
    <h3>🌊 Ocean Depth Explorer</h3>
    <div class="how">${ctx.topic.howTo}</div>
    <div class="seg"><button data-mode="dive" class="on">🚢 Dive</button><button data-mode="seas">🏞️ Two Seas</button></div>
    <div id="o-dive">
      <div class="result-box">
        <div class="label-sm">Depth gauge</div>
        <div class="big-number" id="o-depth">0 m</div>
        <div id="o-zone" style="font-weight:800"></div>
        <div class="how" id="o-stats"></div>
      </div>
      <div class="label-sm">Dive depth</div>
      <input type="range" id="o-slider" min="0" max="1000" value="0">
      <div class="tool-row">
        <button class="btn ghost small" data-d="0">Surface</button><button class="btn ghost small" data-d="60">60 m</button><button class="btn ghost small" data-d="500">500 m</button>
        <button class="btn ghost small" data-d="2000">2,000 m</button><button class="btn ghost small" data-d="10900">10,900 m</button>
      </div>
      <div class="tool-section">
        <div class="label-sm">Sunlight colours remaining</div>
        <div id="o-spec" style="display:flex;gap:6px;margin:8px 0"></div>
        <div class="tool-row"><button class="btn ghost small" id="o-light">🔬 How light fades</button><button class="btn ghost small" id="o-lamp">💡 Sub lights: AUTO</button></div>
      </div>
    </div>
    <div id="o-seas" style="display:none">
      <div class="how">An estuary: lighter fresh river water flows over denser salty sea water. Between them is a sharp boundary called a <b>halocline</b>.</div>
      <div class="label-sm">Lower the salinity probe</div>
      <input type="range" id="o-probe" min="0" max="100" value="10">
      <div class="result-box"><div class="label-sm">Salinity (parts per thousand)</div><div class="big-number" id="o-sal">0.5</div><div id="o-saltxt"></div></div>
      <div class="tool-row"><button class="btn ghost small" id="o-bar">🚧 About the barrier</button></div>
    </div>`;
  const $t = (id) => ctx.tools.querySelector(id);
  $t("#o-spec").innerHTML = BANDS.map((b, i) => `<div style="flex:1;text-align:center"><div id="o-b${i}" style="height:34px;border-radius:8px;background:${b.css}"></div><small>${b.name}</small></div>`).join("");
  ctx.tools.querySelectorAll("[data-mode]").forEach((b) => b.onclick = () => setMode(b.dataset.mode));
  ctx.tools.querySelectorAll("[data-d]").forEach((b) => b.onclick = () => goDepth(+b.dataset.d, 3));
  $t("#o-slider").oninput = (e) => setDepth(MAX_DEPTH * Math.pow(+e.target.value / 1000, 2));
  $t("#o-light").onclick = () => ctx.info("light");
  let lampMode = "auto";
  $t("#o-lamp").onclick = (e) => { lampMode = lampMode === "auto" ? "on" : lampMode === "on" ? "off" : "auto"; e.target.textContent = "💡 Sub lights: " + lampMode.toUpperCase(); setDepth(depth); };
  $t("#o-probe").oninput = (e) => setProbe(+e.target.value);
  $t("#o-bar").onclick = () => ctx.info("barrier");

  // ---------------- Depth control ----------------
  let depth = 0, mode = "dive";
  const prevSub = new THREE.Vector3();
  function setDepth(d) {
    depth = H3.clamp(d, 0, MAX_DEPTH);
    sub.position.y = depth < 1 ? 0.3 : yOf(depth);
    $t("#o-slider").value = Math.round(Math.sqrt(depth / MAX_DEPTH) * 1000);
    if (mode !== "dive") return;             // Two Seas mode has its own lighting
    // colours of the water and the light
    const col = waterColor(depth);
    scene.background.copy(col);
    scene.fog.color.copy(col);
    scene.fog.density = depth < 200 ? 0.02 + depth * 0.0001 : 0.04;
    const pct = lightPct(depth) / 100;
    hemi.intensity = 0.15 + pct * 0.9;
    sunL.intensity = pct * 0.8;
    hemi.color.copy(col).lerp(new THREE.Color(0xffffff), pct * 0.5);
    const lamps = lampMode === "on" || (lampMode === "auto" && pct < 0.12);
    subLight.intensity = lamps ? 2.2 : 0;
    headlamp.visible = lamps;
    // gauge
    const z = zoneOf(depth);
    $t("#o-depth").textContent = Math.round(depth).toLocaleString("en-US") + " m";
    $t("#o-zone").textContent = z.name;
    const temp = depth < 200 ? 25 - depth * 0.05 : depth < 1000 ? 15 - (depth - 200) * 0.0125 : depth < 4000 ? 5 - (depth - 1000) * 0.001 : 2;
    $t("#o-stats").innerHTML = `Pressure ≈ <b>${(1 + depth / 10).toFixed(0)}×</b> surface · Water ≈ <b>${temp.toFixed(0)} °C</b> · Sunlight <b>${depth >= 1000 ? "none" : Math.max(0, Math.round(lightPct(depth))) + "%"}</b>${depth >= 1000 ? "<br>🌑 Total darkness: 'he can hardly see his hand' (24:40)" : ""}`;
    BANDS.forEach((b, i) => { $t("#o-b" + i).style.opacity = Math.max(0.06, bandI(b, depth)); });
  }
  function goDepth(d, secs) {
    const from = depth;
    // ease on the square-root scale so the motion looks even
    ctx.tween(secs || 3, (k) => setDepth(Math.pow(H3.lerp(Math.sqrt(from), Math.sqrt(d), k), 2)), null, "depth");
  }

  // ---------------- Two Seas probe ----------------
  function setProbe(v) {
    const y = -0.3 - (v / 100) * (Hgt - 0.8);
    probe.position.y = y;
    const iy = interfaceY(probe.position.x);
    // salinity changes sharply across a thin boundary layer (smooth step)
    const k = 1 / (1 + Math.exp((y - iy) * 4));
    const sal = 0.5 + k * 34.5;
    $t("#o-sal").textContent = sal.toFixed(1);
    $t("#o-saltxt").innerHTML = sal < 3 ? "💧 Fresh river water (sweet)" : sal > 32 ? "🧂 Salty sea water (bitter)" : "🚧 Inside the boundary layer: salinity changes very quickly";
    probeTip.material.color.set(sal < 3 ? 0x5fd4a8 : sal > 32 ? 0x3f7fff : 0xffffff);
  }

  function setMode(m) {
    const changed = mode !== m;
    mode = m;
    ctx.tools.querySelectorAll("[data-mode]").forEach((b) => b.classList.toggle("on", b.dataset.mode === m));
    $t("#o-dive").style.display = m === "dive" ? "" : "none";
    $t("#o-seas").style.display = m === "seas" ? "" : "none";
    dive.visible = m === "dive"; seas.visible = m === "seas";
    if (m === "seas") {
      ctx.tween(0.01, () => {}, null, "depth");     // stop any dive in progress
      scene.background.set(0x8fd0ea); scene.fog.color.set(0x8fd0ea); scene.fog.density = 0.004;
      hemi.intensity = 1.0; sunL.intensity = 0.8; hemi.color.set(0xffffff);
      ctx.flyTo(new THREE.Vector3(400 + 4, 4, 22), new THREE.Vector3(400, -4, 0), 1.5);
      setProbe(+$t("#o-probe").value);
    } else {
      setDepth(depth);
      if (changed) ctx.flyTo(new THREE.Vector3(sub.position.x + 3, sub.position.y + 3, 13), sub.position.clone(), 1.2);
    }
  }

  // ---------------- Camera ----------------
  camera.position.set(4, 5, 15);
  controls.target.set(0, 0, 0);
  controls.minDistance = 4; controls.maxDistance = 60;
  document.getElementById("scene-note").textContent = "Depth uses a square-root scale so shallow zones fit · Drag to look around";
  setDepth(0);
  prevSub.copy(sub.position);

  // ---------------- Animation ----------------
  function update(dt, time) {
    // camera follows the submarine (keeps your own rotation)
    if (mode === "dive") {
      const delta = sub.position.clone().sub(prevSub);
      camera.position.add(delta); controls.target.add(delta);
    }
    prevSub.copy(sub.position);

    if (dive.visible) {
      // surface waves: several sine waves added together
      const p = surfGeo.attributes.position.array;
      for (let i = 0; i < p.length; i += 3) {
        const x = surfBase[i], z = surfBase[i + 2];
        p[i + 1] = Math.sin(x * 0.35 + time * 1.6) * 0.35 + Math.sin(z * 0.5 + time * 1.2) * 0.25 + Math.sin((x + z) * 0.9 + time * 2.4) * 0.1;
      }
      surfGeo.attributes.position.needsUpdate = true;
      surfGeo.computeVertexNormals();
      // internal waves: much bigger and much slower
      const q = intGeo.attributes.position.array;
      for (let i = 0; i < q.length; i += 3) {
        const x = intBase[i], z = intBase[i + 2];
        q[i + 1] = Math.sin(x * 0.08 + time * 0.35) * 1.6 + Math.sin(z * 0.12 + time * 0.25) * 0.6;
      }
      intGeo.attributes.position.needsUpdate = true;
      // creatures
      creatures.forEach((c) => {
        const t = time + c.phase;
        if (c.motion === "swim") { c.g.position.x = c.base.x + Math.sin(t * 0.5) * 1.5; c.g.position.y = c.base.y + Math.sin(t * 1.3) * 0.2; c.g.rotation.y = Math.cos(t * 0.5) > 0 ? 0 : Math.PI; }
        else if (c.motion === "bob") { c.g.position.y = c.base.y + Math.sin(t * 1.5) * 0.4; c.g.scale.y = 1 + Math.sin(t * 3) * 0.08; }
      });
      // submarine
      prop.rotation.x += dt * 10;
      sub.rotation.z = Math.sin(time * 0.8) * 0.03;
      bubbles.forEach((b) => {
        b.t = (b.t + dt * 0.6) % 1;
        b.s.position.set(sub.position.x - 3 - b.t * 1.5, sub.position.y + b.t * 2.5, sub.position.z + Math.sin(b.t * 9) * 0.3);
        b.s.material.opacity = 1 - b.t;
      });
    }

    if (seas.visible) {
      // barrier shimmer
      const p = barGeo.attributes.position.array;
      for (let i = 0; i < p.length; i += 3) p[i + 2] = Math.sin(barBase[i] * 0.8 + time * 2) * 0.12 + Math.sin(barBase[i + 1] * 1.5 + time * 1.3) * 0.08;
      barGeo.attributes.position.needsUpdate = true;
      barrier.material.opacity = 0.3 + Math.sin(time * 2) * 0.08;
      // particles drift; when they reach the barrier they turn back, so each water keeps its own side
      parts.forEach((pt) => {
        const s = pt.s.position;
        s.addScaledVector(pt.v, dt);
        const iy = interfaceY(s.x);
        if (pt.fresh && s.y < iy + 0.25) { pt.v.y = Math.abs(pt.v.y) + 0.1; s.y = iy + 0.25; }
        if (!pt.fresh && s.y > iy - 0.25) { pt.v.y = -Math.abs(pt.v.y) - 0.1; s.y = iy - 0.25; }
        if (s.y > -0.2) pt.v.y = -Math.abs(pt.v.y);
        if (s.y < -Hgt + 0.2) pt.v.y = Math.abs(pt.v.y);
        if (s.x > L / 2 - 0.3) { pt.v.x = -Math.abs(pt.v.x); }
        if (s.x < -L / 2 + 0.3) { pt.v.x = Math.abs(pt.v.x); }
        if (Math.abs(s.z) > D / 2 - 0.3) pt.v.z *= -1;
      });
    }
  }

  // ---------------- Presentation actions ----------------
  /** Dive to depth d AND move the camera so it ends up next to the submarine */
  function diveTo(d, secs) {
    goDepth(d, secs);
    const y = d < 1 ? 0.3 : yOf(d);
    ctx.flyTo(new THREE.Vector3(4, y + 2.5, 13), new THREE.Vector3(0, y, 0), secs);
  }
  const actions = {
    intro() { setMode("dive"); goDepth(0, 2); ctx.flyTo(new THREE.Vector3(4, 6, 18), new THREE.Vector3(0, 1, 0), 2); },
    depthInternal() {
      setMode("dive"); goDepth(90, 3);
      ctx.flyTo(new THREE.Vector3(9, yOf(55), 17), new THREE.Vector3(0, yOf(95), 0), 3); ctx.info("internal");
    },
    depth60() { setMode("dive"); diveTo(60, 3); ctx.info("light"); },
    depth500() { setMode("dive"); diveTo(500, 3.5); ctx.info("twilight"); },
    depth2000() { setMode("dive"); diveTo(2000, 3.5); ctx.info("midnight"); },
    depthMax() { setMode("dive"); diveTo(10900, 4); ctx.info("hadal"); },
    twoSeas() { setMode("seas"); $t("#o-probe").value = 10; setProbe(10); ctx.info("barrier");
      ctx.tween(5, (k) => { const v = 10 + k * 80; $t("#o-probe").value = v; setProbe(v); }, null, "probe"); },
    outro() { setMode("dive"); diveTo(0, 4); }
  };

  return { update, actions };
};
