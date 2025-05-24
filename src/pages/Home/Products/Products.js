import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import Product from '~/components/Product/Product';
import { getProducts } from '~/services/productService';
import { getCategoriesBySlug } from '~/services/categoryService';
import styles from './Products.module.scss';
import Title from '~/components/Title/Title';
import LoadingScreen from '~/components/LoadingScreen/LoadingScreen';
import PushNotification from '~/components/PushNotification/PushNotification';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import routes from '~/config/routes';

const cx = classNames.bind(styles);

function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const [productsData, categoriesData] = await Promise.all([
                    getProducts(),
                    getCategoriesBySlug('san-pham'),
                ]);

                setProducts(productsData);
                setCategories(categoriesData);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    if (error) {
        const errorMessage = error.response ? error.response.data.message : 'Network Error';
        return <PushNotification message={errorMessage} />;
    }

    if (loading) {
        return <LoadingScreen isLoading={loading} />;
    }

    // Only enable loop mode if we have enough slides
    const shouldUseLoop = products.length >= 3;

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Title text="Sản phẩm" showSeeAll={true} slug={`${routes.products}`} />
                {products.length > 0 ? (
                    <Swiper
                        spaceBetween={10}
                        slidesPerView={3}
                        breakpoints={{
                            1280: { slidesPerView: 3 },
                            1024: { slidesPerView: 2 },
                            768: { slidesPerView: 2 },
                            0: { slidesPerView: 1 },
                        }}
                        loop={shouldUseLoop}
                        modules={[Autoplay]}
                        autoplay={shouldUseLoop ? {
                            delay: 2000,
                            disableOnInteraction: false,
                        } : false}
                    >
                        {products.map((product) => {
                            return (
                                <SwiperSlide key={product.id} className={cx('slide')}>
                                    <Product
                                        image={product.images && product.images.length > 0 ? product.images[0] : ''}
                                        name={product.name}
                                        productId={product.id}
                                        category="san-pham"
                                        link={`${routes.products}/san-pham/${product.id}`}
                                    />
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                ) : (
                    <div className={cx('no-products')}>
                        <p>Không có sản phẩm nào để hiển thị.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Products;