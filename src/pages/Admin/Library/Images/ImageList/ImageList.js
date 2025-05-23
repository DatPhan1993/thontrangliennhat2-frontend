import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faAngleLeft, faAngleRight, faPlus } from '@fortawesome/free-solid-svg-icons';
import { deleteImage, getImages } from '~/services/libraryService';
import styles from './ImageList.module.scss';
import Title from '~/components/Title/Title';
import { Link } from 'react-router-dom';
import routes from '~/config/routes';
import PushNotification from '~/components/PushNotification/PushNotification';

const ImageList = () => {
    const [images, setImages] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [notification, setNotification] = useState({ message: '', type: '' });

    useEffect(() => {
        fetchImages();
    }, [currentPage, itemsPerPage]);

    const fetchImages = async () => {
        try {
            const data = await getImages();
            if (data) {
                setImages(data);
            } else {
                setNotification({ message: 'Có lỗi khi tải thư viện ảnh!', type: 'error' });
            }
        } catch (error) {
            console.error('Error fetching images:', error);
            setNotification({ message: 'Có lỗi khi tải thư viện ảnh.', type: 'error' });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa hình ảnh này?')) {
            try {
                await deleteImage(id);
                setImages(images.filter((image) => image.id !== id));
                setNotification({ message: 'Hình ảnh đã được xóa thành công!', type: 'success' });
            } catch (error) {
                console.error('Error deleting image:', error);
                setNotification({ message: 'Đã xảy ra lỗi khi xóa hình ảnh!', type: 'error' });
            }
        }
    };

    const filteredImages = images.filter((image) => image.url.toLowerCase().includes(searchTerm.toLowerCase()));

    const totalPages = Math.ceil(filteredImages.length / itemsPerPage);
    const indexOfLastImage = currentPage * itemsPerPage;
    const indexOfFirstImage = indexOfLastImage - itemsPerPage;
    const currentImages = filteredImages.slice(indexOfFirstImage, indexOfLastImage);

    return (
        <div className={styles.imageContainer}>
            <Title className={styles.pageTitle} text="Danh sách hình ảnh" />
            {notification.message && <PushNotification message={notification.message} type={notification.type} />}
            <div className={styles.actionsContainer}>
                <input
                    type="text"
                    placeholder="Tìm kiếm hình ảnh..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
                <Link to={routes.addImage} className={styles.addButton}>
                    <FontAwesomeIcon icon={faPlus} /> Thêm mới hình ảnh
                </Link>
            </div>

            <div className={styles.imageList}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Hình ảnh</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentImages.length > 0 ? (
                            currentImages.map((image) => (
                                <tr key={image.id}>
                                    <td>
                                        <a href={image.url} target="_blank" rel="noopener noreferrer">
                                            {image.url}
                                        </a>
                                    </td>
                                    <td>
                                        <button onClick={() => handleDelete(image.id)} className={styles.deleteButton}>
                                            <FontAwesomeIcon icon={faTrash} /> Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">Không có dữ liệu</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className={styles.itemsPerPage}>
                <label htmlFor="itemsPerPage">Hiển thị: </label>
                <select
                    id="itemsPerPage"
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                </select>
            </div>

            <div className={styles.pagination}>
                <span>
                    Hiển thị {indexOfFirstImage + 1} đến {Math.min(indexOfLastImage, filteredImages.length)} của{' '}
                    {filteredImages.length}
                </span>
                <div className={styles.paginationControls}>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        <FontAwesomeIcon icon={faAngleLeft} />
                    </button>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        <FontAwesomeIcon icon={faAngleRight} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageList;