import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function processImages() {
  if (!fs.existsSync('public/assets')) fs.mkdirSync('public/assets', { recursive: true });

  const tasks = [
    { src: 'assets/portfolio-interior-design.jpg', name: 'portfolio-interior-design' },
    { src: 'assets/commercial-retail-after.jpg', name: 'commercial-retail-after' },
    { src: 'assets/penthouse-after-hd.jpg', name: 'penthouse-after-hd' },
    { src: 'assets/villa-contemporary-after.jpg', name: 'villa-contemporary-after' }
  ];

  for (const t of tasks) {
    if (fs.existsSync(t.src)) {
      fs.copyFileSync(t.src, `public/assets/${t.name}.jpg`);
      await sharp(t.src).webp({ quality: 85 }).toFile(`public/assets/${t.name}-1280.webp`);
      await sharp(t.src).resize(640).webp({ quality: 80 }).toFile(`public/assets/${t.name}-640.webp`);
      
      // Also copy to root assets/
      fs.copyFileSync(`public/assets/${t.name}-1280.webp`, `assets/${t.name}-1280.webp`);
      fs.copyFileSync(`public/assets/${t.name}-640.webp`, `assets/${t.name}-640.webp`);
      console.log(`✓ Processed ${t.name}`);
    }
  }
}

processImages().catch(console.error);
