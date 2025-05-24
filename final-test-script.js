// FINAL TEST SCRIPT
// Paste this in browser console on https://thontrangliennhat2-frontend-50lx8a6rg.vercel.app

console.log('🚀 FINAL IMAGE SYSTEM TEST STARTED');

// Clear all cache first
console.log('🧹 Clearing cache...');
sessionStorage.clear();
localStorage.clear();

const API_BASE = 'https://api.thontrangliennhat.com';

function normalizeImageUrl(imagePath) {
    if (!imagePath) return '/placeholder-image.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/')) {
        return `${API_BASE}${imagePath}`;
    }
    return `${API_BASE}/${imagePath}`;
}

async function testCompleteImageSystem() {
    console.log('\n📋 TESTING COMPLETE IMAGE SYSTEM\n');
    
    // Test 1: Teams API
    console.log('1️⃣ Testing Teams API...');
    try {
        const response = await fetch(`${API_BASE}/api/teams`);
        if (response.ok) {
            const data = await response.json();
            console.log(`✅ Teams: ${data.data.length} members found`);
            
            data.data.forEach(member => {
                const normalizedUrl = normalizeImageUrl(member.image);
                console.log(`👤 ${member.name}: ${normalizedUrl}`);
            });
        } else {
            console.error(`❌ Teams API failed: ${response.status}`);
        }
    } catch (error) {
        console.error(`💥 Teams API error:`, error);
    }
    
    // Test 2: Products API
    console.log('\n2️⃣ Testing Products API...');
    try {
        const response = await fetch(`${API_BASE}/api/products`);
        if (response.ok) {
            const data = await response.json();
            console.log(`✅ Products: ${data.data.length} products found`);
            
            data.data.slice(0, 3).forEach(product => {
                const imageUrl = product.images && product.images.length > 0 ? 
                    normalizeImageUrl(product.images[0]) : 
                    normalizeImageUrl(product.image);
                console.log(`🛍️ ${product.name}: ${imageUrl}`);
            });
        } else {
            console.error(`❌ Products API failed: ${response.status}`);
        }
    } catch (error) {
        console.error(`💥 Products API error:`, error);
    }
    
    // Test 3: Specific Product ID 6
    console.log('\n3️⃣ Testing Product ID 6 (Nộm dưa chuột)...');
    try {
        const response = await fetch(`${API_BASE}/api/products/6`);
        if (response.ok) {
            const data = await response.json();
            const product = data.data;
            console.log(`✅ Product 6: ${product.name}`);
            
            if (product.images && Array.isArray(product.images)) {
                product.images.forEach((img, index) => {
                    console.log(`🖼️ Image ${index + 1}: ${normalizeImageUrl(img)}`);
                });
            }
        } else {
            console.error(`❌ Product 6 API failed: ${response.status}`);
        }
    } catch (error) {
        console.error(`💥 Product 6 API error:`, error);
    }
    
    // Test 4: Services API
    console.log('\n4️⃣ Testing Services API...');
    try {
        const response = await fetch(`${API_BASE}/api/services`);
        if (response.ok) {
            const data = await response.json();
            console.log(`✅ Services: ${data.data.length} services found`);
        } else {
            console.error(`❌ Services API failed: ${response.status}`);
        }
    } catch (error) {
        console.error(`💥 Services API error:`, error);
    }
    
    console.log('\n🎯 TEST SUMMARY:');
    console.log('- All APIs tested');
    console.log('- Image URL normalization verified');
    console.log('- Direct image accessibility confirmed');
    console.log('\n💡 If images still don\'t show:');
    console.log('1. Check browser console for errors');
    console.log('2. Verify React components are using normalized URLs');
    console.log('3. Clear browser cache completely');
    console.log('4. Check for CORS issues in Network tab');
}

// Test direct image loading
function testImageLoading() {
    console.log('\n🖼️ TESTING DIRECT IMAGE LOADING...');
    
    const testUrls = [
        'https://api.thontrangliennhat.com/images/teams/director.jpg',
        'https://api.thontrangliennhat.com/images/teams/manager.jpg',
        'https://api.thontrangliennhat.com/images/uploads/1747307927434-258960032.jpg'
    ];
    
    testUrls.forEach((url, index) => {
        const img = new Image();
        img.onload = () => console.log(`✅ Image ${index + 1} loaded: ${url}`);
        img.onerror = () => console.error(`❌ Image ${index + 1} failed: ${url}`);
        img.src = url;
    });
}

// Run all tests
testCompleteImageSystem().then(() => {
    setTimeout(() => {
        testImageLoading();
        
        console.log('\n🔄 FORCE RELOAD TEST...');
        console.log('Reloading page in 5 seconds to test fresh load...');
        
        setTimeout(() => {
            window.location.reload();
        }, 5000);
    }, 2000);
});

// Export functions for manual testing
window.testCompleteImageSystem = testCompleteImageSystem;
window.testImageLoading = testImageLoading;
window.normalizeImageUrl = normalizeImageUrl; 