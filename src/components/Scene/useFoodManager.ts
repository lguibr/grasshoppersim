import { useEffect, useCallback } from 'react';
import { FoodData, GrasshopperTraits } from '../../types';
import { useSettings } from '../../context/SettingsContext';
import { getGroundHeight } from '../../utils/terrain';
import { useFoodSpawner } from './useFoodSpawner';
import { useEggHatcher } from './useEggHatcher';
import { generateId } from '../../utils/id';

export const useFoodManager = (
  foodsRef: React.MutableRefObject<Map<number, FoodData>>,
  addCrickets: (newCrickets: { id: number, pos: [number, number, number], isBaby: boolean }[]) => void
) => {
  const { settings, resetTrigger } = useSettings();

  useEffect(() => {
    foodsRef.current.clear();
  }, [resetTrigger, foodsRef]);

  useFoodSpawner(foodsRef, settings);
  useEggHatcher(foodsRef, addCrickets);

  const handleFoodEaten = useCallback((id: number) => {
    foodsRef.current.delete(id);
  }, [foodsRef]);

  const handleSpawnEgg = useCallback((pos: [number, number, number], traits: GrasshopperTraits) => {
    const id = generateId();
    const newFood: FoodData = {
      id,
      position: [pos[0], getGroundHeight(pos[0], pos[2]), pos[2]],
      scale: 0.5,
      health: 100,
      type: 'egg',
      spawnTime: Date.now(),
      parentTraits: traits
    };
    foodsRef.current.set(id, newFood);
  }, [foodsRef]);

  return { handleFoodEaten, handleSpawnEgg };
};
