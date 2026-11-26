import json, re, os, sys, subprocess, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
from pron import to_phonemes
VOICES = {"michael": ("am_michael", "en-us"), "george": ("bm_george", "en-gb"),
          "heart": ("af_heart", "en-us"), "puck": ("am_puck", "en-us")}
GAP = 0.28
OUT = os.environ.get("OUT", "out")
MODEL = os.environ.get("MODEL_DIR", ".")
k = Kokoro(f"{MODEL}/kokoro-v1.0.onnx", f"{MODEL}/voices-v1.0.bin")
steps = json.load(open("steps.json"))
def sentences(t):   # must match video.js
    parts = re.findall(r"""[^.!?]+[.!?]+["'”’]*\s*|[^.!?]+$""", t)
    return [p.strip() for p in parts if p.strip()] or [t]
for name in sys.argv[1:]:
    vid, lang = VOICES[name]
    manifest = {}
    for tid, says in steps.items():
        manifest[tid] = []
        os.makedirs(f"{OUT}/en-{name}/{tid}", exist_ok=True)
        for i, say in enumerate(says):
            audio = []; starts = []; t = 0.0; sr = 24000
            for s in sentences(say):
                a, sr = k.create(to_phonemes(k.tokenizer, s, lang), voice=vid, lang=lang, is_phonemes=True)
                starts.append(round(t, 2)); audio.append(a); t += len(a)/sr
                audio.append(np.zeros(int(GAP*sr), dtype=a.dtype)); t += GAP
            base = f"{OUT}/en-{name}/{tid}/{i+1}"
            sf.write(base + ".wav", np.concatenate(audio), sr)
            subprocess.run(["ffmpeg","-loglevel","error","-y","-i",base+".wav","-ac","1","-b:a","64k",base+".mp3"], check=True)
            os.remove(base + ".wav")
            manifest[tid].append({"starts": starts, "duration": round(t, 2)})
            print(name, tid, i+1, round(t,1), flush=True)
    json.dump(manifest, open(f"{OUT}/en-{name}.json", "w"))
    print("DONE", name, flush=True)
