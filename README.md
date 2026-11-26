# Signs & Systems: an interactive Islamic studies museum

Six interactive 3D exhibits that connect the Qur'an and Sunnah to science, money and everyday life.

🌐 **Live website:** https://faiqthelegendpr012228-del.github.io/Islamic-3D-models/

**Website features**
- 🌍 **The dive homepage:** one scroll from space to the sea floor, with an exhibit at each stop.
- 💳 **Shared wallet:** the ATM, Market and Waqf use the same money: withdraw and pay zakat → invest halally → give a waqf. See it all in **My money journey**.
- 🎬 **Watch video:** each exhibit plays its 8 steps by itself with a recorded narrator and subtitles that follow the voice. Choose **English** (4 voices: Michael, George, Heart, Puck) or **العربية** (Arabic narration by an ElevenLabs voice, with Arabic subtitles). Arabic words like *Allah*, *Assalamu alaikum* and the surah names are pronounced the Arabic way. You can also add your own recorded videos (see below).
- ❓ **Quizzes** with questions and answers shuffled every time.
- 🛂 **Explorer's passport:** score 4/5 or more in a quiz to earn that exhibit's stamp. All six stamps unlock a printable **certificate**.
- ↺ **New visitor** (in the passport) clears the wallet and stamps for the next person.
- 🌐 **English / العربية:** the whole site in Arabic, right-to-left, including the exhibits, quizzes, wallet, passport and certificate (button in the top corner / top bar).
- 📚 **Glossary:** key terms are underlined; hover or tap for the Arabic word, the meaning and its pronunciation. The 📚 button lists all terms.
- 🃏 **Myth or Fact:** swipe cards for each exhibit, with the answer and its source.
- 📱 **View in your room (AR):** five exhibits (ATM, Sky Shield, Waqf, Cosmic Clock, Market) can be placed on a real table through a phone camera. On a computer, scan the QR code.
- ▶ **Kiosk mode:** press **K** (or the button at the bottom of the homepage) for a self-running tour on the exhibition screen. Any touch hands it to the visitor; after 90 seconds untouched it restarts.

| # | Topic | Category |
|---|---|---|
| 1 | 🏧 Halal Finance ATM | Financial Contracts |
| 2 | 🌍 Sky Shield: Earth's Protective Atmosphere | Scientific Miracles |
| 3 | 🕌 Waqf: A Charity That Keeps Giving | Financial Contracts |
| 4 | 🌙 Cosmic Clock: Sun and Moon | Scientific Miracles |
| 5 | 🏪 Islamic Business Investment Simulator | Financial Contracts |
| 6 | 🌊 Ocean Depth Explorer | Scientific Miracles |

---

## ▶️ How to open it

**Online:** open the live website link above (works on phones too).

**Offline:**
1. Open the folder **Islamic-Studies-3D**.
2. **Double-click `index.html`.** It opens in Chrome (or Edge).
3. Scroll down to a topic, click **Enter exhibit ▶**, then **▶ Start** (or **🎬 Watch the video**).

That's it: no installing and no server.
⚠️ **You need an internet connection.** The 3D engine (Three.js) loads from the internet the first time the page opens.

**Shortcut:** to jump straight to one topic, add its name after a `#`, for example `index.html#ocean`.
Topic names: `atm`, `sky`, `waqf`, `clock`, `market`, `ocean`.

---

## 🧭 What's inside each topic

| Button (top bar) | What it does |
|---|---|
| 🧭 **Explore** | The 3D model. Drag to rotate, scroll to zoom, right-drag to move. Click the glowing labels (hotspots) and use the panel on the right. |
| 📖 **Qur'an & Hadith** | Every verse and hadith for this topic, with its exact reference. |
| 🏠 **Real Life** | 4 everyday examples for students and families. Click a card for a weekly challenge. |
| 🎬 **Watch video** | The narrated tour: the model moves by itself, a recorded voice explains, subtitles follow along. Pick **English / العربية** and the voice at the bottom of the player. Space = pause, ← → = back / next. |
| 🎤 **Presentation Mode** | A guided 2-minute demo in 8 steps. It shows **which member is speaking**. Use **Next / Back** (or the arrow keys / a clicker). |
| ❓ **Quiz** | 5 multiple-choice questions for the audience, with explanations. |
| ⭐ **Credits** | Group members and their roles. |
| ⌂ **Topics** | Back to the topic chooser. |

