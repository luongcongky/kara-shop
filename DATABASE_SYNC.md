# Hướng dẫn đồng bộ Database giữa Local và Supabase (CẬP NHẬT)

Tài liệu này cung cấp quy trình đồng bộ **HOÀN TOÀN TỰ ĐỘNG** đảm bảo cấu trúc (Schema) và dữ liệu (Data) luôn khớp 100% giữa môi trường local và Supabase.

---

## 🚀 Quy trình Sync Tự động (Khuyến nghị)

### Cách sử dụng đơn giản nhất:

```bash
npm run db:sync
```

Script này sẽ tự động:
1. ✅ Export toàn bộ schema + data từ local
2. ✅ Hướng dẫn bạn chuyển connection sang Supabase
3. ✅ Apply schema structure
4. ✅ Import ALL data (tất cả tables)
5. ✅ Verify tính toàn vẹn dữ liệu

> [!IMPORTANT]
> **Script tự động phát hiện TẤT CẢ tables** trong database thông qua `information_schema`, không cần hardcode danh sách tables. Điều này đảm bảo không bao giờ bỏ sót data!

---

## 📋 Quy trình thủ công (Chi tiết từng bước)

Nếu bạn muốn kiểm soát từng bước:

### Bước 1: Export Database từ Local

**1a. Export toàn bộ data:**
```bash
npm run db:dump-complete
```
- Tự động discover ALL tables
- Export theo thứ tự dependencies (foreign keys)
- Lưu vào: `prisma/data/complete-db-dump.json`

**1b. Export schema structure (optional):**
```bash
npm run db:introspect
```
- Tạo file SQL DDL: `prisma/data/schema-structure.sql`
- Hữu ích để review cấu trúc database

---

### Bước 2: Chuyển kết nối sang Supabase

Mở file `.env` và cập nhật:

```env
# Supabase Configuration
DATABASE_URL="postgresql://postgres.[id]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
DIRECT_URL="postgresql://postgres.[id]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

> [!NOTE]
> - **DATABASE_URL** (port `6543`): Transaction mode cho app
> - **DIRECT_URL** (port `5432`): Session mode cho migrations

---

### Bước 3: Đồng bộ Schema

```bash
npx prisma db push --accept-data-loss
```

Hoặc nếu muốn dùng migrations:
```bash
npm run migrate
```

> [!TIP]
> **Nếu gặp lỗi P3005 (schema not empty):**
> - Chạy `npx prisma db push --accept-data-loss` để force sync
> - Hoặc manually drop tables trong Supabase trước

---

### Bước 4: Import Data

```bash
npm run db:seed-complete
```

Script này sẽ:
- ✅ Tự động disable foreign key constraints
- ✅ Xóa data cũ trong Supabase
- ✅ Import ALL tables theo đúng thứ tự dependencies
- ✅ Reset sequences về giá trị đúng
- ✅ Re-enable constraints và verify

---

### Bước 5: Verify Sync

```bash
npm run db:verify
```

Kiểm tra:
- ✅ Số lượng tables
- ✅ Số lượng rows từng table
- ✅ Sequences values
- ✅ Foreign key constraints

---

## 🔧 Các lệnh mới

| Lệnh | Mô tả |
|------|-------|
| `npm run db:dump-complete` | Export TOÀN BỘ database (auto-discover) |
| `npm run db:introspect` | Export schema structure as SQL |
| `npm run db:seed-complete` | Import TOÀN BỘ data vào target DB |
| `npm run db:sync` | **Sync tự động** (khuyến nghị) |
| `npm run db:verify` | Verify tính toàn vẹn sau sync |

---

## ⚡ So sánh với quy trình cũ

### ❌ Quy trình cũ (có vấn đề):
- Chỉ export Collections, Products, Banners, FlashSales
- **THIẾU**: Users, Accounts, Sessions, VerificationTokens
- Hardcode danh sách tables → dễ quên

### ✅ Quy trình mới (cải tiến):
- **Tự động discover ALL tables** qua `information_schema`
- Export theo đúng thứ tự foreign key dependencies
- Xử lý circular dependencies
- Verify completeness sau sync
- **KHÔNG BAO GIỜ BỎ SÓT DATA**

---

## 🛡️ An toàn & Best Practices

> [!WARNING]
> **Trước khi sync:**
> - Backup Supabase nếu có data quan trọng
> - Kiểm tra `.env` đang point đúng database
> - Test script trên database clone trước

> [!CAUTION]
> **Script sẽ XÓA TOÀN BỘ DATA hiện có trong target database!**
> - Đảm bảo bạn đã backup
> - Chỉ chạy khi chắc chắn muốn overwrite

---

## 🔍 Troubleshooting

### Lỗi: "Foreign key constraint violation"
- Script tự động disable constraints, nhưng nếu vẫn lỗi:
- Kiểm tra data integrity trong source database

### Lỗi: "Sequence already exists"
- Bình thường, script sẽ reset sequences
- Nếu lỗi, manually drop sequences trong Supabase

### Data count không khớp
- Chạy `npm run db:verify` để xem chi tiết
- Kiểm tra logs của `seed-complete` để tìm table bị lỗi

---

## 📝 Files được tạo

- `prisma/data/complete-db-dump.json` - Complete data export (gitignored)
- `prisma/data/schema-structure.sql` - DDL statements (có thể commit)

---

> [!IMPORTANT]
> **Luôn verify sau khi sync:**
> ```bash
> npm run db:verify
> ```
> Script này sẽ so sánh Supabase với dump file và báo cáo mọi sự khác biệt.
