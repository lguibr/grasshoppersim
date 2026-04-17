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

    // Seed initial food alongside the swarm during setup
    const initialFoodCount = Math.floor(settings.maxFood * 0.5);
    for (let i = 0; i < initialFoodCount; i++) {
      const id = generateId();
      const health = 100 + Math.random() * 200;
      const scale = (0.8 + Math.random() * 0.6) * (health / 100);

      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const dir = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.sin(phi) * Math.sin(theta),
        Math.cos(phi),
      );
      const dist = getGroundHeight(dir);
      dir.multiplyScalar(dist);

      const newFood: FoodData = {
        id,
        position: [dir.x, dir.y, dir.z],
        scale,
        health,
        type: "plant",
      };
      foodsRef.current.set(id, newFood);
    }
  }, [resetTrigger, foodsRef, settings.maxFood]);

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
