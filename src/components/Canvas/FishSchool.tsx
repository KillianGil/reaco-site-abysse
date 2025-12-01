// components/Canvas/FishSchool.tsx
"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useFBX, useTexture } from "@react-three/drei";
import * as THREE from "three";

interface FishSchoolProps {
  scrollProgress: number;
}

interface FishData {
  model: string;
  baseX: number;
  baseY: number;
  baseZ: number;
  offsetX: number;
  offsetY: number;
  offsetZ: number;
  speed: number;
  phase: number;
  scale: number;
  pathType: string;
}

// Suppress FBXLoader warnings globally
const originalWarn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('THREE.FBXLoader')) return;
  originalWarn(...args);
};

const cleanGeometry = (child: THREE.Mesh) => {
  const geo = child.geometry.clone();

  // 1. Sanitize Attributes: Keep only essential ones
  const keepAttributes = ['position', 'normal', 'uv'];
  Object.keys(geo.attributes).forEach((key) => {
    if (!keepAttributes.includes(key)) {
      geo.deleteAttribute(key);
    }
  });

  // 2. Fix NaNs in Position Attribute
  const posAttr = geo.attributes.position;
  if (posAttr) {
    const array = posAttr.array as Float32Array;
    let hasNaN = false;
    for (let i = 0; i < array.length; i++) {
      if (isNaN(array[i])) {
        array[i] = 0;
        hasNaN = true;
      }
    }
    if (hasNaN) posAttr.needsUpdate = true;
  }

  // 3. Compute Bounding Sphere
  geo.computeBoundingSphere();
  if (isNaN(geo.boundingSphere?.radius || NaN)) {
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 5);
  }

  return geo;
};

