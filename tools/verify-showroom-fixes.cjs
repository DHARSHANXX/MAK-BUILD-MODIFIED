const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 5599;
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

  // 1. Hero Slide 3 (Showroom slide)
  console.log('Testing Hero Slide 3...');
  // Click 3rd hero dot
  const dots = await page.$$('.hero-dot');
  if (dots.length >= 3) {
    await dots[2].click();
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ROOT_DIR, 'qa_hero_showroom_slide.png') });
    console.log('Saved qa_hero_showroom_slide.png');
  }

  // 2. 3D Designs Card (Showroom Interior)
  console.log('Testing 3D Showroom Card...');
  const card3d = await page.$('.project-card[data-id="showroom-interior-3d"]');
  if (card3d) {
    await card3d.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }));
    await new Promise(r => setTimeout(r, 600));
    await card3d.screenshot({ path: path.join(ROOT_DIR, 'qa_card_showroom_3d.png') });
    console.log('Saved qa_card_showroom_3d.png');
  }

  // 3. Before/After Commercial Retail Showroom Slider
  console.log('Testing Commercial Retail Slider...');
  const commCard = await page.$('.project-card[data-id="commercial-retail-showroom"]');
  if (commCard) {
    await commCard.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }));
    await new Promise(r => setTimeout(r, 600));
    await commCard.screenshot({ path: path.join(ROOT_DIR, 'qa_commercial_slider_after.png') });
    console.log('Saved qa_commercial_slider_after.png');
  }

  // 4. Mobile Hero Showroom View
  console.log('Testing Mobile Hero Showroom...');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3 });
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
  const dotsMobile = await page.$$('.hero-dot');
  if (dotsMobile.length >= 3) {
    await dotsMobile[2].click();
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ROOT_DIR, 'qa_hero_showroom_mobile.png') });
    console.log('Saved qa_hero_showroom_mobile.png');
  }

  await browser.close();
  server.close();
  console.log('Verification completed successfully!');
  process.exit(0);
});
