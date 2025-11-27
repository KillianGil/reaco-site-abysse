"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useRef, useMemo } from "react";
import { Preload, Environment } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Submarine } from "./Submarine";
import { OceanEnvironment } from "./OceanEnvironment";
import { FishSchool } from "./FishSchool";
import { DeepSeaCreature } from "./DeepSeaCreature";

interface SceneProps {
  scrollProgress: number;
}

// Marine snow layer 1
function MarineSnow({ scrollProgress }: { scrollProgress: number }) {
  const particlesRef = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const count = 1000;
    const pos = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 1] = Math.random() * 200 - 100;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 100 - 20;
    }
    
    return pos;
  }, []);

  useFrame(() => {
    if (!particlesRef.current) return;
    particlesRef.current.position.y = scrollProgress * 60;
  });

  return (
    <points ref={particlesRef} frustumCulled={false} position={[0, -50, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={1000} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial 
        size={0.12} 
        color="#ffffff"
        transparent 
        opacity={0.35}
        sizeAttenuation 
        depthWrite={false}
      />
    </points>
  );
}

// Marine snow layer 2
function MarineSnowLayer2({ scrollProgress }: { scrollProgress: number }) {
  const particlesRef = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const count = 600;
    const pos = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = Math.random() * 180 - 90;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80 - 30;
    }
    
    return pos;
  }, []);

  useFrame(() => {
    if (!particlesRef.current) return;
    particlesRef.current.position.y = scrollProgress * 50;
  });

  return (
    <points ref={particlesRef} frustumCulled={false} position={[0, -40, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={600} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial 
        size={0.18} 
        color="#d0e8ff"
        transparent 
        opacity={0.25}
        sizeAttenuation 
        depthWrite={false}
      />
    </points>
  );
}

// Marine snow layer 3
function MarineSnowLayer3({ scrollProgress }: { scrollProgress: number }) {
  const particlesRef = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const count = 400;
    const pos = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 120;
      pos[i * 3 + 1] = Math.random() * 250 - 125;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60 - 50;
    }
    
    return pos;
  }, []);

  useFrame(() => {
    if (!particlesRef.current) return;
    particlesRef.current.position.y = scrollProgress * 70;
  });

  return (
    <points ref={particlesRef} frustumCulled={false} position={[0, -60, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={400} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial 
        size={0.08} 
        color="#ffffff"
        transparent 
        opacity={0.2}
        sizeAttenuation 
        depthWrite={false}
      />
    </points>
  );
}

export function Scene({ scrollProgress }: SceneProps) {
  return (
    <div className="canvas-container">
      <Canvas
        camera={{
          position: [0, 0, 12],
          fov: 50,
          near: 0.1,
          far: 500,
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
        shadows
      >
        <Suspense fallback={null}>
          <OceanEnvironment scrollProgress={scrollProgress} />

          {/* Environment for realistic reflections on fish scales and metal */}
          <Environment preset="night" background={false} environmentIntensity={0.2} />

          {/* Marine snow - 3 layers */}
          <MarineSnow scrollProgress={scrollProgress} />
          <MarineSnowLayer2 scrollProgress={scrollProgress} />
          <MarineSnowLayer3 scrollProgress={scrollProgress} />

          {/* Fish distributed along the descent */}
          <FishSchool scrollProgress={scrollProgress} />

          {/* Deep sea anglerfish - appears in biodiversity section */}
          <DeepSeaCreature scrollProgress={scrollProgress} />

          {/* The submarine */}
          <Submarine scrollProgress={scrollProgress} />

          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
