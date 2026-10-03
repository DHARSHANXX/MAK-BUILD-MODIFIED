const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 5599;
const ROOT_DIR = path.resolve(__dirname, '..');
const ARTIFACTS_DIR = 'C:\\Users\\DHARSHAN\\.gemini\\antigravity\\brain\\4a32252f-1f0e-4131-8d2d-440c322de3e1';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(ROOT_DIR, reqPath);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404); res.end('404'); return;
  }
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, async () => {
  console.log(`Verification server running on http://localhost:${PORT}`);
  let browser;
  try {
    browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    const consoleErrors = [];
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
    page.on('pageerror', err => consoleErrors.push(err.toString()));

    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle0' });

    // Ensure Slide 1 is active (pause autoplay to inspect)
    await page.evaluate(() => {
      const dots = document.querySelectorAll('.hero-dot');
      if (dots.length > 0) dots[0].click();
      window.isHeroPaused = true;
    });
    await new Promise(r => setTimeout(r, 400));

    const slide1Info = await page.evaluate(() => {
      const slide = document.querySelector('.hero-slide[data-slide="villa-contemporary-after"]');
      const img = slide ? slide.querySelector('img') : null;
      return {
        active: slide ? slide.classList.contains('active') : false,
        currentSrc: img ? img.currentSrc : null,
        naturalWidth: img ? img.naturalWidth : null,
        naturalHeight: img ? img.naturalHeight : null,
        offsetWidth: img ? img.offsetWidth : null,
        offsetHeight: img ? img.offsetHeight : null
      };
    });
    console.log('Hero Slide 1 Blueprint Info:', slide1Info);

    const hero = await page.$('#hero');
    if (hero) {
      await hero.screenshot({ path: path.join(ARTIFACTS_DIR, 'qa_hero_slide1_blueprint_desktop.png') });
      console.log('Saved qa_hero_slide1_blueprint_desktop.png');
    }

    // Mobile Viewport (390x844)
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3 });
    await page.evaluate(() => {
      const dots = document.querySelectorAll('.hero-dot');
      if (dots.length > 0) dots[0].click();
    });
    await new Promise(r => setTimeout(r, 400));
    if (hero) {
      await hero.screenshot({ path: path.join(ARTIFACTS_DIR, 'qa_hero_slide1_blueprint_mobile.png') });
      console.log('Saved qa_hero_slide1_blueprint_mobile.png');
    }

    console.log(`Console Errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      consoleErrors.forEach(e => console.error('  Error:', e));
    } else {
      console.log('Zero console errors!');
    }
  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    if (browser) await browser.close();
    server.close();
    console.log('Verification server closed.');
  }
});
