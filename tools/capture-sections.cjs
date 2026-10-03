const puppeteer = require('puppeteer-core');
const path = require('path');
const http = require('http');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = 5588;

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0].split('#')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(ROOT_DIR, decodeURIComponent(reqPath));
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const types = {
      '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
      '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
      '.webp': 'image/webp', '.avif': 'image/avif'
    };
    res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // 1. Desktop section captures
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  
  const sections = ['#hero', '#services', '#packages', '#work', '#estimator', '.process-section', '#about', '#contact', 'footer'];
  for (const s of sections) {
    const el = await page.$(s);
    if (el) {
      await el.scrollIntoView();
      await new Promise(r => setTimeout(r, 400));
      const cleanName = s.replace(/[#.]/g, '');
      await page.screenshot({ path: path.join(ROOT_DIR, `qa_section_${cleanName}_desktop.png`) });
      console.log(`Saved qa_section_${cleanName}_desktop.png`);
    }
  }

  // 2. Mobile section captures
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  for (const s of ['#hero', '.process-section', '#about', '#contact', 'footer']) {
    const el = await page.$(s);
    if (el) {
      await el.scrollIntoView();
      await new Promise(r => setTimeout(r, 400));
      const cleanName = s.replace(/[#.]/g, '');
      await page.screenshot({ path: path.join(ROOT_DIR, `qa_section_${cleanName}_mobile.png`) });
      console.log(`Saved qa_section_${cleanName}_mobile.png`);
    }
  }

  await browser.close();
  server.close();
  console.log('All verification section screenshots successfully captured!');
  process.exit(0);
});
