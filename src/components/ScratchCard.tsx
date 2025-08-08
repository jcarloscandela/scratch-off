"use client";

import { useRef, useEffect, useState } from "react";

interface ScratchCardProps {
	image: string;
	onScratch: () => void;
	onRevealed: () => void;
	revealed: boolean;
}

export default function ScratchCard({
	image,
	onScratch,
	onRevealed,
	revealed
}: ScratchCardProps) {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const imgRef = useRef<HTMLImageElement | null>(null);
	const [isRevealed, setIsRevealed] = useState(revealed);
	const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
	const [imageLoaded, setImageLoaded] = useState(false); // Nuevo estado

	// Ajustar tamaño del canvas al tamaño real de la imagen
	useEffect(() => {
		if (imgRef.current) {
			const handleResize = () => {
				if (imgRef.current) {
					setCanvasSize({
						width: imgRef.current.clientWidth,
						height: imgRef.current.clientHeight
					});
				}
			};
			handleResize();
			window.addEventListener("resize", handleResize);
			return () => window.removeEventListener("resize", handleResize);
		}
	}, [image]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas) {
			const ctx = canvas.getContext("2d");
			if (ctx) {
				ctx.globalCompositeOperation = "source-over";
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				if (!revealed && imageLoaded) { // solo pintar si la imagen está cargada
					ctx.fillStyle = "#ccc";
					ctx.fillRect(0, 0, canvas.width, canvas.height);

					// Dibujar texto centrado
					const fontSize = Math.min(canvas.width, canvas.height) / 10;
					ctx.font = `${fontSize}px Arial`;
					ctx.fillStyle = "#666"; // color del texto (oscuro sobre gris)
					ctx.textAlign = "center";
					ctx.textBaseline = "middle";
					ctx.fillText("Rasca para ver el premio", canvas.width / 2, canvas.height / 2);
				}
			}
		}
		setIsRevealed(revealed);
	}, [image, revealed, canvasSize, imageLoaded]);

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

		if (percent >= 90 && !isRevealed) {
			setIsRevealed(true);
			onRevealed();
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}
	};

	const handleScratch = (e: React.MouseEvent<HTMLCanvasElement>) => {
		if (!imageLoaded) return; // Si la imagen no está cargada, no permitir rascar

		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		ctx.globalCompositeOperation = "destination-out";

		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		ctx.beginPath();
		ctx.arc(x, y, 50, 0, 2 * Math.PI);
		ctx.fill();

		onScratch();
		checkReveal();
	};

	return (
		<div style={{ position: "relative", display: "inline-block", width: "100%", maxWidth: "500px" }}>
			{/* Renderizar el canvas solo si la imagen está cargada */}
			{imageLoaded && (
				<canvas
					ref={canvasRef}
					width={canvasSize.width}
					height={canvasSize.height}
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						cursor: "pointer",
						width: "100%",
						height: "auto"
					}}
					onMouseDown={handleScratch}
				></canvas>
			)}
			<img
				ref={imgRef}
				src={image}
				alt="Scratch card"
				style={{
					width: "100%",
					height: "auto",
					display: "block"
				}}
				onLoad={() => {
					if (imgRef.current) {
						setCanvasSize({
							width: imgRef.current.clientWidth,
							height: imgRef.current.clientHeight
						});
						setImageLoaded(true); // Marcar la imagen como cargada aquí
					}
				}}
			/>
		</div>
	);
}
