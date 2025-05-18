import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import Tophead from './Tophead/Tophead';
import Navigation from './Navigation/Navigation';

const cx = classNames.bind(styles);

function Header() {
    const [isFixed, setIsFixed] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const topHeight = document.querySelector('.tophead-wrapper')?.offsetHeight || 0;
            const navHeight = document.querySelector('.navigation-wrapper')?.offsetHeight || 0;
            const extraScroll = 100;

            const totalHeight = topHeight + navHeight + extraScroll;

            if (window.scrollY >= totalHeight) {
                setIsFixed(true);
            } else {
                setIsFixed(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <header className={cx('wrapper')}>
            <div className={cx('tophead-wrapper')}>
                <Tophead />
            </div>
            <div className={cx('navigation-wrapper')}>
                <Navigation isFixed={isFixed} />
            </div>
        </header>
    );
}

export default Header;
