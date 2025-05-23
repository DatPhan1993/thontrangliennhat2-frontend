# 🔧 Fix API HTTPS URLs - Hướng dẫn

## ❌ **Vấn đề đã được giải quyết:**
- API calls đang sử dụng HTTP thay vì HTTPS
- Console browser báo lỗi Network Error cho các API requests
- Requests đến `http://api.thontrangliennhat.com` thất bại

## ✅ **Giải pháp đã áp dụng:**

### 1. **Tạo file `.env` với HTTPS URLs:**
```bash
REACT_APP_API_URL=https://api.thontrangliennhat.com
REACT_APP_BASE_URL=https://api.thontrangliennhat.com
REACT_APP_PUBLIC_URL=http://localhost:3000
GENERATE_SOURCEMAP=false
CI=false
```

### 2. **Environment Variables được sử dụng:**
- `REACT_APP_API_URL`: URL chính cho API calls (HTTPS)
- `REACT_APP_BASE_URL`: Fallback URL cho API (HTTPS)
- `REACT_APP_PUBLIC_URL`: URL public của frontend (localhost cho dev)

### 3. **Files đã được cấu hình để sử dụng HTTPS:**
- ✅ `src/config/index.js` - Config chính
- ✅ `src/utils/httpRequest.js` - HTTP client
- ✅ `src/services/apiClient.js` - API client
- ✅ `services/apiService.js` - API service
- ✅ `services/libraryService.js` - Library service
- ✅ Tất cả service files khác

## 🚀 **Cách sử dụng:**

### **Development (Local):**
1. Copy file `.env.example` thành `.env`:
   ```bash
   cp .env.example .env
   ```

2. Restart development server:
   ```bash
   npm start
   ```

### **Production (Vercel):**
Environment variables đã được set trong Vercel Dashboard:
- `REACT_APP_API_URL=https://api.thontrangliennhat.com`
- `REACT_APP_BASE_URL=https://api.thontrangliennhat.com`

## 🔍 **Kiểm tra:**
1. Mở browser console (F12)
2. Kiểm tra Network tab
3. Tất cả API requests bây giờ sẽ sử dụng HTTPS
4. Không còn lỗi "Network Error" hoặc "Mixed Content"

## 📝 **Lưu ý:**
- File `.env` không được commit vào Git (đã có trong .gitignore)
- File `.env.example` được commit để làm template
- Localhost URLs vẫn giữ nguyên như yêu cầu
- Chỉ API URLs được thay đổi từ HTTP sang HTTPS

## ✨ **Kết quả:**
- ✅ API calls hoạt động bình thường với HTTPS
- ✅ Không còn lỗi Mixed Content
- ✅ Bảo mật được cải thiện
- ✅ Website hoạt động ổn định trên production 