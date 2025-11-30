"use client";

import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

export function Jellyfish({ scrollProgress }: { scrollProgress: number }) {
  const { scene, animations } = useGLTF("/models/jellyfish2.glb");
  const { actions } = useAnimations(animations, scene);
  const groupRef = useRef<THREE.Group>(null);

  const START_SCROLL = 0.6; 
  const END_SCROLL = 0.95;

  useEffect(() => {
    if (actions) {
      const actionKeys = Object.keys(actions);
      if (actionKeys.length > 0) {
        actionKeys.forEach(key => {
          const action = actions[key];
          if (action) {
            action.reset().fadeIn(0.5).play();
            action.timeScale = 0.8; // Un peu plus rapide pour voir les tentacules bouger
          }
        });
      }
    }

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.transparent = true;
          mat.opacity = 0; // Commence invisible pour le fade-in
          mat.emissiveIntensity = 0.6; // Beaucoup plus lumineux (était 0.3)
          mat.roughness = 0.1;
          mat.metalness = 0.1;
        }
      }
    });
  }, [scene, actions]);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Gestion visibilité avec FADE (plus doux)
    const isVisibleRange = scrollProgress > START_SCROLL - 0.1 && scrollProgress < END_SCROLL + 0.1;

    // Calcul de l'opacité cible
    let targetOpacity = 0;
    if (isVisibleRange) {
      // Fade in/out basé sur la distance aux bords de la zone
      const distFromStart = scrollProgress - (START_SCROLL - 0.1);
      const distFromEnd = (END_SCROLL + 0.1) - scrollProgress;

      // FADE PLUS RAPIDE (x8 au lieu de x4)
      const fade = Math.min(distFromStart, distFromEnd) * 8;
      targetOpacity = Math.max(0, Math.min(1.0, fade));
    }

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.1);
        }
      }
    });

    groupRef.current.visible = true;

    const t = state.clock.elapsedTime;

    const floatY = Math.sin(t * 0.2) * 10 + Math.sin(t * 0.1) * 5;
    const floatX = Math.sin(t * 0.1) * 8;
    const floatZ = Math.cos(t * 0.1) * 5;

    // Position de base
    const BASE_DEPTH = -70; // Ajusté pour être visible avec cameraY
    const OFFSET_X = -25;
    const cameraY = scrollProgress * 100; // RESTAURÉ pour suivre le scroll

    // DÉPLACEMENT VERTICAL LENT basé sur le temps
    const verticalCycle = Math.sin(t * 0.08) * 15; // Cycle lent de montée/descente
    // MEDUSE 1 (Principale)
    groupRef.current.position.set(
      floatX + OFFSET_X,
      BASE_DEPTH + cameraY + floatY * 0.3 + verticalCycle,
      -40 + floatZ
    );

    // Rotation douce
    const targetRotationY = Math.cos(t * 0.2) * 0.5;
    const targetRotationX = Math.cos(t * 0.3) * 0.2;
    const targetRotationZ = Math.sin(t * 0.2) * 0.1;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.05);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.05);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotationZ, 0.05);

    // Pulsation rythmique (scale)
    const pulse = Math.sin(t * 1.5);
    const squish = pulse * 0.05;

    const baseScale = 2.0; // Taille ajustée
    groupRef.current.scale.set(baseScale - squish, baseScale + squish, baseScale - squish);
  });

  // Clone pour la 2ème méduse
  const secondJellyfish = useMemo(() => scene.clone(), [scene]);

  // Ref pour la 2ème méduse
  const secondRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!secondRef.current) return;
    const t = state.clock.elapsedTime + 2.5; // Décalage de temps

    // Mouvement décalé
    const floatY = Math.sin(t * 0.15) * 12 + Math.sin(t * 0.1) * 6;
    const floatX = Math.sin(t * 0.12) * 9;
    const floatZ = Math.cos(t * 0.12) * 6;

    const BASE_DEPTH = -60; // Un peu plus haut
    const OFFSET_X = 15; // À droite
    const cameraY = scrollProgress * 100;

    const verticalCycle = Math.sin(t * 0.07) * 18;

    secondRef.current.position.set(
      floatX + OFFSET_X,
      BASE_DEPTH + cameraY + floatY * 0.3 + verticalCycle,
      -50 + floatZ // Plus loin
    );

    // Rotation
    secondRef.current.rotation.y = Math.cos(t * 0.2) * 0.5;

    const pulse = Math.sin(t * 1.4);
    const squish = pulse * 0.05;
    const baseScale = 1.6;
    secondRef.current.scale.set(baseScale - squish, baseScale + squish, baseScale - squish);

    const START_SCROLL = 0.6;
    const END_SCROLL = 0.95;
    const isVisibleRange = scrollProgress > START_SCROLL - 0.1 && scrollProgress < END_SCROLL + 0.1;
    secondRef.current.visible = isVisibleRange;
  });

  return (
    <>
      <group ref={groupRef}>
        <primitive object={scene} />
        <pointLight color="#aa44ff" intensity={5} distance={25} decay={2} />
      </group>
      <group ref={secondRef}>
        <primitive object={secondJellyfish} />
      </group>
    </>
  );
}

useGLTF.preload("/models/jellyfish2.glb");