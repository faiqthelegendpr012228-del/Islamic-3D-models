/* =====================================================================
   sw.js  —  "Works with no Wi-Fi"
   ---------------------------------------------------------------------
   The browser runs this in the background. It saves the website's files
   so the site still opens and plays when the internet drops.
     • Pages, code and styles: try the internet first (so updates arrive),
       but fall back to the saved copy after 3 seconds or when offline.
     • Audio, 3D models and libraries: use the saved copy (fast), and
       save anything new the first time it is played.
     • "Save everything" in ⚙ Settings downloads all voices and models.
   After changing the site, run:  python tools/build_offline.py
   ===================================================================== */

// BUILD START (written by tools/build_offline.py, do not edit by hand)
const VERSION = "240fec19df";
const CORE = [
"./",
"index.html",
"manifest.webmanifest",
"revision.html",
"css/ar.css",
"css/dive.css",
"css/glossary.css",
"css/i18n.css",
"css/kiosk.css",
"css/myths.css",
"css/passport.css",
"css/style.css",
"css/tools.css",
"css/video.css",
"css/wallet.css",
"fonts/OpenDyslexic-OFL.txt",
"fonts/opendyslexic-latin-400-normal.woff2",
"fonts/opendyslexic-latin-700-normal.woff2",
"images/apple-touch-icon.png",
"images/ar-qr-atm.png",
"images/ar-qr-clock.png",
"images/ar-qr-market.png",
"images/ar-qr-sky.png",
"images/ar-qr-waqf.png",
"images/icon-192.png",
"images/icon-512.png",
"images/icon-maskable-512.png",
"images/site-qr.png",
"js/app.js",
"js/ar.js",
"js/config.js",
"js/content-ar.js",
"js/content.js",
"js/dive.js",
"js/glossary-data.js",
"js/glossary.js",
"js/helpers3d.js",
"js/i18n.js",
"js/kiosk.js",
"js/myths-data.js",
"js/myths.js",
"js/narration.js",
"js/passport.js",
"js/prayer.js",
"js/references-ar.js",
"js/references.js",
"js/settings.js",
"js/timeline.js",
"js/toolkit.js",
"js/ui-ar.js",
"js/video.js",
"js/wallet.js",
"js/zakat.js",
"js/scenes/atm.js",
"js/scenes/clock.js",
"js/scenes/market.js",
"js/scenes/ocean.js",
"js/scenes/sky.js",
"js/scenes/waqf.js",
"https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",
"https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"
];
const EXTRA = [
"audio/ar-daniel/atm/1.mp3",
"audio/ar-daniel/atm/2.mp3",
"audio/ar-daniel/atm/3.mp3",
"audio/ar-daniel/atm/4.mp3",
"audio/ar-daniel/atm/5.mp3",
"audio/ar-daniel/atm/6.mp3",
"audio/ar-daniel/atm/7.mp3",
"audio/ar-daniel/atm/8.mp3",
"audio/ar-daniel/clock/1.mp3",
"audio/ar-daniel/clock/2.mp3",
"audio/ar-daniel/clock/3.mp3",
"audio/ar-daniel/clock/4.mp3",
"audio/ar-daniel/clock/5.mp3",
"audio/ar-daniel/clock/6.mp3",
"audio/ar-daniel/clock/7.mp3",
"audio/ar-daniel/clock/8.mp3",
"audio/ar-daniel/market/1.mp3",
"audio/ar-daniel/market/2.mp3",
"audio/ar-daniel/market/3.mp3",
"audio/ar-daniel/market/4.mp3",
"audio/ar-daniel/market/5.mp3",
"audio/ar-daniel/market/6.mp3",
"audio/ar-daniel/market/7.mp3",
"audio/ar-daniel/market/8.mp3",
"audio/ar-daniel/ocean/1.mp3",
"audio/ar-daniel/ocean/2.mp3",
"audio/ar-daniel/ocean/3.mp3",
"audio/ar-daniel/ocean/4.mp3",
"audio/ar-daniel/ocean/5.mp3",
"audio/ar-daniel/ocean/6.mp3",
"audio/ar-daniel/ocean/7.mp3",
"audio/ar-daniel/ocean/8.mp3",
"audio/ar-daniel/sky/1.mp3",
"audio/ar-daniel/sky/2.mp3",
"audio/ar-daniel/sky/3.mp3",
"audio/ar-daniel/sky/4.mp3",
"audio/ar-daniel/sky/5.mp3",
"audio/ar-daniel/sky/6.mp3",
"audio/ar-daniel/sky/7.mp3",
"audio/ar-daniel/sky/8.mp3",
"audio/ar-daniel/waqf/1.mp3",
"audio/ar-daniel/waqf/2.mp3",
"audio/ar-daniel/waqf/3.mp3",
"audio/ar-daniel/waqf/4.mp3",
"audio/ar-daniel/waqf/5.mp3",
"audio/ar-daniel/waqf/6.mp3",
"audio/ar-daniel/waqf/7.mp3",
"audio/ar-daniel/waqf/8.mp3",
"audio/en-george/atm/1.mp3",
"audio/en-george/atm/2.mp3",
"audio/en-george/atm/3.mp3",
"audio/en-george/atm/4.mp3",
"audio/en-george/atm/5.mp3",
"audio/en-george/atm/6.mp3",
"audio/en-george/atm/7.mp3",
"audio/en-george/atm/8.mp3",
"audio/en-george/clock/1.mp3",
"audio/en-george/clock/2.mp3",
"audio/en-george/clock/3.mp3",
"audio/en-george/clock/4.mp3",
"audio/en-george/clock/5.mp3",
"audio/en-george/clock/6.mp3",
"audio/en-george/clock/7.mp3",
"audio/en-george/clock/8.mp3",
"audio/en-george/market/1.mp3",
"audio/en-george/market/2.mp3",
"audio/en-george/market/3.mp3",
"audio/en-george/market/4.mp3",
"audio/en-george/market/5.mp3",
"audio/en-george/market/6.mp3",
"audio/en-george/market/7.mp3",
"audio/en-george/market/8.mp3",
"audio/en-george/ocean/1.mp3",
"audio/en-george/ocean/2.mp3",
"audio/en-george/ocean/3.mp3",
"audio/en-george/ocean/4.mp3",
"audio/en-george/ocean/5.mp3",
"audio/en-george/ocean/6.mp3",
"audio/en-george/ocean/7.mp3",
"audio/en-george/ocean/8.mp3",
"audio/en-george/sky/1.mp3",
"audio/en-george/sky/2.mp3",
"audio/en-george/sky/3.mp3",
"audio/en-george/sky/4.mp3",
"audio/en-george/sky/5.mp3",
"audio/en-george/sky/6.mp3",
"audio/en-george/sky/7.mp3",
"audio/en-george/sky/8.mp3",
"audio/en-george/waqf/1.mp3",
"audio/en-george/waqf/2.mp3",
"audio/en-george/waqf/3.mp3",
"audio/en-george/waqf/4.mp3",
"audio/en-george/waqf/5.mp3",
"audio/en-george/waqf/6.mp3",
"audio/en-george/waqf/7.mp3",
"audio/en-george/waqf/8.mp3",
"audio/en-heart/atm/1.mp3",
"audio/en-heart/atm/2.mp3",
"audio/en-heart/atm/3.mp3",
"audio/en-heart/atm/4.mp3",
"audio/en-heart/atm/5.mp3",
"audio/en-heart/atm/6.mp3",
"audio/en-heart/atm/7.mp3",
"audio/en-heart/atm/8.mp3",
"audio/en-heart/clock/1.mp3",
"audio/en-heart/clock/2.mp3",
"audio/en-heart/clock/3.mp3",
"audio/en-heart/clock/4.mp3",
"audio/en-heart/clock/5.mp3",
"audio/en-heart/clock/6.mp3",
"audio/en-heart/clock/7.mp3",
"audio/en-heart/clock/8.mp3",
"audio/en-heart/market/1.mp3",
"audio/en-heart/market/2.mp3",
"audio/en-heart/market/3.mp3",
"audio/en-heart/market/4.mp3",
"audio/en-heart/market/5.mp3",
"audio/en-heart/market/6.mp3",
"audio/en-heart/market/7.mp3",
"audio/en-heart/market/8.mp3",
"audio/en-heart/ocean/1.mp3",
"audio/en-heart/ocean/2.mp3",
"audio/en-heart/ocean/3.mp3",
"audio/en-heart/ocean/4.mp3",
"audio/en-heart/ocean/5.mp3",
"audio/en-heart/ocean/6.mp3",
"audio/en-heart/ocean/7.mp3",
"audio/en-heart/ocean/8.mp3",
"audio/en-heart/sky/1.mp3",
"audio/en-heart/sky/2.mp3",
"audio/en-heart/sky/3.mp3",
"audio/en-heart/sky/4.mp3",
"audio/en-heart/sky/5.mp3",
"audio/en-heart/sky/6.mp3",
"audio/en-heart/sky/7.mp3",
"audio/en-heart/sky/8.mp3",
"audio/en-heart/waqf/1.mp3",
"audio/en-heart/waqf/2.mp3",
"audio/en-heart/waqf/3.mp3",
"audio/en-heart/waqf/4.mp3",
"audio/en-heart/waqf/5.mp3",
"audio/en-heart/waqf/6.mp3",
"audio/en-heart/waqf/7.mp3",
"audio/en-heart/waqf/8.mp3",
"audio/en-michael/atm/1.mp3",
"audio/en-michael/atm/2.mp3",
"audio/en-michael/atm/3.mp3",
"audio/en-michael/atm/4.mp3",
"audio/en-michael/atm/5.mp3",
"audio/en-michael/atm/6.mp3",
"audio/en-michael/atm/7.mp3",
"audio/en-michael/atm/8.mp3",
"audio/en-michael/clock/1.mp3",
"audio/en-michael/clock/2.mp3",
"audio/en-michael/clock/3.mp3",
"audio/en-michael/clock/4.mp3",
"audio/en-michael/clock/5.mp3",
"audio/en-michael/clock/6.mp3",
"audio/en-michael/clock/7.mp3",
"audio/en-michael/clock/8.mp3",
"audio/en-michael/market/1.mp3",
"audio/en-michael/market/2.mp3",
"audio/en-michael/market/3.mp3",
"audio/en-michael/market/4.mp3",
"audio/en-michael/market/5.mp3",
"audio/en-michael/market/6.mp3",
"audio/en-michael/market/7.mp3",
"audio/en-michael/market/8.mp3",
"audio/en-michael/ocean/1.mp3",
"audio/en-michael/ocean/2.mp3",
"audio/en-michael/ocean/3.mp3",
"audio/en-michael/ocean/4.mp3",
"audio/en-michael/ocean/5.mp3",
"audio/en-michael/ocean/6.mp3",
"audio/en-michael/ocean/7.mp3",
"audio/en-michael/ocean/8.mp3",
"audio/en-michael/sky/1.mp3",
"audio/en-michael/sky/2.mp3",
"audio/en-michael/sky/3.mp3",
"audio/en-michael/sky/4.mp3",
"audio/en-michael/sky/5.mp3",
"audio/en-michael/sky/6.mp3",
"audio/en-michael/sky/7.mp3",
"audio/en-michael/sky/8.mp3",
"audio/en-michael/waqf/1.mp3",
"audio/en-michael/waqf/2.mp3",
"audio/en-michael/waqf/3.mp3",
"audio/en-michael/waqf/4.mp3",
"audio/en-michael/waqf/5.mp3",
"audio/en-michael/waqf/6.mp3",
"audio/en-michael/waqf/7.mp3",
"audio/en-michael/waqf/8.mp3",
"audio/en-puck/atm/1.mp3",
"audio/en-puck/atm/2.mp3",
"audio/en-puck/atm/3.mp3",
"audio/en-puck/atm/4.mp3",
"audio/en-puck/atm/5.mp3",
"audio/en-puck/atm/6.mp3",
"audio/en-puck/atm/7.mp3",
"audio/en-puck/atm/8.mp3",
"audio/en-puck/clock/1.mp3",
"audio/en-puck/clock/2.mp3",
"audio/en-puck/clock/3.mp3",
"audio/en-puck/clock/4.mp3",
"audio/en-puck/clock/5.mp3",
"audio/en-puck/clock/6.mp3",
"audio/en-puck/clock/7.mp3",
"audio/en-puck/clock/8.mp3",
"audio/en-puck/market/1.mp3",
"audio/en-puck/market/2.mp3",
"audio/en-puck/market/3.mp3",
"audio/en-puck/market/4.mp3",
"audio/en-puck/market/5.mp3",
"audio/en-puck/market/6.mp3",
"audio/en-puck/market/7.mp3",
"audio/en-puck/market/8.mp3",
"audio/en-puck/ocean/1.mp3",
"audio/en-puck/ocean/2.mp3",
"audio/en-puck/ocean/3.mp3",
"audio/en-puck/ocean/4.mp3",
"audio/en-puck/ocean/5.mp3",
"audio/en-puck/ocean/6.mp3",
"audio/en-puck/ocean/7.mp3",
"audio/en-puck/ocean/8.mp3",
"audio/en-puck/sky/1.mp3",
"audio/en-puck/sky/2.mp3",
"audio/en-puck/sky/3.mp3",
"audio/en-puck/sky/4.mp3",
"audio/en-puck/sky/5.mp3",
"audio/en-puck/sky/6.mp3",
"audio/en-puck/sky/7.mp3",
"audio/en-puck/sky/8.mp3",
"audio/en-puck/waqf/1.mp3",
"audio/en-puck/waqf/2.mp3",
"audio/en-puck/waqf/3.mp3",
"audio/en-puck/waqf/4.mp3",
"audio/en-puck/waqf/5.mp3",
"audio/en-puck/waqf/6.mp3",
"audio/en-puck/waqf/7.mp3",
"audio/en-puck/waqf/8.mp3",
"audio/glossary/amanah.mp3",
"audio/glossary/asr.mp3",
"audio/glossary/ayah.mp3",
"audio/glossary/barzakh.mp3",
"audio/glossary/dhuhr.mp3",
"audio/glossary/fajr.mp3",
"audio/glossary/hadith.mp3",
"audio/glossary/halal.mp3",
"audio/glossary/haram.mp3",
"audio/glossary/hijri.mp3",
"audio/glossary/hilal.mp3",
"audio/glossary/isha.mp3",
"audio/glossary/khamr.mp3",
"audio/glossary/maghrib.mp3",
"audio/glossary/maysir.mp3",
"audio/glossary/mudarabah.mp3",
"audio/glossary/mudarib.mp3",
"audio/glossary/murabaha.mp3",
"audio/glossary/musharakah.mp3",
"audio/glossary/mutawalli.mp3",
"audio/glossary/nisab.mp3",
"audio/glossary/qard_hasan.mp3",
"audio/glossary/rabb_al_mal.mp3",
"audio/glossary/riba.mp3",
"audio/glossary/sadaqah.mp3",
"audio/glossary/sadaqah_jariyah.mp3",
"audio/glossary/sunnah.mp3",
"audio/glossary/surah.mp3",
"audio/glossary/waqf.mp3",
"audio/glossary/waqif.mp3",
"audio/glossary/zakat.mp3",
"models/atm.glb",
"models/clock.glb",
"models/market.glb",
"models/sky.glb",
"models/waqf.glb",
"https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"
];
const TOTAL_MB = 27;
// BUILD END

