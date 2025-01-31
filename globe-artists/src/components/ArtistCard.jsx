import React from 'react';
import './InfoCard.css';

const ArtistCard = ({ data, position }) => {
  if (!data) return null;

  return (
    <div
      className="info-card"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="card-header" style={{ backgroundColor: data.color }}>
        <img 
          src={data.avatar} 
          alt={data.name} 
          className="artist-avatar"
          style={{
            width: '80px',
            height: '80px',
            objectFit: 'cover',
            borderRadius: '4px',
            border: '2px solid white'
          }}
        />
        <h2>{data.name}</h2>
      </div>
      
      <div className="card-content">
        <div className="location text-lg mb-4">
          {data.city}
        </div>
        
        <div className="social-links">
          {data.instagram && (
            <a
              href={`https://instagram.com/${data.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '8px 16px',
                backgroundColor: '#E1306C',
                color: 'white',
                borderRadius: '4px',
                textDecoration: 'none',
                marginRight: '8px',
                fontSize: '14px'
              }}
            >
              Instagram
            </a>
          )}
          {data.website && (
            <a
              href={data.website}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '8px 16px',
                backgroundColor: '#2196F3',
                color: 'white',
                borderRadius: '4px',
                textDecoration: 'none',
                fontSize: '14px'
              }}
            >
              Website
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;
