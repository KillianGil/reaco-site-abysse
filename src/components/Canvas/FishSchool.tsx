"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useFBX, useTexture } from "@react-three/drei";
import * as THREE from "three";

interface FishSchoolProps {
  scrollProgress: number;
}

export function FishSchool({ scrollProgress }: FishSchoolProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Load all 3 fish models - useFBX handles memory better
  const emperorFbx = useFBX("/models/poisson/Emperor Angelfish/EmperorAngelfish_FBX.fbx");
  const clownFbx = useFBX("/models/poisson/ClownFish/source/anime1.fbx");
  const fish3Fbx = useFBX("/models/poisson/Fish-3/source/fish_1_5.fbx");
  
  // Load textures for each species
  const emperorTextures = useTexture({
    map: "/models/poisson/Emperor Angelfish/Emperor Angelfish A.png",
    normalMap: "/models/poisson/Emperor Angelfish/Emperor Angelfish N.png",
  });
  
  const clownTextures = useTexture({
    map: "/models/poisson/ClownFish/textures/lambert1_Base_Color.png",
    normalMap: "/models/poisson/ClownFish/textures/lambert1_Normal_OpenGL.png",
    metalnessMap: "/models/poisson/ClownFish/textures/lambert1_Metallic.png",
  });
  
  const fish3Textures = useTexture({
    map: "/models/poisson/Fish-3/textures/fish_1_diffuse.jpeg",
  });

  // Data for 15 fish total - 3 species mixed
  const fishDataRef = useRef([
    // SCHOOL A - Surface mix (Emperor + ClownFish)
    { model: 'emperor', x: 0, y: 8, z: -25, speed: 3.5, phase: 0, scale: 0.022, dir: -1, rotCorrection: 0 },
    { model: 'clown', x: 3, y: 9, z: -27, speed: 3.3, phase: 0.3, scale: 0.015, dir: -1, rotCorrection: 0 },
    { model: 'emperor', x: -2, y: 7, z: -23, speed: 3.7, phase: 0.6, scale: 0.019, dir: -1, rotCorrection: 0 },
    { model: 'clown', x: 5, y: 8.5, z: -29, speed: 3.1, phase: 0.9, scale: 0.014, dir: -1, rotCorrection: 0 },
    { model: 'emperor', x: -5, y: 9.5, z: -26, speed: 3.4, phase: 1.2, scale: 0.02, dir: -1, rotCorrection: 0 },
    
    // SCHOOL B - Medium depth (Fish-3 + Emperor) - Fish-3 side view with -90° rotation
    { model: 'fish3', x: -4, y: -18, z: -26, speed: 3.2, phase: 0, scale: 0.012, dir: 1, rotCorrection: -Math.PI / 2 },
    { model: 'emperor', x: 0, y: -16, z: -24, speed: 3.0, phase: 0.4, scale: 0.022, dir: 1, rotCorrection: 0 },
    { model: 'fish3', x: 4, y: -20, z: -28, speed: 3.4, phase: 0.8, scale: 0.01, dir: 1, rotCorrection: -Math.PI / 2 },
    { model: 'emperor', x: -6, y: -17, z: -22, speed: 3.1, phase: 1.2, scale: 0.018, dir: 1, rotCorrection: 0 },
    { model: 'fish3', x: 2, y: -19, z: -30, speed: 3.3, phase: 1.6, scale: 0.011, dir: 1, rotCorrection: -Math.PI / 2 },
    
    // SCHOOL C - Deep (All species mixed) - Fish-3 going left need +90° rotation
    { model: 'clown', x: 0, y: -45, z: -27, speed: 2.8, phase: 0, scale: 0.014, dir: -1, rotCorrection: 0 },
    { model: 'fish3', x: 4, y: -43, z: -25, speed: 2.6, phase: 0.5, scale: 0.01, dir: -1, rotCorrection: Math.PI / 2 },
    { model: 'emperor', x: -3, y: -47, z: -31, speed: 3.0, phase: 1.0, scale: 0.018, dir: -1, rotCorrection: 0 },
    { model: 'clown', x: 6, y: -44, z: -28, speed: 2.7, phase: 1.5, scale: 0.013, dir: -1, rotCorrection: 0 },
    { model: 'fish3', x: -5, y: -46, z: -26, speed: 2.9, phase: 2.0, scale: 0.009, dir: -1, rotCorrection: Math.PI / 2 },
  ]);

  // Store individual fish groups
  const fishGroupsRef = useRef<THREE.Group[]>([]);

// Dans useEffect de FishSchool.tsx - REMPLACER par :

useEffect(() => {
  if (!emperorFbx || !clownFbx || !fish3Fbx || !groupRef.current) return;

  // Nettoyer les anciens groupes
  fishGroupsRef.current.forEach(group => {
    groupRef.current?.remove(group);
    // ✅ IMPORTANT : Dispose des ressources
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
    
    if (fishData.model === 'emperor') {
      fbxModel = emperorFbx;
      material = new THREE.MeshStandardMaterial({
        map: emperorTextures.map,
        normalMap: emperorTextures.normalMap,
        metalness: 0.3,
        roughness: 0.5,
        side: THREE.DoubleSide,
      });
    } else if (fishData.model === 'clown') {
      fbxModel = clownFbx;
      material = new THREE.MeshStandardMaterial({
        map: clownTextures.map,
        normalMap: clownTextures.normalMap,
        metalnessMap: clownTextures.metalnessMap,
        metalness: 0.4,
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

    // ✅ NE PAS CLONER - Réutiliser les géométries
    fbxModel.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const instanceMesh = new THREE.Mesh(
          mesh.geometry, // ✅ Pas de clone !
          material       // ✅ Un seul matériau par espèce
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

}, [emperorFbx, clownFbx, fish3Fbx, emperorTextures, clownTextures, fish3Textures]);

  // Animate all fish
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    fishGroupsRef.current.forEach((fishGroup, i) => {
      const fish = fishDataRef.current[i];
      
      // Continuous swimming - loop across screen
      const swimProgress = (t * fish.speed + fish.phase * 12) % 90;
      const x = fish.dir > 0 
        ? -45 + swimProgress
        : 45 - swimProgress;

      // Y position with scroll
      const y = fish.y + scrollProgress * 120;
      
      // Natural swimming motion
      const wobbleY = Math.sin(t * 2.5 + fish.phase * 3) * 0.3;
      const wobbleZ = Math.sin(t * 2 + fish.phase * 2) * 0.4;

      fishGroup.position.set(x + fish.x, y + wobbleY, fish.z + wobbleZ);

      // Face direction based on swimming direction
      // For Fish-3: dir=1 means right (+90°), dir=-1 means left (-90°)
      // For others: dir=1 means right (0°), dir=-1 means left (180°)
      let baseRotationY;
      if (fish.rotCorrection !== 0) {
        // Fish-3 model
        baseRotationY = fish.dir > 0 ? Math.PI / 2 : -Math.PI / 2;
      } else {
        // Emperor and Clown models
        baseRotationY = fish.dir > 0 ? 0 : Math.PI;
      }
      
      // Body undulation - lateral
      const bodyUndulation = Math.sin(t * 8 + fish.phase * 4) * 0.08;
      fishGroup.rotation.y = baseRotationY + bodyUndulation;
      
      // Slight roll
      fishGroup.rotation.z = Math.sin(t * 4 + fish.phase * 2) * 0.04;
      fishGroup.rotation.x = Math.sin(t * 3 + fish.phase) * 0.03;
    });
  });

  return <group ref={groupRef} />;
}
