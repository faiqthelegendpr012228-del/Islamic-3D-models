/* =====================================================================
   myths-data.js  —  "Myth or Fact?" cards for each exhibit
   fact: true = FACT, false = MYTH.  ref: where the answer comes from.
   ar: the same card in Arabic (used by the Arabic interface).
   FOR THE TEACHER: please check these, like the quiz questions.
   ===================================================================== */
window.MYTHS = {
  atm: [
    { s: "Zakat is due on any amount of savings, even a very small amount.", fact: false,
      why: "Zakat is only due when savings stay at or above the nisab (about the value of 85 g of gold) for a full lunar year. Then 2.5% is paid.",
      ref: "Fiqh of zakat · Surah At-Tawbah 9:60",
      ar: { s: "تجب الزكاة في أي مبلغ من المدخرات، مهما كان صغيرا.", why: "لا تجب الزكاة إلا إذا بلغ المال النصاب، وهو قيمة نحو خمسة وثمانين غراما من الذهب، وحال عليه الحول، فيُخرج اثنان ونصف بالمئة." } },
    { s: "Giving charity does not decrease your wealth.", fact: true,
      why: "The Prophet ﷺ said: \"Charity does not decrease wealth.\" Allah puts blessing (barakah) in what remains.",
      ref: "Sahih Muslim 2588",
      ar: { s: "الصدقة لا تُنقص المال.", why: "قال النبي ﷺ: «مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ»، ويجعل الله البركة فيما بقي." } },
    { s: "Buying a car through Murabaha is just interest with a different name.", fact: false,
      why: "In Murabaha the bank really buys and owns the car first, carrying the risk of ownership, then sells it at a fixed price agreed in advance. The price never grows if you pay late. With interest, the debt itself grows.",
      ref: "Surah Al-Baqarah 2:275",
      ar: { s: "شراء سيارة بالمرابحة هو ربا باسم آخر.", why: "في المرابحة يشتري البنك السيارة ويملكها أولا ويتحمل مخاطرة الملك، ثم يبيعها بسعر ثابت متفق عليه، ولا يزيد السعر عند التأخر. أما في الربا فيزيد الدين نفسه." } },
    { s: "The one who pays interest is also blamed, not only the one who takes it.", fact: true,
      why: "The Prophet ﷺ cursed the one who takes riba, the one who pays it, the one who writes it and the two witnesses, and said they are all equal.",
      ref: "Sahih Muslim 1598",
      ar: { s: "دافع الربا ملوم أيضا، وليس آخذه فقط.", why: "لعن النبي ﷺ آكل الربا وموكله وكاتبه وشاهديه، وقال: هم سواء." } }
  ],
  sky: [
    { s: "The Qur'an is a science textbook.", fact: false,
      why: "The Qur'an is a book of guidance. It points to the natural world as signs to reflect on. That is why this exhibit shows the science separately from the verses.",
      ref: "Surah Al-Anbiya 21:32",
      ar: { s: "القرآن كتاب علوم.", why: "القرآن كتاب هداية، يلفت النظر إلى الكون آياتٍ للتفكر. ولهذا نعرض العلم منفصلا عن الآيات في هذا المعرض." } },
    { s: "Most meteors burn up before they reach the ground.", fact: true,
      why: "Meteors hit the atmosphere at huge speed. Friction heats them until they glow and burn up, mostly in the mesosphere, 50 to 85 km up.",
      ref: "Science: the mesosphere",
      ar: { s: "معظم الشهب تحترق قبل أن تصل إلى الأرض.", why: "تصطدم الشهب بالغلاف الجوي بسرعة هائلة فتسخن وتتوهج وتحترق، وغالبا في طبقة الميزوسفير على ارتفاع خمسين إلى خمسة وثمانين كيلومترا." } },
    { s: "The ozone layer blocks all of the Sun's ultraviolet (UV) rays.", fact: false,
      why: "Ozone absorbs all UV-C and most UV-B, but much UV-A still reaches us. That is why sunscreen and the UV index still matter.",
      ref: "Science: the stratosphere",
      ar: { s: "طبقة الأوزون تحجب كل الأشعة فوق البنفسجية.", why: "يمتص الأوزون كل الأشعة من نوع سي ومعظم نوع بي، لكن كثيرا من نوع أ يصل إلينا، ولهذا نحتاج إلى واقي الشمس." } }
  ],
  waqf: [
    { s: "Only rich people can make a waqf.", fact: false,
      why: "A waqf can be small: books for a library, a tree, a water cooler, or a share in a group waqf. What matters is that the asset stays and its benefit keeps giving.",
      ref: "Sahih Muslim 1631",
      ar: { s: "الأغنياء فقط يستطيعون الوقف.", why: "يمكن أن يكون الوقف صغيرا: كتب لمكتبة، أو شجرة، أو برّاد ماء، أو حصة في وقف جماعي. المهم أن يبقى الأصل ويستمر نفعه." } },
    { s: "A family can sell a waqf if they need money.", fact: false,
      why: "When Umar made his land a waqf, the condition was that it could never be sold, given away or inherited. Only its yield is given in charity.",
      ref: "Sahih al-Bukhari 2737",
      ar: { s: "يجوز للعائلة بيع الوقف إذا احتاجت إلى المال.", why: "لما أوقف عمر أرضه اشترط ألا تباع ولا توهب ولا تورث، وإنما يُتصدّق بثمرها." } },
    { s: "One of the oldest universities still teaching today began as a waqf.", fact: true,
      why: "Al-Qarawiyyin in Fez, Morocco, was founded in 859 CE by Fatima al-Fihri, who spent her inheritance on it. It is still teaching students today.",
      ref: "History: al-Qarawiyyin, 859 CE",
      ar: { s: "من أقدم الجامعات التي ما زالت تعلّم اليوم جامعةٌ بدأت وقفا.", why: "أسست فاطمة الفهرية جامعة القرويين في فاس سنة ٨٥٩ م من ميراثها، وما زالت تعلّم الطلاب حتى اليوم." } }
  ],
  clock: [
    { s: "The Moon makes its own light.", fact: false,
      why: "The Moon only reflects sunlight. The Qur'an calls the Sun a shining light (diya') and the Moon a derived light (nur).",
      ref: "Surah Yunus 10:5",
      ar: { s: "القمر يصنع ضوءه بنفسه.", why: "القمر يعكس ضوء الشمس فقط، والقرآن يصف الشمس بأنها ضياء والقمر بأنه نور." } },
    { s: "Each Islamic (Hijri) month starts with the new crescent moon.", fact: true,
      why: "The new crescent (hilal) seen after sunset marks the start of the month. The new moons are measurements of time for people.",
      ref: "Surah Al-Baqarah 2:189",
      ar: { s: "يبدأ كل شهر هجري بالهلال الجديد.", why: "رؤية الهلال بعد الغروب تعلن بداية الشهر، والأهلة مواقيت للناس." } },
    { s: "Prayer times stay the same all year round.", fact: false,
      why: "Prayer times follow the Sun's position, so they shift every day with the seasons and are different in every city.",
      ref: "Surah An-Nisa 4:103",
      ar: { s: "أوقات الصلاة ثابتة طوال السنة.", why: "أوقات الصلاة تتبع موقع الشمس، فتتغير كل يوم مع الفصول وتختلف من مدينة إلى أخرى." } }
  ],
  market: [
    { s: "Any business profit is halal as long as the business is legal in your country.", fact: false,
      why: "The business itself must be halal (no gambling, alcohol or interest), and trade must be fair and by mutual consent.",
      ref: "Surah Al-Ma'idah 5:90 · Surah An-Nisa 4:29",
      ar: { s: "كل ربح تجاري حلال ما دام النشاط قانونيا في بلدك.", why: "يجب أن يكون النشاط نفسه حلالا، بلا قمار ولا خمر ولا ربا، وأن تكون التجارة عادلة عن تراض." } },
    { s: "In Musharakah, losses are shared by how much money each partner invested.", fact: true,
      why: "Profit can be split by any ratio the partners agree on, but losses are always shared in proportion to each partner's capital.",
      ref: "Fiqh of musharakah",
      ar: { s: "في المشاركة تُقسم الخسارة حسب ما استثمره كل شريك.", why: "يجوز تقسيم الربح بأي نسبة يتفق عليها الشركاء، أما الخسارة فتقسم دائما حسب حصة كل شريك من رأس المال." } },
    { s: "Islam forbids making a profit.", fact: false,
      why: "Islam encourages honest trade and profit. What it forbids is riba: a guaranteed extra on a loan with no shared risk.",
      ref: "Surah Al-Baqarah 2:275",
      ar: { s: "الإسلام يحرّم الربح.", why: "الإسلام يشجّع التجارة الصادقة والربح، وإنما يحرّم الربا: الزيادة المضمونة على القرض دون مشاركة في المخاطرة." } }
  ],
  ocean: [
    { s: "Sunlight reaches the bottom of the deep ocean.", fact: false,
      why: "Almost no sunlight gets below about 200 m, and below about 1,000 m it is completely dark: \"darknesses, one above another\".",
      ref: "Surah An-Nur 24:40",
      ar: { s: "ضوء الشمس يصل إلى قاع المحيط العميق.", why: "لا يكاد ضوء الشمس يتجاوز مئتي متر، وبعد نحو ألف متر يكون الظلام تاما: ظلمات بعضها فوق بعض." } },
    { s: "Red is the first colour to disappear as you dive deeper.", fact: true,
      why: "Water absorbs red light first (by about 10 m), then orange and yellow. Blue travels deepest, which is why the deep sea looks blue.",
      ref: "Science: light in water",
      ar: { s: "اللون الأحمر أول لون يختفي عند الغوص.", why: "يمتص الماء الضوء الأحمر أولا عند نحو عشرة أمتار، ثم البرتقالي والأصفر، ويصل الأزرق إلى أعمق مسافة." } },
    { s: "Where a river meets the sea, the fresh and salty water mix completely straight away.", fact: false,
      why: "A boundary zone forms where they meet, and the waters mix only gradually. The Qur'an describes a barrier (barzakh) between them.",
      ref: "Surah Al-Furqan 25:53",
      ar: { s: "عندما يلتقي النهر بالبحر يختلط الماء العذب بالمالح فورا وبشكل كامل.", why: "تتكوّن منطقة فاصلة عند التقائهما، ولا يختلطان إلا تدريجيا، ويصف القرآن بينهما برزخا." } }
  ]
};
