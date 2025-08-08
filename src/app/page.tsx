"use client";

import { useState } from "react";
import UnlockForm from "../components/UnlockForm";
import ScratchCard from "../components/ScratchCard";

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

	return (
		<div style={{ textAlign: "center", padding: "20px" }}>
			{!isUnlocked && <UnlockForm onUnlock={() => setIsUnlocked(true)} />}

			{isUnlocked && (
				<div>
					<h1 style={{ marginBottom: "20px" }}>Rasca y Gana</h1>
					<div style={{ textAlign: "center" }}>
						<h2>Rasca {currentScratch + 1}</h2>

						<ScratchCard
							image={images[currentScratch]}
							onScratch={() => {}}
							onRevealed={() => {
								setRevealedStates((prev) => {
									const newStates = [...prev];
									newStates[currentScratch] = true;
									return newStates;
								});
							}}
							revealed={revealedStates[currentScratch]}
						/>

						<div style={{ marginTop: "20px" }}>
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

						{/* Texto del premio debajo de los botones */}
						{revealedStates[currentScratch] && (
							<div style={{ marginTop: "15px", fontWeight: "bold" }}>
								{prizes[currentScratch]}
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
