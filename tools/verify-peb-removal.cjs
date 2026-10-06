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

  // Evaluate PEB card
  const pebCardData = await page.evaluate(() => {
    const card = document.querySelector('.project-card[data-id="peb-industrial-facility"]');
    if (!card) return null;

    return {
      id: card.getAttribute('data-id'),
      hasBaContainer: !!card.querySelector('.ba-container'),
      hasBeforeBadge: !!card.querySelector('.before-badge'),
      hasAfterBadge: !!card.querySelector('.after-badge'),
      hasDivider: !!card.querySelector('.ba-divider'),
      hasHandle: !!card.querySelector('.ba-handle'),
      hasRoleSlider: !!card.querySelector('[role="slider"]'),
      badgeText: card.querySelector('.project-badge')?.textContent?.trim(),
      locationText: Array.from(card.querySelectorAll('.project-location')).map(el => el.textContent.trim()).join(' '),
      titleText: card.querySelector('.project-title')?.textContent?.trim(),
      descText: card.querySelector('.project-desc')?.textContent?.trim(),
      hasMediaWrap: !!card.querySelector('.project-media-wrap'),
      imgSrc: card.querySelector('img')?.src
    };
  });

  console.log('PEB Card Verification:', JSON.stringify(pebCardData, null, 2));

  // Check all other cards
  const allCards = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.project-card')).map(c => ({
      id: c.getAttribute('data-id'),
      title: c.querySelector('.project-title')?.textContent?.trim(),
      hasBaContainer: !!c.querySelector('.ba-container')
    }));
  });
  console.log('All Cards BA Status:', JSON.stringify(allCards, null, 2));

  // Screenshot PEB card
  const pebCard = await page.$('.project-card[data-id="peb-industrial-facility"]');
  if (pebCard) {
    await pebCard.screenshot({ path: path.join(ARTIFACTS_DIR, 'peb_card_after_removal.png') });
    console.log('Saved peb_card_after_removal.png');
  }

  // Switch to Commercial & PEB tab to verify filtered view
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('.tab-btn'));
    const pebTab = tabs.find(t => t.textContent.includes('Commercial & PEB'));
    if (pebTab) pebTab.click();
  });
  await new Promise(r => setTimeout(r, 400));

  const commercialGrid = await page.$('#projectsGrid');
  if (commercialGrid) {
    await commercialGrid.screenshot({ path: path.join(ARTIFACTS_DIR, 'commercial_peb_tab_grid.png') });
    console.log('Saved commercial_peb_tab_grid.png');
  }

  await browser.close();
})();
