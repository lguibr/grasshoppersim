import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export const SolarSystem = ({ size }: { size: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  const moon1Ref = useRef<THREE.Mesh>(null);
  const moon2Ref = useRef<THREE.Mesh>(null);
  const sunRedRef = useRef<THREE.Mesh>(null);
  const sunBlueRef = useRef<THREE.Mesh>(null);
  const otherPlanetRef = useRef<THREE.Group>(null);

  // Orbital parameters
  const baseRadius = size * 0.3 + 300;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.05;
      groupRef.current.rotation.z = t * 0.02;
    }

    // Binary Star System (Orbiting relative to the grasshopper world)
    // The grasshopper world essentially orbits this binary center
    const doubleStarDist = baseRadius + 1200;
    const binaryCenterX = Math.cos(t * 0.05) * doubleStarDist;
    const binaryCenterZ = Math.sin(t * 0.05) * doubleStarDist;
    const binaryCenterY = 0; // Flat orbital plane for perfect day/night axis

    // Red Star (larger, tight orbit around binary center)
    if (sunRedRef.current) {
      sunRedRef.current.position.set(
        binaryCenterX + Math.cos(t * 0.5) * 150,
        binaryCenterY,
        binaryCenterZ + Math.sin(t * 0.5) * 150,
      );
      sunRedRef.current.rotation.y += 0.01;
    }

    // Blue-White Star (smaller, hot, orbiting red star center)
    if (sunBlueRef.current) {
      sunBlueRef.current.position.set(
        binaryCenterX + Math.cos(t * 0.5 + Math.PI) * 200,
        binaryCenterY,
        binaryCenterZ + Math.sin(t * 0.5 + Math.PI) * 200,
      );
      sunBlueRef.current.rotation.y -= 0.02;
    }

    // Other Planet (orbits the binary stars on the same plane!)
    if (otherPlanetRef.current) {
      const pDist = 800; // Distance from the binary stars
      otherPlanetRef.current.position.set(
        binaryCenterX + Math.cos(t * 0.15) * pDist,
        binaryCenterY,
        binaryCenterZ + Math.sin(t * 0.15) * pDist,
      );
      otherPlanetRef.current.rotation.y += 0.02;
      otherPlanetRef.current.rotation.x += 0.01;
    }

    // Moons (Orbiting the grasshopper world)
    if (moon1Ref.current) {
      const r = baseRadius + 100;
      moon1Ref.current.position.set(
        Math.cos(t * 0.8) * r,
        0,
        Math.sin(t * 0.8) * r,
      );
      moon1Ref.current.rotation.x += 0.02;
      moon1Ref.current.rotation.y += 0.01;
    }

    if (moon2Ref.current) {
      const r = baseRadius + 220;
      moon2Ref.current.position.set(
        Math.sin(t * 0.4) * r,
        0,
        Math.cos(t * 0.4) * r,
      );
      moon2Ref.current.rotation.y += 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Red Star */}
      <mesh ref={sunRedRef}>
        <sphereGeometry args={[140, 64, 64]} />
        <meshStandardMaterial
          emissive="#ef4444"
          emissiveIntensity={10}
          color="#000000"
        />
        <pointLight
          intensity={150}
          distance={15000}
          decay={0.5}
          color="#ef4444"
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
      </mesh>

      {/* Blue-White Star */}
      <mesh ref={sunBlueRef}>
        <sphereGeometry args={[70, 64, 64]} />
        <meshStandardMaterial
          emissive="#e0f2fe"
          emissiveIntensity={20}
          color="#000000"
        />
        <pointLight
          intensity={250}
          distance={15000}
          decay={0.5}
          color="#e0f2fe"
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
      </mesh>

      {/* Other Planet with Ring (orbits the binary stars on the same plane) */}
      <group ref={otherPlanetRef}>
        <mesh castShadow receiveShadow>
          <icosahedronGeometry args={[80, 2]} />
          <meshStandardMaterial color="#b45309" roughness={0.9} flatShading />
        </mesh>
        {/* Ring */}
        <mesh rotation={[Math.PI / 2.5, 0, 0]} castShadow receiveShadow>
          <torusGeometry args={[130, 10, 2, 64]} />
          <meshStandardMaterial color="#fcd34d" roughness={0.6} />
        </mesh>
      </group>

      {/* Local Moons */}
      <mesh ref={moon1Ref} castShadow receiveShadow>
        <dodecahedronGeometry args={[25, 1]} />
        <meshStandardMaterial color="#cbd5e1" roughness={1.0} flatShading />
      </mesh>

      <mesh ref={moon2Ref} castShadow receiveShadow>
        <icosahedronGeometry args={[16, 1]} />
        <meshStandardMaterial color="#94a3b8" roughness={1.0} flatShading />
      </mesh>
    </group>
  );
};
