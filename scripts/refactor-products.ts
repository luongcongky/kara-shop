import fs from 'fs';
import path from 'path';

const PRODUCTS_FILE = path.join(process.cwd(), 'src', 'data', 'products.ts');

let content = fs.readFileSync(PRODUCTS_FILE, 'utf-8');

// Add import if not present
if (!content.includes('getCloudinaryUrl')) {
    content = "import { getCloudinaryUrl } from '@/utils/cloudinary';\n" + content;
}

// Replace imageURLs
// Pattern: imageURL: '/assets/...'
// We want: imageURL: getCloudinaryUrl('/assets/...')

// Using regex to match and replace
// Check for single quotes
content = content.replace(/imageURL:\s*'(\/assets\/[^']+)'/g, (match, p1) => {
    return `imageURL: getCloudinaryUrl('${p1}')`;
});

// Check for double quotes just in case
content = content.replace(/imageURL:\s*"(\/assets\/[^"]+)"/g, (match, p1) => {
    return `imageURL: getCloudinaryUrl("${p1}")`;
});

fs.writeFileSync(PRODUCTS_FILE, content, 'utf-8');
console.log('✅ Updated src/data/products.ts');
