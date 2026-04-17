import * as THREE from "three";
import { GrasshopperState, FoodData } from "../../../types";

const _foodPos = new THREE.Vector3();

export const checkVision = (
  s: GrasshopperState,
  group: THREE.Group,
  foodsRef: React.MutableRefObject<Map<number, FoodData>>,
): FoodData | null => {
  let closestFood: FoodData | null = null;
  let minD = Infinity;

  foodsRef.current.forEach((food) => {
    if (food.type === "egg") return;
    _foodPos.set(food.position[0], food.position[1], food.position[2]);
    const d = group.position.distanceTo(_foodPos);
    if (d < 50) {
      const angleToFood = Math.atan2(
        food.position[0] - group.position.x,
        food.position[2] - group.position.z,
      );
      let angleDiff = Math.abs(s.angle - angleToFood);
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      angleDiff = Math.abs(angleDiff);

      // 90 degree cone (180 FOV)
      if (angleDiff < Math.PI / 2 && d < minD) {
        minD = d;
        closestFood = food;
      }
    }
  });

  return minD < 50 ? closestFood : null;
};
