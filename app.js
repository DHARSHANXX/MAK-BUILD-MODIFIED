/**
 * MAK BUILD - CONSTRUCTION & DESIGN
 * Location: Sirkazhi | Contact: 81441 66022 / 93857 47544
 * Interactive Core Application Logic
 */

// Primary Contact Numbers
const COMPANY_PHONE_1 = "8144166022";
const COMPANY_PHONE_2 = "9385747544";

// Signature Portfolio Projects (Sirkazhi & Tamil Nadu Coastal Region)
const PORTFOLIO_PROJECTS = [
  {
    id: 1,
    title: "Sirkazhi Royal Heritage Villa",
    category: "residential",
    categoryLabel: "Residential Villa",
    location: "Sirkazhi Main Town",
    area: "3,800 sq.ft",
    duration: "10 Months",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    description: "A luxury contemporary residence combining modern geometric elevations with traditional courtyard ventilation, custom teakwood joinery, and double-height living hall.",
    features: ["Vasthu-compliant layout", "Double-height living space", "Teak main entrance door", "GVT large format tiles", "Rainwater recharge pit"],
    materials: "Ultratech Super Cement, Tata Tiscon 550D Steel, Asian Paints Royale, Jaquar Sanitaryware",
    client: "Er. S. Murugesan"
  },
  {
    id: 2,
    title: "Mayiladuthurai Commercial Plaza",
    category: "commercial",
    categoryLabel: "Commercial Architecture",
    location: "Kacheri Road, Mayiladuthurai",
    area: "8,500 sq.ft",
    duration: "12 Months",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    description: "Multi-storey commercial shopping complex and corporate office building with heavy-duty structural steel glazing, basement parking, and fire compliance.",
    features: ["Structural glass facade", "Elevator & power backup", "Heavy-load flooring", "Municipal approved plan"],
    materials: "RCC M25 grade concrete, Saint-Gobain toughened glass, premium commercial vitrified tiles",
    client: "Sri Balaji Commercial Syndicate"
  },
  {
    id: 3,
    title: "The Scandinavian Interior Villa",
    category: "interior",
    categoryLabel: "Interior Design",
    location: "Chidambaram Highway, Sirkazhi",
    area: "2,600 sq.ft",
    duration: "3.5 Months",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    description: "Bespoke interior fit-out featuring seamless acrylic modular kitchen, cove ambient lighting, customized TV unit with fluted charcoal louvers, and master bedroom walk-in wardrobe.",
    features: ["Modular kitchen with quartz top", "Hafele soft-close hardware", "False ceiling with warm LED coves", "Custom pooja mandir wood carvings"],
    materials: "Marine grade BWP plywood, Merino laminates, Hafele hinges, Philips ambient LEDs",
    client: "Mr. K. Anbarasan"
  },
  {
    id: 4,
    title: "Vaitheeswaran Koil Traditional Duplex",
    category: "residential",
    categoryLabel: "Duplex Home",
    location: "Vaitheeswaran Koil, Sirkazhi Taluk",
    area: "2,950 sq.ft",
    duration: "8 Months",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    description: "Modern duplex combining traditional Tamil architectural aesthetics with modern comforts, pillared front portico, open terrace garden, and solar water heater.",
    features: ["Traditional portico arches", "Covered terrace sit-out", "Borewell & underground sump", "Vastu master bedroom"],
    materials: "First-class table moulded red bricks, Dalmia cement, Jindal Panther steel",
    client: "Dr. R. Senthamilselvan"
  },
  {
    id: 5,
    title: "Modern Cafe & Bakery Studio",
    category: "commercial",
    categoryLabel: "Commercial Retail",
    location: "Old Bus Stand, Sirkazhi",
    area: "1,800 sq.ft",
    duration: "2.5 Months",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80",
    description: "Trendy aesthetic cafe design featuring exposed brick styling, industrial black track lights, custom wooden booth seating, and modern service counter.",
    features: ["Exposed rustic brick wall", "Custom granite billing counter", "Acoustic ceiling treatment", "Commercial kitchen MEP"],
    materials: "Reclaimed bricks, treated solid pinewood, black metal framing, warm Edison fixtures",
    client: "Aroma Cafe & Bakers"
  },
  {
    id: 6,
    title: "Coastal Modern Beachside Bungalow",
    category: "residential",
    categoryLabel: "Luxury Bungalow",
    location: "Poompuhar Coastal Road",
    area: "4,200 sq.ft",
    duration: "11 Months",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    description: "Anti-corrosive coastal architectural bungalow with anti-saline waterproofing, cantilever balconies facing greenery, and rooftop party gazebo.",
    features: ["Coastal corrosion-resistant concrete", "UPVC acoustic sliding windows", "Rooftop gazebo", "Landscaped courtyard"],
    materials: "Sulphate-resistant cement, epoxy coated TMT rebar, UPVC weather-proof windows",
    client: "Mr. T. Vigneshwaran"
  }
];

// Package Rates per sq.ft (Tailored for Sirkazhi & Tamil Nadu region)
const PACKAGE_RATES = {
  essential: {
    rate: 1750,
    name: "Classic Construction",
    subtext: "Solid RCC frame, first-class bricks, vitrified tiles, and reliable standard fittings."
  },
  premium: {
    rate: 2350,
    name: "Architectural Premium",
    subtext: "Designer 3D elevation, GVT large tiles, Teakwood main door, Jaquar/Kohler, Royale paint."
  },
  luxury: {
    rate: 3250,
    name: "Ultra-Luxury Villa",
    subtext: "Bespoke architectural layout, Italian marble, smart home fixtures, and landscaping."
  }
};

const PROJECT_TYPE_MULTIPLIERS = {
  villa: 1.0,
  house: 0.95,
  commercial: 1.15,
  interior: 0.65
};

const ADDONS_PRICING = {
  kitchen: 275000,
  elevation3d: 45000,
  vasthu: 35000,
  automation: 150000,
  solar: 195000,
  sump: 120000
};

// Application State
const state = {
  area: 2200,
  packageType: "premium",
  projectType: "villa",
  addons: {
    kitchen: true,
    elevation3d: true,
    vasthu: true,
    automation: false,
    solar: false,
    sump: true
  },
  sliderPosition: 50,
  activeFilter: "all"
};

