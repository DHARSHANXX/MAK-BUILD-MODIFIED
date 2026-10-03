const fs = require('fs');
const b64 = fs.readFileSync('assets/logo-mark-dark.png').toString('base64');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
  <defs>
    <filter id="glow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="rgba(201, 162, 75, 0.20)" />
    </filter>
  </defs>
  <image width="200" height="150" href="data:image/png;base64,${b64}" />
</svg>`;
fs.writeFileSync('assets/logo-mark-dark.svg', svg);
console.log('Created assets/logo-mark-dark.svg successfully!');