const CODE = "signs-code-" + VERSION;   // pages, scripts, styles (replaced on every update)
const MEDIA = "signs-media-v1";          // audio, models, libraries (kept between updates)

self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const code = await caches.open(CODE), media = await caches.open(MEDIA);
    await Promise.all(CORE.map(async (url) => {
      try {
        const cdn = url.startsWith("http");
        const res = await fetch(url, cdn ? { mode: "cors" } : { cache: "reload" });
        if (res.ok) await (isMedia(new URL(url, self.location)) ? media : code).put(url, res);
      } catch (err) { /* one missing file must not stop the rest */ }
    }));
    self.skipWaiting();
  })());
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith("signs-code-") && k !== CODE) await caches.delete(k);
    await self.clients.claim();
  })());
});

function isMedia(url) {
  return url.origin !== self.location.origin || /\/(audio|models)\//.test(url.pathname) || /\.(png|jpg|jpeg|webp|glb|mp3|woff2?)$/.test(url.pathname);
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (!/^https?:$/.test(url.protocol)) return;
  if (url.origin !== self.location.origin && !/cdnjs|jsdelivr|googleapis/.test(url.host)) return; // YouTube etc.
  e.respondWith(isMedia(url) ? mediaFirst(req, url) : networkFirst(req, url));
});

