// components/Canvas/FishSchool.tsx
"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useFBX, useTexture } from "@react-three/drei";
import * as THREE from "three";

interface FishSchoolProps {
  scrollProgress: number;
}

interface FishData {
  model: string;
  baseX: number;
  baseY: number;
  baseZ: number;
  offsetX: number;
  offsetY: number;
  offsetZ: number;
  speed: number;
  phase: number;
  scale: number;
  pathType: string;
}

export function FishSchool({ scrollProgress }: FishSchoolProps) {
  const groupRef = useRef<THREE.Group>(null);

  const emperorFbx = useFBX("/models/poisson/Emperor Angelfish/EmperorAngelfish_FBX.fbx");
  const fish3Fbx = useFBX("/models/poisson/Fish-3/source/fish_1_5.fbx");

  const emperorTextures = useTexture({
    map: "/models/poisson/Emperor Angelfish/Emperor-Angelfish-A.png",
    normalMap: "/models/poisson/Emperor Angelfish/Emperor-Angelfish-N.png",
  });

  const fish3Textures = useTexture({
    map: "/models/poisson/Fish-3/textures/fish_1_diffuse.jpeg",
  });

  // ✅ BANCS PLUS NATURELS avec chemins courbes
  // Vitesse augmentée (~1.2x) et Taille augmentée (~1.2x)
  // MIX DES ESPÈCES et ESPACEMENT AUGMENTÉ
  const fishDataRef = useRef([
    // BANC 1 - Surface (formation en V - Mixte)
    { model: 'emperor', baseX: 0, baseY: 8, baseZ: -25, offsetX: 0, offsetY: 0, offsetZ: 0, speed: 4.2, phase: 0, scale: 0.016, pathType: 'curve-left' },
    { model: 'fish3', baseX: 0, baseY: 8, baseZ: -25, offsetX: -4, offsetY: -1, offsetZ: -2, speed: 4.3, phase: 0.2, scale: 0.005, pathType: 'curve-left' },
    { model: 'emperor', baseX: 0, baseY: 8, baseZ: -25, offsetX: 4, offsetY: -1, offsetZ: -2, speed: 4.1, phase: 0.1, scale: 0.016, pathType: 'curve-left' },
    { model: 'fish3', baseX: 0, baseY: 8, baseZ: -25, offsetX: -8, offsetY: -2, offsetZ: -4, speed: 4.4, phase: 0.3, scale: 0.005, pathType: 'curve-left' },
    { model: 'fish3', baseX: 0, baseY: 8, baseZ: -25, offsetX: 8, offsetY: -2, offsetZ: -4, speed: 4.0, phase: 0.15, scale: 0.005, pathType: 'curve-left' },
    { model: 'emperor', baseX: 0, baseY: 8, baseZ: -25, offsetX: -12, offsetY: -3, offsetZ: -6, speed: 4.2, phase: 0.4, scale: 0.015, pathType: 'curve-left' },
    { model: 'emperor', baseX: 0, baseY: 8, baseZ: -25, offsetX: 12, offsetY: -3, offsetZ: -6, speed: 4.3, phase: 0.25, scale: 0.015, pathType: 'curve-left' },

    // BANC 2 - Profondeur moyenne (formation serrée - Mixte)
    { model: 'fish3', baseX: -4, baseY: -18, baseZ: -26, offsetX: 0, offsetY: 0, offsetZ: 0, speed: 3.8, phase: 0, scale: 0.005, pathType: 'curve-right' },
    { model: 'emperor', baseX: -4, baseY: -18, baseZ: -26, offsetX: 3, offsetY: 1, offsetZ: -1, speed: 3.7, phase: 0.1, scale: 0.016, pathType: 'curve-right' },
    { model: 'fish3', baseX: -4, baseY: -18, baseZ: -26, offsetX: -3, offsetY: 1, offsetZ: -1, speed: 4.0, phase: 0.15, scale: 0.005, pathType: 'curve-right' },
    { model: 'emperor', baseX: -4, baseY: -18, baseZ: -26, offsetX: 6, offsetY: 2, offsetZ: -2, speed: 3.6, phase: 0.2, scale: 0.015, pathType: 'curve-right' },
    { model: 'fish3', baseX: -4, baseY: -18, baseZ: -26, offsetX: -6, offsetY: 2, offsetZ: -2, speed: 4.1, phase: 0.25, scale: 0.005, pathType: 'curve-right' },
    { model: 'emperor', baseX: -4, baseY: -18, baseZ: -26, offsetX: 9, offsetY: 3, offsetZ: -3, speed: 3.7, phase: 0.3, scale: 0.015, pathType: 'curve-right' },
    { model: 'fish3', baseX: -4, baseY: -18, baseZ: -26, offsetX: -9, offsetY: 3, offsetZ: -3, speed: 3.8, phase: 0.35, scale: 0.005, pathType: 'curve-right' },

    // BANC 3 - Profondeur (formation dispersée - Mixte)
    { model: 'emperor', baseX: 0, baseY: -45, baseZ: -27, offsetX: 0, offsetY: 0, offsetZ: 0, speed: 3.4, phase: 0, scale: 0.016, pathType: 'wave' },
    { model: 'fish3', baseX: 0, baseY: -45, baseZ: -27, offsetX: 6, offsetY: 2, offsetZ: -2, speed: 3.2, phase: 0.2, scale: 0.005, pathType: 'wave' },
    { model: 'emperor', baseX: 0, baseY: -45, baseZ: -27, offsetX: -6, offsetY: 2, offsetZ: -2, speed: 3.5, phase: 0.15, scale: 0.015, pathType: 'wave' },
    { model: 'fish3', baseX: 0, baseY: -45, baseZ: -27, offsetX: 10, offsetY: 4, offsetZ: -4, speed: 3.1, phase: 0.3, scale: 0.005, pathType: 'wave' },
    { model: 'emperor', baseX: 0, baseY: -45, baseZ: -27, offsetX: -10, offsetY: 4, offsetZ: -4, speed: 3.6, phase: 0.25, scale: 0.015, pathType: 'wave' },

    // ✅ NOUVEAUX BANCS POUR LA PROFONDEUR (-80 à -150)

    // BANC 4 - Zone sombre (-80) - Mixte
    { model: 'fish3', baseX: 10, baseY: -80, baseZ: -30, offsetX: 0, offsetY: 0, offsetZ: 0, speed: 3.0, phase: 0, scale: 0.005, pathType: 'curve-left' },
    { model: 'emperor', baseX: 10, baseY: -80, baseZ: -30, offsetX: -3, offsetY: 1, offsetZ: -1, speed: 3.1, phase: 0.1, scale: 0.016, pathType: 'curve-left' },
    { model: 'fish3', baseX: 10, baseY: -80, baseZ: -30, offsetX: 3, offsetY: -1, offsetZ: -1, speed: 2.9, phase: 0.2, scale: 0.005, pathType: 'curve-left' },
    { model: 'emperor', baseX: 10, baseY: -80, baseZ: -30, offsetX: -6, offsetY: 2, offsetZ: -2, speed: 3.0, phase: 0.3, scale: 0.015, pathType: 'curve-left' },

    // BANC 5 - Abysses (-120) - Mixte
    { model: 'emperor', baseX: -15, baseY: -120, baseZ: -35, offsetX: 0, offsetY: 0, offsetZ: 0, speed: 2.4, phase: 0, scale: 0.017, pathType: 'wave' },
    { model: 'fish3', baseX: -15, baseY: -120, baseZ: -35, offsetX: 4, offsetY: 2, offsetZ: -2, speed: 2.5, phase: 0.1, scale: 0.006, pathType: 'wave' },
    { model: 'emperor', baseX: -15, baseY: -120, baseZ: -35, offsetX: -4, offsetY: -2, offsetZ: -2, speed: 2.3, phase: 0.2, scale: 0.016, pathType: 'wave' },

    // BANC 6 - Fond marin (-160) - Mixte
    { model: 'fish3', baseX: 0, baseY: -160, baseZ: -25, offsetX: 0, offsetY: 0, offsetZ: 0, speed: 2.2, phase: 0, scale: 0.006, pathType: 'curve-right' },
    { model: 'emperor', baseX: 0, baseY: -160, baseZ: -25, offsetX: 5, offsetY: 0, offsetZ: -1, speed: 2.3, phase: 0.1, scale: 0.016, pathType: 'curve-right' },
    { model: 'fish3', baseX: 0, baseY: -160, baseZ: -25, offsetX: -5, offsetY: 0, offsetZ: -1, speed: 2.0, phase: 0.2, scale: 0.006, pathType: 'curve-right' },
    { model: 'emperor', baseX: 0, baseY: -160, baseZ: -25, offsetX: 9, offsetY: 1, offsetZ: -2, speed: 2.2, phase: 0.3, scale: 0.015, pathType: 'curve-right' },
    { model: 'fish3', baseX: 0, baseY: -160, baseZ: -25, offsetX: -9, offsetY: 1, offsetZ: -2, speed: 2.2, phase: 0.4, scale: 0.006, pathType: 'curve-right' },
  ]);

  const fishGroupsRef = useRef<THREE.Group[]>([]);

  // ✅ Calculer position avec chemin courbe
  const calculateFishPosition = (fish: FishData, t: number) => {
    // On augmente la plage (120 au lieu de 90) pour éviter les "sauts" visibles aux bords
    const swimProgress = (t * fish.speed + fish.phase * 12) % 120;

    let x, wobbleY, wobbleZ;

    // On centre le mouvement sur 0 (de -60 à +60)
    const centeredProgress = swimProgress - 60;

    // CORRECTION MOUVEMENT: On réduit drastiquement l'amplitude des courbes
    // pour que le mouvement soit plus linéaire et constant, évitant l'effet de "freinage"

    if (fish.pathType === 'curve-left') {
      // Courbe vers la gauche (très légère)
      const curve = Math.sin(centeredProgress * 0.05) * 3; // Amplitude réduite (6 -> 3)
      x = centeredProgress + curve;
      wobbleY = Math.sin(t * 2.5 + fish.phase * 3) * 0.4 + Math.sin(centeredProgress * 0.05) * 2;
      wobbleZ = Math.sin(t * 2 + fish.phase * 2) * 0.5;
    } else if (fish.pathType === 'curve-right') {
      // Courbe vers la droite (très légère)
      const curve = Math.sin(centeredProgress * 0.05) * -3; // Amplitude réduite (6 -> 3)
      x = -centeredProgress + curve;
      wobbleY = Math.sin(t * 2.3 + fish.phase * 3) * 0.4 + Math.sin(centeredProgress * 0.05) * 2;
      wobbleZ = Math.sin(t * 1.8 + fish.phase * 2) * 0.5;
    } else {
      // Vague (très légère)
      const wave = Math.sin(centeredProgress * 0.04) * 4; // Amplitude réduite (8 -> 4)
      x = centeredProgress + wave;
      wobbleY = Math.sin(t * 2.4 + fish.phase * 3) * 0.5 + Math.sin(centeredProgress * 0.06) * 3;
      wobbleZ = Math.sin(t * 2.1 + fish.phase * 2) * 0.6;
    }

    return {
      x: x + fish.offsetX,
      y: fish.baseY + fish.offsetY + wobbleY,
      z: fish.baseZ + fish.offsetZ + wobbleZ
    };
  };

  useEffect(() => {
    if (!emperorFbx || !fish3Fbx || !groupRef.current) return;

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

      fbxModel.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const instanceMesh = new THREE.Mesh(
            mesh.geometry,
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

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    fishGroupsRef.current.forEach((fishGroup, i) => {
      const fish = fishDataRef.current[i];

      const pos = calculateFishPosition(fish, t);
      const y = pos.y + scrollProgress * 120;

      fishGroup.position.set(pos.x, y, pos.z);

      // ✅ Rotation naturelle selon le chemin
      let baseRotationY;
      if (fish.model === 'fish3') {
        baseRotationY = fish.pathType === 'curve-right' ? -Math.PI / 2 : Math.PI / 2;
      } else {
        baseRotationY = fish.pathType === 'curve-right' ? Math.PI : 0;
      }

      const bodyUndulation = Math.sin(t * 5 + fish.phase * 4) * 0.15; // Plus lent mais plus ample pour être plus fluide
      fishGroup.rotation.y = baseRotationY + bodyUndulation;

      fishGroup.rotation.z = Math.sin(t * 4 + fish.phase * 2) * 0.04;
      fishGroup.rotation.x = Math.sin(t * 3 + fish.phase) * 0.03;
    });
  });

  return <group ref={groupRef} />;
}