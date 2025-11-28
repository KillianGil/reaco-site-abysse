"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export function Anglerfish({ scrollProgress }: { scrollProgress: number }) {
  // On utilise un try/catch implicite avec useGLTF, mais on va ajouter un fallback visuel
  const gltf = useGLTF("/models/deep-sea-fish.glb");
  const ref = useRef<THREE.Group>(null);
  const clonedScene = useMemo(() => gltf ? gltf.scene.clone() : null, [gltf]);
  const lightRef = useRef<THREE.PointLight>(null);

  // Position très profonde (le fond est vers 1.8 - 2.0 de scroll)
  const APPEAR_SCROLL = 1.2;

  useFrame((state) => {
    if (!ref.current) return;

    // Apparition progressive quand on arrive au fond
    const isVisible = scrollProgress > APPEAR_SCROLL;
    ref.current.visible = isVisible;

    if (isVisible) {
      const t = state.clock.elapsedTime;

      // Animation d'émergence (monte doucement)
      const emergeProgress = Math.min(1, (scrollProgress - APPEAR_SCROLL) * 3);
      const baseDepth = -190; // Très profond
      const emergeHeight = 20;

      // Position finale
      ref.current.position.y = baseDepth + (emergeProgress * emergeHeight) + Math.sin(t * 0.5) * 2;
      ref.current.position.x = Math.sin(t * 0.3) * 5;
      ref.current.position.z = -15 + Math.sin(t * 0.2) * 2;

      // Rotation menaçante
      ref.current.rotation.y = Math.PI + Math.sin(t * 0.2) * 0.3; // Regarde vers la caméra avec léger mouvement
      ref.current.rotation.z = Math.sin(t * 0.1) * 0.1;

      // Pulse de la lanterne (très lent et effrayant)
      if (lightRef.current) {
        // Battement de coeur irrégulier
        const heartbeat = Math.sin(t * 10) > 0.9 ? 1.5 : 1;
        lightRef.current.intensity = (20 + Math.sin(t * 1.5) * 10) * heartbeat;
      }
    }
  });

  return (
    <group
      ref={ref}
      position={[0, -200, -15]} // Départ très bas
      rotation={[0, Math.PI, 0]}
      visible={false}
    >
      {/* Lanterne TRÈS lumineuse et colorée */}
      <pointLight
        ref={lightRef}
        position={[0, 5, 7]}
        distance={80}
        intensity={30}
        color="#00ffaa"
        decay={1.5}
      />

      {/* Orbe visible de loin */}
      <mesh position={[0, 5, 7]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial color="#ccffdd" toneMapped={false} />
      </mesh>

      {/* Halo volumétrique simulé */}
      <mesh position={[0, 5, 7]}>
        <sphereGeometry args={[2, 16, 16]} />
        <meshBasicMaterial
          color="#00ff88"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
          side={THREE.BackSide}
        />
      </mesh>

      {/* LE POISSON ou FALLBACK */}
      {clonedScene ? (
        <group>
          <primitive
            object={clonedScene}
            scale={12}
          />
          {/* DEBUG LURE: Petite sphère attachée au poisson pour vérifier sa position si le modèle est invisible */}
          <mesh position={[0, 0.5, 3.5]}>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshBasicMaterial color="cyan" />
          </mesh>
        </group>
      ) : (
        // Fallback si le modèle ne charge pas (cube rouge effrayant)
        <mesh scale={[5, 5, 10]}>
          <boxGeometry />
          <meshStandardMaterial color="red" wireframe />
        </mesh>
      )}

      {/* Yeux brillants dans le noir */}
      <pointLight position={[1.5, 1, 4]} intensity={5} color="#ffff00" distance={10} />
      <pointLight position={[-1.5, 1, 4]} intensity={5} color="#ffff00" distance={10} />

      <mesh position={[1.5, 1, 4]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial color="#ffffaa" toneMapped={false} />
      </mesh>
      <mesh position={[-1.5, 1, 4]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial color="#ffffaa" toneMapped={false} />
      </mesh>
    </group>
  );
}

useGLTF.preload("/models/deep-sea-fish.glb");