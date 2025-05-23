import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { getExperiences } from '~/services/experienceService';
import { getCategoriesBySlug } from '~/services/categoryService';
import CardExperience from '~/components/CardService/CardService';
import Title from '~/components/Title/Title';
import PushNotification from '~/components/PushNotification/PushNotification';
import LoadingScreen from '~/components/LoadingScreen/LoadingScreen';
import { Link } from 'react-router-dom';
import routes from '~/config/routes';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import styles from './Experiences.module.scss';

const cx = classNames.bind(styles);

function Experiences() {
    const [experiences, setExperiences] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadExperiences = async () => {
            try {
                const [experiencesData, categoriesData] = await Promise.all([
                    getExperiences(),
                    getCategoriesBySlug('trai-nghiem'),
                ]);
                setExperiences(experiencesData);
                setCategories(categoriesData);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        loadExperiences();
    }, []);

    if (error) {
        const errorMessage = error.response ? error.response.data.message : 'Network Error';
        return <PushNotification message={errorMessage} />;
    }

    if (loading) {
        return <LoadingScreen isLoading={loading} />;
    }

    const getCategorySlug = (categoryId) => {
        const category = categories.find((cat) => cat.id === categoryId);
        return category && category.slug ? category.slug : 'trai-nghiem';
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Title text="Khu Vực Trải Nghiệm" showSeeAll={true} slug={`${routes.experiences}`} />
                <Swiper
                    spaceBetween={10}
                    slidesPerView={3}
                    breakpoints={{
                        1280: { slidesPerView: 3 },
                        1024: { slidesPerView: 3 },
                        768: { slidesPerView: 2 },
                        0: { slidesPerView: 1 },
                    }}
                    loop={true}
                    modules={[Autoplay]}
                    autoplay={{
                        delay: 2000,
                        disableOnInteraction: false,
                    }}
                >
                    {experiences.map((experience, index) => (
                        <SwiperSlide key={index} className={cx('slide')}>
                            <Link
                                to={`${routes.experiences}/trai-nghiem/${experience.id}`}
                            >
                                <CardExperience
                                    title={experience.name}
                                    summary={experience.summary}
                                    image={experience.images[0]}
                                    createdAt={experience.created_at}
                                />
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}

export default Experiences;
