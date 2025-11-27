"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface DeepSeaCreatureProps {
  scrollProgress: number;
}

export function DeepSeaCreature({ scrollProgress }: DeepSeaCreatureProps) {
  const { scene } = useGLTF("/models/anglerfish.glb");
  const ref = useRef<THREE.Group>(null);
  const cloned = useMemo(() => scene.clone(), [scene]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();

    // Slow swimming
    const swimX = Math.sin(t * 0.12) * 3;
    const swimY = Math.sin(t * 0.18) * 1;
    const swimZ = Math.cos(t * 0.1) * 1.5;

    // Position rises with scroll
    const baseY = -90 + scrollProgress * 100;

    ref.current.position.set(12 + swimX, baseY + swimY, -18 + swimZ);
    ref.current.rotation.set(
      Math.sin(t * 0.08) * 0.08,
      Math.sin(t * 0.06) * 0.25 + Math.PI * 0.7,
      Math.sin(t * 0.1) * 0.04
    );
  });

  // Only show in deep section
  if (scrollProgress < 0.5) return null;

  return (
    <group ref={ref} frustumCulled={false}>
      <primitive object={cloned} scale={20} />

      {/* Bright lantern */}
      <pointLight position={[0, 3, 6]} intensity={15} color="#00ffaa" distance={40} decay={1} />
      
      {/* Glowing orb */}
      <mesh position={[0, 3, 6]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial color="#00ffcc" />
      </mesh>
      <mesh position={[0, 3, 6]}>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.35} />
      </mesh>

      {/* Self light */}
      <pointLight position={[0, 0, 0]} intensity={4} color="#002211" distance={25} />
      
      {/* Eyes */}
      <pointLight position={[2, 0.5, 4]} intensity={6} color="#00ffaa" distance={15} />
      <pointLight position={[-2, 0.5, 4]} intensity={6} color="#00ffaa" distance={15} />
    </group>
  );
}

useGLTF.preload("/models/anglerfish.glb");
