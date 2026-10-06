const puppeteer = require('puppeteer-core');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const path = require('path');
const ARTIFACTS_DIR = 'C:\\Users\\DHARSHAN\\.gemini\\antigravity\\brain\\4a32252f-1f0e-4131-8d2d-440c322de3e1';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', executablePath: CHROME_PATH, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 360, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle0' });

  // Toggle to Tamil
  await page.evaluate(() => {
    const langBtn = document.getElementById('langToggleBtn');
    if (langBtn) langBtn.click();
    const bar = document.querySelector('.hero-info-bar');
    bar.scrollIntoView({ block: 'center' });
  });
  await new Promise(r => setTimeout(r, 600));

  const bar = await page.$('.hero-info-bar');
  if (bar) {
    await bar.screenshot({ path: path.join(ARTIFACTS_DIR, 'hero_banner_photo_mobile_tamil.png') });
  }

  const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
  console.log('Tamil mobile scrollWidth:', scrollW);

  await browser.close();
})();
