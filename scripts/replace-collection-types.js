const fs = require('fs');
const path = require('path');

const files = [
  'src/data/collections.ts',
  'src/data/products.ts'
];

files.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  console.log(`Processing ${file}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace 'MEN' with 'CLOTHES'
  content = content.replace(/'MEN'/g, "'CLOTHES'");
  
  // Replace 'WOMEN' with 'CLOTHES'
  content = content.replace(/'WOMEN'/g, "'CLOTHES'");
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Updated ${file}`);
});

console.log('All files updated successfully!');
