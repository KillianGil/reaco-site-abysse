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
  const START_SCROLL = 0.6; // Apparaît beaucoup plus tôt (était 0.75)
  const END_SCROLL = 1.2;

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
    // On élargit la zone de détection pour commencer le fade plus tôt
    const isVisibleRange = scrollProgress > START_SCROLL - 0.15 && scrollProgress < END_SCROLL + 0.15;

    // Calcul de l'opacité cible
    let targetOpacity = 0;
    if (isVisibleRange) {
      // Fade in/out basé sur la distance aux bords de la zone
      // On veut 1 au milieu, 0 aux bords

      // Distance par rapport au début
      const distFromStart = scrollProgress - (START_SCROLL - 0.15);
      // Distance par rapport à la fin
      const distFromEnd = (END_SCROLL + 0.15) - scrollProgress;

      // On prend le min des deux pour avoir un fade in ET un fade out
      const fade = Math.min(distFromStart, distFromEnd) * 4; // *4 pour que le fade soit assez rapide

      targetOpacity = Math.max(0, Math.min(1.0, fade)); // Opacité max 1.0
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

    // Si totalement invisible, on peut skip le reste des calculs (optionnel)
    // mais on laisse tourner pour que ça ne "saute" pas quand ça réapparaît
    groupRef.current.visible = true; // Toujours visible pour le moteur, on gère avec l'opacité

    const t = state.clock.elapsedTime;

    // ✅ MOUVEMENT AUTONOME

    // Mouvement sinusoïdal complexe
    const floatY = Math.sin(t * 0.3) * 15 + Math.sin(t * 0.1) * 10;
    const floatX = Math.sin(t * 0.2) * 20;
    const floatZ = Math.cos(t * 0.15) * 10;

    // Position de base (profondeur fixe)
    const BASE_DEPTH = -60;

    // Offset X pour ne pas être au centre (sur le texte)
    // CORRECTION: On change de côté pour voir si ça plait mieux (gauche)
    const OFFSET_X = -25;

    const cameraY = scrollProgress * 100;

    // Position finale
    // CORRECTION: On recule un peu en Z (-40) pour être sûr qu'elle soit visible et pas trop grosse
    groupRef.current.position.set(
      floatX + OFFSET_X,
      BASE_DEPTH + cameraY + floatY,
      -40 + floatZ
    );

    // ✅ ORIENTATION
    const targetRotationY = Math.cos(t * 0.2) * 0.5;
    const targetRotationX = Math.cos(t * 0.3) * 0.2;
    const targetRotationZ = Math.sin(t * 0.2) * 0.1;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.05);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.05);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotationZ, 0.05);

    // Pulsation rythmique (scale) - RÉDUITE pour éviter conflit avec animation GLB
    const pulse = Math.sin(t * 2);
    const squish = pulse * 0.02; // Très léger

    // CORRECTION TAILLE: On augmente la taille de base (4 -> 6)
    const baseScale = 6;
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