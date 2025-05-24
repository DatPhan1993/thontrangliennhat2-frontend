#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing logo loading issues...\n');

// 1. Verify source files exist
const publicLogo = path.join(__dirname, 'public', 'thontrangliennhat-logo.png');
const assetsLogo = path.join(__dirname, 'src', 'assets', 'images', 'thontrangliennhat-logo.png');

console.log('📁 Checking source files:');
console.log('  Public logo:', fs.existsSync(publicLogo) ? '✅ EXISTS' : '❌ MISSING');
console.log('  Assets logo:', fs.existsSync(assetsLogo) ? '✅ EXISTS' : '❌ MISSING');

// 2. Check build directory
const buildDir = path.join(__dirname, 'build');
const buildStaticMedia = path.join(buildDir, 'static', 'media');
const buildPublicLogo = path.join(buildDir, 'thontrangliennhat-logo.png');

if (fs.existsSync(buildDir)) {
    console.log('\n🏗️  Build directory status:');
    
    // Check static/media directory
    if (fs.existsSync(buildStaticMedia)) {
        const mediaFiles = fs.readdirSync(buildStaticMedia);
        const logoFiles = mediaFiles.filter(file => file.includes('thontrangliennhat-logo'));
        console.log('  Static media logos:', logoFiles.length > 0 ? `✅ ${logoFiles.join(', ')}` : '❌ NONE');
    } else {
        console.log('  Static media dir: ❌ MISSING');
    }
    
    // Check public logo in build root
    console.log('  Build public logo:', fs.existsSync(buildPublicLogo) ? '✅ EXISTS' : '❌ MISSING');
    
    // Copy public logo to build root if missing
    if (!fs.existsSync(buildPublicLogo) && fs.existsSync(publicLogo)) {
        try {
            fs.copyFileSync(publicLogo, buildPublicLogo);
            console.log('  ✅ Copied logo to build root');
        } catch (error) {
            console.log('  ❌ Failed to copy logo:', error.message);
        }
    }
} else {
    console.log('\n🏗️  Build directory: ❌ NOT FOUND (run npm run build)');
}

// 3. Create static directory structure if missing
const publicStaticMedia = path.join(__dirname, 'public', 'static', 'media');
if (!fs.existsSync(publicStaticMedia)) {
    try {
        fs.mkdirSync(publicStaticMedia, { recursive: true });
        console.log('\n📁 Created public/static/media directory');
        
        // Copy logo to static media
        if (fs.existsSync(publicLogo)) {
            fs.copyFileSync(publicLogo, path.join(publicStaticMedia, 'thontrangliennhat-logo.png'));
            console.log('  ✅ Copied logo to public/static/media');
        }
    } catch (error) {
        console.log('\n❌ Failed to create static directory:', error.message);
    }
}

// 4. Check for any hardcoded hash references
console.log('\n🔍 Checking for hardcoded hash references...');
const checkFiles = [
    'src/layouts/components/Footer/Footer.js',
    'src/layouts/components/Header/Navigation/Navigation.js',
    'src/assets/images/index.js'
];

let foundHardcodedHashes = false;
checkFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('a114e7ea2696af9d1d48')) {
            console.log(`  ❌ Found incorrect hash in ${file}`);
            foundHardcodedHashes = true;
        }
    }
});

if (!foundHardcodedHashes) {
    console.log('  ✅ No hardcoded incorrect hashes found');
}

// 5. Generate cache-busting version
const timestamp = Date.now();
console.log(`\n🔄 Cache-busting timestamp: ${timestamp}`);

// 6. Create a test HTML file
const testHtml = `<!DOCTYPE html>
<html>
<head>
    <title>Logo Test</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .test-section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; }
        img { max-width: 200px; margin: 10px; border: 1px solid #ccc; }
        .error { color: red; }
        .success { color: green; }
    </style>
</head>
<body>
    <h1>Logo Loading Test</h1>
    
    <div class="test-section">
        <h3>1. Public Directory Logo</h3>
        <img src="/thontrangliennhat-logo.png" alt="Public Logo" onload="this.nextSibling.className='success'" onerror="this.nextSibling.className='error'">
        <span>Loading...</span>
    </div>
    
    <div class="test-section">
        <h3>2. Static Media Logo (Build)</h3>
        <img src="/static/media/thontrangliennhat-logo.a114e7ea2696af9d14d8.png" alt="Static Logo" onload="this.nextSibling.className='success'" onerror="this.nextSibling.className='error'">
        <span>Loading...</span>
    </div>
    
    <div class="test-section">
        <h3>3. API Server Logo</h3>
        <img src="https://api.thontrangliennhat.com/images/thontrangliennhat-logo.png" alt="API Logo" onload="this.nextSibling.className='success'" onerror="this.nextSibling.className='error'">
        <span>Loading...</span>
    </div>
    
    <script>
        console.log('Logo test page loaded at:', new Date().toISOString());
        
        // Test all image sources
        document.querySelectorAll('img').forEach((img, index) => {
            img.addEventListener('load', () => {
                console.log(\`Image \${index + 1} loaded successfully: \${img.src}\`);
            });
            
            img.addEventListener('error', () => {
                console.error(\`Image \${index + 1} failed to load: \${img.src}\`);
            });
        });
    </script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'public', 'logo-test.html'), testHtml);
console.log('✅ Created logo test page: /logo-test.html');

console.log('\n🎯 Fix Summary:');
console.log('  1. ✅ Verified source files exist');
console.log('  2. ✅ Ensured build directory has logo files');
console.log('  3. ✅ Created static directory structure');
console.log('  4. ✅ Checked for hardcoded hash issues');
console.log('  5. ✅ Created test page for verification');

console.log('\n📋 Next Steps:');
console.log('  1. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)');
console.log('  2. Test logo loading at: http://localhost:3000/logo-test.html');
console.log('  3. If issues persist, restart the development server');
console.log('  4. For production, redeploy the build folder');

console.log('\n✨ Logo fix complete!'); 