const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 5588;
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

  // 1. Commercial Retail Showroom card
  const commercialCard = await page.$('.project-card[data-id="commercial-retail-showroom"]');
  if (commercialCard) {
    await commercialCard.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }));
    await new Promise(r => setTimeout(r, 600));
    await commercialCard.screenshot({ path: path.join(ROOT_DIR, 'qa_commercial_slider.png') });
    console.log('Saved qa_commercial_slider.png');
  }

  // 2. Studio Card
  const studioCard = await page.$('.studio-card');
  if (studioCard) {
    await studioCard.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }));
    await new Promise(r => setTimeout(r, 600));
    await studioCard.screenshot({ path: path.join(ROOT_DIR, 'qa_studio_card_verified.png') });
    console.log('Saved qa_studio_card_verified.png');
  }

  // 3. Mobile viewport Studio Card
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3 });
  if (studioCard) {
    await studioCard.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }));
    await new Promise(r => setTimeout(r, 600));
    await studioCard.screenshot({ path: path.join(ROOT_DIR, 'qa_studio_card_mobile.png') });
    console.log('Saved qa_studio_card_mobile.png');
  }

  await browser.close();
  server.close();
  console.log('Visual verification complete!');
  process.exit(0);
});
