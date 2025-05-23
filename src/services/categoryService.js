import httpRequest from '~/utils/httpRequest';

let categoryNamesCache = {};

// Helper functions for sessionStorage
const saveToSessionStorage = (key, data) => {
    sessionStorage.setItem(key, JSON.stringify(data));
};

const getFromSessionStorage = (key) => {
    const storedData = sessionStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : null;
};

// Categories
export const getCategories = async () => {
    const sessionKey = 'categories';

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get('/category');
        const categoriesData = response.data.data;

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, categoriesData);

        return categoriesData;
    } catch (error) {
        console.error('Error fetching categories', error);
        throw error;
    }
};

export const getCategoryName = async (id) => {
    if (categoryNamesCache[id]) {
        return categoryNamesCache[id];
    }

    try {
        const response = await httpRequest.get(`/category/${id}`);
        const categoryName = response.data.data.name;
        categoryNamesCache[id] = categoryName;
        return categoryName;
    } catch (error) {
        console.error(`Error fetching category name for ID ${id}`, error);
        throw error;
    }
};

export const getCategoryById = async (id) => {
    const sessionKey = `category_${id}`;

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get(`/child-navs/${id}`);
        const category = response.data.data;

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, category);

        return category;
    } catch (error) {
        console.error(`Error fetching category for ID ${id}`, error);
        throw error;
    }
};

export const getCategoriesByType = async (value) => {
    const sessionKey = `categoriesByType_${value}`;

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get(`/category/type?value=${value}`);
        const categories = response.data.data;

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, categories);

        return categories;
    } catch (error) {
        console.error(`Error fetching categories for type ${value}`, error);
        throw error;
    }
};

export const getCategoriesBySlug = async (slug) => {
    const sessionKey = `categoriesBySlug_${slug}`;

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get(`/parent-navs/slug/${slug}`);
        const categories = response.data.data;

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, categories);

        return categories;
    } catch (error) {
        console.error(`Error fetching categories for slug ${slug}`, error);
        throw error;
    }
};

export const addCategory = async (categoryData) => {
    try {
        const response = await httpRequest.post('/category', categoryData);

        // Refresh sessionStorage for categories list
        const updatedCategories = await getCategories();
        saveToSessionStorage('categories', updatedCategories);

        return response.data;
    } catch (error) {
        console.error('Lỗi khi thêm danh mục:', error);
        throw error;
    }
};

export const updateCategory = async (id, categoryData) => {
    try {
        const response = await httpRequest.patch(`/category/${id}`, categoryData);

        // Refresh sessionStorage for specific category and categories list
        sessionStorage.removeItem(`category_${id}`);
        const updatedCategories = await getCategories();
        saveToSessionStorage('categories', updatedCategories);

        return response.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật danh mục:', error);
        throw error;
    }
};

export const deleteCategory = async (id) => {
    try {
        const response = await httpRequest.delete(`/category/${id}`);
        const category = response.data.data;

        // Remove the deleted category from sessionStorage and refresh categories list
        sessionStorage.removeItem(`category_${id}`);
        const updatedCategories = await getCategories();
        saveToSessionStorage('categories', updatedCategories);

        return category;
    } catch (error) {
        console.error(`Error deleting category for ID ${id}`, error);
        throw error;
    }
};
