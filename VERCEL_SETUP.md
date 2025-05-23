# Hướng dẫn cấu hình Vercel cho Frontend Thôn Tráng Liên Nhất

## 🚀 Environment Variables cần thiết

### Truy cập Vercel Dashboard:
https://vercel.com/phan-dats-projects-d067d5c1/thontrangliennhat2-frontend/settings/environment-variables

### Biến môi trường bắt buộc:

| Key | Value | Environment | Mô tả |
|-----|-------|-------------|-------|
| `REACT_APP_API_URL` | `https://api.thontrangliennhat.com` | All | URL API backend chính |
| `REACT_APP_BASE_URL` | `https://api.thontrangliennhat.com` | All | Base URL cho API calls (fallback) |
| `REACT_APP_PUBLIC_URL` | `https://thontrangliennhat.com` | Production | URL public của website |
| `REACT_APP_PUBLIC_URL` | `https://thontrangliennhat2-frontend-git-main-phan-dats-projects-d067d5c1.vercel.app` | Preview | URL preview |
| `REACT_APP_PUBLIC_URL` | `http://localhost:3000` | Development | URL local development |

### Lưu ý về API Configuration:
- ✅ **API endpoint đã xác nhận**: `https://api.thontrangliennhat.com`
- ✅ **Không phải subdomain**, mà là path `/api` trên domain chính
- ✅ **Backend API** đang chạy tại `https://api.thontrangliennhat.com`
- ⚠️ **Cập nhật environment variables** theo bảng trên

### Biến môi trường tối ưu hóa (tùy chọn):

| Key | Value | Environment | Mô tả |
|-----|-------|-------------|-------|
| `GENERATE_SOURCEMAP` | `false` | Production | Tắt source map để giảm bundle size |
| `CI` | `false` | All | Tắt CI mode để tránh lỗi warning |

## 📝 Build Settings

### Framework Settings:
- **Framework Preset:** `Create React App`
- **Build Command:** `npm run build`
- **Output Directory:** `build`
- **Install Command:** `npm install`
- **Development Command:** `npm start`

## 🔗 Domain Configuration

### Custom Domain:
- **Frontend:** `thontrangliennhat.com`
- **API Backend:** `thontrangliennhat.com/api` ✅
- **Alias:** `www.thontrangliennhat.com`

### DNS Records cần thiết:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.19.61
```

## 📁 Project Structure được hỗ trợ:
- ✅ React SPA routing
- ✅ Static assets serving  
- ✅ API proxy setup (cho development)
- ✅ SEO optimization (sitemap, robots.txt)
- ✅ Environment-based API URL configuration
- ✅ Same-domain API integration

## 🔄 Auto Deployment:
- Mỗi push lên `main` branch sẽ tự động deploy
- Preview deployments cho Pull Requests
- Rollback nhanh khi có lỗi

## 🛠️ Troubleshooting:
- Nếu vẫn thấy localhost trong console, clear browser cache và reload
- Kiểm tra Environment Variables đã được set đúng trong Vercel
- Đảm bảo backend API CORS đã allow domain frontend
- **Quan trọng**: Sử dụng `https://api.thontrangliennhat.com` KHÔNG phải subdomain 