"""Natural pronunciation of Arabic words inside the English narration.
Each word is given as phonemes (the voice engine's IPA symbols), so it is
read the Arabic way instead of being guessed as English."""
import re
AR = {
 "sallallahu alayhi wa sallam": "sˌɐllɐllˈɑːhu ɐlˈeɪhi wɐ sˈɐllɐm",
 "assalamu alaikum": "ɐs sɐlˈɑːmu ɐlˈeɪkʊm",
 "allah's": "ɐlˈlɑːz", "allah": "ɐlˈlɑː",
 "qur'an": "qʊɹˈɑːn", "surah": "sˈuːɹɐ",
 "al-baqarah": "ɐl bˈɑqɐɹɐ", "aal-imran": "ˈɑːl ɪmɹˈɑːn", "al-anbiya": "ɐl ɐnbiˈjɑː",
 "an-nur": "ɐn nˈuːɹ", "al-furqan": "ɐl fʊɹqˈɑːn", "al-ma'idah": "ɐl mˈɑːʔɪdɐ",
 "an-nisa": "ɐn nɪsˈɑː", "ar-rahman": "ɐɹ ɹɐhmˈɑːn", "at-tawbah": "ɐt tˈɔːbɐ",
 "at-tariq": "ɐt tˈɑːɹɪq", "ya-sin": "jˈɑː sˈiːn", "yunus": "jˈuːnʊs",
 "sahih": "sɐhˈiːh", "al-bukhari": "ɐl bʊxˈɑːɹi", "bukhari": "bʊxˈɑːɹi",
 "amanah": "ɐmˈɑːnɐ", "zakat": "zɐkˈɑːt", "riba": "ɹˈɪbɑː",
 "sadaqah": "sˈɑdɐqɐ", "jariyah": "ʤˈɑːɹɪjɐ", "waqf": "wˈɑqf", "awqaf": "ɐwqˈɑːf",
 "mudarabah": "mʊdˈɑːɹɐbɐ", "musharakah": "mʊʃˈɑːɹɐkɐ", "murabaha": "mʊɹˈɑːbɐhɐ",
 "mudarib": "mʊdˈɑːɹɪb", "qard hasan": "qˈɑɹd hˈɑsɐn", "nisab": "nɪsˈɑːb",
 "fajr": "fˈɐʤɹ", "dhuhr": "ðˈʊhɹ", "asr": "ˈɑsɹ", "maghrib": "mˈɐɣɹɪb", "isha": "ɪʃˈɑː",
 "hijri": "hˈɪʤɹi", "umar": "ˈʊmɐɹ", "qarawiyyin": "qɐɹɐwˈɪjjiːn",
 "fatima al-fihri": "fˈɑːtɪmɐ ɐl fˈɪhɹi", "halal": "hɐlˈɑːl", "haram": "hɐɹˈɑːm",
 "mutawalli": "mʊtɐwˈɐlli", "hadith": "hɐdˈiːθ", "sunnah": "sˈʊnnɐ",
}
KEYS = sorted(AR, key=len, reverse=True)
PAT = re.compile(r"(?<![\w])(" + "|".join(re.escape(k) for k in KEYS) + r")(?![\w'])", re.I)

def prep(t):
    t = t.replace("ﷺ", " sallallahu alayhi wa sallam ")
    t = re.sub(r"(\d+):(\d+)(?:[–-](\d+))?", lambda m: f"{m.group(1)}, verse {m.group(2)}" + (f" to {m.group(3)}" if m.group(3) else ""), t)
    t = t.replace("˹", "").replace("˺", "").replace("’", "'")
    # hadith numbers read like "Muslim, number fifteen ninety-eight"
    t = re.sub(r"\b(Muslim|Bukhari|al-Bukhari)\s+(\d{2})(\d{2})\b", r"\1, number \2 \3", t)
    return re.sub(r"\s+", " ", t).strip()

def to_phonemes(tok, text, lang):
    text = prep(text)
    out = []; pos = 0
    for m in PAT.finditer(text):
        if m.start() > pos: out.append(("en", text[pos:m.start()]))
        out.append(("ar", AR[m.group(1).lower()]))
        pos = m.end()
    if pos < len(text): out.append(("en", text[pos:]))
    ph = ""
    for kind, chunk in out:
        if kind == "ar":
            piece = chunk
        else:
            lead = chunk[:1] in " " ; core = chunk.strip()
            if not core: ph += " "; continue
            tail = ""
            if re.search(r"(^|\s)a$", core, re.I):          # a lone "a" before an Arabic word = "uh", not the letter A
                core = core[:-1].rstrip(); tail = " ɐ"
            piece = (tok.phonemize(core, lang) if core else "") + tail
            if re.match(r"^[.,!?;:]", core): ph = ph.rstrip()
            elif lead and not ph.endswith(" "): ph += " "
        if kind == "ar" and ph and not ph.endswith(" "): ph += " "
        ph += piece
    return re.sub(r"\s+", " ", ph).strip()
