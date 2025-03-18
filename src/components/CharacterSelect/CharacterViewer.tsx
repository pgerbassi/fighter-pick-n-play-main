import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import useCharacterStore from '@/store/characterStore';
import { Suspense } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

// Camera Controls
const CameraControls = ({ autoRotate, zoom, setZoom }: { 
  autoRotate: boolean;
  zoom: number;
  setZoom: (zoom: number) => void;
}) => {
  const controlsRef = useRef<any>(null);
  
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.minDistance = 1 + zoom;
      controlsRef.current.maxDistance = 10 + zoom;
    }
  }, [zoom]);
  
  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={true}
      enablePan={false}
      minDistance={1 + zoom}
      maxDistance={10 + zoom}
      autoRotate={autoRotate}
      autoRotateSpeed={1.5}
      enableDamping={true}
      dampingFactor={0.1}
    />
  );
};

// Floor with grid effect
const NeonFloor = ({ color }: { color: string }) => {
  const floorRef = useRef<THREE.Mesh>(null);
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame(({ clock }) => {
    if (gridRef.current) {
      // Pulse the grid
      const pulse = Math.sin(clock.getElapsedTime() * 2) * 0.5 + 0.5;
      if (gridRef.current.material instanceof THREE.Material) {
        gridRef.current.material.opacity = 0.3 + pulse * 0.2;
      }
      
      // Slowly rotate the grid
      gridRef.current.rotation.y += 0.001;
    }
  });

  return (
    <>
      {/* Main floor */}
      <mesh 
        ref={floorRef} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -1.5, 0]} 
        receiveShadow
      >
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial 
          color={"#0a1c64"} 
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>
      
      {/* Grid overlay */}
      <gridHelper 
        ref={gridRef}
        args={[50, 50, color, color]} 
        position={[0, -1.49, 0]} 
      />
    </>
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
      
      // Traverse and enable shadows
      model.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [scene]);
  
  useFrame(({ clock }) => {
    if (model.current) {
      // Subtle floating animation
      model.current.position.y = -1 + Math.sin(clock.getElapsedTime()) * 0.05;
      
      // Subtle rotation when not interacting
      model.current.rotation.y += 0.001;
    }
  });
  
  return <primitive ref={model} object={scene} />;
};

// Loading Placeholder
const LoadingPlaceholder = ({ color }: { color: string }) => {
  const sphereRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (sphereRef.current) {
      // Rotate the sphere
      sphereRef.current.rotation.x = clock.getElapsedTime() * 0.5;
      sphereRef.current.rotation.y = clock.getElapsedTime() * 0.8;
      
      // Pulse the sphere
      const scale = 0.5 + Math.sin(clock.getElapsedTime() * 3) * 0.1;
      sphereRef.current.scale.set(scale, scale, scale);
    }
  });
  
  return (
    <mesh ref={sphereRef} position={[0, 0, 0]}>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial wireframe={true} color={color} emissive={color} emissiveIntensity={0.5} />
    </mesh>
  );
};

// Neon Spotlight
const NeonSpotlight = ({ color, position }: { color: string, position: [number, number, number] }) => {
  const light = new THREE.SpotLight(color, 2, 25, 0.3, 1);
  light.position.set(...position);
  light.castShadow = true;
  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;
  
  return <primitive object={light} />;
};

