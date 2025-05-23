import httpRequest from '~/utils/httpRequest';

// Helper functions for sessionStorage
const saveToSessionStorage = (key, data) => {
    sessionStorage.setItem(key, JSON.stringify(data));
};

const getFromSessionStorage = (key) => {
    const storedData = sessionStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : null;
};

// Get all products and cache them in sessionStorage
export const getProducts = async () => {
    const sessionKey = 'allProducts';

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get('/products');
        const products = response.data.data;

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, products);

        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

// Get products with pagination and cache them in sessionStorage
export const getProductsPagination = async ($page = 1, $limit = 8) => {
    const sessionKey = `products_page_${$page}_limit_${$limit}`;

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get(`/products?page=${$page}&limit=${$limit}`);
        const products = response.data.data;

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, products);

        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

// Get product by ID and cache the result
export const getProductById = async (id) => {
    const sessionKey = `product_${id}`;

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get(`/products/${id}`);
        let product = response.data.data;
        
        // Handle case when the API returns an array of products
        if (Array.isArray(product)) {
            const foundProduct = product.find(p => p.id.toString() === id.toString());
            if (foundProduct) {
                product = foundProduct;
            }
        }

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, product);

        return product;
    } catch (error) {
        console.error(`Error fetching product detail with id ${id}:`, error);
        throw error;
    }
};

// Get products by category and cache them
export const getProductsByCategory = async (categoryId) => {
    const sessionKey = `products_category_${categoryId}`;

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get(`/products?child_nav_id=${categoryId}`);
        const products = response.data.data;

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, products);

        return products;
    } catch (error) {
        console.error(`Error fetching products for child nav id=${categoryId}:`, error);
        throw error;
    }
};

// Get product by slug and cache it
export const getProductBySlug = async (slug) => {
    const sessionKey = `product_slug_${slug}`;

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get(`/products/slug/${slug}`);
        const product = response.data.data;

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, product);

        return product;
    } catch (error) {
        console.error(`Error fetching products with slug ${slug}:`, error);
        throw error;
    }
};

// Create a product (no sessionStorage needed for POST requests)
export const createProduct = async (productData) => {
    try {
        const response = await httpRequest.post('/products', productData);

        sessionStorage.removeItem('allProducts');

        return response.data.data;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};

// Update a product and refresh sessionStorage for that product
export const updateProduct = async (id, productData) => {
    try {
        const response = await httpRequest.post(`/products/${id}`, productData);

        sessionStorage.removeItem('allProducts');
        sessionStorage.removeItem(`product_${id}`);

        const updateProduct = await getProducts();
        // Update sessionStorage with the new product data
        saveToSessionStorage('allProducts', updateProduct);
        saveToSessionStorage(`product_${id}`, response.data.data);

        return response.data.data;
    } catch (error) {
        console.error(`Error updating product with id ${id}:`, error);
        throw error;
    }
};

// Delete a product and remove it from sessionStorage
export const deleteProduct = async (id) => {
    try {
        const response = await httpRequest.delete(`/products/${id}`);

        // Remove the deleted product from sessionStorage
        sessionStorage.removeItem(`product_${id}`);
        sessionStorage.removeItem('allProducts');

        const updateProduct = await getProducts();
        saveToSessionStorage('allProducts', updateProduct);

        return response.data.data;
    } catch (error) {
        console.error(`Error deleting product with id ${id}:`, error);
        throw error;
    }
};
