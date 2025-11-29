// components/Canvas/Jellyfish.tsx
"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

interface JellyfishProps {
  scrollProgress: number;
}

export function Jellyfish({ scrollProgress }: JellyfishProps) {
  const { scene, animations } = useGLTF("/models/jellyfish.glb");
  const { actions } = useAnimations(animations, scene);
  const groupRef = useRef<THREE.Group>(null);

  // Plage de visibilité (profondeur)
  const START_SCROLL = 0.3; // Apparition beaucoup plus tôt
  const END_SCROLL = 0.9;

  useEffect(() => {
    // Force l'animation du fichier GLB
    if (actions) {
      const actionKeys = Object.keys(actions);
      if (actionKeys.length > 0) {
        // On joue toutes les animations trouvées pour être sûr
        actionKeys.forEach(key => {
          const action = actions[key];
          if (action) {
            action.reset().fadeIn(0.5).play();
            action.timeScale = 0.8; // Un peu plus rapide pour voir les tentacules bouger
          }
        });
      }
    }

    // NOTE: On ne touche plus aux matériaux pour garder la texture originale
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

    // Appliquer l'opacité progressivement
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

    // ✅ MOUVEMENT AUTONOME BOOSTÉ

    // Mouvement sinusoïdal complexe - AMPLITUDE AUGMENTÉE
    const floatY = Math.sin(t * 0.4) * 25 + Math.sin(t * 0.15) * 15; // Plus ample et un peu plus rapide
    const floatX = Math.sin(t * 0.25) * 30; // Plus large
    const floatZ = Math.cos(t * 0.2) * 15;

    // Position de base (profondeur fixe)
    const BASE_DEPTH = -60;

    // Offset X fixe (plus d'entrée latérale artificielle)
    const OFFSET_X = -25;

    const cameraY = scrollProgress * 100;

    // Position finale
    // CORRECTION: On lock la position Y à la caméra pour qu'elle ne soit jamais perdue
    // On ajoute juste le flottement autonome par dessus
    groupRef.current.position.set(
      floatX + OFFSET_X,
      BASE_DEPTH + cameraY + floatY * 0.3, // On garde 30% du mouvement vertical
      -40 + floatZ
    );

    // ✅ ORIENTATION
    const targetRotationY = Math.cos(t * 0.2) * 0.5;
    const targetRotationX = Math.cos(t * 0.3) * 0.2;
    const targetRotationZ = Math.sin(t * 0.2) * 0.1;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.05);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.05);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotationZ, 0.05);

    // Pulsation rythmique (scale)
    const pulse = Math.sin(t * 2);
    const squish = pulse * 0.02; // Très léger

    const baseScale = 3; // Réduit de 5 à 3 pour être plus naturel
    groupRef.current.scale.set(baseScale - squish, baseScale + squish, baseScale - squish);
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
      <pointLight color="#aa44ff" intensity={5} distance={25} decay={2} />
    </group>
  );
}

useGLTF.preload("/models/jellyfish.glb");