// Currency Formatter
function formatINR(amount) {
  if (amount >= 10000000) {
    const cr = (amount / 10000000).toFixed(2);
    return `₹ ${cr} Cr`;
  } else if (amount >= 100000) {
    const lakhs = (amount / 100000).toFixed(2);
    return `₹ ${lakhs} Lakhs`;
  } else {
    return `₹ ${Math.round(amount).toLocaleString('en-IN')}`;
  }
}

function formatRawAmount(amount) {
  return "₹ " + Math.round(amount).toLocaleString("en-IN");
}

// ----------------------------------------------------
// 1. Cost Estimator Engine
// ----------------------------------------------------
function calculateCost() {
  const baseRate = PACKAGE_RATES[state.packageType].rate;
  const multiplier = PROJECT_TYPE_MULTIPLIERS[state.projectType];
  const effectiveRate = baseRate * multiplier;
  const baseConstructionCost = state.area * effectiveRate;

  let addonsTotal = 0;
  for (const [key, isSelected] of Object.entries(state.addons)) {
    if (isSelected && ADDONS_PRICING[key]) {
      addonsTotal += ADDONS_PRICING[key];
    }
  }

  const grandTotal = baseConstructionCost + addonsTotal;

  // Breakdown Calculations
  const civilCost = Math.round(baseConstructionCost * 0.52);
  const finishingCost = Math.round(baseConstructionCost * 0.28);
  const mepCost = Math.round(baseConstructionCost * 0.12);
  const architecturalFee = Math.round(baseConstructionCost * 0.08);

  // Update UI Elements
  const totalDisplay = document.getElementById("est-total-cost");
  const baseRateDisplay = document.getElementById("est-rate-persqft");
  const areaValueDisplay = document.getElementById("est-area-value");
  const civilDisplay = document.getElementById("breakdown-civil");
  const finishingDisplay = document.getElementById("breakdown-finishing");
  const mepDisplay = document.getElementById("breakdown-mep");
  const designDisplay = document.getElementById("breakdown-design");
  const addonsDisplay = document.getElementById("breakdown-addons");

  if (totalDisplay) totalDisplay.textContent = formatINR(grandTotal);
  if (baseRateDisplay) {
    baseRateDisplay.textContent = `${formatRawAmount(effectiveRate)} / sq.ft`;
  }
  if (areaValueDisplay) areaValueDisplay.textContent = `${state.area.toLocaleString()} sq.ft`;
  
  if (civilDisplay) civilDisplay.textContent = formatRawAmount(civilCost);
  if (finishingDisplay) finishingDisplay.textContent = formatRawAmount(finishingCost);
  if (mepDisplay) mepDisplay.textContent = formatRawAmount(mepCost);
  if (designDisplay) designDisplay.textContent = formatRawAmount(architecturalFee);
  if (addonsDisplay) addonsDisplay.textContent = formatRawAmount(addonsTotal);

  return {
    grandTotal,
    baseConstructionCost,
    addonsTotal,
    civilCost,
    finishingCost,
    mepCost,
    architecturalFee
  };
}

// ----------------------------------------------------
// 2. WhatsApp Quote Sender
// ----------------------------------------------------
function sendEstimateToWhatsApp(phone = COMPANY_PHONE_1) {
  const calc = calculateCost();
  const pkg = PACKAGE_RATES[state.packageType];
  
  const activeAddonsList = Object.entries(state.addons)
    .filter(([_, active]) => active)
    .map(([key, _]) => {
      const names = {
        kitchen: "Modular Kitchen & Wardrobes",
        elevation3d: "3D Elevation & CAD Floor Plan",
        vasthu: "Vasthu Planning & Structural Sanctions",
        automation: "Smart Home Lighting & Security",
        solar: "Rooftop Solar Plant (3kW/5kW)",
        sump: "Borewell & Underground Water Sump"
      };
      return `• ${names[key] || key}`;
    });

  const msg = 
`🏗️ *MAK BUILD - CONSTRUCTION & DESIGN (SIRKAZHI)*
━━━━━━━━━━━━━━━━━━━━━━━━
📍 *Location:* Sirkazhi / Nearby Region
📐 *Built-Up Area:* ${state.area.toLocaleString()} sq.ft
🏡 *Project Scope:* ${state.projectType.toUpperCase()}
⭐ *Package:* ${pkg.name} (${formatRawAmount(pkg.rate)}/sq.ft)

📋 *Selected Add-Ons:*
${activeAddonsList.length > 0 ? activeAddonsList.join("\n") : "• None"}

💰 *Estimated Investment:* ${formatINR(calc.grandTotal)}
(Civil/RCC: ${formatINR(calc.civilCost)}, Finishing: ${formatINR(calc.finishingCost)}, MEP: ${formatINR(calc.mepCost)})
━━━━━━━━━━━━━━━━━━━━━━━━
I would like to schedule a direct site consultation with MAK BUILD engineers.`;

  const waUrl = `https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, "_blank");
}

// ----------------------------------------------------
// 3. Draftsman Hiring / Resume WhatsApp Sender
// ----------------------------------------------------
function applyForDraftsman(phone = COMPANY_PHONE_1) {
  const msg = 
`📐 *MAK BUILD - JOB APPLICATION (DRAFTSMAN)*
━━━━━━━━━━━━━━━━━━━━━━━━
🏢 *Role:* DRAFTSMAN
📍 *Location:* Sirkazhi
💼 *Workplace:* Inclusive & Welcoming / Open to All Qualified Candidates & Freshers

Hello MAK BUILD Team,
I am interested in applying for the *Draftsman* position at your Sirkazhi office.

My Details:
• *Name:* 
• *Qualification:* (Diploma / BE Civil / Architecture / Other)
• *Skills:* AutoCAD, Excel, Civil Engineering Knowledge
• *Experience:* (Fresher / Years)
• *Current Location:* 

I am attaching my Resume / Portfolio in this chat. Thank you!`;

  const waUrl = `https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, "_blank");
}

