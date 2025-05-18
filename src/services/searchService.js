import httpRequest from '~/utils/httpRequest';

export const searchItems = async (query, limit = 8, page = 1) => {
    try {
        const response = await httpRequest.get(`/search?query=${query}&limit=${limit}&page=${page}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching search results:', error);
        throw error;
    }
};
