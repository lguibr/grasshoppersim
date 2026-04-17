import * as THREE from "three";
import { GrasshopperState } from "../../../types";
import { getGroundHeight } from "../../../utils/terrain";

export const handleCollision = (
  id: number,
  s: GrasshopperState,
  group: THREE.Group,
  positionsRef: React.MutableRefObject<Map<number, THREE.Vector3>>,
  scale: number,
) => {
  const myPos = group.position;
  let pushVec = new THREE.Vector3();
  const minDist = 2.5 * scale;

  positionsRef.current.forEach((otherPos, otherId) => {
    if (otherId !== id) {
      const distSq = myPos.distanceToSquared(otherPos);

      if (distSq < minDist * minDist) {
        let dist = Math.sqrt(distSq);
        let pushDir = new THREE.Vector3().subVectors(myPos, otherPos);
        if (dist < 0.001) {
          pushDir.randomDirection().multiplyScalar(0.1);
          dist = pushDir.length();
        }
        pushDir.normalize();
        const force = (minDist - dist) / dist;
        pushVec.addScaledVector(pushDir, force * 0.15);
      }
    }
  });

  if (pushVec.lengthSq() > 0) {
    myPos.add(pushVec);
    s.startPos.add(pushVec);
    s.targetPos.add(pushVec);
    if (!s.isJumping && !s.isFighting) {
      myPos.normalize().multiplyScalar(getGroundHeight(myPos));
    }
  }

  if (!positionsRef.current.has(id))
    positionsRef.current.set(id, new THREE.Vector3());
  positionsRef.current.get(id)!.copy(myPos);
};
