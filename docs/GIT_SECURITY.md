# Git Security Best Practices

## ⚠️ Vấn đề đã xảy ra

File `prisma/data/latest-db-dump.json` chứa **Google OAuth Access Tokens** đã bị commit và push lên GitHub, kích hoạt GitHub Push Protection.

## ✅ Giải pháp đã áp dụng

### 1. Thêm vào `.gitignore`
```gitignore
# database dumps (may contain sensitive data)
prisma/data/*.json
```

### 2. Xóa file khỏi git tracking
```bash
git rm --cached prisma/data/latest-db-dump.json
git commit -m "chore: add database dumps to gitignore and remove from tracking"
```

### 3. Force push để ghi đè history
```bash
git push origin main --force-with-lease
```

## 🔒 Bảo mật trong tương lai

### Files KHÔNG BAO GIỜ được commit:

1. **Environment files**: `.env`, `.env.local`, `.env.*.local`
2. **Database dumps**: `*.sql`, `*.json` (trong `prisma/data/`)
3. **API keys & secrets**: Bất kỳ file nào chứa tokens, passwords, API keys
4. **Private keys**: `*.pem`, `*.key`, SSH keys

### Checklist trước khi commit:

- [ ] Kiểm tra `git status` - có file nhạy cảm nào không?
- [ ] Review `git diff` - có hardcoded secrets không?
- [ ] Đảm bảo `.gitignore` đầy đủ
- [ ] Sử dụng environment variables thay vì hardcode

### Tools hỗ trợ:

1. **git-secrets**: Scan commits để tìm secrets
2. **pre-commit hooks**: Tự động check trước khi commit
3. **GitHub Secret Scanning**: Tự động phát hiện (như đã thấy)

## 📝 Nếu đã commit sensitive data

1. **KHÔNG** push lên remote
2. Nếu đã push:
   - Revoke/regenerate tất cả secrets bị lộ
   - Remove khỏi git history (như đã làm)
   - Force push để ghi đè
3. Notify team nếu là shared repository

## 🎯 Best Practice cho Database Dumps

Thay vì commit dumps, nên:
- Sử dụng seed scripts với dummy data
- Store dumps locally only
- Use `.env` cho connection strings
- Sanitize data trước khi dump (remove PII, tokens)
