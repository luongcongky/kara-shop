import { chromium, Page } from 'playwright';
import fs from 'fs';
import path from 'path';

const PRODUCT_JSON_PATH = path.join(process.cwd(), 'src', 'data', 'imported-products.json');

async function scrapeProductDescription(page: Page, productName: string): Promise<string | null> {
  try {
    console.log(`\n--- Đang xử lý: ${productName} ---`);
    
    // 1. Quay lại trang chủ để search mới (hoặc search trực tiếp từ thanh header)
    await page.goto('https://kyma.vn/', { waitUntil: 'networkidle' });

    // 2. Search
    const searchInput = page.locator('#keyword').first();
    await searchInput.waitFor({ state: 'visible' });
    await searchInput.fill(productName);
    await page.keyboard.press('Enter');

    console.log('--- Đợi 5 giây sau khi search... ---');
    await page.waitForTimeout(5000);

    // Chờ kết quả hoặc thông báo không tìm thấy
    await page.waitForLoadState('networkidle');
    
    // Kiểm tra xem có kết quả không
    const firstProduct = page.locator('.list-product .item a, .product-list .item a, .p-item a, a h3').first();
    const isFound = await firstProduct.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (!isFound) {
      console.log(`[!] Không tìm thấy sản phẩm: ${productName}`);
      return null;
    }

    // 3. Vào chi tiết
    console.log(`[INFO] Click vào chi tiết sản phẩm...`);
    await firstProduct.click();
    
    console.log('--- Đợi 5 giây để tải trang chi tiết... ---');
    await page.waitForTimeout(5000);
    await page.waitForLoadState('networkidle');

    // 4. Click "Đọc thêm"
    const docThemBtn = page.locator('#showContent').first();
    if (await docThemBtn.isVisible()) {
      await docThemBtn.click();
      console.log('--- Đã click "Đọc thêm", đợi 5 giây để bung nội dung... ---');
      await page.waitForTimeout(5000); 
    }

    // 5. Trích xuất nội dung
    console.log('--- Đang trích xuất nội dung (CHỈ TỪ .danhgia_infor) ---');
    const descriptionContainer = page.locator('.danhgia_infor, #danhgia_infor').first();
    
    // Đợi container xuất hiện (đôi khi nó load chậm sau khi click Đọc thêm)
    await descriptionContainer.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    
    if (await descriptionContainer.isVisible()) {
      const content = await descriptionContainer.innerText().catch(() => '');
      if (content.trim().length > 50) {
        console.log(`[OK] Đã trích xuất thành công từ .danhgia_infor (Độ dài: ${content.trim().length})`);
        console.log('--- Đợi 5 giây trước khi sang bước tiếp theo... ---');
        await page.waitForTimeout(5000);
        return content.trim();
      }
    }

    console.log('[!] Không tìm thấy .danhgia_infor hoặc nội dung quá ngắn.');
    console.log('--- Đợi 5 giây trước khi sang bước tiếp theo... ---');
    await page.waitForTimeout(5000);
    return null;
  } catch (error) {
    console.error(`[X] Lỗi khi xử lý ${productName}:`, error);
    return null;
  }
}

async function runBatchScraper() {
  const products = JSON.parse(fs.readFileSync(PRODUCT_JSON_PATH, 'utf-8'));
  console.log(`--- Đã tải ${products.length} sản phẩm từ JSON ---`);

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  let updatedCount = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    
    // Chỉ crawl nếu description đang trống
    if (!product.description || product.description.trim() === "") {
      const description = await scrapeProductDescription(page, product.name);
      
      if (description && description.length > 0) {
        products[i].description = description;
        updatedCount++;
        console.log(`[OK] Đã cập nhật description cho: ${product.name}`);
        
        // Lưu tạm sau mỗi sản phẩm thành công để đảm bảo an toàn dữ liệu
        if (updatedCount % 1 === 0) {
          fs.writeFileSync(PRODUCT_JSON_PATH, JSON.stringify(products, null, 2));
          console.log(`--- [SAVE] Đã lưu tiến trình (${updatedCount} sản phẩm) ---`);
        }
      } else {
        console.log(`[!] Không lấy được dữ liệu hữu ích cho: ${product.name}`);
      }
      
      // Nghỉ lâu một chút giữa các sản phẩm
      console.log('--- Đợi 5 giây trước khi xử lý sản phẩm tiếp theo... ---');
      await page.waitForTimeout(5000);
    } else {
      console.log(`[SKIP] Đã có description: ${product.name}`);
    }
  }

  // Lưu file cuối cùng
  fs.writeFileSync(PRODUCT_JSON_PATH, JSON.stringify(products, null, 2));
  console.log(`\n=== HOÀN THÀNH ===`);
  console.log(`Tổng số sản phẩm đã cập nhật: ${updatedCount}`);

  await browser.close();
}

runBatchScraper();
