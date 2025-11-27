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

// Marine snow - FIXED: Large scale on Y axis + frustumCulled={false}
function MarineSnow({ scrollProgress }: { scrollProgress: number }) {
  const particlesRef = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const count = 800;
    const pos = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Wide X/Z spread, VERY tall Y spread
      pos[i * 3] = (Math.random() - 0.5) * 80;      // X: -40 to 40
      pos[i * 3 + 1] = (Math.random() - 0.5) * 200; // Y: -100 to 100 (tall!)
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80 - 20; // Z: behind camera
    }
    
    return pos;
  }, []);

  useFrame(() => {
    if (!particlesRef.current) return;
    // Particles rise as we scroll (simulating descent)
    particlesRef.current.position.y = scrollProgress * 50;
  });

  return (
    <points ref={particlesRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={800} array={positions} itemSize={3} />
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

// Second layer of particles - different depth
function MarineSnowLayer2({ scrollProgress }: { scrollProgress: number }) {
  const particlesRef = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const count = 500;
    const pos = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 180;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60 - 30;
    }
    
    return pos;
  }, []);

  useFrame(() => {
    if (!particlesRef.current) return;
    particlesRef.current.position.y = scrollProgress * 40;
  });

  return (
    <points ref={particlesRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={500} array={positions} itemSize={3} />
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

// Third layer - far background
function MarineSnowLayer3({ scrollProgress }: { scrollProgress: number }) {
  const particlesRef = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const count = 300;
    const pos = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 250;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40 - 50;
    }
    
    return pos;
  }, []);

  useFrame(() => {
    if (!particlesRef.current) return;
    particlesRef.current.position.y = scrollProgress * 60;
  });

  return (
    <points ref={particlesRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={300} array={positions} itemSize={3} />
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
          far: 300,
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

          <Environment preset="night" background={false} />

          {/* Marine snow - 3 layers with frustumCulled={false} */}
          <MarineSnow scrollProgress={scrollProgress} />
          <MarineSnowLayer2 scrollProgress={scrollProgress} />
          <MarineSnowLayer3 scrollProgress={scrollProgress} />

          {/* The submarine */}
          <Submarine scrollProgress={scrollProgress} />

          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
