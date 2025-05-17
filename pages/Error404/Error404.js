import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Error404.module.scss';

const Error404 = () => {
    return (
        <div className={styles.errorContainer}>
            <div className={styles.errorContent}>
                <h1 className={styles.errorTitle}>404</h1>
                <h2 className={styles.errorSubTitle}>Page Not Found</h2>
                <p className={styles.errorText}>
                    Oops! The page you're looking for cannot be found. It may have been removed, renamed, or is
                    temporarily unavailable.
                </p>
                <Link to="/" className={styles.backToHome}>
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default Error404;
