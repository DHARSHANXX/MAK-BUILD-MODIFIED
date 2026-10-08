const puppeteer = require('puppeteer-core');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const path = require('path');
const fs = require('fs');
const ARTIFACTS_DIR = 'C:\\Users\\DHARSHAN\\.gemini\\antigravity\\brain\\4a32252f-1f0e-4131-8d2d-440c322de3e1';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();

  const failedRequests = [];
  page.on('requestfailed', req => {
    failedRequests.push({ url: req.url(), failure: req.failure() });
  });
  page.on('response', res => {
    if (res.status() >= 400) {
      failedRequests.push({ url: res.url(), status: res.status() });
    }
  });

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  console.log('=== TEST 1: DESKTOP VIEWPORT INITIAL LOAD & SLIDE METADATA ===');
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle0' });

  // Evaluate slides data
  const slidesData = await page.evaluate(() => {
    const slides = Array.from(document.querySelectorAll('.hero-slide'));
    const dots = Array.from(document.querySelectorAll('.hero-dot'));
    return {
      totalSlides: slides.length,
      totalDots: dots.length,
      slides: slides.map((s, i) => {
        const img = s.querySelector('.hero-slide-img');
        const avifSource = s.querySelector('source[type="image/avif"]');
        const webpSource = s.querySelector('source[type="image/webp"]');
        return {
          index: i,
          dataSlide: s.getAttribute('data-slide'),
          isActive: s.classList.contains('active'),
          imgSrc: img ? img.getAttribute('src') : null,
          currentSrc: img ? img.currentSrc : null,
          loading: img ? img.getAttribute('loading') : null,
          fetchpriority: img ? img.getAttribute('fetchpriority') : null,
          decoding: img ? img.getAttribute('decoding') : null,
          width: img ? img.getAttribute('width') : null,
          height: img ? img.getAttribute('height') : null,
          avifSrcset: avifSource ? avifSource.getAttribute('srcset') : null,
          webpSrcset: webpSource ? webpSource.getAttribute('srcset') : null,
          sizes: webpSource ? webpSource.getAttribute('sizes') : null,
          objectFit: img ? window.getComputedStyle(img).objectFit : null,
          objectPosition: img ? window.getComputedStyle(img).objectPosition : null
        };
      })
    };
  });

  console.log('Slides Summary:', JSON.stringify(slidesData, null, 2));

  // Check head preload for slide 1
  const preloadLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('link[rel="preload"][as="image"]')).map(l => ({
      href: l.getAttribute('href'),
      type: l.getAttribute('type'),
      media: l.getAttribute('media'),
      fetchpriority: l.getAttribute('fetchpriority')
    }));
  });
  console.log('Preload Links in <head>:', preloadLinks);

  console.log('\n=== TEST 2: SWITCH TO SLIDE 3 (MODERN HOUSE EXTERIOR) ===');
  await page.evaluate(() => {
    const dots = document.querySelectorAll('.hero-dot');
    dots[2].click();
  });
  // Check is-transitioning was applied
  const transitioningStatus = await page.evaluate(() => {
    const slides = Array.from(document.querySelectorAll('.hero-slide'));
    return slides.map(s => ({
      dataSlide: s.getAttribute('data-slide'),
      isTransitioning: s.classList.contains('is-transitioning'),
      isActive: s.classList.contains('active')
    }));
  });
  console.log('Transitioning Status immediately after click:', transitioningStatus);

  // Wait 1.4s for transition to complete
  await new Promise(r => setTimeout(r, 1500));

  const postTransitionStatus = await page.evaluate(() => {
    const slides = Array.from(document.querySelectorAll('.hero-slide'));
    const slide3 = document.querySelector('.hero-slide[data-slide="slide-3-exterior"]');
    const img3 = slide3 ? slide3.querySelector('.hero-slide-img') : null;
    return {
      slides: slides.map(s => ({
        dataSlide: s.getAttribute('data-slide'),
        isTransitioning: s.classList.contains('is-transitioning'),
        isActive: s.classList.contains('active')
      })),
      slide3Loaded: img3 ? img3.complete : false,
      slide3CurrentSrc: img3 ? img3.currentSrc : null,
      slide3NaturalWidth: img3 ? img3.naturalWidth : 0,
      slide3NaturalHeight: img3 ? img3.naturalHeight : 0,
      slide3ObjectPosition: img3 ? window.getComputedStyle(img3).objectPosition : null
    };
  });
  console.log('Slide 3 Post-transition Status:', postTransitionStatus);

  // Screenshot Desktop Slide 3
  const heroEl = await page.$('#hero');
  await heroEl.screenshot({ path: path.join(ARTIFACTS_DIR, 'hero_slide_3_desktop_1920.png') });
  console.log('Saved hero_slide_3_desktop_1920.png');

  console.log('\n=== TEST 3: SWITCH TO SLIDE 4 (OFFICE INTERIOR RENDER) ===');
  await page.evaluate(() => {
    const dots = document.querySelectorAll('.hero-dot');
    dots[3].click();
  });
  await new Promise(r => setTimeout(r, 1500));

  const slide4Status = await page.evaluate(() => {
    const slide4 = document.querySelector('.hero-slide[data-slide="slide-4-interior"]');
    const img4 = slide4 ? slide4.querySelector('.hero-slide-img') : null;
    return {
      slide4Active: slide4 ? slide4.classList.contains('active') : false,
      slide4Loaded: img4 ? img4.complete : false,
      slide4CurrentSrc: img4 ? img4.currentSrc : null,
      slide4NaturalWidth: img4 ? img4.naturalWidth : 0,
      slide4NaturalHeight: img4 ? img4.naturalHeight : 0,
      slide4ObjectPosition: img4 ? window.getComputedStyle(img4).objectPosition : null
    };
  });
  console.log('Slide 4 Status:', slide4Status);

  // Screenshot Desktop Slide 4
  await heroEl.screenshot({ path: path.join(ARTIFACTS_DIR, 'hero_slide_4_desktop_1920.png') });
  console.log('Saved hero_slide_4_desktop_1920.png');

  console.log('\n=== TEST 4: MOBILE VIEWPORT (390x844) FOR SLIDE 3 & 4 CROPS ===');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle0' });

  // Go to slide 3 on mobile
  await page.evaluate(() => {
    const dots = document.querySelectorAll('.hero-dot');
    dots[2].click();
  });
  await new Promise(r => setTimeout(r, 1500));

  const mobileSlide3Data = await page.evaluate(() => {
    const img3 = document.querySelector('.hero-slide[data-slide="slide-3-exterior"] .hero-slide-img');
    return {
      currentSrc: img3 ? img3.currentSrc : null,
      objectPosition: img3 ? window.getComputedStyle(img3).objectPosition : null,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth
    };
  });
  console.log('Mobile Slide 3 Data:', mobileSlide3Data);
  const heroElMobile = await page.$('#hero');
  await heroElMobile.screenshot({ path: path.join(ARTIFACTS_DIR, 'hero_slide_3_mobile_390.png') });
  console.log('Saved hero_slide_3_mobile_390.png');

  // Go to slide 4 on mobile
  await page.evaluate(() => {
    const dots = document.querySelectorAll('.hero-dot');
    dots[3].click();
  });
  await new Promise(r => setTimeout(r, 1500));

  const mobileSlide4Data = await page.evaluate(() => {
    const img4 = document.querySelector('.hero-slide[data-slide="slide-4-interior"] .hero-slide-img');
    return {
      currentSrc: img4 ? img4.currentSrc : null,
      objectPosition: img4 ? window.getComputedStyle(img4).objectPosition : null,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth
    };
  });
  console.log('Mobile Slide 4 Data:', mobileSlide4Data);
  await heroElMobile.screenshot({ path: path.join(ARTIFACTS_DIR, 'hero_slide_4_mobile_390.png') });
  console.log('Saved hero_slide_4_mobile_390.png');

  console.log('\n=== TEST 5: PREFERS-REDUCED-MOTION CHECK ===');
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  const reducedMotionStyles = await page.evaluate(() => {
    const slide = document.querySelector('.hero-slide');
    const img = document.querySelector('.hero-slide-img');
    return {
      slideTransition: window.getComputedStyle(slide).transition,
      imgTransform: window.getComputedStyle(img).transform,
      imgTransition: window.getComputedStyle(img).transition
    };
  });
  console.log('Prefers-reduced-motion Styles:', reducedMotionStyles);

  console.log('\n=== TEST 6: NETWORK & CONSOLE AUDIT ===');
  console.log('Failed Requests Count:', failedRequests.length, failedRequests);
  console.log('Console Errors Count:', consoleErrors.length, consoleErrors);

  await browser.close();
  console.log('\n=== ALL TESTS COMPLETED SUCCESSFULLY ===');
})();
