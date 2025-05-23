import httpRequest from '~/utils/httpRequest';

// Helper functions for sessionStorage
const saveToSessionStorage = (key, data) => {
    sessionStorage.setItem(key, JSON.stringify(data));
};

const getFromSessionStorage = (key) => {
    const storedData = sessionStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : null;
};

// Images
export const getImagesPagination = async (page = 1, limit = 9) => {
    const sessionKey = `imagesPagination_page_${page}_limit_${limit}`;

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get(`/image?page=${page}&limit=${limit}`);
        const imagesData = response.data.data;

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, imagesData);

        return imagesData;
    } catch (error) {
        console.error('Error fetching images', error);
        throw error;
    }
};

export const getImages = async () => {
    const sessionKey = 'allImages';

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get('/images');
        const imagesData = response.data.data;

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, imagesData);

        return imagesData;
    } catch (error) {
        console.error('Error fetching images', error);
        throw error;
    }
};

export const createImage = async (imageData) => {
    try {
        const response = await httpRequest.post('/images', imageData);

        sessionStorage.removeItem('allImages');
        // Refresh sessionStorage for all images list
        const updatedImages = await getImages();
        saveToSessionStorage('allImages', updatedImages);

        return response.data.data;
    } catch (error) {
        console.error('Error adding image', error);
        throw error;
    }
};

export const updateImage = async (imageId, updatedData) => {
    try {
        const response = await httpRequest.put(`/images/${imageId}`, updatedData);

        // Refresh sessionStorage for the specific image and all images list
        sessionStorage.removeItem(`image_${imageId}`);
        const updatedImages = await getImages();
        saveToSessionStorage('allImages', updatedImages);

        return response.data.data;
    } catch (error) {
        console.error('Error updating image', error);
        throw error;
    }
};

export const deleteImage = async (imageId) => {
    try {
        await httpRequest.delete(`/images/${imageId}`);

        // Remove the deleted image from sessionStorage
        sessionStorage.removeItem(`image_${imageId}`);
        sessionStorage.removeItem('allImages');

        // Refresh sessionStorage for all images list
        const updatedImages = await getImages();
        saveToSessionStorage('allImages', updatedImages);
    } catch (error) {
        console.error('Error deleting image', error);
        throw error;
    }
};

// Videos
export const getVideos = async () => {
    const sessionKey = 'allVideos';

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get('/videos');
        const videosData = response.data.data;

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, videosData);

        return videosData;
    } catch (error) {
        console.error('Error fetching videos', error);
        throw error;
    }
};

export const getVideosPagination = async (page = 1, limit = 9) => {
    const sessionKey = `videosPagination_page_${page}_limit_${limit}`;

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get(`/videos?page=${page}&limit=${limit}`);
        const videosData = response.data.data;

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, videosData);

        return videosData;
    } catch (error) {
        console.error('Error fetching videos', error);
        throw error;
    }
};

export const createVideo = async (videoData) => {
    try {
        const response = await httpRequest.post('/videos', videoData);

        sessionStorage.removeItem('allVideos');
        // Refresh sessionStorage for all videos list
        const updatedVideos = await getVideos();
        saveToSessionStorage('allVideos', updatedVideos);

        return response.data.data;
    } catch (error) {
        console.error('Error adding video', error);
        throw error;
    }
};

export const updateVideo = async (videoId, updatedData) => {
    try {
        const response = await httpRequest.put(`/videos/${videoId}`, updatedData);

        // Refresh sessionStorage for the specific video and all videos list
        sessionStorage.removeItem(`video_${videoId}`);
        const updatedVideos = await getVideos();
        saveToSessionStorage('allVideos', updatedVideos);

        return response.data.data;
    } catch (error) {
        console.error('Error updating video', error);
        throw error;
    }
};

export const deleteVideo = async (videoId) => {
    try {
        await httpRequest.delete(`/videos/${videoId}`);

        sessionStorage.removeItem('allVideos');
        // Remove the deleted video from sessionStorage
        sessionStorage.removeItem(`video_${videoId}`);

        // Refresh sessionStorage for all videos list
        const updatedVideos = await getVideos();
        saveToSessionStorage('allVideos', updatedVideos);
    } catch (error) {
        console.error('Error deleting video', error);
        throw error;
    }
};
