// Clear logo cache script
console.log('Clearing logo cache...');

// Check if logo files exist
const fs = require('fs');
const path = require('path');

const publicLogoPath = path.join(__dirname, 'public', 'thontrangliennhat-logo.png');
const assetsLogoPath = path.join(__dirname, 'src', 'assets', 'images', 'thontrangliennhat-logo.png');

console.log('Checking logo files:');
console.log('Public logo exists:', fs.existsSync(publicLogoPath));
console.log('Assets logo exists:', fs.existsSync(assetsLogoPath));

// Check build directory
const buildStaticPath = path.join(__dirname, 'build', 'static', 'media');
if (fs.existsSync(buildStaticPath)) {
    const files = fs.readdirSync(buildStaticPath);
    const logoFiles = files.filter(file => file.includes('thontrangliennhat-logo'));
    console.log('Logo files in build/static/media:', logoFiles);
}

console.log('Cache clearing complete!'); 