// ----------------------------------------------------
// 4. Consultation Booking Form Submission
// ----------------------------------------------------
function handleConsultationSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.elements["client_name"]?.value || "Client";
  const phone = form.elements["client_phone"]?.value || "";
  const location = form.elements["client_location"]?.value || "Sirkazhi";
  const projectType = form.elements["client_project_type"]?.value || "Residential Villa";
  const budget = form.elements["client_budget"]?.value || "Standard";
  const message = form.elements["client_notes"]?.value || "";

  const text = `👋 *NEW INQUIRY - MAK BUILD (SIRKAZHI)*
━━━━━━━━━━━━━━━━━━━━━━━━
👤 *Name:* ${name}
📞 *Phone:* ${phone}
📍 *Site Location:* ${location}
🏗️ *Project Scope:* ${projectType}
💵 *Budget Range:* ${budget}
📝 *Notes:* ${message}
━━━━━━━━━━━━━━━━━━━━━━━━
Please contact me for site visit and consultation.`;

  showToast("Inquiry recorded! Opening WhatsApp to connect with MAK BUILD team...");

  setTimeout(() => {
    window.open(`https://wa.me/91${COMPANY_PHONE_1}?text=${encodeURIComponent(text)}`, "_blank");
    form.reset();
  }, 1000);
}

// ----------------------------------------------------
// 5. Interactive Before & After Transformation Engine
// ----------------------------------------------------
const BA_PROJECTS = {
  "living-room": {
    id: "living-room",
    title: "Luxury Penthouse Residence",
    tabId: "ba-tab-living",
    beforeImg: "assets/renovation-before-web.jpg",
    beforeFallback: window.MAK_BA_BEFORE || "assets/renovation-before.jpg",
    beforeLabel: "BEFORE: RAW RCC & MASONRY SHELL",
    afterImg: "assets/penthouse-after-hd.jpg?v=4",
    afterFallback: window.MAK_BA_AFTER || "assets/penthouse-after-hd.jpg",
    afterLabel: "AFTER: BESPOKE LUXURY RESIDENCE",
    structuralTitle: "Grade-A RCC & Steel",
    structuralDesc: "Engineered with UltraTech M25/M30 concrete mix and Tata Tiscon Fe 550D rebar. Integrated anti-termite plinth injection and 100% Vasthu beam alignment.",
    finishingTitle: "Acoustic Wood Slat Feature Wall & Ambient Cove Lighting",
    finishingDesc: "Custom backlit fluted timber acoustic media wall with Italian marble cladding, concealed warm LED cove illumination, floor-to-ceiling panoramic fenestrations, and mirror-finish Italian marble flooring.",
    timelineTitle: "Guaranteed Delivery & Warranty",
    timelineDesc: "Handed over in 180 days with zero cost escalation guarantee. Includes a 10-Year structural engineering warranty and 1-Year complimentary MEP care."
  },
  "villa-exterior": {
    id: "villa-exterior",
    title: "Contemporary Villa Facade",
    tabId: "ba-tab-villa",
    beforeImg: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80",
    beforeFallback: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80",
    beforeLabel: "BEFORE: STRUCTURAL COLUMN SCAFFOLDING",
    afterImg: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    afterFallback: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    afterLabel: "AFTER: MODERN ARCHITECTURAL VILLA",
    structuralTitle: "Deep Pile & Anti-Seismic Columns",
    structuralDesc: "Designed for coastal delta soil bearing capacity with corrosion-resistant epoxy-coated rebars and monolithic slab castings.",
    finishingTitle: "Weather-Shield Facade & Glazing",
    finishingDesc: "High-grade textured silicon emulsion, Saint-Gobain acoustic double-glazed glass railings, exterior pergolas, and landscape lighting.",
    timelineTitle: "Turnkey Civil & Facade Handover",
    timelineDesc: "Delivered in 240 days with scheduled milestone inspections, BIS compliant materials, and comprehensive foundation certification."
  },
  "commercial-peb": {
    id: "commercial-peb",
    title: "PEB Industrial Facility",
    tabId: "ba-tab-peb",
    beforeImg: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1600&q=80",
    beforeFallback: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1600&q=80",
    beforeLabel: "BEFORE: HEAVY STEEL TRUSS ASSEMBLY",
    afterImg: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80",
    afterFallback: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80",
    afterLabel: "AFTER: ARCHITECTURAL COMMERCIAL FACILITY",
    structuralTitle: "Pre-Engineered High-Tensile Steel",
    structuralDesc: "Grade 345 MPa high-tensile steel rafters, cold-formed Z & C purlins, and heavy-duty anchor bolt assemblies designed for wind loads up to 50 m/s.",
    finishingTitle: "Insulated Cladding & MEP Integration",
    finishingDesc: "Standing seam color-coated roofing sheets with rockwool insulation, polycarbonate daylight panels, and industrial epoxy flooring.",
    timelineTitle: "90-Day Rapid Commissioning",
    timelineDesc: "Precision factory fabrication with rapid on-site bolt assembly, fire safety compliance, and ISO 9001:2015 quality assurance."
  }
};

let currentBaProject = "living-room";
let baAutoScanActive = false;
let baAutoScanRaf = null;
let baAutoScanStartTime = null;

function setBaPosition(percentage) {
  const container = document.getElementById("ba-slider-box");
  if (!container) return;
  const clamped = Math.max(0, Math.min(100, percentage));
  container.style.setProperty("--ba-pos", `${clamped}%`);
  state.sliderPosition = clamped;

  // Intelligent proximity dimming for badges so they don't collide with the dial
  const badgeBefore = document.getElementById("ba-badge-before");
  const badgeAfter = document.getElementById("ba-badge-after");
  if (badgeBefore) {
    if (clamped < 22) {
      badgeBefore.style.opacity = Math.max(0.12, clamped / 22).toString();
      badgeBefore.style.transform = `scale(${0.92 + 0.08 * (clamped / 22)})`;
    } else {
      badgeBefore.style.opacity = "1";
      badgeBefore.style.transform = "scale(1)";
    }
  }
  if (badgeAfter) {
    if (clamped > 78) {
      const factor = (100 - clamped) / 22;
      badgeAfter.style.opacity = Math.max(0.12, factor).toString();
      badgeAfter.style.transform = `scale(${0.92 + 0.08 * factor})`;
    } else {
      badgeAfter.style.opacity = "1";
      badgeAfter.style.transform = "scale(1)";
    }
  }
}

