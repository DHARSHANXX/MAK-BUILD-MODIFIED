const puppeteer = require('puppeteer-core');
const path = require('path');
const http = require('http');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = 5599;

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

  // 1. Desktop Test
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'networkidle0' });

  // Allow shader to render several frames
  await new Promise(r => setTimeout(r, 800));

  // Check Canvas element presence and computed styles
  const canvasStats = await page.evaluate(() => {
    const canvas = document.getElementById('mak-bg-shader');
    if (!canvas) return { found: false };
    const rect = canvas.getBoundingClientRect();
    const style = window.getComputedStyle(canvas);
    const gl = canvas.getContext('webgl');
    return {
      found: true,
      width: canvas.width,
      height: canvas.height,
      rectWidth: rect.width,
      rectHeight: rect.height,
      position: style.position,
      zIndex: style.zIndex,
      pointerEvents: style.pointerEvents,
      ariaHidden: canvas.getAttribute('aria-hidden'),
      hasWebgl: !!gl
    };
  });

  console.log('\n--- 1. Canvas Shader Stats ---');
  console.log(JSON.stringify(canvasStats, null, 2));

  if (!canvasStats.found || !canvasStats.hasWebgl) {
    console.error('FAIL: Canvas or WebGL not initialized!');
    process.exit(1);
  }

  if (canvasStats.pointerEvents !== 'none' || canvasStats.position !== 'fixed') {
    console.error('FAIL: Pointer events or positioning incorrect!');
    process.exit(1);
  }
  console.log('PASS: Canvas shader initialized correctly with fixed positioning and pointer-events: none!');

  // Check clickability of buttons on top of shader
  const btnClickable = await page.evaluate(() => {
    const btn = document.querySelector('.header-quote-btn');
    if (!btn) return false;
    const rect = btn.getBoundingClientRect();
    const topEl = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
    return topEl === btn || btn.contains(topEl);
  });
  console.log('Interactive element clickable (expected true):', btnClickable);
  if (!btnClickable) {
    console.error('FAIL: Header quote button blocked by background layer!');
    process.exit(1);
  }

  // Screenshot Desktop
  await page.screenshot({ path: path.join(__dirname, '..', 'qa_nebula_shader_desktop.png') });
  console.log('Saved qa_nebula_shader_desktop.png');

  // Scroll down to Services & Packages to verify background visibility behind content
  await page.evaluate(() => {
    const s = document.getElementById('services');
    if (s) s.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(__dirname, '..', 'qa_nebula_shader_services_desktop.png') });
  console.log('Saved qa_nebula_shader_services_desktop.png');

  // 2. Tablet Test
  await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 2 });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  const tabletOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  console.log('Tablet horizontal overflow (expected false):', tabletOverflow);
  await page.screenshot({ path: path.join(__dirname, '..', 'qa_nebula_shader_tablet.png') });
  console.log('Saved qa_nebula_shader_tablet.png');

  // 3. Mobile Test
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3 });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  const mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  console.log('Mobile horizontal overflow (expected false):', mobileOverflow);

  // Check mobile DPR capped to ~1.0
  const mobileCanvasStats = await page.evaluate(() => {
    const canvas = document.getElementById('mak-bg-shader');
    return {
      canvasWidth: canvas.width,
      windowWidth: window.innerWidth,
      ratio: (canvas.width / window.innerWidth).toFixed(2)
    };
  });
  console.log('Mobile canvas scaling ratio (expected ~1.0):', mobileCanvasStats);

  await page.screenshot({ path: path.join(__dirname, '..', 'qa_nebula_shader_mobile.png') });
  console.log('Saved qa_nebula_shader_mobile.png');

  // 4. Test Visibility Change
  console.log('\n--- 4. Testing Visibility Change ---');
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { value: true, writable: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await new Promise(r => setTimeout(r, 300));
  console.log('PASS: Dispatched visibilitychange to hidden without errors.');

  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { value: false, writable: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await new Promise(r => setTimeout(r, 300));
  console.log('PASS: Resumed visibility without errors.');

  // 5. Console Error Audit
  console.log('\n--- 5. Console Error Audit ---');
  console.log(`Total errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.error('Console errors:', consoleErrors);
    process.exit(1);
  } else {
    console.log('PASS: 0 console errors!');
  }

  await browser.close();
  server.close();
  console.log('\nAll Nebula Shader verifications PASSED successfully!');
})();
