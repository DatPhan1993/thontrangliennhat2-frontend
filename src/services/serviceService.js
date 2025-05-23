import httpRequest from '~/utils/httpRequest';

// Helper functions for sessionStorage
const saveToSessionStorage = (key, data) => {
    sessionStorage.setItem(key, JSON.stringify(data));
};

const getFromSessionStorage = (key) => {
    const storedData = sessionStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : null;
};

// Get paginated services and cache the result
export const getServicePagination = async (page = 1, limit = 4) => {
    const sessionKey = `services_page_${page}_limit_${limit}`;

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get(`/services?page=${page}&limit=${limit}`);
        const servicesData = response.data.data;

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, servicesData);

        return servicesData;
    } catch (error) {
        console.error('Error fetching service', error);
        throw error;
    }
};

// Get all services and cache the result
export const getServices = async () => {
    const sessionKey = 'allServices';

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get('/services');
        const servicesData = response.data.data;

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, servicesData);

        return servicesData;
    } catch (error) {
        console.error('Error fetching service', error);
        throw error;
    }
};

// Get service by ID and cache the result
export const getServiceById = async (id) => {
    const sessionKey = `service_${id}`;

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get(`/services/${id}`);
        let serviceData = response.data.data;
        
        // Handle case when the API returns an array of services
        if (Array.isArray(serviceData)) {
            const foundService = serviceData.find(s => s.id.toString() === id.toString());
            if (foundService) {
                serviceData = foundService;
            }
        }

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, serviceData);

        return serviceData;
    } catch (error) {
        console.error(`Error fetching service detail with id ${id}`, error);
        throw error;
    }
};

// Get services by category and cache the result
export const getServiceByCategory = async (categoryId) => {
    const sessionKey = `services_category_${categoryId}`;

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get(`/services?child_nav_id=${categoryId}`);
        const servicesData = response.data.data;

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, servicesData);

        return servicesData;
    } catch (error) {
        console.error(`Error fetching service for id=${categoryId}:`, error);
        throw error;
    }
};

// Create service (no sessionStorage needed for POST requests)
export const createService = async (experienceData) => {
    try {
        const response = await httpRequest.post('services', experienceData);

        sessionStorage.removeItem(`allServices`);
        // Refresh sessionStorage for all experiences list
        const updatedServices = await getServices();
        saveToSessionStorage('allServices', updatedServices);

        return response.data.data;
    } catch (error) {
        console.error('Error adding experience', error);
        throw error;
    }
};

// Update service and refresh sessionStorage for that service item
export const updateService = async (id, serviceData) => {
    try {
        console.log(`Updating service with ID: ${id}`);
        
        // Always use POST method with _method=PUT for FormData
        if (serviceData instanceof FormData) {
            // Ensure method override and ID are included
            if (!serviceData.has('_method')) {
                serviceData.append('_method', 'PUT');
            }
            if (!serviceData.has('id')) {
                serviceData.append('id', id);
            }
            
            // Log FormData contents for debugging
            console.log('FormData contents:');
            for (let [key, value] of serviceData.entries()) {
                if (value instanceof File) {
                    console.log(`${key}: File - ${value.name} (${value.size} bytes)`);
                } else if (typeof value === 'string') {
                    console.log(`${key}: ${value.substring(0, 100)}${value.length > 100 ? '...' : ''}`);
                } else {
                    console.log(`${key}: [Object]`);
                }
            }
            
            // Make a POST request to the update endpoint with specific URL
            try {
                const url = `/services/${id}`;
                console.log('Making POST request to URL:', url);
                const response = await httpRequest.post(url, serviceData);
                
                // Clear all relevant caches to ensure fresh data
                sessionStorage.removeItem(`service_${id}`);
                sessionStorage.removeItem('allServices');
                
                // Clear any category-related caches
                Object.keys(sessionStorage).forEach(key => {
                    if (key.startsWith('services_category_') || key.startsWith('services_page_')) {
                        sessionStorage.removeItem(key);
                    }
                });

                // If we got a valid response, update the cache with the new data
                if (response.data && response.data.data) {
                    saveToSessionStorage(`service_${id}`, response.data.data);
                }

                return response.data.data;
            } catch (err) {
                console.error(`Error in POST request for service ${id}:`, err);
                
                if (err.response) {
                    console.error('Response status:', err.response.status);
                    console.error('Response data:', err.response.data);
                }
                
                throw err; // Re-throw to be handled by the caller
            }
        } else {
            // For JSON data, continue using PUT method
            const response = await httpRequest.put(`/services/${id}`, serviceData);
            
            // Clear relevant caches
            sessionStorage.removeItem(`service_${id}`);
            sessionStorage.removeItem('allServices');
            
            Object.keys(sessionStorage).forEach(key => {
                if (key.startsWith('services_category_') || key.startsWith('services_page_')) {
                    sessionStorage.removeItem(key);
                }
            });

            if (response.data && response.data.data) {
                saveToSessionStorage(`service_${id}`, response.data.data);
            }

            return response.data.data;
        }
    } catch (error) {
        console.error(`Error updating service with id ${id}:`, error);
        throw error;
    }
};

export const deleteService = async (id) => {
    try {
        await httpRequest.delete(`/services/${id}`);

        // Remove the deleted service from sessionStorage
        sessionStorage.removeItem(`service_${id}`);
        sessionStorage.removeItem(`allServices`);

        // Refresh sessionStorage for all services list
        const updatedServices = await getServices();
        saveToSessionStorage('allServices', updatedServices);
    } catch (error) {
        console.error(`Error deleting service with id ${id}`, error);
        throw error;
    }
};
