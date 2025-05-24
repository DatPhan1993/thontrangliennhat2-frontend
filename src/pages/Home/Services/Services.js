import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { getServices } from '~/services/serviceService';
import { getCategoriesBySlug } from '~/services/categoryService';
import CardService from '~/components/CardService/CardService';
import Title from '~/components/Title/Title';
import PushNotification from '~/components/PushNotification/PushNotification';
import LoadingScreen from '~/components/LoadingScreen/LoadingScreen';
import { Link } from 'react-router-dom';
import routes from '~/config/routes';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import styles from './Services.module.scss';

const cx = classNames.bind(styles);

function Services() {
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadServices = async () => {
            try {
                const [servicesData, categoriesData] = await Promise.all([
                    getServices(),
                    getCategoriesBySlug('san-xuat'),
                ]);
                setServices(servicesData);
                setCategories(categoriesData);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        loadServices();
    }, []);

    if (error) {
        const errorMessage = error.response ? error.response.data.message : 'Network Error';
        return <PushNotification message={errorMessage} />;
    }

    if (loading) {
        return <LoadingScreen isLoading={loading} />;
    }

    // Only enable loop mode if we have enough slides
    const shouldUseLoop = services.length >= 3;

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Title text="Sản Xuất Liên Nhật" showSeeAll={true} slug={`${routes.services}`} />
                {services.length > 0 ? (
                    <Swiper
                        spaceBetween={10}
                        slidesPerView={3}
                        breakpoints={{
                            1280: { slidesPerView: 3 },
                            1024: { slidesPerView: 3 },
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
                        {services.map((service, index) => (
                            <SwiperSlide key={service.id || index} className={cx('slide')}>
                                <Link to={`${routes.services}/san-xuat/${service.id}`}>
                                    <CardService
                                        title={service.name}
                                        summary={service.summary}
                                        image={Array.isArray(service.images) && service.images.length > 0 ? service.images[0] : service.images}
                                        createdAt={service.created_at}
                                    />
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <div className={cx('no-services')}>
                        <p>Không có dịch vụ nào để hiển thị.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Services;