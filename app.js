/**
 * MAK BUILD — CONSTRUCTION & DESIGN
 * Location: Pidari S St, Thenpathi, Sirkali (Sirkazhi), Tamil Nadu 609109
 * Verified Contact: 81441 66022 (WhatsApp) / 93857 47544 (Phone)
 * Instagram: https://www.instagram.com/mak_build_construction (@mak_build_construction)
 * 
 * Production Application Logic (Conversion-Focused, Zero Backend Required)
 */

// Verified Company Contacts
const COMPANY_WHATSAPP = "8144166022";
const COMPANY_PHONE = "9385747544";

// ----------------------------------------------------
// 1. ALL 10 REAL PROJECTS (Unified Before & After Gallery)
// ----------------------------------------------------
const ALL_PROJECTS = [
  {
    id: 1,
    title: "Luxury Penthouse Residence",
    category: "interior",
    categoryLabel: "Interiors",
    location: "Chidambaram Highway, Sirkazhi",
    area: "2,400 sq.ft",
    beforeImg: "assets/renovation-before-web.jpg",
    afterImg: "assets/penthouse-after-hd.jpg?v=6",
    beforeLabel: "RAW RCC SHELL",
    afterLabel: "FINISHED PENTHOUSE",
    specs: "Ultratech M25 concrete, Fluted teakwood slat wall, Bookmatched Italian beige marble, Warm LED cove false ceiling."
  },
  {
    id: 2,
    title: "Contemporary Villa Facade",
    category: "villas",
    categoryLabel: "Villas",
    location: "Sirkazhi Main Town",
    area: "3,800 sq.ft",
    beforeImg: "assets/villa-facade-before-1920.jpg",
    afterImg: "assets/villa-facade-after-1920.jpg",
    beforeLabel: "BRICKWORK & RCC FRAME",
    afterLabel: "CONTEMPORARY FACADE",
    specs: "Tata Tiscon Fe 550D rebar, Weather-Shield silicon texture, Saint-Gobain toughened glass balcony railings."
  },
  {
    id: 3,
    title: "PEB Industrial Facility",
    category: "commercial",
    categoryLabel: "Commercial & PEB",
    location: "Sirkazhi Industrial Belt",
    area: "18,500 sq.ft",
    beforeImg: "assets/peb-facility-before-1920.jpg",
    afterImg: "assets/peb-facility-after-1920.jpg",
    beforeLabel: "STEEL RAFTER ASSEMBLY",
    afterLabel: "OPERATIONAL PEB SHED",
    specs: "Grade 345 MPa high-tensile steel rafters, Standing seam color-coated roof sheets with rockwool insulation."
  },
  {
    id: 4,
    title: "Sirkazhi Royal Heritage Villa",
    category: "villas",
    categoryLabel: "Villas",
    location: "Sirkazhi Main Town",
    area: "3,800 sq.ft",
    beforeImg: "assets/villa-facade-before-hd.jpg",
    afterImg: "assets/portfolio-residential-villa.jpg",
    beforeLabel: "STRUCTURAL FRAME PHASE",
    afterLabel: "HERITAGE LUXURY VILLA",
    specs: "Vasthu-compliant double-height living hall, Teakwood portico pillars, GVT large format flooring, Asian Paints Royale."
  },
  {
    id: 5,
    title: "Commercial Shopping Plaza",
    category: "commercial",
    categoryLabel: "Commercial & PEB",
    location: "Kacheri Road, Mayiladuthurai",
    area: "8,500 sq.ft",
    beforeImg: "assets/peb-facility-before-hd.jpg",
    afterImg: "assets/portfolio-commercial-architecture.jpg",
    beforeLabel: "RCC FRAMING & FOUNDATION",
    afterLabel: "RETAIL PLAZA ARCHITECTURE",
    specs: "Multi-storey commercial complex, Structural glass facade, Commercial vitrified flooring, Fire safety compliance."
  },
  {
    id: 6,
    title: "Bespoke Living & Kitchen Interior",
    category: "interior",
    categoryLabel: "Interiors",
    location: "Sirkazhi",
    area: "2,600 sq.ft",
    beforeImg: "assets/renovation-before.jpg",
    afterImg: "assets/portfolio-interior-design.jpg",
    beforeLabel: "RAW PLYWOOD FITOUT",
    afterLabel: "FINISHED INTERIOR FITOUT",
    specs: "BWP Marine plywood modular kitchen, Quartz stone countertops, Hafele soft-close hardware, Custom pooja woodwork."
  },
  {
    id: 7,
    title: "Traditional Tamil Duplex Home",
    category: "villas",
    categoryLabel: "Villas",
    location: "Vaitheeswaran Koil, Sirkazhi",
    area: "2,950 sq.ft",
    beforeImg: "assets/villa-facade-before-1920.jpg",
    afterImg: "assets/portfolio-duplex-home.jpg",
    beforeLabel: "BRICKWORK & COLUMN STAGE",
    afterLabel: "COMPLETED DUPLEX RESIDENCE",
    specs: "Traditional portico Thinnai sit-out, Carved solid teakwood pillars, First-class table moulded red bricks, Dalmia cement."
  },
  {
    id: 8,
    title: "Modern Commercial Retail Studio",
    category: "commercial",
    categoryLabel: "Commercial & PEB",
    location: "Old Bus Stand, Sirkazhi",
    area: "1,800 sq.ft",
    beforeImg: "assets/peb-facility-before-1920.jpg",
    afterImg: "assets/portfolio-commercial-retail.jpg",
    beforeLabel: "CIVIL SHELL PHASE",
    afterLabel: "COMMERCIAL RETAIL STUDIO",
    specs: "Exposed rustic brick wall styling, Industrial track lights, Custom solid wood counters, Acoustic ceiling treatment."
  },
  {
    id: 9,
    title: "Coastal Modern Bungalow",
    category: "villas",
    categoryLabel: "Villas",
    location: "Poompuhar Coastal Road",
    area: "4,200 sq.ft",
    beforeImg: "assets/villa-facade-before-2560.jpg",
    afterImg: "assets/portfolio-luxury-bungalow.jpg",
    beforeLabel: "REBAR REINFORCEMENT PHASE",
    afterLabel: "COASTAL BUNGALOW RESIDENCE",
    specs: "Sulphate-resistant cement, Epoxy-coated anti-corrosive rebar, UPVC weather-proof acoustic sliding windows."
  },
  {
    id: 10,
    title: "Turnkey 3D BIM & Architectural Residence",
    category: "interior",
    categoryLabel: "Interiors",
    location: "Sirkazhi",
    area: "2,400 sq.ft",
    beforeImg: "assets/renovation-before-web.jpg",
    afterImg: "assets/interior-design-hero-1920.jpg",
    beforeLabel: "CAD DRAFTING & MASONRY",
    afterLabel: "COMPLETED LIVING INTERIOR",
    specs: "Photorealistic 3D elevations, Panchayat sanction blueprints, Precision MEP line diagrams, Turnkey execution."
  }
];

