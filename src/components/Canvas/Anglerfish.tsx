"use client";

import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useFBX, useTexture } from "@react-three/drei";
import * as THREE from "three";

interface AnglerfishProps {
  scrollProgress: number;
}

export function Anglerfish({ scrollProgress }: AnglerfishProps) {
  const groupRef = useRef<THREE.Group>(null);
  const lanternRef = useRef<THREE.PointLight>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  // Load the new FBX model
  const fbx = useFBX("/models/poisson-abysse/anglerfish-new/source/anglerfish2.fbx");
  
  // Load textures (UDIM textures - use .1001 versions)
  const textures = useTexture({
    map: "/models/poisson-abysse/anglerfish-new/textures/BADY_BaseColor.<UDIM>.png",
    emissiveMap: "/models/poisson-abysse/anglerfish-new/textures/BADY_Emission.<UDIM>.png",
    normalMap: "/models/poisson-abysse/anglerfish-new/textures/BADY_Normal.<UDIM>.png",
  });

  // Apply dark deep-sea material
  useEffect(() => {
    if (fbx) {
      fbx.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({
            map: textures.map,
            emissiveMap: textures.emissiveMap,
            emissive: new THREE.Color("#2aff88"),
            emissiveIntensity: 0.3,
            normalMap: textures.normalMap,
            color: "#0a0a15",
            metalness: 0.2,
            roughness: 0.8,
            side: THREE.DoubleSide,
          });
        }
      });
    }
  }, [fbx, textures]);

  const current = useRef({
    x: 35,
    y: -140,
    z: -28,
    rotY: Math.PI * 0.8,
    opacity: 0,
  });

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    const t = clock.getElapsedTime();
    
    // Only visible in very deep sections (after 80% scroll)
    const isVisible = scrollProgress > 0.8;
    
    if (!isVisible) {
      groupRef.current.visible = false;
      current.current.opacity = 0;
      return;
    }
    
    groupRef.current.visible = true;
    
    // Fade in very slowly
    const fadeProgress = Math.min(1, (scrollProgress - 0.8) / 0.12);
    current.current.opacity = fadeProgress;
    
    // Slow, menacing swimming - appears swimming from right
    const progressInSection = Math.max(0, (scrollProgress - 0.8) / 0.18);
    const targetX = 35 - progressInSection * 65; // Right to left, slower
    const targetY = -140 + scrollProgress * 120;
    const targetZ = -28 + Math.sin(t * 0.25) * 2.5;
    
    // Smooth interpolation - slower, more realistic
    current.current.x += (targetX - current.current.x) * 0.008;
    current.current.y += (targetY - current.current.y) * 0.008;
    current.current.z += (targetZ - current.current.z) * 0.008;
    
    // Very subtle swimming motion - realistic for anglerfish
    const wobbleY = Math.sin(t * 0.4) * 0.5;
    const wobbleZ = Math.sin(t * 0.3) * 0.8;
    
    groupRef.current.position.set(
      current.current.x,
      current.current.y + wobbleY,
      current.current.z + wobbleZ
    );
    
    // Face left with very slow turn
    const targetRotY = Math.PI * 0.8 + Math.sin(t * 0.2) * 0.08;
    current.current.rotY += (targetRotY - current.current.rotY) * 0.01;
    groupRef.current.rotation.y = current.current.rotY;
    
    // Minimal body movement - anglerfish are slow swimmers
    groupRef.current.rotation.z = Math.sin(t * 0.35) * 0.02;
    groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.015;
    
    // Lantern flicker - more subtle, eerie
    if (lanternRef.current) {
      const baseIntensity = 2.5 * fadeProgress; // Fade with appearance
      const flicker = 0.8 + Math.sin(t * 3) * 0.12 + Math.sin(t * 8) * 0.08;
      lanternRef.current.intensity = baseIntensity * flicker;
    }
    
    // Glow sphere pulse - subtle
    if (glowRef.current) {
      const pulse = 0.85 + Math.sin(t * 2.2) * 0.15;
      glowRef.current.scale.setScalar(pulse);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.7 * fadeProgress;
    }
  });

  return (
    <group ref={groupRef} scale={0.018} position={[0, 0, 0]}>
      <primitive object={fbx} rotation={[0, 0, 0]} />
      
      {/* Main bioluminescent lantern - subtler */}
      <pointLight
        ref={lanternRef}
        position={[0, 12, 18]}
        color="#2dff77"
        intensity={2.5}
        distance={12}
        decay={2.2}
      />
      
      {/* Secondary soft glow */}
      <pointLight
        position={[0, 12, 18]}
        color="#00ff66"
        intensity={1}
        distance={8}
        decay={2}
      />
      
      {/* Visible glowing sphere */}
      <mesh ref={glowRef} position={[0, 12, 18]}>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial 
          color="#2dff77" 
          transparent 
          opacity={0.7}
          toneMapped={false}
        />
      </mesh>
      
      {/* Outer glow halo */}
      <mesh position={[0, 12, 18]}>
        <sphereGeometry args={[2.5, 16, 16]} />
        <meshBasicMaterial 
          color="#00ff55" 
          transparent 
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Light beam effect - narrower */}
      <spotLight
        position={[0, 12, 18]}
        angle={0.4}
        penumbra={1}
        intensity={1.5}
        color="#2dff77"
        distance={10}
        decay={2}
      />
    </group>
  );
}
