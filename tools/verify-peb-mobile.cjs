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
  
  for (const width of [360, 390, 768]) {
    await page.setViewport({ width, height: 900, deviceScaleFactor: 2 });
    await page.goto('http://localhost:3000/#work', { waitUntil: 'networkidle0' });
    
    const pebCard = await page.$('.project-card[data-id="peb-industrial-facility"]');
    if (pebCard) {
      await pebCard.scrollIntoView();
      await new Promise(r => setTimeout(r, 200));
      await pebCard.screenshot({ path: path.join(ARTIFACTS_DIR, `peb_card_mobile_${width}.png`) });
    }

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    console.log(`Viewport ${width}px -> scrollWidth: ${scrollWidth}, clientWidth: ${clientWidth}, overflow: ${scrollWidth - clientWidth}px`);
  }

  await browser.close();
})();
