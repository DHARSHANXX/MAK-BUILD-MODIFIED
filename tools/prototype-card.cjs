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
      <stop offset="40%" stop-color="#070C16"/>
      <stop offset="100%" stop-color="#04060C"/>
    </linearGradient>

    <!-- Refined Thin Gold Accent Border -->
    <linearGradient id="refinedGoldBorder" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="rgba(235, 212, 142, 0.65)"/>
      <stop offset="30%" stop-color="rgba(201, 162, 75, 0.40)"/>
      <stop offset="70%" stop-color="rgba(235, 212, 142, 0.60)"/>
      <stop offset="100%" stop-color="rgba(165, 126, 42, 0.40)"/>
    </linearGradient>

    <!-- Button Border Gradient -->
    <linearGradient id="btnBorder" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="rgba(201, 162, 75, 0.45)"/>
      <stop offset="50%" stop-color="rgba(245, 222, 155, 0.85)"/>
      <stop offset="100%" stop-color="rgba(201, 162, 75, 0.45)"/>
    </linearGradient>

    <!-- Architectural CAD Grid Pattern -->
    <pattern id="archGrid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(201, 162, 75, 0.025)" stroke-width="1"/>
      <circle cx="0" cy="0" r="1.2" fill="rgba(201, 162, 75, 0.06)"/>
    </pattern>

    <!-- Subtle Radial Vignette -->
    <radialGradient id="innerDepth" cx="50%" cy="38%" r="65%">
      <stop offset="0%" stop-color="rgba(201, 162, 75, 0.05)"/>
      <stop offset="55%" stop-color="rgba(11, 19, 34, 0)"/>
      <stop offset="100%" stop-color="rgba(0, 0, 0, 0.45)"/>
    </radialGradient>

    <!-- Button Surface Gradient -->
    <linearGradient id="btnBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(201, 162, 75, 0.12)"/>
      <stop offset="100%" stop-color="rgba(201, 162, 75, 0.04)"/>
    </linearGradient>
  </defs>

  <!-- Full-bleed Card Plate: Single refined thin gold border with subtle rounded corners (no outer margin, no nested borders) -->
  <rect x="2" y="2" width="${svgWidth - 4}" height="${svgHeight - 4}" rx="20" fill="url(#bgGrad)" stroke="url(#refinedGoldBorder)" stroke-width="2.5"/>

  <!-- Architectural Background Texture (Barely visible subtle CAD grid & depth vignette) -->
  <rect x="3" y="3" width="${svgWidth - 6}" height="${svgHeight - 6}" rx="18" fill="url(#archGrid)"/>
  <rect x="3" y="3" width="${svgWidth - 6}" height="${svgHeight - 6}" rx="18" fill="url(#innerDepth)"/>

  <!-- MAK BUILD Vector Brand Mark (reduced size, generous breathing room, 0 glow) -->
  <image x="645" y="150" width="310" height="232" href="data:image/png;base64,${logoPngBase64}"/>

  <!-- Er. Manikandan Rajendran (Primary text, elegant typography, crisp pure white) -->
  <text x="800" y="485" text-anchor="middle" font-family="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif" font-size="52" font-weight="700" fill="#FFFFFF" letter-spacing="0.8">Er. Manikandan Rajendran</text>

  <!-- Two Professional Titles: Smaller, refined, perfectly aligned badges -->
  <!-- Left Title: Civil & Structural Engineer (360px wide) -->
  <g transform="translate(450, 535)">
    <rect x="0" y="0" width="360" height="46" rx="8" fill="rgba(255, 255, 255, 0.03)" stroke="rgba(201, 162, 75, 0.38)" stroke-width="1.2"/>
    <text x="180" y="30" text-anchor="middle" font-family="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif" font-size="21" font-weight="600" fill="#E2E8F0" letter-spacing="0.4">Civil &amp; Structural Engineer</text>
  </g>

  <!-- Right Title: Registered Engineer (310px wide) -->
  <g transform="translate(840, 535)">
    <rect x="0" y="0" width="310" height="46" rx="8" fill="rgba(255, 255, 255, 0.03)" stroke="rgba(201, 162, 75, 0.38)" stroke-width="1.2"/>
    <text x="155" y="30" text-anchor="middle" font-family="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif" font-size="21" font-weight="600" fill="#E2E8F0" letter-spacing="0.4">Registered Engineer</text>
  </g>

  <!-- Studio Physical Address: Clean, compact with subtle gold location pin icon -->
  <g transform="translate(490, 660)">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#C9A24B" transform="translate(0, -22) scale(1.15)"/>
    <text x="36" y="0" font-family="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif" font-size="27" font-weight="500" fill="#CBD5E1" letter-spacing="0.5">117C, Pidari South Street, Sirkazhi 609110</text>
  </g>

  <!-- Visit Studio Action Button: Refined modern CTA (reduced width, elegant button rather than a large pill) -->
  <g transform="translate(560, 740)">
    <rect x="0" y="0" width="480" height="60" rx="8" fill="url(#btnBg)" stroke="url(#btnBorder)" stroke-width="1.5"/>
    <text x="240" y="37" text-anchor="middle" font-family="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif" font-size="20" font-weight="700" fill="#FFF0C2" letter-spacing="2.2">VISIT OUR SIRKAZHI STUDIO</text>
  </g>
</svg>
`;

sharp(Buffer.from(svg))
  .png()
  .toFile(path.join(ROOT_DIR, 'test_redesign_card_fullbleed.png'))
  .then(() => console.log('Successfully saved test_redesign_card_fullbleed.png'));
