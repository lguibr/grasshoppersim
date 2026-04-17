import React, { useRef } from "react";
import * as THREE from "three";
import { Grasshopper } from "../Grasshopper";
import { InstancedFoods } from "../Food/InstancedFoods";
import { EnvironmentSetup } from "./EnvironmentSetup";
import { Terrain } from "./Terrain";
import { EnvironmentDecorations } from "./EnvironmentDecorations";
import { PlanetGrass } from "./Decorations/PlanetGrass";
import { FoodData } from "../../types";
import { useSettings } from "../../context/SettingsContext";
import { useGrasshopperManager } from "./useGrasshopperManager";
import { useFoodManager } from "./useFoodManager";
import { SolarSystem } from "./SolarSystem";

export const Scene = () => {
  const { settings } = useSettings();
  const positionsRef = useRef(new Map<number, THREE.Vector3>());
  const targetsRef = useRef(new Map<number, number | null>());
  const foodsRef = useRef(new Map<number, FoodData>());

  const { crickets, handleCricketDeath, addCrickets } = useGrasshopperManager(
    positionsRef,
    targetsRef,
  );
  const { handleFoodEaten, handleSpawnEgg } = useFoodManager(
    foodsRef,
    addCrickets,
  );

  return (
    <>
      <EnvironmentSetup />
      <group>
        <InstancedFoods foodsRef={foodsRef} />
        {crickets.map((c) => (
          <Grasshopper
            key={c.id}
            id={c.id}
            position={c.pos}
            isBaby={c.isBaby}
            parentTraits={c.parentTraits}
            positionsRef={positionsRef}
            foodsRef={foodsRef}
            targetsRef={targetsRef}
            onFoodEaten={handleFoodEaten}
            onDie={handleCricketDeath}
            onSpawnEgg={handleSpawnEgg}
          />
        ))}
      </group>
      <Terrain size={settings.envSize + 200} />
      <EnvironmentDecorations size={settings.envSize + 200} />
      <PlanetGrass />
      <SolarSystem size={settings.envSize + 200} />
    </>
  );
};
