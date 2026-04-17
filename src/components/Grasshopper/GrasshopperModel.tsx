import React from "react";
import { GrasshopperRefs, ShapeVariations } from "../../types";
import { GrasshopperLegs } from "./GrasshopperLegs";
import { SHARED_GEOMETRIES } from "./useGrasshopperMaterials";

export const GrasshopperModel = ({
  refs,
  shape,
  materials,
}: {
  refs: GrasshopperRefs;
  shape: ShapeVariations;
  materials: any;
}) => (
  <group ref={refs.bodyGroup} position={[0, 0.6, 0]}>
    <mesh
      position={[0, 0, 0]}
      rotation={[Math.PI / 2, 0, 0]}
      material={materials.thorax}
      geometry={SHARED_GEOMETRIES.thorax}
      castShadow
    />
    <mesh
      position={[0, -0.1, -0.7]}
      rotation={[Math.PI / 2 - 0.2, 0, 0]}
      material={materials.abdomen}
      geometry={SHARED_GEOMETRIES.abdomen}
      castShadow
    />
    <mesh
      position={[0, 0.1, 0.5]}
      rotation={[0.2, 0, 0]}
      material={materials.thorax}
      geometry={SHARED_GEOMETRIES.thoraxSphere}
      castShadow
    />
    <mesh
      position={[0.22, 0.2, 0.65]}
      material={materials.eye}
      geometry={SHARED_GEOMETRIES.eye}
    />
    <mesh
      position={[-0.22, 0.2, 0.65]}
      material={materials.eye}
      geometry={SHARED_GEOMETRIES.eye}
    />
    <mesh
      position={[0.15, 0.6, 0.7]}
      rotation={[0.5, 0, 0]}
      material={materials.antenna}
      geometry={SHARED_GEOMETRIES.antenna}
    />
    <mesh
      position={[-0.15, 0.6, 0.7]}
      rotation={[0.5, 0, 0]}
      material={materials.antenna}
      geometry={SHARED_GEOMETRIES.antenna}
    />
    <mesh
      ref={refs.leftWing}
      position={[0.1, 0.45, 0.1]}
      rotation={[Math.PI / 2 - 0.25, 0.1, 0]}
      scale={[1, 1, 0.2]}
      material={materials.wing}
      geometry={SHARED_GEOMETRIES.wing}
      castShadow
    />
    <mesh
      ref={refs.rightWing}
      position={[-0.1, 0.45, 0.1]}
      rotation={[Math.PI / 2 - 0.25, -0.1, 0]}
      scale={[1, 1, 0.2]}
      material={materials.wing}
      geometry={SHARED_GEOMETRIES.wing}
      castShadow
    />

    <GrasshopperLegs refs={refs} shape={shape} material={materials.leg} />
  </group>
);
