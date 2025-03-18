
import { create } from 'zustand';
import { CharacterData, characters } from '@/lib/characters';

interface CharacterState {
  characters: CharacterData[];
  selectedIndex: number;
  confirmed: boolean;
  highlightedIndex: number;
  selectCharacter: (index: number) => void;
  confirmSelection: () => void;
  cancelSelection: () => void;
  highlightCharacter: (index: number) => void;
  navigateSelection: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

const useCharacterStore = create<CharacterState>((set, get) => ({
  characters,
  selectedIndex: 0,
  confirmed: false,
  highlightedIndex: 0,

  selectCharacter: (index) => {
    if (index >= 0 && index < characters.length) {
      set({ selectedIndex: index, highlightedIndex: index });
    }
  },

  confirmSelection: () => {
    set({ confirmed: true });
  },

  cancelSelection: () => {
    set({ confirmed: false });
  },

  highlightCharacter: (index) => {
    if (index >= 0 && index < characters.length) {
      set({ highlightedIndex: index });
    }
  },

  navigateSelection: (direction) => {
    const { highlightedIndex } = get();
    const gridCols = 3; // Grid is 3 columns wide
    const rowCount = Math.ceil(characters.length / gridCols);
    const currentRow = Math.floor(highlightedIndex / gridCols);
    const currentCol = highlightedIndex % gridCols;
    
    let newIndex = highlightedIndex;
    
    switch (direction) {
      case 'up':
        // Move up one row, stay in same column
        newIndex = ((currentRow - 1 + rowCount) % rowCount) * gridCols + currentCol;
        // Adjust if we've moved past the number of characters
        if (newIndex >= characters.length) {
          newIndex = ((currentRow - 2 + rowCount) % rowCount) * gridCols + currentCol;
        }
        break;
      case 'down':
        // Move down one row, stay in same column
        newIndex = ((currentRow + 1) % rowCount) * gridCols + currentCol;
        // Adjust if we've moved past the number of characters
        if (newIndex >= characters.length) {
          newIndex = currentCol;
        }
        break;
      case 'left':
        // Move left one column, stay in same row
        newIndex = currentRow * gridCols + ((currentCol - 1 + gridCols) % gridCols);
        // Adjust if we've moved past the number of characters
        if (newIndex >= characters.length) {
          newIndex = currentRow * gridCols + gridCols - 1;
        }
        break;
      case 'right':
        // Move right one column, stay in same row
        newIndex = currentRow * gridCols + ((currentCol + 1) % gridCols);
        // Adjust if we've moved past the number of characters
        if (newIndex >= characters.length) {
          newIndex = currentRow * gridCols;
        }
        break;
    }
    
    set({ highlightedIndex: newIndex });
  }
}));

export default useCharacterStore;
