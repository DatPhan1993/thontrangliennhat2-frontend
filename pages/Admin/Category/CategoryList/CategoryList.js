import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faAngleRight, faAngleLeft, faEdit } from '@fortawesome/free-solid-svg-icons';
import { getCategories, deleteCategory } from '~/services/categoryService';
import styles from './CategoryList.module.scss';
import Title from '~/components/Title/Title';
import routes from '~/config/routes';
import CATEGORY_TYPES from '~/constants/CategoryType/CategoryType';
import PushNotification from '~/components/PushNotification/PushNotification';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data || []);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
                setNotificationMessage('Failed to fetch categories.');
                setIsError(true);
            }
        };

        fetchCategories();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có thực sự muốn xóa danh mục này?')) {
            try {
                await deleteCategory(id);
                setCategories(categories.filter((category) => category._id !== id));
                setNotificationMessage('Xóa danh mục thành công!');
                setIsError(false);
            } catch (error) {
                console.error('Error deleting category:', error);
                setNotificationMessage('Có lỗi khi xóa danh mục.');
                setIsError(true);
            }
        }
    };

    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    const indexOfLastCategory = currentPage * itemsPerPage;
    const indexOfFirstCategory = indexOfLastCategory - itemsPerPage;
    const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);

    return (
        <div className={styles.categoryContainer}>
            <Title className={styles.pageTitle} text="Danh sách Danh mục" />
            {notificationMessage && (
                <PushNotification message={notificationMessage} type={isError ? 'error' : 'success'} />
            )}
            <div className={styles.actionsContainer}>
                <input
                    type="text"
                    placeholder="Tìm kiếm Danh mục..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
                <Link to={routes.addCategory} className={styles.addButton}>
                    <FontAwesomeIcon icon={faPlus} /> Thêm mới Danh mục
                </Link>
            </div>

            <div className={styles.categoryList}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Tên danh mục</th>
                            <th>Thuộc danh mục</th>
                            <th>Ngày tạo</th>
                            <th>Ngày cập nhật</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCategories.length > 0 ? (
                            currentCategories.map((category) => (
                                <tr key={category._id}>
                                    <td>{category.name}</td>
                                    <td>{CATEGORY_TYPES[category.type]}</td>
                                    <td>{new Date(category.createdAt).toLocaleString()}</td>
                                    <td>{new Date(category.updatedAt).toLocaleString()}</td>
                                    <td>
                                        <Link
                                            to={`/admin/update-category/${category._id}`}
                                            className={styles.editButton}
                                        >
                                            <FontAwesomeIcon icon={faEdit} /> Sửa
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(category._id)}
                                            className={styles.deleteButton}
                                        >
                                            <FontAwesomeIcon icon={faTrash} /> Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">Không có dữ liệu</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

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

            <div className={styles.pagination}>
                <span>
                    Hiện {indexOfFirstCategory + 1} đến {Math.min(indexOfLastCategory, filteredCategories.length)} của{' '}
                    {filteredCategories.length}
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

export default CategoryList;
