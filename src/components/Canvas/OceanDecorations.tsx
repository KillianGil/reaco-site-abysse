"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface OceanDecorationsProps {
  scrollProgress: number;
}

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

function BioluminescentPlankton({ 
  scrollProgress 
}: { 
  scrollProgress: number 
}) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const { positions, colors, sizes } = useMemo(() => {
    const count = 100;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = Math.random() * 200 - 100;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40 - 15;
      
      const isGreen = Math.random() > 0.5;
      col[i * 3] = isGreen ? 0.2 : 0.3;
      col[i * 3 + 1] = isGreen ? 1.0 : 0.9;
      col[i * 3 + 2] = isGreen ? 0.8 : 1.0;
      
      siz[i] = 0.3 + Math.random() * 0.4;
    }
    
    return { positions: pos, colors: col, sizes: siz };
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    
    pointsRef.current.position.y = scrollProgress * 100;
    
    const pulse = 0.7 + Math.sin(t * 1.5) * 0.3;
    if (pointsRef.current.material) {
      (pointsRef.current.material as THREE.PointsMaterial).opacity = pulse;
    }
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={100} 
          array={positions} 
          itemSize={3} 
        />
        <bufferAttribute 
          attach="attributes-color" 
          count={100} 
          array={colors} 
          itemSize={3} 
        />
        <bufferAttribute 
          attach="attributes-size" 
          count={100} 
          array={sizes} 
          itemSize={1} 
        />
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

export function OceanDecorations({ scrollProgress }: OceanDecorationsProps) {
  return (
    <>
      <BioluminescentPlankton scrollProgress={scrollProgress} />
    </>
  );
}