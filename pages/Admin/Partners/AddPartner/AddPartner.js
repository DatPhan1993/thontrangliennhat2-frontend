import React, { useState } from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { createPartner } from '~/services/partnerService';
import PushNotification from '~/components/PushNotification/PushNotification';
import styles from './AddPartner.module.scss';
import routes from '~/config/routes';
import Title from '~/components/Title/Title';
import { useDropzone } from 'react-dropzone';

const AddPartner = () => {
    const navigate = useNavigate();
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [files, setFiles] = useState([]);

    const initialValues = {
        image: [],
    };

    const validationSchema = Yup.object({
        image: Yup.array().required('Logo là bắt buộc'),
    });

    const onDrop = (acceptedFiles) => {
        setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    };

    const handleSubmit = async (values, { resetForm }) => {
        const formData = new FormData();
        files.forEach((image) => {
            formData.append('image', image);
        });

        try {
            await createPartner(formData);
            setNotification({ message: 'Thêm đối tác thành công!', type: 'success' });
            resetForm();
            setFiles([]);
            setTimeout(() => {
                navigate(routes.partnerList);
            }, 1000);
        } catch (error) {
            setNotification({ message: 'Lỗi khi thêm đối tác.', type: 'error' });
            console.error('Lỗi khi tạo đối tác:', error);
        }
    };

    const removeFile = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*',
    });

    return (
        <div className={styles.addPartner}>
            <Title text="Thêm đối tác" />
            {notification.message && <PushNotification message={notification.message} type={notification.type} />}
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting }) => (
                    <Form className={styles.form}>
                        <div className={styles.formGroup}>
                            <label>Chọn Logo</label>
                            <div {...getRootProps()} className={styles.dropzone}>
                                <input {...getInputProps()} />
                                <p>Kéo thả file vào đây, hoặc nhấn để chọn file</p>
                            </div>
                            <ErrorMessage name="image" component="div" className={styles.error} />
                        </div>
                        <div className={styles.imagePreview}>
                            {files.map((img, index) => (
                                <div key={index} className={styles.imageContainer}>
                                    <img
                                        src={URL.createObjectURL(img)}
                                        alt={`Logo ${index}`}
                                        className={styles.partnerLogo}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className={styles.removeButton}
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
                            {isSubmitting ? <div className={styles.spinner}></div> : 'Thêm Đối tác'}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddPartner;
