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
    y: -100,
    z: -28,
    rotY: Math.PI * 0.8,
    opacity: 0,
    cyclePhase: 0, // Track appearance/disappearance cycle
  });

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    const t = clock.getElapsedTime();
    
    // Only visible in deep sections (after 65% scroll)
    const isVisible = scrollProgress > 0.65;
    
    if (!isVisible) {
      groupRef.current.visible = false;
      current.current.opacity = 0;
      current.current.cyclePhase = 0;
      return;
    }
    
    // Natural appearance/disappearance cycle (every 20 seconds)
    const cycleTime = 20; // Full cycle duration
    const cycleProgress = (t % cycleTime) / cycleTime;
    
    // Phase 1: Swim from right (0-0.4) - visible
    // Phase 2: Fade out (0.4-0.5) - disappearing
    // Phase 3: Hidden (0.5-0.7) - not visible
    // Phase 4: Fade in from left (0.7-0.8) - appearing
    // Phase 5: Swim to right (0.8-1.0) - visible
    
    let targetOpacity = 0;
    let targetX = 0;
    let targetRotY = 0;
    
    if (cycleProgress < 0.4) {
      // Swimming from right to center
      const phase1Progress = cycleProgress / 0.4;
      targetX = 35 - phase1Progress * 40; // Right to center
      targetRotY = Math.PI; // Face left (180°)
      targetOpacity = 1;
    } else if (cycleProgress < 0.5) {
      // Fading out at center
      const fadeOutProgress = (cycleProgress - 0.4) / 0.1;
      targetX = -5;
      targetRotY = Math.PI;
      targetOpacity = 1 - fadeOutProgress;
    } else if (cycleProgress < 0.7) {
      // Hidden - swimming off screen
      groupRef.current.visible = false;
      return;
    } else if (cycleProgress < 0.8) {
      // Fading in from left
      const fadeInProgress = (cycleProgress - 0.7) / 0.1;
      targetX = -35;
      targetRotY = 0; // Face right (0°)
      targetOpacity = fadeInProgress;
    } else {
      // Swimming from left to center
      const phase5Progress = (cycleProgress - 0.8) / 0.2;
      targetX = -35 + phase5Progress * 40; // Left to center
      targetRotY = 0; // Face right (0°)
      targetOpacity = 1;
    }
    
    groupRef.current.visible = true;
    current.current.opacity = targetOpacity;
    
    const targetY = -100 + scrollProgress * 120;
    const targetZ = -28 + Math.sin(t * 0.2) * 2;
    
    // Smooth interpolation
    current.current.x += (targetX - current.current.x) * 0.015;
    current.current.y += (targetY - current.current.y) * 0.015;
    current.current.z += (targetZ - current.current.z) * 0.015;
    current.current.rotY += (targetRotY - current.current.rotY) * 0.01;
    
    // Minimal swimming motion - anglerfish almost hovers
    const wobbleY = Math.sin(t * 0.3) * 0.3;
    const wobbleZ = Math.sin(t * 0.25) * 0.5;
    
    groupRef.current.position.set(
      current.current.x,
      current.current.y + wobbleY,
      current.current.z + wobbleZ
    );
    
    // Rotation set by cycle phase
    groupRef.current.rotation.y = current.current.rotY + Math.sin(t * 0.15) * 0.05;
    
    // Very minimal body movement
    groupRef.current.rotation.z = Math.sin(t * 0.25) * 0.015;
    groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.01;
    
    // Very bright, eerie lantern
    if (lanternRef.current) {
      const baseIntensity = 10 * current.current.opacity; // Even brighter
      const flicker = 0.85 + Math.sin(t * 2.5) * 0.1 + Math.sin(t * 6) * 0.05;
      lanternRef.current.intensity = baseIntensity * flicker;
    }
    
    // Brighter glow sphere
    if (glowRef.current) {
      const pulse = 0.9 + Math.sin(t * 2) * 0.1;
      glowRef.current.scale.setScalar(pulse);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.95 * current.current.opacity;
    }
  });

  return (
    <group ref={groupRef} scale={0.022} position={[0, 0, 0]}>
      <primitive object={fbx} rotation={[0, 0, 0]} />
      
      {/* Main bioluminescent lantern - EXTREMELY bright and visible */}
      <pointLight
        ref={lanternRef}
        position={[0, 12, 18]}
        color="#3dff88"
        intensity={10}
        distance={20}
        decay={1.8}
      />
      
      {/* Secondary bright glow */}
      <pointLight
        position={[0, 12, 18]}
        color="#00ffaa"
        intensity={5}
        distance={15}
        decay={2}
      />
      
      {/* Very visible glowing sphere */}
      <mesh ref={glowRef} position={[0, 12, 18]}>
        <sphereGeometry args={[1.8, 16, 16]} />
        <meshBasicMaterial 
          color="#3dff88" 
          transparent 
          opacity={0.95}
          toneMapped={false}
        />
      </mesh>
      
      {/* Bright outer glow halo */}
      <mesh position={[0, 12, 18]}>
        <sphereGeometry args={[4, 16, 16]} />
        <meshBasicMaterial 
          color="#00ff77" 
          transparent 
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Very bright light beam effect */}
      <spotLight
        position={[0, 12, 18]}
        angle={0.5}
        penumbra={0.7}
        intensity={6}
        color="#3dff88"
        distance={18}
        decay={2}
      />
    </group>
  );
}
