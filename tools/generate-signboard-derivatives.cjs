const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputPath = path.resolve(__dirname, '../assets/originals/office-signboard.webp');
const widths = [480, 768, 1080, 1600];

(async () => {
  for (const w of widths) {
    const isOriginal = (w === 1600);
    let pipeline = sharp(inputPath);
    if (!isOriginal) {
      pipeline = pipeline.resize(w, null, { kernel: sharp.kernel.lanczos3, withoutEnlargement: true });
    }
    await pipeline.clone().webp({ quality: 90, effort: 6 }).toFile(path.resolve(__dirname, `../assets/img/office-signboard-${w}.webp`));
    await pipeline.clone().avif({ quality: 75, effort: 6 }).toFile(path.resolve(__dirname, `../assets/img/office-signboard-${w}.avif`));
    await pipeline.clone().jpeg({ quality: 90, mozjpeg: true }).toFile(path.resolve(__dirname, `../assets/img/office-signboard-${w}.jpg`));
    console.log(`Generated ${w}w derivatives.`);
  }
  console.log('All office-signboard derivatives updated successfully!');
})();
