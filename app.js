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
  let currentTheme = localStorage.getItem('mak_theme') || 'light';
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
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileDrawerBackdrop = document.getElementById('mobileDrawerBackdrop');
  const floatingMobileBar = document.querySelector('.floating-mobile-bar');
  const compareModal = document.getElementById('compareModal');
  const serviceModal = document.getElementById('serviceModal');
  const lightboxModal = document.getElementById('lightboxModal');

  // ==========================================
  // 0. Theme Manager (Light & Dark Mode)
  // ==========================================
  function initTheme() {
    applyTheme(currentTheme);

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(nextTheme);
      });
    }
  }

  function applyTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('mak_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);

    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'Dark' : 'Light'} theme`);
      themeToggleBtn.setAttribute('title', `Switch to ${theme === 'light' ? 'Dark' : 'Light'} theme`);
    }

    // Inform WebGL shader and observers
    window.dispatchEvent(new CustomEvent('mak-theme-change', { detail: { theme } }));
  }

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
    renderStats();
    renderServices();
    renderPackages();
    renderProjects();
    updateEstimator();
    renderProcess();
    renderFaqs();
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
    { base: 'villa-contemporary-after', src: 'assets/img/villa-contemporary-after-1024.webp', widths: [480, 768, 1024], is3d: false },
    { base: 'residence-elevation', src: 'assets/img/residence-elevation-1024.webp', widths: [480, 768, 1024], is3d: true },
    { base: 'showroom-interior', src: 'assets/img/showroom-interior-1024.webp', widths: [480, 768, 1024], is3d: true },
    { base: 'living-interior', src: 'assets/img/living-interior-1024.webp', widths: [480, 768, 1024], is3d: true }
  ];

  function initHeroSlider() {
    const sliderWrap = document.getElementById('heroSliderWrap');
    const dotsWrap = document.getElementById('heroDotsWrap');
    const chip = document.getElementById('heroSlideChip');
    if (!sliderWrap || !dotsWrap) return;

    sliderWrap.innerHTML = '';
    dotsWrap.innerHTML = '';

    heroSlidesData.forEach((slide, idx) => {
      // Create slide element with responsive picture set
      const div = document.createElement('div');
      div.className = `hero-slide ${idx === 0 ? 'active' : ''}`;
      div.setAttribute('data-slide', slide.base);
      const avifSrcset = slide.widths.map(w => `assets/img/${slide.base}-${w}.avif ${w}w`).join(', ');
      const webpSrcset = slide.widths.map(w => `assets/img/${slide.base}-${w}.webp ${w}w`).join(', ');
      div.innerHTML = `
        <picture>
          <source type="image/avif" srcset="${avifSrcset}" sizes="100vw">
          <source type="image/webp" srcset="${webpSrcset}" sizes="100vw">
          <img class="hero-slide-img" 
               src="${slide.src}" 
               alt="MAK BUILD Architectural Showcase ${idx + 1}"
               ${idx === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}
               decoding="async"
               width="1280" height="720">
        </picture>
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
    const infoDesigner = document.getElementById('heroInfoDesigner');
    const infoScope = document.getElementById('heroInfoScope');
    const infoStudio = document.getElementById('heroInfoStudio');

    if (h1) h1.textContent = t.heroH1;
    if (sub) sub.textContent = t.heroSub;
    if (tagline) tagline.textContent = CONTENT.company.taglineTa;

    if (infoEngineer) {
      infoEngineer.innerHTML = `<strong>${t.heroInfoEngineer}</strong>`;
    }
    if (infoDesigner && t.heroInfoDesigner) {
      infoDesigner.innerHTML = `<strong>${t.heroInfoDesigner}</strong>`;
    }
    if (infoScope) infoScope.textContent = t.heroInfoScope;
    if (infoStudio) infoStudio.textContent = t.heroInfoStudio;

    updateSlideChip();
  }

  // ==========================================
  // 3b. Stats Strip & Number Counter Animation
  // ==========================================
  let statsAnimated = false;

  function renderStats() {
    const grid = document.getElementById('statsGrid');
    if (!grid || !CONTENT.stats) return;
    grid.innerHTML = '';

    CONTENT.stats.forEach(stat => {
      const item = document.createElement('div');
      item.className = 'stat-item';
      const label = currentLang === 'ta' ? stat.labelTa : stat.labelEn;
      item.innerHTML = `
        <div class="stat-number" data-target="${stat.value}" data-suffix="${stat.suffix}">
          ${statsAnimated ? stat.value + stat.suffix : '0' + stat.suffix}
        </div>
        <div class="stat-label">${label}</div>
      `;
      grid.appendChild(item);
    });
  }

  function initStatsObserver() {
    const statsSection = document.getElementById('statsStrip');
    if (!statsSection) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      statsAnimated = true;
      document.querySelectorAll('.stat-number').forEach(el => {
        const target = el.getAttribute('data-target') || '0';
        const suffix = el.getAttribute('data-suffix') || '';
        el.textContent = `${target}${suffix}`;
      });
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          animateStats();
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(statsSection);
  }

  function animateStats() {
    const numbers = document.querySelectorAll('.stat-number');
    const duration = 1600;
    const startTime = performance.now();

    function updateCount(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease-out cubic

      numbers.forEach(el => {
        const target = parseInt(el.getAttribute('data-target'), 10) || 0;
        const suffix = el.getAttribute('data-suffix') || '';
        const current = Math.floor(easeProgress * target);
        el.textContent = `${current}${suffix}`;
      });

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        numbers.forEach(el => {
          const target = el.getAttribute('data-target');
          const suffix = el.getAttribute('data-suffix') || '';
          el.textContent = `${target}${suffix}`;
        });
      }
    }

    requestAnimationFrame(updateCount);
  }

  // ==========================================
  // 4. Services Section & Unique Line Icons
  // ==========================================
  const serviceIcons = {
    'construction': `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 10h6M9 14h6M9 18h6M12 3v4"/></svg>`,
    'plans-elevations': `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 2a3 3 0 100 6 3 3 0 000-6zm0 6v3m0 0l-5 11m5-11l5 11M9 17h6M4 22h16"/></svg>`,
    'building-approvals': `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>`,
    'interiors': `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M4 11a2 2 0 012-2h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6zm0 4h16M7 19v2M17 19v2M6 9V6a1 1 0 011-1h10a1 1 0 011 1v3"/></svg>`,
    'renovations': `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>`,
    'estimation-consulting': `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>`
  };

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
      const iconSvg = serviceIcons[svc.id] || `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>`;

      card.innerHTML = `
        <div class="service-icon-box">
          ${iconSvg}
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
    const iconSvg = serviceIcons[svc.id] || '';

    if (titleEl) titleEl.textContent = title;
    if (bodyEl) {
      bodyEl.innerHTML = `
        <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 18px;">
          <div class="service-icon-box" style="margin-bottom: 0; width: 44px; height: 44px;">${iconSvg}</div>
          <div style="font-size: 0.95rem; font-weight: 600; color: var(--gold-light);">${title}</div>
        </div>
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
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
          <span>${t.getQuoteBtn.replace('{tier}', 'Basic')}</span>
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
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
          <span>${t.getQuoteBtn.replace('{tier}', `Moderate ${activeMod.label}`)}</span>
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
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
          <span>${t.getQuoteBtn.replace('{tier}', 'Premium')}</span>
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
  // 7. Projects & Showcase Section (Embedded Fallback + High-DPI Engine)
  // ==========================================
  const IMAGE_WIDTHS = {
    'villa-facade-before': [480, 768, 1080, 1600, 2400],
    'villa-facade-after': [480, 768, 1080, 1600, 2400],
    'commercial-retail-before': [480, 768, 1024],
    'commercial-retail-after': [480, 768, 1024],
    'penthouse-before': [480, 768, 1080, 1376],
    'penthouse-after': [480, 768, 1024],
    'bespoke-living-kitchen': [480, 768, 1080, 1376],
    'villa-contemporary-after': [480, 768, 1024],
    'residence-elevation': [480, 768, 1024],
    'showroom-interior': [480, 768, 1024],
    'living-interior': [480, 768, 1024],
    'office-signboard': [480, 768, 1080, 1600]
  };

  function buildPicture(base, fallbackSrc, alt, sizes, loading = 'lazy', fetchPriority = false, width = 640, height = 400, imgClass = 'project-cover-img') {
    const widths = IMAGE_WIDTHS[base];
    if (!widths || !widths.length) {
      return `<img class="${imgClass}" src="${fallbackSrc}" alt="${alt}" loading="${loading}" decoding="async" ${fetchPriority ? 'fetchpriority="high"' : ''} width="${width}" height="${height}">`;
    }
    const avifSrcset = widths.map(w => `assets/img/${base}-${w}.avif ${w}w`).join(', ');
    const webpSrcset = widths.map(w => `assets/img/${base}-${w}.webp ${w}w`).join(', ');
    const midWidth = widths[Math.min(1, widths.length - 1)];
    const fallbackJpg = `assets/img/${base}-${midWidth}.jpg`;

    return `
      <picture>
        <source type="image/avif" srcset="${avifSrcset}" sizes="${sizes}">
        <source type="image/webp" srcset="${webpSrcset}" sizes="${sizes}">
        <img class="${imgClass}" 
             src="${fallbackJpg}" 
             alt="${alt}" 
             loading="${loading}" 
             decoding="async" 
             ${fetchPriority ? 'fetchpriority="high"' : ''} 
             width="${width}" 
             height="${height}">
      </picture>
    `;
  }

  const DEFAULT_PROJECTS = [
    {
      id: "residence-3d-elevation",
      title: "Contemporary Two-Storey Residence – 3D Elevation",
      titleTa: "நவீன இரண்டு அடுக்கு இல்லம் – 3D முகப்பு வடிவமைப்பு",
      category: "3D Designs",
      badge: "3D Design",
      location: "",
      area: "",
      year: "",
      base: "residence-elevation",
      cover: "assets/img/residence-elevation-1024.webp",
      coverThumb: "assets/img/residence-elevation-480.webp",
      coverWidth: 1024,
      coverHeight: 1009,
      hasBeforeAfter: false,
      renderImage: "assets/img/residence-elevation-1024.webp",
      builtImage: "",
      description: "Exterior render featuring wood-clad pillars, modern louvered panels and glass balcony.",
      descriptionTa: "மர வேலைத்தூண்கள் மற்றும் கண்ணாடி பால்கனியுடன் கூடிய நவீன முகப்பு வடிவமைப்பு.",
      blurNameplate: false,
      blurBrand: false,
      clientPermission: false
    },
    {
      id: "showroom-interior-3d",
      title: "Jewellery Showroom – 3D Interior Design",
      titleTa: "நகை மாளிகை – 3D உள் அலங்கார வடிவமைப்பு",
      category: "3D Designs",
      badge: "3D Design",
      location: "",
      area: "",
      year: "",
      base: "showroom-interior",
      cover: "assets/img/showroom-interior-1024.webp",
      coverThumb: "assets/img/showroom-interior-480.webp",
      coverWidth: 1024,
      coverHeight: 579,
      hasBeforeAfter: false,
      renderImage: "assets/img/showroom-interior-1024.webp",
      builtImage: "",
      description: "Luxury gold and silver displays with cove lighting in rich walnut and cream.",
      descriptionTa: "தங்கம் மற்றும் வெள்ளி காட்சி அரங்கிற்கான ஆடம்பர உட்புற வடிவமைப்பு.",
      blurBrand: false,
      blurNameplate: false,
      clientPermission: false
    },
    {
      id: "living-dining-3d",
      title: "Living & Dining – 3D Interior Design",
      titleTa: "வரவேற்பறை & உணவருந்தும் அறை – 3D வடிவமைப்பு",
      category: "3D Designs",
      badge: "3D Design",
      location: "",
      area: "",
      year: "",
      base: "living-interior",
      cover: "assets/img/living-interior-1024.webp",
      coverThumb: "assets/img/living-interior-480.webp",
      coverWidth: 1024,
      coverHeight: 599,
      hasBeforeAfter: false,
      renderImage: "assets/img/living-interior-1024.webp",
      builtImage: "",
      description: "Contemporary living layout with cream sectional, arched wall niches and cove lighting.",
      descriptionTa: "வளைவு சுவர் வடிவமைப்புகள் மற்றும் எல்இடி விளக்குகளுடன் கூடிய வரவேற்பறை.",
      blurBrand: false,
      blurNameplate: false,
      clientPermission: false
    },
    {
      id: "contemporary-villa",
      title: "Contemporary Villa Architecture",
      titleTa: "நவீன ஆடம்பர வில்லா கட்டுமானம்",
      category: "Villas",
      badge: "Completed",
      location: "Sirkazhi Main Town",
      area: "3,800 sq.ft",
      year: "2025",
      base: "villa-contemporary-after",
      cover: "assets/img/villa-contemporary-after-1024.webp",
      coverThumb: "assets/img/villa-contemporary-after-480.webp",
      coverWidth: 1024,
      coverHeight: 840,
      hasBeforeAfter: true,
      beforeBase: "villa-facade-before",
      afterBase: "villa-facade-after",
      beforeImg: "assets/img/villa-facade-before-1600.webp",
      afterImg: "assets/img/villa-facade-after-1600.webp",
      beforeLabel: "BRICKWORK & RCC FRAME",
      afterLabel: "CONTEMPORARY FACADE",
      description: "Turnkey construction with high-grade RCC framework and contemporary architectural detailing.",
      descriptionTa: "உயர்தர ஆர்சிசி கட்டமைப்பு மற்றும் சமகால முகப்புடன் கூடிய முழுமையான வில்லா.",
      blurBrand: false,
      blurNameplate: false,
      clientPermission: true
    },
    {
      id: "commercial-retail-showroom",
      title: "Commercial Retail Showroom",
      titleTa: "வணிக சில்லறை விற்பனை அரங்கம்",
      category: "Commercial & PEB",
      badge: "Completed",
      location: "Sirkazhi",
      area: "2,200 sq.ft",
      year: "2025",
      base: "commercial-retail-after",
      cover: "assets/img/commercial-retail-after-1024.webp",
      coverThumb: "assets/img/commercial-retail-after-480.webp",
      coverWidth: 1024,
      coverHeight: 579,
      hasBeforeAfter: true,
      beforeBase: "commercial-retail-before",
      afterBase: "commercial-retail-after",
      beforeImg: "assets/img/commercial-retail-before-1024.webp",
      afterImg: "assets/img/commercial-retail-after-1024.webp",
      beforeLabel: "UNFINISHED RAW INTERIOR",
      afterLabel: "COMPLETED JEWELLERY SHOWROOM",
      description: "Complete retail transformation from unfinished structural shell to luxury retail showroom.",
      descriptionTa: "வெறும் கான்கிரீட் சுவர்களில் இருந்து முழுமையான சொகுசு நகைக்கடையாக மாற்றியமைத்தல்.",
      blurBrand: false,
      blurNameplate: false,
      clientPermission: true
    },
    {
      id: "luxury-penthouse",
      title: "Luxury Penthouse Living & Suites",
      titleTa: "சொகுசு பென்ட்ஹவுஸ் உட்புற வடிவமைப்பு",
      category: "Interiors",
      badge: "Completed",
      location: "Chidambaram Highway, Sirkazhi",
      area: "2,400 sq.ft",
      year: "2025",
      base: "penthouse-after",
      cover: "assets/img/penthouse-after-1024.webp",
      coverThumb: "assets/img/penthouse-after-480.webp",
      coverWidth: 1024,
      coverHeight: 576,
      hasBeforeAfter: true,
      beforeBase: "penthouse-before",
      afterBase: "penthouse-after",
      beforeImg: "assets/img/penthouse-before-1080.webp",
      afterImg: "assets/img/penthouse-after-1024.webp",
      beforeLabel: "RAW RCC SHELL",
      afterLabel: "FINISHED PENTHOUSE",
      description: "Architectural interior fitout with bookmatched marble, cove ceilings and custom wood accents.",
      descriptionTa: "மார்பிள் தரை, எல்இடி கோவ் விளக்குகள் மற்றும் தேக்கு மர வேலைப்பாடுகளுடன் கூடிய உட்புறம்.",
      blurBrand: false,
      blurNameplate: false,
      clientPermission: true
    },
    {
      id: "bespoke-living-kitchen",
      title: "Bespoke Living & Modular Kitchen",
      titleTa: "வரவேற்பறை & நவீன மாடுலர் சமையலறை",
      category: "Interiors",
      badge: "Completed",
      location: "Sirkazhi",
      area: "2,600 sq.ft",
      year: "2025",
      base: "bespoke-living-kitchen",
      cover: "assets/img/bespoke-living-kitchen-1080.webp",
      coverThumb: "assets/img/bespoke-living-kitchen-480.webp",
      coverWidth: 1376,
      coverHeight: 768,
      hasBeforeAfter: false,
      description: "Full home interior design featuring fluted wall panels, warm ambient lighting and premium joinery.",
      descriptionTa: "சுவர் அலங்காரம் மற்றும் நவீன மாடுலர் சமையலறையுடன் கூடிய முழுமையான உட்புற வடிவமைப்பு.",
      blurBrand: false,
      blurNameplate: false,
      clientPermission: true
    }
  ];

  async function loadProjects() {
    allProjects = DEFAULT_PROJECTS;
    try {
      const res = await fetch('projects.json');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length) {
          allProjects = data;
        }
      }
    } catch (e) {
      // Flawlessly uses DEFAULT_PROJECTS
    }

    // Check URL Hash for Deep Linking (#work?cat=3d, #work?cat=villas, etc.)
    syncTabFromHash();
    window.addEventListener('hashchange', syncTabFromHash);

    renderProjectsTabs();
    renderProjects();
  }

  function syncTabFromHash() {
    const hash = window.location.hash.toLowerCase();
    if (hash.includes('cat=3d')) {
      currentTab = '3D Designs';
    } else if (hash.includes('cat=villas')) {
      currentTab = 'Villas';
    } else if (hash.includes('cat=commercial')) {
      currentTab = 'Commercial & PEB';
    } else if (hash.includes('cat=interiors')) {
      currentTab = 'Interiors';
    } else if (hash.startsWith('#work') && !hash.includes('cat=')) {
      currentTab = 'all';
    }
  }

  function renderProjectsTabs() {
    const tabsWrap = document.getElementById('projectsTabs');
    if (!tabsWrap) return;
    tabsWrap.innerHTML = '';

    const t = CONTENT.ui[currentLang] || CONTENT.ui.en;
    const categories = [
      { id: '3D Designs', label: t.tabDesigns, hash: '#work?cat=3d' },
      { id: 'Interiors', label: t.tabInteriors, hash: '#work?cat=interiors' },
      { id: 'Villas', label: t.tabVillas, hash: '#work?cat=villas' },
      { id: 'Commercial & PEB', label: t.tabCommercial, hash: '#work?cat=commercial' },
      { id: 'all', label: t.tabAll, hash: '#work' }
    ];

    // Filter out categories that have zero projects (never show an empty tab)
    const available = categories.filter(cat => {
      if (cat.id === 'all') return true;
      return allProjects.some(p => p.category === cat.id && (p.cover || p.renderImage));
    });

    available.forEach(cat => {
      const count = cat.id === 'all' 
        ? allProjects.filter(p => p.cover || p.renderImage).length 
        : allProjects.filter(p => p.category === cat.id && (p.cover || p.renderImage)).length;

      const btn = document.createElement('button');
      btn.className = `project-tab-btn ${currentTab === cat.id ? 'active' : ''}`;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', currentTab === cat.id ? 'true' : 'false');
      btn.innerHTML = `
        <span>${cat.label}</span>
        <span class="tab-count">${count}</span>
      `;
      btn.addEventListener('click', () => {
        currentTab = cat.id;
        if (history.replaceState) {
          history.replaceState(null, '', cat.hash);
        } else {
          location.hash = cat.hash;
        }
        renderProjectsTabs();
        renderProjects();
      });
      tabsWrap.appendChild(btn);
    });
  }

  const baNudgeObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          entry.target.classList.add('ba-nudge-active');
        }
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  function renderProjects() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const t = CONTENT.ui[currentLang] || CONTENT.ui.en;
    const filtered = (currentTab === 'all' 
      ? allProjects 
      : allProjects.filter(p => p.category === currentTab))
      .filter(p => !(p.category === '3D Designs' && !p.cover && !p.renderImage));

    filtered.forEach((proj, idx) => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.setAttribute('data-id', proj.id);

      const title = currentLang === 'ta' && proj.titleTa ? proj.titleTa : proj.title;
      const desc = currentLang === 'ta' && proj.descriptionTa ? proj.descriptionTa : proj.description;
      const is3d = proj.category === '3D Designs' || proj.badge === '3D Design';

      let mediaHtml = '';
      if (proj.hasBeforeAfter && proj.beforeImg && proj.afterImg) {
        // High-DPI 60fps Before/After Draggable Slider
        mediaHtml = `
          <div class="ba-container ba-loading" data-ba-id="${proj.id}" tabindex="0" role="slider" aria-label="Before and after comparison slider for ${title}" aria-valuenow="50" aria-valuemin="4" aria-valuemax="96">
            <div class="ba-layer ba-layer-before">
              ${buildPicture(proj.beforeBase || proj.base, proj.beforeImg, proj.beforeLabel || 'Before', '(min-width:1024px) 50vw, 100vw', 'lazy', false, 1280, 720, 'ba-img')}
              <div class="ba-badge before-badge">
                <span class="ba-chip-tag">BEFORE</span>
                ${proj.beforeLabel ? `<span class="ba-chip-caption">${proj.beforeLabel}</span>` : ''}
              </div>
            </div>
            <div class="ba-layer ba-layer-after" style="clip-path: inset(0 0 0 50%); -webkit-clip-path: inset(0 0 0 50%);">
              ${buildPicture(proj.afterBase || proj.base, proj.afterImg, proj.afterLabel || 'After', '(min-width:1024px) 50vw, 100vw', 'lazy', false, 1280, 720, 'ba-img')}
              <div class="ba-badge after-badge">
                <span class="ba-chip-tag">AFTER</span>
                ${proj.afterLabel ? `<span class="ba-chip-caption">${proj.afterLabel}</span>` : ''}
              </div>
            </div>
            <div class="ba-divider" style="transform: translate3d(50%, 0, 0);">
              <div class="ba-line"></div>
              <div class="ba-handle" aria-hidden="true">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 9l-4 3 4 3m8-6l4 3-4 3"/>
                </svg>
              </div>
            </div>
          </div>
        `;
      } else {
        // Single Cover Image with Lightbox
        const isBlurBrand = proj.blurBrand && !proj.clientPermission;
        const blurClass = isBlurBrand ? 'blur-brand' : '';
        mediaHtml = `
          <div class="project-media-wrap" role="button" tabindex="0" aria-label="Open preview for ${title}">
            ${buildPicture(proj.base, proj.coverThumb || proj.cover, title, '(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw', 'lazy', false, proj.coverWidth || 640, proj.coverHeight || 400, `project-cover-img ${blurClass}`)}
          </div>
        `;
      }

      let badgeHtml = '';
      if (is3d) {
        badgeHtml = `<span class="project-badge gold-glass">3D DESIGN</span>`;
      } else if (proj.badge) {
        badgeHtml = `<span class="project-badge">${proj.badge}</span>`;
      }

      let actionsHtml = '';
      if (is3d) {
        actionsHtml = `
          <div class="project-actions-row">
            <button class="service-btn view-proj-btn" aria-label="View 3D render for ${title}">
              <span>View Render</span>
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </button>
            <a href="https://wa.me/918144166022?text=${encodeURIComponent(`Hi MAK BUILD, I like the '${title}' design. Please share details.`)}" 
               target="_blank" rel="noopener noreferrer" class="btn-request-design" aria-label="Request this design on WhatsApp">
              <span>Request this design</span>
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        `;
      } else {
        actionsHtml = `
          <div class="project-actions-row">
            <button class="service-btn view-proj-btn" aria-label="View project details for ${title}">
              <span>${t.viewProject}</span>
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </button>
            <a href="https://wa.me/918144166022?text=${encodeURIComponent(`Hello MAK BUILD, I would like more information on the project: ${title}`)}" 
               target="_blank" rel="noopener noreferrer" class="proj-whatsapp-link" aria-label="Chat on WhatsApp about ${title}">
              <span>WhatsApp</span>
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        `;
      }

      card.innerHTML = `
        ${mediaHtml}
        <div class="project-details">
          <div class="project-meta-row">
            ${badgeHtml}
            ${proj.location ? `<span class="project-location">${proj.location}</span>` : ''}
            ${proj.area ? `<span class="project-location">• ${proj.area}</span>` : ''}
          </div>
          <h3 class="project-title">${title}</h3>
          <p class="project-desc">${desc}</p>
          ${actionsHtml}
        </div>
      `;

      // Lightbox listeners
      const mediaWrap = card.querySelector('.project-media-wrap');
      if (mediaWrap) {
        mediaWrap.addEventListener('click', () => openLightbox(proj, filtered));
        mediaWrap.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openLightbox(proj, filtered);
          }
        });
      }

      const viewBtn = card.querySelector('.view-proj-btn');
      if (viewBtn) {
        viewBtn.addEventListener('click', () => openLightbox(proj, filtered));
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
    const afterLayer = container.querySelector('.ba-layer-after');
    const divider = container.querySelector('.ba-divider');
    if (!afterLayer || !divider) return;

    let isDragging = false;
    let currentPercent = 50;
    let rafId = null;

    // Observe for intro nudge
    baNudgeObserver.observe(container);

    // Shimmer skeleton removal once both images decode/load
    const imgs = container.querySelectorAll('img');
    if (imgs.length >= 2) {
      Promise.all(Array.from(imgs).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.addEventListener('load', resolve, { once: true });
          img.addEventListener('error', resolve, { once: true });
        });
      })).then(() => {
        container.classList.remove('ba-loading');
      });
      // Safety timeout so shimmer never gets stuck
      setTimeout(() => container.classList.remove('ba-loading'), 1500);
    } else {
      container.classList.remove('ba-loading');
    }

    function setPosition(xPercent) {
      // Clamped strictly between 4% and 96%
      const clamped = Math.max(4, Math.min(96, xPercent));
      currentPercent = clamped;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        afterLayer.style.clipPath = `inset(0 0 0 ${clamped}%)`;
        afterLayer.style.webkitClipPath = `inset(0 0 0 ${clamped}%)`;
        divider.style.transform = `translate3d(${clamped}%, 0, 0)`;
        container.setAttribute('aria-valuenow', Math.round(clamped));
      });
    }

    function getPercentFromPointer(e) {
      const rect = container.getBoundingClientRect();
      if (!rect.width) return 50;
      return ((e.clientX - rect.left) / rect.width) * 100;
    }

    function onPointerDown(e) {
      container.classList.remove('ba-nudge-active');
      isDragging = true;
      try {
        container.setPointerCapture(e.pointerId);
      } catch (_) {}
      setPosition(getPercentFromPointer(e));
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      setPosition(getPercentFromPointer(e));
    }

    function onPointerUp(e) {
      if (!isDragging) return;
      isDragging = false;
      try {
        if (container.hasPointerCapture(e.pointerId)) {
          container.releasePointerCapture(e.pointerId);
        }
      } catch (_) {}
    }

    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointercancel', onPointerUp);

    // Keyboard accessibility: 2% steps, Home/End jump
    container.addEventListener('keydown', (e) => {
      container.classList.remove('ba-nudge-active');
      if (e.key === 'ArrowLeft') {
        setPosition(currentPercent - 2);
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        setPosition(currentPercent + 2);
        e.preventDefault();
      } else if (e.key === 'Home') {
        setPosition(4);
        e.preventDefault();
      } else if (e.key === 'End') {
        setPosition(96);
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

    function updateSliderProgress(val) {
      if (!areaRange) return;
      const min = parseInt(areaRange.min, 10) || 300;
      const max = parseInt(areaRange.max, 10) || 10000;
      const pct = Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
      areaRange.style.setProperty('--slider-progress', `${pct}%`);
    }

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
      updateSliderProgress(estState.area);
      areaRange.addEventListener('input', (e) => {
        estState.area = parseInt(e.target.value, 10);
        areaInput.value = estState.area;
        updateSliderProgress(estState.area);
        updateEstimator();
      });
      areaInput.addEventListener('input', (e) => {
        let val = parseInt(e.target.value, 10);
        if (isNaN(val)) val = 300;
        val = Math.max(300, Math.min(50000, val));
        estState.area = val;
        areaRange.value = val;
        updateSliderProgress(estState.area);
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
      whatsappBtn.innerHTML = `<svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg> <span>${t.estWhatsAppBtn}</span>`;
      return;
    }

    if (pkgGroup) pkgGroup.style.opacity = '1';
    amountEl.style.fontSize = "";

    // Determine square foot rate from package
    let rate = 2300;
    let pkgLabel = "Standard";
    if (estState.pkg === 'basic') {
      rate = 2200;
      pkgLabel = "Basic";
    } else if (estState.pkg === 'moderate-standard') {
      rate = 2300;
      pkgLabel = "Standard";
    } else if (estState.pkg === 'moderate-plus') {
      rate = 2400;
      pkgLabel = "Plus";
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

    amountEl.innerHTML = `<span class="est-amount-part">${formatLakhs(lowCost)}</span> <span class="est-amount-sep">–</span> <span class="est-amount-part">${formatLakhs(highCost)}</span>`;
    noteEl.textContent = t.estIndicativeNote;

    // WhatsApp Message
    const scopeName = currentLang === 'ta' ? currentScope.nameTa : currentScope.nameEn;
    const msg = `Hello MAK BUILD,\nI used your Quick Estimator for:\n- Project: ${scopeName}\n- Area: ${estState.area} sq.ft\n- Package: ${pkgLabel} (₹${rate.toLocaleString('en-IN')}/sq.ft)\n- Add-ons: ${selectedAddonNames.join(', ') || 'None'}\n- Indicative Estimate: ${formatLakhs(lowCost)} to ${formatLakhs(highCost)}\n\nPlease schedule a free site visit to verify the estimate.`;
    whatsappBtn.href = `https://wa.me/918144166022?text=${encodeURIComponent(msg)}`;
    whatsappBtn.innerHTML = `<svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg> <span>${t.estWhatsAppBtn}</span>`;
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
  // 9b. FAQ Accordion
  // ==========================================
  function renderFaqs() {
    const faqList = document.getElementById('faqList');
    if (!faqList || !CONTENT.faqs) return;
    faqList.innerHTML = '';

    const faqTitle = document.getElementById('faqTitle');
    const faqSubtitle = document.getElementById('faqSubtitle');
    const t = CONTENT.ui[currentLang] || CONTENT.ui.en;
    if (faqTitle && t.faqHeading) faqTitle.textContent = t.faqHeading;
    if (faqSubtitle && t.faqSub) faqSubtitle.textContent = t.faqSub;

    CONTENT.faqs.forEach((faq, index) => {
      const item = document.createElement('div');
      item.className = 'faq-item';
      const q = currentLang === 'ta' ? faq.qTa : faq.qEn;
      const a = currentLang === 'ta' ? faq.aTa : faq.aEn;

      item.innerHTML = `
        <button class="faq-question-btn" aria-expanded="false" aria-controls="faq-ans-${index}">
          <span>${q}</span>
          <svg class="faq-icon" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>
        <div id="faq-ans-${index}" class="faq-answer-panel">
          <p>${a}</p>
        </div>
      `;

      const btn = item.querySelector('.faq-question-btn');
      btn.addEventListener('click', () => {
        const isExpanded = btn.getAttribute('aria-expanded') === 'true';
        document.querySelectorAll('.faq-item').forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
            const otherBtn = other.querySelector('.faq-question-btn');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        if (isExpanded) {
          btn.setAttribute('aria-expanded', 'false');
          item.classList.remove('active');
        } else {
          btn.setAttribute('aria-expanded', 'true');
          item.classList.add('active');
        }
      });

      faqList.appendChild(item);
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

    // Keyboard navigation & Focus Trapping
    window.addEventListener('keydown', (e) => {
      const activeModal = [compareModal, serviceModal, lightboxModal].find(m => m && m.classList.contains('open'));

      if (e.key === 'Escape') {
        if (activeModal) closeModal(activeModal);
        return;
      }

      if (activeModal === lightboxModal) {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          showNextLightbox();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          showPrevLightbox();
        }
      }

      // Trap Tab focus inside active modal
      if (activeModal && e.key === 'Tab') {
        const focusables = activeModal.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    // Touch swipe for Lightbox
    if (lightboxModal) {
      let touchStartX = 0;
      lightboxModal.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      lightboxModal.addEventListener('touchend', (e) => {
        const diffX = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(diffX) > 40) {
          if (diffX < 0) showNextLightbox();
          else showPrevLightbox();
        }
      }, { passive: true });
    }
  }

  let activeLightboxProjects = [];
  let currentLightboxIndex = -1;

  function renderLightboxContent(proj) {
    if (!proj || !lightboxModal) return;
    const mediaWrap = document.getElementById('lightboxMediaWrap');
    const conceptBadge = document.getElementById('lightboxConceptBadge');
    const titleEl = document.getElementById('lightboxTitle');
    const descEl = document.getElementById('lightboxDesc');
    const whatsappCta = document.getElementById('lightboxWhatsAppCta');

    const title = currentLang === 'ta' && proj.titleTa ? proj.titleTa : proj.title;
    const desc = currentLang === 'ta' && proj.descriptionTa ? proj.descriptionTa : proj.description;
    const is3d = proj.category === '3D Designs' || proj.badge === '3D Design';

    if (titleEl) titleEl.textContent = title;
    if (descEl) descEl.textContent = desc;

    if (conceptBadge) {
      if (is3d) {
        conceptBadge.style.display = 'inline-flex';
        conceptBadge.textContent = 'Concept render, not a completed project';
      } else {
        conceptBadge.style.display = 'none';
      }
    }

    if (whatsappCta) {
      if (is3d) {
        whatsappCta.textContent = 'Request this design';
        whatsappCta.href = `https://wa.me/918144166022?text=${encodeURIComponent(`Hi MAK BUILD, I like the '${title}' design. Please share details.`)}`;
      } else {
        whatsappCta.textContent = 'Enquire on WhatsApp';
        whatsappCta.href = `https://wa.me/918144166022?text=${encodeURIComponent(`Hello MAK BUILD, I would like more information on the project: ${title}`)}`;
      }
    }

    if (mediaWrap) {
      mediaWrap.innerHTML = '';

      if (proj.hasBeforeAfter && proj.beforeImg && proj.afterImg) {
        // Draggable Before/After in Lightbox
        mediaWrap.innerHTML = `
          <div class="ba-container ba-loading" data-ba-id="${proj.id}-lb" tabindex="0" role="slider" aria-label="Before and after comparison slider for ${title}" aria-valuenow="50" aria-valuemin="4" aria-valuemax="96" style="width: 100%; max-width: 1080px; aspect-ratio: 16/10;">
            <div class="ba-layer ba-layer-before">
              ${buildPicture(proj.beforeBase || proj.base, proj.beforeImg, proj.beforeLabel || 'Before', '100vw', 'eager', true, 1600, 900, 'ba-img')}
              <div class="ba-badge before-badge">
                <span class="ba-chip-tag">BEFORE</span>
                ${proj.beforeLabel ? `<span class="ba-chip-caption">${proj.beforeLabel}</span>` : ''}
              </div>
            </div>
            <div class="ba-layer ba-layer-after" style="clip-path: inset(0 0 0 50%); -webkit-clip-path: inset(0 0 0 50%);">
              ${buildPicture(proj.afterBase || proj.base, proj.afterImg, proj.afterLabel || 'After', '100vw', 'eager', true, 1600, 900, 'ba-img')}
              <div class="ba-badge after-badge">
                <span class="ba-chip-tag">AFTER</span>
                ${proj.afterLabel ? `<span class="ba-chip-caption">${proj.afterLabel}</span>` : ''}
              </div>
            </div>
            <div class="ba-divider" style="transform: translate3d(50%, 0, 0);">
              <div class="ba-line"></div>
              <div class="ba-handle" aria-hidden="true">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 9l-4 3 4 3m8-6l4 3-4 3"/>
                </svg>
              </div>
            </div>
          </div>
        `;
        const ba = mediaWrap.querySelector('.ba-container');
        if (ba) initBaSlider(ba);
      } else if (proj.renderImage && proj.builtImage) {
        // Concept 3D Design vs Final Build Comparison
        mediaWrap.innerHTML = `
          <div class="ba-container ba-loading" data-ba-id="${proj.id}-concept-lb" tabindex="0" role="slider" aria-label="3D Concept vs Final Build comparison for ${title}" aria-valuenow="50" aria-valuemin="4" aria-valuemax="96" style="width: 100%; max-width: 1080px; aspect-ratio: 16/10;">
            <div class="ba-layer ba-layer-before">
              <img class="ba-img" src="${proj.renderImage}" alt="3D Design Concept" loading="eager" decoding="async">
              <div class="ba-badge before-badge">
                <span class="ba-chip-tag">3D DESIGN</span>
                <span class="ba-chip-caption">CONCEPT RENDER</span>
              </div>
            </div>
            <div class="ba-layer ba-layer-after" style="clip-path: inset(0 0 0 50%); -webkit-clip-path: inset(0 0 0 50%);">
              <img class="ba-img" src="${proj.builtImage}" alt="Final Built Structure" loading="eager" decoding="async">
              <div class="ba-badge after-badge">
                <span class="ba-chip-tag">FINAL BUILD</span>
                <span class="ba-chip-caption">COMPLETED STRUCTURE</span>
              </div>
            </div>
            <div class="ba-divider" style="transform: translate3d(50%, 0, 0);">
              <div class="ba-line"></div>
              <div class="ba-handle" aria-hidden="true">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 9l-4 3 4 3m8-6l4 3-4 3"/>
                </svg>
              </div>
            </div>
          </div>
        `;
        const ba = mediaWrap.querySelector('.ba-container');
        if (ba) initBaSlider(ba);
      } else {
        // Single HD Image with Max-Width Capping to avoid upscaling blur
        const maxWidthStyle = proj.coverWidth ? `style="max-width: ${proj.coverWidth}px;"` : '';
        mediaWrap.innerHTML = `
          <div class="lightbox-img-box" ${maxWidthStyle}>
            ${buildPicture(proj.base, proj.cover, title, '100vw', 'eager', true, proj.coverWidth || 1280, proj.coverHeight || 720, 'lightbox-img')}
          </div>
        `;
      }
    }
  }

  function openLightbox(proj, projectList) {
    if (!lightboxModal) return;
    activeLightboxProjects = (projectList && projectList.length) 
      ? projectList 
      : allProjects.filter(p => !(p.category === '3D Designs' && !p.cover && !p.renderImage));
    currentLightboxIndex = activeLightboxProjects.findIndex(p => p.id === proj.id);
    if (currentLightboxIndex === -1) currentLightboxIndex = 0;

    renderLightboxContent(activeLightboxProjects[currentLightboxIndex]);
    openModal(lightboxModal);
  }

  function showNextLightbox() {
    if (!activeLightboxProjects.length) return;
    currentLightboxIndex = (currentLightboxIndex + 1) % activeLightboxProjects.length;
    renderLightboxContent(activeLightboxProjects[currentLightboxIndex]);
  }

  function showPrevLightbox() {
    if (!activeLightboxProjects.length) return;
    currentLightboxIndex = (currentLightboxIndex - 1 + activeLightboxProjects.length) % activeLightboxProjects.length;
    renderLightboxContent(activeLightboxProjects[currentLightboxIndex]);
  }

  // ==========================================
  // 12. ScrollSpy, Clean URLs & Back to Top
  // ==========================================
  function initScrollSpyAndBackToTop() {
    const backToTopBtn = document.getElementById('backToTopBtn');
    const sectionIds = ['hero', 'services', 'packages', 'work', 'estimator', 'about', 'faq', 'contact'];
    const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
    const navLinks = document.querySelectorAll('.nav-menu .nav-link, .mobile-nav-drawer .mobile-nav-link');

    function updateActiveNav(activeId) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${activeId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }

    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          updateActiveNav(id);
          const currentHash = window.location.hash;
          // If viewing #work and currently filtered by cat, do not overwrite category
          if (id === 'work' && currentHash.startsWith('#work?cat=')) {
            return;
          }
          if (history.replaceState && currentHash !== `#${id}`) {
            history.replaceState(null, '', `#${id}`);
          }
        }
      });
    }, {
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    });

    sections.forEach(sec => spyObserver.observe(sec));

    // Back to top scroll listener
    window.addEventListener('scroll', () => {
      if (backToTopBtn) {
        if (window.scrollY > 400) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      }
    }, { passive: true });

    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  // ==========================================
  // 13. Single Shared IntersectionObserver with Stagger
  // ==========================================
  function initScrollReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal-init').forEach(el => el.classList.add('reveal-visible'));
      return;
    }

    // Auto-stagger card grids
    document.querySelectorAll('.services-grid, .packages-grid, .projects-grid, .process-steps-grid, .stats-grid').forEach(grid => {
      Array.from(grid.children).forEach((child, i) => {
        if (!child.style.transitionDelay) {
          child.style.transitionDelay = `${(i % 4) * 0.08}s`;
        }
      });
    });

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
  // 14. Application Initialization
  // ==========================================
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initHeader();
    initHeroSlider();
    initModals();
    setLanguage(currentLang);
    loadProjects();
    initEstimator();
    initStatsObserver();
    initScrollSpyAndBackToTop();
    initContactForm();
    initScrollReveal();
  });

})();
