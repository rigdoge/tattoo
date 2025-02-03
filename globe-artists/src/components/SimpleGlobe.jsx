import React from 'react';
import Globe from 'react-globe.gl';

const SimpleGlobe = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000000' }}>
      <Globe
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        backgroundColor="#000000"
        width={800}
        height={800}
      />
    </div>
  );
};

export default SimpleGlobe;
