// components/Canvas/SeaWeed.tsx
"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface SeaweedProps {
  scrollProgress: number;
}

export function Seaweed({ scrollProgress }: SeaweedProps) {
  const groupRef = useRef<THREE.Group>(null);

  const seaweed = useGLTF("/models/seaweed2.glb");

  // ✅ Réduction à 80 pour les performances (au lieu de 160)
  const seaweedData = useRef(
    Array.from({ length: 80 }, () => {
      const angle = Math.random() * Math.PI * 2;
      // Rayon légèrement augmenté pour compenser le nombre réduit
      const radius = 8 + Math.random() * 50;

      // Distribution plus large sur l'axe X, avec emphase sur la gauche (-X)
      // Range: -50 à +30 (plus de plantes à gauche)
      const xBase = (Math.random() - 0.65) * 80;

      return {
        x: xBase,
        y: -118 - Math.random() * 7,
        z: -30 + Math.sin(angle) * radius * 0.6,
        scale: 6 + Math.random() * 6, // Plus grandes pour remplir l'espace
        rotation: Math.random() * Math.PI * 2,
        speed: 0.2 + Math.random() * 0.4,
        swayAmount: 0.1 + Math.random() * 0.15,
      };
    })
  );

  const seaweedGroupsRef = useRef<THREE.Group[]>([]);

  useEffect(() => {
    if (!groupRef.current) return;

    seaweedGroupsRef.current.forEach(group => {
      groupRef.current?.remove(group);
    });
    seaweedGroupsRef.current = [];

    seaweedData.current.forEach((data) => {
      const seaweedGroup = new THREE.Group();
      const clonedScene = seaweed.scene.clone();

      clonedScene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;

          if (mesh.material) {
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach(mat => {
                (mat as THREE.MeshStandardMaterial).emissive = new THREE.Color("#004a2a");
                (mat as THREE.MeshStandardMaterial).emissiveIntensity = 0.3;
              });
            } else {
              (mesh.material as THREE.MeshStandardMaterial).emissive = new THREE.Color("#004a2a");
              (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.3;
            }
          }
        }
      });

      seaweedGroup.add(clonedScene);
      seaweedGroup.position.set(data.x, data.y, data.z);
      seaweedGroup.scale.setScalar(data.scale);
      seaweedGroup.rotation.y = data.rotation;

      groupRef.current?.add(seaweedGroup);
      seaweedGroupsRef.current.push(seaweedGroup);
    });

  }, [seaweed]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    seaweedGroupsRef.current.forEach((group, i) => {
      const data = seaweedData.current[i];
      const sway = Math.sin(t * data.speed + i * 13) * data.swayAmount;
      const twist = Math.sin(t * data.speed * 0.7 + i * 7) * 0.05;

      group.rotation.z = sway;
      group.rotation.x = twist;
    });

    groupRef.current.position.y = scrollProgress * 100;
    // Apparition un peu plus tardive pour économiser des ressources en haut
    groupRef.current.visible = scrollProgress > 0.8;
  });

  return (
    <>
      <group ref={groupRef} />
      {scrollProgress > 0.8 && (
        <>
          <pointLight
            position={[0, -110 + scrollProgress * 100, -30]}
            intensity={50}
            color="#5aca9a"
            distance={70}
          />
          {Array.from({ length: 8 }, (_, i) => { // Un peu moins de lumières aussi
            const angle = (i / 8) * Math.PI * 2;
            const radius = 25;
            return (
              <pointLight
                key={i}
                position={[
                  Math.cos(angle) * radius,
                  -115 + scrollProgress * 100,
                  -30 + Math.sin(angle) * radius * 0.5
                ]}
                intensity={30}
                color="#4aba8a"
                distance={50}
              />
            );
          })}
          <ambientLight intensity={0.3} color="#2a6a5a" />
        </>
      )}
    </>
  );
}

useGLTF.preload("/models/seaweed2.glb");