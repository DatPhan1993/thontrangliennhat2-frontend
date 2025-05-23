import httpRequest from '~/utils/httpRequest';

// Helper functions for sessionStorage
const saveToSessionStorage = (key, data) => {
    sessionStorage.setItem(key, JSON.stringify(data));
};

const getFromSessionStorage = (key) => {
    const storedData = sessionStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : null;
};

// Get paginated news and cache the result
export const getNewsPagination = async (page = 1, limit = 4) => {
    const sessionKey = `news_page_${page}_limit_${limit}`;

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get(`/news?page=${page}&limit=${limit}`);
        const newsData = response.data.data;

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, newsData);

        return newsData;
    } catch (error) {
        console.error('Error fetching news', error);
        throw error;
    }
};

// Get all news and cache the result
export const getNews = async () => {
    const sessionKey = 'allNews';

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get('/news');
        const newsData = response.data.data;

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, newsData);

        return newsData;
    } catch (error) {
        console.error('Error fetching news', error);
        throw error;
    }
};

export const getNewsAll = async () => {
    const sessionKey = 'allNews';

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get('/news');
        const newsData = response.data.data;

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, newsData);

        return newsData;
    } catch (error) {
        console.error('Error fetching news', error);
        throw error;
    }
};

// Get featured news and cache the result
export const getFeaturedNews = async () => {
    const sessionKey = 'featuredNews';

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get('/news/featured');
        const featuredNews = response.data.data;

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, featuredNews);

        return featuredNews;
    } catch (error) {
        console.error('Error fetching featured news', error);
        throw error;
    }
};

// Get top views and cache the result
export const getTopViews = async () => {
    const sessionKey = 'topViews';

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get('/news/views');
        const topViews = response.data.data;

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, topViews);

        return topViews;
    } catch (error) {
        console.error('Error fetching top views', error);
        throw error;
    }
};

// Get news by ID and cache the result
export const getNewsById = async (id) => {
    const sessionKey = `news_${id}`;

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get(`/news/${id}`);
        let newsDetail = response.data.data;
        
        // Handle case when the API returns an array of news items
        if (Array.isArray(newsDetail)) {
            const foundNews = newsDetail.find(n => n.id.toString() === id.toString());
            if (foundNews) {
                newsDetail = foundNews;
            }
        }

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, newsDetail);

        return newsDetail;
    } catch (error) {
        console.error(`Error fetching news detail with id ${id}`, error);
        throw error;
    }
};

// Get news by category and cache the result
export const getNewsByCategory = async (child_nav_id, startDate = '', endDate = '', page = 1, limit = 10) => {
    const sessionKey = `news_category_${child_nav_id}_startDate_${startDate}_endDate_${endDate}_page_${page}_limit_${limit}`;

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get('/news', {
            params: {
                child_nav_id,
                startDate,
                endDate,
                page,
                limit,
            },
        });
        const newsData = response.data.data;

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, newsData);

        return newsData;
    } catch (error) {
        console.error(`Error fetching news for id=${child_nav_id}:`, error);
        throw error;
    }
};

// Create news (no sessionStorage needed for POST requests)
export const createNews = async (newsData) => {
    try {
        const response = await httpRequest.post('/news', newsData);

        sessionStorage.removeItem('allNews');
        const updatedNews = await getNews();
        saveToSessionStorage('allNews', updatedNews);

        return response.data.data;
    } catch (error) {
        console.error('Error adding news', error);
        throw error;
    }
};

// Update news and refresh sessionStorage for that news item
export const updateNews = async (id, newsData) => {
    try {
        const response = await httpRequest.post(`/news/${id}`, newsData);

        // Update sessionStorage with the new news dat
        sessionStorage.removeItem('allNews');
        sessionStorage.removeItem(`news_${id}`);
        const updatedNews = await getNews();
        saveToSessionStorage('allNews', updatedNews);
        saveToSessionStorage(`news_${id}`, response.data.data);

        return response.data.data;
    } catch (error) {
        console.error(`Error updating news with id ${id}`, error);
        throw error;
    }
};

// Delete news and remove it from sessionStorage
export const deleteNews = async (id) => {
    try {
        await httpRequest.delete(`/news/${id}`);

        // Remove the deleted news from sessionStorage
        sessionStorage.removeItem('allNews');
        sessionStorage.removeItem(`news_${id}`);
        const updatedNews = await getNews();
        saveToSessionStorage('allNews', updatedNews);
    } catch (error) {
        console.error(`Error deleting news with id ${id}`, error);
        throw error;
    }
};
