"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function createGlowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.2, 'rgba(120, 255, 200, 0.8)');
  gradient.addColorStop(0.4, 'rgba(80, 200, 255, 0.5)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  
  return new THREE.CanvasTexture(canvas);
}

export function BioluminescentParticles({ scrollProgress }: { scrollProgress: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const glowTexture = useMemo(() => createGlowTexture(), []);
  
  const { positions, colors, sizes, speeds } = useMemo(() => {
    const count = 120;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    const spd = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Position aléatoire
      pos[i * 3] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 1] = Math.random() * 250 - 125;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80 - 20;
      
      // Couleurs bioluminescentes (cyan/vert)
      const hue = Math.random() > 0.6 ? 0 : 1;
      if (hue === 0) { // Cyan
        col[i * 3] = 0.2 + Math.random() * 0.3;
        col[i * 3 + 1] = 0.8 + Math.random() * 0.2;
        col[i * 3 + 2] = 0.9 + Math.random() * 0.1;
      } else { // Vert
        col[i * 3] = 0.3 + Math.random() * 0.2;
        col[i * 3 + 1] = 1.0;
        col[i * 3 + 2] = 0.6 + Math.random() * 0.2;
      }
      
      // Tailles variées
      siz[i] = 0.8 + Math.random() * 1.5;
      
      // Vitesses de drift
      spd[i * 3] = (Math.random() - 0.5) * 0.02;
      spd[i * 3 + 1] = Math.random() * 0.01 + 0.005;
      spd[i * 3 + 2] = (Math.random() - 0.5) * 0.015;
    }
    
    return { positions: pos, colors: col, sizes: siz, speeds: spd };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.elapsedTime;
    
    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const sizArray = pointsRef.current.geometry.attributes.size.array as Float32Array;
    
    for (let i = 0; i < posArray.length / 3; i++) {
      // Drift lent
      posArray[i * 3] += speeds[i * 3];
      posArray[i * 3 + 1] += speeds[i * 3 + 1];
      posArray[i * 3 + 2] += speeds[i * 3 + 2];
      
      // Reset si sort du cadre
      if (posArray[i * 3 + 1] > 125) {
        posArray[i * 3 + 1] = -125;
        posArray[i * 3] = (Math.random() - 0.5) * 100;
      }
      
      // Pulsation bioluminescente
      const pulseSpeed = 2 + Math.sin(i * 0.1) * 1.5;
      const pulse = Math.sin(time * pulseSpeed + i) * 0.3 + 0.7;
      sizArray[i] = sizes[i] * pulse;
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.geometry.attributes.size.needsUpdate = true;
    
    // Suivre le scroll
    pointsRef.current.position.y = scrollProgress * 100;
    
    // Visibilité : uniquement en profondeur
    pointsRef.current.visible = scrollProgress > 0.4;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={120} 
          array={positions} 
          itemSize={3} 
        />
        <bufferAttribute 
          attach="attributes-color" 
          count={120} 
          array={colors} 
          itemSize={3} 
        />
        <bufferAttribute 
          attach="attributes-size" 
          count={120} 
          array={sizes} 
          itemSize={1} 
        />
      </bufferGeometry>
      <pointsMaterial 
        size={1.5}
        vertexColors
        transparent 
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        map={glowTexture}
      />
    </points>
  );
}