import * as THREE from 'three';
import { GrasshopperState, GrasshopperRefs, FoodData, GrasshopperTraits } from '../../../types';
import { resetAnimation, applyEatingAnimation } from './animation';
import { getGroundHeight } from '../../../utils/terrain';

export const handleEating = (
  s: GrasshopperState,
  refs: GrasshopperRefs,
  foodsRef: React.MutableRefObject<Map<number, FoodData>>,
  delta: number,
  t: number,
  onFoodEaten: (id: number) => void,
  onSpawnEgg: (pos: [number, number, number], traits: GrasshopperTraits) => void
) => {
  const food = foodsRef.current.get(s.targetFoodId!);
  if (!food || food.health <= 0) {
    s.isEating = false;
    s.targetFoodId = null;
    resetAnimation(refs);
    return;
  }

  food.health -= delta * 20;
  s.health = Math.min(200, s.health + delta * 20);
  s.growth = Math.min(1, s.growth + delta * 0.4);
  
  // Reproduce while eating if healthy and mature enough, with a 2 second cooldown
  // Require 200% health to lay an egg to avoid super spawning
  if (s.health >= 200 && s.growth >= 1 && (t - (s.lastReproductionTime || 0) > 2)) {
    const eggX = refs.group.current!.position.x + (Math.random() - 0.5) * 2;
    const eggZ = refs.group.current!.position.z + (Math.random() - 0.5) * 2;
    onSpawnEgg([eggX, getGroundHeight(eggX, eggZ), eggZ], s.traits);
    s.health -= 150; // Cost of reproduction
    s.lastReproductionTime = t;
  }

  if (food.health <= 0) {
    onFoodEaten(food.id);
    s.isEating = false;
    s.targetFoodId = null;
    resetAnimation(refs);
  } else {
    applyEatingAnimation(s, refs, t);
  }
};
