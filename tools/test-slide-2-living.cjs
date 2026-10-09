const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACTS_DIR = 'C:\\Users\\DHARSHAN\\.gemini\\antigravity\\brain\\4a32252f-1f0e-4131-8d2d-440c322de3e1';

function parseRgb(colorStr) {
  const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return [255, 255, 255];
  return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
}

function luminance(r, g, b) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function contrastRatio(rgb1, rgb2) {
  const lum1 = luminance(...rgb1);
  const lum2 = luminance(...rgb2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

(async () => {
  console.log('--- Testing New Slide 2 Living Room Interior in Chrome ---');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const networkRequests = [];
  const errors = [];

  page.on('response', resp => {
    const url = resp.url();
    if (url.includes('slide-2-living')) {
      networkRequests.push({ url, status: resp.status() });
    }
  });

  page.on('pageerror', err => errors.push(err.message));

  // 1. Desktop Test (1440x900)
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/#hero', { waitUntil: 'networkidle2' });

  // Switch to Slide 2
  await page.evaluate(() => {
    const dots = document.querySelectorAll('.hero-dot');
    if (dots[1]) dots[1].click();
  });
  await new Promise(r => setTimeout(r, 700));

  const desktopSlide2Data = await page.evaluate(() => {
    const slide2 = document.querySelector('.hero-slide[data-slide="slide-2-living"]');
    const chip = document.getElementById('heroSlideChip');
    const img = slide2 ? slide2.querySelector('img') : null;
    const picture = slide2 ? slide2.querySelector('picture') : null;
    const sources = picture ? Array.from(picture.querySelectorAll('source')).map(s => ({
      type: s.getAttribute('type'),
      srcset: s.getAttribute('srcset')
    })) : [];

    const h1 = document.querySelector('.hero-h1');
    const card = document.querySelector('.hero-content');
    const infoBar = document.querySelector('.hero-info-bar');
    const infoText = document.querySelector('.hero-info-item span');

    return {
      slideFound: !!slide2,
      slideIsActive: slide2 ? slide2.classList.contains('active') : false,
      chipVisible: chip ? window.getComputedStyle(chip).display !== 'none' : false,
      chipText: chip ? chip.textContent.trim() : '',
      imgSrc: img ? img.src : '',
      imgCurrentSrc: img ? img.currentSrc : '',
      imgComplete: img ? img.complete : false,
      naturalWidth: img ? img.naturalWidth : 0,
      naturalHeight: img ? img.naturalHeight : 0,
      sourcesCount: sources.length,
      sources,
      cardBg: window.getComputedStyle(card).backgroundColor,
      cardBackdropFilter: window.getComputedStyle(card).backdropFilter,
      h1Color: window.getComputedStyle(h1).color,
      infoBarBg: window.getComputedStyle(infoBar).backgroundColor,
      infoTextColor: window.getComputedStyle(infoText).color
    };
  });

  console.log('Desktop Slide 2 Data:', JSON.stringify(desktopSlide2Data, null, 2));
  console.log('Network Requests for Slide 2:', networkRequests);

  // Check contrast
  const bgRgb = parseRgb(desktopSlide2Data.infoBarBg);
  const textRgb = parseRgb(desktopSlide2Data.infoTextColor);
  const cr = contrastRatio(textRgb, bgRgb);
  console.log(`Contrast Ratio on Slide 2 info bar: ${cr.toFixed(2)}:1`);

  // Capture desktop screenshot
  const desktopShotPath = path.join(ARTIFACTS_DIR, 'slide_2_living_desktop_1440.png');
  await page.screenshot({ path: desktopShotPath, fullPage: false });
  console.log('Saved desktop screenshot to:', desktopShotPath);

  // 2. Mobile Test (390x844)
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await new Promise(r => setTimeout(r, 500));

  const mobileSlide2Data = await page.evaluate(() => {
    const card = document.querySelector('.hero-content');
    const hero = document.getElementById('hero');
    const img = document.querySelector('.hero-slide[data-slide="slide-2-living"] img');
    const infoBar = document.querySelector('.hero-info-bar');

    const heroRect = hero.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const infoRect = infoBar.getBoundingClientRect();

    return {
      imgCurrentSrc: img ? img.currentSrc : '',
      cardHeightRatio: ((cardRect.height / heroRect.height) * 100).toFixed(1) + '%',
      verticalGap: (infoRect.top - cardRect.bottom).toFixed(1) + 'px',
      hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth
    };
  });

  console.log('Mobile Slide 2 Data:', mobileSlide2Data);

  // Capture mobile screenshot
  const mobileShotPath = path.join(ARTIFACTS_DIR, 'slide_2_living_mobile_390.png');
  await page.screenshot({ path: mobileShotPath, fullPage: false });
  console.log('Saved mobile screenshot to:', mobileShotPath);

  console.log('Errors count:', errors.length);
  await browser.close();
  console.log('--- Slide 2 Verification Complete ---');
})();
