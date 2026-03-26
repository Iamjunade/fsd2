import React, { useState, useEffect } from 'react';

export const BlackScreenToggle: React.FC = () => {
  const [isBlackScreen, setIsBlackScreen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault(); // Prevent page scrolling
        setIsBlackScreen((prev) => !prev);
      } else if (e.code === 'Escape') {
        setIsBlackScreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!isBlackScreen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black"
      style={{ width: '100vw', height: '100vh' }}
      onClick={() => setIsBlackScreen(false)}
    />
  );
};
