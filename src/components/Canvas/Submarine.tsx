// components/Canvas/Submarine.tsx
"use client";

import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
// import { useFBX } from "@react-three/drei"; // ✅ Pour FBX
import * as THREE from "three";

interface SubmarineProps {
  scrollProgress: number;
}

export function Submarine({ scrollProgress }: SubmarineProps) {
  // ✅ VERSION GLB (plus léger)
  const { scene } = useGLTF("/models/submarine.glb");
  
  // ✅ VERSION FBX (commentée - décommente si besoin)
  // const fbx = useFBX("/models/submarine.fbx");
  // const scene = fbx;
  
  const groupRef = useRef<THREE.Group>(null);
  const innerGroupRef = useRef<THREE.Group>(null);
  const initialized = useRef(false);

  // ✅ NE PAS TOUCHER AUX MATÉRIAUX - Utiliser exactement ce qui vient du GLB
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          mesh.renderOrder = 10;
          // ✅ Ne rien modifier d'autre - garder les matériaux tels quels
        }
      });
    }
  }, [scene]);

  const keyframes = useMemo(
    () => [
      // SURFACE - À droite (COMME AVANT)
      { progress: 0, pos: [5, 2, -8], rot: [0.05, 0, 0.02], facing: 0 },
      { progress: 0.05, pos: [5, 2, -8], rot: [0.05, 0, 0.02], facing: 0 },
      
      // SECTION 1 "HISTOIRE" - Reste à droite
      { progress: 0.12, pos: [10, 1, -12], rot: [0.06, -0.15, 0.02], facing: 0.3 },
      { progress: 0.22, pos: [14, -0.5, -14], rot: [0.05, -0.2, 0.01], facing: 0.5 },
      
      // TOURNE VERS GAUCHE
      { progress: 0.30, pos: [8, -1.5, -15], rot: [0.04, 0.1, 0.01], facing: 1.2 },
      
      // SECTION 2 "CASABIANCA" - À GAUCHE
      { progress: 0.42, pos: [-10, -2.5, -16], rot: [0.05, 0.4, -0.01], facing: 2.0 },
      
      // TOURNE VERS DROITE
      { progress: 0.50, pos: [-2, -3.5, -17], rot: [0.06, 0.15, 0], facing: 2.5 },
      
      // SECTION 3 "EXPÉRIENCE" - À DROITE
      { progress: 0.62, pos: [8, -5, -18], rot: [0.07, -0.1, 0.01], facing: 3.0 },
      
      // TRANSITION VERS GAUCHE
      { progress: 0.68, pos: [6, -5.5, -19], rot: [0.08, 0, 0.01], facing: 3.3 },
      { progress: 0.72, pos: [0, -6.5, -20], rot: [0.09, 0.15, 0], facing: 3.6 },
      { progress: 0.76, pos: [-6, -7, -21], rot: [0.10, 0.25, -0.01], facing: 3.8 },
      
      // SECTION 4 "BIODIVERSITÉ" - À GAUCHE
      { progress: 0.82, pos: [-10, -8, -22], rot: [0.11, 0.3, -0.01], facing: 4.0 },
      { progress: 0.92, pos: [-14, -10, -25], rot: [0.13, 0.2, 0], facing: 4.1 },
      
      // ABYSSE
      { progress: 0.96, pos: [-10, -12, -28], rot: [0.15, 0.1, 0], facing: 4.2 },
      { progress: 1, pos: [-3, -15, -32], rot: [0.18, 0, 0], facing: 4.3 },
    ],
    []
  );

  const current = useRef({
    x: 0,
    y: 3,
    z: -8,
    rotX: 0.03,
    rotY: 0,
    rotZ: 0.01,
    facing: 0,
  });

  useFrame((state) => {
    if (!groupRef.current || !innerGroupRef.current) return;

    const time = state.clock.elapsedTime;

    if (!initialized.current && time < 1) {
      groupRef.current.position.set(0, 3, -8);
      groupRef.current.rotation.set(0.03, 0, 0.01);
      innerGroupRef.current.rotation.y = 0;
      groupRef.current.scale.setScalar(0.85);
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

    const inertia = scrollProgress < 0.1 ? 0.03 : 0.05;
    current.current.x += (targetX - current.current.x) * inertia;
    current.current.y += (targetY - current.current.y) * inertia;
    current.current.z += (targetZ - current.current.z) * inertia;
    current.current.rotX += (targetRotX - current.current.rotX) * inertia;
    current.current.rotY += (targetRotY - current.current.rotY) * inertia;
    current.current.rotZ += (targetRotZ - current.current.rotZ) * inertia;
    current.current.facing += (targetFacing - current.current.facing) * inertia;

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

    groupRef.current.scale.setScalar(1);
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
          {/* ✅ GLB VERSION - Taille normale, rotation originale */}
          <primitive 
            object={scene} 
            scale={0.012}  // ✅ Taille d'origine
            rotation={[0, -Math.PI / 2, 0]}  // ✅ Rotation d'origine
          />
          
          {/* ✅ FBX VERSION (commenté - décommente si tu veux l'utiliser)
          <primitive 
            object={scene} 
            scale={0.012} 
            rotation={[0, -Math.PI / 2, 0]} 
          />
          */}
        </group>
      </group>
    </>
  );
}

// ✅ Preload le modèle
useGLTF.preload("/models/submarine.glb");

// ✅ Pour FBX (décommente si besoin)
// useFBX.preload("/models/submarine.fbx");