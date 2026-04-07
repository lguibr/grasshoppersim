import * as THREE from 'three';
import { GrasshopperState } from '../../../types';
import { getGroundHeight } from '../../../utils/terrain';

export const initJump = (s: GrasshopperState, group: THREE.Group, t: number, specificTarget?: THREE.Vector3, envSize: number = 4000) => {
  s.isJumping = true;
  s.jumpStart = t;
  s.jumpHeight = (Math.random() * 15 + 8) * s.traits.jumpHeight;
  s.flyPower = Math.random() > 0.6 ? 2 : (4 + Math.random() * 4) * s.traits.jumpDistance;
  
  const flyBonus = (s.flyPower - 2) / 6;
  const airTime = Math.sqrt(s.jumpHeight) * (0.25 + flyBonus * 0.25);
  s.jumpDuration = (airTime / 0.8) / s.traits.speed;
  s.startPos.copy(group.position);
  
  if (specificTarget) {
    const dist = Math.min(s.startPos.distanceTo(specificTarget), 15 * s.traits.jumpDistance);
    const targetX = s.startPos.x + Math.sin(s.angle) * dist;
    const targetZ = s.startPos.z + Math.cos(s.angle) * dist;
    s.targetPos.set(targetX, getGroundHeight(targetX, targetZ), targetZ);
  } else {
    const horizontalSpeed = (Math.random() * 25 + 15 + flyBonus * 25) * s.traits.jumpDistance;
    const distance = horizontalSpeed * airTime;
    s.angle += (Math.random() - 0.5) * Math.PI;
    
    const targetX = s.startPos.x + Math.sin(s.angle) * distance;
    const targetZ = s.startPos.z + Math.cos(s.angle) * distance;
    s.targetPos.set(targetX, getGroundHeight(targetX, targetZ), targetZ);
  }
  
  const halfSize = envSize / 2;
  if (s.targetPos.x > halfSize || s.targetPos.x < -halfSize) {
    s.targetPos.x = Math.max(-halfSize, Math.min(halfSize, s.targetPos.x));
    s.angle = Math.atan2(s.targetPos.x - s.startPos.x, s.targetPos.z - s.startPos.z);
  }
  if (s.targetPos.z > halfSize || s.targetPos.z < -halfSize) {
    s.targetPos.z = Math.max(-halfSize, Math.min(halfSize, s.targetPos.z));
    s.angle = Math.atan2(s.targetPos.x - s.startPos.x, s.targetPos.z - s.startPos.z);
  }
  s.targetPos.y = getGroundHeight(s.targetPos.x, s.targetPos.z);
};
