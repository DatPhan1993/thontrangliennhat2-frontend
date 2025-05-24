import axios from 'axios';

// API Base URL Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL 
    || process.env.REACT_APP_BASE_URL 
    || 'https://api.thontrangliennhat.com';

console.log('[API] Using base URL:', API_BASE_URL);

// Create axios instance with proper configuration
const api = axios.create({
    baseURL: API_BASE_URL + '/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    }
});

// Request interceptor to add timestamp and fix localhost URLs
api.interceptors.request.use(
    (config) => {
        // Fix any localhost URLs in the config
        if (config.baseURL && config.baseURL.includes('localhost:3001')) {
            config.baseURL = config.baseURL.replace(
                'https://api.thontrangliennhat.com', 
                'https://api.thontrangliennhat.com'
            );
            console.log('[API] Fixed localhost URL in baseURL:', config.baseURL);
        }
        
        if (config.url && config.url.includes('localhost:3001')) {
            config.url = config.url.replace(
                'https://api.thontrangliennhat.com', 
                'https://api.thontrangliennhat.com'
            );
            console.log('[API] Fixed localhost URL in request URL:', config.url);
        }

        // Add cache busting timestamp
        const separator = config.url && config.url.includes('?') ? '&' : '?';
        if (config.url) {
            config.url = `${config.url}${separator}_=${Date.now()}`;
        }

        console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        return config;
    },
    (error) => {
        console.error('[API] Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling and logging
api.interceptors.response.use(
    (response) => {
        console.log(`[API] Response success: ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error('[API] Response error:', {
            url: error.config?.url,
            status: error.response?.status,
            message: error.message,
            data: error.response?.data
        });
        
        // If it's a localhost URL error, provide helpful message
        if (error.config?.url?.includes('localhost:3001')) {
            console.error('[API] ❌ Localhost URL detected! This should have been fixed by interceptor.');
        }
        
        return Promise.reject(error);
    }
);

// Helper function to fix localhost URLs manually
export const fixLocalhostUrl = (url) => {
    if (typeof url === 'string' && url.includes('localhost:3001')) {
        const fixed = url.replace('https://api.thontrangliennhat.com', 'https://api.thontrangliennhat.com');
        console.log('[API] Manual URL fix:', url, '->', fixed);
        return fixed;
    }
    return url;
};

// Export the configured axios instance
export default api; 