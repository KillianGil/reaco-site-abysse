"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

export function Anglerfish({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/models/anglerfish-final.glb");
  const { actions } = useAnimations(animations, scene);
  const lightRef = useRef<THREE.PointLight>(null);

  useEffect(() => {
    // 1. Animation
    if (actions) {
      const actionKeys = Object.keys(actions);
      actionKeys.forEach(key => {
        const action = actions[key];
        if (action) {
          action.reset().fadeIn(0.5).play();
          action.timeScale = 0.8;
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
  }, [actions, scene]);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Visible seulement au fond
    const isVisible = scrollProgress > 0.8;
    groupRef.current.visible = isVisible;

    if (isVisible) {
      const t = state.clock.elapsedTime;
      const cameraY = scrollProgress * 100;

      // Position de base (un peu plus haut que les racines des plantes pour être visible)
      const BASE_DEPTH = -120;

      // Animation de nage latérale (Ping-Pong)
      const swimRange = 40;
      const swimSpeed = 0.1;
      const xPos = Math.sin(t * swimSpeed) * swimRange;

      // Orientation
      const direction = Math.cos(t * swimSpeed);
      const targetRotationY = direction > 0 ? Math.PI / 2 : -Math.PI / 2;

      // Rotation fluide
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.1);

      // Mouvement vertical (Bobbing)
      const bobY = Math.sin(t * 0.5) * 2;

      // Mouvement avant-arrière léger
      const swimZ = Math.cos(t * 0.3) * 5;

      groupRef.current.position.set(
        xPos,
        BASE_DEPTH + cameraY + bobY,
        -20 + swimZ // Z = -20 (plus proche de la caméra que les plantes à -30)
      );

      // Ondulation
      groupRef.current.rotation.z = Math.sin(t * 2) * 0.05;
      groupRef.current.rotation.x = Math.sin(t * 1) * 0.05;

      // Échelle
      groupRef.current.scale.setScalar(1.5);

      // Lumière pulsante (Leurre)
      if (lightRef.current) {
        // Pulsation plus forte et plus rapide
        lightRef.current.intensity = 8 + Math.sin(t * 4) * 4;
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

useGLTF.preload("/models/anglerfish-final.glb");