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

  console.log('=== TEST 1: DESKTOP VIEWPORT (1920x1080) ===');
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle0' });

  const desktopData = await page.evaluate(() => {
    const hero = document.getElementById('hero');
    const h1 = document.getElementById('heroH1');
    const sub = document.getElementById('heroSub');
    const tamil = document.getElementById('heroTamilTagline');
    const btnSec = document.querySelector('.hero .btn-secondary');
    const btnPri = document.querySelector('.hero .btn-primary');
    const img = document.querySelector('.hero-bg-img');

    return {
      hero: {
        bgColor: window.getComputedStyle(hero).backgroundColor,
        aspectRatio: window.getComputedStyle(hero).aspectRatio,
        minHeight: window.getComputedStyle(hero).minHeight,
        clientWidth: hero.clientWidth,
        clientHeight: hero.clientHeight
      },
      h1: {
        color: window.getComputedStyle(h1).color,
        fontSize: window.getComputedStyle(h1).fontSize
      },
      sub: {
        color: window.getComputedStyle(sub).color,
        fontWeight: window.getComputedStyle(sub).fontWeight
      },
      tamil: {
        color: window.getComputedStyle(tamil).color,
        textShadow: window.getComputedStyle(tamil).textShadow
      },
      btnSecondary: {
        color: window.getComputedStyle(btnSec).color,
        borderColor: window.getComputedStyle(btnSec).borderColor
      },
      img: {
        src: img ? img.src : null,
        naturalWidth: img ? img.naturalWidth : null,
        naturalHeight: img ? img.naturalHeight : null,
        objectFit: img ? window.getComputedStyle(img).objectFit : null,
        clientWidth: img ? img.clientWidth : null,
        clientHeight: img ? img.clientHeight : null,
        complete: img ? img.complete : null
      },
      overflow: document.documentElement.scrollWidth > window.innerWidth
    };
  });
  console.log('Desktop 1920 Data:', JSON.stringify(desktopData, null, 2));

  const heroEl = await page.$('#hero');
  await heroEl.screenshot({ path: path.join(ARTIFACTS_DIR, 'hero_lineart_desktop_1920.png') });
  console.log('Saved hero_lineart_desktop_1920.png');

  console.log('\n=== TEST 2: LAPTOP VIEWPORT (1440x900) ===');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle0' });
  const heroEl1440 = await page.$('#hero');
  await heroEl1440.screenshot({ path: path.join(ARTIFACTS_DIR, 'hero_lineart_desktop_1440.png') });
  console.log('Saved hero_lineart_desktop_1440.png');

  console.log('\n=== TEST 3: TABLET VIEWPORT (768x1024) ===');
  await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle0' });
  const tabletData = await page.evaluate(() => {
    const hero = document.getElementById('hero');
    const img = document.querySelector('.hero-bg-img');
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      heroHeight: hero.clientHeight,
      imgNatural: img ? `${img.naturalWidth}x${img.naturalHeight}` : null,
      imgDisplay: img ? `${img.clientWidth}x${img.clientHeight}` : null
    };
  });
  console.log('Tablet 768 Data:', tabletData);
  const heroEl768 = await page.$('#hero');
  await heroEl768.screenshot({ path: path.join(ARTIFACTS_DIR, 'hero_lineart_tablet_768.png') });
  console.log('Saved hero_lineart_tablet_768.png');

  console.log('\n=== TEST 4: MOBILE VIEWPORT (390x844) ===');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle0' });
  const mobileData = await page.evaluate(() => {
    const hero = document.getElementById('hero');
    const img = document.querySelector('.hero-bg-img');
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      heroHeight: hero.clientHeight,
      imgDisplay: img ? `${img.clientWidth}x${img.clientHeight}` : null
    };
  });
  console.log('Mobile 390 Data:', mobileData);
  const heroEl390 = await page.$('#hero');
  await heroEl390.screenshot({ path: path.join(ARTIFACTS_DIR, 'hero_lineart_mobile_390.png') });
  console.log('Saved hero_lineart_mobile_390.png');

  console.log('\n=== TEST 5: DARK MODE PERSISTENCE CHECK ===');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  });
  await new Promise(r => setTimeout(r, 200));
  const darkModeData = await page.evaluate(() => {
    const hero = document.getElementById('hero');
    const h1 = document.getElementById('heroH1');
    return {
      heroBg: window.getComputedStyle(hero).backgroundColor,
      h1Color: window.getComputedStyle(h1).color
    };
  });
  const heroElDark = await page.$('#hero');
  await heroElDark.screenshot({ path: path.join(ARTIFACTS_DIR, 'hero_lineart_darkmode_1440.png') });
  console.log('Saved hero_lineart_darkmode_1440.png');

  console.log('\n=== TEST 6: NETWORK & CONSOLE AUDIT ===');
  console.log('Failed Requests:', failedRequests.length, failedRequests);
  console.log('Console Errors:', consoleErrors.length, consoleErrors);

  await browser.close();
  console.log('=== VERIFICATION COMPLETED ===');
})();