/** Code: internet first (3 s limit), saved copy as backup */
async function networkFirst(req, url) {
  const cache = await caches.open(CODE);
  const key = url.origin + url.pathname;   // ?ar=atm, ?kiosk … share one saved page
  const fromNet = fetch(req).then((res) => {
    if (res.ok) cache.put(key, res.clone());
    return res;
  });
  const saved = await caches.match(key, { ignoreSearch: true });
  if (!saved) return fromNet.catch(() => new Response("Offline and this page was not saved yet.", { status: 503 }));
  const timeout = new Promise((r) => setTimeout(() => r(saved), 3000));
  return Promise.race([fromNet.catch(() => saved), timeout]);
}

/** Media: saved copy first, otherwise download and save. Audio asks for byte ranges. */
async function mediaFirst(req, url) {
  const cache = await caches.open(MEDIA);
  const key = url.href.split("#")[0];
  let res = await cache.match(key, { ignoreSearch: true });
  if (!res) {
    try {
      res = await fetch(url.origin === self.location.origin ? key : req, url.origin === self.location.origin ? {} : undefined);
      if ((res.ok && res.status === 200) || res.type === "opaque") await cache.put(key, res.clone());
      else return res;
    } catch (err) {
      return new Response("", { status: 504 });
    }
  }
  const range = req.headers.get("range");
  return range ? rangeOf(res, range) : res;
}

