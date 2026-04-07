import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FoodData } from '../../types';

export const Food = React.memo(({ data, foodsRef }: { data: FoodData, foodsRef: React.MutableRefObject<Map<number, FoodData>> }) => {
  const ref = useRef<THREE.Group>(null);
  const leavesRef = useRef<THREE.Group>(null);
  
  useFrame((_, delta) => {
    if (ref.current && leavesRef.current) {
      const currentData = foodsRef.current.get(data.id);
      if (currentData) {
        const healthRatio = Math.max(0, currentData.health / 100);
        const targetScale = Math.max(0.01, healthRatio) * data.scale;
        ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
        
        if (healthRatio < 1 && healthRatio > 0) {
           leavesRef.current.rotation.y += delta * 10;
           leavesRef.current.rotation.z = Math.sin(Date.now() / 50) * 0.1;
        }
      }
    }
  });

  return (
    <group ref={ref} position={data.position}>
      <group ref={leavesRef} position={[0, data.type === 'egg' ? 0.2 : 0.5, 0]}>
        {data.type === 'egg' ? (
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.2} roughness={0.4} />
          </mesh>
        ) : (
          <>
            <mesh position={[0, 0.5, 0]} castShadow>
              <coneGeometry args={[0.4, 1.5, 5]} />
              <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.5} roughness={0.8} />
            </mesh>
            <mesh position={[0.3, 0.2, 0]} rotation={[0, 0, -0.5]} castShadow>
              <coneGeometry args={[0.2, 0.8, 5]} />
              <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={0.3} roughness={0.8} />
            </mesh>
            <mesh position={[-0.3, 0.2, 0]} rotation={[0, 0, 0.5]} castShadow>
              <coneGeometry args={[0.2, 0.8, 5]} />
              <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={0.3} roughness={0.8} />
            </mesh>
          </>
        )}
      </group>
    </group>
  );
});
