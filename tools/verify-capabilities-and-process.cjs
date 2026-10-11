const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\DHARSHAN\\.gemini\\antigravity\\brain\\4a32252f-1f0e-4131-8d2d-440c322de3e1';
const URL = 'http://localhost:3000';

async function screenshotSection(page, selector, filename) {
  await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  }, selector);
  await new Promise(r => setTimeout(r, 450));
  const clip = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      x: Math.max(0, Math.round(r.left)),
      y: Math.max(0, Math.round(r.top + window.scrollY)),
      width: Math.min(window.innerWidth, Math.round(r.width)),
      height: Math.min(2400, Math.round(r.height))
    };
  }, selector);
  if (clip && clip.width > 0 && clip.height > 0) {
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, filename),
      clip,
      captureBeyondViewport: true
    });
  }
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = {
    viewports: [],
    taskA: {},
    taskB: {},
    taskC: {},
    tamilCheck: {},
    reducedMotionCheck: {},
    consoleErrors: []
  };

  try {
    const page = await browser.newPage();
    page.on('pageerror', err => results.consoleErrors.push(err.message));
    page.on('console', msg => {
      if (msg.type() === 'error') results.consoleErrors.push(msg.text());
    });

    // 1. Desktop 1366x900 Light Mode (English)
    await page.setViewport({ width: 1366, height: 900, deviceScaleFactor: 1 });
    await page.goto(URL, { waitUntil: 'networkidle0' });

    await page.evaluate(() => {
      if (document.documentElement.getAttribute('data-theme') !== 'light') {
        document.getElementById('themeToggleBtn')?.click();
      }
      if (document.documentElement.lang !== 'en') {
        document.getElementById('langToggleBtn')?.click();
      }
    });
    await new Promise(r => setTimeout(r, 300));

    // Scroll to #services
    await page.evaluate(() => {
      document.getElementById('services')?.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await new Promise(r => setTimeout(r, 700));

    // Verify Task A in EN Light Mode at 1366px
    results.taskA = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('#servicesGrid .service-card'));
      const row1 = cards.slice(0, 3);
      const row2 = cards.slice(3, 6);
      const row1Heights = row1.map(c => Math.round(c.getBoundingClientRect().height));
      const row2Heights = row2.map(c => Math.round(c.getBoundingClientRect().height));
      const row1BtnBottoms = row1.map(c => Math.round(c.querySelector('.service-btn').getBoundingClientRect().bottom));
      const row2BtnBottoms = row2.map(c => Math.round(c.querySelector('.service-btn').getBoundingClientRect().bottom));

      const cardDetails = cards.map(c => {
        const img = c.querySelector('.service-card-bg-img');
        const sources = Array.from(c.querySelectorAll('picture source')).map(s => ({
          type: s.getAttribute('type'),
          srcset: s.getAttribute('srcset')
        }));
        const lineText = c.querySelector('.service-line')?.textContent.trim() || '';
        const wordCount = lineText.split(/\s+/).filter(Boolean).length;
        const chips = Array.from(c.querySelectorAll('.service-mini-chip span')).map(s => s.textContent.trim());
        const cs = getComputedStyle(img);
        return {
          title: c.querySelector('.service-title')?.textContent.trim(),
          wordCount,
          chipCount: chips.length,
          maxChipWords: Math.max(...chips.map(ch => ch.split(/\s+/).length)),
          hasPicture: sources.length === 3,
          imgComplete: img && img.complete && img.naturalWidth > 0,
          objectFit: cs.objectFit,
          isInView: c.classList.contains('is-in-view'),
          animPlayState: cs.animationPlayState
        };
      });

      return {
        cardCount: cards.length,
        row1EqualHeight: Math.max(...row1Heights) - Math.min(...row1Heights) <= 1,
        row2EqualHeight: Math.max(...row2Heights) - Math.min(...row2Heights) <= 1,
        row1BtnsAligned: Math.max(...row1BtnBottoms) - Math.min(...row1BtnBottoms) <= 2,
        row2BtnsAligned: Math.max(...row2BtnBottoms) - Math.min(...row2BtnBottoms) <= 2,
        allInViewRunning: cardDetails.every(d => d.isInView && d.animPlayState === 'running'),
        allImagesLoaded: cardDetails.every(d => d.imgComplete && d.hasPicture && d.objectFit === 'cover'),
        maxDescWords: Math.max(...cardDetails.map(d => d.wordCount)),
        cardDetails
      };
    });

    // Test hover + cursor spotlight on first service card
    const firstCardBox = await page.evaluate(() => {
      const el = document.querySelector('#servicesGrid .service-card');
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
    await page.mouse.move(firstCardBox.x, firstCardBox.y);
    await new Promise(r => setTimeout(r, 400));

    results.taskA.hoverCheck = await page.evaluate(() => {
      const el = document.querySelector('#servicesGrid .service-card');
      const spot = el.querySelector('.service-card-spotlight');
      const cs = getComputedStyle(el);
      const arrowCs = getComputedStyle(el.querySelector('.service-btn-arrow'));
      return {
        hasSpotlightClass: el.classList.contains('has-spotlight'),
        mx: spot.style.getPropertyValue('--mx'),
        my: spot.style.getPropertyValue('--my'),
        cardTransform: cs.transform,
        arrowTransform: arrowCs.transform
      };
    });

    await screenshotSection(page, '#services', 'verify_services_1366_light_en.png');

    // Test clicking "Know more" opens #serviceModal
    await page.click('#servicesGrid .service-card .service-btn');
    await new Promise(r => setTimeout(r, 300));
    results.taskA.modalOpens = await page.evaluate(() => document.getElementById('serviceModal')?.classList.contains('open'));
    await page.click('#serviceModal .modal-close-btn');
    await new Promise(r => setTimeout(r, 250));

    // Verify Task B (Compare full specification completely removed)
    await screenshotSection(page, '#packages', 'verify_packages_1366_light_en.png');

    results.taskB = await page.evaluate(() => {
      const bodyText = document.body.innerText;
      return {
        openCompareModalBtn: !!document.getElementById('openCompareModalBtn'),
        compareModal: !!document.getElementById('compareModal'),
        packagesCompareBtn: !!document.querySelector('.packages-compare-btn'),
        specTable: !!document.querySelector('.spec-table'),
        spec2026InContent: !!(window.MAK_CONTENT && window.MAK_CONTENT.spec2026),
        hasCompareTextEn: bodyText.includes('Compare full specification'),
        hasCompareTextTa: bodyText.includes('முழு விவரங்களையும் ஒப்பிடுக'),
        packageCardsCount: document.querySelectorAll('#packagesGrid .package-card').length,
        indicativeNotePresent: !!document.querySelector('.packages-indicative-note')
      };
    });

    // Verify off-screen pause for #services when scrolled down to .process-section
    await screenshotSection(page, '.process-section', 'verify_process_1366_light_en.png');
    await new Promise(r => setTimeout(r, 300));

    results.taskA.pausedWhenOffscreen = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('#servicesGrid .service-card'));
      return cards.every(c => !c.classList.contains('is-in-view') && getComputedStyle(c.querySelector('.service-card-bg-img')).animationPlayState === 'paused');
    });

    // Verify Task C (5-Step Process) at 1366px
    results.taskC = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('#processStepsGrid .process-step-card'));
      const heights = cards.map(c => Math.round(c.getBoundingClientRect().height));
      const tops = cards.map(c => Math.round(c.getBoundingClientRect().top));
      const connector = document.getElementById('processConnectorLine');
      const step5Badge = cards[4]?.querySelector('.concept-viz-badge');

      const details = cards.map(c => {
        const img = c.querySelector('.process-card-bg-img');
        const cs = getComputedStyle(img);
        const titleCs = getComputedStyle(c.querySelector('.step-title'));
        return {
          num: c.querySelector('.step-num')?.textContent.trim(),
          title: c.querySelector('.step-title')?.textContent.trim(),
          imgComplete: img && img.complete && img.naturalWidth > 0,
          isInView: c.classList.contains('is-in-view'),
          isLit: c.classList.contains('is-lit'),
          animPlayState: cs.animationPlayState,
          titleColor: titleCs.color
        };
      });

      return {
        stepCount: cards.length,
        singleRowOnDesktop: Math.max(...tops) - Math.min(...tops) <= 2,
        equalHeightOnDesktop: Math.max(...heights) - Math.min(...heights) <= 1,
        connectorDrawn: connector ? connector.classList.contains('is-drawn') : false,
        allStepsLit: details.every(d => d.isLit),
        allInViewRunning: details.every(d => d.isInView && d.animPlayState === 'running'),
        allImagesLoaded: details.every(d => d.imgComplete),
        step5ConceptBadgeEn: step5Badge ? step5Badge.textContent.trim() : null,
        details
      };
    });

    // Switch to Dark Mode at 1366px and capture screenshots
    await page.click('#themeToggleBtn');
    await new Promise(r => setTimeout(r, 350));
    await screenshotSection(page, '.process-section', 'verify_process_1366_dark_en.png');
    await screenshotSection(page, '#services', 'verify_services_1366_dark_en.png');

    // Switch to Tamil (lang="ta") and Light mode, check Tamil line-heights & badge
    await page.click('#themeToggleBtn');
    await page.click('#langToggleBtn');
    await new Promise(r => setTimeout(r, 400));

    results.tamilCheck = await page.evaluate(() => {
      const checkLineHeight = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const cs = getComputedStyle(el);
        return +(parseFloat(cs.lineHeight) / parseFloat(cs.fontSize)).toFixed(2);
      };
      const step5Badge = document.querySelectorAll('#processStepsGrid .process-step-card')[4]?.querySelector('.concept-viz-badge');
      return {
        lang: document.documentElement.lang,
        serviceTitleLh: checkLineHeight('.service-title'),
        serviceLineLh: checkLineHeight('.service-line'),
        serviceChipLh: checkLineHeight('.service-mini-chip'),
        stepTitleLh: checkLineHeight('.step-title'),
        stepDescLh: checkLineHeight('.step-desc'),
        step5ConceptBadgeTa: step5Badge ? step5Badge.textContent.trim() : null
      };
    });

    // Mobile 390px verification (Tamil & English)
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await new Promise(r => setTimeout(r, 400));
    await screenshotSection(page, '#services', 'verify_services_390_light_ta.png');

    // Scroll through all 5 process cards on mobile so lazy images load
    await page.evaluate(async () => {
      const cards = Array.from(document.querySelectorAll('#processStepsGrid .process-step-card'));
      for (const c of cards) {
        c.scrollIntoView({ behavior: 'instant', block: 'center' });
        await new Promise(r => setTimeout(r, 120));
      }
    });
    await new Promise(r => setTimeout(r, 300));
    await screenshotSection(page, '.process-section', 'verify_process_390_light_ta.png');

    // Switch back to English on 390px and screenshot
    await page.click('#langToggleBtn');
    await new Promise(r => setTimeout(r, 350));
    await page.evaluate(async () => {
      const cards = Array.from(document.querySelectorAll('#processStepsGrid .process-step-card'));
      for (const c of cards) {
        c.scrollIntoView({ behavior: 'instant', block: 'center' });
        await new Promise(r => setTimeout(r, 80));
      }
    });
    await screenshotSection(page, '.process-section', 'verify_process_390_light_en.png');

    // Re-capture 1366px Process screenshot with top-right Concept visualization badge
    await page.setViewport({ width: 1366, height: 900, deviceScaleFactor: 1, isMobile: false, hasTouch: false });
    await new Promise(r => setTimeout(r, 300));
    await screenshotSection(page, '.process-section', 'verify_process_1366_light_en.png');

    // CDP Performance Metrics check during hover & spotlight movement
    const client = await page.target().createCDPSession();
    await client.send('Performance.enable');
    await page.evaluate(() => {
      document.getElementById('services')?.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await new Promise(r => setTimeout(r, 300));
    const beforeMetrics = (await client.send('Performance.getMetrics')).metrics;
    const getMetric = (arr, name) => arr.find(m => m.name === name)?.value || 0;

    // Move mouse smoothly across 3 service cards (30 steps)
    for (let i = 0; i < 30; i++) {
      await page.mouse.move(200 + i * 25, 420 + (i % 5) * 8);
      await new Promise(r => setTimeout(r, 16));
    }
    const afterMetrics = (await client.send('Performance.getMetrics')).metrics;
    results.cdpPerf = {
      layoutCountDeltaDuringSpotlightMove: getMetric(afterMetrics, 'LayoutCount') - getMetric(beforeMetrics, 'LayoutCount'),
      layoutDurationMsDelta: +((getMetric(afterMetrics, 'LayoutDuration') - getMetric(beforeMetrics, 'LayoutDuration')) * 1000).toFixed(2)
    };

    // Multi-viewport overflow check across 360, 390, 768, 1024, 1366, 1920
    const widths = [360, 390, 768, 1024, 1366, 1920];
    for (const w of widths) {
      await page.setViewport({ width: w, height: 900, isMobile: w < 768, hasTouch: w < 768 });
      await new Promise(r => setTimeout(r, 200));
      const vpInfo = await page.evaluate(() => ({
        width: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        overflowX: document.documentElement.scrollWidth > window.innerWidth
      }));
      results.viewports.push(vpInfo);
    }

    // Prefers-reduced-motion check
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.reload({ waitUntil: 'networkidle0' });
    results.reducedMotionCheck = await page.evaluate(() => {
      const svcImg = document.querySelector('.service-card-bg-img');
      const procImg = document.querySelector('.process-card-bg-img');
      return {
        svcAnimName: svcImg ? getComputedStyle(svcImg).animationName : null,
        procAnimName: procImg ? getComputedStyle(procImg).animationName : null,
        anyInViewClass: document.querySelectorAll('.is-in-view').length
      };
    });

    console.log(JSON.stringify(results, null, 2));
  } finally {
    await browser.close();
  }
})();
