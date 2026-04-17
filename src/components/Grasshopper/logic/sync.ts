import * as THREE from "three";
import { GrasshopperState } from "../../../types";
import { useSimulationStore } from "../../../store";

const redColor = new THREE.Color("#ef4444");
const greenColor = new THREE.Color("#22c55e");

export const syncGrasshopperState = (
  id: number,
  s: GrasshopperState,
  materials: any,
  baseColors: any,
  t: number,
) => {
  if (t - (s.lastSyncTime || 0) <= 0.2) return;

  const healthRatio = Math.min(1, Math.max(0, s.health / 100));
  materials.abdomen.color.lerpColors(
    baseColors.red,
    baseColors.abdomen,
    healthRatio,
  );
  materials.thorax.color.lerpColors(
    baseColors.red,
    baseColors.thorax,
    healthRatio,
  );
  materials.leg.color.lerpColors(baseColors.red, baseColors.leg, healthRatio);
  materials.visionCone.color.lerpColors(redColor, greenColor, healthRatio);
  materials.visionCone.opacity = Math.max(0.01, healthRatio * 0.15);

  if (s.isFighting) {
    materials.eye.color.setHex(0xff0000);
    materials.eye.emissive.setHex(0xff0000);
    materials.eye.emissiveIntensity = 2.0;
  } else {
    materials.eye.color.copy(baseColors.eye || new THREE.Color("#000000"));
    materials.eye.emissive.copy(baseColors.eye || new THREE.Color("#000000"));
    materials.eye.emissiveIntensity = 0.5;
  }

  let action = "idle";
  if (s.isFighting) action = "fighting";
  else if (s.isEating) action = "eating";
  else if (s.isJumping) action = "jumping";
  else if (s.targetFoodId) action = "hunting";

  useSimulationStore.updateStat(id, {
    id,
    health: s.health,
    action,
    isBaby: s.growth < 1,
    traits: s.traits,
    name: s.name,
    birthTime: s.birthTime,
  });
  s.lastSyncTime = t;
};
