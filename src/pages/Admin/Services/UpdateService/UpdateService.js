import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getServiceById, updateService } from '~/services/serviceService';
import { getCategoriesBySlug } from '~/services/categoryService';
import PushNotification from '~/components/PushNotification/PushNotification';
import styles from './UpdateService.module.scss';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingScreen from '~/components/LoadingScreen/LoadingScreen';
import routes from '~/config/routes';
import Title from '~/components/Title/Title';
import { Spin } from 'antd';
import DOMPurify from 'dompurify';

const UpdateService = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [initialValues, setInitialValues] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [previewContent, setPreviewContent] = useState('');

    // Define custom service categories
    const customCategories = [
        { id: 'gao-huu-co-lien-nhat', title: 'Gạo Hữu Cơ Liên Nhật' },
        { id: 'ca-ro-dong', title: 'Cá Rô Đồng' },
        { id: 'tom-cang-xanh', title: 'Tôm Càng Xanh' },
        { id: 'oc-buou', title: 'Ốc Bươu' }
    ];

    const validationSchema = Yup.object({
        title: Yup.string().required('Tiêu đề là bắt buộc'),
        summary: Yup.string().required('Tóm tắt là bắt buộc'),
        image: Yup.mixed().required('Hình ảnh là bắt buộc'),
        categoryId: Yup.string().required('Danh mục là bắt buộc'),
        content: Yup.string().required('Nội dung là bắt buộc'),
    });

    // Function to preserve line breaks in content
    const preserveLineBreaks = (content) => {
        if (!content) return '';
        
        // First check if content already has HTML formatting
        if (content.includes('<p>') || content.includes('<br') || content.includes('<div')) {
            return content;
        }
        
        // Otherwise, convert line breaks to <br> tags and wrap in paragraphs
        return content
            .split('\n\n')
            .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
            .join('');
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const fetchedCategories = await getCategoriesBySlug('dich-vu');
                // Combine fetched categories with custom categories
                setCategories(fetchedCategories.length > 0 ? fetchedCategories : customCategories);
            } catch (error) {
                console.error('Lỗi khi tải danh mục:', error);
                // Fallback to custom categories if API fails
                setCategories(customCategories);
            }
        };

        const fetchService = async () => {
            try {
                const service = await getServiceById(id);
                console.log('Fetched service:', service);
                
                // Ensure content is a string
                const content = service.content || '';
                setPreviewContent(content);
                
                setInitialValues({
                    title: service.name,
                    summary: service.summary || '',
                    image: service.images && service.images.length > 0 ? service.images[0] : '',
                    categoryId: service.child_nav_id || '',
                    content: content,
                    isFeatured: service.isFeatured || false
                });
            } catch (error) {
                console.error('Lỗi khi tải dịch vụ:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
        fetchService();
    }, [id]);

    const handleImageUpload = (event, setFieldValue) => {
        const file = event.target.files[0];
        setFieldValue('image', file);
    };
    
    const handleContentChange = (e, setFieldValue) => {
        const content = e.target.value;
        setFieldValue('content', content);
        // Update preview with preserved line breaks
        setPreviewContent(preserveLineBreaks(content));
    };
    
    const handleSubmit = async (values, { resetForm }) => {
        const formData = new FormData();

        formData.append('name', values.title);
        formData.append('summary', values.summary || '');

        // Handle image properly - prioritize new uploaded files over existing URLs
        if (values.image) {
            if (values.image instanceof File) {
                // If it's a File object (new upload)
                formData.append('images[]', values.image);
                console.log('Appending new image file:', values.image.name);
            } else if (typeof values.image === 'string' && values.image.trim() !== '') {
                // If it's a string URL (existing image)
                formData.append('images[]', values.image);
                console.log('Appending existing image path:', values.image);
            }
        }

        // Apply line break preservation before sending
        const contentWithLineBreaks = preserveLineBreaks(values.content);
        
        formData.append('child_nav_id', values.categoryId || '');
        formData.append('content', contentWithLineBreaks);
        formData.append('isFeatured', values.isFeatured ? 'true' : 'false');
        formData.append('_method', 'PUT'); // Ensure method override is included

        // Log FormData contents for debugging
        console.log('FormData being sent:');
        for (let [key, value] of formData.entries()) {
            if (value instanceof File) {
                console.log(`${key}: File - ${value.name} (${value.size} bytes)`);
            } else if (typeof value === 'string' && value.length < 100) {
                console.log(`${key}: ${value}`);
            } else {
                console.log(`${key}: [Data too large to display]`);
            }
        }
        console.log('Service ID:', id);

        try {
            setIsLoading(true);
            await updateService(id, formData);
            setNotification({ message: 'Cập nhật dịch vụ thành công!', type: 'success' });
            setTimeout(() => {
                navigate(routes.serviceList);
            }, 1500);
        } catch (error) {
            setIsLoading(false);
            setNotification({ message: 'Lỗi khi cập nhật dịch vụ.', type: 'error' });
            console.error('Lỗi khi cập nhật dịch vụ:', error);
            
            // Log error details
            if (error.response) {
                console.error('Error response:', error.response.status, error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error message:', error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !initialValues) {
        return <LoadingScreen />;
    }

    return (
        <div className={styles.editService}>
            <Title text="Cập nhật dịch vụ" />
            {notification.message && <PushNotification message={notification.message} type={notification.type} />}
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
                {({ isSubmitting, setFieldValue, values }) => (
                    <Form className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="title">Tiêu Đề</label>
                            <Field name="title" type="text" className={styles.input} />
                            <ErrorMessage name="title" component="div" className={styles.error} />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="summary">Tóm Tắt</label>
                            <Field name="summary" as="textarea" rows="3" className={styles.textArea} />
                            <ErrorMessage name="summary" component="div" className={styles.error} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Chọn Hình Ảnh</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(event) => handleImageUpload(event, setFieldValue)}
                                className={styles.fileInput}
                            />
                            <ErrorMessage name="image" component="div" className={styles.error} />
                        </div>
                        {values.image && (
                            <div className={styles.imagePreview}>
                                <img
                                    src={
                                        typeof values.image === 'string'
                                            ? values.image
                                            : URL.createObjectURL(values.image)
                                    }
                                    alt="Service"
                                    className={styles.serviceImage}
                                />
                            </div>
                        )}
                        <div className={styles.formGroup}>
                            <label htmlFor="categoryId">Danh Mục</label>
                            <Field as="select" name="categoryId" className={styles.input}>
                                <option value="">Chọn danh mục</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.title}
                                    </option>
                                ))}
                            </Field>
                            <ErrorMessage name="categoryId" component="div" className={styles.error} />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="content">Nội Dung</label>
                            <Field 
                                name="content" 
                                as="textarea" 
                                rows="15" 
                                className={styles.textArea} 
                                placeholder="Nhập nội dung chi tiết về sản xuất..."
                                onChange={(e) => handleContentChange(e, setFieldValue)}
                            />
                            <ErrorMessage name="content" component="div" className={styles.error} />
                        </div>
                        
                        {/* Content Preview */}
                        <div className={styles.formGroup}>
                            <label>Xem trước nội dung</label>
                            <div 
                                className={styles.contentPreview}
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(previewContent) }}
                            />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label htmlFor="isFeatured" className={styles.checkboxLabel}>
                                <Field name="isFeatured" type="checkbox" className={styles.checkbox} />
                                Dịch vụ nổi bật
                            </label>
                        </div>
                        <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
                            {isSubmitting ? <Spin size="small" /> : 'Cập nhật'}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default UpdateService;