---

## ✏️ Things you should edit

### 1. Your names and roles → `js/config.js`
List 1 to 4 people here. With one person, they present every step of Presentation Mode. Names update **everywhere**: start screen, Presentation Mode, credits and the info card.
You can also change the school name, class, teacher, currency (`AED`) and the default nisab value (now **41,437.50 AED** = 85 g × 487.50 AED per gram of 24-carat gold; update it when the gold price changes).

### 2. Your own videos (optional) → `js/config.js`
Made a video in CapCut? Add it under `videos`, using a YouTube link or a file in a `videos` folder (under 100 MB):
```js
videos: {
  atm: "https://youtu.be/XXXXXXXXXXX",
  waqf: "videos/waqf.mp4",
}
```
That topic's **🎬 Watch video** button then lets visitors choose your video or the narrated 3D tour.

### 3. The Arabic text → `js/references.js`
We did **not** type Arabic from memory, to avoid mistakes. Every reference has a yellow placeholder like this:

```js
arabic: "[PASTE ARABIC TEXT HERE from quran.com/2/275]",
```

1. Open the link shown (e.g. quran.com/2/275).
2. Copy the Arabic verse.
3. Paste it between the quotes, replacing the whole placeholder:
   `arabic: "…your pasted Arabic…",`
4. Save, then reload the page. The Arabic now appears in place of the yellow box.

---

## 📁 What each file does

| File | In simple words |
|---|---|
| `index.html` | The main page. It holds the screens, buttons and panels, and loads all the scripts. |
| `info-card.html` | Printable **A5 project information card**. Choose the topic, then press **Print** (pick A5 paper). |
| `demo-script.md` | The **2-minute presentation script** for all 6 topics, for one presenter (matches Presentation Mode). |
| `README.md` | This guide. |
| `css/style.css` | Colours, fonts, the Islamic star pattern and the layout. |
| `js/config.js` | **Your names**, roles, school, currency. Edit this! |
| `js/references.js` | **All Qur'an verses and Hadith** in one place (Sahih International / sunnah.com), with links. For the teacher to check. |
| `js/content.js` | All other text: info panels, real-life examples, presentation steps, quiz questions, info-card features. |
| `js/helpers3d.js` | Small reusable 3D building blocks (box, house, tree, person, glowing dot, text signs, Earth texture). |
| `js/app.js` | The "engine": sets up the 3D view, handles clicks, panels, Presentation Mode and the quiz. |
| `js/dive.js` + `css/dive.css` | The homepage journey from space to the sea. |
| `js/wallet.js` + `css/wallet.css` | The shared wallet and the **My money journey** screen. |
| `js/passport.js` + `css/passport.css` | Passport stamps and the certificate. |
| `js/video.js` + `css/video.css` | The **🎬 Watch video** player (narration and subtitles). |
| `js/narration.js` + `audio/` | The recorded narration (4 English voices + 1 Arabic voice, × 6 topics × 8 steps) and its subtitle timings. Arabic voice by ElevenLabs (credited on the Credits page). |
| `tools/narration/` | Scripts that recorded the voices. Only needed if you change the narration text (see its README). |
| `js/i18n.js`, `js/ui-ar.js`, `js/content-ar.js`, `js/references-ar.js` | The Arabic interface (switch, labels, exhibit texts, reference lessons). **Teacher: please check the Arabic.** |
| `js/glossary-data.js` + `js/glossary.js` + `audio/glossary/` | Glossary terms, pop-ups and pronunciations. |
| `js/myths-data.js` + `js/myths.js` | Myth or Fact cards (please check these like the quiz). |
| `js/ar.js` + `models/*.glb` + `images/ar-qr-*.png` | AR view: the 3D models and their QR codes. |
| `js/kiosk.js` | Kiosk mode for the exhibition screen. |
| `print/qr-stand-A5.pdf` | Printable QR code sign for the exhibition stand. |
| `js/scenes/atm.js` | Topic 1: the ATM, Zakat calculator, Riba Check, Sadaqah coins, sorting game. |
| `js/scenes/sky.js` | Topic 2: Earth, atmosphere layers, meteors, UV rays and ozone. |
| `js/scenes/waqf.js` | Topic 3: the village, donated assets, timeline and counter. |
| `js/scenes/clock.js` | Topic 4: Sun–Earth–Moon, Moon phases with the Hijri day, prayer times from the Sun's angle. |
| `js/scenes/market.js` | Topic 5: shops, halal screening, Mudarabah / Musharakah simulation vs. an interest loan. |
| `js/scenes/ocean.js` | Topic 6: submarine dive, light fading, internal waves, creatures, and the Two Seas scene. |

