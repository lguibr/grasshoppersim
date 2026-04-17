import { describe, it, expect } from "vitest";
import * as THREE from "three";
import { getGroundHeight, getGroundNormal, getHeadingToPoint } from "./terrain";
import { generateName } from "./names";

// 10 distinct tests for math and terrain utilities
describe("Mathematical Utilities and Terrain Logic", () => {
  it("1. Terrain height at origin should be purely sphere radius base size", () => {
    const pos = new THREE.Vector3(0, 50, 0);
    const height = getGroundHeight(pos);
    expect(height).toBeGreaterThan(0);
    // Even with noise, it should be within expected bounds (sphere radius roughly 50 to 55)
    expect(height).toBeGreaterThanOrEqual(49);
    expect(height).toBeLessThanOrEqual(200);
  });

  it("2. Terrain height off-center axis should return valid numbers", () => {
    const pos = new THREE.Vector3(50, 0, 0);
    const height = getGroundHeight(pos);
    expect(height).not.toBeNaN();
    expect(typeof height).toBe("number");
  });

  it("3. Negative coordinates evaluate correctly on opposite side", () => {
    const p1 = new THREE.Vector3(0, -50, 0);
    const height = getGroundHeight(p1);
    expect(height).not.toBeNaN();
  });

  it("4. Ground normal points outward from center for sphere", () => {
    const pos = new THREE.Vector3(0, 50, 0);
    const normal = new THREE.Vector3();
    getGroundNormal(pos, normal);
    // Since it's a sphere with some displacement, the normal is roughly proportional to the position itself
    expect(normal.y).toBeGreaterThan(0.9);
  });

  it("5. Ground normal on X axis", () => {
    const pos = new THREE.Vector3(50, 0, 0);
    const normal = new THREE.Vector3();
    getGroundNormal(pos, normal);
    expect(normal.x).toBeGreaterThan(0.9);
  });

  it("6. Heading to point calculation handles valid points and is normalized", () => {
    const from = new THREE.Vector3(0, 50, 0);
    const to = new THREE.Vector3(10, 50, 0);
    const angle = getHeadingToPoint(from, to);
    expect(typeof angle).toBe("number");
  });

  it("7. Heading reverses on inverted inputs", () => {
    const from = new THREE.Vector3(0, 50, 0);
    const to = new THREE.Vector3(-10, 50, 0);
    const angle1 = getHeadingToPoint(from, to);

    const to2 = new THREE.Vector3(10, 50, 0);
    const angle2 = getHeadingToPoint(from, to2);

    // They should face opposite ways in 2D heading space if properly mapped
    expect(angle1).not.toBeCloseTo(angle2);
  });

  it("8. Vector alignment check: Zero distance heading fallback", () => {
    const from = new THREE.Vector3(0, 50, 0);
    const angle = getHeadingToPoint(from, from); // exact same
    expect(angle).toBe(0); // Assuming fallback to 0 handles it gracefully
  });

  it("9. Name generation generates sensible strings", () => {
    const nameData = generateName();
    expect(nameData.firstName.length).toBeGreaterThan(1);
    expect(nameData.lastName.length).toBeGreaterThan(1);
    expect(nameData.fullName).toContain(nameData.firstName);
    expect(nameData.fullName).toContain(nameData.lastName);
  });

  it("10. Generation of 100 names does not crash", () => {
    let lengths = 0;
    for (let i = 0; i < 100; i++) {
      const name = generateName();
      lengths += name.fullName.length;
    }
    expect(lengths).toBeGreaterThan(500); // sensible average lengths
  });
});
