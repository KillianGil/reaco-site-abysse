"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useFBX, useTexture } from "@react-three/drei";
import * as THREE from "three";

export function Anglerfish({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const lanternRef = useRef<THREE.PointLight>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  // Load FBX from the correct path
  const fbx = useFBX("/models/poisson/anglerfish-new/source/anglerfish2.fbx");
  
  // Load textures from the correct path
  const textures = useTexture({
    map: "/models/poisson/anglerfish-new/textures/BADY_BaseColor.<UDIM>.png",
    emissiveMap: "/models/poisson/anglerfish-new/textures/BADY_Emission.<UDIM>.png",
    normalMap: "/models/poisson/anglerfish-new/textures/BADY_Normal.<UDIM>.png",
  });

  // Apply dark deep-sea material with textures
  useEffect(() => {
    if (fbx && textures) {
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
    cyclePhase: 0,
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
    const cycleTime = 20;
    const cycleProgress = (t % cycleTime) / cycleTime;
    
    let targetOpacity = 0;
    let targetX = 0;
    let targetRotY = 0;
    
    if (cycleProgress < 0.4) {
      const phase1Progress = cycleProgress / 0.4;
      targetX = 35 - phase1Progress * 40;
      targetRotY = Math.PI;
      targetOpacity = 1;
    } else if (cycleProgress < 0.5) {
      const fadeOutProgress = (cycleProgress - 0.4) / 0.1;
      targetX = -5;
      targetRotY = Math.PI;
      targetOpacity = 1 - fadeOutProgress;
    } else if (cycleProgress < 0.7) {
      groupRef.current.visible = false;
      return;
    } else if (cycleProgress < 0.8) {
      const fadeInProgress = (cycleProgress - 0.7) / 0.1;
      targetX = -35;
      targetRotY = 0;
      targetOpacity = fadeInProgress;
    } else {
      const phase5Progress = (cycleProgress - 0.8) / 0.2;
      targetX = -35 + phase5Progress * 40;
      targetRotY = 0;
      targetOpacity = 1;
    }
    
    groupRef.current.visible = true;
    current.current.opacity = targetOpacity;
    
    const targetY = -100 + scrollProgress * 120;
    const targetZ = -28 + Math.sin(t * 0.2) * 2;
    
    current.current.x += (targetX - current.current.x) * 0.015;
    current.current.y += (targetY - current.current.y) * 0.015;
    current.current.z += (targetZ - current.current.z) * 0.015;
    current.current.rotY += (targetRotY - current.current.rotY) * 0.01;
    
    const wobbleY = Math.sin(t * 0.3) * 0.3;
    const wobbleZ = Math.sin(t * 0.25) * 0.5;
    
    groupRef.current.position.set(
      current.current.x,
      current.current.y + wobbleY,
      current.current.z + wobbleZ
    );
    
    groupRef.current.rotation.y = current.current.rotY + Math.sin(t * 0.15) * 0.05;
    groupRef.current.rotation.z = Math.sin(t * 0.25) * 0.015;
    groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.01;
    
    if (lanternRef.current) {
      const baseIntensity = 10 * current.current.opacity;
      const flicker = 0.85 + Math.sin(t * 2.5) * 0.1 + Math.sin(t * 6) * 0.05;
      lanternRef.current.intensity = baseIntensity * flicker;
    }
    
    if (glowRef.current) {
      const pulse = 0.9 + Math.sin(t * 2) * 0.1;
      glowRef.current.scale.setScalar(pulse);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.95 * current.current.opacity;
    }
  });

  if (!fbx || !textures) {
    return null;
  }

  return (
    <group ref={groupRef} scale={0.022} position={[0, 0, 0]}>
      <primitive object={fbx} rotation={[0, 0, 0]} />
      
      {/* Main bioluminescent lantern */}
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
      
      {/* Visible glowing sphere */}
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