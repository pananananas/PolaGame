import { useState, useEffect, useCallback } from "react";
import { Button } from "~/components/ui/button";
import { Pet, PETS, PetType, DEFAULT_PET } from "~/utils/pets";
import { getCookie, setCookie } from "~/utils/cookies";
import { Bird } from "~/components/Bird";
import { getBgColorClass } from "~/utils/tailwind-utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "~/components/ui/carousel";

interface WelcomeScreenProps {
  onStart: (petType: PetType) => void;
  highScore: number;
}

export const WelcomeScreen = ({ onStart, highScore }: WelcomeScreenProps) => {
  // State for selected pet
  const [selectedPetIndex, setSelectedPetIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  // Get selected pet data (ensure it's never undefined)
  const selectedPet = PETS[selectedPetIndex] || PETS[0];

  // Load saved pet preference from cookie
  useEffect(() => {
    const savedPet = getCookie("selectedPet") as PetType;
    if (savedPet) {
      const petIndex = PETS.findIndex((pet) => pet.id === savedPet);
      if (petIndex !== -1) {
        setSelectedPetIndex(petIndex);
        // If we have the carousel API, scroll to the saved pet
        if (carouselApi) {
          carouselApi.scrollTo(petIndex);
        }
      }
    }
  }, [carouselApi]);

  // Save pet preference to cookie
  const savePetPreference = (petId: PetType) => {
    setCookie("selectedPet", petId);
  };

  // Handle pet selection change
  const handlePetChange = useCallback((index: number) => {
    setSelectedPetIndex(index);
    const pet = PETS[index];
    if (pet) {
      savePetPreference(pet.id);
    }
  }, []);

  // Handle carousel selection
  useEffect(() => {
    if (!carouselApi) return;

    carouselApi.on("select", () => {
      const selectedIndex = carouselApi.selectedScrollSnap();
      handlePetChange(selectedIndex);
    });
  }, [carouselApi, handlePetChange]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-200 to-purple-200 p-4">
      <div className="mx-auto max-w-md space-y-6 rounded-2xl bg-white bg-opacity-90 p-6 text-center shadow-xl">
        <h1 className="text-2xl font-extrabold">
          <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Witaj urodzinowej gierce!
          </span>{" "}
        </h1> 
        <h3 className="text-md font-extrabold">
          Wybierz sobie ptasiuka i leć!
        </h3>


        <div className="relative py-4">
          {/* Pet selector using Shadcn Carousel */}
          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            className="mx-auto w-full max-w-xs"
            setApi={setCarouselApi}
          >
            <h3 className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-lg font-extrabold text-transparent">
              {selectedPet?.name || "Floppy Bird"}
            </h3>
            <CarouselContent>
              {PETS.map((pet) => (
                <CarouselItem
                  key={pet.id}
                  className="flex basis-full items-center justify-center"
                >
                  <div className="p-1">
                    <div className="flex h-28 items-center justify-center">
                      <Bird
                        position={10}
                        petType={pet.id}
                        disableAnimation={true}
                        isWelcomeScreen={true}
                        imageUrl={pet.imageUrl}
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2" />
          </Carousel>

          {highScore > 0 && (
            <p className="mt-6 text-sm font-medium text-purple-600">
              Your High Score: <span className="font-bold">{highScore}</span>
            </p>
          )}
        </div>

        <Button
          className="w-72 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 px-10 py-3 text-lg font-bold text-white shadow-md hover:from-pink-500 hover:to-purple-500"
          onClick={() => onStart(selectedPet?.id || "bird")}
        >
          Play Now
        </Button>
      </div>
    </div>
  );
};
