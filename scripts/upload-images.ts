import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load env vars
dotenv.config();

// Config Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define directories
// public/assets is at ../../public/assets relative to this script in scripts/ folder?
// Adjust path based on where we place this script. Assuming scripts/upload-images.ts -> ../public/assets
const ASSETS_DIR = path.join(process.cwd(), 'public', 'assets');
const OUTPUT_FILE = path.join(process.cwd(), 'src', 'data', 'cloudinary-map.json');

// Ensure output dir exists
const outputDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

interface ImageMap {
  [localPath: string]: string;
}

// Helper to walk directory
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
    } else {
      // Filter for images
      if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)) {
        arrayOfFiles.push(path.join(dirPath, file));
      }
    }
  });

  return arrayOfFiles;
}

async function uploadImages() {
  console.log('🚀 Starting upload to Cloudinary...');
  console.log(`📂 Scanning: ${ASSETS_DIR}`);

  if (!fs.existsSync(ASSETS_DIR)) {
    console.error('❌ Assets directory not found!');
    return;
  }

  const files = getAllFiles(ASSETS_DIR);
  console.log(`📸 Found ${files.length} images.`);

  const imageMap: ImageMap = {};
  
  // Load existing map if exists to skip duplicates (optional, strictly speaking we might want to overwrite or check)
  if (fs.existsSync(OUTPUT_FILE)) {
      try {
          const existing = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
          Object.assign(imageMap, existing);
      } catch (e) {
          console.log('⚠️ Could not read existing map, starting fresh.');
      }
  }

  for (const filePath of files) {
    const relativePath = path.relative(path.join(process.cwd(), 'public'), filePath).replace(/\\/g, '/');
    // Key for map: "/assets/..." (ensure leading slash)
    const mapKey = '/' + relativePath;

    // Skip if already mapped (comment out if you want to force update)
    if (imageMap[mapKey]) {
        console.log(`⏩ Skipping (already mapped): ${mapKey}`);
        continue;
    }

    console.log(`⬆️ Uploading: ${mapKey}`);
    
    try {
      // Create a folder structure in Cloudinary matching local
      // e.g. assets/banner/foo.jpg -> folder: kara-shop/assets/banner
      const folder = 'kara-shop/' + path.dirname(relativePath);
      const publicId = path.basename(filePath, path.extname(filePath));

      const result = await cloudinary.uploader.upload(filePath, {
        folder: folder,
        public_id: publicId,
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      });

      imageMap[mapKey] = result.secure_url;
      console.log(`✅ Uploaded: ${result.secure_url}`);
    } catch (error) {
      console.error(`❌ Failed to upload ${mapKey}:`, error);
    }
  }

  // Save map
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(imageMap, null, 2));
  console.log(`\n💾 Saved mapping to: ${OUTPUT_FILE}`);
}

uploadImages();
