import React from "react";
import * as THREE from "three";
import { useGrasshopper } from "./useGrasshopper";
import { GrasshopperModel } from "./GrasshopperModel";
import { FoodData, GrasshopperTraits } from "../../types";

interface Props {
  id: number;
  position: [number, number, number];
  isBaby?: boolean;
  parentTraits?: GrasshopperTraits;
  positionsRef: React.MutableRefObject<Map<number, THREE.Vector3>>;
  foodsRef: React.MutableRefObject<Map<number, FoodData>>;
  targetsRef: React.MutableRefObject<Map<number, number | null>>;
  onFoodEaten: (id: number) => void;
  onDie: (id: number) => void;
  onSpawnEgg: (
    pos: [number, number, number],
    traits: GrasshopperTraits,
  ) => void;
}

export const Grasshopper = React.memo(
  ({
    id,
    position,
    isBaby,
    parentTraits,
    positionsRef,
    foodsRef,
    targetsRef,
    onFoodEaten,
    onDie,
    onSpawnEgg,
  }: Props) => {
    const { refs, shape, materials } = useGrasshopper(
      id,
      position,
      isBaby,
      parentTraits,
      positionsRef,
      foodsRef,
      targetsRef,
      onFoodEaten,
      onDie,
      onSpawnEgg,
    );

    return (
      <group ref={refs.group} position={position}>
        <GrasshopperModel refs={refs} shape={shape} materials={materials} />
        {/* Vision Cones - attached to main group so they don't pitch up during jump */}
        <group
          position={[0.22, 0.8, 0.65]}
          rotation={[-Math.PI / 2 - 0.2, 0, 0]}
        >
          <mesh position={[0, -25, 0]} material={materials.visionCone}>
            <coneGeometry args={[50, 50, 16]} />
          </mesh>
        </group>
        <group
          position={[-0.22, 0.8, 0.65]}
          rotation={[-Math.PI / 2 - 0.2, 0, 0]}
        >
          <mesh position={[0, -25, 0]} material={materials.visionCone}>
            <coneGeometry args={[50, 50, 16]} />
          </mesh>
        </group>
      </group>
    );
  },
);
