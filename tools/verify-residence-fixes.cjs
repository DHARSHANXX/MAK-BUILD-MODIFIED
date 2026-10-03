const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 5577;
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
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(filePath).pipe(res);
});

async function runVerification() {
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
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });
      page.on('pageerror', err => consoleErrors.push(err.toString()));

      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
      await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle0' });

      console.log('1. Page loaded. Switching to Hero Slide 2 (Contemporary Two-Storey Residence)...');
      
      // Click dot 2 (index 1)
      await page.evaluate(() => {
        const dots = document.querySelectorAll('.hero-dot');
        if (dots.length > 1) {
          dots[1].click();
        }
      });
      await new Promise(r => setTimeout(r, 600));

      const heroSlideInfo = await page.evaluate(() => {
        const slide = document.querySelector('.hero-slide[data-slide="residence-elevation"]');
        const img = slide ? slide.querySelector('img') : null;
        return {
          active: slide ? slide.classList.contains('active') : false,
          currentSrc: img ? img.currentSrc : null,
          naturalWidth: img ? img.naturalWidth : null,
          naturalHeight: img ? img.naturalHeight : null,
          renderedWidth: img ? img.offsetWidth : null,
          renderedHeight: img ? img.offsetHeight : null
        };
      });
      console.log('Hero Slide 2 Info:', heroSlideInfo);

      // Screenshot Hero Slide 2
      const heroSection = await page.$('#hero');
      if (heroSection) {
        await heroSection.screenshot({ path: path.join(ARTIFACTS_DIR, 'qa_hero_slide2_residence_desktop.png') });
        console.log('Saved qa_hero_slide2_residence_desktop.png');
      }

      // Check Mobile Viewport for Hero Slide 2
      await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3 });
      await new Promise(r => setTimeout(r, 300));
      if (heroSection) {
        await heroSection.screenshot({ path: path.join(ARTIFACTS_DIR, 'qa_hero_slide2_residence_mobile.png') });
        console.log('Saved qa_hero_slide2_residence_mobile.png');
      }

      // Return to desktop viewport for work section & modal
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
      await page.evaluate(() => {
        const workSection = document.getElementById('work');
        if (workSection) workSection.scrollIntoView();
      });
      await new Promise(r => setTimeout(r, 600));

      // Inspect Residence 3D Elevation project card
      const cardInfo = await page.evaluate(() => {
        const card = document.querySelector('.project-card[data-id="residence-3d-elevation"]');
        const img = card ? card.querySelector('.project-cover-img') : null;
        return {
          exists: !!card,
          currentSrc: img ? img.currentSrc : null,
          naturalWidth: img ? img.naturalWidth : null,
          naturalHeight: img ? img.naturalHeight : null,
          renderedWidth: img ? img.offsetWidth : null,
          renderedHeight: img ? img.offsetHeight : null
        };
      });
      console.log('Project Card Info:', cardInfo);

      const projectCard = await page.$('.project-card[data-id="residence-3d-elevation"]');
      if (projectCard) {
        await projectCard.screenshot({ path: path.join(ARTIFACTS_DIR, 'qa_project_card_residence_elevation.png') });
        console.log('Saved qa_project_card_residence_elevation.png');
      }

      // Open Lightbox
      console.log('Clicking Residence 3D Elevation media wrap to inspect lightbox modal...');
      await page.evaluate(() => {
        const mediaWrap = document.querySelector('.project-card[data-id="residence-3d-elevation"] .project-media-wrap');
        if (mediaWrap) mediaWrap.click();
      });
      await new Promise(r => setTimeout(r, 600));

      const modalInfo = await page.evaluate(() => {
        const modal = document.getElementById('lightboxModal');
        const img = modal ? modal.querySelector('.lightbox-img') : null;
        const open = modal ? modal.classList.contains('open') : false;
        return {
          open,
          currentSrc: img ? img.currentSrc : null,
          naturalWidth: img ? img.naturalWidth : null,
          naturalHeight: img ? img.naturalHeight : null
        };
      });
      console.log('Lightbox Modal Info:', modalInfo);

      const modalEl = await page.$('#lightboxModal .lightbox-modal-container') || await page.$('#lightboxModal');
      if (modalEl) {
        await modalEl.screenshot({ path: path.join(ARTIFACTS_DIR, 'qa_lightbox_residence_elevation.png') });
        console.log('Saved qa_lightbox_residence_elevation.png');
      }

      console.log('\n--- VERIFICATION REPORT ---');
      console.log(`Console Errors: ${consoleErrors.length}`);
      if (consoleErrors.length > 0) {
        consoleErrors.forEach(err => console.error('  Console error:', err));
      } else {
        console.log('Zero console errors!');
      }

    } catch (err) {
      console.error('Error during verification:', err);
    } finally {
      if (browser) await browser.close();
      server.close();
      console.log('Verification finished & server closed.');
    }
  });
}

runVerification();
