import httpRequest from '~/utils/httpRequest';

const saveToSessionStorage = (key, data) => {
    sessionStorage.setItem(key, JSON.stringify(data));
};

const getFromSessionStorage = (key) => {
    const storedData = sessionStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : null;
};

export const getConfiguration = async () => {
    const sessionKey = 'configurationDesktop'; // Khóa để lưu vào sessionStorage

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get('/configuration');
        const configData = response.data.data[0];

        saveToSessionStorage(sessionKey, configData);

        return configData;
    } catch (error) {
        console.error('Error fetching configuration', error);
        throw error;
    }
};

export const getConfigurationMobile = async () => {
    const sessionKey = 'configurationMobile';

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get('/configuration');
        const configData = response.data.data[1];

        saveToSessionStorage(sessionKey, configData);

        return configData;
    } catch (error) {
        console.error('Error fetching configuration', error);
        throw error;
    }
};

export const updateConfiguration = async (data, id) => {
    try {
        const response = await httpRequest.post(`/configuration/${id}`, data);

        sessionStorage.removeItem(`configurationDesktop`);
        sessionStorage.removeItem(`configurationMobile`);
        const updateConfDesk = await getConfiguration();
        const updateConfMobile = await getConfigurationMobile();
        saveToSessionStorage('configurationDesktop', updateConfDesk);
        saveToSessionStorage('configurationMobile', updateConfMobile);

        return response.data.data;
    } catch (error) {
        console.error('Error updating configuration', error);
        throw error;
    }
};
