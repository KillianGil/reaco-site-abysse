"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface FishSchoolProps {
  scrollProgress: number;
}

interface FishData {
  position: [number, number, number];
  baseY: number;
  rotation: number;
  speed: number;
  offset: number;
  scale: number;
  swimAmplitude: number;
}

export function FishSchool({ scrollProgress }: FishSchoolProps) {
  const { scene } = useGLTF("/models/guppy.glb");
  const groupRef = useRef<THREE.Group>(null);

  // Generate fish distributed along the ENTIRE descent path
  const fishData = useMemo<FishData[]>(() => {
    const fish: FishData[] = [];
    
    // School 1: Surface area (Y: 5 to -5)
    for (let i = 0; i < 8; i++) {
      fish.push({
        position: [
          (Math.random() - 0.5) * 30,
          5 - Math.random() * 10,
          -15 + (Math.random() - 0.5) * 20
        ],
        baseY: 5 - Math.random() * 10,
        rotation: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 0.5,
        offset: Math.random() * Math.PI * 2,
        scale: 0.015 + Math.random() * 0.01,
        swimAmplitude: 0.3 + Math.random() * 0.2,
      });
    }

    // School 2: Shallow (Y: -10 to -25)
    for (let i = 0; i < 12; i++) {
      fish.push({
        position: [
          (Math.random() - 0.5) * 40,
          -10 - Math.random() * 15,
          -20 + (Math.random() - 0.5) * 25
        ],
        baseY: -10 - Math.random() * 15,
        rotation: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.4,
        offset: Math.random() * Math.PI * 2,
        scale: 0.012 + Math.random() * 0.008,
        swimAmplitude: 0.25 + Math.random() * 0.15,
      });
    }

    // School 3: Mid depth (Y: -25 to -45)
    for (let i = 0; i < 15; i++) {
      fish.push({
        position: [
          (Math.random() - 0.5) * 50,
          -25 - Math.random() * 20,
          -25 + (Math.random() - 0.5) * 30
        ],
        baseY: -25 - Math.random() * 20,
        rotation: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.3,
        offset: Math.random() * Math.PI * 2,
        scale: 0.01 + Math.random() * 0.008,
        swimAmplitude: 0.2 + Math.random() * 0.15,
      });
    }

    // School 4: Deep (Y: -45 to -65) - fewer, smaller
    for (let i = 0; i < 10; i++) {
      fish.push({
        position: [
          (Math.random() - 0.5) * 40,
          -45 - Math.random() * 20,
          -30 + (Math.random() - 0.5) * 25
        ],
        baseY: -45 - Math.random() * 20,
        rotation: Math.random() * Math.PI * 2,
        speed: 0.2 + Math.random() * 0.2,
        offset: Math.random() * Math.PI * 2,
        scale: 0.008 + Math.random() * 0.006,
        swimAmplitude: 0.15 + Math.random() * 0.1,
      });
    }

    // Crossing schools (swim horizontally across view)
    for (let i = 0; i < 6; i++) {
      fish.push({
        position: [
          -40 + i * 5,
          -5 - i * 8,
          -12 + (Math.random() - 0.5) * 8
        ],
        baseY: -5 - i * 8,
        rotation: 0, // Swimming forward
        speed: 1.5 + Math.random() * 0.5,
        offset: i * 0.3,
        scale: 0.018 + Math.random() * 0.008,
        swimAmplitude: 0.4,
      });
    }

    return fish;
  }, []);

  // Clone scene for each fish
  const fishMeshes = useMemo(() => {
    return fishData.map(() => scene.clone());
  }, [scene, fishData]);

  return (
    <group ref={groupRef} frustumCulled={false}>
      {fishData.map((fish, i) => (
        <Fish 
          key={i} 
          data={fish} 
          mesh={fishMeshes[i]} 
          scrollProgress={scrollProgress}
          index={i}
        />
      ))}
    </group>
  );
}

// Individual fish with swimming animation
function Fish({ 
  data, 
  mesh, 
  scrollProgress,
  index 
}: { 
  data: FishData; 
  mesh: THREE.Group;
  scrollProgress: number;
  index: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const isCrossing = index >= 45; // Last 6 are crossing fish

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.elapsedTime;

    // Swimming motion
    const swimX = Math.sin(time * data.speed * 2 + data.offset) * data.swimAmplitude;
    const swimY = Math.sin(time * data.speed * 3 + data.offset) * data.swimAmplitude * 0.3;
    const swimZ = Math.cos(time * data.speed * 1.5 + data.offset) * data.swimAmplitude * 0.5;

    // Horizontal crossing movement for crossing fish
    let crossingOffset = 0;
    if (isCrossing) {
      crossingOffset = (time * data.speed * 2 + data.offset * 10) % 100 - 50;
    }

    // Position with scroll offset (fish rise as we descend)
    ref.current.position.set(
      data.position[0] + swimX + crossingOffset,
      data.baseY + swimY + scrollProgress * 80,
      data.position[2] + swimZ
    );

    // Rotation - face swimming direction with tail wiggle
    const tailWiggle = Math.sin(time * 10 + data.offset) * 0.15;
    const bodyRoll = Math.sin(time * 2 + data.offset) * 0.1;
    
    ref.current.rotation.set(
      bodyRoll,
      data.rotation + tailWiggle + (isCrossing ? 0 : Math.PI / 2), // Correct orientation
      Math.sin(time * 3 + data.offset) * 0.08
    );

    ref.current.scale.setScalar(data.scale);
  });

  return (
    <group ref={ref} frustumCulled={false}>
      <primitive object={mesh} rotation={[0, Math.PI / 2, 0]} />
    </group>
  );
}

useGLTF.preload("/models/guppy.glb");
