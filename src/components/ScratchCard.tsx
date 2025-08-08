"use client";

import { useRef, useEffect } from "react";

interface ScratchCardProps {
  image: string;
  onScratch: () => void;
}

export default function ScratchCard({ image, onScratch }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ccc";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  const handleScratch = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.globalCompositeOperation = "destination-out";

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI);
    ctx.fill();

    onScratch();
  };

  return (
    <div style={{ position: "relative", width: "100px", height: "100px", margin: "0 auto" }}>
      <canvas
        ref={canvasRef}
        width="100"
        height="100"
        style={{ position: "absolute", top: 0, left: 0, cursor: "pointer" }}
        onMouseDown={handleScratch}
      ></canvas>
      <img
        src={image}
        alt="Scratch card"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
}
