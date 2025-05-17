import React, { useState, useEffect, useCallback } from 'react';
import classNames from 'classnames/bind';
import { getFeaturedExperiences } from '~/services/experienceService';
import { getCategoriesBySlug } from '~/services/categoryService';
import CardExperience from '~/components/CardService/CardService';
import Title from '~/components/Title/Title';
import LoadingScreen from '~/components/LoadingScreen/LoadingScreen';
import { Link, useNavigate } from 'react-router-dom';
import routes from '~/config/routes';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import styles from './Experiences.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { getImageUrl } from '~/utils/imageUtils';
import { Button } from 'antd';

const cx = classNames.bind(styles);

function Experiences() {
    const navigate = useNavigate();
    const [experiences, setExperiences] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchExperiences = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Always fetch newest data
            const timestamp = new Date().getTime();
            
            // Force browser to clear cache
            if (window.caches && window.caches.delete) {
                try {
                    await window.caches.delete('experiences-cache');
                    console.log('Deleted cache storage for experiences');
                } catch (cacheError) {
                    console.warn('Failed to delete cache storage:', cacheError);
                }
            }
            
            // Clear sessionStorage manually
            sessionStorage.removeItem('allExperiences');
            for (let i = 1; i <= 50; i++) {
                sessionStorage.removeItem(`experience_${i}`);
            }
            
            // Try to get featured experiences using service with forceRefresh=true
            try {
                const data = await getFeaturedExperiences(6); // Limit to 6 items for homepage
                console.log('Fetched featured experiences:', data);
                
                if (data && data.length > 0) {
                    const processedExperiences = data.map(exp => {
                        return {
                            ...exp,
                            id: exp.id,
                            title: exp.title || exp.name,
                            name: exp.name || exp.title,
                            directImageUrl: getImageUrl(exp.images),
                            categoryId: exp.categoryId || exp.child_nav_id || 10
                        };
                    });
                    
                    setExperiences(processedExperiences);
                } else {
                    // Fallback to database.json if service returns empty
                    throw new Error('No experiences returned from service');
                }
            } catch (apiError) {
                console.error('Error fetching experiences from API, trying database.json:', apiError);
                
                // Fallback to database.json with cache buster
                const response = await fetch(`/thontrangliennhat-api/database.json?_=${timestamp}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch database.json: ${response.status}`);
                }
                
                const database = await response.json();
                
                if (database.experiences && database.experiences.length > 0) {
                    // Sort by newest and take the first 6
                    const featuredExperiences = database.experiences
                        .sort((a, b) => {
                            const dateA = new Date(a.createdAt || a.created_at || 0);
                            const dateB = new Date(b.createdAt || b.created_at || 0);
                            return dateB - dateA;
                        })
                        .slice(0, 6);
                        
                    const processedExperiences = featuredExperiences.map(exp => {
                        return {
                            ...exp,
                            id: exp.id,
                            title: exp.title || exp.name,
                            name: exp.name || exp.title,
                            directImageUrl: getImageUrl(exp.images),
                            categoryId: exp.categoryId || exp.child_nav_id || 10
                        };
                    });
                    
                    setExperiences(processedExperiences);
                } else {
                    console.warn('No experiences found in database.json');
                    setExperiences([]);
                }
            }
            
            // Also fetch categories with fresh data
            try {
                const categoriesData = await getCategoriesBySlug('trai-nghiem');
                setCategories(categoriesData || []);
            } catch (catError) {
                console.error('Error fetching categories:', catError);
            }
        } catch (err) {
            console.error('Error in fetchExperiences:', err);
            setError(err);
            setExperiences([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchExperiences();
    }, [fetchExperiences]);

    // Set fixed slides per view to 3 for default display
    const slidesPerView = 3;
    const useLoopMode = experiences.length >= (slidesPerView * 2);

    const handleRetry = () => {
        console.log('Retrying to load experiences...');
        fetchExperiences();
    };

    const handleViewAllExperiences = () => {
        console.log('Navigating to experiences page:', routes.experiences);
        navigate(routes.experiences);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Title 
                    text="KHU VỰC TRẢI NGHIỆM" 
                    showSeeAll={true} 
                    slug={routes.experiences}
                    onClick={handleViewAllExperiences}
                />
                <div className={cx('experience-slider-container')}>
                    {loading ? (
                        <LoadingScreen isLoading={loading} />
                    ) : error ? (
                        <div className={cx('error-container')}>
                            <div className={cx('error-message')}>
                                <p>Không thể tải dữ liệu trải nghiệm. Vui lòng thử lại.</p>
                                <Button 
                                    onClick={handleRetry} 
                                    className={cx('retry-button')}
                                    icon={<FontAwesomeIcon icon={faSyncAlt} />}
                                >
                                    Thử lại
                                </Button>
                            </div>
                        </div>
                    ) : experiences.length === 0 ? (
                        <div className={cx('error-container')}>
                            <div className={cx('empty-message')}>
                                <p>Khu vực trải nghiệm đang được cập nhật. Vui lòng quay lại sau.</p>
                                <Button 
                                    onClick={handleRetry} 
                                    className={cx('retry-button')}
                                    icon={<FontAwesomeIcon icon={faSyncAlt} />}
                                >
                                    Thử lại
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Swiper
                                spaceBetween={20}
                                slidesPerView={3}
                                breakpoints={{
                                    1280: { slidesPerView: 3 },
                                    1024: { slidesPerView: 3 },
                                    768: { slidesPerView: 2 },
                                    0: { slidesPerView: 1 },
                                }}
                                loop={useLoopMode}
                                modules={[Autoplay, Navigation, Pagination]}
                                autoplay={{
                                    delay: 5000, // 5 seconds between transitions
                                    disableOnInteraction: false,
                                }}
                                navigation={{
                                    nextEl: `.${cx('swiper-button-next')}`,
                                    prevEl: `.${cx('swiper-button-prev')}`,
                                }}
                                pagination={{ 
                                    clickable: true,
                                    dynamicBullets: true
                                }}
                                className={cx('swiper')}
                            >
                                {experiences.map((experience, index) => (
                                    <SwiperSlide key={index} className={cx('slide')}>
                                        <Link to={`/trai-nghiem/trai-nghiem/${experience.id}`} style={{ height: '100%', display: 'block', width: '100%' }}>
                                            <CardExperience
                                                title={experience.title || experience.name}
                                                summary={experience.summary}
                                                image={experience.directImageUrl}
                                                createdAt={experience.created_at || experience.createdAt}
                                            />
                                        </Link>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            {experiences.length > 1 && (
                                <>
                                    <div className={cx('swiper-button-prev')}>
                                        <FontAwesomeIcon icon={faChevronLeft} className={cx('swiper-icon')} />
                                    </div>
                                    <div className={cx('swiper-button-next')}>
                                        <FontAwesomeIcon icon={faChevronRight} className={cx('swiper-icon')} />
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Experiences;