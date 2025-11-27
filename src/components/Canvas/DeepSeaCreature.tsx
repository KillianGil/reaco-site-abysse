"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface DeepSeaCreatureProps {
  scrollProgress: number;
}

export function DeepSeaCreature({ scrollProgress }: DeepSeaCreatureProps) {
  const { scene } = useGLTF("/models/anglerfish.glb");
  const groupRef = useRef<THREE.Group>(null);
  const lanternRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;

    // Slow, menacing movement
    const floatX = Math.sin(time * 0.1) * 2;
    const floatY = Math.sin(time * 0.15) * 1;
    const floatZ = Math.sin(time * 0.08) * 1.5;

    // Base position - deep in the abyss
    // Appears around scroll 0.65-0.9 (Section 5: Biodiversity)
    const baseY = -70 + scrollProgress * 30;
    
    groupRef.current.position.set(
      8 + floatX,
      baseY + floatY,
      -15 + floatZ
    );

    // Slow hunting rotation
    groupRef.current.rotation.y = Math.sin(time * 0.08) * 0.4 - Math.PI * 0.3;
    groupRef.current.rotation.x = Math.sin(time * 0.1) * 0.15;
    groupRef.current.rotation.z = Math.sin(time * 0.12) * 0.08;

    // Lantern flicker effect
    if (lanternRef.current) {
      const flicker = Math.sin(time * 5) * 0.3 + Math.sin(time * 13) * 0.2 + Math.random() * 0.2;
      lanternRef.current.intensity = 8 + flicker * 3;
    }
  });

  // Visibility: appears in deep section (65% - 95% scroll)
  const isVisible = scrollProgress > 0.6 && scrollProgress < 0.95;
  const fadeIn = Math.min((scrollProgress - 0.6) * 5, 1);
  const fadeOut = scrollProgress > 0.9 ? 1 - (scrollProgress - 0.9) * 10 : 1;
  const opacity = isVisible ? fadeIn * fadeOut : 0;

  if (!isVisible || opacity < 0.1) return null;

  return (
    <group ref={groupRef} frustumCulled={false}>
      {/* The anglerfish model - LARGE SCALE */}
      <primitive 
        object={scene.clone()} 
        scale={12}
        rotation={[0, Math.PI, 0]}
      />
      
      {/* Main bioluminescent lantern - BRIGHT */}
      <pointLight
        ref={lanternRef}
        position={[0, 2, 4]}
        intensity={8}
        color="#00ff88"
        distance={25}
        decay={2}
      />
      
      {/* Lantern glow orb */}
      <mesh position={[0, 2, 4]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color="#00ffaa"
          emissive="#00ff88"
          emissiveIntensity={5}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Secondary eye glow */}
      <pointLight
        position={[1, 0.5, 2]}
        intensity={2}
        color="#00ffaa"
        distance={8}
      />
      <pointLight
        position={[-1, 0.5, 2]}
        intensity={2}
        color="#00ffaa"
        distance={8}
      />

      {/* Ambient self-illumination */}
      <pointLight
        position={[0, 0, 0]}
        intensity={1}
        color="#003322"
        distance={15}
      />

      {/* Dramatic rim light */}
      <spotLight
        position={[-10, 5, -5]}
        angle={0.5}
        penumbra={1}
        intensity={3}
        color="#004433"
        distance={30}
        target-position={[0, 0, 0]}
      />
    </group>
  );
}

useGLTF.preload("/models/anglerfish.glb");
