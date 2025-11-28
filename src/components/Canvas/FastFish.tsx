// components/Canvas/FastFish.tsx
"use client";

import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface FastFishProps {
  scrollProgress: number;
}

interface FastFishInstance {
  group: THREE.Group;
  startTime: number;
  startPos: THREE.Vector3;
  endPos: THREE.Vector3;
  duration: number;
}

export function FastFish({ scrollProgress }: FastFishProps) {
  const groupRef = useRef<THREE.Group>(null);

  const fish1Gltf = useGLTF("/models/poisson/fish1.glb");
  const fish2Gltf = useGLTF("/models/poisson/fish2.glb");
  const fish3Gltf = useGLTF("/models/poisson/fish3.glb");

  const fishModels = useMemo(() => [
    fish1Gltf.scene,
    fish2Gltf.scene,
    fish3Gltf.scene,
  ], [fish1Gltf, fish2Gltf, fish3Gltf]);

  const instancesRef = useRef<FastFishInstance[]>([]);
  const lastSpawnRef = useRef(0);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Fonction pour faire apparaître UN poisson (avec un offset optionnel pour les bancs)
  const spawnSingleFish = (time: number, offset = { x: 0, y: 0, z: 0 }) => {
    if (!groupRef.current) return;

    const baseCameraY = -scrollProgress * 100;
    const trajectoryType = Math.random();
    let startPos: THREE.Vector3;
    let endPos: THREE.Vector3;

    // Décalage aléatoire pour éviter que le banc soit trop parfait
    const randomOffset = 5;

    if (trajectoryType < 0.35) {
      // Gauche -> Droite
      startPos = new THREE.Vector3(-130 - offset.x, baseCameraY + (Math.random() - 0.5) * 50 + offset.y, -20 + Math.random() * -20 + offset.z);
      endPos = new THREE.Vector3(130, startPos.y + (Math.random() - 0.5) * 10, startPos.z);
    } else if (trajectoryType < 0.7) {
      // Droite -> Gauche
      startPos = new THREE.Vector3(130 + offset.x, baseCameraY + (Math.random() - 0.5) * 50 + offset.y, -20 + Math.random() * -20 + offset.z);
      endPos = new THREE.Vector3(-130, startPos.y + (Math.random() - 0.5) * 10, startPos.z);
    } else {
      // Profondeur (Fonce vers caméra) - Augmenté à 30% de chance (0.7 à 1.0)
      const xOffset = (Math.random() - 0.5) * 60; // Plus large zone de départ
      startPos = new THREE.Vector3(xOffset + offset.x, baseCameraY + (Math.random() - 0.5) * 40 + offset.y, -120 + offset.z);
      // On vise un point aléatoire devant la caméra pour l'effet 3D "in your face"
      endPos = new THREE.Vector3(xOffset * 3, baseCameraY + (Math.random() - 0.5) * 30, 40);
    }

    const modelIndex = Math.floor(Math.random() * fishModels.length);
    const fishGroup = new THREE.Group();

    fishModels[modelIndex].traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const clonedMesh = new THREE.Mesh(
          mesh.geometry.clone(),
          (mesh.material as THREE.Material).clone()
        );
        clonedMesh.castShadow = true;
        clonedMesh.receiveShadow = true;
        clonedMesh.rotation.y = Math.PI / 2;
        fishGroup.add(clonedMesh);
      }
    });

    const scale = 0.00018 + Math.random() * 0.00008; // Taille ajustée
    fishGroup.scale.setScalar(scale);
    fishGroup.position.copy(startPos);

    const duration = 15 + Math.random() * 8; // Plus lent (15-23s au lieu de 10-15s)

    const instance: FastFishInstance = {
      group: fishGroup,
      startTime: time,
      startPos,
      endPos,
      duration,
    };

    // CORRECTION ORIENTATION: Si c'est le trajet "fond vers caméra" (3ème type),
    // on doit peut-être ajuster la rotation initiale ou marquer l'instance pour une correction
    if (trajectoryType >= 0.8) {
      // On stocke une info pour dire que c'est ce type de trajet si besoin
      // Mais le lookAt dans useFrame devrait suffire SI le modèle est bien orienté.
      // Si on voit le dos, c'est que le modèle regarde vers -Z ou +Z alors qu'il devrait regarder ailleurs.
      // On va faire une correction de rotation sur l'axe Y pour ce groupe spécifique
      fishGroup.rotateY(Math.PI); // On retourne le poisson de 180°
    }

    groupRef.current.add(fishGroup);
    instancesRef.current.push(instance);
  };

  // ✅ Logique pour faire apparaître un BANC (School)
  const spawnSchool = (time: number) => {
    const schoolSize = 3 + Math.floor(Math.random() * 5); // 3 à 7 poissons (réduit)

    for (let i = 0; i < schoolSize; i++) {
      // Créer un décalage en formation
      const offsetX = (Math.random() - 0.5) * 12;
      const offsetY = (Math.random() - 0.5) * 6;
      const offsetZ = (Math.random() - 0.5) * 6;

      // Petit délai entre chaque poisson pour qu'ils n'apparaissent pas exactement à la même milliseconde
      const delay = Math.random() * 0.5;

      // On triche un peu en décalant le startTime dans le passé pour qu'ils soient déjà là ou arrivent
      spawnSingleFish(time - delay, { x: offsetX, y: offsetY, z: offsetZ });
    }
  };

  // Spawn initial au chargement
  useEffect(() => {
    // Lance quelques poissons pour commencer, mais moins agressif
    spawnSchool(0);
    spawnSingleFish(0.5);
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;

    // ✅ SPAWN DE GROUPES : Plus calme
    if (time - lastSpawnRef.current > 3.5) { // Toutes les 3.5 secondes (au lieu de 1.5)
      // 50% de chance d'avoir un banc, 50% un poisson seul
      if (Math.random() > 0.5) {
        spawnSchool(time);
      } else {
        spawnSingleFish(time);
      }
      lastSpawnRef.current = time;
    }

    const toRemove: number[] = [];

    instancesRef.current.forEach((instance, index) => {
      const elapsed = time - instance.startTime;
      const progress = Math.min(elapsed / instance.duration, 1);

      if (progress >= 1) {
        toRemove.push(index);
        return;
      }

      const currentPos = new THREE.Vector3().lerpVectors(instance.startPos, instance.endPos, progress);
      currentPos.y += scrollProgress * 100 - instance.startPos.y + instance.startPos.y;

      instance.group.position.copy(currentPos);

      dummy.position.copy(currentPos);
      dummy.lookAt(instance.endPos);
      instance.group.quaternion.slerp(dummy.quaternion, 0.2);
      instance.group.rotateZ(Math.sin(time * 20 + index) * 0.08);
    });

    toRemove.reverse().forEach((index) => {
      const instance = instancesRef.current[index];
      groupRef.current?.remove(instance.group);
      instance.group.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
          else child.material.dispose();
        }
      });
      instancesRef.current.splice(index, 1);
    });
  });

  return <group ref={groupRef} />;
}

useGLTF.preload("/models/poisson/fish1.glb");
useGLTF.preload("/models/poisson/fish2.glb");
useGLTF.preload("/models/poisson/fish3.glb");