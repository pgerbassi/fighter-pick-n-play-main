
import React, { useEffect, useState } from 'react';
import CharacterGrid from '@/components/CharacterSelect/CharacterGrid';
import CharacterViewer from '@/components/CharacterSelect/CharacterViewer';
import SelectionControls from '@/components/CharacterSelect/SelectionControls';
import StreetFighterLogo from '@/components/CharacterSelect/StreetFighterLogo';
import useCharacterStore from '@/store/characterStore';
import { useToast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Index = () => {
  const { confirmed, characters, selectedIndex } = useCharacterStore();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [showGrid, setShowGrid] = useState(!isMobile);
  
  // Show confirmation toast when character is selected
  useEffect(() => {
    if (confirmed) {
      const character = characters[selectedIndex];
      toast({
        title: "Malucão Selecionado!",
        description: `${character.name} esta pronto para batalha.`,
        variant: "default",
      });
    }
  }, [confirmed, characters, selectedIndex, toast]);

  const toggleGrid = () => {
    setShowGrid(prev => !prev);
  };

  const selectedCharacter = characters[selectedIndex];

  return (
    <div 
      className="min-h-screen overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0a1c64 0%, #0046c0 100%)",
      }}
    >
      {/* Background elements */}
      <div className="fixed inset-0 z-0">
        {/* Street Fighter grid pattern */}
        <div className="absolute inset-0" 
            style={{
              backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-2 py-2 md:py-4 h-screen flex flex-col">
        {/* Street Fighter Logo */}
        <div className="flex justify-center mb-2 md:mb-4">
          <StreetFighterLogo />
        </div>
        
        {/* Character Name - Large display on the left side */}
        <div className="absolute top-1/4 left-6 md:left-12 z-20 hidden md:block">
          <h1 className="fighting-title text-6xl md:text-8xl text-white drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">
            {selectedCharacter.name.split(' ')[0].toUpperCase()}
          </h1>
        </div>

        {/* Mobile toggle for character grid */}
        {isMobile && (
          <button 
            onClick={toggleGrid}
            className="w-full bg-black/40 backdrop-blur-sm py-2 mb-2 rounded-lg flex items-center justify-center text-white/90 border border-yellow-500/30"
          >
            <span>{showGrid ? 'Esconder' : 'Mostrar'} Malucões</span>
            {showGrid ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
          </button>
        )}

        {/* "CHARACTER SELECT" text */}
        <div className="text-center mb-2">
          <h2 className="text-white text-xl md:text-2xl tracking-widest">SELEÇÃO DE MALUCÃO</h2>
        </div>

        {/* Main layout */}
        <div className="flex-1 flex flex-col md:flex-row gap-2 md:gap-4">
          {/* 3D character viewer - positioned on the left side for larger screens */}
          <div className="md:w-2/5 h-[40vh] md:h-auto rounded-lg overflow-hidden border-2 border-yellow-500/50">
            <CharacterViewer />
          </div>
          
          {/* Character selection grid - on the right */}
          <div className={`md:w-3/5 ${isMobile && !showGrid ? 'hidden' : 'block'}`}>
            <CharacterGrid />
          </div>
        </div>
        
        {/* Controls section */}
        <div className="mt-2 md:mt-4">
          <SelectionControls />
        </div>

        {/* Player indicator */}
        <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8">
          <div className="bg-blue-700 text-white text-sm px-3 py-1 rounded-sm border border-white/50">
            1P
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
