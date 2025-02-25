import React, { useEffect, useState } from "react";
import Image from "next/image";
import { PetType, getPetById } from "~/utils/pets";

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
  };
};

export const Bird: React.FC<BirdProps> = ({
  position,
  petType = "bird",
  disableAnimation = false,
  isWelcomeScreen = false,
  imageUrl,
  velocity = 0,
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
    const targetRotation =
      velocity < 0 ? -15 : Math.min(45, Math.max(-15, velocity * 4));

    setRotation(targetRotation);
    setPrevPosition(position);
  }, [position, velocity, isWelcomeScreen]);

  // Map pet types to styles and characteristics
  const petStyles: PetStylesMap = {
    bird: {
      color: "bg-yellow-200",
      eyeColor: "bg-black",
      beakColor: "bg-orange-300",
      wingColor: "bg-yellow-300",
      animationClass: "animate-bounce",
    },
    turtle: {
      color: "bg-green-400", // Slightly darker green for the body
      eyeColor: "bg-black",
      beakColor: "bg-yellow-600", // More defined beak color
      wingColor: "bg-green-700", // Darker green for shell
      animationClass: "animate-pulse",
    },
    rabbit: {
      color: "bg-pink-200",
      eyeColor: "bg-black",
      beakColor: "bg-pink-300", // nose
      wingColor: "bg-white", // fluffy tail
      animationClass: "animate-bounce",
    },
    panda: {
      color: "bg-white",
      eyeColor: "bg-black",
      beakColor: "bg-black", // nose
      wingColor: "bg-black", // markings
      animationClass: "animate-none",
    },
  };

  const style = petStyles[petType];

  // Only apply rotation in the game, not on welcome screen
  const finalRotation = isWelcomeScreen ? 0 : rotation;

  // Determine positioning class based on whether it's the welcome screen
  const positionClass = isWelcomeScreen
    ? "relative mx-auto" // Centered for welcome screen
    : "absolute left-[100px]"; // Original game positioning

  // Only apply animation in welcome screen and if not disabled
  const animationClass =
    isWelcomeScreen && !disableAnimation ? style.animationClass : "";

  // Add black border for panda
  const borderClass = petType === "panda" ? "border-2 border-black" : "";

  // If we have an image URL, render image instead of styled component
  if (imageUrl) {
    // Get pet scale or default to 1
    const scale = (getPetById(petType)?.scale || 1).toString();

    return (
      <div
        className={`${positionClass} h-10 w-10`}
        style={{
          top: isWelcomeScreen ? "auto" : `${position}px`,
          transform: `rotate(${finalRotation}deg)`,
          transformOrigin: "center",
          transition: isWelcomeScreen ? "none" : "transform 0.1s ease-out",
        }}
      >
        <div
          className={`h-full w-full overflow-hidden rounded-full bg-transparent ${borderClass}`}
        >
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
      className={`${positionClass} h-10 w-10`}
      style={{
        top: isWelcomeScreen ? "auto" : `${position}px`,
        transform: `rotate(${finalRotation}deg)`,
        transformOrigin: "center",
        transition: isWelcomeScreen ? "none" : "transform 0.1s ease-out",
      }}
    >
      {/* Pet body */}
      <div
        className={`h-full w-full ${style.color} flex items-center justify-center rounded-full ${animationClass} ${borderClass}`}
      >
        <div className="relative h-full w-full">
          {/* Eyes */}
          {petType === "rabbit" && (
            <>
              <div
                className={`absolute left-4 top-2 h-2 w-2 rounded-full bg-white`}
              ></div>
              <div
                className={`absolute left-5 top-3 h-1 w-1 rounded-full bg-black`}
              ></div>
              <div
                className={`absolute bottom-2 left-5 h-1 w-3 ${style.beakColor} rounded-full`}
              ></div>
            </>
          )}

          {/* Beak/nose */}
          <div
            className={`absolute left-7 top-4 h-2 w-3 ${style.beakColor} rounded-r-full`}
          ></div>

          {/* Wing/tail/feature */}

          {/* Pet-specific additional details */}
          {petType === "turtle" && (
            <>
              {/* Enhanced shell pattern with hexagonal pattern */}

              {/* Turtle head */}
              <div className="absolute -left-1 top-3 h-4 w-3 rounded-l-full bg-green-400"></div>

              {/* Turtle limbs */}
              <div className="absolute bottom-0 left-0 h-3 w-2 rounded-b-full bg-green-500"></div>
              <div className="absolute bottom-0 right-0 h-3 w-2 rounded-b-full bg-green-500"></div>
              <div className="absolute left-0 top-6 h-3 w-2 rounded-b-full bg-green-500"></div>
              <div className="absolute right-0 top-6 h-3 w-2 rounded-b-full bg-green-500"></div>

              <div className="absolute inset-1 rounded-full border-2 border-green-700 bg-green-600"></div>

              {/* Shell pattern details */}
              <div className="absolute inset-2 rounded-full border border-green-800 opacity-80"></div>
              <div className="absolute inset-3 rounded-full border border-green-900 opacity-70"></div>

              {/* Right eye */}
              <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-white"></div>
              <div className="absolute right-2 top-2 h-1 w-1 rounded-full bg-black"></div>
            </>
          )}
          {petType === "rabbit" && (
            <div className="absolute -top-4 left-1 h-6 w-2 rounded-t-full bg-pink-200"></div> // Ears
          )}
          {petType === "panda" && (
            <>
              {/* Eye patches */}
              <div className="absolute left-1 top-1 h-3 w-3 rounded-full border-2 border-black bg-white"></div>
              <div className="absolute left-2 top-2 h-1 w-1 rounded-full bg-black"></div>

              <div className="absolute right-1 top-1 h-3 w-3 rounded-full border-2 border-black bg-white"></div>
              <div className="absolute right-2 top-2 h-1 w-1 rounded-full bg-black"></div>

              {/* Ears */}
              <div className="absolute -top-2 left-1 h-2 w-2 rounded-full bg-black"></div>
              <div className="absolute -top-2 right-1 h-2 w-2 rounded-full bg-black"></div>
              <div
                className={`absolute bottom-2 left-1 h-1.5 w-3 ${style.wingColor} rounded-full`}
              ></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
