import React, { useEffect, useState } from 'react';
import { Menu, Spin } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleDot } from '@fortawesome/free-solid-svg-icons';
import { useBaseRoute } from '~/context/BaseRouteContext';
import { Link, useLocation } from 'react-router-dom';
import { getCategoriesBySlug } from '~/services/categoryService';

function SideBar({ categoryType }) {
    const [categoriesData, setCategoriesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const baseRoute = useBaseRoute();
    const location = useLocation();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    
    // List of items to hide
    const hiddenItems = ['Gạo Hữu Cơ Liên Nhật', 'Cá Rô Đồng', 'Tôm Càng Xanh', 'Ốc Bươu'];

    useEffect(() => {
        async function fetchCategoryData() {
            try {
                const data = await getCategoriesBySlug(categoryType);
                setCategoriesData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching category data:', error);
                setError(error);
                setLoading(false);
            }
        }

        fetchCategoryData();
    }, [categoryType]);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const getIconStyle = (active) => ({
        marginRight: 8,
        color: active ? '#ec7324' : '#2d2e8a',
    });

    const getTextStyle = (active) => ({
        fontWeight: 600,
        color: active ? '#0866ff' : 'inherit',
    });

    const getMenuItems = () => {
        if (loading) {
            return [];
        }

        if (error || !categoriesData) {
            return [
                {
                    key: 'error',
                    label: 'Error loading data'
                }
            ];
        }

        return categoriesData
            .filter(category => !hiddenItems.includes(category.title))
            .map((category) => {
                const isActive = location.pathname.includes(category.slug);
                const titleContent = (
                    <span style={getTextStyle(isActive)}>
                        <FontAwesomeIcon icon={faCircleDot} style={getIconStyle(isActive)} />
                        {category.title}
                    </span>
                );

                if (category.children && category.children.length > 0) {
                    return {
                        key: category.id,
                        label: titleContent,
                        children: category.children
                            .filter(subcategory => !hiddenItems.includes(subcategory.title))
                            .map((subcategory) => {
                                const subcategoryActive = location.pathname.includes(subcategory.slug);
                                return {
                                    key: subcategory.id,
                                    label: (
                                        <Link
                                            to={`${baseRoute}/${subcategory.slug}`}
                                            style={getTextStyle(subcategoryActive)}
                                        >
                                            <FontAwesomeIcon icon={faCircleDot} style={getIconStyle(subcategoryActive)} />
                                            {subcategory.title}
                                        </Link>
                                    )
                                };
                            })
                    };
                }

                return {
                    key: category.id,
                    label: (
                        <Link to={`${baseRoute}/${category.slug}`} style={getTextStyle(isActive)}>
                            <FontAwesomeIcon icon={faCircleDot} style={getIconStyle(isActive)} />
                            {category.title}
                        </Link>
                    )
                };
            });
    };

    // Render loading spinner if needed
    if (loading && windowWidth >= 1280) {
            return (
            <aside style={{ width: windowWidth < 1280 ? 0 : '100%', height: '100%', transition: 'width 0.3s ease' }}>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        minHeight: '100px',
                    }}
                >
                    <Spin size="small" />
                </div>
            </aside>
        );
    }

    return (
        <aside style={{ width: windowWidth < 1280 ? 0 : '100%', height: '100%', transition: 'width 0.3s ease' }}>
            {windowWidth >= 1280 && (
                <Menu 
                    mode="inline" 
                    theme="light" 
                    style={{ border: 0 }}
                    items={getMenuItems()}
                />
            )}
        </aside>
    );
}

export default SideBar;
