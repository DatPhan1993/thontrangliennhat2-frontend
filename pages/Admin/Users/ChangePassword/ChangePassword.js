import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '~/services/userService';
import styles from './ChangePassword.module.scss';
import PushNotification from '~/components/PushNotification/PushNotification';
import routes from '~/config/routes';
import { Spin } from 'antd';

const ChangePassword = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });

    const initialValues = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    };

    const validationSchema = Yup.object({
        oldPassword: Yup.string().required('Mật khẩu cũ là bắt buộc'),
        newPassword: Yup.string().required('Mật khẩu mới là bắt buộc').min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], 'Mật khẩu xác nhận không khớp')
            .required('Xác nhận mật khẩu là bắt buộc'),
    });

    const handleSubmit = async (values, { resetForm }) => {
        setLoading(true);
        try {
            await changePassword(values.oldPassword, values.newPassword);
            setNotification({ message: 'Đổi mật khẩu thành công!', type: 'success' });
            resetForm();
            setTimeout(() => {
                navigate(routes.admin);
            }, 1000);
        } catch (error) {
            console.error('Error changing password:', error);
            setNotification({ message: 'Lỗi khi đổi mật khẩu.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.changePassword}>
            <h2>Đổi Mật Khẩu</h2>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting }) => (
                    <Form>
                        <div className={styles.formGroup}>
                            <label htmlFor="oldPassword">Mật khẩu cũ</label>
                            <Field name="oldPassword" type="password" className={styles.input} />
                            <ErrorMessage name="oldPassword" component="div" className={styles.error} />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="newPassword">Mật khẩu mới</label>
                            <Field name="newPassword" type="password" className={styles.input} />
                            <ErrorMessage name="newPassword" component="div" className={styles.error} />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
                            <Field name="confirmPassword" type="password" className={styles.input} />
                            <ErrorMessage name="confirmPassword" component="div" className={styles.error} />
                        </div>
                        <button type="submit" disabled={isSubmitting || loading} className={styles.submitButton}>
                            {loading ? <Spin size="small" /> : 'Đổi Mật Khẩu'}
                        </button>
                    </Form>
                )}
            </Formik>
            {notification.message && <PushNotification message={notification.message} type={notification.type} />}
        </div>
    );
};

export default ChangePassword;
