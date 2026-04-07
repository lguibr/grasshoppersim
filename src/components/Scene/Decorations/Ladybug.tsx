import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { getGroundHeight, getGroundNormal } from '../../../utils/terrain';

export const Ladybug = ({ initialPos }: { initialPos: THREE.Vector3 }) => {
    const groupRef = useRef<THREE.Group>(null);
    const state = useRef({
        pos: initialPos.clone(),
        angle: Math.random() * Math.PI * 2,
        speed: 1 + Math.random() * 2,
        turnSpeed: (Math.random() - 0.5) * 2,
        time: Math.random() * 100
    });

    const ladybugGeom = useMemo(() => new THREE.SphereGeometry(0.5, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2), []);
    const spotGeom = useMemo(() => new THREE.SphereGeometry(0.12, 4, 4), []);

    useFrame((_, delta) => {
        if (!groupRef.current) return;
        const s = state.current;
        s.time += delta;

        // Wander
        s.angle += s.turnSpeed * delta;
        if (Math.random() < 0.02) s.turnSpeed = (Math.random() - 0.5) * 4;

        s.pos.x += Math.cos(s.angle) * s.speed * delta;
        s.pos.z += Math.sin(s.angle) * s.speed * delta;

        // Keep on ground
        s.pos.y = getGroundHeight(s.pos.x, s.pos.z);

        groupRef.current.position.copy(s.pos);

        // Align to ground normal
        const normal = new THREE.Vector3();
        getGroundNormal(s.pos.x, s.pos.z, normal);
        const up = new THREE.Vector3(0, 1, 0);
        const alignQuat = new THREE.Quaternion().setFromUnitVectors(up, normal);
        const yawQuat = new THREE.Quaternion().setFromAxisAngle(up, -s.angle);
        groupRef.current.quaternion.multiplyQuaternions(alignQuat, yawQuat);

        // Bobbing
        groupRef.current.position.y += Math.sin(s.time * 10) * 0.1;
    });

    return (
        <group ref={groupRef}>
            <mesh geometry={ladybugGeom} castShadow>
                <meshStandardMaterial color="#dc2626" roughness={0.3} />
            </mesh>
            {/* Ladybug spots */}
            <mesh geometry={spotGeom} position={[0.15, 0.3, 0.15]}>
                <meshBasicMaterial color="#000000" />
            </mesh>
            <mesh geometry={spotGeom} position={[-0.15, 0.3, -0.15]}>
                <meshBasicMaterial color="#000000" />
            </mesh>
            <mesh geometry={spotGeom} position={[0, 0.4, -0.2]}>
                <meshBasicMaterial color="#000000" />
            </mesh>
        </group>
    );
};
