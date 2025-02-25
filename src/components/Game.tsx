import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Bird } from '~/components/Bird';
import { Pipe } from '~/components/Pipe';
import { GameOverModal } from '~/components/GameOverModal';
import { ScoreCard } from '~/components/ScoreCard';
import { PetType, getPetById } from '~/utils/pets';
import { getGradientClasses } from '~/utils/tailwind-utils';
import { toast } from 'sonner';

// Game constants - these will be adjusted based on screen size
const BASE_GRAVITY = 0.4;
const BASE_JUMP_FORCE = -8;
const BASE_PIPE_WIDTH = 80;
const BASE_PIPE_GAP = 200;
const BASE_PIPE_SPEED = 4;
const SPEED_INCREASE_RATE = 0.1;
const BASE_MAX_PIPE_SPEED = 8;
const SPECIAL_SCORE_THRESHOLD = 25;
const INITIAL_PIPE_DISTANCE = 800; // Base distance for the first pipe
const TAP_COOLDOWN = 200;          // Cooldown between taps in milliseconds to prevent double taps

// Bird hitbox adjustment (smaller values = smaller hitbox)
const BIRD_HITBOX_SIZE_DESKTOP = 15;
const BIRD_HITBOX_SIZE_MOBILE = 10; // Smaller hitbox for mobile
// Pipe hitbox margin for rounded corners
const PIPE_HITBOX_MARGIN = 5;

// Game interface
interface GameProps {
  petType: PetType;
  onBackToMenu: () => void;
}

// Declare the global interface for TypeScript
declare global {
  interface Window {
    gameDebug?: {
      startGame: () => void;
      endGame: () => void;
      getPipes: () => { x: number, topHeight: number }[];
      getBirdPosition: () => number;
    };
  }
}

