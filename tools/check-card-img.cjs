const puppeteer = require('puppeteer-core');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/#work', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));

  await page.evaluate(() => {
    const card = document.querySelector('.project-card[data-id="bespoke-living-kitchen"]');
    if (card) card.scrollIntoView();
  });
  await page.waitForFunction(() => {
    const img = document.querySelector('.project-card[data-id="bespoke-living-kitchen"] img');
    return img && img.complete && img.naturalWidth > 0;
  }, { timeout: 5000 }).catch(() => {});

  const info = await page.evaluate(() => {
    const card = document.querySelector('.project-card[data-id="bespoke-living-kitchen"]');
    if (!card) return null;
    const img = card.querySelector('img');
    const sources = Array.from(card.querySelectorAll('source')).map(s => ({ type: s.type, srcset: s.srcset, sizes: s.sizes }));
    return {
      currentSrc: img ? img.currentSrc : null,
      naturalWidth: img ? img.naturalWidth : null,
      naturalHeight: img ? img.naturalHeight : null,
      clientWidth: img ? img.clientWidth : null,
      clientHeight: img ? img.clientHeight : null,
      sources
    };
  });
  console.log('Image Info on Desktop 2x:', JSON.stringify(info, null, 2));

  // Also check on mobile DPR=3
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3 });
  await page.goto('http://localhost:3000/#work', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));
  await page.evaluate(() => {
    const card = document.querySelector('.project-card[data-id="bespoke-living-kitchen"]');
    if (card) card.scrollIntoView();
  });
  await page.waitForFunction(() => {
    const img = document.querySelector('.project-card[data-id="bespoke-living-kitchen"] img');
    return img && img.complete && img.naturalWidth > 0;
  }, { timeout: 5000 }).catch(() => {});

  const mobileInfo = await page.evaluate(() => {
    const card = document.querySelector('.project-card[data-id="bespoke-living-kitchen"]');
    if (!card) return null;
    const img = card.querySelector('img');
    return {
      currentSrc: img ? img.currentSrc : null,
      naturalWidth: img ? img.naturalWidth : null,
      naturalHeight: img ? img.naturalHeight : null,
      clientWidth: img ? img.clientWidth : null,
      clientHeight: img ? img.clientHeight : null
    };
  });
  console.log('Image Info on Mobile 3x:', JSON.stringify(mobileInfo, null, 2));

  await browser.close();
})();
