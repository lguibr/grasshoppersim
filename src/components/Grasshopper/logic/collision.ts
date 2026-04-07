import * as THREE from 'three';
import { GrasshopperState } from '../../../types';
import { getGroundHeight } from '../../../utils/terrain';

export const handleCollision = (
  id: number,
  s: GrasshopperState,
  group: THREE.Group,
  positionsRef: React.MutableRefObject<Map<number, THREE.Vector3>>,
  scale: number
) => {
  const myPos = group.position;
  let pushX = 0, pushZ = 0;
  const minDist = 2.5 * scale;
  
  positionsRef.current.forEach((otherPos, otherId) => {
    if (otherId !== id) {
      let dx = myPos.x - otherPos.x;
      const dy = myPos.y - otherPos.y;
      let dz = myPos.z - otherPos.z;
      const distSq = dx*dx + dy*dy + dz*dz;
      
      if (distSq < minDist * minDist) {
        let dist = Math.sqrt(distSq);
        if (dist < 0.001) {
          dx = (Math.random() - 0.5) * 0.1;
          dz = (Math.random() - 0.5) * 0.1;
          dist = Math.sqrt(dx*dx + dz*dz);
        }
        const force = (minDist - dist) / dist;
        pushX += dx * force * 0.15;
        pushZ += dz * force * 0.15;
      }
    }
  });
  
  if (pushX !== 0 || pushZ !== 0) {
    myPos.x += pushX; myPos.z += pushZ;
    s.startPos.x += pushX; s.startPos.z += pushZ;
    s.targetPos.x += pushX; s.targetPos.z += pushZ;
    if (!s.isJumping && !s.isFighting) {
      myPos.y = getGroundHeight(myPos.x, myPos.z);
    }
  }
  
  if (!positionsRef.current.has(id)) positionsRef.current.set(id, new THREE.Vector3());
  positionsRef.current.get(id)!.copy(myPos);
};
