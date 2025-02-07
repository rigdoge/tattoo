import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import Globe from 'react-globe.gl';
import { artists } from '../data/artists';
import SpaceBackground from './SpaceBackground';
import './Globe.css';

const getDeviceType = () => {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

const deviceType = getDeviceType();
const isMobile = deviceType === 'mobile';

const DEFAULT_VIEW = { 
  lat: 29.3088, 
  lng: 120.0778, 
  altitude: deviceType === 'mobile' ? 3 : 
           deviceType === 'tablet' ? 2.8 : 
           2.5
};

const MARKER_SIZE = isMobile ? 24 : 32;

const GlobeComponent = () => {
  const globeEl = useRef();
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const hoverTimeoutRef = useRef(null);
  const markersRef = useRef(new Map());

  // 按城市分组艺术家
  const artistsByCity = useMemo(() => {
    const grouped = {};
    artists.forEach(artist => {
      if (!grouped[artist.city]) {
        grouped[artist.city] = {
          city: artist.city,
          country: artist.country,
          lat: artist.lat,
          lng: artist.lng,
          artists: []
        };
      }
      grouped[artist.city].artists.push(artist);
    });
    return grouped;
  }, []);

  // 初始化时设置默认视角
  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.pointOfView(DEFAULT_VIEW);
    }
  }, []);

  // 控制自动旋转
  useEffect(() => {
    if (globeEl.current) {
      const controls = globeEl.current.controls();
      controls.autoRotate = !isHovering;
      controls.autoRotateSpeed = 0.5;
      controls.enableZoom = !isMobile; // 移动端禁用缩放
      controls.enablePan = !isMobile;  // 移动端禁用平移
      controls.minDistance = 200;      // 限制最小距离
      controls.maxDistance = 800;      // 限制最大距离
    }
  }, [isHovering]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // 处理地球点击事件
  const handleGlobeClick = useCallback(() => {
    console.log('Globe clicked');
    setSelectedArtist(null);
    setSelectedCity(null);
    
    // 移除所有标记的高亮
    markersRef.current.forEach((marker) => {
      marker.classList.remove('city-focus');
    });

    // 重置视角
    if (globeEl.current) {
      globeEl.current.pointOfView(DEFAULT_VIEW, 1000);
    }
  }, []);

  const handleMouseEnter = (el, d) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    const marker = markersRef.current.get(d.id);
    if (marker) {
      marker.classList.add('hovering');
      // 只在没有选中城市时才改变自动旋转状态
      if (!selectedCity) {
        setIsHovering(true);
      }
    }
  };

  const handleMouseLeave = (el, d) => {
    const marker = markersRef.current.get(d.id);
    if (marker) {
      hoverTimeoutRef.current = setTimeout(() => {
        marker.classList.remove('hovering');
        // 只在没有选中城市时才改变自动旋转状态
        if (!selectedCity) {
          setIsHovering(false);
        }
      }, 300);
    }
  };

  const resetView = () => {
    if (globeEl.current) {
      globeEl.current.pointOfView(DEFAULT_VIEW, 1000);
      setSelectedArtist(null);
      setSelectedCity(null);
      // 移除所有标记的高亮
      markersRef.current.forEach(marker => {
        marker.classList.remove('city-focus');
      });
    }
  };

  const focusCity = (artist) => {
    // Focus city for selected artist
    const cityData = artistsByCity[artist.city];
    if (!cityData) {
      console.error('No city data found for:', artist.city);
      return;
    }

    // 如果点击的是已选中的艺术家，只更新视角
    if (selectedArtist?.id === artist.id) {
      // 更新视角
      if (globeEl.current) {
        const currentView = globeEl.current.pointOfView();
        // 先拉远
        globeEl.current.pointOfView({
          lat: currentView.lat,
          lng: currentView.lng,
          altitude: currentView.altitude + 0.5
        }, 300);
        
        // 延迟后聚焦到目标
        setTimeout(() => {
          globeEl.current.pointOfView({
            lat: Number(cityData.lat),
            lng: Number(cityData.lng),
            altitude: 1.5
          }, 700);
        }, 300);
      }
      return;
    }

    // Process city data

    // 更新选中状态
    setSelectedArtist(artist);
    setSelectedCity(cityData);

    // 先略微拉远视角，再聚焦到目标位置，这样即使目标在附近也能看到动画效果
    if (globeEl.current) {
      const currentView = globeEl.current.pointOfView();
      // 先拉远
      globeEl.current.pointOfView({
        lat: currentView.lat,
        lng: currentView.lng,
        altitude: currentView.altitude + 0.5
      }, 300);
      
      // 延迟后聚焦到目标
      setTimeout(() => {
        globeEl.current.pointOfView({
          lat: Number(cityData.lat),
          lng: Number(cityData.lng),
          altitude: 1.5
        }, 700);
      }, 300);
    }

    // 高亮同城市的艺术家
    markersRef.current.forEach((marker, id) => {
      const artistData = artists.find(a => a.id === parseInt(id));
      if (artistData && artistData.city === artist.city) {
        marker.classList.add('city-focus');
      } else {
        marker.classList.remove('city-focus');
      }
    });
  };

  useEffect(() => {
    // Update UI when selection changes
  }, [selectedArtist, selectedCity]);

  // 处理全局点击
  const handleOverlayClick = useCallback((e) => {
    // 如果点击的是标记或卡片，不处理
    if (e.target.closest('.artist-marker') || e.target.closest('.city-artist')) {
      return;
    }

    setSelectedArtist(null);
    setSelectedCity(null);
    
    // 移除所有标记的高亮
    markersRef.current.forEach((marker) => {
      marker.classList.remove('city-focus');
    });
  }, []);

  return (
    <div className="globe-container">
      {/* 添加一个全局点击区域 */}
      <div 
        className={`globe-overlay ${selectedArtist || selectedCity ? 'has-selection' : ''}`}
        onClick={handleOverlayClick}
      />
      <SpaceBackground globeRef={globeEl} />
      <Globe
        ref={globeEl}
        globeImageUrl="/earth-blue-marble.jpg"
        bumpImageUrl="/earth-topology.png"
        backgroundColor="rgba(0, 0, 0, 0)"
        onGlobeClick={handleGlobeClick}
        onGlobeRightClick={handleGlobeClick}
        onBackgroundClick={handleGlobeClick}
        atmosphereColor="#4774B3"
        atmosphereAltitude={0.25}
        htmlElementsData={artists}
        htmlElement={d => {
          const el = document.createElement('div');
          el.className = 'artist-marker';
          if (selectedCity && d.city === selectedCity.city) {
            el.classList.add('city-focus');
          }
          markersRef.current.set(d.id, el);
          
          // 创建图片容器
          const imgContainer = document.createElement('div');
          imgContainer.className = 'artist-image';
          
          // 创建图片元素
          const img = document.createElement('img');
          img.src = d.avatar;
          img.alt = d.name;
          img.onload = () => {
            imgContainer.style.opacity = '1';
          };
          img.onerror = () => {
            // 如果图片加载失败，显示一个带有首字母的彩色圆圈
            imgContainer.style.background = d.color;
            imgContainer.style.opacity = '1';
            imgContainer.innerHTML = `
              <div style="
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 16px;
                font-weight: bold;
              ">${d.name[0]}</div>
            `;
          };
          imgContainer.appendChild(img);
          
          // 创建光晕效果
          const glow = document.createElement('div');
          glow.className = 'artist-glow';
          glow.style.borderColor = d.color;
          
          // 组装元素
          el.appendChild(glow);
          el.appendChild(imgContainer);
          
          // 添加鼠标事件
          el.onmouseenter = () => handleMouseEnter(el, d);
          el.onmouseleave = () => handleMouseLeave(el, d);
          
          // 添加点击事件
          el.onclick = (event) => {
            event.stopPropagation();
            // Handle artist click
            focusCity(d);
          };
          
          return el;
        }}
        htmlAltitude={0.1}
      />
      {selectedCity && (
        <div className="artist-card">
          <div className="card-image">
            <img 
              src={selectedArtist?.avatar || selectedCity.artists[0].avatar} 
              alt={selectedArtist?.name || selectedCity.artists[0].name} 
            />
          </div>
          <div className="card-content">
            <div className="artist-header">
              <h3>{selectedArtist?.name || selectedCity.artists[0].name}</h3>
              {selectedArtist && (
                <div className="social-links">
                  {selectedArtist.instagram && (
                    <a 
                      href={`https://instagram.com/${selectedArtist.instagram}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="social-link instagram"
                      title="Instagram"
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                  )}
                  {selectedArtist.facebook && (
                    <a 
                      href={`https://facebook.com/${selectedArtist.facebook}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="social-link facebook"
                      title="Facebook"
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </div>
            <div className="city-artists">
              <div className="city-artist selected">
                <img src={selectedArtist?.avatar || selectedCity.artists[0].avatar} alt={selectedArtist?.name || selectedCity.artists[0].name} />
                <div className="artist-info">
                  <div className="name">{selectedArtist?.city || selectedCity.city}, {selectedArtist?.country || selectedCity.country}</div>
                  <div className="style">{selectedArtist?.style || selectedCity.artists[0].style}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobeComponent;
