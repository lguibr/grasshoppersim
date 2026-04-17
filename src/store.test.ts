import { describe, it, expect, beforeEach } from 'vitest';
import { useSimulationStore } from './store';

describe('Simulation Store Rules and Boundings', () => {

  beforeEach(() => {
    useSimulationStore.reset(0, 0);
  });

  it('21. Reset clears the entire store state cleanly', () => {
    useSimulationStore.updateStat(99, { health: 10 });
    expect(useSimulationStore.stats.size).toBe(1);
    
    useSimulationStore.reset(5, 5);
    expect(useSimulationStore.stats.size).toBe(0);
    expect(useSimulationStore.history.length).toBe(2);
  });

  it('22. updateStat dynamically merges properties', () => {
    useSimulationStore.updateStat(1, { action: 'eating' });
    expect(useSimulationStore.stats.get(1)?.action).toBe('eating');
    
    useSimulationStore.updateStat(1, { health: 50 });
    expect(useSimulationStore.stats.get(1)?.health).toBe(50);
    expect(useSimulationStore.stats.get(1)?.action).toBe('eating'); // preserved
  });

  it('23. addHistoryPoint calculates averages gracefully with empty stats', () => {
    useSimulationStore.addHistoryPoint(0, 0);
    const last = useSimulationStore.history[useSimulationStore.history.length - 1];
    expect(last.population).toBe(0);
    expect(last.avgHealth).toBe(0);
  });

  it('24. addHistoryPoint calculates averages correctly with existing population', () => {
    useSimulationStore.updateStat(1, { health: 100, traits: { jumpDistance: 1, jumpHeight: 1, speed: 2, aggressiveness: 0 } as any });
    useSimulationStore.updateStat(2, { health: 50, traits: { jumpDistance: 1, jumpHeight: 1, speed: 4, aggressiveness: 0 } as any });
    
    useSimulationStore.addHistoryPoint(2, 5);
    const last = useSimulationStore.history[useSimulationStore.history.length - 1];
    expect(last.population).toBe(2);
    expect(last.food).toBe(5);
    expect(last.avgHealth).toBe(75);
    expect(last.avgSpeed).toBe(3);
  });

  it('25. Setting followed ID triggers notifications automatically', () => {
    let fired = false;
    useSimulationStore.subscribe(() => { fired = true });
    
    useSimulationStore.setFollowedId(10);
    expect(useSimulationStore.followedId).toBe(10);
    expect(fired).toBeTruthy();
  });

  it('26. Removing a followed stat clears the followed ID to unbreak UI', () => {
    useSimulationStore.setFollowedId(5);
    useSimulationStore.removeStat(5);
    expect(useSimulationStore.followedId).toBeNull();
  });

  it('27. Removing unrelated stat keeps followed ID intact', () => {
    useSimulationStore.setFollowedId(7);
    useSimulationStore.removeStat(10);
    expect(useSimulationStore.followedId).toBe(7);
  });

  it('28. Simulation history truncates after 50 samples to prevent massive RAM leaks', () => {
    for (let i = 0; i < 60; i++) {
        useSimulationStore.addHistoryPoint(10, 10);
    }
    expect(useSimulationStore.history.length).toBeLessThanOrEqual(50);
  });

  it('29. Simulation State getter and setter propagate', () => {
    useSimulationStore.setSimulationState('paused');
    expect(useSimulationStore.simulationState).toBe('paused');
  });

  it('30. Store automatically applies base traits explicitly when lacking', () => {
    useSimulationStore.updateStat(30, {}); 
    // Must initialize with full generic footprint!
    expect(useSimulationStore.stats.get(30)?.health).toBe(100);
    expect(useSimulationStore.stats.get(30)?.action).toBe('idle');
  });
});
