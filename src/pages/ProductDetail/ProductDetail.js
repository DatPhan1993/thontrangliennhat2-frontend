import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ProductDetail.module.scss';
import LoadingScreen from '~/components/LoadingScreen/LoadingScreen';
import PushNotification from '~/components/PushNotification/PushNotification';
import Title from '~/components/Title/Title';
import { getProductById } from '~/services/productService';
import { Helmet } from 'react-helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronDown,
    faChevronLeft,
    faChevronRight,
    faChevronUp,
    faCircleDot,
    faPhone,
} from '@fortawesome/free-solid-svg-icons';
import Button from '~/components/Button/Button';

const cx = classNames.bind(styles);

const ProductDetail = () => {
    const { id } = useParams();
    const [productDetail, setProductDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                const response = await getProductById(id);
                // Handle the case when the API returns an array instead of a single product
                if (Array.isArray(response)) {
                    const product = response.find(item => item.id.toString() === id.toString());
                    if (product) {
                        setProductDetail(product);
                    } else {
                        throw new Error('Product not found');
                    }
                } else {
                    setProductDetail(response);
                }
                console.log('Product detail:', productDetail);
            } catch (error) {
                setError(error);
                console.error('Error fetching product detail:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetail();
    }, [id]);

    const handleThumbnailClick = (index) => {
        setCurrentImageIndex(index);
    };

    const handlePrevClick = () => {
        if (productDetail && productDetail.images && productDetail.images.length > 0) {
        setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? productDetail.images.length - 1 : prevIndex - 1));
        }
    };

    const handleNextClick = () => {
        if (productDetail && productDetail.images && productDetail.images.length > 0) {
        setCurrentImageIndex((prevIndex) => (prevIndex === productDetail.images.length - 1 ? 0 : prevIndex + 1));
        }
    };

    const handleThumbnailPrevClick = () => {
        setThumbnailStartIndex((prevIndex) => Math.max(0, prevIndex - 1));
    };

    const handleThumbnailNextClick = () => {
        if (productDetail && productDetail.images && productDetail.images.length > 0) {
        const totalImages = productDetail.images.length;
            const remainingImages = totalImages - (thumbnailStartIndex + 4);
        if (remainingImages > 0) {
            setThumbnailStartIndex((prevIndex) => prevIndex + 1);
            }
        }
    };

    if (error) {
        const errorMessage = error.response ? error.response.data.message : error.message || 'Network Error';
        return <PushNotification message={errorMessage} />;
    }

    if (loading || !productDetail) {
        return <LoadingScreen isLoading={loading} />;
    }

    // Ensure images is an array
    const productImages = Array.isArray(productDetail.images) ? productDetail.images : 
                         (productDetail.images ? [productDetail.images] : []);
    
    // Parse features if it's a string
    let features = [];
    try {
        features = productDetail.features ? 
                  (typeof productDetail.features === 'string' ? 
                   JSON.parse(productDetail.features) : productDetail.features) : [];
    } catch (e) {
        console.error('Error parsing features:', e);
        features = [];
    }

    return (
        <article className={cx('wrapper')}>
            <Helmet>
                <title>{productDetail.name} | HTX Nông Nghiệp - Du Lịch Phú Nông Buôn Đôn</title>
                <meta name="description" content={`Chi tiết về sản phẩm: ${productDetail.name}.`} />
                <meta name="keywords" content={`sản phẩm, ${productDetail.name}, phunongbuondon`} />
            </Helmet>

            <div className={cx('product-section')}>
                <div className={cx('thumbnails')}>
                    {thumbnailStartIndex > 0 && (
                        <button
                            className={cx('thumbnail-button', 'thumbnail-prev-button')}
                            onClick={handleThumbnailPrevClick}
                        >
                            <FontAwesomeIcon icon={faChevronUp} />
                        </button>
                    )}
                    <div
                        className={cx('thumbnail-list')}
                        style={{ transform: `translateY(-${thumbnailStartIndex * 155}px)` }}
                    >
                        {productImages.length > 0 && productImages
                            .slice(thumbnailStartIndex, thumbnailStartIndex + 4)
                            .map((image, index) => (
                                <div key={thumbnailStartIndex + index} className={cx('thumbnail-item')}>
                                    <img
                                        className={cx('thumbnail-image')}
                                        src={image.replace(/\\/g, '')}
                                        alt={`${productDetail.name} thumbnail ${thumbnailStartIndex + index + 1}`}
                                        onClick={() => handleThumbnailClick(thumbnailStartIndex + index)}
                                    />
                                </div>
                            ))}
                    </div>
                    {productImages.length > 0 && thumbnailStartIndex + 4 < productImages.length && (
                        <button
                            className={cx('thumbnail-button', 'thumbnail-next-button')}
                            onClick={handleThumbnailNextClick}
                        >
                            <FontAwesomeIcon icon={faChevronDown} />
                        </button>
                    )}
                </div>

                <div className={cx('product-image')}>
                    <button className={cx('prev-button')} onClick={handlePrevClick}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    <div
                        className={cx('main-image-wrapper')}
                        style={{ transform: `translateX(-${currentImageIndex * 600}px)` }}
                    >
                        {productImages.length > 0 && productImages.map((image, index) => (
                            <img
                                key={index}
                                className={cx('main-image')}
                                src={image.replace(/\\/g, '')}
                                alt={`${productDetail.name} main ${index + 1}`}
                            />
                        ))}
                    </div>
                    <button className={cx('next-button')} onClick={handleNextClick}>
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </div>
                <div className={cx('product-details')}>
                    <h2 className={cx('product-name')}>{productDetail.name}</h2>
                    <ul className={cx('detail-function')}>
                        {/* <h4 className={cx('title-function')}>Thông tin tổng quan:</h4> */}
                        {features.map((feature, index) => (
                            <li key={index} className={cx('txt-function')}>
                                <FontAwesomeIcon className={cx('icon-function')} icon={faCircleDot} /> {feature}
                            </li>
                        ))}
                    </ul>
                    <Button className={cx('contact-button')} primary>
                        <FontAwesomeIcon icon={faPhone} className={cx('icon')} />
                        <a href={`tel:${productDetail.phone_number}`}>Liên hệ ngay ({productDetail.phone_number})</a>
                    </Button>
                </div>
            </div>

            <div className={cx('info-section')}>
                <Title text="Chi tiết sản phẩm" />
                <div className={cx('info-content')} dangerouslySetInnerHTML={{ __html: productDetail.content || '' }} />
            </div>
        </article>
    );
};

export default ProductDetail;
