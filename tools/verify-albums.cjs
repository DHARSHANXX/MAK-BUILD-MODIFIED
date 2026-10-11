const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000';
const ARTIFACT_DIR = 'C:\\Users\\DHARSHAN\\.gemini\\antigravity\\brain\\4a32252f-1f0e-4131-8d2d-440c322de3e1';

const VIEWPORTS = [320, 360, 390, 412, 430, 768, 1024, 1280, 1920];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const failures = [];
  const page = await browser.newPage();

  page.on('pageerror', err => {
    failures.push(`Page error: ${err.message}`);
  });

  console.log('=== 1. Testing All 9 Viewports x EN/TA x Light/Dark ===');
  for (const vw of VIEWPORTS) {
    const vh = vw < 768 ? 844 : 900;
    await page.setViewport({ width: vw, height: vh, deviceScaleFactor: vw < 768 ? 2 : 1 });
    await page.goto(`${BASE_URL}/#work`, { waitUntil: 'networkidle2' });

    for (const lang of ['en', 'ta']) {
      for (const theme of ['light', 'dark']) {
        await page.evaluate((l, t) => {
          if (document.documentElement.lang !== l) {
            const btn = document.getElementById('langToggleBtn');
            if (btn) btn.click();
          }
          if (document.documentElement.getAttribute('data-theme') !== t) {
            const tBtn = document.getElementById('themeToggleBtn');
            if (tBtn) tBtn.click();
          }
        }, lang, theme);

        await new Promise(r => setTimeout(r, 60));

        const check = await page.evaluate((expectedCols) => {
          const docEl = document.documentElement;
          const overflowX = docEl.scrollWidth - docEl.clientWidth;
          const cards = Array.from(document.querySelectorAll('#projectsGrid .album-card'));
          const tabs = Array.from(document.querySelectorAll('#projectsTabs .project-tab-btn')).map(b => ({
            cat: b.getAttribute('data-cat'),
            count: b.querySelector('.tab-count')?.textContent?.trim()
          }));

          // Check grid columns using offsetTop (unaffected by reveal-init translateY) and computed grid-template-columns
          const gridEl = document.getElementById('projectsGrid');
          const computedCols = gridEl
            ? window.getComputedStyle(gridEl).gridTemplateColumns.trim().split(/\s+/).length
            : 0;
          const firstRowOffsetTop = cards[0] ? cards[0].offsetTop : 0;
          const firstRowCards = cards.filter(c => Math.abs(c.offsetTop - firstRowOffsetTop) <= 2);

          // Check 4:3 cover ratio
          const coverWrap = cards[0]?.querySelector('.album-cover-wrap');
          const cRect = coverWrap ? coverWrap.getBoundingClientRect() : { width: 0, height: 0 };
          const ratio = cRect.height > 0 ? cRect.width / cRect.height : 0;

          // Check that cover picture only loads 480w/768w thumbnails
          const coverSrcset = coverWrap?.querySelector('source')?.getAttribute('srcset') || '';

          return {
            overflowX,
            cardCount: cards.length,
            cols: firstRowCards.length,
            expectedCols,
            ratio: Number(ratio.toFixed(3)),
            tabs,
            coverSrcset
          };
        }, vw >= 768 ? 3 : 2);

        if (check.overflowX > 0) {
          failures.push(`Horizontal overflow at ${vw}px (${lang}, ${theme}): +${check.overflowX}px`);
        }
        if (check.cardCount !== 5) {
          failures.push(`Expected 5 album cover cards at ${vw}px (${lang}, ${theme}), got ${check.cardCount}`);
        }
        if (check.cols !== check.expectedCols) {
          failures.push(`Expected ${check.expectedCols} columns at ${vw}px (${lang}, ${theme}), got ${check.cols}`);
        }
        if (Math.abs(check.ratio - 4 / 3) > 0.05) {
          failures.push(`Expected 4:3 (1.333) cover ratio at ${vw}px (${lang}, ${theme}), got ${check.ratio}`);
        }
        if (check.coverSrcset.includes('1080w') || check.coverSrcset.includes('1600w') || check.coverSrcset.includes('2000w')) {
          failures.push(`Cover srcset loaded large images instead of thumbnails: ${check.coverSrcset}`);
        }
      }
    }
    console.log(`  [PASS] ${vw}px verified (EN/TA, Light/Dark, cols=${vw >= 768 ? 3 : 2}, 0px horizontal scroll)`);
  }

  // Save screenshots of Level 1 Album Covers (Mobile 390px EN/TA & Desktop 1280px)
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(`${BASE_URL}/#work`, { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    if (document.documentElement.lang !== 'en') document.getElementById('langToggleBtn').click();
    if (document.documentElement.getAttribute('data-theme') !== 'light') document.getElementById('themeToggleBtn').click();
    document.getElementById('work').scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 250));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'album_covers_390_en.png') });

  await page.evaluate(() => {
    if (document.documentElement.lang !== 'ta') document.getElementById('langToggleBtn').click();
    document.getElementById('work').scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 350));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'album_covers_390_ta.png') });

  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
  await page.evaluate(() => {
    if (document.documentElement.lang !== 'en') document.getElementById('langToggleBtn').click();
    document.getElementById('work').scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 250));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'album_covers_1280_en.png') });

  console.log('=== 2. Testing Filter Chips & Deep Links (#work?cat=...) ===');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  const catExpectations = [
    { hash: '#work?cat=residential', expectedCat: 'residential', expectedCount: 1 },
    { hash: '#work?cat=interior', expectedCat: 'interior', expectedCount: 3 },
    { hash: '#work?cat=commercial', expectedCat: 'commercial', expectedCount: 1 },
    { hash: '#work', expectedCat: 'all', expectedCount: 5 }
  ];

  for (const item of catExpectations) {
    await page.goto(`${BASE_URL}/${item.hash}`, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 100));
    const res = await page.evaluate(() => {
      const activeBtn = document.querySelector('#projectsTabs .project-tab-btn.active');
      const cards = document.querySelectorAll('#projectsGrid .album-card');
      return {
        activeCat: activeBtn ? activeBtn.getAttribute('data-cat') : null,
        cardCount: cards.length
      };
    });
    if (res.activeCat !== item.expectedCat || res.cardCount !== item.expectedCount) {
      failures.push(`Deep link ${item.hash} failed: expected cat=${item.expectedCat} (${item.expectedCount}), got cat=${res.activeCat} (${res.cardCount})`);
    } else {
      console.log(`  [PASS] Deep link ${item.hash} -> active chip "${res.activeCat}", ${res.cardCount} card(s)`);
    }
  }

  console.log('=== 3. Testing Level 2 Project Page (#project/<slug>), Uncropped Images, Lightbox & Back Button ===');
  // Filter to Interior first, then click Kathir Interior cover card to test Back button filter preservation
  await page.goto(`${BASE_URL}/#work?cat=interior`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 150));

  const kathirExists = await page.$('#projectsGrid .album-card[data-slug="kathir-interior"]');
  if (!kathirExists) {
    failures.push('Could not find kathir-interior card under #work?cat=interior');
  } else {
    await page.evaluate(() => {
      const card = document.querySelector('#projectsGrid .album-card[data-slug="kathir-interior"]');
      if (card) card.click();
    });
    await new Promise(r => setTimeout(r, 300));

    const detailCheck = await page.evaluate(() => {
      const hash = window.location.hash;
      const coversHidden = document.getElementById('albumCoversView')?.hidden;
      const detailHidden = document.getElementById('projectDetailView')?.hidden;
      const title = document.getElementById('projectDetailTitle')?.textContent?.trim();
      const imgs = Array.from(document.querySelectorAll('#projectGalleryStack .project-gallery-img'));
      const firstTwoLoading = imgs.slice(0, 2).map(img => img.getAttribute('loading'));
      const restLoading = imgs.slice(2).map(img => img.getAttribute('loading'));
      const hasDims = imgs.every(img => img.getAttribute('width') === '3840' && img.getAttribute('height') === '2160');

      const firstRect = imgs[0] ? imgs[0].getBoundingClientRect() : { width: 0, height: 0 };
      const imgAspect = firstRect.height > 0 ? firstRect.width / firstRect.height : 0;

      const waHref = document.getElementById('projectWhatsAppCta')?.getAttribute('href') || '';
      const prevNextCount = document.querySelectorAll('#projectPrevNextGrid .project-nav-card').length;
      const overflowX = document.documentElement.scrollWidth - document.documentElement.clientWidth;

      return {
        hash,
        coversHidden,
        detailHidden,
        title,
        imgCount: imgs.length,
        firstTwoLoading,
        restLazy: restLoading.every(l => l === 'lazy'),
        hasDims,
        imgAspect: Number(imgAspect.toFixed(3)),
        waHref,
        prevNextCount,
        overflowX
      };
    });

    if (detailCheck.hash !== '#project/kathir-interior') {
      failures.push(`Expected hash #project/kathir-interior, got ${detailCheck.hash}`);
    }
    if (!detailCheck.coversHidden || detailCheck.detailHidden) {
      failures.push(`Expected coversHidden=true and detailHidden=false on project page`);
    }
    if (detailCheck.imgCount !== 15) {
      failures.push(`Expected 15 stacked images for kathir-interior, got ${detailCheck.imgCount}`);
    }
    if (detailCheck.firstTwoLoading[0] !== 'eager' || detailCheck.firstTwoLoading[1] !== 'eager' || !detailCheck.restLazy) {
      failures.push(`Expected first 2 images eager and remaining 13 lazy, got ${JSON.stringify(detailCheck.firstTwoLoading)}, restLazy=${detailCheck.restLazy}`);
    }
    if (!detailCheck.hasDims) {
      failures.push(`Not all gallery images have width=3840 and height=2160 attributes`);
    }
    if (Math.abs(detailCheck.imgAspect - 16 / 9) > 0.05) {
      failures.push(`Expected uncropped 16:9 (1.778) aspect ratio on stacked image, got ${detailCheck.imgAspect}`);
    }
    if (!detailCheck.waHref.includes('918144166022') || !decodeURIComponent(detailCheck.waHref).includes('Kathir Interior')) {
      failures.push(`WhatsApp CTA missing phone or prefilled project name: ${detailCheck.waHref}`);
    }
    if (detailCheck.prevNextCount !== 2) {
      failures.push(`Expected 2 Prev/Next project cards, got ${detailCheck.prevNextCount}`);
    }
    if (detailCheck.overflowX > 0) {
      failures.push(`Horizontal overflow on Level 2 project page: +${detailCheck.overflowX}px`);
    }

    console.log(`  [PASS] Level 2 #project/kathir-interior: ${detailCheck.imgCount} uncropped images (aspect=${detailCheck.imgAspect}), first 2 eager, 13 lazy, WhatsApp prefilled`);

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'project_detail_390_en.png') });

    // Test Lightbox on 3rd image (index 2 -> counter "3 / 15")
    await page.evaluate(() => {
      const fig = document.querySelector('#projectGalleryStack .project-gallery-item[data-index="2"]');
      if (fig) fig.click();
    });
    await new Promise(r => setTimeout(r, 200));

    const lbCheck1 = await page.evaluate(() => {
      const modal = document.getElementById('lightboxModal');
      return {
        isOpen: modal?.classList.contains('open'),
        counter: document.getElementById('lightboxCounter')?.textContent?.trim(),
        imgSrc: document.querySelector('#lightboxMediaWrap .lightbox-img')?.getAttribute('src')
      };
    });

    if (!lbCheck1.isOpen || lbCheck1.counter !== '3 / 15') {
      failures.push(`Lightbox failed to open at 3 / 15: ${JSON.stringify(lbCheck1)}`);
    } else {
      console.log(`  [PASS] Lightbox opened at counter "${lbCheck1.counter}"`);
    }

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'project_lightbox_390.png') });

    // Press ArrowRight -> should advance to "4 / 15"
    await page.keyboard.press('ArrowRight');
    await new Promise(r => setTimeout(r, 100));
    const lbCounterAfterNext = await page.$eval('#lightboxCounter', el => el.textContent.trim());
    if (lbCounterAfterNext !== '4 / 15') {
      failures.push(`Lightbox ArrowRight expected "4 / 15", got "${lbCounterAfterNext}"`);
    } else {
      console.log(`  [PASS] Lightbox ArrowRight advanced counter to "${lbCounterAfterNext}"`);
    }

    // Press Escape -> should close lightbox
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 150));
    const lbClosed = await page.$eval('#lightboxModal', el => !el.classList.contains('open'));
    if (!lbClosed) {
      failures.push('Lightbox did not close on Escape key');
    } else {
      console.log('  [PASS] Lightbox closed on Escape key');
    }

    // Test phone/browser Back button returning to Level 1 covers with same filter ('interior')
    await page.goBack();
    await new Promise(r => setTimeout(r, 200));
    const backCheck = await page.evaluate(() => {
      return {
        hash: window.location.hash,
        coversHidden: document.getElementById('albumCoversView')?.hidden,
        detailHidden: document.getElementById('projectDetailView')?.hidden,
        activeCat: document.querySelector('#projectsTabs .project-tab-btn.active')?.getAttribute('data-cat'),
        cardCount: document.querySelectorAll('#projectsGrid .album-card').length
      };
    });

    if (backCheck.coversHidden || !backCheck.detailHidden || backCheck.activeCat !== 'interior' || backCheck.cardCount !== 3) {
      failures.push(`Browser Back button check failed: ${JSON.stringify(backCheck)}`);
    } else {
      console.log(`  [PASS] Browser Back button returned to Level 1 with active filter "${backCheck.activeCat}" (${backCheck.cardCount} cards)`);
    }
  }

  await browser.close();

  if (failures.length > 0) {
    console.error('\nFAILURES FOUND:');
    failures.forEach(f => console.error(' - ' + f));
    process.exit(1);
  } else {
    console.log('\nALL ALBUM VERIFICATION CHECKS PASSED!');
  }
})();
