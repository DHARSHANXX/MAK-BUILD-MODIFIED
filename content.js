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
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3913.3349088498817!2d79.73960620000001!3d11.2367552!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a54dfe70853801d%3A0xcccc61647a031879!2sMAK%20Build%20Construction%20%26%20Design!5e0!3m2!1sen!2sin!4v1792056956421!5m2!1sen!2sin",
      googleMapsUrl: "https://www.google.com/maps?cid=14757277163157919865",
      directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=MAK+Build+Construction+%26+Design+Sirkazhi"
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
        "Fly ash brick",
        "Kavery steel & Coromandel cement",
        "Wood window (Vembu/Badak)",
        "Birla Opus paint finish"
      ],
      highlightsTa: [
        "நீர் பரிசோதனை சேர்க்கப்பட்டுள்ளது",
        "ஃப்ளை ஆஷ் செங்கல்",
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
            "Red brick construction",
            "Agni steel & Dalmia cement",
            "UPVC windows",
            "Asian putty + Tractor emulsion"
          ],
          highlightsTa: [
            "கரையான் தடுப்பு & க்யூரிங்",
            "சிவப்பு செங்கல் கட்டுமானம்",
            "அக்னி ஸ்டீல் & டால்மியா சிமெண்ட்",
            "UPVC ஜன்னல்கள்",
            "ஏசியன் பட்டி + டிராக்டர் பெயிண்ட்"
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
            "Class-A red brick",
            "Amman steel & UltraTech / Ramco cement",
            "UPVC windows",
            "Asian putty + Premium + Ace exterior"
          ],
          highlightsTa: [
            "கான்கிரீட் க்யூப் சோதனை உறுதி",
            "முதல் தர சிவப்பு செங்கல்",
            "அம்மன் ஸ்டீல் & அல்ட்ராடெக் / ராம்கோ",
            "UPVC ஜன்னல்கள்",
            "ஏசியன் பட்டி + பிரீமியம் + ஏஸ் பெயிண்ட்"
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
        "Red brick / AAC blocks",
        "Full wall sill mat & full lintel beam",
        "Jaquar & Legrand fittings + Birla Apex paint"
      ],
      highlightsTa: [
        "மண் சோதனை மற்றும் க்யூப் சோதனை",
        "JSW ஸ்டீல் & அல்ட்ராடெக் சூப்பர் சிமெண்ட்",
        "சிவப்பு செங்கல் / AAC பிளாக்",
        "முழு சுவர் சில் மேட் & முழு லிண்டல் பீம்",
        "ஜாகுவார், லெக்ராண்ட் பிட்டிங்ஸ் & பிர்லா அபெக்ஸ்"
      ]
    }
  },

  // 4. SERVICES FROM SIGNBOARD & SITE (Restored original long card copy from commit 76990cf + popup metadata)
  services: [
    {
      id: "construction",
      slug: "construction",
      titleEn: "Construction (Villas & Homes)",
      titleTa: "வீடு & வில்லா கட்டுமானம்",
      shortEn: "Turnkey build from Vasthu planning and foundation to full interior finishing.",
      shortTa: "வாஸ்து திட்டமிடல், அஸ்திவாரம் முதல் முழுமையான பினிஷிங் பணிகள் வரை.",
      modalShortEn: "Turnkey homes, from foundation to finishing.",
      modalShortTa: "அஸ்திவாரம் முதல் முழு பூச்சு வரை நேரடி கட்டுமானம்.",
      chipsEn: ["Turnkey delivery", "IS standards", "Site supervision"],
      chipsTa: ["முழுமையான ஒப்படைப்பு", "IS தரநிலைகள்", "கள மேற்பார்வை"],
      imageBase: "images/services/construction",
      imageType: 1,
      focalPoint: "center 42%",
      imageAltEn: "Senthil Residence in Sirkazhi — Turnkey two-storey villa construction by MAK BUILD",
      imageAltTa: "சீர்காழி செந்தில் இல்லம் — MAK BUILD நேரடி வில்லா கட்டுமானம்",
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
      slug: "plans-elevations",
      titleEn: "Plans & Elevations",
      titleTa: "பிளான் & 3D முகப்பு வடிவமைப்பு",
      shortEn: "2D architectural floor plans, photorealistic 3D elevations and Vasthu layouts.",
      shortTa: "2D கட்டட வரைபடங்கள் மற்றும் 3D நவீன முகப்பு வடிவமைப்பு.",
      modalShortEn: "2D plans and realistic 3D elevations.",
      modalShortTa: "2D வரைபடங்கள் மற்றும் தத்ரூபமான 3D முகப்புகள்.",
      chipsEn: ["Working plans", "3D elevations", "Vasthu layouts"],
      chipsTa: ["2D வரைபடங்கள்", "3D முகப்புகள்", "வாஸ்து அமைப்பு"],
      imageBase: "images/services/plans-elevations",
      imageType: 2,
      focalPoint: "center 52%",
      imageAltEn: "Illustrative scene of an architect's desk with 2D floor plan drawings and a 3D South Indian villa elevation on a tablet",
      imageAltTa: "2D தரைத்தள வரைபடம் மற்றும் 3D வில்லா முகப்பு வடிவமைப்பு கொண்ட மேசை காட்சி",
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
      slug: "approvals",
      titleEn: "Building Approvals",
      titleTa: "கட்டட அனுமதி & சான்றிதழ்கள்",
      shortEn: "Complete DTCP, panchayat and municipal drawing documentation and sanction support.",
      shortTa: "DTCP மற்றும் நகராட்சி கட்டட அனுமதி ஒப்புதல்கள்.",
      modalShortEn: "DTCP and local body approvals, handled for you.",
      modalShortTa: "DTCP மற்றும் உள்ளாட்சி கட்டட அனுமதி சேவைகள்.",
      chipsEn: ["Sanction drawings", "Compliance", "Easy clearance"],
      chipsTa: ["அனுமதி வரைபடங்கள்", "விதிமுறை இணக்கம்", "எளிய ஒப்புதல்"],
      imageBase: "images/services/approvals",
      imageType: 2,
      focalPoint: "center 48%",
      imageAltEn: "Illustrative scene of architectural sanction drawings, stamp, files and scale house model on a desk",
      imageAltTa: "கட்டட அனுமதி வரைபடங்கள் மற்றும் மாதிரி இல்லம் கொண்ட மேசை",
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
      slug: "interiors",
      titleEn: "Interiors & Modular Fitouts",
      titleTa: "உட்புற அலங்காரம் & மாடுலர்",
      shortEn: "Modular kitchens, false ceilings, custom woodwork, lighting and complete fit-outs.",
      shortTa: "மாடுலர் சமையலறை, சீலிங் மற்றும் பிரீமியம் மர வேலைப்பாடுகள்.",
      modalShortEn: "Modular kitchens, ceilings and complete fit-outs.",
      modalShortTa: "மாடுலர் கிச்சன், சீலிங் மற்றும் முழு உட்புற அமைப்பு.",
      chipsEn: ["Kitchen & wardrobes", "False ceilings", "Ambient lighting"],
      chipsTa: ["கிச்சன் & வார்ட்ரோப்", "ஃபால்ஸ் சீலிங்", "நவீன அலங்கார விளக்குகள்"],
      imageBase: "images/services/interiors",
      imageType: 1,
      focalPoint: "center 50%",
      imageAltEn: "Interior at Chennai by MAK BUILD — Coffered wood false ceiling, marble TV unit and warm cove lighting",
      imageAltTa: "MAK BUILD சென்னை உட்புற வடிவமைப்பு — ஃபால்ஸ் சீலிங் மற்றும் டிவி யூனிட்",
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
      slug: "renovation",
      titleEn: "Renovations & Floor Additions",
      titleTa: "புதுப்பித்தல் & கூடுதல் தளங்கள்",
      shortEn: "Structural strengthening, additional floors, elevation makeovers and remodeling.",
      shortTa: "பழைய வீடுகளைப் புதுப்பித்தல் மற்றும் கூடுதல் தளம் அமைத்தல்.",
      modalShortEn: "Strengthen, extend and refresh your home.",
      modalShortTa: "வீட்டை வலுப்படுத்தி, விரிவாக்கி, நவீனமாகப் புதுப்பிக்கிறோம்.",
      chipsEn: ["Structural strengthening", "Facade makeover", "Plumbing & electrical"],
      chipsTa: ["கட்டமைப்பு வலுவூட்டல்", "முகப்பு மாற்றம்", "பிளம்பிங் & மின்சாரம்"],
      imageBase: "images/services/renovation",
      imageType: 2,
      focalPoint: "center 38%",
      imageAltEn: "Illustrative scene of a South Indian residential house undergoing a floor addition and facade renovation",
      imageAltTa: "வீடு புதுப்பித்தல் மற்றும் கூடுதல் தளம் அமைக்கும் மாதிரி காட்சி",
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
      slug: "estimation",
      titleEn: "Estimation & Consulting",
      titleTa: "மதிப்பீடு & பொறியியல் ஆலோசனை",
      shortEn: "Itemised BOQ estimates, on-site structural inspections and certified engineer guidance.",
      shortTa: "துல்லியமான செலவு மதிப்பீடு மற்றும் தள ஆய்வு ஆலோசனைகள்.",
      modalShortEn: "Clear BOQ estimates and expert site advice.",
      modalShortTa: "துல்லியமான BOQ மதிப்பீடு மற்றும் பொறியாளர் ஆலோசனை.",
      chipsEn: ["Material & labour BOQ", "Bank loan estimates", "Soil guidance"],
      chipsTa: ["பொருள் & கூலி BOQ", "வங்கிக் கடன் மதிப்பீடு", "மண் பரிசோதனை ஆலோசனை"],
      imageBase: "images/services/estimation",
      imageType: 2,
      focalPoint: "center 34%",
      imageAltEn: "Illustrative scene of a civil engineer inspecting a residential foundation column with measuring tape and clipboard",
      imageAltTa: "அஸ்திவார தூண் மற்றும் கம்பிகளை ஆய்வு செய்யும் பொறியாளர் காட்சி",
      bulletsEn: [
        "Itemised material & labour BOQ",
        "Bank loan estimate documentation",
        "Expert site inspection & soil guidance"
      ],
      bulletsTa: [
        "விரிவான கட்டுமானச் செலவுப் பட்டியல் (BOQ)",
        "வங்கிக் கடன் மதிப்பீட்டு ஆவணங்கள்",
        "நேரடி கள ஆய்வு மற்றும் வழிகாட்டுதல்"
      ]
    }
  ],

  serviceChips: [
    { en: "PEB & Industrial Sheds", ta: "தொழில்துறை ஸ்டீல் கூடங்கள் (PEB)" },
    { en: "Commercial & Retail Buildings", ta: "வணிக வளாகங்கள் & கடைகள்" }
  ],

  // 5. PROCESS STEPS (5 short steps with original flat vector illustrations)
  processSteps: [
    {
      no: "01",
      slug: "site-visit",
      titleEn: "Site Visit",
      titleTa: "தள ஆய்வு",
      descEn: "Free initial inspection & land assessment.",
      descTa: "இலவச நேரடி நில ஆய்வு & பரிசீலனை.",
      illustrationSrc: "images/process/illustrations/01-site-visit.svg",
      imageBase: "images/process/site-visit",
      imageType: 2,
      imageAltEn: "Flat vector illustration of two people in safety helmets looking at a tablet on a plot with dashed boundary, surveying tripod and coconut tree",
      imageAltTa: "தமிழ்நாட்டில் வீட்டு மனையை நேரில் ஆய்வு செய்யும் பொறியாளர் மற்றும் குடும்பத்தினர்"
    },
    {
      no: "02",
      slug: "design-approval",
      titleEn: "Design & Approval",
      titleTa: "வடிவமைப்பு & அனுமதி",
      descEn: "2D Vasthu plan, 3D render & sanction drawing.",
      descTa: "2D வாஸ்து வரைபடம் & 3D தோற்றம்.",
      illustrationSrc: "images/process/illustrations/02-design-approval.svg",
      imageBase: "images/process/design-approval",
      imageType: 2,
      imageAltEn: "Flat vector illustration of a rolled architectural house plan, drawing compass and approval shield with checkmark",
      imageAltTa: "2D வரைபடம் மற்றும் அனுமதி சான்றிதழ் கொண்ட வடிவமைப்பு காட்சி"
    },
    {
      no: "03",
      slug: "agreement",
      titleEn: "Agreement",
      titleTa: "ஒப்பந்தம்",
      descEn: "Transparent rate, clear BOQ & scheduled milestones.",
      descTa: "வெளிப்படையான விலை & பணி ஒப்பந்தம்.",
      illustrationSrc: "images/process/illustrations/03-agreement.svg",
      imageBase: "images/process/agreement",
      imageType: 2,
      imageAltEn: "Flat vector illustration of a checklist clipboard and handshake in front of it",
      imageAltTa: "சரிபார்ப்பு பட்டியல் மற்றும் கட்டுமான ஒப்பந்த கைகுலுக்கல் காட்சி"
    },
    {
      no: "04",
      slug: "build",
      titleEn: "Build",
      titleTa: "கட்டுமானம்",
      descEn: "Engineered execution with regular photo updates.",
      descTa: "பொறியாளர் மேற்பார்வையில் தரமான கட்டமைப்பு.",
      illustrationSrc: "images/process/illustrations/04-build.svg",
      imageBase: "images/process/build",
      imageType: 2,
      imageAltEn: "Flat vector illustration of a house frame under construction with scaffolding, tower crane and hammer",
      imageAltTa: "சாரம், கிரேன் மற்றும் சுத்தியலுடன் வீடு கட்டுமானப் பணி காட்சி"
    },
    {
      no: "05",
      slug: "handover",
      titleEn: "Handover",
      titleTa: "ஒப்படைப்பு",
      descEn: "Final quality check, deep clean & key handover.",
      descTa: "முழு ஆய்வு மற்றும் சாவியுடன் ஒப்படைப்பு.",
      illustrationSrc: "images/process/illustrations/05-handover.svg",
      imageBase: "images/process/handover",
      imageType: 2,
      imageAltEn: "Flat vector illustration of two hands passing a house key with a completed home behind",
      imageAltTa: "புதிய இல்லத்தின் பின்னணியில் சாவி ஒப்படைக்கும் காட்சி"
    }
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
      { id: "borewell", labelEn: "Borewell & Water Sump", labelTa: "ஆழ்துளைக் கிணறு & நீர்த்தொட்டி", cost: 120000 }
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
      aTa: "எங்களின் 2026 கட்டுமான பேக்கேஜ்கள் சதுர அடிக்கு ₹2,200 (அடிப்படை), ₹2,300 (ஸ்டாண்டர்ட்), ₹2,400 (பிளஸ்), ₹2,500 (பிரீமியம்) வரை உள்ளன. இதில் அனைத்துக் கட்டுமானப் பொருட்கள் மற்றும் தொழிலாளர் கூலி முழுமையாக அடங்கும். நேரடி நில ஆய்வுக்குப் பின் விரிவான மதிப்பீடு வழங்கப்படும்."
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
      scopeHeading: "Scope of Work",
      enquireWhatsApp: "Enquire on WhatsApp",
      backToServices: "Back to services",
      prevService: "Previous service",
      nextService: "Next service",
      waServiceMsg: "Hello MAK BUILD, I would like to enquire about your {service} service.",
      conceptTag: "Concept visualization",

      packagesHeading: "Packages 2026",
      packagesSub: "Price per sq.ft, including materials & labour.",
      mostPopular: "Most Popular",
      selectOption: "Option:",
      getQuoteBtn: "Get {tier} quote on WhatsApp",
      indicativeFooter: "Indicative rates for residential construction. Final quotation after site visit.",

      projectsEyebrow: "PROJECTS",
      projectsHeading: "Featured Showcase",
      projectsSub: "Explore our residential, interior, and commercial project albums.",
      tabAll: "All",
      tabResidential: "Residential",
      tabInterior: "Interior",
      tabCommercial: "Commercial",
      catResidential: "Residential",
      catInterior: "Interior",
      catCommercial: "Commercial",
      photoSingular: "1 photo",
      photoPlural: "{count} photos",
      viewProject: "View Project",
      backToProjects: "Back to Projects",
      metaProjectName: "Project Name",
      metaCategory: "Category",
      metaLocation: "Location",
      metaStatus: "Status",
      prevProject: "Previous Project",
      nextProject: "Next Project",
      chatProjectWhatsApp: "Chat on WhatsApp about this project",
      chatAboutProject: "Chat on WhatsApp about this project",
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
      aboutEngineerName: "Er. Manikandan Rajendran",
      aboutBadgeCivil: "Civil & Structural Engineer",
      aboutBadgeRegistered: "Registered Engineer",
      aboutCardAddress: "117C, Pidari South Street, Sirkazhi 609110",
      aboutStudioBtn: "VISIT OUR SIRKAZHI STUDIO",
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
      contactWhatsAppLink: "Chat with us on WhatsApp (+91 81441 66022)",
      contactAddressTitle: "Our Studio",

      locationMapHeading: "MAK BUILD LOCATION MAP",
      locationMapSub: "117C, Pidari South Street, Sirkazhi",
      locationGoogleMapsBadge: "Google Maps",
      locationVerifiedBadge: "GOOGLE MAPS VERIFIED",
      locationExpandMap: "Expand map view",
      locationExpandMapText: "Expand Map",
      locationOpenInMaps: "Open in Maps",
      locationOpenInMapsText: "Open in Maps",
      locationStudioBadge: "Engineering Studio & Office",
      engineerCivilTitle: "• Civil & Structural Engineer",
      locationAddressLabel: "Address",
      locationFullAddress: "117C, Pidari South Street, Sirkazhi, Tamil Nadu 609110",
      locationPhoneLabel: "Direct Calls",
      locationWhatsAppLabel: "WhatsApp Inquiry",
      locationEmailLabel: "Official Email",
      locationGetDirections: "Get Directions",

      footerHiring: "We're hiring a Draftsman – WhatsApp us",
      footerApplyWhatsApp: "Apply on WhatsApp →",
      footerBrandDesc: "We Build Dreams with Precision. Building Stronger Spaces for a Better Tomorrow. Led by Er. Manikandan Rajendran.",
      footerNavTitle: "Navigation",
      footerOfficeTitle: "Head Office",
      footerRights: "© 2026 MAK BUILD – Construction & Design. All rights reserved.",
      footerNotice: "Sirkazhi, Mayiladuthurai District, Tamil Nadu.",

      mobileCall: "Call",
      mobileWhatsApp: "WhatsApp",
      mobileEstimate: "Estimate",
      floatingWhatsApp: "Chat with us"
    },
    ta: {
      langBtn: "English",
      navHero: "முகப்பு",
      navWork: "திட்டங்கள்",
      navServices: "சேவைகள்",
      navPackages: "விலை",
      navEstimator: "மதிப்பீடு",
      navAbout: "எங்களைப் பற்றி",
      navContact: "தொடர்பு",

      heroEyebrow: "MAK BUILD · சீர்காழி",
      heroH1: "தமிழ்நாட்டில் நவீன கட்டுமானம் மற்றும் வடிவமைப்பு",
      heroSub: "வில்லாக்கள் • வணிக வளாகங்கள் • உட்புற அலங்காரம் • வாஸ்து",
      heroCtaQuote: "இலவச மதிப்பீடு பெற",
      heroCtaWork: "திட்டங்களைக் காண்க",
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
      scopeHeading: "பணி விவரங்கள்",
      enquireWhatsApp: "வாட்ஸ்அப்பில் விசாரிக்க",
      backToServices: "சேவைகளுக்குத் திரும்பு",
      prevService: "முந்தைய சேவை",
      nextService: "அடுத்த சேவை",
      waServiceMsg: "வணக்கம் MAK BUILD, உங்கள் '{service}' சேவை குறித்து விசாரிக்க விரும்புகிறேன்.",
      conceptTag: "மாதிரி வடிவமைப்பு காட்சி",

      packagesHeading: "கட்டுமான பேக்கேஜ்கள் 2026",
      packagesSub: "சதுர அடி விலை, பொருட்கள் மற்றும் கூலி உட்பட.",
      mostPopular: "அதிகம் விரும்பப்படும் தேர்வு",
      selectOption: "தேர்வு:",
      getQuoteBtn: "வாட்ஸ்அப்பில் {tier} விலை பெற",
      indicativeFooter: "இது குடியிருப்புக் கட்டுமானத்திற்கான உத்தேச விலை. நேரடி தள ஆய்வுக்குப் பின் இறுதி விலைப்பட்டியல் வழங்கப்படும்.",

      projectsEyebrow: "திட்டங்கள்",
      projectsHeading: "எங்கள் படைப்புகள்",
      projectsSub: "எங்கள் குடியிருப்பு, உட்புற மற்றும் வணிகத் திட்ட ஆல்பங்களைக் காணுங்கள்.",
      tabAll: "அனைத்தும்",
      tabResidential: "குடியிருப்பு",
      tabInterior: "உட்புறம்",
      tabCommercial: "வணிகம்",
      catResidential: "குடியிருப்பு",
      catInterior: "உட்புறம்",
      catCommercial: "வணிகம்",
      photoSingular: "1 படம்",
      photoPlural: "{count} படங்கள்",
      viewProject: "திட்டத்தைக் காண்க",
      backToProjects: "திட்டங்களுக்குத் திரும்பு",
      metaProjectName: "திட்டத்தின் பெயர்",
      metaCategory: "வகை",
      metaLocation: "இடம்",
      metaStatus: "நிலை",
      prevProject: "முந்தைய திட்டம்",
      nextProject: "அடுத்த திட்டம்",
      chatProjectWhatsApp: "இந்தத் திட்டம் குறித்து வாட்ஸ்அப்பில் உரையாடுங்கள்",
      chatAboutProject: "இந்தத் திட்டம் குறித்து வாட்ஸ்அப்பில் உரையாடுங்கள்",
      followInstagram: "இன்ஸ்டாகிராமில் தொடரவும்",
      instagramCardTitle: "தினசரி தள நேரலை அப்டேட்கள்",
      instagramCardSub: "நேரடி கட்டுமான வீடியோக்களைக் காண இன்ஸ்டாகிராமில் இணைந்திடுங்கள்.",

      estimatorHeading: "விரைவு செலவு மதிப்பீடு",
      estimatorSub: "2026 கட்டுமான விவரக்குறிப்புகளின்படி உத்தேச செலவைக் கணக்கிடுங்கள்.",
      estScopeLabel: "திட்ட வகை",
      estAreaLabel: "கட்டட பரப்பளவு (சதுர அடி)",
      estPackageLabel: "பேக்கேஜ் தேர்வு",
      estAddonsLabel: "கூடுதல் வசதிகள்",
      estResultTitle: "உத்தேச செலவு",
      estIndicativeNote: "உத்தேச வரம்பு (±5%). பொருட்கள் மற்றும் தொழிலாளர் கூலி உட்பட.",
      estWhatsAppBtn: "வாட்ஸ்அப்பில் மதிப்பீட்டை அனுப்ப",
      estEmptyRateNotice: "உங்கள் தேவையைப் பகிருங்கள் – வாட்ஸ்அப்பில் நேரடியாக மதிப்பீடு வழங்கப்படும்.",
      estBreakdownTitle: "செலவுப் பகிர்வு (100%)",
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
      aboutEngineerName: "பொறி. மணிகண்டன் ராஜேந்திரன்",
      aboutBadgeCivil: "சிவில் & கட்டமைப்பு பொறியாளர்",
      aboutBadgeRegistered: "பதிவுபெற்ற பொறியாளர்",
      aboutCardAddress: "117C, பிடாரி தெற்கு தெரு, சீர்காழி 609110",
      aboutStudioBtn: "எங்கள் சீர்காழி ஸ்டுடியோவிற்கு வருகை தருக",
      aboutIntro1: "MAK BUILD நிறுவனம் சிவில் மற்றும் கட்டமைப்பு பொறியாளர் மணிகண்டன் ராஜேந்திரன் தலைமையில் இயங்குகிறது.",
      aboutIntro2: "நவீன கட்டமைப்பு பொறியியலுடன் துல்லியமான வாஸ்து சாஸ்திரத்தையும் இணைத்து தலைமுறை கடந்து நிற்கும் இல்லங்களை உருவாக்குகிறோம்.",

      faqHeading: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
      faqSub: "கட்டுமானம், திட்ட அனுமதி மற்றும் செலவுகள் பற்றிய விளக்கங்கள்.",

      contactHeading: "தொடர்பு கொள்க",
      contactSub: "இலவச தள ஆய்வு மற்றும் ஆலோசனைக்கு எங்களைத் தொடர்பு கொள்ளுங்கள்.",
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
      contactWhatsAppLink: "வாட்ஸ்அப்பில் உரையாடுங்கள் (+91 81441 66022)",
      contactAddressTitle: "எங்கள் அலுவலகம்",

      locationMapHeading: "MAK BUILD வரைபடம் & அலுவலகம்",
      locationMapSub: "117C, பிடாரி தெற்கு வீதி, சீர்காழி",
      locationGoogleMapsBadge: "கூகுள் மேப்ஸ்",
      locationVerifiedBadge: "GOOGLE MAPS VERIFIED",
      locationExpandMap: "வரைபடத்தை பெரிதாக்குக",
      locationExpandMapText: "பெரிதாக்குக",
      locationOpenInMaps: "வரைபடத்தில் காண்க",
      locationOpenInMapsText: "வரைபடத்தில் காண்க",
      locationStudioBadge: "பொறியியல் ஸ்டுடியோ & அலுவலகம்",
      engineerCivilTitle: "• சிவில் & கட்டமைப்பு பொறியாளர்",
      locationAddressLabel: "முகவரி",
      locationFullAddress: "117C, பிடாரி தெற்கு வீதி, சீர்காழி, தமிழ்நாடு 609110",
      locationPhoneLabel: "நேரடி அழைப்புகள்",
      locationWhatsAppLabel: "வாட்ஸ்அப் உதவி",
      locationEmailLabel: "மின்னஞ்சல்",
      locationGetDirections: "வழிகாட்டுதல் பெறுக",

      footerHiring: "வரைவாளர் (Draftsman) தேவை – வாட்ஸ்அப் செய்க",
      footerApplyWhatsApp: "வாட்ஸ்அப்பில் விண்ணப்பிக்க →",
      footerBrandDesc: "துல்லியமான பொறியியலுடன் உங்கள் கனவு இல்லங்களை உருவாக்குகிறோம். பொறியாளர் மணிகண்டன் ராஜேந்திரன் தலைமையில்.",
      footerNavTitle: "பக்கங்கள்",
      footerOfficeTitle: "தலைமை அலுவலகம்",
      footerRights: "© 2026 MAK BUILD – Construction & Design. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
      footerNotice: "சீர்காழி, மயிலாடுதுறை மாவட்டம், தமிழ்நாடு.",

      mobileCall: "அழைக்க",
      mobileWhatsApp: "வாட்ஸ்அப்",
      mobileEstimate: "மதிப்பீடு",
      floatingWhatsApp: "வாட்ஸ்அப்"
    }
  }
};