export const Game = ({ petType = 'bird', onBackToMenu }: GameProps) => {
  const router = useRouter();
  const pet = getPetById(petType);
  
  // Screen size adaptive values
  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [screenHeight, setScreenHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 800);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  
  // Responsive game constants
  const gravity = isMobile ? BASE_GRAVITY * 0.8 : BASE_GRAVITY;
  const jumpForce = isMobile ? BASE_JUMP_FORCE * 0.85 : BASE_JUMP_FORCE;
  const pipeWidth = Math.min(BASE_PIPE_WIDTH, screenWidth * 0.12); // Make pipes scale with screen width
  const pipeGap = isMobile ? BASE_PIPE_GAP * 1.1 : BASE_PIPE_GAP; // Slightly wider gap on mobile
  const baseSpeed = isMobile ? BASE_PIPE_SPEED * 0.85 : BASE_PIPE_SPEED; // Slower on mobile
  const maxSpeed = isMobile ? BASE_MAX_PIPE_SPEED * 0.8 : BASE_MAX_PIPE_SPEED;
  const initialPipeDistance = isMobile ? INITIAL_PIPE_DISTANCE * 0.8 : INITIAL_PIPE_DISTANCE;
  // Set bird hitbox size based on device type
  const birdHitboxSize = isMobile ? BIRD_HITBOX_SIZE_MOBILE : BIRD_HITBOX_SIZE_DESKTOP;
  
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  // Bird state
  const [birdPosition, setBirdPosition] = useState(300);
  const [birdVelocity, setBirdVelocity] = useState(0);
  
  // Game speed state
  const [currentSpeed, setCurrentSpeed] = useState(baseSpeed);
  
  // Direct mutable refs for real-time updates (not subject to React batching)
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const pipeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const scoreRef = useRef(0);
  const lastTapTimeRef = useRef(0); // Track the last tap time for debouncing
  
  // Game logic refs (these bypass React's rendering cycle for smoother animation)
  const birdPosRef = useRef(300);
  const birdVelRef = useRef(0);
  const pipesRef = useRef<{ x: number, topHeight: number }[]>([]);
  const gameStartedRef = useRef(false);
  const gameOverRef = useRef(false);
  const lastUpdateTimeRef = useRef(0);
  const speedRef = useRef(baseSpeed);
  const isPausedRef = useRef(false);
  
  // Screen resize handling
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setScreenWidth(width);
      setScreenHeight(height);
      setIsMobile(width < 768);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initialize on mount
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Initialize high score from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedHighScore = localStorage.getItem('flappyHighScore');
      if (savedHighScore) {
        setHighScore(parseInt(savedHighScore, 10));
      }
    }
    
    // Debug helper
    window.gameDebug = {
      startGame,
      endGame,
      getPipes: () => pipesRef.current,
      getBirdPosition: () => birdPosRef.current
    };
    
    return () => {
      // Clear debug object
      if (window.gameDebug) {
        window.gameDebug = undefined;
      }
    };
  }, []);
  
  // Create new pipes
  const createPipe = useCallback(() => {
    if (!gameAreaRef.current) {
      return;
    }
    
    const height = gameAreaRef.current.clientHeight;
    const width = screenWidth;
    
    // For mobile, ensure the pipe gap is never in the bottom 1/3 of the screen
    let minTopHeight, maxTopHeight;
    
    if (isMobile) {
      // Calculate bottom 1/3 boundary
      const bottomThird = height * (2/3);
      
      // Ensure the top of the bottom pipe is above the bottom 1/3 of the screen
      minTopHeight = 80; // Minimum safe distance from top
      
      // Calculate maximum top height to ensure bottom pipe starts above bottom third
      // This means the gap (where bird flies through) ends before the bottom 1/3 starts
      maxTopHeight = Math.floor(bottomThird - pipeGap - 40); // Extra margin to be safe
      
      // Log to debug pipe positions
      console.log(`Creating pipe - screen height: ${height}, bottom third boundary: ${bottomThird}, max top pipe height: ${maxTopHeight}`);
    } else {
      minTopHeight = 50;
      maxTopHeight = height - pipeGap - 50;
    }
    
    // Ensure maxTopHeight is never less than minTopHeight
    maxTopHeight = Math.max(maxTopHeight, minTopHeight + 10);
    
    const topHeight = Math.floor(Math.random() * (maxTopHeight - minTopHeight)) + minTopHeight;
    
    // Verify the pipe gap position doesn't extend into bottom third
    if (isMobile) {
      const bottomPipeTop = topHeight + pipeGap;
      const bottomThird = height * (2/3);
      console.log(`Pipe gap check - bottom pipe starts at: ${bottomPipeTop}, bottom third boundary: ${bottomThird}`);
    }
    
    // Add pipe to our mutable ref
    const newPipe = { x: width, topHeight };
    pipesRef.current = [...pipesRef.current, newPipe];
  }, [screenWidth, pipeGap, isMobile, screenHeight]);
  
  // End game - define before other functions that use it
  const endGame = useCallback(() => {
    // Update refs - BUT KEEP THE PIPES
    gameOverRef.current = true;
    gameStartedRef.current = false; // Explicitly set game as not started when ending
    
    // Update React state
    setGameStarted(false); // Update React state to match ref
    setGameOver(true);
    
    // Stop animation and intervals
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    
    if (pipeIntervalRef.current) {
      clearInterval(pipeIntervalRef.current);
      pipeIntervalRef.current = null;
    }
    
    // Update high score
    if (scoreRef.current > highScore) {
      setHighScore(scoreRef.current);
      if (typeof window !== 'undefined') {
        localStorage.setItem('flappyHighScore', String(scoreRef.current));
      }
    }
  }, [highScore]);
  
  // Game loop - defined before it's used
  const gameLoop = useCallback((timestamp: number) => {
    if (!gameAreaRef.current) {
      frameRef.current = requestAnimationFrame(gameLoop);
      return;
    }
    
    // Calculate elapsed time since last frame in seconds
    const deltaTime = Math.min(0.1, (timestamp - lastUpdateTimeRef.current) / 1000);
    lastUpdateTimeRef.current = timestamp;
    
    if (gameStartedRef.current && !gameOverRef.current && !isPausedRef.current) {
      // Update bird velocity and position using smooth physics with deltaTime
      // Apply screen-size-adjusted gravity
      birdVelRef.current += gravity * deltaTime * 60;
      birdPosRef.current += birdVelRef.current * deltaTime * 60;
      
      // Check if bird hits top or bottom
      if (birdPosRef.current < 0 || birdPosRef.current > gameAreaRef.current.clientHeight - 50) {
        endGame();
      } else {
        // Update pipes
        const newPipes: typeof pipesRef.current = [];
        
        // Calculate current speed based on score and screen size
        const currentSpeed = Math.min(maxSpeed, baseSpeed + (scoreRef.current * SPEED_INCREASE_RATE));
        speedRef.current = currentSpeed;
        
        for (const pipe of pipesRef.current) {
          // Move pipe based on deltaTime and current speed
          const newX = pipe.x - currentSpeed * deltaTime * 60;
          
          // Only keep pipes that are still on screen
          if (newX > -pipeWidth) {
            newPipes.push({ ...pipe, x: newX });
          }
          
          // Check for score - bird passes pipe center
          if (pipe.x >= 100 - currentSpeed && newX < 100 - currentSpeed) {
            scoreRef.current += 1;
            
            // Update React state (less frequent than position updates)
            setScore(scoreRef.current);
            
            // Update current speed in React state for UI
            setCurrentSpeed(speedRef.current);
            
            // Show congratulations message when reaching the threshold using Sonner toast
            if (scoreRef.current === SPECIAL_SCORE_THRESHOLD) {
              toast.success('YOOOOOO czeka na Ciebie nagroda :>', {
                // description: `You reached ${SPECIAL_SCORE_THRESHOLD} points! Keep going!`,
                icon: '🎉',
                duration: 4000,
                position: 'top-center',
                style: {
                  background: 'rgba(243, 232, 255, 0.95)', // Light purple background with transparency
                  border: '2px solid #a855f7', // Purple border
                  color: '#6b21a8', // Dark purple text
                  padding: '16px',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(168, 85, 247, 0.4), 0 10px 10px -5px rgba(168, 85, 247, 0.2)',
                  fontWeight: '600'
                },
              });
            }
          }
          
          // Circle to rectangle collision detection - adjusted for pipe width
          // Calculate center of bird circle
          const birdCenterX = 100;
          const birdCenterY = birdPosRef.current;
          
          // Top pipe (with margin for rounded corners)
          const topPipeRect = {
            left: pipe.x + PIPE_HITBOX_MARGIN,
            right: pipe.x + pipeWidth - PIPE_HITBOX_MARGIN,
            top: 0,
            bottom: pipe.topHeight - PIPE_HITBOX_MARGIN
          };
          
          // Bottom pipe (with margin for rounded corners)
          const bottomPipeRect = {
            left: pipe.x + PIPE_HITBOX_MARGIN,
            right: pipe.x + pipeWidth - PIPE_HITBOX_MARGIN,
            top: pipe.topHeight + pipeGap + PIPE_HITBOX_MARGIN,
            bottom: gameAreaRef.current.clientHeight
          };
          
          // Check for collision - use device-specific hitbox size
          const topCollision = circleRectangleCollision(
            birdCenterX, birdCenterY, birdHitboxSize,
            topPipeRect.left, topPipeRect.top, 
            topPipeRect.right - topPipeRect.left, 
            topPipeRect.bottom - topPipeRect.top
          );
          
          const bottomCollision = circleRectangleCollision(
            birdCenterX, birdCenterY, birdHitboxSize,
            bottomPipeRect.left, bottomPipeRect.top, 
            bottomPipeRect.right - bottomPipeRect.left, 
            bottomPipeRect.bottom - bottomPipeRect.top
          );
          
          if (topCollision || bottomCollision) {
            endGame();
            break;
          }
        }
        
        // Update pipes ref with new positions
        pipesRef.current = newPipes;
      }
      
      // Update UI state (this limits UI updates to 60fps to avoid React performance issues)
      setBirdPosition(Math.round(birdPosRef.current));
      setBirdVelocity(birdVelRef.current);
    }
    
    // Continue the game loop if game is still active
    if (!gameOverRef.current) {
      frameRef.current = requestAnimationFrame(gameLoop);
    }
  }, [gravity, baseSpeed, maxSpeed, pipeWidth, pipeGap, endGame, birdHitboxSize]);
  
  // Handle jump with debounce to prevent double taps
  const handleJump = useCallback(() => {
    const now = Date.now();
    
    // Check for tap cooldown to prevent double taps
    if (now - lastTapTimeRef.current < TAP_COOLDOWN) {
      // Too soon since last tap, ignore this tap
      return;
    }
    
    // Update the last tap time
    lastTapTimeRef.current = now;
    
    // If game is over, don't allow jumps, even for starting a new game
    if (gameOverRef.current) return;
    
    if (!gameStartedRef.current) {
      startGame();
      return;
    }
    
    if (isPausedRef.current) return;
    
    // Directly update velocity ref with screen-size adjusted jump force
    birdVelRef.current = jumpForce;
  }, [jumpForce]);
  
  // Start game
  const startGame = useCallback(() => {
    // Update React state
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setCurrentSpeed(baseSpeed);
    
    // Update refs
    scoreRef.current = 0;
    birdPosRef.current = 300;
    birdVelRef.current = 0;
    speedRef.current = baseSpeed;
    pipesRef.current = [];
    gameStartedRef.current = true;
    gameOverRef.current = false;
    isPausedRef.current = false;
    lastTapTimeRef.current = 0; // Reset the tap timer
    
    // Update UI state for bird position
    setBirdPosition(300);
    setBirdVelocity(0);
    
    // Clean up any existing intervals/animations
    if (pipeIntervalRef.current) {
      clearInterval(pipeIntervalRef.current);
      pipeIntervalRef.current = null;
    }
    
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    
    // Create the first pipe at a farther distance for better mobile experience
    // For the first pipe, force it to be in a safe position for easier start
    if (gameAreaRef.current) {
      const height = gameAreaRef.current.clientHeight;
      const safeTopHeight = Math.floor(height * 0.4); // Put gap in middle area of screen for first pipe
      pipesRef.current = [{ x: initialPipeDistance, topHeight: safeTopHeight }];
    } else {
      pipesRef.current = [{ x: initialPipeDistance, topHeight: Math.floor(Math.random() * (300 - 100)) + 100 }];
    }
    
    // Create additional pipes at regular intervals - adjusted for screen size
    const pipeInterval = isMobile ? 2200 : 1800; // More time between pipes on mobile
    pipeIntervalRef.current = setInterval(createPipe, pipeInterval);
    
    // Start game loop with timestamp
    lastUpdateTimeRef.current = performance.now();
    frameRef.current = requestAnimationFrame(gameLoop);
  }, [baseSpeed, createPipe, gameLoop, initialPipeDistance, isMobile, pipeGap]);
  
  // Handle visibility change for pause/resume
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Game is paused when tab loses focus
        isPausedRef.current = true;
      } else {
        // Game resumes when tab regains focus
        isPausedRef.current = false;
        if (gameStartedRef.current && !gameOverRef.current) {
          // Update timestamp to prevent large time jumps
          lastUpdateTimeRef.current = performance.now();
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      console.log("Cleaning up game...");
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (pipeIntervalRef.current) {
        clearInterval(pipeIntervalRef.current);
      }
    };
  }, []);
  
  // Set up keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        handleJump();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleJump]);
  
  // Enable auto-start when component mounts
  useEffect(() => {
    startGame();
  }, [startGame]);
  
  // Handle touch/click controls
  const handleTouchStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault(); // Prevent default to avoid double firing on mobile
    
    // Don't process clicks/touches at all when game is over
    if (gameOver) return;
    
    handleJump();
  }, [handleJump, gameOver]);

  // Generate gradient classes for custom pet background
  const bgGradientClasses = getGradientClasses(pet.backgroundColor.from, pet.backgroundColor.to);
  
  // More visible debugging output
  console.log('🎨 BACKGROUND DEBUG:', {
    petType,
    petName: pet.name,
    fromColor: pet.backgroundColor.from,
    toColor: pet.backgroundColor.to,
    generatedClasses: bgGradientClasses,
    fullClass: `bg-gradient-to-b ${bgGradientClasses}`
  });

  return (
    <div className="relative w-full h-full overflow-hidden" ref={gameAreaRef}>
      {/* Game area with pet-specific background */}
      <div 
        className={`absolute inset-0 w-full h-full bg-gradient-to-b ${bgGradientClasses} game-background-debug pet-bg-${petType}`}
        onClick={gameOver ? undefined : handleJump}
        onTouchStart={gameOver ? undefined : handleTouchStart}
        style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}
      >
        {/* Game elements - moved to a container to preserve background visibility */}
        <div className="relative w-full h-full">
          {/* Bird - use imageUrl if provided and pass velocity for better rotation */}
          <Bird 
            position={birdPosition} 
            petType={petType} 
            imageUrl={pet.imageUrl}
            disableAnimation={true}
            velocity={birdVelocity}
          />
          
          {/* Pipes - render from React state to be more efficient */}
          {pipesRef.current.map((pipe, index) => (
            <Pipe 
              key={`pipe-${index}`}
              x={pipe.x} 
              topHeight={pipe.topHeight} 
              gap={pipeGap} 
              width={pipeWidth}
              color={pet.pipeColor}
            />
          ))}
          
          {/* Score Card - moved to end so it renders on top */}
          <ScoreCard 
            score={score} 
            maxScore={SPECIAL_SCORE_THRESHOLD} 
            className="absolute top-5 left-0 right-0 mx-auto z-10"
          />
        </div>
      </div>
      
      {/* Game over modal */}
      <GameOverModal 
        isOpen={gameOver} 
        score={score} 
        highScore={highScore}
        goalReached={score >= SPECIAL_SCORE_THRESHOLD}
        goalScore={SPECIAL_SCORE_THRESHOLD}
        onRetry={startGame}
        onBackToMenu={onBackToMenu}
      />
    </div>
  );
};

// Add helper function for circle-rectangle collision detection
const circleRectangleCollision = (
  circleX: number, circleY: number, radius: number,
  rectX: number, rectY: number, rectWidth: number, rectHeight: number
): boolean => {
  // Find the closest point in the rectangle to the circle
  const closestX = Math.max(rectX, Math.min(circleX, rectX + rectWidth));
  const closestY = Math.max(rectY, Math.min(circleY, rectY + rectHeight));
  
  // Calculate the distance between the circle's center and the closest point
  const distanceX = circleX - closestX;
  const distanceY = circleY - closestY;
  
  // If the distance is less than the circle's radius, there's a collision
  return (distanceX * distanceX + distanceY * distanceY) <= (radius * radius);
}; 