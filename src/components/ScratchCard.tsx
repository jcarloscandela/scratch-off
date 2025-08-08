"use client";

import { useRef, useEffect, useState } from "react";

interface ScratchCardProps {
  image: string;
  onScratch: () => void;
  prizeText: string;
  onRevealed: () => void;
  revealed: boolean; // Control the revealed state from parent
}

export default function ScratchCard({ image, onScratch, prizeText, onRevealed, revealed }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(revealed);

useEffect(() => {
  const canvas = canvasRef.current;
  if (canvas) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.globalCompositeOperation = "source-over"; // reset modo
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!revealed) {
        ctx.fillStyle = "#ccc";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }
  setIsRevealed(revealed);
}, [image, revealed]);


useEffect(() => {
  setIsRevealed(revealed);
}, [revealed]);

	const checkReveal = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d", { willReadFrequently: true });
		if (!ctx) return;

		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		let cleared = 0;

		for (let i = 3; i < imageData.data.length; i += 4) {
			if (imageData.data[i] === 0) cleared++;
		}

		const percent = (cleared / (canvas.width * canvas.height)) * 100;
if (percent >= 99.9 && !isRevealed) { // umbral del 100%
			setIsRevealed(true);
			onRevealed();
		}
	};

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
		checkReveal();
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
			{isRevealed && (
				<div style={{ position: "absolute", bottom: "-20px", textAlign: "center", width: "100%" }}>
					{prizeText}
				</div>
			)}
		</div>
	);
}
