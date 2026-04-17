import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { getGroundHeight, getGroundNormal } from "../../utils/terrain";
import { useSettings } from "../../context/SettingsContext";

import { ProceduralTree } from "./Decorations/ProceduralTree";
import { MushroomType1, MushroomType2 } from "./Decorations/Mushrooms";
import { Ladybug } from "./Decorations/Ladybug";

export const EnvironmentDecorations = ({ size }: { size: number }) => {
  const { settings } = useSettings();

  const {
    treePositions,
    flowerPositions,
    ladybugPositions,
    mushroom1Positions,
    mushroom2Positions,
  } = useMemo(() => {
    const trees: THREE.Vector3[] = [];
    const flowers: { pos: THREE.Vector3; color: string }[] = [];
    const ladybugs: THREE.Vector3[] = [];
    const mushrooms1: THREE.Vector3[] = [];
    const mushrooms2: THREE.Vector3[] = [];

    const getPointOnSphere = () => {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const x = Math.sin(phi) * Math.cos(theta);
      const y = Math.sin(phi) * Math.sin(theta);
      const z = Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    // Generate Trees (Much fewer, much taller)
    const treeCount = 40;
    for (let i = 0; i < treeCount; i++) {
      const p = getPointOnSphere();
      const dist = getGroundHeight(p);
      const waterHeight = size * 0.3 + settings.waterLevel;

      if (dist > waterHeight + 5) {
        const treePos = p.clone().multiplyScalar(dist);
        trees.push(treePos);

        // Add ladybugs near trees
        if (Math.random() > 0.3) {
          // perturb on sphere
          const lbDir = p.clone()
            .add(new THREE.Vector3().randomDirection().multiplyScalar(0.05))
            .normalize();
          const lbDist = getGroundHeight(lbDir);
          ladybugs.push(lbDir.multiplyScalar(lbDist));
        }

        // Add mushrooms near trees
        for (let j = 0; j < 3; j++) {
          if (Math.random() > 0.5) {
            const mDir = p.clone()
              .add(new THREE.Vector3().randomDirection().multiplyScalar(0.04))
              .normalize();
            const mDist = getGroundHeight(mDir);
            if (Math.random() > 0.5) {
              mushrooms1.push(mDir.clone().multiplyScalar(mDist));
            } else {
              mushrooms2.push(mDir.clone().multiplyScalar(mDist));
            }
          }
        }
      }
    }

    // Generate Flowers
    const flowerCount = 200;
    const colors = ["#ef4444", "#eab308", "#a855f7", "#ec4899", "#3b82f6"];
    for (let i = 0; i < flowerCount; i++) {
      const p = getPointOnSphere();
      const dist = getGroundHeight(p);
      const waterHeight = size * 0.3 + settings.waterLevel;

      if (dist > waterHeight + 1) {
        flowers.push({
          pos: p.multiplyScalar(dist + 0.15),
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    }

    return {
      treePositions: trees,
      flowerPositions: flowers,
      ladybugPositions: ladybugs,
      mushroom1Positions: mushrooms1,
      mushroom2Positions: mushrooms2,
    };
  }, [size, settings.terrainRoughness, settings.waterLevel]);

  const flowerGeom = useMemo(() => new THREE.SphereGeometry(0.3, 4, 4), []);

  return (
    <group>
      {/* Trees */}
      {treePositions.map((pos, i) => (
        <ProceduralTree key={`tree-${i}`} position={pos} seed={i} />
      ))}

      {/* Mushrooms */}
      {mushroom1Positions.map((pos, i) => (
        <MushroomType1 key={`m1-${i}`} position={pos} />
      ))}
      {mushroom2Positions.map((pos, i) => (
        <MushroomType2 key={`m2-${i}`} position={pos} />
      ))}

      {/* Flowers */}
      {flowerPositions.map((f, i) => {
        const up = f.pos.clone().normalize();
        const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), up);
        return (
          <group key={`flower-${i}`} position={f.pos} quaternion={quat}>
            <mesh
              geometry={flowerGeom}
              position={[0, 0.15, 0]}
              castShadow
            >
              <meshStandardMaterial color={f.color} roughness={0.4} />
            </mesh>
          </group>
        );
      })}

      {/* Ladybugs */}
      {ladybugPositions.map((pos, i) => (
        <Ladybug key={`ladybug-${i}`} initialPos={pos} />
      ))}
    </group>
  );
};
