import httpRequest from '~/utils/httpRequest';

// Helper functions for sessionStorage
const saveToSessionStorage = (key, data) => {
    sessionStorage.setItem(key, JSON.stringify(data));
};

const getFromSessionStorage = (key) => {
    const storedData = sessionStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : null;
};

// Experience
export const getExperiencePagination = async (page = 1, limit = 4) => {
    const sessionKey = `experiencePagination_page_${page}_limit_${limit}`;

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get(`/experiences?page=${page}&limit=${limit}`);
        const experienceData = response.data.data;

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, experienceData);

        return experienceData;
    } catch (error) {
        console.error('Error fetching experience', error);
        throw error;
    }
};

export const getExperiences = async () => {
    const sessionKey = 'allExperiences';

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get('/experiences');
        const experiencesData = response.data.data;

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, experiencesData);

        return experiencesData;
    } catch (error) {
        console.error('Error fetching experience', error);
        throw error;
    }
};

export const getExperienceAll = async () => {
    const sessionKey = 'allExperiences';

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get('/experiences');
        const experiencesData = response.data.data;

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, experiencesData);

        return experiencesData;
    } catch (error) {
        console.error('Error fetching experience', error);
        throw error;
    }
};

export const getExperienceById = async (id) => {
    const sessionKey = `experience_${id}`;

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get(`/experiences/${id}`);
        const experienceData = response.data.data;

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, experienceData);

        return experienceData;
    } catch (error) {
        console.error(`Error fetching experience detail with id ${id}`, error);
        throw error;
    }
};

export const getExperienceByCategory = async (categoryId) => {
    const sessionKey = `experienceByCategory_${categoryId}`;

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get(`/experiences?child_nav_id=${categoryId}`);
        const experienceData = response.data.data;

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, experienceData);

        return experienceData;
    } catch (error) {
        console.error(`Error fetching experience for id=${categoryId}:`, error);
        throw error;
    }
};

export const createExperience = async (experienceData) => {
    try {
        const response = await httpRequest.post('/experiences', experienceData);

        sessionStorage.removeItem(`allExperiences`);
        // Refresh sessionStorage for all experiences list
        const updatedExperiences = await getExperiences();
        saveToSessionStorage('allExperiences', updatedExperiences);

        return response.data.data;
    } catch (error) {
        console.error('Error adding experience', error);
        throw error;
    }
};

export const updateExperience = async (id, experienceData) => {
    try {
        const response = await httpRequest.post(`/experiences/${id}`, experienceData);

        // Refresh sessionStorage for the specific experience and all experiences list
        sessionStorage.removeItem(`experience_${id}`);
        sessionStorage.removeItem(`allExperiences`);
        const updatedExperiences = await getExperiences();
        saveToSessionStorage('allExperiences', updatedExperiences);
        saveToSessionStorage(`experience_${id}`, response.data.data);

        return response.data.data;
    } catch (error) {
        console.error(`Error updating experience with id ${id}`, error);
        throw error;
    }
};

export const deleteExperience = async (id) => {
    try {
        await httpRequest.delete(`/experiences/${id}`);

        // Remove the deleted experience from sessionStorage
        sessionStorage.removeItem(`experience_${id}`);
        sessionStorage.removeItem(`allExperiences`);

        // Refresh sessionStorage for all experiences list
        const updatedExperiences = await getExperiences();
        saveToSessionStorage('allExperiences', updatedExperiences);
    } catch (error) {
        console.error(`Error deleting experience with id ${id}`, error);
        throw error;
    }
};
