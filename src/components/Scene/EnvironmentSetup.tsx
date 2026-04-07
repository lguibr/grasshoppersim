import React from 'react';
import { Environment } from '@react-three/drei';

export const EnvironmentSetup = () => (
  <>
    <fog attach="fog" args={['#0f172a', 100, 1500]} />
    <ambientLight intensity={0.5} />
    <directionalLight 
      position={[200, 400, 200]} intensity={1.5} castShadow 
      shadow-mapSize={[4096, 4096]} shadow-camera-left={-2000} shadow-camera-right={2000}
      shadow-camera-top={2000} shadow-camera-bottom={-2000} shadow-camera-near={0.1} shadow-camera-far={2000}
    />
    <Environment preset="night" />
  </>
);
