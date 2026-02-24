"use client";

import React, { useEffect, useRef } from "react";

const BackgroundCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let stars: {
      x: number;
      y: number;
      size: number;
      opacity: number;
      speed: number;
      color: string;
    }[] = [];
    const numStars = 300;

    // Image theme ke hisaab se colors (White, Purple, Blue-ish)
    const starColors = [
      "rgba(255, 255, 255,", // White
      "rgba(180, 160, 255,", // Light Purple
      "rgba(140, 180, 255,", // Soft Blue
      "rgba(230, 190, 255,", // Pale Lavender
    ];

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = [];

      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.8, // Thode stars bade thode chhote
          opacity: Math.random(),
          speed: (Math.random() - 0.5) * 0.005,
          // Random color select karein palette se
          color: starColors[Math.floor(Math.random() * starColors.length)],
        });
      }
    };

    const animate = () => {
      // Clear canvas (background black rakhein)
      ctx.fillStyle = "#050508";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);

        // Dynamic opacity with chosen color
        ctx.fillStyle = `${star.color} ${star.opacity})`;

        // Glow effect (thoda heavy ho sakta hai, performance check kar lena)
        if (star.size > 1.2) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = "white";
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fill();

        // Twinkling effect
        star.opacity += star.speed;
        if (star.opacity > 0.9 || star.opacity < 0.1) {
          star.speed = -star.speed;
        }
      });
      requestAnimationFrame(animate);
    };

    init();
    animate();

    window.addEventListener("resize", init);
    return () => window.removeEventListener("resize", init);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
      }}
    />
  );
};

export default BackgroundCanvas;
