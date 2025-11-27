"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Submarine } from "./Submarine";
import { OceanEnvironment } from "./OceanEnvironment";
import { FishSchool } from "./FishSchool";
import { Anglerfish } from "./Anglerfish";
import { OceanDecorations } from "./OceanDecorations";

interface SceneProps {
  scrollProgress: number;
}

// Create circular texture for particles
function createCircleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Marine snow - gentle floating particles
function MarineSnow({ scrollProgress }: { scrollProgress: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 1000; // Reduced from 1500 for better performance
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 120;
      pos[i * 3 + 1] = Math.random() * 350 - 175;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 100 - 20;
    }
    return pos;
  }, []);

  useFrame(() => {
    if (ref.current) {
      ref.current.position.y = scrollProgress * 100;
    }
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={1000} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial 
        size={0.15} 
        color="#ffffff" 
        transparent 
        opacity={0.4} 
        sizeAttenuation 
        depthWrite={false}
        alphaTest={0.01}
      >
        <primitive attach="map" object={createCircleTexture()} />
      </pointsMaterial>
    </points>
  );
}

// Secondary layer of marine snow for depth
function MarineSnow2({ scrollProgress }: { scrollProgress: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 700; // Reduced from 1000 for better performance
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 1] = Math.random() * 320 - 160;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80 - 30;
    }
    return pos;
  }, []);

  useFrame(() => {
    if (ref.current) {
      ref.current.position.y = scrollProgress * 85;
    }
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={700} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial 
        size={0.18} 
        color="#c8e4f0" 
        transparent 
        opacity={0.3} 
        sizeAttenuation 
        depthWrite={false}
        alphaTest={0.01}
      >
        <primitive attach="map" object={createCircleTexture()} />
      </pointsMaterial>
    </points>
  );
}

export function Scene({ scrollProgress }: SceneProps) {
  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 50, near: 0.1, far: 500 }}
        gl={{ 
          antialias: true, 
          alpha: false, 
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        style={{ background: "#1a7a9a" }}
      >
        <color attach="background" args={["#1a7a9a"]} />
        
        <Suspense fallback={null}>
          <OceanEnvironment scrollProgress={scrollProgress} />
          {/* Environment disabled to avoid HDR loading errors */}

          {/* Marine snow particles */}
          <MarineSnow scrollProgress={scrollProgress} />
          <MarineSnow2 scrollProgress={scrollProgress} />

          {/* Ocean decorations (bubbles, plankton, jellyfish, rays) */}
          <OceanDecorations scrollProgress={scrollProgress} />

          {/* Fish schools - in background behind submarine */}
          <FishSchool scrollProgress={scrollProgress} />
          
          {/* Anglerfish in the abyss */}
          <Anglerfish scrollProgress={scrollProgress} />

          {/* The submarine - in front */}
          <Submarine scrollProgress={scrollProgress} />

        </Suspense>
      </Canvas>
    </div>
  );
}
