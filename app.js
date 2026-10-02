/**
 * app.js
 * MAK BUILD — Construction & Design
 * High-performance, 60fps, dependency-free vanilla JavaScript application.
 */

(function () {
  'use strict';

  const CONTENT = window.MAK_CONTENT;
  if (!CONTENT) {
    console.error('MAK_CONTENT configuration not found.');
    return;
  }

  // State Management
  let currentLang = localStorage.getItem('mak_lang') || 'en';
  let allProjects = [];
  let currentTab = 'all';
  let moderateOption = 'standard'; // 'standard' (2300) | 'plus' (2400)
  let heroCurrentIndex = 0;
  let heroTimer = null;
  const HERO_INTERVAL = 6000;
  let isHeroPaused = false;

  // DOM Elements
  const header = document.querySelector('.header');
  const langToggleBtn = document.getElementById('langToggleBtn');
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileDrawerBackdrop = document.getElementById('mobileDrawerBackdrop');
  const floatingMobileBar = document.querySelector('.floating-mobile-bar');
  const compareModal = document.getElementById('compareModal');
  const serviceModal = document.getElementById('serviceModal');
  const lightboxModal = document.getElementById('lightboxModal');

  // ==========================================
  // 1. Language & Translations Engine
  // ==========================================
  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('mak_lang', lang);
    document.documentElement.lang = lang;

    // Update text content with data-i18n
    const strings = CONTENT.ui[lang] || CONTENT.ui.en;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (strings[key]) {
        el.textContent = strings[key];
      }
    });

    // Update language toggle button label
    if (langToggleBtn) {
      langToggleBtn.textContent = strings.langBtn;
      langToggleBtn.setAttribute('aria-label', `Switch to ${lang === 'en' ? 'Tamil' : 'English'}`);
    }

    // Re-render dynamic sections
    renderHeroCaptions();
    renderServices();
    renderPackages();
    renderProjects();
    updateEstimator();
    renderProcess();
    renderAboutAndContact();
  }

  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      setLanguage(currentLang === 'en' ? 'ta' : 'en');
    });
  }

  // ==========================================
  // 2. Header Scroll & Sheen
  // ==========================================
  function initHeader() {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });

    // Logo sheen trigger
    const logoWrap = document.querySelector('.brand-logo-wrap');
    if (logoWrap) {
      setTimeout(() => {
        logoWrap.parentElement.classList.add('sheen-active');
        setTimeout(() => logoWrap.parentElement.classList.remove('sheen-active'), 1500);
      }, 500);
    }

    // Mobile nav drawer
    if (mobileNavToggle && mobileNavDrawer && mobileDrawerBackdrop) {
      const toggleDrawer = (open) => {
        mobileNavDrawer.classList.toggle('open', open);
        mobileDrawerBackdrop.classList.toggle('open', open);
        document.body.style.overflow = open ? 'hidden' : '';
      };

      mobileNavToggle.addEventListener('click', () => toggleDrawer(true));
      mobileDrawerBackdrop.addEventListener('click', () => toggleDrawer(false));
      document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => toggleDrawer(false));
      });
    }

    // Hide mobile bar on virtual keyboard open
    if (floatingMobileBar) {
      window.addEventListener('focusin', (e) => {
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
          floatingMobileBar.classList.add('hide-on-keyboard');
        }
      });
      window.addEventListener('focusout', () => {
        floatingMobileBar.classList.remove('hide-on-keyboard');
      });
    }
  }

  // ==========================================
  // 3. Hero Background Slider
  // ==========================================
  const heroSlidesData = [
    { src: 'assets/hero/hero-villa.webp', thumb: 'assets/hero/hero-villa-640.webp', is3d: false },
    { src: 'assets/hero/hero-residence-elevation.webp', thumb: 'assets/designs/residence-elevation-640.webp', is3d: true },
    { src: 'assets/hero/hero-showroom.webp', thumb: 'assets/designs/showroom-interior-640.webp', is3d: true },
    { src: 'assets/hero/hero-living.webp', thumb: 'assets/designs/living-interior-640.webp', is3d: true }
  ];

  function initHeroSlider() {
    const sliderWrap = document.getElementById('heroSliderWrap');
    const dotsWrap = document.getElementById('heroDotsWrap');
    const chip = document.getElementById('heroSlideChip');
    if (!sliderWrap || !dotsWrap) return;

    sliderWrap.innerHTML = '';
    dotsWrap.innerHTML = '';

    heroSlidesData.forEach((slide, idx) => {
      // Create slide element
      const div = document.createElement('div');
      div.className = `hero-slide ${idx === 0 ? 'active' : ''}`;
      div.innerHTML = `
        <img class="hero-slide-img" 
             src="${slide.src}" 
             alt="MAK BUILD Architectural Project ${idx + 1}"
             ${idx === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}
             decoding="async"
             width="1280" height="720">
      `;
      sliderWrap.appendChild(div);

      // Create dot
      const dot = document.createElement('button');
      dot.className = `hero-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
      dot.addEventListener('click', () => goToSlide(idx));
      dotsWrap.appendChild(dot);
    });

    updateSlideChip();
    startHeroAutoplay();

    // Pause autoplay on hover or touch-hold
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      heroSection.addEventListener('mouseenter', () => { isHeroPaused = true; });
      heroSection.addEventListener('mouseleave', () => { isHeroPaused = false; });
      heroSection.addEventListener('touchstart', () => { isHeroPaused = true; }, { passive: true });
      heroSection.addEventListener('touchend', () => { isHeroPaused = false; });
    }

    // Pause when tab hidden
    document.addEventListener('visibilitychange', () => {
      isHeroPaused = document.hidden;
    });

    // Arrow keys & swipe
    window.addEventListener('keydown', (e) => {
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') goToSlide((heroCurrentIndex + 1) % heroSlidesData.length);
      if (e.key === 'ArrowLeft') goToSlide((heroCurrentIndex - 1 + heroSlidesData.length) % heroSlidesData.length);
    });

    // Touch swipe on hero
    let touchStartX = 0;
    if (heroSection) {
      heroSection.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      heroSection.addEventListener('touchend', e => {
        const diffX = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(diffX) > 40) {
          if (diffX < 0) goToSlide((heroCurrentIndex + 1) % heroSlidesData.length);
          else goToSlide((heroCurrentIndex - 1 + heroSlidesData.length) % heroSlidesData.length);
        }
      }, { passive: true });
    }
  }

  function goToSlide(index) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    if (!slides.length) return;

    slides[heroCurrentIndex].classList.remove('active');
    if (dots[heroCurrentIndex]) dots[heroCurrentIndex].classList.remove('active');

    heroCurrentIndex = index;

    slides[heroCurrentIndex].classList.add('active');
    if (dots[heroCurrentIndex]) dots[heroCurrentIndex].classList.add('active');

    updateSlideChip();
  }

  function updateSlideChip() {
    const chip = document.getElementById('heroSlideChip');
    if (!chip) return;
    const is3d = heroSlidesData[heroCurrentIndex]?.is3d;
    const t = CONTENT.ui[currentLang] || CONTENT.ui.en;
    if (is3d) {
      chip.textContent = t.heroBadge3d;
      chip.style.display = 'inline-flex';
    } else {
      chip.style.display = 'none';
    }
  }

  function startHeroAutoplay() {
    if (heroTimer) clearInterval(heroTimer);
    heroTimer = setInterval(() => {
      if (!isHeroPaused && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        goToSlide((heroCurrentIndex + 1) % heroSlidesData.length);
      }
    }, HERO_INTERVAL);
  }

  function renderHeroCaptions() {
    const t = CONTENT.ui[currentLang] || CONTENT.ui.en;
    const h1 = document.getElementById('heroH1');
    const sub = document.getElementById('heroSub');
    const tagline = document.getElementById('heroTamilTagline');
    const infoEngineer = document.getElementById('heroInfoEngineer');
    const infoScope = document.getElementById('heroInfoScope');
    const infoStudio = document.getElementById('heroInfoStudio');

    if (h1) h1.textContent = t.heroH1;
    if (sub) sub.textContent = t.heroSub;
    if (tagline) tagline.textContent = CONTENT.company.taglineTa;

    if (infoEngineer) {
      infoEngineer.innerHTML = `<strong>${t.heroInfoEngineer}</strong>`;
    }
    if (infoScope) infoScope.textContent = t.heroInfoScope;
    if (infoStudio) infoStudio.textContent = t.heroInfoStudio;

    updateSlideChip();
  }

  // ==========================================
  // 4. Services Section
  // ==========================================
  function renderServices() {
    const grid = document.getElementById('servicesGrid');
    const chipsWrap = document.getElementById('serviceChipsRow');
    if (!grid) return;

    grid.innerHTML = '';
    const t = CONTENT.ui[currentLang] || CONTENT.ui.en;

    CONTENT.services.forEach(svc => {
      const card = document.createElement('div');
      card.className = 'service-card';
      const title = currentLang === 'ta' ? svc.titleTa : svc.titleEn;
      const shortDesc = currentLang === 'ta' ? svc.shortTa : svc.shortEn;
      const bullets = currentLang === 'ta' ? svc.bulletsTa : svc.bulletsEn;

      card.innerHTML = `
        <div class="service-icon-box">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
        </div>
        <h3 class="service-title">${title}</h3>
        <p class="service-line">${shortDesc}</p>
        <ul class="service-bullets">
          ${bullets.map(b => `
            <li class="service-bullet">
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
              <span>${b}</span>
            </li>
          `).join('')}
        </ul>
        <button class="service-btn" data-service="${svc.id}" aria-label="${t.knowMore} about ${title}">
          <span>${t.knowMore}</span>
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      `;

      card.querySelector('.service-btn').addEventListener('click', () => openServiceModal(svc));
      grid.appendChild(card);
    });

    // Chips
    if (chipsWrap) {
      chipsWrap.innerHTML = CONTENT.serviceChips.map(c => `
        <span class="service-chip">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          ${currentLang === 'ta' ? c.ta : c.en}
        </span>
      `).join('');
    }
  }

  function openServiceModal(svc) {
    if (!serviceModal) return;
    const titleEl = document.getElementById('serviceModalTitle');
    const bodyEl = document.getElementById('serviceModalBody');
    const title = currentLang === 'ta' ? svc.titleTa : svc.titleEn;
    const desc = currentLang === 'ta' ? svc.shortTa : svc.shortEn;
    const bullets = currentLang === 'ta' ? svc.bulletsTa : svc.bulletsEn;

    if (titleEl) titleEl.textContent = title;
    if (bodyEl) {
      bodyEl.innerHTML = `
        <p style="font-size: 1rem; color: #cbd5e1; margin-bottom: 20px; line-height: 1.6;">${desc}</p>
        <h4 style="font-size: 0.95rem; color: var(--gold-light); margin-bottom: 12px; font-weight: 700;">Scope of Work:</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px;">
          ${bullets.map(b => `
            <li style="display: flex; align-items: flex-start; gap: 10px; font-size: 0.9rem; color: #e2e8f0;">
              <svg width="16" height="16" fill="none" stroke="var(--gold-primary)" stroke-width="2.5" viewBox="0 0 24 24" style="flex-shrink: 0; margin-top: 3px;">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
              <span>${b}</span>
            </li>
          `).join('')}
        </ul>
        <div style="text-align: right;">
          <a href="https://wa.me/918144166022?text=${encodeURIComponent(`Hello MAK BUILD, I would like to consult about your service: ${title}`)}" 
             target="_blank" rel="noopener noreferrer" class="btn-primary" style="padding: 10px 20px; font-size: 0.88rem;">
            Enquire on WhatsApp
          </a>
        </div>
      `;
    }

    openModal(serviceModal);
  }

  // ==========================================
  // 5. Packages Section
  // ==========================================
  function renderPackages() {
    const grid = document.getElementById('packagesGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const t = CONTENT.ui[currentLang] || CONTENT.ui.en;
    const tm = CONTENT.tierMapping;

    // 1. Basic Card
    const basicCard = document.createElement('div');
    basicCard.className = 'package-card';
    basicCard.innerHTML = `
      <div class="package-header">
        <h3 class="package-name">${currentLang === 'ta' ? tm.basic.nameTa : tm.basic.name}</h3>
        <div class="package-rate-box">
          <span class="package-currency">₹</span>
          <span class="package-amount">${tm.basic.rate}</span>
          <span class="package-unit">/ sq.ft</span>
        </div>
        <p class="package-tagline">${currentLang === 'ta' ? tm.basic.taglineTa : tm.basic.tagline}</p>
        <p class="package-suits">${currentLang === 'ta' ? tm.basic.suitsTa : tm.basic.suits}</p>
      </div>
      <ul class="package-features">
        ${(currentLang === 'ta' ? tm.basic.highlightsTa : tm.basic.highlights).map(h => `
          <li class="package-feature">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
            <span>${h}</span>
          </li>
        `).join('')}
      </ul>
      <div class="package-cta">
        <a href="https://wa.me/918144166022?text=${encodeURIComponent('Hello MAK BUILD, I would like a quote for the Basic Package (₹2,200/sq.ft).')}" 
           target="_blank" rel="noopener noreferrer" class="package-quote-btn">
          ${t.getQuoteBtn.replace('{tier}', 'Basic')}
        </a>
      </div>
    `;
    grid.appendChild(basicCard);

    // 2. Moderate Card (With Standard/Plus Switch & Highlight)
    const modCard = document.createElement('div');
    modCard.className = 'package-card highlight';
    const activeMod = tm.moderate.options[moderateOption];
    modCard.innerHTML = `
      <span class="popular-badge">${t.mostPopular}</span>
      <div class="package-header">
        <h3 class="package-name">${currentLang === 'ta' ? tm.moderate.nameTa : tm.moderate.name}</h3>
        <div class="package-rate-box">
          <span class="package-currency">₹</span>
          <span class="package-amount" id="modRateAmount">${activeMod.rate}</span>
          <span class="package-unit">/ sq.ft</span>
        </div>
        <div class="moderate-switch-wrap" role="group" aria-label="Moderate package tier options">
          <button class="switch-btn ${moderateOption === 'standard' ? 'active' : ''}" data-mod-option="standard">
            ${currentLang === 'ta' ? tm.moderate.options.standard.labelTa : tm.moderate.options.standard.label} (₹2,300)
          </button>
          <button class="switch-btn ${moderateOption === 'plus' ? 'active' : ''}" data-mod-option="plus">
            ${currentLang === 'ta' ? tm.moderate.options.plus.labelTa : tm.moderate.options.plus.label} (₹2,400)
          </button>
        </div>
        <p class="package-tagline" id="modTagline">${currentLang === 'ta' ? activeMod.taglineTa : activeMod.tagline}</p>
        <p class="package-suits" id="modSuits">${currentLang === 'ta' ? activeMod.suitsTa : activeMod.suits}</p>
      </div>
      <ul class="package-features" id="modFeatures">
        ${(currentLang === 'ta' ? activeMod.highlightsTa : activeMod.highlights).map(h => `
          <li class="package-feature">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
            <span>${h}</span>
          </li>
        `).join('')}
      </ul>
      <div class="package-cta">
        <a id="modQuoteBtn" href="https://wa.me/918144166022?text=${encodeURIComponent(`Hello MAK BUILD, I would like a quote for the Moderate ${activeMod.label} Package (₹${activeMod.rate}/sq.ft).`)}" 
           target="_blank" rel="noopener noreferrer" class="package-quote-btn">
          ${t.getQuoteBtn.replace('{tier}', `Moderate ${activeMod.label}`)}
        </a>
      </div>
    `;

    // Wire up moderate switch
    modCard.querySelectorAll('[data-mod-option]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        moderateOption = e.target.getAttribute('data-mod-option');
        renderPackages();
      });
    });

    grid.appendChild(modCard);

    // 3. Premium Card
    const premCard = document.createElement('div');
    premCard.className = 'package-card';
    premCard.innerHTML = `
      <div class="package-header">
        <h3 class="package-name">${currentLang === 'ta' ? tm.premium.nameTa : tm.premium.name}</h3>
        <div class="package-rate-box">
          <span class="package-currency">₹</span>
          <span class="package-amount">${tm.premium.rate}</span>
          <span class="package-unit">/ sq.ft</span>
        </div>
        <p class="package-tagline">${currentLang === 'ta' ? tm.premium.taglineTa : tm.premium.tagline}</p>
        <p class="package-suits">${currentLang === 'ta' ? tm.premium.suitsTa : tm.premium.suits}</p>
      </div>
      <ul class="package-features">
        ${(currentLang === 'ta' ? tm.premium.highlightsTa : tm.premium.highlights).map(h => `
          <li class="package-feature">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
            <span>${h}</span>
          </li>
        `).join('')}
      </ul>
      <div class="package-cta">
        <a href="https://wa.me/918144166022?text=${encodeURIComponent('Hello MAK BUILD, I would like a quote for the Premium Package with Soil Test (₹2,500/sq.ft).')}" 
           target="_blank" rel="noopener noreferrer" class="package-quote-btn">
          ${t.getQuoteBtn.replace('{tier}', 'Premium')}
        </a>
      </div>
    `;
    grid.appendChild(premCard);

    // Wire compare specification button
    const compareBtn = document.getElementById('openCompareModalBtn');
    if (compareBtn) {
      compareBtn.onclick = openCompareModal;
    }
  }

  // ==========================================
  // 6. 2026 Specification Compare Modal
  // ==========================================
  function openCompareModal() {
    if (!compareModal) return;
    const bodyEl = document.getElementById('compareModalBody');
    const t = CONTENT.ui[currentLang] || CONTENT.ui.en;

    let html = `
      <div class="spec-table-scroll">
        <table class="spec-table">
          <thead>
            <tr>
              <th>${t.tableColSpec}</th>
              <th>${t.tableColA}</th>
              <th>${t.tableColB}</th>
              <th>${t.tableColC}</th>
              <th style="background: rgba(212, 175, 55, 0.15); color: var(--gold-light);">${t.tableColD}</th>
            </tr>
          </thead>
          <tbody>
    `;

    CONTENT.spec2026.forEach(group => {
      const groupTitle = currentLang === 'ta' ? group.groupTa : group.group;
      html += `
        <tr class="spec-group-row">
          <td colspan="5">${groupTitle}</td>
        </tr>
      `;

      group.items.forEach(item => {
        const itemName = currentLang === 'ta' ? item.nameTa : item.name;
        const isDiff = item.diffPremium ? 'spec-row-diff' : '';
        html += `
          <tr class="${isDiff}">
            <td><strong>${item.no}. ${itemName}</strong></td>
            <td>${item.a}</td>
            <td>${item.b}</td>
            <td>${item.c}</td>
            <td><strong>${item.d}</strong></td>
          </tr>
        `;
      });
    });

    html += `
          </tbody>
        </table>
      </div>
      <p style="font-size: 0.78rem; color: var(--text-dim); margin-top: 16px; text-align: right;">
        * Rows highlighted in gold indicate advanced architectural specifications included in the Premium Tier.
      </p>
    `;

    bodyEl.innerHTML = html;
    openModal(compareModal);
  }

  // ==========================================
  // 7. Projects & Showcase Section
  // ==========================================
  async function loadProjects() {
    try {
      const res = await fetch('projects.json');
      if (res.ok) {
        allProjects = await res.json();
      }
    } catch (e) {
      console.warn('Could not fetch projects.json, fallback to static defaults');
    }
    renderProjectsTabs();
    renderProjects();
  }

  function renderProjectsTabs() {
    const tabsWrap = document.getElementById('projectsTabs');
    if (!tabsWrap) return;
    tabsWrap.innerHTML = '';

    const t = CONTENT.ui[currentLang] || CONTENT.ui.en;
    const categories = [
      { id: 'all', label: t.tabAll },
      { id: 'Villas', label: t.tabVillas },
      { id: 'Commercial & PEB', label: t.tabCommercial },
      { id: 'Interiors', label: t.tabInteriors },
      { id: '3D Designs', label: t.tabDesigns }
    ];

    // Filter out categories that have zero projects
    const available = categories.filter(cat => {
      if (cat.id === 'all') return true;
      return allProjects.some(p => p.category === cat.id);
    });

    available.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = `project-tab-btn ${currentTab === cat.id ? 'active' : ''}`;
      btn.textContent = cat.label;
      btn.addEventListener('click', () => {
        currentTab = cat.id;
        renderProjectsTabs();
        renderProjects();
      });
      tabsWrap.appendChild(btn);
    });
  }

  function renderProjects() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const t = CONTENT.ui[currentLang] || CONTENT.ui.en;
    const filtered = currentTab === 'all' 
      ? allProjects 
      : allProjects.filter(p => p.category === currentTab);

    filtered.forEach(proj => {
      const card = document.createElement('div');
      card.className = 'project-card';

      const title = currentLang === 'ta' && proj.titleTa ? proj.titleTa : proj.title;
      const desc = currentLang === 'ta' && proj.descriptionTa ? proj.descriptionTa : proj.description;

      let mediaHtml = '';
      if (proj.hasBeforeAfter && proj.beforeImg && proj.afterImg) {
        // Before/After Draggable Slider
        mediaHtml = `
          <div class="ba-container" data-ba-id="${proj.id}">
            <div class="ba-before-layer">
              <img class="ba-img" src="${proj.beforeImg}" alt="${proj.beforeLabel || 'Before'}" loading="lazy" width="640" height="400">
              <span class="ba-badge before">${proj.beforeLabel || 'BEFORE'}</span>
            </div>
            <div class="ba-after-layer">
              <img class="ba-img" src="${proj.afterImg}" alt="${proj.afterLabel || 'After'}" loading="lazy" width="640" height="400">
              <span class="ba-badge after">${proj.afterLabel || 'AFTER'}</span>
            </div>
            <div class="ba-handle">
              <div class="ba-handle-btn">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4"/>
                </svg>
              </div>
            </div>
          </div>
        `;
      } else {
        // Single Cover Image with Lightbox
        const isBlurBrand = proj.blurBrand && !proj.clientPermission;
        const isBlurName = proj.blurNameplate && !proj.clientPermission;
        const blurClass = isBlurBrand ? 'blur-brand' : '';
        mediaHtml = `
          <img class="project-cover-img ${blurClass}" 
               src="${proj.coverThumb || proj.cover}" 
               alt="${title}" 
               loading="lazy" 
               width="${proj.coverWidth || 640}" 
               height="${proj.coverHeight || 400}">
        `;
      }

      card.innerHTML = `
        <div class="project-media-wrap">
          ${mediaHtml}
        </div>
        <div class="project-details">
          <div class="project-meta-row">
            ${proj.badge ? `<span class="project-badge">${proj.badge}</span>` : ''}
            ${proj.location ? `<span class="project-location">${proj.location}</span>` : ''}
            ${proj.area ? `<span class="project-location">• ${proj.area}</span>` : ''}
          </div>
          <h3 class="project-title">${title}</h3>
          <p class="project-desc">${desc}</p>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-top: auto;">
            <button class="service-btn view-proj-btn" data-img="${proj.cover}">
              <span>${t.viewProject}</span>
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </button>
            <a href="https://wa.me/918144166022?text=${encodeURIComponent(`Hello MAK BUILD, I would like more information on the project: ${title}`)}" 
               target="_blank" rel="noopener noreferrer" style="color: var(--gold-primary); font-size: 0.8rem; font-weight: 600;">
              WhatsApp
            </a>
          </div>
        </div>
      `;

      // Lightbox click
      const viewBtn = card.querySelector('.view-proj-btn');
      if (viewBtn) {
        viewBtn.addEventListener('click', () => openLightbox(proj.cover, title));
      }

      // Initialize draggable slider if present
      const baContainer = card.querySelector('.ba-container');
      if (baContainer) {
        initBaSlider(baContainer);
      }

      grid.appendChild(card);
    });
  }

  function initBaSlider(container) {
    const afterLayer = container.querySelector('.ba-after-layer');
    const handle = container.querySelector('.ba-handle');
    let isDragging = false;

    function setPosition(xPercent) {
      const clamped = Math.max(0, Math.min(100, xPercent));
      afterLayer.style.width = `${clamped}%`;
      handle.style.left = `${clamped}%`;
    }

    function onMove(e) {
      if (!isDragging) return;
      const rect = container.getBoundingClientRect();
      const pageX = e.touches ? e.touches[0].clientX : e.clientX;
      const xPercent = ((pageX - rect.left) / rect.width) * 100;
      setPosition(xPercent);
    }

    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      onMove(e);
    });
    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('mousemove', onMove);

    container.addEventListener('touchstart', (e) => {
      isDragging = true;
      onMove(e);
    }, { passive: true });
    window.addEventListener('touchend', () => { isDragging = false; });
    window.addEventListener('touchmove', onMove, { passive: true });

    // Keyboard accessibility
    container.setAttribute('tabindex', '0');
    container.setAttribute('role', 'slider');
    container.setAttribute('aria-label', 'Before and after comparison slider');
    container.setAttribute('aria-valuenow', '50');
    container.addEventListener('keydown', (e) => {
      let currentVal = parseFloat(afterLayer.style.width) || 50;
      if (e.key === 'ArrowLeft') {
        setPosition(currentVal - 5);
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        setPosition(currentVal + 5);
        e.preventDefault();
      }
    });

    setPosition(50);
  }

  // ==========================================
  // 8. Quick Cost Estimator Engine
  // ==========================================
  let estState = {
    scope: 'residential',
    area: 1200,
    pkg: 'moderate-standard', // basic, moderate-standard, moderate-plus, premium
    addons: []
  };

  function initEstimator() {
    const scopeBtns = document.querySelectorAll('[data-est-scope]');
    const areaRange = document.getElementById('estAreaRange');
    const areaInput = document.getElementById('estAreaInput');
    const pkgBtns = document.querySelectorAll('[data-est-pkg]');
    const addonsList = document.getElementById('estAddonsList');

    // Scope selection
    scopeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        estState.scope = e.currentTarget.getAttribute('data-est-scope');
        scopeBtns.forEach(b => b.classList.toggle('active', b === e.currentTarget));
        updateEstimator();
      });
    });

    // Area range slider & field sync
    if (areaRange && areaInput) {
      areaRange.addEventListener('input', (e) => {
        estState.area = parseInt(e.target.value, 10);
        areaInput.value = estState.area;
        updateEstimator();
      });
      areaInput.addEventListener('input', (e) => {
        let val = parseInt(e.target.value, 10);
        if (isNaN(val)) val = 300;
        val = Math.max(300, Math.min(50000, val));
        estState.area = val;
        areaRange.value = val;
        updateEstimator();
      });
    }

    // Package selection
    pkgBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        estState.pkg = e.currentTarget.getAttribute('data-est-pkg');
        pkgBtns.forEach(b => b.classList.toggle('active', b === e.currentTarget));
        updateEstimator();
      });
    });

    // Addons
    if (addonsList) {
      addonsList.innerHTML = '';
      CONTENT.estimator.addOns.forEach(addon => {
        const item = document.createElement('label');
        item.className = 'addon-chip';
        item.innerHTML = `
          <div class="addon-chip-left">
            <input type="checkbox" class="addon-checkbox" value="${addon.id}">
            <span>${currentLang === 'ta' ? addon.labelTa : addon.labelEn}</span>
          </div>
          <span class="addon-price">+₹${(addon.cost / 100000).toFixed(2)} L</span>
        `;
        const chk = item.querySelector('input');
        chk.addEventListener('change', () => {
          if (chk.checked) estState.addons.push(addon.id);
          else estState.addons = estState.addons.filter(id => id !== addon.id);
          item.classList.toggle('active', chk.checked);
          updateEstimator();
        });
        addonsList.appendChild(item);
      });
    }

    updateEstimator();
  }

  function updateEstimator() {
    const t = CONTENT.ui[currentLang] || CONTENT.ui.en;
    const amountEl = document.getElementById('estResultAmount');
    const noteEl = document.getElementById('estResultNote');
    const whatsappBtn = document.getElementById('estWhatsAppBtn');
    const pkgGroup = document.getElementById('estPkgGroup');

    if (!amountEl || !whatsappBtn) return;

    // Check scope rate rules
    const currentScope = CONTENT.estimator.scopes.find(s => s.id === estState.scope);
    if (!currentScope.hasRates) {
      // Commercial or Interiors has NO rates yet (TODO_OWNER)
      amountEl.textContent = "—";
      amountEl.style.fontSize = "1.5rem";
      noteEl.textContent = t.estEmptyRateNotice;
      if (pkgGroup) pkgGroup.style.opacity = '0.4';

      const scopeName = currentLang === 'ta' ? currentScope.nameTa : currentScope.nameEn;
      const msg = `Hello MAK BUILD, I would like an estimate for ${scopeName} with approximately ${estState.area} sq.ft built-up area.`;
      whatsappBtn.href = `https://wa.me/918144166022?text=${encodeURIComponent(msg)}`;
      whatsappBtn.textContent = t.estWhatsAppBtn;
      return;
    }

    if (pkgGroup) pkgGroup.style.opacity = '1';
    amountEl.style.fontSize = "";

    // Determine square foot rate from package
    let rate = 2300;
    let pkgLabel = "Moderate (Standard)";
    if (estState.pkg === 'basic') {
      rate = 2200;
      pkgLabel = "Basic";
    } else if (estState.pkg === 'moderate-standard') {
      rate = 2300;
      pkgLabel = "Moderate (Standard)";
    } else if (estState.pkg === 'moderate-plus') {
      rate = 2400;
      pkgLabel = "Moderate (Plus)";
    } else if (estState.pkg === 'premium') {
      rate = 2500;
      pkgLabel = "Premium";
    }

    // Addons cost
    let addonsTotal = 0;
    let selectedAddonNames = [];
    estState.addons.forEach(id => {
      const a = CONTENT.estimator.addOns.find(item => item.id === id);
      if (a) {
        addonsTotal += a.cost;
        selectedAddonNames.push(currentLang === 'ta' ? a.labelTa : a.labelEn);
      }
    });

    const baseCost = (estState.area * rate) + addonsTotal;
    const lowCost = Math.round(baseCost * 0.95);
    const highCost = Math.round(baseCost * 1.05);

    function formatLakhs(amt) {
      const l = amt / 100000;
      return `₹${l.toFixed(2)} Lakhs`;
    }

    amountEl.textContent = `${formatLakhs(lowCost)} – ${formatLakhs(highCost)}`;
    noteEl.textContent = t.estIndicativeNote;

    // WhatsApp Message
    const scopeName = currentLang === 'ta' ? currentScope.nameTa : currentScope.nameEn;
    const msg = `Hello MAK BUILD,\nI used your Quick Estimator for:\n- Project: ${scopeName}\n- Area: ${estState.area} sq.ft\n- Package: ${pkgLabel} (₹${rate}/sq.ft)\n- Add-ons: ${selectedAddonNames.join(', ') || 'None'}\n- Indicative Estimate: ${formatLakhs(lowCost)} to ${formatLakhs(highCost)}\n\nPlease schedule a free site visit to verify the estimate.`;
    whatsappBtn.href = `https://wa.me/918144166022?text=${encodeURIComponent(msg)}`;
    whatsappBtn.textContent = t.estWhatsAppBtn;
  }

  // ==========================================
  // 9. Process Section
  // ==========================================
  function renderProcess() {
    const grid = document.getElementById('processStepsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    CONTENT.processSteps.forEach(step => {
      const card = document.createElement('div');
      card.className = 'process-step-card';
      card.innerHTML = `
        <div class="step-num">${step.no}</div>
        <h3 class="step-title">${currentLang === 'ta' ? step.titleTa : step.titleEn}</h3>
        <p class="step-desc">${currentLang === 'ta' ? step.descTa : step.descEn}</p>
      `;
      grid.appendChild(card);
    });
  }

  // ==========================================
  // 10. About & Contact Information
  // ==========================================
  function renderAboutAndContact() {
    const t = CONTENT.ui[currentLang] || CONTENT.ui.en;

    const aboutIntro1 = document.getElementById('aboutIntro1');
    const aboutIntro2 = document.getElementById('aboutIntro2');
    const aboutTitle = document.getElementById('aboutEngineerTitle');
    if (aboutIntro1) aboutIntro1.textContent = t.aboutIntro1;
    if (aboutIntro2) aboutIntro2.textContent = t.aboutIntro2;
    if (aboutTitle) {
      aboutTitle.textContent = currentLang === 'ta' ? CONTENT.company.engineerRoleTa : CONTENT.company.engineerRole;
    }

    // Studio Address
    const contactAddress = document.getElementById('contactAddress');
    if (contactAddress) {
      contactAddress.textContent = currentLang === 'ta' ? CONTENT.company.address.fullTa : CONTENT.company.address.full;
    }
  }

  function initContactForm() {
    const form = document.getElementById('enquiryForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Check honeypot
      const hp = form.querySelector('.form-hp');
      if (hp && hp.value) return;

      const name = form.querySelector('[name="name"]').value.trim();
      const phone = form.querySelector('[name="phone"]').value.trim();
      const location = form.querySelector('[name="location"]').value.trim();
      const projectType = form.querySelector('[name="projectType"]').value;
      const message = form.querySelector('[name="message"]').value.trim();

      if (!name || !phone) {
        alert('Please provide your name and phone number.');
        return;
      }

      const submitBtn = form.querySelector('.form-submit-btn');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      const accessKey = CONTENT.company.web3FormsKey;
      let sentSuccessfully = false;

      if (accessKey && accessKey !== 'TODO_OWNER') {
        try {
          const res = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ access_key: accessKey, name, phone, location, projectType, message })
          });
          const json = await res.json();
          if (json.success) sentSuccessfully = true;
        } catch (err) {
          console.warn('Direct form submission error, falling back to WhatsApp');
        }
      }

      if (sentSuccessfully) {
        alert('Thank you! Your enquiry has been sent. We will contact you shortly.');
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      } else {
        // WhatsApp fallback
        const waMsg = `Hello MAK BUILD,\nNew Website Enquiry:\n- Name: ${name}\n- Phone: ${phone}\n- Location: ${location || 'Not specified'}\n- Project Type: ${projectType}\n- Message: ${message || 'No additional message'}`;
        window.open(`https://wa.me/918144166022?text=${encodeURIComponent(waMsg)}`, '_blank');
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // ==========================================
  // 11. Modals & Lightbox Engine
  // ==========================================
  let lastActiveElement = null;

  function openModal(modal) {
    if (!modal) return;
    lastActiveElement = document.activeElement;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable.length) focusable[0].focus();
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
    if (lastActiveElement) lastActiveElement.focus();
  }

  function initModals() {
    [compareModal, serviceModal, lightboxModal].forEach(modal => {
      if (!modal) return;
      modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.closest('.modal-close-btn') || e.target.closest('.lightbox-close')) {
          closeModal(modal);
        }
      });
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal(compareModal);
        closeModal(serviceModal);
        closeModal(lightboxModal);
      }
    });
  }

  function openLightbox(src, alt) {
    if (!lightboxModal) return;
    const img = document.getElementById('lightboxImg');
    if (img) {
      img.src = src;
      img.alt = alt || 'MAK BUILD Project Showcase';
    }
    openModal(lightboxModal);
  }

  // ==========================================
  // 12. Single Shared IntersectionObserver
  // ==========================================
  function initScrollReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal-init').forEach(el => el.classList.add('reveal-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    });

    document.querySelectorAll('.reveal-init').forEach(el => observer.observe(el));
  }

  // ==========================================
  // 13. Application Initialization
  // ==========================================
  document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initHeroSlider();
    initModals();
    setLanguage(currentLang);
    loadProjects();
    initEstimator();
    initContactForm();
    initScrollReveal();
  });

})();
