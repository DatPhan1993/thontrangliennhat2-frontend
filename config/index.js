import routes from './routes';

// Xác định base URL của trang web hiện tại
const getBaseUrl = () => {
    // Trong môi trường trình duyệt
    if (typeof window !== 'undefined') {
        return window.location.origin;
    }
    // Fallback cho môi trường nodejs
    return process.env.REACT_APP_PUBLIC_URL || 'http://localhost:3000';
};

// API URL riêng biệt cho API calls - thêm /api vào cuối
const apiUrl = (process.env.REACT_APP_API_URL || process.env.REACT_APP_BASE_URL || 'https://api.thontrangliennhat.com') + '/api';

// Static assets URL (từ main domain, không phải API subdomain)
const staticBaseUrl = process.env.REACT_APP_PUBLIC_URL || getBaseUrl();

const config = {
    routes,
    apiUrl: apiUrl,
    uploadUrl: `${staticBaseUrl}/uploads`,
    uploadImageUrl: `${staticBaseUrl}/images/uploads`,
    imageUrl: `${staticBaseUrl}/images`,
    publicUrl: process.env.REACT_APP_PUBLIC_URL || 'http://localhost:3000',
};

export default config;
