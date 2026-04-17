import React, { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { getPointFromHeadingAndDistance } from "../utils/terrain";
import { useSimulationStore } from "../store";

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
        const up = pos.clone().normalize();
        const headOffset = up.clone().multiplyScalar(1.5);
        const headPos = pos.clone().add(headOffset);

        // Compute true forward direction from spherical rotation quaternion exactly matching the mesh rendering
        const alignQuat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), up);
        const yawQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
        const finalQuat = new THREE.Quaternion().multiplyQuaternions(alignQuat, yawQuat);
        
        // Grasshopper mesh is facing +Z
        const dir = new THREE.Vector3(0, 0, 1).applyQuaternion(finalQuat).normalize();

        // Position camera tightly behind the head for Action POV
        const cameraOffset = up.clone().multiplyScalar(1.4).add(dir.clone().multiplyScalar(-1.5));
        const targetCameraPos = pos.clone().add(cameraOffset);

        // Look directly ahead along the vision path
        const lookAtPos = headPos.clone().add(dir.multiplyScalar(15));

        // Align camera's internal up vector to the planet normal so lookAt doesn't twist wildly
        camera.up.lerp(up, 0.2).normalize();

        camera.position.lerp(targetCameraPos, 0.15);

        // Manually update camera rotation to look at target
        const currentLookAt = new THREE.Vector3(0, 0, -1)
          .applyQuaternion(camera.quaternion)
          .add(camera.position);
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
      maxPolarAngle={Math.PI}
      minDistance={10}
      maxDistance={3000}
    />
  );
};
