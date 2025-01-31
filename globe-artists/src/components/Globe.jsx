import React, { useEffect, useRef, useState, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { artists } from '../data/artists';
import StarField from './StarField';
import './Globe.css';

const DEFAULT_VIEW = { lat: 29.3088, lng: 120.0778, altitude: 2.5 };

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

  useEffect(() => {
    if (globeEl.current) {
      const globe = globeEl.current;
      globe.controls().autoRotate = !isHovering;
      globe.controls().autoRotateSpeed = 0.5;
      
      // 只在初始化时设置默认视角
      if (!selectedCity) {
        globe.pointOfView(DEFAULT_VIEW);
      }
    }
  }, [isHovering, selectedCity]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = (el, d) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    markersRef.current.get(d.id)?.classList.add('hovering');
    setIsHovering(true);
  };

  const handleMouseLeave = (el, d) => {
    hoverTimeoutRef.current = setTimeout(() => {
      markersRef.current.get(d.id)?.classList.remove('hovering');
      setIsHovering(false);
    }, 500);
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
    console.log('Focusing city for artist:', artist);  // 添加日志
    const cityData = artistsByCity[artist.city];
    if (!cityData) {
      console.error('No city data found for:', artist.city);
      return;
    }

    console.log('City data found:', cityData);  // 添加日志

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
    console.log('State changed - selectedArtist:', selectedArtist);
    console.log('State changed - selectedCity:', selectedCity);
  }, [selectedArtist, selectedCity]);

  return (
    <div className="globe-container">
      <StarField />
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="/starfield.png"
        backgroundColor="#000000"
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
          
          // 创建标签
          const label = document.createElement('div');
          label.className = 'artist-label';
          label.innerHTML = `
            <div class="artist-name">${d.name}</div>
            <div class="artist-city">${d.city}</div>
          `;
          
          // 组装元素
          el.appendChild(glow);
          el.appendChild(imgContainer);
          el.appendChild(label);
          
          // 添加鼠标事件
          el.onmouseenter = () => handleMouseEnter(el, d);
          el.onmouseleave = () => handleMouseLeave(el, d);
          
          // 添加点击事件
          el.onclick = (event) => {
            event.stopPropagation();
            console.log('Clicked artist:', d);  // 添加日志
            focusCity(d);
          };
          
          return el;
        }}
        htmlAltitude={0.1}
        onGlobeClick={resetView}
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
            <h3>{selectedCity.city}, {selectedCity.country}</h3>
            <div className="city-artists">
              {selectedCity.artists.map(artist => (
                <div 
                  key={artist.id} 
                  className={`city-artist ${selectedArtist?.id === artist.id ? 'selected' : ''}`}
                  onClick={() => setSelectedArtist(artist)}
                >
                  <img src={artist.avatar} alt={artist.name} />
                  <div className="artist-info">
                    <div className="name">{artist.name}</div>
                    <div className="style">{artist.style}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="social-links">
              {selectedArtist && (
                <>
                  <a href={selectedArtist.website} target="_blank" rel="noopener noreferrer">Website</a>
                  <a href={`https://instagram.com/${selectedArtist.instagram}`} target="_blank" rel="noopener noreferrer">Instagram</a>
                </>
              )}
            </div>
            <button onClick={resetView} className="reset-view-btn">Reset View</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobeComponent;
