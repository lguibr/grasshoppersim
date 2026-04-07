import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useSimulationStore } from '../store';

export const CameraManager = () => {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3());
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const unsubscribe = useSimulationStore.subscribe(() => {
      setIsFollowing(useSimulationStore.followedId !== null);
    });
    return unsubscribe;
  }, []);

  useFrame(() => {
    const followedId = useSimulationStore.followedId;
    
    if (followedId && controlsRef.current) {
      const pos = useSimulationStore.positions.get(followedId);
      const angle = useSimulationStore.angles.get(followedId) || 0;
      
      if (pos) {
        // First person view from the cricket's head
        const headOffset = new THREE.Vector3(0, 1.5, 0); // Adjust height as needed
        const headPos = pos.clone().add(headOffset);
        
        // Direction the cricket is facing
        const dir = new THREE.Vector3(Math.sin(angle), 0, Math.cos(angle));
        
        // Position camera behind and slightly above the cricket
        const cameraOffset = new THREE.Vector3(0, 3, 0).add(dir.clone().multiplyScalar(-6));
        const targetCameraPos = pos.clone().add(cameraOffset);
        
        // Look ahead of the cricket
        const lookAtPos = headPos.clone().add(dir.multiplyScalar(10));
        
        camera.position.lerp(targetCameraPos, 0.15);
        
        // Manually update camera rotation to look at target
        const currentLookAt = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).add(camera.position);
        currentLookAt.lerp(lookAtPos, 0.2);
        camera.lookAt(currentLookAt);
        
        // Update controls target so when we stop following, it doesn't jump wildly
        controlsRef.current.target.copy(lookAtPos);
      } else {
        // Grasshopper died or disappeared
        useSimulationStore.setFollowedId(null);
      }
    } else if (controlsRef.current && !followedId) {
      // Default auto-rotation when not following
      controlsRef.current.target.lerp(new THREE.Vector3(0, 0, 0), 0.05);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls 
      ref={controlsRef}
      enabled={!isFollowing}
      autoRotate={!isFollowing} 
      autoRotateSpeed={0.5} 
      maxPolarAngle={Math.PI / 2.5} 
      minPolarAngle={Math.PI / 6}
      minDistance={10} 
      maxDistance={3000} 
    />
  );
};
