const sharp = require('sharp');
const fs = require('fs');

const files = [
  'C:/Users/DHARSHAN/.gemini/antigravity/brain/4a32252f-1f0e-4131-8d2d-440c322de3e1/.user_uploaded/media_1791567645660.jpg',
  'C:/Users/DHARSHAN/.gemini/antigravity/brain/4a32252f-1f0e-4131-8d2d-440c322de3e1/.user_uploaded/media_1791567663349.jpg',
  'C:/Users/DHARSHAN/.gemini/antigravity/brain/4a32252f-1f0e-4131-8d2d-440c322de3e1/.user_uploaded/media_1791567697762.jpg',
  'C:/Users/DHARSHAN/.gemini/antigravity/brain/4a32252f-1f0e-4131-8d2d-440c322de3e1/.user_uploaded/media_1791567763506.jpg'
];

(async () => {
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const stat = fs.statSync(f);
    const meta = await sharp(f).metadata();
    console.log(`Uploaded [${i+1}]: ${meta.width}x${meta.height}, ${meta.format}, size: ${(stat.size / 1024).toFixed(1)} KB, path: ${f}`);
  }
})();
