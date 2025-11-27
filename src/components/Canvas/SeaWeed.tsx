"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";

import * as THREE from "three";

interface SeaweedProps {
  scrollProgress: number;
}

export function Seaweed({ scrollProgress }: SeaweedProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Charge ton modèle 3D d'algues ici
  // const { scene } = useGLTF("/models/seaweed/seaweed.glb");
  
  useEffect(() => {
    // Configuration du matériau si nécessaire
    // scene.traverse((child) => {
    //   if ((child as THREE.Mesh).isMesh) {
    //     const mesh = child as THREE.Mesh;
    //     // Ajuste les matériaux
    //   }
    // });
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    
    // Animation de balancement subtil
    groupRef.current.rotation.z = Math.sin(t * 0.5) * 0.05;
    
    // Suit le scroll
    groupRef.current.position.y = -50 + scrollProgress * 120;
  });

  return (
    <group ref={groupRef}>
      {/* Une fois que tu as le modèle, décommente : */}
      {/* <primitive object={scene.clone()} scale={0.5} /> */}
      
      {/* Placeholder temporaire */}
      <mesh position={[15, 0, -25]}>
        <cylinderGeometry args={[0.1, 0.15, 8, 8]} />
        <meshStandardMaterial color="#2a5a4a" />
      </mesh>
    </group>
  );
}

// useGLTF.preload("/models/seaweed/seaweed.glb");