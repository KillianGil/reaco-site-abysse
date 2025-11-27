"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface FishSchoolProps {
  scrollProgress: number;
}

export function FishSchool({ scrollProgress }: FishSchoolProps) {
  const { scene } = useGLTF("/models/guppy.glb");
  const groupRef = useRef<THREE.Group>(null);

  // Pre-generate fish data - spread throughout depth
  const fishList = useMemo(() => {
    const list = [];
    for (let i = 0; i < 35; i++) {
      list.push({
        // Spread from surface (Y=15) to deep (Y=-100)
        y: 15 - (i * 3.3),
        // Random horizontal position
        x: (Math.random() - 0.5) * 40,
        // Random depth
        z: -10 - Math.random() * 30,
        // Direction
        dir: Math.random() > 0.5 ? 1 : -1,
        // Speed
        spd: 0.3 + Math.random() * 0.7,
        // Phase
        ph: Math.random() * 10,
        // Scale - TINY
        sc: 0.004 + Math.random() * 0.008,
      });
    }
    return list;
  }, []);

  // Clone models once
  const clones = useMemo(() => {
    return fishList.map(() => scene.clone());
  }, [scene, fishList]);

  return (
    <group ref={groupRef}>
      {fishList.map((f, i) => (
        <SingleFish key={i} fish={f} clone={clones[i]} scrollProgress={scrollProgress} />
      ))}
    </group>
  );
}

function SingleFish({ 
  fish, 
  clone, 
  scrollProgress 
}: { 
  fish: { y: number; x: number; z: number; dir: number; spd: number; ph: number; sc: number };
  clone: THREE.Group;
  scrollProgress: number;
}) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    // Scroll offset - fish rise as we descend
    const yOffset = scrollProgress * 130;

    // Swimming animation
    const swimX = Math.sin(t * fish.spd + fish.ph) * 5;
    const swimY = Math.sin(t * fish.spd * 1.5 + fish.ph) * 0.4;

    meshRef.current.position.set(
      fish.x + swimX * fish.dir,
      fish.y + swimY + yOffset,
      fish.z
    );

    // Face direction + tail wiggle
    const wiggle = Math.sin(t * 6 + fish.ph) * 0.2;
    meshRef.current.rotation.set(
      0,
      fish.dir > 0 ? Math.PI * 0.5 + wiggle : -Math.PI * 0.5 + wiggle,
      0
    );

    meshRef.current.scale.setScalar(fish.sc);
  });

  return (
    <group ref={meshRef} frustumCulled={false}>
      <primitive object={clone} />
    </group>
  );
}

useGLTF.preload("/models/guppy.glb");
