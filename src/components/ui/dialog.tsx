"use client"

import React from 'react';

interface DialogProps {
  open: boolean;
  modal?: boolean;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open, children }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {children}
    </div>
  );
};

export const DialogContent: React.FC<{ children: React.ReactNode, className?: string }> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <div className={`bg-white rounded-lg p-6 max-w-md mx-auto ${className}`}>
      {children}
    </div>
  );
};

export const DialogHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="mb-4">{children}</div>;
};

export const DialogTitle: React.FC<{ children: React.ReactNode, className?: string }> = ({ 
  children, 
  className = ""
}) => {
  return <h2 className={`text-2xl font-bold ${className}`}>{children}</h2>;
};

export const DialogDescription: React.FC<{ children: React.ReactNode, className?: string }> = ({ 
  children,
  className = ""
}) => {
  return <p className={`text-gray-600 mt-2 ${className}`}>{children}</p>;
};

export const DialogFooter: React.FC<{ children: React.ReactNode, className?: string }> = ({ 
  children,
  className = ""
}) => {
  return <div className={`mt-6 flex justify-end ${className}`}>{children}</div>;
};
