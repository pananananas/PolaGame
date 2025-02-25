import React from 'react';

interface ScoreCardProps {
  score: number;
  maxScore: number;
  className?: string;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ 
  score, 
  maxScore,
  className = ''
}) => {
  // Calculate progress percentage
  const progressPercentage = Math.min(100, (score / maxScore) * 100);
  
  return (
    <div className={`w-64 bg-white/90 rounded-xl shadow-lg p-3 mx-auto ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-lg text-pink-600">Score: {score}</h3>
        <div className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
          Goal: {maxScore}
        </div>
      </div>
      
      {/* Progress bar container */}
      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
        {/* Progress bar fill - changes color based on progress */}
        <div 
          className={`h-full rounded-full transition-all duration-300 ${getProgressColor(progressPercentage)}`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      {/* Small heart icons based on progress */}
      {/* <div className="flex space-x-1 mt-1 justify-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <div 
            key={i} 
            className={`text-xs ${i < Math.ceil(progressPercentage / 20) ? 'text-pink-500' : 'text-gray-300'}`}
          >
            ❤️
          </div>
        ))}
      </div> */}
    </div>
  );
};

// Helper function to get progress bar color based on percentage
function getProgressColor(percentage: number): string {
  if (percentage < 30) return 'bg-blue-400';
  if (percentage < 70) return 'bg-purple-400';
  return 'bg-gradient-to-r from-pink-400 to-purple-500';
} 