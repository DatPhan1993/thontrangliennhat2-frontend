import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ServiceDetail.module.scss';
import LoadingScreen from '~/components/LoadingScreen/LoadingScreen';
import PushNotification from '~/components/PushNotification/PushNotification';
import DateTime from '~/components/DateTime/DateTime';
import Title from '~/components/Title/Title';
import { getServiceById } from '~/services/serviceService';
import { normalizeImageUrl } from '~/utils/imageUtils';
import { Helmet } from 'react-helmet';
import DOMPurify from 'dompurify';

const cx = classNames.bind(styles);

const ServiceDetail = () => {
    const { id } = useParams();
    const [serviceDetail, setServiceDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to ensure content has proper HTML formatting for line breaks
    const formatContent = (content) => {
        if (!content) return '';
        
        // If content already has HTML formatting, sanitize and return
        if (content.includes('<p>') || content.includes('<br') || content.includes('<div')) {
            return DOMPurify.sanitize(content);
        }
        
        // Otherwise, convert line breaks to <br> tags and wrap in paragraphs
        return DOMPurify.sanitize(
            content
                .split('\n\n')
                .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
                .join('')
        );
    };

    // Get the correct image URL with normalization
    const getServiceImageUrl = (service) => {
        if (!service) return '';
        
        let imageUrl = '';
        if (service.images && service.images.length > 0) {
            imageUrl = Array.isArray(service.images) ? service.images[0] : service.images;
        } else if (service.image) {
            imageUrl = service.image;
        }
        
        return normalizeImageUrl(imageUrl);
    };

    useEffect(() => {
        const fetchServiceDetail = async () => {
            try {
                const response = await getServiceById(id);
                // Handle the case when the API returns an array instead of a single service
                if (Array.isArray(response)) {
                    const service = response.find(item => item.id.toString() === id.toString());
                    if (service) {
                        setServiceDetail(service);
                    } else {
                        throw new Error('Service not found');
                    }
                } else {
                    setServiceDetail(response);
                }
            } catch (error) {
                setError(error);
                console.error('Error fetching service detail:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchServiceDetail();
    }, [id]);

    if (error) {
        const errorMessage = error.response ? error.response.data.message : error.message || 'Network Error';
        return <PushNotification message={errorMessage} />;
    }

    if (loading || !serviceDetail) {
        return <LoadingScreen isLoading={loading} />;
    }

    // Format the content to ensure proper line breaks
    const formattedContent = formatContent(serviceDetail.content);
    
    // Get normalized image URL
    const serviceImageUrl = getServiceImageUrl(serviceDetail);

    return (
        <article className={cx('wrapper')}>
            <Helmet>
                <title>{`${serviceDetail.title || serviceDetail.name} | HTX Nông Nghiệp - Du Lịch Phú Nông Buôn Đôn`}</title>
                <meta name="description" content={serviceDetail.summary || ''} />
                <meta name="keywords" content={`dịch vụ du lịch, ${serviceDetail.title || serviceDetail.name}, phunongbuondon`} />
                <meta name="author" content="HTX Nông Nghiệp - Du Lịch Phú Nông Buôn" />
            </Helmet>
            <div className={cx('header')}>
                <Title text={`${serviceDetail.name || serviceDetail.title || 'Chi tiết dịch vụ'}`} className={cx('title')} />
            </div>
            
            {serviceImageUrl && (
                <div className={cx('service-image')}>
                    <img 
                        src={serviceImageUrl}
                        alt={serviceDetail.name || serviceDetail.title}
                        onError={(e) => {
                            console.log('[ServiceDetail] Image failed to load:', e.target.src);
                            e.target.style.display = 'none';
                        }}
                    />
                </div>
            )}
            
            {serviceDetail.summary && (
                <div className={cx('service-summary')}>
                    {serviceDetail.summary}
                </div>
            )}
            
            <div 
                className={cx('content')} 
                dangerouslySetInnerHTML={{ __html: formattedContent }} 
            />
            <DateTime 
                timestamp={serviceDetail.created_at || serviceDetail.createdAt || new Date().toISOString()} 
                showDate={true} 
                showTime={true} 
                showViews={false} 
            />
        </article>
    );
};

export default ServiceDetail;
