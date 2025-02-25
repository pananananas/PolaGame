/**
 * Utility functions for dynamic Tailwind classes
 */

/**
 * Type representing valid Tailwind color classes
 * This includes all available Tailwind color variations
 */
export type TailwindColor = string;

/**
 * Creates a class string with all background colors for pets
 * This ensures Tailwind won't purge unused dynamic classes
 */
export function getAllColorClasses() {
  // This function is not used directly but helps with Tailwind purging
  // Keep these classes in sync with the pets.ts color definitions
  const classes = `
    bg-yellow-200 bg-green-300 bg-pink-200 bg-white bg-gray-300
    bg-green-400 bg-blue-400 bg-orange-400 bg-purple-400
    
    bg-green-500 bg-blue-500 bg-purple-500 bg-green-600
    bg-green-700 bg-green-800 bg-green-900 bg-yellow-600
    
    bg-red-400 bg-amber-100 bg-amber-300 bg-amber-600 bg-amber-700 bg-amber-800
    bg-yellow-400 bg-lime-400 bg-lime-100 bg-emerald-100
    
    from-blue-200 to-purple-200
    from-teal-100 to-blue-200
    from-pink-100 to-orange-100
    from-indigo-100 to-purple-100
    
    from-blue-400 to-sky-200
    from-teal-300 to-cyan-100
    from-purple-200 to-pink-100
    from-emerald-500 to-green-100
    from-lime-400 to-emerald-100
    from-green-400 to-lime-100
    from-amber-200 to-orange-50
    
    /* Add explicit background gradient classes */
    bg-gradient-to-b from-blue-400 to-sky-200
    bg-gradient-to-b from-teal-300 to-cyan-100
    bg-gradient-to-b from-purple-200 to-pink-100
    bg-gradient-to-b from-emerald-500 to-green-100
    bg-gradient-to-b from-lime-400 to-emerald-100
    bg-gradient-to-b from-green-400 to-lime-100
    bg-gradient-to-b from-amber-200 to-orange-50
  `;
  
  return classes;
}

/**
 * Safely generates a background color class
 */
export function getBgColorClass(color: TailwindColor): string {
  return `bg-${color}`;
}

/**
 * Safely generates a gradient from/to classes
 */
export function getGradientClasses(from: TailwindColor, to: TailwindColor): string {
  const classes = `from-${from} to-${to}`;
  // Debugging: Log when gradient classes are generated
  console.log(`📊 Generated gradient classes: ${classes}`);
  return classes;
} 