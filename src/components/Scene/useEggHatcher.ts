import { useEffect } from "react";
import { FoodData, GrasshopperTraits } from "../../types";
import { useSimulationStore } from "../../store";

import { generateId } from "../../utils/id";

export const useEggHatcher = (
  foodsRef: React.MutableRefObject<Map<number, FoodData>>,
  addCrickets: (
    newCrickets: {
      id: number;
      pos: [number, number, number];
      isBaby: boolean;
      parentTraits?: GrasshopperTraits;
    }[],
  ) => void,
) => {
  useEffect(() => {
    const interval = setInterval(() => {
      if (useSimulationStore.simulationState !== "running") return;

      const now = Date.now();
      let hatched = false;
      const newCrickets: {
        id: number;
        pos: [number, number, number];
        isBaby: boolean;
        parentTraits?: GrasshopperTraits;
      }[] = [];

      foodsRef.current.forEach((food, id) => {
        if (
          food.type === "egg" &&
          food.spawnTime &&
          now - food.spawnTime > 30000
        ) {
          foodsRef.current.delete(id);
          hatched = true;
          newCrickets.push({
            id: generateId(),
            pos: food.position,
            isBaby: true,
            parentTraits: food.parentTraits,
          });
        }
      });

      if (hatched) {
        addCrickets(newCrickets);
      }

      useSimulationStore.addHistoryPoint(
        useSimulationStore.stats.size,
        foodsRef.current.size,
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [foodsRef, addCrickets]);
};