export function FishSchool({ scrollProgress }: FishSchoolProps) {
  const groupRef = useRef<THREE.Group>(null);
  const emperorRef = useRef<THREE.InstancedMesh>(null);
  const fish3Ref = useRef<THREE.InstancedMesh>(null);

  const emperorFbx = useFBX("/models/poisson/Emperor Angelfish/EmperorAngelfish_FBX.fbx");
  const fish3Fbx = useFBX("/models/poisson/Fish-3/source/fish_1_5.fbx");

  const emperorTextures = useTexture({
    map: "/models/poisson/Emperor Angelfish/Emperor-Angelfish-A.png",
    normalMap: "/models/poisson/Emperor Angelfish/Emperor-Angelfish-N.png",
  });

  const fish3Textures = useTexture({
    map: "/models/poisson/Fish-3/textures/fish_1_diffuse.jpeg",
  });

  // Dummy object pour calculs matriciels
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Données des poissons
  const fishData = useMemo(() => [
    // BANC 1 - Surface
    { model: 'emperor', baseX: 0, baseY: 8, baseZ: -25, offsetX: 0, offsetY: 0, offsetZ: 0, speed: 4.2, phase: 0, scale: 0.016, pathType: 'curve-left' },
    { model: 'fish3', baseX: 0, baseY: 8, baseZ: -25, offsetX: -4, offsetY: -1, offsetZ: -2, speed: 4.3, phase: 0.2, scale: 0.005, pathType: 'curve-left' },
    { model: 'emperor', baseX: 0, baseY: 8, baseZ: -25, offsetX: 4, offsetY: -1, offsetZ: -2, speed: 4.1, phase: 0.1, scale: 0.016, pathType: 'curve-left' },
    { model: 'fish3', baseX: 0, baseY: 8, baseZ: -25, offsetX: -8, offsetY: -2, offsetZ: -4, speed: 4.4, phase: 0.3, scale: 0.005, pathType: 'curve-left' },
    { model: 'fish3', baseX: 0, baseY: 8, baseZ: -25, offsetX: 8, offsetY: -2, offsetZ: -4, speed: 4.0, phase: 0.15, scale: 0.005, pathType: 'curve-left' },
    { model: 'emperor', baseX: 0, baseY: 8, baseZ: -25, offsetX: -12, offsetY: -3, offsetZ: -6, speed: 4.2, phase: 0.4, scale: 0.015, pathType: 'curve-left' },
    { model: 'emperor', baseX: 0, baseY: 8, baseZ: -25, offsetX: 12, offsetY: -3, offsetZ: -6, speed: 4.3, phase: 0.25, scale: 0.015, pathType: 'curve-left' },

    // BANC 2 - Profondeur moyenne
    { model: 'fish3', baseX: -4, baseY: -18, baseZ: -26, offsetX: 0, offsetY: 0, offsetZ: 0, speed: 3.8, phase: 0, scale: 0.005, pathType: 'curve-right' },
    { model: 'emperor', baseX: -4, baseY: -18, baseZ: -26, offsetX: 3, offsetY: 1, offsetZ: -1, speed: 3.7, phase: 0.1, scale: 0.016, pathType: 'curve-right' },
    { model: 'fish3', baseX: -4, baseY: -18, baseZ: -26, offsetX: -3, offsetY: 1, offsetZ: -1, speed: 4.0, phase: 0.15, scale: 0.005, pathType: 'curve-right' },
    { model: 'emperor', baseX: -4, baseY: -18, baseZ: -26, offsetX: 6, offsetY: 2, offsetZ: -2, speed: 3.6, phase: 0.2, scale: 0.015, pathType: 'curve-right' },
    { model: 'fish3', baseX: -4, baseY: -18, baseZ: -26, offsetX: -6, offsetY: 2, offsetZ: -2, speed: 4.1, phase: 0.25, scale: 0.005, pathType: 'curve-right' },
    { model: 'emperor', baseX: -4, baseY: -18, baseZ: -26, offsetX: 9, offsetY: 3, offsetZ: -3, speed: 3.7, phase: 0.3, scale: 0.015, pathType: 'curve-right' },
    { model: 'fish3', baseX: -4, baseY: -18, baseZ: -26, offsetX: -9, offsetY: 3, offsetZ: -3, speed: 3.8, phase: 0.35, scale: 0.005, pathType: 'curve-right' },

    // BANC 3 - Profondeur
    { model: 'emperor', baseX: 0, baseY: -45, baseZ: -27, offsetX: 0, offsetY: 0, offsetZ: 0, speed: 3.4, phase: 0, scale: 0.016, pathType: 'wave' },
    { model: 'fish3', baseX: 0, baseY: -45, baseZ: -27, offsetX: 6, offsetY: 2, offsetZ: -2, speed: 3.2, phase: 0.2, scale: 0.005, pathType: 'wave' },
    { model: 'emperor', baseX: 0, baseY: -45, baseZ: -27, offsetX: -6, offsetY: 2, offsetZ: -2, speed: 3.5, phase: 0.15, scale: 0.015, pathType: 'wave' },
    { model: 'fish3', baseX: 0, baseY: -45, baseZ: -27, offsetX: 10, offsetY: 4, offsetZ: -4, speed: 3.1, phase: 0.3, scale: 0.005, pathType: 'wave' },
    { model: 'emperor', baseX: 0, baseY: -45, baseZ: -27, offsetX: -10, offsetY: 4, offsetZ: -4, speed: 3.6, phase: 0.25, scale: 0.015, pathType: 'wave' },

    // BANC 4 - Zone sombre
    { model: 'fish3', baseX: 10, baseY: -80, baseZ: -30, offsetX: 0, offsetY: 0, offsetZ: 0, speed: 3.0, phase: 0, scale: 0.005, pathType: 'curve-left' },
    { model: 'emperor', baseX: 10, baseY: -80, baseZ: -30, offsetX: -3, offsetY: 1, offsetZ: -1, speed: 3.1, phase: 0.1, scale: 0.016, pathType: 'curve-left' },
    { model: 'fish3', baseX: 10, baseY: -80, baseZ: -30, offsetX: 3, offsetY: -1, offsetZ: -1, speed: 2.9, phase: 0.2, scale: 0.005, pathType: 'curve-left' },
    { model: 'emperor', baseX: 10, baseY: -80, baseZ: -30, offsetX: -6, offsetY: 2, offsetZ: -2, speed: 3.0, phase: 0.3, scale: 0.015, pathType: 'curve-left' },

    // BANC 5 - Abysses
    { model: 'emperor', baseX: -15, baseY: -120, baseZ: -35, offsetX: 0, offsetY: 0, offsetZ: 0, speed: 2.4, phase: 0, scale: 0.017, pathType: 'wave' },
    { model: 'fish3', baseX: -15, baseY: -120, baseZ: -35, offsetX: 4, offsetY: 2, offsetZ: -2, speed: 2.5, phase: 0.1, scale: 0.006, pathType: 'wave' },
    { model: 'emperor', baseX: -15, baseY: -120, baseZ: -35, offsetX: -4, offsetY: -2, offsetZ: -2, speed: 2.3, phase: 0.2, scale: 0.016, pathType: 'wave' },

    // BANC 6 - Fond marin
    { model: 'fish3', baseX: 0, baseY: -160, baseZ: -25, offsetX: 0, offsetY: 0, offsetZ: 0, speed: 2.2, phase: 0, scale: 0.006, pathType: 'curve-right' },
    { model: 'emperor', baseX: 0, baseY: -160, baseZ: -25, offsetX: 5, offsetY: 0, offsetZ: -1, speed: 2.3, phase: 0.1, scale: 0.016, pathType: 'curve-right' },
    { model: 'fish3', baseX: 0, baseY: -160, baseZ: -25, offsetX: -5, offsetY: 0, offsetZ: -1, speed: 2.0, phase: 0.2, scale: 0.006, pathType: 'curve-right' },
    { model: 'emperor', baseX: 0, baseY: -160, baseZ: -25, offsetX: 9, offsetY: 1, offsetZ: -2, speed: 2.2, phase: 0.3, scale: 0.015, pathType: 'curve-right' },
    { model: 'fish3', baseX: 0, baseY: -160, baseZ: -25, offsetX: -9, offsetY: 1, offsetZ: -2, speed: 2.2, phase: 0.4, scale: 0.006, pathType: 'curve-right' },
  ], []);

  // Séparer les données par type pour l'instancing
  const emperorData = useMemo(() => fishData.filter(f => f.model === 'emperor'), [fishData]);
  const fish3Data = useMemo(() => fishData.filter(f => f.model === 'fish3'), [fishData]);

  // Géométries et matériaux extraits
  const emperorGeo = useMemo(() => {
    let geo: THREE.BufferGeometry | null = null;
    emperorFbx.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && !geo) {
        geo = cleanGeometry(child as THREE.Mesh);
      }
    });
    return geo;
  }, [emperorFbx]);

  const fish3Geo = useMemo(() => {
    let geo: THREE.BufferGeometry | null = null;
    fish3Fbx.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && !geo) {
        geo = cleanGeometry(child as THREE.Mesh);
      }
    });
    return geo;
  }, [fish3Fbx]);

  const emperorMat = useMemo(() => new THREE.MeshStandardMaterial({
    map: emperorTextures.map,
    normalMap: emperorTextures.normalMap,
    metalness: 0.3,
    roughness: 0.5,
    side: THREE.DoubleSide,
  }), [emperorTextures]);

  const fish3Mat = useMemo(() => new THREE.MeshStandardMaterial({
    map: fish3Textures.map,
    metalness: 0.3,
    roughness: 0.6,
    side: THREE.DoubleSide,
  }), [fish3Textures]);

  // Calcul position (identique à avant)
  const calculateFishPosition = (fish: FishData, t: number) => {
    const swimProgress = (t * fish.speed + fish.phase * 12) % 120;
    let x, wobbleY, wobbleZ;
    const centeredProgress = swimProgress - 60;

    if (fish.pathType === 'curve-left') {
      const curve = Math.sin(centeredProgress * 0.05) * 3;
      x = centeredProgress + curve;
      wobbleY = Math.sin(t * 2.5 + fish.phase * 3) * 0.4 + Math.sin(centeredProgress * 0.05) * 2;
      wobbleZ = Math.sin(t * 2 + fish.phase * 2) * 0.5;
    } else if (fish.pathType === 'curve-right') {
      const curve = Math.sin(centeredProgress * 0.05) * -3;
      x = -centeredProgress + curve;
      wobbleY = Math.sin(t * 2.3 + fish.phase * 3) * 0.4 + Math.sin(centeredProgress * 0.05) * 2;
      wobbleZ = Math.sin(t * 1.8 + fish.phase * 2) * 0.5;
    } else {
      const wave = Math.sin(centeredProgress * 0.04) * 4;
      x = centeredProgress + wave;
      wobbleY = Math.sin(t * 2.4 + fish.phase * 3) * 0.5 + Math.sin(centeredProgress * 0.06) * 3;
      wobbleZ = Math.sin(t * 2.1 + fish.phase * 2) * 0.6;
    }

    return {
      x: x + fish.offsetX,
      y: fish.baseY + fish.offsetY + wobbleY,
      z: fish.baseZ + fish.offsetZ + wobbleZ
    };
  };

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Update Emperor instances
    if (emperorRef.current) {
      emperorData.forEach((fish: FishData, i: number) => {
        const pos = calculateFishPosition(fish, t);
        const y = pos.y + scrollProgress * 120;

        dummy.position.set(pos.x, y, pos.z);

        // Rotation
        const baseRotationY = fish.pathType === 'curve-right' ? Math.PI : 0;
        const bodyUndulation = Math.sin(t * 5 + fish.phase * 4) * 0.15;

        dummy.rotation.set(
          Math.sin(t * 3 + fish.phase) * 0.03,
          baseRotationY + bodyUndulation,
          Math.sin(t * 4 + fish.phase * 2) * 0.04
        );

        dummy.scale.set(fish.scale, fish.scale, fish.scale);
        dummy.updateMatrix();

        emperorRef.current!.setMatrixAt(i, dummy.matrix);
      });
      emperorRef.current.instanceMatrix.needsUpdate = true;
    }

    // Update Fish3 instances
    if (fish3Ref.current) {
      fish3Data.forEach((fish: FishData, i: number) => {
        const pos = calculateFishPosition(fish, t);
        const y = pos.y + scrollProgress * 120;

        dummy.position.set(pos.x, y, pos.z);

        // Rotation (Fish3 est orienté différemment de base)
        const baseRotationY = fish.pathType === 'curve-right' ? -Math.PI / 2 : Math.PI / 2;
        const bodyUndulation = Math.sin(t * 5 + fish.phase * 4) * 0.15;

        dummy.rotation.set(
          Math.sin(t * 3 + fish.phase) * 0.03,
          baseRotationY + bodyUndulation,
          Math.sin(t * 4 + fish.phase * 2) * 0.04
        );

        dummy.scale.set(fish.scale, fish.scale, fish.scale);
        dummy.updateMatrix();

        fish3Ref.current!.setMatrixAt(i, dummy.matrix);
      });
      fish3Ref.current.instanceMatrix.needsUpdate = true;
    }
  });

  if (!emperorGeo || !fish3Geo) return null;

  return (
    <group ref={groupRef}>
      <instancedMesh
        ref={emperorRef}
        args={[emperorGeo, emperorMat, emperorData.length]}
        frustumCulled={false}
      />
      <instancedMesh
        ref={fish3Ref}
        args={[fish3Geo, fish3Mat, fish3Data.length]}
        frustumCulled={false}
      />
    </group>
  );
}

// ✅ Preload des assets pour éviter le pop-in
useFBX.preload("/models/poisson/Emperor Angelfish/EmperorAngelfish_FBX.fbx");
useFBX.preload("/models/poisson/Fish-3/source/fish_1_5.fbx");
useTexture.preload("/models/poisson/Emperor Angelfish/Emperor-Angelfish-A.png");
useTexture.preload("/models/poisson/Emperor Angelfish/Emperor-Angelfish-N.png");
useTexture.preload("/models/poisson/Fish-3/textures/fish_1_diffuse.jpeg");