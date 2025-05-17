import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getPageBySlug, updatePageContent } from '~/services/pageService';
import CustomEditor from '~/components/CustomEditor/CustomEditor';
import PushNotification from '~/components/PushNotification/PushNotification';
import styles from './UpdatePage.module.scss';
import routes from '~/config/routes';
import Title from '~/components/Title/Title';

const UpdatePageSchema = Yup.object({
    name: Yup.string().required('Tên không được để trống'),
    content: Yup.string().required('Nội dung không được để trống'),
});

const UpdatePage = () => {
    const location = useLocation();
    const { slug } = location.state || {};
    const [initialValues, setInitialValues] = useState({ name: '', content: '' });
    const [currentSlug, setCurrentSlug] = useState('');
    const [notification, setNotification] = useState({ message: '', type: '' });
    const navigate = useNavigate();

    useEffect(() => {
        if (!slug) return;

        const fetchPageContent = async () => {
            try {
                const data = await getPageBySlug(slug);
                if (data) {
                    setInitialValues({ name: data.name, content: data.content });
                    setCurrentSlug(data.slug);
                } else {
                    setNotification({ message: 'Không tìm thấy trang.', type: 'error' });
                }
            } catch (error) {
                console.error('Error fetching page content:', error);
                setNotification({ message: 'Lỗi khi tải dữ liệu trang.', type: 'error' });
            }
        };

        fetchPageContent();
    }, [slug]);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await updatePageContent(currentSlug, values);
            setNotification({ message: 'Cập nhật trang thành công!', type: 'success' });
            setTimeout(() => {
                navigate(routes.pageList);
            }, 1000);
        } catch (error) {
            console.error('Error updating page content:', error);
            setNotification({ message: 'Lỗi khi cập nhật trang.', type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.updatePage}>
            <Title text="Cập nhật trang" />
            {notification.message && <PushNotification message={notification.message} type={notification.type} />}
            <Formik
                initialValues={initialValues}
                validationSchema={UpdatePageSchema}
                enableReinitialize
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, setFieldValue, values }) => (
                    <Form className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name">Tên Trang</label>
                            <Field name="name" type="text" placeholder="Nhập tên trang" className={styles.input} />
                            <ErrorMessage name="name" component="div" className={styles.error} />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="content">Nội dung Trang</label>
                            <CustomEditor
                                onChange={(content) => setFieldValue('content', content)}
                                initialValue={values.content}
                            />
                            <ErrorMessage name="content" component="div" className={styles.error} />
                        </div>
                        <div className={styles.formActions}>
                            <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
                                {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default UpdatePage;
