const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

async function testLogo() {
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { margin: 0; padding: 30px; font-family: sans-serif; background: #f1f5f9; display: flex; flex-direction: column; gap: 30px; }
      .light-header {
        background: #ffffff; padding: 15px 25px; border-radius: 12px; display: flex; align-items: center; gap: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      }
      .dark-header {
        background: #0b1220; padding: 15px 25px; border-radius: 12px; display: flex; align-items: center; gap: 14px;
      }
      .dark-footer {
        background: #080e1a; padding: 25px; border-radius: 12px; display: flex; align-items: center; gap: 14px;
      }
      .logo-img { height: 46px; width: auto; object-fit: contain; }
      .badge-img { height: 44px; width: 44px; object-fit: contain; background: white; padding: 2px; border-radius: 8px; border: 1px solid #d4af37; }
      .brand-title { font-size: 20px; font-weight: 800; }
      .brand-sub { font-size: 9px; font-weight: 600; letter-spacing: 0.1em; color: #b8892b; }
    </style>
  </head>
  <body>
    <!-- 1. Light Header with mak-logo-hd-clean.png -->
    <div class='light-header'>
      <img src='file:///${path.resolve('assets/mak-logo-hd-clean.png').replace(/\\/g, '/')}' class='logo-img'>
      <div>
        <div class='brand-title' style='color: #0b1220;'>MAK <span style='color: #b8892b;'>BUILD</span></div>
        <div class='brand-sub'>CONSTRUCTION & DESIGN</div>
      </div>
    </div>

    <!-- 2. Dark Header with mak-build-logo-darktheme.png -->
    <div class='dark-header'>
      <img src='file:///${path.resolve('assets/mak-build-logo-darktheme.png').replace(/\\/g, '/')}' class='logo-img'>
      <div>
        <div class='brand-title' style='color: #ffffff;'>MAK <span style='color: #e0b44a;'>BUILD</span></div>
        <div class='brand-sub' style='color: #e0b44a;'>CONSTRUCTION & DESIGN</div>
      </div>
    </div>

    <!-- 3. Dark Footer with mak-build-logo-darktheme.png -->
    <div class='dark-footer'>
      <img src='file:///${path.resolve('assets/mak-build-logo-darktheme.png').replace(/\\/g, '/')}' class='logo-img'>
      <div>
        <div class='brand-title' style='color: #ffffff;'>MAK <span style='color: #e0b44a;'>BUILD</span></div>
        <div class='brand-sub' style='color: #e0b44a;'>CONSTRUCTION & DESIGN</div>
      </div>
    </div>

    <!-- 4. Original badge style with mak-logo-hd-clean.png on dark -->
    <div class='dark-footer'>
      <img src='file:///${path.resolve('assets/mak-logo-hd-clean.png').replace(/\\/g, '/')}' class='badge-img'>
      <div>
        <div class='brand-title' style='color: #ffffff;'>MAK <span style='color: #e0b44a;'>BUILD</span></div>
        <div class='brand-sub' style='color: #e0b44a;'>CONSTRUCTION & DESIGN</div>
      </div>
    </div>
  </body>
  </html>
  `;
  fs.writeFileSync(path.join(__dirname, 'test-logo.html'), html);
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 700, height: 500 });
  await page.goto('file:///' + path.join(__dirname, 'test-logo.html').replace(/\\/g, '/'));
  await page.screenshot({ path: path.join(__dirname, 'test-logo.png') });
  await browser.close();
  console.log('Saved test-logo.png');
}
testLogo();
