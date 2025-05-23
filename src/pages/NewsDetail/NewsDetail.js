import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './NewsDetail.module.scss';
import LoadingScreen from '~/components/LoadingScreen/LoadingScreen';
import PushNotification from '~/components/PushNotification/PushNotification';
import DateTime from '~/components/DateTime/DateTime';
import Title from '~/components/Title/Title';
import { getNewsById } from '~/services/newsService';
import { Helmet } from 'react-helmet';

const cx = classNames.bind(styles);

const NewsDetail = () => {
    const { id } = useParams();
    const [newsDetail, setNewsDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNewsDetail = async (id) => {
        try {
            setLoading(true);
            const response = await getNewsById(id);
            
            // Handle case when API returns an array
            if (Array.isArray(response)) {
                const news = response.find(item => item.id.toString() === id.toString());
                if (news) {
                    setNewsDetail(news);
                } else {
                    throw new Error('News not found');
                }
            } else {
                setNewsDetail(response);
            }
            
            setError(null);
        } catch (error) {
            setError(error);
            console.error('Error fetching news detail:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchNewsDetail(id);
        } else {
            setError(new Error('Invalid news ID'));
        }
    }, [id]);

    if (error) {
        const errorMessage = error.response ? error.response.data.message : error.message || 'Network Error';
        return <PushNotification message={errorMessage} />;
    }

    if (loading || !newsDetail) {
        return <LoadingScreen isLoading={loading} />;
    }

    // Make sure the title is a string
    const newsTitle = newsDetail.title || newsDetail.name || 'Chi tiết tin tức';

    return (
        <article className={cx('wrapper')}>
            <Helmet>
                <title>{`${newsTitle} | HTX Nông Nghiệp - Du Lịch Phú Nông Buôn Đôn`}</title>
                <meta name="description" content={newsDetail.summary || ''} />
                <meta name="keywords" content={`tin tức, phunongbuondon, ${newsTitle}`} />
                <meta name="author" content="HTX Nông Nghiệp - Du Lịch Phú Nông Buôn" />
            </Helmet>
            <div className={cx('header')}>
                <Title text={newsTitle} className={cx('title')} />
            </div>
            
            {newsDetail.images && newsDetail.images.length > 0 && (
                <div className={cx('news-image')}>
                    <img 
                        src={Array.isArray(newsDetail.images) ? newsDetail.images[0] : newsDetail.images} 
                        alt={newsTitle} 
                    />
                </div>
            )}
            
            {newsDetail.summary && (
                <div className={cx('news-summary')}>
                    {newsDetail.summary}
                </div>
            )}
            
            <div className={cx('content')} dangerouslySetInnerHTML={{ __html: newsDetail.content || '' }} />
            <DateTime
                timestamp={newsDetail.created_at || newsDetail.createdAt || new Date().toISOString()}
                views={newsDetail.views || 0}
                showDate={true}
                showTime={true}
                showViews={true}
            />
        </article>
    );
};

export default NewsDetail;
