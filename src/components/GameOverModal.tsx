import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Button } from "../components/ui/button";

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
  goalScore = 10,
  onRetry,
  onBackToMenu
}: GameOverModalProps) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent className={`${goalReached ? 'bg-purple-100 border-purple-300' : 'bg-pink-100 border-pink-300'} border-2 rounded-lg max-w-md mx-auto`}>
        <DialogHeader>
          <DialogTitle className={`text-3xl font-bold ${goalReached ? 'text-purple-600' : 'text-pink-600'} text-center`}>
            {goalReached ? 'Congratulations!!! 🎉' : 'Game Over!'}
          </DialogTitle>
          <DialogDescription className="text-center text-lg text-gray-700">
            {goalReached 
              ? `You reached the goal of ${goalScore} points!` 
              : 'Oops! Your bird crashed.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className={`${goalReached ? 'bg-purple-50' : 'bg-white'} p-4 rounded-lg shadow-inner`}>
            <p className="text-center text-xl font-medium text-gray-800">
              Your Score: <span className={`${goalReached ? 'text-purple-600' : 'text-pink-600'} font-bold`}>{score}</span>
            </p>
            <p className="text-center text-lg font-medium text-gray-800">
              High Score: <span className="text-purple-600 font-bold">{highScore}</span>
            </p>
          </div>
          
          {goalReached && (
            <div className="text-center text-purple-700 font-medium p-2 bg-purple-50 rounded-lg">
              You've mastered the game and reached the special goal!
              <div className="text-4xl my-2">🏆</div>
            </div>
          )}
          
          <p className="text-center text-gray-700 italic">
            {score > highScore 
              ? "Awesome! You set a new high score!" 
              : goalReached ? "Amazing achievement!" : "Can you beat your high score?"}
          </p>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            className=" text-white bg-gray-400 font-bold py-2 px-8 rounded-full shadow-md"
            onClick={onBackToMenu}
          >
            Back to Menu
          </Button>
          <Button 
            className={`bg-gradient-to-r ${goalReached ? 'from-purple-400 to-indigo-400 hover:from-purple-500 hover:to-indigo-500' : 'from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500'} text-white font-bold py-2 px-8 rounded-full shadow-md`}
            onClick={onRetry}
          >
            Play Again
          </Button>
          
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 