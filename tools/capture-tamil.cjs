const puppeteer = require('puppeteer-core');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const path = require('path');
const ARTIFACTS_DIR = 'C:\\Users\\DHARSHAN\\.gemini\\antigravity\\brain\\4a32252f-1f0e-4131-8d2d-440c322de3e1';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', executablePath: CHROME_PATH, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 360, height: 800, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle0' });

  // Toggle to Tamil
  await page.evaluate(() => {
    const langBtn = document.getElementById('langToggleBtn');
    if (langBtn) langBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));

  // Scroll to estimator box specifically
  await page.evaluate(() => {
    const box = document.querySelector('.estimator-box');
    box.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 600));

  const box = await page.$('.estimator-box');
  if (box) {
    await box.screenshot({ path: path.join(ARTIFACTS_DIR, 'mobile_360_estimator_box_tamil.png') });
  }

  await browser.close();
  console.log('Tamil estimator box screenshot captured successfully!');
})();
