import { chromium, Page } from 'playwright';
import fs from 'fs';
import path from 'path';

const PRODUCT_JSON_PATH = path.join(process.cwd(), 'src', 'data', 'imported-products.json');

interface Specification {
  groupName: string;
  item: string;
  value: string;
}

async function scrapeProductSpecifications(page: Page, productName: string): Promise<Specification[] | null> {
  try {
    console.log(`\n--- Đang trích xuất thông số cho: ${productName} ---`);
    
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
      return null;
    }

    // 3. Vào chi tiết
    console.log(`[INFO] Click vào chi tiết sản phẩm...`);
    await firstProduct.click();
    
    console.log('--- Đợi 5 giây để tải trang chi tiết... ---');
    await page.waitForTimeout(5000);
    await page.waitForLoadState('networkidle');

    // 4. Click tab "Thông số kỹ thuật"
    const thongSoBtn = page.locator('#thongso').first();
    if (await thongSoBtn.isVisible()) {
      await thongSoBtn.click();
      console.log('--- Đã click nút "Thông số", đợi 2 giây để tải nội dung... ---');
      await page.waitForTimeout(2000); 
    } else {
      console.log('[!] Không tìm thấy nút #thongso (tab Thông số kỹ thuật)');
      return null;
    }

    // 5. Trích xuất nội dung từ #thongso_infor
    console.log('--- Đang trích xuất thông số kỹ thuật (từ #thongso_infor) ---');
    const thongsoContainer = page.locator('#thongso_infor').first();
    
    if (await thongsoContainer.isVisible()) {
      const specs: Specification[] = [];
      const groups = await thongsoContainer.locator('.parameter-item').all();
      
      for (const group of groups) {
        const groupName = (await group.locator('.parameter-ttl').innerText().catch(() => '')).trim();
        const itemRows = await group.locator('ul.ulist li').all();
        
        for (const row of itemRows) {
          const item = (await row.locator('.ctLeft').innerText().catch(() => '')).trim();
          const value = (await row.locator('.ctRight').innerText().catch(() => '')).trim().replace(/\s+/g, ' ');
          
          if (item || value) {
            specs.push({ groupName, item, value });
          }
        }
      }

      if (specs.length > 0) {
        console.log(`[OK] Đã trích xuất xong ${specs.length} mục thông số.`);
        return specs;
      }
    }

    console.log('[!] Không tìm thấy dữ liệu trong #thongso_infor.');
    return null;
  } catch (error) {
    console.error(`[X] Lỗi khi xử lý ${productName}:`, error);
    return null;
  }
}

async function runBatchSpecsScraper() {
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
    
    // Chỉ crawl nếu specification đang trống
    if (!product.specification || product.specification === "" || product.specification === "[]") {
      const specs = await scrapeProductSpecifications(page, product.name);
      
      if (specs && specs.length > 0) {
        products[i].specification = JSON.stringify(specs, null, 2);
        updatedCount++;
        console.log(`[OK] Đã cập nhật specification cho: ${product.name}`);
        
        // Lưu tạm sau mỗi sản phẩm thành công
        fs.writeFileSync(PRODUCT_JSON_PATH, JSON.stringify(products, null, 2));
        console.log(`--- [SAVE] Đã lưu tiến trình (${updatedCount} sản phẩm) ---`);
      } else {
        console.log(`[!] Không lấy được thông số cho: ${product.name}`);
      }
      
      // Nghỉ giữa các sản phẩm
      console.log('--- Đợi 5 giây trước khi xử lý sản phẩm tiếp theo... ---');
      await page.waitForTimeout(5000);
    } else {
      console.log(`[SKIP] Đã có specification: ${product.name}`);
    }

  }

  // Lưu file cuối cùng
  fs.writeFileSync(PRODUCT_JSON_PATH, JSON.stringify(products, null, 2));
  console.log(`\n=== HOÀN THÀNH ===`);
  console.log(`Tổng số sản phẩm đã cập nhật: ${updatedCount}`);

  await browser.close();
}

runBatchSpecsScraper();