// ----------------------------------------------------
// 2. ESTIMATOR LOGIC & VALIDATION
// ----------------------------------------------------
const PACKAGE_RATES = {
  essential: {
    rate: 1750,
    name: "Classic Construction",
    desc: "Solid RCC frame, first-class bricks, vitrified tiles, and branded standard fittings."
  },
  premium: {
    rate: 2350,
    name: "Architectural Premium",
    desc: "3D elevation design, GVT large format tiles, Teakwood main door, Jaquar sanitaryware, Asian Paints Royale."
  },
  luxury: {
    rate: 3250,
    name: "Ultra-Luxury Villa",
    desc: "Bespoke architectural layout, Italian marble, double-height spaces, acoustic glass, and premium automation."
  }
};

const PROJECT_TYPE_MULTIPLIERS = {
  villa: { label: "Independent Residential Villa", mult: 1.0 },
  house: { label: "Modern Duplex / Town House", mult: 0.95 },
  commercial: { label: "Commercial Building & PEB Shed", mult: 1.15 },
  interior: { label: "Turnkey Interiors & Modular Kitchen", mult: 0.65 }
};

const ADDONS_PRICING = {
  kitchen: { name: "Modular Kitchen & Wardrobes", cost: 275000 },
  elevation3d: { name: "3D Elevation & CAD Floor Plan", cost: 45000 },
  vasthu: { name: "Vasthu Planning & Sanction Blueprints", cost: 35000 },
  sump: { name: "Borewell & Underground Water Sump", cost: 120000 },
  solar: { name: "Rooftop Solar Plant (3kW)", cost: 195000 }
};

// Estimator State
const estimatorState = {
  area: 2000,
  packageType: "premium",
  projectType: "villa",
  addons: {
    kitchen: true,
    elevation3d: true,
    vasthu: true,
    sump: true,
    solar: false
  }
};

function formatLakhs(amount) {
  if (amount >= 10000000) {
    return `₹ ${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹ ${(amount / 100000).toFixed(2)} Lakhs`;
  } else {
    return `₹ ${Math.round(amount).toLocaleString("en-IN")}`;
  }
}

