import React from 'react';
import * as THREE from 'three';

export const MushroomType1 = ({ position }: { position: THREE.Vector3 }) => (
    <group position={position}>
        <mesh position={[0, 0.4, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.2, 0.8]} />
            <meshStandardMaterial color="#fef08a" />
        </mesh>
        <mesh position={[0, 0.8, 0]} castShadow>
            <sphereGeometry args={[0.5, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#ef4444" />
        </mesh>
        {/* Spots */}
        <mesh position={[0.2, 1.0, 0.2]}><sphereGeometry args={[0.08, 4, 4]} /><meshBasicMaterial color="#ffffff" /></mesh>
        <mesh position={[-0.2, 0.9, -0.2]}><sphereGeometry args={[0.08, 4, 4]} /><meshBasicMaterial color="#ffffff" /></mesh>
        <mesh position={[0, 1.1, -0.2]}><sphereGeometry args={[0.08, 4, 4]} /><meshBasicMaterial color="#ffffff" /></mesh>
    </group>
);

export const MushroomType2 = ({ position }: { position: THREE.Vector3 }) => (
    <group position={position}>
        <mesh position={[0, 0.25, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.2, 0.5]} />
            <meshStandardMaterial color="#d6d3d1" />
        </mesh>
        <mesh position={[0, 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.6, 0.6, 0.15]} />
            <meshStandardMaterial color="#78350f" />
        </mesh>
    </group>
);
