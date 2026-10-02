import fs from 'fs';
import path from 'path';

console.log('Syncing dist to root for GitHub Pages...');

// 1. Copy dist/index.html to root index.html
if (fs.existsSync('dist/index.html')) {
  fs.copyFileSync('dist/index.html', 'index.html');
  console.log('✓ Copied dist/index.html -> index.html');
}

// 2. Copy dist/assets/* into assets/
if (fs.existsSync('dist/assets')) {
  if (!fs.existsSync('assets')) fs.mkdirSync('assets', { recursive: true });
  const files = fs.readdirSync('dist/assets');
  files.forEach(f => {
    fs.copyFileSync(path.join('dist/assets', f), path.join('assets', f));
  });
  console.log(`✓ Copied ${files.length} production asset(s) to assets/`);
}

console.log('GitHub Pages root is now ready for deployment!');
