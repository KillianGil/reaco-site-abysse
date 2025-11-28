"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function OceanFloor({ scrollProgress }: { scrollProgress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // ✅ Géométrie procédurale du fond marin
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(300, 300, 150, 150);
    const posArray = geo.attributes.position.array as Float32Array;
    
    // Ajouter du relief aléatoire
    for (let i = 0; i < posArray.length; i += 3) {
      const x = posArray[i];
      const y = posArray[i + 1];
      
      // Bruit procédural
      const noise1 = Math.sin(x * 0.02) * Math.cos(y * 0.02) * 3;
      const noise2 = Math.sin(x * 0.05 + y * 0.03) * 1.5;
      const noise3 = Math.sin(x * 0.1) * Math.cos(y * 0.08) * 0.8;
      
      posArray[i + 2] = noise1 + noise2 + noise3;
    }
    
    geo.computeVertexNormals();
    return geo;
  }, []);

  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#1a3a4a",
      roughness: 0.95,
      metalness: 0.1,
      flatShading: false,
    });
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;
    
    // Positionner le fond selon le scroll
    const targetY = -120 + scrollProgress * 150;
    meshRef.current.position.y = targetY;
    
    // Visibilité uniquement en profondeur
    meshRef.current.visible = scrollProgress > 0.6;
  });

  return (
    <mesh 
      ref={meshRef}
      geometry={geometry}
      material={material}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
      castShadow
    />
  );
}