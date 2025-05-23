import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { updateProduct, getProductById } from '~/services/productService';
import { getCategoriesBySlug } from '~/services/categoryService';
import CustomEditor from '~/components/CustomEditor/CustomEditor';
import PushNotification from '~/components/PushNotification/PushNotification';
import { useDropzone } from 'react-dropzone';
import styles from './EditProduct.module.scss';
import routes from '~/config/routes';
import Title from '~/components/Title/Title';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { Spin } from 'antd';
import Button from '~/components/Button/Button';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [product, setProduct] = useState(null);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [featureInput, setFeatureInput] = useState('');
    const [features, setFeatures] = useState([]);
    const [files, setFiles] = useState([]);

    const [initialValues] = useState({
        updateName: '',
        content: '',
        updateCate: '',
        summary: '',
        images: [],
        phone_number: '',
    });

    const validationSchema = Yup.object({
        updateName: Yup.string().required('Tên sản phẩm là bắt buộc'),
        content: Yup.string().required('Nội dung là bắt buộc'),
        updateCate: Yup.string().required('Danh mục là bắt buộc'),
        summary: Yup.string().required('Tóm tắt là bắt buộc'),
        features: Yup.array().of(Yup.string().required('Thông tin tổng quan không được bỏ trống')),
        phone_number: Yup.string().required('Số điện thoại là bắt buộc'),
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const fetchedCategories = await getCategoriesBySlug('san-pham');
                setCategories(fetchedCategories);
            } catch (error) {
                console.error('Lỗi khi tải danh mục:', error);
            }
        };

        const fetchProduct = async () => {
            try {
                const productData = await getProductById(id);
                setProduct(productData);
                setFeatures(JSON.parse(productData.features) || []);
                setFiles(productData.images || []);

                initialValues.updateName = productData.name;
                initialValues.content = productData.content;
                initialValues.updateCate = productData.child_nav_id;
                initialValues.summary = productData.summary;
                initialValues.phone_number = productData.phone_number;
                setFiles(productData.images || []);
            } catch (error) {
                console.error('Lỗi khi tải sản phẩm:', error);
            }
        };

        fetchCategories();
        fetchProduct();
    }, [id, initialValues]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => {
            setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
        },
        accept: 'image/*',
    });

    const handleSubmit = async (values, { resetForm }) => {
        const formData = new FormData();

        formData.append('name', values.updateName);
        formData.append('content', values.content);
        formData.append('summary', values.summary);
        formData.append('phone_number', values.phone_number);
        formData.append('child_nav_id', values.updateCate);
        formData.append('features', JSON.stringify(features));

        if (files.length > 0) {
            files.forEach((file) => {
                if (typeof file === 'string') {
                    formData.append('images[]', file);
                } else {
                    formData.append('images[]', file);
                }
            });
        } else {
            formData.append('images[]', product.images);
        }

        try {
            await updateProduct(id, formData);
            setNotification({ message: 'Cập nhật sản phẩm thành công!', type: 'success' });
            resetForm();
            setFiles([]);
            setFeatures([]);
            setTimeout(() => {
                navigate(routes.productList);
            }, 1000);
        } catch (error) {
            setNotification({ message: 'Lỗi khi cập nhật sản phẩm.', type: 'error' });
            console.error('Lỗi khi cập nhật sản phẩm:', error);
        }
    };

    const removeFile = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const addFeature = () => {
        if (featureInput.trim()) {
            setFeatures([...features, featureInput.trim()]);
            setFeatureInput('');
        }
    };

    const removeFeature = (index) => {
        setFeatures((prevFeatures) => prevFeatures.filter((_, i) => i !== index));
    };

    return (
        <div className={styles.editProduct}>
            <Title text="Cập nhật sản phẩm" />
            {notification.message && <PushNotification message={notification.message} type={notification.type} />}
            {product && (
                <Formik
                    initialValues={{
                        updateName: product ? product.name : '',
                        content: product ? product.content : '',
                        updateCate: product ? product.child_nav_id : '',
                        summary: product ? product.summary : '',
                        phone_number: product ? product.phone_number : '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, setFieldValue, values }) => (
                        <Form className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="updateName">Tên Sản Phẩm</label>
                                <Field name="updateName" type="text" className={styles.input} />
                                <ErrorMessage name="updateName" component="div" className={styles.error} />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="phone_number">Số Điện Thoại</label>
                                <Field name="phone_number" type="text" className={styles.input} />
                                <ErrorMessage name="phone_number" component="div" className={styles.error} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Chọn Hình Ảnh</label>
                                <div {...getRootProps()} className={styles.dropzone}>
                                    <input {...getInputProps()} />
                                    <p>Kéo thả file vào đây, hoặc nhấn để chọn file</p>
                                </div>
                                <ErrorMessage name="updateImage" component="div" className={styles.error} />
                            </div>
                            <div className={styles.imagesPreview}>
                                {files.map((img, index) => (
                                    <div key={index} className={styles.imageContainer}>
                                        <img
                                            src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                                            alt={`Product ${index}`}
                                            className={styles.productImage}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className={styles.removeButton}
                                        >
                                            <FontAwesomeIcon icon={faClose} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="updateCate">Danh Mục</label>
                                <Field as="select" name="updateCate" className={styles.input}>
                                    <option value="">Chọn danh mục</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.title}
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage name="updateCate" component="div" className={styles.error} />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="summary">Tóm Tắt</label>
                                <Field name="summary" type="text" className={styles.input} />
                                <ErrorMessage name="summary" component="div" className={styles.error} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Thông tin tổng quan</label>
                                <div className={styles.featuresInput}>
                                    <input
                                        type="text"
                                        value={featureInput}
                                        onChange={(e) => setFeatureInput(e.target.value)}
                                        className={styles.input}
                                        placeholder="Nhập thông tin và nhấn nút thêm"
                                    />
                                    <Button type="button" primary onClick={addFeature} className={styles.addButton}>
                                        Thêm
                                    </Button>
                                </div>
                                <div className={styles.featuresList}>
                                    {features.map((feature, index) => (
                                        <div key={index} className={styles.featureItem}>
                                            <span className={styles.featureTitle}>
                                                {index + 1}. {feature}
                                            </span>
                                            <button
                                                primary
                                                type="button"
                                                onClick={() => removeFeature(index)}
                                                className={styles.removeButtonFeat}
                                            >
                                                <FontAwesomeIcon icon={faClose} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="content">Nội Dung</label>
                                <CustomEditor
                                    onChange={(content) => setFieldValue('content', content)}
                                    initialValue={values.content}
                                />
                                <ErrorMessage name="content" component="div" className={styles.error} />
                            </div>
                            <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
                                {isSubmitting ? <Spin size="small" /> : 'Cập Nhật'}
                            </button>
                        </Form>
                    )}
                </Formik>
            )}
        </div>
    );
};

export default EditProduct;
