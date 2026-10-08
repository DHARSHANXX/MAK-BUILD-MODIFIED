const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const srcSlide3 = 'C:/Users/DHARSHAN/.gemini/antigravity/brain/4a32252f-1f0e-4131-8d2d-440c322de3e1/.user_uploaded/media_1791369399231.jpg';
const srcSlide4 = 'C:/Users/DHARSHAN/.gemini/antigravity/brain/4a32252f-1f0e-4131-8d2d-440c322de3e1/.user_uploaded/media_1791369414461.jpg';

const heroDir = path.join(process.cwd(), 'assets', 'hero');
const imgDir = path.join(process.cwd(), 'assets', 'img');
fs.mkdirSync(heroDir, { recursive: true });
fs.mkdirSync(imgDir, { recursive: true });

async function processImages() {
  // Save originals to assets/hero/ as specified: assets/hero/slide-3-exterior.png, slide-4-interior.png
  await sharp(srcSlide3).png().toFile(path.join(heroDir, 'slide-3-exterior.png'));
  await sharp(srcSlide4).png().toFile(path.join(heroDir, 'slide-4-interior.png'));

  const widths = [640, 1024, 1440, 1920];
  const targets = [
    { name: 'slide-3-exterior', src: srcSlide3 },
    { name: 'slide-4-interior', src: srcSlide4 }
  ];

  const results = [];

  for (const item of targets) {
    for (const w of widths) {
      // 16:9 height calculation
      const h = Math.round(w * 9 / 16);

      // WebP
      const webpPath = path.join(imgDir, `${item.name}-${w}.webp`);
      await sharp(item.src)
        .resize(w, h, { fit: 'cover', position: 'center' })
        .webp({ quality: 80, effort: 5 })
        .toFile(webpPath);
      const webpStat = fs.statSync(webpPath);

      // AVIF
      const avifPath = path.join(imgDir, `${item.name}-${w}.avif`);
      await sharp(item.src)
        .resize(w, h, { fit: 'cover', position: 'center' })
        .avif({ quality: 78, effort: 5 })
        .toFile(avifPath);
      const avifStat = fs.statSync(avifPath);

      // JPEG fallback
      const jpgPath = path.join(imgDir, `${item.name}-${w}.jpg`);
      await sharp(item.src)
        .resize(w, h, { fit: 'cover', position: 'center' })
        .jpeg({ quality: 80, mozjpeg: true })
        .toFile(jpgPath);

      results.push({
        name: item.name,
        width: w,
        webpKB: (webpStat.size / 1024).toFixed(1) + ' KB',
        avifKB: (avifStat.size / 1024).toFixed(1) + ' KB'
      });
    }

    // Base fallback
    await sharp(item.src)
      .resize(1024, Math.round(1024 * 9 / 16), { fit: 'cover', position: 'center' })
      .webp({ quality: 80, effort: 5 })
      .toFile(path.join(imgDir, `${item.name}.webp`));
    await sharp(item.src)
      .resize(1024, Math.round(1024 * 9 / 16), { fit: 'cover', position: 'center' })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(path.join(imgDir, `${item.name}.jpg`));
  }

  console.table(results);
}

processImages().catch(console.error);
