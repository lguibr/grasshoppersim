import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GrasshopperState, GrasshopperRefs, FoodData, GrasshopperTraits } from '../../types';
import { useSettings } from '../../context/SettingsContext';
import { useSimulationStore } from '../../store';
import { useGrasshopperMaterials } from './useGrasshopperMaterials';
import { updateGrasshopperFrame } from './logic/updateFrame';
import { generateName } from '../../utils/names';

const toRoman = (num: number): string => {
  if (num <= 1) return '';
  const roman: Record<string, number> = {
    M: 1000, CM: 900, D: 500, CD: 400,
    C: 100, XC: 90, L: 50, XL: 40,
    X: 10, IX: 9, V: 5, IV: 4, I: 1
  };
  let str = '';
  for (let i of Object.keys(roman)) {
    let q = Math.floor(num / roman[i]);
    num -= q * roman[i];
    str += i.repeat(q);
  }
  return ' ' + str;
};

const mutateTrait = (val: number, isAggro: boolean = false) => {
  // 10% chance for a major mutation, otherwise small drift
  const isMajor = Math.random() < 0.1;
  const magnitude = isMajor ? 0.5 : 0.1;
  let newVal = val + (Math.random() - 0.5) * magnitude;
  if (isAggro) return Math.max(0, Math.min(1, newVal));
  return Math.max(0.1, newVal);
};

export const useGrasshopper = (
  id: number, 
  initialPos: [number, number, number], 
  isBaby: boolean | undefined,
  parentTraits: GrasshopperTraits | undefined,
  positionsRef: React.MutableRefObject<Map<number, THREE.Vector3>>,
  foodsRef: React.MutableRefObject<Map<number, FoodData>>,
  targetsRef: React.MutableRefObject<Map<number, number | null>>,
  onFoodEaten: (id: number) => void,
  onDie: (id: number) => void,
  onSpawnEgg: (pos: [number, number, number], traits: GrasshopperTraits) => void
) => {
  const { settings } = useSettings();
  const { shape, baseColors, materials } = useGrasshopperMaterials(isBaby);
  
  const refs: GrasshopperRefs = {
    group: useRef<THREE.Group>(null), bodyGroup: useRef<THREE.Group>(null),
    leftFemur: useRef<THREE.Group>(null), rightFemur: useRef<THREE.Group>(null),
    leftTibia: useRef<THREE.Group>(null), rightTibia: useRef<THREE.Group>(null),
    leftFrontLeg: useRef<THREE.Group>(null), rightFrontLeg: useRef<THREE.Group>(null),
    leftMiddleLeg: useRef<THREE.Group>(null), rightMiddleLeg: useRef<THREE.Group>(null),
    leftWing: useRef<THREE.Mesh>(null), rightWing: useRef<THREE.Mesh>(null),
  };

  const nameData = useRef(generateName());

  const state = useRef<GrasshopperState>({
    startPos: new THREE.Vector3(...initialPos), targetPos: new THREE.Vector3(...initialPos),
    jumpStart: 0, jumpDuration: 0, jumpHeight: 0, flyPower: 2,
    isJumping: false, isEating: false, targetFoodId: null, health: 100,
    nextJumpTime: Math.random() * 2 + 1, angle: Math.random() * Math.PI * 2, time: 0,
    growth: isBaby ? 0 : 1, isFighting: false,
    name: parentTraits?.lastName 
      ? `${nameData.current.firstName} ${parentTraits.lastName}${toRoman((parentTraits.generation || 1) + 1)}` 
      : nameData.current.fullName,
    birthTime: Date.now(),
    traits: parentTraits ? {
      jumpDistance: mutateTrait(parentTraits.jumpDistance),
      jumpHeight: mutateTrait(parentTraits.jumpHeight),
      speed: mutateTrait(parentTraits.speed),
      aggressiveness: mutateTrait(parentTraits.aggressiveness, true),
      lastName: parentTraits.lastName,
      generation: (parentTraits.generation || 1) + 1
    } : {
      jumpDistance: 0.8 + Math.random() * 0.4,
      jumpHeight: 0.8 + Math.random() * 0.4,
      speed: 0.8 + Math.random() * 0.4,
      aggressiveness: Math.random(),
      lastName: nameData.current.lastName,
      generation: 1
    },
    lastSyncTime: 0,
    lastVisionTime: 0,
    lastFightCheckTime: 0,
    wasFighting: false,
    lastFightAggressiveness: 0
  } as any);

  useFrame((_, delta) => {
    updateGrasshopperFrame(
      id, state.current, refs, shape, materials, baseColors, 
      positionsRef, foodsRef, targetsRef, settings, delta, 
      onFoodEaten, onDie, onSpawnEgg
    );
  });

  useEffect(() => () => { 
    positionsRef.current.delete(id); 
    targetsRef.current.delete(id);
    useSimulationStore.removeStat(id);
  }, [id, positionsRef, targetsRef]);

  return { refs, shape, materials };
};
