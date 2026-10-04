const puppeteer = require('puppeteer-core');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const path = require('path');
const ARTIFACTS_DIR = 'C:\\Users\\DHARSHAN\\.gemini\\antigravity\\brain\\4a32252f-1f0e-4131-8d2d-440c322de3e1';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', executablePath: CHROME_PATH, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 360, height: 800, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle0' });

  // Scroll to estimator box specifically
  await page.evaluate(() => {
    const box = document.querySelector('.estimator-box');
    box.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 600));

  const box = await page.$('.estimator-box');
  if (box) {
    await box.screenshot({ path: path.join(ARTIFACTS_DIR, 'mobile_360_estimator_box_default.png') });
  }

  // Set area to 7500 sq ft (large value)
  await page.evaluate(() => {
    const areaInput = document.getElementById('estAreaInput');
    const areaRange = document.getElementById('estAreaRange');
    areaInput.value = '7500';
    areaRange.value = '7500';
    areaInput.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await new Promise(r => setTimeout(r, 400));
  if (box) {
    await box.screenshot({ path: path.join(ARTIFACTS_DIR, 'mobile_360_estimator_box_large.png') });
  }

  await browser.close();
  console.log('Estimator box screenshots captured successfully!');
})();
