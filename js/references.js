/* =====================================================================
   references.js  —  ALL Qur'an verses and Hadith used in the project
   ---------------------------------------------------------------------
   FOR THE TEACHER: every Islamic reference shown anywhere in the app is
   stored in this one file, so it can be checked in one place.

   - Qur'an translations: Sahih International (English).
   - Hadith translations: as published on sunnah.com (English).
   - Each entry has a "link" so it can be verified online.

   ARABIC TEXT: deliberately NOT typed from memory. Each entry has an
   "arabic" field holding a clearly marked placeholder. To add it:
     1. Open the "link" (quran.com or sunnah.com).
     2. Copy the Arabic text.
     3. Paste it between the quotes, replacing the placeholder.
   The app automatically shows the Arabic once the placeholder is gone.
   ===================================================================== */

// Any arabic value that still starts with this marker is shown as a
// yellow "paste Arabic here" box instead of real text.
window.ARABIC_PLACEHOLDER = "[PASTE ARABIC";

window.REFERENCES = {

  /* ---------------- FINANCE: Riba (interest) & trade ---------------- */
  baqarah275: {
    type: "quran",
    ref: "Surah Al-Baqarah 2:275",
    translation: "Those who consume interest will stand ˹on Judgment Day˺ like those driven to madness by Satan’s touch. That is because they say, “Trade is no different than interest.” But Allah has permitted trading and forbidden interest. Whoever refrains—after having received warning from their Lord—may keep their previous gains, and their case is left to Allah. As for those who persist, it is they who will be the residents of the Fire. They will be there forever.",
    arabic: "ٱلَّذِينَ يَأْكُلُونَ ٱلرِّبَوٰا۟ لَا يَقُومُونَ إِلَّا كَمَا يَقُومُ ٱلَّذِى يَتَخَبَّطُهُ ٱلشَّيْطَـٰنُ مِنَ ٱلْمَسِّ ۚ ذَٰلِكَ بِأَنَّهُمْ قَالُوٓا۟ إِنَّمَا ٱلْبَيْعُ مِثْلُ ٱلرِّبَوٰا۟ ۗ وَأَحَلَّ ٱللَّهُ ٱلْبَيْعَ وَحَرَّمَ ٱلرِّبَوٰا۟ ۚ فَمَن جَآءَهُۥ مَوْعِظَةٌ مِّن رَّبِّهِۦ فَٱنتَهَىٰ فَلَهُۥ مَا سَلَفَ وَأَمْرُهُۥٓ إِلَى ٱللَّهِ ۖ وَمَنْ عَادَ فَأُو۟لَـٰٓئِكَ أَصْحَـٰبُ ٱلنَّارِ ۖ هُمْ فِيهَا خَـٰلِدُونَ",
    link: "https://quran.com/2/275",
    lesson: "Trade (buying and selling) is permitted; riba (interest) is forbidden."
  },
  baqarah276: {
    type: "quran",
    ref: "Surah Al-Baqarah 2:276",
    translation: "Allah has made interest fruitless and charity fruitful. And Allah does not like any ungrateful evildoer.",
    arabic: "يَمْحَقُ ٱللَّهُ ٱلرِّبَوٰا۟ وَيُرْبِى ٱلصَّدَقَـٰتِ ۗ وَٱللَّهُ لَا يُحِبُّ كُلَّ كَفَّارٍ أَثِيمٍ",
    link: "https://quran.com/2/276",
    lesson: "Interest removes blessing; charity brings increase."
  },
  baqarah277: {
    type: "quran",
    ref: "Surah Al-Baqarah 2:277",
    translation: "Indeed, those who believe, do good, establish prayer, and pay alms-tax will receive their reward from their Lord, and there will be no fear for them, nor will they grieve.",
    arabic: "إِنَّ ٱلَّذِينَ ءَامَنُوا۟ وَعَمِلُوا۟ ٱلصَّـٰلِحَـٰتِ وَأَقَامُوا۟ ٱلصَّلَوٰةَ وَءَاتَوُا۟ ٱلزَّكَوٰةَ لَهُمْ أَجْرُهُمْ عِندَ رَبِّهِمْ وَلَا خَوْفٌ عَلَيْهِمْ وَلَا هُمْ يَحْزَنُونَ",
    link: "https://quran.com/2/277",
    lesson: "Giving zakah is listed together with faith and prayer."
  },
  baqarah278: {
    type: "quran",
    ref: "Surah Al-Baqarah 2:278",
    translation: "O believers! Fear Allah, and give up outstanding interest if you are ˹true˺ believers.",
    arabic: "يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱتَّقُوا۟ ٱللَّهَ وَذَرُوا۟ مَا بَقِىَ مِنَ ٱلرِّبَوٰٓا۟ إِن كُنتُم مُّؤْمِنِينَ",
    link: "https://quran.com/2/278",
    lesson: "Believers must give up any interest still owed to them."
  },
  baqarah279: {
    type: "quran",
    ref: "Surah Al-Baqarah 2:279",
    translation: "If you do not, then beware of a war with Allah and His Messenger! But if you repent, you may retain your principal—neither inflicting nor suffering harm.",
    arabic: "فَإِن لَّمْ تَفْعَلُوا۟ فَأْذَنُوا۟ بِحَرْبٍ مِّنَ ٱللَّهِ وَرَسُولِهِۦ ۖ وَإِن تُبْتُمْ فَلَكُمْ رُءُوسُ أَمْوَٰلِكُمْ لَا تَظْلِمُونَ وَلَا تُظْلَمُونَ",
    link: "https://quran.com/2/279",
    lesson: "You may take back your original money (principal) only — no one is wronged."
  },
  tawbah60: {
    type: "quran",
    ref: "Surah At-Tawbah 9:60",
    translation: "Alms-tax is only for the poor and the needy, for those employed to administer it, for those whose hearts are attracted ˹to the faith˺, for ˹freeing˺ slaves, for those in debt, for Allah’s cause, and for ˹needy˺ travellers. ˹This is˺ an obligation from Allah. And Allah is All-Knowing, All-Wise.",
    arabic: "إِنَّمَا ٱلصَّدَقَـٰتُ لِلْفُقَرَآءِ وَٱلْمَسَـٰكِينِ وَٱلْعَـٰمِلِينَ عَلَيْهَا وَٱلْمُؤَلَّفَةِ قُلُوبُهُمْ وَفِى ٱلرِّقَابِ وَٱلْغَـٰرِمِينَ وَفِى سَبِيلِ ٱللَّهِ وَٱبْنِ ٱلسَّبِيلِ ۖ فَرِيضَةً مِّنَ ٱللَّهِ ۗ وَٱللَّهُ عَلِيمٌ حَكِيمٌ",
    link: "https://quran.com/9/60",
    lesson: "The eight categories of people who may receive zakah."
  },
  baqarah261: {
    type: "quran",
    ref: "Surah Al-Baqarah 2:261",
    translation: "The example of those who spend their wealth in the cause of Allah is that of a grain that sprouts into seven ears, each bearing one hundred grains. And Allah multiplies ˹the reward even more˺ to whoever He wills. For Allah is All-Bountiful, All-Knowing.",
    arabic: "إِنَّ ٱلَّذِينَ كَفَرُوا۟ وَمَاتُوا۟ وَهُمْ كُفَّارٌ أُو۟لَـٰٓئِكَ عَلَيْهِمْ لَعْنَةُ ٱللَّهِ وَٱلْمَلَـٰٓئِكَةِ وَٱلنَّاسِ أَجْمَعِينَ",
    link: "https://quran.com/2/261",
    lesson: "Charity is like one seed growing into 700 grains."
  },
  muslim1598: {
    type: "hadith",
    ref: "Sahih Muslim 1598",
    translation: "Jabir said that Allah's Messenger (ﷺ) cursed the accepter of interest and its payer, and one who records it, and the two witnesses, and he said: They are all equal",
    arabic: "حَدَّثَنَا مُحَمَّدُ بْنُ الصَّبَّاحِ، وَزُهَيْرُ بْنُ حَرْبٍ، وَعُثْمَانُ بْنُ أَبِي شَيْبَةَ، قَالُوا حَدَّثَنَا هُشَيْمٌ، أَخْبَرَنَا أَبُو الزُّبَيْرِ، عَنْ جَابِرٍ، قَالَ لَعَنَ رَسُولُ اللَّهِ صلى الله عليه وسلم آكِلَ الرِّبَا وَمُوكِلَهُ وَكَاتِبَهُ وَشَاهِدَيْهِ وَقَالَ هُمْ سَوَاءٌ .",
    link: "https://sunnah.com/muslim:1598",
    lesson: "Everyone involved in an interest deal shares the sin — taker, payer, writer and witnesses."
  },
  nisa29: {
    type: "quran",
    ref: "Surah An-Nisa 4:29",
    translation: "O believers! Do not devour one another’s wealth illegally, but rather trade by mutual consent. And do not kill ˹each other or˺ yourselves. Surely Allah is ever Merciful to you.",
    arabic: "يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ لَا تَأْكُلُوٓا۟ أَمْوَٰلَكُم بَيْنَكُم بِٱلْبَـٰطِلِ إِلَّآ أَن تَكُونَ تِجَـٰرَةً عَن تَرَاضٍ مِّنكُمْ ۚ وَلَا تَقْتُلُوٓا۟ أَنفُسَكُمْ ۚ إِنَّ ٱللَّهَ كَانَ بِكُمْ رَحِيمًا",
    link: "https://quran.com/4/29",
    lesson: "Business must be fair and by mutual consent of both sides."
  },
  maidah90: {
    type: "quran",
    ref: "Surah Al-Ma'idah 5:90",
    translation: "O you who have believed, indeed, intoxicants, gambling, [sacrificing on] stone alters [to other than Allah], and divining arrows are but defilement from the work of Satan, so avoid it that you may be successful.",
    arabic: "يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوٓا۟ إِنَّمَا ٱلْخَمْرُ وَٱلْمَيْسِرُ وَٱلْأَنصَابُ وَٱلْأَزْلَـٰمُ رِجْسٌ مِّنْ عَمَلِ ٱلشَّيْطَـٰنِ فَٱجْتَنِبُوهُ لَعَلَّكُمْ تُفْلِحُونَ",
    link: "https://quran.com/5/90",
    lesson: "Alcohol and gambling are forbidden — so businesses based on them fail halal screening."
  },
  baqarah173: {
    type: "quran",
    ref: "Surah Al-Baqarah 2:173 (opening part)",
    translation: "O believers! Intoxicants, gambling, idols, and drawing lots for decisions are all evil of Satan’s handiwork. So shun them so you may be successful",
    arabic: "إِنَّمَا حَرَّمَ عَلَيْكُمُ ٱلْمَيْتَةَ وَٱلدَّمَ وَلَحْمَ ٱلْخِنزِيرِ وَمَآ أُهِلَّ بِهِۦ لِغَيْرِ ٱللَّهِ ۖ فَمَنِ ٱضْطُرَّ غَيْرَ بَاغٍ وَلَا عَادٍ فَلَآ إِثْمَ عَلَيْهِ ۚ إِنَّ ٱللَّهَ غَفُورٌ رَّحِيمٌ",
    link: "https://quran.com/2/173",
    lesson: "Pork is forbidden — so a pork-based business fails halal screening."
  },

  /* ---------------- WAQF: ongoing charity ---------------- */
  muslim1631: {
    type: "hadith",
    ref: "Sahih Muslim 1631",
    translation: "Abu Huraira (Allah be pleased with him) reported Allah's Messenger (ﷺ) as saying: When a man dies, his acts come to an end, but three, recurring charity, or knowledge (by which people) benefit, or a pious child, who prays for him (for the deceased).",
    arabic: "حَدَّثَنَا يَحْيَى بْنُ أَيُّوبَ، وَقُتَيْبَةُ، - يَعْنِي ابْنَ سَعِيدٍ - وَابْنُ حُجْرٍ قَالُوا حَدَّثَنَا إِسْمَاعِيلُ، - هُوَ ابْنُ جَعْفَرٍ - عَنِ الْعَلاَءِ، عَنْ أَبِيهِ، عَنْ أَبِي هُرَيْرَةَ، أَنَّ رَسُولَ اللَّهِ صلى الله عليه وسلم قَالَ \" إِذَا مَاتَ الإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلاَّ مِنْ ثَلاَثَةٍ إِلاَّ مِنْ صَدَقَةٍ جَارِيَةٍ أَوْ عِلْمٍ يُنْتَفَعُ بِهِ أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ \" .",
    link: "https://sunnah.com/muslim:1631",
    lesson: "Sadaqah jariyah (ongoing charity) keeps earning reward even after death."
  },
  bukhari2737: {
    type: "hadith",
    ref: "Sahih al-Bukhari 2737",
    translation: "Narrated Ibn `Umar:Umar bin Khattab got some land in Khaibar and he went to the Prophet (ﷺ) to consult him about it saying, \"O Allah's Messenger (ﷺ) I got some land in Khaibar better than which I have never had, what do you suggest that I do with it?\" The Prophet (ﷺ) said, \"If you like you can give the land as endowment and give its fruits in charity.\" So `Umar gave it in charity as an endowment on the condition that would not be sold nor given to anybody as a present and not to be inherited, but its yield would be given in charity to the poor people, to the Kith and kin, for freeing slaves, for Allah's Cause, to the travelers and guests; and that there would be no harm if the guardian of the endowment ate from it according to his need with good intention, and fed others without storing it for the future.",
    arabic: "حَدَّثَنَا قُتَيْبَةُ بْنُ سَعِيدٍ، حَدَّثَنَا مُحَمَّدُ بْنُ عَبْدِ اللَّهِ الأَنْصَارِيُّ، حَدَّثَنَا ابْنُ عَوْنٍ، قَالَ أَنْبَأَنِي نَافِعٌ، عَنِ ابْنِ عُمَرَ ـ رضى الله عنهما ـ أَنَّ عُمَرَ بْنَ الْخَطَّابِ، أَصَابَ أَرْضًا بِخَيْبَرَ، فَأَتَى النَّبِيَّ صلى الله عليه وسلم يَسْتَأْمِرُهُ فِيهَا، فَقَالَ يَا رَسُولَ اللَّهِ، إِنِّي أَصَبْتُ أَرْضًا بِخَيْبَرَ، لَمْ أُصِبْ مَالاً قَطُّ أَنْفَسَ عِنْدِي مِنْهُ، فَمَا تَأْمُرُ بِهِ قَالَ \" إِنْ شِئْتَ حَبَسْتَ أَصْلَهَا، وَتَصَدَّقْتَ بِهَا \". قَالَ فَتَصَدَّقَ بِهَا عُمَرُ أَنَّهُ لاَ يُبَاعُ وَلاَ يُوهَبُ وَلاَ يُورَثُ، وَتَصَدَّقَ بِهَا فِي الْفُقَرَاءِ وَفِي الْقُرْبَى، وَفِي الرِّقَابِ، وَفِي سَبِيلِ اللَّهِ، وَابْنِ السَّبِيلِ، وَالضَّيْفِ، لاَ جُنَاحَ عَلَى مَنْ وَلِيَهَا أَنْ يَأْكُلَ مِنْهَا بِالْمَعْرُوفِ، وَيُطْعِمَ غَيْرَ مُتَمَوِّلٍ. قَالَ فَحَدَّثْتُ بِهِ ابْنَ سِيرِينَ فَقَالَ غَيْرَ مُتَأَثِّلٍ مَالاً",
    link: "https://sunnah.com/bukhari:2737",
    lesson: "The first waqf model: keep the asset, give away its benefit. Never sold, gifted or inherited."
  },
  imran92: {
    type: "quran",
    ref: "Surah Aal-Imran 3:92",
    translation: "You will never achieve righteousness until you donate some of what you cherish. And whatever you give is certainly well known to Allah.",
    arabic: "لَن تَنَالُوا۟ ٱلْبِرَّ حَتَّىٰ تُنفِقُوا۟ مِمَّا تُحِبُّونَ ۚ وَمَا تُنفِقُوا۟ مِن شَىْءٍ فَإِنَّ ٱللَّهَ بِهِۦ عَلِيمٌ",
    link: "https://quran.com/3/92",
    lesson: "True righteousness means giving from what you love most."
  },

  /* ---------------- SKY SHIELD: the protected ceiling ---------------- */
  anbiya32: {
    type: "quran",
    ref: "Surah Al-Anbiya 21:32",
    translation: "And We have made the sky a well-protected canopy, still they turn away from its signs.",
    arabic: "وَجَعَلْنَا ٱلسَّمَآءَ سَقْفًا مَّحْفُوظًا ۖ وَهُمْ عَنْ ءَايَـٰتِهَا مُعْرِضُونَ",
    link: "https://quran.com/21/32",
    lesson: "The sky is described as a protected ceiling — a sign to reflect on."
  },
  tariq11: {
    type: "quran",
    ref: "Surah At-Tariq 86:11",
    translation: "By the sky with its recurring cycles,",
    arabic: "وَٱلسَّمَآءِ ذَاتِ ٱلرَّجْعِ",
    link: "https://quran.com/86/11",
    lesson: "Allah swears by the sky that 'returns' — classical scholars explained this as returning rain again and again."
  },
  baqarah22: {
    type: "quran",
    ref: "Surah Al-Baqarah 2:22",
    translation: "˹He is the One˺ Who has made the earth a place of settlement for you and the sky a canopy; and sends down rain from the sky, causing fruits to grow as a provision for you. So do not knowingly set up equals to Allah ˹in worship˺.",
    arabic: "ٱلَّذِى جَعَلَ لَكُمُ ٱلْأَرْضَ فِرَٰشًا وَٱلسَّمَآءَ بِنَآءً وَأَنزَلَ مِنَ ٱلسَّمَآءِ مَآءً فَأَخْرَجَ بِهِۦ مِنَ ٱلثَّمَرَٰتِ رِزْقًا لَّكُمْ ۖ فَلَا تَجْعَلُوا۟ لِلَّهِ أَندَادًا وَأَنتُمْ تَعْلَمُونَ",
    link: "https://quran.com/2/22",
    lesson: "The earth as a resting place and the sky as a ceiling are blessings for us."
  },

  /* ---------------- COSMIC CLOCK: sun, moon & time ---------------- */
  yasin38: {
    type: "quran",
    ref: "Surah Ya-Sin 36:38",
    translation: "The sun travels for its fixed term. That is the design of the Almighty, All-Knowing.",
    arabic: "وَٱلشَّمْسُ تَجْرِى لِمُسْتَقَرٍّ لَّهَا ۚ ذَٰلِكَ تَقْدِيرُ ٱلْعَزِيزِ ٱلْعَلِيمِ",
    link: "https://quran.com/36/38",
    lesson: "The sun itself is moving on a set course."
  },
  yasin39: {
    type: "quran",
    ref: "Surah Ya-Sin 36:39",
    translation: "As for the moon, We have ordained ˹precise˺ phases for it, until it ends up ˹looking˺ like an old, curved palm stalk.",
    arabic: "وَٱلْقَمَرَ قَدَّرْنَـٰهُ مَنَازِلَ حَتَّىٰ عَادَ كَٱلْعُرْجُونِ ٱلْقَدِيمِ",
    link: "https://quran.com/36/39",
    lesson: "The moon has phases, ending as a thin curved crescent like an old date stalk."
  },
  yasin40: {
    type: "quran",
    ref: "Surah Ya-Sin 36:40",
    translation: "It is not for the sun to catch up with the moon, nor does the night outrun the day. Each is travelling in an orbit of their own.",
    arabic: "لَا ٱلشَّمْسُ يَنۢبَغِى لَهَآ أَن تُدْرِكَ ٱلْقَمَرَ وَلَا ٱلَّيْلُ سَابِقُ ٱلنَّهَارِ ۚ وَكُلٌّ فِى فَلَكٍ يَسْبَحُونَ",
    link: "https://quran.com/36/40",
    lesson: "Each body moves in its own orbit."
  },
  yunus5: {
    type: "quran",
    ref: "Surah Yunus 10:5",
    translation: "He is the One Who made the sun a radiant source and the moon a reflected light, with precisely ordained phases, so that you may know the number of years and calculation ˹of time˺. Allah did not create all this except for a purpose. He makes the signs clear for people of knowledge.",
    arabic: "هُوَ ٱلَّذِى جَعَلَ ٱلشَّمْسَ ضِيَآءً وَٱلْقَمَرَ نُورًا وَقَدَّرَهُۥ مَنَازِلَ لِتَعْلَمُوا۟ عَدَدَ ٱلسِّنِينَ وَٱلْحِسَابَ ۚ مَا خَلَقَ ٱللَّهُ ذَٰلِكَ إِلَّا بِٱلْحَقِّ ۚ يُفَصِّلُ ٱلْـَٔايَـٰتِ لِقَوْمٍ يَعْلَمُونَ",
    link: "https://quran.com/10/5",
    lesson: "Sun = shining light; moon = derived (reflected) light; phases help us count time."
  },
  rahman5: {
    type: "quran",
    ref: "Surah Ar-Rahman 55:5",
    translation: "The sun and the moon ˹travel˺ with precision.",
    arabic: "ٱلشَّمْسُ وَٱلْقَمَرُ بِحُسْبَانٍ",
    link: "https://quran.com/55/5",
    lesson: "Their movements are exact — which is why we can calculate prayer times and calendars."
  },
  nisa103: {
    type: "quran",
    ref: "Surah An-Nisa 4:103 (closing part)",
    translation: "When the prayers are over, remember Allah—whether you are standing, sitting, or lying down. But when you are secure, establish regular prayers. Indeed, performing prayers is a duty on the believers at the appointed times.",
    arabic: "فَإِذَا قَضَيْتُمُ ٱلصَّلَوٰةَ فَٱذْكُرُوا۟ ٱللَّهَ قِيَـٰمًا وَقُعُودًا وَعَلَىٰ جُنُوبِكُمْ ۚ فَإِذَا ٱطْمَأْنَنتُمْ فَأَقِيمُوا۟ ٱلصَّلَوٰةَ ۚ إِنَّ ٱلصَّلَوٰةَ كَانَتْ عَلَى ٱلْمُؤْمِنِينَ كِتَـٰبًا مَّوْقُوتًا",
    link: "https://quran.com/4/103",
    lesson: "Prayers have fixed times — linked to the sun's position."
  },
  baqarah189: {
    type: "quran",
    ref: "Surah Al-Baqarah 2:189 (opening part)",
    translation: "They ask you ˹O Prophet˺ about the phases of the moon. Say, “They are a means for people to determine time and pilgrimage.” Righteousness is not in entering your houses from the back doors. Rather, righteousness is to be mindful ˹of Allah˺. So enter your homes through their ˹proper˺ doors, and be mindful of Allah so you may be successful",
    arabic: "۞ يَسْـَٔلُونَكَ عَنِ ٱلْأَهِلَّةِ ۖ قُلْ هِىَ مَوَٰقِيتُ لِلنَّاسِ وَٱلْحَجِّ ۗ وَلَيْسَ ٱلْبِرُّ بِأَن تَأْتُوا۟ ٱلْبُيُوتَ مِن ظُهُورِهَا وَلَـٰكِنَّ ٱلْبِرَّ مَنِ ٱتَّقَىٰ ۗ وَأْتُوا۟ ٱلْبُيُوتَ مِنْ أَبْوَٰبِهَا ۚ وَٱتَّقُوا۟ ٱللَّهَ لَعَلَّكُمْ تُفْلِحُونَ",
    link: "https://quran.com/2/189",
    lesson: "New moons mark the months — the basis of the Hijri calendar."
  },

  /* ---------------- OCEAN: darkness & the two seas ---------------- */
  nur40: {
    type: "quran",
    ref: "Surah An-Nur 24:40",
    translation: "Or ˹their deeds are˺ like the darkness in a deep sea, covered by waves upon waves, topped by ˹dark˺ clouds. Darkness upon darkness! If one stretches out their hand, they can hardly see it. And whoever Allah does not bless with light will have no light!",
    arabic: "أَوْ كَظُلُمَـٰتٍ فِى بَحْرٍ لُّجِّىٍّ يَغْشَىٰهُ مَوْجٌ مِّن فَوْقِهِۦ مَوْجٌ مِّن فَوْقِهِۦ سَحَابٌ ۚ ظُلُمَـٰتٌۢ بَعْضُهَا فَوْقَ بَعْضٍ إِذَآ أَخْرَجَ يَدَهُۥ لَمْ يَكَدْ يَرَىٰهَا ۗ وَمَن لَّمْ يَجْعَلِ ٱللَّهُ لَهُۥ نُورًا فَمَا لَهُۥ مِن نُّورٍ",
    link: "https://quran.com/24/40",
    lesson: "Layers of darkness in a deep sea, waves upon waves — a parable for life without guidance."
  },
  rahman19: {
    type: "quran",
    ref: "Surah Ar-Rahman 55:19",
    translation: "He merges the two bodies of ˹fresh and salt˺ water,",
    arabic: "مَرَجَ ٱلْبَحْرَيْنِ يَلْتَقِيَانِ",
    link: "https://quran.com/55/19",
    lesson: "Two bodies of water meet."
  },
  rahman20: {
    type: "quran",
    ref: "Surah Ar-Rahman 55:20",
    translation: "yet between them is a barrier they never cross.",
    arabic: "بَيْنَهُمَا بَرْزَخٌ لَّا يَبْغِيَانِ",
    link: "https://quran.com/55/20",
    lesson: "A barrier keeps each one's character."
  },
  furqan53: {
    type: "quran",
    ref: "Surah Al-Furqan 25:53",
    translation: "And He is the One Who merges the two bodies of water: one fresh and palatable and the other salty and bitter, placing between them a barrier they cannot cross.",
    arabic: " وَهُوَ ٱلَّذِى مَرَجَ ٱلْبَحْرَيْنِ هَـٰذَا عَذْبٌ فُرَاتٌ وَهَـٰذَا مِلْحٌ أُجَاجٌ وَجَعَلَ بَيْنَهُمَا بَرْزَخًا وَحِجْرًا مَّحْجُورًا",
    link: "https://quran.com/25/53",
    lesson: "Fresh and salty water meet with a barrier between them."
  }
};
