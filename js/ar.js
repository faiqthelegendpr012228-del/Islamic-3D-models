/* =====================================================================
   ar.js  —  "📱 View in your room" (augmented reality)
   ---------------------------------------------------------------------
   Five exhibits have a 3D model file (models/<topic>.glb), exported from
   the scenes and scaled to about 60 cm wide, the size of a small table.
   • On a phone: the button opens the camera and places the model on a
     real table or floor (Android: Scene Viewer / WebXR, iPhone: Quick Look).
   • On a computer: the model can be spun around, and a QR code opens the
     same model on a phone.
   Uses Google's <model-viewer>, loaded only when someone opens AR.
   Link straight to one: add ?ar=atm (or sky, waqf, clock, market).
   ===================================================================== */
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const MODELS = { atm: true, sky: true, waqf: true, clock: true, market: true };
  const MV_SRC = "https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js";
  const ar = () => window.I18N && I18N.lang === "ar";
  const T = (en, a) => (ar() ? a : en);
  let loading = null;

  function loadViewer() {
    if (window.customElements && customElements.get("model-viewer")) return Promise.resolve();
    if (loading) return loading;
    loading = new Promise((res, rej) => {
      const s = document.createElement("script");
      s.type = "module"; s.src = MV_SRC;
      s.onload = () => customElements.whenDefined("model-viewer").then(res);
      s.onerror = rej;
      document.head.appendChild(s);
    });
    return loading;
  }

  // ---------- the button in the exhibit top bar ----------
  const btn = document.createElement("button");
  btn.className = "nav-btn ar-btn"; btn.id = "ar-btn";
  btn.textContent = "📱 View in your room";
  btn.onclick = () => window.APP_API && open(APP_API.topic.id);
  const topbar = $("topbar");
  if (topbar) topbar.insertBefore(btn, topbar.querySelector('[data-view="present"]'));
  document.addEventListener("topicopen", (e) => { btn.style.display = MODELS[e.detail] ? "" : "none"; });

  // ---------- the viewer window ----------
  const modal = document.createElement("section");
  modal.id = "ar-modal"; modal.className = "modal";
  modal.innerHTML = `<div class="modal-body ar-body" id="ar-body"></div>`;
  document.body.appendChild(modal);
  modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
  function close() { modal.classList.remove("open"); const mv = modal.querySelector("model-viewer"); if (mv) mv.remove(); }

  function open(id) {
    if (!MODELS[id]) return;
    const t = (window.TOPICS || []).find((x) => x.id === id) || { title: id };
    const phone = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Mac/.test(navigator.platform));
    $("ar-body").innerHTML = `
      <div class="kicker">${T("Augmented reality", "الواقع المعزز")}</div>
      <h2>📱 ${t.title}</h2>
      <div class="ar-stage">
        <div class="ar-loading">${T("Loading the 3D model…", "جارٍ تحميل النموذج…")}</div>
      </div>
      <div class="ar-help">
        ${phone
          ? `<p>${T("Tap <b>View in your room</b>, point your camera at a table or the floor, and the model appears in front of you. Walk around it!", "اضغط <b>اعرضه في غرفتك</b>، ووجّه الكاميرا نحو طاولة أو الأرض، فيظهر النموذج أمامك. تجوّل حوله!")}</p>`
          : `<div class="ar-qr"><img src="images/ar-qr-${id}.png" alt="QR code" width="150" height="150">
               <p>${T("<b>Scan with your phone</b> to place this model on your table using the camera. Here you can drag to spin it.", "<b>امسح الرمز بهاتفك</b> لتضع هذا النموذج على طاولتك عبر الكاميرا. وهنا يمكنك السحب لتدويره.")}</p></div>`}
      </div>
      <div class="j-actions"><span></span><button class="btn small" id="ar-close">${T("Close", "إغلاق")}</button></div>`;
    $("ar-close").onclick = close;
    modal.classList.add("open");
    loadViewer().then(() => {
      const stage = $("ar-body").querySelector(".ar-stage");
      stage.innerHTML = `
        <model-viewer src="models/${id}.glb" alt="${t.title}" ar ar-modes="webxr scene-viewer quick-look" ar-scale="auto"
          camera-controls touch-action="pan-y" auto-rotate shadow-intensity="1" exposure="1.1" camera-orbit="30deg 65deg auto">
          <button slot="ar-button" class="btn accent ar-go">📱 ${T("View in your room", "اعرضه في غرفتك")}</button>
        </model-viewer>`;
    }).catch(() => {
      $("ar-body").querySelector(".ar-stage").innerHTML = `<div class="ar-loading">${T("The 3D viewer needs an internet connection.", "يحتاج العارض إلى اتصال بالإنترنت.")}</div>`;
    });
  }

  window.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  window.AR_VIEW = { open, close };

  // open straight from a link: ...?ar=waqf
  const want = new URLSearchParams(location.search).get("ar");
  if (want && MODELS[want]) window.addEventListener("load", () => setTimeout(() => { window.APP_ENTER && APP_ENTER(want); open(want); }, 600));
})();
