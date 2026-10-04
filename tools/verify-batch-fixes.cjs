const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ROOT_DIR = path.resolve(__dirname, '..');
const URL = 'http://localhost:3000/index.html';

(async () => {
  console.log('Connecting to Chrome...');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => {
    errors.push(err.toString());
  });

  // 1. Desktop 1440px
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  // Verify Trust Strip (Image 1 - Single line)
  const trustStrip = await page.$('.trust-strip');
  if (trustStrip) {
    await trustStrip.scrollIntoView();
    await new Promise(r => setTimeout(r, 400));
    await trustStrip.screenshot({ path: path.join(ROOT_DIR, 'qa_batch_trust_strip_single_line.png') });
    console.log('Saved qa_batch_trust_strip_single_line.png');

    // Verify item bounding rects are vertically aligned on the same Y position
    const itemYs = await page.$$eval('.trust-item', els => els.map(e => e.getBoundingClientRect().top));
    console.log('Trust items Y positions:', itemYs);
    const isSingleLine = itemYs.length > 0 && itemYs.every(y => Math.abs(y - itemYs[0]) < 6);
    console.log('Is single line:', isSingleLine);
  }

  // Verify Stats Strip (Image 2 - 10+, 20+, 100%, 50+)
  const statsStrip = await page.$('#statsStrip');
  if (statsStrip) {
    await statsStrip.scrollIntoView();
    // Allow counter animation to finish
    await new Promise(r => setTimeout(r, 2200));
    await statsStrip.screenshot({ path: path.join(ROOT_DIR, 'qa_batch_stats_strip.png') });
    console.log('Saved qa_batch_stats_strip.png');

    const statValues = await page.$$eval('.stat-number', els => els.map(e => e.textContent.trim()));
    console.log('Rendered stats values:', statValues);
  }

  // Verify Studio WhatsApp Button (Image 3 - WhatsApp logo correction)
  const studioActions = await page.$('.studio-actions-row');
  if (studioActions) {
    await studioActions.scrollIntoView();
    await new Promise(r => setTimeout(r, 400));
    await studioActions.screenshot({ path: path.join(ROOT_DIR, 'qa_batch_studio_whatsapp_btn.png') });
    console.log('Saved qa_batch_studio_whatsapp_btn.png');
  }

  // Verify Background Animation - 10 Second Monitor (Image 4 - No moving diagonal line)
  console.log('Monitoring background for 10 seconds...');
  const bgShots = [];
  for (let i = 0; i < 4; i++) {
    const filename = `qa_batch_bg_sample_${i + 1}.png`;
    await page.screenshot({ path: path.join(ROOT_DIR, filename), clip: { x: 100, y: 100, width: 600, height: 400 } });
    bgShots.push(filename);
    console.log(`Captured background frame ${i + 1}/4 (${filename})`);
    await new Promise(r => setTimeout(r, 2500));
  }

  // Check Responsive Overflow
  const viewports = [360, 390, 768, 1024, 1440];
  for (const w of viewports) {
    await page.setViewport({ width: w, height: 800 });
    const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log(`Viewport ${w}px overflow: ${hasOverflow}`);
  }

  console.log(`Total console errors: ${errors.length}`);
  if (errors.length > 0) console.error('Errors:', errors);

  await browser.close();
  process.exit(0);
})();
