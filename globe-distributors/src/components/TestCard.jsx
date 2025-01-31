import { useState } from 'react';
import './InfoCard.css';

const TestCard = () => {
  const [imgError, setImgError] = useState(false);
  
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#1a1a1a',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div className="info-card visible">
        <img 
          src={imgError ? 'https://via.placeholder.com/80x80?text=Logo' : '/logos/tokyo.png'} 
          alt="Tokyo Distributor logo" 
          className="logo"
          onError={(e) => {
            console.error('Image failed to load:', e);
            setImgError(true);
          }}
        />
        <h3>Tokyo Distributor</h3>
        <div className="location">
          Tokyo, Japan
        </div>
        <div className="contact">
          <div>+81 3-1234-5678</div>
          <div>contact@tokyodist.com</div>
        </div>
        <div className="social">
          <a href="https://instagram.com/@tokyo_dist" target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          <a href="https://facebook.com/tokyodistributor" target="_blank" rel="noopener noreferrer">
            Facebook
          </a>
          <a href="https://www.tokyodist.com" target="_blank" rel="noopener noreferrer">
            Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default TestCard;
