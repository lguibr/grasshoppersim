import * as THREE from "three";
import { GrasshopperState } from "../../../types";
import { getPointFromHeadingAndDistance } from "../../../utils/terrain";

export const initJump = (
  s: GrasshopperState,
  group: THREE.Group,
  t: number,
  specificTarget?: THREE.Vector3,
  settings?: any,
) => {
  s.isJumping = true;
  s.jumpStart = t;
  s.jumpHeight = (Math.random() * 15 + 8) * s.traits.jumpHeight;
  s.flyPower =
    Math.random() > 0.6 ? 2 : (4 + Math.random() * 4) * s.traits.jumpDistance;

  const flyBonus = (s.flyPower - 2) / 6;
  const airTime = Math.sqrt(s.jumpHeight) * (0.25 + flyBonus * 0.25);
  s.jumpDuration = airTime / 0.8 / s.traits.speed;
  s.startPos.copy(group.position);

  if (specificTarget) {
    const dist = Math.min(
      s.startPos.distanceTo(specificTarget),
      15 * s.traits.jumpDistance,
    );
    getPointFromHeadingAndDistance(s.startPos, s.angle, dist, s.targetPos);
  } else {
    const horizontalSpeed =
      (Math.random() * 25 + 15 + flyBonus * 25) * s.traits.jumpDistance;
    const distance = horizontalSpeed * airTime;
    
    // Attempt to avoid water by picking up to 5 different directions
    let attempts = 0;
    let foundLand = false;
    
    while (attempts < 5 && !foundLand) {
      s.angle += (Math.random() - 0.5) * Math.PI;
      getPointFromHeadingAndDistance(s.startPos, s.angle, distance, s.targetPos);
      
      if (settings && s.targetPos.length() >= settings.envSize * 0.3 + settings.waterLevel) {
        foundLand = true;
      }
      attempts++;
    }
  }
};
