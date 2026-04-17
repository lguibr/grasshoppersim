import { useEffect, useCallback } from "react";
import * as THREE from "three";
import { FoodData, GrasshopperTraits } from "../../types";
import { useSettings } from "../../context/SettingsContext";
import { getGroundHeight } from "../../utils/terrain";
import { useFoodSpawner } from "./useFoodSpawner";
import { useEggHatcher } from "./useEggHatcher";
import { generateId } from "../../utils/id";

export const useFoodManager = (
  foodsRef: React.MutableRefObject<Map<number, FoodData>>,
  addCrickets: (
    newCrickets: {
      id: number;
      pos: [number, number, number];
      isBaby: boolean;
    }[],
  ) => void,
) => {
  const { settings, resetTrigger } = useSettings();

  useEffect(() => {
    foodsRef.current.clear();
  }, [resetTrigger, foodsRef]);

  useFoodSpawner(foodsRef, settings);
  useEggHatcher(foodsRef, addCrickets);

  const handleFoodEaten = useCallback(
    (id: number) => {
      foodsRef.current.delete(id);
    },
    [foodsRef],
  );

  const handleSpawnEgg = useCallback(
    (pos: [number, number, number], traits: GrasshopperTraits) => {
      const id = generateId();
      const posVec = new THREE.Vector3(pos[0], pos[1], pos[2]);
      const currentHeight = getGroundHeight(posVec);
      posVec.normalize().multiplyScalar(currentHeight);
      const newFood: FoodData = {
        id,
        position: [posVec.x, posVec.y, posVec.z],
        scale: 0.5,
        health: 100,
        type: "egg",
        spawnTime: Date.now(),
        parentTraits: traits,
      };
      foodsRef.current.set(id, newFood);
    },
    [foodsRef],
  );

  return { handleFoodEaten, handleSpawnEgg };
};
