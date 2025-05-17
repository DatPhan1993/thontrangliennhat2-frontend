import React from 'react';
import classNames from 'classnames/bind';
import styles from './ModalLibrary.module.scss';

const cx = classNames.bind(styles);

const ModalLibrary = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className={cx('modal-overlay')} onClick={onClose}>
            <div className={cx('modal-content')} onClick={(e) => e.stopPropagation()}>
                <button className={cx('close-button')} onClick={onClose}>
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
};

export default ModalLibrary;
