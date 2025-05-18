import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { addPageContent } from '~/services/pageService';
import CustomEditor from '~/components/CustomEditor/CustomEditor';
import PushNotification from '~/components/PushNotification/PushNotification';
import styles from './AddPage.module.scss';
import routes from '~/config/routes';
import { useNavigate } from 'react-router-dom';
import Title from '~/components/Title/Title';

const validationSchema = Yup.object({
    title: Yup.string().required('Hãy nhập tên trang'),
    content: Yup.string().required('Hãy viết nội dung cho trang'),
});

const AddPage = () => {
    const [notification, setNotification] = useState({ message: '', type: '' });
    const navigate = useNavigate();

    const initialValues = {
        title: '',
        content: '',
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const { title, content } = values;
            await addPageContent({ name: title, content });
            resetForm();
            setNotification({ message: 'Đã thêm trang thành công!', type: 'success' });
            setTimeout(() => {
                navigate(routes.pageList);
            }, 1000);
        } catch (error) {
            setNotification({ message: 'Lỗi khi thêm trang', type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.addPage}>
            <Title text="Thêm mới trang" />
            {notification.message && <PushNotification message={notification.message} type={notification.type} />}
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting, setFieldValue, values }) => (
                    <Form className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="title">Title</label>
                            <Field name="title" type="text" className={styles.input} />
                            <ErrorMessage name="title" component="div" className={styles.error} />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="content">Content</label>
                            <CustomEditor
                                onChange={(content) => setFieldValue('content', content)}
                                initialValue={values.content}
                            />
                            <ErrorMessage name="content" component="div" className={styles.error} />
                        </div>
                        <div className={styles.formGroup}>
                            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                                {isSubmitting ? 'Đang thêm...' : 'Thêm Trang'}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddPage;
