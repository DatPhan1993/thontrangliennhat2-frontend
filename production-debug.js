// Production Debug Script - Run this in browser console on https://thontrangliennhat2-frontend-50lx8a6rg.vercel.app

console.log('🔍 PRODUCTION DEBUG SCRIPT STARTED');
console.log('Current URL:', window.location.href);
console.log('Current domain:', window.location.origin);

// Test API calls directly
const API_BASE = 'https://api.thontrangliennhat.com';

async function debugProductionAPICalls() {
    console.log('\n🧪 Testing Production API Calls...');
    
    const endpoints = ['health', 'teams', 'products', 'services'];
    
    for (let endpoint of endpoints) {
        console.log(`\n📍 Testing ${endpoint}...`);
        
        try {
            const url = `${API_BASE}/api/${endpoint}`;
            console.log(`🌐 URL: ${url}`);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });
            
            console.log(`📡 ${endpoint} Status: ${response.status} ${response.statusText}`);
            
            if (response.ok) {
                if (endpoint === 'health') {
                    const data = await response.text();
                    console.log(`✅ ${endpoint} Response:`, data);
                } else {
                    const data = await response.json();
                    console.log(`✅ ${endpoint} Success: ${data.data ? data.data.length : 0} items`);
                    
                    if (data.data && data.data.length > 0) {
                        console.log(`📋 ${endpoint} Sample:`, data.data[0]);
                    }
                }
            } else {
                const errorText = await response.text();
                console.error(`❌ ${endpoint} Error:`, errorText);
            }
            
        } catch (error) {
            console.error(`💥 ${endpoint} Network Error:`, error);
        }
    }
}

// Check React app state
function debugReactAppState() {
    console.log('\n🔍 Checking React App State...');
    
    // Check if React is loaded
    if (window.React) {
        console.log('✅ React is loaded');
    } else {
        console.log('❌ React not detected');
    }
    
    // Check sessionStorage
    console.log('\n📦 SessionStorage contents:');
    Object.keys(sessionStorage).forEach(key => {
        console.log(`  ${key}:`, sessionStorage.getItem(key));
    });
    
    // Check for team data specifically
    if (sessionStorage.getItem('allMembers')) {
        const members = JSON.parse(sessionStorage.getItem('allMembers'));
        console.log(`👥 Cached team members: ${members.length} items`);
        if (members.length > 0) {
            console.log('📋 First member:', members[0]);
        }
    } else {
        console.log('❌ No team members in cache');
    }
}

// Check for console errors
function debugConsoleErrors() {
    console.log('\n🚨 Monitoring Console Errors...');
    
    // Override console.error to capture errors
    const originalError = console.error;
    console.error = function(...args) {
        console.log('🚨 CAPTURED ERROR:', ...args);
        originalError.apply(console, args);
    };
    
    // Check for network errors
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        console.log('🌐 FETCH CALL:', args[0]);
        return originalFetch.apply(this, args)
            .then(response => {
                console.log(`📡 FETCH RESPONSE: ${response.status} for ${args[0]}`);
                return response;
            })
            .catch(error => {
                console.error(`💥 FETCH ERROR for ${args[0]}:`, error);
                throw error;
            });
    };
}

// Clear cache and reload
function clearCacheAndReload() {
    console.log('\n🧹 Clearing cache and reloading...');
    
    // Clear sessionStorage
    Object.keys(sessionStorage).forEach(key => {
        console.log(`Removing: ${key}`);
        sessionStorage.removeItem(key);
    });
    
    // Clear localStorage
    Object.keys(localStorage).forEach(key => {
        console.log(`Removing localStorage: ${key}`);
        localStorage.removeItem(key);
    });
    
    console.log('🔄 Reloading page in 3 seconds...');
    setTimeout(() => {
        window.location.reload();
    }, 3000);
}

// Run all debug functions
async function runFullDebug() {
    debugConsoleErrors();
    debugReactAppState();
    await debugProductionAPICalls();
    
    console.log('\n🎯 DEBUG COMPLETE!');
    console.log('Commands available:');
    console.log('- clearCacheAndReload() - Clear cache and reload');
    console.log('- debugProductionAPICalls() - Test API calls again');
    console.log('- debugReactAppState() - Check React state');
}

// Auto-run
runFullDebug(); 