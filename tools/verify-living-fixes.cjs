const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 5595;
const ROOT_DIR = path.resolve(__dirname, '..');

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
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
    return;
  }
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}`);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

  // 1. Hero Slide 4 (Living Room slide)
  console.log('Testing Hero Slide 4...');
  const dots = await page.$$('.hero-dot');
  if (dots.length >= 4) {
    await dots[3].click();
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ROOT_DIR, 'qa_hero_living_slide.png') });
    console.log('Saved qa_hero_living_slide.png');
  }

  // 2. 3D Designs Card (Living & Dining)
  console.log('Testing 3D Living & Dining Card...');
  const cardLiving = await page.$('.project-card[data-id="living-dining-3d"]');
  if (cardLiving) {
    await cardLiving.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }));
    await new Promise(r => setTimeout(r, 600));
    await cardLiving.screenshot({ path: path.join(ROOT_DIR, 'qa_card_living_3d.png') });
    console.log('Saved qa_card_living_3d.png');
  }

  // 3. Lightbox on Living & Dining
  console.log('Testing Lightbox on Living & Dining...');
  const viewRenderBtn = await page.$('.project-card[data-id="living-dining-3d"] .view-proj-btn');
  if (viewRenderBtn) {
    await viewRenderBtn.click();
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ROOT_DIR, 'qa_lightbox_living_test.png') });
    console.log('Saved qa_lightbox_living_test.png');
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 300));
  }

  // 4. Mobile Hero View (Slide 4)
  console.log('Testing Mobile Hero Slide 4...');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3 });
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
  const dotsMobile = await page.$$('.hero-dot');
  if (dotsMobile.length >= 4) {
    await dotsMobile[3].click();
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ROOT_DIR, 'qa_hero_living_mobile.png') });
    console.log('Saved qa_hero_living_mobile.png');
  }

  await browser.close();
  server.close();
  console.log('Living room verification completed successfully!');
  process.exit(0);
});
