'use client';

import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  size: number;
  shape: 'square' | 'circle' | 'star' | 'ribbon';
  opacity: number;
  gravity: number;
  drag: number;
  wobble: number;
  wobbleSpeed: number;
}

interface ConfettiProps {
  isActive: boolean;
  duration?: number;
  particleCount?: number;
  colors?: string[];
  onComplete?: () => void;
}

const defaultColors = [
  '#10B981', // emerald
  '#3B82F6', // blue
  '#8B5CF6', // violet
  '#F59E0B', // amber
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#F43F5E', // rose
  '#84CC16', // lime
];

export function Confetti({
  isActive,
  duration = 4000,
  particleCount = 150,
  colors = defaultColors,
  onComplete,
}: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const createParticle = useCallback((centerX: number, centerY: number): Particle => {
    const angle = Math.random() * Math.PI * 2;
    const velocity = 8 + Math.random() * 12;
    const shapes: Particle['shape'][] = ['square', 'circle', 'star', 'ribbon'];
    
    return {
      x: centerX + (Math.random() - 0.5) * 100,
      y: centerY,
      vx: Math.cos(angle) * velocity * (0.5 + Math.random()),
      vy: Math.sin(angle) * velocity - 10 - Math.random() * 5,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 15,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 6 + Math.random() * 10,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      opacity: 1,
      gravity: 0.25 + Math.random() * 0.15,
      drag: 0.98 + Math.random() * 0.015,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.05 + Math.random() * 0.1,
    };
  }, [colors]);

  const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    const spikes = 5;
    const outerRadius = size;
    const innerRadius = size / 2;
    let rot = Math.PI / 2 * 3;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(x, y - outerRadius);
    
    for (let i = 0; i < spikes; i++) {
      ctx.lineTo(x + Math.cos(rot) * outerRadius, y + Math.sin(rot) * outerRadius);
      rot += step;
      ctx.lineTo(x + Math.cos(rot) * innerRadius, y + Math.sin(rot) * innerRadius);
      rot += step;
    }
    
    ctx.lineTo(x, y - outerRadius);
    ctx.closePath();
    ctx.fill();
  };

  const drawRibbon = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    ctx.moveTo(x - size / 2, y - size);
    ctx.quadraticCurveTo(x, y - size / 2, x + size / 2, y - size);
    ctx.quadraticCurveTo(x, y, x - size / 2, y + size);
    ctx.quadraticCurveTo(x, y + size / 2, x + size / 2, y + size);
    ctx.quadraticCurveTo(x, y, x - size / 2, y - size);
    ctx.fill();
  };

  const drawParticle = (ctx: CanvasRenderingContext2D, p: Particle) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;
    
    // Add glow effect
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 8;

    switch (p.shape) {
      case 'square':
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        break;
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'star':
        drawStar(ctx, 0, 0, p.size / 2);
        break;
      case 'ribbon':
        drawRibbon(ctx, 0, 0, p.size / 2);
        break;
    }

    ctx.restore();
  };

  const animate = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current = particlesRef.current.filter(p => {
      // Update physics
      p.vy += p.gravity;
      p.vx *= p.drag;
      p.vy *= p.drag;
      
      // Wobble effect
      p.wobble += p.wobbleSpeed;
      p.x += p.vx + Math.sin(p.wobble) * 2;
      p.y += p.vy;
      
      p.rotation += p.rotationSpeed;
      
      // Fade out in last 30%
      if (progress > 0.7) {
        p.opacity = Math.max(0, 1 - (progress - 0.7) / 0.3);
      }

      // Remove if off screen or invisible
      if (p.y > canvas.height + 50 || p.opacity <= 0) return false;

      drawParticle(ctx, p);
      return true;
    });

    if (progress < 1 || particlesRef.current.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      onComplete?.();
    }
  }, [duration, onComplete]);

  const burst = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Multiple burst points for epic effect
    const burstPoints = [
      { x: canvas.width * 0.5, y: canvas.height * 0.4 },
      { x: canvas.width * 0.3, y: canvas.height * 0.5 },
      { x: canvas.width * 0.7, y: canvas.height * 0.5 },
    ];

    particlesRef.current = [];
    const particlesPerBurst = Math.floor(particleCount / burstPoints.length);

    burstPoints.forEach(point => {
      for (let i = 0; i < particlesPerBurst; i++) {
        particlesRef.current.push(createParticle(point.x, point.y));
      }
    });

    startTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(animate);
  }, [particleCount, createParticle, animate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  useEffect(() => {
    if (isActive) {
      burst();
      // Second burst after slight delay for layered effect
      setTimeout(burst, 200);
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isActive, burst]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-100"
      style={{ background: 'transparent' }}
    />
  );
}