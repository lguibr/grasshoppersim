import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { getGroundHeight, getGroundNormal } from '../../utils/terrain';
import { useSettings } from '../../context/SettingsContext';

import { ProceduralTree } from './Decorations/ProceduralTree';
import { MushroomType1, MushroomType2 } from './Decorations/Mushrooms';
import { Ladybug } from './Decorations/Ladybug';

export const EnvironmentDecorations = ({ size }: { size: number }) => {
  const { settings } = useSettings();

  const { treePositions, flowerPositions, ladybugPositions, mushroom1Positions, mushroom2Positions } = useMemo(() => {
    const trees: THREE.Vector3[] = [];
    const flowers: { pos: THREE.Vector3, color: string }[] = [];
    const ladybugs: THREE.Vector3[] = [];
    const mushrooms1: THREE.Vector3[] = [];
    const mushrooms2: THREE.Vector3[] = [];

    // Generate Trees (Much fewer, much taller)
    const treeCount = 40;
    for (let i = 0; i < treeCount; i++) {
      const x = (Math.random() - 0.5) * size;
      const z = (Math.random() - 0.5) * size;
      const y = getGroundHeight(x, z);

      if (y > settings.waterLevel + 5) {
        trees.push(new THREE.Vector3(x, y, z));

        // Add ladybugs near trees
        if (Math.random() > 0.3) {
          const lbX = x + (Math.random() - 0.5) * 10;
          const lbZ = z + (Math.random() - 0.5) * 10;
          const lbY = getGroundHeight(lbX, lbZ);
          ladybugs.push(new THREE.Vector3(lbX, lbY, lbZ));
        }

        // Add mushrooms near trees
        for (let j = 0; j < 3; j++) {
          if (Math.random() > 0.5) {
            const mX = x + (Math.random() - 0.5) * 8;
            const mZ = z + (Math.random() - 0.5) * 8;
            const mY = getGroundHeight(mX, mZ);
            if (Math.random() > 0.5) {
              mushrooms1.push(new THREE.Vector3(mX, mY, mZ));
            } else {
              mushrooms2.push(new THREE.Vector3(mX, mY, mZ));
            }
          }
        }
      }
    }

    // Generate Flowers
    const flowerCount = 200;
    const colors = ['#ef4444', '#eab308', '#a855f7', '#ec4899', '#3b82f6'];
    for (let i = 0; i < flowerCount; i++) {
      const x = (Math.random() - 0.5) * size;
      const z = (Math.random() - 0.5) * size;
      const y = getGroundHeight(x, z);

      if (y > settings.waterLevel + 1) {
        flowers.push({
          pos: new THREE.Vector3(x, y, z),
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    }

    return { treePositions: trees, flowerPositions: flowers, ladybugPositions: ladybugs, mushroom1Positions: mushrooms1, mushroom2Positions: mushrooms2 };
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
      {flowerPositions.map((f, i) => (
        <mesh key={`flower-${i}`} geometry={flowerGeom} position={[f.pos.x, f.pos.y + 0.15, f.pos.z]} castShadow>
          <meshStandardMaterial color={f.color} roughness={0.4} />
        </mesh>
      ))}

      {/* Ladybugs */}
      {ladybugPositions.map((pos, i) => (
        <Ladybug key={`ladybug-${i}`} initialPos={pos} />
      ))}
    </group>
  );
};
