import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { addCategory } from '~/services/categoryService';
import PushNotification from '~/components/PushNotification/PushNotification';
import styles from './AddCategory.module.scss';
import routes from '~/config/routes';
import CATEGORY_TYPES from '~/constants/CategoryType/CategoryType';
import Title from '~/components/Title/Title';
import { Spin } from 'antd';
import Button from '~/components/Button/Button';

const AddCategory = () => {
    const navigate = useNavigate();
    const [isError, setIsError] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [subcategories, setSubcategories] = useState([]);
    const [currentSubcategory, setCurrentSubcategory] = useState('');

    const initialValues = {
        name: '',
        type: '',
        image: null,
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Tên danh mục là bắt buộc'),
        type: Yup.number()
            .required('Loại danh mục là bắt buộc')
            .min(1, 'Giá trị không hợp lệ')
            .max(Object.keys(CATEGORY_TYPES).length, 'Giá trị không hợp lệ'),
    });

    const handleSubmit = async (values, { resetForm, setSubmitting }) => {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('type', values.type);

        // Kiểm tra nếu image tồn tại và là file trước khi thêm vào formData
        if (values.image) {
            formData.append('image', values.image);
        }

        // Thêm các danh mục con vào formData nếu cần thiết
        if (subcategories.length > 0) {
            formData.append('subcategories', JSON.stringify(subcategories));
        }

        try {
            await addCategory(formData);
            resetForm();
            setSubcategories([]);
            setNotificationMessage('Thêm danh mục thành công!');
            setIsError(false);
            setTimeout(() => {
                navigate(routes.categoryList);
            }, 1000);
        } catch (error) {
            setIsError(true);
            setNotificationMessage('Lỗi khi thêm danh mục.');
            console.error('Lỗi khi tạo danh mục:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleAddSubcategory = () => {
        if (currentSubcategory.trim()) {
            setSubcategories([...subcategories, currentSubcategory]);
            setCurrentSubcategory('');
        }
    };

    const handleRemoveSubcategory = (index) => {
        const updatedSubcategories = subcategories.filter((_, i) => i !== index);
        setSubcategories(updatedSubcategories);
    };

    return (
        <div className={styles.addCategory}>
            <Title text="Thêm Danh Mục"></Title>
            {notificationMessage && (
                <PushNotification message={notificationMessage} type={isError ? 'error' : 'success'} />
            )}
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting, setFieldValue }) => (
                    <Form className={styles.addForm}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name">Tên Danh mục</label>
                            <Field name="name" type="text" className={styles.input} />
                            <ErrorMessage name="name" component="div" className={styles.error} />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="type">Loại Danh mục</label>
                            <Field as="select" name="type" className={styles.input}>
                                <option value="">Chọn loại danh mục</option>
                                {Object.entries(CATEGORY_TYPES).map(([key, value]) => (
                                    <option key={key} value={key}>
                                        {value}
                                    </option>
                                ))}
                            </Field>
                            <ErrorMessage name="type" component="div" className={styles.error} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Danh mục con</label>
                            <div className={styles.subcategoryInputGroup}>
                                <input
                                    type="text"
                                    value={currentSubcategory}
                                    onChange={(e) => setCurrentSubcategory(e.target.value)}
                                    placeholder="Nhập danh mục con và nhấn nút Thêm"
                                    className={styles.input}
                                />
                                <Button
                                    primary
                                    type="button"
                                    onClick={handleAddSubcategory}
                                    className={styles.addButton}
                                >
                                    Thêm
                                </Button>
                            </div>
                            <div className={styles.subcategoriesList}>
                                {subcategories.map((subcategory, index) => (
                                    <div key={index} className={styles.subcategoryItem}>
                                        {index + 1}.{subcategory}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSubcategory(index)}
                                            className={styles.removeButton}
                                        >
                                            x
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="image">Chọn Ảnh</label>
                            <input
                                id="image"
                                name="image"
                                type="file"
                                accept="image/*"
                                onChange={(event) => {
                                    const file = event.currentTarget.files[0];
                                    setFieldValue('image', file ? file : null);
                                }}
                                className={styles.input}
                            />

                            <ErrorMessage name="image" component="div" className={styles.error} />
                        </div>
                        <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
                            {isSubmitting ? <Spin size="small" /> : 'Thêm Danh Mục'}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddCategory;
