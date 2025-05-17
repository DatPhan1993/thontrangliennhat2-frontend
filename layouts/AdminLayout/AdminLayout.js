import classNames from 'classnames/bind';
import SideBar from '../components/Admin/SideBar/SideBar';
import Header from '../components/Admin/Header/Header';
import styles from './AdminLayout.module.scss';

const cx = classNames.bind(styles);

function AdminLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <SideBar />
            <div className={cx('container')}>
                <Header />
                <div className={cx('content')}>{children}</div>
            </div>
        </div>
    );
}

export default AdminLayout;
