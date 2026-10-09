const fs = require('fs');
const content = fs.readFileSync('content.js', 'utf8');
const vm = require('vm');
const sandbox = { window: {} };
vm.runInNewContext(content, sandbox);
const CONTENT = sandbox.window.MAK_CONTENT;

console.log('--- Checking spec2026 for brackets and prices ---');
CONTENT.spec2026.forEach(g => {
  g.items.forEach(item => {
    ['a', 'b', 'c', 'd'].forEach(col => {
      const val = item[col];
      if (typeof val === 'string' && (val.includes('₹') || val.includes('('))) {
        console.log(`Row ${item.no} (${item.name}) [${col}]: ${val}`);
      }
    });
  });
});
