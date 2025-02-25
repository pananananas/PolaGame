import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { PetType, getPetById } from '~/utils/pets';

interface BirdProps {
  position: number;
  petType: PetType;
  disableAnimation?: boolean;
  isWelcomeScreen?: boolean;
  imageUrl?: string;
  velocity?: number; // Used to determine rotation
}

type PetStylesMap = {
  [key in PetType]: {
    color: string;
    eyeColor: string;
    beakColor: string;
    wingColor: string;
    animationClass: string;
  }
};

export const Bird: React.FC<BirdProps> = ({ 
  position, 
  petType = 'bird',
  disableAnimation = false,
  isWelcomeScreen = false,
  imageUrl,
  velocity = 0
}) => {
  // Track previous position to determine if jumping
  const [prevPosition, setPrevPosition] = useState(position);
  const [rotation, setRotation] = useState(0);
  
  // Update rotation based on velocity - with reduced angle range
  useEffect(() => {
    // Don't apply rotation on welcome screen
    if (isWelcomeScreen) return;
    
    // When velocity is negative (jumping up), rotate slightly upward (-15 degrees)
    // When falling, gradually rotate downward but only up to 45 degrees with a smaller multiplier
    const targetRotation = velocity < 0 ? -15 : Math.min(45, Math.max(-15, velocity * 4));
    
    setRotation(targetRotation);
    setPrevPosition(position);
  }, [position, velocity, isWelcomeScreen]);

  // Map pet types to styles and characteristics
  const petStyles: PetStylesMap = {
    bird: {
      color: 'bg-yellow-200',
      eyeColor: 'bg-black',
      beakColor: 'bg-orange-300',
      wingColor: 'bg-yellow-300',
      animationClass: 'animate-bounce'
    },
    turtle: {
      color: 'bg-green-400', // Slightly darker green for the body
      eyeColor: 'bg-black',
      beakColor: 'bg-yellow-600', // More defined beak color
      wingColor: 'bg-green-700', // Darker green for shell
      animationClass: 'animate-pulse'
    },
    rabbit: {
      color: 'bg-pink-200',
      eyeColor: 'bg-black',
      beakColor: 'bg-pink-300', // nose
      wingColor: 'bg-white', // fluffy tail
      animationClass: 'animate-bounce'
    },
    panda: {
      color: 'bg-white',
      eyeColor: 'bg-black',
      beakColor: 'bg-black', // nose
      wingColor: 'bg-black', // markings
      animationClass: 'animate-none'
    }
  };

  const style = petStyles[petType];
  
  // Only apply rotation in the game, not on welcome screen
  const finalRotation = isWelcomeScreen ? 0 : rotation;
  
  // Determine positioning class based on whether it's the welcome screen
  const positionClass = isWelcomeScreen 
    ? "relative mx-auto" // Centered for welcome screen
    : "absolute left-[100px]"; // Original game positioning

  // Only apply animation in welcome screen and if not disabled
  const animationClass = (isWelcomeScreen && !disableAnimation) ? style.animationClass : '';

  // Add black border for panda
  const borderClass = petType === 'panda' ? 'border-2 border-black' : '';

  // If we have an image URL, render image instead of styled component
  if (imageUrl) {
    // Get pet scale or default to 1
    const scale = (getPetById(petType)?.scale || 1).toString();
    
    return (
      <div 
        className={`${positionClass} w-10 h-10`}
        style={{ 
          top: isWelcomeScreen ? 'auto' : `${position}px`,
          transform: `rotate(${finalRotation}deg)`,
          transformOrigin: 'center',
          transition: isWelcomeScreen ? 'none' : 'transform 0.1s ease-out'
        }}
      >
        <div className={`w-full h-full overflow-hidden rounded-full bg-transparent ${borderClass}`}>
          <Image 
            src={imageUrl}
            alt={`${petType} pet`}
            width={40}
            height={40}
            className="object-contain"
            style={{ transform: `scale(${scale})` }}
            priority
          />
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`${positionClass} w-10 h-10`}
      style={{ 
        top: isWelcomeScreen ? 'auto' : `${position}px`,
        transform: `rotate(${finalRotation}deg)`,
        transformOrigin: 'center',
        transition: isWelcomeScreen ? 'none' : 'transform 0.1s ease-out'
      }}
    >
      {/* Pet body */}
      <div className={`w-full h-full ${style.color} rounded-full flex items-center justify-center ${animationClass} ${borderClass}`}>
        <div className="relative w-full h-full">
          {/* Eyes */}
          <div className={`absolute top-2 left-2 w-2 h-2 ${style.eyeColor} rounded-full`}></div>
          
          {/* Beak/nose */}
          <div className={`absolute top-4 left-7 w-3 h-2 ${style.beakColor} rounded-r-full`}></div>
          
          {/* Wing/tail/feature */}
          <div className={`absolute bottom-2 left-1 w-3 h-2 ${style.wingColor} rounded-full`}></div>
          
          {/* Pet-specific additional details */}
          {petType === 'turtle' && (
            <>
              {/* Enhanced shell pattern with hexagonal pattern */}
              
              {/* Turtle head */}
              <div className="absolute -left-1 top-3 w-3 h-4 bg-green-400 rounded-l-full"></div>
              
              
              {/* Turtle limbs */}
              <div className="absolute bottom-0 left-0 w-2 h-3 bg-green-500 rounded-b-full"></div>
              <div className="absolute bottom-0 right-0 w-2 h-3 bg-green-500 rounded-b-full"></div>
              <div className="absolute top-6 left-0 w-2 h-3 bg-green-500 rounded-b-full"></div>
              <div className="absolute top-6 right-0 w-2 h-3 bg-green-500 rounded-b-full"></div>

              <div className="absolute inset-1 border-2 border-green-700 rounded-full bg-green-600"></div>
              
              {/* Shell pattern details */}
              <div className="absolute inset-2 border border-green-800 rounded-full opacity-80"></div>
              <div className="absolute inset-3 border border-green-900 rounded-full opacity-70"></div>
              
              {/* Right eye */}
              <div className="absolute top-2 right-2 w-2 h-2 bg-black rounded-full"></div>
            </>
          )}
          {petType === 'rabbit' && (
            <div className="absolute -top-4 left-1 h-6 w-2 bg-pink-200 rounded-t-full"></div> // Ears
          )}
          {petType === 'panda' && (
            <>
              {/* Eye patches */}
              <div className="absolute top-1 left-1 w-3 h-3 bg-black rounded-full"></div>
              <div className="absolute top-1 right-1 w-3 h-3 bg-black rounded-full"></div>
              {/* Ears */}
              <div className="absolute -top-2 left-1 h-2 w-2 bg-black rounded-full"></div>
              <div className="absolute -top-2 right-1 h-2 w-2 bg-black rounded-full"></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}; 