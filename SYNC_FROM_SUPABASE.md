# Hướng dẫn Sync Data từ Supabase về Local

## Script tự động: `sync-from-supabase.ts`

Script này tự động hóa toàn bộ quy trình sync dữ liệu từ Supabase production về local database.

---

## 🚀 Cách sử dụng nhanh

### Bước 1: Chuẩn bị file `.env`

Đảm bảo file `.env` của bạn có **CẢ HAI** connection strings:

```env
# Supabase (Production)
DATABASE_URL="postgresql://postgres.[id]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"

# Local (Development) - có thể comment lại
# DATABASE_URL="postgresql://postgres:password@localhost:5432/kara_shop"
```

> [!NOTE]
> Script sẽ tự động phát hiện cả hai URLs, kể cả khi một trong hai bị comment.

### Bước 2: Chạy script

```bash
npm run db:sync-from-supabase
```

### Bước 3: Xác nhận

Script sẽ hiển thị thông tin và yêu cầu xác nhận. Nhập `yes` hoặc `y` để tiếp tục.

---

## 📋 Script sẽ làm gì?

### 📥 STEP 1: Export từ Supabase

1. ✅ Kết nối đến Supabase database
2. ✅ Tự động phát hiện tất cả tables trong schema `ecommerce`
3. ✅ Phân tích foreign key dependencies
4. ✅ Export data theo đúng thứ tự dependencies
5. ✅ Lưu sequences (auto-increment values)
6. ✅ Tạo backup file: `prisma/data/supabase-backup.json`

### 📤 STEP 2: Import vào Local

1. ✅ Kết nối đến local database
2. ✅ Tạm thời disable foreign key constraints
3. ✅ Xóa toàn bộ dữ liệu cũ trong local
4. ✅ Import data theo đúng thứ tự dependencies
5. ✅ Reset sequences về giá trị đúng
6. ✅ Re-enable foreign key constraints
7. ✅ Verify tính toàn vẹn dữ liệu

---

## 💡 Tính năng nổi bật

### ✅ Tự động phát hiện URLs

- Script tự động tìm Supabase URL và Local URL trong `.env`
- Hoạt động ngay cả khi một trong hai bị comment
- Không cần chỉnh sửa `.env` thủ công

### ✅ An toàn

- Yêu cầu xác nhận trước khi xóa dữ liệu
- Tạo backup file trước khi import
- Disable/enable foreign keys đúng cách
- Verify dữ liệu sau khi import

### ✅ Thông minh

- Tự động phát hiện tất cả tables
- Phân tích dependencies
- Export/Import theo đúng thứ tự
- Xử lý circular dependencies

---

## 📁 Backup file

Script tự động tạo backup file tại:
```
prisma/data/supabase-backup.json
```

File này chứa:
- **Metadata**: Thời gian export, source, số lượng tables
- **Sequences**: Auto-increment values
- **Data**: Toàn bộ dữ liệu từ tất cả tables

Bạn có thể sử dụng file này để:
- Khôi phục dữ liệu nếu có vấn đề
- Import vào database khác
- Kiểm tra dữ liệu đã sync

---

## 🔧 Troubleshooting

### Lỗi: "Supabase DATABASE_URL not found"

**Nguyên nhân**: Không tìm thấy Supabase connection string trong `.env`

**Giải pháp**: Thêm Supabase URL vào `.env`:
```env
DATABASE_URL="postgresql://postgres.[id]:[password]@...supabase.com:6543/postgres"
```

### Lỗi: "Local DATABASE_URL not found"

**Nguyên nhân**: Không tìm thấy local connection string trong `.env`

**Giải pháp**: Thêm local URL vào `.env` (có thể comment):
```env
# DATABASE_URL="postgresql://postgres:password@localhost:5432/kara_shop"
```

### Lỗi: "Foreign key constraint violation"

**Nguyên nhân**: Dữ liệu trong Supabase có vấn đề về integrity

**Giải pháp**: 
1. Kiểm tra dữ liệu trong Supabase
2. Sửa lỗi foreign key
3. Chạy lại script

### Một số tables không import được

**Nguyên nhân**: Schema local khác với Supabase

