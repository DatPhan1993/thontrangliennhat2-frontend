# Environment Variables Configuration for Vercel

## Required Environment Variables

### 1. API Configuration
```
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_BASE_URL=https://your-api-domain.com/api
```

### 2. Public URL
```
REACT_APP_PUBLIC_URL=https://thontrangliennhat2-frontend-50lx8a6rg.vercel.app
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

## Example Values for Production:

| Key | Value | Environment |
|-----|-------|-------------|
| `REACT_APP_API_URL` | `https://your-backend-api.com/api` | Production, Preview, Development |
| `REACT_APP_BASE_URL` | `https://your-backend-api.com/api` | Production, Preview, Development |
| `REACT_APP_PUBLIC_URL` | `https://thontrangliennhat2-frontend-50lx8a6rg.vercel.app` | Production |
| `REACT_APP_PUBLIC_URL` | `https://thontrangliennhat2-frontend-git-main-phan-dats-projects-d067d5c1.vercel.app` | Preview |
| `REACT_APP_PUBLIC_URL` | `http://localhost:3000` | Development |
| `GENERATE_SOURCEMAP` | `false` | Production |
| `CI` | `false` | Production, Preview, Development | 