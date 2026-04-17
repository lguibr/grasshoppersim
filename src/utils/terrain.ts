import * as THREE from "three";

export let currentRoughness = 20;
export let currentEnvSize = 500;
export let currentRadius = 150;

export const setTerrainRoughness = (r: number) => (currentRoughness = r);
export const setEnvSize = (s: number) => {
  currentEnvSize = s;
  currentRadius = s * 0.3; // scale radius based on env size
};

export const getGroundHeight = (pos: THREE.Vector3) => {
  // Take a normalized direction vector and return the displacement from center 
  // (the length of the vector from 0,0,0 to the terrain surface)
  const dir = pos.clone().normalize();

  // Use sum of sines in 3D space to avoid 2D banding on sphere
  let noise = 0;
  
  // Overall shape warp
  noise += Math.sin(dir.x * 1.5) * Math.cos(dir.y * 1.5) * currentRoughness * 0.1;

  // Base low frequency structure (continents and oceans)
  noise += Math.sin(dir.x * 2.5 + Math.sin(dir.y * 3.0)) * Math.cos(dir.z * 2.5) * currentRoughness * 0.15;
  noise += Math.cos(dir.x * 4.0 + dir.z * 3.0) * Math.sin(dir.y * 4.0) * currentRoughness * 0.08;
  
  // Medium frequency details
  noise += Math.sin(dir.x * 12.0) * Math.cos(dir.y * 11.0 + dir.z * 13.0) * currentRoughness * 0.03;
  
  // High frequency roughness
  noise += Math.sin(dir.x * 30.0 + dir.y * 25.0) * Math.cos(dir.z * 28.0) * currentRoughness * 0.01;
  noise += Math.sin(dir.x * 60.0 - dir.z * 50.0) * Math.sin(dir.y * 55.0) * currentRoughness * 0.005;

  // Add poles (mountains at top/bottom)
  const distToPoles = Math.abs(dir.y);
  if (distToPoles > 0.85) {
    noise += Math.pow(distToPoles - 0.85, 2.0) * currentRoughness * 1.5;
  }

  return currentRadius + noise;
};

export const getGroundNormal = (pos: THREE.Vector3, target: THREE.Vector3) => {
  const delta = 0.005;

  const up = pos.clone().normalize();
  const right = new THREE.Vector3(0, 1, 0).cross(up);
  if (right.lengthSq() < 0.001) right.set(1, 0, 0).cross(up);
  right.normalize();

  const forward = new THREE.Vector3().crossVectors(up, right).normalize();

  const pL = pos.clone().addScaledVector(right, -delta).normalize();
  const pR = pos.clone().addScaledVector(right, delta).normalize();
  const pD = pos.clone().addScaledVector(forward, -delta).normalize();
  const pU = pos.clone().addScaledVector(forward, delta).normalize();

  const hL = getGroundHeight(pL);
  const hR = getGroundHeight(pR);
  const hD = getGroundHeight(pD);
  const hU = getGroundHeight(pU);

  target.set(0, 0, 0);

  // Create tangents
  const t1 = pR.multiplyScalar(hR).sub(pL.multiplyScalar(hL));
  const t2 = pU.multiplyScalar(hU).sub(pD.multiplyScalar(hD));

  target.crossVectors(t1, t2).normalize();

  // Make sure it points outward
  if (target.dot(up) < 0) {
    target.negate();
  }

  return target;
};

export const getHeadingToPoint = (from: THREE.Vector3, to: THREE.Vector3) => {
  const up = from.clone().normalize();
  let north = new THREE.Vector3(0, 1, 0).projectOnPlane(up).normalize();
  if (north.lengthSq() < 0.001) north = new THREE.Vector3(0, 0, -1).projectOnPlane(up).normalize();
  const east = new THREE.Vector3().crossVectors(north, up).normalize();

  const dir = to.clone().sub(from).projectOnPlane(up).normalize();
  return Math.atan2(dir.dot(east), dir.dot(north));
};

export const getPointFromHeadingAndDistance = (from: THREE.Vector3, heading: number, distance: number, target: THREE.Vector3) => {
  const up = from.clone().normalize();
  let north = new THREE.Vector3(0, 1, 0).projectOnPlane(up).normalize();
  if (north.lengthSq() < 0.001) north = new THREE.Vector3(0, 0, -1).projectOnPlane(up).normalize();
  const east = new THREE.Vector3().crossVectors(north, up).normalize();

  const moveDir = north.clone().multiplyScalar(Math.cos(heading))
    .add(east.clone().multiplyScalar(Math.sin(heading))).normalize();

  // Simple spherical movement: rotate `from` along `moveDir` by angle = distance / radius
  const angularDist = distance / currentRadius;
  const rotationAxis = new THREE.Vector3().crossVectors(up, moveDir).normalize();

  target.copy(from).applyAxisAngle(rotationAxis, angularDist);
  const height = getGroundHeight(target);
  target.normalize().multiplyScalar(height);
  return target;
};
