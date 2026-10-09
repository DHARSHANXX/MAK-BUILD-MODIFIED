const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function enhance() {
  const master4x = 'assets/masters/bespoke-living-kitchen-4x.png';
  const enhancedMaster = 'assets/masters/bespoke-living-kitchen-2048-hd.png';

  console.log('Reading 4x master (4096x2304)...');
  
  // 1. First downsample to 2048 with Lanczos3
  // 2. Apply gentle contrast curve + saturation boost + unsharp mask for crystal-clear clarity
  // Re-map tones: lift blacks slightly for detail, punch midtones, crisp highlights
  await sharp(master4x)
    .resize(2048, 1152, { kernel: sharp.kernel.lanczos3 })
    // Boost contrast (1.08) and saturation (1.10) and brightness (1.04) matching hero slides
    .modulate({
      brightness: 1.04,
      saturation: 1.12
    })
    .linear(1.08, -(128 * 0.08)) // linear contrast adjustment around midpoint 128
    // Unsharp mask: sharpen edges (wood slats, photo frames, table) without noise
    .sharpen({
      sigma: 1.2,
      m1: 0.8,
      m2: 1.5
    })
    .png({ compressionLevel: 8 })
    .toFile(enhancedMaster);

  console.log('Created enhanced 2048 HD master:', enhancedMaster);

  const widths = [480, 768, 1080, 1376, 1600, 1920, 2048];
  const outDir = 'assets/img';

  for (const w of widths) {
    const h = Math.round(w * (576 / 1024));

    // WebP (Quality 90 - crystal clear)
    const webpOut = path.join(outDir, `bespoke-living-kitchen-${w}.webp`);
    await sharp(enhancedMaster)
      .resize(w, h, { kernel: sharp.kernel.lanczos3 })
      .webp({ quality: 90, effort: 6 })
      .toFile(webpOut);

    // AVIF with 4:4:4 chroma subsampling (no color blur)
    const avifOut = path.join(outDir, `bespoke-living-kitchen-${w}.avif`);
    await sharp(enhancedMaster)
      .resize(w, h, { kernel: sharp.kernel.lanczos3 })
      .avif({ quality: 88, effort: 6, chromaSubsampling: '4:4:4' })
      .toFile(avifOut);

    // Progressive JPEG (Quality 90)
    const jpgOut = path.join(outDir, `bespoke-living-kitchen-${w}.jpg`);
    await sharp(enhancedMaster)
      .resize(w, h, { kernel: sharp.kernel.lanczos3 })
      .jpeg({ quality: 90, progressive: true, mozjpeg: true })
      .toFile(jpgOut);

    console.log(`Rendered tier ${w}x${h} (WebP: ${(fs.statSync(webpOut).size/1024).toFixed(1)} KB, AVIF: ${(fs.statSync(avifOut).size/1024).toFixed(1)} KB, JPG: ${(fs.statSync(jpgOut).size/1024).toFixed(1)} KB)`);
  }

  // Base fallback files (1920px for crystal HD lightbox)
  await sharp(enhancedMaster)
    .resize(1920, 1080, { kernel: sharp.kernel.lanczos3 })
    .webp({ quality: 90, effort: 6 })
    .toFile(path.join(outDir, 'bespoke-living-kitchen.webp'));

  await sharp(enhancedMaster)
    .resize(1920, 1080, { kernel: sharp.kernel.lanczos3 })
    .avif({ quality: 88, effort: 6, chromaSubsampling: '4:4:4' })
    .toFile(path.join(outDir, 'bespoke-living-kitchen.avif'));

  await sharp(enhancedMaster)
    .resize(1920, 1080, { kernel: sharp.kernel.lanczos3 })
    .jpeg({ quality: 90, progressive: true, mozjpeg: true })
    .toFile(path.join(outDir, 'bespoke-living-kitchen.jpg'));

  // Also replace master in assets/masters/bespoke-living-kitchen-2048.png
  fs.copyFileSync(enhancedMaster, 'assets/masters/bespoke-living-kitchen-2048.png');

  console.log('All HD derivatives and fallbacks generated!');
}

enhance().catch(e => console.error(e));
