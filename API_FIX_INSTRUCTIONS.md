# API Fix Instructions for Thôn Trang Liên Nhất Frontend

## 🔧 Problem Fixed

The frontend was connecting to `localhost:3001` instead of the production API at `api.thontrangliennhat.com`. This has been fixed with multiple layers of protection.

## 📋 What Was Done

### 1. Created Missing Files
- ✅ `src/utils/api.js` - Main API client with URL fixing
- ✅ `src/utils/urlFixer.js` - Comprehensive URL fixing utilities
- ✅ `fix-and-deploy.js` - Automated fix and deploy script

### 2. Updated Existing Files
- ✅ `src/App.js` - Added URL fixer initialization
- ✅ All API configurations now point to production

### 3. Multiple Protection Layers
1. **Environment Variables**: Fallback to production API URL
2. **Request Interceptors**: Automatically fix localhost URLs in requests
3. **URL Fixer Utilities**: Fix URLs in images and fetch calls
4. **Build-time Fixes**: Replace localhost URLs during build process

## 🚀 How to Deploy

### Option 1: Automated Script (Recommended)
```bash
cd /Users/admin/thontrangliennhat2-frontend
node fix-and-deploy.js
```

### Option 2: Manual Steps
```bash
cd /Users/admin/thontrangliennhat2-frontend

# 1. Clear caches
npm run clear-cache

# 2. Install dependencies
npm install

# 3. Build with production environment
REACT_APP_API_URL=https://api.thontrangliennhat.com npm run build

# 4. Deploy to Vercel
vercel --prod
```

## 🔍 Verification

After deployment, check these URLs:
- Frontend: https://thontrangliennhat.com
- API Health: https://api.thontrangliennhat.com/api/health
- API Products: https://api.thontrangliennhat.com/api/products

## 🛠️ Technical Details

### API Configuration Hierarchy
1. `process.env.REACT_APP_API_URL` (highest priority)
2. `process.env.REACT_APP_BASE_URL` (fallback)
3. `'https://api.thontrangliennhat.com'` (default)

### Files Modified
- `src/utils/api.js` - Main API client
- `src/utils/urlFixer.js` - URL fixing utilities
- `src/App.js` - URL fixer initialization
- `src/config/index.js` - Already correctly configured
- `src/utils/httpRequest.js` - Already correctly configured
- `src/utils/imageUtils.js` - Already correctly configured

### URL Fixing Features
- ✅ Automatic localhost URL replacement
- ✅ Request interceptor for API calls
- ✅ Image URL fixing for dynamic content
- ✅ Fetch API override for third-party libraries
- ✅ Build-time URL replacement

## 🐛 Troubleshooting

### If still seeing localhost URLs:
1. Clear browser cache completely
2. Check browser developer tools for cached requests
3. Verify environment variables are set correctly
4. Run the fix script again

### If build fails:
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Check for any remaining localhost references

### If API calls fail:
1. Verify API is running at https://api.thontrangliennhat.com
2. Check CORS settings on API server
3. Verify SSL certificates are valid

## 📞 Support

If you encounter any issues:
1. Check browser console for error messages
2. Verify API endpoints are accessible
3. Ensure all environment variables are set correctly
4. Run the automated fix script to resolve common issues

## ✅ Success Indicators

You'll know it's working when:
- ✅ No localhost URLs in browser network tab
- ✅ All API calls go to api.thontrangliennhat.com
- ✅ Images load from production API
- ✅ No CORS errors in console
- ✅ Website functions normally on production domain 