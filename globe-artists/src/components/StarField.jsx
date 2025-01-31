import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const StarField = () => {
  const containerRef = useRef();
  const sceneRef = useRef();
  const cameraRef = useRef();
  const rendererRef = useRef();
  const starsRef = useRef([]);
  // const meteorsRef = useRef([]); 
  const frameRef = useRef();

  useEffect(() => {
    if (!containerRef.current) return;

    // 创建场景
    sceneRef.current = new THREE.Scene();

    // 创建相机
    cameraRef.current = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    cameraRef.current.position.z = 1000;

    // 创建渲染器
    rendererRef.current = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    rendererRef.current.setPixelRatio(window.devicePixelRatio);
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current.setClearColor(0x000000, 1);
    containerRef.current.appendChild(rendererRef.current.domElement);

    // 创建星星
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
      color: 0xFFFFFF,
      size: 1,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    const starVertices = [];
    const starData = [];
    for (let i = 0; i < 5000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = -Math.random() * 1000;
      starVertices.push(x, y, z);
      starData.push({
        velocity: Math.random() * 0.2 + 0.1,
        brightness: Math.random(),
        blinkSpeed: Math.random() * 0.05
      });
    }

    starGeometry.setAttribute('position', 
      new THREE.Float32BufferAttribute(starVertices, 3)
    );
    const stars = new THREE.Points(starGeometry, starMaterial);
    sceneRef.current.add(stars);
    starsRef.current = { geometry: starGeometry, data: starData };

    // 动画循环
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

      // 更新星星位置
      const positions = starsRef.current.geometry.attributes.position.array;
      const starData = starsRef.current.data;

      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] -= starData[i/3].velocity;
        if (positions[i + 1] < -1000) {
          positions[i + 1] = 1000;
        }

        // 更新星星闪烁
        starData[i/3].brightness += starData[i/3].blinkSpeed;
        if (starData[i/3].brightness > 1) {
          starData[i/3].brightness = 0;
        }
      }
      starsRef.current.geometry.attributes.position.needsUpdate = true;

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      frameRef.current = requestAnimationFrame(animate);
    };
    animate();

    // 清理函数
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (rendererRef.current && rendererRef.current.domElement) {
        containerRef.current?.removeChild(rendererRef.current.domElement);
      }
      // 清理资源
      if (starsRef.current.geometry) {
        starsRef.current.geometry.dispose();
      }
      if (stars.material) {
        stars.material.dispose();
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
};

export default StarField;