function switchBaProject(projectId) {
  const proj = BA_PROJECTS[projectId];
  if (!proj) return;
  currentBaProject = projectId;

  // Stop auto scan on switch
  if (baAutoScanActive) toggleBaAutoScan();

  // Update tabs
  ["ba-tab-living", "ba-tab-villa", "ba-tab-peb"].forEach(tabId => {
    const tab = document.getElementById(tabId);
    if (!tab) return;
    if (tabId === proj.tabId) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });

  // Fade out slightly and swap images
  const imgBefore = document.getElementById("ba-img-before");
  const imgAfter = document.getElementById("ba-img-after");
  const textBefore = document.getElementById("ba-text-before");
  const textAfter = document.getElementById("ba-text-after");

  if (imgBefore && imgAfter) {
    imgBefore.style.opacity = "0.4";
    imgAfter.style.opacity = "0.4";

    setTimeout(() => {
      if (projectId === "living-room") {
        var isGitHub = window.location.hostname.indexOf("github.io") !== -1;
        imgBefore.src = (isGitHub && window.MAK_BA_BEFORE) ? window.MAK_BA_BEFORE : proj.beforeImg;
        imgAfter.src = (isGitHub && window.MAK_BA_AFTER) ? window.MAK_BA_AFTER : proj.afterImg;
      } else {
        imgBefore.src = proj.beforeImg;
        imgAfter.src = proj.afterImg;
      }

      imgBefore.onerror = function() {
        this.onerror = null;
        if (proj.beforeFallback) this.src = proj.beforeFallback;
      };
      imgAfter.onerror = function() {
        this.onerror = null;
        if (proj.afterFallback) this.src = proj.afterFallback;
      };

      if (textBefore) textBefore.textContent = proj.beforeLabel;
      if (textAfter) textAfter.textContent = proj.afterLabel;

      imgBefore.style.opacity = "1";
      imgAfter.style.opacity = "1";
    }, 150);
  }

  // Update Spec Cards
  const structTitle = document.getElementById("ba-spec-structural-title");
  const structDesc = document.getElementById("ba-spec-structural-desc");
  const finishTitle = document.getElementById("ba-spec-finishing-title");
  const finishDesc = document.getElementById("ba-spec-finishing-desc");
  const timeTitle = document.getElementById("ba-spec-timeline-title");
  const timeDesc = document.getElementById("ba-spec-timeline-desc");

  if (structTitle) structTitle.textContent = proj.structuralTitle;
  if (structDesc) structDesc.textContent = proj.structuralDesc;
  if (finishTitle) finishTitle.textContent = proj.finishingTitle;
  if (finishDesc) finishDesc.textContent = proj.finishingDesc;
  if (timeTitle) timeTitle.textContent = proj.timelineTitle;
  if (timeDesc) timeDesc.textContent = proj.timelineDesc;

  // Reset slider to 50%
  setBaPosition(50);
}

function toggleBaAutoScan() {
  const btn = document.getElementById("ba-autoscan-btn");
  const label = document.getElementById("ba-autoscan-label");
  const icon = document.getElementById("ba-autoscan-icon");

  if (baAutoScanActive) {
    baAutoScanActive = false;
    if (baAutoScanRaf) cancelAnimationFrame(baAutoScanRaf);
    baAutoScanRaf = null;
    if (label) label.textContent = "Auto Reveal";
    if (btn) btn.classList.remove("ring-2", "ring-[#d4af37]");
    if (icon && window.lucide) {
      icon.setAttribute("data-lucide", "play");
      window.lucide.createIcons();
    }
  } else {
    baAutoScanActive = true;
    baAutoScanStartTime = null;
    if (label) label.textContent = "Pause Reveal";
    if (btn) btn.classList.add("ring-2", "ring-[#d4af37]");
    if (icon && window.lucide) {
      icon.setAttribute("data-lucide", "pause");
      window.lucide.createIcons();
    }

    function scanStep(timestamp) {
      if (!baAutoScanActive) return;
      if (!baAutoScanStartTime) baAutoScanStartTime = timestamp;
      const elapsed = (timestamp - baAutoScanStartTime) / 1000;
      // Oscillate smoothly between 12% and 88% over 4.5 seconds
      const pos = 50 + 38 * Math.sin((elapsed * Math.PI * 2) / 4.5);
      setBaPosition(pos);
      baAutoScanRaf = requestAnimationFrame(scanStep);
    }
    baAutoScanRaf = requestAnimationFrame(scanStep);
  }
}

function initBeforeAfterSlider() {
  const container = document.getElementById("ba-slider-box");
  if (!container) return;

  let isPointerDown = false;

  function handlePointer(clientX) {
    const rect = container.getBoundingClientRect();
    let offsetX = clientX - rect.left;
    let percentage = (offsetX / rect.width) * 100;
    setBaPosition(percentage);
  }

  // Pointer Events (Unified Mouse, Touch & Pen with hardware tracking)
  container.addEventListener("pointerdown", (e) => {
    isPointerDown = true;
    container.classList.add("is-dragging");
    if (baAutoScanActive) toggleBaAutoScan();
    try {
      container.setPointerCapture(e.pointerId);
    } catch (err) {}
    handlePointer(e.clientX);
    e.preventDefault();
  });

  container.addEventListener("pointermove", (e) => {
    if (!isPointerDown) return;
    handlePointer(e.clientX);
  });

  function stopDrag(e) {
    if (!isPointerDown) return;
    isPointerDown = false;
    container.classList.remove("is-dragging");
    try {
      container.releasePointerCapture(e.pointerId);
    } catch (err) {}
  }

  container.addEventListener("pointerup", stopDrag);
  container.addEventListener("pointercancel", stopDrag);

  // Keyboard accessibility on container focus
  container.setAttribute("tabindex", "0");
  container.setAttribute("role", "slider");
  container.setAttribute("aria-valuemin", "0");
  container.setAttribute("aria-valuemax", "100");
  container.setAttribute("aria-valuenow", "50");
  container.setAttribute("aria-label", "Before and after transformation slider");

  container.addEventListener("keydown", (e) => {
    if (baAutoScanActive) toggleBaAutoScan();
    let current = state.sliderPosition || 50;
    if (e.key === "ArrowLeft") {
      setBaPosition(current - 5);
      e.preventDefault();
    } else if (e.key === "ArrowRight") {
      setBaPosition(current + 5);
      e.preventDefault();
    } else if (e.key === "Home") {
      setBaPosition(0);
      e.preventDefault();
    } else if (e.key === "End") {
      setBaPosition(100);
      e.preventDefault();
    }
  });

  // Set initial 50% position
  setBaPosition(50);
}

