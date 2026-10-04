const puppeteer = require('puppeteer-core');
const path = require('path');
const http = require('http');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = 5599;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0].split('#')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  const filePath = path.join(ROOT_DIR, decodeURIComponent(reqPath));
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, async () => {
  console.log(`Verification server running at http://localhost:${PORT}`);
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  
  // Track console errors
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  // 1. Desktop 1440px Light Theme
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  // Capture Header Logo (Light Theme)
  const header = await page.$('.header');
  if (header) {
    await header.screenshot({ path: path.join(ROOT_DIR, 'qa_polish_header_light.png') });
    console.log('Saved qa_polish_header_light.png');
  }

  // Capture Stats Strip
  const stats = await page.$('#statsStrip');
  if (stats) {
    await stats.scrollIntoView();
    await new Promise(r => setTimeout(r, 600));
    await stats.screenshot({ path: path.join(ROOT_DIR, 'qa_polish_stats_strip.png') });
    console.log('Saved qa_polish_stats_strip.png');
  }

  // Capture Service Cards (Check no gold sweep)
  const services = await page.$('#services');
  if (services) {
    await services.scrollIntoView();
    await new Promise(r => setTimeout(r, 400));
    await services.screenshot({ path: path.join(ROOT_DIR, 'qa_polish_services.png') });
    console.log('Saved qa_polish_services.png');
  }

  // Capture Packages Section (Check WhatsApp icons on quote buttons + pricing disclaimer)
  const packages = await page.$('#packages');
  if (packages) {
    await packages.scrollIntoView();
    await new Promise(r => setTimeout(r, 400));
    await packages.screenshot({ path: path.join(ROOT_DIR, 'qa_polish_packages.png') });
    console.log('Saved qa_polish_packages.png');
  }

  // Capture Pricing Disclaimer explicitly
  const disclaimer = await page.$('.packages-compare-wrap');
  if (disclaimer) {
    await disclaimer.scrollIntoView();
    await new Promise(r => setTimeout(r, 400));
    await disclaimer.screenshot({ path: path.join(ROOT_DIR, 'qa_polish_pricing_disclaimer.png') });
    console.log('Saved qa_polish_pricing_disclaimer.png');
  }

  // Capture Client Stories (Feedback) Section
  const testimonials = await page.$('#feedback');
  if (testimonials) {
    await testimonials.scrollIntoView();
    await new Promise(r => setTimeout(r, 400));
    await testimonials.screenshot({ path: path.join(ROOT_DIR, 'qa_polish_client_stories.png') });
    console.log('Saved qa_polish_client_stories.png');
  }

  // Capture Estimator Section (Check WhatsApp button with icon)
  const estimator = await page.$('#estimator');
  if (estimator) {
    await estimator.scrollIntoView();
    await new Promise(r => setTimeout(r, 400));
    await estimator.screenshot({ path: path.join(ROOT_DIR, 'qa_polish_estimator.png') });
    console.log('Saved qa_polish_estimator.png');
  }

  // Capture Contact Section (Check WhatsApp card + address readability)
  const contact = await page.$('#contact');
  if (contact) {
    await contact.scrollIntoView();
    await new Promise(r => setTimeout(r, 400));
    await contact.screenshot({ path: path.join(ROOT_DIR, 'qa_polish_contact.png') });
    console.log('Saved qa_polish_contact.png');
  }

  // Capture Footer (Check Real MAK BUILD Logo + High Contrast Address)
  const footer = await page.$('footer');
  if (footer) {
    await footer.scrollIntoView();
    await new Promise(r => setTimeout(r, 400));
    await footer.screenshot({ path: path.join(ROOT_DIR, 'qa_polish_footer_light_mode.png') });
    console.log('Saved qa_polish_footer_light_mode.png');
  }

  // Capture Floating WhatsApp Button
  const waBtn = await page.$('#floatingWhatsAppBtn');
  if (waBtn) {
    await waBtn.screenshot({ path: path.join(ROOT_DIR, 'qa_polish_floating_wa_btn.png') });
    console.log('Saved qa_polish_floating_wa_btn.png');
  }

  // 2. Dark Theme Verification
  await page.evaluate(() => {
    const toggle = document.getElementById('themeToggleBtn');
    if (toggle) toggle.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // Capture Header in Dark Mode
  if (header) {
    await header.screenshot({ path: path.join(ROOT_DIR, 'qa_polish_header_dark.png') });
    console.log('Saved qa_polish_header_dark.png');
  }

  // Capture Footer in Dark Mode
  if (footer) {
    await footer.scrollIntoView();
    await new Promise(r => setTimeout(r, 400));
    await footer.screenshot({ path: path.join(ROOT_DIR, 'qa_polish_footer_dark_mode.png') });
    console.log('Saved qa_polish_footer_dark_mode.png');
  }

  // 3. Mobile Viewport Verification (390px)
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));

  // Capture Mobile Floating Bar (with WhatsApp icon)
  const mobileBar = await page.$('.floating-mobile-bar');
  if (mobileBar) {
    await mobileBar.screenshot({ path: path.join(ROOT_DIR, 'qa_polish_mobile_bar.png') });
    console.log('Saved qa_polish_mobile_bar.png');
  }

  // Capture Mobile Footer (address readability)
  const mobileFooter = await page.$('footer');
  if (mobileFooter) {
    await mobileFooter.scrollIntoView();
    await new Promise(r => setTimeout(r, 400));
    await mobileFooter.screenshot({ path: path.join(ROOT_DIR, 'qa_polish_mobile_footer.png') });
    console.log('Saved qa_polish_mobile_footer.png');
  }

  // Capture Mobile Packages
  const mobilePackages = await page.$('#packages');
  if (mobilePackages) {
    await mobilePackages.scrollIntoView();
    await new Promise(r => setTimeout(r, 400));
    await mobilePackages.screenshot({ path: path.join(ROOT_DIR, 'qa_polish_mobile_packages.png') });
    console.log('Saved qa_polish_mobile_packages.png');
  }

  // Verify Horizontal Overflow across Viewports
  const viewports = [360, 390, 768, 1280, 1440];
  for (const w of viewports) {
    await page.setViewport({ width: w, height: 800 });
    const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log(`Viewport ${w}px overflow: ${hasOverflow}`);
  }

  console.log(`Total console errors: ${errors.length}`);
  if (errors.length > 0) console.error('Console errors:', errors);

  await browser.close();
  server.close();
  process.exit(0);
});