// Main Character Viewer Component
const CharacterViewer: React.FC = () => {
  const { characters, selectedIndex, selectCharacter } = useCharacterStore();
  const selectedCharacter = characters[selectedIndex];
  const [showModel, setShowModel] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [zoom, setZoom] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [bgOpacity, setBgOpacity] = useState(1);
  
  // Touch control handlers
  const touchStartX = useRef<number | null>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX.current;
    
    // Swipe left/right to change character
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handlePrevious();
      } else {
        handleNext();
      }
    }
    
    touchStartX.current = null;
  };
  
  // Model loading effect
  useEffect(() => {
    // Show model with a small delay for a more dramatic effect
    setShowModel(false);
    const timer = setTimeout(() => {
      setShowModel(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [selectedIndex]);
  
  // Function to navigate to previous character
  const handlePrevious = () => {
    setBgOpacity(0.5);
    setTimeout(() => setBgOpacity(1), 300);
    const newIndex = selectedIndex === 0 ? characters.length - 1 : selectedIndex - 1;
    selectCharacter(newIndex);
  };

  // Function to navigate to next character
  const handleNext = () => {
    setBgOpacity(0.5);
    setTimeout(() => setBgOpacity(1), 300);
    const newIndex = selectedIndex === characters.length - 1 ? 0 : selectedIndex + 1;
    selectCharacter(newIndex);
  };

  // Toggle auto-rotation
  const toggleAutoRotate = () => {
    setAutoRotate(prev => !prev);
  };
  
  // Handle zoom in/out
  const zoomIn = () => {
    setZoom(prev => Math.max(-0.5, prev - 0.5));
  };
  
  const zoomOut = () => {
    setZoom(prev => Math.min(3, prev + 0.5));
  };
  
  // Toggle stats visibility
  const toggleStats = () => {
    setShowStats(prev => !prev);
  };
  
  // Calculate background gradient based on character color
  const gradientBg = `linear-gradient(135deg, ${selectedCharacter.color}33 0%, #0a1c64 100%)`;
  
  return (
    <div 
      ref={viewerRef}
      className={`h-full w-full relative overflow-hidden ${!showModel ? 'animate-pulse' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={() => setIsInteracting(true)}
      onMouseUp={() => setIsInteracting(false)}
      onMouseLeave={() => setIsInteracting(false)}
    >
      {/* Character background with neon glow */}
      <div 
        className="absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          background: gradientBg,
          opacity: bgOpacity,
          boxShadow: `inset 0 0 30px ${selectedCharacter.color}66`
        }}
      />
      
      {/* Neon border */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 border-2 rounded-lg opacity-70 transition-all duration-300"
          style={{ 
            borderColor: selectedCharacter.color,
            boxShadow: `0 0 10px ${selectedCharacter.color}, 0 0 20px ${selectedCharacter.color}66`
          }}
        />
      </div>
      
      {/* Navigation controls */}
      <div className="absolute inset-x-0 top-1/2 z-10 flex justify-between items-center px-2 transform -translate-y-1/2 pointer-events-none">
        <button 
          onClick={handlePrevious}
          className="bg-black/40 hover:bg-black/60 text-white rounded-full p-2 backdrop-blur-sm transition-colors pointer-events-auto hover:scale-110 active:scale-95"
          style={{
            boxShadow: `0 0 10px ${selectedCharacter.color}88`
          }}
          aria-label="Previous character"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button 
          onClick={handleNext}
          className="bg-black/40 hover:bg-black/60 text-white rounded-full p-2 backdrop-blur-sm transition-colors pointer-events-auto hover:scale-110 active:scale-95"
          style={{
            boxShadow: `0 0 10px ${selectedCharacter.color}88`
          }}
          aria-label="Next character"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Control buttons */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        {/* Auto-rotate toggle */}
        <button 
          onClick={toggleAutoRotate}
          className={`rounded-full p-2 backdrop-blur-sm transition-colors hover:scale-110 active:scale-95
            ${autoRotate ? 'bg-yellow-500/70 text-black' : 'bg-black/40 text-white/70'}`}
          style={{
            boxShadow: autoRotate ? `0 0 10px ${selectedCharacter.color}` : 'none'
          }}
          aria-label="Toggle auto-rotate"
        >
          <RotateCw className="h-5 w-5" />
        </button>
        
        {/* Zoom in */}
        <button 
          onClick={zoomIn}
          className="bg-black/40 hover:bg-black/60 text-white rounded-full p-2 backdrop-blur-sm transition-colors hover:scale-110 active:scale-95"
          style={{
            boxShadow: `0 0 5px ${selectedCharacter.color}44`
          }}
          aria-label="Zoom in"
        >
          <ZoomIn className="h-5 w-5" />
        </button>
        
        {/* Zoom out */}
        <button 
          onClick={zoomOut}
          className="bg-black/40 hover:bg-black/60 text-white rounded-full p-2 backdrop-blur-sm transition-colors hover:scale-110 active:scale-95"
          style={{
            boxShadow: `0 0 5px ${selectedCharacter.color}44`
          }}
          aria-label="Zoom out"
        >
          <ZoomOut className="h-5 w-5" />
        </button>
      </div>
      
      {/* Character stats overlay */}
      <div 
        className={`absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3 transition-all duration-300 cursor-pointer`}
        onClick={toggleStats}
        style={{
          height: showStats ? '120px' : '40px',
          boxShadow: `0 0 15px ${selectedCharacter.color}33`
        }}
      >
        <div className="flex justify-between text-white text-xs mb-2">
          <div className="flex items-center">
            <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ backgroundColor: selectedCharacter.color }}></span>
            <span className="uppercase tracking-wider">{selectedCharacter.name}</span>
          </div>
          <div className="flex space-x-1 items-center">
            {[...Array(Math.round(selectedCharacter.stats.technique / 2))].map((_, i) => (
              <div 
                key={i} 
                className="w-1 h-3 rounded-sm" 
                style={{ backgroundColor: selectedCharacter.color }}
              ></div>
            ))}
          </div>
        </div>
        
        {/* Expanded stats */}
        <div className={`transition-all duration-300 overflow-hidden ${showStats ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0'}`}>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <div className="text-white/80 text-xs">Strength</div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden mt-1">
                <div 
                  className="h-full rounded-full" 
                  style={{ 
                    width: `${selectedCharacter.stats.strength * 10}%`,
                    backgroundColor: selectedCharacter.color,
                    boxShadow: `0 0 8px ${selectedCharacter.color}`
                  }}
                ></div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-white/80 text-xs">Speed</div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden mt-1">
                <div 
                  className="h-full rounded-full" 
                  style={{ 
                    width: `${selectedCharacter.stats.speed * 10}%`,
                    backgroundColor: selectedCharacter.color,
                    boxShadow: `0 0 8px ${selectedCharacter.color}`
                  }}
                ></div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-white/80 text-xs">Technique</div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden mt-1">
                <div 
                  className="h-full rounded-full" 
                  style={{ 
                    width: `${selectedCharacter.stats.technique * 10}%`,
                    backgroundColor: selectedCharacter.color,
                    boxShadow: `0 0 8px ${selectedCharacter.color}`
                  }}
                ></div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-white/80 text-xs">Magic</div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden mt-1">
                <div 
                  className="h-full rounded-full" 
                  style={{ 
                    width: `${selectedCharacter.stats.magic * 10}%`,
                    backgroundColor: selectedCharacter.color,
                    boxShadow: `0 0 8px ${selectedCharacter.color}`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* The 3D canvas */}
      <div className={`h-full w-full transition-opacity duration-500 ${showModel ? 'opacity-100' : 'opacity-0'}`}>
        <Canvas
          camera={{ position: [0, 0, 4], fov: 50 }}
          shadows
          style={{ 
            background: 'transparent',
            touchAction: 'none'
          }}
        >
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.7} />
          <pointLight position={[-10, -10, -10]} intensity={0.3} color={selectedCharacter.color} />
          
          {/* Spotlights that follow the character color */}
          <NeonSpotlight color={selectedCharacter.color} position={[3, 5, 2]} />
          <NeonSpotlight color="#ffffff" position={[-3, 4, -2]} />
          
          <CameraControls autoRotate={autoRotate && !isInteracting} zoom={zoom} setZoom={setZoom} />
          
          <Suspense fallback={<LoadingPlaceholder color={selectedCharacter.color} />}>
            {showModel && <Model url={selectedCharacter.modelUrl} />}
          </Suspense>
          
          {/* Neon floor with character's color */}
          <NeonFloor color={selectedCharacter.color} />
          
          {/* Add fog for atmosphere */}
          <fog attach="fog" args={['#0a1c64', 10, 25]} />
        </Canvas>
      </div>
    </div>
  );
};

export default CharacterViewer;