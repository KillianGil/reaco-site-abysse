"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export function Anglerfish({ scrollProgress }: { scrollProgress: number }) {
  const { scene } = useGLTF("/models/deep-sea-fish2.glb");
  const ref = useRef<THREE.Group>(null);
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    console.log("Anglerfish loaded, scrollProgress:", scrollProgress);
    
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        
        if (mesh.material) {
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          
          // Garde les matériaux originaux
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(mat => {
              const stdMat = mat as THREE.MeshStandardMaterial;
              if (stdMat.emissive) {
                stdMat.emissive = new THREE.Color("#000000");
                stdMat.emissiveIntensity = 0;
              }
            });
          } else {
            const stdMat = mesh.material as THREE.MeshStandardMaterial;
            if (stdMat.emissive) {
              stdMat.emissive = new THREE.Color("#000000");
              stdMat.emissiveIntensity = 0;
            }
          }
        }
      }
    });
  }, [clonedScene, scrollProgress]);

  useFrame((state) => {
    if (!ref.current) return;
    
    // ✅ Apparition plus tôt pour tester
    const isVisible = scrollProgress > 0.7;
    ref.current.visible = isVisible;
    
    if (isVisible) {
      const t = state.clock.elapsedTime;
      
      // Mouvement lent
      ref.current.position.y = -80 + Math.sin(t * 0.2) * 4;
      ref.current.position.x = Math.sin(t * 0.15) * 5;
      
      ref.current.rotation.z = Math.sin(t * 0.15) * 0.1;
      ref.current.rotation.y = Math.PI + Math.sin(t * 0.1) * 0.2; // Face à la caméra
      ref.current.rotation.x = Math.sin(t * 0.08) * 0.08;
      
      // Debug
      console.log("Anglerfish visible at:", ref.current.position);
    }
  });

  return (
    <group 
      ref={ref} 
      position={[0, -80, -15]} // ✅ Plus proche et centré
      rotation={[0, Math.PI, 0]} 
      visible={false}
    >
      {/* Lanterne bioluminescente INTENSE */}
      <pointLight 
        position={[0, 4, 6]}
        distance={50}
        intensity={20}
        color="#00ff88"
        decay={1.2}
      />
      
      {/* Orbe de la lanterne */}
      <mesh position={[0, 4, 6]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#00ffcc" />
      </mesh>
      
      {/* Halo lumineux */}
      <mesh position={[0, 4, 6]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial 
          color="#00ff88" 
          transparent 
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ✅ Taille moyenne */}
      <primitive object={clonedScene} scale={6} />
      
      {/* Yeux lumineux */}
      <pointLight position={[1.2, 0.8, 3]} intensity={8} color="#00ffaa" distance={25} />
      <pointLight position={[-1.2, 0.8, 3]} intensity={8} color="#00ffaa" distance={25} />
      
      {/* Lumière d'ambiance pour le corps */}
      <pointLight position={[0, 0, 0]} intensity={3} color="#001a1a" distance={20} />
    </group>
  );
}

useGLTF.preload("/models/deep-sea-fish2.glb");