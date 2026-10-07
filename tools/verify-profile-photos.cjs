const puppeteer = require('puppeteer-core');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const path = require('path');
const ARTIFACTS_DIR = 'C:\\Users\\DHARSHAN\\.gemini\\antigravity\\brain\\4a32252f-1f0e-4131-8d2d-440c322de3e1';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  
  // Track failed network requests
  const failedRequests = [];
  page.on('requestfailed', req => {
    failedRequests.push({ url: req.url(), failure: req.failure() });
  });

  page.on('response', res => {
    if (res.status() >= 400) {
      failedRequests.push({ url: res.url(), status: res.status() });
    }
  });

  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle0' });

  console.log('=== 1. VERIFYING IMAGE LOADING & NATURAL SIZES ===');
  const photosData = await page.evaluate(() => {
    const engineerImg = document.querySelector('.hero-engineer-photo');
    const designerImg = document.querySelector('.hero-designer-photo');
    return {
      engineer: {
        currentSrc: engineerImg?.currentSrc,
        naturalWidth: engineerImg?.naturalWidth,
        naturalHeight: engineerImg?.naturalHeight,
        clientWidth: engineerImg?.clientWidth,
        clientHeight: engineerImg?.clientHeight,
        complete: engineerImg?.complete,
        objectFit: window.getComputedStyle(engineerImg).objectFit,
        objectPosition: window.getComputedStyle(engineerImg).objectPosition,
        borderRadius: window.getComputedStyle(engineerImg).borderRadius,
        border: window.getComputedStyle(engineerImg).border
      },
      designer: {
        currentSrc: designerImg?.currentSrc,
        naturalWidth: designerImg?.naturalWidth,
        naturalHeight: designerImg?.naturalHeight,
        clientWidth: designerImg?.clientWidth,
        clientHeight: designerImg?.clientHeight,
        complete: designerImg?.complete,
        objectFit: window.getComputedStyle(designerImg).objectFit,
        objectPosition: window.getComputedStyle(designerImg).objectPosition,
        borderRadius: window.getComputedStyle(designerImg).borderRadius,
        border: window.getComputedStyle(designerImg).border
      }
    };
  });

  console.log('Photos Data:', JSON.stringify(photosData, null, 2));

  console.log('\n=== 2. VERIFYING HOVER MICRO-ANIMATION ===');
  // Check hover on Engineer photo
  await page.hover('.hero-engineer-photo');
  await new Promise(r => setTimeout(r, 400)); // wait for 350ms transition
  const engineerHoverStyle = await page.evaluate(() => {
    const el = document.querySelector('.hero-engineer-photo');
    const cs = window.getComputedStyle(el);
    return {
      transform: cs.transform,
      boxShadow: cs.boxShadow,
      borderColor: cs.borderColor
    };
  });
  console.log('Engineer Hover Style:', engineerHoverStyle);

  // Check hover on Designer photo
  await page.hover('.hero-designer-photo');
  await new Promise(r => setTimeout(r, 400)); // wait for 350ms transition
  const designerHoverStyle = await page.evaluate(() => {
    const el = document.querySelector('.hero-designer-photo');
    const cs = window.getComputedStyle(el);
    return {
      transform: cs.transform,
      boxShadow: cs.boxShadow,
      borderColor: cs.borderColor
    };
  });
  console.log('Designer Hover Style:', designerHoverStyle);

  // Move mouse away
  await page.mouse.move(0, 0);
  await new Promise(r => setTimeout(r, 400));

  console.log('\n=== 3. CAPTURING DESKTOP SCREENSHOTS ===');
  const infoBar = await page.$('.hero-info-bar');
  if (infoBar) {
    await infoBar.screenshot({ path: path.join(ARTIFACTS_DIR, 'hero_profiles_final_desktop.png') });
    console.log('Saved hero_profiles_final_desktop.png');
  }

  console.log('\n=== 4. TESTING RESPONSIVE VIEWPORTS ===');
  for (const w of [768, 480, 390, 360]) {
    await page.setViewport({ width: w, height: 900, deviceScaleFactor: 2 });
    await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle0' });
    
    const bar = await page.$('.hero-info-bar');
    if (bar) {
      await bar.screenshot({ path: path.join(ARTIFACTS_DIR, `hero_profiles_final_${w}.png`) });
      console.log(`Saved hero_profiles_final_${w}.png`);
    }

    const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientW = await page.evaluate(() => document.documentElement.clientWidth);
    console.log(`Viewport ${w}px -> overflow: ${scrollW - clientW}px (scrollWidth: ${scrollW}, clientWidth: ${clientW})`);
  }

  console.log('\n=== 5. CHECKING FAILED REQUESTS ===');
  console.log('Failed Requests:', JSON.stringify(failedRequests, null, 2));

  await browser.close();
  console.log('\nAll profile photo verifications completed!');
})();
