const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACTS_DIR = 'C:\\Users\\DHARSHAN\\.gemini\\antigravity\\brain\\4a32252f-1f0e-4131-8d2d-440c322de3e1';

const viewports = [
  { width: 360, height: 800, dpr: 1, name: 'about_360' },
  { width: 390, height: 844, dpr: 2, name: 'about_390' },
  { width: 768, height: 1024, dpr: 1, name: 'about_768' },
  { width: 1024, height: 768, dpr: 1, name: 'about_1024' },
  { width: 1366, height: 768, dpr: 1, name: 'about_1366' },
  { width: 1920, height: 1080, dpr: 1, name: 'about_1920' },
  { width: 1440, height: 900, dpr: 1.25, name: 'about_1440_125pct' }
];

async function runTests() {
  console.log('Starting Puppeteer tests for rebuilt About profile card...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));

  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: vp.dpr });
    await page.goto('http://localhost:3000/#about', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 400));

    // Scroll to about section
    await page.evaluate(() => {
      const el = document.getElementById('about');
      if (el) el.scrollIntoView();
    });
    await new Promise(r => setTimeout(r, 400));

    // Check card properties
    const cardMetrics = await page.evaluate(() => {
      const card = document.querySelector('.studio-profile-card');
      const name = document.querySelector('.profile-card-name');
      const btn = document.querySelector('.profile-card-btn');
      const badges = document.querySelectorAll('.profile-badge');
      const body = document.body;

      return {
        cardFound: !!card,
        cardWidth: card ? card.offsetWidth : 0,
        cardHeight: card ? card.offsetHeight : 0,
        aspectRatio: card ? (card.offsetWidth / card.offsetHeight).toFixed(2) : 0,
        nameText: name ? name.textContent : '',
        btnText: btn ? btn.textContent.trim() : '',
        btnHref: btn ? btn.href : '',
        badgeCount: badges.length,
        hasHorizontalScroll: body.scrollWidth > window.innerWidth
      };
    });

    console.log(`[Viewport ${vp.name} (${vp.width}x${vp.height})]`, cardMetrics);

    // Capture screenshot
    const shotPath = path.join(ARTIFACTS_DIR, `${vp.name}.png`);
    const cardEl = await page.$('.studio-card');
    if (cardEl) {
      await cardEl.screenshot({ path: shotPath });
    }
  }

  // Test Tamil language toggle
  await page.setViewport({ width: 1366, height: 768, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3000/#about', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 400));

  console.log('\nTesting Tamil translation toggle...');
  const langBtn = await page.$('#langToggleBtn');
  if (langBtn) {
    await langBtn.click();
    await new Promise(r => setTimeout(r, 600));

    const taStrings = await page.evaluate(() => {
      const name = document.querySelector('.profile-card-name');
      const badges = Array.from(document.querySelectorAll('.profile-badge')).map(b => b.textContent);
      const address = document.querySelector('.profile-card-address span');
      const btn = document.querySelector('.profile-card-btn');
      return {
        name: name ? name.textContent : '',
        badges,
        address: address ? address.textContent : '',
        btn: btn ? btn.textContent.trim() : ''
      };
    });
    console.log('Tamil translated strings:', taStrings);

    const shotTaPath = path.join(ARTIFACTS_DIR, 'about_card_tamil.png');
    const cardEl = await page.$('.studio-card');
    if (cardEl) {
      await cardEl.screenshot({ path: shotTaPath });
      console.log('Tamil screenshot saved to:', shotTaPath);
    }
  }

  // Test Dark theme toggle
  console.log('\nTesting Dark mode toggle...');
  const themeBtn = await page.$('#themeToggleBtn');
  if (themeBtn) {
    await themeBtn.click();
    await new Promise(r => setTimeout(r, 600));

    const themeState = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme');
    });
    console.log('Theme state:', themeState);

    const shotDarkPath = path.join(ARTIFACTS_DIR, 'about_card_dark_theme.png');
    const cardEl = await page.$('.studio-card');
    if (cardEl) {
      await cardEl.screenshot({ path: shotDarkPath });
      console.log('Dark theme screenshot saved to:', shotDarkPath);
    }
  }

  console.log('\nConsole Errors:', errors.length ? errors : 'None');
  await browser.close();
  console.log('All tests completed successfully!');
}

runTests().catch(e => console.error(e));
