const puppeteer = require('puppeteer-core');
const path = require('path');
const http = require('http');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = 5588;

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
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
  return types[ext] || 'application/octet-stream';
}

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let reqPath = req.url.split('?')[0].split('#')[0];
      if (reqPath === '/') reqPath = '/index.html';
      const filePath = path.join(ROOT_DIR, decodeURIComponent(reqPath));
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        res.writeHead(200, { 'Content-Type': getContentType(filePath) });
        fs.createReadStream(filePath).pipe(res);
      } else {
        res.writeHead(404);
        res.end('Not found');
      }
    });
    server.listen(PORT, () => resolve(server));
  });
}

(async () => {
  const server = await startServer();
  console.log(`Verification server running at http://localhost:${PORT}`);

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  // 1. Desktop Verification
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'networkidle0' });

  // Scroll to studio card
  await page.evaluate(() => {
    const card = document.querySelector('.studio-card');
    if (card) card.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 600));

  // Screenshot studio card
  const studioCardEl = await page.$('.studio-card');
  if (studioCardEl) {
    await studioCardEl.screenshot({ path: path.join(__dirname, '..', 'qa_studio_card_redesigned_desktop.png') });
    console.log('Saved qa_studio_card_redesigned_desktop.png');
  }

  // Screenshot signboard column directly
  const signboardCol = await page.$('.studio-signboard-col');
  if (signboardCol) {
    await signboardCol.screenshot({ path: path.join(__dirname, '..', 'qa_signboard_card_redesigned.png') });
    console.log('Saved qa_signboard_card_redesigned.png');
  }

  // 2. Tablet Verification (768px)
  await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 2 });
  await page.reload({ waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    const card = document.querySelector('.studio-card');
    if (card) card.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 500));
  const tabletCard = await page.$('.studio-card');
  if (tabletCard) {
    await tabletCard.screenshot({ path: path.join(__dirname, '..', 'qa_studio_card_redesigned_tablet.png') });
    console.log('Saved qa_studio_card_redesigned_tablet.png');
  }

  // 3. Mobile Verification (390px)
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3 });
  await page.reload({ waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    const card = document.querySelector('.studio-card');
    if (card) card.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 500));
  const mobileCard = await page.$('.studio-card');
  if (mobileCard) {
    await mobileCard.screenshot({ path: path.join(__dirname, '..', 'qa_studio_card_redesigned_mobile.png') });
    console.log('Saved qa_studio_card_redesigned_mobile.png');
  }

  console.log('\n--- Console Errors Check ---');
  console.log(`Total errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.error('Console errors:', consoleErrors);
    process.exit(1);
  } else {
    console.log('PASS: 0 console errors!');
  }

  await browser.close();
  server.close();
  console.log('Studio card redesign verification completed successfully!');
})();
