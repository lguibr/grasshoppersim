import * as THREE from "three";

import { GrasshopperTraits } from "./types";

export interface CricketStat {
  id: number;
  health: number;
  action: string;
  isBaby: boolean;
  traits: GrasshopperTraits;
  name: string;
  birthTime: number;
  generation: number;
}

export type SimulationState = "setup" | "running" | "paused";

export interface MetricPoint {
  time: number;
  population: number;
  food: number;
  avgSpeed: number;
  minSpeed: number;
  maxSpeed: number;
  avgAggro: number;
  minAggro: number;
  maxAggro: number;
  avgJumpDist: number;
  avgJumpHeight: number;
  avgAge: number;
  minAge: number;
  maxAge: number;
  avgHealth: number;
  minHealth: number;
  maxHealth: number;
}

class SimulationStore {
  stats = new Map<number, CricketStat>();
  history: MetricPoint[] = [];
  followedId: number | null = null;
  positions = new Map<number, THREE.Vector3>();
  angles = new Map<number, number>();
  simulationState: SimulationState = "setup";

  // Callbacks for UI updates
  listeners = new Set<() => void>();

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  notify() {
    this.listeners.forEach((l) => l());
  }

  setSimulationState(state: SimulationState) {
    this.simulationState = state;
    this.notify();
  }

  updateStat(id: number, stat: Partial<CricketStat>) {
    const existing = this.stats.get(id);
    if (existing) {
      this.stats.set(id, { ...existing, ...stat });
    } else {
      this.stats.set(id, {
        id,
        health: 100,
        action: "idle",
        isBaby: false,
        traits: { jumpDistance: 1, jumpHeight: 1, speed: 1, aggressiveness: 1 },
        name: "Unknown",
        birthTime: Date.now(),
        generation: 1,
        ...stat,
      } as CricketStat);
    }
  }

  removeStat(id: number) {
    this.stats.delete(id);
    if (this.followedId === id) {
      this.followedId = null;
      this.notify();
    }
  }

  addHistoryPoint(population: number, food: number) {
    let avgSpeed = 0,
      avgAggro = 0,
      avgJumpDist = 0,
      avgJumpHeight = 0,
      avgAge = 0,
      avgHealth = 0;
    let minSpeed = Infinity,
      maxSpeed = -Infinity;
    let minAggro = Infinity,
      maxAggro = -Infinity;
    let minAge = Infinity,
      maxAge = -Infinity;
    let minHealth = Infinity,
      maxHealth = -Infinity;

    const now = Date.now();

    if (this.stats.size > 0) {
      for (const stat of this.stats.values()) {
        const age = (now - stat.birthTime) / 1000;

        avgSpeed += stat.traits.speed;
        avgAggro += stat.traits.aggressiveness;
        avgJumpDist += stat.traits.jumpDistance;
        avgJumpHeight += stat.traits.jumpHeight;
        avgAge += age;
        avgHealth += stat.health;

        minSpeed = Math.min(minSpeed, stat.traits.speed);
        maxSpeed = Math.max(maxSpeed, stat.traits.speed);
        minAggro = Math.min(minAggro, stat.traits.aggressiveness);
        maxAggro = Math.max(maxAggro, stat.traits.aggressiveness);
        minAge = Math.min(minAge, age);
        maxAge = Math.max(maxAge, age);
        minHealth = Math.min(minHealth, stat.health);
        maxHealth = Math.max(maxHealth, stat.health);
      }
      avgSpeed /= this.stats.size;
      avgAggro /= this.stats.size;
      avgJumpDist /= this.stats.size;
      avgJumpHeight /= this.stats.size;
      avgAge /= this.stats.size;
      avgHealth /= this.stats.size;
    } else {
      minSpeed = 0;
      maxSpeed = 0;
      minAggro = 0;
      maxAggro = 0;
      minAge = 0;
      maxAge = 0;
      minHealth = 0;
      maxHealth = 0;
    }

    this.history.push({
      time: now,
      population,
      food,
      avgSpeed,
      minSpeed,
      maxSpeed,
      avgAggro,
      minAggro,
      maxAggro,
      avgJumpDist,
      avgJumpHeight,
      avgAge,
      minAge,
      maxAge,
      avgHealth,
      minHealth,
      maxHealth,
    });
    if (this.history.length > 50) {
      this.history.shift();
    }
    this.notify();
  }

  setFollowedId(id: number | null) {
    this.followedId = id;
    this.notify();
  }

  reset(initialPopulation: number, initialFood: number) {
    this.stats.clear();
    const now = Date.now();
    const defaultPoint = {
      time: now,
      population: initialPopulation,
      food: initialFood,
      avgSpeed: 0,
      minSpeed: 0,
      maxSpeed: 0,
      avgAggro: 0,
      minAggro: 0,
      maxAggro: 0,
      avgJumpDist: 0,
      avgJumpHeight: 0,
      avgAge: 0,
      minAge: 0,
      maxAge: 0,
      avgHealth: 0,
      minHealth: 0,
      maxHealth: 0,
    };
    this.history = [{ ...defaultPoint, time: now - 1000 }, defaultPoint];
    this.followedId = null;
    this.positions.clear();
    this.notify();
  }
}

export const useSimulationStore = new SimulationStore();
