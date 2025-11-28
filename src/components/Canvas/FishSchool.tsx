"use client";

import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useFBX, useTexture } from "@react-three/drei";
import * as THREE from "three";

interface FishSchoolProps {
  scrollProgress: number;
}

export function FishSchool({ scrollProgress }: FishSchoolProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // ✅ Charger tous les modèles FBX
  const emperorFbx = useFBX("/models/poisson/Emperor Angelfish/EmperorAngelfish_FBX.fbx");
  const fish3Fbx = useFBX("/models/poisson/Fish-3/source/fish_1_5.fbx");
  
  // ✅ Charger les textures
  const emperorTextures = useTexture({
    map: "/models/poisson/Emperor Angelfish/Emperor-Angelfish-A.png",
    normalMap: "/models/poisson/Emperor Angelfish/Emperor-Angelfish-N.png",
  });
  
  const fish3Textures = useTexture({
    map: "/models/poisson/Fish-3/textures/fish_1_diffuse.jpeg",
  });

  // ✅ Configuration des poissons (position, type, comportement)
  const fishDataRef = useRef([
    // BANC 1 - Surface (Emperor Angelfish)
    { model: 'emperor', x: 0, y: 8, z: -25, speed: 3.5, phase: 0, scale: 0.022, dir: -1 },
    { model: 'emperor', x: -2, y: 7, z: -23, speed: 3.7, phase: 0.6, scale: 0.019, dir: -1 },
    { model: 'emperor', x: 5, y: 8.5, z: -29, speed: 3.1, phase: 0.9, scale: 0.014, dir: -1 },
    { model: 'emperor', x: -5, y: 9.5, z: -26, speed: 3.4, phase: 1.2, scale: 0.02, dir: -1 },
    
    // BANC 2 - Profondeur moyenne (Mix)
    { model: 'fish3', x: -4, y: -18, z: -26, speed: 3.2, phase: 0, scale: 0.012, dir: 1 },
    { model: 'emperor', x: 0, y: -16, z: -24, speed: 3.0, phase: 0.4, scale: 0.022, dir: 1 },
    { model: 'fish3', x: 4, y: -20, z: -28, speed: 3.4, phase: 0.8, scale: 0.01, dir: 1 },
    { model: 'emperor', x: -6, y: -17, z: -22, speed: 3.1, phase: 1.2, scale: 0.018, dir: 1 },
    { model: 'fish3', x: 2, y: -19, z: -30, speed: 3.3, phase: 1.6, scale: 0.011, dir: 1 },
    
    // BANC 3 - Profondeur (Mix)
    { model: 'emperor', x: 0, y: -45, z: -27, speed: 2.8, phase: 0, scale: 0.014, dir: -1 },
    { model: 'fish3', x: 4, y: -43, z: -25, speed: 2.6, phase: 0.5, scale: 0.01, dir: -1 },
    { model: 'emperor', x: -3, y: -47, z: -31, speed: 3.0, phase: 1.0, scale: 0.018, dir: -1 },
    { model: 'fish3', x: -5, y: -46, z: -26, speed: 2.9, phase: 2.0, scale: 0.009, dir: -1 },
  ]);

  // ✅ Stocker les groupes de poissons
  const fishGroupsRef = useRef<THREE.Group[]>([]);

  useEffect(() => {
    if (!emperorFbx || !fish3Fbx || !groupRef.current) return;

    // Nettoyer les anciens groupes
    fishGroupsRef.current.forEach(group => {
      groupRef.current?.remove(group);
      group.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach(m => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    });
    fishGroupsRef.current = [];

    fishDataRef.current.forEach((fishData) => {
      const fishGroup = new THREE.Group();
      
      let fbxModel: THREE.Group;
      let material: THREE.Material;
      
      // ✅ Choisir le bon modèle et matériau
      if (fishData.model === 'emperor') {
        fbxModel = emperorFbx;
        material = new THREE.MeshStandardMaterial({
          map: emperorTextures.map,
          normalMap: emperorTextures.normalMap,
          metalness: 0.3,
          roughness: 0.5,
          side: THREE.DoubleSide,
        });
      } else {
        fbxModel = fish3Fbx;
        material = new THREE.MeshStandardMaterial({
          map: fish3Textures.map,
          metalness: 0.3,
          roughness: 0.6,
          side: THREE.DoubleSide,
        });
      }

      // ✅ Créer les instances (pas de clone pour économiser la mémoire)
      fbxModel.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const instanceMesh = new THREE.Mesh(
            mesh.geometry, // Réutiliser la géométrie
            material
          );
          instanceMesh.position.copy(mesh.position);
          instanceMesh.rotation.copy(mesh.rotation);
          instanceMesh.scale.copy(mesh.scale);
          fishGroup.add(instanceMesh);
        }
      });

      fishGroup.scale.set(fishData.scale, fishData.scale, fishData.scale);
      groupRef.current?.add(fishGroup);
      fishGroupsRef.current.push(fishGroup);
    });

  }, [emperorFbx, fish3Fbx, emperorTextures, fish3Textures]);

  // ✅ Animation réaliste
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    fishGroupsRef.current.forEach((fishGroup, i) => {
      const fish = fishDataRef.current[i];
      
      // Mouvement continu (boucle)
      const swimProgress = (t * fish.speed + fish.phase * 12) % 90;
      const x = fish.dir > 0 
        ? -45 + swimProgress
        : 45 - swimProgress;

      // Position Y avec scroll
      const y = fish.y + scrollProgress * 120;
      
      // ✅ Mouvement naturel de nage
      const wobbleY = Math.sin(t * 2.5 + fish.phase * 3) * 0.3;
      const wobbleZ = Math.sin(t * 2 + fish.phase * 2) * 0.4;

      fishGroup.position.set(x + fish.x, y + wobbleY, fish.z + wobbleZ);

      // ✅ Rotation selon la direction
      let baseRotationY;
      if (fish.model === 'fish3') {
        baseRotationY = fish.dir > 0 ? Math.PI / 2 : -Math.PI / 2;
      } else {
        baseRotationY = fish.dir > 0 ? 0 : Math.PI;
      }
      
      // ✅ Ondulation du corps
      const bodyUndulation = Math.sin(t * 8 + fish.phase * 4) * 0.08;
      fishGroup.rotation.y = baseRotationY + bodyUndulation;
      
      // ✅ Roll et pitch subtils
      fishGroup.rotation.z = Math.sin(t * 4 + fish.phase * 2) * 0.04;
      fishGroup.rotation.x = Math.sin(t * 3 + fish.phase) * 0.03;
    });
  });

  return <group ref={groupRef} />;
}