---

## 🧠 How it works (for explaining to the class)

- **Three.js** draws 3D shapes (boxes, spheres, cylinders) in the browser using the graphics card.
  Every object is built from these simple shapes in code, so there are no model files.
- **OrbitControls** lets you rotate and zoom the camera with the mouse.
- **Hotspots** are HTML labels. Every frame, the app works out where a 3D point appears on screen and moves the label there.
- **Clicking 3D objects** uses *raycasting*: an invisible ray is fired from the camera through the mouse pointer to see what it hits.
- **Animation loop:** about 60 times a second, each scene's `update()` moves things (coins, meteors, waves, the submarine).
- **Presentation Mode** reads the 8 steps from `content.js`. Each step calls a small function in that topic's scene file (e.g. `meteorShower`) to move the model.

### The science and maths in the models
- **Zakat:** 2.5% of wealth at or above the nisab (≈ 85 g gold) held for a lunar year.
- **Riba Check:** compound interest grows with every late month. Murabaha is a fixed sale price that never grows.
- **Sky Shield:** real layer heights (0–12, 12–50, 50–85, 85–600, 600–10,000 km). Layers are drawn thicker than reality (not to scale).
- **Cosmic Clock:** a real Sun light source creates the Moon phases. Prayer times use the formula
  `sin(altitude) = cos(latitude) × cos(hour angle)` at the equinox: Fajr −18°, Isha −17°, sunrise/sunset −0.833°, Asr from the shadow length.
- **Market:** Mudarabah = investor carries money losses; Musharakah = losses shared by capital; interest loan = the lender is always paid.
- **Ocean:** each colour fades exponentially with depth (red first, blue last). Depth is shown on a square-root scale so the shallow zones fit.

> We present the science **separately** from the verses. The Qur'an is a book of guidance, and the scientific facts are shown as signs to reflect on.

---

## 🚀 Updating the live website
After any change, run in the project folder:
```
git add -A
git commit -m "what you changed"
git push
```
GitHub rebuilds the site in 1–2 minutes (check the **Actions** tab for a green tick). If you still see the old version, open a private window or press **Ctrl + Shift + R**.

## 🛠️ Troubleshooting

| Problem | Fix |
|---|---|
| "The 3D engine could not load" | Connect to the internet and reload (Three.js comes from a CDN). |
| It's slow on an old laptop | Close other tabs. Make the browser window smaller. |
| Text too small on the projector | Press **Ctrl +** to zoom the page. |
| 🎬 Video has subtitles but no voice | Check the 🔊 button isn't muted and the computer's sound is on. If the audio files can't load (no internet), the computer's own voice is used, or the subtitles play on their own. |
| Info card prints on 2 pages | In the print dialog choose **Paper size: A5**, **Margins: Default**, **Scale: 100%**. |
