const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const binDir = path.join(__dirname, 'realesrgan-bin');
const exe = path.join(binDir, 'realesrgan-ncnn-vulkan.exe');
const modelsDir = path.join(binDir, 'models');
const originalsDir = path.join(process.cwd(), 'originals');
const mastersDir = path.join(process.cwd(), 'assets', 'masters');

const input = path.join(originalsDir, 'slide-1-lineart.png');
const output = path.join(mastersDir, 'slide-1-test-anime.png');

// Test with realesrgan-x4plus-anime without -t (auto tile size) or tile 100
const cmd = `"${exe}" -i "${input}" -o "${output}" -m "${modelsDir}" -n realesrgan-x4plus-anime -s 4 -t 100 -f png`;
console.log('Running test upscale on Slide 1 line art:\n', cmd);
const start = Date.now();
try {
  execSync(cmd, { stdio: 'inherit' });
  console.log(`Finished in ${((Date.now() - start)/1000).toFixed(1)}s`);
  const st = fs.statSync(output);
  console.log(`Size: ${(st.size / 1024).toFixed(1)} KB`);
} catch (e) {
  console.error('Error with tile 100, trying auto tile...');
  try {
    const cmdAuto = `"${exe}" -i "${input}" -o "${output}" -m "${modelsDir}" -n realesrgan-x4plus-anime -s 4 -f png`;
    execSync(cmdAuto, { stdio: 'inherit' });
    console.log('Finished with auto tile!');
  } catch (e2) {
    console.error('Error with auto tile:', e2.message);
  }
}
