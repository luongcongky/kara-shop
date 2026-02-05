import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'src/data/imported-products.json');

async function main() {
  try {
    const rawData = fs.readFileSync(filePath, 'utf8');
    const products = JSON.parse(rawData);

    console.log(`Processing ${products.length} products...`);

    const updatedProducts = products.map((product: any) => {
      let collections: number[] = [];

      switch (product.type) {
        case 'Máy Ảnh':
          collections = [200, 91];
          break;
        case 'Ống Kính':
          collections = [300, 93];
          break;
        case 'Phụ kiện':
          collections = [300, 95];
          break;
        default:
          console.warn(`Unrecognized type for product ID ${product.id}: ${product.type}`);
          collections = [];
      }

      return {
        ...product,
        collections
      };
    });

    fs.writeFileSync(filePath, JSON.stringify(updatedProducts, null, 2), 'utf8');
    console.log('Successfully updated imported-products.json with collections.');

  } catch (error) {
    console.error('Error updating collections:', error);
    process.exit(1);
  }
}

main();
