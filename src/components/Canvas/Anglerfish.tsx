"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export function Anglerfish({ scrollProgress }: { scrollProgress: number }) {
  // Chargement propre du GLB
  const { scene } = useGLTF("/models/anglerfish.glb");
  const ref = useRef<THREE.Group>(null);

  // Configuration du matériau (une seule fois)
  useMemo(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = new THREE.MeshStandardMaterial({
          color: "#0a0a15",
          metalness: 0.2,
          roughness: 0.8,
          emissive: "#2aff88",
          emissiveIntensity: 0.5,
        });
      }
    });
  }, [scene]);

  useFrame((state) => {
    if (!ref.current) return;
    
    // Apparition progressive (Seulement au fond > 75% du scroll)
    const isVisible = scrollProgress > 0.75;
    ref.current.visible = isVisible;
    
    if (isVisible) {
      // Mouvement lent et menaçant
      ref.current.position.y = -95 + Math.sin(state.clock.elapsedTime * 0.3) * 2;
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
      // Rotation légère vers nous
      ref.current.rotation.y = -0.2 + Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <group 
      ref={ref} 
      position={[0, -95, -8]} // Tout au fond
      rotation={[0, 0, 0]} 
      visible={false}
    >
      {/* Lumière verte intense pour la lanterne */}
      <pointLight 
        position={[0, 8, 15]} 
        distance={35} 
        intensity={8} 
        color="#00ff88" 
        decay={2}
      />
      
      {/* Échelle massive pour l'effet monstre */}
      <primitive 
        object={scene} 
        scale={25} 
      />
    </group>
  );
}