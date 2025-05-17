import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import styles from './UserList.module.scss';
import Title from '~/components/Title/Title';
import routes from '~/config/routes';
import { getUsers, deleteUser, getUserByEmail } from '~/services/userService';
import PushNotification from '~/components/PushNotification/PushNotification';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const email = localStorage.getItem('userEmail');
                const user = await getUserByEmail(email);
                setCurrentUser(user);
            } catch (error) {
                console.error('Error fetching current user:', error);
            }
        };

        const fetchUsers = async () => {
            try {
                const data = await getUsers();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
                setNotification({ message: 'Failed to fetch users.', type: 'error' });
            }
        };

        fetchCurrentUser();
        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        if (window.confirm('Bạn có thực muốn xóa người dùng này?')) {
            try {
                if (currentUser && currentUser._id) {
                    const accDelId = currentUser._id.toString();
                    await deleteUser(accDelId, userId);
                    setUsers(users.filter((user) => user._id !== userId));
                    setNotification({ message: 'User deleted successfully!', type: 'success' });
                } else {
                    throw new Error('Current user ID is not available.');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                setNotification({ message: 'There was an error deleting the user.', type: 'error' });
            }
        }
    };

    const filteredUsers = users.filter((user) => user.fullName.toLowerCase().includes(searchTerm.toLowerCase()));

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    return (
        <div className={styles.userContainer}>
            <Title className={styles.pageTitle} text="Danh sách Người dùng" />
            {notification.message && <PushNotification message={notification.message} type={notification.type} />}
            <div className={styles.actionsContainer}>
                <input
                    type="text"
                    placeholder="Tìm kiếm Người dùng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
                <Link to={routes.addUser} className={styles.addButton}>
                    <FontAwesomeIcon icon={faPlus} /> Thêm mới Người dùng
                </Link>
            </div>

            <div className={styles.userList}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Tên đăng nhập</th>
                            <th>Email</th>
                            <th>Họ và tên</th>
                            <th>Ngày tạo</th>
                            <th>Tạo bởi</th>
                            <th>Ngày cập nhật</th>
                            <th>Cập nhật bởi</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.length > 0 ? (
                            currentUsers.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.fullName}</td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td>{user.createdBy}</td>
                                    <td>{user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : '-'}</td>
                                    <td>{user.updatedBy ? user.updatedBy : '-'}</td>
                                    <td>
                                        <Link to={`/admin/update-user/${user._id}`} className={styles.editButton}>
                                            <FontAwesomeIcon icon={faEdit} /> Sửa
                                        </Link>
                                        <button onClick={() => handleDelete(user._id)} className={styles.deleteButton}>
                                            <FontAwesomeIcon icon={faTrash} /> Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8">Không có dữ liệu</td>
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

            {/* Pagination */}
            <div className={styles.pagination}>
                <span>
                    Hiện {indexOfFirstUser + 1} đến {Math.min(indexOfLastUser, filteredUsers.length)} của{' '}
                    {filteredUsers.length}
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

export default UserList;
