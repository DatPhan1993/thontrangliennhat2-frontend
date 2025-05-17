import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { getCategoryById, updateCategory } from '~/services/categoryService';
import PushNotification from '~/components/PushNotification/PushNotification';
import styles from './UpdateCategory.module.scss';
import routes from '~/config/routes';
import CATEGORY_TYPES from '~/constants/CategoryType/CategoryType';
import Title from '~/components/Title/Title';
import Button from '~/components/Button/Button';

const UpdateCategory = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isError, setIsError] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [categoryData, setCategoryData] = useState(null);
    const [subcategories, setSubcategories] = useState([]);
    const [currentSubcategory, setCurrentSubcategory] = useState('');
    const [currentImage, setCurrentImage] = useState(null);

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                const data = await getCategoryById(id);
                setCategoryData(data);
                const subcategoryNames = data.subcategories.map((subcategory) => subcategory.name);
                setSubcategories(subcategoryNames);
                setCurrentImage(data.image);
            } catch (error) {
                setIsError(true);
                setNotificationMessage('Lỗi khi tải danh mục.');
                console.error('Lỗi khi lấy thông tin danh mục:', error);
            }
        };
        fetchCategoryData();
    }, [id]);

    const initialValues = {
        name: categoryData?.name || '',
        type: categoryData?.type || '',
        image: null,
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Tên danh mục là bắt buộc'),
        type: Yup.number()
            .required('Loại danh mục là bắt buộc')
            .min(1, 'Giá trị không hợp lệ')
            .max(Object.keys(CATEGORY_TYPES).length, 'Giá trị không hợp lệ'),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('type', values.type);

            if (values.image) {
                formData.append('image', values.image);
            } else {
                formData.append('image', currentImage);
            }

            formData.append('subcategories', JSON.stringify(subcategories));

            await updateCategory(id, formData);
            setNotificationMessage('Cập nhật danh mục thành công!');
            setIsError(false);

            setTimeout(() => {
                navigate(routes.categoryList);
            }, 1000);
        } catch (error) {
            setIsError(true);
            setNotificationMessage('Lỗi khi cập nhật danh mục.');
            console.error('Lỗi khi cập nhật danh mục:', error);
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

    if (!categoryData) return <div>Loading...</div>;

    return (
        <div className={styles.updateCategory}>
            <Title text="Chỉnh sửa Danh Mục"></Title>
            {notificationMessage && (
                <PushNotification message={notificationMessage} type={isError ? 'error' : 'success'} />
            )}
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting, setFieldValue }) => (
                    <Form className={styles.updateForm}>
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
                                    placeholder="Nhập danh mục con"
                                    className={styles.input}
                                />
                                <Button
                                    primary
                                    type="button"
                                    onClick={handleAddSubcategory}
                                    className={styles.addButton}
                                >
                                    Thêm danh mục con
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
                            <label>Ảnh hiện tại</label>
                            {currentImage && (
                                <img src={currentImage} alt="Current category" className={styles.currentImage} />
                            )}
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="image">Chọn Ảnh mới</label>
                            <input
                                id="image"
                                name="image"
                                type="file"
                                accept="image/*"
                                onChange={(event) => {
                                    setFieldValue('image', event.currentTarget.files[0]);
                                }}
                                className={styles.input}
                            />
                            <ErrorMessage name="image" component="div" className={styles.error} />
                        </div>
                        <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
                            Cập nhật Danh mục
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default UpdateCategory;
