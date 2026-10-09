const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = 'C:\\Users\\DHARSHAN\\.gemini\\antigravity\\brain\\4a32252f-1f0e-4131-8d2d-440c322de3e1';

function runLighthouse(preset = 'desktop', outName = 'lh-desktop-after.json') {
  console.log(`Running Lighthouse for ${preset}...`);
  const outPath = path.join(ARTIFACTS_DIR, outName);
  const cmd = `npx.cmd lighthouse http://localhost:3000 --output=json --output-path="${outPath}" --preset=${preset} --chrome-flags="--headless --no-sandbox --disable-gpu" --only-categories=performance --quiet`;
  try {
    execSync(cmd, { stdio: 'inherit' });
    const report = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    const perf = Math.round(report.categories.performance.score * 100);
    const lcp = report.audits['largest-contentful-paint'].displayValue;
    const totalByteWeight = (report.audits['total-byte-weight']?.numericValue / 1024).toFixed(1) + ' KB';
    console.log(`[${preset}] Performance: ${perf}, LCP: ${lcp}, Total Bytes: ${totalByteWeight}`);
    return { perf, lcp, totalByteWeight };
  } catch (e) {
    console.error(`Lighthouse error for ${preset}:`, e.message);
    return null;
  }
}

const desktopRes = runLighthouse('desktop', 'lh-desktop-after.json');
const mobileRes = runLighthouse('perf', 'lh-mobile-after.json');

console.log('\n--- AFTER RESULTS ---');
console.log('Desktop:', desktopRes);
console.log('Mobile:', mobileRes);
