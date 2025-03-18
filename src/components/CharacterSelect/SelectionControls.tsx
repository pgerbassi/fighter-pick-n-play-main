
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import useCharacterStore from '@/store/characterStore';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const SelectionControls: React.FC = () => {
  const { confirmSelection, selectedIndex, characters, confirmed } = useCharacterStore();
  const [isHovering, setIsHovering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();
  
  const handleConfirm = () => {
    if (!confirmed) {
      setIsLoading(true);
      // Simulate loading for better UX
      setTimeout(() => {
        confirmSelection();
        setIsLoading(false);
      }, 600);
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      <Button
        onClick={handleConfirm}
        disabled={confirmed || isLoading}
        className={cn(
          "fighting-title px-6 md:px-10 py-3 md:py-4 text-base md:text-xl relative overflow-hidden group transition-all duration-300 w-full sm:w-auto",
          confirmed 
            ? "bg-blue-800 text-white cursor-not-allowed opacity-70" 
            : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-lg"
        )}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Arcade button effect */}
        <div className={cn(
          "absolute inset-0 w-full h-full transition-all duration-700",
          isHovering && !confirmed ? "bg-gradient-to-r from-yellow-400/0 via-yellow-400/30 to-yellow-400/0 bg-[length:200%_100%] animate-[gradient_1.5s_ease_infinite]" : ""
        )}></div>
        
        {/* Text content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
          {confirmed && <CheckCircle className="h-5 w-5" />}
          {confirmed 
            ? "MALUCÃO SELECIONADO!"
            : isLoading 
              ? "CONFIRMANDO..." 
              : "APERTA E MAROLA!"
          }
        </span>
      </Button>
      
      {/* Character status */}
      <div className="mt-3 bg-black/50 backdrop-blur-sm px-4 py-2 rounded border border-yellow-500/30 text-center">
        <p className="text-white text-sm md:text-base">
          {confirmed 
            ? `${characters[selectedIndex].name} está pronto para chapar!`
            : "Selecione seu malucão e aperta um... botão!"
          }
        </p>
      </div>

      {/* Touch hint for mobile */}
      {isMobile && !confirmed && (
        <div className="mt-3 text-xs text-white/60 text-center">
          <p>Deliza pra rodar • Tecla as setas pra trocar de malucão</p>
        </div>
      )}
    </div>
  );
};

export default SelectionControls;
