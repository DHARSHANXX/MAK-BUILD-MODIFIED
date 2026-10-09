const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const mastersDir = path.join(process.cwd(), 'assets', 'masters');
const imgDir = path.join(process.cwd(), 'assets', 'img');
fs.mkdirSync(imgDir, { recursive: true });

const widths = [828, 1080, 1440, 1920, 2560];

const slides = [
  { base: 'hero-bg', master: path.join(mastersDir, 'slide-1-2048.png') },
  { base: 'slide-2-living', master: path.join(mastersDir, 'slide-2-2048.png') },
  { base: 'slide-3-exterior', master: path.join(mastersDir, 'slide-3-2048.png') },
  { base: 'slide-4-interior', master: path.join(mastersDir, 'slide-4-2048.png') }
];

async function generateAll() {
  console.log('=== Generating Responsive Hero Images (828w, 1080w, 1440w, 1920w, 2560w) ===');
  const summary = [];

  for (const s of slides) {
    console.log(`\nProcessing ${s.base}...`);
    for (const w of widths) {
      const h = Math.round(w * 9 / 16);

      // WebP at quality 88
      const webpPath = path.join(imgDir, `${s.base}-${w}.webp`);
      await sharp(s.master)
        .resize(w, h, { fit: 'cover', position: 'center', kernel: 'lanczos3' })
        .webp({ quality: 88, effort: 5 })
        .toFile(webpPath);
      const webpSize = (fs.statSync(webpPath).size / 1024).toFixed(1);

      // Progressive JPG fallback at quality 88
      const jpgPath = path.join(imgDir, `${s.base}-${w}.jpg`);
      await sharp(s.master)
        .resize(w, h, { fit: 'cover', position: 'center', kernel: 'lanczos3' })
        .jpeg({ quality: 88, progressive: true, mozjpeg: true })
        .toFile(jpgPath);
      const jpgSize = (fs.statSync(jpgPath).size / 1024).toFixed(1);

      summary.push({
        slide: s.base,
        resolution: `${w}x${h}`,
        webpKB: `${webpSize} KB`,
        jpgKB: `${jpgSize} KB`
      });
    }

    // Default 1920 fallback files
    const defWebp = path.join(imgDir, `${s.base}.webp`);
    fs.copyFileSync(path.join(imgDir, `${s.base}-1920.webp`), defWebp);
    const defJpg = path.join(imgDir, `${s.base}.jpg`);
    fs.copyFileSync(path.join(imgDir, `${s.base}-1920.jpg`), defJpg);
  }

  console.table(summary);
  console.log('\n=== All responsive image tiers generated successfully! ===');
}

generateAll().catch(err => {
  console.error('Generation failed:', err);
  process.exitCode = 1;
});
