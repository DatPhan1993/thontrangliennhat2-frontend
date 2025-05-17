import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import Header from '../components/Header/Header';
import SideBar from '../components/SideBar/SideBar';
import Footer from '../components/Footer/Footer';
import styles from './DefaultLayout.module.scss';
import { BaseRouteProvider } from '~/context/BaseRouteContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function DefaultLayout({ children, baseRoute, categoryType }) {
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
        <BaseRouteProvider baseRoute={baseRoute}>
            <div className={cx('wrapper')}>
                <Header />
                <div className={cx('container')}>
                    <SideBar categoryType={categoryType} />
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
        </BaseRouteProvider>
    );
}

export default DefaultLayout;
