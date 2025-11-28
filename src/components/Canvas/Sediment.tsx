"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Sediments({ scrollProgress }: { scrollProgress: number }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, velocities } = useMemo(() => {
    const count = 300;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = Math.random() * 200 - 100;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60 - 10;
      
      vel[i * 3] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 1] = -Math.random() * 0.05 - 0.02;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }
    
    return { positions: pos, velocities: vel };
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    
    const posArray = ref.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < posArray.length / 3; i++) {
      posArray[i * 3] += velocities[i * 3];
      posArray[i * 3 + 1] += velocities[i * 3 + 1];
      posArray[i * 3 + 2] += velocities[i * 3 + 2];
      
      // Reset si trop bas
      if (posArray[i * 3 + 1] < -100) {
        posArray[i * 3 + 1] = 100;
      }
    }
    
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.position.y = scrollProgress * 80;
  });

  // Visible seulement en profondeur
  if (scrollProgress < 0.4) return null;

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={300}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#8b7d6b"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}