#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Khắc phục tất cả lỗi website...\n');

// 1. Kiểm tra và sửa lỗi manifest
function fixManifestIcons() {
    console.log('📱 Sửa lỗi manifest icons...');
    const manifestPath = path.join(__dirname, 'public', 'manifest.json');
    
    try {
        if (fs.existsSync(manifestPath)) {
            const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
            
            // Cập nhật icons để sử dụng logo chính
            manifest.icons = manifest.icons.map(icon => {
                if (icon.src === 'logo192.png' || icon.src === 'logo512.png') {
                    return {
                        ...icon,
                        src: 'thontrangliennhat-logo.png'
                    };
                }
                return icon;
            });
            
            fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
            console.log('  ✅ Đã cập nhật manifest.json');
        }
    } catch (error) {
        console.log('  ❌ Lỗi khi sửa manifest:', error.message);
    }
}

// 2. Kiểm tra file logo có tồn tại không
function checkLogoFiles() {
    console.log('\n🖼️  Kiểm tra file logo...');
    const logoFiles = [
        'public/thontrangliennhat-logo.png',
        'public/favicon.ico',
        'public/apple-touch-icon.png',
        'src/assets/images/thontrangliennhat-logo.png'
    ];
    
    logoFiles.forEach(file => {
        const fullPath = path.join(__dirname, file);
        if (fs.existsSync(fullPath)) {
            console.log(`  ✅ ${file} - EXISTS`);
        } else {
            console.log(`  ❌ ${file} - MISSING`);
        }
    });
}

// 3. Kiểm tra và sửa lỗi 404 resources
function fixMissingResources() {
    console.log('\n🔗 Sửa lỗi 404 resources...');
    
    // Tạo symbolic links hoặc copy files nếu cần
    const publicLogo = path.join(__dirname, 'public', 'thontrangliennhat-logo.png');
    
    if (fs.existsSync(publicLogo)) {
        // Copy to static media if needed
        const staticMediaDir = path.join(__dirname, 'public', 'static', 'media');
        if (!fs.existsSync(staticMediaDir)) {
            fs.mkdirSync(staticMediaDir, { recursive: true });
        }
        
        const staticLogo = path.join(staticMediaDir, 'thontrangliennhat-logo.png');
        if (!fs.existsSync(staticLogo)) {
            fs.copyFileSync(publicLogo, staticLogo);
            console.log('  ✅ Copied logo to static/media');
        }
        
        // Tạo các kích thước khác nhau nếu cần
        const logo192 = path.join(__dirname, 'public', 'logo192.png');
        const logo512 = path.join(__dirname, 'public', 'logo512.png');
        
        if (!fs.existsSync(logo192)) {
            fs.copyFileSync(publicLogo, logo192);
            console.log('  ✅ Created logo192.png');
        }
        
        if (!fs.existsSync(logo512)) {
            fs.copyFileSync(publicLogo, logo512);
            console.log('  ✅ Created logo512.png');
        }
    }
}

// 4. Tạo .htaccess cho production
function createHtaccess() {
    console.log('\n⚙️  Tạo .htaccess cho production...');
    
    const htaccessContent = `# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
</IfModule>

# Prevent access to source files
<FilesMatch "\\.(env|log|config)$">
    Deny from all
</FilesMatch>

# Handle React Router
RewriteEngine On
RewriteBase /

# Handle Angular and React Routes
RewriteRule ^(?!.*\\.).*$ /index.html [L]

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
</IfModule>`;

    const htaccessPath = path.join(__dirname, 'public', '.htaccess');
    fs.writeFileSync(htaccessPath, htaccessContent);
    console.log('  ✅ Đã tạo .htaccess');
}

// 5. Tạo robots.txt
function createRobotsTxt() {
    console.log('\n🤖 Cập nhật robots.txt...');
    
    const robotsContent = `User-agent: *
Allow: /

# Sitemaps
Sitemap: https://thontrangliennhat.com/sitemap.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /static/
Disallow: /.well-known/

# Allow important pages
Allow: /san-pham/
Allow: /san-xuat/
Allow: /trai-nghiem/
Allow: /tin-tuc/
Allow: /gioi-thieu/
Allow: /lien-he/`;

    const robotsPath = path.join(__dirname, 'public', 'robots.txt');
    fs.writeFileSync(robotsPath, robotsContent);
    console.log('  ✅ Đã cập nhật robots.txt');
}

// 6. Kiểm tra build folder
function checkBuildFolder() {
    console.log('\n🏗️  Kiểm tra build folder...');
    
    const buildPath = path.join(__dirname, 'build');
    if (fs.existsSync(buildPath)) {
        const buildFiles = [
            'build/index.html',
            'build/static/css',
            'build/static/js',
            'build/static/media',
            'build/thontrangliennhat-logo.png'
        ];
        
        buildFiles.forEach(file => {
            const fullPath = path.join(__dirname, file);
            if (fs.existsSync(fullPath)) {
                console.log(`  ✅ ${file} - EXISTS`);
            } else {
                console.log(`  ❌ ${file} - MISSING`);
            }
        });
    } else {
        console.log('  ⚠️  Build folder không tồn tại. Chạy "npm run build"');
    }
}

// 7. Tạo service worker đơn giản
function createServiceWorker() {
    console.log('\n⚡ Tạo service worker...');
    
    const swContent = `// Simple service worker for caching
const CACHE_NAME = 'thontrangliennhat-v1';
const urlsToCache = [
    '/',
    '/static/css/',
    '/static/js/',
    '/thontrangliennhat-logo.png',
    '/favicon.ico'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            }
        )
    );
});`;

    const swPath = path.join(__dirname, 'public', 'sw.js');
    fs.writeFileSync(swPath, swContent);
    console.log('  ✅ Đã tạo service worker');
}

// Chạy tất cả các fix
async function runAllFixes() {
    try {
        fixManifestIcons();
        checkLogoFiles();
        fixMissingResources();
        createHtaccess();
        createRobotsTxt();
        checkBuildFolder();
        createServiceWorker();
        
        console.log('\n🎉 Hoàn tất sửa lỗi!');
        console.log('\n📋 Các bước tiếp theo:');
        console.log('  1. Chạy "npm run build" để build lại');
        console.log('  2. Test website local: "npm start"');
        console.log('  3. Deploy build folder lên production');
        console.log('  4. Clear browser cache (Ctrl+Shift+R)');
        console.log('  5. Kiểm tra console không còn lỗi');
        
    } catch (error) {
        console.error('❌ Lỗi khi chạy fix:', error);
    }
}

// Run
runAllFixes(); 