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
    
    // Process text classes safely by using a temporary token so we don't double replace
    // xs -> sm
    // sm -> base
    // base -> lg
    // lg -> xl
    // xl -> 2xl
    // 2xl -> 3xl
    // 3xl -> 4xl
    // 4xl -> 5xl

    content = content.replace(/text-xs/g, '@@TEXT_SM@@');
    content = content.replace(/text-sm/g, '@@TEXT_BASE@@');
    content = content.replace(/text-base/g, '@@TEXT_LG@@');
    content = content.replace(/text-lg/g, '@@TEXT_XL@@');
    content = content.replace(/text-xl/g, '@@TEXT_2XL@@');
    content = content.replace(/text-2xl/g, '@@TEXT_3XL@@');
    content = content.replace(/text-3xl/g, '@@TEXT_4XL@@');
    content = content.replace(/text-4xl/g, '@@TEXT_5XL@@');
    content = content.replace(/text-5xl/g, '@@TEXT_6XL@@');
    content = content.replace(/text-6xl/g, '@@TEXT_7XL@@');
    content = content.replace(/text-7xl/g, '@@TEXT_8XL@@');

    // Replace the temporary tokens
    content = content.replace(/@@TEXT_SM@@/g, 'text-sm');
    content = content.replace(/@@TEXT_BASE@@/g, 'text-base');
    content = content.replace(/@@TEXT_LG@@/g, 'text-lg');
    content = content.replace(/@@TEXT_XL@@/g, 'text-xl');
    content = content.replace(/@@TEXT_2XL@@/g, 'text-2xl');
    content = content.replace(/@@TEXT_3XL@@/g, 'text-3xl');
    content = content.replace(/@@TEXT_4XL@@/g, 'text-4xl');
    content = content.replace(/@@TEXT_5XL@@/g, 'text-5xl');
    content = content.replace(/@@TEXT_6XL@@/g, 'text-6xl');
    content = content.replace(/@@TEXT_7XL@@/g, 'text-7xl');
    content = content.replace(/@@TEXT_8XL@@/g, 'text-8xl');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
      count++;
    }
  }
});

console.log(`Total files updated: ${count}`);
