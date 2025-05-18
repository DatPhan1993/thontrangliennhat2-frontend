import axios from 'axios';

// Determine API base URL based on environment
let baseURL = '';

// Development environment
if (process.env.NODE_ENV === 'development') {
    baseURL = 'http://localhost:3001/api';
} 
// Production environment
else {
    // Use the Vercel deployment URL
    baseURL = 'https://thontrangliennhat2-4srlwehcl-phan-dats-projects-d067d5c1.vercel.app';
    
    // Fallback URLs if the main one doesn't work
    try {
        // Check if we're in a browser environment
        if (typeof window !== 'undefined') {
            // Try to get the stored API URL from localStorage
            const storedApiUrl = localStorage.getItem('api_url');
            if (storedApiUrl) {
                baseURL = storedApiUrl;
                console.log('Using stored API URL from localStorage:', baseURL);
            }
        }
    } catch (e) {
        console.error('Error accessing localStorage:', e);
    }
}

console.log('API Service using baseURL:', baseURL);

// Create axios instance with custom config
const api = axios.create({
    baseURL,
    timeout: 30000, // 30 seconds timeout
    headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Requested-With': 'XMLHttpRequest'
    }
});

// Add a timestamp to GET requests to prevent caching
api.interceptors.request.use(config => {
    // Add timestamp for all requests to prevent caching
    const timestamp = Date.now();
    
    if (config.method === 'get') {
        config.params = config.params || {};
        // Add timestamp to prevent caching
        config.params._ = timestamp;
        config.params.nocache = timestamp;
    }
    
    // Log all API requests in development
    if (process.env.NODE_ENV === 'development') {
        console.log(`API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    
    return config;
}, error => {
    return Promise.reject(error);
});

// Response interceptor
api.interceptors.response.use(
    response => {
        // Handle successful responses
        if (response.data && response.data.data) {
            if (process.env.NODE_ENV === 'development') {
                console.log(`Got data from API for ${response.config.url}:`, 
                    Array.isArray(response.data.data) 
                        ? `Array with ${response.data.data.length} items` 
                        : typeof response.data.data);
            }
            return response.data;
        }
        
        return response.data;
    },
    error => {
        // Handle errors
        console.error('API request failed:', error);
        
        if (error.response) {
            // Server responded with a status code outside of 2xx range
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received');
        } else {
            // Something happened in setting up the request
            console.error('Error setting up request:', error.message);
        }
        
        return Promise.reject(error);
    }
);

// API service functions
const apiService = {
    // Products
    getAllProducts: () => api.get('/products'),
    getProductById: (id) => api.get(`/products/${id}`),
    getProductBySlug: (slug) => api.get(`/products/slug/${slug}`),

    // Services
    getAllServices: () => api.get('/services'),
    getServiceById: (id) => api.get(`/services/${id}`),
    getServiceBySlug: (slug) => api.get(`/services/slug/${slug}`),

    // Experiences
    getAllExperiences: () => api.get('/experiences'),
    getExperienceById: (id) => api.get(`/experiences/${id}`),
    getExperienceBySlug: (slug) => api.get(`/experiences/slug/${slug}`),

    // News
    getAllNews: () => api.get('/news'),
    getNewsById: (id) => api.get(`/news/${id}`),
    getNewsBySlug: (slug) => api.get(`/news/slug/${slug}`),

    // Navigation
    getNavigation: () => api.get('/navigation-links'),
    getParentNavs: () => api.get('/parent-navs'),
    getChildNavs: () => api.get('/child-navs'),
    getParentNavsWithChildren: () => api.get('/parent-navs/all-with-child'),

    // Categories
    getCategories: () => api.get('/categories'),
    
    // Team
    getTeamMembers: () => api.get('/team'),
    
    // New utility functions for API config
    setApiUrl: (url) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('api_url', url);
            window.location.reload();
        }
    },
    
    getApiUrl: () => baseURL,
    
    // Test the API connection
    testApiConnection: () => {
        return api.get('/products')
            .then(response => {
                console.log('API Connection Test Successful:', response);
                return true;
            })
            .catch(error => {
                console.error('API Connection Test Failed:', error.message);
                return false;
            });
    }
};

export default apiService;
