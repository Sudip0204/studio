'use client';

import { useEffect, useRef } from 'react';

// Particle background component
export const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const particles: Particle[] = [];
    const numberOfParticles = 40;
    const colors = ['rgba(139, 195, 74, 0.6)', 'rgba(212, 203, 184, 0.6)']; // Shades of green and beige

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      angle: number;
      spin: number;
      color: string;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 15 + 10; // Leaves of different sizes
        this.speedX = Math.random() * 2 - 1; // Horizontal drift
        this.speedY = Math.random() * 1.5 + 0.5; // Falling speed
        this.angle = Math.random() * 360;
        this.spin = (Math.random() - 0.5) * 0.02;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = this.size / 25;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.angle += this.spin;

        // Reset particle when it goes off screen
        if (this.y > canvas.height + this.size) {
          this.y = -this.size;
          this.x = Math.random() * canvas.width;
        }
        if (this.x > canvas.width + this.size || this.x < -this.size) {
            this.x = Math.random() * canvas.width;
            this.y = -this.size;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        // A more detailed leaf shape
        ctx.moveTo(0, -this.size);
        ctx.quadraticCurveTo(this.size, 0, 0, this.size);
        ctx.quadraticCurveTo(-this.size, 0, 0, -this.size);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    const init = () => {
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const particle of particles) {
        particle.update();
        particle.draw();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 -z-10 w-full h-full bg-beige-50" />;
};
