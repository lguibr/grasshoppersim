import React from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Scene } from './components/Scene';
import { SettingsProvider } from './context/SettingsContext';
import { CameraManager } from './components/CameraManager';
import { LoadingScreen } from './components/LoadingScreen';
import { GameLayout } from './components/GameLayout';
import { TooltipProvider } from './components/ui/tooltip';

export default function App() {
  return (
    <SettingsProvider>
      <TooltipProvider>
        <GameLayout>
          <LoadingScreen />
          <Canvas shadows={{ type: THREE.PCFShadowMap }} camera={{ position: [0, 5, 10], fov: 45, far: 20000 }}>
            <color attach="background" args={['#020617']} />
            <Scene />
            <CameraManager />
            <EffectComposer>
              <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={1.5} />
            </EffectComposer>
          </Canvas>
        </GameLayout>
      </TooltipProvider>
    </SettingsProvider>
  );
}
