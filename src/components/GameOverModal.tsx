import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import React from "react";

interface GameOverModalProps {
  isOpen: boolean;
  score: number;
  highScore: number;
  goalReached: boolean;
  goalScore: number;
  onRetry: () => void;
  onBackToMenu: () => void;
}

export const GameOverModal = ({
  isOpen,
  score,
  highScore,
  goalReached = false,
  goalScore = 25,
  onRetry,
  onBackToMenu,
}: GameOverModalProps) => {
  // Stop propagation for any clicks inside the modal
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Dialog open={isOpen}>
      <div onClick={handleModalClick}>
        <DialogContent
          className={`${goalReached ? "border-purple-300 bg-purple-100" : "border-pink-300 bg-pink-100"} mx-auto max-w-md rounded-lg border-2`}
        >
          <DialogHeader>
            <DialogTitle
              className={`text-3xl font-bold ${goalReached ? "text-purple-600" : "text-pink-600"} text-center`}
            >
              {goalReached ? "Congratulationes! 🎉" : "Game Over!"}
            </DialogTitle>
            <DialogDescription className="text-center text-lg text-gray-700">
              {goalReached
                ? `Osiągnęłaś cel ${goalScore} punktów!`
                : "Oops! Twój ptasiuk spadł :c"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div
              className={`${goalReached ? "bg-purple-50" : "bg-white"} rounded-lg p-4 shadow-inner`}
            >
              <p className="text-center text-xl font-medium text-gray-800">
                Your Score:{" "}
                <span
                  className={`${goalReached ? "text-purple-600" : "text-pink-600"} font-bold`}
                >
                  {score}
                </span>
              </p>
              <p className="text-center text-lg font-medium text-gray-800">
                High Score:{" "}
                <span className="font-bold text-purple-600">{highScore}</span>
              </p>
            </div>

            {goalReached && (
              <div className="rounded-lg bg-purple-50 p-2 text-center font-medium text-purple-400">
                A nagrodą jest{" "}
                <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text font-bold text-transparent">
                  wałczer{" "}
                </span>{" "}
                na obiedek w wybranym lokalu!!!
                <div className="my-2 text-4xl">🏆</div>
              </div>
            )}

            <p className="text-center italic text-gray-700">
              {score > highScore
                ? "WOW! Nowy rekord!"
                : goalReached
                  ? ""
                  : "Czy uda Ci się poprawić swój wynik?"}
            </p>
          </div>

          <DialogFooter className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              className={`bg-gradient-to-r ${goalReached ? "from-purple-400 to-indigo-400 hover:from-purple-500 hover:to-indigo-500" : "from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500"} rounded-full px-8 py-2 font-bold text-white shadow-md`}
              onClick={onRetry}
            >
              Zagraj ponownie
            </Button>
            <Button
              className="rounded-full bg-gray-400 px-8 py-2 font-bold text-white shadow-md"
              onClick={onBackToMenu}
            >
              Wróć do menu
            </Button>
          </DialogFooter>
        </DialogContent>
      </div>
    </Dialog>
  );
};
