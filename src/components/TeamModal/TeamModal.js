import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './TeamModal.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const TeamModal = ({ visible, onClose, team }) => {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (visible) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [visible, onClose]);

    if (!visible) return null;

    return (
        <div className={cx('modal-overlay')}>
            <div className={cx('modal')} ref={modalRef}>
                <button className={cx('modal-close')} onClick={onClose}>
                    &times;
                </button>
                {team && (
                    <div className={cx('team-detail')}>
                        <div className={cx('team-image-container')}>
                            <img 
                                src={team.image} 
                                alt={team.name} 
                                className={cx('team-image')}
                                onError={(e) => {
                                    console.warn(`[TeamModal] Image failed for ${team.name}: ${team.image}`);
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/300x300?text=' + encodeURIComponent(team.name.charAt(0));
                                }}
                                onLoad={() => {
                                    console.log(`[TeamModal] Image loaded successfully for ${team.name}: ${team.image}`);
                                }}
                            />
                        </div>
                        <div className={cx('team-info')}>
                            <h2 className={cx('team-name')}>{team.name}</h2>
                            <p className={cx('team-position')}>{team.position}</p>
                            {team.description && (
                                <p className={cx('team-description')}>{team.description}</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

TeamModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    team: PropTypes.object,
};

export default TeamModal;
