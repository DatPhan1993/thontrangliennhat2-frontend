#!/usr/bin/env node

/**
 * Fix and Deploy Script for Thôn Trang Liên Nhật Frontend
 * This script fixes all localhost URLs and prepares for deployment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting Fix and Deploy Process...');

// Configuration
const PRODUCTION_API_URL = 'https://api.thontrangliennhat.com';
const LOCALHOST_PATTERN = /http:\/\/localhost:3001/g;

/**
 * Fix URLs in a file
 */
function fixUrlsInFile(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            return false;
        }

        const content = fs.readFileSync(filePath, 'utf8');
        const hasLocalhost = content.includes('localhost:3001');
        
        if (hasLocalhost) {
            const fixedContent = content.replace(LOCALHOST_PATTERN, PRODUCTION_API_URL);
            fs.writeFileSync(filePath, fixedContent, 'utf8');
            console.log(`✅ Fixed URLs in: ${filePath}`);
            return true;
        }
        
        return false;
    } catch (error) {
        console.error(`❌ Error fixing ${filePath}:`, error.message);
        return false;
    }
}

/**
 * Recursively fix URLs in directory
 */
function fixUrlsInDirectory(dirPath, extensions = ['.js', '.jsx', '.ts', '.tsx', '.json']) {
    let fixedCount = 0;
    
    try {
        const items = fs.readdirSync(dirPath);
        
        for (const item of items) {
            const itemPath = path.join(dirPath, item);
            const stat = fs.statSync(itemPath);
            
            if (stat.isDirectory()) {
                // Skip node_modules and build directories
                if (!['node_modules', 'build', '.git', '.vercel'].includes(item)) {
                    fixedCount += fixUrlsInDirectory(itemPath, extensions);
                }
            } else if (stat.isFile()) {
                const ext = path.extname(item);
                if (extensions.includes(ext)) {
                    if (fixUrlsInFile(itemPath)) {
                        fixedCount++;
                    }
                }
            }
        }
    } catch (error) {
        console.error(`❌ Error processing directory ${dirPath}:`, error.message);
    }
    
    return fixedCount;
}

/**
 * Clear caches
 */
function clearCaches() {
    console.log('🧹 Clearing caches...');
    
    try {
        // Clear npm cache
        execSync('npm cache clean --force', { stdio: 'inherit' });
        
        // Clear build directory
        if (fs.existsSync('build')) {
            execSync('rm -rf build', { stdio: 'inherit' });
        }
        
        // Clear node_modules cache
        if (fs.existsSync('node_modules/.cache')) {
            execSync('rm -rf node_modules/.cache', { stdio: 'inherit' });
        }
        
        console.log('✅ Caches cleared successfully');
    } catch (error) {
        console.error('❌ Error clearing caches:', error.message);
    }
}

/**
 * Install dependencies
 */
function installDependencies() {
    console.log('📦 Installing dependencies...');
    
    try {
        execSync('npm install', { stdio: 'inherit' });
        console.log('✅ Dependencies installed successfully');
    } catch (error) {
        console.error('❌ Error installing dependencies:', error.message);
        throw error;
    }
}

/**
 * Build project
 */
function buildProject() {
    console.log('🔨 Building project...');
    
    try {
        // Set environment variables for build
        process.env.REACT_APP_API_URL = PRODUCTION_API_URL;
        process.env.REACT_APP_BASE_URL = PRODUCTION_API_URL;
        process.env.REACT_APP_PUBLIC_URL = 'https://thontrangliennhat.com';
        process.env.NODE_ENV = 'production';
        process.env.GENERATE_SOURCEMAP = 'false';
        
        execSync('npm run build', { stdio: 'inherit' });
        console.log('✅ Project built successfully');
    } catch (error) {
        console.error('❌ Error building project:', error.message);
        throw error;
    }
}

/**
 * Main execution
 */
async function main() {
    try {
        console.log('📍 Current directory:', process.cwd());
        
        // Step 1: Fix URLs in source files
        console.log('\n1️⃣ Fixing localhost URLs in source files...');
        const fixedCount = fixUrlsInDirectory('./src');
        console.log(`✅ Fixed URLs in ${fixedCount} files`);
        
        // Step 2: Clear caches
        console.log('\n2️⃣ Clearing caches...');
        clearCaches();
        
        // Step 3: Install dependencies
        console.log('\n3️⃣ Installing dependencies...');
        installDependencies();
        
        // Step 4: Build project
        console.log('\n4️⃣ Building project...');
        buildProject();
        
        console.log('\n🎉 Fix and Deploy process completed successfully!');
        console.log('\n📋 Next steps:');
        console.log('   1. Test the build locally: npm run start');
        console.log('   2. Deploy to Vercel: vercel --prod');
        console.log('   3. Check production site: https://thontrangliennhat.com');
        
    } catch (error) {
        console.error('\n💥 Fix and Deploy process failed:', error.message);
        process.exit(1);
    }
}

// Run the script
if (require.main === module) {
    main();
} 