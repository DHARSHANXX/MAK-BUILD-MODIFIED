const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, 'realesrgan-bin');
fs.mkdirSync(toolsDir, { recursive: true });

const zipPath = path.join(__dirname, 'realesrgan.zip');
const url = 'https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.5.0/realesrgan-ncnn-vulkan-20220424-windows.zip';

console.log('Downloading Real-ESRGAN standalone binary...');
execSync(`curl.exe -L -s -o "${zipPath}" "${url}"`, { stdio: 'inherit' });

console.log('Extracting archive...');
execSync(`tar -xf "${zipPath}" -C "${toolsDir}"`, { stdio: 'inherit' });

const exePath = path.join(toolsDir, 'realesrgan-ncnn-vulkan.exe');
if (fs.existsSync(exePath)) {
  console.log('Real-ESRGAN binary verified successfully at:', exePath);
  const help = execSync(`"${exePath}" -h`, { encoding: 'utf8' });
  console.log('Help summary:\n', help.split('\n').slice(0, 15).join('\n'));
} else {
  console.error('Extraction failed: realesrgan-ncnn-vulkan.exe not found');
}
