import axios from 'axios';

// Determine API base URL based on environment
let baseURL = '';

// Development environment
if (process.env.NODE_ENV === 'development') {
    baseURL = 'http://localhost:3001/api';
} 
// Production environment
else {
    // Use the direct API URL instead of relying on rewrites
    baseURL = 'https://thontrangliennhat2-api-phan-dats-projects-d067d5c1.vercel.app/api';
    // Log that we're using the direct API URL
    console.log('Using direct API URL for production');
}

console.log('API Service using baseURL:', baseURL);

// Create axios instance with custom config
const api = axios.create({
    baseURL,
    timeout: 30000, // 30 seconds timeout (increased from 15)
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
    console.log(`API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    
    return config;
});

// Response interceptor
api.interceptors.response.use(
    response => {
        // Log successful responses
        console.log(`API Response success: ${response.config.url}`);
        
        // Handle successful responses
        if (response.data && response.data.data) {
            console.log(`Got data from API for ${response.config.url}:`, 
                Array.isArray(response.data.data) 
                    ? `Array with ${response.data.data.length} items` 
                    : typeof response.data.data);
            return response.data;
        }
        
        // If response.data exists but doesn't have a data property
        if (response.data) {
            console.log(`Got response from API for ${response.config.url} without data property:`, 
                typeof response.data === 'object' 
                    ? Object.keys(response.data).join(', ') 
                    : typeof response.data);
        }
        
        return response;
    },
    error => {
        // Handle errors
        console.error('API request failed:', error);
        
        if (error.response) {
            // Server responded with a status code outside of 2xx range
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
            console.error('Headers:', error.response.headers);
            console.error('Request URL:', error.config.url);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received for request to:', error.config.url);
            console.error('Request details:', error.request);
        } else {
            // Something happened in setting up the request
            console.error('Error setting up request:', error.message);
        }
        
        return Promise.reject(error);
    }
);

// Test the API connection immediately
api.get('/products')
    .then(response => {
        console.log('API Connection Test Successful - Products:', 
            response.data ? `Found ${Array.isArray(response.data) ? response.data.length : 0} products` : 'No data');
    })
    .catch(error => {
        console.error('API Connection Test Failed:', error.message);
    });

api.get('/services')
    .then(response => {
        console.log('API Connection Test Successful - Services:',
            response.data ? `Found ${Array.isArray(response.data) ? response.data.length : 0} services` : 'No data');
    })
    .catch(error => {
        console.error('API Connection Test Failed:', error.message);
    });

export default api; 