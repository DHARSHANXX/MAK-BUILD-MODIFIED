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
    <!-- Background Gradient: Deep luxury obsidian-navy -->
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0B1322"/>
      <stop offset="38%" stop-color="#070C16"/>
      <stop offset="100%" stop-color="#04060C"/>
    </linearGradient>

    <!-- Refined Thin Gold Accent Border (Single border, no nested lines) -->
    <linearGradient id="refinedGoldBorder" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="rgba(240, 218, 150, 0.75)"/>
      <stop offset="28%" stop-color="rgba(201, 162, 75, 0.45)"/>
      <stop offset="68%" stop-color="rgba(240, 218, 150, 0.70)"/>
      <stop offset="100%" stop-color="rgba(165, 126, 42, 0.45)"/>
    </linearGradient>

    <!-- Button Border Gradient -->
    <linearGradient id="btnBorder" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="rgba(201, 162, 75, 0.5)"/>
      <stop offset="50%" stop-color="rgba(250, 230, 165, 0.95)"/>
      <stop offset="100%" stop-color="rgba(201, 162, 75, 0.5)"/>
    </linearGradient>

    <!-- Architectural CAD Grid Pattern -->
    <pattern id="archGrid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(201, 162, 75, 0.03)" stroke-width="1"/>
      <circle cx="0" cy="0" r="1.2" fill="rgba(201, 162, 75, 0.08)"/>
    </pattern>

    <!-- Subtle Radial Vignette -->
    <radialGradient id="innerDepth" cx="50%" cy="38%" r="65%">
      <stop offset="0%" stop-color="rgba(201, 162, 75, 0.06)"/>
      <stop offset="55%" stop-color="rgba(11, 19, 34, 0)"/>
      <stop offset="100%" stop-color="rgba(0, 0, 0, 0.45)"/>
    </radialGradient>

    <!-- Button Surface Gradient -->
    <linearGradient id="btnBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(201, 162, 75, 0.14)"/>
      <stop offset="100%" stop-color="rgba(201, 162, 75, 0.04)"/>
    </linearGradient>
  </defs>

  <!-- Full-bleed Card Plate: Single refined thin gold border with subtle rounded corners (no outer margin, no nested borders) -->
  <rect x="3" y="3" width="${svgWidth - 6}" height="${svgHeight - 6}" rx="24" fill="url(#bgGrad)" stroke="url(#refinedGoldBorder)" stroke-width="3.5"/>

  <!-- Architectural Background Texture (Barely visible subtle CAD grid & depth vignette) -->
  <rect x="5" y="5" width="${svgWidth - 10}" height="${svgHeight - 10}" rx="21" fill="url(#archGrid)"/>
  <rect x="5" y="5" width="${svgWidth - 10}" height="${svgHeight - 10}" rx="21" fill="url(#innerDepth)"/>

  <!-- MAK BUILD Vector Brand Mark (reduced size, generous breathing room, 0 glow) -->
  <image x="630" y="125" width="340" height="255" href="data:image/png;base64,${logoPngBase64}"/>

  <!-- Er. Manikandan Rajendran (Primary text, elegant typography, crisp pure white) -->
  <text x="800" y="460" text-anchor="middle" font-family="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif" font-size="60" font-weight="700" fill="#FFFFFF" letter-spacing="1">Er. Manikandan Rajendran</text>

  <!-- Two Professional Titles: Smaller, refined, perfectly aligned badges -->
  <!-- Left Title: Civil & Structural Engineer (410px wide) -->
  <g transform="translate(410, 506)">
    <rect x="0" y="0" width="410" height="54" rx="10" fill="rgba(255, 255, 255, 0.035)" stroke="rgba(201, 162, 75, 0.42)" stroke-width="1.4"/>
    <text x="205" y="36" text-anchor="middle" font-family="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif" font-size="26" font-weight="600" fill="#E8EEF5" letter-spacing="0.5">Civil &amp; Structural Engineer</text>
  </g>

  <!-- Right Title: Registered Engineer (345px wide) -->
  <g transform="translate(845, 506)">
    <rect x="0" y="0" width="345" height="54" rx="10" fill="rgba(255, 255, 255, 0.035)" stroke="rgba(201, 162, 75, 0.42)" stroke-width="1.4"/>
    <text x="172.5" y="36" text-anchor="middle" font-family="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif" font-size="26" font-weight="600" fill="#E8EEF5" letter-spacing="0.5">Registered Engineer</text>
  </g>

  <!-- Studio Physical Address: Clean, compact with subtle gold location pin icon -->
  <g transform="translate(435, 640)">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#D4AF37" transform="translate(0, -25) scale(1.35)"/>
    <text x="42" y="0" font-family="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif" font-size="34" font-weight="500" fill="#CBD5E1" letter-spacing="0.6">117C, Pidari South Street, Sirkazhi 609110</text>
  </g>

  <!-- Visit Studio Action Button: Refined modern CTA (reduced width, elegant button rather than a large pill) -->
  <g transform="translate(520, 718)">
    <rect x="0" y="0" width="560" height="68" rx="10" fill="url(#btnBg)" stroke="url(#btnBorder)" stroke-width="1.8"/>
    <text x="280" y="42" text-anchor="middle" font-family="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif" font-size="25" font-weight="700" fill="#FFF0C2" letter-spacing="2.6">VISIT OUR SIRKAZHI STUDIO</text>
  </g>
</svg>
`;

async function main() {
  const svgBuffer = Buffer.from(svg);
  const outOriginal = path.join(ROOT_DIR, 'assets/originals/office-signboard.webp');
  
  console.log('Rendering redesigned architectural profile card master to', outOriginal);
  await sharp(svgBuffer)
    .webp({ quality: 98, effort: 6 })
    .toFile(outOriginal);
    
  console.log('Office signboard master updated successfully!');
}

main().catch(console.error);
