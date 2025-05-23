# Hướng dẫn cấu hình Vercel cho Frontend Thôn Tráng Liên Nhất

## 🚀 Environment Variables cần thiết

### Truy cập Vercel Dashboard:
https://vercel.com/phan-dats-projects-d067d5c1/thontrangliennhat2-frontend/settings/environment-variables

### Biến môi trường bắt buộc:

| Key | Value | Environment | Mô tả |
|-----|-------|-------------|-------|
| `REACT_APP_API_URL` | `https://thontrangliennhat.com/api` | All | URL API backend |
| `REACT_APP_BASE_URL` | `https://thontrangliennhat.com/api` | All | Base URL cho API calls |
| `REACT_APP_PUBLIC_URL` | `https://thontrangliennhat.com` | Production | URL public của website |
| `REACT_APP_PUBLIC_URL` | `https://thontrangliennhat2-frontend-git-main-phan-dats-projects-d067d5c1.vercel.app` | Preview | URL preview |
| `REACT_APP_PUBLIC_URL` | `http://localhost:3000` | Development | URL local development |

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
- Domain chính: `thontrangliennhat.com`
- Alias: `www.thontrangliennhat.com`

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

## 🔄 Auto Deployment:
- Mỗi push lên `main` branch sẽ tự động deploy
- Preview deployments cho Pull Requests
- Rollback nhanh khi có lỗi 