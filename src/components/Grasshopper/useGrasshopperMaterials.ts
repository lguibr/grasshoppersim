import { useMemo } from 'react';
import * as THREE from 'three';
import { COLORS } from '../../constants';

export const useGrasshopperMaterials = (isBaby: boolean | undefined) => {
  const shape = useMemo(() => ({
    scale: 0.8 + Math.random() * 0.4,
    thoraxTop: 0.25 + (Math.random() - 0.5) * 0.08, thoraxBot: 0.35 + (Math.random() - 0.5) * 0.08,
    abdomenTop: 0.3 + (Math.random() - 0.5) * 0.08, abdomenBot: 0.05 + (Math.random() - 0.5) * 0.03,
    femurTop: 0.04 + (Math.random() - 0.5) * 0.02, femurBot: 0.14 + (Math.random() - 0.5) * 0.04,
    tibiaTop: 0.06 + (Math.random() - 0.5) * 0.02, tibiaBot: 0.015 + (Math.random() - 0.5) * 0.01,
    frontLegTop: 0.06 + (Math.random() - 0.5) * 0.02, frontLegBot: 0.015 + (Math.random() - 0.5) * 0.01,
  }), []);

  const baseColors = useMemo(() => ({
    abdomen: new THREE.Color(COLORS.abdomen),
    thorax: new THREE.Color(COLORS.thorax),
    leg: new THREE.Color(COLORS.leg),
    red: new THREE.Color('#ef4444'),
    eye: new THREE.Color(COLORS.eye)
  }), []);

  const materials = useMemo(() => ({
    abdomen: new THREE.MeshStandardMaterial({ color: COLORS.abdomen }), 
    thorax: new THREE.MeshStandardMaterial({ color: COLORS.thorax }),
    wing: new THREE.MeshStandardMaterial({ color: COLORS.wing, emissive: COLORS.wing, emissiveIntensity: 0.2 }), 
    eye: new THREE.MeshStandardMaterial({ color: COLORS.eye, emissive: COLORS.eye, emissiveIntensity: 0.5 }),
    leg: new THREE.MeshStandardMaterial({ color: COLORS.leg }), 
    antenna: new THREE.MeshStandardMaterial({ color: COLORS.antenna, emissive: COLORS.antenna, emissiveIntensity: 0.4 }),
    visionCone: new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.002, depthWrite: false, side: THREE.DoubleSide })
  }), []);

  return { shape, baseColors, materials };
};
