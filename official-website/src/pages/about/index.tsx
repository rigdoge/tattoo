import React from 'react';
import Layout from '@theme/Layout';
import styles from './styles.module.css';
import { sections, Section } from './data';
const LogoHex = require('@site/src/assets/logo-hex.svg').default;
const WorkshopBg = require('@site/src/assets/workshop-bg.svg').default;

interface AboutSectionProps extends Section {
  isReverse?: boolean;
  dark?: boolean;
}

function AboutSection({ image, title, subtitle, description, isReverse = false, dark = false }: AboutSectionProps) {
  return (
    <section className={`${styles.section} ${isReverse ? styles.reverse : ''} ${dark ? styles.dark : ''}`}>
      <div className={styles.imageContainer}>
        {typeof image === 'string' ? (
          <img src={image} alt={title} className={styles.image} />
        ) : (
          <div className={styles.svgContainer}>
            {React.createElement(image, {
              className: styles.svgImage,
              'aria-label': title,
            })}
          </div>
        )}
      </div>
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        {subtitle && <h3 className={styles.subtitle}>{subtitle}</h3>}
        <p className={styles.description}>{description}</p>
      </div>
    </section>
  );
}

export default function About() {
  return (
    <Layout
      title="About Us"
      description="Learn more about EZ Tattoo - Our story, mission, and values">
      <main className={styles.main}>
        {/* 品牌展示区 */}
        <section className={styles.brandSection}>
          <LogoHex className={styles.brandLogo} />
          <h1 className={styles.brandTitle}>EZ TATTOO</h1>
          <div className={styles.brandSupply}>SUPPLY</div>
          <div className={styles.contactInfo}>
            <p>▶ WWW.EZTATTOOSUPPLY.COM</p>
            <p>▶ SALES@EZTATTOOING.COM</p>
          </div>
        </section>
        
        {/* 其他部分 */}
        <div className={styles.sections}>
          {sections.map((section, index) => (
            <AboutSection
              key={index}
              {...section}
              isReverse={index % 2 === 1}
              dark={section.dark}
            />
          ))}
        </div>
      </main>
    </Layout>
  );
} 