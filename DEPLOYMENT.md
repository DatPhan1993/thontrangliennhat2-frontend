# Deployment Guide for thontrangliennhat.com

## 🌐 Production Environment Variables

### Required Variables for Vercel:

```bash
# API Configuration
REACT_APP_API_URL=https://thontrangliennhat.com/api
REACT_APP_BASE_URL=https://thontrangliennhat.com/api

# Site Configuration  
REACT_APP_PUBLIC_URL=https://thontrangliennhat.com
REACT_APP_SITE_URL=https://thontrangliennhat.com

# Build Optimization
GENERATE_SOURCEMAP=false
CI=false
NODE_ENV=production

# Performance
REACT_APP_API_TIMEOUT=30000
```

## 🚀 Quick Setup Commands

### Option 1: Manual Setup via Vercel Dashboard
1. Go to: https://vercel.com/phan-dats-projects-d067d5c1/thontrangliennhat2-frontend/settings/environment-variables
2. Add each variable above for Production, Preview, and Development environments

### Option 2: Automated Setup via Script
```bash
# Run the setup script
./scripts/setup-env.sh
```

### Option 3: Using Vercel CLI
```bash
# Add production variables
vercel env add REACT_APP_API_URL production
# Enter: https://thontrangliennhat.com/api

vercel env add REACT_APP_BASE_URL production  
# Enter: https://thontrangliennhat.com/api

vercel env add REACT_APP_PUBLIC_URL production
# Enter: https://thontrangliennhat.com

vercel env add REACT_APP_SITE_URL production
# Enter: https://thontrangliennhat.com

vercel env add GENERATE_SOURCEMAP production
# Enter: false

vercel env add CI production
# Enter: false

vercel env add NODE_ENV production
# Enter: production

vercel env add REACT_APP_API_TIMEOUT production
# Enter: 30000
```

## 🔧 Custom Domain Setup

### 1. Add Domain in Vercel
- Go to Settings > Domains
- Add `thontrangliennhat.com`
- Add `www.thontrangliennhat.com` (optional)

### 2. DNS Configuration
Configure these DNS records with your domain provider:

```
Type: A
Name: @
Value: 76.76.19.61

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

### 3. SSL Certificate
Vercel automatically provides SSL certificates for custom domains.

## 🛠️ Backend API Requirements

Your backend API should be accessible at:
```
https://thontrangliennhat.com/api
```

### Required API Endpoints:
```
GET  /api/products
GET  /api/services  
GET  /api/news
GET  /api/experiences
POST /api/contact
... (other endpoints as used in your app)
```

### CORS Configuration:
Ensure your backend allows requests from:
```
https://thontrangliennhat.com
https://www.thontrangliennhat.com
https://thontrangliennhat2-frontend-50lx8a6rg.vercel.app (fallback)
```

## 📊 Monitoring and Analytics

### Optional Environment Variables:
```bash
# Google Analytics
REACT_APP_GA_TRACKING_ID=your-ga-tracking-id

# Facebook Pixel (if used)
REACT_APP_FACEBOOK_APP_ID=your-facebook-app-id

# Google Maps (if used)
REACT_APP_GOOGLE_MAPS_API_KEY=your-maps-api-key
```

## 🔄 Deployment Process

1. **Push to GitHub**: All changes automatically trigger Vercel deployment
2. **Environment Variables**: Set up via Vercel Dashboard or CLI
3. **Custom Domain**: Configure DNS and add domain in Vercel
4. **SSL**: Automatically handled by Vercel
5. **API Backend**: Ensure it's running at thontrangliennhat.com/api

## 🚨 Troubleshooting

### Common Issues:

1. **API Not Loading**: Check that backend is accessible at `https://thontrangliennhat.com/api`
2. **CORS Errors**: Verify backend CORS configuration includes your frontend domain
3. **Environment Variables**: Ensure all required variables are set in Vercel
4. **Domain Not Working**: Check DNS propagation (can take up to 48 hours)

### Debug Commands:
```bash
# Test API connectivity
curl https://thontrangliennhat.com/api/products

# Check environment variables in Vercel
vercel env ls

# Force redeploy
vercel --prod
```

## 📞 Support Links

- **Vercel Dashboard**: https://vercel.com/phan-dats-projects-d067d5c1/thontrangliennhat2-frontend
- **Domain Settings**: https://vercel.com/phan-dats-projects-d067d5c1/thontrangliennhat2-frontend/settings/domains
- **Environment Variables**: https://vercel.com/phan-dats-projects-d067d5c1/thontrangliennhat2-frontend/settings/environment-variables 