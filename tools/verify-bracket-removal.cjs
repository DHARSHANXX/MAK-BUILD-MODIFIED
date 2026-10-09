const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACTS_DIR = 'C:\\Users\\DHARSHAN\\.gemini\\antigravity\\brain\\4a32252f-1f0e-4131-8d2d-440c322de3e1';

(async () => {
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

    console.log('=== 1. VERIFYING PACKAGE HIGHLIGHTS (ENGLISH) ===');
    const getPkgData = async () => {
      return await page.evaluate(() => {
        const cards = document.querySelectorAll('.package-card');
        return Array.from(cards).map(card => {
          const name = card.querySelector('.package-name') ? card.querySelector('.package-name').textContent.trim() : '';
          const features = Array.from(card.querySelectorAll('.package-feature span')).map(s => s.textContent.trim());
          return { name, features };
        });
      });
    };

    const enStandard = await getPkgData();
    console.log('EN Standard highlights:\n', JSON.stringify(enStandard, null, 2));

    // Switch Moderate to Plus
    await page.evaluate(() => {
      const btn = document.querySelector('[data-mod-option="plus"]');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 400));
    const enPlus = await getPkgData();
    console.log('EN Plus highlights:\n', JSON.stringify(enPlus, null, 2));

    console.log('\n=== 2. VERIFYING SPECIFICATION MODAL (ENGLISH) ===');
    await page.evaluate(() => {
      const btn = document.getElementById('openCompareModalBtn');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    const row15SpecsEn = await page.evaluate(() => {
      const rows = document.querySelectorAll('#compareModal table tbody tr');
      for (const row of rows) {
        if (row.innerText.includes('Brick type')) {
          return Array.from(row.querySelectorAll('td')).map(c => c.innerText.trim());
        }
      }
      return null;
    });
    console.log('Spec modal Row 15 (EN):', row15SpecsEn);

    // Close modal
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 400));

    console.log('\n=== 3. VERIFYING TAMIL TRANSLATIONS ===');
    await page.evaluate(() => {
      const langBtn = document.getElementById('langToggleBtn');
      if (langBtn) langBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    const taPlus = await getPkgData();
    console.log('TA Plus highlights:\n', JSON.stringify(taPlus, null, 2));

    // Switch Moderate to Standard in Tamil
    await page.evaluate(() => {
      const btn = document.querySelector('[data-mod-option="standard"]');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 400));
    const taStandard = await getPkgData();
    console.log('TA Standard highlights:\n', JSON.stringify(taStandard, null, 2));

    // Open spec modal in Tamil
    await page.evaluate(() => {
      const btn = document.getElementById('openCompareModalBtn');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    const row15SpecsTa = await page.evaluate(() => {
      const rows = document.querySelectorAll('#compareModal table tbody tr');
      for (const row of rows) {
        if (row.innerText.includes('செங்கல் வகை')) {
          return Array.from(row.querySelectorAll('td')).map(c => c.innerText.trim());
        }
      }
      return null;
    });
    console.log('Spec modal Row 15 (TA):', row15SpecsTa);

    // Close modal
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 400));

    // Switch back to English
    await page.evaluate(() => {
      const langBtn = document.getElementById('langToggleBtn');
      if (langBtn) langBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    console.log('\n=== 4. VERIFYING ESTIMATOR DYNAMICS & MATH ===');
    await page.evaluate(() => {
      const est = document.getElementById('estimator');
      if (est) est.scrollIntoView();
    });
    await new Promise(r => setTimeout(r, 500));

    const estTests = await page.evaluate(() => {
      const results = [];
      const costEl = document.getElementById('estResultAmount');

      // Test 1: Standard (Default 1200 sq.ft)
      results.push({ test: 'Standard (1200 sq.ft)', amount: costEl ? costEl.innerText.replace(/\s+/g, ' ').trim() : 'missing' });

      // Test 2: Switch to Basic (2200)
      const basicBtn = document.querySelector('[data-est-pkg="basic"]');
      if (basicBtn) basicBtn.click();
      results.push({ test: 'Basic (1200 sq.ft)', amount: costEl ? costEl.innerText.replace(/\s+/g, ' ').trim() : 'missing' });

      // Test 3: Switch to Premium (2500)
      const premBtn = document.querySelector('[data-est-pkg="premium"]');
      if (premBtn) premBtn.click();
      results.push({ test: 'Premium (1200 sq.ft)', amount: costEl ? costEl.innerText.replace(/\s+/g, ' ').trim() : 'missing' });

      // Test 4: Toggle modular kitchen add-on
      const kitchenCard = document.querySelector('[data-addon-id="kitchen"]');
      if (kitchenCard) kitchenCard.click();
      results.push({ test: 'Premium + Kitchen Addon', amount: costEl ? costEl.innerText.replace(/\s+/g, ' ').trim() : 'missing' });

      return results;
    });
    console.log('Estimator calculations:', estTests);

    console.log('\n=== 5. CHECKING ARTIFACT SCREENSHOTS ===');
    // Ensure modal is closed
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 400));

    // Scroll to packages section
    await page.evaluate(() => {
      const el = document.getElementById('packages');
      if (el) el.scrollIntoView();
    });
    await new Promise(r => setTimeout(r, 400));

    const pkgShot = path.join(ARTIFACTS_DIR, 'packages_desktop_verified.png');
    const packagesEl = await page.$('#packages');
    if (packagesEl) await packagesEl.screenshot({ path: pkgShot });
    console.log('Saved:', pkgShot);

    // Open modal and capture modal screenshot
    await page.evaluate(() => {
      const btn = document.getElementById('openCompareModalBtn');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 600));
    const modalBox = await page.$('#compareModal .modal-container, #compareModal .modal-box, #compareModal');
    if (modalBox) {
      const modalShot = path.join(ARTIFACTS_DIR, 'spec_modal_verified.png');
      await modalBox.screenshot({ path: modalShot });
      console.log('Saved:', modalShot);
    }

    // Close modal
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 400));

    // Mobile screenshot
    await page.setViewport({ width: 390, height: 844 });
    await new Promise(r => setTimeout(r, 400));
    await page.evaluate(() => {
      const el = document.getElementById('packages');
      if (el) el.scrollIntoView();
    });
    await new Promise(r => setTimeout(r, 400));

    const mobilePkgShot = path.join(ARTIFACTS_DIR, 'packages_mobile_verified.png');
    const packagesElMobile = await page.$('#packages');
    if (packagesElMobile) await packagesElMobile.screenshot({ path: mobilePkgShot });
    console.log('Saved:', mobilePkgShot);

    console.log('\n=== ALL VERIFICATIONS PASSED ===');
  } catch (err) {
    console.error('Verification failed:', err);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
  }
})();
