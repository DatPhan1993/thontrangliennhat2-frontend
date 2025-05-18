import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faClipboardList,
    faEnvelope,
    faUsers,
    faBox,
    faNewspaper,
    faLayerGroup,
    // faHandshake,
    faBookOpen,
    faCogs,
    faInfoCircle,
    faEarthAsia,
    faUserFriends,
    // faUsersBetweenLines,
    // faList,
} from '@fortawesome/free-solid-svg-icons';
import styles from './Dashboard.module.scss';
import routes from '~/config/routes';

const sidebarItems = [
    { title: 'Quản lý Menu', icon: faClipboardList, count: 0, route: routes.navigationList },
    { title: 'Quản lý tin nhắn', icon: faEnvelope, count: 0, route: routes.messagesList },
    // { title: 'Quản lý người dùng', icon: faUsers, count: 0, route: routes.userList },
    { title: 'Quản lý sản phẩm', icon: faBox, count: 0, route: routes.productList },
    { title: 'Quản lý tin tức', icon: faNewspaper, count: 0, route: routes.newsList },
    { title: 'Quản lý dịch vụ', icon: faLayerGroup, count: 0, route: routes.serviceList },
    { title: 'Quản lý trải nghiệm', icon: faEarthAsia, count: 0, route: routes.experienceList },
    { title: 'Quản lý thư viện', icon: faBookOpen, count: 0, route: routes.videosList },
    { title: 'Quản lý trang', icon: faInfoCircle, count: 0, route: routes.pageList },
    { title: 'Quản lý thành viên', icon: faUserFriends, count: 0, route: routes.memberList },
    { title: 'Cài đặt', icon: faCogs, count: 0, route: routes.settings },
];

const Dashboard = () => {
    return (
        <div className={styles.dashboard}>
            {sidebarItems.map((item, index) => (
                <NavLink
                    key={index}
                    to={item.route}
                    className={styles.dashboardItem}
                    style={{ backgroundColor: 'var(--primary)' }}
                >
                    <div className={styles.itemIcon}>
                        <FontAwesomeIcon icon={item.icon} className={styles.dashboardIcon} />
                    </div>
                    <div className={styles.itemContent}>
                        <span className={styles.dashboardText}>{item.title}</span>
                    </div>
                </NavLink>
            ))}
        </div>
    );
};

export default Dashboard;
