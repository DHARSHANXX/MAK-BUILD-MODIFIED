import fs from 'fs';

// Restore index.dev.html to index.html for Vite development/build step
if (fs.existsSync('index.dev.html')) {
  fs.copyFileSync('index.dev.html', 'index.html');
  console.log('✓ Restored index.dev.html -> index.html for Vite');
}
