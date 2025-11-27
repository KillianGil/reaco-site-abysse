"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SeaPlantsProps {
  scrollProgress: number;
}

export function SeaPlants({ scrollProgress }: SeaPlantsProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Plantes sur les côtés, GRANDES et VISIBLES
  const plants = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => {
      const side = i % 2 === 0 ? -1 : 1; // Alternance gauche/droite
      return {
        x: side * (15 + Math.random() * 8), // Entre 15 et 23 de chaque côté
        y: -10 - Math.random() * 100, // Étalé sur toute la profondeur
        z: -30 - Math.random() * 15, // En arrière-plan
        height: 4 + Math.random() * 8, // GRANDES plantes
        width: 0.8 + Math.random() * 1.2,
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.3,
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

    groupRef.current.children.forEach((child, i) => {
      const plant = plants[i];
      const sway = Math.sin(t * plant.speed + plant.phase) * 0.2;
      child.rotation.z = sway;
    });

    groupRef.current.position.y = scrollProgress * 110;
  });

  return (
    <group ref={groupRef}>
      {plants.map((plant, i) => (
        <group key={i} position={[plant.x, plant.y, plant.z]}>
          {/* Tige principale */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.12, 0.18, plant.height, 6]} />
            <meshStandardMaterial
              color={plant.color}
              roughness={0.8}
              metalness={0.1}
            />
          </mesh>
          
          {/* Grandes feuilles */}
          {[0, 0.25, 0.5, 0.75, 1].map((offset, j) => (
            <mesh
              key={j}
              position={[0, plant.height * offset - plant.height / 2, 0]}
              rotation={[0, (j * Math.PI) / 2.5, Math.PI / 3.5]}
              castShadow
            >
              <planeGeometry args={[plant.width, plant.width * 2]} />
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