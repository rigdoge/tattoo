import React, { useEffect, useRef, useState } from 'react';
import Layout from '@theme/Layout';
import styles from './styles.module.css';
import { LogoHex } from '@site/src/components/Icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, EffectFade, Mousewheel } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

// 导入 Swiper 样式
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// 发展历程数据
const timelineData = [
  {
    year: '2005',
    title: 'Jin Long Tattoo Equipment Manufactory Founded'
  },
  {
    year: '2014',
    title: 'EZ Tattoo Supply Founded',
    highlight: true
  },
  {
    year: '2018',
    title: 'POPU Microbeauty Founded'
  },
  {
    year: '2021',
    title: 'INKin Tattoo Supply Founded'
  }
];

export default function Development() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex);
  };

  return (
    <Layout
      title="Development"
      description="The development history of EZ Tattoo">
      <div className={styles.developmentContainer}>
        <Swiper
          direction="vertical"
          slidesPerView={1}
          spaceBetween={0}
          mousewheel={true}
          effect="fade"
          speed={1000}
          pagination={{
            clickable: true,
            renderBullet: function (index, className) {
              return `<span class="${className}">${timelineData[index].year}</span>`;
            },
          }}
          onSlideChange={handleSlideChange}
          modules={[Pagination, EffectFade, Mousewheel]}
          className={styles.swiper}
        >
          {timelineData.map((item, index) => (
            <SwiperSlide key={item.year}>
              <div className={`${styles.slide} ${index === activeIndex ? styles.slideActive : ''}`}>
                <div className={styles.content}>
                  <div className={styles.yearContainer} data-aos="fade-right">
                    <div className={styles.year}>{item.year}</div>
                    <div className={styles.dot} />
                    <div className={styles.line} />
                  </div>
                  <div className={styles.textContainer} data-aos="fade-left">
                    <h2 className={styles.title}>{item.title}</h2>
                  </div>
                  {item.highlight && (
                    <div className={styles.highlightBg}>
                      <LogoHex className={styles.logo} />
                    </div>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Layout>
  );
} 