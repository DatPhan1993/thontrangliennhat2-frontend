import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useAuth } from '~/hooks/useAuth';
import styles from './Login.module.scss';
import companyLogo from '~/assets/images/thontrangliennhat-logo.png';

const Login = () => {
    const { signin } = useAuth();

    const handleLogin = async (values, { setSubmitting, setErrors }) => {
        try {
            await signin(values);
        } catch (error) {
            setErrors({ email: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBox}>
                <img src={companyLogo} alt="Company Logo" className={styles.logo} />
                <h1>Đăng Nhập</h1>
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validate={(values) => {
                        const errors = {};
                        if (!values.email) {
                            errors.email = 'Vui lòng nhập tên đăng nhập';
                        }
                        if (!values.password) {
                            errors.password = 'Vui lòng nhập mật khẩu';
                        }
                        return errors;
                    }}
                    onSubmit={handleLogin}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <div className={styles.formItem}>
                                <label htmlFor="email">Tên đăng nhập</label>
                                <Field name="email" type="email" />
                                <ErrorMessage name="email" component="div" className={styles.error} />
                            </div>
                            <div className={styles.formItem}>
                                <label htmlFor="password">Mật khẩu</label>
                                <Field name="password" type="password" />
                                <ErrorMessage name="password" component="div" className={styles.error} />
                            </div>
                            <div className={styles.formItem}>
                                <button className={styles.submitButton} type="submit" disabled={isSubmitting}>
                                    Đăng Nhập
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default Login;
