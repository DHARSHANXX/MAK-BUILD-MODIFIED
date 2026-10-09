const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const srcSlide2 = 'C:/Users/DHARSHAN/.gemini/antigravity/brain/4a32252f-1f0e-4131-8d2d-440c322de3e1/.user_uploaded/media_1791554977720.jpg';
const heroDir = path.join(process.cwd(), 'assets', 'hero');
const imgDir = path.join(process.cwd(), 'assets', 'img');

fs.mkdirSync(heroDir, { recursive: true });
fs.mkdirSync(imgDir, { recursive: true });

async function processSlide2() {
  console.log('--- Processing New Slide 2 Living Room Interior Image ---');

  // Save original high-res copy to assets/hero/slide-2-living.png
  await sharp(srcSlide2).png().toFile(path.join(heroDir, 'slide-2-living.png'));
  fs.copyFileSync(srcSlide2, path.join(heroDir, 'slide-2-living.jpg'));

  const widths = [640, 1024, 1440, 1920];
  const results = [];

  for (const w of widths) {
    const h = Math.round(w * 9 / 16);

    // WebP with subtle sharpening for glossy detail pop
    const webpPath = path.join(imgDir, `slide-2-living-${w}.webp`);
    await sharp(srcSlide2)
      .resize(w, h, { fit: 'cover', position: 'center', kernel: 'lanczos3' })
      .sharpen({ sigma: 0.8, m1: 0.5, m2: 1.5 })
      .webp({ quality: 84, effort: 5 })
      .toFile(webpPath);
    const webpStat = fs.statSync(webpPath);

    // AVIF
    const avifPath = path.join(imgDir, `slide-2-living-${w}.avif`);
    await sharp(srcSlide2)
      .resize(w, h, { fit: 'cover', position: 'center', kernel: 'lanczos3' })
      .sharpen({ sigma: 0.8, m1: 0.5, m2: 1.5 })
      .avif({ quality: 80, effort: 5 })
      .toFile(avifPath);
    const avifStat = fs.statSync(avifPath);

    // JPEG fallback
    const jpgPath = path.join(imgDir, `slide-2-living-${w}.jpg`);
    await sharp(srcSlide2)
      .resize(w, h, { fit: 'cover', position: 'center', kernel: 'lanczos3' })
      .sharpen({ sigma: 0.8, m1: 0.5, m2: 1.5 })
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile(jpgPath);

    results.push({
      width: `${w}x${h}`,
      webpKB: (webpStat.size / 1024).toFixed(1) + ' KB',
      avifKB: (avifStat.size / 1024).toFixed(1) + ' KB'
    });
  }

  // Base fallbacks
  await sharp(srcSlide2)
    .resize(1024, 576, { fit: 'cover', position: 'center', kernel: 'lanczos3' })
    .sharpen({ sigma: 0.8, m1: 0.5, m2: 1.5 })
    .webp({ quality: 84, effort: 5 })
    .toFile(path.join(imgDir, 'slide-2-living.webp'));

  await sharp(srcSlide2)
    .resize(1024, 576, { fit: 'cover', position: 'center', kernel: 'lanczos3' })
    .sharpen({ sigma: 0.8, m1: 0.5, m2: 1.5 })
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(path.join(imgDir, 'slide-2-living.jpg'));

  console.table(results);
  console.log('Successfully generated all responsive tiers for slide-2-living!');
}

processSlide2().catch(console.error);
