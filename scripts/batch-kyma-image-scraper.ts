import { chromium, Page } from 'playwright';
import fs from 'fs';
import path from 'path';

const PRODUCT_JSON_PATH = path.join(process.cwd(), 'src', 'data', 'imported-products.json');
const DOWNLOAD_BASE_PATH = path.join(process.cwd(), 'downloads', 'products');

async function downloadImage(page: Page, url: string, folderPath: string, fileName: string) {
  try {
    const base64Data = await page.evaluate(async (imgUrl) => {
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') resolve(reader.result);
          else reject(new Error('Failed to convert blob to base64'));
        };
        reader.onerror = () => reject(new Error('FileReader error'));
        reader.readAsDataURL(blob);
      });
    }, url);

    if (base64Data && base64Data.startsWith('data:')) {
      const buffer = Buffer.from(base64Data.split(',')[1], 'base64');
      
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      const filePath = path.join(folderPath, fileName);
      fs.writeFileSync(filePath, new Uint8Array(buffer));
      console.log(`[OK] Download success: ${fileName} (${buffer.length} bytes)`);
    } else {
      console.error(`[X] Failed to get image data for ${url}`);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[X] Lỗi khi tải ảnh ${url}: ${errorMessage}`);
  }
}

async function scrapeProductImages(page: Page, productName: string, productLink: string) {
  try {
    console.log(`\n--- Đang trích xuất hình ảnh cho: ${productName} ---`);

    // Tạo thư mục lưu trữ dựa trên productLink
    // Ví dụ: productLink = "/products/dsc-rx100m7" -> folderName = "dsc-rx100m7"
    const folderName = productLink.split('/').pop() || 'unknown';
    const productFolderPath = path.join(DOWNLOAD_BASE_PATH, folderName);

    if (!fs.existsSync(productFolderPath)) {
      fs.mkdirSync(productFolderPath, { recursive: true });
      console.log(`[INFO] Đã tạo thư mục: ${productFolderPath}`);
    } else {
      // Refresh logic: Xóa các file cũ trong thư mục nếu có
      const files = fs.readdirSync(productFolderPath);
      if (files.length > 0) {
        console.log(`[INFO] Đang làm mới thư mục (xóa ${files.length} file cũ): ${productFolderPath}`);
        for (const file of files) {
          fs.unlinkSync(path.join(productFolderPath, file));
        }
      }
    }

    // 1. Quay lại trang chủ để search mới
    await page.goto('https://kyma.vn/', { waitUntil: 'networkidle' });

    // 2. Search
    const searchInput = page.locator('#keyword').first();
    await searchInput.waitFor({ state: 'visible' });
    await searchInput.fill(productName);
    await page.keyboard.press('Enter');

    console.log('--- Đợi 5 giây sau khi search... ---');
    await page.waitForTimeout(5000);

    // Chờ kết quả
    await page.waitForLoadState('networkidle');

    // Kiểm tra xem có kết quả không
    const firstProduct = page.locator('.list-product .item a, .product-list .item a, .p-item a, a h3').first();
    const isFound = await firstProduct.isVisible({ timeout: 5000 }).catch(() => false);

    if (!isFound) {
      console.log(`[!] Không tìm thấy sản phẩm: ${productName}`);
      return;
    }

    // 3. Vào chi tiết
    console.log(`[INFO] Click vào chi tiết sản phẩm...`);
    await firstProduct.click();

    console.log('--- Đợi 5 giây để tải trang chi tiết... ---');
    await page.waitForTimeout(5000);
    await page.waitForLoadState('networkidle');

    // 5. Tập trung vào div.product__images và download tất cả href
    console.log('--- Đang trích xuất hình ảnh (từ .product__images) ---');
    const imageContainer = page.locator('.product__images').first();

    if (await imageContainer.isVisible()) {
      const imageLinks = await imageContainer.locator('a[href]').all();
      console.log(`[INFO] Tìm thấy ${imageLinks.length} liên kết hình ảnh.`);

      for (let i = 0; i < imageLinks.length; i++) {
        const href = await imageLinks[i].getAttribute('href');
        if (href) {
          // Xử lý URL tuyệt đối nếu href là tương đối
          const imageUrl = href.startsWith('http') ? href : `https://kyma.vn${href}`;
          const fileName = `image_${i + 1}${path.extname(imageUrl.split('?')[0]) || '.jpg'}`;
          
          console.log(`[DOWNLOADING] ${imageUrl} -> ${fileName}`);
          // CHỜ TẢI XONG TỪNG ẢNH
          await downloadImage(page, imageUrl, productFolderPath, fileName);
        }
      }
      console.log(`[OK] Đã tải xong hình ảnh cho: ${productName}`);
    } else {
      console.log('[!] Không tìm thấy div.product__images');
    }

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[X] Lỗi khi xử lý ${productName}:`, errorMessage);
  }
}

async function runBatchImageScraper() {
  const products = JSON.parse(fs.readFileSync(PRODUCT_JSON_PATH, 'utf-8'));
  console.log(`--- Đã tải ${products.length} sản phẩm từ JSON ---`);

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  // Test với 5 sản phẩm đầu tiên hoặc tất cả
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    
    await scrapeProductImages(page, product.name, product.link);
    
    // Nghỉ giữa các sản phẩm
    console.log('--- Đợi 5 giây trước khi xử lý sản phẩm tiếp theo... ---');
    await page.waitForTimeout(5000);
  }

  console.log(`\n=== HOÀN THÀNH ===`);
  await browser.close();
}

runBatchImageScraper();