function calculateCost() {
  // Validate Area between 300 and 50,000 sq.ft
  let area = estimatorState.area;
  if (isNaN(area) || area < 300) area = 300;
  if (area > 50000) area = 50000;
  estimatorState.area = area;

  const pkg = PACKAGE_RATES[estimatorState.packageType];
  const typeInfo = PROJECT_TYPE_MULTIPLIERS[estimatorState.projectType];
  const effectiveRate = pkg.rate * typeInfo.mult;
  const baseCost = area * effectiveRate;

  let addonsTotal = 0;
  for (const [key, isSelected] of Object.entries(estimatorState.addons)) {
    if (isSelected && ADDONS_PRICING[key]) {
      addonsTotal += ADDONS_PRICING[key].cost;
    }
  }

  const calculatedTotal = baseCost + addonsTotal;

  // Always show an estimate RANGE (₹X - ₹Y), never a single figure
  const minEstimate = Math.round(calculatedTotal * 0.95);
  const maxEstimate = Math.round(calculatedTotal * 1.05);

  const rangeDisplay = document.getElementById("est-total-range");
  const baseRateDisplay = document.getElementById("est-rate-persqft");
  const areaValueDisplay = document.getElementById("est-area-value");
  const civilDisplay = document.getElementById("breakdown-civil");
  const finishingDisplay = document.getElementById("breakdown-finishing");
  const mepDisplay = document.getElementById("breakdown-mep");
  const addonsDisplay = document.getElementById("breakdown-addons");

  if (rangeDisplay) {
    rangeDisplay.textContent = `${formatLakhs(minEstimate)} – ${formatLakhs(maxEstimate)}`;
  }
  if (baseRateDisplay) {
    baseRateDisplay.textContent = `₹ ${Math.round(effectiveRate).toLocaleString("en-IN")} / sq.ft`;
  }
  if (areaValueDisplay) {
    areaValueDisplay.textContent = `${area.toLocaleString("en-IN")} sq.ft`;
  }
  if (civilDisplay) {
    civilDisplay.textContent = formatLakhs(Math.round(baseCost * 0.52));
  }
  if (finishingDisplay) {
    finishingDisplay.textContent = formatLakhs(Math.round(baseCost * 0.28));
  }
  if (mepDisplay) {
    mepDisplay.textContent = formatLakhs(Math.round(baseCost * 0.12));
  }
  if (addonsDisplay) {
    addonsDisplay.textContent = formatLakhs(addonsTotal);
  }

  return {
    area,
    calculatedTotal,
    minEstimate,
    maxEstimate,
    effectiveRate,
    pkgName: pkg.name,
    projectLabel: typeInfo.label
  };
}

