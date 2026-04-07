import * as THREE from 'three';

export let currentRoughness = 20;
export let currentEnvSize = 500;

export const setTerrainRoughness = (r: number) => currentRoughness = r;
export const setEnvSize = (s: number) => currentEnvSize = s;

export const getGroundHeight = (x: number, z: number) => {
  // Base rolling hills
  let y = Math.sin(x * 0.005) * Math.cos(z * 0.006) * currentRoughness * 1.5;
  // Medium details
  y += Math.sin(x * 0.02 + 10) * Math.cos(z * 0.025 + 20) * (currentRoughness * 0.5);
  // Fine details
  y += Math.sin(x * 0.1 + 3) * Math.cos(z * 0.1 + 4) * (currentRoughness * 0.1);
  // Extra noise for non-uniformity
  y += Math.sin(x * 0.002 + z * 0.003) * currentRoughness;
  
  // Mountains at the edge
  const dist = Math.max(Math.abs(x), Math.abs(z));
  const mountainStart = (currentEnvSize / 2) - 100;
  if (dist > mountainStart) {
    const mountainFactor = dist - mountainStart;
    y += Math.pow(mountainFactor, 1.2) * 0.3;
  }
  
  return y;
};

export const getGroundNormal = (x: number, z: number, target: THREE.Vector3) => {
  const delta = 0.1;
  const hL = getGroundHeight(x - delta, z);
  const hR = getGroundHeight(x + delta, z);
  const hD = getGroundHeight(x, z - delta);
  const hU = getGroundHeight(x, z + delta);
  
  target.set(hL - hR, 2 * delta, hD - hU).normalize();
  return target;
};
