import * as THREE from 'three';
import { GrasshopperState, FoodData } from '../../../types';
import { checkVision } from './vision';
import { initJump } from './jump';
import { getGroundHeight } from '../../../utils/terrain';

const _foodPos = new THREE.Vector3();

export const handleBehavior = (
  s: GrasshopperState,
  group: THREE.Group,
  foodsRef: React.MutableRefObject<Map<number, FoodData>>,
  settings: any,
  t: number
) => {
  if (s.isJumping || s.isEating) return;

  if (t - (s.lastVisionTime || 0) > 0.5) {
    const closestFood = checkVision(s, group, foodsRef);
    s.targetFoodId = closestFood ? closestFood.id : null;
    s.lastVisionTime = t;
  }

  if (s.targetFoodId) {
    const food = foodsRef.current.get(s.targetFoodId);
    if (food) {
      _foodPos.set(food.position[0], food.position[1], food.position[2]);
      const d = group.position.distanceTo(_foodPos);
      if (d < 3.0) {
        s.isEating = true;
        s.nextJumpTime = t + 1;
      } else if (t > s.nextJumpTime) {
        _foodPos.y = getGroundHeight(_foodPos.x, _foodPos.z);
        s.angle = Math.atan2(_foodPos.x - group.position.x, _foodPos.z - group.position.z);
        initJump(s, group, t, _foodPos, settings.envSize);
        s.health -= 1 * s.traits.jumpDistance;
      }
    } else {
      s.targetFoodId = null;
    }
  } else if (t > s.nextJumpTime) {
    initJump(s, group, t, undefined, settings.envSize);
    s.health -= 1 * s.traits.jumpDistance;
  }
};