**Giải pháp**:
1. Chạy `npx prisma db push` để sync schema
2. Hoặc chạy `npx prisma migrate dev` để apply migrations
3. Chạy lại script sync

---

## 📊 So sánh với quy trình cũ

### ❌ Quy trình cũ (thủ công):

```bash
# 1. Sửa .env thủ công để point đến Supabase
# 2. Export từ Supabase
npm run db:dump-complete
# 3. Sửa .env lại để point về local
# 4. Import vào local
npm run db:seed-complete
```

### ✅ Quy trình mới (tự động):

```bash
npm run db:sync-from-supabase
```

**Lợi ích**:
- ✅ Không cần sửa `.env` thủ công
- ✅ Tự động tạo backup
- ✅ Một lệnh duy nhất
- ✅ Ít lỗi hơn
- ✅ Nhanh hơn

---

## 🎯 Khi nào sử dụng?

### ✅ Nên dùng khi:

- Local database bị empty sau migration reset
- Cần sync dữ liệu mới nhất từ production
- Muốn test với dữ liệu thực
- Cần khôi phục local database

### ⚠️ Cẩn thận khi:

- Local có dữ liệu quan trọng chưa backup
- Đang phát triển tính năng mới với data test
- Supabase có dữ liệu lỗi

---

## ⚠️ Lưu ý quan trọng

> [!WARNING]
> **Script này sẽ XÓA TOÀN BỘ dữ liệu trong local database!**
> - Đảm bảo bạn đã backup nếu cần
> - Chỉ chạy khi chắc chắn muốn overwrite

> [!TIP]
> **Backup file được tạo tự động**
> - File: `prisma/data/supabase-backup.json`
> - Có thể dùng để khôi phục nếu cần
> - Nên commit file này vào git (nếu không chứa sensitive data)

---

## 📝 Output mẫu

```
🔄 ========================================
   SYNC DATA FROM SUPABASE TO LOCAL
   ========================================

📋 Configuration detected:
   Supabase URL: ✓ Found
   Local URL: ✓ Found
   Current active: Supabase

⚠️  WARNING: This will DELETE ALL DATA in your local database!
   and replace it with data from Supabase.

   Do you want to continue? (yes/no): yes

📥 STEP 1: Exporting data from Supabase...

📊 Found 18 tables in Supabase:
   - Account
   - Banner
   - Cart
   - CartItem
   - Collection
   - FlashSale
   - Order
   - OrderItem
   - Product
   - ProductAttribute
   - ProductCollection
   - ProductImage
   - ProductInclusion
   - ProductReview
   - Promotion
   - Session
   - User
   - VerificationToken
   - Wishlist

💾 Exporting data from all tables...
   ✓ User: 5 rows
   ✓ Product: 120 rows
   ✓ Banner: 3 rows
   ✓ FlashSale: 6 rows
   ✓ Promotion: 3 rows
   ...

✅ Export from Supabase completed!
   📊 Tables: 18
   📝 Total rows: 450

💾 Backup saved to: prisma/data/supabase-backup.json

📤 STEP 2: Importing data to Local database...

💾 Importing data in dependency order...
   ✓ User: 5 rows imported
   ✓ Product: 120 rows imported
   ✓ Banner: 3 rows imported
   ✓ FlashSale: 6 rows imported
   ✓ Promotion: 3 rows imported
   ...

✅ Verifying import...
   ✓ User: 5 rows (matches Supabase)
   ✓ Product: 120 rows (matches Supabase)
   ✓ Banner: 3 rows (matches Supabase)
   ✓ FlashSale: 6 rows (matches Supabase)
   ✓ Promotion: 3 rows (matches Supabase)
   ...

✅ ========================================
   SYNC COMPLETED SUCCESSFULLY!
   ========================================

   📊 Total tables synced: 18
   📝 Total rows synced: 450
   💾 Backup file: prisma/data/supabase-backup.json
```

---

## 🔗 Liên quan

- [DATABASE_SYNC.md](./DATABASE_SYNC.md) - Hướng dẫn sync từ Local lên Supabase
- [prisma/schema.prisma](./prisma/schema.prisma) - Database schema
- [scripts/sync-from-supabase.ts](./scripts/sync-from-supabase.ts) - Source code của script
