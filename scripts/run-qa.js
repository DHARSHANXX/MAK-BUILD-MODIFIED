import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACTS_DIR = 'C:\\Users\\DHARSHAN\\.gemini\\antigravity\\brain\\4a32252f-1f0e-4131-8d2d-440c322de3e1';
const BASE_URL = 'http://127.0.0.1:5000/';

const BREAKPOINTS = [
  { name: 'mobile_360', width: 360, height: 740 },
  { name: 'mobile_390', width: 390, height: 844 },
  { name: 'tablet_768', width: 768, height: 1024 },
  { name: 'desktop_1024', width: 1024, height: 768 },
  { name: 'desktop_1440', width: 1440, height: 900 },
  { name: 'wide_1920', width: 1920, height: 1080 }
];

async function runQA() {
  console.log('Starting comprehensive QA tests...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('response', res => {
    if (res.status() >= 400) {
      console.log('HTTP ' + res.status() + ' on URL: ' + res.url());
    }
  });
  page.on('pageerror', err => {
    consoleErrors.push(err.toString());
    console.error('Page Error:', err.toString());
  });

  // 1. Test each breakpoint for horizontal overflow & capture screenshots
  for (const bp of BREAKPOINTS) {
    await page.setViewport({ width: bp.width, height: bp.height });
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    // Check horizontal scroll
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    console.log(`[Breakpoint ${bp.name} (${bp.width}px)] scrollWidth: ${scrollWidth}, innerWidth: ${bp.width}, overflow: ${hasHorizontalOverflow}`);

    if (hasHorizontalOverflow) {
      console.warn(`WARNING: Horizontal overflow detected at ${bp.name}!`);
    }

    if (bp.name === 'mobile_390' || bp.name === 'desktop_1440') {
      const shotPath = path.join(ARTIFACTS_DIR, `qa_${bp.name}.png`);
      await page.screenshot({ path: shotPath, fullPage: false });
      console.log(`Saved screenshot: ${shotPath}`);
    }
  }

  // 2. Test Language Toggle to Tamil
  console.log('Testing Language Toggle...');
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

  await page.click('#langToggleBtn');
  await new Promise(r => setTimeout(r, 400));
  const htmlLang = await page.evaluate(() => document.documentElement.lang);
  console.log(`Language switched to: ${htmlLang}`);

  const shotTa = path.join(ARTIFACTS_DIR, 'qa_mobile_ta_vanilla.png');
  await page.screenshot({ path: shotTa, fullPage: false });
  console.log(`Saved Tamil screenshot: ${shotTa}`);

  // 3. Test Compare Modal
  console.log('Testing Compare Specification Modal...');
  await page.click('#openCompareModalBtn');
  await new Promise(r => setTimeout(r, 400));

  const modalOpen = await page.evaluate(() => {
    const m = document.getElementById('compareModal');
    return m && m.classList.contains('open');
  });
  console.log(`Compare modal open state: ${modalOpen}`);

  const rowsCount = await page.evaluate(() => {
    return document.querySelectorAll('#compareModalBody table tbody tr:not(.spec-group-row)').length;
  });
  console.log(`Specification rows rendered in modal: ${rowsCount} (expected 27)`);

  const shotModal = path.join(ARTIFACTS_DIR, 'qa_compare_modal.png');
  await page.screenshot({ path: shotModal, fullPage: false });
  console.log(`Saved Compare Modal screenshot: ${shotModal}`);

  // Close modal with Escape key
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 400));

  // 4. Test Quick Estimator
  console.log('Testing Quick Estimator calculation...');
  await page.evaluate(() => {
    const areaInput = document.getElementById('estAreaInput');
    areaInput.value = 2400;
    areaInput.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await new Promise(r => setTimeout(r, 300));

  const estResult = await page.evaluate(() => {
    return document.getElementById('estResultAmount').textContent;
  });
  console.log(`Estimator result for 2400 sq.ft: ${estResult}`);

  console.log(`Total console errors during tests: ${consoleErrors.length}`);

  await browser.close();
  console.log('QA tests completed successfully!');
}

runQA().catch(console.error);
