import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const SpaceBackground = ({ globeRef }) => {
  const containerRef = useRef();
  const sceneRef = useRef();
  const cameraRef = useRef();
  const rendererRef = useRef();

  useEffect(() => {
    if (!containerRef.current || !globeRef.current) return;

    // 初始化场景
    sceneRef.current = new THREE.Scene();

    // 初始化相机
    const aspect = window.innerWidth / window.innerHeight;
    cameraRef.current = new THREE.PerspectiveCamera(70, aspect, 0.1, 100);
    cameraRef.current.position.z = 0.01;

    // 初始化渲染器
    rendererRef.current = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true
    });
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(rendererRef.current.domElement);

    // 创建球形几何体
    const geometry = new THREE.SphereGeometry(8, 60, 40);
    geometry.scale(-1, 1, 1); // 将纹理内翻

    // 加载星空纹理
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('/space-background.jpg');
    texture.encoding = THREE.sRGBEncoding;
    
    // 创建材质
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      opacity: 0.4,
      transparent: true
    });

    // 创建网格
    const mesh = new THREE.Mesh(geometry, material);
    sceneRef.current.add(mesh);

    // 窗口大小变化处理
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // 动画循环
    const animate = () => {
      requestAnimationFrame(animate);

      if (globeRef.current) {
        const controls = globeRef.current.controls();
        if (controls) {
          // 同步相机位置和旋转
          const globeCamera = controls.object;
          mesh.rotation.copy(globeCamera.rotation);
        }
      }

      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };
    animate();

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current?.dispose();
    };
  }, [globeRef]);

  return (
    <div 
      ref={containerRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  );
};

export default SpaceBackground;
