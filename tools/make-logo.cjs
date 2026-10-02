const fs = require('fs');
const sharp = require('sharp');

async function makeSvg() {
  const buf = await sharp('assets/logo-mark@2x.png').png().toBuffer();
  const b64 = buf.toString('base64');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 952 713" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
  <defs>
    <filter id="glow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="rgba(201, 162, 75, 0.25)" />
    </filter>
  </defs>
  <image width="952" height="713" href="data:image/png;base64,${b64}" filter="url(#glow)"/>
</svg>`;
  fs.writeFileSync('assets/logo-mark.svg', svg, 'utf8');
  console.log('Saved assets/logo-mark.svg, size:', fs.statSync('assets/logo-mark.svg').size);
}

makeSvg().catch(console.error);
