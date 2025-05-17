import httpRequest from '~/utils/httpRequest';

const API_URL = '/admin/users';

export const getUsers = async () => {
    try {
        const response = await httpRequest.get(API_URL);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching users', error);
        throw error;
    }
};

export const addUser = async (userData) => {
    try {
        const response = await httpRequest.post(API_URL, userData);
        return response.data.data;
    } catch (error) {
        console.error('Error adding user', error);
        throw error;
    }
};

export const updateUser = async (userData) => {
    try {
        const response = await httpRequest.patch(`${API_URL}`, userData);
        return response.data.data;
    } catch (error) {
        console.error(`Error updating user`, error);
        throw error;
    }
};

export const getUserById = async (userId) => {
    try {
        const response = await httpRequest.get(`${API_URL}/${userId}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error updating user ${userId}`, error);
        throw error;
    }
};

export const getUserByEmail = async (email) => {
    try {
        const response = await httpRequest.get(`${API_URL}?email=${email}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error updating user ${email}`, error);
        throw error;
    }
};

export const deleteUser = async (accDelId, userId) => {
    try {
        const response = await httpRequest.delete(`${API_URL}`, { accDelId, userId });
        return response.data.data;
    } catch (error) {
        console.error(`Error deleting user ${userId}`, error);
        throw error;
    }
};

export const changePassword = async (oldPassword, newPassword) => {
    try {
        const response = await httpRequest.post(`/user/update-password`, { oldPassword, newPassword });
        return response.data.data;
    } catch (error) {
        console.error('Error changing password', error);
        throw error;
    }
};
