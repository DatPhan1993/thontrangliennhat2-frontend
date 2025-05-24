import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faChevronRight, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faYoutube, faFacebook } from '@fortawesome/free-brands-svg-icons';
import companyLogo from '~/assets/images/thontrangliennhat-logo.png';
import styles from './Footer.module.scss';
import classNames from 'classnames/bind';
import routes from '~/config/routes';

const cx = classNames.bind(styles);

const Footer = () => {
    return (
        <footer className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('footerLeft', 'footerColumnWide')}>
                    <Link to="/">
                        <img 
                            src={companyLogo} 
                            alt="HỢP TÁC XÃ LIÊN NHẬT" 
                            className={cx('logo')} 
                            onError={(e) => {
                                console.error('Footer logo loading failed');
                                e.target.style.display = 'none';
                            }}
                        />
                    </Link>
                    <h5>HỢP TÁC XÃ LIÊN NHẬT</h5>
                    <div className={cx('contactInfo')}>
                        <div className={cx('contactItem')}>
                            <FontAwesomeIcon icon={faMapMarkerAlt} />
                            <span>TDP Liên Nhật , Phường Thạch Hạ , Thành Phố Hà Tĩnh , Hà Tĩnh</span>
                        </div>
                        <div className={cx('contactItem')}>
                            <FontAwesomeIcon icon={faPhone} />
                            <span>+84 943 768 858</span>
                        </div>
                        <div className={cx('contactItem')}>
                            <FontAwesomeIcon icon={faEnvelope} />
                            <span>thontrangliennhat@gmail.com</span>
                        </div>
                    </div>
                    <div className={cx('socialIcons')}>
                        <Link to="https://www.facebook.com/profile.php?id=100091055392835">
                            <FontAwesomeIcon icon={faFacebook} />
                        </Link>
                        <Link to="https://www.youtube.com/@ThonTrangLienNhat">
                            <FontAwesomeIcon icon={faYoutube} />
                        </Link>
                    </div>
                </div>
                <div className={cx('footerColumn')}>
                    <h4>Thông tin doanh nghiệp</h4>
                    <ul>
                        <li>
                            <Link to="/gioi-thieu">
                                <FontAwesomeIcon className={cx('footer-chevon-icon')} icon={faChevronRight} />
                                Về chúng tôi
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className={cx('footerColumn')}>
                    <h4>Danh mục</h4>
                    <ul>
                        <li>
                            <Link to={routes.products}>
                                <FontAwesomeIcon className={cx('footer-chevon-icon')} icon={faChevronRight} />
                                Sản phẩm
                            </Link>
                        </li>
                        <li>
                            <Link to={routes.services}>
                                <FontAwesomeIcon className={cx('footer-chevon-icon')} icon={faChevronRight} />
                                Dịch vụ du lịch
                            </Link>
                        </li>
                        <li>
                            <Link to={routes.experiences}>
                                <FontAwesomeIcon className={cx('footer-chevon-icon')} icon={faChevronRight} />
                                Trải nghiệm
                            </Link>
                        </li>
                        <li>
                            <Link to={routes.news}>
                                <FontAwesomeIcon className={cx('footer-chevon-icon')} icon={faChevronRight} />
                                Tin tức
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className={cx('footerColumn')}>
                    <h4>Các thông tin khác</h4>
                    <ul>
                        <li>
                            <Link to={routes.contact}>
                                <FontAwesomeIcon className={cx('footer-chevon-icon')} icon={faChevronRight} />
                                Liên hệ với chúng tôi
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className={cx('bottomBar')}>
                <p>
                    Copyright 2025 &copy;{' '}
                    <Link to="/" className={cx('company-name')}>
                        HTX Liên Nhật
                    </Link>
                    . All Rights Reserved. Thiết kế bởi{' '}
                    <Link to="/" className={cx('company-design-name')}>
                        DP
                    </Link>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
