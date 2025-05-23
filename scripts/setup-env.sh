#!/bin/bash

# Setup Environment Variables for thontrangliennhat.com project

echo "🚀 Setting up environment variables for thontrangliennhat.com"
echo "=================================================="

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "📝 Adding environment variables to Vercel project..."

# Production Environment Variables
vercel env add REACT_APP_API_URL production <<< "https://thontrangliennhat.com/api"
vercel env add REACT_APP_BASE_URL production <<< "https://thontrangliennhat.com/api"
vercel env add REACT_APP_PUBLIC_URL production <<< "https://thontrangliennhat.com"
vercel env add REACT_APP_SITE_URL production <<< "https://thontrangliennhat.com"
vercel env add GENERATE_SOURCEMAP production <<< "false"
vercel env add CI production <<< "false"
vercel env add NODE_ENV production <<< "production"
vercel env add REACT_APP_API_TIMEOUT production <<< "30000"

# Preview Environment Variables
vercel env add REACT_APP_API_URL preview <<< "https://thontrangliennhat.com/api"
vercel env add REACT_APP_BASE_URL preview <<< "https://thontrangliennhat.com/api"
vercel env add REACT_APP_PUBLIC_URL preview <<< "https://thontrangliennhat2-frontend-git-main-phan-dats-projects-d067d5c1.vercel.app"
vercel env add REACT_APP_SITE_URL preview <<< "https://thontrangliennhat2-frontend-git-main-phan-dats-projects-d067d5c1.vercel.app"
vercel env add GENERATE_SOURCEMAP preview <<< "false"
vercel env add CI preview <<< "false"
vercel env add REACT_APP_API_TIMEOUT preview <<< "30000"

# Development Environment Variables
vercel env add REACT_APP_API_URL development <<< "http://localhost:3001/api"
vercel env add REACT_APP_BASE_URL development <<< "http://localhost:3001/api"
vercel env add REACT_APP_PUBLIC_URL development <<< "http://localhost:3000"
vercel env add REACT_APP_SITE_URL development <<< "http://localhost:3000"
vercel env add CI development <<< "false"
vercel env add REACT_APP_API_TIMEOUT development <<< "30000"

echo "✅ Environment variables setup completed!"
echo ""
echo "🌐 Next steps:"
echo "1. Add custom domain (thontrangliennhat.com) in Vercel Dashboard"
echo "2. Configure DNS records for your domain"
echo "3. Ensure your API backend is running at https://thontrangliennhat.com/api"
echo "4. Redeploy your project to apply the new environment variables"
echo ""
echo "📊 Dashboard: https://vercel.com/phan-dats-projects-d067d5c1/thontrangliennhat2-frontend" 