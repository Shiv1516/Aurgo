const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

let count = 0;
walkDir('/home/shivnilay/Downloads/Augeo/src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.js') || filePath.endsWith('.css')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Convert text-xs to text-sm
    content = content.replace(/text-xs/g, 'text-sm');
    
    // Convert microscopic pixel text classes: text-[10px] through text-[13px] to text-sm
    content = content.replace(/text-\[(1[0-3]|0?[0-9])(\.[0-9]+)?px\]/g, 'text-sm');
    
    // Convert microscopic rem text classes: text-[0.1rem] through text-[0.85rem] to text-sm
    content = content.replace(/text-\[\s*0\.[0-8][0-9]*\s*rem\s*\]/g, 'text-sm');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
      count++;
    }
  }
});

console.log(`Total files updated: ${count}`);
