/* =====================================================================
   content.js  —  All the TEXT for the six topics
   ---------------------------------------------------------------------
   Each topic object holds:
     id, title, subtitle, category, icon, accent colour
     refs       → ids from references.js shown on the "References" tab
     info       → text for each hotspot / info panel. Every entry keeps
                  the SCIENCE / EXPLANATION ("text") separate from the
                  ISLAMIC REFERENCES ("refs"), so verses are never mixed
                  up with scientific claims.
     realLife   → 4 everyday examples for students and families
     steps      → Presentation Mode (8 steps, 2 per member, ~15 s each).
                  "action" is the name of a function in that topic's
                  scene file (js/scenes/...) that moves the 3D model.
     quiz       → multiple-choice questions (answer = index of correct option)
     features   → 3–5 key features printed on the info card
   ===================================================================== */

window.TOPICS = [

/* =================================================================== */
/* 1. HALAL FINANCE ATM                                                */
/* =================================================================== */
{
  id: "atm",
  category: "Financial Contracts",
  icon: "🏧",
  accent: "#2fbf9b",
  title: "Halal Finance ATM",
  subtitle: "Zakat, Sadaqah and the difference between trade and riba",
  howTo: "Click the glowing keys on the ATM (or the buttons on the right) to open each screen.",
  refs: ["baqarah275", "baqarah276", "baqarah278", "baqarah279", "tawbah60", "muslim1598", "baqarah261"],
  info: {
    atm: {
      title: "Why an ATM?",
      text: "<p>An ATM is where everyday money decisions happen. In Islam, wealth belongs to Allah and we are its trustees (<b>amanah</b>). This ATM checks every action against Islamic teachings: paying <b>zakat</b>, avoiding <b>riba</b> (interest), and giving <b>sadaqah</b> (voluntary charity).</p>",
      refs: ["baqarah275"]
    },
    zakat: {
      title: "Zakat — the 2.5% purification",
      text: "<p><b>Zakat</b> is one of the five pillars of Islam. A Muslim whose savings stay at or above the <b>nisab</b> (the value of about 85 g of gold, or 595 g of silver) for one full lunar year pays <b>2.5%</b> of those savings.</p><p>It is paid to the eight groups named in Surah At-Tawbah 9:60.</p>",
      refs: ["tawbah60", "baqarah277"]
    },
    riba: {
      title: "Riba Check — why interest is forbidden",
      text: "<p><b>Riba</b> means any guaranteed extra charged on a loan just for time. The lender takes no risk, and the borrower's debt can keep growing, even when they are struggling.</p><p>Islam permits <b>trade</b>: real goods, a fair price agreed in advance, and shared risk. In a <b>Murabaha</b> sale the bank actually buys the item and sells it to you at a fixed price, which never grows if you pay late. A <b>Qard Hasan</b> (goodly loan) means you only pay back what you borrowed.</p>",
      refs: ["baqarah275", "baqarah278", "baqarah279", "muslim1598"]
    },
    sadaqah: {
      title: "Sadaqah — giving that grows",
      text: "<p><b>Sadaqah</b> is voluntary charity: any amount, any time. Unlike zakat it has no fixed rate. The Qur'an compares it to one seed that grows into seven ears with a hundred grains each, which is <b>700 times</b>.</p><p>Press a cause on the ATM and watch your coins travel to it.</p>",
      refs: ["baqarah261", "baqarah276"]
    },
    sort: {
      title: "Halal or Haram? Sorting game",
      text: "<p>Decide whether each transaction is <b>halal</b> (permitted) or <b>haram</b> (forbidden). Think about whether it involves interest, gambling, cheating, or forbidden goods.</p>",
      refs: ["baqarah275", "maidah90"]
    }
  },
  realLife: [
    { icon: "🎁", title: "Eid money & savings", text: "If your family's savings stay above the nisab for a lunar year, 2.5% is due as zakat. Many families calculate it every Ramadan using a calculator like this one." },
    { icon: "📱", title: "Buying a phone on instalments", text: "A credit card that adds interest and late fees is riba. A halal option is a fixed-price instalment plan where the total never increases, or simply saving up first." },
    { icon: "🪙", title: "Small daily sadaqah", text: "Even a small coin in the mosque box, buying lunch for a classmate, or donating online for a water project counts. Small regular giving builds a habit of generosity." },
    { icon: "🎰", title: "Avoiding gambling-style games", text: "Betting apps and 'pay to win a random prize' games are based on chance and loss, like gambling. Earning through real work and fair trade is the halal path." }
  ],
  steps: [
    { member: 1, title: "Welcome to the Halal Finance ATM", action: "intro",
      say: "Assalamu alaikum! Our model is a Halal Finance ATM. In Islam, money is an amanah, a trust from Allah. Every button on this machine shows how a Muslim should use that trust." },
    { member: 1, title: "Trade is permitted, riba is forbidden", action: "showRibaVerse",
      say: "The key verse is Surah Al-Baqarah 2:275: 'Allah has permitted trade and has forbidden interest.' Our whole ATM is built around this difference." },
    { member: 2, title: "The Zakat calculator", action: "zakatDemo",
      say: "This is our Zakat calculator. We enter savings, gold and debts. If the total is above the nisab for a full lunar year, 2.5% is due. Here it calculates the zakat instantly." },
    { member: 2, title: "Who receives zakat?", action: "zakatRecipients",
      say: "Surah At-Tawbah 9:60 names eight groups who receive zakat, including the poor, the needy, people in debt and stranded travellers. Zakat is not a gift; it is their right." },
    { member: 3, title: "The Riba Check", action: "ribaDemo",
      say: "The Riba Check compares an interest loan with a halal Murabaha sale. Watch the interest bar: if you pay late it keeps growing. The halal price is fixed and never grows." },
    { member: 3, title: "Everyone involved shares the sin", action: "ribaHadith",
      say: "In Sahih Muslim 1598, the Prophet ﷺ cursed the one who takes interest, the one who pays it, the one who writes it and the two witnesses, and said they are all equal." },
    { member: 4, title: "Sadaqah: giving that grows", action: "sadaqahDemo",
      say: "Now the Sadaqah button. Each coin flies to a cause, like clean water or food. Surah Al-Baqarah 2:261 says charity is like one seed growing into seven hundred grains." },
    { member: 4, title: "Halal or Haram? Try it!", action: "sortDemo",
      say: "Finally, our sorting game. Is this transaction halal or haram? We will now test you with a quick quiz. Thank you for listening!" }
  ],
  quiz: [
    { q: "What percentage of eligible savings is paid as zakat?", options: ["1%", "2.5%", "10%", "20%"], answer: 1, explain: "Zakat is 2.5% of savings held at or above the nisab for one lunar year." },
    { q: "Surah Al-Baqarah 2:275 says Allah has permitted ___ and forbidden ___.", options: ["Interest … trade", "Trade … interest", "Loans … gifts", "Saving … spending"], answer: 1, explain: "\"Allah has permitted trade and has forbidden interest.\"" },
    { q: "According to Sahih Muslim 1598, who shares the curse of riba?", options: ["Only the person who takes interest", "Only the bank", "The taker, the payer, the writer and the two witnesses", "Nobody if it is a small amount"], answer: 2, explain: "The Prophet ﷺ cursed all of them and said they are all equal." },
    { q: "Which of these is NOT one of the zakat recipients in Surah At-Tawbah 9:60?", options: ["The poor", "Those in debt", "The stranded traveller", "Wealthy business owners"], answer: 3, explain: "9:60 lists the poor, the needy, collectors, those whose hearts are being reconciled, freeing captives, debtors, the cause of Allah and travellers." },
    { q: "The nisab (minimum for zakat) is based on the value of…", options: ["85 g of gold or 595 g of silver", "1 kg of gold", "One month's salary", "Any amount of money"], answer: 0, explain: "Nisab = the value of about 85 g of gold, or 595 g of silver." }
  ],
  features: [
    "Interactive 3D ATM with clickable keypad and live screen",
    "Zakat calculator: 2.5% on savings above the nisab",
    "Riba Check: interest loan vs. halal Murabaha, with a late-payment slider",
    "Sadaqah button: animated coins fly to real causes",
    "Halal vs. haram transaction sorting game"
  ]
},

/* =================================================================== */
/* 2. SKY SHIELD                                                       */
/* =================================================================== */
{
  id: "sky",
  category: "Scientific Miracles",
  icon: "🌍",
  accent: "#4fa8ff",
  title: "Sky Shield",
  subtitle: "Earth's protective atmosphere: the sky as a protected ceiling",
  howTo: "Drag to rotate the Earth. Click a layer label for facts. Launch meteors and switch the UV rays on and off.",
  refs: ["anbiya32", "tariq11", "baqarah22"],
  info: {
    troposphere: {
      title: "Troposphere (0 – about 12 km)",
      text: "<p>The lowest layer. It holds about <b>75–80% of the air's mass</b> and almost all water vapour, so nearly all <b>weather</b> (clouds, rain, storms) happens here. Temperature drops as you go higher.</p><p>Its height is about 8 km over the poles and up to about 18 km over the equator.</p>",
      refs: ["tariq11"],
      note: "Classical scholars explained 'the sky which returns' (86:11) as the sky returning rain again and again. Today we call this the water cycle, which happens in the troposphere."
    },
    stratosphere: {
      title: "Stratosphere & Ozone Layer (about 12 – 50 km)",
      text: "<p>Contains the <b>ozone layer</b> (mostly 15–35 km). Ozone absorbs <b>all UV-C</b> and <b>most UV-B</b> radiation from the Sun. These rays can damage skin, eyes and DNA. Most UV-A still reaches the ground, which is why we still need sun protection.</p><p>Planes often fly in the lower stratosphere because the air is calm.</p>",
      refs: ["anbiya32"]
    },
    mesosphere: {
      title: "Mesosphere (about 50 – 85 km)",
      text: "<p>The coldest layer, reaching about <b>−90 °C</b> at the top. <b>Most meteors burn up here</b>: friction and compression heat them so much they glow as 'shooting stars'.</p><p>Scientists estimate that dozens of tonnes of space dust and rock enter Earth's atmosphere every day. Almost all of it never reaches the ground.</p>",
      refs: ["anbiya32"]
    },
    thermosphere: {
      title: "Thermosphere (about 85 – 600 km)",
      text: "<p>The air is extremely thin but absorbs high-energy X-rays and extreme UV from the Sun, so it can be very hot (over 1,000 °C). <b>Auroras</b> (northern and southern lights) happen here.</p><p>The International Space Station orbits at about 400 km, inside this layer.</p>",
      refs: ["anbiya32"]
    },
    exosphere: {
      title: "Exosphere (about 600 – 10,000 km)",
      text: "<p>The outermost layer, where the atmosphere slowly fades into space. Atoms are so far apart that they can escape. Many satellites orbit here.</p><p>Beyond the air, Earth's <b>magnetic field</b> also deflects most of the charged particles of the solar wind.</p>",
      refs: ["anbiya32"]
    },
    verse: {
      title: "The verse and the science, kept separate",
      text: "<p><b>The verse:</b> Allah describes the sky as a 'protected ceiling' and says people turn away from its signs (21:32).</p><p><b>The science:</b> the atmosphere burns up meteors, blocks harmful UV, keeps temperatures stable and holds the air we breathe.</p><p><b>Our reflection:</b> many Muslims see these discoveries as a reason to reflect on the verse. The Qur'an is a book of guidance, not a science textbook, so we present the science alongside the verse as a sign to think about.</p>",
      refs: ["anbiya32", "baqarah22"]
    },
    uv: {
      title: "UV rays and the ozone shield",
      text: "<p>The Sun sends out three types of ultraviolet light: <b>UV-A</b>, <b>UV-B</b> and <b>UV-C</b>. With the ozone layer ON, all UV-C and most UV-B are absorbed in the stratosphere. With it OFF (as a 'what if'), the dangerous rays would reach the surface.</p><p>In the 1980s, chemicals called CFCs thinned the ozone layer. The <b>Montreal Protocol</b> (1987) banned them, and the ozone layer is now slowly recovering.</p>",
      refs: ["anbiya32"]
    },
    meteor: {
      title: "Meteors burning up",
      text: "<p>A meteoroid hits the air at tens of kilometres per second. The air in front of it is squeezed and heated, and the rock glows and breaks apart, usually <b>between about 75 and 120 km up</b>, in the mesosphere and lower thermosphere.</p><p>Only a tiny fraction survive to the ground as meteorites.</p>",
      refs: ["anbiya32"]
    }
  },
  realLife: [
    { icon: "🧴", title: "Check the UV index", text: "The ozone layer blocks most UV, but not all. On sunny days use sunscreen, a hat and sunglasses. This is part of looking after the body Allah gave us." },
    { icon: "🌱", title: "Protect the protector", text: "The ozone layer is recovering because countries worked together to ban CFCs. Families can help the atmosphere by reducing pollution: walk, share rides, save energy." },
    { icon: "🌧️", title: "Thank Allah for rain", text: "The water cycle in the troposphere brings rain back again and again (86:11 reflection). Saving water at home and at school is a way of being grateful for it." },
    { icon: "🌌", title: "Don't 'turn away' from signs", text: "21:32 says people turn away from the sky's signs. Take a moment to look at a sunset, a shooting star or the clouds, and say SubhanAllah." }
  ],
  steps: [
    { member: 1, title: "Welcome to Sky Shield", action: "intro",
      say: "Assalamu alaikum! Our model is Sky Shield. This is the Earth, surrounded by transparent shells. Each shell is a layer of the atmosphere. The layers are enlarged so you can see them." },
    { member: 1, title: "The verse: a protected ceiling", action: "showVerse",
      say: "In Surah Al-Anbiya 21:32, Allah says: 'And We made the sky a protected ceiling, but they, from its signs, are turning away.' Now let's look at the science separately." },
    { member: 2, title: "Troposphere: where weather happens", action: "layerTroposphere",
      say: "The lowest layer is the troposphere, up to about 12 km. Almost all clouds, rain and storms happen here. It holds most of the air we breathe." },
    { member: 2, title: "Ozone blocks harmful UV", action: "uvDemo",
      say: "These purple rays are ultraviolet light from the Sun. The ozone layer in the stratosphere absorbs all UV-C and most UV-B. Watch what happens when I switch the ozone off: the rays reach the ground." },
    { member: 3, title: "Meteor shower!", action: "meteorShower",
      say: "Now let's launch meteors. They hit the atmosphere at huge speed, glow, and burn up before they reach us. Dozens of tonnes of space dust enter every day." },
    { member: 3, title: "Mesosphere: the meteor shield", action: "layerMesosphere",
      say: "Most meteors burn up in the mesosphere, about 50 to 85 km up. It is the coldest layer, around minus 90 degrees Celsius at the top." },
    { member: 4, title: "Thermosphere, exosphere and 86:11", action: "layerOuter",
      say: "Higher up are the thermosphere, with auroras and the Space Station, and the exosphere, which fades into space. In 86:11 Allah swears by 'the sky which returns', which scholars explained as returning rain." },
    { member: 4, title: "Real life & reflection", action: "outro",
      say: "So the next time you check the UV index or see a shooting star, remember the protected ceiling above us. Now let's try a quick quiz. Thank you!" }
  ],
  quiz: [
    { q: "Which layer of the atmosphere contains the ozone layer?", options: ["Troposphere", "Stratosphere", "Mesosphere", "Exosphere"], answer: 1, explain: "The ozone layer is mostly 15–35 km up, in the stratosphere." },
    { q: "In which layer do most meteors burn up?", options: ["Troposphere", "Stratosphere", "Mesosphere", "Exosphere"], answer: 2, explain: "Most meteors burn up in the mesosphere (about 50–85 km)." },
    { q: "Surah Al-Anbiya 21:32 describes the sky as…", options: ["A protected ceiling", "An empty space", "A moving ocean", "A great mountain"], answer: 0, explain: "\"And We made the sky a protected ceiling…\"" },
    { q: "Which type of UV is completely blocked by the ozone layer?", options: ["UV-A", "UV-B", "UV-C", "None of them"], answer: 2, explain: "All UV-C and most UV-B are absorbed. Most UV-A still reaches us." },
    { q: "Where does almost all of our weather happen?", options: ["Exosphere", "Thermosphere", "Mesosphere", "Troposphere"], answer: 3, explain: "The troposphere holds almost all water vapour, so clouds and rain form there." }
  ],
  features: [
    "Rotating 3D Earth with five cut-away atmosphere layers",
    "Click any layer for accurate science facts",
    "Launch meteors that burn up in the mesosphere",
    "Toggle UV rays and the ozone shield on and off",
    "Verse and science shown in clearly separate boxes"
  ]
},

/* =================================================================== */
/* 3. WAQF                                                             */
/* =================================================================== */
{
  id: "waqf",
  category: "Financial Contracts",
  icon: "🕌",
  accent: "#e0b04a",
  title: "Waqf: A Charity That Keeps Giving",
  subtitle: "Keep the asset, give away its benefit, for generations",
  howTo: "Choose an asset to donate, then drag the timeline slider to move forward through the years.",
  refs: ["muslim1631", "bukhari2737", "imran92"],
  info: {
    waqf: {
      title: "What is a waqf?",
      text: "<p>A <b>waqf</b> (endowment) is an asset given for the sake of Allah so that its benefit flows to people <b>forever</b>.</p><ul><li><b>The asset is preserved</b>: it can never be sold, given away as a gift, or inherited.</li><li><b>The benefit is given away</b>: water, fruit, education, healthcare, or rental income.</li><li>A trustee called the <b>mutawalli</b> manages and maintains it.</li></ul>",
      refs: ["bukhari2737"]
    },
    asset: {
      title: "The asset is preserved",
      text: "<p>Watch the timeline: houses are built, generations come and go, but the waqf asset <b>stays standing</b>. Its income pays for its own repairs, so it keeps working century after century.</p>",
      refs: ["bukhari2737"]
    },
    trustee: {
      title: "The mutawalli (trustee)",
      text: "<p>The trustee looks after the waqf: repairing the well, paying the teachers, caring for the orchard. Umar's waqf allowed the manager to eat from it 'in a reasonable just manner', but not to become wealthy from it.</p>",
      refs: ["bukhari2737"]
    },
    people: {
      title: "The beneficiaries",
      text: "<p>Every family in the village benefits: children, then their children, then their grandchildren. That is why the counter keeps growing. The reward for the donor continues as <b>sadaqah jariyah</b> (ongoing charity).</p>",
      refs: ["muslim1631"]
    },
    history: {
      title: "Waqf in history",
      text: "<p>Umar ibn al-Khattab's land at Khaybar (Sahih al-Bukhari 2737) is a famous early waqf.</p><p>The <b>University of al-Qarawiyyin</b> in Fez, Morocco, was founded in 859 CE by <b>Fatima al-Fihri</b>, who used her inheritance to build a mosque and place of learning. It is often described as the oldest existing university still operating. Throughout Islamic history, waqfs funded wells, schools, hospitals, libraries and travellers' inns.</p>",
      refs: ["bukhari2737"]
    },
    love: {
      title: "Giving from what you love",
      text: "<p>Umar gave the land he described as the best he had ever owned. That matches the Qur'anic teaching that true righteousness comes from giving <b>what you love</b>, not what you do not need.</p>",
      refs: ["imran92"]
    }
  },
  realLife: [
    { icon: "🌳", title: "Plant a tree", text: "A tree planted in the school garden gives shade and fruit for decades. Students can make it a group project, a small ongoing charity." },
    { icon: "📚", title: "Share beneficial knowledge", text: "Donating books to the library, or teaching a younger sibling to read the Qur'an, is knowledge that keeps benefiting, one of the three deeds in Sahih Muslim 1631." },
    { icon: "💧", title: "Family water-well fund", text: "Families often pool money to build a well or water filter in a community that needs it. One well can serve a village for many years." },
    { icon: "🏥", title: "Modern waqf", text: "Today many hospitals, mosques and universities are funded by endowments: the money is invested and only the profit is spent, just like the waqf model." }
  ],
  steps: [
    { member: 1, title: "Welcome to the Waqf Village", action: "intro",
      say: "Assalamu alaikum! Our model is about waqf, a charity that keeps giving. A waqf is an asset given for Allah's sake: the asset is kept forever, and only its benefit is given away." },
    { member: 1, title: "Umar's land at Khaybar", action: "showUmar",
      say: "In Sahih al-Bukhari 2737, Umar got the best land he had ever owned. The Prophet ﷺ advised: keep it as an endowment and give its yield in charity. It could never be sold, gifted or inherited." },
    { member: 2, title: "Donate an asset", action: "donateWell",
      say: "Now we donate a water well to the village. Look at the counter: in the first year, the families nearby start drinking clean water." },
    { member: 2, title: "Fifty years later", action: "time50",
      say: "Let's drag the timeline to fifty years. The village has grown, the children have grown up, and the well is still working. The trustee has repaired it from its own income." },
    { member: 3, title: "Generations benefit", action: "time150",
      say: "At one hundred and fifty years, five generations have used the same well. The counter has passed many thousands of people, and the donor is still being rewarded." },
    { member: 3, title: "Deeds that never end", action: "showHadith",
      say: "Sahih Muslim 1631: when a person dies, their deeds end except three: ongoing charity, beneficial knowledge, and a righteous child who prays for them. A waqf is the best example of ongoing charity." },
    { member: 4, title: "Three hundred years: a school", action: "school300",
      say: "If we donate a school instead and go to three hundred years, it is like al-Qarawiyyin University, founded by Fatima al-Fihri in 859 and still teaching today. Surah Aal-Imran 3:92 says to give from what you love." },
    { member: 4, title: "Your own waqf", action: "outro",
      say: "You don't need to be rich. Planting a tree or donating books can become ongoing charity. Now let's try a quick quiz. Thank you for listening!" }
  ],
  quiz: [
    { q: "In a waqf, what happens to the original asset?", options: ["It is sold after one year", "It is preserved and never sold, gifted or inherited", "It is shared between the donor's children", "It is given to the government"], answer: 1, explain: "The asset is preserved; only the benefit is given away." },
    { q: "According to Sahih Muslim 1631, which deed continues after death?", options: ["A big house", "Ongoing charity (sadaqah jariyah)", "Expensive clothes", "A fast car"], answer: 1, explain: "Ongoing charity, beneficial knowledge, and a righteous child who prays for the deceased." },
    { q: "Which companion made his land at Khaybar into a waqf?", options: ["Abu Bakr", "Umar ibn al-Khattab", "Ali ibn Abi Talib", "Bilal"], answer: 1, explain: "Sahih al-Bukhari 2737 narrates Umar's endowment at Khaybar." },
    { q: "Surah Aal-Imran 3:92: you will not attain the good until you spend from…", options: ["What you love", "What you don't need", "Other people's money", "Only gold"], answer: 0, explain: "\"…until you spend from that which you love.\"" },
    { q: "What is the person who manages a waqf called?", options: ["Imam", "Mutawalli (trustee)", "Mufti", "Qadi"], answer: 1, explain: "The mutawalli maintains the waqf and distributes its benefits." }
  ],
  features: [
    "3D village where you donate a well, school, orchard or hospital",
    "Timeline slider: 0 to 300 years, across generations",
    "Live counter of people who benefit",
    "Shows the key rule: asset preserved, benefit given away",
    "History: Umar's Khaybar land and al-Qarawiyyin University"
  ]
},

/* =================================================================== */
/* 4. COSMIC CLOCK                                                     */
/* =================================================================== */
{
  id: "clock",
  category: "Scientific Miracles",
  icon: "🌙",
  accent: "#b28cff",
  title: "Cosmic Clock",
  subtitle: "The Sun and the Moon move by precise calculation",
  howTo: "Use the Moon slider for phases and the Hijri date. Switch to Prayer Times and drag the hour slider to spin the Earth.",
  refs: ["yasin38", "yasin39", "yasin40", "yunus5", "rahman5", "nisa103", "baqarah189"],
  info: {
    sun: {
      title: "The Sun: a shining light",
      text: "<p>The Sun makes its own light by <b>nuclear fusion</b>, turning hydrogen into helium. The Sun is also moving: it carries the whole solar system around the centre of our galaxy at about <b>220 km per second</b>, taking about 230 million years per orbit.</p>",
      refs: ["yunus5", "yasin38"]
    },
    moon: {
      title: "The Moon: a derived light",
      text: "<p>The Moon makes no light of its own. It <b>reflects sunlight</b>. As it orbits Earth, we see different amounts of its sunlit half, and those are the <b>phases</b>.</p><p>From one new moon to the next takes about <b>29.5 days</b> (the synodic month).</p>",
      refs: ["yunus5", "yasin39"]
    },
    earth: {
      title: "Earth: our clock",
      text: "<p>Earth spins once every 24 hours (day and night) and orbits the Sun once a year. Because of the spin, the Sun appears to rise, climb, set and go below the horizon. The <b>five daily prayers</b> are timed by these positions.</p>",
      refs: ["nisa103", "rahman5"]
    },
    hijri: {
      title: "The Hijri (lunar) calendar",
      text: "<p>Each Hijri month begins when the <b>new crescent</b> is sighted after sunset, so a month has <b>29 or 30 days</b>. Twelve lunar months make about 354 days, so Ramadan moves about 11 days earlier each solar year.</p>",
      refs: ["baqarah189", "yunus5"]
    },
    orbits: {
      title: "Each in an orbit, swimming",
      text: "<p>The Moon orbits Earth (about 27.3 days relative to the stars), Earth orbits the Sun (365.25 days), and the Sun orbits the galaxy. Each body has its own path. They don't crash into each other, and night and day follow in order.</p><p><i>Sizes and distances in this model are not to scale, so that everything fits on screen.</i></p>",
      refs: ["yasin40", "yasin38"]
    },
    prayer: {
      title: "Prayer times from the Sun's position",
      text: "<ul><li><b>Fajr</b>: dawn, when the Sun is about 18° below the horizon (methods use 15–19.5°).</li><li><b>Sunrise</b>: Fajr time ends.</li><li><b>Dhuhr</b>: just after the Sun passes its highest point (solar noon).</li><li><b>Asr</b>: when an object's shadow equals its length plus its noon shadow (the Hanafi method uses twice the length).</li><li><b>Maghrib</b>: just after sunset.</li><li><b>Isha</b>: when twilight disappears, with the Sun about 17–18° below the horizon.</li></ul><p><i>This model calculates for the equinox at your chosen latitude.</i></p>",
      refs: ["nisa103", "rahman5"]
    }
  },
  realLife: [
    { icon: "🌙", title: "Ramadan & Eid moon sighting", text: "Families look for the new crescent to start Ramadan and celebrate Eid, the same phases shown on our slider." },
    { icon: "⏰", title: "Prayer-time apps", text: "Prayer apps use exactly this astronomy: the Sun's angle at your location. Planning homework and sports around salah teaches great time management." },
    { icon: "📅", title: "Know the Hijri date", text: "Important days like the Islamic New Year, Ashura and the Day of Arafah follow the lunar calendar. Try writing the Hijri date in your notebook." },
    { icon: "🔭", title: "Reflect when you look up", text: "Watching the Moon change from crescent to full and back reminds us that the universe runs 'by precise calculation' (55:5)." }
  ],
  steps: [
    { member: 1, title: "Welcome to the Cosmic Clock", action: "intro",
      say: "Assalamu alaikum! Our model is the Cosmic Clock: the Sun, the Earth and the Moon. Surah Ar-Rahman 55:5 says: 'The sun and the moon move by precise calculation.'" },
    { member: 1, title: "Shining light, derived light", action: "showLight",
      say: "Surah Yunus 10:5 calls the Sun a 'shining light' and the Moon a 'derived light'. Science confirms the Sun makes light by fusion, while the Moon only reflects sunlight." },
    { member: 2, title: "The new crescent", action: "phaseNew",
      say: "Using the time slider, here is day 1. A thin crescent appears after sunset, and that starts a new Hijri month. Surah Al-Baqarah 2:189 says new moons are measurements of time." },
    { member: 2, title: "Full moon", action: "phaseFull",
      say: "Dragging to day 14 or 15, the Moon is on the far side of Earth from the Sun, so we see its whole lit face: a full moon. A full cycle takes about 29.5 days." },
    { member: 3, title: "Like an old date stalk", action: "phaseOld",
      say: "Near day 27 the Moon becomes a thin curved crescent again. Surah Ya-Sin 36:39 says it returns 'like the old date stalk', which is thin and curved, exactly this shape." },
    { member: 3, title: "Prayer times: Dhuhr and Asr", action: "prayerDhuhr",
      say: "Now Prayer Times mode. As Earth spins, the Sun climbs. When it passes its highest point it's Dhuhr. Later, when shadows lengthen, it's Asr." },
    { member: 4, title: "Maghrib, Isha and Fajr", action: "prayerMaghrib",
      say: "At sunset it's Maghrib. When twilight disappears it's Isha, and Fajr begins at dawn. Surah An-Nisa 4:103: prayer is decreed at specified times." },
    { member: 4, title: "Each in its own orbit", action: "orbitsOn",
      say: "Finally, the orbit toggle. Each body moves in its own path. Surah Ya-Sin 36:40 says 'each, in an orbit, is swimming.' Now a quick quiz. Thank you!" }
  ],
  quiz: [
    { q: "About how long is one lunar month (new moon to new moon)?", options: ["7 days", "About 29.5 days", "31 days", "365 days"], answer: 1, explain: "The synodic month is about 29.5 days, so Hijri months have 29 or 30 days." },
    { q: "Why does Surah Yunus 10:5 call the Moon a 'derived light'?", options: ["It burns like a fire", "It reflects light from the Sun", "It is made of crystal", "It only shines in Ramadan"], answer: 1, explain: "The Moon has no light of its own; it reflects sunlight." },
    { q: "When does the Maghrib prayer begin?", options: ["At dawn", "At solar noon", "Just after sunset", "At midnight"], answer: 2, explain: "Maghrib begins just after the Sun sets." },
    { q: "Surah Ya-Sin 36:40 says each body is…", options: ["Standing still", "In an orbit, swimming", "Racing the others", "Hidden by clouds"], answer: 1, explain: "\"…but each, in an orbit, is swimming.\"" },
    { q: "How does a new Hijri month begin?", options: ["On the 1st of every solar month", "With the sighting of the new crescent", "At the full moon", "When the Sun is highest"], answer: 1, explain: "The month starts when the new crescent (hilal) is seen." }
  ],
  features: [
    "3D Sun–Earth–Moon system with orbit toggle",
    "Moon-phase slider linked to the Hijri day",
    "Prayer Times mode: spin Earth and see Fajr, Dhuhr, Asr, Maghrib and Isha",
    "Real sun-angle calculation for any latitude",
    "Verses from Ya-Sin 36:38–40, Yunus 10:5 and Ar-Rahman 55:5"
  ]
},

/* =================================================================== */
/* 5. ISLAMIC BUSINESS INVESTMENT SIMULATOR                            */
/* =================================================================== */
{
  id: "market",
  category: "Financial Contracts",
  icon: "🏪",
  accent: "#ff9f5a",
  title: "Islamic Business Investment Simulator",
  subtitle: "Share the profit and the risk: Mudarabah & Musharakah",
  howTo: "Click a shop to screen it. If it is halal, choose a contract, set your investment and simulate good and bad years.",
  refs: ["baqarah275", "nisa29", "maidah90", "baqarah173"],
  info: {
    screening: {
      title: "Halal screening",
      text: "<p>Before investing, a Muslim checks the business itself. It must not be based on <b>alcohol, gambling, pork, interest-based lending</b> or other forbidden activities. Islamic investment funds do the same check, called <b>Shariah screening</b>.</p>",
      refs: ["maidah90", "baqarah173", "baqarah275"]
    },
    mudarabah: {
      title: "Mudarabah: money + skill",
      text: "<p>One partner (the <b>investor</b>, rabb al-mal) gives the money. The other (the <b>entrepreneur</b>, mudarib) gives the work and skill.</p><ul><li><b>Profit</b> is shared by a ratio agreed at the start (e.g. 60:40).</li><li><b>Loss of money</b> is carried by the investor. The entrepreneur loses their time and effort, unless they were careless or dishonest.</li></ul>",
      refs: ["nisa29"]
    },
    musharakah: {
      title: "Musharakah: a true partnership",
      text: "<p>Both partners put in money (and usually work).</p><ul><li><b>Profit</b> is shared by an agreed ratio.</li><li><b>Loss</b> is shared <b>in proportion to how much each partner invested</b>.</li></ul><p>Everyone wins together and everyone shares the risk together.</p>",
      refs: ["nisa29"]
    },
    loan: {
      title: "Compared with an interest loan",
      text: "<p>With an interest-based loan, the lender gets a <b>fixed, guaranteed</b> return even if the business makes a loss. All the risk falls on the borrower, who may end up in debt. Islam permits trade and forbids this kind of guaranteed increase.</p>",
      refs: ["baqarah275"]
    },
    consent: {
      title: "Trade by mutual consent",
      text: "<p>Every contract here is agreed by both sides before it starts: who invests what, the profit ratio, and how losses are handled. Surah An-Nisa 4:29 forbids taking wealth unjustly and allows trade by mutual consent.</p>",
      refs: ["nisa29"]
    }
  },
  realLife: [
    { icon: "🧁", title: "School bake sale with a friend", text: "One friend buys ingredients, the other bakes and sells. Agree in advance how to split the profit, and who covers the loss if nothing sells. That is a mini Mudarabah!" },
    { icon: "👨‍👩‍👧", title: "Family business partnership", text: "When relatives open a shop together, Musharakah rules keep it fair: write the agreement down and share losses by how much each person invested." },
    { icon: "📈", title: "Halal investing & savings", text: "Islamic savings accounts and halal investment funds screen out alcohol, gambling and interest-based companies. Parents can ask their bank for Shariah-compliant options." },
    { icon: "🛒", title: "Honest online selling", text: "Selling old games or clothes online? Describe faults honestly and agree the price freely. Fair trade by mutual consent (4:29) applies on every app." }
  ],
  steps: [
    { member: 1, title: "Welcome to the Marketplace", action: "intro",
      say: "Assalamu alaikum! Our model is an Islamic Business Investment Simulator. Surah An-Nisa 4:29 tells us to trade only by mutual consent and never take wealth unjustly." },
    { member: 1, title: "Step 1: halal screening", action: "screenCasino",
      say: "Before investing, we screen the business. Let's click the casino: it's rejected, because Surah Al-Ma'idah 5:90 forbids gambling and intoxicants. The same goes for the liquor shop." },
    { member: 2, title: "Choose a business & Mudarabah", action: "pickBakery",
      say: "The bakery passes screening. We choose Mudarabah: the investor gives the money, the baker gives the skill, and they agree to share profit 60 to 40." },
    { member: 2, title: "A good year", action: "goodYear",
      say: "Let's simulate a good year. The bakery makes a profit, and both partners receive their agreed share. Watch the coin towers grow." },
    { member: 3, title: "A bad year: sharing the loss", action: "badYear",
      say: "Now a bad year: sales drop and there's a loss. In Mudarabah the investor's money carries the loss, while the baker loses their effort. Nobody is forced into debt." },
    { member: 3, title: "Musharakah partnership", action: "musharakah",
      say: "With Musharakah, both partners invest money. Profit is shared by agreement, and losses are shared by how much each person invested. It's a true partnership." },
    { member: 4, title: "Compare: interest loan", action: "compareLoan",
      say: "Here is the side-by-side comparison. With an interest loan, the lender gets paid even in a bad year and the borrower carries all the risk. Allah permitted trade and forbade interest, 2:275." },
    { member: 4, title: "Real-life business", action: "outro",
      say: "Even a school bake sale can follow these rules. Now let's try the quick quiz. Thank you for listening!" }
  ],
  quiz: [
    { q: "In Mudarabah, what does each partner contribute?", options: ["Both give only money", "One gives money, the other gives work and skill", "One gives land, the other gives a loan", "The bank gives everything"], answer: 1, explain: "Investor = capital; entrepreneur (mudarib) = work and expertise." },
    { q: "In Mudarabah, if there is an honest financial loss, who carries the money loss?", options: ["The entrepreneur pays it all back", "The investor (who loses money), while the entrepreneur loses their effort", "The customers", "Nobody"], answer: 1, explain: "Unless the entrepreneur was negligent, the investor bears the financial loss." },
    { q: "In Musharakah, how are losses shared?", options: ["Equally always", "In proportion to each partner's investment", "Only by the youngest partner", "They are added to a loan"], answer: 1, explain: "Losses follow capital contribution; profits follow the agreed ratio." },
    { q: "Which business would FAIL halal screening?", options: ["Bakery", "Bookshop", "Casino", "Bicycle repair"], answer: 2, explain: "Gambling is forbidden in Surah Al-Ma'idah 5:90." },
    { q: "According to Surah An-Nisa 4:29, trade must be by…", options: ["Force", "Mutual consent", "Secret agreement", "Chance"], answer: 1, explain: "\"…only [in lawful] business by mutual consent.\"" }
  ],
  features: [
    "3D marketplace with six shops to click",
    "Halal screening rejects haram businesses with Qur'an reasons",
    "Choose Mudarabah or Musharakah and set your investment",
    "Simulate good and bad years: profit AND loss sharing",
    "Side-by-side comparison with an interest-based loan"
  ]
},

/* =================================================================== */
/* 6. OCEAN DEPTH EXPLORER                                             */
/* =================================================================== */
{
  id: "ocean",
  category: "Scientific Miracles",
  icon: "🌊",
  accent: "#2bc4d8",
  title: "Ocean Depth Explorer",
  subtitle: "Darkness upon darkness, waves upon waves, and the barrier between two seas",
  howTo: "Drag the depth slider to dive. Click the creatures and zone labels. Switch to 'Two Seas' for the barrier scene.",
  refs: ["nur40", "rahman19", "rahman20", "furqan53"],
  info: {
    light: {
      title: "Light fades colour by colour",
      text: "<p>Water absorbs sunlight one colour at a time (approximate depths in clear ocean water):</p><ul><li><b style='color:#ff6b6b'>Red</b>: mostly gone by about 10 m</li><li><b style='color:#ffa94d'>Orange</b>: by about 30 m</li><li><b style='color:#ffe066'>Yellow</b>: by about 50 m</li><li><b style='color:#69db7c'>Green</b>: by about 100 m</li><li><b style='color:#74c0fc'>Blue</b>: travels deepest, fading out by about 200 m to 1000 m</li></ul><p>Below about <b>1000 m</b> there is no sunlight at all.</p>",
      refs: ["nur40"]
    },
    sunlight: {
      title: "Sunlight Zone (0 – 200 m)",
      text: "<p>Enough light for plants and plankton to photosynthesise. Most ocean life lives here: dolphins, turtles, tuna and coral reefs.</p>",
      refs: []
    },
    twilight: {
      title: "Twilight Zone (200 – 1000 m)",
      text: "<p>Only faint blue light. No plants can grow. Many animals, like <b>lanternfish</b>, make their own light (<b>bioluminescence</b>).</p>",
      refs: ["nur40"]
    },
    midnight: {
      title: "Midnight Zone (1000 – 4000 m)",
      text: "<p><b>Total darkness</b>, near-freezing water and huge pressure. Many animals here make their own light. If you held out your hand, you could not see it.</p><p>Animals include the <b>anglerfish</b>, with a glowing lure, and the gulper eel.</p>",
      refs: ["nur40"]
    },
    abyss: {
      title: "Abyssal Zone (4000 – 6000 m)",
      text: "<p>Covers much of the ocean floor. Water is about 2–4 °C. The <b>tripod fish</b> stands on long fins waiting for food to drift past.</p>",
      refs: []
    },
    hadal: {
      title: "Hadal Zone (6000 – 11,000 m)",
      text: "<p>Deep ocean trenches. The deepest known point is the <b>Challenger Deep</b> in the Mariana Trench, at about <b>10,900 m</b>. The pressure is over 1,000 times that at the surface. <b>Snailfish</b> have been filmed at around 8,000 m.</p>",
      refs: []
    },
    internal: {
      title: "Internal waves: waves below the waves",
      text: "<p>The ocean has layers of different density (warm and less salty on top, cold and saltier below). Where layers meet, at the <b>pycnocline</b>, <b>internal waves</b> form. They are hidden underwater and can be tens to over 100 m tall.</p><p>So in a deep sea there are <b>waves under waves</b>, with surface waves above them and clouds above those.</p>",
      refs: ["nur40"],
      note: "Our reflection: 24:40 is a parable about the darkness of a life without Allah's guidance. Many people also reflect on how well its picture of layered darkness and waves upon waves matches the real deep ocean."
    },
    barrier: {
      title: "Where two seas meet",
      text: "<p>Where a <b>river meets the sea</b> (an estuary), fresh water and salt water meet. The sharp change in saltiness and density is called a <b>halocline</b>. A transition zone forms where each side keeps its own properties, and mixing is slow and gradual.</p><p>A famous example is at the <b>Strait of Gibraltar</b>: saltier Mediterranean water flows into the Atlantic and stays as a distinct layer for great distances.</p>",
      refs: ["rahman19", "rahman20", "furqan53"]
    }
  },
  realLife: [
    { icon: "🔦", title: "Guidance is our light", text: "24:40 compares a life without guidance to darkness in a deep sea. When life feels confusing, prayer and the Qur'an are like the submarine's lights." },
    { icon: "🥤", title: "Protect the ocean", text: "Plastic has been found even in the deepest trenches. Use refillable bottles and recycle, because the sea is part of the trust (amanah) Allah gave us." },
    { icon: "🤝", title: "Different but peaceful", text: "Like two seas meeting side by side, people with different backgrounds can live together and keep their identity, with respect and without 'transgressing'." },
    { icon: "🧪", title: "Careers in ocean science", text: "Marine biologists, engineers and divers study the sea. Exploring Allah's creation can be your future job!" }
  ],
  steps: [
    { member: 1, title: "Welcome aboard!", action: "intro",
      say: "Assalamu alaikum! Welcome aboard our Ocean Depth Explorer. In Surah An-Nur 24:40, Allah describes 'darknesses within an unfathomable sea, covered by waves, upon which are waves, over which are clouds.'" },
    { member: 1, title: "Waves upon waves", action: "depthInternal",
      say: "Look: surface waves on top, and below them internal waves where warm and cold water layers meet. They are hidden underwater, and some are over 100 metres tall." },
    { member: 2, title: "Colours fade one by one", action: "depth60",
      say: "As we dive, watch the colour bar. Red disappears by about 10 metres, then orange, then yellow. At 60 metres, everything already looks blue-green." },
    { member: 2, title: "The twilight zone", action: "depth500",
      say: "At 500 metres, the twilight zone, only faint blue light is left. No plants grow here. Lanternfish make their own light." },
    { member: 3, title: "Total darkness", action: "depth2000",
      say: "At 2,000 metres, the midnight zone, there is total darkness. As the verse says, if you put out your hand you can hardly see it. We need the submarine's lights." },
    { member: 3, title: "The deepest trench", action: "depthMax",
      say: "Down to almost 11,000 metres, the Challenger Deep. The pressure is over a thousand times that at the surface. Allah's creation reaches places humans have barely explored." },
    { member: 4, title: "The barrier between two seas", action: "twoSeas",
      say: "Now the Two Seas scene. Fresh river water meets salty sea water. Surah Al-Furqan 25:53 says one is fresh and sweet, one salty and bitter, with a barrier between them. Scientists call this zone a halocline." },
    { member: 4, title: "Back to the surface", action: "outro",
      say: "The deep sea's darkness is a parable for life without guidance, and the Qur'an is our light. Now let's try a quick quiz. Thank you!" }
  ],
  quiz: [
    { q: "Which colour of sunlight disappears first as you dive?", options: ["Blue", "Green", "Red", "Yellow"], answer: 2, explain: "Red is absorbed in the first few metres, mostly gone by about 10 m." },
    { q: "Below about what depth is there no sunlight at all?", options: ["10 m", "50 m", "1000 m", "There is always sunlight"], answer: 2, explain: "Below about 1000 m is the midnight zone: total darkness." },
    { q: "Where do internal waves form?", options: ["On the beach", "Between water layers of different density", "Only in rivers", "In the clouds"], answer: 1, explain: "They form at the pycnocline, where light and dense layers meet." },
    { q: "Surah Al-Furqan 25:53 describes the two seas as…", options: ["Both frozen", "One fresh and sweet, one salty and bitter", "Both boiling", "One red and one green"], answer: 1, explain: "\"…one fresh and sweet and one salty and bitter, and He placed between them a barrier…\"" },
    { q: "Surah An-Nur 24:40 describes a deep sea covered by…", options: ["Ice", "Waves, upon which are waves, over which are clouds", "Ships", "Islands"], answer: 1, explain: "\"…covered by waves, upon which are waves, over which are clouds - darknesses, some of them upon others.\"" }
  ],
  features: [
    "3D submarine dive from 0 to 11,000 m with a depth gauge",
    "Light fades colour by colour until total darkness",
    "Surface waves AND internal waves shown together",
    "Clickable creatures in each ocean zone",
    "Separate 'Two Seas' scene showing the barrier (halocline)"
  ]
}

];
