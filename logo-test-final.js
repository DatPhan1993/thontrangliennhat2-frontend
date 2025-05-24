const fs = require('fs');
const https = require('https');
const http = require('http');

console.log('🧪 Testing logo fallback sources...\n');

const logoSources = [
    'src/assets/images/thontrangliennhat-logo.png',
    'public/thontrangliennhat-logo.png',
    'public/static/media/thontrangliennhat-logo.png',
    'public/static/media/thontrangliennhat-logo.a114e7ea2696af9d14d8.png',
    'https://api.thontrangliennhat.com/images/thontrangliennhat-logo.png'
];

// Test local files
logoSources.slice(0, 4).forEach((source, index) => {
    if (fs.existsSync(source)) {
        const stats = fs.statSync(source);
        console.log(`✅ ${index + 1}. ${source} - ${Math.round(stats.size / 1024)}KB`);
    } else {
        console.log(`❌ ${index + 1}. ${source} - NOT FOUND`);
    }
});

// Test API source
console.log('\n🌐 Testing API source...');
const url = logoSources[4];
const protocol = url.startsWith('https') ? https : http;

protocol.get(url, (res) => {
    if (res.statusCode === 200) {
        console.log(`✅ 5. ${url} - Available (${res.statusCode})`);
    } else {
        console.log(`❌ 5. ${url} - Error (${res.statusCode})`);
    }
}).on('error', (err) => {
    console.log(`❌ 5. ${url} - Error: ${err.message}`);
});

console.log('\n📝 Component Info:');
console.log('- New Logo component created with smart fallback system');
console.log('- Updated Footer.js to use Logo component');
console.log('- Updated Navigation.js to use Logo component');
console.log('- Logo component will automatically try fallback sources on error');
console.log('- Console will show detailed loading progress');

console.log('\n🚀 Next steps:');
console.log('1. Start dev server: npm start');
console.log('2. Check console for logo loading messages');
console.log('3. No more logo errors should appear');
console.log('4. Deploy build folder to production server'); 