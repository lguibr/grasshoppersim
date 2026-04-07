import React from 'react';
import { GrasshopperRefs, ShapeVariations } from '../../types';
import { GrasshopperLegs } from './GrasshopperLegs';

export const GrasshopperModel = ({ refs, shape, materials }: { refs: GrasshopperRefs, shape: ShapeVariations, materials: any }) => (
  <group ref={refs.bodyGroup} position={[0, 0.6, 0]}>
    <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.thorax} castShadow>
      <cylinderGeometry args={[shape.thoraxTop, shape.thoraxBot, 0.8, 16]} />
    </mesh>
    <mesh position={[0, -0.1, -0.7]} rotation={[Math.PI / 2 - 0.2, 0, 0]} material={materials.abdomen} castShadow>
      <cylinderGeometry args={[shape.abdomenTop, shape.abdomenBot, 1.2, 16]} />
    </mesh>
    <mesh position={[0, 0.1, 0.5]} rotation={[0.2, 0, 0]} material={materials.thorax} castShadow>
      <sphereGeometry args={[0.3, 16, 16]} />
    </mesh>
    <mesh position={[0.22, 0.2, 0.65]} material={materials.eye}><sphereGeometry args={[0.08, 16, 16]} /></mesh>
    <mesh position={[-0.22, 0.2, 0.65]} material={materials.eye}><sphereGeometry args={[0.08, 16, 16]} /></mesh>
    <mesh position={[0.15, 0.6, 0.7]} rotation={[0.5, 0, 0]} material={materials.antenna}>
      <cylinderGeometry args={[0.005, 0.03, 0.8, 8]} />
    </mesh>
    <mesh position={[-0.15, 0.6, 0.7]} rotation={[0.5, 0, 0]} material={materials.antenna}>
      <cylinderGeometry args={[0.005, 0.03, 0.8, 8]} />
    </mesh>
    <mesh ref={refs.leftWing} position={[0.15, 0.38, -0.4]} rotation={[Math.PI / 2 - 0.25, 0, -0.1]} scale={[1, 1, 0.2]} material={materials.wing} castShadow>
      <capsuleGeometry args={[0.2, 1.2, 4, 16]} />
    </mesh>
    <mesh ref={refs.rightWing} position={[-0.15, 0.38, -0.4]} rotation={[Math.PI / 2 - 0.25, 0, 0.1]} scale={[1, 1, 0.2]} material={materials.wing} castShadow>
      <capsuleGeometry args={[0.2, 1.2, 4, 16]} />
    </mesh>

    <GrasshopperLegs refs={refs} shape={shape} material={materials.leg} />
  </group>
);
