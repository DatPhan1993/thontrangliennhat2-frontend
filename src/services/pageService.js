import httpRequest from '~/utils/httpRequest';

export const getPageContent = async () => {
    try {
        const response = await httpRequest.get(`/pages`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching page content:', error);
        throw error;
    }
};

export const addPageContent = async (data) => {
    try {
        const response = await httpRequest.post(`/pages`, data);
        return response.data.data;
    } catch (error) {
        console.error('Error adding page content:', error);
        throw error;
    }
};

export const updatePageContent = async (slug, data) => {
    try {
        const response = await httpRequest.patch(`/pages/${slug}`, data);
        return response.data.data;
    } catch (error) {
        console.error('Error updating page content by slug:', error);
        throw error;
    }
};

export const getPageBySlug = async (slug) => {
    try {
        const response = await httpRequest.get(`/pages/slug/${slug}`);
        return response.data.data;
    } catch (error) {
        console.error('Error updating page content:', error);
        throw error;
    }
};

export const deletePageContent = async (slug) => {
    try {
        const response = await httpRequest.delete(`/pages/${slug}`);
        return response.data.data;
    } catch (error) {
        console.error('Error deleting page content:', error);
        throw error;
    }
};
