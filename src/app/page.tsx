"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { PetType, DEFAULT_PET } from "~/utils/pets";

// Dynamically import components to avoid hydration issues
const Game = dynamic(
  () => import("~/components/Game").then((mod) => mod.Game),
  { ssr: false },
);
const WelcomeScreen = dynamic(
  () => import("~/components/WelcomeScreen").then((mod) => mod.WelcomeScreen),
  { ssr: false },
);

export default function HomePage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [selectedPet, setSelectedPet] = useState<PetType>(DEFAULT_PET);

  // Initialize high score from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedHighScore = localStorage.getItem("flappyHighScore");
      if (savedHighScore) {
        setHighScore(parseInt(savedHighScore, 10));
      }
    }
  }, []);

  // Update high score when it changes (for the welcome screen)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedHighScore = localStorage.getItem("flappyHighScore");
      if (savedHighScore) {
        const highScoreNum = parseInt(savedHighScore, 10);
        if (highScoreNum !== highScore) {
          setHighScore(highScoreNum);
        }
      }
    }
  }, [gameStarted, highScore]);

  const handleStartGame = (petType: PetType) => {
    setSelectedPet(petType);
    setGameStarted(true);
  };

  const handleBackToMenu = () => {
    setGameStarted(false);
  };

  return (
    <main className="container relative h-screen w-full overflow-hidden">
      {gameStarted ? (
        <Game 
          petType={selectedPet} 
          onBackToMenu={handleBackToMenu}
        />
      ) : (
        <WelcomeScreen onStart={handleStartGame} highScore={highScore} />
      )}
    </main>
  );
}
