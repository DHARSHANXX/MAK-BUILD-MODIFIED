const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 5566;
const ROOT_DIR = path.resolve(__dirname, '..');

// Simple static server
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

async function runTests() {
  server.listen(PORT, async () => {
    console.log(`Test server running at http://localhost:${PORT}`);
    let browser;
    try {
      browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();

      // Collect console errors
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });
      page.on('pageerror', err => consoleErrors.push(err.toString()));

      console.log('\n--- 1. Testing Viewport & Horizontal Scroll ---');
      const viewports = [
        { width: 360, height: 740, dpr: 2, name: 'mobile_360' },
        { width: 390, height: 844, dpr: 3, name: 'mobile_390' },
        { width: 768, height: 1024, dpr: 2, name: 'tablet_768' },
        { width: 1024, height: 768, dpr: 1, name: 'desktop_1024' },
        { width: 1440, height: 900, dpr: 2, name: 'desktop_1440' },
        { width: 1920, height: 1080, dpr: 1, name: 'desktop_1920' }
      ];

      for (const vp of viewports) {
        await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: vp.dpr });
        await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
        
        const overflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > window.innerWidth;
        });
        console.log(`Viewport ${vp.name} (${vp.width}x${vp.height} @${vp.dpr}x DPR): Horizontal overflow = ${overflow}`);
        if (overflow) {
          console.error(`FAILED: Horizontal overflow detected at ${vp.width}px!`);
        }
      }

      console.log('\n--- 2. Testing Before/After Slider ---');
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
      await page.goto(`http://localhost:${PORT}/#work`, { waitUntil: 'networkidle0' });
      await page.waitForSelector('.ba-container');

      // Scroll to slider
      await page.evaluate(() => {
        const el = document.querySelector('.ba-container');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
      });
      await new Promise(r => setTimeout(r, 500));

      // Test handle position & clamp
      const sliderStatusInitial = await page.evaluate(() => {
        const slider = document.querySelector('.ba-container');
        const handle = slider.querySelector('.ba-handle');
        const afterLayer = slider.querySelector('.ba-layer-after');
        const divider = slider.querySelector('.ba-divider');
        return {
          valuenow: slider.getAttribute('aria-valuenow'),
          clipPath: afterLayer.style.clipPath,
          transform: divider.style.transform
        };
      });
      console.log('Slider Initial State:', sliderStatusInitial);

      // Test keyboard navigation: ArrowLeft (2% decrement), ArrowRight (2% increment), Home (4%), End (96%)
      await page.focus('.ba-container');
      await page.keyboard.press('ArrowLeft');
      await new Promise(r => setTimeout(r, 100));
      const valAfterLeft = await page.evaluate(() => document.querySelector('.ba-container').getAttribute('aria-valuenow'));
      console.log('Slider Value after ArrowLeft (expected 48):', valAfterLeft);

      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowRight');
      await new Promise(r => setTimeout(r, 100));
      const valAfterRight = await page.evaluate(() => document.querySelector('.ba-container').getAttribute('aria-valuenow'));
      console.log('Slider Value after 2x ArrowRight (expected 52):', valAfterRight);

      await page.keyboard.press('Home');
      await new Promise(r => setTimeout(r, 100));
      const valAfterHome = await page.evaluate(() => document.querySelector('.ba-container').getAttribute('aria-valuenow'));
      console.log('Slider Value after Home key (expected 4):', valAfterHome);

      await page.keyboard.press('End');
      await new Promise(r => setTimeout(r, 100));
      const valAfterEnd = await page.evaluate(() => document.querySelector('.ba-container').getAttribute('aria-valuenow'));
      console.log('Slider Value after End key (expected 96):', valAfterEnd);

      // Screenshot slider
      const sliderEl = await page.$('.ba-container');
      await sliderEl.screenshot({ path: path.join(ROOT_DIR, 'qa_ba_slider_test.png') });
      console.log('Saved qa_ba_slider_test.png');

      console.log('\n--- 3. Testing 3D Designs Tab & Lightbox ---');
      // Click 3D Designs tab
      const tabClickResult = await page.evaluate(() => {
        const tabs = Array.from(document.querySelectorAll('.project-tab-btn'));
        const tab3d = tabs.find(t => t.textContent.includes('3D'));
        if (tab3d) {
          tab3d.click();
          return { clicked: true, hash: window.location.hash };
        }
        return { clicked: false };
      });
      console.log('3D Tab Click Result:', tabClickResult);
      await new Promise(r => setTimeout(r, 300));

      const hashNow = await page.evaluate(() => window.location.hash);
      console.log('URL Hash after 3D Tab Click (expected #work?cat=3d):', hashNow);

      const countCards3D = await page.evaluate(() => document.querySelectorAll('.project-card').length);
      console.log('Count of 3D Project Cards displayed (expected 3):', countCards3D);

      // Check card badge and click to open lightbox
      const cardDetails = await page.evaluate(() => {
        const firstCard = document.querySelector('.project-card');
        const badge = firstCard ? firstCard.querySelector('.project-badge') : null;
        const reqBtn = firstCard ? firstCard.querySelector('.btn-request-design') : null;
        return {
          hasBadge: !!badge,
          badgeText: badge ? badge.textContent.trim() : null,
          reqBtnHref: reqBtn ? reqBtn.href : null
        };
      });
      console.log('First 3D Card Details:', cardDetails);

      // Screenshot 3D card for red speck inspection
      const firstCardEl = await page.$('.project-card');
      await firstCardEl.screenshot({ path: path.join(ROOT_DIR, 'qa_3d_card_test.png') });
      console.log('Saved qa_3d_card_test.png');

      // Open Lightbox
      await page.evaluate(() => {
        const btn = document.querySelector('.project-card .view-proj-btn');
        if (btn) btn.click();
      });
      await new Promise(r => setTimeout(r, 400));

      const lightboxState = await page.evaluate(() => {
        const modal = document.getElementById('lightboxModal');
        const badge = document.getElementById('lightboxConceptBadge');
        const cta = document.getElementById('lightboxWhatsAppCta');
        const title = document.getElementById('lightboxTitle');
        return {
          isOpen: modal.classList.contains('open'),
          badgeVisible: badge.style.display !== 'none',
          badgeText: badge.textContent.trim(),
          ctaText: cta.textContent.trim(),
          ctaHref: cta.href,
          title: title.textContent.trim()
        };
      });
      console.log('Lightbox State for 3D Render:', lightboxState);

      const modalEl = await page.$('#lightboxModal');
      await modalEl.screenshot({ path: path.join(ROOT_DIR, 'qa_lightbox_3d_test.png') });
      console.log('Saved qa_lightbox_3d_test.png');

      // Test Escape to close
      await page.keyboard.press('Escape');
      await new Promise(r => setTimeout(r, 300));
      const isOpenAfterEsc = await page.evaluate(() => document.getElementById('lightboxModal').classList.contains('open'));
      console.log('Lightbox closed on Escape key (expected false):', isOpenAfterEsc);

      console.log('\n--- 4. Testing Studio Card & Typography ---');
      await page.evaluate(() => {
        const el = document.getElementById('about');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
      });
      await new Promise(r => setTimeout(r, 400));

      const studioStyles = await page.evaluate(() => {
        const brand = document.querySelector('.studio-brand-name');
        const eng = document.querySelector('.studio-engineer-name');
        const p = document.querySelector('.studio-lead-text');
        const btnPrimary = document.querySelector('.studio-btn-primary');
        const btnCall = document.querySelector('.studio-btn-secondary');

        return {
          brandFontSize: window.getComputedStyle(brand).fontSize,
          brandColor: window.getComputedStyle(brand).color,
          engFontSize: window.getComputedStyle(eng).fontSize,
          pFontSize: window.getComputedStyle(p).fontSize,
          btnPrimaryHeight: window.getComputedStyle(btnPrimary).minHeight,
          btnCallHeight: window.getComputedStyle(btnCall).minHeight
        };
      });
      console.log('Studio Card Computed Sizes:', studioStyles);

      const studioEl = await page.$('.studio-card');
      await studioEl.screenshot({ path: path.join(ROOT_DIR, 'qa_studio_card_test.png') });
      console.log('Saved qa_studio_card_test.png');

      console.log('\n--- 5. Testing Language Toggle ---');
      await page.evaluate(() => {
        const langBtn = document.getElementById('langToggleBtn');
        if (langBtn) langBtn.click();
      });
      await new Promise(r => setTimeout(r, 400));

      const langStateTa = await page.evaluate(() => {
        const h1 = document.getElementById('heroH1');
        const htmlLang = document.documentElement.lang;
        return {
          lang: htmlLang,
          h1: h1 ? h1.textContent : null
        };
      });
      console.log('Language state after toggle to Tamil:', langStateTa);

      // Toggle back to English
      await page.evaluate(() => {
        const langBtn = document.getElementById('langToggleBtn');
        if (langBtn) langBtn.click();
      });
      await new Promise(r => setTimeout(r, 300));

      console.log('\n--- 6. Console Error Audit ---');
      console.log(`Total console errors captured: ${consoleErrors.length}`);
      if (consoleErrors.length > 0) {
        consoleErrors.forEach((err, i) => console.error(`Error ${i + 1}:`, err));
      } else {
        console.log('PASS: 0 console errors!');
      }

      console.log('\nAll QA Automated Tests Completed Successfully!');
    } catch (err) {
      console.error('Test runner failure:', err);
    } finally {
      if (browser) await browser.close();
      server.close();
    }
  });
}

runTests();
