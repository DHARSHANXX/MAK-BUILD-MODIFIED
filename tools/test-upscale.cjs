const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const binDir = path.join(__dirname, 'realesrgan-bin');
const exe = path.join(binDir, 'realesrgan-ncnn-vulkan.exe');
const modelsDir = path.join(binDir, 'models');

const originalsDir = path.join(process.cwd(), 'originals');
fs.mkdirSync(originalsDir, { recursive: true });

const mastersDir = path.join(process.cwd(), 'assets', 'masters');
fs.mkdirSync(mastersDir, { recursive: true });

// Copy original files
const srcFiles = {
  slide1: path.join(process.cwd(), 'images', 'hero-bg.png'),
  slide2: 'C:/Users/DHARSHAN/.gemini/antigravity/brain/4a32252f-1f0e-4131-8d2d-440c322de3e1/.user_uploaded/media_1791554977720.jpg',
  slide3: 'C:/Users/DHARSHAN/.gemini/antigravity/brain/4a32252f-1f0e-4131-8d2d-440c322de3e1/.user_uploaded/media_1791369399231.jpg',
  slide4: 'C:/Users/DHARSHAN/.gemini/antigravity/brain/4a32252f-1f0e-4131-8d2d-440c322de3e1/.user_uploaded/media_1791369414461.jpg'
};

fs.copyFileSync(srcFiles.slide1, path.join(originalsDir, 'slide-1-lineart.png'));
fs.copyFileSync(srcFiles.slide2, path.join(originalsDir, 'slide-2-living.jpg'));
fs.copyFileSync(srcFiles.slide3, path.join(originalsDir, 'slide-3-exterior.jpg'));
fs.copyFileSync(srcFiles.slide4, path.join(originalsDir, 'slide-4-interior.jpg'));

console.log('Originals backed up safely in originals/ directory:');
fs.readdirSync(originalsDir).forEach(f => {
  const st = fs.statSync(path.join(originalsDir, f));
  console.log(`- ${f} (${(st.size / 1024).toFixed(1)} KB)`);
});

// Test upscaling slide 2 with realesrgan-x4plus
console.log('\n--- Testing Real-ESRGAN on Slide 2 ---');
const testInput = path.join(originalsDir, 'slide-2-living.jpg');
const testOutput4x = path.join(mastersDir, 'slide-2-4x.png');

const cmd = `"${exe}" -i "${testInput}" -o "${testOutput4x}" -m "${modelsDir}" -n realesrgan-x4plus -s 4 -f png`;
console.log('Running:', cmd);
const startTime = Date.now();
try {
  execSync(cmd, { stdio: 'inherit' });
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`Success! 4x upscale generated in ${duration}s.`);
  const meta = fs.statSync(testOutput4x);
  console.log(`Output size: ${(meta.size / 1024).toFixed(1)} KB`);
} catch (e) {
  console.error('Error during upscaling:', e.message);
  process.exitCode = 1;
}
