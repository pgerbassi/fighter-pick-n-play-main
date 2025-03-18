
import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import useCharacterStore from '@/store/characterStore';
import { Suspense } from 'react';
import { ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';

// Camera Controls
const CameraControls = ({ autoRotate }: { autoRotate: boolean }) => {
  return (
    <OrbitControls
      enableZoom={true}
      enablePan={false}
      minDistance={2}
      maxDistance={10}
      autoRotate={autoRotate}
      autoRotateSpeed={0.5}
      enableDamping={true}
      dampingFactor={0.1}
    />
  );
};

// Character Model
const Model = ({ url }: { url: string }) => {
  const { scene } = useGLTF(url);
  const model = useRef<THREE.Group>(null);
  
  useEffect(() => {
    if (model.current) {
      // Position the model properly
      model.current.position.set(0, -1, 0);
      model.current.rotation.set(0, 0, 0);
      
      // Scale to appropriate size
      model.current.scale.set(1, 1, 1);
      
      // Adjust camera distance based on model size
      const box = new THREE.Box3().setFromObject(model.current);
      const size = box.getSize(new THREE.Vector3()).length();
      if (size > 0) {
        const scaleFactor = 2 / size;
        model.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
      }
    }
  }, [scene]);
  
  useFrame(({ clock }) => {
    if (model.current) {
      // Subtle floating animation
      model.current.position.y = -1 + Math.sin(clock.getElapsedTime()) * 0.05;
    }
  });
  
  return <primitive ref={model} object={scene} />;
};

// Loading Placeholder
const LoadingPlaceholder = () => {
  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial wireframe={true} color={"#FFC107"} />
    </mesh>
  );
};

// Main Character Viewer Component
const CharacterViewer: React.FC = () => {
  const { characters, selectedIndex, selectCharacter } = useCharacterStore();
  const selectedCharacter = characters[selectedIndex];
  const [showModel, setShowModel] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  
  useEffect(() => {
    // Show model with a small delay for a more dramatic effect
    const timer = setTimeout(() => {
      setShowModel(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [selectedIndex]);
  
  // Reset showModel when a new character is selected for transition effect
  useEffect(() => {
    setShowModel(false);
    const timer = setTimeout(() => {
      setShowModel(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [selectedIndex]);

  // Function to navigate to previous character
  const handlePrevious = () => {
    const newIndex = selectedIndex === 0 ? characters.length - 1 : selectedIndex - 1;
    selectCharacter(newIndex);
  };

  // Function to navigate to next character
  const handleNext = () => {
    const newIndex = selectedIndex === characters.length - 1 ? 0 : selectedIndex + 1;
    selectCharacter(newIndex);
  };

  // Toggle auto-rotation
  const toggleAutoRotate = () => {
    setAutoRotate(prev => !prev);
  };
  
  return (
    <div className={`h-full w-full relative overflow-hidden ${!showModel ? 'animate-pulse' : ''}`}>
      {/* Mobile navigation controls */}
      <div className="absolute inset-x-0 top-1/2 z-10 flex justify-between items-center px-2 transform -translate-y-1/2 pointer-events-none">
        <button 
          onClick={handlePrevious}
          className="bg-black/40 hover:bg-black/60 text-white rounded-full p-2 backdrop-blur-sm transition-colors pointer-events-auto"
          aria-label="Previous character"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button 
          onClick={handleNext}
          className="bg-black/40 hover:bg-black/60 text-white rounded-full p-2 backdrop-blur-sm transition-colors pointer-events-auto"
          aria-label="Next character"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Auto-rotate toggle */}
      <button 
        onClick={toggleAutoRotate}
        className={`absolute bottom-4 right-4 z-20 rounded-full p-2 backdrop-blur-sm transition-colors ${autoRotate ? 'bg-yellow-500/70 text-black' : 'bg-black/40 text-white/70'}`}
        aria-label="Toggle auto-rotate"
      >
        <RotateCw className="h-5 w-5" />
      </button>
      
      {/* Character stats overlay at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-3">
        <div className="flex justify-between text-white text-xs">
          <div>STR: {selectedCharacter.stats.strength}</div>
          <div>SPD: {selectedCharacter.stats.speed}</div>
          <div>TEC: {selectedCharacter.stats.technique}</div>
          <div>MAG: {selectedCharacter.stats.magic}</div>
        </div>
      </div>
      
      {/* The 3D canvas */}
      <div className={`h-full w-full transition-opacity duration-500 ${showModel ? 'opacity-100' : 'opacity-0'}`}>
        <Canvas
          camera={{ position: [0, 0, 4], fov: 50 }}
          style={{ 
            background: `linear-gradient(135deg, #0a1c64 0%, #0046c0 100%)`,
            touchAction: 'none'
          }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#FFC107" />
          
          {/* Spotlight to highlight the character */}
          <spotLight 
            position={[0, 5, 0]} 
            angle={0.4} 
            penumbra={1} 
            intensity={1.5} 
            castShadow 
            color="#ffffff" 
          />
          
          <CameraControls autoRotate={autoRotate} />
          
          <Suspense fallback={<LoadingPlaceholder />}>
            {showModel && <Model url={selectedCharacter.modelUrl} />}
          </Suspense>
          
          {/* SF2-style stage floor */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial 
              color={"#0a1c64"} 
              metalness={0.2}
              roughness={0.8}
            />
          </mesh>
        </Canvas>
      </div>
    </div>
  );
};

export default CharacterViewer;
