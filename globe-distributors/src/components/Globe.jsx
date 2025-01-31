import React, { useState, useEffect, useRef, useCallback } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import { distributorService } from '../services/distributorService';
import InfoCard from './InfoCard';
import StarField from './StarField';

const YIWU_COORDS = {
  lat: 29.3,
  lng: 120.1,
  altitude: 2.5
};

const GlobeComponent = () => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [selectedData, setSelectedData] = useState(null);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });
  const [distributors, setDistributors] = useState([]);
  const globeEl = useRef();
  const spritesRef = useRef({});

  // 加载数据
  useEffect(() => {
    const loadedDistributors = distributorService.getDistributors();
    setDistributors(loadedDistributors);

    // 监听 storage 事件，当其他组件更新数据时更新地球显示
    const handleStorageChange = (e) => {
      if (e.key === 'distributors') {
        const updatedDistributors = JSON.parse(e.newValue);
        setDistributors(updatedDistributors);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.pointOfView(YIWU_COORDS, 0);
    }
  }, []);

  const handleGlobeClick = useCallback(() => {
    setSelectedData(null);
    setCardPosition({ x: 0, y: 0 });
    if (globeEl.current) {
      globeEl.current.pointOfView(YIWU_COORDS, 1000);
    }
  }, []);

  return (
    <>
      <StarField />
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          pointerEvents: 'auto'
        }}
        onMouseOver={() => setIsAutoRotating(false)}
        onMouseOut={() => setIsAutoRotating(true)}
      >
        <Globe
          ref={globeEl}
          width={dimensions.width}
          height={dimensions.height}
          
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          
          initialCameraDistanceRadiusScale={2.5}
          pointOfView={YIWU_COORDS}
          
          onGlobeClick={handleGlobeClick}
          onGlobeRightClick={handleGlobeClick}
          
          autoRotate={isAutoRotating}
          autoRotateSpeed={0.5}

          rendererConfig={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
          }}
          
          customLayerData={distributors}
          customThreeObject={d => {
            // 创建圆形几何体
            const geometry = new THREE.CircleGeometry(0.5, 32);
            
            // 创建材质
            const texture = new THREE.TextureLoader().load(d.logo);
            const material = new THREE.MeshBasicMaterial({
              map: texture,
              transparent: true,
              side: THREE.DoubleSide
            });
            
            // 创建光环
            const ringGeometry = new THREE.RingGeometry(0.5, 0.52, 64);
            const ringMaterial = new THREE.MeshBasicMaterial({
              color: d.color,
              transparent: true,
              opacity: 0.7,
              side: THREE.DoubleSide,
              blending: THREE.AdditiveBlending
            });
            
            // 创建外发光环
            const glowGeometry = new THREE.RingGeometry(0.48, 0.54, 64);
            const glowMaterial = new THREE.ShaderMaterial({
              uniforms: {
                color: { value: new THREE.Color(d.color) }
              },
              vertexShader: `
                varying vec2 vUv;
                void main() {
                  vUv = uv;
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
              `,
              fragmentShader: `
                uniform vec3 color;
                varying vec2 vUv;
                void main() {
                  float dist = length(vUv - vec2(0.5));
                  float alpha = smoothstep(0.0, 1.0, 1.0 - dist);
                  gl_FragColor = vec4(color, alpha * 0.5);
                }
              `,
              transparent: true,
              blending: THREE.AdditiveBlending,
              side: THREE.DoubleSide
            });
            
            // 创建组
            const group = new THREE.Group();
            
            // 添加主圆形
            const mainCircle = new THREE.Mesh(geometry, material);
            group.add(mainCircle);
            
            // 添加光环和发光
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            group.add(ring);
            group.add(glow);
            
            // 添加动画
            let time = 0;
            const animate = () => {
              time += 0.02;
              const scale = 1 + Math.sin(time) * 0.1;
              glow.scale.set(scale, scale, 1);
              requestAnimationFrame(animate);
            };
            animate();
            
            // 设置初始大小
            group.scale.set(8, 8, 1);
            
            // 存储引用
            spritesRef.current[d.id] = group;
            
            // 添加交互事件
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2();

            const onMouseMove = (event) => {
              mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
              mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

              if (globeEl.current) {
                raycaster.setFromCamera(mouse, globeEl.current.camera());
                const intersects = raycaster.intersectObject(mainCircle);

                if (intersects.length > 0) {
                  group.scale.set(24, 24, 1);
                  ringMaterial.opacity = 0.9;
                  glowMaterial.uniforms.color.value.multiplyScalar(1.5);
                  setIsAutoRotating(false);
                } else if (selectedData?.id !== d.id) {
                  group.scale.set(8, 8, 1);
                  ringMaterial.opacity = 0.7;
                  glowMaterial.uniforms.color.value.copy(new THREE.Color(d.color));
                }
              }
            };

            const onClick = (event) => {
              mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
              mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

              if (globeEl.current) {
                raycaster.setFromCamera(mouse, globeEl.current.camera());
                const intersects = raycaster.intersectObject(mainCircle);

                if (intersects.length > 0) {
                  event.stopPropagation();
                  
                  if (selectedData?.id === d.id) {
                    // 先设置位置为 null，这样卡片就不会显示了
                    setCardPosition(null);
                    // 然后重置选中的数据
                    setSelectedData(null);
                    group.scale.set(8, 8, 1);
                    ringMaterial.opacity = 0.7;
                    glowMaterial.uniforms.color.value.copy(new THREE.Color(d.color));
                    globeEl.current.pointOfView(YIWU_COORDS, 1000);
                  } else {
                    // 先设置新的位置，再设置选中的数据
                    const newPosition = {
                      x: event.clientX,
                      y: event.clientY
                    };
                    setCardPosition(newPosition);
                    setSelectedData(d);
                    group.scale.set(24, 24, 1);
                    ringMaterial.opacity = 0.9;
                    glowMaterial.uniforms.color.value.multiplyScalar(1.5);
                    
                    globeEl.current.pointOfView({
                      lat: d.lat,
                      lng: d.lng,
                      altitude: 1.5
                    }, 1000);
                  }
                }
              }
            };

            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('click', onClick);

            group.userData = {
              cleanup: () => {
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('click', onClick);
              }
            };

            return group;
          }}
          customThreeObjectUpdate={(obj, d) => {
            Object.assign(obj.position, globeEl.current.getCoords(d.lat, d.lng, 0.1));
            obj.lookAt(globeEl.current.camera().position);
          }}
        />
      </div>
      {selectedData && <InfoCard data={selectedData} position={cardPosition} />}
    </>
  );
};

export default GlobeComponent;
