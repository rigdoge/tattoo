import React from 'react';

const ArtistMarker = ({ artist, onClick, isSelected }) => {
  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
    e.nativeEvent.preventDefault();
    onClick(artist);
    return false;
  };

  const handleMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
    e.nativeEvent.preventDefault();
    return false;
  };

  return (
    <div 
      className={`artist-marker ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onContextMenu={handleMouseDown}
      style={{ 
        cursor: 'pointer',
        pointerEvents: 'all'
      }}
    >
      <div className="artist-glow" style={{ borderColor: artist.color }} />
      <div className="artist-image">
        <img 
          src={artist.avatar} 
          alt={artist.name}
          onLoad={(e) => e.target.parentElement.style.opacity = '1'}
          onError={(e) => {
            const parent = e.target.parentElement;
            parent.style.background = artist.color;
            parent.style.opacity = '1';
            parent.innerHTML = `
              <div style="
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 16px;
                font-weight: bold;
              ">${artist.name[0]}</div>
            `;
          }}
        />
      </div>
      <div className="artist-label">
        <div className="artist-name">{artist.name}</div>
        <div className="artist-city">{artist.city || artist.country}</div>
      </div>
    </div>
  );
};

export default ArtistMarker;
