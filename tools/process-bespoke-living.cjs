const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function processBespoke() {
  const master4x = 'assets/masters/bespoke-living-kitchen-4x.png';
  const master2048 = 'assets/masters/bespoke-living-kitchen-2048.png';
  
  if (!fs.existsSync(master4x)) {
    console.error('4x master does not exist yet:', master4x);
    return;
  }

  console.log('Generating 2048px master via Sharp Lanczos3...');
  await sharp(master4x)
    .resize(2048, 1152, { kernel: sharp.kernel.lanczos3 })
    .png({ compressionLevel: 8 })
    .toFile(master2048);

  const stat2048 = fs.statSync(master2048);
  console.log(`2048 master created: ${(stat2048.size / 1024).toFixed(1)} KB`);

  // Target widths for bespoke-living-kitchen: [480, 768, 1080, 1376] + full 2048
  const widths = [480, 768, 1080, 1376];
  const outDir = 'assets/img';

  for (const w of widths) {
    const h = Math.round(w * (576 / 1024)); // exact 16:9

    // WebP (quality 88)
    const webpOut = path.join(outDir, `bespoke-living-kitchen-${w}.webp`);
    await sharp(master2048)
      .resize(w, h, { kernel: sharp.kernel.lanczos3 })
      .webp({ quality: 88, effort: 6 })
      .toFile(webpOut);
    console.log(`Created ${webpOut} (${w}x${h}): ${(fs.statSync(webpOut).size / 1024).toFixed(1)} KB`);

    // AVIF (quality 82)
    const avifOut = path.join(outDir, `bespoke-living-kitchen-${w}.avif`);
    await sharp(master2048)
      .resize(w, h, { kernel: sharp.kernel.lanczos3 })
      .avif({ quality: 82, effort: 6 })
      .toFile(avifOut);
    console.log(`Created ${avifOut} (${w}x${h}): ${(fs.statSync(avifOut).size / 1024).toFixed(1)} KB`);

    // Progressive JPEG (quality 88)
    const jpgOut = path.join(outDir, `bespoke-living-kitchen-${w}.jpg`);
    await sharp(master2048)
      .resize(w, h, { kernel: sharp.kernel.lanczos3 })
      .jpeg({ quality: 88, progressive: true, mozjpeg: true })
      .toFile(jpgOut);
    console.log(`Created ${jpgOut} (${w}x${h}): ${(fs.statSync(jpgOut).size / 1024).toFixed(1)} KB`);
  }

  // Base fallback files (1376px)
  await sharp(master2048)
    .resize(1376, 774, { kernel: sharp.kernel.lanczos3 })
    .webp({ quality: 88, effort: 6 })
    .toFile(path.join(outDir, 'bespoke-living-kitchen.webp'));

  await sharp(master2048)
    .resize(1376, 774, { kernel: sharp.kernel.lanczos3 })
    .avif({ quality: 82, effort: 6 })
    .toFile(path.join(outDir, 'bespoke-living-kitchen.avif'));

  await sharp(master2048)
    .resize(1376, 774, { kernel: sharp.kernel.lanczos3 })
    .jpeg({ quality: 88, progressive: true, mozjpeg: true })
    .toFile(path.join(outDir, 'bespoke-living-kitchen.jpg'));

  console.log('All responsive derivatives generated successfully!');
}

processBespoke().catch(err => console.error(err));
