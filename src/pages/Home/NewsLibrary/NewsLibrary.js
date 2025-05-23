import React from 'react';
import classNames from 'classnames/bind';
import styles from './NewsLibrary.module.scss';
import News from './News/New';
import Library from './Library/Library';

const cx = classNames.bind(styles);

const NewsLibrary = () => (
    <section className={cx('wrapper')}>
        <div className={cx('inner')}>
            <News />
            <Library />
        </div>
    </section>
);

export default NewsLibrary;
