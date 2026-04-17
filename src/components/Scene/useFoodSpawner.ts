import { useEffect } from "react";
import * as THREE from "three";
import { FoodData } from "../../types";
import { getGroundHeight } from "../../utils/terrain";
import { useSimulationStore } from "../../store";
import { generateId } from "../../utils/id";

export const useFoodSpawner = (
  foodsRef: React.MutableRefObject<Map<number, FoodData>>,
  settings: any,
) => {
  useEffect(() => {
    const interval = setInterval(() => {
      if (useSimulationStore.simulationState !== "running") return;

      let currentFoodCount = 0;
      foodsRef.current.forEach((f) => {
        if (f.type !== "egg") currentFoodCount++;
      });

      if (currentFoodCount < settings.maxFood) {
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
    }, settings.foodSpawnRate);
    return () => clearInterval(interval);
  }, [settings.maxFood, settings.foodSpawnRate, settings.envSize, foodsRef]);
};
