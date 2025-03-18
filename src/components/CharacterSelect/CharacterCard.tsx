
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { CharacterData } from '@/lib/characters';
import { Check } from 'lucide-react';

interface CharacterCardProps {
  character: CharacterData;
  selected: boolean;
  highlighted: boolean;
  onClick: () => void;
  index: number;
}

const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  selected,
  highlighted,
  onClick,
  index
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Scroll into view when highlighted
  useEffect(() => {
    if (highlighted && cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [highlighted]);

  // Animation delay based on index (for staggered entrance)
  const delay = `${index * 0.1}s`;

  return (
    <div
      ref={cardRef}
      className={cn(
        'relative opacity-0 animate-fade-in active:scale-95 transition-all duration-150',
        {
          'transform scale-105 z-10': highlighted || selected,
        }
      )}
      style={{ 
        animationDelay: delay,
        animationFillMode: 'forwards',
      }}
      onClick={onClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
          e.preventDefault();
        }
      }}
      data-testid={`character-card-${character.id}`}
    >
      <div className={cn(
        "h-24 md:h-32 w-full overflow-hidden rounded-sm",
        highlighted ? "ring-2 ring-yellow-400" : "ring-1 ring-white/30",
        selected ? "ring-2 ring-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" : ""
      )}>
        <img
          src={character.image}
          alt={character.name}
          className={cn(
            "w-full h-full object-cover transition-all duration-300",
            (highlighted || selected) ? "scale-110 brightness-110" : "scale-100 brightness-90",
          )}
          loading="lazy"
        />
        
        {/* Selected indicator - blue border in SF2 style */}
        {selected && (
          <div className="absolute inset-0 box-border border-4 border-blue-500 rounded-sm z-10"></div>
        )}
        
        {/* Highlighted indicator - yellow border in SF2 style */}
        {highlighted && !selected && (
          <div className="absolute inset-0 box-border border-2 border-yellow-400 rounded-sm z-10"></div>
        )}
        
        {/* Character select cursor - only shown when highlighted (SF2 style) */}
        {highlighted && (
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 z-20">
            <div className="w-0 h-0 
              border-l-[6px] border-l-transparent
              border-r-[6px] border-r-transparent
              border-t-[8px] border-t-yellow-400
              mx-auto animate-bounce">
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterCard;
