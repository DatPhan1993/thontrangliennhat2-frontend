import routes from './routes';

// Xác định base URL của trang web hiện tại
const getBaseUrl = () => {
    // Trong môi trường trình duyệt
    if (typeof window !== 'undefined') {
        return window.location.origin;
    }
    // Fallback cho môi trường nodejs
    return process.env.REACT_APP_PUBLIC_URL || 'https://thontrangliennhat.com';
};

// API URL riêng biệt cho API calls - không thêm /api vì endpoints đã có sẵn
const apiUrl = process.env.REACT_APP_API_URL || process.env.REACT_APP_BASE_URL || 'https://api.thontrangliennhat.com';

// Static assets URL (từ main domain, không phải API subdomain)
const staticBaseUrl = process.env.REACT_APP_PUBLIC_URL || getBaseUrl();

const config = {
    routes,
    apiUrl: apiUrl,
    uploadUrl: `${apiUrl}/uploads`,
    uploadImageUrl: `${apiUrl}/images/uploads`,
    imageUrl: `${apiUrl}/images`,
    publicUrl: process.env.REACT_APP_PUBLIC_URL || 'https://thontrangliennhat.com',
};

export default config;
