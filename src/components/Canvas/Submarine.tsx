// components/Canvas/Submarine.tsx
"use client";

import { useRef, useEffect, useMemo, memo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

// ✅ Composant Modèle (Memoized pour éviter les re-renders et restart d'animation)
const SubmarineModel = memo(() => {
  // ✅ Utilisation du bon fichier
  const { scene, animations } = useGLTF("/models/submarinetest.glb");

  // Ref locale pour l'animation
  const localRef = useRef<THREE.Group>(null);
  const { actions } = useAnimations(animations, localRef);

  // ✅ Jouer l'animation de l'hélice (une seule fois)
  useEffect(() => {
    if (actions) {
      const actionName = Object.keys(actions)[0];
      if (actionName && actions[actionName]) {
        actions[actionName].reset().play();
      }
    }
  }, [actions]);

  // ✅ Matériaux
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          mesh.renderOrder = 10;
        }
      });
    }
  }, [scene]);

  return (
    <group ref={localRef}>
      <primitive
        object={scene}
        scale={0.045} // ✅ Taille ajustée (plus grand)
        rotation={[0, -Math.PI / 2, 0]} // ✅ Retour à la rotation d'origine (alignement)
      />
    </group>
  );
});

SubmarineModel.displayName = "SubmarineModel";

interface SubmarineProps {
  scrollProgress: number;
}

