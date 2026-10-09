const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const binDir = path.join(__dirname, 'realesrgan-bin');
const exe = path.join(binDir, 'realesrgan-ncnn-vulkan.exe');
const modelsDir = path.join(binDir, 'models');
const originalsDir = path.join(process.cwd(), 'originals');
const mastersDir = path.join(process.cwd(), 'assets', 'masters');

fs.mkdirSync(mastersDir, { recursive: true });

async function run() {
  console.log('=== 1. AI UPSCALING SLIDES WITH REAL-ESRGAN ===');

  // Slide 1 is already at assets/masters/slide-1-test-anime.png (6400x3600)
  const slide1_4x = path.join(mastersDir, 'slide-1-4x.png');
  const slide1_test = path.join(mastersDir, 'slide-1-test-anime.png');
  if (fs.existsSync(slide1_test) && !fs.existsSync(slide1_4x)) {
    fs.copyFileSync(slide1_test, slide1_4x);
  }

  // Slide 2 is already at assets/masters/slide-2-4x.png (4096x2304)
  const slide2_4x = path.join(mastersDir, 'slide-2-4x.png');

  // Slide 3 (Villa exterior)
  const slide3_in = path.join(originalsDir, 'slide-3-exterior.jpg');
  const slide3_4x = path.join(mastersDir, 'slide-3-4x.png');
  if (!fs.existsSync(slide3_4x)) {
    console.log('\n--- Upscaling Slide 3 with realesrgan-x4plus ---');
    const cmd3 = `"${exe}" -i "${slide3_in}" -o "${slide3_4x}" -m "${modelsDir}" -n realesrgan-x4plus -s 4 -f png`;
    const t0 = Date.now();
    execSync(cmd3, { stdio: 'inherit' });
    console.log(`Slide 3 completed in ${((Date.now() - t0)/1000).toFixed(1)}s`);
  } else {
    console.log('Slide 3 4x already exists.');
  }

  // Slide 4 (Office interior)
  const slide4_in = path.join(originalsDir, 'slide-4-interior.jpg');
  const slide4_4x = path.join(mastersDir, 'slide-4-4x.png');
  if (!fs.existsSync(slide4_4x)) {
    console.log('\n--- Upscaling Slide 4 with realesrgan-x4plus ---');
    const cmd4 = `"${exe}" -i "${slide4_in}" -o "${slide4_4x}" -m "${modelsDir}" -n realesrgan-x4plus -s 4 -f png`;
    const t0 = Date.now();
    execSync(cmd4, { stdio: 'inherit' });
    console.log(`Slide 4 completed in ${((Date.now() - t0)/1000).toFixed(1)}s`);
  } else {
    console.log('Slide 4 4x already exists.');
  }

  console.log('\n=== 2. CREATING 2048-WIDE MASTERS VIA LANCZOS ===');
  const slides = [
    { id: 'slide-1', file4x: slide1_4x },
    { id: 'slide-2', file4x: slide2_4x },
    { id: 'slide-3', file4x: slide3_4x },
    { id: 'slide-4', file4x: slide4_4x }
  ];

  for (const s of slides) {
    const masterPath = path.join(mastersDir, `${s.id}-2048.png`);
    await sharp(s.file4x)
      .resize(2048, 1152, { fit: 'cover', position: 'center', kernel: 'lanczos3' })
      .png({ compressionLevel: 8 })
      .toFile(masterPath);
    const st = fs.statSync(masterPath);
    console.log(`Created ${s.id}-2048.png (2048x1152) - ${(st.size / 1024).toFixed(1)} KB`);
  }

  console.log('\n=== ALL 4 AI-ENHANCED 2048 MASTERS READY ===');
}

run().catch(err => {
  console.error('Master build failed:', err);
  process.exitCode = 1;
});
