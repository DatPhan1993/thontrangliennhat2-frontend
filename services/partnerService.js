import httpRequest from '~/utils/httpRequest';

export const getPartners = async () => {
    try {
        const response = await httpRequest.get('/partner');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching partners:', error);
        throw error;
    }
};

export const getPartnerById = async (id) => {
    try {
        const response = await httpRequest.get(`/partner/${id}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching partner:', error);
        throw error;
    }
};

export const createPartner = async (partnerData) => {
    try {
        const response = await httpRequest.post('/partner', partnerData);
        return response.data.data;
    } catch (error) {
        console.error('Error creating partner:', error);
        throw error;
    }
};

export const updatePartner = async (id, partnerData) => {
    try {
        const response = await httpRequest.put(`/partner/${id}`, partnerData);
        return response.data.data;
    } catch (error) {
        console.error('Error updating partner:', error);
        throw error;
    }
};

export const deletePartner = async (id) => {
    try {
        const response = await httpRequest.delete(`/partner/${id}`);
        return response.data.data;
    } catch (error) {
        console.error('Error deleting partner:', error);
        throw error;
    }
};
