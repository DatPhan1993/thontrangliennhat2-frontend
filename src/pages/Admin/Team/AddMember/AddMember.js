import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { addMember } from '~/services/teamService';
import PushNotification from '~/components/PushNotification/PushNotification';
import styles from './AddMember.module.scss';
import routes from '~/config/routes';
import Title from '~/components/Title/Title';
import { useDropzone } from 'react-dropzone';

const AddMember = () => {
    const navigate = useNavigate();
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [files, setFiles] = useState([]);

    const initialValues = {
        name: '',
        qualification: '',
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Tên thành viên là bắt buộc'),
        qualification: Yup.string().required('Vị trí là bắt buộc'),
    });

    const handleImageUpload = (acceptedFiles) => {
        setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    };

    const handleSubmit = async (values, { resetForm }) => {
        const formData = new FormData();

        formData.append('name', values.name);
        formData.append('position', values.qualification);

        if (files.length > 0) {
            formData.append('image', files[0]);
        }

        try {
            await addMember(formData);
            resetForm();
            setFiles([]);
            setNotification({ message: 'Thêm thành viên thành công!', type: 'success' });

            setTimeout(() => {
                navigate(routes.memberList);
            }, 1000);
        } catch (error) {
            setNotification({ message: 'Lỗi khi thêm thành viên.', type: 'error' });
            console.error('Lỗi khi tạo thành viên:', error);
        }
    };

    const removeFile = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleImageUpload,
        accept: 'image/*',
    });

    return (
        <div className={styles.addMember}>
            <Title text="Thêm thành viên" />
            {notification.message && <PushNotification message={notification.message} type={notification.type} />}
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting }) => (
                    <Form className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name">Tên Thành viên</label>
                            <Field name="name" type="text" className={styles.input} />
                            <ErrorMessage name="name" component="div" className={styles.error} />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="qualification">Vị trí</label>
                            <Field name="qualification" type="text" className={styles.input} />
                            <ErrorMessage name="qualification" component="div" className={styles.error} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Chọn Hình Ảnh</label>
                            <div {...getRootProps()} className={styles.dropzone}>
                                <input {...getInputProps()} />
                                <p>Kéo thả file vào đây, hoặc nhấn để chọn file</p>
                            </div>
                            <ErrorMessage name="image" component="div" className={styles.error} />
                        </div>
                        <div className={styles.imagePreview}>
                            {files.map((file, index) => (
                                <div key={index} className={styles.imageContainer}>
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`Member ${index}`}
                                        className={styles.memberImage}
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
                            Thêm Thành viên
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddMember;
