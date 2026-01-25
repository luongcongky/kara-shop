# Hướng dẫn đồng bộ Database giữa Local và Supabase

Tài liệu này cung cấp quy trình 5 bước để đảm bảo cấu trúc (Schema) và dữ liệu (Data) của bạn luôn đồng bộ giữa môi trường phát triển local và Supabase.

---

### Bước 1: Lưu cấu hình Schema mới nhất (Local)
Dùng lệnh này khi bạn có thay đổi trong file `schema.prisma` và muốn tạo migration để lưu lại lịch sử thay đổi cấu trúc.
```bash
npm run migrate-dev -- --name sync_latest_changes
```
*Lệnh này sẽ tạo file migration mới và cập nhật database local của bạn.*

---

### Bước 2: Lưu lại Data hiện có (Local)
Dùng lệnh này để trích xuất toàn bộ dữ liệu từ database local ra file JSON (`prisma/data/latest-db-dump.json`).
```bash
npm run db-seeds
```
*Lưu ý: File JSON này sẽ được dùng để Seed sang Supabase ở Bước 5.*

---

### Bước 3: Chuyển đổi kết nối sang Supabase (Manual)
Mở file `.env` và cập nhật cả `DATABASE_URL` và `DIRECT_URL`. 
- **DATABASE_URL**: Dùng cổng `6543` (Transaction mode) để tối ưu hiệu năng ứng dụng.
- **DIRECT_URL**: Dùng cổng `5432` (Session mode) hoặc direct host để chạy migration (Bước 4).

```env
# Supabase Configuration
DATABASE_URL="postgresql://postgres.[id]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
DIRECT_URL="postgresql://postgres.[id]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
```
> [!NOTE]
> Prisma 7 yêu cầu `DIRECT_URL` để thực hiện migration trên Supabase vì nó cần kết nối trực tiếp (session mode) thay vì thông qua pooler.

---

### Bước 4: Đồng bộ cấu trúc Schema sang Supabase
Sau khi đã đổi `DATABASE_URL` và `DIRECT_URL` sang Supabase, chạy lệnh này:
```bash
npm run migrate
```
*Lệnh này dùng `prisma migrate deploy`.*

> [!TIP]
> **Nếu gặp lỗi P3005 (The database schema is not empty):**
> Điều này xảy ra khi Supabase đã có sẵn các bảng từ trước. Nếu bạn chắc chắn muốn ghi đè cấu trúc cũ để đồng bộ với Local, hãy chạy lệnh sau để ép buộc đồng bộ Schema (không dùng migration):
> ```bash
> npx prisma db push --accept-data-loss
> ```
> Sau đó, bạn có thể chạy lại `npm run migrate` hoặc dùng `npx prisma migrate resolve --applied [tên_migration_cuối_cùng]` để đánh dấu các migration đã hoàn tất.

---

### Bước 5: Seed Data từ Local lên Supabase
Cuối cùng, chạy lệnh này để đổ dữ liệu từ file JSON (tạo ở Bước 2) vào Supabase.
```bash
npm run db-seed
```
> [!IMPORTANT]
> **Lưu ý về tính năng "Làm sạch" (Sync):**
> Script này hiện đã được cập nhật để tự động XÓA toàn bộ dữ liệu Sản phẩm và Danh mục hiện có trên Supabase trước khi nạp dữ liệu mới từ Local. Điều này đảm bảo Supabase của bạn sẽ khớp 100% với Local (không bị dư thừa các item cũ).

*Script cũng tự động reset các ID sequence để đảm bảo tính nhất quán.*

---
> [!IMPORTANT]
> Luôn kiểm tra kỹ file `.env` trước khi chạy các lệnh trên để tránh ghi đè dữ liệu nhầm môi trường. Nếu Supabase của bạn đang có dữ liệu quan trọng, hãy Backup trước khi chạy Bước 4 (db push) hoặc Bước 5.
