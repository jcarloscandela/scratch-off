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
	const [imageLoaded, setImageLoaded] = useState(false);
	const [isDrawing, setIsDrawing] = useState(false);

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
				if (!revealed && imageLoaded) {
					ctx.fillStyle = "#ccc";
					ctx.fillRect(0, 0, canvas.width, canvas.height);
					const fontSize = Math.min(canvas.width, canvas.height) / 10;
					ctx.font = `${fontSize}px Arial`;
					ctx.fillStyle = "#666";
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

	const scratch = (x: number, y: number) => {
		if (!imageLoaded) return;
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		ctx.globalCompositeOperation = "destination-out";
		ctx.beginPath();
		ctx.arc(x, y, 30, 0, 2 * Math.PI);
		ctx.fill();
		onScratch();
		checkReveal();
	};

	const getPointerPos = (e: MouseEvent | TouchEvent) => {
		const canvas = canvasRef.current;
		if (!canvas) return { x: 0, y: 0 };
		const rect = canvas.getBoundingClientRect();
		let clientX = 0;
		let clientY = 0;

		if (e instanceof TouchEvent) {
			clientX = e.touches[0].clientX;
			clientY = e.touches[0].clientY;
		} else {
			clientX = e.clientX;
			clientY = e.clientY;
		}

		return {
			x: clientX - rect.left,
			y: clientY - rect.top
		};
	};

	const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
		e.preventDefault();
		setIsDrawing(true);
		const { x, y } = getPointerPos(e.nativeEvent);
		scratch(x, y);
	};

	const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
		if (!isDrawing) return;
		e.preventDefault();
		const { x, y } = getPointerPos(e.nativeEvent);
		scratch(x, y);
	};

	const handleEnd = () => {
		setIsDrawing(false);
	};

	return (
		<div style={{ position: "relative", display: "inline-block", width: "100%", maxWidth: "500px" }}>
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
					onMouseDown={handleStart}
					onMouseMove={handleMove}
					onMouseUp={handleEnd}
					onMouseLeave={handleEnd}
					onTouchStart={handleStart}
					onTouchMove={handleMove}
					onTouchEnd={handleEnd}
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
						setImageLoaded(true);
					}
				}}
			/>
		</div>
	);
}
