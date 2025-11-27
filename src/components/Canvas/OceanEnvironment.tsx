"use client";

import { useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface OceanEnvironmentProps {
  scrollProgress: number;
}

export function OceanEnvironment({ scrollProgress }: OceanEnvironmentProps) {
  const { scene } = useThree();

  // Vibrant ocean color palette
  const colors = useMemo(() => ({
    surface: new THREE.Color("#1a7a9a"),   // Bright turquoise surface
    shallow: new THREE.Color("#0e5a78"),   // Shallow blue
    mid: new THREE.Color("#084560"),       // Mid ocean
    deep: new THREE.Color("#042838"),      // Deep blue
    abyss: new THREE.Color("#021520"),     // Dark abyss with blue tint
  }), []);

  useFrame(() => {
    let bgColor: THREE.Color;

    if (scrollProgress < 0.15) {
      bgColor = colors.surface.clone().lerp(colors.shallow, scrollProgress / 0.15);
    } else if (scrollProgress < 0.35) {
      bgColor = colors.shallow.clone().lerp(colors.mid, (scrollProgress - 0.15) / 0.2);
    } else if (scrollProgress < 0.6) {
      bgColor = colors.mid.clone().lerp(colors.deep, (scrollProgress - 0.35) / 0.25);
    } else {
      bgColor = colors.deep.clone().lerp(colors.abyss, (scrollProgress - 0.6) / 0.4);
    }

    scene.background = bgColor;

    if (scene.fog && scene.fog instanceof THREE.FogExp2) {
      scene.fog.color.copy(bgColor);
      scene.fog.density = 0.008 + scrollProgress * 0.012;
    }
  });

  return (
    <>
      {/* Light fog for depth */}
      <fogExp2 attach="fog" args={["#1a7a9a", 0.01]} />
      
      {/* Strong ambient for visibility */}
      <ambientLight intensity={0.5} color="#7ac8e8" />
      
      {/* Sun rays */}
      <directionalLight
        position={[10, 50, 20]}
        intensity={1.2 * (1 - scrollProgress * 0.5)}
        color="#aaeeff"
        castShadow
      />
      
      {/* Fill light */}
      <directionalLight
        position={[-15, 30, 10]}
        intensity={0.5 * (1 - scrollProgress * 0.3)}
        color="#88bbdd"
      />
      
      {/* Underwater caustic simulation */}
      <pointLight
        position={[0, 20, 0]}
        intensity={0.8 * (1 - scrollProgress * 0.6)}
        color="#aaddff"
        distance={60}
      />
    </>
  );
}
