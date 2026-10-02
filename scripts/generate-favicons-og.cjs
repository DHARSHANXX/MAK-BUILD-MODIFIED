const fs = require('fs');
const sharp = require('sharp');

async function makeFaviconsAndOG() {
  if (!fs.existsSync('assets/favicons')) fs.mkdirSync('assets/favicons', { recursive: true });

  // Use emblem or logo
  const logo = await sharp('assets/mak-emblem-cropped.png')
    .resize(380, 240, { fit: 'contain', background: { r: 8, g: 11, b: 17, alpha: 0 } })
    .toBuffer();

  // 512x512 dark background with centered emblem
  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: '#080b11'
    }
  })
  .composite([{ input: logo, gravity: 'center' }])
  .png()
  .toFile('assets/favicons/android-chrome-512x512.png');

  // 192x192
  await sharp('assets/favicons/android-chrome-512x512.png')
    .resize(192, 192)
    .png()
    .toFile('assets/favicons/android-chrome-192x192.png');

  // 180x180 apple touch
  await sharp('assets/favicons/android-chrome-512x512.png')
    .resize(180, 180)
    .png()
    .toFile('assets/favicons/apple-touch-icon.png');

  // 32x32
  await sharp('assets/favicons/android-chrome-512x512.png')
    .resize(32, 32)
    .png()
    .toFile('assets/favicons/favicon-32x32.png');
  
  // Also copy 32x32 to favicon.ico and root favicon.ico
  fs.copyFileSync('assets/favicons/favicon-32x32.png', 'favicon.ico');
  fs.copyFileSync('assets/favicons/favicon-32x32.png', 'assets/favicons/favicon.ico');

  // Webmanifest
  const manifest = {
    name: 'MAK BUILD — Construction & Design',
    short_name: 'MAK BUILD',
    icons: [
      { src: 'assets/favicons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
      { src: 'assets/favicons/android-chrome-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
    ],
    theme_color: '#080b11',
    background_color: '#080b11',
    display: 'standalone',
    start_url: './'
  };
  fs.writeFileSync('assets/favicons/site.webmanifest', JSON.stringify(manifest, null, 2));

  // OG Image (1200x630): Dark gradient + Villa preview on right + Logo on left
  console.log('Generating OG Image...');
  const villaOg = await sharp('assets/villa-contemporary-after.png')
    .resize(600, 630, { fit: 'cover' })
    .toBuffer();

  const logoOg = await sharp('assets/mak-logo-hd-clean.png')
    .resize(400, null, { withoutEnlargement: true })
    .toBuffer();

  const svgText = Buffer.from(`
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="#080b11"/>
      <circle cx="200" cy="200" r="350" fill="#d4af37" opacity="0.08"/>
      <text x="80" y="430" font-family="sans-serif" font-size="36" font-weight="bold" fill="#ffffff">Modern Construction &amp; Design</text>
      <text x="80" y="475" font-family="sans-serif" font-size="22" fill="#d4af37">Villas &#x2022; Commercial &#x2022; Interiors &#x2022; Vastu</text>
      <text x="80" y="520" font-family="sans-serif" font-size="18" fill="#94a3b8">Sirkazhi &#x2022; Mayiladuthurai &#x2022; Chidambaram &#x2022; Poompuhar</text>
    </svg>
  `);

  await sharp(svgText)
    .composite([
      { input: villaOg, left: 600, top: 0 },
      { input: logoOg, left: 80, top: 80 }
    ])
    .jpeg({ quality: 90 })
    .toFile('assets/og-image.jpg');

  console.log('Favicons and OG image created successfully!');
}

makeFaviconsAndOG().catch(console.error);
