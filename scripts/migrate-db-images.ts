import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

// Config Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Config DB
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const ASSETS_DIR = path.join(process.cwd(), 'public', 'assets');
const MAP_FILE = path.join(process.cwd(), 'src', 'data', 'cloudinary-map.json');

// Ensure map file exists/loaded
let imageMap: Record<string, string> = {};
if (fs.existsSync(MAP_FILE)) {
    try {
        imageMap = JSON.parse(fs.readFileSync(MAP_FILE, 'utf-8'));
    } catch(e) {}
}

async function uploadImage(filePath: string): Promise<string | null> {
    const relativePath = path.relative(path.join(process.cwd(), 'public'), filePath).replace(/\\/g, '/');
    const mapKey = '/' + relativePath;

    if (imageMap[mapKey]) {
        return imageMap[mapKey];
    }

    try {
        const folder = 'kara-shop/' + path.dirname(relativePath);
        const publicId = path.basename(filePath, path.extname(filePath));

        console.log(`⬆️ Uploading: ${mapKey}`);
        const result = await cloudinary.uploader.upload(filePath, {
            folder: folder,
            public_id: publicId,
            use_filename: true,
            unique_filename: false,
            overwrite: false, // Don't overwrite if exists
        });
        
        imageMap[mapKey] = result.secure_url;
        return result.secure_url;
    } catch (error) {
        console.error(`❌ Failed upload: ${mapKey}`, error);
        return null;
    }
}

async function main() {
    console.log('🚀 Starting DB Migration to Cloudinary URLs...');

    // 1. Get all ProductImages using local assets
    const images = await prisma.productImage.findMany({
        where: {
            imageURL: {
                startsWith: '/assets',
            },
        },
    });

    console.log(`Open processing ${images.length} images from DB...`);

    let updatedCount = 0;

    for (const img of images) {
        // Construct local file path
        // img.imageURL is like "/assets/products/product-11.jpg"
        // local path: process.cwd() + "/public" + img.imageURL
        const localPath = path.join(process.cwd(), 'public', img.imageURL);
        
        if (fs.existsSync(localPath)) {
            const cloudUrl = await uploadImage(localPath);
            
            if (cloudUrl) {
                // Update DB
                await prisma.productImage.update({
                    where: { id: img.id },
                    data: {
                        imageURL: cloudUrl,
                        imageBlur: cloudUrl, // Update blur as well if needed
                    },
                });
                console.log(`✅ Updated ID ${img.id}: ${img.imageURL} -> ${cloudUrl}`);
                updatedCount++;
            }
        } else {
            console.warn(`⚠️ File not found locally: ${localPath}`);
        }
    }

    // Save map
    fs.writeFileSync(MAP_FILE, JSON.stringify(imageMap, null, 2));
    console.log(`💾 Map updated.`);
    console.log(`🎉 Migration complete. Updated ${updatedCount}/${images.length} records.`);

    await prisma.$disconnect();
    await pool.end();
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
