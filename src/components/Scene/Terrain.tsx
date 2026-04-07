import React, { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { getGroundHeight } from '../../utils/terrain';
import { useSettings } from '../../context/SettingsContext';

export const Terrain = ({ size }: { size: number }) => {
  const { settings } = useSettings();
  const geomRef = useRef<THREE.PlaneGeometry>(null);
  const waterGeomRef = useRef<THREE.PlaneGeometry>(null);
  const rocksRef = useRef<THREE.InstancedMesh>(null);
  const grassRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    if (!geomRef.current) return;
    const pos = geomRef.current.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i); // Local Y becomes World -Z after rotation
      pos.setZ(i, getGroundHeight(x, -y));
    }
    geomRef.current.computeVertexNormals();
    geomRef.current.attributes.position.needsUpdate = true;
  }, [size, settings.terrainRoughness]);

  useFrame(({ clock }) => {
    if (!waterGeomRef.current) return;
    const t = clock.getElapsedTime();
    const pos = waterGeomRef.current.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Simple noise for water waves
      const z = Math.sin(x * 0.05 + t) * Math.cos(y * 0.05 + t) * 2;
      pos.setZ(i, z);
    }
    waterGeomRef.current.computeVertexNormals();
    waterGeomRef.current.attributes.position.needsUpdate = true;
  });

  const segments = Math.min(512, Math.floor(size / 2));

  // Generate random rocks and grass
  const rockCount = Math.floor(size * 2);
  const grassCount = Math.floor(size * 15);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  useEffect(() => {
    if (rocksRef.current) {
      for (let i = 0; i < rockCount; i++) {
        const x = (Math.random() - 0.5) * size;
        const z = (Math.random() - 0.5) * size;
        const y = getGroundHeight(x, z);
        
        if (y > settings.waterLevel) {
          dummy.position.set(x, y - 0.5, z);
          dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
          const scale = 1 + Math.random() * 3;
          dummy.scale.set(scale, scale, scale);
          dummy.updateMatrix();
          rocksRef.current.setMatrixAt(i, dummy.matrix);
        } else {
          dummy.position.set(0, -1000, 0);
          dummy.updateMatrix();
          rocksRef.current.setMatrixAt(i, dummy.matrix);
        }
      }
      rocksRef.current.instanceMatrix.needsUpdate = true;
    }

    if (grassRef.current) {
      for (let i = 0; i < grassCount; i++) {
        const x = (Math.random() - 0.5) * size;
        const z = (Math.random() - 0.5) * size;
        const y = getGroundHeight(x, z);
        
        if (y > settings.waterLevel + 0.5) {
          const scale = 0.5 + Math.random() * 1.5;
          // Sink the grass slightly into the ground to prevent floating on uneven terrain
          dummy.position.set(x, y + 0.3 * scale, z);
          dummy.rotation.set(
            (Math.random() - 0.5) * 0.4, 
            Math.random() * Math.PI, 
            (Math.random() - 0.5) * 0.4
          );
          dummy.scale.set(scale, scale, scale);
          dummy.updateMatrix();
          grassRef.current.setMatrixAt(i, dummy.matrix);
        } else {
          dummy.position.set(0, -1000, 0);
          dummy.updateMatrix();
          grassRef.current.setMatrixAt(i, dummy.matrix);
        }
      }
      grassRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [size, rockCount, grassCount, dummy, settings.terrainRoughness, settings.waterLevel]);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry ref={geomRef} args={[size, size, segments, segments]} />
        <meshStandardMaterial color="#a8a29e" roughness={0.9} metalness={0.1} flatShading />
      </mesh>
      
      {/* Water Plane */}
      <mesh position={[0, settings.waterLevel, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry ref={waterGeomRef} args={[size, size, 64, 64]} />
        <meshStandardMaterial color="#0284c7" transparent opacity={0.8} roughness={0.1} metalness={0.8} flatShading />
      </mesh>

      {/* Grass */}
      <instancedMesh ref={grassRef} args={[undefined, undefined, grassCount]} castShadow receiveShadow>
        <coneGeometry args={[0.15, 1.5, 3]} />
        <meshStandardMaterial color="#4ade80" roughness={0.8} flatShading />
      </instancedMesh>

      {/* Rocks */}
      <instancedMesh ref={rocksRef} args={[undefined, undefined, rockCount]} castShadow receiveShadow>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#57534e" roughness={0.8} flatShading />
      </instancedMesh>
    </group>
  );
};
