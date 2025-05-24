const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Starting final logo fix...\n');

// Ensure directories exist
const requiredDirs = [
    'public/static',
    'public/static/media',
    'build/static',
    'build/static/media'
];

requiredDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`✅ Created directory: ${dir}`);
    }
});

// Copy logo files with proper names
const logoCopies = [
    // From assets to public
    {
        source: 'src/assets/images/thontrangliennhat-logo.png',
        target: 'public/thontrangliennhat-logo.png'
    },
    {
        source: 'src/assets/images/thontrangliennhat-logo.png',
        target: 'public/static/media/thontrangliennhat-logo.png'
    },
    {
        source: 'src/assets/images/thontrangliennhat-logo.png',
        target: 'public/static/media/thontrangliennhat-logo.a114e7ea2696af9d14d8.png'
    },
    // From assets to build (if build folder exists)
    {
        source: 'src/assets/images/thontrangliennhat-logo.png',
        target: 'build/static/media/thontrangliennhat-logo.png'
    },
    {
        source: 'src/assets/images/thontrangliennhat-logo.png',
        target: 'build/static/media/thontrangliennhat-logo.a114e7ea2696af9d14d8.png'
    }
];

logoCopies.forEach(({ source, target }) => {
    try {
        if (fs.existsSync(source)) {
            fs.copyFileSync(source, target);
            console.log(`✅ Copied ${source} → ${target}`);
        } else {
            console.log(`⚠️  Source not found: ${source}`);
        }
    } catch (error) {
        console.log(`❌ Failed to copy ${source} → ${target}: ${error.message}`);
    }
});

// Create manifest logo files for proper PWA support
const manifestLogos = [
    {
        source: 'src/assets/images/thontrangliennhat-logo.png',
        target: 'public/logo192.png'
    },
    {
        source: 'src/assets/images/thontrangliennhat-logo.png',
        target: 'public/logo512.png'
    }
];

manifestLogos.forEach(({ source, target }) => {
    try {
        if (fs.existsSync(source)) {
            fs.copyFileSync(source, target);
            console.log(`✅ Created manifest logo: ${target}`);
        }
    } catch (error) {
        console.log(`❌ Failed to create manifest logo ${target}: ${error.message}`);
    }
});

console.log('\n🔨 Rebuilding application...');
try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully');
    
    // Copy the generated hashed logo back to public
    const buildLogoPattern = /thontrangliennhat-logo\.[a-f0-9]+\.png/;
    const buildMediaDir = 'build/static/media';
    
    if (fs.existsSync(buildMediaDir)) {
        const files = fs.readdirSync(buildMediaDir);
        const hashedLogo = files.find(file => buildLogoPattern.test(file));
        
        if (hashedLogo) {
            const sourcePath = path.join(buildMediaDir, hashedLogo);
            const targetPath = path.join('public/static/media', hashedLogo);
            
            fs.copyFileSync(sourcePath, targetPath);
            console.log(`✅ Copied hashed logo: ${hashedLogo} to public directory`);
        }
    }
    
} catch (error) {
    console.log('❌ Build failed:', error.message);
}

console.log('\n🎉 Logo fix completed!');
console.log('Please check the browser console to verify all logo errors are resolved.'); 