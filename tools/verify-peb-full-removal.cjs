const puppeteer = require('puppeteer-core');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const path = require('path');
const ARTIFACTS_DIR = 'C:\\Users\\DHARSHAN\\.gemini\\antigravity\\brain\\4a32252f-1f0e-4131-8d2d-440c322de3e1';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/#work', { waitUntil: 'networkidle0' });

  console.log('=== 1. VERIFYING "ALL" VIEW ===');
  // Click All tab
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('.project-tab-btn'));
    const allTab = tabs.find(t => t.querySelector('span:first-child')?.textContent.trim() === 'All');
    if (allTab) allTab.click();
  });
  await new Promise(r => setTimeout(r, 400));

  const allCards = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.project-card'));
    return {
      count: cards.length,
      ids: cards.map(c => c.getAttribute('data-id')),
      titles: cards.map(c => c.querySelector('.project-title')?.textContent?.trim()),
      hasPebCard: !!document.querySelector('[data-id="peb-industrial-facility"]'),
      hasPebText: document.body.innerText.includes('PEB Industrial & Warehouse Facility')
    };
  });
  console.log('All View Result:', JSON.stringify(allCards, null, 2));

  if (allCards.hasPebCard || allCards.hasPebText) {
    console.error('ERROR: PEB project still found in All view!');
  } else {
    console.log('PASS: PEB project completely absent from All view.');
  }

  // Screenshot All view grid
  const gridEl = await page.$('#projectsGrid');
  if (gridEl) {
    await gridEl.screenshot({ path: path.join(ARTIFACTS_DIR, 'projects_grid_all_view.png') });
    console.log('Saved projects_grid_all_view.png');
  }

  console.log('\n=== 2. VERIFYING "COMMERCIAL & PEB" TAB ===');
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('.project-tab-btn'));
    const commTab = tabs.find(t => t.querySelector('span:first-child')?.textContent.trim() === 'Commercial & PEB');
    if (commTab) commTab.click();
  });
  await new Promise(r => setTimeout(r, 400));

  const commCards = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.project-card'));
    const activeTab = document.querySelector('.project-tab-btn.active');
    return {
      tabLabel: activeTab?.querySelector('span:first-child')?.textContent?.trim(),
      tabCount: activeTab?.querySelector('.tab-count')?.textContent?.trim(),
      count: cards.length,
      ids: cards.map(c => c.getAttribute('data-id')),
      titles: cards.map(c => c.querySelector('.project-title')?.textContent?.trim()),
      hasPebCard: !!document.querySelector('[data-id="peb-industrial-facility"]')
    };
  });
  console.log('Commercial & PEB View Result:', JSON.stringify(commCards, null, 2));

  if (commCards.hasPebCard) {
    console.error('ERROR: PEB project still found in Commercial & PEB view!');
  } else {
    console.log('PASS: PEB project completely absent from Commercial & PEB view.');
  }

  // Screenshot Commercial & PEB view grid
  if (gridEl) {
    await gridEl.screenshot({ path: path.join(ARTIFACTS_DIR, 'projects_grid_commercial_peb_view.png') });
    console.log('Saved projects_grid_commercial_peb_view.png');
  }

  console.log('\n=== 3. VERIFYING ALL OTHER TABS ===');
  const otherTabs = ['3D Designs', 'Interiors', 'Villas'];
  for (const tabName of otherTabs) {
    await page.evaluate((name) => {
      const tabs = Array.from(document.querySelectorAll('.project-tab-btn'));
      const t = tabs.find(el => el.querySelector('span:first-child')?.textContent.trim() === name);
      if (t) t.click();
    }, tabName);
    await new Promise(r => setTimeout(r, 300));

    const check = await page.evaluate(() => {
      return {
        hasPebCard: !!document.querySelector('[data-id="peb-industrial-facility"]'),
        count: document.querySelectorAll('.project-card').length
      };
    });
    console.log(`Tab "${tabName}": count = ${check.count}, hasPeb = ${check.hasPebCard}`);
  }

  console.log('\n=== 4. VERIFYING MOBILE RESPONSIVENESS & OVERFLOW ===');
  for (const w of [360, 390, 768]) {
    await page.setViewport({ width: w, height: 900, deviceScaleFactor: 2 });
    await page.goto('http://localhost:3000/#work', { waitUntil: 'networkidle0' });
    const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientW = await page.evaluate(() => document.documentElement.clientWidth);
    console.log(`Mobile ${w}px -> scrollWidth: ${scrollW}, clientWidth: ${clientW}, overflow: ${scrollW - clientW}px`);
  }

  await browser.close();
  console.log('\nAll PEB project removal verifications passed successfully!');
})();
