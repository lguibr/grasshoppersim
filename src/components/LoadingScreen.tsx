import React, { useState, useEffect, useRef } from 'react';
import { useSimulationStore } from '../store';
import { Play } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { Canvas, useFrame } from '@react-three/fiber';
import { GrasshopperModel } from './Grasshopper/GrasshopperModel';
import { useGrasshopperMaterials } from './Grasshopper/useGrasshopperMaterials';
import * as THREE from 'three';

const SpinningCricket = () => {
  const { shape, materials } = useGrasshopperMaterials(false);
  const groupRef = useRef<THREE.Group>(null);
  
  // Create dummy refs for the model
  const refs = {
    group: groupRef,
    bodyGroup: useRef<THREE.Group>(null),
    leftFemur: useRef<THREE.Group>(null),
    rightFemur: useRef<THREE.Group>(null),
    leftTibia: useRef<THREE.Group>(null),
    rightTibia: useRef<THREE.Group>(null),
    leftFrontLeg: useRef<THREE.Group>(null),
    rightFrontLeg: useRef<THREE.Group>(null),
    leftMiddleLeg: useRef<THREE.Group>(null),
    rightMiddleLeg: useRef<THREE.Group>(null),
    leftWing: useRef<THREE.Mesh>(null),
    rightWing: useRef<THREE.Mesh>(null),
  };

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      if (refs.bodyGroup.current) {
        refs.bodyGroup.current.position.y = 0.6 + Math.sin(state.clock.elapsedTime * 4) * 0.1;
      }
    }
  });

  return (
    <group ref={groupRef} scale={2}>
      <GrasshopperModel refs={refs} shape={shape} materials={materials} />
    </group>
  );
};

export const LoadingScreen = () => {
  const [simState, setSimState] = useState(useSimulationStore.simulationState);
  const { triggerReset } = useSettings();

  useEffect(() => {
    const unsub = useSimulationStore.subscribe(() => {
      setSimState(useSimulationStore.simulationState);
    });
    return unsub;
  }, []);

  if (simState !== 'setup') return null;

  const handleStart = () => {
    useSimulationStore.setSimulationState('running');
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white font-sans">
      <div className="absolute inset-0 opacity-30">
        <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1} />
          <SpinningCricket />
        </Canvas>
      </div>

      <div className="relative w-full max-w-md p-8 text-center z-10">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -z-10"></div>
        
        <h1 className="text-6xl font-black tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-b from-emerald-400 to-emerald-700 drop-shadow-sm">
          CRICKET
          <br />
          <span className="text-4xl text-slate-100">ARENA</span>
        </h1>
        
        <p className="text-slate-400 mb-12 text-lg">
          A voxel ecosystem simulation
        </p>

        <button 
          onClick={handleStart}
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full text-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)]"
        >
          <Play fill="currentColor" size={24} />
          <span>START SIMULATION</span>
          <div className="absolute inset-0 rounded-full border-2 border-emerald-400 opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
        </button>
      </div>
    </div>
  );
};
