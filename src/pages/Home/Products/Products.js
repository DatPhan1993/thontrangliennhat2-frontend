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
        const fetchProductsAndCategories = async () => {
            try {
                const [categoriesData, productsData] = await Promise.all([
                    getCategoriesBySlug('san-pham'),
                    getProducts(),
                ]);

                setCategories(categoriesData);
                setProducts(productsData);
            } catch (err) {
                setError(err);
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProductsAndCategories();
    }, []);

    if (error) {
        return <PushNotification message={error.message} />;
    }

    if (loading) {
        return <LoadingScreen isLoading={loading} />;
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Title text="Sản phẩm" showSeeAll={true} slug={`${routes.products}`} />
                <Swiper
                    spaceBetween={10}
                    slidesPerView={3}
                    breakpoints={{
                        1280: { slidesPerView: 3 },
                        1024: { slidesPerView: 2 },
                        768: { slidesPerView: 2 },
                        0: { slidesPerView: 1 },
                    }}
                    loop={true}
                    modules={[Autoplay]}
                    autoplay={{
                        delay: 2000,
                        disableOnInteraction: false,
                    }}
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
            </div>
        </div>
    );
}

export default Products;