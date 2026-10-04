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

  // Test 1: 360px viewport - Default Estimator
  await page.setViewport({ width: 360, height: 800, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  // Screenshot Estimator at default
  const estEl = await page.$('#estimator');
  if (estEl) {
    await estEl.screenshot({ path: path.join(ARTIFACTS_DIR, 'mobile_360_estimator_default.png') });
  }

  // Set slider to large area (e.g. 7000 sq ft) to test large range wrapping like ₹171 Lakhs
  await page.evaluate(() => {
    const areaInput = document.getElementById('estAreaInput');
    const areaRange = document.getElementById('estAreaRange');
    if (areaInput && areaRange) {
      areaInput.value = '7500';
      areaRange.value = '7500';
      areaInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  await new Promise(r => setTimeout(r, 300));
  if (estEl) {
    await estEl.screenshot({ path: path.join(ARTIFACTS_DIR, 'mobile_360_estimator_large.png') });
  }

  // Screenshot Instagram Follow Card
  const instaCard = await page.$('.instagram-follow-card');
  if (instaCard) {
    await instaCard.screenshot({ path: path.join(ARTIFACTS_DIR, 'mobile_360_instagram_card.png') });
  }

  // Screenshot Project Card (with CTA buttons)
  const projCard = await page.$('.project-card');
  if (projCard) {
    await projCard.screenshot({ path: path.join(ARTIFACTS_DIR, 'mobile_360_project_card.png') });
  }

  // Screenshot Bottom Mobile Bar & Footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'mobile_360_bottom_footer.png') });

  // Test Tamil toggle
  await page.evaluate(() => {
    const langBtn = document.getElementById('langToggleBtn');
    if (langBtn) langBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));
  const estTamil = await page.$('#estimator');
  if (estTamil) {
    await estTamil.screenshot({ path: path.join(ARTIFACTS_DIR, 'mobile_360_estimator_tamil.png') });
  }

  // Check scrollWidth in Tamil mode
  const tamilScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  console.log('Tamil 360px scrollWidth:', tamilScrollWidth);

  // Switch back to English
  await page.evaluate(() => {
    const langBtn = document.getElementById('langToggleBtn');
    if (langBtn) langBtn.click();
  });

  // Test 2: 390px viewport
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));
  const est390 = await page.$('#estimator');
  if (est390) {
    await est390.screenshot({ path: path.join(ARTIFACTS_DIR, 'mobile_390_estimator.png') });
  }

  await browser.close();
  console.log('QA Screenshots captured successfully!');
})();
