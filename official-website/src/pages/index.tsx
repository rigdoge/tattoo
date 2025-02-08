import React, { Suspense, useState } from 'react';
import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

// 动态导入 Globe 组件
const Globe = React.lazy(() => import('@site/../globe-artists/src/components/Globe'));

function Shape3D({ to, type }: { to: string; type: 'cube' | 'sphere' }) {
  if (type === 'cube') {
    return (
      <Link to={to} className={styles.cube}>
        <div className={`${styles.cube__face} ${styles['cube__face--front']}`}></div>
        <div className={`${styles.cube__face} ${styles['cube__face--back']}`}></div>
        <div className={`${styles.cube__face} ${styles['cube__face--right']}`}></div>
        <div className={`${styles.cube__face} ${styles['cube__face--left']}`}></div>
        <div className={`${styles.cube__face} ${styles['cube__face--top']}`}></div>
        <div className={`${styles.cube__face} ${styles['cube__face--bottom']}`}></div>
      </Link>
    );
  }
  
  return (
    <Link to={to} className={styles.sphere}></Link>
  );
}

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <iframe 
        src="http://localhost:5173/?preview=true&embed=true"
        className={styles.globeIframe}
        onLoad={() => setIsIframeLoaded(true)}
        title="Globe Preview"
        frameBorder="0"
        allowFullScreen
        loading="eager"
      />
      <div className={styles.shape3dContainer}>
        <Shape3D to="/artists-globe" type="cube" />
        <Shape3D to="/distributors-globe" type="sphere" />
      </div>
    </header>
  );
}

function FeatureList() {
  return [
    {
      title: 'Global Artist Network',
      image: '/img/feature-artists.svg',
      description: (
        <>
          Connect with talented tattoo artists worldwide. Explore their unique styles,
          portfolios, and stories on our interactive 3D globe.
        </>
      ),
    },
    {
      title: 'Worldwide Distributors',
      image: '/img/feature-distributors.svg',
      description: (
        <>
          Find authorized EZ Tattoo distributors near you. Our global distribution
          network ensures quality products and reliable service.
        </>
      ),
    },
    {
      title: 'Artist Community',
      image: '/img/feature-community.svg',
      description: (
        <>
          Join our vibrant community of tattoo artists. Share experiences, learn
          from others, and grow together in the art of tattooing.
        </>
      ),
    },
  ];
}

function Feature({title, image, description}) {
  return (
    <div className={clsx('col col--4', styles.feature)}>
      <div className={styles.featureImage}>
        <img src={image} alt={title} />
      </div>
      <div className="padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

function HomepageFeatures() {
  const features = FeatureList();
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {features.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

function HomepageCTA() {
  return (
    <section className={styles.cta}>
      <div className="container">
        <div className={styles.ctaContent}>
          <h2>Ready to Join Our Global Community?</h2>
          <p>
            Whether you're a tattoo artist looking to showcase your work or searching
            for quality supplies, we're here to help you succeed.
          </p>
          <div className={styles.ctaButtons}>
            <Link className="button button--primary button--lg" to="/docs/intro">
              Get Started
            </Link>
            <Link className="button button--secondary button--lg" to="/about">
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Global Tattoo Artist Platform">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <HomepageCTA />
      </main>
    </Layout>
  );
}
