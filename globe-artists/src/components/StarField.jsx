import React, { useEffect, useRef } from 'react';
import './StarField.css';

const StarField = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // 设置画布大小
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // 创建星星
    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 1.5 + Math.random() * 2.5,
      speed: Math.random() * 0.5
    }));

    // 初始化背景
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 动画循环
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      stars.forEach(star => {
        // 星星本体
        const gradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.size
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // 星星光晕
        const glowSize = star.size * 2;
        const glow = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, glowSize
        );
        glow.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
        glow.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
        glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(star.x, star.y, glowSize, 0, Math.PI * 2);
        ctx.fill();

        star.y = (star.y + star.speed) % canvas.height;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="starfield-canvas"
    />
  );
};

export default StarField;
