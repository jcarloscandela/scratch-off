"use client";

import { useState } from "react";
import UnlockForm from "../components/UnlockForm";
import ScratchCard from "../components/ScratchCard";

function HeartsAnimation() {
  const heartsCount = 50;
  const hearts = Array.from({ length: heartsCount });

  return (
    <>
      <style>{`
        .hearts-container {
          pointer-events: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          overflow: visible;
          z-index: 9999;
          user-select: none;
        }
        .heart {
          position: absolute;
          color: #e25555;
          animation-name: floatUpAndSide;
          animation-timing-function: ease-out;
          animation-iteration-count: 1;
          animation-fill-mode: forwards;
          opacity: 0.9;
          filter: drop-shadow(0 0 1px #b33);
          will-change: transform, opacity;
        }
        @keyframes floatUpAndSide {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.9;
          }
          100% {
            transform: translate(calc(var(--side-move, 20px)), -150vh) scale(1.4);
            opacity: 0;
          }
        }
      `}</style>
      <div className="hearts-container">
        {hearts.map((_, i) => {
          const left = Math.random() * 100; // % horizontal start
          const bottom = (Math.random() * 20) - 30; // vh, start a bit below screen (-30 to -10)
          const duration = 25 + Math.random() * 10; // seg (25-35 seg)
          // Distribuir delays entre 0 y duración para animación contínua
          const delay = Math.random() * duration;
          const size = 12 + Math.random() * 25; // px (12-37 px)
          const sideMove = (Math.random() * 40 - 20).toFixed(2) + "px";

          return (
            <span
              key={i}
              className="heart"
              style={{
                left: `${left}vw`,
                bottom: `${bottom}vh`,
                fontSize: `${size}px`,
                animationDuration: `${duration}s`,
                animationDelay: `${delay}s`,
                "--side-move": sideMove,
              } as React.CSSProperties}
            >
              ❤️
            </span>
          );
        })}
      </div>
    </>
  );
}

export default function Home() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [currentScratch, setCurrentScratch] = useState(0);
  const [revealedStates, setRevealedStates] = useState<boolean[]>([false, false, false, false]);

  const images = ["/1.jpg", "/2.jpg", "/3.JPG", "/4.JPG"];
  const prizes = [
    "😢 Oh no... no ha habido suerte, sigue probando",
    "🎉✨ ¡Afortunada! Vale por una noche de mimos 💖",
    "🙈 Oh... tampoco ha habido suerte, suerte con el último 🍀",
    "🌟🍽 ¡Afortunada! Vale por una cena o comida en una ⭐ Michelin"
  ];

  const btnStyle = {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginRight: "10px"
  };

  // Detectar si el último scratch está revelado
  const lastRevealed = currentScratch === images.length - 1 && revealedStates[currentScratch];

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {!isUnlocked && <UnlockForm onUnlock={() => setIsUnlocked(true)} />}

      {isUnlocked && (
        <div>
          <h1 style={{ marginBottom: "20px" }}>Rasca y Gana</h1>
          <div style={{ textAlign: "center" }}>

            {/* Botones arriba del canvas */}
            <div style={{ marginBottom: "20px" }}>
              {currentScratch > 0 && (
                <button
                  onClick={() => setCurrentScratch((prev) => Math.max(prev - 1, 0))}
                  style={btnStyle}
                >
                  Anterior
                </button>
              )}
              {currentScratch < images.length - 1 &&
                revealedStates[currentScratch] && (
                  <button
                    onClick={() =>
                      setCurrentScratch((prev) =>
                        Math.min(prev + 1, images.length - 1)
                      )
                    }
                    style={btnStyle}
                  >
                    Siguiente intento
                  </button>
                )}
            </div>

            <h2>Rasca {currentScratch + 1}</h2>

            <ScratchCard
              image={images[currentScratch]}
              onScratch={() => { }}
              onRevealed={() => {
                setRevealedStates((prev) => {
                  const newStates = [...prev];
                  newStates[currentScratch] = true;
                  return newStates;
                });
              }}
              revealed={revealedStates[currentScratch]}
            />

            {/* Texto del premio debajo del canvas */}
            {revealedStates[currentScratch] && (
              <div style={{ marginTop: "15px", fontWeight: "bold" }}>
                {prizes[currentScratch]}
              </div>
            )}
            {/* Mensaje final si es el último rasca y está revelado */}
            {lastRevealed && (
              <div style={{ marginTop: "15px", fontWeight: "bold", whiteSpace: "pre-line" }}>
                🎂✨ ¡Feliz 30 cumpleaños!
                Por muchos más viajes y aventuras a tu lado. Que este 2025 esté lleno de momentos y recuerdos felices (no lo dudo).
                De part de Juan Carlos, t’estime molt ❤️
              </div>
            )}

            {/* Mostrar corazones animados cuando termine el último rasca */}
            {lastRevealed && <HeartsAnimation />}
          </div>
        </div>
      )}
    </div>
  );
}
