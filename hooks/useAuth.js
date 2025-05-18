import { useState, useEffect, useContext, createContext, useCallback } from 'react';
import { login, logout, refreshToken } from '~/services/auth/authService';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const auth = useProvideAuth();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};

const useProvideAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const refreshAccessTokenIfNeeded = useCallback(async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            const response = await refreshToken(refreshToken);
            if (response.statusCode === 200) {
                const { data } = response;
                setUser((prevUser) => ({
                    ...prevUser,
                    accessToken: data.accessToken,
                }));

                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('accessTokenExpiresAt', data.accessTokenExpiresAt);

                scheduleAccessTokenRefresh(data.accessTokenExpiresAt);
            } else {
                signout();
                throw new Error('Làm mới token thất bại');
            }
        } catch (error) {
            console.error('Error refreshing access token:', error);
            signout();
        }
    }, []);

    const scheduleAccessTokenRefresh = useCallback((accessTokenExpiresAt) => {
        const expirationTime = new Date(accessTokenExpiresAt).getTime();
        const currentTime = new Date().getTime();
        const timeUntilRefresh = expirationTime - currentTime - 5 * 60 * 1000;

        if (timeUntilRefresh > 0) {
            console.log(`Access token sẽ được làm mới sau ${timeUntilRefresh / 1000 / 60} phút.`);
            setTimeout(() => {
                refreshAccessTokenIfNeeded();
            }, timeUntilRefresh);
        } else {
            refreshAccessTokenIfNeeded();
        }
    }, [refreshAccessTokenIfNeeded]);

    const signout = useCallback(() => {
        logout();
        setUser(null);

        localStorage.removeItem('accessToken');
        localStorage.removeItem('accessTokenExpiresAt');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('refreshTokenExpiresAt');
        localStorage.removeItem('userEmail');

        navigate('/login');
    }, [navigate]);

    // Cập nhật refreshAccessTokenIfNeeded để sử dụng signout từ useCallback
    useEffect(() => {
        refreshAccessTokenIfNeeded._signout = signout;
    }, [refreshAccessTokenIfNeeded, signout]);

    useEffect(() => {
        const checkAccessToken = () => {
            const storedAccessToken = localStorage.getItem('accessToken');
            const storedRefreshToken = localStorage.getItem('refreshToken');
            const storedAccessTokenExpiresAt = localStorage.getItem('accessTokenExpiresAt');
            const storedUserEmail = localStorage.getItem('userEmail');

            if (storedAccessToken && storedRefreshToken && storedAccessTokenExpiresAt) {
                const isAccessTokenExpired = new Date().getTime() >= new Date(storedAccessTokenExpiresAt).getTime();

                if (isAccessTokenExpired) {
                    refreshAccessTokenIfNeeded();
                } else {
                    setUser({
                        accessToken: storedAccessToken,
                        refreshToken: storedRefreshToken,
                        email: storedUserEmail,
                    });
                    scheduleAccessTokenRefresh(storedAccessTokenExpiresAt);
                }
            }

            setLoading(false);
        };

        checkAccessToken();
    }, [refreshAccessTokenIfNeeded, scheduleAccessTokenRefresh]);

    const signin = async (credentials) => {
        try {
            const response = await login(credentials);
            if (response.statusCode === 200) {
                const { data } = response;
                setUser({ accessToken: data.accessToken });

                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('accessTokenExpiresAt', data.accessTokenExpiresAt);
                localStorage.setItem('refreshToken', data.refreshToken);
                localStorage.setItem('refreshTokenExpiresAt', data.refreshTokenExpiresAt);
                localStorage.setItem('userEmail', credentials.email);

                scheduleAccessTokenRefresh(data.accessTokenExpiresAt);

                navigate('/admin/dashboard');
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error('Error signing in:', error);
            throw error;
        }
    };

    return {
        user,
        loading,
        signin,
        signout,
    };
};

export default AuthProvider;
