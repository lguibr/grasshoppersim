import React from "react";
import { Environment } from "@react-three/drei";

export const EnvironmentSetup = () => (
  <>
    <fog attach="fog" args={["#0f172a", 100, 4000]} />
    <ambientLight intensity={0.05} />
    <Environment preset="night" />
  </>
);
