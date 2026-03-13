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
    
    // Replace any text-[XXpx] where XX is < 12 with text-xs
    content = content.replace(/text-\[(1[0-1]|[0-9])(\.[0-9]+)?px\]/g, 'text-xs');
    
    // Convert microscopic text classes (if they exist)
    content = content.replace(/text-\[\s*0\.[0-6][0-9]*\s*rem\s*\]/g, 'text-xs');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
      count++;
    }
  }
});

console.log(`Total files updated: ${count}`);
