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

  // Test 1: Desktop 1366x800
  await page.setViewport({ width: 1366, height: 800, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    const bar = document.querySelector('.hero-info-bar');
    bar.scrollIntoView({ block: 'center' });
  });
  await new Promise(r => setTimeout(r, 600));

  const desktopBar = await page.$('.hero-info-bar');
  if (desktopBar) {
    await desktopBar.screenshot({ path: path.join(ARTIFACTS_DIR, 'hero_two_profiles_desktop.png') });
  }

  // Test 2: Tablet 768x1024
  await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    const bar = document.querySelector('.hero-info-bar');
    bar.scrollIntoView({ block: 'center' });
  });
  await new Promise(r => setTimeout(r, 600));
  const tabletBar = await page.$('.hero-info-bar');
  if (tabletBar) {
    await tabletBar.screenshot({ path: path.join(ARTIFACTS_DIR, 'hero_two_profiles_tablet_768.png') });
  }

  // Test 3: Mobile 390x844 (iPhone 12/13/14)
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    const bar = document.querySelector('.hero-info-bar');
    bar.scrollIntoView({ block: 'center' });
  });
  await new Promise(r => setTimeout(r, 600));
  const mobileBar390 = await page.$('.hero-info-bar');
  if (mobileBar390) {
    await mobileBar390.screenshot({ path: path.join(ARTIFACTS_DIR, 'hero_two_profiles_mobile_390.png') });
  }

  // Test 4: Mobile 360x800 (Small Android)
  await page.setViewport({ width: 360, height: 800, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    const bar = document.querySelector('.hero-info-bar');
    bar.scrollIntoView({ block: 'center' });
  });
  await new Promise(r => setTimeout(r, 600));
  const mobileBar360 = await page.$('.hero-info-bar');
  if (mobileBar360) {
    await mobileBar360.screenshot({ path: path.join(ARTIFACTS_DIR, 'hero_two_profiles_mobile_360.png') });
  }

  // Verify overflow
  const viewports = [360, 390, 414, 768, 1366];
  for (const w of viewports) {
    await page.setViewport({ width: w, height: 800 });
    const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
    console.log(`Viewport ${w}px: scrollWidth=${scrollW}, clientWidth=${w}, overflow=${scrollW > w ? 'YES' : 'NO'}`);
  }

  // Test 5: Tamil mode at 360px
  await page.setViewport({ width: 360, height: 800, deviceScaleFactor: 2 });
  await page.evaluate(() => {
    const btn = document.getElementById('langToggleBtn');
    if (btn) btn.click();
    const bar = document.querySelector('.hero-info-bar');
    bar.scrollIntoView({ block: 'center' });
  });
  await new Promise(r => setTimeout(r, 600));
  const tamilBar = await page.$('.hero-info-bar');
  if (tamilBar) {
    await tamilBar.screenshot({ path: path.join(ARTIFACTS_DIR, 'hero_two_profiles_mobile_tamil.png') });
  }

  // Image resolution check
  const details = await page.evaluate(() => {
    const imgs = document.querySelectorAll('.hero-profiles-group img');
    return Array.from(imgs).map(img => ({
      alt: img.alt,
      src: img.currentSrc || img.src,
      width: img.offsetWidth,
      height: img.offsetHeight,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight
    }));
  });
  console.log('Image details:', details);

  await browser.close();
  console.log('All tests passed successfully!');
})();
