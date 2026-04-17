import React from "react";
import * as THREE from "three";

export const ProceduralTree = ({
  position,
  seed,
}: {
  position: THREE.Vector3;
  seed: number;
}) => {
  const up = position.clone().normalize();
  const quat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    up,
  );
  const random = (offset: number) => {
    const x = Math.sin(seed * 12.9898 + offset * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };

  const scale = 1.5 + random(0) * 1.5;

  return (
    <group position={position} quaternion={quat} scale={[scale, scale, scale]}>
      {/* Trunk */}
      <mesh position={[0, 5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 1.2, 10, 6]} />
        <meshStandardMaterial color="#381c0e" roughness={0.9} />
      </mesh>

      {/* Branch 1 */}
      <group
        position={[0, 6, 0]}
        rotation={[0, random(1) * Math.PI * 2, Math.PI / 4 + random(2) * 0.2]}
      >
        <mesh position={[0, 3, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.4, 0.7, 6, 5]} />
          <meshStandardMaterial color="#381c0e" roughness={0.9} />
        </mesh>
        <mesh position={[0, 6, 0]} castShadow receiveShadow>
          <sphereGeometry args={[2.5, 6, 6]} />
          <meshStandardMaterial color="#064e3b" roughness={0.8} />
        </mesh>
      </group>

      {/* Branch 2 */}
      <group
        position={[0, 8, 0]}
        rotation={[0, random(3) * Math.PI * 2, Math.PI / 3 + random(4) * 0.2]}
      >
        <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.3, 0.6, 5, 5]} />
          <meshStandardMaterial color="#381c0e" roughness={0.9} />
        </mesh>
        <mesh position={[0, 5, 0]} castShadow receiveShadow>
          <sphereGeometry args={[2, 5, 5]} />
          <meshStandardMaterial color="#047857" roughness={0.8} />
        </mesh>
      </group>

      {/* Top Leaves */}
      <mesh position={[0, 11, 0]} castShadow receiveShadow>
        <sphereGeometry args={[3, 7, 7]} />
        <meshStandardMaterial color="#059669" roughness={0.8} />
      </mesh>
    </group>
  );
};
