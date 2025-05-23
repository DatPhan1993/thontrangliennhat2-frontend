import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import Card from '~/components/CardContent/CardContent';
import { getNews } from '~/services/newsService';
import styles from './News.module.scss';
import PushNotification from '~/components/PushNotification/PushNotification';
import LoadingScreen from '~/components/LoadingScreen/LoadingScreen';
import routes from '~/config/routes';
import { getCategoriesBySlug } from '~/services/categoryService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { Helmet } from 'react-helmet';
import dayjs from 'dayjs';
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

const News = () => {
    const [allNews, setAllNews] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const newsPerPage = 9;
    
    const fetchNews = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Fetch categories and news
            const [categoriesData, newsData] = await Promise.all([
                getCategoriesBySlug('tin-tuc'),
                getNews()
            ]);
            
            if (categoriesData && Array.isArray(categoriesData)) {
                setCategories(categoriesData);
            }
            
            if (newsData && Array.isArray(newsData)) {
                console.log(`Found ${newsData.length} total news items`);
                
                // Process news for display
                const processedNews = newsData.map(news => ({
                    ...news,
                    id: news.id,
                    title: news.title,
                    summary: news.summary,
                    createdAt: news.createdAt || news.created_at || new Date().toISOString(),
                    views: news.views || 0,
                    image: processImagePath(news.images),
                    isNew: dayjs().diff(dayjs(news.createdAt || news.created_at), 'day') <= 3,
                }));
                
                setAllNews(processedNews);
                setError(null);
            } else {
                setError("Không tìm thấy tin tức nào. Vui lòng thử lại sau.");
            }
        } catch (err) {
            console.error("Error fetching news:", err);
            setError("Lỗi khi tải dữ liệu tin tức. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    // Pagination
    const indexOfLastNews = currentPage * newsPerPage;
    const indexOfFirstNews = indexOfLastNews - newsPerPage;
    const currentNews = allNews.slice(indexOfFirstNews, indexOfLastNews);
    const totalPages = Math.ceil(allNews.length / newsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
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
                <title>Tin Tức | Thôn Trang Liên Nhật</title>
                <meta
                    name="description"
                    content="Cập nhật những tin tức mới nhất từ Thôn Trang Liên Nhật - Sự kiện, hoạt động và thông tin hữu ích"
                />
            </Helmet>
            
            {error ? (
                <div className={cx('error-container')}>
                    <div className={cx('error-message')}>
                        <h3>Thông báo</h3>
                        <p>{error}</p>
                        <Button 
                            className={cx('retry-button')}
                            onClick={fetchNews}
                            icon={<FontAwesomeIcon icon={faSyncAlt} />}
                        >
                            Thử lại
                        </Button>
                    </div>
                </div>
            ) : (
                <div className={cx('news-section')}>
                    <div className={cx('news-header')}>
                        <h2 className={cx('news-title')}>Tin Tức</h2>
                    </div>
                    
                    <div className={cx('news-grid')}>
                        {currentNews.map((newsItem, index) => (
                            <Link 
                                key={index} 
                                to={`${routes.news}/tin-tuc-id/${newsItem.id}`}
                                className={cx('news-item')}
                            >
                                <Card
                                    title={newsItem.title}
                                    summary={newsItem.summary}
                                    image={newsItem.image}
                                    createdAt={newsItem.createdAt}
                                    views={newsItem.views}
                                    isNew={newsItem.isNew}
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

export default News;
