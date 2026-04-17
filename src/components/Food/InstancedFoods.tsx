import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FoodData } from "../../types";

const dummy = new THREE.Object3D();
const dummyLeaves = new THREE.Object3D();

export const InstancedFoods = ({
  foodsRef,
}: {
  foodsRef: React.MutableRefObject<Map<number, FoodData>>;
}) => {
  const eggMesh = useRef<THREE.InstancedMesh>(null);
  const plantMainMesh = useRef<THREE.InstancedMesh>(null);
  const plantSide1Mesh = useRef<THREE.InstancedMesh>(null);
  const plantSide2Mesh = useRef<THREE.InstancedMesh>(null);

  const maxItems = 2000;

  useFrame((_, delta) => {
    let eggCount = 0;
    let plantCount = 0;

    const now = Date.now();

    foodsRef.current.forEach((data) => {
      const healthRatio = Math.max(0, data.health / 100);
      const targetScale = Math.max(0.01, healthRatio) * data.scale;

      dummy.position.set(...data.position);
      dummy.scale.setScalar(targetScale);

      const dir = new THREE.Vector3(...data.position).normalize();
      const up = new THREE.Vector3(0, 1, 0);
      const alignQuat = new THREE.Quaternion().setFromUnitVectors(up, dir);
      const yawQuat = new THREE.Quaternion().setFromAxisAngle(up, (data.id * 1.5) % (Math.PI * 2));
      dummy.quaternion.multiplyQuaternions(alignQuat, yawQuat);

      if (data.type === "egg") {
        dummy.updateMatrix();
        if (eggMesh.current) {
          eggMesh.current.setMatrixAt(eggCount, dummy.matrix);
        }
        eggCount++;
      } else {
        // Plant
        dummyLeaves.position.set(0, 0, 0);
        dummyLeaves.rotation.set(0, 0, 0);
        dummyLeaves.scale.setScalar(1);

        if (healthRatio < 1 && healthRatio > 0) {
          const timeOffset = data.id % 1000;
          dummyLeaves.rotation.y = (now / 100 + timeOffset) % (Math.PI * 2);
          dummyLeaves.rotation.z = Math.sin(now / 50) * 0.1;
        }

        dummyLeaves.updateMatrix();

        dummy.updateMatrix();
        const finalMatrix = dummy.matrix.clone().multiply(dummyLeaves.matrix);

        if (plantMainMesh.current)
          plantMainMesh.current.setMatrixAt(plantCount, finalMatrix);
        if (plantSide1Mesh.current)
          plantSide1Mesh.current.setMatrixAt(plantCount, finalMatrix);
        if (plantSide2Mesh.current)
          plantSide2Mesh.current.setMatrixAt(plantCount, finalMatrix);

        plantCount++;
      }
    });

    if (eggMesh.current) {
      eggMesh.current.count = eggCount;
      eggMesh.current.instanceMatrix.needsUpdate = true;
    }
    if (plantMainMesh.current) {
      plantMainMesh.current.count = plantCount;
      plantMainMesh.current.instanceMatrix.needsUpdate = true;
    }
    if (plantSide1Mesh.current) {
      plantSide1Mesh.current.count = plantCount;
      plantSide1Mesh.current.instanceMatrix.needsUpdate = true;
    }
    if (plantSide2Mesh.current) {
      plantSide2Mesh.current.count = plantCount;
      plantSide2Mesh.current.instanceMatrix.needsUpdate = true;
    }
  });

  const geometries = useMemo(() => {
    const egg = new THREE.SphereGeometry(0.15, 16, 16);
    egg.translate(0, 0.15, 0);
    // Grass blades
    const main = new THREE.ConeGeometry(0.04, 0.5, 3);
    main.translate(0, 0.25, 0);
    const side1 = new THREE.ConeGeometry(0.03, 0.35, 3);
    side1.rotateZ(-0.4);
    side1.rotateY(0.5);
    side1.translate(0.1, 0.15, 0);
    const side2 = new THREE.ConeGeometry(0.03, 0.4, 3);
    side2.rotateZ(0.3);
    side2.rotateY(-0.8);
    side2.translate(-0.1, 0.18, 0);
    return { egg, main, side1, side2 };
  }, []);

  return (
    <group>
      <instancedMesh
        ref={eggMesh}
        args={[geometries.egg, undefined, maxItems]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#fef08a"
          emissive="#fef08a"
          emissiveIntensity={0.2}
          roughness={0.4}
        />
      </instancedMesh>
      <instancedMesh
        ref={plantMainMesh}
        args={[geometries.main, undefined, maxItems]}
        castShadow
      >
        <meshStandardMaterial
          color="#22c55e"
          emissive="#22c55e"
          emissiveIntensity={0.2}
          roughness={0.9}
        />
      </instancedMesh>
      <instancedMesh
        ref={plantSide1Mesh}
        args={[geometries.side1, undefined, maxItems]}
        castShadow
      >
        <meshStandardMaterial
          color="#16a34a"
          emissive="#16a34a"
          emissiveIntensity={0.2}
          roughness={0.9}
        />
      </instancedMesh>
      <instancedMesh
        ref={plantSide2Mesh}
        args={[geometries.side2, undefined, maxItems]}
        castShadow
      >
        <meshStandardMaterial
          color="#15803d"
          emissive="#15803d"
          emissiveIntensity={0.2}
          roughness={0.9}
        />
      </instancedMesh>
    </group>
  );
};
