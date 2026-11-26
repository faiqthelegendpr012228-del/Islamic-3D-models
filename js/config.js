/* =====================================================================
   config.js  —  EDIT THIS FILE FIRST!
   ---------------------------------------------------------------------
   Put your group's real names and roles here. Every screen in the app
   (start screen, presentation mode, credits, info card) reads from this
   file, so you only have to change the names once.
   ===================================================================== */

window.APP_CONFIG = {
  // Name of the school / class shown on the start and credits screens
  schoolName: "Gems Westminister School Sharjah",
  className: "Y12-BD",
  teacherName: "Ms.Mukhsana",

  // The group members (1 to 4 people). Presentation Mode shows who is
  // speaking at each step. With one person, they present every step;
  // to add teammates, copy the line below and change the name and role.
  members: [
    { name: "Muhammad Faiq Naveed", role: "Islamic research & Qur'an references,3D model design & interactions, Real-life examples & science facts and Quiz, presentation & info card" },
  ],

  // Currency symbol used in the finance topics (ATM, Waqf, Market).
  currency: "AED ",

  // Today's prices (AED per gram) used by the Zakat calculators.
  // They change every day: update them before the exhibition
  // (search "UAE gold rate today"). Visitors can also type their own.
  goldPricePerGram: 496.75,      // 24 carat
  silverPricePerGram: 7.14,

  // Nisab for the ATM exhibit's quick calculator = 85 g of 24 carat gold.
  // 85 g × 496.75 AED = 42,223.75 AED
  defaultNisab: 42223.75,

  // OPTIONAL: your own recorded videos (e.g. made in CapCut).
  // Leave a topic out (or empty) and its "Watch video" button plays the
  // narrated 3D tour instead. You can use a YouTube link, or a video file
  // put in a "videos" folder (keep each file under 100 MB for GitHub).
  //   atm: "https://youtu.be/XXXXXXXXXXX",
  //   waqf: "videos/waqf.mp4",
  videos: {
  }
};
