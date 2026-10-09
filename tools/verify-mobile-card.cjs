const puppeteer = require('puppeteer-core');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACTS_DIR = 'C:\\Users\\DHARSHAN\\.gemini\\antigravity\\brain\\4a32252f-1f0e-4131-8d2d-440c322de3e1';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
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
    await mobileCard.screenshot({ path: `${ARTIFACTS_DIR}/bespoke_living_card_mobile_clean.png` });
    console.log('Saved clean mobile card screenshot');
  }
  await browser.close();
})();
