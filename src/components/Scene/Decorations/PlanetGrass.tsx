import React, { useMemo } from 'react';
import * as THREE from 'three';
import { getGroundHeight, getGroundNormal } from '../../../utils/terrain';

export const PlanetGrass = () => {
  const count = 20000;
  
  const meshSettings = useMemo(() => {
    const matrices = new Float32Array(count * 16);
    const m = new THREE.Matrix4();
    const pos = new THREE.Vector3();
    const up = new THREE.Vector3(0, 1, 0);
    const normal = new THREE.Vector3();
    const alignQuat = new THREE.Quaternion();
    const q = new THREE.Quaternion();

    for (let i = 0; i < count; i++) {
        // Random point on sphere
        const phi = Math.acos(1 - 2 * Math.random());
        const theta = Math.random() * 2 * Math.PI;
        
        pos.setFromSphericalCoords(1, phi, theta);
        const height = getGroundHeight(pos);
        pos.multiplyScalar(height);
        
        getGroundNormal(pos, normal);
        
        // Random yaw rotation
        const yaw = Math.random() * Math.PI * 2;
        q.setFromAxisAngle(normal, yaw);
        
        alignQuat.setFromUnitVectors(up, normal);
        alignQuat.premultiply(q);
        
        m.makeRotationFromQuaternion(alignQuat);
        m.setPosition(pos);
        
        // Random scale (blade shape)
        const scaleX = 0.5 + Math.random() * 0.5;
        const scaleY = 1.0 + Math.random() * 2.0;
        const scaleZ = 0.5 + Math.random() * 0.5;
        m.scale(new THREE.Vector3(scaleX, scaleY, scaleZ));
        
        m.toArray(matrices, i * 16);
    }
    return { matrices };
  }, [count]);

  return (
    <instancedMesh args={[undefined as any, undefined as any, count]} castShadow receiveShadow>
      <instancedBufferAttribute attach="instanceMatrix" args={[meshSettings.matrices, 16]} />
      {/* Simple triangular blade of grass */}
      <coneGeometry args={[0.2, 2, 3]} />
      <meshStandardMaterial color="#0f7632" roughness={0.9} />
    </instancedMesh>
  );
};
