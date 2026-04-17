import * as THREE from "three";
import {
  GrasshopperState,
  GrasshopperRefs,
  FoodData,
  GrasshopperTraits,
} from "../../../types";
import { applyJumpAnimation, resetAnimation } from "./animation";
import { handleCollision } from "./collision";
import { handleFighting } from "./fighting";
import { handleEating } from "./eating";
import { getGroundHeight, getGroundNormal } from "../../../utils/terrain";
import { syncGrasshopperState } from "./sync";
import { handleBehavior } from "./behavior";
import { useSimulationStore } from "../../../store";

const _normal = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);
const _alignQuat = new THREE.Quaternion();
const _yawQuat = new THREE.Quaternion();
const _targetQuat = new THREE.Quaternion();

export const updateGrasshopperFrame = (
  id: number,
  s: GrasshopperState,
  refs: GrasshopperRefs,
  shape: any,
  materials: any,
  baseColors: any,
  positionsRef: React.MutableRefObject<Map<number, THREE.Vector3>>,
  foodsRef: React.MutableRefObject<Map<number, FoodData>>,
  targetsRef: React.MutableRefObject<Map<number, number | null>>,
  settings: any,
  delta: number,
  onFoodEaten: (id: number) => void,
  onDie: (id: number) => void,
  onSpawnEgg: (
    pos: [number, number, number],
    traits: GrasshopperTraits,
  ) => void,
) => {
  s.time += delta;
  const t = s.time;
  if (!refs.group.current) return;

  const simState = useSimulationStore.simulationState;

  if (simState === "running") {
    const isUnderwater = refs.group.current.position.length() < (settings.envSize * 0.3 + settings.waterLevel);
    if (isUnderwater) {
      s.waterTime = (s.waterTime || 0) + delta;
      if (s.waterTime > 10) {
        s.health = 0; // Drowns totally
      }
    } else {
      s.waterTime = 0;
    }
    s.health -= delta * settings.healthDecay;
  }

  if (s.health <= 0) {
    onDie(id);
    return;
  }

  const currentScale = shape.scale * (0.4 + s.growth * 0.6);
  refs.group.current.scale.setScalar(currentScale);

  targetsRef.current.set(id, s.targetFoodId);

  if (simState === "running") {
    handleFighting(
      id,
      s,
      refs,
      positionsRef,
      targetsRef,
      currentScale,
      delta,
      t,
      settings,
    );
  }

  if (!s.isFighting) {
    if (!s.isJumping) {
      const pos = refs.group.current.position;
      pos.normalize().multiplyScalar(getGroundHeight(pos));

      _up.set(0, 1, 0);
      getGroundNormal(pos, _normal);
      _alignQuat.setFromUnitVectors(_up, _normal);
      _yawQuat.setFromAxisAngle(_up, s.angle);
      _targetQuat.multiplyQuaternions(_alignQuat, _yawQuat);

      refs.group.current.quaternion.slerp(_targetQuat, 0.15);
    } else {
      _up.set(0, 1, 0);
      getGroundNormal(refs.group.current.position, _normal);
      _alignQuat.setFromUnitVectors(_up, _normal);
      _yawQuat.setFromAxisAngle(_up, s.angle);
      _targetQuat.multiplyQuaternions(_alignQuat, _yawQuat);
      
      refs.group.current.quaternion.slerp(_targetQuat, 0.15);
    }
  }

  syncGrasshopperState(id, s, materials, baseColors, t);

  if (simState === "running") {
    handleBehavior(s, refs.group.current, foodsRef, settings, t);
  }

  if (s.isJumping) {
    const progress = (t - s.jumpStart) / s.jumpDuration;
    if (progress >= 1) {
      s.isJumping = false;
      s.nextJumpTime = t + Math.random() * 4 + 1;
      refs.group.current.position.copy(s.targetPos);
      resetAnimation(refs);
    } else applyJumpAnimation(s, refs, progress);
  } else if (s.isEating && simState === "running") {
    handleEating(s, refs, foodsRef, delta, t, onFoodEaten, onSpawnEgg);
  } else if (refs.bodyGroup.current) {
    refs.bodyGroup.current.position.set(0, 0.6 + Math.sin(t * 2) * 0.02, 0);
  }

  if (simState === "running") {
    handleCollision(id, s, refs.group.current, positionsRef, shape.scale);
  }

  useSimulationStore.angles.set(id, s.angle);
};
