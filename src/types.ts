import * as THREE from 'three';

export interface GrasshopperTraits {
  jumpDistance: number;
  jumpHeight: number;
  speed: number;
  aggressiveness: number;
  lastName?: string;
  generation?: number;
}

export interface GrasshopperState {
  startPos: THREE.Vector3;
  targetPos: THREE.Vector3;
  jumpStart: number;
  jumpDuration: number;
  jumpHeight: number;
  flyPower: number;
  isJumping: boolean;
  isEating: boolean;
  targetFoodId: number | null;
  health: number;
  nextJumpTime: number;
  angle: number;
  time: number;
  growth: number;
  isFighting: boolean;
  traits: GrasshopperTraits;
  name: string;
  birthTime: number;
  lastSyncTime?: number;
  lastVisionTime?: number;
  lastReproductionTime?: number;
}

export interface FoodData {
  id: number;
  position: [number, number, number];
  scale: number;
  health: number;
  type?: 'plant' | 'egg';
  spawnTime?: number;
  parentTraits?: GrasshopperTraits;
}

export interface GrasshopperRefs {
  group: React.RefObject<THREE.Group | null>;
  bodyGroup: React.RefObject<THREE.Group | null>;
  leftFemur: React.RefObject<THREE.Group | null>;
  rightFemur: React.RefObject<THREE.Group | null>;
  leftTibia: React.RefObject<THREE.Group | null>;
  rightTibia: React.RefObject<THREE.Group | null>;
  leftFrontLeg: React.RefObject<THREE.Group | null>;
  rightFrontLeg: React.RefObject<THREE.Group | null>;
  leftMiddleLeg: React.RefObject<THREE.Group | null>;
  rightMiddleLeg: React.RefObject<THREE.Group | null>;
  leftWing: React.RefObject<THREE.Mesh | null>;
  rightWing: React.RefObject<THREE.Mesh | null>;
}

export interface ShapeVariations {
  scale: number;
  thoraxTop: number; thoraxBot: number;
  abdomenTop: number; abdomenBot: number;
  femurTop: number; femurBot: number;
  tibiaTop: number; tibiaBot: number;
  frontLegTop: number; frontLegBot: number;
}

export interface SimulationSettings {
  healthDecay: number;
  envSize: number;
  maxFood: number;
  foodSpawnRate: number;
  initialGrasshoppers: number;
  fightLifesteal: number;
  waterLevel: number;
  terrainRoughness: number;
}
