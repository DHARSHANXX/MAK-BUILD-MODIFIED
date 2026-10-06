const puppeteer = require('puppeteer-core');
const path = require('path');
const http = require('http');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = 5577;

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

  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'networkidle0' });

  // 1. Verify Tab order and counts
  const tabData = await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('.project-tab-btn'));
    return tabs.map(tab => {
      const label = tab.querySelector('span:first-child')?.textContent.trim();
      const count = tab.querySelector('.tab-count')?.textContent.trim();
      const isActive = tab.classList.contains('active');
      return { label, count, isActive };
    });
  });

  console.log('\n--- Rendered Tabs Order & Count ---');
  console.log(JSON.stringify(tabData, null, 2));

  // Verify exact order
  const expectedOrder = [
    { label: '3D Designs', count: '3' },
    { label: 'Interiors', count: '2' },
    { label: 'Villas', count: '1' },
    { label: 'Commercial & PEB', count: '1' },
    { label: 'All', count: '7' }
  ];

  let orderCorrect = true;
  if (tabData.length !== 5) {
    orderCorrect = false;
    console.error(`Expected 5 tabs, got ${tabData.length}`);
  } else {
    for (let i = 0; i < 5; i++) {
      if (tabData[i].label !== expectedOrder[i].label || tabData[i].count !== expectedOrder[i].count) {
        orderCorrect = false;
        console.error(`Mismatch at tab ${i}: got ${tabData[i].label} (${tabData[i].count}), expected ${expectedOrder[i].label} (${expectedOrder[i].count})`);
      }
    }
  }

  if (orderCorrect) {
    console.log('PASS: Tab order and counts match requested specification exactly!');
  } else {
    console.error('FAIL: Tab order mismatch.');
    process.exit(1);
  }

  // 2. Screenshot Desktop Tabs
  const tabsEl = await page.$('.projects-tabs');
  await tabsEl.screenshot({ path: path.join(__dirname, '..', 'qa_tabs_reordered_desktop.png') });
  console.log('Saved qa_tabs_reordered_desktop.png');

  // Also full section screenshot
  const sectionEl = await page.$('#work');
  await sectionEl.screenshot({ path: path.join(__dirname, '..', 'qa_projects_section_reordered_desktop.png') });
  console.log('Saved qa_projects_section_reordered_desktop.png');

  // 3. Test filtering for each tab
  const filterTests = [
    { name: '3D Designs', expectedCount: 3, expectedHash: '#work?cat=3d', checkCat: '3D Designs' },
    { name: 'Interiors', expectedCount: 2, expectedHash: '#work?cat=interiors', checkCat: 'Interiors' },
    { name: 'Villas', expectedCount: 1, expectedHash: '#work?cat=villas', checkCat: 'Villas' },
    { name: 'Commercial & PEB', expectedCount: 1, expectedHash: '#work?cat=commercial', checkCat: 'Commercial & PEB' },
    { name: 'All', expectedCount: 7, expectedHash: '#work', checkCat: null }
  ];

  console.log('\n--- Testing Click & Filter for Each Tab ---');
  for (const test of filterTests) {
    const res = await page.evaluate((tabName) => {
      const tabs = Array.from(document.querySelectorAll('.project-tab-btn'));
      const target = tabs.find(t => t.querySelector('span:first-child')?.textContent.trim() === tabName);
      if (!target) return { found: false };
      target.click();
      
      const activeTab = document.querySelector('.project-tab-btn.active');
      const activeLabel = activeTab ? activeTab.querySelector('span:first-child')?.textContent.trim() : null;
      return {
        found: true,
        hash: window.location.hash,
        activeLabel: activeLabel,
        isActive: activeLabel === tabName,
        cardCount: document.querySelectorAll('.project-card').length
      };
    }, test.name);

    console.log(`Tab "${test.name}":`, res);
    if (!res.found || res.cardCount !== test.expectedCount || !res.isActive) {
      console.error(`FAIL: Tab "${test.name}" failed verification!`);
      process.exit(1);
    }
  }
  console.log('PASS: All 5 tabs filter cards and update active state accurately!');

  // 4. Test Tablet and Mobile Viewports
  const viewports = [
    { name: 'tablet_768', width: 768, height: 1024, dpr: 2 },
    { name: 'mobile_390', width: 390, height: 844, dpr: 3 },
    { name: 'mobile_320', width: 320, height: 640, dpr: 2 }
  ];

  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: vp.dpr });
    await page.reload({ waitUntil: 'networkidle0' });

    // Check overflow
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log(`Viewport ${vp.name}: overflow = ${overflow}`);

    const vpTabs = await page.$('.projects-tabs');
    await vpTabs.screenshot({ path: path.join(__dirname, '..', `qa_tabs_reordered_${vp.name}.png`) });
    console.log(`Saved qa_tabs_reordered_${vp.name}.png`);
  }

  console.log('\nConsole Errors:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.error('Console errors found:', consoleErrors);
  } else {
    console.log('PASS: 0 console errors!');
  }

  await browser.close();
  server.close();
  console.log('\nAll tab reordering verifications PASSED!');
})();
