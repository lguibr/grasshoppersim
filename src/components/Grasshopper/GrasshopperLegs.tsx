import React from "react";
import * as THREE from "three";
import { GrasshopperRefs, ShapeVariations } from "../../types";
import { SHARED_GEOMETRIES } from "./useGrasshopperMaterials";

export const GrasshopperLegs = ({
  refs,
  shape,
  material,
}: {
  refs: GrasshopperRefs;
  shape: ShapeVariations;
  material: THREE.Material;
}) => (
  <>
    <group
      ref={refs.leftFemur}
      position={[0.35, 0.1, 0]}
      rotation={[-0.6, 0, 0]}
    >
      <mesh
        position={[0, 0.4, 0]}
        material={material}
        geometry={SHARED_GEOMETRIES.femur}
        castShadow
      />
      <group ref={refs.leftTibia} position={[0, 0.8, 0]} rotation={[1.2, 0, 0]}>
        <mesh
          position={[0, -0.45, 0]}
          material={material}
          geometry={SHARED_GEOMETRIES.tibia}
          castShadow
        />
      </group>
    </group>
    <group
      ref={refs.rightFemur}
      position={[-0.35, 0.1, 0]}
      rotation={[-0.6, 0, 0]}
    >
      <mesh
        position={[0, 0.4, 0]}
        material={material}
        geometry={SHARED_GEOMETRIES.femur}
        castShadow
      />
      <group
        ref={refs.rightTibia}
        position={[0, 0.8, 0]}
        rotation={[1.2, 0, 0]}
      >
        <mesh
          position={[0, -0.45, 0]}
          material={material}
          geometry={SHARED_GEOMETRIES.tibia}
          castShadow
        />
      </group>
    </group>
    <group
      ref={refs.leftFrontLeg}
      position={[0.35, -0.1, 0.5]}
      rotation={[0.3, 0, 0]}
    >
      <mesh
        position={[0, -0.35, 0]}
        material={material}
        geometry={SHARED_GEOMETRIES.frontLeg}
        castShadow
      />
    </group>
    <group
      ref={refs.rightFrontLeg}
      position={[-0.35, -0.1, 0.5]}
      rotation={[0.3, 0, 0]}
    >
      <mesh
        position={[0, -0.35, 0]}
        material={material}
        geometry={SHARED_GEOMETRIES.frontLeg}
        castShadow
      />
    </group>
    <group
      ref={refs.leftMiddleLeg}
      position={[0.35, -0.1, 0.1]}
      rotation={[0.1, 0, 0]}
    >
      <mesh
        position={[0, -0.35, 0]}
        material={material}
        geometry={SHARED_GEOMETRIES.frontLeg}
        castShadow
      />
    </group>
    <group
      ref={refs.rightMiddleLeg}
      position={[-0.35, -0.1, 0.1]}
      rotation={[0.1, 0, 0]}
    >
      <mesh
        position={[0, -0.35, 0]}
        material={material}
        geometry={SHARED_GEOMETRIES.frontLeg}
        castShadow
      />
    </group>
  </>
);
