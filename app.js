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
  const HERO_INTERVAL = 5000;
  let isHeroPaused = false;

  // DOM Elements
  const header = document.querySelector('.header');
  const langToggleBtn = document.getElementById('langToggleBtn');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileDrawerBackdrop = document.getElementById('mobileDrawerBackdrop');
  const floatingMobileBar = document.querySelector('.floating-mobile-bar');
  const serviceModal = document.getElementById('serviceModal');
  const lightboxModal = document.getElementById('lightboxModal');

  // ==========================================
  // 0. Theme Manager & Adaptive Performance Mode
  // ==========================================
  function isLitePerfMode() {
    const override = document.documentElement.getAttribute('data-perf-override');
    if (override === 'lite') return true;
    if (override === 'full') return false;
    const hc = navigator.hardwareConcurrency;
    const dm = navigator.deviceMemory;
    const saveData = Boolean(navigator.connection && navigator.connection.saveData);
    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return (typeof hc === 'number' && hc > 0 && hc <= 4) ||
           (typeof dm === 'number' && dm > 0 && dm <= 4) ||
           saveData ||
           reducedMotion;
  }

  function syncAdaptiveQuality() {
    const lite = isLitePerfMode();
    document.documentElement.setAttribute('data-perf-mode', lite ? 'lite' : 'full');
    return lite;
  }

  function initAdaptiveQuality() {
    syncAdaptiveQuality();

    if (window.matchMedia) {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mq.addEventListener) {
        mq.addEventListener('change', syncAdaptiveQuality);
      }
    }

    const syncTabVisibility = () => {
      if (document.hidden) {
        document.documentElement.setAttribute('data-tab-hidden', 'true');
      } else {
        document.documentElement.removeAttribute('data-tab-hidden');
      }
    };
    document.addEventListener('visibilitychange', syncTabVisibility);
    syncTabVisibility();
  }

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
    if (document.documentElement.getAttribute('data-theme') !== theme) {
      document.documentElement.setAttribute('data-theme', theme);
    }

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
  let belowFoldRendered = false;

  function ensureBelowFoldRendered() {
    if (belowFoldRendered) return;
    belowFoldRendered = true;
    renderServices();
    renderPackages();
    loadProjects();
    initEstimator();
    renderProcess();
    renderFaqs();
    renderAboutAndContact();
    initContactForm();
    initScrollReveal();
  }

  function setLanguage(lang, isInitial = false) {
    currentLang = lang;
    localStorage.setItem('mak_lang', lang);
    if (document.documentElement.lang !== lang) {
      document.documentElement.lang = lang;
    }

    // Update text content with data-i18n only when text differs
    const strings = CONTENT.ui[lang] || CONTENT.ui.en;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (strings[key] && el.textContent !== strings[key]) {
        el.textContent = strings[key];
      }
    });

    // Update Hero Feature Checklist (trustStrip) items
    if (Array.isArray(strings.trustStrip)) {
      document.querySelectorAll('[data-trust-idx]').forEach(el => {
        const idx = parseInt(el.getAttribute('data-trust-idx'), 10);
        if (strings.trustStrip[idx] && el.textContent !== strings.trustStrip[idx]) {
          el.textContent = strings.trustStrip[idx];
        }
      });
    }

    // Update language toggle button label
    if (langToggleBtn) {
      if (langToggleBtn.textContent !== strings.langBtn) {
        langToggleBtn.textContent = strings.langBtn;
      }
      langToggleBtn.setAttribute('aria-label', `Switch to ${lang === 'en' ? 'Tamil' : 'English'}`);
    }

    // Render above-the-fold sections immediately
    renderHeroCaptions();
    renderStats();

    if (!isInitial) {
      if (!belowFoldRendered) {
        ensureBelowFoldRendered();
      } else {
        renderServices();
        renderPackages();
        if (allProjects.length > 0) {
          renderProjectsTabs();
          renderProjects();
          if (activeProjectSlug) {
            const activeProj = allProjects.find(p => p.slug === activeProjectSlug);
            if (activeProj) renderProjectDetail(activeProj, true);
          }
        }
        updateEstimator();
        renderProcess();
        renderFaqs();
        renderAboutAndContact();
      }
      syncServiceModalLanguage();
    }
  }

  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      setLanguage(currentLang === 'en' ? 'ta' : 'en');
    });
  }

  // ==========================================
  // 2. Header Scroll (Transparent at Top -> Matte Solid on Scroll) & Sheen
  // ==========================================
  function initHeader() {
    if (!header) return;

    const SCROLL_THRESHOLD = 40;
    const sentinel = document.getElementById('headerScrollSentinel');

    const applyHeaderScrolled = (isScrolled) => {
      header.classList.toggle('header--scrolled', isScrolled);
      header.classList.toggle('scrolled', isScrolled);
    };

    const syncHeaderFromScrollY = () => {
      applyHeaderScrolled(window.scrollY >= SCROLL_THRESHOLD);
    };

    // Set initial state immediately (handles refresh mid-page, restored scroll, or #hash links)
    syncHeaderFromScrollY();

    // Primary trigger: IntersectionObserver on the 40px top sentinel element
    if (sentinel && 'IntersectionObserver' in window) {
      const sentinelObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          applyHeaderScrolled(!entry.isIntersecting);
        });
      }, {
        root: null,
        threshold: 0
      });
      sentinelObserver.observe(sentinel);
    }

    // Passive rAF-throttled scroll & navigation sync (zero layout reads)
    let headerScrollTicking = false;
    window.addEventListener('scroll', () => {
      if (!headerScrollTicking) {
        headerScrollTicking = true;
        requestAnimationFrame(() => {
          syncHeaderFromScrollY();
          headerScrollTicking = false;
        });
      }
    }, { passive: true });

    window.addEventListener('load', syncHeaderFromScrollY, { once: true });
    window.addEventListener('pageshow', syncHeaderFromScrollY);
    window.addEventListener('hashchange', () => {
      requestAnimationFrame(syncHeaderFromScrollY);
    });

    // Logo sheen trigger (desktop only to avoid mobile post-load style invalidation)
    const logoWrap = document.querySelector('.brand-logo-wrap');
    if (logoWrap && window.innerWidth > 768) {
      setTimeout(() => {
        logoWrap.parentElement.classList.add('sheen-active');
        setTimeout(() => logoWrap.parentElement.classList.remove('sheen-active'), 1500);
      }, 500);
    }

    // Mobile nav drawer (solid header & drawer when open; returns to transparent at top when closed)
    if (mobileNavToggle && mobileNavDrawer && mobileDrawerBackdrop) {
      const toggleDrawer = (open) => {
        const isOpen = typeof open === 'boolean' ? open : !mobileNavDrawer.classList.contains('open');
        mobileNavDrawer.classList.toggle('open', isOpen);
        mobileDrawerBackdrop.classList.toggle('open', isOpen);
        header.classList.toggle('header--menu-open', isOpen);
        mobileNavToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        document.body.style.overflow = isOpen ? 'hidden' : '';
        if (!isOpen) {
          syncHeaderFromScrollY();
        }
      };

      mobileNavToggle.setAttribute('aria-expanded', 'false');
      mobileNavToggle.addEventListener('click', () => toggleDrawer());
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
  // ==========================================
  // 3. Hero Background Slider
  // ==========================================
  let isHeroOffscreen = false;
  let heroResumeTimer = null;
  let heroTransitionEndTimeout = null;

  const heroSlidesData = [
    { 
      base: 'hero-bg', 
      src: 'assets/img/hero-bg-1920.webp', 
      widths: [640, 828, 1024, 1080, 1440, 1600, 1920], 
      is3d: false, 
      alt: 'MAK BUILD Architectural Line-Art - Good Design Builds Better Lives' 
    },
    { 
      base: 'slide-2-living', 
      src: 'assets/img/slide-2-living-1920.webp', 
      widths: [828, 1080, 1440, 1920, 2560], 
      is3d: true, 
      alt: 'MAK BUILD Luxury Living Room & Home Theatre Interior Design' 
    },
    { 
      base: 'slide-3-exterior', 
      src: 'assets/img/slide-3-exterior-1920.webp', 
      widths: [828, 1080, 1440, 1920, 2560], 
      is3d: false, 
      alt: 'MAK BUILD Modern Architecture Exterior with Balcony' 
    },
    { 
      base: 'slide-4-interior', 
      src: 'assets/img/slide-4-interior-1920.webp', 
      widths: [828, 1080, 1440, 1920, 2560], 
      is3d: true, 
      alt: 'MAK BUILD Luxury Office Interior & Wooden Slat Design' 
    }
  ];

  function hydrateHeroSlide(slideEl) {
    if (!slideEl || slideEl.dataset.hydrated === 'true') return;
    slideEl.querySelectorAll('source[data-srcset]').forEach(source => {
      source.srcset = source.getAttribute('data-srcset');
      source.removeAttribute('data-srcset');
    });
    const img = slideEl.querySelector('img[data-src]');
    if (img) {
      img.src = img.getAttribute('data-src');
      img.removeAttribute('data-src');
    }
    slideEl.dataset.hydrated = 'true';
  }

  function preloadSubsequentSlides() {
    const slides = document.querySelectorAll('.hero-slide');
    let nextIdx = 1;
    function loadNext() {
      if (nextIdx >= slides.length) return;
      const slideEl = slides[nextIdx];
      hydrateHeroSlide(slideEl);
      nextIdx++;
      if ('requestIdleCallback' in window) {
        requestIdleCallback(loadNext, { timeout: 1000 });
      } else {
        setTimeout(loadNext, 200);
      }
    }
    loadNext();
  }

  function initHeroSlider() {
    const sliderWrap = document.getElementById('heroSliderWrap');
    const dotsWrap = document.getElementById('heroDotsWrap');
    const chip = document.getElementById('heroSlideChip');
    const heroEl = document.getElementById('hero');
    if (!sliderWrap || !dotsWrap) return;

    const existingFirstSlide = sliderWrap.querySelector('.hero-slide[data-slide="hero-bg"]');
    if (!existingFirstSlide) {
      sliderWrap.innerHTML = '';
    } else {
      existingFirstSlide.dataset.hydrated = 'true';
      Array.from(sliderWrap.querySelectorAll('.hero-slide')).slice(1).forEach(el => el.remove());
    }
    dotsWrap.innerHTML = '';

    heroSlidesData.forEach((slide, idx) => {
      if (!(idx === 0 && existingFirstSlide)) {
        // Create slide element with responsive picture set
        const div = document.createElement('div');
        div.className = `hero-slide ${idx === 0 ? 'active' : ''}`;
        div.setAttribute('data-slide', slide.base);

        if (slide.widths && slide.widths.length > 0) {
          const webpSrcset = slide.widths.map(w => `assets/img/${slide.base}-${w}.webp ${w}w`).join(', ');
          const jpgSrcset = slide.widths.map(w => `assets/img/${slide.base}-${w}.jpg ${w}w`).join(', ');
          if (idx === 0) {
            div.dataset.hydrated = 'true';
            div.innerHTML = `
              <picture>
                <source type="image/webp" srcset="${webpSrcset}" sizes="100vw">
                <source type="image/jpeg" srcset="${jpgSrcset}" sizes="100vw">
                <img class="hero-slide-img" 
                     src="${slide.src}" 
                     alt="${slide.alt || `MAK BUILD Architectural Showcase ${idx + 1}`}"
                     fetchpriority="high" loading="eager"
                     decoding="async"
                     width="1920" height="1080">
              </picture>
            `;
          } else {
            div.innerHTML = `
              <picture>
                <source type="image/webp" data-srcset="${webpSrcset}" sizes="100vw">
                <source type="image/jpeg" data-srcset="${jpgSrcset}" sizes="100vw">
                <img class="hero-slide-img" 
                     src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                     data-src="${slide.src}" 
                     alt="${slide.alt || `MAK BUILD Architectural Showcase ${idx + 1}`}"
                     loading="lazy"
                     decoding="async"
                     width="1920" height="1080">
              </picture>
            `;
          }
        } else {
          div.innerHTML = `
            <img class="hero-slide-img" 
                 src="${slide.src}" 
                 alt="${slide.alt || `MAK BUILD Architectural Showcase ${idx + 1}`}"
                 ${idx === 0 ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"'}
                 decoding="async"
                 width="1920" height="1080">
          `;
        }
        sliderWrap.appendChild(div);
      }

      // Create dot
      const dot = document.createElement('button');
      dot.className = `hero-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(idx);
        startHeroAutoplay(); // Restart 5-second timer on dot click
      });
      dotsWrap.appendChild(dot);
    });

    if (heroEl) {
      heroEl.setAttribute('data-active-slide', '0');
      heroEl.setAttribute('data-slide', '1');
    }
    updateSlideChip();

    // Start autoplay and hydrate subsequent slides after initial load settles (or on first interaction)
    let sliderDeferredStarted = false;
    const startDeferredSlider = () => {
      if (sliderDeferredStarted) return;
      sliderDeferredStarted = true;
      preloadSubsequentSlides();
      startHeroAutoplay();
    };
    const scheduleSlidePreload = () => {
      setTimeout(startDeferredSlider, 6500);
    };
    if (document.readyState === 'complete') {
      scheduleSlidePreload();
    } else {
      window.addEventListener('load', scheduleSlidePreload, { once: true });
    }
    ['pointerdown', 'touchstart', 'keydown'].forEach(evt => {
      window.addEventListener(evt, startDeferredSlider, { once: true, passive: true });
    });

    // Autoplay pause and resume handling
    function pauseHero() {
      if (heroResumeTimer) {
        clearTimeout(heroResumeTimer);
        heroResumeTimer = null;
      }
      isHeroPaused = true;
      if (heroTimer) {
        clearInterval(heroTimer);
        heroTimer = null;
      }
    }

    function resumeHeroWithDelay(delay = 1000) {
      if (heroResumeTimer) clearTimeout(heroResumeTimer);
      heroResumeTimer = setTimeout(() => {
        if (!isHeroOffscreen && !document.hidden) {
          isHeroPaused = false;
          startHeroAutoplay();
        }
      }, delay);
    }

    // Pause autoplay on hover or touch-hold, resume after a delay
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      heroSection.addEventListener('mouseenter', pauseHero);
      heroSection.addEventListener('mouseleave', () => resumeHeroWithDelay(2000));
      heroSection.addEventListener('touchstart', pauseHero, { passive: true });
      heroSection.addEventListener('touchend', () => resumeHeroWithDelay(2000), { passive: true });

      // Pause when hero is scrolled out of view
      if ('IntersectionObserver' in window) {
        const heroObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            isHeroOffscreen = !entry.isIntersecting;
          });
        }, { threshold: 0.15 });
        heroObserver.observe(heroSection);
      }
    }

    // Pause when tab is not active, resume with delay when active
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        pauseHero();
      } else {
        resumeHeroWithDelay(1000);
      }
    });

    // Arrow keys & swipe
    window.addEventListener('keydown', (e) => {
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') {
        goToSlide((heroCurrentIndex + 1) % heroSlidesData.length);
        startHeroAutoplay();
      }
      if (e.key === 'ArrowLeft') {
        goToSlide((heroCurrentIndex - 1 + heroSlidesData.length) % heroSlidesData.length);
        startHeroAutoplay();
      }
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
          startHeroAutoplay();
        }
      }, { passive: true });
    }
  }

  function goToSlide(index) {
    if (index === heroCurrentIndex) return;
    const heroEl = document.getElementById('hero');
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    if (!slides.length) return;

    const prevSlide = slides[heroCurrentIndex];
    const nextSlide = slides[index];
    hydrateHeroSlide(nextSlide);
    hydrateHeroSlide(slides[(index + 1) % slides.length]);

    slides.forEach(s => s.classList.remove('prev'));

    if (prevSlide) {
      prevSlide.classList.remove('active');
      prevSlide.classList.add('prev');
    }
    if (dots[heroCurrentIndex]) dots[heroCurrentIndex].classList.remove('active');

    heroCurrentIndex = index;

    if (nextSlide) nextSlide.classList.add('active');
    if (dots[heroCurrentIndex]) dots[heroCurrentIndex].classList.add('active');

    if (heroEl) {
      heroEl.setAttribute('data-active-slide', heroCurrentIndex.toString());
      heroEl.setAttribute('data-slide', (heroCurrentIndex + 1).toString());
    }

    updateSlideChip();

    if (heroTransitionEndTimeout) clearTimeout(heroTransitionEndTimeout);
    heroTransitionEndTimeout = setTimeout(() => {
      slides.forEach(s => s.classList.remove('prev'));
    }, 550);
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
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!isHeroPaused && !isHeroOffscreen && !document.hidden && !prefersReduced) {
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
  // 4. Services Section ("Image on Top, Text Below") & Service Modal Engine
  // ==========================================
  const serviceIcons = {
    'construction': `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 10h6M9 14h6M9 18h6M12 3v4"/></svg>`,
    'plans-elevations': `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 2a3 3 0 100 6 3 3 0 000-6zm0 6v3m0 0l-5 11m5-11l5 11M9 17h6M4 22h16"/></svg>`,
    'building-approvals': `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>`,
    'interiors': `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M4 11a2 2 0 012-2h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6zm0 4h16M7 19v2M17 19v2M6 9V6a1 1 0 011-1h10a1 1 0 011 1v3"/></svg>`,
    'renovations': `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>`,
    'estimation-consulting': `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>`
  };

  let servicesRevealedOnce = false;
  let processRevealedOnce = false;

  function preloadServiceModalPhoto(idx) {
    ensureServiceModalMounted();
    hydrateServiceModalSlide(idx);
  }

  function renderServices() {
    const grid = document.getElementById('servicesGrid');
    const chipsWrap = document.getElementById('serviceChipsRow');
    if (!grid) return;

    grid.innerHTML = '';
    const t = CONTENT.ui[currentLang] || CONTENT.ui.en;

    CONTENT.services.forEach((svc, idx) => {
      const card = document.createElement('article');
      card.className = servicesRevealedOnce ? 'service-card reveal-init reveal-visible' : 'service-card reveal-init';
      card.dataset.serviceIndex = String(idx);
      card.dataset.serviceSlug = svc.slug || svc.id;
      const title = currentLang === 'ta' ? svc.titleTa : svc.titleEn;
      const shortDesc = currentLang === 'ta' ? svc.shortTa : svc.shortEn;
      const bullets = (currentLang === 'ta' ? svc.bulletsTa : svc.bulletsEn) || [];
      const iconSvg = serviceIcons[svc.id] || `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>`;

      card.innerHTML = `
        <div class="service-icon-box" aria-hidden="true">
          ${iconSvg}
        </div>
        <h3 class="service-title">${title}</h3>
        <p class="service-line">${shortDesc}</p>
        <ul class="service-bullets">
          ${bullets.map(b => `
            <li class="service-bullet">
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
              <span>${b}</span>
            </li>
          `).join('')}
        </ul>
        <button type="button" class="service-btn" data-service="${svc.id}" data-service-slug="${svc.slug || svc.id}" aria-label="${t.knowMore} — ${title}">
          <span>${t.knowMore}</span>
          <svg class="service-btn-arrow" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      `;

      const btn = card.querySelector('.service-btn');
      card.addEventListener('click', () => {
        openServiceModalByIndex(idx, { triggerEl: btn || card, cardEl: card, updateHash: true });
      });
      card.addEventListener('pointerenter', () => preloadServiceModalPhoto(idx), { once: true, passive: true });
      card.addEventListener('focusin', () => preloadServiceModalPhoto(idx), { once: true, passive: true });
      grid.appendChild(card);
    });

    // Bottom Service Highlight Chips
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

    observeCapabilitiesAndProcess();
  }

  // ==========================================
  // 4b. Service Capability Modal Engine (Lazy Template + FLIP + Prev/Next + Swipe-Down + Deep Links)
  // ==========================================
  let serviceModalMounted = false;
  let isServiceModalOpen = false;
  let activeServiceIndex = 0;
  let serviceModalTriggerEl = null;
  let serviceModalSavedScrollY = 0;
  let serviceModalPushedState = false;
  let serviceModalAnimTimer = null;

  function findServiceIndexBySlug(rawSlug) {
    if (!rawSlug) return -1;
    const slug = rawSlug.trim().toLowerCase();
    return CONTENT.services.findIndex(s =>
      (s.slug && s.slug.toLowerCase() === slug) ||
      (s.id && s.id.toLowerCase() === slug)
    );
  }

  function ensureServiceModalMounted() {
    if (serviceModalMounted || !serviceModal) return;
    const tpl = document.getElementById('serviceModalTemplate');
    if (!tpl) return;

    serviceModal.appendChild(tpl.content.cloneNode(true));
    serviceModalMounted = true;

    // Mount all 6 <picture> slides once (always 1080w/1200w in 4:3 frame with centered focal point, never 480w)
    const slidesWrap = document.getElementById('serviceModalSlides');
    if (slidesWrap) {
      const widths = [1080, 1200];
      const sizes = '(min-width: 768px) 540px, 100vw';
      CONTENT.services.forEach((svc, idx) => {
        const base = svc.imageBase || 'images/services/construction';
        const avifSrcset = widths.map(w => `${base}-${w}.avif ${w}w`).join(', ');
        const webpSrcset = widths.map(w => `${base}-${w}.webp ${w}w`).join(', ');
        const jpgSrcset = widths.map(w => `${base}-${w}.jpg ${w}w`).join(', ');
        const fallbackJpg = `${base}-1080.jpg`;
        const altText = currentLang === 'ta' ? (svc.imageAltTa || svc.titleTa) : (svc.imageAltEn || svc.titleEn);
        const safeAlt = (altText || '').replace(/"/g, '&quot;');

        const pic = document.createElement('picture');
        pic.className = 'service-modal-slide';
        pic.dataset.svcSlide = String(idx);
        pic.style.setProperty('--focal', 'center center');
        pic.innerHTML = `
          <source type="image/avif" data-srcset="${avifSrcset}" sizes="${sizes}">
          <source type="image/webp" data-srcset="${webpSrcset}" sizes="${sizes}">
          <source type="image/jpeg" data-srcset="${jpgSrcset}" sizes="${sizes}">
          <img class="service-modal-slide-img"
               src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
               data-src="${fallbackJpg}"
               alt="${safeAlt}"
               decoding="async"
               width="1200"
               height="900">
        `;
        slidesWrap.appendChild(pic);
      });
    }

    // Bind close triggers (backdrop, close button, "Back to services")
    serviceModal.addEventListener('click', (e) => {
      if (e.target === serviceModal || e.target.closest('[data-svc-close]')) {
        closeServiceModal();
      }
    });

    const prevBtn = document.getElementById('serviceModalPrevBtn');
    const nextBtn = document.getElementById('serviceModalNextBtn');
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateServiceModal(-1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateServiceModal(1);
      });
    }

    // Bind mobile bottom-sheet swipe-down to close
    bindServiceModalSwipeDown();
  }

  function hydrateServiceModalSlide(idx) {
    if (!serviceModalMounted) return;
    const total = CONTENT.services.length;
    const normIdx = ((idx % total) + total) % total;
    const pic = serviceModal.querySelector(`.service-modal-slide[data-svc-slide="${normIdx}"]`);
    if (!pic || pic.dataset.hydrated === 'true') return;

    pic.querySelectorAll('source[data-srcset]').forEach(srcEl => {
      srcEl.srcset = srcEl.getAttribute('data-srcset');
      srcEl.removeAttribute('data-srcset');
    });
    const imgEl = pic.querySelector('img[data-src]');
    if (imgEl) {
      imgEl.src = imgEl.getAttribute('data-src');
      imgEl.removeAttribute('data-src');
      if (typeof imgEl.decode === 'function') {
        imgEl.decode().catch(() => {});
      }
    }
    pic.dataset.hydrated = 'true';
  }

  function syncServiceModalLanguage() {
    if (!serviceModalMounted) return;
    CONTENT.services.forEach((svc, idx) => {
      const imgEl = serviceModal.querySelector(`.service-modal-slide[data-svc-slide="${idx}"] img`);
      if (imgEl) {
        imgEl.alt = currentLang === 'ta' ? (svc.imageAltTa || svc.titleTa) : (svc.imageAltEn || svc.titleEn);
      }
    });
    if (isServiceModalOpen) {
      renderServiceModalContent(activeServiceIndex, 'none');
    }
  }

  function renderServiceModalContent(idx, direction = 'none') {
    ensureServiceModalMounted();
    const total = CONTENT.services.length;
    const normIdx = ((idx % total) + total) % total;
    activeServiceIndex = normIdx;
    const svc = CONTENT.services[normIdx];
    const t = CONTENT.ui[currentLang] || CONTENT.ui.en;

    // 1. Hydrate active slide and preload neighbouring (prev & next) slides without re-rendering DOM
    hydrateServiceModalSlide(normIdx);
    hydrateServiceModalSlide((normIdx + 1) % total);
    hydrateServiceModalSlide((normIdx - 1 + total) % total);

    const slides = serviceModal.querySelectorAll('.service-modal-slide');
    slides.forEach((slideEl, sIdx) => {
      slideEl.classList.toggle('from-prev', direction === 'prev' && sIdx === normIdx);
      slideEl.classList.toggle('is-active', sIdx === normIdx);
    });

    // 2. Update counter, icon badge, and button labels
    const counterEl = document.getElementById('serviceModalCounter');
    const iconBadgeEl = document.getElementById('serviceModalIconBadge');
    const closeBtn = document.getElementById('serviceModalCloseBtn');
    const prevBtn = document.getElementById('serviceModalPrevBtn');
    const nextBtn = document.getElementById('serviceModalNextBtn');
    const titleEl = document.getElementById('serviceModalTitle');
    const goldLineEl = document.getElementById('serviceModalGoldLine');
    const shortEl = document.getElementById('serviceModalShort');
    const chipsEl = document.getElementById('serviceModalChips');
    const scopeHeadingEl = document.getElementById('serviceModalScopeHeading');
    const bulletsEl = document.getElementById('serviceModalBullets');
    const backTextEl = document.getElementById('serviceModalBackText');
    const waBtnEl = document.getElementById('serviceModalWaBtn');
    const waTextEl = document.getElementById('serviceModalWaText');
    const bodyEl = document.getElementById('serviceModalBody');

    if (counterEl) counterEl.textContent = `${normIdx + 1} / ${total}`;
    if (iconBadgeEl) iconBadgeEl.innerHTML = serviceIcons[svc.id] || '';
    if (closeBtn) closeBtn.setAttribute('aria-label', currentLang === 'ta' ? (t.closeModal || 'மூடுக') : 'Close dialog');
    if (prevBtn) prevBtn.setAttribute('aria-label', t.prevService || 'Previous service');
    if (nextBtn) nextBtn.setAttribute('aria-label', t.nextService || 'Next service');

    const title = currentLang === 'ta' ? svc.titleTa : svc.titleEn;
    const shortDesc = currentLang === 'ta' ? (svc.modalShortTa || svc.shortTa) : (svc.modalShortEn || svc.shortEn);
    const chips = (currentLang === 'ta' ? svc.chipsTa : svc.chipsEn) || [];
    const bullets = (currentLang === 'ta' ? svc.bulletsTa : svc.bulletsEn) || [];

    const populateText = () => {
      if (titleEl) titleEl.textContent = title;
      if (shortEl) shortEl.textContent = shortDesc;
      if (scopeHeadingEl) scopeHeadingEl.textContent = t.scopeHeading || 'Scope of Work';
      if (backTextEl) backTextEl.textContent = t.backToServices || 'Back to services';
      if (waTextEl) waTextEl.textContent = t.enquireWhatsApp || 'Enquire on WhatsApp';

      if (waBtnEl) {
        const msgTpl = t.waServiceMsg || 'Hello MAK BUILD, I would like to enquire about your {service} service.';
        const waMsg = msgTpl.replace('{service}', title);
        waBtnEl.href = `https://wa.me/918144166022?text=${encodeURIComponent(waMsg)}`;
      }

      if (chipsEl) {
        chipsEl.innerHTML = chips.slice(0, 3).map(chip => `
          <span class="service-mini-chip">
            <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
            <span>${chip}</span>
          </span>
        `).join('');
      }

      if (goldLineEl) {
        goldLineEl.classList.remove('is-ready');
      }

      if (bulletsEl) {
        bulletsEl.innerHTML = bullets.map((b, bIdx) => `
          <li class="service-modal-bullet-item" style="--tick-idx: ${bIdx};">
            <span class="service-modal-tick" aria-hidden="true">
              <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </span>
            <span>${b}</span>
          </li>
        `).join('');
      }

      requestAnimationFrame(() => {
        if (goldLineEl) goldLineEl.classList.add('is-ready');
        if (bulletsEl) {
          bulletsEl.querySelectorAll('.service-modal-bullet-item').forEach(li => li.classList.add('is-ready'));
        }
      });
    };

    if (direction !== 'none' && bodyEl && !isLitePerfMode()) {
      const slideClass = direction === 'next' ? 'is-sliding-next' : 'is-sliding-prev';
      bodyEl.classList.add(slideClass);
      setTimeout(() => {
        populateText();
        bodyEl.classList.remove('is-sliding-next', 'is-sliding-prev');
      }, 120);
    } else {
      populateText();
    }
  }

  function lockBodyForServiceModal() {
    if (document.body.classList.contains('service-modal-lock')) return;
    serviceModalSavedScrollY = window.scrollY;
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    if (sbw > 0) {
      document.body.style.paddingRight = `${sbw}px`;
      if (header) header.style.paddingRight = `${sbw}px`;
    }
    document.body.classList.add('service-modal-lock');
  }

  function unlockBodyForServiceModal() {
    if (!document.body.classList.contains('service-modal-lock')) return;
    document.body.classList.remove('service-modal-lock');
    document.body.style.paddingRight = '';
    if (header) header.style.paddingRight = '';
    if (Math.abs(window.scrollY - serviceModalSavedScrollY) > 2) {
      window.scrollTo({ top: serviceModalSavedScrollY, behavior: 'instant' });
    }
  }

  function openServiceModalByIndex(idx, opts = {}) {
    if (!serviceModal) return;
    ensureServiceModalMounted();

    const total = CONTENT.services.length;
    const normIdx = ((idx % total) + total) % total;
    const svc = CONTENT.services[normIdx];
    const cardEl = opts.cardEl || document.querySelector(`.service-card[data-service-index="${normIdx}"]`);
    serviceModalTriggerEl = opts.triggerEl || (cardEl ? cardEl.querySelector('.service-btn') : document.activeElement);

    // Measure card rect before unhiding modal (for FLIP open motion)
    const canFlip = !isLitePerfMode() && cardEl && !isServiceModalOpen;
    const cardRect = canFlip ? cardEl.getBoundingClientRect() : null;

    renderServiceModalContent(normIdx, 'none');
    lockBodyForServiceModal();

    const sheetEl = document.getElementById('serviceModalSheet');
    const wasAlreadyOpen = isServiceModalOpen;
    isServiceModalOpen = true;
    serviceModal.hidden = false;

    if (opts.updateHash && svc && svc.slug) {
      const targetHash = `#services/${svc.slug}`;
      if (window.location.hash.toLowerCase() !== targetHash) {
        if (history.pushState) {
          history.pushState({ serviceModal: true, slug: svc.slug }, '', targetHash);
          serviceModalPushedState = true;
        } else {
          window.location.hash = targetHash;
        }
      }
    }

    if (serviceModalAnimTimer) {
      clearTimeout(serviceModalAnimTimer);
      serviceModalAnimTimer = null;
    }

    if (!wasAlreadyOpen && sheetEl && cardRect && cardRect.width > 0 && cardRect.height > 0 && cardRect.bottom > 0 && cardRect.top < window.innerHeight) {
      // FLIP: grow modal out of the tapped card using transform and opacity only
      sheetEl.style.transition = 'none';
      sheetEl.style.transform = 'translate3d(0, 0, 0) scale(1, 1)';
      const sheetRect = sheetEl.getBoundingClientRect();
      const dx = (cardRect.left + cardRect.width / 2) - (sheetRect.left + sheetRect.width / 2);
      const dy = (cardRect.top + cardRect.height / 2) - (sheetRect.top + sheetRect.height / 2);
      const sx = Math.max(0.32, Math.min(0.94, cardRect.width / Math.max(1, sheetRect.width)));
      const sy = Math.max(0.32, Math.min(0.94, cardRect.height / Math.max(1, sheetRect.height)));

      sheetEl.classList.add('is-animating');
      sheetEl.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) scale(${sx.toFixed(3)}, ${sy.toFixed(3)})`;
      sheetEl.style.opacity = '0';

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          sheetEl.style.transition = '';
          serviceModal.classList.add('is-open');
          sheetEl.style.transform = 'translate3d(0, 0, 0) scale(1, 1)';
          sheetEl.style.opacity = '1';
        });
      });

      serviceModalAnimTimer = setTimeout(() => {
        sheetEl.style.transform = '';
        sheetEl.style.opacity = '';
        sheetEl.classList.remove('is-animating');
      }, 330);
    } else {
      // Fallback: soft fade and rise
      if (sheetEl) sheetEl.classList.add('is-animating');
      requestAnimationFrame(() => {
        serviceModal.classList.add('is-open');
      });
      serviceModalAnimTimer = setTimeout(() => {
        if (sheetEl) {
          sheetEl.style.transform = '';
          sheetEl.style.opacity = '';
          sheetEl.classList.remove('is-animating');
        }
      }, 330);
    }

    const closeBtn = document.getElementById('serviceModalCloseBtn');
    if (closeBtn) {
      setTimeout(() => closeBtn.focus({ preventScroll: true }), 40);
    }
  }

  function navigateServiceModal(delta) {
    if (!isServiceModalOpen) return;
    const total = CONTENT.services.length;
    const nextIdx = (activeServiceIndex + delta + total) % total;
    const dir = delta >= 0 ? 'next' : 'prev';
    renderServiceModalContent(nextIdx, dir);

    const nextSvc = CONTENT.services[nextIdx];
    if (nextSvc && nextSvc.slug && history.replaceState) {
      history.replaceState({ serviceModal: true, slug: nextSvc.slug }, '', `#services/${nextSvc.slug}`);
    }
  }

  function closeServiceModal(opts = {}) {
    if (!serviceModal || !isServiceModalOpen) return;
    isServiceModalOpen = false;

    const sheetEl = document.getElementById('serviceModalSheet');
    const activeCard = document.querySelector(`.service-card[data-service-index="${activeServiceIndex}"]`);
    const returnFocusEl = (activeCard ? activeCard.querySelector('.service-btn') : null) || serviceModalTriggerEl;

    // Sync URL hash if closed via UI rather than browser Back button
    if (!opts.fromHistory && window.location.hash.toLowerCase().startsWith('#services/')) {
      if (serviceModalPushedState && history.length > 1) {
        serviceModalPushedState = false;
        history.back();
      } else if (history.replaceState) {
        serviceModalPushedState = false;
        history.replaceState(null, '', '#services');
      }
    } else {
      serviceModalPushedState = false;
    }

    if (serviceModalAnimTimer) {
      clearTimeout(serviceModalAnimTimer);
      serviceModalAnimTimer = null;
    }

    if (sheetEl) {
      sheetEl.classList.add('is-animating');
      if (opts.fromSwipe) {
        sheetEl.style.transform = 'translate3d(0, 105%, 0)';
        sheetEl.style.opacity = '0';
      } else if (!isLitePerfMode() && activeCard) {
        const cardRect = activeCard.getBoundingClientRect();
        const sheetRect = sheetEl.getBoundingClientRect();
        if (cardRect.width > 0 && cardRect.bottom > 0 && cardRect.top < window.innerHeight) {
          const dx = (cardRect.left + cardRect.width / 2) - (sheetRect.left + sheetRect.width / 2);
          const dy = (cardRect.top + cardRect.height / 2) - (sheetRect.top + sheetRect.height / 2);
          const sx = Math.max(0.32, Math.min(0.94, cardRect.width / Math.max(1, sheetRect.width)));
          const sy = Math.max(0.32, Math.min(0.94, cardRect.height / Math.max(1, sheetRect.height)));
          sheetEl.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) scale(${sx.toFixed(3)}, ${sy.toFixed(3)})`;
          sheetEl.style.opacity = '0';
        }
      }
    }

    serviceModal.classList.remove('is-open');
    unlockBodyForServiceModal();

    const finishDelay = isLitePerfMode() ? 20 : 300;
    serviceModalAnimTimer = setTimeout(() => {
      if (!isServiceModalOpen) {
        serviceModal.hidden = true;
        if (sheetEl) {
          sheetEl.style.transform = '';
          sheetEl.style.opacity = '';
          sheetEl.classList.remove('is-animating', 'is-dragging');
        }
      }
      if (returnFocusEl && typeof returnFocusEl.focus === 'function') {
        returnFocusEl.focus({ preventScroll: true });
      }
    }, finishDelay);
  }

  function bindServiceModalSwipeDown() {
    const sheetEl = document.getElementById('serviceModalSheet');
    const gridEl = sheetEl ? sheetEl.querySelector('.service-modal-grid') : null;
    if (!sheetEl || !gridEl) return;

    let startY = 0;
    let startX = 0;
    let currentDy = 0;
    let isDragging = false;
    let canDrag = false;
    let rafId = 0;

    const applyDragTransform = () => {
      rafId = 0;
      if (!isDragging) return;
      sheetEl.style.transform = `translate3d(0, ${Math.round(currentDy)}px, 0)`;
    };

    sheetEl.addEventListener('touchstart', (e) => {
      if (window.innerWidth >= 768 || e.touches.length !== 1) return;
      const touch = e.touches[0];
      const onHandleOrMedia = Boolean(e.target.closest('#serviceModalDragHandle, #serviceModalMedia'));
      canDrag = onHandleOrMedia || gridEl.scrollTop <= 0;
      if (!canDrag) return;
      startY = touch.clientY;
      startX = touch.clientX;
      currentDy = 0;
      isDragging = false;
    }, { passive: true });

    sheetEl.addEventListener('touchmove', (e) => {
      if (!canDrag || e.touches.length !== 1) return;
      const touch = e.touches[0];
      const dy = touch.clientY - startY;
      const dx = touch.clientX - startX;

      if (!isDragging) {
        if (dy > 8 && dy > Math.abs(dx) * 1.2 && gridEl.scrollTop <= 0) {
          isDragging = true;
          sheetEl.classList.add('is-dragging');
        } else if (dy < -8 || Math.abs(dx) > 16) {
          canDrag = false;
          return;
        }
      }

      if (isDragging) {
        currentDy = Math.max(0, dy);
        if (!rafId) rafId = requestAnimationFrame(applyDragTransform);
      }
    }, { passive: true });

    const endDrag = () => {
      if (!isDragging) {
        canDrag = false;
        return;
      }
      isDragging = false;
      canDrag = false;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
      sheetEl.classList.remove('is-dragging');
      if (currentDy > 72) {
        closeServiceModal({ fromSwipe: true });
      } else {
        sheetEl.style.transform = '';
      }
      currentDy = 0;
    };

    sheetEl.addEventListener('touchend', endDrag, { passive: true });
    sheetEl.addEventListener('touchcancel', endDrag, { passive: true });
  }

  function handleServiceModalRoute(isInitial = false) {
    const rawHash = window.location.hash || '';
    const lowerHash = rawHash.toLowerCase();
    if (lowerHash.startsWith('#services/')) {
      const slug = rawHash.slice('#services/'.length).split('?')[0].trim();
      const idx = findServiceIndexBySlug(slug);
      if (idx !== -1) {
        ensureBelowFoldRendered();
        if (isInitial) {
          const servicesSec = document.getElementById('services');
          if (servicesSec) {
            const headerH = header ? header.offsetHeight : 72;
            const topY = Math.max(0, servicesSec.getBoundingClientRect().top + window.scrollY - headerH - 8);
            window.scrollTo({ top: topY, behavior: 'instant' });
          }
        }
        openServiceModalByIndex(idx, { updateHash: false });
        return true;
      }
    } else if (isServiceModalOpen) {
      closeServiceModal({ fromHistory: true });
    }
    return false;
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
          <svg width="22" height="22" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
          <span>${t.getQuoteBtn.replace('{tier}', currentLang === 'ta' ? tm.basic.nameTa : tm.basic.name)}</span>
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
          <svg width="22" height="22" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
          <span>${t.getQuoteBtn.replace('{tier}', currentLang === 'ta' ? `${tm.moderate.nameTa} ${activeMod.labelTa}` : `Moderate ${activeMod.label}`)}</span>
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
          <svg width="22" height="22" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
          <span>${t.getQuoteBtn.replace('{tier}', currentLang === 'ta' ? tm.premium.nameTa : tm.premium.name)}</span>
        </a>
      </div>
    `;
    grid.appendChild(premCard);
  }

  // ==========================================
  // 7. Projects Album System (Level 1 Covers + Level 2 Project Page)
  // ==========================================
  let activeProjectSlug = null;
  let lastAlbumScrollY = null;
  let cameFromAlbumCovers = false;

  const albumRevealObserver = ('IntersectionObserver' in window)
    ? new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            el.classList.add('reveal-visible');
            obs.unobserve(el);
            if (el.classList.contains('album-card')) {
              const delayMs = parseFloat(el.dataset.staggerMs || '0') || 0;
              setTimeout(() => {
                el.style.transitionDelay = '';
              }, delayMs + 450);
            }
          }
        });
      }, { rootMargin: '0px 0px 80px 0px', threshold: 0.01 })
    : null;

  function observeAlbumElements(container) {
    if (!container) return;
    const items = container.querySelectorAll('.reveal-init');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    items.forEach((el, idx) => {
      if (reducedMotion || !albumRevealObserver) {
        el.classList.add('reveal-visible');
        el.style.transitionDelay = '';
      } else {
        if (el.classList.contains('album-card')) {
          const staggerMs = idx * 80;
          el.dataset.staggerMs = String(staggerMs);
          el.style.transitionDelay = `${staggerMs}ms`;
        }
        albumRevealObserver.observe(el);
      }
    });
  }

  // Cover thumbnails load dedicated 4:3 sharp sources (768w, 1080w, 1600w — never 480w) so covers stay crisp at 1x/2x DPR and on hover zoom
  function buildAlbumCoverPicture(proj, altText, isEager = false) {
    const base = proj.coverBase || `images/projects/${proj.slug}/cover`;
    const thumbWidths = proj.coverWidths || [768, 1080, 1600];
    const sizes = '(min-width: 1024px) 38vw, (min-width: 640px) 54vw, 100vw';
    const avifSrcset = thumbWidths.map(w => `${base}-${w}.avif ${w}w`).join(', ');
    const webpSrcset = thumbWidths.map(w => `${base}-${w}.webp ${w}w`).join(', ');
    const jpgSrcset = thumbWidths.map(w => `${base}-${w}.jpg ${w}w`).join(', ');
    const fallbackJpg = `${base}-1080.jpg`;

    return `
      <picture>
        <source type="image/avif" srcset="${avifSrcset}" sizes="${sizes}">
        <source type="image/webp" srcset="${webpSrcset}" sizes="${sizes}">
        <source type="image/jpeg" srcset="${jpgSrcset}" sizes="${sizes}">
        <img class="album-cover-img"
             src="${fallbackJpg}"
             alt="${altText.replace(/"/g, '&quot;')}"
             loading="${isEager ? 'eager' : 'lazy'}"
             decoding="async"
             width="1080"
             height="810">
      </picture>
    `;
  }

  // Full project images load only after a project is opened (first 2 eager, rest lazy, uncropped with width/height)
  function buildProjectGalleryPicture(img, isEager, isFirst) {
    const base = img.base;
    const widths = img.widths || [480, 768, 1080, 1600, 2000];
    const sizes = '(min-width: 1280px) 1200px, 100vw';
    const avifSrcset = widths.map(w => `${base}-${w}.avif ${w}w`).join(', ');
    const webpSrcset = widths.map(w => `${base}-${w}.webp ${w}w`).join(', ');
    const jpgSrcset = widths.map(w => `${base}-${w}.jpg ${w}w`).join(', ');
    const fallbackJpg = `${base}-1080.jpg`;
    const wAttr = img.width || 3840;
    const hAttr = img.height || 2160;
    const safeAlt = (img.alt || '').replace(/"/g, '&quot;');

    return `
      <picture>
        <source type="image/avif" srcset="${avifSrcset}" sizes="${sizes}">
        <source type="image/webp" srcset="${webpSrcset}" sizes="${sizes}">
        <source type="image/jpeg" srcset="${jpgSrcset}" sizes="${sizes}">
        <img class="project-gallery-img"
             src="${fallbackJpg}"
             alt="${safeAlt}"
             loading="${isEager ? 'eager' : 'lazy'}"
             ${isFirst ? 'fetchpriority="high"' : ''}
             decoding="async"
             width="${wAttr}"
             height="${hAttr}">
      </picture>
    `;
  }

  const DEFAULT_PROJECTS = [
    {
      id: "senthil-residence-sirkazhi",
      slug: "senthil-residence-sirkazhi",
      sourceFolder: "Senthil-residence- sirkazhi",
      titleEn: "Senthil Residence, Sirkazhi",
      titleTa: "செந்தில் இல்லம், சீர்காழி",
      titleTaClean: "செந்தில் இல்லம், சீர்காழி",
      category: "residential",
      location: "Sirkazhi",
      locationTa: "சீர்காழி",
      status: "Completed",
      statusTa: "நிறைவுற்றது",
      photoCount: 1,
      cover: "images/projects/senthil-residence-sirkazhi/cover-1080.jpg",
      coverBase: "images/projects/senthil-residence-sirkazhi/cover",
      coverFilename: "Senthil Residence  _ Sirkazhi.jpg",
      coverAlt: "Senthil Residence in Sirkazhi — Contemporary two-storey residential elevation with stone cladding, wood soffit, and terracotta jaali compound wall",
      coverWidths: [768, 1080, 1600],
      coverWidth: 1600,
      coverHeight: 1200,
      images: [
        {
          id: "senthil-residence-sirkazhi-01",
          index: 1,
          filename: "Senthil Residence  _ Sirkazhi.jpg",
          base: "images/projects/senthil-residence-sirkazhi/01-senthil-residence-sirkazhi",
          src: "images/projects/senthil-residence-sirkazhi/01-senthil-residence-sirkazhi-1080.jpg",
          thumb: "images/projects/senthil-residence-sirkazhi/01-senthil-residence-sirkazhi-480.webp",
          widths: [480, 768, 1080, 1600, 2000],
          width: 3840,
          height: 2160,
          alt: "Senthil Residence in Sirkazhi — Contemporary two-storey residential elevation with stone cladding, wood soffit, and terracotta jaali compound wall"
        }
      ]
    },
    {
      id: "interior-chennai",
      slug: "interior-chennai",
      sourceFolder: "interior-chennai",
      titleEn: "Interior at Chennai",
      titleTa: "சென்னை உட்புற வடிவமைப்பு",
      titleTaClean: "சென்னை உட்புற வடிவமைப்பு",
      category: "interior",
      location: "Chennai",
      locationTa: "சென்னை",
      status: "Completed",
      statusTa: "நிறைவுற்றது",
      photoCount: 4,
      cover: "images/projects/interior-chennai/cover-1080.jpg",
      coverBase: "images/projects/interior-chennai/cover",
      coverFilename: "Enscape_2026-09-21-19-21-21_living false ceiling.png",
      coverAlt: "Interior at Chennai — Spacious living hall featuring slatted wood coffered false ceiling, marble TV unit with backlit display niches, and lounge seating",
      coverWidths: [768, 1080, 1600],
      coverWidth: 1600,
      coverHeight: 1200,
      images: [
        {
          id: "interior-chennai-01",
          index: 1,
          filename: "Enscape_2026-09-18-16-19-55_Kitchen-2.png",
          base: "images/projects/interior-chennai/01-kitchen-2",
          src: "images/projects/interior-chennai/01-kitchen-2-1080.jpg",
          thumb: "images/projects/interior-chennai/01-kitchen-2-480.webp",
          widths: [480, 768, 1080, 1600, 2000],
          width: 3840,
          height: 2160,
          alt: "Interior at Chennai — Contemporary L-shaped modular kitchen in muted rose-mauve finish with fluted glass overhead cabinets and quartz countertop"
        },
        {
          id: "interior-chennai-02",
          index: 2,
          filename: "Enscape_2026-09-18-16-19-55_master bed.png",
          base: "images/projects/interior-chennai/02-master-bed",
          src: "images/projects/interior-chennai/02-master-bed-1080.jpg",
          thumb: "images/projects/interior-chennai/02-master-bed-480.webp",
          widths: [480, 768, 1080, 1600, 2000],
          width: 3840,
          height: 2160,
          alt: "Interior at Chennai — Master bedroom floor-to-ceiling wardrobe in matte white and warm oak with backlit circular vanity mirror"
        },
        {
          id: "interior-chennai-03",
          index: 3,
          filename: "Enscape_2026-09-21-19-21-21_living false ceiling.png",
          base: "images/projects/interior-chennai/03-living-false-ceiling",
          src: "images/projects/interior-chennai/03-living-false-ceiling-1080.jpg",
          thumb: "images/projects/interior-chennai/03-living-false-ceiling-480.webp",
          widths: [480, 768, 1080, 1600, 2000],
          width: 3840,
          height: 2160,
          alt: "Interior at Chennai — Spacious living hall featuring slatted wood coffered false ceiling, marble TV unit with backlit display niches, and lounge seating"
        },
        {
          id: "interior-chennai-04",
          index: 4,
          filename: "Enscape_2026-09-21-19-33-13_Enscape scene 1.png",
          base: "images/projects/interior-chennai/04-enscape-scene-1",
          src: "images/projects/interior-chennai/04-enscape-scene-1-1080.jpg",
          thumb: "images/projects/interior-chennai/04-enscape-scene-1-480.webp",
          widths: [480, 768, 1080, 1600, 2000],
          width: 3840,
          height: 2160,
          alt: "Interior at Chennai — Bedroom wardrobe, illuminated round dressing mirror with fluted wood backdrop, and integrated study desk"
        }
      ]
    },
    {
      id: "interior-vellore",
      slug: "interior-vellore",
      sourceFolder: "Interior-vellore",
      titleEn: "Interior at Vellore",
      titleTa: "வேலூர் உட்புற வடிவமைப்பு",
      titleTaClean: "வேலூர் உட்புற வடிவமைப்பு",
      category: "interior",
      location: "Vellore",
      locationTa: "வேலூர்",
      status: "Completed",
      statusTa: "நிறைவுற்றது",
      photoCount: 3,
      cover: "images/projects/interior-vellore/cover-1080.jpg",
      coverBase: "images/projects/interior-vellore/cover",
      coverFilename: "Living 15072025.png",
      coverAlt: "Interior at Vellore — Open-plan living and dining hall with cream upholstery, arched wooden slat partition, crystal chandelier, and cove ceiling",
      coverWidths: [768, 1080, 1600],
      coverWidth: 1600,
      coverHeight: 1200,
      images: [
        {
          id: "interior-vellore-01",
          index: 1,
          filename: "BEDROOM-1.png",
          base: "images/projects/interior-vellore/01-bedroom-1",
          src: "images/projects/interior-vellore/01-bedroom-1-1080.jpg",
          thumb: "images/projects/interior-vellore/01-bedroom-1-480.webp",
          widths: [480, 768, 1080, 1600, 2000],
          width: 3840,
          height: 2160,
          alt: "Interior at Vellore — Bedroom interior with sage-green panelled floor-to-ceiling wardrobe, botanical accent wall niche for TV, and teak wood door"
        },
        {
          id: "interior-vellore-02",
          index: 2,
          filename: "Living 15072025.png",
          base: "images/projects/interior-vellore/02-living-15072025",
          src: "images/projects/interior-vellore/02-living-15072025-1080.jpg",
          thumb: "images/projects/interior-vellore/02-living-15072025-480.webp",
          widths: [480, 768, 1080, 1600, 2000],
          width: 3840,
          height: 2160,
          alt: "Interior at Vellore — Open-plan living and dining hall with cream upholstery, arched wooden slat partition, crystal chandelier, and cove ceiling"
        },
        {
          id: "interior-vellore-03",
          index: 3,
          filename: "MASTERBED VIEW2.png",
          base: "images/projects/interior-vellore/03-masterbed-view2",
          src: "images/projects/interior-vellore/03-masterbed-view2-1080.jpg",
          thumb: "images/projects/interior-vellore/03-masterbed-view2-480.webp",
          widths: [480, 768, 1080, 1600, 2000],
          width: 3840,
          height: 2160,
          alt: "Interior at Vellore — Master bedroom featuring fluted walnut TV wall panel, dual-tone full-height wardrobes, and warm recessed lighting"
        }
      ]
    },
    {
      id: "kathir-interior",
      slug: "kathir-interior",
      sourceFolder: "Kathir-interior",
      titleEn: "Kathir Interior",
      titleTa: "கதிர் உட்புற வடிவமைப்பு",
      titleTaClean: "கதிர் உட்புற வடிவமைப்பு",
      category: "interior",
      location: "Thanjavur",
      locationTa: "தஞ்சாவூர்",
      status: "Completed",
      statusTa: "நிறைவுற்றது",
      photoCount: 15,
      cover: "images/projects/kathir-interior/cover-1080.jpg",
      coverBase: "images/projects/kathir-interior/cover",
      coverFilename: "Enscape_2025-09-05-19-34-06_living-2.png",
      coverAlt: "Kathir Interior — Wide living room view with glass curio cabinet, marble-backed TV unit, fluted wood console, teak armchairs, and floral mural wall",
      coverWidths: [768, 1080, 1600],
      coverWidth: 1600,
      coverHeight: 1200,
      images: [
        {
          id: "kathir-interior-01",
          index: 1,
          filename: "Enscape_2025-09-05-19-34-06_Bedroom2a.png",
          base: "images/projects/kathir-interior/01-bedroom2a",
          src: "images/projects/kathir-interior/01-bedroom2a-1080.jpg",
          thumb: "images/projects/kathir-interior/01-bedroom2a-480.webp",
          widths: [480, 768, 1080, 1600, 2000],
          width: 3840,
          height: 2160,
          alt: "Kathir Interior — Secondary bedroom wardrobe and custom headboard joinery with warm cove lighting"
        },
        {
          id: "kathir-interior-02",
          index: 2,
          filename: "Enscape_2025-09-05-19-34-06_dining-3.png",
          base: "images/projects/kathir-interior/02-dining-3",
          src: "images/projects/kathir-interior/02-dining-3-1080.jpg",
          thumb: "images/projects/kathir-interior/02-dining-3-480.webp",
          widths: [480, 768, 1080, 1600, 2000],
          width: 3840,
          height: 2160,
          alt: "Kathir Interior — Dining hall perspective showing crockery unit, wash counter niche, and warm pendant lighting"
        },
        {
          id: "kathir-interior-03",
          index: 3,
          filename: "Enscape_2025-09-05-19-34-06_Dining.png",
          base: "images/projects/kathir-interior/03-dining",
          src: "images/projects/kathir-interior/03-dining-1080.jpg",
          thumb: "images/projects/kathir-interior/03-dining-480.webp",
          widths: [480, 768, 1080, 1600, 2000],
          width: 3840,
          height: 2160,
          alt: "Kathir Interior — Six-seater wooden dining area with backlit crockery display cabinet and false ceiling"
        },
        {
          id: "kathir-interior-04",
          index: 4,
          filename: "Enscape_2025-09-05-19-34-06_dressing -1.png",
          base: "images/projects/kathir-interior/04-dressing-1",
          src: "images/projects/kathir-interior/04-dressing-1-1080.jpg",
          thumb: "images/projects/kathir-interior/04-dressing-1-480.webp",
          widths: [480, 768, 1080, 1600, 2000],
          width: 3840,
          height: 2160,
          alt: "Kathir Interior — Built-in dressing unit with full-height mirror, storage drawers, and warm accent lighting"
        },
        {
          id: "kathir-interior-05",
          index: 5,
          filename: "Enscape_2025-09-05-19-34-06_kitchen-.3.png",
          base: "images/projects/kathir-interior/05-kitchen-3",
          src: "images/projects/kathir-interior/05-kitchen-3-1080.jpg",
          thumb: "images/projects/kathir-interior/05-kitchen-3-480.webp",
          widths: [480, 768, 1080, 1600, 2000],
          width: 3840,
          height: 2160,
          alt: "Kathir Interior — Modular kitchen view highlighting tall appliance garage, overhead cabinets, and under-cabinet LED task lighting"
        },
        {
          id: "kathir-interior-06",
          index: 6,
          filename: "Enscape_2025-09-05-19-34-06_Kitchen-2.png",
          base: "images/projects/kathir-interior/06-kitchen-2",
          src: "images/projects/kathir-interior/06-kitchen-2-1080.jpg",
          thumb: "images/projects/kathir-interior/06-kitchen-2-480.webp",
          widths: [480, 768, 1080, 1600, 2000],
          width: 3840,
          height: 2160,
          alt: "Kathir Interior — Parallel counter view of the modular kitchen with sleek handleless drawers and marble-textured backsplash"
        },
        {
          id: "kathir-interior-07",
          index: 7,
          filename: "Enscape_2025-09-05-19-34-06_Kitchen.png",
          base: "images/projects/kathir-interior/07-kitchen",
          src: "images/projects/kathir-interior/07-kitchen-1080.jpg",
          thumb: "images/projects/kathir-interior/07-kitchen-480.webp",
          widths: [480, 768, 1080, 1600, 2000],
          width: 3840,
          height: 2160,
          alt: "Kathir Interior — U-shaped glossy taupe modular kitchen with tambour roller shutter, wicker pull-out baskets, and herringbone tile backsplash"
        },
        {
          id: "kathir-interior-08",
          index: 8,
          filename: "Enscape_2025-09-05-19-34-06_living-2.png",
          base: "images/projects/kathir-interior/08-living-2",
          src: "images/projects/kathir-interior/08-living-2-1080.jpg",
          thumb: "images/projects/kathir-interior/08-living-2-480.webp",
          widths: [480, 768, 1080, 1600, 2000],
          width: 3840,
          height: 2160,
          alt: "Kathir Interior — Wide living room view with glass curio cabinet, marble-backed TV unit, fluted wood console, teak armchairs, and floral mural wall"
        },
        {
          id: "kathir-interior-09",
          index: 9,
          filename: "Enscape_2025-09-05-19-34-06_Living-3.png",
          base: "images/projects/kathir-interior/09-living-3",
          src: "images/projects/kathir-interior/09-living-3-1080.jpg",
          thumb: "images/projects/kathir-interior/09-living-3-480.webp",
          widths: [480, 768, 1080, 1600, 2000],
          width: 3840,
          height: 2160,
          alt: "Kathir Interior — Living room seating arrangement facing the marble and fluted-wood entertainment wall with circular chandelier"
        },
        {
          id: "kathir-interior-10",
          index: 10,
          filename: "Enscape_2025-09-05-19-34-06_Living.png",
          base: "images/projects/kathir-interior/10-living",
          src: "images/projects/kathir-interior/10-living-1080.jpg",
          thumb: "images/projects/kathir-interior/10-living-480.webp",
          widths: [480, 768, 1080, 1600, 2000],
          width: 3840,
          height: 2160,
          alt: "Kathir Interior — Living room perspective showcasing custom wooden sofa, tropical botanical wall mural, sliding partition, and carved pooja door"
        },
        {
          id: "kathir-interior-11",
          index: 11,
          filename: "Enscape_2025-09-05-19-34-06_master bed-1.png",
          base: "images/projects/kathir-interior/11-master-bed-1",
          src: "images/projects/kathir-interior/11-master-bed-1-1080.jpg",
          thumb: "images/projects/kathir-interior/11-master-bed-1-480.webp",
          widths: [480, 768, 1080, 1600, 2000],
          width: 3840,
          height: 2160,
          alt: "Kathir Interior — Master bedroom suite with upholstered headboard, floor-to-ceiling wardrobes, and warm ambient ceiling lights"
        },
        {
          id: "kathir-interior-12",
          index: 12,
          filename: "Enscape_2025-09-05-19-34-06_Master bed-2.png",
          base: "images/projects/kathir-interior/12-master-bed-2",
          src: "images/projects/kathir-interior/12-master-bed-2-1080.jpg",
          thumb: "images/projects/kathir-interior/12-master-bed-2-480.webp",
          widths: [480, 768, 1080, 1600, 2000],
          width: 3840,
          height: 2160,
          alt: "Kathir Interior — Master bedroom opposite angle featuring TV console, wardrobe shutters, and study/vanity corner"
        },
        {
          id: "kathir-interior-13",
          index: 13,
          filename: "Enscape_2025-09-05-19-34-06_pooja door .png",
          base: "images/projects/kathir-interior/13-pooja-door",
          src: "images/projects/kathir-interior/13-pooja-door-1080.jpg",
          thumb: "images/projects/kathir-interior/13-pooja-door-480.webp",
          widths: [480, 768, 1080, 1600, 2000],
          width: 3840,
          height: 2160,
          alt: "Kathir Interior — Traditional teak wood pooja room double door with intricate brass-finished jaali panels"
        },
        {
          id: "kathir-interior-14",
          index: 14,
          filename: "Enscape_2025-09-05-19-34-06_pooja.png",
          base: "images/projects/kathir-interior/14-pooja",
          src: "images/projects/kathir-interior/14-pooja-1080.jpg",
          thumb: "images/projects/kathir-interior/14-pooja-480.webp",
          widths: [480, 768, 1080, 1600, 2000],
          width: 3840,
          height: 2160,
          alt: "Kathir Interior — Pooja room interior with backlit mandir backdrop, carved wooden shelving, and drawers"
        },
        {
          id: "kathir-interior-15",
          index: 15,
          filename: "Enscape_2025-09-05-19-34-06_tv unit.png",
          base: "images/projects/kathir-interior/15-tv-unit",
          src: "images/projects/kathir-interior/15-tv-unit-1080.jpg",
          thumb: "images/projects/kathir-interior/15-tv-unit-480.webp",
          widths: [480, 768, 1080, 1600, 2000],
          width: 3840,
          height: 2160,
          alt: "Kathir Interior — Close-up elevation of the living room marble-clad TV wall unit with fluted wooden base and tinted glass display cabinet"
        }
      ]
    },
    {
      id: "office-interior",
      slug: "office-interior",
      sourceFolder: "Office-interior",
      titleEn: "Office Interior",
      titleTa: "அலுவலக உட்புற வடிவமைப்பு",
      titleTaClean: "அலுவலக உட்புற வடிவமைப்பு",
      category: "commercial",
      location: "Sirkazhi",
      locationTa: "சீர்காழி",
      status: "Completed",
      statusTa: "நிறைவுற்றது",
      photoCount: 7,
      cover: "images/projects/office-interior/cover-1080.jpg",
      coverBase: "images/projects/office-interior/cover",
      coverFilename: "Enscape_2026-08-17-16-47-02_Rec-2.png",
      coverAlt: "Office Interior — Commercial reception and waiting lounge with wood-and-fluted reception desk, sculptural ring chandelier, and glass meeting room",
      coverWidths: [768, 1080, 1600],
      coverWidth: 1600,
      coverHeight: 1200,
      images: [
        {
          id: "office-interior-01",
          index: 1,
          filename: "Enscape_2026-08-17-16-47-02_Rec-2.png",
          base: "images/projects/office-interior/01-rec-2",
          src: "images/projects/office-interior/01-rec-2-1080.jpg",
          thumb: "images/projects/office-interior/01-rec-2-480.webp",
          widths: [480, 768, 1080, 1600, 2000],
          width: 3840,
          height: 2160,
          alt: "Office Interior — Commercial reception and waiting lounge with wood-and-fluted reception desk, sculptural ring chandelier, and glass meeting room"
        },
        {
          id: "office-interior-02",
          index: 2,
          filename: "Enscape_2026-08-17-17-07-37_Dining-4.png",
          base: "images/projects/office-interior/02-dining-4",
          src: "images/projects/office-interior/02-dining-4-1080.jpg",
          thumb: "images/projects/office-interior/02-dining-4-480.webp",
          widths: [480, 768, 1080, 1600, 2000],
          width: 3840,
          height: 2160,
          alt: "Office Interior — Staff dining and pantry room with marble-top table, wooden wall panelling, and warm linear lighting"
        },
        {
          id: "office-interior-03",
          index: 3,
          filename: "Enscape_2026-08-17-17-07-37_dining.png",
          base: "images/projects/office-interior/03-dining",
          src: "images/projects/office-interior/03-dining-1080.jpg",
          thumb: "images/projects/office-interior/03-dining-480.webp",
          widths: [480, 768, 1080, 1600, 2000],
          width: 3840,
          height: 2160,
          alt: "Office Interior — Executive dining and breakout area with modern seating and custom cabinetry"
        },
        {
          id: "office-interior-04",
          index: 4,
          filename: "Enscape_2026-08-17-17-17-04_MD room.png",
          base: "images/projects/office-interior/04-md-room",
          src: "images/projects/office-interior/04-md-room-1080.jpg",
          thumb: "images/projects/office-interior/04-md-room-480.webp",
          widths: [480, 768, 1080, 1600, 2000],
          width: 3840,
          height: 2160,
          alt: "Office Interior — Managing Director cabin featuring marble-top executive desk, fluted wood backdrop with backlit logo, and devotional artwork niche"
        },
        {
          id: "office-interior-05",
          index: 5,
          filename: "Enscape_2026-08-17-17-17-04_MD-3.png",
          base: "images/projects/office-interior/05-md-3",
          src: "images/projects/office-interior/05-md-3-1080.jpg",
          thumb: "images/projects/office-interior/05-md-3-480.webp",
          widths: [480, 768, 1080, 1600, 2000],
          width: 3840,
          height: 2160,
          alt: "Office Interior — Managing Director room media wall with dual displays, leather lounge sofa, and geometric wood wall art"
        },
        {
          id: "office-interior-06",
          index: 6,
          filename: "Enscape_2026-08-17-17-17-04_Md-6.png",
          base: "images/projects/office-interior/06-md-6",
          src: "images/projects/office-interior/06-md-6-1080.jpg",
          thumb: "images/projects/office-interior/06-md-6-480.webp",
          widths: [480, 768, 1080, 1600, 2000],
          width: 3840,
          height: 2160,
          alt: "Office Interior — Managing Director cabin wide angle showing visitor chairs, textured concrete wall finish, and glass partition"
        },
        {
          id: "office-interior-07",
          index: 7,
          filename: "Enscape_2026-08-17-17-17-04_MD.png",
          base: "images/projects/office-interior/07-md",
          src: "images/projects/office-interior/07-md-1080.jpg",
          thumb: "images/projects/office-interior/07-md-480.webp",
          widths: [480, 768, 1080, 1600, 2000],
          width: 3840,
          height: 2160,
          alt: "Office Interior — Managing Director suite side perspective highlighting executive desk, black leather sofa, and custom wooden wall sculptures"
        }
      ]
    }
  ];

  function getCategoryLabel(catId) {
    const t = CONTENT.ui[currentLang] || CONTENT.ui.en;
    if (catId === 'residential') return t.tabResidential || 'Residential';
    if (catId === 'interior') return t.tabInterior || 'Interior';
    if (catId === 'commercial') return t.tabCommercial || 'Commercial';
    return t.tabAll || 'All';
  }

  function getProjectTitle(proj) {
    if (currentLang === 'ta') {
      return proj.titleTaClean || (proj.titleTa ? proj.titleTa.replace(/\s*\(needs review\)\s*/i, '') : proj.titleEn);
    }
    return proj.titleEn || proj.title;
  }

  function getProjectLocation(proj) {
    if (currentLang === 'ta' && proj.locationTa) return proj.locationTa;
    return proj.location || '';
  }

  function getProjectStatus(proj) {
    if (currentLang === 'ta' && proj.statusTa) return proj.statusTa;
    return proj.status || 'Completed';
  }

  let projectsListenersInitialized = false;

  function loadProjects() {
    allProjects = DEFAULT_PROJECTS;

    if (!projectsListenersInitialized) {
      projectsListenersInitialized = true;
      window.addEventListener('hashchange', () => handleProjectRoute(false));

      const backTop = document.getElementById('projectBackBtnTop');
      const backBottom = document.getElementById('projectBackBtnBottom');
      const onBackToProjects = (e) => {
        e.preventDefault();
        if (cameFromAlbumCovers && window.history.length > 1) {
          cameFromAlbumCovers = false;
          window.history.back();
        } else {
          const targetHash = currentTab === 'all' ? '#work' : `#work?cat=${currentTab}`;
          window.location.hash = targetHash;
        }
      };
      if (backTop) backTop.addEventListener('click', onBackToProjects);
      if (backBottom) backBottom.addEventListener('click', onBackToProjects);

      // Ensure clicking any #work link in header/nav while viewing #project/<slug> returns to album covers
      document.querySelectorAll('a[href="#work"]').forEach(link => {
        link.addEventListener('click', (e) => {
          if (activeProjectSlug) {
            e.preventDefault();
            cameFromAlbumCovers = false;
            lastAlbumScrollY = null;
            const targetHash = currentTab === 'all' ? '#work' : `#work?cat=${currentTab}`;
            window.location.hash = targetHash;
          }
        });
      });

      // Also fetch data/projects.json asynchronously so external edits to /data/projects.json are respected
      fetch('data/projects.json')
        .then(res => (res.ok ? res.json() : null))
        .then(data => {
          if (data && Array.isArray(data.projects) && data.projects.length > 0) {
            allProjects = data.projects;
            renderProjectsTabs();
            renderProjects();
            if (activeProjectSlug) {
              const found = allProjects.find(p => p.slug === activeProjectSlug);
              if (found) renderProjectDetail(found, true);
            }
          }
        })
        .catch(() => {});
    }

    handleProjectRoute(true);
  }

  let lastRouteTimestamp = 0;

  function handleProjectRoute(isInitial = false) {
    const rawHash = window.location.hash || '';
    const hashLower = rawHash.toLowerCase();
    lastRouteTimestamp = Date.now();

    // Check if hash is #project/<slug>
    if (hashLower.startsWith('#project/')) {
      const slug = rawHash.slice('#project/'.length).split('?')[0].trim().toLowerCase();
      const proj = allProjects.find(p => p.slug.toLowerCase() === slug);
      if (proj) {
        const wasOnDifferentProject = activeProjectSlug !== proj.slug;
        activeProjectSlug = proj.slug;
        renderProjectsTabs();
        renderProjects();
        renderProjectDetail(proj, !wasOnDifferentProject && !isInitial);

        // Scroll to top of #work section when opening a project
        if (wasOnDifferentProject || isInitial) {
          requestAnimationFrame(() => {
            const workSection = document.getElementById('work');
            if (workSection) {
              const headerH = header ? header.offsetHeight : 72;
              const topY = Math.max(0, workSection.getBoundingClientRect().top + window.scrollY - headerH - 8);
              window.scrollTo({ top: topY, behavior: 'instant' });
            }
          });
        }
        return;
      }
    }

    // Otherwise we are on Level 1 (Album Covers)
    const returningFromProject = activeProjectSlug !== null;
    activeProjectSlug = null;
    cameFromAlbumCovers = false;

    // Sync filter tab from #work?cat=... deep links (including legacy cat=commercial, cat=interiors, cat=villas, cat=3d)
    if (hashLower.includes('cat=residential') || hashLower.includes('cat=villas') || hashLower.includes('cat=3d')) {
      currentTab = 'residential';
    } else if (hashLower.includes('cat=interior')) {
      currentTab = 'interior';
    } else if (hashLower.includes('cat=commercial')) {
      currentTab = 'commercial';
    } else if (hashLower.startsWith('#work') && !hashLower.includes('cat=')) {
      currentTab = 'all';
    }

    // Show Level 1, hide Level 2
    const headerEl = document.getElementById('projectsSectionHeader');
    const coversView = document.getElementById('albumCoversView');
    const detailView = document.getElementById('projectDetailView');
    if (headerEl) headerEl.hidden = false;
    if (coversView) coversView.hidden = false;
    if (detailView) detailView.hidden = true;

    renderProjectsTabs();
    renderProjects();

    if (returningFromProject) {
      requestAnimationFrame(() => {
        if (typeof lastAlbumScrollY === 'number') {
          window.scrollTo({ top: lastAlbumScrollY, behavior: 'instant' });
          lastAlbumScrollY = null;
        } else {
          const workSection = document.getElementById('work');
          if (workSection) {
            const headerH = header ? header.offsetHeight : 72;
            const topY = Math.max(0, workSection.getBoundingClientRect().top + window.scrollY - headerH - 8);
            window.scrollTo({ top: topY, behavior: 'instant' });
          }
        }
      });
    } else if (hashLower.startsWith('#work?cat=')) {
      requestAnimationFrame(() => {
        const workSection = document.getElementById('work');
        if (workSection) {
          const headerH = header ? header.offsetHeight : 72;
          const topY = Math.max(0, workSection.getBoundingClientRect().top + window.scrollY - headerH - 8);
          window.scrollTo({ top: topY, behavior: 'instant' });
        }
      });
    }
  }

  function renderProjectsTabs() {
    const tabsWrap = document.getElementById('projectsTabs');
    if (!tabsWrap) return;
    tabsWrap.innerHTML = '';

    const t = CONTENT.ui[currentLang] || CONTENT.ui.en;
    const categories = [
      { id: 'all', label: t.tabAll || 'All', hash: '#work' },
      { id: 'residential', label: t.tabResidential || 'Residential', hash: '#work?cat=residential' },
      { id: 'interior', label: t.tabInterior || 'Interior', hash: '#work?cat=interior' },
      { id: 'commercial', label: t.tabCommercial || 'Commercial', hash: '#work?cat=commercial' }
    ];

    // Hide any chip if its count is 0
    categories.forEach(cat => {
      const count = cat.id === 'all'
        ? allProjects.length
        : allProjects.filter(p => p.category === cat.id).length;

      if (count === 0) return;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `project-tab-btn ${currentTab === cat.id ? 'active' : ''}`;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', currentTab === cat.id ? 'true' : 'false');
      btn.setAttribute('data-cat', cat.id);
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

  function renderProjects() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const t = CONTENT.ui[currentLang] || CONTENT.ui.en;
    const viewProjectLabel = t.viewProject || (currentLang === 'ta' ? 'திட்டத்தைக் காண்க' : 'View Project');

    const filtered = currentTab === 'all'
      ? allProjects
      : allProjects.filter(p => p.category === currentTab);

    filtered.forEach((proj, idx) => {
      const card = document.createElement('a');
      card.className = 'album-card reveal-init';
      card.href = `#project/${proj.slug}`;
      card.setAttribute('data-id', proj.id);
      card.setAttribute('data-slug', proj.slug);
      card.setAttribute('data-category', proj.category);

      const title = getProjectTitle(proj);
      const catLabel = getCategoryLabel(proj.category);
      const coverAlt = proj.coverAlt || title;
      const isFirstRow = window.innerWidth >= 768 && idx < 3;

      card.setAttribute('aria-label', `${title} — ${catLabel}`);

      card.innerHTML = `
        <div class="album-cover-wrap">
          ${buildAlbumCoverPicture(proj, coverAlt, isFirstRow)}
          <span class="album-view-chip" aria-hidden="true">
            <span class="album-view-chip-text">${viewProjectLabel}</span>
            <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.4" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m0 0l-5-5m5 5l-5 5"/>
            </svg>
          </span>
        </div>
        <div class="album-card-body">
          <span class="album-category-tag">${catLabel}</span>
          <h3 class="album-title">${title}</h3>
        </div>
      `;

      const wrapEl = card.querySelector('.album-cover-wrap');
      const imgEl = card.querySelector('.album-cover-img');
      if (wrapEl && imgEl) {
        if (imgEl.complete && imgEl.naturalWidth > 0) {
          wrapEl.classList.add('is-loaded');
        } else {
          imgEl.addEventListener('load', () => wrapEl.classList.add('is-loaded'), { once: true });
        }
      }

      card.addEventListener('click', () => {
        lastAlbumScrollY = window.scrollY;
        cameFromAlbumCovers = true;
      });

      grid.appendChild(card);
    });

    observeAlbumElements(grid);
  }

  function renderProjectDetail(proj, preserveGallery = false) {
    const headerEl = document.getElementById('projectsSectionHeader');
    const coversView = document.getElementById('albumCoversView');
    const detailView = document.getElementById('projectDetailView');
    const titleEl = document.getElementById('projectDetailTitle');
    const metaEl = document.getElementById('projectDetailMeta');
    const stackEl = document.getElementById('projectGalleryStack');
    const waBtn = document.getElementById('projectWhatsAppCta');
    const waBtnText = document.getElementById('projectWhatsAppCtaText');
    const prevNextGrid = document.getElementById('projectPrevNextGrid');

    if (!detailView || !proj) return;

    if (headerEl) headerEl.hidden = true;
    if (coversView) coversView.hidden = true;
    detailView.hidden = false;

    const t = CONTENT.ui[currentLang] || CONTENT.ui.en;
    const title = getProjectTitle(proj);
    const catLabel = getCategoryLabel(proj.category);
    const locLabel = getProjectLocation(proj);
    const statusLabel = getProjectStatus(proj);
    const images = Array.isArray(proj.images) ? proj.images : [];

    if (titleEl) titleEl.textContent = title;

    if (metaEl) {
      metaEl.innerHTML = `
        <span class="project-meta-pill">
          <strong>${t.projectCategoryLabel || t.metaCategory || 'Category'}:</strong> ${catLabel}
        </span>
        ${locLabel ? `
        <span class="project-meta-pill">
          <strong>${t.projectLocationLabel || t.metaLocation || 'Location'}:</strong> ${locLabel}
        </span>` : ''}
        ${statusLabel ? `
        <span class="project-meta-pill">
          <strong>${t.projectStatusLabel || t.metaStatus || 'Status'}:</strong> ${statusLabel}
        </span>` : ''}
      `;
    }

    if (stackEl && (!preserveGallery || stackEl.getAttribute('data-rendered-slug') !== proj.slug)) {
      stackEl.innerHTML = '';
      stackEl.setAttribute('data-rendered-slug', proj.slug);

      images.forEach((img, idx) => {
        const figure = document.createElement('figure');
        figure.className = 'project-gallery-item reveal-init';
        figure.setAttribute('role', 'button');
        figure.setAttribute('tabindex', '0');
        figure.setAttribute('data-index', idx.toString());
        figure.setAttribute('aria-label', `${title} — Photo ${idx + 1} of ${images.length}. Tap to open fullscreen.`);

        const isEager = idx < 2;
        const isFirst = idx === 0;
        figure.innerHTML = buildProjectGalleryPicture(img, isEager, isFirst);

        const openAtIdx = () => openAlbumLightbox(proj, idx);
        figure.addEventListener('click', openAtIdx);
        figure.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openAtIdx();
          }
        });

        stackEl.appendChild(figure);
      });

      observeAlbumElements(stackEl);
    }

    if (waBtn) {
      const waText = `Hello MAK BUILD, I would like to discuss the "${proj.titleEn}" (${proj.location}) project.`;
      waBtn.href = `https://wa.me/918144166022?text=${encodeURIComponent(waText)}`;
    }
    if (waBtnText) {
      waBtnText.textContent = t.chatAboutProject || 'Chat on WhatsApp about this project';
    }

    if (prevNextGrid && allProjects.length > 1) {
      const currentIdx = allProjects.findIndex(p => p.slug === proj.slug);
      const prevIdx = (currentIdx - 1 + allProjects.length) % allProjects.length;
      const nextIdx = (currentIdx + 1) % allProjects.length;
      const prevProj = allProjects[prevIdx];
      const nextProj = allProjects[nextIdx];

      prevNextGrid.innerHTML = `
        <a href="#project/${prevProj.slug}" class="project-nav-card prev-card" data-nav-slug="${prevProj.slug}">
          <span class="project-nav-label">
            <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 12H5m0 0l7 7m-7-7l7-7"/>
            </svg>
            <span>${t.prevProject || 'Previous Project'}</span>
          </span>
          <span class="project-nav-title">${getProjectTitle(prevProj)}</span>
        </a>
        <a href="#project/${nextProj.slug}" class="project-nav-card next-card" data-nav-slug="${nextProj.slug}">
          <span class="project-nav-label">
            <span>${t.nextProject || 'Next Project'}</span>
            <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m0 0l-7-7m7 7l-7 7"/>
            </svg>
          </span>
          <span class="project-nav-title">${getProjectTitle(nextProj)}</span>
        </a>
      `;
    }
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

    // Sync Estimator Scope button labels with currentLang
    document.querySelectorAll('[data-est-scope]').forEach(btn => {
      const scopeId = btn.getAttribute('data-est-scope');
      const scopeObj = CONTENT.estimator.scopes.find(s => s.id === scopeId);
      const spans = btn.querySelectorAll('span');
      if (scopeObj && spans.length >= 2) {
        spans[0].textContent = currentLang === 'ta' ? scopeObj.nameTa : scopeObj.nameEn;
        if (scopeObj.hasRates) {
          spans[1].textContent = currentLang === 'ta' ? '₹2,200/ச.அடி முதல்' : 'From ₹2,200/sq.ft';
        } else {
          spans[1].textContent = currentLang === 'ta' ? 'தனிப்பயன் மதிப்பீடு' : 'Custom Quote';
        }
      }
    });

    // Sync Estimator Package radio button labels with currentLang
    const tm = CONTENT.tierMapping;
    const pkgBtnLabels = {
      'basic': currentLang === 'ta' ? `${tm.basic.nameTa} (₹2,200)` : `${tm.basic.name} (₹2,200)`,
      'moderate-standard': currentLang === 'ta' ? `${tm.moderate.options.standard.labelTa} (₹2,300)` : `${tm.moderate.options.standard.label} (₹2,300)`,
      'moderate-plus': currentLang === 'ta' ? `${tm.moderate.options.plus.labelTa} (₹2,400)` : `${tm.moderate.options.plus.label} (₹2,400)`,
      'premium': currentLang === 'ta' ? `${tm.premium.nameTa} (₹2,500)` : `${tm.premium.name} (₹2,500)`
    };
    document.querySelectorAll('[data-est-pkg]').forEach(btn => {
      const key = btn.getAttribute('data-est-pkg');
      if (pkgBtnLabels[key]) btn.textContent = pkgBtnLabels[key];
    });

    // Sync Estimator Add-on chip labels with currentLang
    document.querySelectorAll('#estAddonsList .addon-chip').forEach(chip => {
      const chk = chip.querySelector('input.addon-checkbox');
      const labelSpan = chip.querySelector('.addon-chip-left span');
      if (chk && labelSpan) {
        const addonObj = CONTENT.estimator.addOns.find(a => a.id === chk.value);
        if (addonObj) {
          labelSpan.textContent = currentLang === 'ta' ? addonObj.labelTa : addonObj.labelEn;
        }
      }
    });

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
      whatsappBtn.innerHTML = `<svg width="22" height="22" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg> <span>${t.estWhatsAppBtn}</span>`;
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
    whatsappBtn.innerHTML = `<svg width="22" height="22" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg> <span>${t.estWhatsAppBtn}</span>`;
  }

  // ==========================================
  // 9. Process Section (Original Flat Vector Illustrations + Lower Scrim Overlay)
  // ==========================================
  const PROCESS_ILLUSTRATIONS = {
    'site-visit': `<svg class="process-card-illust" data-svg-src="images/process/illustrations/01-site-visit.svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" fill="none" stroke="#071120" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M56 244V136C56 72 118 28 200 28C282 28 344 72 344 136V244Z" fill="#152947" stroke="none"/><circle cx="98" cy="78" r="16" fill="#f0d078"/><path d="M36 244H364" stroke="#18a899" stroke-width="4"/><polygon points="48,244 92,194 308,194 352,244" fill="#1c355c" stroke="none"/><polygon points="48,244 92,194 308,194 352,244" fill="none" stroke="#f0d078" stroke-width="4.5" stroke-dasharray="11 9"/><rect x="86" y="182" width="10" height="18" rx="2" fill="#d4af37"/><rect x="304" y="182" width="10" height="18" rx="2" fill="#d4af37"/><g class="process-svg-sway"><path d="M316 194C312 156 320 116 332 78" stroke="#f5ead0" stroke-width="11"/><path d="M316 194C312 156 320 116 332 78" stroke="#071120" stroke-width="5.5"/><path d="M332 76C306 62 282 70 268 88C290 82 312 82 332 76Z" fill="#18a899"/><path d="M332 76C312 48 286 44 268 56C292 58 314 64 332 76Z" fill="#26c6b5"/><path d="M332 76C348 48 372 48 386 64C368 62 348 66 332 76Z" fill="#18a899"/><path d="M332 76C356 66 378 76 388 96C368 86 350 82 332 76Z" fill="#26c6b5"/><circle cx="326" cy="84" r="6.5" fill="#d4af37"/><circle cx="337" cy="85" r="6.5" fill="#f0d078"/></g><line x1="248" y1="154" x2="222" y2="232" stroke="#d4af37" stroke-width="5.5"/><line x1="248" y1="154" x2="248" y2="236" stroke="#f5ead0" stroke-width="5.5"/><line x1="248" y1="154" x2="274" y2="232" stroke="#d4af37" stroke-width="5.5"/><rect x="233" y="146" width="30" height="10" rx="3" fill="#ffffff"/><rect x="236" y="124" width="24" height="22" rx="4" fill="#18a899"/><circle cx="248" cy="135" r="5.5" fill="#f0d078"/><path d="M74 244V192C74 176 86 164 102 164H118C134 164 146 176 146 192V244Z" fill="#f5ead0"/><path d="M86 164V244M134 164V244" stroke="#d4af37" stroke-width="5"/><circle cx="110" cy="136" r="19" fill="#f5ead0"/><path d="M88 134C88 119 98 110 110 110C122 110 132 119 132 134Z" fill="#f0d078"/><line x1="84" y1="134" x2="136" y2="134" stroke="#071120" stroke-width="5.5"/><path d="M138 244V196C138 180 150 168 164 168H180C194 168 206 180 206 196V244Z" fill="#18a899"/><circle cx="172" cy="140" r="18" fill="#f5ead0"/><path d="M151 138C151 124 160 115 172 115C184 115 193 124 193 138Z" fill="#ffffff"/><line x1="147" y1="138" x2="197" y2="138" stroke="#071120" stroke-width="5.5"/><g class="process-svg-float"><rect x="120" y="170" width="52" height="36" rx="6" transform="rotate(-8 146 188)" fill="#ffffff"/><rect x="127" y="176" width="38" height="24" rx="3" transform="rotate(-8 146 188)" fill="#26c6b5" stroke="none"/><line x1="133" y1="184" x2="156" y2="181" stroke="#071120" stroke-width="4"/><line x1="135" y1="192" x2="150" y2="190" stroke="#071120" stroke-width="4"/><circle cx="122" cy="194" r="6" fill="#f0d078"/><circle cx="170" cy="190" r="6" fill="#f0d078"/></g></svg>`,
    'design-approval': `<svg class="process-card-illust" data-svg-src="images/process/illustrations/02-design-approval.svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" fill="none" stroke="#071120" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="200" cy="148" r="118" fill="#152947" stroke="none"/><circle cx="88" cy="72" r="10" fill="#18a899" stroke="none"/><circle cx="322" cy="68" r="7" fill="#f0d078" stroke="none"/><rect x="68" y="86" width="224" height="148" rx="8" fill="#f5ead0"/><rect x="86" y="100" width="188" height="120" rx="4" fill="#ffffff" stroke="#18a899" stroke-width="3.5"/><rect x="52" y="78" width="26" height="164" rx="13" fill="#e8d5ac"/><circle cx="65" cy="91" r="6" fill="#d4af37"/><circle cx="65" cy="229" r="6" fill="#d4af37"/><rect x="282" y="78" width="26" height="164" rx="13" fill="#e8d5ac"/><circle cx="295" cy="91" r="6" fill="#d4af37"/><circle cx="295" cy="229" r="6" fill="#d4af37"/><polygon points="126,152 180,114 234,152" fill="#18a899"/><rect x="138" y="152" width="84" height="52" fill="#f5ead0"/><rect x="152" y="168" width="22" height="36" fill="#d4af37"/><rect x="188" y="166" width="20" height="20" fill="#ffffff"/><line x1="116" y1="204" x2="244" y2="204" stroke="#071120" stroke-width="5"/><g class="process-svg-sway"><rect x="108" y="46" width="12" height="18" rx="4" fill="#d4af37"/><circle cx="114" cy="70" r="11" fill="#f0d078"/><path d="M108 79L78 192" stroke="#ffffff" stroke-width="9"/><path d="M108 79L78 192" stroke="#071120" stroke-width="5.5"/><path d="M120 79L150 192" stroke="#f5ead0" stroke-width="9"/><path d="M120 79L150 192" stroke="#071120" stroke-width="5.5"/><line x1="86" y1="142" x2="142" y2="142" stroke="#18a899" stroke-width="5"/><circle cx="114" cy="142" r="6" fill="#d4af37"/></g><g class="process-svg-float"><path d="M292 96L354 116V168C354 208 326 236 292 250C258 236 230 208 230 168V116L292 96Z" fill="#ffffff"/><path d="M292 110L340 126V166C340 198 318 220 292 232C266 220 244 198 244 166V126L292 110Z" fill="#162a4a" stroke="#d4af37" stroke-width="4"/><path d="M264 170L284 190L334 138" stroke="#26c6b5" stroke-width="14"/><path d="M264 170L284 190L334 138" stroke="#071120" stroke-width="5.5"/></g></svg>`,
    'agreement': `<svg class="process-card-illust" data-svg-src="images/process/illustrations/03-agreement.svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" fill="none" stroke="#071120" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="212" cy="144" r="114" fill="#152947" stroke="none"/><circle cx="136" cy="188" r="76" fill="#18a899" stroke="none"/><rect x="148" y="48" width="176" height="196" rx="14" fill="#1e3860"/><rect x="164" y="66" width="144" height="162" rx="8" fill="#f5ead0"/><path d="M202 34H270L280 66H192L202 34Z" fill="#d4af37"/><circle cx="236" cy="48" r="5" fill="#ffffff"/><rect x="182" y="88" width="22" height="22" rx="4" fill="#ffffff"/><path d="M187 99L192 104L202 92" stroke="#18a899" stroke-width="5"/><line x1="218" y1="95" x2="286" y2="95" stroke="#071120" stroke-width="6"/><line x1="218" y1="106" x2="264" y2="106" stroke="#d4af37" stroke-width="5"/><rect x="182" y="128" width="22" height="22" rx="4" fill="#ffffff"/><path d="M187 139L192 144L202 132" stroke="#18a899" stroke-width="5"/><line x1="218" y1="135" x2="286" y2="135" stroke="#071120" stroke-width="6"/><line x1="218" y1="146" x2="258" y2="146" stroke="#d4af37" stroke-width="5"/><rect x="182" y="168" width="22" height="22" rx="4" fill="#ffffff"/><path d="M187 179L192 184L202 172" stroke="#18a899" stroke-width="5"/><line x1="218" y1="175" x2="282" y2="175" stroke="#071120" stroke-width="6"/><g class="process-svg-float"><rect x="52" y="156" width="26" height="58" rx="8" transform="rotate(32 65 185)" fill="#ffffff"/><rect x="206" y="162" width="26" height="58" rx="8" transform="rotate(-14 219 191)" fill="#ffffff"/><path d="M84 168L124 150C134 146 146 148 156 156L192 188C198 194 198 204 190 210C184 216 174 216 168 210L158 220C152 226 142 226 136 220L126 228C120 234 110 232 104 226L70 196Z" fill="#f0d078"/><path d="M204 172L152 154L120 174C112 180 114 192 124 192C132 192 142 184 148 180L188 210L208 200Z" fill="#d4af37"/><rect x="86" y="196" width="24" height="13" rx="6.5" transform="rotate(-38 98 202)" fill="#d4af37"/><rect x="98" y="206" width="26" height="13" rx="6.5" transform="rotate(-38 111 212)" fill="#f5ead0"/><rect x="112" y="216" width="24" height="13" rx="6.5" transform="rotate(-38 124 222)" fill="#d4af37"/><line x1="152" y1="184" x2="178" y2="206" stroke="#071120" stroke-width="5.5"/><line x1="138" y1="194" x2="162" y2="216" stroke="#071120" stroke-width="5.5"/></g></svg>`,
    'build': `<svg class="process-card-illust" data-svg-src="images/process/illustrations/04-build.svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" fill="none" stroke="#071120" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M54 244V134C54 70 118 26 200 26C282 26 346 70 346 134V244Z" fill="#152947" stroke="none"/><rect x="68" y="54" width="22" height="190" fill="#d4af37"/><line x1="68" y1="84" x2="90" y2="106" stroke="#071120" stroke-width="4.5"/><line x1="90" y1="106" x2="68" y2="128" stroke="#071120" stroke-width="4.5"/><line x1="68" y1="128" x2="90" y2="150" stroke="#071120" stroke-width="4.5"/><rect x="44" y="48" width="208" height="14" rx="4" fill="#f0d078"/><rect x="62" y="34" width="34" height="16" rx="3" fill="#ffffff"/><g class="process-svg-float"><rect x="182" y="58" width="24" height="10" rx="3" fill="#18a899"/><line x1="194" y1="68" x2="194" y2="94" stroke="#f5ead0" stroke-width="4.5"/><path d="M188 94C188 102 200 102 200 94" stroke="#f0d078" stroke-width="5"/><rect x="160" y="102" width="68" height="12" rx="3" fill="#26c6b5"/></g><polygon points="122,158 206,114 290,158" fill="#d4af37"/><polygon points="140,158 206,124 272,158" fill="#162a4a"/><rect x="132" y="158" width="148" height="86" fill="#f5ead0"/><rect x="148" y="172" width="44" height="72" fill="#162a4a"/><rect x="210" y="172" width="54" height="32" fill="#ffffff"/><line x1="237" y1="172" x2="237" y2="204" stroke="#071120" stroke-width="5"/><rect x="210" y="214" width="54" height="30" fill="#18a899"/><line x1="296" y1="142" x2="296" y2="244" stroke="#f0d078" stroke-width="5"/><line x1="330" y1="142" x2="330" y2="244" stroke="#f0d078" stroke-width="5"/><line x1="288" y1="168" x2="338" y2="168" stroke="#ffffff" stroke-width="5"/><line x1="288" y1="204" x2="338" y2="204" stroke="#ffffff" stroke-width="5"/><line x1="296" y1="168" x2="330" y2="204" stroke="#18a899" stroke-width="4"/><g class="process-svg-sway"><rect x="308" y="76" width="14" height="58" rx="5" transform="rotate(-38 315 105)" fill="#d4af37"/><path d="M276 78L310 50L322 64L296 86C288 92 278 90 276 78Z" fill="#ffffff"/><circle cx="298" cy="70" r="5" fill="#18a899"/></g><line x1="36" y1="244" x2="364" y2="244" stroke="#071120" stroke-width="6"/></svg>`,
    'handover': `<svg class="process-card-illust" data-svg-src="images/process/illustrations/05-handover.svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" fill="none" stroke="#071120" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="200" cy="146" r="116" fill="#152947" stroke="none"/><polygon points="134,112 200,66 266,112" fill="#d4af37"/><rect x="148" y="112" width="104" height="68" rx="4" fill="#f5ead0"/><rect x="164" y="126" width="26" height="26" rx="3" fill="#f0d078"/><rect x="206" y="126" width="28" height="54" rx="3" fill="#18a899"/><circle cx="136" cy="168" r="14" fill="#26c6b5"/><circle cx="264" cy="168" r="14" fill="#26c6b5"/><line x1="112" y1="180" x2="288" y2="180" stroke="#071120" stroke-width="5.5"/><g class="process-svg-float"><circle cx="176" cy="154" r="22" fill="#f0d078"/><circle cx="176" cy="154" r="8" fill="#152947"/><path d="M194 166L242 202L232 214L222 206L214 216L202 206L210 196L186 178Z" fill="#d4af37"/><path d="M312 88H218C200 88 186 100 180 118L172 140C170 148 178 154 186 150L204 134H250C258 134 258 148 248 148H206C198 148 198 162 208 162H272L312 142Z" fill="#f5ead0"/><rect x="306" y="78" width="38" height="74" rx="10" fill="#18a899"/><circle cx="325" cy="134" r="6" fill="#ffffff"/></g><path d="M88 228L142 198C154 192 168 196 178 206L210 226C218 230 214 242 204 240L170 226L238 222C248 222 252 234 242 238L168 256C152 260 134 258 118 250L88 238Z" fill="#f5ead0"/><rect x="56" y="194" width="38" height="74" rx="10" fill="#d4af37"/><circle cx="75" cy="250" r="6" fill="#ffffff"/></svg>`
  };

  function renderProcess() {
    const grid = document.getElementById('processStepsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    CONTENT.processSteps.forEach((step, idx) => {
      const card = document.createElement('article');
      card.className = processRevealedOnce
        ? 'process-step-card reveal-init reveal-visible is-lit'
        : 'process-step-card reveal-init';
      card.dataset.stepIndex = String(idx);
      const title = currentLang === 'ta' ? step.titleTa : step.titleEn;
      const desc = currentLang === 'ta' ? step.descTa : step.descEn;
      const svgMarkup = PROCESS_ILLUSTRATIONS[step.slug] || PROCESS_ILLUSTRATIONS['site-visit'];

      card.innerHTML = `
        <div class="process-card-media" aria-hidden="true">
          <div class="process-card-illust-wrap">
            ${svgMarkup}
          </div>
          <div class="process-card-overlay"></div>
        </div>
        <div class="process-card-content">
          <div class="process-card-header">
            <div class="step-num" style="--step-idx: ${idx};"><span>${step.no}</span></div>
            <h3 class="step-title">${title}</h3>
          </div>
          <p class="step-desc">${desc}</p>
        </div>
      `;
      grid.appendChild(card);
    });

    if (processRevealedOnce) {
      const connector = document.getElementById('processConnectorLine');
      if (connector) connector.classList.add('is-drawn');
    }

    observeCapabilitiesAndProcess();
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

    // Contact Form Placeholders & Project Type Options
    const formName = document.getElementById('formName');
    const formPhone = document.getElementById('formPhone');
    const formLocation = document.getElementById('formLocation');
    const formMessage = document.getElementById('formMessage');
    const formProjectType = document.getElementById('formProjectType');

    if (formName) formName.placeholder = currentLang === 'ta' ? 'எ.கா. ரமேஷ் குமார்' : 'e.g. Ramesh Kumar';
    if (formPhone) formPhone.placeholder = currentLang === 'ta' ? 'எ.கா. 9876543210' : 'e.g. 9876543210';
    if (formLocation) formLocation.placeholder = currentLang === 'ta' ? 'எ.கா. சீர்காழி, மயிலாடுதுறை...' : 'e.g. Sirkazhi, Mayiladuthurai...';
    if (formMessage) {
      formMessage.placeholder = currentLang === 'ta'
        ? 'மனை அளவு, பட்ஜெட் அல்லது கட்டுமானத் தேவைகளைக் குறிப்பிடவும்...'
        : 'Tell us about your plot size, budget, or preferred timeline...';
    }
    if (formProjectType) {
      const optMap = {
        'Residential Villa / Home': { en: 'Residential Villa / Home', ta: 'குடியிருப்பு வில்லா / தனி வீடு' },
        'Commercial & PEB Shed': { en: 'Commercial & PEB Shed', ta: 'வணிகக் கட்டடம் & ஸ்டீல் கூடம் (PEB)' },
        'Plans & Elevations': { en: 'Plans & 3D Elevations', ta: 'வரைபடங்கள் & 3D முகப்பு' },
        'Interior Design': { en: 'Interior Design', ta: 'உட்புற அலங்காரம் (Interiors)' },
        'Renovations': { en: 'Renovation & Floor Addition', ta: 'புதுப்பித்தல் & கூடுதல் தளம்' }
      };
      Array.from(formProjectType.options).forEach(opt => {
        if (optMap[opt.value]) {
          opt.textContent = currentLang === 'ta' ? optMap[opt.value].ta : optMap[opt.value].en;
        }
      });
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
  // 11. Modals & Album Lightbox Engine (Swipe, Pinch-Zoom, Counter, Esc/Arrows)
  // ==========================================
  let lastActiveElement = null;
  let activeLightboxProject = null;
  let activeLightboxImages = [];
  let currentLightboxIndex = -1;

  // Zoom & Pan state for Lightbox
  let lbScale = 1;
  let lbTranslateX = 0;
  let lbTranslateY = 0;
  let lbPinchStartDist = 0;
  let lbPinchStartScale = 1;
  let lbIsPanning = false;
  let lbPanStartX = 0;
  let lbPanStartY = 0;
  let lbSwipeStartX = 0;
  let lbSwipeStartY = 0;
  let lbLastTapTime = 0;

  function applyLightboxTransform(dragging = false) {
    const imgEl = document.querySelector('#lightboxMediaWrap .lightbox-img');
    if (!imgEl) return;
    imgEl.classList.toggle('dragging', dragging);
    imgEl.style.transform = `translate3d(${lbTranslateX}px, ${lbTranslateY}px, 0) scale(${lbScale})`;
  }

  function resetLightboxZoom() {
    lbScale = 1;
    lbTranslateX = 0;
    lbTranslateY = 0;
    applyLightboxTransform(false);
  }

  function toggleLightboxZoom() {
    if (lbScale > 1.05) {
      resetLightboxZoom();
    } else {
      lbScale = 2.25;
      lbTranslateX = 0;
      lbTranslateY = 0;
      applyLightboxTransform(false);
    }
  }

  function openModal(modal) {
    if (!modal) return;
    lastActiveElement = document.activeElement;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    const closeBtn = modal.querySelector('#lightboxCloseBtn, .modal-close-btn, .lightbox-close');
    if (closeBtn) {
      closeBtn.focus();
    } else {
      const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable.length) focusable[0].focus();
    }
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
    if (modal === lightboxModal) {
      resetLightboxZoom();
    }
    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  }

  function initModals() {
    if (lightboxModal) {
      lightboxModal.addEventListener('click', (e) => {
        if (
          e.target === lightboxModal ||
          e.target.classList.contains('lightbox-stage') ||
          e.target.classList.contains('lightbox-media-wrap') ||
          e.target.closest('.modal-close-btn') ||
          e.target.closest('.lightbox-close')
        ) {
          closeModal(lightboxModal);
        }
      });
    }

    const prevBtn = document.getElementById('lightboxPrevBtn');
    const nextBtn = document.getElementById('lightboxNextBtn');
    const zoomBtn = document.getElementById('lightboxZoomBtn');
    const mediaWrap = document.getElementById('lightboxMediaWrap');

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrevLightbox();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showNextLightbox();
      });
    }
    if (zoomBtn) {
      zoomBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleLightboxZoom();
      });
    }

    // Keyboard navigation & Focus Trapping (Service Modal + Lightbox Modal)
    window.addEventListener('keydown', (e) => {
      if (isServiceModalOpen && serviceModal) {
        if (e.key === 'Escape') {
          e.preventDefault();
          closeServiceModal();
          return;
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          navigateServiceModal(1);
          return;
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          navigateServiceModal(-1);
          return;
        }
        if (e.key === 'Tab') {
          const focusables = Array.from(
            serviceModal.querySelectorAll('button:not([disabled]):not([hidden]), [href]:not([hidden]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')
          );
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
        return;
      }

      const activeModal = lightboxModal && lightboxModal.classList.contains('open') ? lightboxModal : null;
      if (!activeModal) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        closeModal(activeModal);
        return;
      }

      if (activeModal === lightboxModal) {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          showNextLightbox();
          return;
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          showPrevLightbox();
          return;
        } else if (e.key === '+' || e.key === '=') {
          e.preventDefault();
          lbScale = Math.min(3.5, lbScale + 0.5);
          applyLightboxTransform(false);
          return;
        } else if (e.key === '-' || e.key === '0') {
          e.preventDefault();
          resetLightboxZoom();
          return;
        }
      }

      // Trap Tab focus inside active modal
      if (e.key === 'Tab') {
        const focusables = Array.from(
          activeModal.querySelectorAll('button:not([disabled]):not([hidden]), [href]:not([hidden]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')
        );
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

    // Touch Swipe, 2-Finger Pinch-Zoom, Pan & Mouse Wheel Zoom on Lightbox
    if (mediaWrap) {
      mediaWrap.addEventListener('wheel', (e) => {
        if (!lightboxModal || !lightboxModal.classList.contains('open')) return;
        e.preventDefault();
        const delta = -Math.sign(e.deltaY) * 0.25;
        const nextScale = Math.max(1, Math.min(3.5, lbScale + delta));
        lbScale = nextScale;
        if (lbScale <= 1.02) {
          lbScale = 1;
          lbTranslateX = 0;
          lbTranslateY = 0;
        }
        applyLightboxTransform(false);
      }, { passive: false });

      mediaWrap.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        toggleLightboxZoom();
      });

      mediaWrap.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
          lbIsPanning = false;
          const dx = e.touches[0].clientX - e.touches[1].clientX;
          const dy = e.touches[0].clientY - e.touches[1].clientY;
          lbPinchStartDist = Math.hypot(dx, dy);
          lbPinchStartScale = lbScale;
        } else if (e.touches.length === 1) {
          const now = Date.now();
          if (now - lbLastTapTime < 280) {
            toggleLightboxZoom();
            lbLastTapTime = 0;
            return;
          }
          lbLastTapTime = now;

          lbSwipeStartX = e.touches[0].clientX;
          lbSwipeStartY = e.touches[0].clientY;
          if (lbScale > 1.02) {
            lbIsPanning = true;
            lbPanStartX = e.touches[0].clientX - lbTranslateX;
            lbPanStartY = e.touches[0].clientY - lbTranslateY;
          }
        }
      }, { passive: true });

      mediaWrap.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2 && lbPinchStartDist > 0) {
          e.preventDefault();
          const dx = e.touches[0].clientX - e.touches[1].clientX;
          const dy = e.touches[0].clientY - e.touches[1].clientY;
          const dist = Math.hypot(dx, dy);
          lbScale = Math.max(1, Math.min(3.5, lbPinchStartScale * (dist / lbPinchStartDist)));
          if (lbScale <= 1.02) {
            lbTranslateX = 0;
            lbTranslateY = 0;
          }
          applyLightboxTransform(true);
        } else if (e.touches.length === 1 && lbIsPanning && lbScale > 1.02) {
          e.preventDefault();
          lbTranslateX = e.touches[0].clientX - lbPanStartX;
          lbTranslateY = e.touches[0].clientY - lbPanStartY;
          applyLightboxTransform(true);
        }
      }, { passive: false });

      mediaWrap.addEventListener('touchend', (e) => {
        if (e.touches.length < 2) {
          lbPinchStartDist = 0;
        }
        if (e.touches.length === 0) {
          if (lbIsPanning) {
            lbIsPanning = false;
            applyLightboxTransform(false);
            return;
          }
          if (lbScale <= 1.02 && e.changedTouches.length === 1) {
            const diffX = e.changedTouches[0].clientX - lbSwipeStartX;
            const diffY = e.changedTouches[0].clientY - lbSwipeStartY;
            if (Math.abs(diffX) > 42 && Math.abs(diffX) > Math.abs(diffY) * 1.2) {
              if (diffX < 0) showNextLightbox();
              else showPrevLightbox();
            }
          }
        }
      }, { passive: true });
    }
  }

  function renderLightboxSlide() {
    if (!lightboxModal || !activeLightboxImages.length) return;
    const imgObj = activeLightboxImages[currentLightboxIndex];
    if (!imgObj) return;

    const mediaWrap = document.getElementById('lightboxMediaWrap');
    const counterEl = document.getElementById('lightboxCounter');
    const captionEl = document.getElementById('lightboxCaption');
    const prevBtn = document.getElementById('lightboxPrevBtn');
    const nextBtn = document.getElementById('lightboxNextBtn');

    resetLightboxZoom();

    if (counterEl) {
      counterEl.textContent = `${currentLightboxIndex + 1} / ${activeLightboxImages.length}`;
    }

    if (captionEl) {
      const projTitle = activeLightboxProject ? getProjectTitle(activeLightboxProject) : '';
      captionEl.textContent = imgObj.alt || projTitle;
    }

    const hasMultiple = activeLightboxImages.length > 1;
    if (prevBtn) prevBtn.hidden = !hasMultiple;
    if (nextBtn) nextBtn.hidden = !hasMultiple;

    if (mediaWrap) {
      const base = imgObj.base;
      const widths = imgObj.widths || [480, 768, 1080, 1600, 2000];
      const avifSrcset = widths.map(w => `${base}-${w}.avif ${w}w`).join(', ');
      const webpSrcset = widths.map(w => `${base}-${w}.webp ${w}w`).join(', ');
      const jpgSrcset = widths.map(w => `${base}-${w}.jpg ${w}w`).join(', ');
      const fallbackJpg = `${base}-1600.jpg`;
      const safeAlt = (imgObj.alt || '').replace(/"/g, '&quot;');

      mediaWrap.innerHTML = `
        <picture>
          <source type="image/avif" srcset="${avifSrcset}" sizes="100vw">
          <source type="image/webp" srcset="${webpSrcset}" sizes="100vw">
          <source type="image/jpeg" srcset="${jpgSrcset}" sizes="100vw">
          <img class="lightbox-img"
               src="${fallbackJpg}"
               alt="${safeAlt}"
               loading="eager"
               decoding="async"
               width="${imgObj.width || 3840}"
               height="${imgObj.height || 2160}">
        </picture>
      `;
    }
  }

  function openAlbumLightbox(proj, index = 0) {
    if (!lightboxModal || !proj || !Array.isArray(proj.images) || !proj.images.length) return;
    activeLightboxProject = proj;
    activeLightboxImages = proj.images;
    currentLightboxIndex = Math.max(0, Math.min(proj.images.length - 1, index));
    renderLightboxSlide();
    openModal(lightboxModal);
  }

  function showNextLightbox() {
    if (activeLightboxImages.length <= 1) return;
    currentLightboxIndex = (currentLightboxIndex + 1) % activeLightboxImages.length;
    renderLightboxSlide();
  }

  function showPrevLightbox() {
    if (activeLightboxImages.length <= 1) return;
    currentLightboxIndex = (currentLightboxIndex - 1 + activeLightboxImages.length) % activeLightboxImages.length;
    renderLightboxSlide();
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
          const lowerHash = currentHash.toLowerCase();
          // Do not overwrite URL hash when viewing #services/<slug>, a Level 2 project (#project/<slug>), filtered #work?cat=, or right after route navigation
          if (
            isServiceModalOpen ||
            lowerHash.startsWith('#services/') ||
            lowerHash.startsWith('#project/') ||
            lowerHash.startsWith('#work?cat=') ||
            Date.now() - lastRouteTimestamp < 1200
          ) {
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

    // Back to top scroll listener (RAF-throttled, shown only after scrolling past stats strip)
    const statsStripEl = document.getElementById('statsStrip');
    let topBtnScrollTicking = false;
    window.addEventListener('scroll', () => {
      if (!topBtnScrollTicking && backToTopBtn) {
        topBtnScrollTicking = true;
        requestAnimationFrame(() => {
          const threshold = statsStripEl
            ? Math.max(600, statsStripEl.offsetTop + statsStripEl.offsetHeight - 120)
            : 600;
          if (window.scrollY > threshold) {
            backToTopBtn.classList.add('visible');
          } else {
            backToTopBtn.classList.remove('visible');
          }
          topBtnScrollTicking = false;
        });
      }
    }, { passive: true });

    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  // ==========================================
  // 13. Single Shared IntersectionObserver (Reveal + In-View Motion + Connector Draw + Mobile Glow)
  // ==========================================
  const sharedMotionObserver = ('IntersectionObserver' in window)
    ? new IntersectionObserver((entries, obs) => {
        const lite = isLitePerfMode();
        entries.forEach(entry => {
          const el = entry.target;
          const isServiceCard = el.classList.contains('service-card');
          const isProcessCard = el.classList.contains('process-step-card');

          if (isServiceCard) {
            if (entry.isIntersecting) {
              if (!el.classList.contains('reveal-visible')) {
                el.classList.add('reveal-visible', 'is-animating');
                servicesRevealedOnce = true;
                const delayMs = lite ? 0 : (parseFloat(el.dataset.staggerMs || '0') || 0);
                setTimeout(() => {
                  el.style.transitionDelay = '';
                  el.classList.remove('is-animating');
                }, delayMs + 480);
              }
              if (!window.matchMedia || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
                const svcIdx = parseInt(el.dataset.serviceIndex || '0', 10);
                if (!Number.isNaN(svcIdx)) {
                  preloadServiceModalPhoto(svcIdx);
                }
              }
              obs.unobserve(el);
            }
            return;
          }

          if (isProcessCard) {
            // Run background drift / Ken Burns zoom ONLY while in viewport and not in lite mode
            el.classList.toggle('is-in-view', entry.isIntersecting && !lite);

            if (entry.isIntersecting && !el.classList.contains('reveal-visible')) {
              el.classList.add('reveal-visible', 'is-animating');
              processRevealedOnce = true;
              el.classList.add('is-lit');
              const connector = document.getElementById('processConnectorLine');
              if (connector) connector.classList.add('is-drawn');
              const delayMs = lite ? 0 : (parseFloat(el.dataset.staggerMs || '0') || 0);
              setTimeout(() => {
                el.style.transitionDelay = '';
                el.classList.remove('is-animating');
              }, delayMs + 520);
            }
            return;
          }

          // Standard reveal-once elements
          if (entry.isIntersecting) {
            el.classList.add('reveal-visible');
            obs.unobserve(el);
          }
        });
      }, {
        rootMargin: '0px 0px -30px 0px',
        threshold: [0.05, 0.55]
      })
    : null;

  function observeCapabilitiesAndProcess() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lite = isLitePerfMode();
    const serviceCards = document.querySelectorAll('.services-grid .service-card');
    const processCards = document.querySelectorAll('.process-steps-grid .process-step-card');
    const connector = document.getElementById('processConnectorLine');

    serviceCards.forEach((card, idx) => {
      if (reducedMotion || !sharedMotionObserver) {
        card.classList.add('reveal-visible');
        card.style.transitionDelay = '';
      } else {
        if (!servicesRevealedOnce && !lite) {
          const staggerMs = idx * 80;
          card.dataset.staggerMs = String(staggerMs);
          card.style.transitionDelay = `${staggerMs}ms`;
        } else if (servicesRevealedOnce) {
          card.classList.add('reveal-visible');
          card.style.transitionDelay = '';
        } else {
          card.dataset.staggerMs = '0';
          card.style.transitionDelay = '';
        }
        sharedMotionObserver.observe(card);
      }
    });

    processCards.forEach((card, idx) => {
      if (reducedMotion || !sharedMotionObserver) {
        card.classList.add('reveal-visible', 'is-lit');
        card.style.transitionDelay = '';
        if (connector) connector.classList.add('is-drawn');
      } else {
        if (!processRevealedOnce && !lite) {
          const staggerMs = idx * 100;
          card.dataset.staggerMs = String(staggerMs);
          card.style.transitionDelay = `${staggerMs}ms`;
        } else if (processRevealedOnce) {
          card.classList.add('reveal-visible', 'is-lit');
          card.style.transitionDelay = '';
          if (connector) connector.classList.add('is-drawn');
        } else {
          card.dataset.staggerMs = '0';
          card.style.transitionDelay = '';
        }
        sharedMotionObserver.observe(card);
      }
    });
  }

  function initScrollReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !sharedMotionObserver) {
      document.querySelectorAll('.reveal-init').forEach(el => el.classList.add('reveal-visible'));
      const connector = document.getElementById('processConnectorLine');
      if (connector) connector.classList.add('is-drawn');
      return;
    }

    // Auto-stagger non-capability/process card grids
    if (!isLitePerfMode()) {
      document.querySelectorAll('.packages-grid, .stats-grid').forEach(grid => {
        Array.from(grid.children).forEach((child, i) => {
          if (!child.style.transitionDelay) {
            child.style.transitionDelay = `${(i % 4) * 0.08}s`;
          }
        });
      });
    }

    document.querySelectorAll('.reveal-init:not(.album-card):not(.service-card):not(.process-step-card)').forEach(el => {
      sharedMotionObserver.observe(el);
    });

    observeCapabilitiesAndProcess();
  }

  // ==========================================
  // 14. Application Initialization
  // ==========================================
  document.addEventListener('DOMContentLoaded', () => {
    initAdaptiveQuality();
    initTheme();
    initHeader();
    initHeroSlider();
    initModals();
    setLanguage(currentLang, true);
    initStatsObserver();
    initScrollSpyAndBackToTop();

    window.addEventListener('hashchange', () => handleServiceModalRoute(false));
    window.addEventListener('popstate', () => handleServiceModalRoute(false));

    if (window.innerWidth > 768 || window.location.hash || window.scrollY > 0) {
      ensureBelowFoldRendered();
    } else {
      ['scroll', 'touchstart', 'pointerdown', 'keydown', 'click'].forEach(evt => {
        window.addEventListener(evt, ensureBelowFoldRendered, { once: true, passive: true });
      });
      const servicesEl = document.getElementById('services');
      if (servicesEl && 'IntersectionObserver' in window) {
        const bfObserver = new IntersectionObserver((entries, obs) => {
          if (entries.some(e => e.isIntersecting)) {
            ensureBelowFoldRendered();
            obs.disconnect();
          }
        }, { rootMargin: '120px 0px' });
        bfObserver.observe(servicesEl);
      }
    }

    handleServiceModalRoute(true);
  });

})();

