"use client";

import { useRef, useEffect, useMemo, memo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { useScrollProgressRef } from "./Scene";

interface JellyfishProps {
  scrollProgress: number;
  reducedMotion?: boolean;
}

export const Jellyfish = memo(function Jellyfish({ reducedMotion = false }: JellyfishProps) {
  const scrollProgressRef = useScrollProgressRef();
  const { scene, animations } = useGLTF("/models/jellyfish2.glb", true);
  const { actions } = useAnimations(animations, scene);
  const groupRef = useRef<THREE.Group>(null);
  const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);

  const START_SCROLL = 0.6;
  const END_SCROLL = 0.95;

  useEffect(() => {
    if (actions) {
      const actionKeys = Object.keys(actions);
      if (actionKeys.length > 0) {
        actionKeys.forEach(key => {
          const action = actions[key];
          if (action) {
            if (reducedMotion) {
              // En mode calme, mettre en pause l'animation
              action.paused = true;
            } else {
              action.paused = false;
              if (!action.isRunning()) {
                action.reset().fadeIn(0.5).play();
              }
              action.timeScale = 0.8;
            }
          }
        });
      }
    }

    // Cache materials once instead of traversing every frame
    const materials: THREE.MeshStandardMaterial[] = [];
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.transparent = true;
          mat.opacity = 0;
          mat.emissiveIntensity = 0.6;
          mat.roughness = 0.1;
          mat.metalness = 0.1;
          materials.push(mat);
        }
      }
    });
    materialsRef.current = materials;
  }, [scene, actions, reducedMotion]);

  // Temps figé et offset pour reprise fluide
  const frozenTimeRef = useRef<number>(0);
  const timeOffsetRef = useRef<number>(0);
  const wasReducedRef = useRef<boolean>(false);

  useFrame((state) => {
    if (!groupRef.current) return;

    const progress = scrollProgressRef.current;
    const isVisibleRange = progress > START_SCROLL - 0.1 && progress < END_SCROLL + 0.1;

    let targetOpacity = 0;
    if (isVisibleRange) {
      const distFromStart = progress - (START_SCROLL - 0.1);
      const distFromEnd = (END_SCROLL + 0.1) - progress;
      const fade = Math.min(distFromStart, distFromEnd) * 8;
      targetOpacity = Math.max(0, Math.min(1.0, fade));
    }

    // Use cached materials instead of traversing scene every frame
    for (const mat of materialsRef.current) {
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.1);
    }

    groupRef.current.visible = true;

    const realTime = state.clock.elapsedTime;

    // Détection du changement de mode pour reprise fluide
    if (reducedMotion && !wasReducedRef.current) {
      frozenTimeRef.current = realTime - timeOffsetRef.current;
    } else if (!reducedMotion && wasReducedRef.current) {
      timeOffsetRef.current = realTime - frozenTimeRef.current;
    }
    wasReducedRef.current = reducedMotion;

    // Temps d'animation avec reprise fluide
    const t = reducedMotion ? frozenTimeRef.current : realTime - timeOffsetRef.current;

    // Mouvement figé en mode calme
    const floatY = reducedMotion ? 0 : Math.sin(t * 0.2) * 10 + Math.sin(t * 0.1) * 5;
    const floatX = reducedMotion ? 0 : Math.sin(t * 0.1) * 8;
    const floatZ = reducedMotion ? 0 : Math.cos(t * 0.1) * 5;

    // Position de base
    const BASE_DEPTH = -70;
    const OFFSET_X = -25;
    const cameraY = progress * 100;

    // DÉPLACEMENT VERTICAL LENT - figé en mode calme
    const verticalCycle = reducedMotion ? 0 : Math.sin(t * 0.08) * 15;
    // MEDUSE 1 (Principale)
    groupRef.current.position.set(
      floatX + OFFSET_X,
      BASE_DEPTH + cameraY + floatY * 0.3 + verticalCycle,
      -40 + floatZ
    );

    // Rotation douce - figée en mode calme
    const targetRotationY = reducedMotion ? 0 : Math.cos(t * 0.2) * 0.5;
    const targetRotationX = reducedMotion ? 0 : Math.cos(t * 0.3) * 0.2;
    const targetRotationZ = reducedMotion ? 0 : Math.sin(t * 0.2) * 0.1;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.05);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.05);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotationZ, 0.05);

    // Pulsation rythmique (scale) - figée en mode calme
    const pulse = reducedMotion ? 0 : Math.sin(t * 1.5);
    const squish = pulse * 0.05;

    const baseScale = 2.0;
    groupRef.current.scale.set(baseScale - squish, baseScale + squish, baseScale - squish);
  });

  // Clone pour la 2ème méduse
  const secondJellyfish = useMemo(() => scene.clone(), [scene]);

  // Ref pour la 2ème méduse
  const secondRef = useRef<THREE.Group>(null);

  // Temps figé et offset pour la 2ème méduse (reprise fluide)
  const frozenTimeRef2 = useRef<number>(2.5);
  const timeOffsetRef2 = useRef<number>(0);
  const wasReducedRef2 = useRef<boolean>(false);

  useFrame((state) => {
    if (!secondRef.current) return;

    const progress = scrollProgressRef.current;
    const realTime = state.clock.elapsedTime + 2.5; // Décalage de base

    // Détection du changement de mode pour reprise fluide
    if (reducedMotion && !wasReducedRef2.current) {
      frozenTimeRef2.current = realTime - timeOffsetRef2.current;
    } else if (!reducedMotion && wasReducedRef2.current) {
      timeOffsetRef2.current = realTime - frozenTimeRef2.current;
    }
    wasReducedRef2.current = reducedMotion;

    // Temps d'animation avec reprise fluide
    const t = reducedMotion ? frozenTimeRef2.current : realTime - timeOffsetRef2.current;

    // Mouvement décalé - figé en mode calme
    const floatY = reducedMotion ? 0 : Math.sin(t * 0.15) * 12 + Math.sin(t * 0.1) * 6;
    const floatX = reducedMotion ? 0 : Math.sin(t * 0.12) * 9;
    const floatZ = reducedMotion ? 0 : Math.cos(t * 0.12) * 6;

    const BASE_DEPTH = -60;
    const OFFSET_X = 15;
    const cameraY = progress * 100;

    const verticalCycle = reducedMotion ? 0 : Math.sin(t * 0.07) * 18;

    secondRef.current.position.set(
      floatX + OFFSET_X,
      BASE_DEPTH + cameraY + floatY * 0.3 + verticalCycle,
      -50 + floatZ
    );

    // Rotation - figée en mode calme
    secondRef.current.rotation.y = reducedMotion ? 0 : Math.cos(t * 0.2) * 0.5;

    // Pulsation - figée en mode calme
    const pulse = reducedMotion ? 0 : Math.sin(t * 1.4);
    const squish = pulse * 0.05;
    const baseScale = 1.6;
    secondRef.current.scale.set(baseScale - squish, baseScale + squish, baseScale - squish);

    const isVisibleRange = progress > START_SCROLL - 0.1 && progress < END_SCROLL + 0.1;
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
});

useGLTF.preload("/models/jellyfish2.glb", true);