// ----------------------------------------------------
// 6. Portfolio Grid & Modal
// ----------------------------------------------------
function renderPortfolio(filter = "all") {
  const grid = document.getElementById("portfolio-grid");
  if (!grid) return;

  const filtered = filter === "all" 
    ? PORTFOLIO_PROJECTS 
    : PORTFOLIO_PROJECTS.filter(p => p.category === filter);

  grid.innerHTML = filtered.map(p => `
    <div class="glass-card rounded-2xl overflow-hidden group cursor-pointer flex flex-col transition-all duration-300 hover:-translate-y-2 border border-slate-800" onclick="openProjectModal(${p.id})">
      <div class="relative h-64 overflow-hidden bg-slate-950">
        <img 
          src="${p.image}" 
          alt="${p.title}" 
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          loading="lazy"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-80"></div>
        
        <div class="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-[#d4af37] border border-[#d4af37]/30">
          ${p.categoryLabel}
        </div>
        
        <div class="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <div>
            <p class="text-xs text-slate-300 flex items-center gap-1">
              <i data-lucide="map-pin" class="w-3.5 h-3.5 text-[#d4af37]"></i> ${p.location}
            </p>
            <h3 class="text-lg font-bold text-white mt-1 group-hover:text-[#d4af37] transition-colors">
              ${p.title}
            </h3>
          </div>
          <span class="bg-[#d4af37] text-slate-950 p-2 rounded-xl group-hover:bg-[#f0c946] transition-colors shadow-lg">
            <i data-lucide="arrow-up-right" class="w-4 h-4"></i>
          </span>
        </div>
      </div>
      
      <div class="p-5 flex-1 flex flex-col justify-between bg-slate-900/60">
        <p class="text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">
          ${p.description}
        </p>
        
        <div class="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
          <span class="flex items-center gap-1 font-keyboard">
            <i data-lucide="maximize-2" class="w-3.5 h-3.5 text-[#d4af37]"></i> ${p.area}
          </span>
          <span class="flex items-center gap-1 font-keyboard">
            <i data-lucide="clock" class="w-3.5 h-3.5 text-[#d4af37]"></i> ${p.duration}
          </span>
          <span class="text-[#d4af37] font-semibold hover:underline flex items-center gap-1">
            View Specs <i data-lucide="chevron-right" class="w-3 h-3"></i>
          </span>
        </div>
      </div>
    </div>
  `).join("");

  if (window.lucide) window.lucide.createIcons();
}

