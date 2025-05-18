import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './SideBar.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCaretRight,
    faCaretLeft,
    faTachometerAlt,
    faClipboardList,
    faEnvelope,
    faUsers,
    faBox,
    faCogs,
    faChevronRight,
    faChevronDown,
    faNewspaper,
    faLayerGroup,
    faBookOpen,
    faInfoCircle,
    faEarthAsia,
    faUserFriends,
} from '@fortawesome/free-solid-svg-icons';
import routes from '~/config/routes';
import images from '~/assets/images';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const SideBar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [openMenus, setOpenMenus] = useState({});

    const toggleSidebar = () => {
        if (!isCollapsed) {
            setOpenMenus({});
        }
        setIsCollapsed(!isCollapsed);
    };

    const toggleMenu = (menu) => {
        if (isCollapsed) {
            setIsCollapsed(false);
        } else {
            setOpenMenus((prev) => ({
                [menu]: !prev[menu],
                ...(prev[menu]
                    ? {}
                    : Object.keys(prev).reduce((acc, key) => {
                          if (key !== menu) acc[key] = false;
                          return acc;
                      }, {})),
            }));
        }
    };

    return (
        <div className={cx('sidebar', { collapsed: isCollapsed, expanded: !isCollapsed })}>
            <div className={cx('logoWrapper')}>
                <Link to={routes.admin}>
                    <img src={images.logo} alt="Company Logo" className={cx('logo')} />
                </Link>
                <FontAwesomeIcon
                    icon={isCollapsed ? faCaretRight : faCaretLeft}
                    onClick={toggleSidebar}
                    className={cx('toggleIcon')}
                />
            </div>
            <ul className={cx('menu')}>
                <li>
                    <NavLink to={routes.admin} className={cx('menuItem')}>
                        <div>
                            <FontAwesomeIcon icon={faTachometerAlt} className={cx('menuIcon')} />
                            <span className={cx('menuText')}>{!isCollapsed && 'Bảng điều khiển'}</span>
                        </div>
                    </NavLink>
                </li>
                <li>
                    <div className={cx('menuItem')} onClick={() => toggleMenu('menuManagement')}>
                        <div>
                            <FontAwesomeIcon icon={faClipboardList} className={cx('menuIcon')} />
                            <span className={cx('menuText')}>Quản lý Menu</span>
                        </div>
                        {!isCollapsed && (
                            <>
                                <FontAwesomeIcon
                                    icon={openMenus.menuManagement ? faChevronDown : faChevronRight}
                                    className={cx('chevronIcon')}
                                />
                            </>
                        )}
                    </div>
                    <ul className={cx('subMenu', { open: openMenus.menuManagement })}>
                        <li>
                            <NavLink to={routes.navigationList}>Danh sách Menu</NavLink>
                        </li>
                        <li>
                            <NavLink to={routes.addNavigation}>Thêm Menu</NavLink>
                        </li>
                    </ul>
                </li>
                <li>
                    <NavLink to={routes.messagesList} className={cx('menuItem')}>
                        <div>
                            <FontAwesomeIcon icon={faEnvelope} className={cx('menuIcon')} />
                            <span className={cx('menuText')}>{!isCollapsed && 'Quản lý tin nhắn'}</span>
                        </div>
                    </NavLink>
                </li>
                {/* <li>
                    <div className={cx('menuItem')} onClick={() => toggleMenu('userManagement')}>
                        <div>
                            <FontAwesomeIcon icon={faUsers} className={cx('menuIcon')} />
                            <span className={cx('menuText')}>Quản lý người dùng</span>
                        </div>
                        {!isCollapsed && (
                            <>
                                <FontAwesomeIcon
                                    icon={openMenus.userManagement ? faChevronDown : faChevronRight}
                                    className={cx('chevronIcon')}
                                />
                            </>
                        )}
                    </div>
                    <ul className={cx('subMenu', { open: openMenus.userManagement })}>
                        <li>
                            <NavLink to={routes.userList}>Danh sách người dùng</NavLink>
                        </li>
                        <li>
                            <NavLink to={routes.addUser}>Thêm người dùng</NavLink>
                        </li>
                    </ul>
                </li> */}
                <li>
                    <div className={cx('menuItem')} onClick={() => toggleMenu('productManagement')}>
                        <div>
                            <FontAwesomeIcon icon={faBox} className={cx('menuIcon')} />
                            <span className={cx('menuText')}>Quản lý sản phẩm</span>
                        </div>
                        {!isCollapsed && (
                            <>
                                <FontAwesomeIcon
                                    icon={openMenus.productManagement ? faChevronDown : faChevronRight}
                                    className={cx('chevronIcon')}
                                />
                            </>
                        )}
                    </div>
                    <ul className={cx('subMenu', { open: openMenus.productManagement })}>
                        <li>
                            <NavLink to={routes.productList}>Danh sách sản phẩm</NavLink>
                        </li>
                        <li>
                            <NavLink to={routes.addProduct}>Thêm sản phẩm</NavLink>
                        </li>
                    </ul>
                </li>
                <li>
                    <div className={cx('menuItem')} onClick={() => toggleMenu('newsManagement')}>
                        <div>
                            <FontAwesomeIcon icon={faNewspaper} className={cx('menuIcon')} />
                            <span className={cx('menuText')}>Quản lý tin tức</span>
                        </div>
                        {!isCollapsed && (
                            <>
                                <FontAwesomeIcon
                                    icon={openMenus.newsManagement ? faChevronDown : faChevronRight}
                                    className={cx('chevronIcon')}
                                />
                            </>
                        )}
                    </div>
                    <ul className={cx('subMenu', { open: openMenus.newsManagement })}>
                        <li>
                            <NavLink to={routes.newsList}>Danh sách tin tức</NavLink>
                        </li>
                        <li>
                            <NavLink to={routes.addNews}>Thêm tin tức</NavLink>
                        </li>
                    </ul>
                </li>

                <li>
                    <div className={cx('menuItem')} onClick={() => toggleMenu('serviceManagement')}>
                        <div>
                            <FontAwesomeIcon icon={faLayerGroup} className={cx('menuIcon')} />
                            <span className={cx('menuText')}>Quản lý dịch vụ</span>
                        </div>
                        {!isCollapsed && (
                            <>
                                <FontAwesomeIcon
                                    icon={openMenus.serviceManagement ? faChevronDown : faChevronRight}
                                    className={cx('chevronIcon')}
                                />
                            </>
                        )}
                    </div>
                    <ul className={cx('subMenu', { open: openMenus.serviceManagement })}>
                        <li>
                            <NavLink to={routes.serviceList}>Danh sách dịch vụ</NavLink>
                        </li>
                        <li>
                            <NavLink to={routes.addService}>Thêm dịch vụ</NavLink>
                        </li>
                    </ul>
                </li>

                <li>
                    <div className={cx('menuItem')} onClick={() => toggleMenu('experienceManagement')}>
                        <div>
                            <FontAwesomeIcon icon={faEarthAsia} className={cx('menuIcon')} />
                            <span className={cx('menuText')}>Quản lý trải nghiệm</span>
                        </div>
                        {!isCollapsed && (
                            <>
                                <FontAwesomeIcon
                                    icon={openMenus.experienceManagement ? faChevronDown : faChevronRight}
                                    className={cx('chevronIcon')}
                                />
                            </>
                        )}
                    </div>
                    <ul className={cx('subMenu', { open: openMenus.experienceManagement })}>
                        <li>
                            <NavLink to={routes.experienceList}>Danh sách trải nghiệm</NavLink>
                        </li>
                        <li>
                            <NavLink to={routes.addExperience}>Thêm mục trải nghiệm</NavLink>
                        </li>
                    </ul>
                </li>
                <li>
                    <div className={styles.menuItem} onClick={() => toggleMenu('libraryManagement')}>
                        <div>
                            <FontAwesomeIcon icon={faBookOpen} className={styles.menuIcon} />
                            <span className={styles.menuText}>Quản lý thư viện</span>
                        </div>
                        {!isCollapsed && (
                            <>
                                <FontAwesomeIcon
                                    icon={openMenus.libraryManagement ? faChevronDown : faChevronRight}
                                    className={styles.chevronIcon}
                                />
                            </>
                        )}
                    </div>
                    <ul className={`${styles.subMenu} ${openMenus.libraryManagement ? styles.open : ''}`}>
                        <li>
                            <NavLink to={routes.videosList}>Danh sách video</NavLink>
                        </li>
                        <li>
                            <NavLink to={routes.addVideo}>Thêm video</NavLink>
                        </li>
                        <li>
                            <NavLink to={routes.imagesList}>Danh sách hình ảnh</NavLink>
                        </li>
                        <li>
                            <NavLink to={routes.addImage}>Thêm hình ảnh</NavLink>
                        </li>
                    </ul>
                </li>

                <li>
                    <div className={styles.menuItem} onClick={() => toggleMenu('aboutManagement')}>
                        <div>
                            <FontAwesomeIcon icon={faInfoCircle} className={styles.menuIcon} />
                            <span className={styles.menuText}>Quản lý trang</span>
                        </div>
                        {!isCollapsed && (
                            <>
                                <FontAwesomeIcon
                                    icon={openMenus.aboutManagement ? faChevronDown : faChevronRight}
                                    className={styles.chevronIcon}
                                />
                            </>
                        )}
                    </div>
                    <ul className={`${styles.subMenu} ${openMenus.aboutManagement ? styles.open : ''}`}>
                        <li>
                            <NavLink to={routes.pageList}>Danh sách trang</NavLink>
                        </li>
                        <li>
                            <NavLink to={routes.addPage}>Thêm trang</NavLink>
                        </li>
                    </ul>
                </li>
                <li>
                    <div className={styles.menuItem} onClick={() => toggleMenu('teamManagement')}>
                        <div>
                            <FontAwesomeIcon icon={faUserFriends} className={styles.menuIcon} />
                            <span className={styles.menuText}>Quản lý thành viên</span>
                        </div>
                        {!isCollapsed && (
                            <>
                                <FontAwesomeIcon
                                    icon={openMenus.teamManagement ? faChevronDown : faChevronRight}
                                    className={styles.chevronIcon}
                                />
                            </>
                        )}
                    </div>
                    <ul className={`${styles.subMenu} ${openMenus.teamManagement ? styles.open : ''}`}>
                        <li>
                            <NavLink to={routes.memberList}>Danh sách thành viên</NavLink>
                        </li>
                        <li>
                            <NavLink to={routes.addMember}>Thêm thành viên</NavLink>
                        </li>
                    </ul>
                </li>
                <li>
                    <NavLink to={routes.settings} className={styles.menuItem}>
                        <div>
                            <FontAwesomeIcon icon={faCogs} className={styles.menuIcon} />
                            <span className={styles.menuText}>{!isCollapsed && 'Cài đặt'}</span>
                        </div>
                    </NavLink>
                </li>
            </ul>
        </div>
    );
};

export default SideBar;
