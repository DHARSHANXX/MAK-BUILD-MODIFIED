import puppeteer from 'puppeteer-core';
import fs from 'fs';

const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const artifactDir = 'C:/Users/DHARSHAN/.gemini/antigravity/brain/4a32252f-1f0e-4131-8d2d-440c322de3e1';

async function runQA() {
  console.log('Launching Chrome for QA testing...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.message));

  // 1. Desktop Test (1440x900)
  console.log('Testing Desktop 1440x900...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle0' });

  // Expand the specification details so it renders in the screenshot
  await page.evaluate(() => {
    const details = document.querySelector('details');
    if (details) details.open = true;
  });

  await page.screenshot({ path: `${artifactDir}/qa_desktop_clean.png`, fullPage: true });
  console.log('✓ Captured desktop full-page screenshot');

  // 2. Mobile Test (390x844)
  console.log('Testing Mobile 390x844 (English)...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.reload({ waitUntil: 'networkidle0' });
  await page.screenshot({ path: `${artifactDir}/qa_mobile_en.png`, fullPage: true });
  console.log('✓ Captured mobile full-page screenshot (English)');

  // 3. Test Language Toggle to Tamil
  console.log('Testing Language Switch to Tamil...');
  await page.evaluate(() => {
    const toggleBtn = Array.from(document.querySelectorAll('header button')).find(b => b.textContent.includes('தமிழ்'));
    if (toggleBtn) toggleBtn.click();
  });
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: `${artifactDir}/qa_mobile_ta.png`, fullPage: true });
  console.log('✓ Captured mobile full-page screenshot (Tamil)');

  // 4. Check for console errors
  console.log('\n--- Console Errors ---');
  if (consoleErrors.length === 0) {
    console.log('✓ Zero console errors detected!');
  } else {
    console.log(`Found ${consoleErrors.length} console error(s):`, consoleErrors);
  }

  await browser.close();
  console.log('QA Test complete!');
}

runQA().catch(err => {
  console.error('QA Test failed:', err);
  process.exit(1);
});
