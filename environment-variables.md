# Environment Variables Configuration for Vercel

## Required Environment Variables

### 1. API Configuration
```
REACT_APP_API_URL=https://thontrangliennhat.com/api
REACT_APP_BASE_URL=https://thontrangliennhat.com/api
```

### 2. Public URL
```
REACT_APP_PUBLIC_URL=https://thontrangliennhat.com
```

### 3. Build Optimization (Optional)
```
GENERATE_SOURCEMAP=false
CI=false
```

### 4. Google Analytics (Optional)
```
REACT_APP_GA_TRACKING_ID=your-ga-tracking-id
```

## How to Add Environment Variables in Vercel:

1. Go to your project dashboard: https://vercel.com/phan-dats-projects-d067d5c1/thontrangliennhat2-frontend
2. Click on "Settings" tab
3. Click on "Environment Variables" in the left sidebar
4. Add each variable with appropriate values for all environments (Production, Preview, Development)

## Production Values for thontrangliennhat.com:

| Key | Value | Environment |
|-----|-------|-------------|
| `REACT_APP_API_URL` | `https://thontrangliennhat.com/api` | Production, Preview, Development |
| `REACT_APP_BASE_URL` | `https://thontrangliennhat.com/api` | Production, Preview, Development |
| `REACT_APP_PUBLIC_URL` | `https://thontrangliennhat.com` | Production |
| `REACT_APP_PUBLIC_URL` | `https://thontrangliennhat2-frontend-git-main-phan-dats-projects-d067d5c1.vercel.app` | Preview |
| `REACT_APP_PUBLIC_URL` | `http://localhost:3000` | Development |
| `GENERATE_SOURCEMAP` | `false` | Production |
| `CI` | `false` | Production, Preview, Development |

## Custom Domain Configuration:

Since you're using thontrangliennhat.com as your main domain, you should also:

1. **Add Custom Domain in Vercel:**
   - Go to Settings > Domains
   - Add `thontrangliennhat.com` and `www.thontrangliennhat.com`
   - Configure DNS records as instructed by Vercel

2. **API Backend Configuration:**
   - Ensure your backend API is accessible at `https://thontrangliennhat.com/api`
   - Configure CORS to allow requests from your frontend domain
   - Set up proper SSL certificates

3. **Additional Environment Variables for Production:**
   ```
   NODE_ENV=production
   REACT_APP_SITE_URL=https://thontrangliennhat.com
   REACT_APP_API_TIMEOUT=30000
   ``` 