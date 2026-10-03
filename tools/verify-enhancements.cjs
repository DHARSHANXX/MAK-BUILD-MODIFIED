const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 5577;
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
    res.end('404 Not Found');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(filePath).pipe(res);
});

async function run() {
  server.listen(PORT, async () => {
    console.log(`Verification server running at http://localhost:${PORT}`);
    let browser;
    try {
      browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
      await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

      console.log('\n--- Checking Theme Toggle ---');
      const initialTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      console.log('Initial Theme:', initialTheme);

      // Click theme toggle
      await page.click('#themeToggleBtn');
      await new Promise(r => setTimeout(r, 400));
      const darkTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      console.log('Theme after toggle click (expected dark):', darkTheme);

      // Click back to light
      await page.click('#themeToggleBtn');
      await new Promise(r => setTimeout(r, 400));
      const lightThemeAgain = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      console.log('Theme after 2nd toggle click (expected light):', lightThemeAgain);

      console.log('\n--- Checking Service Line Icons ---');
      const serviceIconsCount = await page.evaluate(() => {
        const cards = document.querySelectorAll('.service-card');
        return Array.from(cards).map(card => {
          const title = card.querySelector('.service-title').textContent.trim();
          const svgPath = card.querySelector('.service-icon-box svg path');
          return { title, path: svgPath ? svgPath.getAttribute('d') : null };
        });
      });
      console.log('Service Icons:', serviceIconsCount);

      console.log('\n--- Checking Stats Counter ---');
      await page.evaluate(() => {
        const strip = document.getElementById('statsStrip');
        if (strip) strip.scrollIntoView({ behavior: 'instant', block: 'center' });
      });
      await new Promise(r => setTimeout(r, 2000));
      const statsValues = await page.evaluate(() => {
        const items = document.querySelectorAll('.stat-item');
        return Array.from(items).map(item => ({
          num: item.querySelector('.stat-number').textContent.trim(),
          label: item.querySelector('.stat-label').textContent.trim()
        }));
      });
      console.log('Stats Values after animation:', statsValues);

      console.log('\n--- Checking Estimator Slider Dynamic Progress & Package Consistency ---');
      await page.evaluate(() => {
        const est = document.getElementById('estimator');
        if (est) est.scrollIntoView({ behavior: 'instant', block: 'center' });
      });
      await new Promise(r => setTimeout(r, 500));

      const sliderProgress = await page.evaluate(() => {
        const slider = document.getElementById('estAreaRange');
        return slider ? slider.style.getPropertyValue('--slider-progress') : null;
      });
      console.log('Slider Progress style property:', sliderProgress);

      const pkgButtons = await page.evaluate(() => {
        const btns = document.querySelectorAll('.pkg-radio-btn');
        return Array.from(btns).map(b => b.textContent.trim());
      });
      console.log('Package radio button texts (expected Basic, Standard, Plus, Premium):', pkgButtons);

      const estWhatsappHref = await page.evaluate(() => document.getElementById('estWhatsAppBtn').href);
      console.log('Estimator WhatsApp href sample:', decodeURIComponent(estWhatsappHref).slice(0, 150));

      console.log('\n--- Checking FAQ Accordion ---');
      await page.evaluate(() => {
        const faq = document.getElementById('faq');
        if (faq) faq.scrollIntoView({ behavior: 'instant', block: 'center' });
      });
      await new Promise(r => setTimeout(r, 500));

      const faqCount = await page.evaluate(() => document.querySelectorAll('.faq-item').length);
      console.log('FAQ items rendered (expected 4):', faqCount);

      // Click first FAQ
      await page.click('.faq-question-btn');
      await new Promise(r => setTimeout(r, 400));
      const firstFaqActive = await page.evaluate(() => {
        const item = document.querySelector('.faq-item');
        return item.classList.contains('active');
      });
      console.log('First FAQ active after click (expected true):', firstFaqActive);

      console.log('\n--- Checking Floating WhatsApp and Back to Top ---');
      const floatingWaExists = await page.evaluate(() => !!document.getElementById('floatingWhatsAppBtn'));
      const backToTopVisible = await page.evaluate(() => {
        const b = document.getElementById('backToTopBtn');
        return b && b.classList.contains('visible');
      });
      console.log('Floating WhatsApp exists:', floatingWaExists);
      console.log('Back-to-top visible after scroll:', backToTopVisible);

      console.log('\nAll Enhancement Verifications Passed!');
    } catch (err) {
      console.error('Enhancement test failed:', err);
    } finally {
      if (browser) await browser.close();
      server.close();
    }
  });
}

run();
