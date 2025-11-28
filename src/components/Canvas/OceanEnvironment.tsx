// components/Canvas/OceanEnvironment.tsx - VERSION AMÉLIORÉE
"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface OceanEnvironmentProps {
  scrollProgress: number;
}

export function OceanEnvironment({ scrollProgress }: OceanEnvironmentProps) {
  const { scene, gl } = useThree();
  const lightGroupRef = useRef<THREE.Group>(null);

  // ✅ Couleurs réalistes par zone
  const oceanColors = useMemo(() => ({
    surface: {
      sky: new THREE.Color("#87CEEB"),
      water: new THREE.Color("#006994"),
      fog: new THREE.Color("#4A90A4"),
    },
    shallow: {
      sky: new THREE.Color("#2B6B8F"),
      water: new THREE.Color("#1B4F72"),
      fog: new THREE.Color("#2C5F7F"),
    },
    mid: {
      sky: new THREE.Color("#1A3A52"),
      water: new THREE.Color("#0D2535"),
      fog: new THREE.Color("#1A3545"),
    },
    deep: {
      sky: new THREE.Color("#0A1929"),
      water: new THREE.Color("#050F1A"),
      fog: new THREE.Color("#0A1520"),
    },
    abyss: {
      sky: new THREE.Color("#000510"),
      water: new THREE.Color("#000205"),
      fog: new THREE.Color("#00030A"),
    },
  }), []);

  useFrame((state) => {
    const t = scrollProgress;
    
    // ✅ Interpolation multi-zones
    let currentColors = oceanColors.surface;
    let nextColors = oceanColors.shallow;
    let blend = t * 4; // 0-1 pour chaque zone

    if (t < 0.25) {
      currentColors = oceanColors.surface;
      nextColors = oceanColors.shallow;
      blend = t * 4;
    } else if (t < 0.5) {
      currentColors = oceanColors.shallow;
      nextColors = oceanColors.mid;
      blend = (t - 0.25) * 4;
    } else if (t < 0.75) {
      currentColors = oceanColors.mid;
      nextColors = oceanColors.deep;
      blend = (t - 0.5) * 4;
    } else {
      currentColors = oceanColors.deep;
      nextColors = oceanColors.abyss;
      blend = (t - 0.75) * 4;
    }

    const bgColor = currentColors.water.clone().lerp(nextColors.water, blend);
    const fogColor = currentColors.fog.clone().lerp(nextColors.fog, blend);

    scene.background = bgColor;
    
    if (scene.fog instanceof THREE.FogExp2) {
      scene.fog.color.copy(fogColor);
      scene.fog.density = 0.005 + t * 0.015; // Plus dense en profondeur
    }

    // ✅ Mouvement réaliste des lumières (vagues)
    if (lightGroupRef.current) {
      lightGroupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 5;
      lightGroupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <>
      <fogExp2 attach="fog" args={["#006994", 0.008]} />
      
      {/* ✅ Éclairage dynamique réaliste */}
      <group ref={lightGroupRef}>
        {/* Lumière du soleil depuis la surface */}
        <directionalLight 
          position={[15, 60, 10]} 
          intensity={2.5 * (1 - scrollProgress * 0.8)} 
          color="#B8E6FF"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-50}
          shadow-camera-right={50}
          shadow-camera-top={50}
          shadow-camera-bottom={-50}
        />
        
        {/* Lumière ambiante douce */}
        <ambientLight intensity={0.4 * (1 - scrollProgress * 0.6)} color="#7AC8E8" />
        
        {/* Lumières secondaires pour la profondeur */}
        <hemisphereLight 
          args={["#4A90A4", "#0A2535", 0.6 * (1 - scrollProgress * 0.5)]}
        />
      </group>

      {/* ✅ Spots volumétriques qui suivent le scroll */}
      {scrollProgress < 0.6 && (
        <>
          <spotLight
            position={[20, 40, -10]}
            angle={0.4}
            penumbra={1}
            intensity={4 * (1 - scrollProgress)}
            color="#A8D8EA"
            distance={80}
            decay={2}
          />
          <spotLight
            position={[-20, 35, -15]}
            angle={0.5}
            penumbra={1}
            intensity={3 * (1 - scrollProgress)}
            color="#6BB6D6"
            distance={70}
            decay={2}
          />
        </>
      )}
    </>
  );
}