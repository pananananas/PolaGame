// Pet types and data

import { TailwindColor } from '~/utils/tailwind-utils';

export type PetType = 'bird' | 'turtle' | 'rabbit' | 'panda';

// Interface representing a pet
export interface Pet {
  id: PetType;
  name: string;
  description: string;
  color: TailwindColor;
  pipeColor: TailwindColor;
  imageUrl?: string;
  scale?: number; // Scale factor for the pet image
  backgroundColor: {
    from: TailwindColor;
    to: TailwindColor;
  };
}

// Array of available pets
export const PETS: Pet[] = [
  {
    id: 'turtle',
    name: 'Shelly',
    description: 'A cute turtle that glides through pipes with ease.',
    color: 'green-300',
    pipeColor: 'blue-500',
    // imageUrl: 'https://utfs.io/f/1f7de49c-d5bc-49a0-a481-6945f2e7d8b6-6j9e7s.png',
    scale: 1.2,
    backgroundColor: {
      from: 'teal-300',
      to: 'cyan-100'
    }
  },
  {
    id: 'bird',
    name: 'Flappy',
    description: 'The classic yellow bird that started it all!',
    color: 'yellow-200',
    pipeColor: 'green-500',
    imageUrl: 'https://utfs.io/f/aslkQcPvYvFBZGQY34IXhyp2SfGMEPRm8rk0zDgWI4Fa1UxK',
    scale: 2,
    backgroundColor: {
      from: 'blue-400',
      to: 'sky-200'
    }
  },
  {
    id: 'rabbit',
    name: 'Hoppy',
    description: 'A bouncy rabbit with extra jumping power!',
    color: 'pink-200',
    pipeColor: 'purple-500',
    // imageUrl: 'https://utfs.io/f/71e533e6-6a3c-4547-803f-344aabdad3d5-6j9e7t.png',
    scale: 1.0, // Default scale
    backgroundColor: {
      from: 'purple-200',
      to: 'pink-100'
    }
  },
  {
    id: 'panda',
    name: 'Bambu',
    description: 'A playful panda that loves bamboo pipes!',
    color: 'white',
    pipeColor: 'green-600',
    // imageUrl: 'https://utfs.io/f/5b7a2a2d-f99b-4a4a-9195-49f93e3c9d62-6j9e7u.png',
    scale: 1.1, // Slightly larger
    backgroundColor: {
      from: 'emerald-500',
      to: 'green-100'
    }
  }
];

export const DEFAULT_PET: PetType = 'turtle';

// Function to get a pet by its ID
export function getPetById(id: PetType): Pet {
  const pet = PETS.find(pet => pet.id === id);
  return pet ?? PETS[0] as Pet;
} 