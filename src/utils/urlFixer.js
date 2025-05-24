/**
 * URL Fixer Utility for Thôn Trang Liên Nhất
 * Fixes all localhost:3001 URLs to use production API
 */

const PRODUCTION_API_URL = 'https://api.thontrangliennhat.com';
const LOCALHOST_PATTERN = /http:\/\/localhost:3001/g;

/**
 * Fix localhost URLs in a string
 * @param {string} url - URL to fix
 * @returns {string} Fixed URL
 */
export const fixUrl = (url) => {
    if (typeof url !== 'string') return url;
    
    if (url.includes('localhost:3001')) {
        const fixed = url.replace(LOCALHOST_PATTERN, PRODUCTION_API_URL);
        console.log('[URLFixer] Fixed URL:', url, '->', fixed);
        return fixed;
    }
    
    return url;
};

/**
 * Fix URLs in an object recursively
 * @param {any} obj - Object to fix URLs in
 * @returns {any} Object with fixed URLs
 */
export const fixUrlsInObject = (obj) => {
    if (typeof obj === 'string') {
        return fixUrl(obj);
    }
    
    if (Array.isArray(obj)) {
        return obj.map(item => fixUrlsInObject(item));
    }
    
    if (obj && typeof obj === 'object') {
        const fixed = {};
        for (const [key, value] of Object.entries(obj)) {
            fixed[key] = fixUrlsInObject(value);
        }
        return fixed;
    }
    
    return obj;
};

/**
 * Override native fetch to automatically fix URLs
 */
export const installFetchFixer = () => {
    if (typeof window !== 'undefined' && window.fetch) {
        const originalFetch = window.fetch;
        
        window.fetch = function(input, init) {
            // Fix URL if it's a string
            if (typeof input === 'string') {
                input = fixUrl(input);
            }
            
            // Fix URL if it's a Request object
            if (input && typeof input === 'object' && input.url) {
                const fixedUrl = fixUrl(input.url);
                if (fixedUrl !== input.url) {
                    input = new Request(fixedUrl, input);
                }
            }
            
            return originalFetch.call(this, input, init);
        };
        
        console.log('[URLFixer] Fetch interceptor installed');
    }
};

/**
 * Override Image constructor to fix src URLs
 */
export const installImageFixer = () => {
    if (typeof window !== 'undefined') {
        const OriginalImage = window.Image;
        
        window.Image = function() {
            const img = new OriginalImage();
            const originalSrcSetter = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src').set;
            
            Object.defineProperty(img, 'src', {
                set: function(value) {
                    const fixedValue = fixUrl(value);
                    originalSrcSetter.call(this, fixedValue);
                },
                get: function() {
                    return this.getAttribute('src');
                }
            });
            
            return img;
        };
        
        console.log('[URLFixer] Image constructor interceptor installed');
    }
};

/**
 * Fix all existing images on the page
 */
export const fixExistingImages = () => {
    if (typeof document !== 'undefined') {
        const images = document.querySelectorAll('img');
        let fixedCount = 0;
        
        images.forEach(img => {
            if (img.src.includes('localhost:3001')) {
                const oldSrc = img.src;
                img.src = fixUrl(img.src);
                fixedCount++;
                console.log('[URLFixer] Fixed existing image:', oldSrc, '->', img.src);
            }
        });
        
        if (fixedCount > 0) {
            console.log(`[URLFixer] Fixed ${fixedCount} existing images`);
        }
        
        return fixedCount;
    }
    
    return 0;
};

/**
 * Install all URL fixers
 */
export const installAllFixers = () => {
    console.log('[URLFixer] Installing all URL fixers...');
    
    installFetchFixer();
    installImageFixer();
    
    // Fix existing images after a short delay
    setTimeout(() => {
        fixExistingImages();
    }, 100);
    
    // Also fix existing images every 5 seconds for dynamic content
    setInterval(() => {
        fixExistingImages();
    }, 5000);
    
    console.log('[URLFixer] All URL fixers installed successfully');
};

/**
 * Create a script that can be injected into pages to fix URLs
 */
export const createFixerScript = () => {
    return `
(function() {
    console.log('[URLFixer] Injected URL fixer starting...');
    
    const PRODUCTION_API_URL = 'https://api.thontrangliennhat.com';
    
    // Fix fetch
    if (window.fetch) {
        const originalFetch = window.fetch;
        window.fetch = function(input, init) {
            if (typeof input === 'string' && input.includes('localhost:3001')) {
                input = input.replace(/http:\\/\\/localhost:3001/g, PRODUCTION_API_URL);
                console.log('[URLFixer] Fixed fetch URL:', input);
            }
            return originalFetch.call(this, input, init);
        };
    }
    
    // Fix existing images
    document.querySelectorAll('img').forEach(img => {
        if (img.src.includes('localhost:3001')) {
            const oldSrc = img.src;
            img.src = img.src.replace(/http:\\/\\/localhost:3001/g, PRODUCTION_API_URL);
            console.log('[URLFixer] Fixed image:', oldSrc, '->', img.src);
        }
    });
    
    // Fix new images
    const OriginalImage = window.Image;
    window.Image = function() {
        const img = new OriginalImage();
        const originalSrcSetter = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src').set;
        
        Object.defineProperty(img, 'src', {
            set: function(value) {
                if (typeof value === 'string' && value.includes('localhost:3001')) {
                    value = value.replace(/http:\\/\\/localhost:3001/g, PRODUCTION_API_URL);
                    console.log('[URLFixer] Fixed new image URL:', value);
                }
                originalSrcSetter.call(this, value);
            },
            get: function() {
                return this.getAttribute('src');
            }
        });
        
        return img;
    };
    
    console.log('[URLFixer] Injected URL fixer completed');
})();
    `;
};

export default {
    fixUrl,
    fixUrlsInObject,
    installFetchFixer,
    installImageFixer,
    fixExistingImages,
    installAllFixers,
    createFixerScript
}; 