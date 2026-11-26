"""
build_offline.py  —  run this after changing any file in the website:

    python tools/build_offline.py

It writes the list of files the "works with no Wi-Fi" mode saves into sw.js
(between the BUILD markers) and gives it a new version number, so every
visitor's browser picks up the change.
"""
import hashlib, json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP_DIRS = {"_to_delete", "tools", ".git", "print", "videos"}
SKIP_FILES = {"sw.js", "README.md", "demo-script.md", ".gitignore", "info-card.html"}

CDN = [
    "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",
    "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js",
]
CDN_EXTRA = ["https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"]

core, extra, h = ["./"], [], hashlib.sha1()
for d, dirs, files in os.walk(ROOT):
    dirs[:] = sorted(x for x in dirs if x not in SKIP_DIRS)
    for f in sorted(files):
        if f in SKIP_FILES or f.startswith("."):
            continue
        p = os.path.join(d, f)
        rel = os.path.relpath(p, ROOT).replace(os.sep, "/")
        with open(p, "rb") as fh:
            h.update(rel.encode()); h.update(fh.read())
        # big media is saved when first used, or all at once with "Save for offline"
        (extra if rel.startswith(("audio/", "models/")) else core).append(rel)

size = sum(os.path.getsize(os.path.join(ROOT, f)) for f in core[1:] + extra)
block = (
    "// BUILD START (written by tools/build_offline.py, do not edit by hand)\n"
    f"const VERSION = {json.dumps(h.hexdigest()[:10])};\n"
    f"const CORE = {json.dumps(core + CDN, indent=0)};\n"
    f"const EXTRA = {json.dumps(extra + CDN_EXTRA, indent=0)};\n"
    f"const TOTAL_MB = {round(size / 1e6)};\n"
    "// BUILD END"
)
sw = os.path.join(ROOT, "sw.js")
src = open(sw, encoding="utf-8").read()
src = re.sub(r"// BUILD START.*?// BUILD END", lambda m: block, src, flags=re.S)
open(sw, "w", encoding="utf-8", newline="\n").write(src)
print(f"sw.js updated: version {h.hexdigest()[:10]}, {len(core)} core files, {len(extra)} media files, {round(size/1e6)} MB in total")
