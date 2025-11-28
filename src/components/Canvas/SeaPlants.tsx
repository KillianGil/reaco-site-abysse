// components/Canvas/SeaPlants.tsx
"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface SeaPlantsProps {
  scrollProgress: number;
}

export function SeaPlants({ scrollProgress }: SeaPlantsProps) {
  const groupRef = useRef<THREE.Group>(null);

  // ✅ Plantes procédurales simples (cylinders + planes)
  const plants = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => {
      const side = i % 2 === 0 ? -1 : 1;
      return {
        x: side * (18 + Math.random() * 10), // Côtés gauche/droite
        y: -12 - Math.random() * 80, // Étalé en profondeur
        z: -35 - Math.random() * 20, // En arrière-plan
        height: 5 + Math.random() * 10,
        width: 1.2 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.4,
        color: i % 3 === 0 
          ? "#2a6a4a" // Vert foncé
          : i % 3 === 1 
          ? "#3a7a5a" // Vert moyen
          : "#1a5a3a", // Vert très foncé
      };
    });
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    // Balancement des plantes
    groupRef.current.children.forEach((child, i) => {
      const plant = plants[i];
      const sway = Math.sin(t * plant.speed + plant.phase) * 0.25;
      child.rotation.z = sway;
    });

    // Suivre le scroll
    groupRef.current.position.y = scrollProgress * 100;
  });

  return (
    <group ref={groupRef}>
      {plants.map((plant, i) => (
        <group key={i} position={[plant.x, plant.y, plant.z]}>
          {/* Tige principale */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.15, 0.22, plant.height, 6]} />
            <meshStandardMaterial
              color={plant.color}
              roughness={0.85}
              metalness={0.05}
            />
          </mesh>
          
          {/* Feuilles */}
          {[0, 0.3, 0.6, 0.9].map((offset, j) => (
            <mesh
              key={j}
              position={[0, plant.height * offset - plant.height / 2, 0]}
              rotation={[0, (j * Math.PI) / 2.2, Math.PI / 3.2]}
              castShadow
            >
              <planeGeometry args={[plant.width, plant.width * 2.5]} />
              <meshStandardMaterial
                color={plant.color}
                side={THREE.DoubleSide}
                roughness={0.9}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}