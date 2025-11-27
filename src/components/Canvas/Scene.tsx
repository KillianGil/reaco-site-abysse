"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useRef, useMemo } from "react";
import { Preload, Environment } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Submarine } from "./Submarine";
import { OceanEnvironment } from "./OceanEnvironment";

interface SceneProps {
  scrollProgress: number;
}

// Marine snow
function MarineSnow({ scrollProgress }: { scrollProgress: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 1200;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 1] = Math.random() * 300 - 150;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80 - 20;
    }
    return pos;
  }, []);

  useFrame(() => {
    if (ref.current) {
      ref.current.position.y = scrollProgress * 80;
    }
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={1200} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#ffffff" transparent opacity={0.3} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function MarineSnow2({ scrollProgress }: { scrollProgress: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 800;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 90;
      pos[i * 3 + 1] = Math.random() * 280 - 140;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 70 - 30;
    }
    return pos;
  }, []);

  useFrame(() => {
    if (ref.current) {
      ref.current.position.y = scrollProgress * 70;
    }
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={800} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.14} color="#d0e8ff" transparent opacity={0.22} sizeAttenuation depthWrite={false} />
    </points>
  );
}

// Simple fish - just small swimming shapes
function SimpleFish({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  // 30 fish at different fixed Y positions
  const fishData = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      x: (Math.random() - 0.5) * 60,
      y: 20 - i * 4, // Spread from Y=20 to Y=-100
      z: -15 - Math.random() * 20,
      speed: 0.5 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      dir: Math.random() > 0.5 ? 1 : -1,
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = scrollProgress * 120;
  });

  return (
    <group ref={groupRef}>
      {fishData.map((fish, i) => (
        <SingleSimpleFish key={i} fish={fish} />
      ))}
    </group>
  );
}

function SingleSimpleFish({ fish }: { fish: { x: number; y: number; z: number; speed: number; phase: number; dir: number } }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    // Swimming motion
    const swimX = Math.sin(t * fish.speed + fish.phase) * 6;
    
    meshRef.current.position.set(
      fish.x + swimX * fish.dir,
      fish.y + Math.sin(t * fish.speed * 1.3 + fish.phase) * 0.3,
      fish.z
    );

    // Face direction
    meshRef.current.rotation.y = fish.dir > 0 ? 0 : Math.PI;
    meshRef.current.rotation.z = Math.sin(t * 4 + fish.phase) * 0.1;
  });

  return (
    <mesh ref={meshRef}>
      <coneGeometry args={[0.08, 0.3, 4]} />
      <meshStandardMaterial color="#88aacc" transparent opacity={0.6} />
    </mesh>
  );
}

export function Scene({ scrollProgress }: SceneProps) {
  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 50, near: 0.1, far: 500 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <OceanEnvironment scrollProgress={scrollProgress} />
          <Environment preset="night" background={false} environmentIntensity={0.15} />

          <MarineSnow scrollProgress={scrollProgress} />
          <MarineSnow2 scrollProgress={scrollProgress} />

          <SimpleFish scrollProgress={scrollProgress} />

          <Submarine scrollProgress={scrollProgress} />

          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
