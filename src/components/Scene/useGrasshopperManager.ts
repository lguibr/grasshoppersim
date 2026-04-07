import { useState, useCallback, useEffect } from 'react';
import * as THREE from 'three';
import { useSettings } from '../../context/SettingsContext';
import { getGroundHeight } from '../../utils/terrain';
import { useSimulationStore } from '../../store';
import { GrasshopperTraits } from '../../types';
import { generateId } from '../../utils/id';
import { generateName } from '../../utils/names';

export const useGrasshopperManager = (
  positionsRef: React.MutableRefObject<Map<number, THREE.Vector3>>,
  targetsRef: React.MutableRefObject<Map<number, number | null>>
) => {
  const { settings, resetTrigger } = useSettings();
  const [crickets, setCrickets] = useState<{ id: number, pos: [number, number, number], isBaby?: boolean, parentTraits?: GrasshopperTraits }[]>([]);

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
    
    if (simState === 'setup') {
      useSimulationStore.reset(1, 0);
      const nameData = generateName();
      const initial = [{
        id: generateId(),
        pos: [0, getGroundHeight(0, 0), 0] as [number, number, number],
        isBaby: false,
        parentTraits: { jumpDistance: 1.5, jumpHeight: 1.5, speed: 1.5, aggressiveness: 1, lastName: nameData.lastName, generation: 1 }
      }];
      setCrickets(initial);
      useSimulationStore.positions = positionsRef.current;
      useSimulationStore.setFollowedId(null);
    } else if (simState === 'running' && useSimulationStore.stats.size <= 1) {
      // Transitioning from setup to running
      useSimulationStore.reset(settings.initialGrasshoppers, 0);
      const initial = Array.from({ length: settings.initialGrasshoppers }, (_, i) => {
        const x = (Math.random() - 0.5) * settings.envSize;
        const z = (Math.random() - 0.5) * settings.envSize;
        const nameData = generateName();
        return {
          id: generateId(), 
          pos: [x, getGroundHeight(x, z), z] as [number, number, number],
          parentTraits: { jumpDistance: 0.8 + Math.random() * 0.4, jumpHeight: 0.8 + Math.random() * 0.4, speed: 0.8 + Math.random() * 0.4, aggressiveness: Math.random(), lastName: nameData.lastName, generation: 1 }
        };
      });
      setCrickets(initial);
      useSimulationStore.positions = positionsRef.current;
    }
  }, [resetTrigger, simState, settings.initialGrasshoppers, settings.envSize, positionsRef, targetsRef]);

  const handleCricketDeath = useCallback((id: number) => {
    setCrickets(prev => prev.filter(c => c.id !== id));
  }, []);

  const addCrickets = useCallback((newCrickets: { id: number, pos: [number, number, number], isBaby: boolean, parentTraits?: GrasshopperTraits }[]) => {
    setCrickets(prev => [...prev, ...newCrickets]);
  }, []);

  return { crickets, handleCricketDeath, addCrickets };
};
