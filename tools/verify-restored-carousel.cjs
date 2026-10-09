const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACTS_DIR = 'C:\\Users\\DHARSHAN\\.gemini\\antigravity\\brain\\4a32252f-1f0e-4131-8d2d-440c322de3e1';

(async () => {
  console.log('--- Launching Chrome for Hero Carousel Verification ---');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/#hero', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    const dots = document.querySelectorAll('.hero-dot');
    if (dots.length > 0) dots[0].click();
  });
  await new Promise(r => setTimeout(r, 600));

  // 1. Check slides and dots count
  const initialData = await page.evaluate(() => {
    const slides = Array.from(document.querySelectorAll('.hero-slide'));
    const dots = Array.from(document.querySelectorAll('.hero-dot'));
    const chip = document.getElementById('heroSlideChip');
    const hero = document.getElementById('hero');

    return {
      slidesCount: slides.length,
      dotsCount: dots.length,
      heroActiveSlideAttr: hero ? hero.getAttribute('data-active-slide') : null,
      chipDisplay: chip ? window.getComputedStyle(chip).display : null,
      chipText: chip ? chip.textContent.trim() : null,
      slides: slides.map((s, idx) => ({
        index: idx,
        dataSlide: s.getAttribute('data-slide'),
        isActive: s.classList.contains('active'),
        imgSrc: s.querySelector('img') ? s.querySelector('img').getAttribute('src') : null
      })),
      activeDotIndex: dots.findIndex(d => d.classList.contains('active'))
    };
  });

  console.log('Initial carousel state:', JSON.stringify(initialData, null, 2));

  if (initialData.slidesCount !== 4) {
    console.error(`FAIL: Expected 4 slides, got ${initialData.slidesCount}`);
    process.exit(1);
  }
  if (initialData.dotsCount !== 4) {
    console.error(`FAIL: Expected 4 dots, got ${initialData.dotsCount}`);
    process.exit(1);
  }
  if (!initialData.slides[0].isActive || initialData.slides[0].dataSlide !== 'hero-bg') {
    console.error(`FAIL: Expected Slide 1 to be active hero-bg, got:`, initialData.slides[0]);
    process.exit(1);
  }

  // Capture Slide 1 Desktop
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'carousel_slide_1_desktop_1440.png') });

  // Mobile Viewport for Slide 1
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'carousel_slide_1_mobile_390.png') });

  // Switch back to desktop
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  // 2. Click Dot 2 (Slide 2: 3D Villa Exterior)
  console.log('--- Clicking Dot 2 (Slide 2: 3D Villa Elevation) ---');
  await page.evaluate(() => {
    const dots = document.querySelectorAll('.hero-dot');
    dots[1].click();
  });
  await new Promise(r => setTimeout(r, 600));

  const slide2Data = await page.evaluate(() => {
    const slides = Array.from(document.querySelectorAll('.hero-slide'));
    const dots = Array.from(document.querySelectorAll('.hero-dot'));
    const chip = document.getElementById('heroSlideChip');
    const hero = document.getElementById('hero');
    const overlay = document.querySelector('.hero-overlay');
    return {
      activeSlideIdx: slides.findIndex(s => s.classList.contains('active')),
      activeSlideData: slides[1].getAttribute('data-slide'),
      activeDotIdx: dots.findIndex(d => d.classList.contains('active')),
      chipDisplay: window.getComputedStyle(chip).display,
      chipText: chip.textContent.trim(),
      heroActiveSlideAttr: hero.getAttribute('data-active-slide'),
      overlayOpacity: overlay ? window.getComputedStyle(overlay).opacity : null
    };
  });
  console.log('Slide 2 state:', JSON.stringify(slide2Data, null, 2));

  if (slide2Data.activeSlideIdx !== 1 || slide2Data.activeSlideData !== 'residence-elevation') {
    console.error('FAIL: Slide 2 did not activate properly!');
    process.exit(1);
  }
  if (slide2Data.chipDisplay === 'none' || !slide2Data.chipText.includes('3D')) {
    console.error('FAIL: Slide 2 should display 3D Design chip!');
    process.exit(1);
  }

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'carousel_slide_2_desktop_1440.png') });
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'carousel_slide_2_mobile_390.png') });
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  // 3. Click Dot 3 (Slide 3: Modern Exterior)
  console.log('--- Clicking Dot 3 (Slide 3: Modern Exterior) ---');
  await page.evaluate(() => {
    const dots = document.querySelectorAll('.hero-dot');
    dots[2].click();
  });
  await new Promise(r => setTimeout(r, 600));

  const slide3Data = await page.evaluate(() => {
    const slides = Array.from(document.querySelectorAll('.hero-slide'));
    const dots = Array.from(document.querySelectorAll('.hero-dot'));
    const chip = document.getElementById('heroSlideChip');
    return {
      activeSlideIdx: slides.findIndex(s => s.classList.contains('active')),
      activeSlideData: slides[2].getAttribute('data-slide'),
      activeDotIdx: dots.findIndex(d => d.classList.contains('active')),
      chipDisplay: window.getComputedStyle(chip).display
    };
  });
  console.log('Slide 3 state:', JSON.stringify(slide3Data, null, 2));

  if (slide3Data.activeSlideIdx !== 2 || slide3Data.activeSlideData !== 'slide-3-exterior') {
    console.error('FAIL: Slide 3 did not activate properly!');
    process.exit(1);
  }
  if (slide3Data.chipDisplay !== 'none') {
    console.error('FAIL: Slide 3 should NOT display 3D chip!');
    process.exit(1);
  }

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'carousel_slide_3_desktop_1440.png') });
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'carousel_slide_3_mobile_390.png') });
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  // 4. Click Dot 4 (Slide 4: Office Interior)
  console.log('--- Clicking Dot 4 (Slide 4: Interior Office) ---');
  await page.evaluate(() => {
    const dots = document.querySelectorAll('.hero-dot');
    dots[3].click();
  });
  await new Promise(r => setTimeout(r, 600));

  const slide4Data = await page.evaluate(() => {
    const slides = Array.from(document.querySelectorAll('.hero-slide'));
    const dots = Array.from(document.querySelectorAll('.hero-dot'));
    const chip = document.getElementById('heroSlideChip');
    return {
      activeSlideIdx: slides.findIndex(s => s.classList.contains('active')),
      activeSlideData: slides[3].getAttribute('data-slide'),
      activeDotIdx: dots.findIndex(d => d.classList.contains('active')),
      chipDisplay: window.getComputedStyle(chip).display,
      chipText: chip.textContent.trim()
    };
  });
  console.log('Slide 4 state:', JSON.stringify(slide4Data, null, 2));

  if (slide4Data.activeSlideIdx !== 3 || slide4Data.activeSlideData !== 'slide-4-interior') {
    console.error('FAIL: Slide 4 did not activate properly!');
    process.exit(1);
  }
  if (slide4Data.chipDisplay === 'none' || !slide4Data.chipText.includes('3D')) {
    console.error('FAIL: Slide 4 should display 3D Design chip!');
    process.exit(1);
  }

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'carousel_slide_4_desktop_1440.png') });
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'carousel_slide_4_mobile_390.png') });
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  // 5. Verify CSS rules & motion restrictions
  const cssChecks = await page.evaluate(() => {
    const activeSlide = document.querySelector('.hero-slide.active');
    const activeImg = activeSlide ? activeSlide.querySelector('.hero-slide-img') : null;
    const computedSlide = activeSlide ? window.getComputedStyle(activeSlide) : null;
    const computedImg = activeImg ? window.getComputedStyle(activeImg) : null;
    const activeDot = document.querySelector('.hero-dot.active');
    const computedDotAfter = activeDot ? window.getComputedStyle(activeDot, '::after') : null;

    return {
      slideTransition: computedSlide ? computedSlide.transition : null,
      imgTransform: computedImg ? computedImg.transform : null,
      imgAnimation: computedImg ? computedImg.animation : null,
      imgObjectFit: computedImg ? computedImg.objectFit : null,
      dotActiveWidth: computedDotAfter ? computedDotAfter.width : null,
      dotActiveRadius: computedDotAfter ? computedDotAfter.borderRadius : null
    };
  });
  console.log('CSS restrictions verification:', JSON.stringify(cssChecks, null, 2));

  // 6. Test Autoplay rotation (5000ms)
  console.log('--- Testing 5000ms Autoplay Rotation ---');
  // Click dot 0 to return to slide 1
  await page.evaluate(() => {
    document.querySelectorAll('.hero-dot')[0].click();
  });
  await new Promise(r => setTimeout(r, 600));

  console.log('Waiting 5200ms to verify automatic transition to slide 2...');
  await new Promise(r => setTimeout(r, 5200));

  const autoplayResult = await page.evaluate(() => {
    const slides = Array.from(document.querySelectorAll('.hero-slide'));
    const dots = Array.from(document.querySelectorAll('.hero-dot'));
    return {
      activeSlideIdx: slides.findIndex(s => s.classList.contains('active')),
      activeDotIdx: dots.findIndex(d => d.classList.contains('active'))
    };
  });
  console.log('Autoplay state after 5.2s:', JSON.stringify(autoplayResult, null, 2));

  if (autoplayResult.activeSlideIdx !== 1) {
    console.error(`FAIL: Autoplay did not advance to slide 1 (slide 2) in 5s! Current index: ${autoplayResult.activeSlideIdx}`);
    process.exit(1);
  }

  console.log('--- ALL CAROUSEL VERIFICATION TESTS PASSED SUCCESSFULLY! ---');
  await browser.close();
  process.exit(0);
})();
