"use client";

import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useFBX } from "@react-three/drei";
import * as THREE from "three";

interface SubmarineProps {
  scrollProgress: number;
}

export function Submarine({ scrollProgress }: SubmarineProps) {
  // HOOKS MUST BE AT THE TOP - NO CONDITIONS BEFORE
  const fbx = useFBX("/models/submarine.fbx");
  
  const groupRef = useRef<THREE.Group>(null);
  const innerGroupRef = useRef<THREE.Group>(null);
  const initialized = useRef(false);

  const darkMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: "#1a2835",
      roughness: 0.25,
      metalness: 0.85,
      clearcoat: 0.3,
      clearcoatRoughness: 0.2,
      envMapIntensity: 1.2,
    });
  }, []);

  useEffect(() => {
    if (fbx) {
      fbx.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.material = darkMaterial;
          mesh.castShadow = true;
        }
      });
    }
  }, [fbx, darkMaterial]);

  // Keyframes - START CENTERED (0, 2, -8) above the title
  const keyframes = useMemo(() => [
    { progress: 0, pos: [0, 2, -8], rot: [0.05, 0, 0.02], facing: 0 },
    { progress: 0.05, pos: [0, 2, -8], rot: [0.05, 0, 0.02], facing: 0 },
    { progress: 0.12, pos: [6, 1, -12], rot: [0.06, -0.1, 0.02], facing: 0.3 },
    { progress: 0.22, pos: [12, 0, -14], rot: [0.05, 0, 0.02], facing: 0.5 },
    { progress: 0.32, pos: [14, -1, -12], rot: [0.03, 0.05, 0.01], facing: 0.8 },
    { progress: 0.42, pos: [6, -2, -10], rot: [0.05, 0.1, 0], facing: 1.3 },
    { progress: 0.52, pos: [-8, -3, -12], rot: [0.07, 0.08, -0.01], facing: 1.9 },
    { progress: 0.62, pos: [-14, -4, -14], rot: [0.08, 0.05, -0.02], facing: 2.5 },
    { progress: 0.72, pos: [-12, -5, -16], rot: [0.1, 0, -0.01], facing: 2.9 },
    { progress: 0.82, pos: [-5, -7, -18], rot: [0.12, -0.05, 0], facing: 3.5 },
    { progress: 0.92, pos: [2, -9, -22], rot: [0.15, -0.1, 0.01], facing: 3.9 },
    { progress: 1, pos: [0, -12, -30], rot: [0.2, -0.05, 0], facing: 4.3 },
  ], []);

  const current = useRef({
    x: 0, y: 2, z: -8,
    rotX: 0.05, rotY: 0, rotZ: 0.02,
    facing: 0,
  });

  useFrame((state) => {
    if (!groupRef.current || !innerGroupRef.current) return;

    const time = state.clock.elapsedTime;

    if (!initialized.current && time < 0.5) {
      groupRef.current.position.set(0, 2, -8);
      groupRef.current.rotation.set(0.05, 0, 0.02);
      innerGroupRef.current.rotation.y = 0;
      groupRef.current.scale.setScalar(0.85);
      initialized.current = true;
      return;
    }

    let start = keyframes[0];
    let end = keyframes[1];

    for (let i = 0; i < keyframes.length - 1; i++) {
      if (scrollProgress >= keyframes[i].progress && scrollProgress <= keyframes[i + 1].progress) {
        start = keyframes[i];
        end = keyframes[i + 1];
        break;
      }
    }

    const segmentDuration = end.progress - start.progress;
    const t = segmentDuration > 0
      ? THREE.MathUtils.clamp((scrollProgress - start.progress) / segmentDuration, 0, 1)
      : 0;

    const easeT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    const targetX = THREE.MathUtils.lerp(start.pos[0], end.pos[0], easeT);
    const targetY = THREE.MathUtils.lerp(start.pos[1], end.pos[1], easeT);
    const targetZ = THREE.MathUtils.lerp(start.pos[2], end.pos[2], easeT);
    const targetRotX = THREE.MathUtils.lerp(start.rot[0], end.rot[0], easeT);
    const targetRotY = THREE.MathUtils.lerp(start.rot[1], end.rot[1], easeT);
    const targetRotZ = THREE.MathUtils.lerp(start.rot[2], end.rot[2], easeT);
    const targetFacing = THREE.MathUtils.lerp(start.facing, end.facing, easeT);

    const inertia = scrollProgress < 0.1 ? 0.01 : 0.02;
    current.current.x += (targetX - current.current.x) * inertia;
    current.current.y += (targetY - current.current.y) * inertia;
    current.current.z += (targetZ - current.current.z) * inertia;
    current.current.rotX += (targetRotX - current.current.rotX) * inertia;
    current.current.rotY += (targetRotY - current.current.rotY) * inertia;
    current.current.rotZ += (targetRotZ - current.current.rotZ) * inertia;
    current.current.facing += (targetFacing - current.current.facing) * inertia;

    const idleIntensity = Math.max(0, 1 - scrollProgress * 3);
    
    const floatX = Math.sin(time * 0.15) * (0.12 + idleIntensity * 0.3);
    const floatY = Math.sin(time * 0.2) * (0.15 + idleIntensity * 0.4);
    const floatZ = Math.sin(time * 0.12) * idleIntensity * 0.5;
    const floatRotX = Math.sin(time * 0.1) * (0.006 + idleIntensity * 0.015);
    const floatRotY = Math.sin(time * 0.08) * idleIntensity * 0.02;
    const floatRotZ = Math.sin(time * 0.13) * (0.004 + idleIntensity * 0.01);

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

    innerGroupRef.current.rotation.y = current.current.facing + current.current.rotY + floatRotY;

    groupRef.current.scale.setScalar(0.85);
  });

  return (
    <>
      {/* Strong lighting for submarine visibility */}
      <ambientLight intensity={0.4} color="#88ccff" />
      <directionalLight position={[5, 15, 10]} intensity={1.2} color="#aaddff" />
      <directionalLight position={[-5, 10, 5]} intensity={0.6} color="#88bbdd" />
      <spotLight position={[10, 5, 0]} angle={0.6} penumbra={1} intensity={2} color="#5ac8e8" distance={50} />
      <spotLight position={[-10, 5, 0]} angle={0.6} penumbra={1} intensity={2} color="#4ab8d8" distance={50} />
      
      <group ref={groupRef}>
        <group ref={innerGroupRef}>
          <primitive object={fbx} scale={0.012} rotation={[0, -Math.PI / 2, 0]} />
        </group>
      </group>
    </>
  );
}
