import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import CardService from '~/components/CardService/CardService';
// import SuggestCard from '~/components/SuggestCard';
import { getServices } from '~/services/serviceService';
import styles from './Service.module.scss';
import Title from '~/components/Title/Title';
// import ButtonGroup from '~/components/ButtonGroup';
import PushNotification from '~/components/PushNotification/PushNotification';
import LoadingScreen from '~/components/LoadingScreen/LoadingScreen';
import routes from '~/config/routes';
import { getCategoriesBySlug } from '~/services/categoryService';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Helmet } from 'react-helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'antd';

const cx = classNames.bind(styles);

// Helper function to process image paths
const processImagePath = (images) => {
    // Handle array of images
    if (Array.isArray(images)) {
        return images.length > 0 ? images[0] : '';
    }
    // Handle single image string
    return images || '';
};

const Service = () => {
    const [allServices, setAllServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const servicesPerPage = 9;
    
    const fetchServices = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Fetch categories and services
            const [categoriesData, servicesData] = await Promise.all([
                getCategoriesBySlug('san-xuat'),
                getServices()
            ]);
            
            if (categoriesData && Array.isArray(categoriesData)) {
                setCategories(categoriesData);
            }
            
            if (servicesData && Array.isArray(servicesData)) {
                console.log(`Found ${servicesData.length} total services`);
                
                // Process services for display
                const processedServices = servicesData.map(service => ({
                    ...service,
                    id: service.id,
                    name: service.name || service.title,
                    title: service.title || service.name,
                    summary: service.summary,
                    createdAt: service.createdAt || service.created_at || new Date().toISOString(),
                    views: service.views || 0,
                    image: processImagePath(service.images),
                }));
                
                setAllServices(processedServices);
                setError(null);
            } else {
                setError("Không tìm thấy dịch vụ nào. Vui lòng thử lại sau.");
            }
        } catch (err) {
            console.error("Error fetching services:", err);
            setError("Lỗi khi tải dữ liệu dịch vụ. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    // Pagination
    const indexOfLastService = currentPage * servicesPerPage;
    const indexOfFirstService = indexOfLastService - servicesPerPage;
    const currentServices = allServices.slice(indexOfFirstService, indexOfLastService);
    const totalPages = Math.ceil(allServices.length / servicesPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (error) {
        const errorMessage = error.response ? error.response.data.message : 'Network Error';
        return <PushNotification message={errorMessage} />;
    }

    if (loading) {
        return <LoadingScreen isLoading={loading} />;
    }

    return (
        <article className={cx('wrapper')}>
            <Helmet>
                <title> Sản Xuất Liên Nhật | Thôn Trang Liên Nhật</title>
                <meta
                    name="description"
                    content="Khám phá các dịch vụ du lịch đặc sắc tại Thôn Trang Liên Nhật - từ tour tham quan đến các hoạt động trải nghiệm"
                />
            </Helmet>
            
            {error ? (
                <div className={cx('error-container')}>
                    <div className={cx('error-message')}>
                        <h3>Thông báo</h3>
                        <p>{error}</p>
                        <Button 
                            className={cx('retry-button')}
                            onClick={fetchServices}
                            icon={<FontAwesomeIcon icon={faSyncAlt} />}
                        >
                            Thử lại
                        </Button>
                    </div>
                </div>
            ) : (
                <div className={cx('services-section')}>
                    <div className={cx('services-header')}>
                        <h2 className={cx('services-title')}>Sản Xuất Liên Nhật</h2>
                    </div>
                    
                    <div className={cx('services-grid')}>
                        {currentServices.map((service, index) => (
                            <Link 
                                key={index} 
                                to={`${routes.services}/san-xuat/${service.id}`}
                                className={cx('service-item')}
                            >
                                <CardService
                                    title={service.title}
                                    summary={service.summary}
                                    image={service.image}
                                    createdAt={service.createdAt}
                                    views={service.views}
                                />
                            </Link>
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

export default Service;
