import React from 'react';
import styles from './LoadingScreen.module.scss';

const LoadingScreen = ({ isLoading }) => {
    return (
        <div className={`${styles.loading} ${!isLoading ? styles.slideUp : ''}`}>
            <div className={styles.loadingWrapper}>
                <div className={styles.loadingText}>Loading</div>
                <div className={styles.spinnerContainer}>
                    <div className={styles.dot1}></div>
                    <div className={styles.dot2}></div>
                    <div className={styles.dot3}></div>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
