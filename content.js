/**
 * content.js
 * Single Source of Truth for MAK BUILD — Construction & Design
 * All business facts, 2026 specifications, bilingual translations, flags, and estimator data.
 */

window.MAK_CONTENT = {
  // 1. VERIFIED BUSINESS FACTS
  company: {
    name: "MAK BUILD – Construction & Design",
    shortName: "MAK BUILD",
    taglineEn: "We Build Dreams with Precision",
    tagline2En: "Building Stronger Spaces for a Better Tomorrow",
    taglineTa: "உங்கள் கனவு வீடு – நாங்கள் உருவாக்குகிறோம்",
    engineer: "Er. Manikandan Rajendran",
    engineerRole: "Civil & Structural Engineer, Registered Engineer",
    engineerRoleTa: "சிவில் & கட்டமைப்பு பொறியாளர், பதிவுபெற்ற பொறியாளர்",
    engineerRegNo: "", // TODO_OWNER: Registration number (auto-hidden when empty)
    workingHours: "", // TODO_OWNER: Working hours e.g. "Mon - Sat: 9:00 AM - 7:30 PM" (auto-hidden when empty)
    web3FormsKey: "", // TODO_OWNER: Form access key (falls back to direct WhatsApp when empty)
    
    // Contacts
    phone1: "81441 66022",
    phone2: "93857 47544",
    phone1Tel: "+918144166022",
    phone2Tel: "+919385747544",
    whatsappNumber: "918144166022",
    whatsappUrl: "https://wa.me/918144166022",
    email: "makbuildsy@gmail.com",
    
    // Address (117C, Pidari South Street, Sirkazhi 609110)
    address: {
      street: "117C, Pidari South Street",
      city: "Sirkazhi",
      district: "Mayiladuthurai",
      state: "Tamil Nadu",
      pincode: "609110",
      full: "117C, Pidari South Street, Sirkazhi, Tamil Nadu 609110",
      fullTa: "117C, பிடாரி தெற்கு வீதி, சீர்காழி, தமிழ்நாடு 609110",
      mapEmbedUrl: "https://www.google.com/maps?q=117c+Pidari+South+Street,+Sirkazhi+609110&output=embed"
    },
    
    // Instagram
    instagram: {
      username: "@mak_build_construction",
      url: "https://www.instagram.com/mak_build_construction",
      qrCode: "assets/mak_build_construction_qr.png"
    },

    // Service Area
    serviceArea: "Sirkazhi, Mayiladuthurai, Chidambaram, Poompuhar and coastal Tamil Nadu",
    serviceAreaTa: "சீர்காழி, மயிலாடுதுறை, சிதம்பரம், பூம்புகார் மற்றும் கடலோர தமிழ்நாடு",

    // Hiring
    hiring: {
      show: true,
      titleEn: "We're hiring a Draftsman – WhatsApp us",
      titleTa: "வரைவாளர் (Draftsman) தேவை – வாட்ஸ்அப் செய்க",
      detailsEn: "AutoCAD & MS Excel, freshers welcome.",
      detailsTa: "ஆட்டோகேட் & எம்எஸ் எக்செல், புதியவர்கள் வரவேற்கப்படுகிறார்கள்."
    }
  },

  // 2. CONFIRMATION FLAGS (Default false, hide UI until confirmed by owner)
  flags: {
    structuralWarranty10yr: false,
    fixedPriceContract: false,
    isStandardConstruction: false,
    gfcDrawings: false,
    showEngineerRegistrationNo: false,
    ownerPhotoPermission: true // Owner in signboard photo
  },

  // 3. TIER MAPPING FOR PACKAGES 2026
  tierMapping: {
    basic: {
      id: "basic",
      name: "Basic",
      nameTa: "அடிப்படை",
      rate: 2200,
      column: "A",
      tagline: "Solid build, smart budget",
      taglineTa: "தரமான கட்டுமானம், சிக்கன பட்ஜெட்",
      suits: "Rental units, secondary homes & budget residences",
      suitsTa: "வாடகை வீடுகள் மற்றும் குறைந்த பட்ஜெட் இல்லங்கள்",
      highlights: [
        "Water test included",
        "Fly ash brick (₹8.50)",
        "Kavery steel & Coromandel cement",
        "Wood window (Vembu/Badak)",
        "Birla Opus paint finish"
      ],
      highlightsTa: [
        "நீர் பரிசோதனை சேர்க்கப்பட்டுள்ளது",
        "பறக்கும் சாம்பல் செங்கல் (₹8.50)",
        "காவேரி ஸ்டீல் & கோரமண்டல் சிமெண்ட்",
        "மர ஜன்னல் (வேம்பு அல்லது படாக்)",
        "பிர்லா ஓபஸ் பெயிண்ட்"
      ]
    },
    moderate: {
      id: "moderate",
      name: "Moderate",
      nameTa: "மிதமான",
      isPopular: true,
      options: {
        standard: {
          rate: 2300,
          column: "B",
          label: "Standard",
          labelTa: "ஸ்டாண்டர்ட்",
          tagline: "Most chosen for family homes",
          taglineTa: "குடும்ப இல்லங்களுக்கு மிகவும் விரும்பப்படும் தேர்வு",
          suits: "Modern independent family homes & villas",
          suitsTa: "நவீன தனிப்பட்ட குடும்ப இல்லங்கள்",
          highlights: [
            "Termite control & chemical curing",
            "Red brick construction (₹10)",
            "Agni steel & Dalmia cement",
            "UPVC windows (₹400/sq.ft)",
            "Asian putty + Tractor emulsion"
          ],
          highlightsTa: [
            "கரையான் தடுப்பு & க்யூரிங்",
            "சிவப்பு செங்கல் கட்டுமானம் (₹10)",
            "அக்னி ஸ்டீல் & டால்மியா சிமெண்ட்",
            "UPVC ஜன்னல்கள் (₹400/ச.அடி)",
            "ஏசியன் புட்டி + டிராக்டர் பெயிண்ட்"
          ]
        },
        plus: {
          rate: 2400,
          column: "C",
          label: "Plus",
          labelTa: "பிளஸ்",
          tagline: "Upgraded specs with cube testing",
          taglineTa: "கான்கிரீட் க்யூப் சோதனையுடன் கூடிய மேம்பட்ட தரம்",
          suits: "Premium family residences with advanced structural checks",
          suitsTa: "மேம்பட்ட பாதுகாப்புடன் கூடிய குடும்ப வீடுகள்",
          highlights: [
            "Concrete cube strength testing",
            "Class-A red brick (₹11)",
            "Amman steel & UltraTech / Ramco cement",
            "UPVC windows (₹450/sq.ft)",
            "Asian putty + Premium + Ace exterior"
          ],
          highlightsTa: [
            "கான்கிரீட் க்யூப் சோதனை உறுதி",
            "முதல் தர சிவப்பு செங்கல் (₹11)",
            "அம்மன் ஸ்டீல் & அல்ட்ராடெக் / ராம்கோ",
            "UPVC ஜன்னல்கள் (₹450/ச.அடி)",
            "ஏசியன் புட்டி + பிரீமியம் + ஏஸ் பெயிண்ட்"
          ]
        }
      }
    },
    premium: {
      id: "premium",
      name: "Premium",
      nameTa: "பிரீமியம்",
      rate: 2500,
      column: "D",
      tagline: "Top brands + Soil test & Full lintel",
      taglineTa: "மண் பரிசோதனை + முழு லிண்டல் மற்றும் முன்னணி பிராண்டுகள்",
      suits: "Luxury residences, custom architectural villas & duplexes",
      suitsTa: "சொகுசு இல்லங்கள் மற்றும் பிரம்மாண்ட வில்லாக்கள்",
      highlights: [
        "Soil test & cube test included",
        "JSW steel & UltraTech Super / Ramco Super",
        "Red brick (₹12) / AAC blocks",
        "Full wall sill mat & full lintel beam",
        "Jaquar & Legrand fittings + Birla Apex paint"
      ],
      highlightsTa: [
        "மண் சோதனை மற்றும் க்யூப் சோதனை",
        "JSW எஃகு & அல்ட்ராடெக் சூப்பர் சிமெண்ட்",
        "சிவப்பு செங்கல் (₹12) / AAC பிளாக்",
        "முழு சுவர் சில் மேட் & முழு லிண்டல் பீம்",
        "ஜாகுவார், லெக்ராண்ட் பிட்டிங்ஸ் & பிர்லா அபெக்ஸ்"
      ]
    }
  },

  // 4. SPECIFICATION 2026 TABLE (Single Source of Truth, all 27 rows x 4 columns)
  // Columns: A=2200, B=2300, C=2400, D=2500
  spec2026: [
    // GROUP 1: Tests & Quality
    {
      group: "Tests & Quality",
      groupTa: "சோதனைகள் & தரம்",
      items: [
        { no: 1, name: "Water test", nameTa: "நீர் பரிசோதனை", a: "Yes", b: "Yes", c: "Yes", d: "Yes", diffPremium: false },
        { no: 2, name: "Soil test", nameTa: "மண் பரிசோதனை", a: "No", b: "No", c: "No", d: "Yes", diffPremium: true },
        { no: 3, name: "Cube test", nameTa: "கான்கிரீட் க்யூப் சோதனை", a: "No", b: "No", c: "Yes", d: "Yes", diffPremium: false },
        { no: 4, name: "Termite control", nameTa: "கரையான் தடுப்பு", a: "No", b: "Yes", c: "Yes", d: "Yes", diffPremium: false },
        { no: 5, name: "Curing", nameTa: "முறையான க்யூரிங்", a: "No", b: "Yes", c: "Yes", d: "Yes", diffPremium: false }
      ]
    },
    // GROUP 2: Structure
    {
      group: "Structure",
      groupTa: "கட்டமைப்பு விவரங்கள்",
      items: [
        { no: 6, name: "Footing size", nameTa: "அஸ்திவாரம் (Footing)", a: "4' × 4'", b: "4.5' × 4.5'", c: "As per structure", d: "As per structure", diffPremium: false },
        { no: 7, name: "Basement height", nameTa: "பேஸ்மென்ட் உயரம்", a: "2'", b: "2'6\"", c: "3'", d: "3'6\"", diffPremium: true },
        { no: 8, name: "Basement floor", nameTa: "பேஸ்மென்ட் தரைத்தளம்", a: "PCC", b: "PCC", c: "Mat", d: "Mat", diffPremium: false },
        { no: 9, name: "Column size", nameTa: "தூண் அளவு (Column)", a: "9\" × 9\"", b: "1' × 9\"", c: "As per structure", d: "As per structure", diffPremium: false },
        { no: 10, name: "Sill mat", nameTa: "சில் மேட் (Sill)", a: "Only window area", b: "Only window area", c: "Only window area", d: "Full wall", diffPremium: true },
        { no: 11, name: "Lintel", nameTa: "லிண்டல் பீம்", a: "Full lintel beam", b: "Cut lintel", c: "Cut lintel", d: "Full lintel", diffPremium: true },
        { no: 12, name: "Roof beam", nameTa: "ரூஃப் பீம்", a: "No", b: "Yes", c: "As per structural", d: "As per structural", diffPremium: false },
        { no: 13, name: "Roof slab", nameTa: "ரூஃப் தளம் (Slab)", a: "One-way slab", b: "Two-way & one-way slab", c: "As per structural", d: "As per structural", diffPremium: false },
        { no: 14, name: "Parapet wall", nameTa: "கைப்பிடி சுவர்", a: "2.5 ft, 4.5\" wall", b: "2.5 ft, 4.5\" wall", c: "3 ft, 4.5\" wall", d: "3 ft, 9\" wall", diffPremium: true }
      ]
    },
    // GROUP 3: Materials
    {
      group: "Materials",
      groupTa: "கட்டுமான பொருட்கள்",
      items: [
        { no: 15, name: "Brick type", nameTa: "செங்கல் வகை", a: "Fly ash brick (₹8.50)", b: "Red brick (₹10)", c: "Red brick (₹11)", d: "Red brick (₹12) / AAC block", diffPremium: true },
        { no: 16, name: "Steel", nameTa: "எஃகு (Steel)", a: "Kavery", b: "Agni", c: "Amman", d: "JSW", diffPremium: true },
        { no: 17, name: "Cement", nameTa: "சிமெண்ட்", a: "Coromandel", b: "Dalmia", c: "UltraTech / Ramco", d: "UltraTech Super / Ramco Super", diffPremium: true },
        { no: 18, name: "Sand", nameTa: "மணல் (Sand)", a: "M-sand / P-sand", b: "M-sand / P-sand", c: "M-sand / P-sand", d: "M-sand / P-sand", diffPremium: false }
      ]
    },
    // GROUP 4: Fittings & Finishes
    {
      group: "Fittings & Finishes",
      groupTa: "பொருத்துதல்கள் & பூச்சுகள்",
      items: [
        { no: 19, name: "Pipes", nameTa: "குழாய்கள் (Pipes)", a: "Any ISI brand", b: "Avon Plast", c: "Ashirvad", d: "Finolex", diffPremium: true },
        { no: 20, name: "Wire", nameTa: "மின்சார வயர்", a: "Any ISI brand", b: "Kundan", c: "Orbit", d: "Havells / Polycab", diffPremium: true },
        { no: 21, name: "Switch", nameTa: "சுவிட்சுகள்", a: "Any ISI brand", b: "Lisha / Hi-Fi", c: "Anchor", d: "Legrand / Havells", diffPremium: true },
        { no: 22, name: "Plumbing fittings", nameTa: "பிளம்பிங் பிட்டிங்ஸ்", a: "Any ISI brand", b: "Waterman", c: "Parryware", d: "Jaquar", diffPremium: true },
        { no: 23, name: "Water tank", nameTa: "தண்ணீர் தொட்டி", a: "500 L", b: "1000 L", c: "1000 L", d: "2000 L", diffPremium: true },
        { no: 24, name: "Main door allowance", nameTa: "முக்கிய கதவு ஒதுக்கீடு", a: "₹30,000", b: "₹50,000", c: "₹60,000", d: "₹70,000", diffPremium: true },
        { no: 25, name: "Windows", nameTa: "ஜன்னல்கள்", a: "Wood window (Vembu or Badak)", b: "UPVC ₹400/sq.ft", c: "UPVC ₹450/sq.ft", d: "UPVC ₹500/sq.ft", diffPremium: true },
        { no: 26, name: "Tiles allowance", nameTa: "டைல்ஸ் ஒதுக்கீடு", a: "₹40/sq.ft", b: "₹50/sq.ft", c: "₹60/sq.ft", d: "₹70/sq.ft", diffPremium: true },
        { no: 27, name: "Painting", nameTa: "வண்ணப்பூச்சு (Painting)", a: "Birla Opus paint", b: "Asian putty, Tractor, Ace", c: "Asian putty, Premium, Ace", d: "Birla putty, Premium, Apex", diffPremium: true }
      ]
    }
  ],

  // 5. SERVICES FROM SIGNBOARD & SITE
  services: [
    {
      id: "construction",
      titleEn: "Construction (Villas & Homes)",
      titleTa: "வீடு & வில்லா கட்டுமானம்",
      shortEn: "Turnkey build from Vasthu planning and foundation to full interior finishing.",
      shortTa: "வாஸ்து திட்டம், அஸ்திவாரம் முதல் முழுமையான தரை பூச்சு வரை.",
      bulletsEn: [
        "100% turnkey residential delivery",
        "Structural design & IS standard adherence",
        "Continuous site supervision & quality checks"
      ],
      bulletsTa: [
        "முழுமையான நேரடி வீட்டு ஒப்படைப்பு",
        "கட்டமைப்பு வடிவமைப்பு & தர உறுதி",
        "தொடர் கள மேற்பார்வை"
      ]
    },
    {
      id: "plans-elevations",
      titleEn: "Plans & Elevations",
      titleTa: "பிளான் & 3D முகப்பு வடிவமைப்பு",
      shortEn: "2D architectural floor plans, photorealistic 3D elevations and Vasthu layouts.",
      shortTa: "2D கட்டட வரைபடங்கள் மற்றும் 3D நவீன முகப்பு வடிவமைப்பு.",
      bulletsEn: [
        "Custom 2D working floor plans",
        "Ultra-realistic 3D elevations & walk-throughs",
        "100% Vasthu-aligned room layouts"
      ],
      bulletsTa: [
        "தனிப்பயன் 2D வரைபடங்கள்",
        "துல்லியமான 3D வெளித்தோற்றங்கள்",
        "100% வாஸ்து சார்ந்த அமைப்புகள்"
      ]
    },
    {
      id: "building-approvals",
      titleEn: "Building Approvals",
      titleTa: "கட்டட அனுமதி & சான்றிதழ்கள்",
      shortEn: "Complete DTCP, panchayat and municipal drawing documentation and sanction support.",
      shortTa: "DTCP மற்றும் நகராட்சி கட்டட அனுமதி ஒப்புதல்கள்.",
      bulletsEn: [
        "DTCP & Local body sanction drawings",
        "Statutory compliance & documentation",
        "Hassle-free engineering clearance"
      ],
      bulletsTa: [
        "அரசு அனுமதி வரைபடங்கள்",
        "சட்டப்பூர்வ ஆவண தயாரிப்புகள்",
        "விரைவான அனுமதி ஒருங்கிணைப்பு"
      ]
    },
    {
      id: "interiors",
      titleEn: "Interiors & Modular Fitouts",
      titleTa: "உட்புற அலங்காரம் & மாடுலர்",
      shortEn: "Modular kitchens, false ceilings, custom woodwork, lighting and complete fit-outs.",
      shortTa: "மாடுலர் சமையலறை, சீலிங் மற்றும் பிரீமியம் மர வேலைப்பாடுகள்.",
      bulletsEn: [
        "Custom modular kitchen & wardrobes",
        "Designer gypsum & wooden false ceilings",
        "Ambient architectural lighting"
      ],
      bulletsTa: [
        "நவீன மாடுலர் கிச்சன் & வார்ட்ரோப்",
        "வடிவமைக்கப்பட்ட ஃபால்ஸ் சீலிங்",
        "அழகிய உள் அலங்கார விளக்குகள்"
      ]
    },
    {
      id: "renovations",
      titleEn: "Renovations & Floor Additions",
      titleTa: "புதுப்பித்தல் & கூடுதல் தளங்கள்",
      shortEn: "Structural strengthening, additional floors, elevation makeovers and remodeling.",
      shortTa: "பழைய வீடுகளை புதுப்பித்தல் மற்றும் கூடுதல் மாடி அமைத்தல்.",
      bulletsEn: [
        "Column & beam structural strengthening",
        "Modern facade elevation makeovers",
        "Complete plumbing & electrical rewiring"
      ],
      bulletsTa: [
        "தூண் & பீம் கட்டமைப்பு வலுவூட்டல்",
        "நவீன முகப்பு தோற்ற மாற்றம்",
        "முழுமையான மறுசீரமைப்பு பணிகள்"
      ]
    },
    {
      id: "estimation-consulting",
      titleEn: "Estimation & Consulting",
      titleTa: "மதிப்பீடு & பொறியியல் ஆலோசனை",
      shortEn: "Itemised BOQ estimates, on-site structural inspections and certified engineer guidance.",
      shortTa: "துல்லியமான செலவு மதிப்பீடு மற்றும் தள ஆய்வு ஆலோசனைகள்.",
      bulletsEn: [
        "Itemised material & labour BOQ",
        "Bank loan estimate documentation",
        "Expert site inspection & soil guidance"
      ],
      bulletsTa: [
        "விரிவான கட்டுமான செலவு பட்டியல்",
        "வங்கி கடன் மதிப்பீட்டு ஆவணங்கள்",
        "நேரடி கள ஆய்வு மற்றும் வழிகாட்டுதல்"
      ]
    }
  ],

  serviceChips: [
    { en: "PEB & Industrial Sheds", ta: "தொழில்துறை எஃகு கூடங்கள் (PEB)" },
    { en: "Commercial & Retail Buildings", ta: "வணிக வளாகங்கள் & கடைகள்" }
  ],

  // 6. PROCESS STEPS (5 short steps)
  processSteps: [
    { no: "01", titleEn: "Site Visit", titleTa: "தள ஆய்வு", descEn: "Free initial inspection & land assessment.", descTa: "இலவச நேரடி நில ஆய்வு & பரிசீலனை." },
    { no: "02", titleEn: "Design & Approval", titleTa: "வடிவமைப்பு & அனுமதி", descEn: "2D Vasthu plan, 3D render & sanction drawing.", descTa: "2D வாஸ்து வரைபடம் & 3D தோற்றம்." },
    { no: "03", titleEn: "Agreement", titleTa: "ஒப்பந்தம்", descEn: "Transparent rate, clear BOQ & scheduled milestones.", descTa: "வெளிப்படையான விலை & பணி ஒப்பந்தம்." },
    { no: "04", titleEn: "Build", titleTa: "கட்டுமானம்", descEn: "Engineered execution with regular photo updates.", descTa: "பொறியாளர் மேற்பார்வையில் தரமான கட்டமைப்பு." },
    { no: "05", titleEn: "Handover", titleTa: "ஒப்படைப்பு", descEn: "Final quality check, deep clean & key handover.", descTa: "முழு ஆய்வு மற்றும் சாவியுடன் ஒப்படைப்பு." }
  ],

  // 7. QUICK ESTIMATOR DATA
  estimator: {
    scopes: [
      { id: "residential", nameEn: "Residential Villa / Duplex", nameTa: "குடியிருப்பு வில்லா / தனி வீடு", hasRates: true },
      { id: "commercial", nameEn: "Commercial & PEB Shed", nameTa: "வணிக கட்டடம் / PEB கூடம்", hasRates: false, rate: "" }, // TODO_OWNER
      { id: "interiors", nameEn: "Interiors-only", nameTa: "உட்புற அலங்காரம் மட்டும்", hasRates: false, rate: "" } // TODO_OWNER
    ],
    addOns: [
      { id: "kitchen", labelEn: "Modular Kitchen & Wardrobes", labelTa: "மாடுலர் கிச்சன் & வார்ட்ரோப்", cost: 275000 },
      { id: "elevation", labelEn: "3D Elevation & CAD Plans", labelTa: "3D முகப்பு & CAD வரைபடங்கள்", cost: 45000 },
      { id: "vasthu", labelEn: "Vasthu Blueprints & Sanction", labelTa: "வாஸ்து வரைபடம் & அரசு அனுமதி", cost: 35000 },
      { id: "borewell", labelEn: "Borewell & Water Sump", labelTa: "ஆழ்துளை கிணறு & நீர் தொட்டி", cost: 120000 }
    ],
    breakdownPercentages: {
      structure: 55, // Civil & RCC Structure
      finishing: 25, // Finishing & Woodwork
      mep: 12,       // Plumbing & Electrical
      siteCosts: 8   // Approvals, Contingency & Site Management
    }
  },

  // 8. PROVEN TRACK RECORD / STATS COUNTER
  stats: [
    { value: 10, suffix: "+", labelEn: "Years Experience", labelTa: "ஆண்டுகள் அனுபவம்" },
    { value: 20, suffix: "+", labelEn: "Projects Delivered", labelTa: "நிறைவுற்ற திட்டங்கள்" },
    { value: 100, suffix: "%", labelEn: "Vasthu Compliant", labelTa: "வாஸ்து பொருத்தம்" },
    { value: 50, suffix: "+", labelEn: "Happy Families", labelTa: "மகிழ்வான குடும்பங்கள்" }
  ],

  // 9. FREQUENTLY ASKED QUESTIONS (FAQ)
  faqs: [
    {
      id: "faq-cost",
      qEn: "What is the construction cost per sq.ft in Sirkazhi & coastal Tamil Nadu?",
      qTa: "சீர்காழி மற்றும் கடலோர பகுதியில் ஒரு சதுர அடி கட்டுமான விலை என்ன?",
      aEn: "Our 2026 residential construction packages range from ₹2,200/sq.ft (Basic), ₹2,300/sq.ft (Standard), ₹2,400/sq.ft (Plus), to ₹2,500/sq.ft (Premium). This includes all materials, skilled labour, registered engineer supervision, and complete turnkey delivery. We provide an exact itemised estimate after a free site visit.",
      aTa: "எங்களின் 2026 கட்டுமான பேக்கேஜ்கள் சதுர அடிக்கு ₹2,200 (அடிப்படை), ₹2,300 (ஸ்டாண்டர்ட்), ₹2,400 (பிளஸ்), ₹2,500 (பிரீமியம்) வரை உள்ளன. இதில் அனைத்து கட்டுமான பொருட்கள் மற்றும் தொழிலாளர் கூலி முழுமையாக அடங்கும். நேரடி நில ஆய்வுக்குப் பின் விரிவான மதிப்பீடு வழங்கப்படும்."
    },
    {
      id: "faq-timeline",
      qEn: "How long does it take to obtain building approvals?",
      qTa: "கட்டட அனுமதி பெற எவ்வளவு காலம் ஆகும்?",
      aEn: "Local panchayat approvals typically take 15 to 30 days, while DTCP and municipal sanctions generally take 30 to 45 days. As certified registered engineers, we prepare compliant drawings and handle the entire statutory documentation seamlessly.",
      aTa: "உள்ளூர் பஞ்சாயத்து அனுமதி பெற 15 முதல் 30 நாட்களும், DTCP அல்லது நகராட்சி அனுமதி பெற 30 முதல் 45 நாட்களும் ஆகும். பதிவுபெற்ற பொறியாளராக நாங்களே முழுமையான வரைபடங்கள் மற்றும் அரசு அனுமதிகளை ஒருங்கிணைக்கிறோம்."
    },
    {
      id: "faq-materials",
      qEn: "What brands of materials do you use for construction?",
      qTa: "கட்டுமானத்திற்கு என்னென்ன பிராண்ட் பொருட்கள் பயன்படுத்தப்படுகின்றன?",
      aEn: "We strictly use tested ISI-certified brands: UltraTech, Ramco, or Dalmia cement; JSW, Amman, or Agni Fe-550D TMT steel; first-class chamber red bricks; UPVC windows; Finolex or Ashirvad plumbing; and Asian Paints / Birla Opus finishes matching your selected package.",
      aTa: "நாங்கள் ISI சான்றிதழ் பெற்ற தரமான பிராண்டுகளை மட்டுமே பயன்படுத்துகிறோம்: அல்ட்ராடெக்/ராம்கோ சிமெண்ட், JSW/அம்மன் TMT ஸ்டீல், முதல் தர சிவப்பு செங்கற்கள், UPVC ஜன்னல்கள், பினோலெக்ஸ் பைப் மற்றும் ஏசியன் பெயிண்ட்ஸ்."
    },
    {
      id: "faq-milestones",
      qEn: "How are payment milestones structured?",
      qTa: "கட்டுமான கட்டண தவணைகள் (Payment Milestones) எவ்வாறு பிரிக்கப்பட்டுள்ளன?",
      aEn: "Payments are linked purely to verified on-site progress across transparent stages: Advance on Agreement (10%), Foundation & Plinth (20%), Lintel & Roof Slab (25%), Brickwork & Plastering (20%), Flooring & MEP Fittings (15%), and Final Handover with deep cleaning (10%). No hidden charges.",
      aTa: "கட்டுமான கட்டணங்கள் வெளிப்படையான 6 நிலைகளாக பிரிக்கப்பட்டுள்ளன: முன்பணம் (10%), அஸ்திவாரம் (20%), ரூஃப் தளம் (25%), பூச்சு வேலை (20%), டைல்ஸ் & பிளம்பிங் (15%), மற்றும் சாவி ஒப்படைப்பு (10%). எந்த மறைமுகக் கட்டணங்களும் இல்லை."
    }
  ],

  // 10. BILINGUAL UI STRINGS
  ui: {
    en: {
      langBtn: "தமிழ்",
      navHero: "Home",
      navWork: "Projects",
      navServices: "Services",
      navPackages: "Packages",
      navEstimator: "Estimator",
      navAbout: "About",
      navContact: "Contact",

      heroEyebrow: "MAK BUILD · SIRKAZHI",
      heroH1: "Modern Construction & Design in Tamil Nadu",
      heroSub: "Villas • Commercial • Interiors • Vastu",
      heroCtaQuote: "Get Free Quote",
      heroCtaWork: "View Our Work",
      heroInfoEngineer: "Led by Er. Manikandan Rajendran – Registered Civil & Structural Engineer",
      heroInfoDesigner: "Kalaiyarasi Sundar – Associate Designer",
      heroInfoScope: "Plans • Approvals • Construction",
      heroInfoStudio: "Sirkazhi Studio",
      heroBadge3d: "3D Design",

      trustStrip: [
        "Customized Vasthu Plan",
        "Structural Engineering Design",
        "GFC Standard Drawings",
        "Built to IS Standards",
        "Direct Site Supervision"
      ],

      servicesHeading: "Our Capabilities",
      servicesSub: "Turnkey engineering solutions from blueprint to handover.",
      knowMore: "Know more",
      closeModal: "Close",

      packagesHeading: "Packages 2026",
      packagesSub: "Price per sq.ft, including materials & labour.",
      mostPopular: "Most Popular",
      selectOption: "Option:",
      compareFull: "Compare full specification",
      getQuoteBtn: "Get {tier} quote on WhatsApp",
      indicativeFooter: "Indicative rates for residential construction. Final quotation after site visit.",

      compareTitle: "Complete 2026 Technical Specification",
      compareSub: "Cell-by-cell comparison across all 4 construction tiers.",
      tableColSpec: "Work & Material",
      tableColA: "Basic (₹2,200)",
      tableColB: "Standard (₹2,300)",
      tableColC: "Plus (₹2,400)",
      tableColD: "Premium (₹2,500)",

      projectsHeading: "Featured Showcase",
      projectsSub: "Real completed buildings and upcoming architectural 3D designs.",
      tabAll: "All",
      tabVillas: "Villas",
      tabCommercial: "Commercial & PEB",
      tabInteriors: "Interiors",
      tabDesigns: "3D Designs",
      dragToCompare: "Drag slider or swipe to compare",
      viewProject: "View project",
      followInstagram: "Follow @mak_build_construction",
      instagramCardTitle: "See Our Daily Site Updates",
      instagramCardSub: "Scan the QR code or follow us on Instagram for live construction walkthroughs.",

      estimatorHeading: "Quick Cost Estimator",
      estimatorSub: "Transparent indicative estimation based on 2026 specifications.",
      estScopeLabel: "Project Type",
      estAreaLabel: "Built-up Area (sq.ft)",
      estPackageLabel: "Construction Package",
      estAddonsLabel: "Optional Add-ons",
      estResultTitle: "Estimated Cost Range",
      estIndicativeNote: "Indicative range (base ±5%). Includes materials & labour.",
      estWhatsAppBtn: "Send estimate on WhatsApp",
      estEmptyRateNotice: "Share your requirement – we'll quote directly on WhatsApp.",
      estBreakdownTitle: "Cost Distribution (100%)",
      estBreakdownCivil: "Civil & RCC Structure (55%)",
      estBreakdownFinishing: "Finishing & Woodwork (25%)",
      estBreakdownPlumbing: "Plumbing & Electrical (12%)",
      estBreakdownApprovals: "Approvals & Site Setup (8%)",
      estHowWeCalc: "How we calculate: Built-up Area × Package Rate + Selected Add-ons. Subject to site survey and soil conditions.",

      processHeading: "Our 5-Step Process",
      processSub: "From your initial idea to the day you step inside.",

      testimonialsHeading: "Client Stories",
      testimonialsSub: "What homeowners say about building with MAK BUILD.",

      aboutHeading: "Engineering Leadership",
      aboutSub: "Registered civil engineering precision at every stage.",
      aboutStudioTitle: "Visit our Sirkazhi Studio",
      aboutIntro1: "MAK BUILD is headed by Er. Manikandan Rajendran, a qualified Civil and Structural Engineer dedicated to delivering durable, architecturally refined homes.",
      aboutIntro2: "Every project combines modern structural engineering with strict Vasthu compliance, ensuring aesthetic excellence and generational strength.",

      faqHeading: "Frequently Asked Questions",
      faqSub: "Clear answers to essential construction, cost, and approval queries.",

      contactHeading: "Let's Build Together",
      contactSub: "Schedule a free site visit or consultation with our civil engineer.",
      contactFormName: "Your Name",
      contactFormPhone: "Phone Number",
      contactFormLocation: "Site Location",
      contactFormType: "Project Type",
      contactFormMessage: "Message / Requirements",
      contactFormSubmit: "Send Enquiry",
      contactSending: "Sending...",
      contactSuccess: "Thank you! We will get in touch shortly.",
      contactError: "Could not send form directly. Redirecting to WhatsApp...",
      contactPhoneTitle: "Call Us Directly",
      contactWhatsAppTitle: "WhatsApp Desk",
      contactAddressTitle: "Our Studio",

      footerHiring: "We're hiring a Draftsman – WhatsApp us",
      footerRights: "© 2026 MAK BUILD – Construction & Design. All rights reserved.",
      footerNotice: "Sirkazhi, Mayiladuthurai District, Tamil Nadu."
    },
    ta: {
      langBtn: "English",
      navHero: "முகப்பு",
      navWork: "திட்டங்கள்",
      navServices: "சேவைகள்",
      navPackages: "விலை",
      navEstimator: "மதிப்பீடு",
      navAbout: "எங்களை பற்றி",
      navContact: "தொடர்பு",

      heroEyebrow: "MAK BUILD · சீர்காழி",
      heroH1: "தமிழ்நாட்டில் நவீன கட்டுமானம் மற்றும் வடிவமைப்பு",
      heroSub: "வில்லாக்கள் • வணிக வளாகங்கள் • உட்புற அலங்காரம் • வாஸ்து",
      heroCtaQuote: "இலவச மதிப்பீடு பெற",
      heroCtaWork: "திட்டங்களை காண்க",
      heroInfoEngineer: "பொறியாளர் மணிகண்டன் ராஜேந்திரன் – பதிவுபெற்ற சிவில் & கட்டமைப்பு பொறியாளர்",
      heroInfoDesigner: "கலையரசி சுந்தர் – இணை வடிவமைப்பாளர்",
      heroInfoScope: "திட்டங்கள் • அனுமதிகள் • கட்டுமானம்",
      heroInfoStudio: "சீர்காழி ஸ்டுடியோ",
      heroBadge3d: "3D வடிவமைப்பு",

      trustStrip: [
        "வாஸ்து சார்ந்த திட்டங்கள்",
        "கட்டமைப்பு பொறியியல் வடிவமைப்பு",
        "GFC வரைபடங்கள்",
        "IS தரநிலைகளின்படி கட்டுமானம்",
        "நேரடி தள மேற்பார்வை"
      ],

      servicesHeading: "எங்கள் சேவைகள்",
      servicesSub: "வரைபடம் முதல் வீடு ஒப்படைப்பு வரையிலான முழுமையான பொறியியல் தீர்வுகள்.",
      knowMore: "மேலும் அறிய",
      closeModal: "மூடுக",

      packagesHeading: "கட்டுமான பேக்கேஜ்கள் 2026",
      packagesSub: "சதுர அடி விலை, பொருட்கள் மற்றும் கூலி உட்பட.",
      mostPopular: "அதிகம் விரும்பப்படும் தேர்வு",
      selectOption: "தேர்வு:",
      compareFull: "முழு விவரங்களையும் ஒப்பிடுக",
      getQuoteBtn: "வாட்ஸ்அப்பில் {tier} விலை பெற",
      indicativeFooter: "இது உத்தேச குடியிருப்பு வீடுகளுக்கான விலை. நேரடி ஆய்வுக்கு பின் இறுதியாகும்.",

      compareTitle: "முழுமையான 2026 தொழில்நுட்ப விவரங்கள்",
      compareSub: "4 வகை கட்டுமான பேக்கேஜ்களின் ஒப்பீடு.",
      tableColSpec: "பணி & பொருள்",
      tableColA: "அடிப்படை (₹2,200)",
      tableColB: "ஸ்டாண்டர்ட் (₹2,300)",
      tableColC: "பிளஸ் (₹2,400)",
      tableColD: "பிரீமியம் (₹2,500)",

      projectsHeading: "எங்கள் படைப்புகள்",
      projectsSub: "முடிவடைந்த திட்டங்கள் மற்றும் 3D நவீன வடிவமைப்பு காட்சிகள்.",
      tabAll: "அனைத்தும்",
      tabVillas: "வில்லாக்கள்",
      tabCommercial: "வணிகம் & PEB",
      tabInteriors: "உட்புறம்",
      tabDesigns: "3D வடிவமைப்பு",
      dragToCompare: "நகர்த்தி ஒப்பீடு செய்க",
      viewProject: "காண்க",
      followInstagram: "இன்ஸ்டாகிராமில் தொடரவும்",
      instagramCardTitle: "தினசரி தள நேரலை அப்டேட்கள்",
      instagramCardSub: "நேரடி வீடியோக்களை காண இன்ஸ்டாகிராமில் இணைந்திடுங்கள்.",

      estimatorHeading: "விரைவு செலவு மதிப்பீடு",
      estimatorSub: "2026 விவரங்களின்படி உத்தேச செலவை கணக்கிடுங்கள்.",
      estScopeLabel: "திட்ட வகை",
      estAreaLabel: "கட்டட பரப்பளவு (சதுர அடி)",
      estPackageLabel: "பேக்கேஜ் தேர்வு",
      estAddonsLabel: "கூடுதல் வசதிகள்",
      estResultTitle: "உத்தேச செலவு",
      estIndicativeNote: "உத்தேச வரம்பு (±5%). பொருட்கள் மற்றும் தொழிலாளர் கூலி உட்பட.",
      estWhatsAppBtn: "வாட்ஸ்அப்பில் மதிப்பீட்டை அனுப்ப",
      estEmptyRateNotice: "உங்கள் தேவையை பகிருங்கள் – வாட்ஸ்அப்பில் மதிப்பீடு வழங்கப்படும்.",
      estBreakdownTitle: "செலவு பகிர்வு (100%)",
      estBreakdownCivil: "சிவில் & ஆர்சிசி கட்டமைப்பு (55%)",
      estBreakdownFinishing: "பூச்சு & மர வேலைப்பாடுகள் (25%)",
      estBreakdownPlumbing: "பிளம்பிங் & எலக்ட்ரிக்கல் (12%)",
      estBreakdownApprovals: "அனுமதிகள் & தள பராமரிப்பு (8%)",
      estHowWeCalc: "கணக்கீட்டு முறை: பரப்பளவு × பேக்கேஜ் விலை + கூடுதல் வசதிகள்.",

      processHeading: "எங்கள் 5-படி செயல்முறை",
      processSub: "முதல் சந்திப்பு முதல் சாவி ஒப்படைக்கும் நாள் வரை.",

      testimonialsHeading: "வாடிக்கையாளர் கருத்துகள்",
      testimonialsSub: "எங்களுடன் வீடு கட்டியவர்களின் அனுபவம்.",

      aboutHeading: "பொறியியல் தலைமை",
      aboutSub: "ஒவ்வொரு நிலையிலும் பதிவுபெற்ற பொறியாளரின் நேரடி பாதுகாப்பு.",
      aboutStudioTitle: "எங்கள் சீர்காழி ஸ்டுடியோவிற்கு வருகை தருக",
      aboutIntro1: "MAK BUILD நிறுவனம் சிவில் மற்றும் கட்டமைப்பு பொறியாளர் மணிகண்டன் ராஜேந்திரன் தலைமையில் இயங்குகிறது.",
      aboutIntro2: "நவீன கட்டமைப்பு பொறியியலுடன் துல்லியமான வாஸ்து சாஸ்திரத்தையும் இணைத்து தலைமுறை கடந்து நிற்கும் இல்லங்களை உருவாக்குகிறோம்.",

      faqHeading: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
      faqSub: "கட்டுமானம், திட்ட அனுமதி மற்றும் செலவுகள் பற்றிய விளக்கங்கள்.",

      contactHeading: "தொடர்பு கொள்க",
      contactSub: "இலவச தள ஆய்வு மற்றும் ஆலோசனைக்கு எங்களை தொடர்பு கொள்ளுங்கள்.",
      contactFormName: "உங்கள் பெயர்",
      contactFormPhone: "தொலைபேசி எண்",
      contactFormLocation: "இடத்தின் பெயர்",
      contactFormType: "திட்ட வகை",
      contactFormMessage: "தகவல் / தேவைகள்",
      contactFormSubmit: "விவரங்களை அனுப்புக",
      contactSending: "அனுப்பப்படுகிறது...",
      contactSuccess: "நன்றி! விரைவில் தொடர்பு கொள்கிறோம்.",
      contactError: "படிவத்தை நேரடியாக அனுப்ப முடியவில்லை. வாட்ஸ்அப்பிற்கு மாற்றப்படுகிறது...",
      contactPhoneTitle: "தொலைபேசி",
      contactWhatsAppTitle: "வாட்ஸ்அப்",
      contactAddressTitle: "எங்கள் அலுவலகம்",

      footerHiring: "வரைவாளர் (Draftsman) தேவை – வாட்ஸ்அப் செய்க",
      footerRights: "© 2026 MAK BUILD – Construction & Design. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
      footerNotice: "சீர்காழி, மயிலாடுதுறை மாவட்டம், தமிழ்நாடு."
    }
  }
};
