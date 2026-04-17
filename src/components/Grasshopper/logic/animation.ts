import * as THREE from "three";
import { GrasshopperState, GrasshopperRefs } from "../../../types";
import { getGroundHeight } from "../../../utils/terrain";

export const applyJumpAnimation = (
  s: GrasshopperState,
  refs: GrasshopperRefs,
  progress: number,
) => {
  const {
    group,
    bodyGroup,
    leftFemur,
    rightFemur,
    leftTibia,
    rightTibia,
    leftFrontLeg,
    rightFrontLeg,
    leftMiddleLeg,
    rightMiddleLeg,
    leftWing,
    rightWing,
  } = refs;
  if (!group.current) return;

  let femurRot = -0.6,
    tibiaRot = 1.2,
    frontLegRot = 0.3,
    middleLegRot = 0.1;

  if (progress < 0.2) {
    const crouchProgress = progress / 0.2;
    group.current.position.copy(s.startPos);
    const currentGround = getGroundHeight(group.current.position);
    const up = group.current.position.clone().normalize();
    const height = currentGround - Math.sin(crouchProgress * Math.PI) * 0.2;
    group.current.position.copy(up.multiplyScalar(height));
    if (bodyGroup.current) bodyGroup.current.rotation.x = crouchProgress * 0.2;
    femurRot = -0.6 - Math.sin(crouchProgress * Math.PI) * 0.4;
    tibiaRot = 1.2 + Math.sin(crouchProgress * Math.PI) * 0.6;
    frontLegRot = 0.3 - crouchProgress * 0.2;
    middleLegRot = 0.1 - crouchProgress * 0.2;
  } else {
    const jumpProgress = (progress - 0.2) / 0.8;
    group.current.position.lerpVectors(s.startPos, s.targetPos, jumpProgress);
    const nx = 2 * jumpProgress - 1;

    const currentGround = getGroundHeight(group.current.position);
    const interpolatedLength = THREE.MathUtils.lerp(
      s.startPos.length(),
      s.targetPos.length(),
      jumpProgress,
    );
    const baseHeight = Math.max(interpolatedLength, currentGround);
    const currentHeight =
      baseHeight + s.jumpHeight * (1 - Math.pow(Math.abs(nx), s.flyPower));

    group.current.position.normalize().multiplyScalar(currentHeight);

    if (bodyGroup.current) {
      bodyGroup.current.rotation.x =
        -Math.sign(nx) *
        Math.pow(Math.abs(nx), Math.max(1, s.flyPower - 1)) *
        0.5;
    }

    if (jumpProgress < 0.15) {
      const ext = Math.sin(((jumpProgress / 0.15) * Math.PI) / 2);
      femurRot = -0.6 + ext * 0.8;
      tibiaRot = 1.2 - ext * 1.0;
    } else {
      const ret = 1 - (jumpProgress - 0.15) / 0.85;
      femurRot = -0.6 + ret * 0.8;
      tibiaRot = 1.2 - ret * 1.0;
    }

    const tuck = Math.sin(jumpProgress * Math.PI) * 0.5;
    frontLegRot = 0.3 + tuck;
    middleLegRot = 0.1 + tuck;

    if (jumpProgress > 0.05 && jumpProgress < 0.95) {
      const flap = Math.sin(jumpProgress * 80) * 0.5; // Rapid flapping
      // Hinge on Z axis (roll) and slightly pitch up (X) to simulate wing spreading
      if (leftWing.current)
        leftWing.current.rotation.set(Math.PI / 2 - 0.15, 0.3, flap * 1.5);
      if (rightWing.current)
        rightWing.current.rotation.set(Math.PI / 2 - 0.15, -0.3, -flap * 1.5);
    } else {
      if (leftWing.current)
        leftWing.current.rotation.set(Math.PI / 2 - 0.25, 0.1, 0);
      if (rightWing.current)
        rightWing.current.rotation.set(Math.PI / 2 - 0.25, -0.1, 0);
    }
  }

  if (leftFemur.current) leftFemur.current.rotation.x = femurRot;
  if (rightFemur.current) rightFemur.current.rotation.x = femurRot;
  if (leftTibia.current) leftTibia.current.rotation.x = tibiaRot;
  if (rightTibia.current) rightTibia.current.rotation.x = tibiaRot;
  if (leftFrontLeg.current) leftFrontLeg.current.rotation.x = frontLegRot;
  if (rightFrontLeg.current) rightFrontLeg.current.rotation.x = frontLegRot;
  if (leftMiddleLeg.current) leftMiddleLeg.current.rotation.x = middleLegRot;
  if (rightMiddleLeg.current) rightMiddleLeg.current.rotation.x = middleLegRot;
};

export const applyEatingAnimation = (
  s: GrasshopperState,
  refs: GrasshopperRefs,
  time: number,
) => {
  const { bodyGroup, leftFrontLeg, rightFrontLeg } = refs;
  if (bodyGroup.current) {
    bodyGroup.current.rotation.x = 0.4 + Math.sin(time * 15) * 0.1;
    bodyGroup.current.position.y = 0.4 + Math.sin(time * 15) * 0.05;
  }
  if (leftFrontLeg.current)
    leftFrontLeg.current.rotation.x = 0.6 + Math.sin(time * 20) * 0.2;
  if (rightFrontLeg.current)
    rightFrontLeg.current.rotation.x = 0.6 + Math.cos(time * 20) * 0.2;
};

export const resetAnimation = (refs: GrasshopperRefs) => {
  const setRot = (ref: React.RefObject<THREE.Group | null>, x: number) => {
    if (ref.current) ref.current.rotation.x = x;
  };
  setRot(refs.bodyGroup, 0);
  setRot(refs.leftFemur, -0.6);
  setRot(refs.rightFemur, -0.6);
  setRot(refs.leftTibia, 1.2);
  setRot(refs.rightTibia, 1.2);
  setRot(refs.leftFrontLeg, 0.3);
  setRot(refs.rightFrontLeg, 0.3);
  setRot(refs.leftMiddleLeg, 0.1);
  setRot(refs.rightMiddleLeg, 0.1);
  if (refs.leftWing.current)
    refs.leftWing.current.rotation.set(Math.PI / 2 - 0.25, 0.1, 0);
  if (refs.rightWing.current)
    refs.rightWing.current.rotation.set(Math.PI / 2 - 0.25, -0.1, 0);
};
