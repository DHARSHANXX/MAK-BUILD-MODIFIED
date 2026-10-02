const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT_DIR = path.resolve(__dirname, '..');
const logoPngBase64 = fs.readFileSync(path.join(ROOT_DIR, 'assets/logo-mark@2x.png')).toString('base64');

const svgWidth = 1600;
const svgHeight = 1000;

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#141E33"/>
      <stop offset="35%" stop-color="#0B1322"/>
      <stop offset="100%" stop-color="#04070D"/>
    </linearGradient>

    <radialGradient id="centerGlow" cx="50%" cy="30%" r="55%">
      <stop offset="0%" stop-color="rgba(227, 200, 119, 0.22)"/>
      <stop offset="70%" stop-color="rgba(11, 19, 34, 0)"/>
    </radialGradient>

    <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FFF8E0"/>
      <stop offset="30%" stop-color="#E8CE83"/>
      <stop offset="70%" stop-color="#C9A24B"/>
      <stop offset="100%" stop-color="#997322"/>
    </linearGradient>

    <linearGradient id="goldLineGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="rgba(227, 200, 119, 0)"/>
      <stop offset="25%" stop-color="rgba(227, 200, 119, 0.95)"/>
      <stop offset="50%" stop-color="#FFF8E0"/>
      <stop offset="75%" stop-color="rgba(227, 200, 119, 0.95)"/>
      <stop offset="100%" stop-color="rgba(227, 200, 119, 0)"/>
    </linearGradient>

    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="12" stdDeviation="18" flood-color="rgba(0, 0, 0, 0.85)"/>
    </filter>

    <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="8" flood-color="rgba(201, 162, 75, 0.6)"/>
    </filter>
  </defs>

  <!-- Base Plate Background with Luxury Bevel -->
  <rect x="20" y="20" width="${svgWidth - 40}" height="${svgHeight - 40}" rx="32" fill="url(#bgGrad)" stroke="url(#goldGrad)" stroke-width="5" filter="url(#shadow)"/>
  
  <!-- Subtle Center Radial Glow -->
  <rect x="24" y="24" width="${svgWidth - 48}" height="${svgHeight - 48}" rx="28" fill="url(#centerGlow)"/>

  <!-- Inner Hairline Gold Border -->
  <rect x="46" y="46" width="${svgWidth - 92}" height="${svgHeight - 92}" rx="22" fill="none" stroke="rgba(227, 200, 119, 0.45)" stroke-width="2"/>

  <!-- 4 Corner Brass Rivets / Mounting Screws -->
  <g fill="url(#goldGrad)">
    <circle cx="72" cy="72" r="10"/>
    <circle cx="${svgWidth - 72}" cy="72" r="10"/>
    <circle cx="72" cy="${svgHeight - 72}" r="10"/>
    <circle cx="${svgWidth - 72}" cy="${svgHeight - 72}" r="10"/>
  </g>

  <!-- MAK BUILD Transparent Logo Mark (includes icon + brand title + sub) -->
  <image x="560" y="60" width="480" height="300" href="data:image/png;base64,${logoPngBase64}" filter="url(#goldGlow)"/>

  <!-- Architectural Gold Divider Line with Center Diamond -->
  <line x1="220" y1="385" x2="1380" y2="385" stroke="url(#goldLineGrad)" stroke-width="3" stroke-linecap="round"/>
  <polygon points="800,372 814,385 800,398 786,385" fill="#FFF8E0" filter="url(#goldGlow)"/>

  <!-- Engineer Name (High Contrast, Bold, Ultra Crisp) -->
  <text x="800" y="475" text-anchor="middle" font-family="'Segoe UI', -apple-system, BlinkMacSystemFont, 'Arial', sans-serif" font-size="64" font-weight="900" fill="#FFFFFF" letter-spacing="1">Er. Manikandan Rajendran</text>

  <!-- Credentials Pill Badges (High Contrast, Crisp & Distinct) -->
  <!-- Left Pill: Civil & Structural Engineer -->
  <rect x="270" y="520" width="510" height="68" rx="34" fill="rgba(201, 162, 75, 0.22)" stroke="url(#goldGrad)" stroke-width="2.5"/>
  <text x="525" y="565" text-anchor="middle" font-family="'Segoe UI', -apple-system, BlinkMacSystemFont, 'Arial', sans-serif" font-size="30" font-weight="800" fill="#FFFFFF" letter-spacing="0.5">Civil &amp; Structural Engineer</text>

  <!-- Right Pill: Registered Engineer -->
  <rect x="820" y="520" width="510" height="68" rx="34" fill="rgba(201, 162, 75, 0.22)" stroke="url(#goldGrad)" stroke-width="2.5"/>
  <text x="1075" y="565" text-anchor="middle" font-family="'Segoe UI', -apple-system, BlinkMacSystemFont, 'Arial', sans-serif" font-size="30" font-weight="800" fill="#FFFFFF" letter-spacing="0.5">Registered Engineer</text>

  <!-- Studio Physical Address with Gold Map Pin Icon -->
  <g transform="translate(260, 672)">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#E8CE83" transform="scale(2.0) translate(-6, -18)"/>
  </g>
  <text x="825" y="680" text-anchor="middle" font-family="'Segoe UI', -apple-system, BlinkMacSystemFont, 'Arial', sans-serif" font-size="44" font-weight="700" fill="#F4F8FC" letter-spacing="1">117C, Pidari South Street, Sirkazhi 609110</text>

  <!-- Visit Studio Action Banner (Luminous, Bold, 100% Readable) -->
  <rect x="360" y="755" width="880" height="92" rx="46" fill="rgba(201, 162, 75, 0.28)" stroke="url(#goldGrad)" stroke-width="3" filter="url(#goldGlow)"/>
  <text x="800" y="813" text-anchor="middle" font-family="'Segoe UI', -apple-system, BlinkMacSystemFont, 'Arial', sans-serif" font-size="34" font-weight="900" fill="#FFF8E0" letter-spacing="6">VISIT OUR SIRKAZHI STUDIO</text>
</svg>
`;

async function main() {
  const svgBuffer = Buffer.from(svg);
  const outOriginal = path.join(ROOT_DIR, 'assets/originals/office-signboard.webp');
  
  console.log('Rendering high-contrast HD signboard master to', outOriginal);
  await sharp(svgBuffer)
    .webp({ quality: 98, effort: 6 })
    .toFile(outOriginal);
    
  console.log('Office signboard master updated successfully!');
}

main().catch(console.error);