function openProjectModal(projectId) {
  const project = PORTFOLIO_PROJECTS.find(p => p.id === projectId);
  if (!project) return;

  const modal = document.getElementById("project-modal");
  const modalContent = document.getElementById("modal-project-content");
  if (!modal || !modalContent) return;

  modalContent.innerHTML = `
    <div class="relative">
      <img src="${project.image}" alt="${project.title}" class="w-full h-72 md:h-96 object-cover rounded-t-2xl" />
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
      <button onclick="closeProjectModal()" class="absolute top-4 right-4 bg-slate-900/80 hover:bg-slate-800 text-white p-2.5 rounded-full backdrop-blur-md transition-colors border border-white/10">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>
      <div class="absolute bottom-6 left-6 right-6">
        <span class="inline-block bg-[#d4af37] text-slate-950 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider mb-2">
          ${project.categoryLabel}
        </span>
        <h2 class="text-2xl md:text-3xl font-bold text-white">${project.title}</h2>
        <p class="text-slate-300 text-sm mt-1 flex items-center gap-1.5">
          <i data-lucide="map-pin" class="w-4 h-4 text-[#d4af37]"></i> ${project.location} • Client: <strong class="text-white font-semibold">${project.client}</strong>
        </p>
      </div>
    </div>

    <div class="p-6 md:p-8 space-y-6">
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <span class="text-xs text-slate-400">Built-Up Area</span>
          <p class="text-base sm:text-lg font-semibold text-[#d4af37] font-keyboard">${project.area}</p>
        </div>
        <div>
          <span class="text-xs text-slate-400">Timeline</span>
          <p class="text-base sm:text-lg font-semibold text-[#d4af37] font-keyboard">${project.duration}</p>
        </div>
        <div>
          <span class="text-xs text-slate-400">Location</span>
          <p class="text-base sm:text-lg font-semibold text-[#d4af37]">${project.location}</p>
        </div>
      </div>

      <div>
        <h4 class="text-base font-semibold text-white mb-2">Project Highlights</h4>
        <p class="text-slate-300 text-sm leading-relaxed">${project.description}</p>
      </div>

      <div>
        <h4 class="text-base font-semibold text-white mb-3">Key Features</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          ${project.features.map(f => `
            <div class="flex items-center gap-2 text-sm text-slate-300 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
              <i data-lucide="check-circle" class="w-4 h-4 text-[#d4af37] flex-shrink-0"></i>
              <span>${f}</span>
            </div>
          `).join("")}
        </div>
      </div>

      <div>
        <h4 class="text-base font-semibold text-white mb-2">Tested Quality Materials</h4>
        <p class="text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono">
          ${project.materials}
        </p>
      </div>

      <div class="pt-4 border-t border-slate-800 flex flex-wrap gap-4 justify-between items-center">
        <a 
          href="https://wa.me/91${COMPANY_PHONE_1}?text=Hi%20MAK%20BUILD%2C%20I%20saw%20your%20project%20${encodeURIComponent(project.title)}%20and%20want%20to%20consult%20for%20my%20site." 
          target="_blank"
          class="w-full sm:w-auto bg-[#d4af37] hover:bg-[#f0c946] text-slate-950 font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
        >
          <i data-lucide="message-circle" class="w-4 h-4"></i> Inquire on WhatsApp
        </a>
        <button onclick="closeProjectModal()" class="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors">
          Close
        </button>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.body.style.overflow = "hidden";

  if (window.lucide) window.lucide.createIcons();
}

function closeProjectModal() {
  const modal = document.getElementById("project-modal");
  if (!modal) return;
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  document.body.style.overflow = "";
}

function showToast(message) {
  const toast = document.getElementById("toast-notification");
  const toastMsg = document.getElementById("toast-message");
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.remove("translate-y-24", "opacity-0");
  toast.classList.add("translate-y-0", "opacity-100");

  setTimeout(() => {
    toast.classList.remove("translate-y-0", "opacity-100");
    toast.classList.add("translate-y-24", "opacity-0");
  }, 4000);
}

// ----------------------------------------------------
// 7. Initialization & Event Listeners
// ----------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) window.lucide.createIcons();

  // Area Slider
  const areaSlider = document.getElementById("area-range-slider");
  const areaInput = document.getElementById("area-number-input");
  
  if (areaSlider) {
    areaSlider.addEventListener("input", (e) => {
      state.area = parseInt(e.target.value, 10);
      if (areaInput) areaInput.value = state.area;
      calculateCost();
    });
  }

  if (areaInput) {
    areaInput.addEventListener("change", (e) => {
      let val = parseInt(e.target.value, 10);
      if (isNaN(val) || val < 500) val = 500;
      if (val > 25000) val = 25000;
      state.area = val;
      if (areaSlider) areaSlider.value = val;
      calculateCost();
    });
  }

  // Package Tier buttons
  const pkgButtons = document.querySelectorAll("[data-package-tier]");
  pkgButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      pkgButtons.forEach(b => {
        b.classList.remove("border-[#d4af37]", "bg-[#d4af37]/10", "text-[#d4af37]");
        b.classList.add("border-slate-800", "bg-slate-900/60", "text-slate-300");
      });
      btn.classList.add("border-[#d4af37]", "bg-[#d4af37]/10", "text-[#d4af37]");
      btn.classList.remove("border-slate-800", "bg-slate-900/60", "text-slate-300");
      state.packageType = btn.dataset.packageTier;
      calculateCost();
    });
  });

  // Project Type Select
  const projectTypeSelect = document.getElementById("est-project-type");
  if (projectTypeSelect) {
    projectTypeSelect.addEventListener("change", (e) => {
      state.projectType = e.target.value;
      calculateCost();
    });
  }

  // Add-on checkboxes
  const addonCheckboxes = document.querySelectorAll("[data-addon-key]");
  addonCheckboxes.forEach(cb => {
    cb.addEventListener("change", (e) => {
      const key = e.target.dataset.addonKey;
      state.addons[key] = e.target.checked;
      calculateCost();
    });
  });

  // WhatsApp Quote Button
  const waQuoteBtn = document.getElementById("whatsapp-quote-btn");
  if (waQuoteBtn) {
    waQuoteBtn.addEventListener("click", () => sendEstimateToWhatsApp(COMPANY_PHONE_1));
  }

  // Print Quotation Button
  const printBtn = document.getElementById("print-quote-btn");
  if (printBtn) {
    printBtn.addEventListener("click", () => window.print());
  }

  // Before & After
  initBeforeAfterSlider();

  // Portfolio
  renderPortfolio("all");
  const filterButtons = document.querySelectorAll("[data-filter]");
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => {
        b.classList.remove("bg-[#d4af37]", "text-slate-950", "font-bold");
        b.classList.add("bg-slate-800", "text-slate-300");
      });
      btn.classList.add("bg-[#d4af37]", "text-slate-950", "font-bold");
      btn.classList.remove("bg-slate-800", "text-slate-300");
      
      const filter = btn.dataset.filter;
      state.activeFilter = filter;
      renderPortfolio(filter);
    });
  });

  // Modal backdrop click
  const modal = document.getElementById("project-modal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeProjectModal();
    });
  }

  // Consultation Form
  const consultationForm = document.getElementById("consultation-form");
  if (consultationForm) {
    consultationForm.addEventListener("submit", handleConsultationSubmit);
  }

  // Mobile Drawer
  const mobileToggle = document.getElementById("mobile-menu-toggle");
  const mobileDrawer = document.getElementById("mobile-menu") || document.getElementById("mobile-menu-drawer");
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener("click", () => {
      mobileDrawer.classList.toggle("hidden");
    });
    mobileDrawer.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => mobileDrawer.classList.add("hidden"));
    });
  }

  window.toggleMobileMenu = function() {
    const menu = document.getElementById("mobile-menu") || document.getElementById("mobile-menu-drawer");
    if (menu) {
      menu.classList.toggle("hidden");
    }
  };

  // FAQ Accordions
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(item => {
    const header = item.querySelector(".faq-question");
    const content = item.querySelector(".faq-answer");
    const icon = item.querySelector(".faq-icon");

    if (header && content) {
      header.addEventListener("click", () => {
        const isCollapsed = content.classList.contains("hidden");
        faqItems.forEach(other => {
          const otherContent = other.querySelector(".faq-answer");
          const otherIcon = other.querySelector(".faq-icon");
          if (otherContent && other !== item) {
            otherContent.classList.add("hidden");
            if (otherIcon) otherIcon.style.transform = "rotate(0deg)";
          }
        });

        if (isCollapsed) {
          content.classList.remove("hidden");
          if (icon) icon.style.transform = "rotate(180deg)";
        } else {
          content.classList.add("hidden");
          if (icon) icon.style.transform = "rotate(0deg)";
        }
      });
    }
  });

  // Calculate Initial
  calculateCost();

  // Initialize Corporate Hero Slider, Logo Tilt & Floating Highlights
  initHeroSlider();
  initLogoTiltGesture();
  initFloatingHighlightsWidget();
});

// ----------------------------------------------------
// 7.5. Corporate Hero Slider Engine (Animated 3-Slide Carousel)
// ----------------------------------------------------
let activeHeroSlide = 0;
const TOTAL_HERO_SLIDES = 3;
const HERO_SLIDE_DURATION = 6000; // 6 seconds
let heroSlideTimer = null;
let heroProgressAnimId = null;
let heroSlideStartTime = 0;

function setHeroSlide(index) {
  activeHeroSlide = (index + TOTAL_HERO_SLIDES) % TOTAL_HERO_SLIDES;
  
  // 1. Update Slides Active State
  const slides = document.querySelectorAll(".hero-slide");
  slides.forEach((slide) => {
    const slideIdx = parseInt(slide.dataset.slideIndex, 10);
    if (slideIdx === activeHeroSlide) {
      slide.classList.add("active");
    } else {
      slide.classList.remove("active");
    }
  });

  // 2. Update Dot Indicators
  const dotBtns = document.querySelectorAll(".hero-dot-btn");
  dotBtns.forEach((btn) => {
    const dotIdx = parseInt(btn.dataset.dotIndex, 10);
    const indicator = btn.querySelector(".dot-indicator");
    if (dotIdx === activeHeroSlide) {
      btn.classList.add("text-white", "bg-slate-800/90", "border", "border-[#d4af37]/40");
      btn.classList.remove("text-slate-400");
      if (indicator) {
        indicator.classList.remove("bg-slate-600");
        indicator.classList.add("bg-[#d4af37]", "shadow-[0_0_8px_#d4af37]");
      }
    } else {
      btn.classList.remove("text-white", "bg-slate-800/90", "border", "border-[#d4af37]/40");
      btn.classList.add("text-slate-400");
      if (indicator) {
        indicator.classList.remove("bg-[#d4af37]", "shadow-[0_0_8px_#d4af37]");
        indicator.classList.add("bg-slate-600");
      }
    }
  });

  // 3. Reset and Animate Progress Bar
  startHeroProgress();

  // 4. Reset Timer
  resetHeroSlideTimer();
}

function nextHeroSlide() {
  setHeroSlide(activeHeroSlide + 1);
}

function prevHeroSlide() {
  setHeroSlide(activeHeroSlide - 1);
}

function startHeroProgress() {
  const progressBar = document.getElementById("hero-progress-fill");
  if (!progressBar) return;

  if (heroProgressAnimId) {
    cancelAnimationFrame(heroProgressAnimId);
  }

  progressBar.style.width = "0%";
  heroSlideStartTime = performance.now();

  function updateProgress(currentTime) {
    const elapsed = currentTime - heroSlideStartTime;
    const percent = Math.min(100, (elapsed / HERO_SLIDE_DURATION) * 100);
    progressBar.style.width = `${percent}%`;

    if (elapsed < HERO_SLIDE_DURATION) {
      heroProgressAnimId = requestAnimationFrame(updateProgress);
    }
  }

  heroProgressAnimId = requestAnimationFrame(updateProgress);
}

function resetHeroSlideTimer() {
  if (heroSlideTimer) clearInterval(heroSlideTimer);
  heroSlideTimer = setInterval(() => {
    nextHeroSlide();
  }, HERO_SLIDE_DURATION);
}

function initHeroSlider() {
  const container = document.querySelector(".hero-slider-container");
  if (!container) return;

  // Initialize first slide
  setHeroSlide(0);

  // Pause on hover
  container.addEventListener("mouseenter", () => {
    if (heroSlideTimer) clearInterval(heroSlideTimer);
    if (heroProgressAnimId) cancelAnimationFrame(heroProgressAnimId);
  });

  container.addEventListener("mouseleave", () => {
    resetHeroSlideTimer();
    startHeroProgress();
  });

  // Touch Swipe Gesture for Mobile
  let touchStartX = 0;
  let touchEndX = 0;

  container.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  container.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        nextHeroSlide(); // Swiped left -> next
      } else {
        prevHeroSlide(); // Swiped right -> prev
      }
    }
  }, { passive: true });
}

// ----------------------------------------------------
// 8. Logo 3D Tilt Gesture Animation
// ----------------------------------------------------
function initLogoTiltGesture() {
  const logoBadge = document.querySelector(".logo-badge-container");
  if (!logoBadge) return;

  logoBadge.addEventListener("mousemove", (e) => {
    const rect = logoBadge.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 14;

    logoBadge.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.06)`;
  });

  logoBadge.addEventListener("mouseleave", () => {
    logoBadge.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)";
  });
}

