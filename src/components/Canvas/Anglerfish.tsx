"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

interface AnglerfishProps {
  scrollProgress: number;
  reducedMotion?: boolean;
}

export function Anglerfish({ scrollProgress, reducedMotion = false }: AnglerfishProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/models/anglerfish-final.glb", true);
  const { actions } = useAnimations(animations, scene);
  const lightRef = useRef<THREE.PointLight>(null);

  useEffect(() => {
    // 1. Animation - contrôlée par reducedMotion
    if (actions) {
      const actionKeys = Object.keys(actions);
      actionKeys.forEach(key => {
        const action = actions[key];
        if (action) {
          if (reducedMotion) {
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

    // 2. Matériaux : Rendre le poisson visible dans le noir
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          // On force un matériau qui réagit à la lumière mais qui a aussi sa propre lueur
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.emissive = new THREE.Color("#224455"); // Lueur bleutée pour qu'on le voie
          mat.emissiveIntensity = 0.4;
          mat.roughness = 0.4;
          mat.metalness = 0.6;
        }
      }
    });
  }, [actions, scene, reducedMotion]);

  // Temps figé et offset pour reprise fluide
  const frozenTimeRef = useRef<number>(0);
  const timeOffsetRef = useRef<number>(0);
  const wasReducedRef = useRef<boolean>(false);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Visible seulement au fond
    const isVisible = scrollProgress > 0.8;
    groupRef.current.visible = isVisible;

    if (isVisible) {
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

      const cameraY = scrollProgress * 100;

      // Position de base (un peu plus haut que les racines des plantes pour être visible)
      const BASE_DEPTH = -120;

      // Animation de nage latérale (Ping-Pong) - figée en mode calme
      const swimRange = 40;
      const swimSpeed = 0.1;
      const xPos = reducedMotion ? 0 : Math.sin(t * swimSpeed) * swimRange;

      // Orientation - figée en mode calme
      const direction = Math.cos(t * swimSpeed);
      const targetRotationY = reducedMotion ? Math.PI / 2 : (direction > 0 ? Math.PI / 2 : -Math.PI / 2);

      // Rotation fluide
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.1);

      // Mouvement vertical (Bobbing) - figé en mode calme
      const bobY = reducedMotion ? 0 : Math.sin(t * 0.5) * 2;

      // Mouvement avant-arrière léger - figé en mode calme
      const swimZ = reducedMotion ? 0 : Math.cos(t * 0.3) * 5;

      groupRef.current.position.set(
        xPos,
        BASE_DEPTH + cameraY + bobY,
        -20 + swimZ // Z = -20 (plus proche de la caméra que les plantes à -30)
      );

      // Ondulation - figée en mode calme
      groupRef.current.rotation.z = reducedMotion ? 0 : Math.sin(t * 2) * 0.05;
      groupRef.current.rotation.x = reducedMotion ? 0 : Math.sin(t * 1) * 0.05;

      // Échelle
      groupRef.current.scale.setScalar(1.5);

      // Lumière pulsante (Leurre) - fixe en mode calme
      if (lightRef.current) {
        lightRef.current.intensity = reducedMotion ? 8 : 8 + Math.sin(t * 4) * 4;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
      <pointLight
        ref={lightRef}
        position={[0, 4, 8]}
        color="#aaff44"
        intensity={10} // Intensité de base augmentée
        distance={35} // Portée augmentée
        decay={2}
      />
    </group>
  );
}

useGLTF.preload("/models/anglerfish-final.glb", true);