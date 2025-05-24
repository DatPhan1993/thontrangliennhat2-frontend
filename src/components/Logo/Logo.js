import React, { useState, useEffect, useMemo } from 'react';
import logoImage from '~/assets/images/thontrangliennhat-logo.png';

const Logo = ({ alt = "HỢP TÁC XÃ LIÊN NHẬT", className, onClick }) => {
    const [currentSrc, setCurrentSrc] = useState(logoImage);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    // Fallback sources in order of preference - memoized to avoid re-creation
    const fallbackSources = useMemo(() => [
        logoImage, // webpack imported asset
        '/thontrangliennhat-logo.png',
        '/static/media/thontrangliennhat-logo.png',
        '/static/media/thontrangliennhat-logo.a114e7ea2696af9d14d8.png',
        'https://api.thontrangliennhat.com/images/thontrangliennhat-logo.png'
    ], []);

    const [currentIndex, setCurrentIndex] = useState(0);

    const handleImageError = () => {
        console.error(`Logo failed to load from: ${currentSrc}`);
        
        if (currentIndex < fallbackSources.length - 1) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            setCurrentSrc(fallbackSources[nextIndex]);
            console.log(`Trying fallback ${nextIndex}: ${fallbackSources[nextIndex]}`);
        } else {
            console.error('All logo sources failed');
            setHasError(true);
            setIsLoading(false);
        }
    };

    const handleImageLoad = () => {
        console.log(`Logo loaded successfully from: ${currentSrc}`);
        setIsLoading(false);
        setHasError(false);
    };

    // Reset when component mounts or when we want to retry
    useEffect(() => {
        setCurrentSrc(fallbackSources[0]);
        setCurrentIndex(0);
        setIsLoading(true);
        setHasError(false);
    }, [fallbackSources]);

    if (hasError) {
        return (
            <div 
                className={className}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '150px',
                    height: '50px',
                    backgroundColor: '#f0f0f0',
                    fontSize: '12px',
                    color: '#666'
                }}
                onClick={onClick}
            >
                Logo không khả dụng
            </div>
        );
    }

    return (
        <img
            src={currentSrc}
            alt={alt}
            className={className}
            onClick={onClick}
            onError={handleImageError}
            onLoad={handleImageLoad}
            style={{
                opacity: isLoading ? 0.5 : 1,
                transition: 'opacity 0.3s ease'
            }}
        />
    );
};

export default Logo; 