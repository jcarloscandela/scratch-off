"use client";

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [currentScratch, setCurrentScratch] = useState(() => Math.floor(Math.random() * 5));
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  const images = [
    "/file.svg",
    "/globe.svg",
    "/next.svg",
    "/vercel.svg",
    "/window.svg",
  ];

  const prizes = [
    "Premio 1",
    "Premio 2",
    "Premio 3",
    "Premio 4",
    "Premio 5",
  ];

  const handleUnlock = () => {
    if (password === "1995") {
      setIsUnlocked(true);
    } else {
      alert("Contraseña incorrecta");
    }
  };

  const handleScratch = (index: number) => {
    const canvas = canvasRefs.current[index];
    const ctx = canvas!.getContext("2d");
if (!ctx) return;
    ctx!.globalCompositeOperation = "destination-out";

    const scratch = (e: MouseEvent) => {
      const rect = canvas!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ctx!.beginPath();
      ctx!.arc(x, y, 20, 0, 2 * Math.PI);
      ctx!.fill();
    };

    canvas!.addEventListener("mousemove", scratch);
    canvas!.addEventListener("mouseup", () => {
      canvas!.removeEventListener("mousemove", scratch);
    });
  };

  useEffect(() => {
    canvasRefs.current.forEach((canvas, index) => {
      if (canvas) {
        const ctx = canvas!.getContext("2d");
        ctx!.fillStyle = "#ccc";
        ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
      }
    });
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {!isUnlocked && (
        <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px", border: "1px solid", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
          <h2 style={{ marginBottom: "20px", color: "black" }}>Introduce la contraseña para desbloquear:</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: "10px", width: "100%", marginBottom: "10px", borderRadius: "4px", border: "1px solid #ccc", color: "black" }}
          />
          <button
            onClick={handleUnlock}
            style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            Desbloquear
          </button>
        </div>
      )}
      {isUnlocked && (
        <div>
          <h1 style={{ marginBottom: "20px" }}>Rasca y Gana</h1>
          <div style={{ textAlign: "center" }}>
            <h2>Rasca {currentScratch + 1}</h2>
            <div style={{ position: "relative", width: "100px", height: "100px", margin: "0 auto" }}>
              <canvas
                ref={(el) => {
                  canvasRefs.current[currentScratch] = el;
                }}
                width="100"
                height="100"
                style={{ position: "absolute", top: 0, left: 0, cursor: "pointer" }}
                onMouseDown={() => handleScratch(currentScratch)}
              ></canvas>
              <img
                src={images[currentScratch]}
                alt={`Imagen ${currentScratch + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
<div style={{ marginTop: "20px" }}>
  {currentScratch > 0 && (
    <button
      onClick={() => setCurrentScratch((prev) => Math.max(prev - 1, 0))}
      style={{ padding: "10px 20px", marginRight: "10px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
    >
      Anterior
    </button>
  )}
  {currentScratch < images.length - 1 && (
    <button
      onClick={() => setCurrentScratch((prev) => Math.min(prev + 1, images.length - 1))}
      style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
    >
      Siguiente intento
    </button>
  )}
</div>
          </div>
        </div>
      )}
    </div>
  );
}
