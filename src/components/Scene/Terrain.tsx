import React, { useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  getGroundHeight,
  setEnvSize,
  setTerrainRoughness,
} from "../../utils/terrain";
import { useSettings } from "../../context/SettingsContext";

export const Terrain = ({ size }: { size: number }) => {
  const { settings } = useSettings();

  // Update the global physics engine variables
  setEnvSize(size);
  setTerrainRoughness(settings.terrainRoughness);

  const geomRef = useRef<THREE.PlaneGeometry>(null);
  const rocksRef = useRef<THREE.InstancedMesh>(null);
  const grassRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    if (!geomRef.current) return;
    const pos = geomRef.current.attributes.position;
    const tempVec = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      tempVec.set(pos.getX(i), pos.getY(i), pos.getZ(i)).normalize();
      const height = getGroundHeight(tempVec);
      tempVec.multiplyScalar(height);
      pos.setXYZ(i, tempVec.x, tempVec.y, tempVec.z);
    }
    geomRef.current.computeVertexNormals();
    geomRef.current.attributes.position.needsUpdate = true;
  }, [size, settings.terrainRoughness, settings.envSize]);

  const waterMeshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (waterMeshRef.current) {
      const t = clock.getElapsedTime() * 0.1;
      waterMeshRef.current.rotation.set(t, t * 0.8, t * 1.2);
    }
  });

  const segments = Math.min(128, Math.floor(size / 4));

  // Generate random rocks and grass
  const rockCount = Math.floor(size * 2);
  const grassCount = Math.floor(size * 15);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    const getPointOnSphere = () => {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const x = Math.sin(phi) * Math.cos(theta);
      const y = Math.sin(phi) * Math.sin(theta);
      const z = Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    if (rocksRef.current) {
      for (let i = 0; i < rockCount; i++) {
        const p = getPointOnSphere();
        const dist = getGroundHeight(p);

        // Water level is an absolute distance from center now
        // Let's assume water level mapped to same relative value
        const waterHeight = size * 0.3 + settings.waterLevel;

        if (dist > waterHeight) {
          p.multiplyScalar(dist - 0.5);
          dummy.position.copy(p);

          dummy.lookAt(new THREE.Vector3(0, 0, 0)); // rocks look at center
          dummy.rotateX(Math.random() * Math.PI);
          dummy.rotateY(Math.random() * Math.PI);

          const scale = 1 + Math.random() * 3;
          dummy.scale.setScalar(scale);
          dummy.updateMatrix();
          rocksRef.current.setMatrixAt(i, dummy.matrix);
        } else {
          dummy.position.set(0, 0, 0);
          dummy.scale.setScalar(0);
          dummy.updateMatrix();
          rocksRef.current.setMatrixAt(i, dummy.matrix);
        }
      }
      rocksRef.current.instanceMatrix.needsUpdate = true;
    }

    if (grassRef.current) {
      for (let i = 0; i < grassCount; i++) {
        const p = getPointOnSphere();
        const dist = getGroundHeight(p);
        const waterHeight = size * 0.3 + settings.waterLevel;

        if (dist > waterHeight + 0.5) {
          const normal = p.clone().normalize();
          p.multiplyScalar(dist - 0.1); // sink slightly along normal into ground

          dummy.position.copy(p);

          // orient grass pointing UP using given normal
          const up = new THREE.Vector3(0, 1, 0);
          const quat = new THREE.Quaternion().setFromUnitVectors(up, normal);
          dummy.quaternion.copy(quat);

          // add random rotation around local Y
          dummy.rotateY(Math.random() * Math.PI);
          dummy.rotateZ((Math.random() - 0.5) * 0.4);
          dummy.rotateX((Math.random() - 0.5) * 0.4);

          const scale = 0.5 + Math.random() * 1.5;
          dummy.scale.setScalar(scale);
          dummy.updateMatrix();
          grassRef.current.setMatrixAt(i, dummy.matrix);
        } else {
          dummy.position.set(0, 0, 0);
          dummy.scale.setScalar(0);
          dummy.updateMatrix();
          grassRef.current.setMatrixAt(i, dummy.matrix);
        }
      }
      grassRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [
    size,
    rockCount,
    grassCount,
    dummy,
    settings.terrainRoughness,
    settings.waterLevel,
    settings.envSize,
  ]);

  return (
    <group>
      <mesh receiveShadow>
        <sphereGeometry ref={geomRef} args={[size * 0.3, segments, segments]} />
        <meshStandardMaterial
          color="#a8a29e"
          roughness={0.9}
          metalness={0.1}
          flatShading
        />
      </mesh>

      {/* Water Sphere */}
      <mesh ref={waterMeshRef} receiveShadow>
        <sphereGeometry args={[size * 0.3 + settings.waterLevel, 64, 64]} />
        <meshPhysicalMaterial
          color="#0284c7"
          transparent
          opacity={0.8}
          roughness={0.15}
          metalness={0.1}
          transmission={0.6}
          ior={1.33}
          thickness={2.0}
        />
      </mesh>

      {/* Grass */}
      <instancedMesh
        ref={grassRef}
        args={[undefined, undefined, grassCount]}
        castShadow
        receiveShadow
      >
        <coneGeometry args={[0.15, 1.5, 3]} />
        <meshStandardMaterial color="#4ade80" roughness={0.8} flatShading />
      </instancedMesh>

      {/* Rocks */}
      <instancedMesh
        ref={rocksRef}
        args={[undefined, undefined, rockCount]}
        castShadow
        receiveShadow
      >
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#57534e" roughness={0.8} flatShading />
      </instancedMesh>
    </group>
  );
};
