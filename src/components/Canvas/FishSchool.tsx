"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useFBX, useTexture } from "@react-three/drei";
import * as THREE from "three";

interface FishSchoolProps {
  scrollProgress: number;
}

export function FishSchool({ scrollProgress }: FishSchoolProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  
  const emperorFbx = useFBX("/models/poisson/Emperor Angelfish/EmperorAngelfish_FBX.fbx");
  const fish3Fbx = useFBX("/models/poisson/Fish-3/source/fish_1_5.fbx");
  
  const emperorTextures = useTexture({
    map: "/models/poisson/Emperor Angelfish/Emperor Angelfish A.png",
    normalMap: "/models/poisson/Emperor Angelfish/Emperor Angelfish N.png",
  });
  
  const fish3Textures = useTexture({
    map: "/models/poisson/Fish-3/textures/fish_1_diffuse.jpeg",
  });

  // ✅ ENCORE MOINS DE POISSONS - 5 au total
  const fishDataRef = useRef([
    // Surface - 2 Emperor
    { model: 'emperor', x: -3, y: 8, z: -25, speed: 3.5, phase: 0, scale: 0.022, dir: -1, rotCorrection: 0 },
    { model: 'emperor', x: 3, y: 9, z: -27, speed: 3.3, phase: 0.3, scale: 0.019, dir: -1, rotCorrection: 0 },
    
    // Medium - 2 Fish3
    { model: 'fish3', x: -4, y: -18, z: -26, speed: 3.2, phase: 0, scale: 0.012, dir: 1, rotCorrection: -Math.PI / 2 },
    { model: 'fish3', x: 4, y: -20, z: -28, speed: 3.4, phase: 0.8, scale: 0.01, dir: 1, rotCorrection: -Math.PI / 2 },
    
    // Deep - 1 Emperor
    { model: 'emperor', x: 0, y: -45, z: -27, speed: 2.8, phase: 0, scale: 0.02, dir: -1, rotCorrection: 0 },
  ]);

  const fishGroupsRef = useRef<THREE.Group[]>([]);
  const emperorMaterial = useRef<THREE.Material>();
  const fish3Material = useRef<THREE.Material>();
  const lastScrollProgress = useRef(scrollProgress);

  // ✅ Détecter le scroll
  useEffect(() => {
    if (Math.abs(scrollProgress - lastScrollProgress.current) > 0.001) {
      setIsScrolling(true);
      lastScrollProgress.current = scrollProgress;
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150); // 150ms après la fin du scroll
    }
  }, [scrollProgress]);

  useEffect(() => {
    if (!emperorFbx || !fish3Fbx || !groupRef.current) return;

    if (!emperorMaterial.current) {
      emperorMaterial.current = new THREE.MeshStandardMaterial({
        map: emperorTextures.map,
        normalMap: emperorTextures.normalMap,
        metalness: 0.3,
        roughness: 0.5,
        side: THREE.DoubleSide,
      });
    }

    if (!fish3Material.current) {
      fish3Material.current = new THREE.MeshStandardMaterial({
        map: fish3Textures.map,
        metalness: 0.3,
        roughness: 0.6,
        side: THREE.DoubleSide,
      });
    }

    fishGroupsRef.current.forEach(group => {
      groupRef.current?.remove(group);
      group.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
        }
      });
    });
    fishGroupsRef.current = [];

    fishDataRef.current.forEach((fishData) => {
      const fishGroup = new THREE.Group();
      
      const fbxModel = fishData.model === 'emperor' ? emperorFbx : fish3Fbx;
      const material = fishData.model === 'emperor' ? emperorMaterial.current! : fish3Material.current!;

      fbxModel.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const instanceMesh = new THREE.Mesh(mesh.geometry, material);
          instanceMesh.position.copy(mesh.position);
          instanceMesh.rotation.copy(mesh.rotation);
          instanceMesh.scale.copy(mesh.scale);
          
          // ✅ Désactiver frustum culling
          instanceMesh.frustumCulled = false;
          
          fishGroup.add(instanceMesh);
        }
      });

      fishGroup.scale.set(fishData.scale, fishData.scale, fishData.scale);
      fishGroup.frustumCulled = false;
      groupRef.current?.add(fishGroup);
      fishGroupsRef.current.push(fishGroup);
    });

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };

  }, [emperorFbx, fish3Fbx, emperorTextures, fish3Textures]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    const t = clock.getElapsedTime();

    // ✅ ANIMATIONS RÉDUITES PENDANT LE SCROLL
    fishGroupsRef.current.forEach((fishGroup, i) => {
      const fish = fishDataRef.current[i];
      
      // Position Y suit toujours le scroll
      const y = fish.y + scrollProgress * 120;
      
      if (isScrolling) {
        // ✅ PENDANT LE SCROLL : positions fixes, pas d'animation
        fishGroup.position.set(fish.x, y, fish.z);
        
        // Rotation simple
        const baseRotationY = fish.rotCorrection !== 0 
          ? (fish.dir > 0 ? Math.PI / 2 : -Math.PI / 2)
          : (fish.dir > 0 ? 0 : Math.PI);
        
        fishGroup.rotation.set(0, baseRotationY, 0);
      } else {
        // ✅ QUAND ON NE SCROLL PAS : animations complètes
        const swimProgress = (t * fish.speed + fish.phase * 12) % 90;
        const x = fish.dir > 0 
          ? -45 + swimProgress
          : 45 - swimProgress;
        
        const wobbleY = Math.sin(t * 2.5 + fish.phase * 3) * 0.3;
        const wobbleZ = Math.sin(t * 2 + fish.phase * 2) * 0.4;

        fishGroup.position.set(x + fish.x, y + wobbleY, fish.z + wobbleZ);

        let baseRotationY;
        if (fish.rotCorrection !== 0) {
          baseRotationY = fish.dir > 0 ? Math.PI / 2 : -Math.PI / 2;
        } else {
          baseRotationY = fish.dir > 0 ? 0 : Math.PI;
        }
        
        const bodyUndulation = Math.sin(t * 8 + fish.phase * 4) * 0.08;
        fishGroup.rotation.y = baseRotationY + bodyUndulation;
        fishGroup.rotation.z = Math.sin(t * 4 + fish.phase * 2) * 0.04;
        fishGroup.rotation.x = Math.sin(t * 3 + fish.phase) * 0.03;
      }
    });
  });

  return <group ref={groupRef} />;
}