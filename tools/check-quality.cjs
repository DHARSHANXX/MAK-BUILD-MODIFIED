const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = 'C:\\Users\\DHARSHAN\\.gemini\\antigravity\\brain\\4a32252f-1f0e-4131-8d2d-440c322de3e1';
const mastersDir = path.join(process.cwd(), 'assets', 'masters');
const originalsDir = path.join(process.cwd(), 'originals');

async function compareCrops() {
  console.log('--- Generating Side-by-Side 100% Crops for Quality Audit ---');

  // Slide 1: Check handwritten text "Good Design Builds Better Lives" and house lines
  // Original is 1600x900, master is 2048x1152
  const s1OrigCrop = await sharp(path.join(originalsDir, 'slide-1-lineart.png'))
    .extract({ left: 1000, top: 400, width: 400, height: 300 })
    .toBuffer();
  // Corresponding crop in 2048 (scaled by 2048/1600 = 1.28)
  const s1MasterCrop = await sharp(path.join(mastersDir, 'slide-1-2048.png'))
    .extract({ left: Math.round(1000 * 1.28), top: Math.round(400 * 1.28), width: Math.round(400 * 1.28), height: Math.round(300 * 1.28) })
    .resize(400, 300)
    .toBuffer();

  // Combine side by side
  await sharp({
    create: { width: 820, height: 320, channels: 4, background: { r: 240, g: 240, b: 240, alpha: 1 } }
  })
    .composite([
      { input: s1OrigCrop, left: 8, top: 10 },
      { input: s1MasterCrop, left: 412, top: 10 }
    ])
    .png()
    .toFile(path.join(ARTIFACTS_DIR, 'qa_crop_slide1.png'));

  // Slide 2: TV wall & screen (center TV area)
  // Original is 1024x576, master is 2048x1152 (exact 2x)
  const s2OrigCrop = await sharp(path.join(originalsDir, 'slide-2-living.jpg'))
    .extract({ left: 350, top: 180, width: 320, height: 240 })
    .toBuffer();
  const s2MasterCrop = await sharp(path.join(mastersDir, 'slide-2-2048.png'))
    .extract({ left: 700, top: 360, width: 640, height: 480 })
    .resize(320, 240)
    .toBuffer();

  await sharp({
    create: { width: 660, height: 260, channels: 4, background: { r: 20, g: 20, b: 20, alpha: 1 } }
  })
    .composite([
      { input: s2OrigCrop, left: 8, top: 10 },
      { input: s2MasterCrop, left: 332, top: 10 }
    ])
    .png()
    .toFile(path.join(ARTIFACTS_DIR, 'qa_crop_slide2.png'));

  // Slide 3: Villa balcony & facade
  const s3OrigCrop = await sharp(path.join(originalsDir, 'slide-3-exterior.jpg'))
    .extract({ left: 380, top: 140, width: 320, height: 240 })
    .toBuffer();
  const s3MasterCrop = await sharp(path.join(mastersDir, 'slide-3-2048.png'))
    .extract({ left: 760, top: 280, width: 640, height: 480 })
    .resize(320, 240)
    .toBuffer();

  await sharp({
    create: { width: 660, height: 260, channels: 4, background: { r: 20, g: 20, b: 20, alpha: 1 } }
  })
    .composite([
      { input: s3OrigCrop, left: 8, top: 10 },
      { input: s3MasterCrop, left: 332, top: 10 }
    ])
    .png()
    .toFile(path.join(ARTIFACTS_DIR, 'qa_crop_slide3.png'));

  // Slide 4: Office wooden slats & desk chair
  const s4OrigCrop = await sharp(path.join(originalsDir, 'slide-4-interior.jpg'))
    .extract({ left: 400, top: 160, width: 320, height: 240 })
    .toBuffer();
  const s4MasterCrop = await sharp(path.join(mastersDir, 'slide-4-2048.png'))
    .extract({ left: 800, top: 320, width: 640, height: 480 })
    .resize(320, 240)
    .toBuffer();

  await sharp({
    create: { width: 660, height: 260, channels: 4, background: { r: 20, g: 20, b: 20, alpha: 1 } }
  })
    .composite([
      { input: s4OrigCrop, left: 8, top: 10 },
      { input: s4MasterCrop, left: 332, top: 10 }
    ])
    .png()
    .toFile(path.join(ARTIFACTS_DIR, 'qa_crop_slide4.png'));

  console.log('Saved QA crop comparisons:');
  console.log('- qa_crop_slide1.png');
  console.log('- qa_crop_slide2.png');
  console.log('- qa_crop_slide3.png');
  console.log('- qa_crop_slide4.png');
}

compareCrops().catch(console.error);
