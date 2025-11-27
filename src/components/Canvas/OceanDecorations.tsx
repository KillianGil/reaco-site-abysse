"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface OceanDecorationsProps {
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


// Bioluminescent plankton
function BioluminescentPlankton({ scrollProgress }: { scrollProgress: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const { positions, colors, sizes } = useMemo(() => {
    const count = 100; // Reduced from 150 for better performance
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Scattered throughout the depth
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = Math.random() * 200 - 100;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40 - 15;
      
      // Cyan/green bioluminescent colors
      const isGreen = Math.random() > 0.5;
      col[i * 3] = isGreen ? 0.2 : 0.3;     // R
      col[i * 3 + 1] = isGreen ? 1.0 : 0.9; // G
      col[i * 3 + 2] = isGreen ? 0.8 : 1.0; // B
      
      siz[i] = 0.3 + Math.random() * 0.4;
    }
    
    return { positions: pos, colors: col, sizes: siz };
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    
    // Move with scroll
    pointsRef.current.position.y = scrollProgress * 100;
    
    // Gentle pulsing
    const pulse = 0.7 + Math.sin(t * 1.5) * 0.3;
    if (pointsRef.current.material) {
      (pointsRef.current.material as THREE.PointsMaterial).opacity = pulse;
    }
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={100} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={100} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={100} array={sizes} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial 
        size={0.8}
        vertexColors
        transparent 
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        alphaTest={0.01}
        map={createCircleTexture()}
      />
    </points>
  );
}

// Floating jellyfish-like lights (simple) - Reduced for performance
function JellyfishLights({ scrollProgress }: { scrollProgress: number }) {
  const jellyfishData = useMemo(() => [
    { x: -15, baseY: -30, z: -20, speed: 0.3, phase: 0, color: "#4a88ff" },
    { x: 12, baseY: -50, z: -18, speed: 0.25, phase: 1, color: "#6a66ff" },
  ], []);

  return (
    <>
      {jellyfishData.map((jelly, i) => (
        <JellyfishLight key={i} {...jelly} scrollProgress={scrollProgress} />
      ))}
    </>
  );
}

function JellyfishLight({ 
  x, baseY, z, speed, phase, color, scrollProgress 
}: { 
  x: number; 
  baseY: number; 
  z: number; 
  speed: number; 
  phase: number; 
  color: string;
  scrollProgress: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current || !lightRef.current) return;
    const t = clock.getElapsedTime();
    
    const floatY = Math.sin(t * speed + phase) * 2;
    const floatX = Math.sin(t * speed * 0.5 + phase) * 1;
    
    const y = baseY + floatY + scrollProgress * 120;
    
    meshRef.current.position.set(x + floatX, y, z);
    lightRef.current.position.set(x + floatX, y, z);
    
    // Pulse
    const pulse = 0.5 + Math.sin(t * 2 + phase) * 0.3;
    lightRef.current.intensity = pulse;
  });

  return (
    <>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>
      <pointLight 
        ref={lightRef}
        color={color} 
        intensity={0.5} 
        distance={8}
        decay={2}
      />
    </>
  );
}

// Light rays from surface (volumetric-like effect)
function LightRays({ scrollProgress }: { scrollProgress: number }) {
  const raysRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (!raysRef.current) return;
    const t = clock.getElapsedTime();
    
    // Subtle rotation
    raysRef.current.rotation.z = Math.sin(t * 0.1) * 0.05;
    
    // Fade with depth
    const opacity = Math.max(0, 1 - scrollProgress * 1.5);
    raysRef.current.children.forEach((child) => {
      if (child instanceof THREE.Mesh) {
        (child.material as THREE.MeshBasicMaterial).opacity = opacity * 0.08;
      }
    });
  });

  return (
    <group ref={raysRef} position={[0, 50, -30]}>
      {[-10, -5, 0, 5, 10].map((offset, i) => (
        <mesh key={i} position={[offset * 2, 0, 0]} rotation={[0, 0, Math.PI / 6]}>
          <planeGeometry args={[2, 80]} />
          <meshBasicMaterial 
            color="#aaddff" 
            transparent 
            opacity={0.08}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export function OceanDecorations({ scrollProgress }: OceanDecorationsProps) {
  return (
    <>
      {/* Bubbles removed - user didn't like them */}
      <BioluminescentPlankton scrollProgress={scrollProgress} />
      <JellyfishLights scrollProgress={scrollProgress} />
      <LightRays scrollProgress={scrollProgress} />
    </>
  );
}

