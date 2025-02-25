import React, { useMemo } from 'react';

interface PipeProps {
  x: number;
  topHeight: number;
  gap: number;
  width: number;
  color?: string;
}

export const Pipe: React.FC<PipeProps> = ({ 
  x, 
  topHeight, 
  gap, 
  width,
  color = 'green-400'
}) => {
  // Generate the CSS classes dynamically to avoid Tailwind purge issues
  const pipeClass = useMemo(() => {
    return `bg-${color} shadow-lg opacity-100`;
  }, [color]);

  const lipClass = useMemo(() => {
    return `bg-${color} rounded-lg shadow-inner opacity-100`;
  }, [color]);
  
  // Apply the background color directly through inline styles as well
  // This ensures the color works even if Tailwind purges classes
  const getColorHex = (colorName: string) => {
    const colorMap: Record<string, string> = {
      'green-400': '#4ade80',
      'green-500': '#22c55e',
      'green-600': '#16a34a',
      'blue-500': '#3b82f6',
      'purple-500': '#a855f7'
    };
    return colorMap[colorName] || '#4ade80'; // Default to green-400
  };

  const backgroundColor = getColorHex(color);

  return (
    <>
      {/* Top pipe */}
      <div 
        className={`absolute ${pipeClass} rounded-b-lg`}
        style={{
          left: `${x}px`,
          top: 0,
          width: `${width}px`,
          height: `${topHeight}px`,
          backgroundColor
        }}
      >
        {/* Pipe lip */}
        <div 
          className={`absolute bottom-0 left-0 right-0 h-4 ${lipClass} transform translate-x-[-5px] w-[calc(100%+10px)]`}
          style={{ backgroundColor }}
        />
      </div>
      
      {/* Bottom pipe - modified to match top pipe styling */}
      <div 
        className={`absolute ${pipeClass} rounded-t-lg`}
        style={{
          left: `${x}px`,
          top: `${topHeight + gap}px`,
          width: `${width}px`,
          height: 'calc(100% - ' + (topHeight + gap) + 'px)',
          backgroundColor
        }}
      >
        {/* Pipe lip - same styling as top pipe */}
        <div 
          className={`absolute top-0 left-0 right-0 h-4 ${lipClass} transform translate-x-[-5px] w-[calc(100%+10px)]`}
          style={{ backgroundColor }}
        />
      </div>
    </>
  );
}; 