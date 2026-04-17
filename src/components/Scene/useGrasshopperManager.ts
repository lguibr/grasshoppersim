import { useState, useCallback, useEffect } from "react";
import * as THREE from "three";
import { useSettings } from "../../context/SettingsContext";
import { getGroundHeight } from "../../utils/terrain";
import { useSimulationStore } from "../../store";
import { GrasshopperTraits } from "../../types";
import { generateId } from "../../utils/id";
import { generateName } from "../../utils/names";

export const useGrasshopperManager = (
  positionsRef: React.MutableRefObject<Map<number, THREE.Vector3>>,
  targetsRef: React.MutableRefObject<Map<number, number | null>>,
) => {
  const { settings, resetTrigger } = useSettings();
  const [crickets, setCrickets] = useState<
    {
      id: number;
      pos: [number, number, number];
      isBaby?: boolean;
      parentTraits?: GrasshopperTraits;
    }[]
  >([]);

  const [simState, setSimState] = useState(useSimulationStore.simulationState);

  useEffect(() => {
    const unsub = useSimulationStore.subscribe(() => {
      setSimState(useSimulationStore.simulationState);
    });
    return unsub;
  }, []);

  useEffect(() => {
    positionsRef.current.clear();
    targetsRef.current.clear();

    if (
      simState === "setup" ||
      (simState === "running" && useSimulationStore.stats.size === 0)
    ) {
      useSimulationStore.reset(settings.initialGrasshoppers, 0);
      const initial = Array.from(
        { length: settings.initialGrasshoppers },
        (_, i) => {
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
          const nameData = generateName();
          return {
            id: generateId(),
            pos: [dir.x, dir.y, dir.z] as [number, number, number],
            parentTraits: {
              jumpDistance: 0.8 + Math.random() * 0.4,
              jumpHeight: 0.8 + Math.random() * 0.4,
              speed: 0.8 + Math.random() * 0.4,
              aggressiveness: Math.random(),
              lastName: nameData.lastName,
              generation: 1,
            },
          };
        },
      );
      setCrickets(initial);
      useSimulationStore.positions = positionsRef.current;
      if (simState === "setup") {
        useSimulationStore.setFollowedId(null);
      }
    }
  }, [
    resetTrigger,
    simState,
    settings.initialGrasshoppers,
    settings.envSize,
    positionsRef,
    targetsRef,
  ]);

  const handleCricketDeath = useCallback((id: number) => {
    setCrickets((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const addCrickets = useCallback(
    (
      newCrickets: {
        id: number;
        pos: [number, number, number];
        isBaby: boolean;
        parentTraits?: GrasshopperTraits;
      }[],
    ) => {
      setCrickets((prev) => [...prev, ...newCrickets]);
    },
    [],
  );

  return { crickets, handleCricketDeath, addCrickets };
};
