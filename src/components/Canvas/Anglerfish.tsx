"use client";

import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface AnglerfishProps {
  scrollProgress: number;
}

interface AnglerfishInstance {
  group: THREE.Group;
  startTime: number;
  startPos: THREE.Vector3;
  endPos: THREE.Vector3;
  duration: number;
}

export function Anglerfish({ scrollProgress }: AnglerfishProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/anglerfish-final.glb");

  // Modèle clonable
  const fishModel = useMemo(() => scene, [scene]);

  const instancesRef = useRef<AnglerfishInstance[]>([]);
  const lastSpawnRef = useRef(0);

  // Fonction pour faire apparaître un Anglerfish
  const spawnFish = (time: number) => {
    if (!groupRef.current) return;

    // Apparaît seulement au fond (scroll > 0.8)
    if (scrollProgress < 0.8) return;

    const visibleY = -110 + (scrollProgress * 100); // Environ -20 à -10 sur l'écran

    const trajectoryType = Math.random();
    let startPos: THREE.Vector3;
    let endPos: THREE.Vector3;

    if (trajectoryType < 0.5) {
      // Gauche -> Droite
      startPos = new THREE.Vector3(-60, visibleY + (Math.random() - 0.5) * 10, -20);
      endPos = new THREE.Vector3(60, visibleY + (Math.random() - 0.5) * 10, -20);
    } else {
      // Droite -> Gauche
      startPos = new THREE.Vector3(60, visibleY + (Math.random() - 0.5) * 10, -20);
      endPos = new THREE.Vector3(-60, visibleY + (Math.random() - 0.5) * 10, -20);
    }

    const fishGroup = new THREE.Group();
    const clonedScene = fishModel.clone();

    // Configuration du modèle
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });

    fishGroup.add(clonedScene);

    // Échelle PETITE (comme demandé)
    fishGroup.scale.setScalar(0.15);
    fishGroup.position.copy(startPos);

    // Ajout de la lumière
    const light = new THREE.PointLight(0x88ff44, 5, 15, 2);
    light.position.set(0, 2, 1);
    fishGroup.add(light);

    const duration = 20 + Math.random() * 10; // Nage lente (20-30s)

    const instance: AnglerfishInstance = {
      group: fishGroup,
      startTime: time,
      startPos,
      endPos,
      duration,
    };

    groupRef.current.add(fishGroup);
    instancesRef.current.push(instance);
  };

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;

    // Spawn rare (toutes les 5 secondes) si on est au fond
    if (time - lastSpawnRef.current > 5 && scrollProgress > 0.85) {
      spawnFish(time);
      lastSpawnRef.current = time;
    }

    // Animation
    instancesRef.current.forEach((instance, index) => {
      const elapsed = time - instance.startTime;
      const progress = Math.min(elapsed / instance.duration, 1);

      if (progress >= 1) {
        groupRef.current?.remove(instance.group);
        instancesRef.current.splice(index, 1);
        return;
      }

      // Mouvement linéaire fluide
      const currentPos = new THREE.Vector3().lerpVectors(
        instance.startPos,
        instance.endPos,
        progress
      );

      // Ajouter un petit mouvement de vague vertical (bobbing)
      currentPos.y += Math.sin(time * 0.5 + index) * 0.5;

      instance.group.position.copy(currentPos);

      // Orientation : regarde vers la destination
      instance.group.lookAt(instance.endPos);

      // Ondulation
      instance.group.rotation.z = Math.sin(time * 2 + index) * 0.05;
    });
  });

  return <group ref={groupRef} />;
}

useGLTF.preload("/models/anglerfish-final.glb");