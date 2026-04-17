import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Sky } from '@react-three/drei';
import * as THREE from 'three';
import { Grasshopper } from './index';
import { FoodData } from '../../types';
import { SettingsProvider } from '../../context/SettingsContext';

export default {
  title: 'Simulation/Grasshopper',
  component: Grasshopper,
};

const SphereWorldDemo = () => {
  const positionsRef = useRef(new Map<number, THREE.Vector3>());
  const foodsRef = useRef(new Map<number, FoodData>());
  const targetsRef = useRef(new Map<number, number | null>());

  // Start perfectly on top of a 50-radius sphere
  const initialPos = useMemo(() => new THREE.Vector3(0, 50, 0), []);
  positionsRef.current.set(0, initialPos);

  const handleFoodEaten = (id: number) => console.log('Eaten', id);
  const handleDie = (id: number) => console.log('Died', id);
  const handleSpawnEgg = () => console.log('Spawn Egg');

  return (
    <>
      <color attach="background" args={['#87CEEB']} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} castShadow />
      <Sky sunPosition={[100, 20, 100]} turbidity={0.3} rayleigh={0.5} />

      {/* Sphere World */}
      <mesh receiveShadow>
        <sphereGeometry args={[50, 128, 128]} />
        <meshStandardMaterial color="#8FBC8F" roughness={0.8} />
      </mesh>

      <Grasshopper
        id={0}
        position={[initialPos.x, initialPos.y, initialPos.z]}
        positionsRef={positionsRef}
        foodsRef={foodsRef}
        targetsRef={targetsRef}
        onFoodEaten={handleFoodEaten}
        onDie={handleDie}
        onSpawnEgg={handleSpawnEgg}
      />
      <OrbitControls makeDefault target={[0, 50, 0]} />
    </>
  );
};

export const InfiniteFlightSphere = () => {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <SettingsProvider>
        <Canvas shadows camera={{ position: [0, 60, 20], fov: 45 }}>
          <SphereWorldDemo />
        </Canvas>
      </SettingsProvider>
    </div>
  );
};
