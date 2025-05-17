import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { addUser } from '~/services/userService';
import styles from './AddUser.module.scss';
import routes from '~/config/routes';
import PushNotification from '~/components/PushNotification/PushNotification';
import Title from '~/components/Title/Title';
import { Spin } from 'antd';

const AddUser = () => {
    const navigate = useNavigate();
    const [notificationMessage, setNotificationMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const initialValues = {
        username: '',
        email: '',
        fullName: '',
        password: '',
    };

    const validationSchema = Yup.object({
        username: Yup.string().required('Vui lòng nhập tên đăng nhập'),
        email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập Email'),
        fullName: Yup.string().required('Vui lòng nhập Họ và Tên người dùng'),
        password: Yup.string().required('Mật khẩu là bắt buộc').min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    });

    const handleSubmit = async (values, { resetForm }) => {
        try {
            await addUser(values);
            setNotificationMessage('Thêm người dùng thành công!');
            setIsError(false);
            resetForm();
            setTimeout(() => {
                navigate(routes.userList);
            }, 1000);
        } catch (error) {
            if (
                error.response &&
                error.response.status === 400 &&
                error.response.data.message === 'Email is already in use!'
            ) {
                setNotificationMessage('Email đã tồn tại.');
            } else {
                setNotificationMessage('Lỗi khi thêm người dùng.');
            }
            setIsError(true);
        }
    };

    return (
        <div className={styles.addUser}>
            <Title text="Thêm mới người dùng"></Title>
            {notificationMessage && (
                <PushNotification message={notificationMessage} type={isError ? 'error' : 'success'} />
            )}
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting }) => (
                    <Form className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="username">Tên đăng nhập</label>
                            <Field name="username" type="text" className={styles.input} />
                            <ErrorMessage name="username" component="div" className={styles.error} />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email</label>
                            <Field name="email" type="email" className={styles.input} />
                            <ErrorMessage name="email" component="div" className={styles.error} />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="fullName">Họ và tên</label>
                            <Field name="fullName" type="text" className={styles.input} />
                            <ErrorMessage name="fullName" component="div" className={styles.error} />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="password">Mật khẩu</label>
                            <Field name="password" type="password" className={styles.input} />
                            <ErrorMessage name="password" component="div" className={styles.error} />
                        </div>
                        <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
                            {isSubmitting ? <Spin size="small" /> : 'Thêm Người Dùng'}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddUser;
