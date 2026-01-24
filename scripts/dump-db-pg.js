const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv/config');

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:123456@localhost:5432/postgres?schema=ecommerce";

const pool = new Pool({
  connectionString,
});

async function main() {
  console.log('📦 Dumping current database state to JSON (using pg)...');

  try {
    // 1. Fetch Collections
    const collectionsResult = await pool.query('SELECT * FROM "ecommerce"."Collection" ORDER BY id ASC');
    const collections = collectionsResult.rows;
    console.log(`✅ Found ${collections.length} collections.`);

    // 2. Fetch Products
    const productsResult = await pool.query('SELECT * FROM "ecommerce"."Product" ORDER BY id ASC');
    const products = productsResult.rows;
    console.log(`✅ Found ${products.length} products.`);

    // 3. Fetch Images for Products
    // In schema.prisma, model is ProductImage.
    console.log('Fetching ProductImages...');
    const imagesResult = await pool.query('SELECT * FROM "ecommerce"."ProductImage"');
    const images = imagesResult.rows;
    console.log(`✅ Found ${images.length} images.`);

    // Map images to products
    const productsWithImages = products.map(product => {
      const productImages = images.filter(img => img.productId === product.id);
      return {
        ...product,
        images: {
          create: productImages.map(img => ({
            imageURL: img.imageURL,
            imageBlur: img.imageBlur,
          }))
        }
      };
    });

    // 3. Construct dump object
    const dumpData = {
      generatedAt: new Date().toISOString(),
      collections,
      products: productsWithImages,
    };

    // 4. Write to file
    const dumpPath = path.join(process.cwd(), 'prisma', 'data', 'latest-db-dump.json');
    
    // Ensure directory exists
    const dir = path.dirname(dumpPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(dumpPath, JSON.stringify(dumpData, null, 2));
    console.log(`💾 Data saved to: ${dumpPath}`);
  } catch (error) {
    console.error('❌ Error fetching data:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
