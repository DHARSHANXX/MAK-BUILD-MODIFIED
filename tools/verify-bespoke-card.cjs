const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACTS_DIR = 'C:\\Users\\DHARSHAN\\.gemini\\antigravity\\brain\\4a32252f-1f0e-4131-8d2d-440c322de3e1';

async function verify() {
  console.log('Launching browser to capture Bespoke Living & Modular Kitchen card...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  await page.goto('http://localhost:3000/#work', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));

  // Switch to Interiors tab if needed or find card
  await page.evaluate(() => {
    const el = document.querySelector('.project-card[data-id="bespoke-living-kitchen"]');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 600));

  const cardEl = await page.$('.project-card[data-id="bespoke-living-kitchen"]');
  if (cardEl) {
    const cardScreenshotPath = path.join(ARTIFACTS_DIR, 'bespoke_living_card_desktop.png');
    await cardEl.screenshot({ path: cardScreenshotPath });
    console.log('Desktop card screenshot saved to:', cardScreenshotPath);
  } else {
    console.error('Card not found!');
  }

  // Open Lightbox
  const mediaWrap = await page.$('.project-card[data-id="bespoke-living-kitchen"] .project-media-wrap');
  if (mediaWrap) {
    await mediaWrap.click();
    await new Promise(r => setTimeout(r, 600));
    const lbScreenshotPath = path.join(ARTIFACTS_DIR, 'bespoke_living_lightbox.png');
    await page.screenshot({ path: lbScreenshotPath });
    console.log('Lightbox screenshot saved to:', lbScreenshotPath);
  }

  // Mobile viewport
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/#work', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));
  await page.evaluate(() => {
    const el = document.querySelector('.project-card[data-id="bespoke-living-kitchen"]');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 600));
  const mobileCard = await page.$('.project-card[data-id="bespoke-living-kitchen"]');
  if (mobileCard) {
    const mobileScreenshotPath = path.join(ARTIFACTS_DIR, 'bespoke_living_card_mobile.png');
    await mobileCard.screenshot({ path: mobileScreenshotPath });
    console.log('Mobile card screenshot saved to:', mobileScreenshotPath);
  }

  await browser.close();
  console.log('Verification finished.');
}

verify().catch(e => console.error(e));
