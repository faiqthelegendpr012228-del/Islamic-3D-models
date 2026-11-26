/* =====================================================================
   scenes/clock.js  —  TOPIC 4: Cosmic Clock (Sun, Earth, Moon)
   ---------------------------------------------------------------------
   Two modes:
   1. MOON & HIJRI: slider = age of the Moon in days (0 – 29.5).
      The Moon moves around Earth; the Sun's light (a real point light)
      makes the correct phase appear automatically. A 2D picture shows
      the phase "as seen from Earth" with the Hijri day.
   2. PRAYER TIMES: slider = local solar time (0 – 24 h). Earth spins so
      a person standing at your chosen latitude sees the Sun rise and
      set. We calculate the Sun's altitude with real astronomy formulas
      (for the equinox) and work out Fajr, Sunrise, Dhuhr, Asr, Maghrib
      and Isha.
   Sizes and distances are NOT to scale.
   ===================================================================== */

TOPIC_SCENES.clock = function (ctx) {
  const { THREE, scene, camera, controls } = ctx;
  const Y = new THREE.Vector3(0, 1, 0);

  scene.background = new THREE.Color(0x03050c);
  scene.add(H3.stars(1800, 500));
  scene.add(new THREE.AmbientLight(0xffffff, 0.12));
  const sunLight = new THREE.PointLight(0xffffff, 1.8, 0, 0);   // light comes FROM the Sun
  scene.add(sunLight);

  // ---------------- Sun ----------------
  const sun = new THREE.Mesh(new THREE.SphereGeometry(3, 40, 30), new THREE.MeshBasicMaterial({ color: 0xffd36b }));
  scene.add(sun);
  const sunGlow = H3.glow(0xffb040, 16); scene.add(sunGlow);
  ctx.hotspot(sun, "☀️ Sun", "sun", { offset: new THREE.Vector3(0, 4.2, 0) });

  // ---------------- Earth ----------------
  const ORBIT_E = 18;                    // Earth's orbit radius (scene units)
  const earthOrbit = new THREE.Group();  // moves around the Sun
  scene.add(earthOrbit);
  const earthSpin = new THREE.Group();   // spins for day/night
  earthOrbit.add(earthSpin);
  const earth = new THREE.Mesh(new THREE.SphereGeometry(1.4, 48, 36), new THREE.MeshStandardMaterial({ map: H3.earthTexture(), roughness: 0.9 }));
  earthSpin.add(earth);
  ctx.hotspot(earthOrbit, "🌍 Earth", "earth", { offset: new THREE.Vector3(0, 2.1, 0) });

  // the observer: a little person + pin on Earth's surface (used in Prayer mode)
  const observer = new THREE.Group();
  const pin = H3.cyl(0.03, 0.03, 0.5, 0xe8c36a, 0, 0.25, 0, 8);
  const head = H3.sphere(0.1, 0xe8c36a, 0, 0.55, 0, { emissive: 0xe8c36a, emissiveIntensity: 0.6 });
  observer.add(pin, head);
  earthSpin.add(observer);
  let latitude = 21;                     // default ≈ Makkah's latitude (21.4° N)
  function placeObserver() {
    const lat = THREE.MathUtils.degToRad(latitude);
    // longitude 0 on the +x side of the Earth
    const p = new THREE.Vector3(Math.cos(lat), Math.sin(lat), 0).multiplyScalar(1.4);
    observer.position.copy(p);
    observer.quaternion.setFromUnitVectors(Y, p.clone().normalize());
  }
  placeObserver();
  const obsLabel = ctx.hotspot(head, "🧍 You", "prayer", { offset: new THREE.Vector3(0, 0.35, 0), visible: () => mode === "prayer" });

  // ---------------- Moon ----------------
  const MOON_R = 3.6;
  function moonTexture() {
    const c = document.createElement("canvas"); c.width = 256; c.height = 128;
    const g = c.getContext("2d");
    g.fillStyle = "#b9b9b9"; g.fillRect(0, 0, 256, 128);
    let s = 3; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 70; i++) {
      g.fillStyle = `rgba(80,80,80,${0.2 + r() * 0.3})`;
      g.beginPath(); g.arc(r() * 256, r() * 128, 2 + r() * 10, 0, Math.PI * 2); g.fill();
    }
    return new THREE.CanvasTexture(c);
  }
  const moon = new THREE.Mesh(new THREE.SphereGeometry(0.45, 32, 24), new THREE.MeshStandardMaterial({ map: moonTexture(), roughness: 1 }));
  earthOrbit.add(moon);
  ctx.hotspot(moon, "🌙 Moon", "moon", { offset: new THREE.Vector3(0, 0.8, 0), visible: () => mode === "moon" });

  // ---------------- Orbit rings ----------------
  function ring(radius, color) {
    const pts = [];
    for (let i = 0; i <= 128; i++) { const a = (i / 128) * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius)); }
    return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.7 }));
  }
  const earthRing = ring(ORBIT_E, 0x4fa8ff); scene.add(earthRing);
  const moonRing = ring(MOON_R, 0xd0d0d0); earthOrbit.add(moonRing);
  // arrow showing the Sun's own motion through the galaxy (36:38)
  const sunArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, -1), new THREE.Vector3(0, 0, -3.5), 9, 0xffd36b, 1.6, 1);
  scene.add(sunArrow);
  const orbitLabel = ctx.hotspot(new THREE.Vector3(0, 0, -11), "➡️ Sun's path in the galaxy", "orbits", { visible: () => showOrbits });
  ctx.hotspot(new THREE.Vector3(ORBIT_E * 0.7, 0.6, ORBIT_E * 0.7), "◯ Orbits", "orbits", { visible: () => showOrbits });
  let showOrbits = false;
  function setOrbits(on) {
    showOrbits = on;
    earthRing.visible = moonRing.visible = sunArrow.visible = on;
    const b = document.getElementById("c-orb"); if (b) { b.classList.toggle("accent", on); b.textContent = on ? "◯ Orbits: ON (playing)" : "◯ Show each body's orbit"; }
    playing = on;
  }

  // ---------------- State ----------------
  let mode = "moon";
  let moonAge = 3;          // days since new moon (0 – 29.53)
  let earthAngle = 0.6;     // position of Earth around the Sun (radians)
  let hour = 12;            // local solar time in prayer mode
  let asrFactor = 1;        // 1 = majority (Shafi'i, Maliki, Hanbali), 2 = Hanafi
  let playing = false;
  const SYNODIC = 29.53;

  /** Put Earth, Moon and the Earth's spin in the right places */
  function layout() {
    earthOrbit.position.set(Math.cos(earthAngle) * ORBIT_E, 0, -Math.sin(earthAngle) * ORBIT_E);
    const toSun = earthOrbit.position.clone().negate().normalize();
    // Moon age 0 = new moon = Moon between Earth and Sun. It moves anticlockwise (seen from above).
    const theta = (moonAge / SYNODIC) * Math.PI * 2;
    moon.position.copy(toSun.clone().applyAxisAngle(Y, theta).multiplyScalar(MOON_R));
    // Earth spin: at hour 12 the observer (longitude 0, on +x) faces the Sun
    const sunAngle = Math.atan2(-toSun.z, toSun.x);
    earthSpin.rotation.y = sunAngle + ((hour - 12) / 24) * Math.PI * 2;
  }

  // =====================================================================
  // ASTRONOMY: Sun altitude and prayer times (equinox, sun declination 0°)
  // sin(altitude) = cos(latitude) · cos(hourAngle)
  // =====================================================================
  const rad = THREE.MathUtils.degToRad, deg = THREE.MathUtils.radToDeg;
  function sunAltitude(h) { return deg(Math.asin(Math.cos(rad(latitude)) * Math.cos(rad((h - 12) * 15)))); }
  /** Hours from solar noon when the Sun is at altitude `alt` degrees */
  function hoursFromNoon(alt) {
    const c = Math.sin(rad(alt)) / Math.cos(rad(latitude));
    if (c < -1 || c > 1) return null;
    return deg(Math.acos(c)) / 15;
  }
  function prayerTimes() {
    const rise = hoursFromNoon(-0.833);                 // sunrise/sunset (includes refraction)
    const fajr = hoursFromNoon(-18), isha = hoursFromNoon(-17);   // Muslim World League angles
    const asrAlt = deg(Math.atan(1 / (asrFactor + Math.tan(rad(Math.abs(latitude))))));
    const asr = hoursFromNoon(asrAlt);
    return [
      { name: "Fajr", t: 12 - fajr, color: "#6c7bff" },
      { name: "Sunrise", t: 12 - rise, color: "#ffb347", noPrayer: true },
      { name: "Dhuhr", t: 12 + 2 / 60, color: "#ffe066" },     // just after solar noon
      { name: "Asr", t: 12 + asr, color: "#ffa94d" },
      { name: "Maghrib", t: 12 + rise, color: "#ff6b6b" },
      { name: "Isha", t: 12 + isha, color: "#b28cff" }
    ];
  }
  function currentPrayer(h) {
    const p = prayerTimes();
    if (h >= p[5].t || h < p[0].t) return { name: "Isha", text: "Isha time: night, after twilight has gone" };
    if (h < p[1].t) return { name: "Fajr", text: "Fajr time: dawn light before sunrise" };
    if (h < p[2].t) return { name: "—", text: "After sunrise: no obligatory prayer (Duha is optional)" };
    if (h < p[3].t) return { name: "Dhuhr", text: "Dhuhr time: the Sun has passed its highest point" };
    if (h < p[4].t) return { name: "Asr", text: "Asr time: shadows are long" };
    return { name: "Maghrib", text: "Maghrib time: just after sunset" };
  }
  const fmt = (h) => { h = (h + 24) % 24; const m = Math.round(h * 60); return String(Math.floor(m / 60) % 24).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0"); };

  // =====================================================================
  // RIGHT PANEL
  // =====================================================================
  ctx.tools.innerHTML = `
    <h3>🌙 Cosmic Clock</h3>
    <div class="how">${ctx.topic.howTo}</div>
    <div class="seg"><button data-m="moon" class="on">🌙 Moon & Hijri</button><button data-m="prayer">🕌 Prayer Times</button></div>
    <div id="c-moon">
      <div class="tool-section">
        <div style="display:flex;gap:14px;align-items:center">
          <canvas id="c-phase" width="150" height="150" style="width:120px;height:120px;flex:none"></canvas>
          <div><div class="label-sm">As seen from Earth</div><div style="font-size:1.3rem;font-weight:800" id="c-pname"></div><div id="c-hijri" class="big-number" style="font-size:1.6rem"></div><div id="c-lit" class="how"></div></div>
        </div>
        <div class="label-sm" style="margin-top:8px">Moon age: <b id="c-age"></b> days</div>
        <input type="range" id="c-slider" min="0" max="29.5" step="0.1" value="3">
        <div class="tool-row"><button class="btn ghost small" data-d="1.5">Day 1 crescent</button><button class="btn ghost small" data-d="7.4">1st quarter</button><button class="btn ghost small" data-d="14.8">Full</button><button class="btn ghost small" data-d="27">Old date stalk</button></div>
      </div>
    </div>
    <div id="c-prayer" style="display:none">
      <div class="tool-section">
        <canvas id="c-sky" width="720" height="300" style="width:100%;border-radius:12px"></canvas>
        <div class="result-box"><div class="label-sm">Local solar time <b id="c-hour"></b> · Sun altitude <b id="c-alt"></b></div><div style="font-size:1.4rem;font-weight:800" id="c-now"></div></div>
        <div class="label-sm">Hour of the day (Earth spins)</div>
        <input type="range" id="c-hslider" min="0" max="24" step="0.05" value="12">
        <div class="field">Latitude <span><input type="range" id="c-lat" min="0" max="55" value="21" style="width:150px;vertical-align:middle"> <b id="c-latv">21°</b></span></div>
        <div class="field">Asr method <select id="c-asr"><option value="1">Shadow = 1× (majority)</option><option value="2">Shadow = 2× (Hanafi)</option></select></div>
        <div id="c-times" class="how"></div>
      </div>
    </div>
    <div class="tool-section">
      <div class="tool-row"><button class="btn ghost" id="c-orb" style="width:100%">◯ Show each body's orbit</button></div>
      <div class="tool-row"><button class="btn ghost small" id="c-hijri-info">📅 Hijri calendar</button><button class="btn ghost small" id="c-pr-info">🕌 How prayer times work</button></div>
    </div>`;
  const $t = (id) => ctx.tools.querySelector(id);
  ctx.tools.querySelectorAll("[data-m]").forEach((b) => b.onclick = () => setMode(b.dataset.m));
  ctx.tools.querySelectorAll("[data-d]").forEach((b) => b.onclick = () => animateAge(+b.dataset.d));
  $t("#c-slider").oninput = (e) => { moonAge = +e.target.value; refresh(); };
  $t("#c-hslider").oninput = (e) => { hour = +e.target.value; refresh(); };
  $t("#c-lat").oninput = (e) => { latitude = +e.target.value; placeObserver(); refresh(); };
  $t("#c-asr").onchange = (e) => { asrFactor = +e.target.value; refresh(); };
  $t("#c-orb").onclick = () => setOrbits(!showOrbits);
  $t("#c-hijri-info").onclick = () => ctx.info("hijri");
  $t("#c-pr-info").onclick = () => ctx.info("prayer");

  function phaseName(age) {
    if (age < 1) return "New moon (not visible)";
    if (age < 6.4) return "Waxing crescent";
    if (age < 8.4) return "First quarter";
    if (age < 13.8) return "Waxing gibbous";
    if (age < 15.8) return "Full moon";
    if (age < 21.1) return "Waning gibbous";
    if (age < 23.1) return "Last quarter";
    if (age < 25.5) return "Waning crescent";
    return "Thin crescent: 'like the old date stalk'";
  }

  /** Draw the Moon's phase as seen from the Northern Hemisphere */
  function drawPhase() {
    const cv = $t("#c-phase"), g = cv.getContext("2d");
    const cx = 75, cy = 75, r = 62;
    const th = (moonAge / SYNODIC) * Math.PI * 2;
    g.clearRect(0, 0, 150, 150);
    g.fillStyle = "#1d2433"; g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.fill();
    const lit = "#f3eed8", dark = "#1d2433";
    const waxing = th < Math.PI;
    g.fillStyle = lit; g.beginPath(); g.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2, !waxing); g.closePath(); g.fill();
    const ex = Math.abs(Math.cos(th)) * r;
    const frac = (1 - Math.cos(th)) / 2;
    g.fillStyle = frac < 0.5 ? dark : lit;
    g.beginPath(); g.ellipse(cx, cy, Math.max(0.1, ex), r, 0, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#e8c36a"; g.lineWidth = 2; g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.stroke();
    return frac;
  }

  /** Draw the 24-hour sun-altitude curve with the prayer times */
  function drawSky() {
    const cv = $t("#c-sky"), g = cv.getContext("2d"), W = 720, Hh = 300;
    const yOf = (alt) => Hh * 0.55 - (alt / 90) * Hh * 0.48;
    const xOf = (h) => (h / 24) * W;
    const alt = sunAltitude(hour);
    // sky colour depends on the Sun's altitude
    const sky = alt > 6 ? "#2f7fd0" : alt > -0.8 ? "#d97b4a" : alt > -18 ? "#3b2d6b" : "#070b1c";
    g.fillStyle = sky; g.fillRect(0, 0, W, Hh);
    g.fillStyle = "#1e3b26"; g.fillRect(0, yOf(0), W, Hh - yOf(0));              // ground below horizon
    g.strokeStyle = "rgba(255,255,255,0.35)"; g.setLineDash([6, 6]);
    g.beginPath(); g.moveTo(0, yOf(-18)); g.lineTo(W, yOf(-18)); g.stroke(); g.setLineDash([]);
    g.fillStyle = "#fff"; g.font = "bold 18px Segoe UI"; g.fillText("horizon", 8, yOf(0) - 6); g.fillText("−18°", 8, yOf(-18) - 6);
    // sun path
    g.strokeStyle = "#ffe066"; g.lineWidth = 3; g.beginPath();
    for (let h = 0; h <= 24; h += 0.1) { const y = yOf(sunAltitude(h)); h === 0 ? g.moveTo(xOf(h), y) : g.lineTo(xOf(h), y); }
    g.stroke();
    // prayer markers
    prayerTimes().forEach((p, i) => {
      if (isNaN(p.t)) return;
      g.strokeStyle = p.color; g.lineWidth = 2; g.beginPath(); g.moveTo(xOf(p.t), 0); g.lineTo(xOf(p.t), Hh); g.stroke();
      g.fillStyle = p.color; g.font = "bold 19px Segoe UI"; g.save(); g.translate(xOf(p.t) + 4, 8 + (i % 2) * 22); g.fillText(p.name, 0, 14); g.restore();
    });
    // the Sun now
    g.fillStyle = "#fff3b0"; g.beginPath(); g.arc(xOf(hour), yOf(alt), 13, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#ffb347"; g.lineWidth = 3; g.stroke();
  }

  function refresh() {
    layout();
    if (mode === "moon") {
      $t("#c-slider").value = moonAge;
      $t("#c-age").textContent = moonAge.toFixed(1);
      const frac = drawPhase();
      $t("#c-pname").textContent = phaseName(moonAge);
      $t("#c-hijri").textContent = moonAge < 1 ? "Day 29/30" : "Hijri day " + Math.floor(moonAge);
      $t("#c-lit").textContent = Math.round(frac * 100) + "% of the face is lit · a new month starts when the crescent is sighted";
    } else {
      $t("#c-hslider").value = hour;
      $t("#c-hour").textContent = fmt(hour);
      $t("#c-alt").textContent = sunAltitude(hour).toFixed(1) + "°";
      $t("#c-latv").textContent = latitude + "°";
      const cp = currentPrayer(hour);
      $t("#c-now").textContent = cp.text;
      $t("#c-times").innerHTML = prayerTimes().map((p) => `<b style="color:${p.color}">${p.name}</b> ${fmt(p.t)}`).join(" · ") +
        "<br>Local solar time at the equinox. Real clock times depend on your longitude, time zone and season.";
      obsLabel.el.innerHTML = "🧍 " + (cp.name === "—" ? "Morning" : cp.name);
      drawSky();
    }
  }

  function setMode(m) {
    mode = m;
    ctx.tools.querySelectorAll("[data-m]").forEach((b) => b.classList.toggle("on", b.dataset.m === m));
    $t("#c-moon").style.display = m === "moon" ? "" : "none";
    $t("#c-prayer").style.display = m === "prayer" ? "" : "none";
    if (m === "prayer") { setOrbits(false); moonAge = 10; viewPrayer(); }
    else viewSystem();
    refresh();
  }
  function animateAge(target) {
    const from = moonAge;
    ctx.tween(1.5, (k) => { moonAge = H3.lerp(from, target, k); refresh(); }, null, "age");
  }
  function animateHour(target, secs) {
    const from = hour;
    ctx.tween(secs || 2, (k) => { hour = H3.lerp(from, target, k); refresh(); }, null, "hour");
  }

  // ---------------- Camera views ----------------
  function viewSystem() {
    layout();
    const e = earthOrbit.position;
    ctx.flyTo(new THREE.Vector3(e.x * 0.55 + 6, 15, e.z * 0.55 + 16), new THREE.Vector3(e.x * 0.6, 0, e.z * 0.6), 1.5);
  }
  function viewPrayer() {
    layout();
    const e = earthOrbit.position.clone();
    const toSun = e.clone().negate().normalize();
    const side = new THREE.Vector3().crossVectors(Y, toSun).normalize();   // look at the day/night line edge-on
    ctx.flyTo(e.clone().add(side.multiplyScalar(-4.5)).add(new THREE.Vector3(0, 2.4, 0)).add(toSun.clone().multiplyScalar(0.5)), e, 1.5);
  }
  function viewMoonClose() {
    layout();
    const e = earthOrbit.position.clone();
    ctx.flyTo(e.clone().add(new THREE.Vector3(2, 7, 6)), e, 1.5);
  }

  layout();
  camera.position.set(16, 12, 10);
  controls.target.set(8, 0, -6);
  controls.minDistance = 2; controls.maxDistance = 90;
  document.getElementById("scene-note").textContent = "Sizes & distances not to scale · Drag to rotate · Scroll to zoom";
  setMode("moon");
  setOrbits(false);

  // ---------------- Animation ----------------
  function update(dt, time) {
    sun.rotation.y += dt * 0.1;
    sunGlow.material.opacity = 0.85 + Math.sin(time * 2) * 0.1;
    if (playing && mode === "moon") {
      moonAge = (moonAge + dt * 2.5) % SYNODIC;                       // 2.5 days per second
      earthAngle += dt * 2.5 / 365.25 * Math.PI * 2 * 4;               // (sped up 4× more so it is visible)
      refresh();
    } else layout();
  }

  // ---------------- Presentation actions ----------------
  const actions = {
    intro() { setMode("moon"); setOrbits(false); ctx.flyTo(new THREE.Vector3(16, 12, 10), new THREE.Vector3(8, 0, -6), 1.5); },
    showLight() { setMode("moon"); animateAge(7.4); viewMoonClose(); ctx.info("moon"); },
    phaseNew() { setMode("moon"); animateAge(1.5); viewMoonClose(); ctx.info("hijri"); },
    phaseFull() { setMode("moon"); animateAge(14.8); viewMoonClose(); },
    phaseOld() { setMode("moon"); animateAge(27); viewMoonClose(); },
    prayerDhuhr() { setMode("prayer"); hour = 6; refresh(); animateHour(15.7, 4); ctx.info("prayer"); },
    // animates 17:00 → about 05:12 next morning (sunset → Maghrib → Isha → Fajr)
    prayerMaghrib() { setMode("prayer"); hour = 17; refresh(); ctx.tween(6, (k) => { hour = (17 + k * 12.2) % 24; refresh(); }, null, "hour"); },
    orbitsOn() { setMode("moon"); setOrbits(true); ctx.flyTo(new THREE.Vector3(0, 38, 30), new THREE.Vector3(0, 0, 0), 2); ctx.info("orbits"); }
  };

  return { update, actions };
};
