import React from 'react';
import * as THREE from 'three';
import { GrasshopperRefs, ShapeVariations } from '../../types';

export const GrasshopperLegs = ({ refs, shape, material }: { refs: GrasshopperRefs, shape: ShapeVariations, material: THREE.Material }) => (
  <>
    <group ref={refs.leftFemur} position={[0.35, 0.1, 0]} rotation={[-0.6, 0, 0]}>
      <mesh position={[0, 0.4, 0]} material={material} castShadow><cylinderGeometry args={[shape.femurTop, shape.femurBot, 0.96, 12]} /></mesh>
      <group ref={refs.leftTibia} position={[0, 0.8, 0]} rotation={[1.2, 0, 0]}>
        <mesh position={[0, -0.45, 0]} material={material} castShadow><cylinderGeometry args={[shape.tibiaTop, shape.tibiaBot, 1.0, 12]} /></mesh>
      </group>
    </group>
    <group ref={refs.rightFemur} position={[-0.35, 0.1, 0]} rotation={[-0.6, 0, 0]}>
      <mesh position={[0, 0.4, 0]} material={material} castShadow><cylinderGeometry args={[shape.femurTop, shape.femurBot, 0.96, 12]} /></mesh>
      <group ref={refs.rightTibia} position={[0, 0.8, 0]} rotation={[1.2, 0, 0]}>
        <mesh position={[0, -0.45, 0]} material={material} castShadow><cylinderGeometry args={[shape.tibiaTop, shape.tibiaBot, 1.0, 12]} /></mesh>
      </group>
    </group>
    <group ref={refs.leftFrontLeg} position={[0.35, -0.1, 0.5]} rotation={[0.3, 0, 0]}>
      <mesh position={[0, -0.35, 0]} material={material} castShadow><cylinderGeometry args={[shape.frontLegTop, shape.frontLegBot, 0.8, 12]} /></mesh>
    </group>
    <group ref={refs.rightFrontLeg} position={[-0.35, -0.1, 0.5]} rotation={[0.3, 0, 0]}>
      <mesh position={[0, -0.35, 0]} material={material} castShadow><cylinderGeometry args={[shape.frontLegTop, shape.frontLegBot, 0.8, 12]} /></mesh>
    </group>
    <group ref={refs.leftMiddleLeg} position={[0.35, -0.1, 0.1]} rotation={[0.1, 0, 0]}>
      <mesh position={[0, -0.35, 0]} material={material} castShadow><cylinderGeometry args={[shape.frontLegTop, shape.frontLegBot, 0.8, 12]} /></mesh>
    </group>
    <group ref={refs.rightMiddleLeg} position={[-0.35, -0.1, 0.1]} rotation={[0.1, 0, 0]}>
      <mesh position={[0, -0.35, 0]} material={material} castShadow><cylinderGeometry args={[shape.frontLegTop, shape.frontLegBot, 0.8, 12]} /></mesh>
    </group>
  </>
);
