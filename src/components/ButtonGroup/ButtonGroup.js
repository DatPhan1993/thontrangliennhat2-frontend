import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './ButtonGroup.module.scss';

const cx = classNames.bind(styles);

const ButtonGroup = ({ buttons, onButtonClick, isStatic = false }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleClick = (index) => {
        if (isStatic) return;
        setActiveIndex(index);
        onButtonClick(index);
    };

    return (
        <div className={cx('button-group')}>
            {buttons.map((button, index) => (
                <button
                    key={index}
                    className={cx('button', { active: activeIndex === index, static: isStatic })}
                    onClick={() => handleClick(index)}
                    disabled={isStatic}
                >
                    {button}
                </button>
            ))}
        </div>
    );
};

ButtonGroup.propTypes = {
    buttons: PropTypes.arrayOf(PropTypes.string).isRequired,
    onButtonClick: PropTypes.func,
    isStatic: PropTypes.bool,
};

export default ButtonGroup;
