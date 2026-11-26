/* =====================================================================
   helpers3d.js  —  Small reusable 3D building blocks
   ---------------------------------------------------------------------
   Every scene file uses these helpers so the scene code stays short.
   window.TOPIC_SCENES is where each scene file "registers" itself.
   ===================================================================== */

window.TOPIC_SCENES = {};

window.H3 = {

  /** A standard shiny-ish material. */
  mat(color, opts) {
    return new THREE.MeshStandardMaterial(Object.assign({ color: color, roughness: 0.6, metalness: 0.1 }, opts || {}));
  },

  /** Create a box mesh, positioned at (x,y,z). */
  box(w, h, d, color, x, y, z, opts) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), H3.mat(color, opts));
    m.position.set(x || 0, y || 0, z || 0);
    m.castShadow = false; m.receiveShadow = false;
    return m;
  },

  /** Create a cylinder mesh. */
  cyl(rTop, rBot, h, color, x, y, z, seg, opts) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, h, seg || 20), H3.mat(color, opts));
    m.position.set(x || 0, y || 0, z || 0);
    return m;
  },

  /** Create a sphere mesh. */
  sphere(r, color, x, y, z, opts, seg) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, seg || 20, seg ? seg * 0.75 : 14), H3.mat(color, opts));
    m.position.set(x || 0, y || 0, z || 0);
    return m;
  },

  /** Draw text onto a canvas and return it as a texture (used for signs and screens). */
  textTexture(lines, opts) {
    opts = Object.assign({ w: 512, h: 256, bg: "#0f2236", fg: "#f6f2e7", font: "bold 64px Segoe UI, Arial", border: "#e8c36a" }, opts || {});
    const c = document.createElement("canvas");
    c.width = opts.w; c.height = opts.h;
    const g = c.getContext("2d");
    if (opts.bg) { g.fillStyle = opts.bg; g.fillRect(0, 0, c.width, c.height); }
    if (opts.border) { g.strokeStyle = opts.border; g.lineWidth = 10; g.strokeRect(5, 5, c.width - 10, c.height - 10); }
    g.fillStyle = opts.fg; g.font = opts.font; g.textAlign = "center"; g.textBaseline = "middle";
    if (!Array.isArray(lines)) lines = [lines];
    const lh = c.height / (lines.length + 1);
    lines.forEach((t, i) => g.fillText(t, c.width / 2, lh * (i + 1)));
    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 4;
    return tex;
  },

  /** A flat sign (plane) showing text. */
  sign(text, w, h, opts) {
    const tex = H3.textTexture(text, opts);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: !!(opts && opts.transparent) }));
    return m;
  },

  /** Soft round dot texture, used for particles, glows and stars. */
  dotTexture(color) {
    const c = document.createElement("canvas"); c.width = c.height = 64;
    const g = c.getContext("2d");
    const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, color || "rgba(255,255,255,1)");
    grd.addColorStop(0.4, color || "rgba(255,255,255,0.6)");
    grd.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  },

  /** A glowing sprite (always faces the camera). */
  glow(color, size) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: H3.dotTexture(), color: color, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    s.scale.set(size, size, size);
    return s;
  },

  /** Background starfield made of points. */
  stars(count, radius) {
    const g = new THREE.BufferGeometry();
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const v = new THREE.Vector3().randomDirection ? new THREE.Vector3().randomDirection() : H3.randDir();
      v.multiplyScalar(radius * (0.8 + Math.random() * 0.2));
      p[i * 3] = v.x; p[i * 3 + 1] = v.y; p[i * 3 + 2] = v.z;
    }
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    return new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffffff, size: radius / 300, sizeAttenuation: true, transparent: true, opacity: 0.8 }));
  },

  /** Random unit vector (fallback for older Three.js). */
  randDir() {
    const u = Math.random() * 2 - 1, t = Math.random() * Math.PI * 2, s = Math.sqrt(1 - u * u);
    return new THREE.Vector3(s * Math.cos(t), u, s * Math.sin(t));
  },

  /** A simple person: body (cylinder) + head (sphere). */
  person(color) {
    const g = new THREE.Group();
    g.add(H3.cyl(0.12, 0.16, 0.45, color, 0, 0.23, 0, 10));
    g.add(H3.sphere(0.11, 0xf1c9a5, 0, 0.56, 0, null, 10));
    return g;
  },

  /** A simple house: box + pyramid roof. */
  house(wallColor, roofColor, s) {
    s = s || 1;
    const g = new THREE.Group();
    g.add(H3.box(1 * s, 0.8 * s, 1 * s, wallColor, 0, 0.4 * s, 0));
    const roof = new THREE.Mesh(new THREE.ConeGeometry(0.85 * s, 0.6 * s, 4), H3.mat(roofColor));
    roof.position.y = 1.1 * s; roof.rotation.y = Math.PI / 4;
    g.add(roof);
    g.add(H3.box(0.25 * s, 0.4 * s, 0.02, 0x5a3b22, 0, 0.2 * s, 0.51 * s));
    return g;
  },

  /** A simple tree: trunk + leafy sphere. */
  tree(leafColor, s) {
    s = s || 1;
    const g = new THREE.Group();
    g.add(H3.cyl(0.07 * s, 0.1 * s, 0.6 * s, 0x6b4a2b, 0, 0.3 * s, 0, 8));
    g.add(H3.sphere(0.38 * s, leafColor || 0x3f9d4a, 0, 0.85 * s, 0, null, 10));
    return g;
  },

  /** Paints oceans, continents and polar ice onto a canvas.
      Continents come from adding together several 3D "waves" on the
      sphere, so the texture has no visible seam. */
  earthTexture() {
    const W = 512, Hh = 256;
    const c = document.createElement("canvas"); c.width = W; c.height = Hh;
    const g = c.getContext("2d");
    const img = g.createImageData(W, Hh);
    const waves = [];
    let seed = 7;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 9; i++) waves.push({ d: new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize(), f: 1.5 + rnd() * 3.5, p: rnd() * 6.28, a: 1 / (1 + i * 0.35) });
    const v = new THREE.Vector3();
    for (let y = 0; y < Hh; y++) {
      const lat = (0.5 - y / Hh) * Math.PI;
      for (let x = 0; x < W; x++) {
        const lon = (x / W) * Math.PI * 2;
        v.set(Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon));
        let n = 0;
        waves.forEach((w) => { n += Math.sin(v.dot(w.d) * w.f * 3 + w.p) * w.a; });
        const i4 = (y * W + x) * 4;
        let r, gg, b;
        if (Math.abs(lat) > 1.25) { r = 235; gg = 242; b = 250; }                 // polar ice
        else if (n > 0.9) {                                                         // land
          const dry = Math.min(1, (n - 0.9) * 0.8 + Math.abs(lat) * 0.1);
          r = 60 + dry * 120; gg = 130 + dry * 30; b = 60 + dry * 20;
        } else {                                                                    // ocean (deeper = darker)
          r = 20; gg = 70 + n * 15; b = 150 + n * 25;
        }
        img.data[i4] = r; img.data[i4 + 1] = gg; img.data[i4 + 2] = b; img.data[i4 + 3] = 255;
      }
    }
    g.putImageData(img, 0, 0);
    return new THREE.CanvasTexture(c);
  },

  /** Easing for smooth animations (slow-fast-slow). */
  ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; },

  /** Clamp a number between min and max. */
  clamp(v, a, b) { return Math.max(a, Math.min(b, v)); },

  /** Linear interpolation. */
  lerp(a, b, t) { return a + (b - a) * t; }
};