// ----------------------------------------------------
// 9. Floating Company Highlights & Ad Ticker Widget
// ----------------------------------------------------
const COMPANY_HIGHLIGHTS = [
  {
    tag: "WARM WELCOME",
    tagColor: "bg-[#d4af37] text-slate-950 font-bold",
    title: "Welcome to MAK BUILD Sirkazhi",
    desc: "“A house is built with bricks, but a home is crafted with love and dreams.” Start your journey with us.",
    actionText: "Consult Our Civil Engineers &rarr;",
    action: () => {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }
  },
  {
    tag: "WE'RE HIRING",
    tagColor: "bg-[#d4af37] text-slate-950",
    title: "Draftsman Wanted in Sirkazhi",
    desc: "AutoCAD & MS Excel &bull; Inclusive Workplace &bull; Open to all qualified candidates.",
    actionText: "Quick Apply via WhatsApp &rarr;",
    action: () => openDraftsmanModal()
  },
  {
    tag: "STARTUP OFFER",
    tagColor: "bg-amber-500 text-slate-950",
    title: "Free 3D Architectural Elevation",
    desc: "Get photorealistic 4K day/night 3D exterior elevations with every turnkey villa contract.",
    actionText: "Calculate Construction Cost &rarr;",
    action: () => {
      document.getElementById("cost-estimator")?.scrollIntoView({ behavior: "smooth" });
    }
  },
  {
    tag: "QUALITY GUARANTEE",
    tagColor: "bg-emerald-500 text-slate-950",
    title: "10-Year Structural Warranty",
    desc: "Built with Ultratech M25/M30 concrete & Tata Tiscon Fe 550D rebar &bull; Zero compromises.",
    actionText: "Explore Our Workmanship &rarr;",
    action: () => {
      document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
    }
  },
  {
    tag: "CONSULTATION",
    tagColor: "bg-blue-500 text-white",
    title: "Free On-Site Soil & Plot Audit",
    desc: "Call resident civil engineers: 81441 66022 or 93857 47544 for immediate consultation.",
    actionText: "Call 81441 66022 Now &rarr;",
    action: () => {
      window.open("tel:8144166022");
    }
  }
];

