import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faAngleLeft, faAngleRight, faPlus } from '@fortawesome/free-solid-svg-icons';
import { deleteVideo, getVideos } from '~/services/libraryService';
import styles from './VideoList.module.scss';
import Title from '~/components/Title/Title';
import { Link } from 'react-router-dom';
import routes from '~/config/routes';
import PushNotification from '~/components/PushNotification/PushNotification';

const VideoList = () => {
    const [videos, setVideos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [notification, setNotification] = useState({ message: '', type: '' });

    useEffect(() => {
        fetchVideos();
    }, [currentPage, itemsPerPage]);

    const fetchVideos = async () => {
        try {
            const data = await getVideos();
            if (data) {
                setVideos(data);
            } else {
                setNotification({ message: 'Có lỗi khi tải dữ liệu thư viện video.', type: 'error' });
            }
        } catch (error) {
            console.error('Error fetching videos:', error);
            setNotification({ message: 'Có lỗi khi tải dữ liệu thư viện video.', type: 'error' });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa video này không?')) {
            try {
                await deleteVideo(id);
                setVideos(videos.filter((video) => video.id !== id));
                setNotification({ message: 'Video đã được xóa thành công!', type: 'success' });
            } catch (error) {
                console.error('Error deleting video:', error);
                setNotification({ message: 'Đã xảy ra lỗi khi xóa video!', type: 'error' });
            }
        }
    };

    const filteredVideos = videos.filter((video) => video.url.toLowerCase().includes(searchTerm.toLowerCase()));

    const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
    const indexOfLastVideo = currentPage * itemsPerPage;
    const indexOfFirstVideo = indexOfLastVideo - itemsPerPage;
    const currentVideos = filteredVideos.slice(indexOfFirstVideo, indexOfLastVideo);

    return (
        <div className={styles.videoContainer}>
            <Title className={styles.pageTitle} text="Danh sách Video" />
            <div className={styles.actionsContainer}>
                <input
                    type="text"
                    placeholder="Tìm kiếm Video..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
                <Link to={routes.addVideo} className={styles.addButton}>
                    <FontAwesomeIcon icon={faPlus} /> Thêm mới Video
                </Link>
            </div>

            <div className={styles.videoList}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Video</th>
                            <th>Ngày tạo</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentVideos.length > 0 ? (
                            currentVideos.map((video) => (
                                <tr key={video.id}>
                                    <td>
                                        <a href={video.url} target="_blank" rel="noopener noreferrer">
                                            {video.url}
                                        </a>
                                    </td>
                                    <td>{new Date(video.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <button onClick={() => handleDelete(video.id)} className={styles.deleteButton}>
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
                    Hiển thị {indexOfFirstVideo + 1} đến {Math.min(indexOfLastVideo, filteredVideos.length)} của{' '}
                    {filteredVideos.length}
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
            {notification.message && <PushNotification message={notification.message} type={notification.type} />}
        </div>
    );
};

export default VideoList;