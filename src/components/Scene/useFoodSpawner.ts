import { useEffect } from 'react';
import { FoodData } from '../../types';
import { getGroundHeight } from '../../utils/terrain';
import { useSimulationStore } from '../../store';
import { generateId } from '../../utils/id';

export const useFoodSpawner = (
  foodsRef: React.MutableRefObject<Map<number, FoodData>>,
  settings: any
) => {
  useEffect(() => {
    const interval = setInterval(() => {
      if (useSimulationStore.simulationState !== 'running') return;
      
      let currentFoodCount = 0;
      foodsRef.current.forEach(f => { if (f.type !== 'egg') currentFoodCount++; });
      
      if (currentFoodCount < settings.maxFood) {
        const id = generateId();
        const x = (Math.random() - 0.5) * settings.envSize;
        const z = (Math.random() - 0.5) * settings.envSize;
        const health = 100 + Math.random() * 200;
        const scale = (0.8 + Math.random() * 0.6) * (health / 100);
        
        const newFood: FoodData = {
          id,
          position: [x, getGroundHeight(x, z), z],
          scale,
          health,
          type: 'plant'
        };
        foodsRef.current.set(id, newFood);
      }
    }, settings.foodSpawnRate);
    return () => clearInterval(interval);
  }, [settings.maxFood, settings.foodSpawnRate, settings.envSize, foodsRef]);
};
