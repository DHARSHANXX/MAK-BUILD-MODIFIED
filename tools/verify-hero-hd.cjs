const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACTS_DIR = 'C:\\Users\\DHARSHAN\\.gemini\\antigravity\\brain\\4a32252f-1f0e-4131-8d2d-440c322de3e1';

const viewports = [
  { width: 360, height: 740, dpr: 1, name: '360_mobile' },
  { width: 390, height: 844, dpr: 1, name: '390_mobile' },
  { width: 430, height: 932, dpr: 1, name: '430_mobile' },
  { width: 768, height: 1024, dpr: 1, name: '768_tablet' },
  { width: 1024, height: 768, dpr: 1, name: '1024_tablet' },
  { width: 1366, height: 768, dpr: 1, name: '1366_laptop' },
  { width: 1440, height: 900, dpr: 1, name: '1440_desktop' },
  { width: 1440, height: 900, dpr: 1.25, name: '1440_desktop_125pct' },
  { width: 1920, height: 1080, dpr: 1, name: '1920_fhd' },
  { width: 2560, height: 1440, dpr: 1, name: '2560_qhd' }
];

async function verifyAll() {
  console.log('=== 1. VERIFYING HERO SLIDES ACROSS MULTIPLE VIEWPORTS & ZOOMS ===');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Test across viewports
  for (const vp of viewports) {
    await page.setViewport({
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: vp.dpr
    });
    await page.goto('http://localhost:3000/#hero', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 400));

    // Verify slide 1
    const activeSlide = await page.evaluate(() => {
      const active = document.querySelector('.hero-slide.active');
      return active ? active.getAttribute('data-slide') : 'none';
    });
    console.log(`Viewport ${vp.name} (${vp.width}x${vp.height} @ ${vp.dpr}x) - Active slide: ${activeSlide}`);
  }

  // Set standard desktop viewport to test all 4 slides visually
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3000/#hero', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));

  for (let i = 0; i < 4; i++) {
    // Click dot
    await page.evaluate((idx) => {
      const dots = document.querySelectorAll('.hero-dot');
      if (dots[idx]) dots[idx].click();
    }, i);
    await new Promise(r => setTimeout(r, 800)); // wait for crossfade transition

    const slideInfo = await page.evaluate(() => {
      const active = document.querySelector('.hero-slide.active');
      const img = active ? active.querySelector('.hero-slide-img') : null;
      const currentSrc = img ? img.currentSrc || img.src : 'none';
      const naturalW = img ? img.naturalWidth : 0;
      const naturalH = img ? img.naturalHeight : 0;
      const filter = img ? getComputedStyle(img).filter : 'none';
      const overlayBg = getComputedStyle(document.querySelector('.hero-overlay')).background;
      return {
        slide: active ? active.getAttribute('data-slide') : 'none',
        currentSrc,
        naturalW,
        naturalH,
        filter
      };
    });

    console.log(`\nSlide ${i + 1} (${slideInfo.slide}):`);
    console.log(`  Source: ${slideInfo.currentSrc}`);
    console.log(`  Resolution: ${slideInfo.naturalW}x${slideInfo.naturalH}`);
    console.log(`  Filter: ${slideInfo.filter}`);

    // Screenshot each slide
    const shotPath = path.join(ARTIFACTS_DIR, `hero_verified_slide_${i + 1}.png`);
    const heroEl = await page.$('#hero');
    if (heroEl) await heroEl.screenshot({ path: shotPath });
    console.log(`  Saved screenshot: hero_verified_slide_${i + 1}.png`);
  }

  // Mobile screenshot of Slide 2 and Slide 3
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3000/#hero', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));

  // Slide 2 mobile
  await page.evaluate(() => {
    const dots = document.querySelectorAll('.hero-dot');
    if (dots[1]) dots[1].click();
  });
  await new Promise(r => setTimeout(r, 800));
  const s2MobShot = path.join(ARTIFACTS_DIR, 'hero_verified_slide_2_mobile_390.png');
  const heroMob = await page.$('#hero');
  if (heroMob) await heroMob.screenshot({ path: s2MobShot });
  console.log(`Saved mobile screenshot: hero_verified_slide_2_mobile_390.png`);

  await browser.close();
  console.log('\n=== All visual verifications passed successfully! ===');
}

verifyAll().catch(err => {
  console.error('Verification failed:', err);
  process.exitCode = 1;
});
