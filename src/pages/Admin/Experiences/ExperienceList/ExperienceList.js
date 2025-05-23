import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { getExperiences, deleteExperience } from '~/services/experienceService';
import styles from './ExperienceList.module.scss';
import Title from '~/components/Title/Title';
import routes from '~/config/routes';
import PushNotification from '~/components/PushNotification/PushNotification';

const ExperienceList = () => {
    const [experiences, setExperiences] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [notification, setNotification] = useState({ message: '', type: '' });

    useEffect(() => {
        const fetchExperiences = async () => {
            const data = await getExperiences();
            if (data) {
                setExperiences(data);
            } else {
                alert('Failed to fetch experiences.');
            }
        };

        fetchExperiences();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa trải nghiệm này?')) {
            try {
                await deleteExperience(id);
                setExperiences(experiences.filter((experience) => experience.id !== id));
                setNotification({ message: 'Trải nghiệm đã được xóa thành công!', type: 'success' });
            } catch (error) {
                console.error('Error deleting experience:', error);
                setNotification({ message: 'Đã xảy ra lỗi khi xóa trải nghiệm!', type: 'error' });
            }
        }
    };

    const filteredExperiences = experiences.filter(
        (experience) => experience.name && experience.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const totalPages = Math.ceil(filteredExperiences.length / itemsPerPage);
    const indexOfLastExperience = currentPage * itemsPerPage;
    const indexOfFirstExperience = indexOfLastExperience - itemsPerPage;
    const currentExperiences = filteredExperiences.slice(indexOfFirstExperience, indexOfLastExperience);

    return (
        <div className={styles.experienceContainer}>
            <Title className={styles.pageTitle} text="Danh sách Trải nghiệm" />
            {notification.message && <PushNotification message={notification.message} type={notification.type} />}{' '}
            <div className={styles.actionsContainer}>
                <input
                    type="text"
                    placeholder="Tìm kiếm Trải nghiệm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
                <Link to={routes.addExperience} className={styles.addButton}>
                    <FontAwesomeIcon icon={faPlus} /> Thêm mới Trải nghiệm
                </Link>
            </div>
            <div className={styles.experienceList}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Hình ảnh</th>
                            <th>Tên trải nghiệm</th>
                            <th>Tóm tắt</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentExperiences.length > 0 ? (
                            currentExperiences.map((experience) => (
                                <tr key={experience.id}>
                                    <td>
                                        <img
                                            src={experience.images[0]}
                                            alt={experience.name}
                                            className={styles.experienceImage}
                                        />
                                    </td>
                                    <td>{experience.name}</td>
                                    <td>{experience.summary}</td>
                                    <td>
                                        <Link
                                            to={`/admin/update-experience/${experience.id}`}
                                            className={styles.editButton}
                                        >
                                            <FontAwesomeIcon icon={faEdit} /> Sửa
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(experience.id)}
                                            className={styles.deleteButton}
                                        >
                                            <FontAwesomeIcon icon={faTrash} /> Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">Không có dữ liệu</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* Items per page selection */}
            <div className={styles.itemsPerPageContainer}>
                <label htmlFor="itemsPerPage">Số mục mỗi trang:</label>
                <select
                    id="itemsPerPage"
                    value={itemsPerPage}
                    onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                    }}
                    className={styles.itemsPerPageSelect}
                >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
            </div>
            {/* Pagination */}
            <div className={styles.pagination}>
                <span>
                    Hiện {indexOfFirstExperience + 1} đến {Math.min(indexOfLastExperience, filteredExperiences.length)}{' '}
                    của {filteredExperiences.length}
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

export default ExperienceList;