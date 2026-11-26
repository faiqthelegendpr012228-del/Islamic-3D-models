/* =====================================================================
   scenes/sky.js  —  TOPIC 2: Sky Shield (Earth's atmosphere)
   ---------------------------------------------------------------------
   3D objects: a rotating Earth, five transparent atmosphere shells with
   a cut-away wedge (so you can see inside), the ozone band, meteors and
   UV rays coming from the Sun.
   NOTE: the layers are drawn MUCH thicker than real life (not to scale)
   so that they can be seen and clicked.
   ===================================================================== */

TOPIC_SCENES.sky = function (ctx) {
  const { THREE, scene, camera, controls } = ctx;

  scene.background = new THREE.Color(0x02060d);
  scene.add(H3.stars(1500, 400));
  scene.add(new THREE.AmbientLight(0x6f86a8, 0.45));
  const sunDir = new THREE.Vector3(-0.8, 0.25, 0.55).normalize();
  const sunLight = new THREE.DirectionalLight(0xffffff, 1.3);
  sunLight.position.copy(sunDir).multiplyScalar(50);
  scene.add(sunLight);

  // The Sun (a glowing sprite far away in the sun direction)
  const sunPos = sunDir.clone().multiplyScalar(40);
  const sunGlow = H3.glow(0xffd36b, 14); sunGlow.position.copy(sunPos); scene.add(sunGlow);
  const sunCore = H3.sphere(2.2, 0xfff1b0, sunPos.x, sunPos.y, sunPos.z, { emissive: 0xffc94a, emissiveIntensity: 1 }); scene.add(sunCore);
  ctx.hotspot(sunPos.clone().add(new THREE.Vector3(0, 3.5, 0)), "☀️ UV rays", "uv");

  // ---------------- Earth with a procedural texture ----------------
  const R = 3;   // Earth radius in scene units

  const earth = new THREE.Mesh(new THREE.SphereGeometry(R, 64, 48), new THREE.MeshStandardMaterial({ map: H3.earthTexture(), roughness: 0.85 }));
  scene.add(earth);
  ctx.clickable(earth, () => ctx.info("troposphere"));

  // ---------------- Atmosphere layers (cut-away shells) ----------------
  // Real heights are in content.js; these radii are exaggerated for visibility.
  const layerDefs = [
    { key: "troposphere", name: "Troposphere", r0: R, r1: 3.3, color: 0x7fd3ff, elev: -38 },
    { key: "stratosphere", name: "Stratosphere", r0: 3.3, r1: 3.7, color: 0x5aa9ff, elev: -16 },
    { key: "mesosphere", name: "Mesosphere", r0: 3.7, r1: 4.1, color: 0x7b6cff, elev: 6 },
    { key: "thermosphere", name: "Thermosphere", r0: 4.1, r1: 4.6, color: 0xff9f5a, elev: 26 },
    { key: "exosphere", name: "Exosphere", r0: 4.6, r1: 5.3, color: 0x9aa4b8, elev: 46 }
  ];
  const PHI_START = Math.PI, PHI_LEN = Math.PI * 1.5;     // leaves a 90° wedge open toward the camera
  const layers = {};
  layerDefs.forEach((L, i) => {
    const g = new THREE.Group();
    // outer shell
    const shellMat = new THREE.MeshStandardMaterial({ color: L.color, transparent: true, opacity: 0.07, side: THREE.DoubleSide, depthWrite: false, emissive: L.color, emissiveIntensity: 0.25 });
    const shell = new THREE.Mesh(new THREE.SphereGeometry(L.r1, 48, 32, PHI_START, PHI_LEN), shellMat);
    g.add(shell);
    // the two flat cut faces (half-rings) show the layer as a coloured band
    const faceMat = new THREE.MeshStandardMaterial({ color: L.color, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false, emissive: L.color, emissiveIntensity: 0.35 });
    [Math.PI * 0.5, Math.PI].forEach((phi) => {
      const face = new THREE.Mesh(new THREE.RingGeometry(L.r0, L.r1, 48, 1, -Math.PI / 2, Math.PI), faceMat);
      face.rotation.y = phi + Math.PI;
      g.add(face);
      ctx.clickable(face, () => selectLayer(L.key));
    });
    scene.add(g);
    layers[L.key] = { group: g, shellMat, faceMat, def: L };
    // label on the cut face at phi = 90° (which faces +z)
    const e = THREE.MathUtils.degToRad(L.elev), rm = (L.r0 + L.r1) / 2;
    ctx.hotspot(new THREE.Vector3(0, rm * Math.sin(e), rm * Math.cos(e)), `${i + 1}. ${L.name}`, () => selectLayer(L.key), { hideBehind: new THREE.Vector3(0, 0, 0) });
  });

  // Ozone band: a thin bright shell inside the stratosphere
  const ozoneR = 3.48;
  const ozone = new THREE.Mesh(new THREE.SphereGeometry(ozoneR, 48, 32, PHI_START, PHI_LEN),
    new THREE.MeshBasicMaterial({ color: 0x9ff7ff, transparent: true, opacity: 0.18, side: THREE.DoubleSide, depthWrite: false }));
  scene.add(ozone);
  ctx.hotspot(new THREE.Vector3(-ozoneR * 0.68, -ozoneR * 0.3, ozoneR * 0.68).normalize().multiplyScalar(ozoneR), "🛡️ Ozone layer", () => { ctx.info("stratosphere"); setUV(true); }, { hideBehind: new THREE.Vector3() });
  ctx.hotspot(new THREE.Vector3(0, 6.2, 0), "📖 Verse & science", "verse");

  // ---------------- UV rays ----------------
  const uvTypes = [
    { name: "UV-A", color: 0xd7b3ff, blocked: false },
    { name: "UV-B", color: 0xb06bff, blocked: true },
    { name: "UV-C", color: 0xff4df0, blocked: true }
  ];
  const rays = [];
  const pulseTex = H3.dotTexture();
  // perpendicular vectors to spread the rays across the sunlit face
  const side1 = new THREE.Vector3().crossVectors(sunDir, new THREE.Vector3(0, 1, 0)).normalize();
  const side2 = new THREE.Vector3().crossVectors(sunDir, side1).normalize();
  for (let i = 0; i < 9; i++) {
    const type = uvTypes[i % 3];
    const off = side1.clone().multiplyScalar(((i % 3) - 1) * 1.4 + (Math.floor(i / 3) - 1) * 0.4).add(side2.clone().multiplyScalar((Math.floor(i / 3) - 1) * 1.3));
    const start = sunDir.clone().multiplyScalar(14).add(off);
    const ray = { type, start, off, pulses: [], line: null, flash: null };
    for (let p = 0; p < 4; p++) {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: pulseTex, color: type.color, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
      s.scale.setScalar(0.45); s.userData.k = p / 4; scene.add(s); ray.pulses.push(s);
    }
    const lg = new THREE.BufferGeometry().setFromPoints([start, start]);
    ray.line = new THREE.Line(lg, new THREE.LineBasicMaterial({ color: type.color, transparent: true, opacity: 0.6 }));
    scene.add(ray.line);
    ray.flash = H3.glow(type.blocked ? 0x9ff7ff : 0xffe066, 0.8); scene.add(ray.flash);
    rays.push(ray);
  }
  let uvOn = false, ozoneOn = true;

  /** Where a ray starting at `start` going toward -sunDir first hits a sphere of radius r */
  function hitSphere(start, r) {
    const d = sunDir.clone().negate();
    const b = start.dot(d), c = start.lengthSq() - r * r;
    const disc = b * b - c;
    if (disc < 0) return null;
    return start.clone().add(d.multiplyScalar(-b - Math.sqrt(disc)));
  }
  function setUV(on) {
    uvOn = on;
    rays.forEach((ray) => {
      const stopR = ray.type.blocked && ozoneOn ? ozoneR : R;
      ray.end = hitSphere(ray.start, stopR) || ray.start;
      ray.line.geometry.setFromPoints([ray.start, ray.end]);
      ray.line.visible = on; ray.flash.visible = on; ray.flash.position.copy(ray.end);
      ray.flash.material.color.set(ray.type.blocked && ozoneOn ? 0x9ff7ff : (ray.type.blocked ? 0xff3030 : 0xffe066));
      ray.pulses.forEach((p) => p.visible = on);
    });
    ozone.material.opacity = ozoneOn ? 0.18 : 0.0;
    refreshPanel();
  }
  function setOzone(on) { ozoneOn = on; setUV(uvOn); ctx.toast(on ? "🛡️ Ozone ON: UV-C and most UV-B are absorbed" : "⚠️ What if there were no ozone? Harmful UV reaches the ground!"); }

  // ---------------- Meteors ----------------
  const meteors = [];
  const sparkTex = H3.dotTexture();
  function launchMeteor() {
    // start beside the Earth (as seen by the camera) so the meteor streaks across the view
    const camDir = camera.position.clone().sub(controls.target).normalize();
    const sideA = new THREE.Vector3().crossVectors(camDir, new THREE.Vector3(0, 1, 0)).normalize();
    const sideB = new THREE.Vector3().crossVectors(camDir, sideA).normalize();
    const ang = Math.random() * Math.PI * 2;
    const start = sideA.multiplyScalar(Math.cos(ang) * 7.5).add(sideB.multiplyScalar(Math.sin(ang) * 7.5)).add(camDir.clone().multiplyScalar(2));
    const target = H3.randDir().multiplyScalar(1.2);
    const vel = target.sub(start).normalize().multiplyScalar(3.2 + Math.random() * 1.2);
    const head = H3.glow(0xffb347, 0.9);
    head.position.copy(start); scene.add(head);
    const trail = [];
    for (let i = 0; i < 14; i++) {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkTex, color: 0xff8a3d, transparent: true, opacity: 0.7 * (1 - i / 14), depthWrite: false, blending: THREE.AdditiveBlending }));
      s.scale.setScalar(0.6 * (1 - i / 16)); s.position.copy(start); scene.add(s); trail.push(s);
    }
    // burn-up height: inside the mesosphere band (3.7–4.1) or just above it
    meteors.push({ head, trail, vel, history: [], burnR: 3.75 + Math.random() * 0.45, burning: 0 });
  }
  function meteorShower(n) { for (let i = 0; i < n; i++) ctx.later(launchMeteor, i * 300); }

  // ---------------- Layer selection & highlight ----------------
  function selectLayer(key, noInfo) {
    const L = layers[key];
    if (!noInfo) ctx.info(key);
    // flash the selected layer brighter for a moment
    ctx.tween(1.8, (k) => {
      const pulse = Math.sin(k * Math.PI);
      L.shellMat.opacity = 0.07 + pulse * 0.35;
      L.faceMat.opacity = 0.55 + pulse * 0.45;
    });
  }

  // ---------------- Camera ----------------
  camera.position.set(8, 4, 11);
  controls.target.set(0, 0, 0);
  controls.minDistance = 5; controls.maxDistance = 40;

  // ---------------- Right panel ----------------
  let spin = true;
  function refreshPanel() {
    const u = document.getElementById("sky-uv"), o = document.getElementById("sky-oz");
    if (u) { u.textContent = uvOn ? "☀️ UV rays: ON" : "☀️ UV rays: OFF"; u.classList.toggle("on", uvOn); }
    if (o) { o.textContent = ozoneOn ? "🛡️ Ozone: ON" : "⚠️ Ozone: OFF"; o.classList.toggle("on", ozoneOn); }
  }
  ctx.tools.innerHTML = `
    <h3>🌍 Sky Shield</h3>
    <div class="how">${ctx.topic.howTo}</div>
    <div class="tool-section">
      <div class="label-sm">☄️ Meteors</div>
      <div class="tool-row"><button class="btn accent" id="sky-m1">Launch meteor</button><button class="btn" id="sky-m10">Meteor shower</button></div>
    </div>
    <div class="tool-section">
      <div class="label-sm">☀️ Ultraviolet (UV) light</div>
      <div class="seg"><button id="sky-uv">☀️ UV rays: OFF</button><button id="sky-oz" class="on">🛡️ Ozone: ON</button></div>
      <div class="how">Turn the ozone OFF to see what would happen without it.</div>
    </div>
    <div class="tool-section">
      <div class="label-sm">Layers (click for facts)</div>
      ${layerDefs.map((L, i) => `<button class="btn ghost small" data-l="${L.key}" style="width:100%;margin:3px 0;justify-content:space-between"><span>${i + 1}. ${L.name}</span><span>${["0–12 km", "12–50 km", "50–85 km", "85–600 km", "600–10,000 km"][i]}</span></button>`).join("")}
    </div>
    <div class="tool-section">
      <div class="tool-row"><button class="btn ghost small" id="sky-verse">📖 Verse vs. science</button><button class="btn ghost small" id="sky-spin">⏸ Stop spin</button></div>
    </div>`;
  const $t = (id) => ctx.tools.querySelector(id);
  $t("#sky-m1").onclick = () => { launchMeteor(); };
  $t("#sky-m10").onclick = () => { meteorShower(12); ctx.toast("☄️ Watch them burn up in the mesosphere!"); };
  $t("#sky-uv").onclick = () => setUV(!uvOn);
  $t("#sky-oz").onclick = () => { if (!uvOn) setUV(true); setOzone(!ozoneOn); };
  $t("#sky-verse").onclick = () => ctx.info("verse");
  $t("#sky-spin").onclick = (e) => { spin = !spin; e.target.textContent = spin ? "⏸ Stop spin" : "▶ Spin Earth"; };
  ctx.tools.querySelectorAll("[data-l]").forEach((b) => b.onclick = () => selectLayer(b.dataset.l));
  setUV(false);
  document.getElementById("scene-note").textContent = "Layers enlarged, not to scale · Drag to rotate · Scroll to zoom";

  // ---------------- Animation ----------------
  function update(dt, time) {
    if (spin) earth.rotation.y += dt * 0.12;
    sunGlow.material.opacity = 0.8 + Math.sin(time * 3) * 0.1;

    // UV pulses travel along each ray
    if (uvOn) rays.forEach((ray) => {
      ray.pulses.forEach((p) => {
        p.userData.k = (p.userData.k + dt * 0.5) % 1;
        p.position.lerpVectors(ray.start, ray.end, p.userData.k);
      });
      ray.flash.scale.setScalar(0.6 + Math.sin(time * 8 + ray.off.x) * 0.25);
    });

    // meteors fly in, then burn up
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      if (!m.burning) {
        m.head.position.addScaledVector(m.vel, dt);
        m.history.unshift(m.head.position.clone());
        if (m.history.length > 28) m.history.pop();
        m.trail.forEach((s, j) => { if (m.history[j * 2]) s.position.copy(m.history[j * 2]); });
        // gets hotter (brighter, whiter) as it enters the air
        const r = m.head.position.length();
        if (r < 5.3) m.head.material.color.setHSL(0.08, 1, H3.clamp(0.5 + (5.3 - r) * 0.25, 0.5, 0.95));
        if (r < m.burnR) m.burning = 0.001;
      } else {
        m.burning += dt;
        const k = m.burning / 0.7;                       // flash then fade over 0.7 s
        m.head.scale.setScalar(0.6 + Math.sin(Math.min(k, 1) * Math.PI) * 1.4);
        m.head.material.opacity = Math.max(0, 1 - k);
        m.trail.forEach((s) => { s.material.opacity *= 0.9; });
        if (k >= 1) {
          scene.remove(m.head); m.trail.forEach((s) => scene.remove(s));
          meteors.splice(i, 1);
        }
      }
    }
  }

  // ---------------- Presentation actions ----------------
  const overview = () => ctx.flyTo(new THREE.Vector3(8, 4, 11), new THREE.Vector3(0, 0, 0), 1.5);
  const actions = {
    intro() { overview(); spin = true; setUV(false); },
    showVerse() { overview(); ctx.info("verse"); },
    layerTroposphere() { ctx.flyTo(new THREE.Vector3(3, -2, 7), new THREE.Vector3(0, -1.5, 2), 1.5); selectLayer("troposphere"); },
    uvDemo() {
      ctx.flyTo(new THREE.Vector3(2, 5, 13), new THREE.Vector3(-2, 0.5, 1), 1.5);
      ozoneOn = true; setUV(true); ctx.info("uv");
      ctx.later(() => { if (uvOn) setOzone(false); }, 3500);
      ctx.later(() => { if (uvOn) setOzone(true); }, 7500);
    },
    meteorShower() { ozoneOn = true; setUV(false); overview(); meteorShower(14); ctx.info("meteor"); },
    layerMesosphere() { ctx.flyTo(new THREE.Vector3(2.5, 2, 8.5), new THREE.Vector3(0, 0.4, 3.5), 1.5); selectLayer("mesosphere"); ctx.later(() => meteorShower(5), 800); },
    layerOuter() { ctx.flyTo(new THREE.Vector3(5, 7, 11), new THREE.Vector3(0, 2, 2), 1.5); selectLayer("thermosphere"); ctx.later(() => selectLayer("exosphere", true), 1900); },
    outro() { overview(); spin = true; ozoneOn = true; setUV(false); meteorShower(6); }
  };

  return { update, actions };
};
