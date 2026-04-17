import { useMemo } from "react";
import * as THREE from "three";
import { COLORS } from "../../constants";

export const SHARED_COLORS = {
  abdomen: new THREE.Color(COLORS.abdomen),
  thorax: new THREE.Color(COLORS.thorax),
  leg: new THREE.Color(COLORS.leg),
  red: new THREE.Color("#ef4444"),
  eye: new THREE.Color(COLORS.eye),
};

export const SHARED_MATERIALS = {
  abdomen: new THREE.MeshStandardMaterial({ color: COLORS.abdomen }),
  thorax: new THREE.MeshStandardMaterial({ color: COLORS.thorax }),
  wing: new THREE.MeshStandardMaterial({
    color: COLORS.wing,
    emissive: COLORS.wing,
    emissiveIntensity: 0.2,
  }),
  eye: new THREE.MeshStandardMaterial({
    color: COLORS.eye,
    emissive: COLORS.eye,
    emissiveIntensity: 0.5,
  }),
  leg: new THREE.MeshStandardMaterial({ color: COLORS.leg }),
  antenna: new THREE.MeshStandardMaterial({
    color: COLORS.antenna,
    emissive: COLORS.antenna,
    emissiveIntensity: 0.4,
  }),
  visionCone: new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    transparent: true,
    opacity: 0.002,
    depthWrite: false,
    side: THREE.DoubleSide,
  }),
};

export const SHARED_GEOMETRIES = {
  thorax: new THREE.CylinderGeometry(0.25, 0.35, 0.8, 16),
  abdomen: new THREE.CylinderGeometry(0.3, 0.05, 1.2, 16),
  thoraxSphere: new THREE.SphereGeometry(0.3, 16, 16),
  eye: new THREE.SphereGeometry(0.08, 16, 16),
  antenna: new THREE.CylinderGeometry(0.005, 0.03, 0.8, 8),
  wing: new THREE.CapsuleGeometry(0.2, 1.2, 4, 16).translate(0, -0.6, 0),
  femur: new THREE.CylinderGeometry(0.04, 0.14, 0.96, 12),
  tibia: new THREE.CylinderGeometry(0.06, 0.015, 1.0, 12),
  frontLeg: new THREE.CylinderGeometry(0.06, 0.015, 0.8, 12),
};

export const useGrasshopperMaterials = (isBaby: boolean | undefined) => {
  const shape = useMemo(
    () => ({
      scale: 0.8 + Math.random() * 0.4,
    }),
    [],
  );

  const materials = useMemo(() => ({
    ...SHARED_MATERIALS,
    visionCone: SHARED_MATERIALS.visionCone.clone() as THREE.MeshBasicMaterial,
  }), []);

  return { shape, baseColors: SHARED_COLORS, materials };
};
