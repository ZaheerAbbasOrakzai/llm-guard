import { useEffect, useRef } from 'react';

export function InteractiveOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener('resize', resize);

    let frame = 0;
    let animationId: number;

    const animate = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.3;

      ctx.clearRect(0, 0, width, height);

      // Draw multiple rotating rings
      for (let i = 0; i < 5; i++) {
        const angle = (frame * 0.01 + i * 0.5) % (Math.PI * 2);
        const ringRadius = radius + i * 15;
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle);
        
        // Create gradient for each ring
        const gradient = ctx.createLinearGradient(-ringRadius, 0, ringRadius, 0);
        gradient.addColorStop(0, `rgba(139, 92, 246, ${0.3 - i * 0.05})`);
        gradient.addColorStop(0.5, `rgba(217, 70, 239, ${0.3 - i * 0.05})`);
        gradient.addColorStop(1, `rgba(6, 182, 212, ${0.3 - i * 0.05})`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw orbiting particles
        for (let j = 0; j < 3; j++) {
          const particleAngle = (frame * 0.02 + j * (Math.PI * 2 / 3) + i * 0.3) % (Math.PI * 2);
          const px = Math.cos(particleAngle) * ringRadius;
          const py = Math.sin(particleAngle) * ringRadius;
          
          ctx.fillStyle = `rgba(139, 92, 246, ${0.8 - i * 0.1})`;
          ctx.beginPath();
          ctx.arc(px, py, 3 - i * 0.3, 0, Math.PI * 2);
          ctx.fill();
          
          // Add glow
          const glow = ctx.createRadialGradient(px, py, 0, px, py, 8);
          glow.addColorStop(0, `rgba(139, 92, 246, ${0.4 - i * 0.05})`);
          glow.addColorStop(1, 'rgba(139, 92, 246, 0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(px, py, 8, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();
      }
      
      // Draw center orb
      const centerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 0.4);
      centerGradient.addColorStop(0, 'rgba(139, 92, 246, 0.3)');
      centerGradient.addColorStop(0.5, 'rgba(217, 70, 239, 0.15)');
      centerGradient.addColorStop(1, 'rgba(6, 182, 212, 0.05)');
      
      ctx.fillStyle = centerGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.4, 0, Math.PI * 2);
      ctx.fill();
      
      frame++;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
