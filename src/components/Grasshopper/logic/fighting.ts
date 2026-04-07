import * as THREE from 'three';
import { GrasshopperState, GrasshopperRefs } from '../../../types';
import { useSimulationStore } from '../../../store';
import { getGroundHeight } from '../../../utils/terrain';

export const handleFighting = (
  id: number,
  s: GrasshopperState,
  refs: GrasshopperRefs,
  positionsRef: React.MutableRefObject<Map<number, THREE.Vector3>>,
  targetsRef: React.MutableRefObject<Map<number, number | null>>,
  currentScale: number,
  delta: number,
  t: number,
  settings: any
) => {
  s.isFighting = false;
  if (!s.targetFoodId || !refs.group.current) return;

  // Throttle fighting check to ~10fps
  if (t - (s as any).lastFightCheckTime < 0.1) {
    if ((s as any).wasFighting) {
      s.isFighting = true;
      const damage = delta * 5 * ((s as any).lastFightAggressiveness || 0.5);
      s.health -= damage;
      
      // Lifesteal
      if ((s as any).lastFightOtherId) {
        const otherStat = useSimulationStore.stats.get((s as any).lastFightOtherId);
        if (otherStat && otherStat.health > 0) {
           const lifesteal = damage * (settings.fightLifesteal / 100);
           s.health = Math.min(100, s.health + lifesteal);
        }
      }
      
      refs.group.current!.position.y = getGroundHeight(refs.group.current!.position.x, refs.group.current!.position.z) + Math.abs(Math.sin(t * 20)) * 1.5;
      refs.group.current!.rotation.z = Math.sin(t * 40) * 0.3;
      refs.group.current!.rotation.x = Math.cos(t * 40) * 0.3;

      if (refs.leftFrontLeg.current) refs.leftFrontLeg.current.rotation.x = 0.3 + Math.sin(t * 50) * 0.5;
      if (refs.rightFrontLeg.current) refs.rightFrontLeg.current.rotation.x = 0.3 + Math.cos(t * 50) * 0.5;
      if (refs.leftWing.current) refs.leftWing.current.rotation.set(Math.PI / 2 - 0.5, Math.sin(t * 60) * 0.5, -0.8 + Math.sin(t * 60));
      if (refs.rightWing.current) refs.rightWing.current.rotation.set(Math.PI / 2 - 0.5, -Math.sin(t * 60) * 0.5, 0.8 - Math.sin(t * 60));
    }
    return;
  }
  (s as any).lastFightCheckTime = t;
  (s as any).wasFighting = false;
  (s as any).lastFightOtherId = null;

  positionsRef.current.forEach((pos, otherId) => {
    if (otherId !== id && targetsRef.current.get(otherId) === s.targetFoodId) {
      if (refs.group.current!.position.distanceTo(pos) < 2 * currentScale) {
        s.isFighting = true;
        (s as any).wasFighting = true;
        (s as any).lastFightOtherId = otherId;
        const otherStat = useSimulationStore.stats.get(otherId);
        const otherAggressiveness = otherStat?.traits.aggressiveness || 0.5;
        (s as any).lastFightAggressiveness = otherAggressiveness;
        
        const damage = delta * 5 * otherAggressiveness;
        s.health -= damage;
        
        // Lifesteal
        if (otherStat && otherStat.health > 0) {
           const lifesteal = damage * (settings.fightLifesteal / 100);
           s.health = Math.min(100, s.health + lifesteal);
        }
        
        refs.group.current!.position.y = getGroundHeight(refs.group.current!.position.x, refs.group.current!.position.z) + Math.abs(Math.sin(t * 20)) * 1.5;
        refs.group.current!.rotation.z = Math.sin(t * 40) * 0.3;
        refs.group.current!.rotation.x = Math.cos(t * 40) * 0.3;

        if (refs.leftFrontLeg.current) refs.leftFrontLeg.current.rotation.x = 0.3 + Math.sin(t * 50) * 0.5;
        if (refs.rightFrontLeg.current) refs.rightFrontLeg.current.rotation.x = 0.3 + Math.cos(t * 50) * 0.5;
        if (refs.leftWing.current) refs.leftWing.current.rotation.set(Math.PI / 2 - 0.5, Math.sin(t * 60) * 0.5, -0.8 + Math.sin(t * 60));
        if (refs.rightWing.current) refs.rightWing.current.rotation.set(Math.PI / 2 - 0.5, -Math.sin(t * 60) * 0.5, 0.8 - Math.sin(t * 60));
      }
    }
  });
};
