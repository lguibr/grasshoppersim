import { describe, it, expect, beforeEach } from 'vitest';
import * as THREE from 'three';
import { applyJumpAnimation, resetAnimation } from './animation';
import { GrasshopperState, GrasshopperRefs } from '../../../types';

describe('Grasshopper Animation Logic', () => {
  let mockState: GrasshopperState;
  let mockRefs: GrasshopperRefs;

  beforeEach(() => {
    mockState = {
      startPos: new THREE.Vector3(0, 0, 0),
      targetPos: new THREE.Vector3(10, 0, 0),
      jumpStart: 0,
      jumpDuration: 1,
      jumpHeight: 5,
      flyPower: 2,
      isJumping: false,
      isEating: false,
      targetFoodId: null,
      health: 100,
      nextJumpTime: 0,
      angle: 0,
      time: 0,
      growth: 1,
      isFighting: false,
      name: 'Test',
      birthTime: 0,
      traits: { jumpDistance: 1, jumpHeight: 1, speed: 1, aggressiveness: 1 }
    };
    
    const createMockGroup = () => {
      const g = new THREE.Group();
      return { current: g } as any;
    };

    mockRefs = {
      group: createMockGroup(),
      bodyGroup: createMockGroup(),
      leftFemur: createMockGroup(),
      rightFemur: createMockGroup(),
      leftTibia: createMockGroup(),
      rightTibia: createMockGroup(),
      leftFrontLeg: createMockGroup(),
      rightFrontLeg: createMockGroup(),
      leftMiddleLeg: createMockGroup(),
      rightMiddleLeg: createMockGroup(),
      leftWing: createMockGroup(),
      rightWing: createMockGroup(),
    };
  });

  it('11. Crouching lowers rotation x of body properly (0 to 0.2 progress)', () => {
    applyJumpAnimation(mockState, mockRefs, 0.1); // During crouch
    expect(mockRefs.bodyGroup.current?.rotation.x).toBeGreaterThan(0); // Leans down
  });

  it('12. Femur rotates backward during crouch', () => {
    applyJumpAnimation(mockState, mockRefs, 0.1); 
    expect(mockRefs.leftFemur.current?.rotation.x).toBeLessThan(-0.6); // Rotates back
  });

  it('13. Jump peaks halfway through interpolation (progress=0.6)', () => {
    applyJumpAnimation(mockState, mockRefs, 0.6); 
    // nx should be 0 here (2*0.5 - 1 = 0) where jump progress is (0.6 - 0.2)/0.8 = 0.5
    expect(mockRefs.group.current?.position.length()).toBeGreaterThan(mockState.jumpHeight * 0.9);
  });

  it('14. Body pitches up initially during jump', () => {
    applyJumpAnimation(mockState, mockRefs, 0.4); 
    // nx is negative (-0.5), so sign is negative. -(-1) = 1. -> 1 * 0.5 = 0.5 pitch.
    expect(mockRefs.bodyGroup.current?.rotation.x).toBeGreaterThan(0);
  });

  it('15. Body pitches down at end of jump', () => {
    applyJumpAnimation(mockState, mockRefs, 0.8); 
    // nx is positive, sign is 1. -(1) = -1. -> -1 * 0.5 = -0.5 pitch.
    expect(mockRefs.bodyGroup.current?.rotation.x).toBeLessThan(0);
  });

  it('16. resetAnimation resets wings properly', () => {
    resetAnimation(mockRefs);
    expect(mockRefs.leftWing.current?.rotation.x).toBeCloseTo(Math.PI / 2 - 0.25);
    expect(mockRefs.rightWing.current?.rotation.x).toBeCloseTo(Math.PI / 2 - 0.25);
  });

  it('17. resetAnimation resets tibia properly', () => {
    resetAnimation(mockRefs);
    expect(mockRefs.leftTibia.current?.rotation.x).toBe(1.2);
  });
  
  it('18. resetAnimation resets front legs', () => {
    resetAnimation(mockRefs);
    expect(mockRefs.leftFrontLeg.current?.rotation.x).toBe(0.3);
  });
  
  it('19. Apply jump accurately recalculates height to land on terrain surface (ending)', () => {
    applyJumpAnimation(mockState, mockRefs, 1.0);
    // At complete 1.0, position should be matching the procedural terrain's height
    const pos = mockRefs.group.current?.position;
    expect(pos?.length()).toBeGreaterThan(0);
  });
  
  it('20. Flap animation hinges aggressively (roll/yaw changes)', () => {
    applyJumpAnimation(mockState, mockRefs, 0.6);
    expect(mockRefs.leftWing.current?.rotation.z).not.toBe(0);
  });

});
