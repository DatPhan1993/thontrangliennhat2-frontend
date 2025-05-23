import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { getImages, getVideos } from '~/services/libraryService';
import Title from '~/components/Title/Title';
import Modal from './ModalLibrary/ModalLibrary';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './Library.module.scss';
import ButtonGroup from '~/components/ButtonGroup/ButtonGroup';
// import { motion } from 'framer-motion';
import LoadingScreen from '~/components/LoadingScreen/LoadingScreen';

const cx = classNames.bind(styles);

function Library() {
    const [videos, setVideos] = useState([]);
    const [images, setImages] = useState([]);
    const [activeVideo, setActiveVideo] = useState(null);
    const [activeImage, setActiveImage] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [, setModalContentType] = useState(null);

    const extractVideoId = (url) => {
        const urlObj = new URL(url);
        return urlObj.searchParams.get('v');
    };

    useEffect(() => {
        const loadLibrary = async () => {
            try {
                const [videoData, imageData] = await Promise.all([getVideos(), getImages()]);
                const updatedVideos = videoData.map((item) => ({
                    ...item,
                    url: extractVideoId(item.url),
                }));
                setVideos(updatedVideos);
                setImages(imageData);
                setActiveVideo(updatedVideos[0]?.url);
                setActiveImage(imageData[0]?.url);
            } catch (error) {
                console.error('Failed to load library data', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadLibrary();
    }, []);

    const getThumbnailUrl = (videoId) => {
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    };

    const handleVideoClick = (videoLink) => {
        setActiveVideo(videoLink);
    };

    const handleImageClick = (imageSrc) => {
        setActiveImage(imageSrc);
        setModalContentType('image');
    };

    const videoSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1500,
        cssEase: 'ease-in-out',
    };

    const imageSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1500,
        cssEase: 'ease-in-out',
    };

    return (
        <div className={cx('wrapper')}>
            {isLoading ? (
                <LoadingScreen isLoading={isLoading} />
            ) : (
                <div className={cx('inner')}>
                    <Title text="Thư viện" />
                    <div className={cx('library-wrapper')}>
                        <div className={cx('library-videos')}>
                            <ButtonGroup buttons={['Video']} isStatic={true} />
                            <div className={cx('library')}>
                                {activeVideo && (
                                    <div className={cx('main-video')}>
                                        <iframe
                                            src={`https://www.youtube.com/embed/${activeVideo}`}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            title="Main Video"
                                        />
                                    </div>
                                )}
                                <Slider {...videoSettings}>
                                    {videos.map((item, index) => (
                                        <div
                                            key={index}
                                            className={cx('thumbnail')}
                                            onClick={() => handleVideoClick(item.url)}
                                        >
                                            <img
                                                src={getThumbnailUrl(item.url)}
                                                alt={item.title}
                                                className={cx('thumbnail-image')}
                                            />
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                        </div>

                        <div className={cx('library-images')}>
                            <ButtonGroup buttons={['Hình ảnh']} isStatic={true} />
                            <div className={cx('library')}>
                                {activeImage && (
                                    <div className={cx('main-image')}>
                                        <img
                                            src={activeImage}
                                            alt="Main"
                                            className={cx('main-image-content')}
                                            onClick={() => {
                                                setModalContentType('image');
                                                setModalOpen(true);
                                            }}
                                        />
                                    </div>
                                )}
                                <Slider {...imageSettings}>
                                    {images.map((image, index) => (
                                        <div
                                            key={index}
                                            className={cx('thumbnail')}
                                            onClick={() => handleImageClick(image.url)}
                                        >
                                            <img
                                                src={image.url}
                                                alt={`Thumbnail ${index + 1}`}
                                                className={cx('thumbnail-image')}
                                            />
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <img src={activeImage} alt="Modal" className={cx('modal-image')} />
            </Modal>
        </div>
    );
}

export default Library;