async function rangeOf(res, range) {
  const buf = await res.arrayBuffer();
  const m = /bytes=(\d*)-(\d*)/.exec(range) || [];
  let start = m[1] ? +m[1] : 0, end = m[2] ? +m[2] : buf.byteLength - 1;
  if (!m[1] && m[2]) { start = buf.byteLength - +m[2]; end = buf.byteLength - 1; }
  end = Math.min(end, buf.byteLength - 1);
  return new Response(buf.slice(start, end + 1), {
    status: 206,
    headers: {
      "Content-Type": res.headers.get("Content-Type") || "audio/mpeg",
      "Content-Range": `bytes ${start}-${end}/${buf.byteLength}`,
      "Content-Length": String(end - start + 1),
      "Accept-Ranges": "bytes"
    }
  });
}

/* ---------- "Save everything" from the settings panel ---------- */
self.addEventListener("message", (e) => {
  const port = e.ports && e.ports[0];
  if (!port) return;
  if (e.data === "status") {
    status().then((s) => port.postMessage(s));
  } else if (e.data === "save-all") {
    saveAll(port);
  }
});

async function status() {
  const media = await caches.open(MEDIA), code = await caches.open(CODE);
  let saved = 0;
  for (const u of EXTRA) if (await media.match(new URL(u, self.location).href, { ignoreSearch: true })) saved++;
  let core = 0;
  for (const u of CORE) if (await caches.match(new URL(u, self.location).href, { ignoreSearch: true })) core++;
  return { version: VERSION, saved, total: EXTRA.length, core, coreTotal: CORE.length, mb: TOTAL_MB };
}

async function saveAll(port) {
  const media = await caches.open(MEDIA), code = await caches.open(CODE);
  // first, any page / library file that failed to save the first time
  for (const u of CORE) {
    const href = new URL(u, self.location).href;
    if (await caches.match(href, { ignoreSearch: true })) continue;
    try {
      const res = await fetch(href, u.startsWith("http") ? { mode: "cors" } : {});
      if (res.ok) await (isMedia(new URL(href)) ? media : code).put(href, res);
    } catch (err) { /* still offline: try again next time */ }
  }
  let done = 0, failed = 0;
  const queue = EXTRA.slice();
  async function worker() {
    while (queue.length) {
      const u = queue.shift(), href = new URL(u, self.location).href;
      try {
        if (!(await media.match(href, { ignoreSearch: true }))) {
          const res = await fetch(href, u.startsWith("http") ? { mode: "cors" } : {});
          if (res.ok) await media.put(href, res); else failed++;
        }
      } catch (err) { failed++; }
      done++;
      if (done % 5 === 0 || done === EXTRA.length) port.postMessage({ progress: done, total: EXTRA.length, failed });
    }
  }
  await Promise.all([worker(), worker(), worker(), worker()]);
  port.postMessage({ finished: true, failed, total: EXTRA.length });
}
