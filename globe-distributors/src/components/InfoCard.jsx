import React, { useEffect, useState } from 'react';

const InfoCard = ({ data, position }) => {
  if (!data) return null;
  
  const [cardStyle, setCardStyle] = useState({
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: '10px',
    padding: '20px',
    color: 'white',
    maxWidth: '300px',
    backdropFilter: 'blur(10px)',
    border: `2px solid ${data.color}`,
    boxShadow: `0 0 20px ${data.color}40`,
    zIndex: 1000,
    fontFamily: 'Arial, sans-serif',
    animation: 'fadeIn 0.3s ease',
    transition: 'all 0.3s ease'
  });

  useEffect(() => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const cardWidth = 300; // maxWidth
    const cardHeight = 400; // 估计高度
    
    // 计算最佳位置，确保卡片不会超出屏幕
    let left = position.x + 50; // logo 右侧 50px
    let top = position.y - cardHeight / 2; // 垂直居中对齐
    
    // 如果卡片会超出右边界，则显示在 logo 左侧
    if (left + cardWidth > windowWidth) {
      left = position.x - cardWidth - 50;
    }
    
    // 确保卡片不会超出上下边界
    if (top < 20) {
      top = 20;
    } else if (top + cardHeight > windowHeight - 20) {
      top = windowHeight - cardHeight - 20;
    }
    
    setCardStyle(prev => ({
      ...prev,
      left: `${left}px`,
      top: `${top}px`
    }));
  }, [position]);
  
  return (
    <div style={cardStyle}>
      <h3 style={{
        margin: '0 0 10px 0',
        color: data.color,
        fontSize: '1.5em',
        fontWeight: 'bold'
      }}>
        {data.name}
      </h3>
      
      <div style={{
        fontSize: '1.1em',
        marginBottom: '15px',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
      }}>
        <span style={{ color: data.color }}>📍</span>
        {data.city}, {data.country}
      </div>
      
      <div style={{
        marginBottom: '15px',
        color: '#cccccc'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '5px',
          marginBottom: '5px' 
        }}>
          <span style={{ color: data.color }}>📞</span>
          {data.phone}
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '5px' 
        }}>
          <span style={{ color: data.color }}>✉️</span>
          {data.email}
        </div>
      </div>
      
      <div style={{
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap'
      }}>
        <SocialLink
          href={`https://instagram.com/${data.social.instagram}`}
          color={data.color}
          icon="📸"
          text="Instagram"
        />
        <SocialLink
          href={`https://facebook.com/${data.social.facebook}`}
          color={data.color}
          icon="👥"
          text="Facebook"
        />
        <SocialLink
          href={`https://${data.social.website}`}
          color={data.color}
          icon="🌐"
          text="Website"
        />
      </div>
    </div>
  );
};

const SocialLink = ({ href, color, icon, text }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      color: color,
      textDecoration: 'none',
      padding: '5px 10px',
      border: `1px solid ${color}`,
      borderRadius: '5px',
      fontSize: '0.9em',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '5px'
    }}
    onMouseEnter={e => {
      e.target.style.backgroundColor = color;
      e.target.style.color = '#000000';
    }}
    onMouseLeave={e => {
      e.target.style.backgroundColor = 'transparent';
      e.target.style.color = color;
    }}
  >
    <span>{icon}</span>
    {text}
  </a>
);

export default InfoCard;
