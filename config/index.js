import routes from './routes';

// Xác định base URL của trang web hiện tại
const getBaseUrl = () => {
    // Trong môi trường trình duyệt
    if (typeof window !== 'undefined') {
        return window.location.origin;
    }
    // Nếu không có window object (môi trường nodejs)
    return process.env.REACT_APP_PUBLIC_URL || 'https://thontrangliennhat.com';
};

const apiUrl = process.env.REACT_APP_API_URL || process.env.REACT_APP_BASE_URL || 'https://api.thontrangliennhat.com';

const config = {
    routes,
    apiUrl: apiUrl,
    uploadUrl: `${apiUrl}/uploads`,
    uploadImageUrl: `${apiUrl}/images/uploads`,
    imageUrl: `${apiUrl}/images`,
    publicUrl: process.env.REACT_APP_PUBLIC_URL || 'https://thontrangliennhat.com',
};

export default config;
