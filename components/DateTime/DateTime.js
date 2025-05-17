import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './DateTime.module.scss';

const cx = classNames.bind(styles);

const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    const formattedDate = `${formattedDay}/${formattedMonth}/${year}`;
    const formattedTime = `${hours}:${formattedMinutes}`;

    return { date: formattedDate, time: formattedTime };
};

function DateTime({ timestamp, views = 0, showDate = true, showTime = true, showViews = true }) {
    let timestampNumber = typeof timestamp === 'string' ? Date.parse(timestamp) : timestamp;
    const date = timestampNumber ? formatDate(timestampNumber).date : null;
    const time = timestampNumber ? formatDate(timestampNumber).time : null;

    return (
        <div className={cx('info')}>
            <FontAwesomeIcon icon={faCalendarCheck} className={cx('icon')} />
            <span>
                {showTime && time && `${time} `}
                {showDate && date && `| ${date} `}
                {showViews && `| `}
                {showViews && <span className={cx('views')}>{views} người đã xem</span>}
            </span>
        </div>
    );
}

DateTime.propTypes = {
    timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    views: PropTypes.number,
    showDate: PropTypes.bool,
    showTime: PropTypes.bool,
    showViews: PropTypes.bool,
};

export default DateTime;