export function Submarine({ scrollProgress }: SubmarineProps) {
  const groupRef = useRef<THREE.Group>(null);
  const innerGroupRef = useRef<THREE.Group>(null);
  const initialized = useRef(false);

  const keyframes = useMemo(
    () => [
      // SURFACE - DÉPART PROFOND (Z-AXIS ENTRY)
      // Au début (0), il est loin au fond (Z=-60), plus visible (Scale=0.4), face caméra (RotY=PI)
      { progress: 0, pos: [0, 2, -60], rot: [0, Math.PI, 0], facing: 0, scale: 0.4 },

      // ARRIVÉE DANS LA SCÈNE (ZOOM AVANT)
      // À 0.1, il arrive à sa position de "base" (Z=-8), taille normale, et se tourne de profil
      { progress: 0.1, pos: [5, 2, -8], rot: [0.05, 0, 0.02], facing: 0, scale: 1 },

      // SECTION 1 "HISTOIRE" - Reste à droite (0.12 - 0.22)
      { progress: 0.12, pos: [10, 1, -12], rot: [0.06, -0.15, 0.02], facing: 0.3, scale: 1 },
      { progress: 0.22, pos: [14, -0.5, -14], rot: [0.05, -0.2, 0.01], facing: 0.5, scale: 1 },

      // TOURNE VERS GAUCHE
      { progress: 0.30, pos: [8, -1.5, -15], rot: [0.04, 0.1, 0.01], facing: 1.2, scale: 1 },

      // SECTION 2 "CASABIANCA" - À GAUCHE (0.38 - 0.48)
      { progress: 0.38, pos: [-10, -2.5, -16], rot: [0.05, 0.4, -0.01], facing: 2.0, scale: 1 },
      { progress: 0.48, pos: [-12, -3.5, -17], rot: [0.06, 0.3, 0], facing: 2.2, scale: 1 },

      // TOURNE VERS DROITE
      { progress: 0.53, pos: [-2, -4.0, -17.5], rot: [0.06, 0.15, 0], facing: 2.5, scale: 1 },

      // SECTION 3 "EXPÉRIENCE" - À DROITE (0.58 - 0.68)
      { progress: 0.58, pos: [8, -5, -18], rot: [0.07, -0.1, 0.01], facing: 3.0, scale: 1 },
      { progress: 0.68, pos: [10, -5.5, -19], rot: [0.08, -0.15, 0.01], facing: 3.1, scale: 1 },

      // TRANSITION VERS GAUCHE
      { progress: 0.73, pos: [0, -6.5, -20], rot: [0.09, 0.15, 0], facing: 3.6, scale: 1 },

      // SECTION 4 "BIODIVERSITÉ" - À GAUCHE (0.78 - 0.88)
      { progress: 0.78, pos: [-10, -8, -22], rot: [0.11, 0.3, -0.01], facing: 4.0, scale: 1 },
      { progress: 0.88, pos: [-14, -10, -25], rot: [0.13, 0.2, 0], facing: 4.1, scale: 1 },

      // ABYSSE
      { progress: 0.96, pos: [-10, -12, -28], rot: [0.15, 0.1, 0], facing: 4.2, scale: 1 },
      { progress: 1, pos: [-3, -15, -32], rot: [0.18, 0, 0], facing: 4.3, scale: 1 },
    ],
    []
  );

  const current = useRef({
    x: 0,
    y: 2,
    z: -80,
    rotX: 0,
    rotY: Math.PI,
    rotZ: 0,
    facing: 0,
    scale: 0.4,
  });

  useFrame((state) => {
    if (!groupRef.current || !innerGroupRef.current) return;

    const time = state.clock.elapsedTime;

    if (!initialized.current && time < 1) {
      groupRef.current.position.set(0, 2, -60);
      groupRef.current.rotation.set(0, Math.PI, 0);
      innerGroupRef.current.rotation.y = 0;
      groupRef.current.scale.setScalar(0.4);
      initialized.current = true;
      return;
    }

    let start = keyframes[0];
    let end = keyframes[1];

    for (let i = 0; i < keyframes.length - 1; i++) {
      if (
        scrollProgress >= keyframes[i].progress &&
        scrollProgress <= keyframes[i + 1].progress
      ) {
        start = keyframes[i];
        end = keyframes[i + 1];
        break;
      }
    }

    const segmentDuration = end.progress - start.progress;
    const t =
      segmentDuration > 0
        ? THREE.MathUtils.clamp(
          (scrollProgress - start.progress) / segmentDuration,
          0,
          1
        )
        : 0;

    const easeT = t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const targetX = THREE.MathUtils.lerp(start.pos[0], end.pos[0], easeT);
    const targetY = THREE.MathUtils.lerp(start.pos[1], end.pos[1], easeT);
    const targetZ = THREE.MathUtils.lerp(start.pos[2], end.pos[2], easeT);
    const targetRotX = THREE.MathUtils.lerp(start.rot[0], end.rot[0], easeT);
    const targetRotY = THREE.MathUtils.lerp(start.rot[1], end.rot[1], easeT);
    const targetRotZ = THREE.MathUtils.lerp(start.rot[2], end.rot[2], easeT);
    const targetFacing = THREE.MathUtils.lerp(start.facing, end.facing, easeT);
    const targetScale = THREE.MathUtils.lerp(start.scale || 1, end.scale || 1, easeT);

    const inertia = scrollProgress < 0.1 ? 0.03 : 0.05;
    current.current.x += (targetX - current.current.x) * inertia;
    current.current.y += (targetY - current.current.y) * inertia;
    current.current.z += (targetZ - current.current.z) * inertia;
    current.current.rotX += (targetRotX - current.current.rotX) * inertia;
    current.current.rotY += (targetRotY - current.current.rotY) * inertia;
    current.current.rotZ += (targetRotZ - current.current.rotZ) * inertia;
    current.current.facing += (targetFacing - current.current.facing) * inertia;
    current.current.scale += (targetScale - current.current.scale) * inertia;

    const idleIntensity = Math.max(0, 1 - scrollProgress * 2);
    const floatX = Math.sin(time * 0.12) * (0.08 + idleIntensity * 0.25);
    const floatY = Math.sin(time * 0.18) * (0.1 + idleIntensity * 0.3);
    const floatZ = Math.sin(time * 0.1) * idleIntensity * 0.4;
    const floatRotX = Math.sin(time * 0.08) * (0.004 + idleIntensity * 0.01);
    const floatRotY = Math.sin(time * 0.07) * idleIntensity * 0.015;
    const floatRotZ = Math.sin(time * 0.11) * (0.003 + idleIntensity * 0.008);

    groupRef.current.position.set(
      current.current.x + floatX,
      current.current.y + floatY,
      current.current.z + floatZ
    );

    groupRef.current.rotation.set(
      current.current.rotX + floatRotX,
      0,
      current.current.rotZ + floatRotZ
    );

    innerGroupRef.current.rotation.y =
      current.current.facing + current.current.rotY + floatRotY;

    const finalScale = current.current.scale;
    groupRef.current.scale.setScalar(finalScale);
  });

  return (
    <>
      <ambientLight intensity={0.3} color="#6da8c8" />
      <directionalLight
        position={[10, 60, 15]}
        intensity={1.8}
        color="#c8e4f5"
        castShadow
      />
      <directionalLight
        position={[-8, 40, 10]}
        intensity={0.8}
        color="#a8cce0"
      />
      <spotLight
        position={[15, 8, 5]}
        angle={0.5}
        penumbra={0.8}
        intensity={3}
        color="#7ac8e8"
        distance={60}
        castShadow
      />
      <spotLight
        position={[-15, 8, 5]}
        angle={0.5}
        penumbra={0.8}
        intensity={3}
        color="#68b8d8"
        distance={60}
        castShadow
      />
      <spotLight
        position={[0, -2, 0]}
        angle={0.3}
        penumbra={0.5}
        intensity={2}
        color="#ffffff"
        distance={30}
        target={groupRef.current || undefined}
      />

      <group ref={groupRef}>
        <group ref={innerGroupRef}>
          <SubmarineModel />
        </group>
      </group>
    </>
  );
}

// ✅ Preload le modèle
useGLTF.preload("/models/submarinetest.glb");