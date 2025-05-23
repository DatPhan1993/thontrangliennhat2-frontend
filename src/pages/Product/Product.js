import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { getProductsByCategory, getProducts } from '~/services/productService';
import styles from './Product.module.scss';
import Title from '~/components/Title/Title';
import PushNotification from '~/components/PushNotification/PushNotification';
import LoadingScreen from '~/components/LoadingScreen/LoadingScreen';
import routes from '~/config/routes';
import { getCategoriesBySlug } from '~/services/categoryService';
import ProductCard from '~/components/Product/Product';
import { Helmet } from 'react-helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'antd';

const cx = classNames.bind(styles);

const Products = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 9;

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            
            try {
                // Fetch categories and products
                const [categoriesData, productsData] = await Promise.all([
                    getCategoriesBySlug('san-pham'),
                    getProducts()
                ]);
                
                if (categoriesData && Array.isArray(categoriesData)) {
                setCategories(categoriesData);
                }
                
                if (productsData && Array.isArray(productsData)) {
                    // Process products for display
                    const processedProducts = productsData.map(product => ({
                        ...product,
                        id: product.id,
                        name: product.name || product.title,
                        title: product.title || product.name,
                        summary: product.summary,
                        createdAt: product.createdAt || product.created_at || new Date().toISOString(),
                        views: product.views || 0,
                        image: Array.isArray(product.images) && product.images.length > 0 ? 
                               product.images[0] : product.image || '',
                        }));
                    
                    setAllProducts(processedProducts);
                    setError(null);
                } else {
                    setError("Không tìm thấy sản phẩm nào. Vui lòng thử lại sau.");
                }
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Lỗi khi tải dữ liệu sản phẩm. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Pagination
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = allProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(allProducts.length / productsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const getCategorySlug = (categoryId) => {
        const category = categories.find((cat) => cat.id === categoryId);
        return category ? category.slug : 'san-pham';
    };

    if (error) {
        const errorMessage = error.response ? error.response.data.message : error.message || 'Network Error';
        return <PushNotification message={errorMessage} />;
    }

    if (loading) {
        return <LoadingScreen isLoading={loading} />;
    }

    return (
        <article className={cx('wrapper')}>
            <Helmet>
                <title>Sản Phẩm | HTX Nông Nghiệp - Du Lịch Phú Nông Buôn Đôn</title>
                <meta
                    name="description"
                    content="HTX Nông Nghiệp - Du Lịch Phú Nông Buôn Đôn hoạt động đa ngành nghề, trong đó tiêu biểu có thể kể đến là nuôi cá lồng, cải tạo nâng cấp vườn cây quanh các hồ thủy điện, phát triển về du lịch sinh thái, du lịch nông nghiệp. Ngoài ra còn thực hiện sản xuất các loại thực phẩm như chả cá, trái cây thực phẩm sấy khô và sấy dẻo, các loại tinh dầu tự nhiên,…"
                />
                <meta
                    name="keywords"
                    content="dịch vụ nông nghiệp du lịch, hợp tác xã, sản phẩm nông nghiệp, phunongbuondon"
                />
                <meta name="author" content="HTX Nông Nghiệp - Du Lịch Phú Nông Buôn" />
            </Helmet>
            
            {error ? (
                <div className={cx('error-container')}>
                    <div className={cx('error-message')}>
                        <h3>Thông báo</h3>
                        <p>{error}</p>
                        <Button 
                            className={cx('retry-button')}
                            onClick={() => window.location.reload()}
                            icon={<FontAwesomeIcon icon={faSyncAlt} />}
                        >
                            Thử lại
                        </Button>
                    </div>
                </div>
            ) : (
            <div className={cx('products-section')}>
                    <div className={cx('products-header')}>
                    <h2 className={cx('products-title')}>Sản Phẩm</h2>
                    </div>
                    
                    <div className={cx('products-grid')}>
                        {currentProducts.map((product, index) => (
                            <div key={index} className={cx('product-item')}>
                                <ProductCard
                                    name={product.name}
                                    image={product.image}
                                    price={product.price}
                                    views={product.views}
                                    productId={product.id}
                                    category="san-pham"
                                    link={`${routes.products}/san-pham/${product.id}`}
                                />
                            </div>
                        ))}
                    </div>
                    
                    {totalPages > 1 && (
                        <div className={cx('pagination')}>
                            <div 
                                className={cx('pagination-button')} 
                                onClick={() => handlePageChange(currentPage - 1)}
                            >
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </div>
                            
                            {Array.from({ length: totalPages }, (_, index) => (
                                <div
                                    key={index}
                                    className={cx('pagination-button', { active: currentPage === index + 1 })}
                                    onClick={() => handlePageChange(index + 1)}
                                >
                                    {index + 1}
                                </div>
                            ))}
                            
                            <div 
                                className={cx('pagination-button')} 
                                onClick={() => handlePageChange(currentPage + 1)}
                            >
                                <FontAwesomeIcon icon={faChevronRight} />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </article>
    );
};

export default Products;
