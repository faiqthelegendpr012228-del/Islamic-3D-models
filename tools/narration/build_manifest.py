import json, os
from ar_steps import AR
LABELS = {"en-michael": "Michael (calm, US)", "en-george": "George (British)",
          "en-heart": "Heart (female, US)", "en-puck": "Puck (energetic, US)"}
AR_TITLES = {"atm": "الصرّاف الآلي الحلال", "sky": "درع السماء", "waqf": "الوقف: صدقة لا ينقطع خيرها",
             "clock": "الساعة الكونية", "market": "محاكي الاستثمار الإسلامي", "ocean": "مستكشف أعماق المحيط"}
voices = {}
for key, label in LABELS.items():
    f = f"out/{key}.json"
    if os.path.exists(f):
        voices[key] = {"label": label, "lang": "en", "timings": json.load(open(f))}
if os.path.exists("out/ar-daniel.json"):
    voices["ar-daniel"] = {"label": "Daniel (ElevenLabs)", "lang": "ar", "timings": json.load(open("out/ar-daniel.json")),
                           "text": AR, "titles": AR_TITLES}
js = ("/* Recorded narration for the Watch video player.\n"
      "   English voices: Kokoro (am_michael, bm_george, af_heart, am_puck). Arabic voice: ElevenLabs (Daniel, Multilingual v2).\n"
      "   Audio files: audio/<voice>/<topic>/<step>.mp3   (made by tools/narration) */\n"
      "window.NARRATION = " + json.dumps({"voices": voices}, ensure_ascii=False) + ";\n")
open("out/narration.js", "w").write(js)
print("voices:", list(voices), "size", len(js)//1024, "KB")
