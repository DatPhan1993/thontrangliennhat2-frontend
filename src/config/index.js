import routes from './routes';

// Xác định base URL của trang web hiện tại
const getBaseUrl = () => {
    // Trong môi trường trình duyệt
    if (typeof window !== 'undefined') {
        return window.location.origin;
    }
    // Nếu không có window object (môi trường nodejs)
    return process.env.REACT_APP_BASE_URL?.split('/api')[0] || 'http://localhost:3001';
};

const apiBaseUrl = process.env.REACT_APP_BASE_URL?.split('/api')[0] || 'http://localhost:3001';

const config = {
    routes,
    apiUrl: apiBaseUrl,
    uploadUrl: `${apiBaseUrl}/uploads`,
    uploadImageUrl: `${apiBaseUrl}/images/uploads`,
    imageUrl: `${apiBaseUrl}/images`,
    publicUrl: process.env.REACT_APP_PUBLIC_URL || 'http://localhost:3000',
};

export default config;
