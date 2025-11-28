"use client";

import { useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface OceanEnvironmentProps {
  scrollProgress: number;
}

export function OceanEnvironment({ scrollProgress }: OceanEnvironmentProps) {
  const { scene } = useThree();

  const colors = useMemo(() => ({
    surface: new THREE.Color("#1a7a9a"),
    shallow: new THREE.Color("#0e5a78"),
    mid: new THREE.Color("#084560"),
    deep: new THREE.Color("#042838"),
    abyss: new THREE.Color("#021520"),
  }), []);

  useFrame(() => {
    // Simple linear interpolation
    const t = Math.min(scrollProgress, 1);

    const startColor = colors.surface;
    const endColor = colors.abyss;

    const bgColor = startColor.clone().lerp(endColor, t);

    scene.background = bgColor;

    if (scene.fog instanceof THREE.FogExp2) {
      scene.fog.color.copy(bgColor);
      scene.fog.density = 0.008 + t * 0.01;
    }
  });

  return (
    <>
      <fogExp2 attach="fog" args={["#1a7a9a", 0.01]} />
      <ambientLight intensity={0.5} color="#7ac8e8" />
      <directionalLight position={[10, 50, 20]} intensity={1.2 * (1 - scrollProgress * 0.5)} color="#aaeeff" />
      <directionalLight position={[-15, 30, 10]} intensity={0.5 * (1 - scrollProgress * 0.3)} color="#88bbdd" />
    </>
  );
}
