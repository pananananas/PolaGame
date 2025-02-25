import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Button } from "../components/ui/button";

interface SpecialModalProps {
  isOpen: boolean;
  onContinue: () => void;
}

export const SpecialModal = ({ isOpen, onContinue }: SpecialModalProps) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="bg-purple-100 border-2 border-purple-300 rounded-lg max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-purple-600 text-center">
            Congratulations! 🎉
          </DialogTitle>
          <DialogDescription className="text-center text-lg text-gray-700">
            You've reached the special milestone!
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-white p-4 rounded-lg shadow-inner">
            <p className="text-center text-xl font-medium text-gray-800">
              You're doing great! Keep flying higher!
            </p>
            <div className="flex justify-center my-4">
              <div className="text-6xl animate-bounce">🎈</div>
            </div>
            <p className="text-center text-gray-700 italic">
              The sky's the limit! Can you reach even greater heights?
            </p>
          </div>
        </div>
        
        <DialogFooter className="flex justify-center">
          <Button 
            className="bg-gradient-to-r from-purple-400 to-blue-400 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-2 px-8 rounded-full shadow-md"
            onClick={onContinue}
          >
            Continue Flying
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 