function sendEstimateToWhatsApp() {
  const est = calculateCost();
  const activeAddons = Object.entries(estimatorState.addons)
    .filter(([_, active]) => active)
    .map(([key, _]) => `• ${ADDONS_PRICING[key]?.name || key}`)
    .join("\n");

  const msg = 
`🏗️ *MAK BUILD - PROJECT ESTIMATE INQUIRY*
━━━━━━━━━━━━━━━━━━━━━━━━
📍 *Location:* Sirkazhi / Nearby Tamil Nadu Region
📐 *Built-Up Area:* ${est.area.toLocaleString("en-IN")} sq.ft
🏡 *Project Scope:* ${est.projectLabel}
⭐ *Package:* ${est.pkgName} (~₹${Math.round(est.effectiveRate)}/sq.ft)

📋 *Selected Add-Ons:*
${activeAddons || "• None"}

💰 *Indicative Investment Range:*
${formatLakhs(est.minEstimate)} – ${formatLakhs(est.maxEstimate)}

*(Indicative estimate only — final quotation depends on site conditions and discussion.)*
━━━━━━━━━━━━━━━━━━━━━━━━
Hello MAK BUILD team, I calculated this estimate on your website and would like to discuss next steps.`;

  window.open(`https://wa.me/91${COMPANY_WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
}

// ----------------------------------------------------
// 3. CONTACT FORM ENQUIRY (Prefilled WhatsApp Submission)
// ----------------------------------------------------
function handleContactSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const feedback = document.getElementById("contact-form-feedback");
  const name = form.elements["client_name"]?.value.trim() || "";
  const phone = form.elements["client_phone"]?.value.trim() || "";
  const location = form.elements["client_location"]?.value.trim() || "";
  const projectType = form.elements["client_project_type"]?.value || "Villas & Homes (Turnkey Civil)";
  const message = form.elements["client_message"]?.value.trim() || "Plot inspection and architectural consultation.";

  // Clear any existing feedback state
  if (feedback) {
    feedback.className = "hidden p-3.5 rounded-xl text-xs font-semibold";
    feedback.textContent = "";
  }

  // Validate required fields
  if (!name) {
    if (feedback) {
      feedback.className = "block p-3.5 rounded-xl text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40";
      feedback.textContent = "Please enter your name so our engineers know who they are speaking with.";
    }
    form.elements["client_name"]?.focus();
    return;
  }

  // Clean phone to check digits
  const digitsOnly = phone.replace(/[^0-9]/g, "");
  if (!phone || digitsOnly.length < 10) {
    if (feedback) {
      feedback.className = "block p-3.5 rounded-xl text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40";
      feedback.textContent = "Please provide a valid 10-digit WhatsApp phone number so we can reach you.";
    }
    form.elements["client_phone"]?.focus();
    return;
  }

  if (!location) {
    if (feedback) {
      feedback.className = "block p-3.5 rounded-xl text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40";
      feedback.textContent = "Please provide your site or plot location (e.g. Sirkazhi, Thenpathi, etc.).";
    }
    form.elements["client_location"]?.focus();
    return;
  }

  // Valid submission: show brief positive feedback and open WhatsApp
  if (feedback) {
    feedback.className = "block p-3.5 rounded-xl text-xs font-semibold bg-green-500/20 text-green-300 border border-green-500/40";
    feedback.textContent = "Connecting you directly to MAK BUILD engineers on WhatsApp...";
  }

  const text = 
`👋 *NEW PROJECT ENQUIRY — MAK BUILD (SIRKAZHI)*
━━━━━━━━━━━━━━━━━━━━━━━━
👤 *Name:* ${name}
📞 *Phone:* ${phone}
📍 *Site Location:* ${location}
🏗️ *Project Type:* ${projectType}
📝 *Message / Requirements:*
${message}
━━━━━━━━━━━━━━━━━━━━━━━━
I would like to schedule a direct site consultation with MAK BUILD.`;

  window.open(`https://wa.me/91${COMPANY_WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank");
  form.reset();
}

// ----------------------------------------------------
// 4. OUR WORK GRID — INTERACTIVE BEFORE & AFTER SLIDERS
// ----------------------------------------------------
let activeFilter = "all";

function renderWorkGrid(filter = "all") {
  activeFilter = filter;
  const grid = document.getElementById("work-grid");
  if (!grid) return;

  const filtered = filter === "all" 
    ? ALL_PROJECTS 
    : ALL_PROJECTS.filter(p => p.category === filter);

  grid.innerHTML = filtered.map(p => `
    <article class="work-card glass-card rounded-2xl overflow-hidden border border-slate-800/80 hover:border-[#d4af37]/40 transition-all flex flex-col group">
      
      <!-- Interactive B&A Image Container -->
      <div 
        class="work-slider-box relative aspect-[16/10] sm:aspect-[16/10] overflow-hidden bg-slate-950 cursor-ew-resize select-none"
        data-project-id="${p.id}"
        tabindex="0"
        role="slider"
        aria-label="Before and after comparison for ${p.title}"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow="50"
        style="--ba-pos: 50%;"
      >
        <!-- AFTER Image (Underneath) -->
        <img 
          src="${p.afterImg}" 
          alt="After: ${p.title}" 
          class="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
          loading="lazy"
          width="800"
          height="500"
        />

        <!-- BEFORE Image (Clipped on top with --ba-pos) -->
        <div 
          class="absolute inset-0 overflow-hidden pointer-events-none"
          style="clip-path: polygon(0 0, var(--ba-pos) 0, var(--ba-pos) 100%, 0 100%); -webkit-clip-path: polygon(0 0, var(--ba-pos) 0, var(--ba-pos) 100%, 0 100%);"
        >
          <img 
            src="${p.beforeImg}" 
            alt="Before: ${p.title}" 
            class="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
            loading="lazy"
            width="800"
            height="500"
          />
        </div>

        <!-- Dividing Line -->
        <div 
          class="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#fceda2] via-[#d4af37] to-[#aa820a] pointer-events-none z-10 shadow-[0_0_10px_rgba(212,175,55,0.7)]"
          style="left: var(--ba-pos); transform: translateX(-50%);"
        ></div>

        <!-- Draggable Handle Orb -->
        <div 
          class="absolute top-1/2 w-8 h-8 rounded-full bg-[#d4af37] text-slate-950 flex items-center justify-center pointer-events-none z-20 shadow-xl border-2 border-white -translate-y-1/2 -translate-x-1/2 active:scale-110 transition-transform"
          style="left: var(--ba-pos);"
        >
          <svg viewBox="0 0 24 24" class="w-4 h-4 fill-none stroke-current stroke-[2.5]" stroke-linecap="round" stroke-linejoin="round">
            <path d="m8 9-4 3 4 3m8-6 4 3-4 3"/>
          </svg>
        </div>

        <!-- Labels -->
        <div class="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-0.5 rounded-md text-[9.5px] font-bold tracking-wider text-amber-300 border border-amber-400/30 pointer-events-none z-10">
          BEFORE
        </div>
        <div class="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-0.5 rounded-md text-[9.5px] font-bold tracking-wider text-[#d4af37] border border-[#d4af37]/30 pointer-events-none z-10">
          AFTER
        </div>

        <!-- Enlarge Button -->
        <button 
          type="button"
          onclick="openWorkModal(${p.id}); event.stopPropagation();"
          class="absolute bottom-3 right-3 z-20 w-8 h-8 rounded-lg bg-slate-900/90 hover:bg-[#d4af37] text-slate-300 hover:text-slate-950 border border-slate-700 hover:border-[#d4af37] flex items-center justify-center transition-all shadow-md"
          title="Click to Enlarge"
          aria-label="Enlarge ${p.title}"
        >
          <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
          </svg>
        </button>
      </div>

      <!-- Card Metadata: Title, Category, Location, Area ONLY -->
      <div class="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-slate-900/40">
        <div>
          <div class="flex items-center justify-between gap-2 mb-1.5">
            <span class="text-[11px] font-semibold uppercase tracking-wider text-[#d4af37] font-heading">
              ${p.categoryLabel}
            </span>
            <span class="text-xs text-slate-300 font-medium font-keyboard">
              ${p.area}
            </span>
          </div>

          <h3 class="text-base sm:text-lg font-bold text-white group-hover:text-[#fceda2] transition-colors line-clamp-1">
            ${p.title}
          </h3>
        </div>

        <div class="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span class="flex items-center gap-1.5 truncate">
            <svg class="w-3.5 h-3.5 text-[#d4af37] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span class="truncate">${p.location}</span>
          </span>

          <button 
            type="button" 
            onclick="openWorkModal(${p.id})" 
            class="text-[#d4af37] hover:underline font-semibold flex items-center gap-1 flex-shrink-0 ml-2"
          >
            <span>Compare</span> &rarr;
          </button>
        </div>

      </div>

    </article>
  `).join("");

  attachCardSliderListeners();
  if (window.lucide) window.lucide.createIcons();
}

function attachCardSliderListeners() {
  const sliderBoxes = document.querySelectorAll(".work-slider-box");

  sliderBoxes.forEach(box => {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let isHorizontal = null;

    function updatePos(clientX) {
      const rect = box.getBoundingClientRect();
      const offsetX = clientX - rect.left;
      const pct = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
      box.style.setProperty("--ba-pos", `${pct}%`);
      box.setAttribute("aria-valuenow", Math.round(pct));
    }

    // Pointer Events (Touch + Mouse unified)
    box.addEventListener("pointerdown", (e) => {
      // Don't drag if user clicked enlarge button
      if (e.target.closest("button")) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      isHorizontal = null;
      if (e.pointerType === "mouse") {
        try { box.setPointerCapture(e.pointerId); } catch (_) {}
        updatePos(e.clientX);
      }
    });

    box.addEventListener("pointermove", (e) => {
      if (!isDragging) return;
      if (e.pointerType === "touch" && isHorizontal === null) {
        const dx = Math.abs(e.clientX - startX);
        const dy = Math.abs(e.clientY - startY);
        if (dy > dx && dy > 8) {
          // Vertical scroll: release to native browser scrolling
          isDragging = false;
          return;
        } else if (dx > dy && dx > 8) {
          isHorizontal = true;
          try { box.setPointerCapture(e.pointerId); } catch (_) {}
        } else {
          return;
        }
      }
      updatePos(e.clientX);
    });

    const stopDragging = (e) => {
      if (!isDragging) return;
      isDragging = false;
      isHorizontal = null;
      try { box.releasePointerCapture(e.pointerId); } catch (_) {}
    };

    box.addEventListener("pointerup", stopDragging);
    box.addEventListener("pointercancel", stopDragging);

    // Keyboard Accessibility
    box.addEventListener("keydown", (e) => {
      let current = parseFloat(box.style.getPropertyValue("--ba-pos")) || 50;
      if (e.key === "ArrowLeft") {
        current = Math.max(0, current - 5);
        box.style.setProperty("--ba-pos", `${current}%`);
        box.setAttribute("aria-valuenow", Math.round(current));
        e.preventDefault();
      } else if (e.key === "ArrowRight") {
        current = Math.min(100, current + 5);
        box.style.setProperty("--ba-pos", `${current}%`);
        box.setAttribute("aria-valuenow", Math.round(current));
        e.preventDefault();
      } else if (e.key === "Home") {
        box.style.setProperty("--ba-pos", "0%");
        box.setAttribute("aria-valuenow", 0);
        e.preventDefault();
      } else if (e.key === "End") {
        box.style.setProperty("--ba-pos", "100%");
        box.setAttribute("aria-valuenow", 100);
        e.preventDefault();
      }
    });
  });
}

// ----------------------------------------------------
// 5. CLICK TO ENLARGE BEFORE/AFTER MODAL
// ----------------------------------------------------
let activeModalProject = null;

function openWorkModal(projectId) {
  const p = ALL_PROJECTS.find(item => item.id === projectId);
  if (!p) return;
  activeModalProject = p;

  const modal = document.getElementById("work-modal");
  const modalContent = document.getElementById("work-modal-content");
  if (!modal || !modalContent) return;

  modalContent.innerHTML = `
    <div class="relative flex flex-col bg-slate-900 border border-[#d4af37]/40 rounded-2xl overflow-hidden shadow-2xl max-w-4xl w-[calc(100vw-28px)] max-h-[92vh] my-auto">
      
      <!-- Modal Header -->
      <div class="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950/80">
        <div>
          <span class="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#d4af37] font-heading">
            ${p.categoryLabel} &bull; ${p.area}
          </span>
          <h3 class="text-base sm:text-xl font-bold text-white mt-0.5">
            ${p.title}
          </h3>
          <p class="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
            <svg class="w-3.5 h-3.5 text-[#d4af37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span>${p.location}</span>
          </p>
        </div>

        <button 
          type="button" 
          onclick="closeWorkModal()" 
          class="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-700"
          aria-label="Close modal"
        >
          <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Large Interactive Comparison Canvas -->
      <div class="p-3 sm:p-5 overflow-y-auto">
        <div 
          id="modal-slider-box" 
          class="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-950 cursor-ew-resize select-none border border-slate-800 shadow-xl"
          tabindex="0"
          role="slider"
          aria-label="Comparison slider"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow="50"
          style="--ba-pos: 50%;"
        >
          <!-- AFTER Image -->
          <img 
            src="${p.afterImg}" 
            alt="After: ${p.title}" 
            class="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
            width="1200"
            height="675"
          />

          <!-- BEFORE Image (Clipped) -->
          <div 
            class="absolute inset-0 overflow-hidden pointer-events-none"
            style="clip-path: polygon(0 0, var(--ba-pos) 0, var(--ba-pos) 100%, 0 100%); -webkit-clip-path: polygon(0 0, var(--ba-pos) 0, var(--ba-pos) 100%, 0 100%);"
          >
            <img 
              src="${p.beforeImg}" 
              alt="Before: ${p.title}" 
              class="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
              width="1200"
              height="675"
            />
          </div>

          <!-- Divider Line -->
          <div 
            class="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#fceda2] via-[#d4af37] to-[#aa820a] pointer-events-none z-10 shadow-[0_0_12px_rgba(212,175,55,0.85)]"
            style="left: var(--ba-pos); transform: translateX(-50%);"
          ></div>

          <!-- Handle Orb -->
          <div 
            class="absolute top-1/2 w-10 h-10 rounded-full bg-[#d4af37] text-slate-950 flex items-center justify-center pointer-events-none z-20 shadow-2xl border-2 border-white -translate-y-1/2 -translate-x-1/2 active:scale-110"
            style="left: var(--ba-pos);"
          >
            <svg viewBox="0 0 24 24" class="w-5 h-5 fill-none stroke-current stroke-[2.5]" stroke-linecap="round" stroke-linejoin="round">
              <path d="m8 9-4 3 4 3m8-6 4 3-4 3"/>
            </svg>
          </div>

          <!-- Stage Badges -->
          <div class="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold tracking-wider text-amber-300 border border-amber-400/40 pointer-events-none z-10">
            BEFORE: ${p.beforeLabel}
          </div>
          <div class="absolute top-3 right-3 bg-slate-950/85 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold tracking-wider text-[#d4af37] border border-[#d4af37]/40 pointer-events-none z-10">
            AFTER: ${p.afterLabel}
          </div>
        </div>

        <!-- Presets & Interaction Bar -->
        <div class="mt-3 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div class="flex items-center gap-2">
            <span class="text-slate-400 font-medium hidden sm:inline">Reveal:</span>
            <button type="button" onclick="setModalBaPos(100)" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold border border-slate-700">100% Before</button>
            <button type="button" onclick="setModalBaPos(50)" class="px-3 py-1.5 rounded-lg bg-[#d4af37]/20 text-[#fceda2] font-semibold border border-[#d4af37]/40">50/50 Split</button>
            <button type="button" onclick="setModalBaPos(0)" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold border border-slate-700">100% After</button>
          </div>

          <span class="text-slate-400 text-[11px] flex items-center gap-1">
            <span>Drag slider or swipe on touch screens</span>
          </span>
        </div>

        <!-- Specs Line -->
        <div class="mt-4 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed font-light">
          <strong class="text-[#d4af37] font-semibold">Materials &amp; Engineering:</strong> ${p.specs}
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="p-4 sm:p-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/80">
        <a 
          href="https://wa.me/91${COMPANY_WHATSAPP}?text=Hi%20MAK%20BUILD%2C%20I%20saw%20your%20project%20${encodeURIComponent(p.title)}%20and%20would%20like%20to%20discuss%20a%20similar%20project." 
          target="_blank"
          class="w-full sm:w-auto bg-[#d4af37] hover:bg-[#f0c946] text-slate-950 font-bold px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-lg transition-all"
        >
          <svg viewBox="0 0 24 24" class="w-4 h-4 fill-none stroke-current stroke-2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          <span>Discuss This Project on WhatsApp</span>
        </a>

        <button 
          type="button" 
          onclick="closeWorkModal()" 
          class="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-medium transition-colors"
        >
          Close
        </button>
      </div>

    </div>
  `;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.body.style.overflow = "hidden";

  // Attach drag listeners to modal slider
  const modalBox = document.getElementById("modal-slider-box");
  if (modalBox) {
    let isDraggingModal = false;
    let startModalX = 0;
    let startModalY = 0;
    let isModalHorizontal = null;

    function updateModal(clientX) {
      const rect = modalBox.getBoundingClientRect();
      const offsetX = clientX - rect.left;
      const pct = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
      modalBox.style.setProperty("--ba-pos", `${pct}%`);
      modalBox.setAttribute("aria-valuenow", Math.round(pct));
    }

    modalBox.addEventListener("pointerdown", (e) => {
      isDraggingModal = true;
      startModalX = e.clientX;
      startModalY = e.clientY;
      isModalHorizontal = null;
      if (e.pointerType === "mouse") {
        try { modalBox.setPointerCapture(e.pointerId); } catch (_) {}
        updateModal(e.clientX);
      }
    });

    modalBox.addEventListener("pointermove", (e) => {
      if (!isDraggingModal) return;
      if (e.pointerType === "touch" && isModalHorizontal === null) {
        const dx = Math.abs(e.clientX - startModalX);
        const dy = Math.abs(e.clientY - startModalY);
        if (dy > dx && dy > 8) {
          isDraggingModal = false;
          return;
        } else if (dx > dy && dx > 8) {
          isModalHorizontal = true;
          try { modalBox.setPointerCapture(e.pointerId); } catch (_) {}
        } else {
          return;
        }
      }
      updateModal(e.clientX);
    });

    const stopModalDrag = (e) => {
      if (!isDraggingModal) return;
      isDraggingModal = false;
      isModalHorizontal = null;
      try { modalBox.releasePointerCapture(e.pointerId); } catch (_) {}
    };

    modalBox.addEventListener("pointerup", stopModalDrag);
    modalBox.addEventListener("pointercancel", stopModalDrag);

    // Keyboard support in modal
    modalBox.addEventListener("keydown", (e) => {
      let current = parseFloat(modalBox.style.getPropertyValue("--ba-pos")) || 50;
      if (e.key === "ArrowLeft") {
        setModalBaPos(Math.max(0, current - 5));
        e.preventDefault();
      } else if (e.key === "ArrowRight") {
        setModalBaPos(Math.min(100, current + 5));
        e.preventDefault();
      }
    });
  }
}

function setModalBaPos(percentage) {
  const modalBox = document.getElementById("modal-slider-box");
  if (!modalBox) return;
  const clamped = Math.max(0, Math.min(100, percentage));
  modalBox.style.setProperty("--ba-pos", `${clamped}%`);
  modalBox.setAttribute("aria-valuenow", Math.round(clamped));
}

function closeWorkModal() {
  const modal = document.getElementById("work-modal");
  if (!modal) return;
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  document.body.style.overflow = "";
}

// ----------------------------------------------------
// 6. INITIALIZATION & EVENT BINDINGS
// ----------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  // Render initial work grid (all 10 projects)
  renderWorkGrid("all");

  // Category filter buttons
  const filterBtns = document.querySelectorAll("[data-work-filter]");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => {
        b.classList.remove("bg-[#d4af37]", "text-slate-950", "font-bold", "shadow-md");
        b.classList.add("bg-slate-800", "text-slate-300");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("bg-[#d4af37]", "text-slate-950", "font-bold", "shadow-md");
      btn.classList.remove("bg-slate-800", "text-slate-300");
      btn.setAttribute("aria-selected", "true");

      const filter = btn.dataset.workFilter;
      renderWorkGrid(filter);
    });
  });

  // Modal backdrop click
  const modal = document.getElementById("work-modal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeWorkModal();
    });
  }

  // Escape key closes modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeWorkModal();
  });

  // Estimator Area Controls (Slider + Direct Input)
  const areaSlider = document.getElementById("est-area-slider");
  const areaInput = document.getElementById("est-area-input");

  if (areaSlider) {
    areaSlider.addEventListener("input", (e) => {
      const val = parseInt(e.target.value, 10);
      estimatorState.area = val;
      if (areaInput) areaInput.value = val;
      calculateCost();
    });
  }

  if (areaInput) {
    // Live update on input without locking keyboard backspace
    areaInput.addEventListener("input", (e) => {
      const raw = e.target.value.trim();
      if (!raw) return;
      const val = parseInt(raw, 10);
      if (!isNaN(val) && val >= 300 && val <= 50000) {
        estimatorState.area = val;
        if (areaSlider) areaSlider.value = Math.min(10000, val);
        calculateCost();
      }
    });

    const clampAndCalculate = () => {
      let val = parseInt(areaInput.value, 10);
      if (isNaN(val) || val < 300) val = 300;
      if (val > 50000) val = 50000;
      estimatorState.area = val;
      areaInput.value = val;
      if (areaSlider) areaSlider.value = Math.min(10000, val);
      calculateCost();
    };

    areaInput.addEventListener("blur", clampAndCalculate);
    areaInput.addEventListener("change", clampAndCalculate);
  }

  // Estimator Scope Select
  const scopeSelect = document.getElementById("est-scope-select");
  if (scopeSelect) {
    scopeSelect.addEventListener("change", (e) => {
      estimatorState.projectType = e.target.value;
      calculateCost();
    });
  }

  // Estimator Package Tier Buttons
  const pkgButtons = document.querySelectorAll("[data-est-pkg]");
  pkgButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      pkgButtons.forEach(b => {
        b.classList.remove("border-[#d4af37]", "bg-[#d4af37]/10", "text-[#d4af37]");
        b.classList.add("border-slate-800", "bg-slate-900/60", "text-slate-300");
      });
      btn.classList.add("border-[#d4af37]", "bg-[#d4af37]/10", "text-[#d4af37]");
      btn.classList.remove("border-slate-800", "bg-slate-900/60", "text-slate-300");
      estimatorState.packageType = btn.dataset.estPkg;
      calculateCost();
    });
  });

  // Estimator Add-on Checkboxes
  const addonCheckboxes = document.querySelectorAll("[data-est-addon]");
  addonCheckboxes.forEach(cb => {
    cb.addEventListener("change", (e) => {
      const key = e.target.dataset.estAddon;
      estimatorState.addons[key] = e.target.checked;
      calculateCost();
    });
  });

  // WhatsApp Quote Button
  const waQuoteBtn = document.getElementById("est-whatsapp-btn");
  if (waQuoteBtn) {
    waQuoteBtn.addEventListener("click", sendEstimateToWhatsApp);
  }

  // Initial Calculation
  calculateCost();

  // Contact Form Submission
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", handleContactSubmit);
  }

  // Accessible Mobile Menu Toggle
  const mobileToggle = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  if (mobileToggle && mobileMenu) {
    const closeMobileMenu = () => {
      mobileMenu.style.display = "none";
      mobileMenu.classList.add("hidden");
      mobileToggle.setAttribute("aria-expanded", "false");
    };

    const openMobileMenu = () => {
      mobileMenu.style.display = "block";
      mobileMenu.classList.remove("hidden");
      mobileToggle.setAttribute("aria-expanded", "true");
    };

    mobileToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isClosed = mobileMenu.style.display === "none" || mobileMenu.classList.contains("hidden");
      if (isClosed) {
        openMobileMenu();
      } else {
        closeMobileMenu();
      }
    });

    mobileMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("click", (e) => {
      if (!mobileMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        closeMobileMenu();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMobileMenu();
    });
  }

  // Lucide icons trigger
  if (window.lucide) window.lucide.createIcons();
});

// Global exports
window.openWorkModal = openWorkModal;
window.closeWorkModal = closeWorkModal;
window.setModalBaPos = setModalBaPos;
window.sendEstimateToWhatsApp = sendEstimateToWhatsApp;
window.renderWorkGrid = renderWorkGrid;
