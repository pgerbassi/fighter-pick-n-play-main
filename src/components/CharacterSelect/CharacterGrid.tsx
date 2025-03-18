import React, { useEffect } from 'react';
import CharacterCard from './CharacterCard';
import useCharacterStore from '@/store/characterStore';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const CharacterGrid: React.FC = () => {
  const { 
    characters, 
    selectedIndex, 
    highlightedIndex, 
    selectCharacter, 
    highlightCharacter,
    navigateSelection 
  } = useCharacterStore();
  
  const isMobile = useIsMobile();

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          navigateSelection('up');
          e.preventDefault();
          break;
        case 'ArrowDown':
          navigateSelection('down');
          e.preventDefault();
          break;
        case 'ArrowLeft':
          navigateSelection('left');
          e.preventDefault();
          break;
        case 'ArrowRight':
          navigateSelection('right');
          e.preventDefault();
          break;
        case 'Enter':
        case ' ': // Space
          selectCharacter(highlightedIndex);
          e.preventDefault();
          break;
      }
    };

    // Only add keyboard listeners on desktop
    if (!isMobile) {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [highlightedIndex, navigateSelection, selectCharacter, isMobile]);

  // For mobile - simple flat grid of all characters
  if (isMobile) {
    return (
      <div className="bg-black/30 backdrop-blur-sm p-3 rounded-lg border border-yellow-500/30">
        <div className="grid grid-cols-3 gap-2">
          {characters.map((character, index) => (
            <CharacterCard
              key={character.id}
              character={character}
              selected={index === selectedIndex}
              highlighted={index === highlightedIndex}
              onClick={() => selectCharacter(index)}
              index={index}
            />
          ))}
        </div>
        
        {/* Touch controls hint */}
        <div className="flex justify-center mt-3 text-white/80 text-xs">
          <p>Aperta pra selecionar • Delize pra navegar</p>
        </div>
      </div>
    );
  }
  
  // Desktop layout - SF2-style character grid
  const topRowChars = characters.slice(0, 3);
  const bottomRowChars = characters.slice(3);
  
  // Question mark for unselected character (middle position)
  const questionMark = (
    <div className="h-24 md:h-32 w-full flex items-center justify-center bg-black/40 rounded-lg border border-yellow-500/50">
      <span className="text-4xl text-yellow-500 font-bold">?</span>
    </div>
  );

  return (
    <div className="bg-black/30 backdrop-blur-sm p-3 rounded-lg border border-yellow-500/30">
      {/* SF2-style character grid with two rows and question mark in the middle */}
      <div className="grid gap-2 md:gap-3">
        {/* Top row */}
        <div className="grid grid-cols-6 gap-2 md:gap-3">
          {topRowChars.map((character, index) => (
            <CharacterCard
              key={character.id}
              character={character}
              selected={index === selectedIndex}
              highlighted={index === highlightedIndex}
              onClick={() => selectCharacter(index)}
              index={index}
            />
          ))}
          
          {/* Question mark slot in the middle */}
          {questionMark}
          
          {/* Right side characters */}
          {bottomRowChars.slice(0, 2).map((character, index) => (
            <CharacterCard
              key={character.id}
              character={character}
              selected={index + topRowChars.length === selectedIndex}
              highlighted={index + topRowChars.length === highlightedIndex}
              onClick={() => selectCharacter(index + topRowChars.length)}
              index={index + topRowChars.length}
            />
          ))}
        </div>
        
        {/* Bottom row remaining characters for desktop */}
        <div className="grid grid-cols-6 gap-2 md:gap-3">
          {bottomRowChars.slice(2).map((character, index) => (
            <CharacterCard
              key={character.id}
              character={character}
              selected={index + topRowChars.length + 2 === selectedIndex}
              highlighted={index + topRowChars.length + 2 === highlightedIndex}
              onClick={() => selectCharacter(index + topRowChars.length + 2)}
              index={index + topRowChars.length + 2}
            />
          ))}
        </div>
      </div>
      
      {/* Controls hint */}
      <div className="flex justify-center space-x-2 mt-3 text-white/80 text-xs">
        <span className="arcade-key">↑</span>
        <span className="arcade-key">↓</span>
        <span className="arcade-key">←</span>
        <span className="arcade-key">→</span>
        <span className="mx-2">Para mover</span>
        <span className="arcade-key">A</span>
        <span className="mx-2">Para selecionar</span>
      </div>
    </div>
  );
};

export default CharacterGrid;