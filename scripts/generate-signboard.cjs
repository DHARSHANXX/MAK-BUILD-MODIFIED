const fs = require('fs');
const sharp = require('sharp');

async function makeStudioSignboard() {
  if (!fs.existsSync('assets/about')) fs.mkdirSync('assets/about', { recursive: true });

  const logo = await sharp('assets/mak-emblem-cropped.png')
    .resize(240, null, { withoutEnlargement: true })
    .toBuffer();

  const svg = Buffer.from(`
    <svg width="800" height="500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0d131f"/>
          <stop offset="100%" stop-color="#080b11"/>
        </linearGradient>
        <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#f3e7c4"/>
          <stop offset="50%" stop-color="#d4af37"/>
          <stop offset="100%" stop-color="#aa820a"/>
        </linearGradient>
      </defs>
      <rect width="800" height="500" rx="16" fill="url(#grad)"/>
      <rect x="12" y="12" width="776" height="476" rx="12" fill="none" stroke="url(#gold)" stroke-width="1.5" opacity="0.4"/>
      
      <text x="400" y="230" text-anchor="middle" font-family="sans-serif" font-size="32" font-weight="bold" fill="#ffffff" letter-spacing="4">MAK BUILD</text>
      <text x="400" y="265" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="600" fill="url(#gold)" letter-spacing="6">CONSTRUCTION &amp; DESIGN</text>
      
      <line x1="250" y1="290" x2="550" y2="290" stroke="#d4af37" stroke-width="1" opacity="0.3"/>
      
      <text x="400" y="325" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="600" fill="#e2e8f0">Er. Manikandan Rajendran</text>
      <text x="400" y="350" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#94a3b8">Civil &amp; Structural Engineer &#x2022; Registered Engineer</text>
      
      <text x="400" y="410" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#cbd5e1">117C, Pidari South Street, Sirkazhi 609110</text>
      <text x="400" y="435" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#d4af37">Visit our Sirkazhi Studio</text>
    </svg>
  `);

  await sharp(svg)
    .composite([{ input: logo, left: 280, top: 45 }])
    .webp({ quality: 90 })
    .toFile('assets/about/office-signboard.webp');

  console.log('Office signboard created at assets/about/office-signboard.webp');
}

makeStudioSignboard().catch(console.error);
