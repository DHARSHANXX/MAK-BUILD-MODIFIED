const puppeteer = require('puppeteer-core');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = 'http://localhost:3000/index.html';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  const viewports = [360, 390, 414, 768];

  for (const w of viewports) {
    await page.setViewport({ width: w, height: 800 });
    await page.goto(URL, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    const overflowingElements = await page.evaluate((vw) => {
      const results = [];
      const all = document.querySelectorAll('*');
      for (const el of all) {
        const rect = el.getBoundingClientRect();
        if (rect.width > vw || rect.right > vw + 1 || rect.left < -1) {
          // Ignore html, body, and full-bleed backgrounds if overflow is hidden
          if (el.tagName === 'HTML' || el.tagName === 'BODY') continue;
          if (el.classList.contains('mak-bg-atmosphere') || el.classList.contains('mak-bg-shader')) continue;
          results.push({
            tag: el.tagName,
            id: el.id,
            className: el.className,
            width: Math.round(rect.width),
            left: Math.round(rect.left),
            right: Math.round(rect.right),
            vw: vw
          });
        }
      }
      return results;
    }, w);

    console.log(`=== Viewport ${w}px ===`);
    console.log(`Doc scrollWidth:`, await page.evaluate(() => document.documentElement.scrollWidth));
    console.log(`Window innerWidth:`, w);
    console.log(`Overflowing elements (${overflowingElements.length}):`);
    overflowingElements.slice(0, 15).forEach(e => {
      console.log(` - <${e.tag}> id="${e.id}" class="${e.className}" width=${e.width} right=${e.right}`);
    });
  }

  await browser.close();
})();
