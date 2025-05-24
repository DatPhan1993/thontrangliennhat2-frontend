import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Product.module.scss';
import { Link } from 'react-router-dom';
import Button from '~/components/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faImage } from '@fortawesome/free-solid-svg-icons';
import { normalizeImageUrl, DEFAULT_IMAGE } from '~/utils/imageUtils';
import routes from '~/config/routes';

const cx = classNames.bind(styles);

function Product({ image, name, link, productId, category }) {
    const [imageError, setImageError] = useState(false);
    
    // Ensure we have a valid link
    const productLink = link || `${routes.products}/san-pham/${productId}`;
    
    // Process image URL using the standardized function
    const processedImageUrl = useMemo(() => {
        if (!image) {
            console.log(`[Product] No image provided for "${name}"`);
            return DEFAULT_IMAGE;
            }
            
        // Handle array of images - use first one
            if (Array.isArray(image) && image.length > 0) {
                const firstImage = image[0];
            const url = normalizeImageUrl(firstImage);
            console.log(`[Product] Processed image array for "${name}":`, firstImage, '->', url);
            return url;
        }
        
        // Handle single image string
        if (typeof image === 'string') {
            const url = normalizeImageUrl(image);
            console.log(`[Product] Processed image string for "${name}":`, image, '->', url);
            return url;
                }
        
        console.log(`[Product] Invalid image format for "${name}":`, typeof image, image);
        return DEFAULT_IMAGE;
    }, [image, name]);
    
    // Error handler for image load failures
    const handleImageError = (e) => {
        console.error(`[Product] Image failed to load for "${name}":`, processedImageUrl);
        e.target.onerror = null; // Prevent infinite loop
        setImageError(true);
    };

    return (
            <div className={cx('product-item')}>
            <div className={cx('product-image-container')}>
                {imageError ? (
                    <div className={cx('product-image-error')}>
                        <FontAwesomeIcon icon={faImage} className={cx('error-icon')} />
                        <span>Ảnh không hiển thị</span>
                    </div>
                ) : (
                    <img 
                        className={cx('product-item-image')} 
                        src={processedImageUrl}
                        alt={name} 
                        onError={handleImageError}
                    />
                )}
            </div>
                <div className={cx('product-item-details')}>
                    <h2 className={cx('product-item-name')}>{name}</h2>

                <Link to={productLink} className={cx('detail-button-link')}>
                    <Button rounded outline rightIcon={<FontAwesomeIcon icon={faChevronRight}/>} className={cx('product-item-button')}>
                        Xem chi tiết
                    </Button>
                </Link>
            </div>
        </div>
    );
}

Product.propTypes = {
    image: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array
    ]),
    name: PropTypes.string.isRequired,
    link: PropTypes.string,
    productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    category: PropTypes.string
};

export default Product;
