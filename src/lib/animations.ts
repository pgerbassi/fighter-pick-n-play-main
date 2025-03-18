
import { useEffect } from 'react';

// A utility hook to handle keyboard navigation
export const useKeyboardNavigation = (
  onNavigate: (direction: 'up' | 'down' | 'left' | 'right') => void,
  onSelect: () => void,
  isEnabled: boolean = true
) => {
  useEffect(() => {
    if (!isEnabled) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          onNavigate('up');
          e.preventDefault();
          break;
        case 'ArrowDown':
          onNavigate('down');
          e.preventDefault();
          break;
        case 'ArrowLeft':
          onNavigate('left');
          e.preventDefault();
          break;
        case 'ArrowRight':
          onNavigate('right');
          e.preventDefault();
          break;
        case 'Enter':
        case ' ': // Space
          onSelect();
          e.preventDefault();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isEnabled, onNavigate, onSelect]);
};

// A utility to create staggered animations for multiple elements
export const staggeredEntrance = (index: number, baseDelay: number = 0.1) => {
  return {
    animationDelay: `${baseDelay * index}s`,
    animationFillMode: 'forwards' as const
  };
};
