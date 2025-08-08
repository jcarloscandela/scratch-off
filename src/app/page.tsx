"use client";

import { useState } from "react";
import UnlockForm from "../components/UnlockForm";
import ScratchCard from "../components/ScratchCard";

export default function Home() {
	const [isUnlocked, setIsUnlocked] = useState(false);
	const [currentScratch, setCurrentScratch] = useState(() => Math.floor(Math.random() * 3));
	const [revealed, setRevealed] = useState(false);

	const images = ["/1.jpg", "/2.jpg", "/3.JPG"];
	const prizes = ["Premio 1", "Premio 2", "Premio 3"];

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
			{!isUnlocked && (
				<UnlockForm onUnlock={() => setIsUnlocked(true)} />
			)}

			{isUnlocked && (
				<div>
					<h1 style={{ marginBottom: "20px" }}>Rasca y Gana</h1>
					<div style={{ textAlign: "center" }}>
						<h2>Rasca {currentScratch + 1}</h2>
						<ScratchCard
							image={images[currentScratch]}
							onScratch={() => {}}
							prizeText={prizes[currentScratch]}
							onRevealed={() => setRevealed(true)}
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
							{currentScratch < images.length - 1 && revealed && (
								<button
									onClick={() => {
										setRevealed(false);
										setCurrentScratch((prev) => Math.min(prev + 1, images.length - 1));
									}}
									style={btnStyle}
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
