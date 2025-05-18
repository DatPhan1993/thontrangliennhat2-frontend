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
    timeout: 15000, // 15 seconds timeout
    withCredentials: false // Don't send cookies
});

// Add a timestamp to GET requests to prevent caching
api.interceptors.request.use(config => {
    if (config.method === 'get') {
        config.params = config.params || {};
        config.params.nocache = Date.now();
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Data transformation for responses
api.interceptors.response.use(
    response => {
        // Return only the data for convenience
        return response.data;
    },
    error => {
        console.error('API Error:', error);
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
    
    getApiUrl: () => baseURL
};

export default apiService; 