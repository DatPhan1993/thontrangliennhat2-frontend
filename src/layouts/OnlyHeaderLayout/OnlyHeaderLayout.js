import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons';
import classNames from 'classnames/bind';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import styles from './OnlyHeaderLayout.module.scss';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function OnlyHeaderLayout({ children }) {
    const [isVisible, setIsVisible] = useState(false);
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('container')}>
                <div className={cx('content')}>{children}</div>
            </div>
            <Footer />
            <div className={cx('contact-buttons')}>
                    <div className={cx('button', 'hotline')} onClick={() => (window.location.href = 'tel:0943768858')}>
                        <FontAwesomeIcon icon={faPhone} />
                    </div>
                    <div
                        className={cx('button', 'zalo')}
                        onClick={() => (window.location.href = 'https://zalo.me/0943768858')}
                    ></div>
                    <div
                        className={cx('button', 'facebook')}
                        onClick={() => (window.location.href = 'https://www.facebook.com/profile.php?id=100091055392835')}
                    >
                        <FontAwesomeIcon icon={faFacebookF} />
                    </div>
                </div>
            {isVisible && (
                <div className={cx('scroll-to-top')} onClick={scrollToTop}>
                    <FontAwesomeIcon icon={faChevronUp} className={cx('icon')} />
                </div>
            )}
        </div>
    );
}

export default OnlyHeaderLayout;
