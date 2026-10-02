/**
 * MAK BUILD — Core Configuration & Data
 * All content, packages, spec rows, and business details.
 */

export const SITE = {
  name: "MAK BUILD",
  fullName: "MAK BUILD – Construction & Design",
  tagline: "Construction & Design",
  city: "Sirkazhi",
  district: "Mayiladuthurai District",
  state: "Tamil Nadu",
  pincode: "609110",
  address: "No.117c, Pidari South Street, Sirkazhi 609110",
  phonePrimary: "+918144166022",
  phonePrimaryDisplay: "81441 66022",
  phoneSecondary: "+919385747544",
  phoneSecondaryDisplay: "93857 47544",
  whatsappNumber: "918144166022",
  email: "makbuildsy@gmail.com",
  instagram: "https://www.instagram.com/mak_build_construction",
  googleMapsUrl: "https://www.google.com/maps?q=117c+Pidari+South+Street,+Sirkazhi+609110&output=embed",
  homesBuiltBadge: "50+ homes built across Sirkazhi & Mayiladuthurai",
  logo: "assets/mak-logo.webp",
  logoPng: "assets/mak-logo.png",
  heroImage: {
    jpg: "assets/villa-contemporary-after.jpg",
    webp: "assets/villa-contemporary-after.webp",
    webp640: "assets/villa-contemporary-after-640.webp",
    width: 638,
    height: 629,
    alt: "Contemporary modern villa built by MAK BUILD in Sirkazhi"
  }
};

export const WHY_STRIP_ITEMS = [
  { id: 1, key: "whyFreeDesign" },
  { id: 2, key: "whyCustomizedPlan" },
  { id: 3, key: "whyStructuralDesign" },
  { id: 4, key: "whyGfcDrawings" },
  { id: 5, key: "whyIsStandards" }
];

export const PACKAGES = [
  {
    id: "basic",
    name: "Basic",
    nameKey: "pkgBasicName",
    rate: 2200,
    unit: "/sq.ft",
    taglineKey: "pkgBasicTagline",
    popular: false,
    cardBg: "bg-white border-border-subtle"
  },
  {
    id: "moderate",
    name: "Moderate",
    nameKey: "pkgModerateName",
    rate: 2400,
    unit: "/sq.ft",
    taglineKey: "pkgModerateTagline",
    popular: true,
    cardBg: "bg-amber-brand/10 border-amber-brand ring-1 ring-amber-brand/50 shadow-md"
  },
  {
    id: "premium",
    name: "Premium",
    nameKey: "pkgPremiumName",
    rate: 2500,
    unit: "/sq.ft",
    taglineKey: "pkgPremiumTagline",
    popular: false,
    cardBg: "bg-white border-border-subtle"
  }
];

// The first 7 spec rows displayed inside the cards
export const CORE_SPECS = [
  { itemKey: "specSteel", basic: "Kavery", moderate: "Amman", premium: "JSW" },
  { itemKey: "specCement", basic: "Coromandel", moderate: "UltraTech / Ramco", premium: "UltraTech Super / Ramco Super" },
  { itemKey: "specBrick", basic: "Fly ash brick", moderate: "Red brick", premium: "Red brick / AAC block" },
  { itemKey: "specWire", basic: "ISI brand", moderate: "Orbit", premium: "Havells / Polycab" },
  { itemKey: "specSwitches", basic: "ISI brand", moderate: "Anchor", premium: "Legrand / Havells" },
  { itemKey: "specPlumbing", basic: "ISI brand", moderate: "Ashirvad", premium: "Finolex" },
  { itemKey: "specFittings", basic: "ISI brand", moderate: "Parryware", premium: "Jaquar" }
];

// Complete 16 rows for the expandable specification table
export const FULL_SPECS_TABLE = [
  ...CORE_SPECS,
  { itemKey: "specPainting", basic: "Birla Opus", moderate: "Asian Premium", premium: "Birla Putty + Apex" },
  { itemKey: "specTiles", basic: "₹40/sq.ft", moderate: "₹60/sq.ft", premium: "₹70/sq.ft" },
  { itemKey: "specWindows", basic: "Wood (Vembu/Badak)", moderate: "UPVC ₹450/sq.ft", premium: "UPVC ₹500/sq.ft" },
  { itemKey: "specMainDoor", basic: "₹30,000", moderate: "₹60,000", premium: "₹70,000" },
  { itemKey: "specWaterTank", basic: "500 L", moderate: "1000 L", premium: "2000 L" },
  // Check / Cross quality assurance rows
  { itemKey: "specWaterCubeTest", basic: true, moderate: true, premium: true, isCheck: true },
  { itemKey: "specSoilTest", basic: false, moderate: false, premium: true, isCheck: true },
  { itemKey: "specTermiteControl", basic: false, moderate: true, premium: true, isCheck: true },
  { itemKey: "specStructuralDesign", basic: false, moderate: true, premium: true, isCheck: true }
];

export const OUR_WORK_ITEMS = [
  {
    id: 1,
    titleKey: "workVillaTitle",
    title: "Contemporary Villa",
    location: "Sirkazhi",
    src: {
      jpg: "assets/villa-contemporary-after.jpg",
      webp: "assets/villa-contemporary-after.webp",
      webp640: "assets/villa-contemporary-after-640.webp",
      width: 638,
      height: 629,
      alt: "Contemporary luxury villa built by MAK BUILD in Sirkazhi"
    }
  },
  {
    id: 2,
    titleKey: "workPenthouseTitle",
    title: "Penthouse Interior",
    location: "Sirkazhi",
    src: {
      jpg: "assets/penthouse-after-hd.jpg?v=6",
      webp: "assets/penthouse-after-hd.webp",
      webp640: "assets/penthouse-after-hd-640.webp",
      width: 1280,
      height: 720,
      alt: "Luxury penthouse interior designed by MAK BUILD"
    }
  },
  {
    id: 3,
    titleKey: "workLivingTitle",
    title: "Living & Kitchen",
    location: "Mayiladuthurai",
    src: {
      jpg: "assets/portfolio-interior-design.jpg",
      webp: "assets/portfolio-interior-design-1280.webp",
      webp640: "assets/portfolio-interior-design-640.webp",
      width: 1280,
      height: 720,
      alt: "Modern residential living and kitchen interior"
    }
  },
  {
    id: 4,
    titleKey: "workRetailTitle",
    title: "Retail Studio",
    location: "Old Bus Stand, Sirkazhi",
    src: {
      jpg: "assets/commercial-retail-after.jpg",
      webp: "assets/commercial-retail-after-1280.webp",
      webp640: "assets/commercial-retail-after-640.webp",
      width: 1280,
      height: 720,
      alt: "Modern commercial jewellery retail studio showroom"
    }
  }
];
