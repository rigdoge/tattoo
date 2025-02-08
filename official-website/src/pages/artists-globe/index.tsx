import React from 'react';
import Layout from '@theme/Layout';
import styles from './styles.module.css';

export default function ArtistsGlobe() {
  return (
    <Layout
      title="Artists Globe"
      description="Explore tattoo artists around the world">
      <main className={styles.main}>
        <div className={styles.globeContainer}>
          <iframe 
            src="http://localhost:5173/?embed=true"
            className={styles.globeIframe}
            title="Artists Globe"
            frameBorder="0"
            allowFullScreen
          />
        </div>
      </main>
    </Layout>
  );
} 