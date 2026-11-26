# 🎙️ Narration tools

These scripts recorded the voices used by **🎬 Watch video**. You only need them if you change the
step text in `js/content.js` (English) or `ar_steps.py` (Arabic) and want to record again.

| File | What it does |
|---|---|
| `steps.json` | The English narration (copied from the `steps` in `js/content.js`). |
| `pron.py` | Correct pronunciation of Arabic words inside the English voice (Allah, Assalamu alaikum, zakat, surah names…). Add new words here. |
| `gen_en.py` | Records the 4 English voices with **Kokoro** (free, open-source). |
| `ar_steps.py` | The Arabic narration. Text inside « » (Qur'an and hadith) is read exactly as written, with its vowels. |
| `gen_ar.py` | Offline backup: records the Arabic with **Piper** (ar_JO-kareem). The site now uses a more natural **ElevenLabs** voice (Daniel, Multilingual v2), recorded sentence by sentence from `ar_steps.py`. |
| `build_manifest.py` | Makes `js/narration.js` (the timings that keep the subtitles in step with the voice). |

**To record again** (needs Python 3 and ffmpeg):
```
pip install kokoro-onnx soundfile piper-tts
# download kokoro-v1.0.onnx and voices-v1.0.bin from github.com/thewh1teagle/kokoro-onnx (releases → model-files-v1.0)
# download vits-piper-ar_JO-kareem-medium.tar.bz2 from github.com/k2-fsa/sherpa-onnx (releases → tts-models) and unpack it
python gen_en.py michael george heart puck
python gen_ar.py
python build_manifest.py
```
Then copy `out/en-*`, `out/ar-kareem` into `audio/` and `out/narration.js` into `js/`.