let activeHighlightIndex = 0;
let highlightTimer = null;

function renderHighlightCard() {
  const contentArea = document.getElementById("highlight-content-area");
  if (!contentArea) return;

  const h = COMPANY_HIGHLIGHTS[activeHighlightIndex];
  contentArea.innerHTML = `
    <div class="space-y-2.5">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="bg-white p-0.5 rounded border border-[#d4af37]/60 h-5 w-6 flex items-center justify-center overflow-hidden flex-shrink-0">
            <img src="${window.MAK_BRAND_LOGO || 'assets/mak-logo-hd-clean.png'}" data-brand-logo onerror="this.onerror=null;this.src=window.MAK_BRAND_LOGO;" alt="MAK BUILD" class="h-full w-full object-contain" />
          </div>
          <span class="inline-block ${h.tagColor} px-2.5 py-0.5 rounded-full text-[9px] font-semibold tracking-wider uppercase">
            ${h.tag}
          </span>
        </div>
        <span class="text-[10px] text-slate-400 font-keyboard">
          ${activeHighlightIndex + 1} of ${COMPANY_HIGHLIGHTS.length}
        </span>
      </div>
      <h4 class="text-sm font-semibold text-white font-heading">${h.title}</h4>
      <p class="text-xs text-slate-300 leading-relaxed">${h.desc}</p>
      <div class="pt-2 flex items-center justify-between text-xs text-[#d4af37] font-medium">
        <span class="hover:underline flex items-center gap-1">${h.actionText}</span>
        <span class="text-slate-600 text-[10px]">Click to view</span>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
}

function handleHighlightClick() {
  const h = COMPANY_HIGHLIGHTS[activeHighlightIndex];
  if (h && typeof h.action === "function") {
    h.action();
  }
}

function nextHighlight() {
  activeHighlightIndex = (activeHighlightIndex + 1) % COMPANY_HIGHLIGHTS.length;
  renderHighlightCard();
}

function prevHighlight() {
  activeHighlightIndex = (activeHighlightIndex - 1 + COMPANY_HIGHLIGHTS.length) % COMPANY_HIGHLIGHTS.length;
  renderHighlightCard();
}

function initFloatingHighlightsWidget() {
  renderHighlightCard();

  const prevBtn = document.getElementById("highlight-prev-btn");
  const nextBtn = document.getElementById("highlight-next-btn");
  const closeBtn = document.getElementById("highlight-close-btn");
  const widget = document.getElementById("floating-highlights-widget");

  if (prevBtn) prevBtn.addEventListener("click", (e) => { e.stopPropagation(); prevHighlight(); resetHighlightTimer(); });
  if (nextBtn) nextBtn.addEventListener("click", (e) => { e.stopPropagation(); nextHighlight(); resetHighlightTimer(); });
  if (closeBtn) closeBtn.addEventListener("click", (e) => { e.stopPropagation(); minimizeHighlightsWidget(); });

  const contentArea = document.getElementById("highlight-content-area");
  if (contentArea) {
    contentArea.addEventListener("click", handleHighlightClick);
  }

  resetHighlightTimer();

  // On small mobile screens, start in compact pill mode to keep the hero clear
  if (window.innerWidth < 640) {
    minimizeHighlightsWidget();
  }

  // Pause on hover
  if (widget) {
    widget.addEventListener("mouseenter", () => clearInterval(highlightTimer));
    widget.addEventListener("mouseleave", () => resetHighlightTimer());
  }
}

function resetHighlightTimer() {
  clearInterval(highlightTimer);
  highlightTimer = setInterval(() => {
    nextHighlight();
  }, 5000);
}

function minimizeHighlightsWidget() {
  clearInterval(highlightTimer);
  const widget = document.getElementById("floating-highlights-widget");
  const pill = document.getElementById("highlights-minimized-pill");
  if (widget) widget.classList.add("hidden");
  if (pill) pill.classList.remove("hidden");
}

function restoreHighlightsWidget() {
  const widget = document.getElementById("floating-highlights-widget");
  const pill = document.getElementById("highlights-minimized-pill");
  if (widget) widget.classList.remove("hidden");
  if (pill) pill.classList.add("hidden");
  resetHighlightTimer();
}

function dismissHighlights() {
  clearInterval(highlightTimer);
  const widget = document.getElementById("floating-highlights-widget");
  const pill = document.getElementById("highlights-minimized-pill");
  if (widget) widget.classList.add("hidden");
  if (pill) pill.classList.add("hidden");
}

window.dismissHighlights = dismissHighlights;

// ----------------------------------------------------
// 10. Draftsman Hiring Modal
// ----------------------------------------------------
function openDraftsmanModal() {
  const modal = document.getElementById("draftsman-modal");
  if (!modal) return;
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.body.style.overflow = "hidden";
  if (window.lucide) window.lucide.createIcons();
}

function closeDraftsmanModal() {
  const modal = document.getElementById("draftsman-modal");
  if (!modal) return;
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  document.body.style.overflow = "";
}

// Expose globals
window.openProjectModal = openProjectModal;
window.closeProjectModal = closeProjectModal;
window.openDraftsmanModal = openDraftsmanModal;
window.closeDraftsmanModal = closeDraftsmanModal;
window.minimizeHighlightsWidget = minimizeHighlightsWidget;
window.restoreHighlightsWidget = restoreHighlightsWidget;
window.handleHighlightClick = handleHighlightClick;
window.showToast = showToast;
window.sendEstimateToWhatsApp = sendEstimateToWhatsApp;
window.applyForDraftsman = applyForDraftsman;
window.setHeroSlide = setHeroSlide;
window.nextHeroSlide = nextHeroSlide;
window.prevHeroSlide = prevHeroSlide;
window.switchBaProject = switchBaProject;
window.setBaPosition = setBaPosition;
window.toggleBaAutoScan = toggleBaAutoScan;

