import re, os, io, wave, json, subprocess, numpy as np
from piper import PiperVoice, SynthesisConfig
from ar_steps import AR
v = PiperVoice.load("vits-piper-ar_JO-kareem-medium/ar_JO-kareem-medium.onnx",
                    config_path="vits-piper-ar_JO-kareem-medium/ar_JO-kareem-medium.onnx.json")
GAP = 0.35
def sentences(t):   # must match video.js
    parts = re.findall(r"""[^.!?؟]+[.!?؟]+["'”’»]*\s*|[^.!?؟]+$""", t)
    return [p.strip() for p in parts if p.strip()] or [t]
def synth(text, tashkeel):
    v.use_tashkeel = tashkeel
    buf = io.BytesIO()
    with wave.open(buf, "wb") as w:
        v.synthesize_wav(text, w, syn_config=SynthesisConfig(length_scale=1.08))
    buf.seek(0)
    with wave.open(buf) as w:
        sr = w.getframerate(); a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16)
    return a, sr
def speak_sentence(s):
    pieces = re.split(r"(«[^»]*»)", s)
    out = []; sr = 22050
    for p in pieces:
        if not p.strip(" .،:!؟"): continue
        quoted = p.startswith("«")
        a, sr = synth(p.strip("«»").strip(), tashkeel=not quoted)
        out.append(a); out.append(np.zeros(int(0.08*sr), dtype=np.int16))
    return np.concatenate(out), sr
manifest = {}
for tid, says in AR.items():
    manifest[tid] = []
    os.makedirs(f"out/ar-kareem/{tid}", exist_ok=True)
    for i, say in enumerate(says):
        audio = []; starts = []; t = 0.0
        for s in sentences(say):
            a, sr = speak_sentence(s)
            starts.append(round(t, 2)); audio.append(a); t += len(a)/sr
            audio.append(np.zeros(int(GAP*sr), dtype=np.int16)); t += GAP
        base = f"out/ar-kareem/{tid}/{i+1}"
        with wave.open(base + ".wav", "wb") as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(np.concatenate(audio).tobytes())
        subprocess.run(["ffmpeg","-loglevel","error","-y","-i",base+".wav","-ac","1","-b:a","64k",base+".mp3"], check=True)
        os.remove(base + ".wav")
        manifest[tid].append({"starts": starts, "duration": round(t, 2)})
        print("ar", tid, i+1, round(t,1), flush=True)
json.dump(manifest, open("out/ar-kareem.json", "w"))
json.dump(AR, open("out/ar-text.json", "w"), ensure_ascii=False)
print("DONE ar", flush=True)
