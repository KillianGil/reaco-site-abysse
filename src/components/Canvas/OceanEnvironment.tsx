"use client";

import { useMemo, useRef, memo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollProgressRef } from "./Scene";

interface OceanEnvironmentProps {
  scrollProgress: number;
}

export const OceanEnvironment = memo(function OceanEnvironment({ }: OceanEnvironmentProps) {
  const { scene } = useThree();
  const scrollProgressRef = useScrollProgressRef();

  // Refs pour les lumières (évite les re-renders)
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const fillRef = useRef<THREE.DirectionalLight>(null);
  const bottomRef = useRef<THREE.DirectionalLight>(null);

  // ✅ COULEURS OCÉAN RÉALISTES avec vraie progression de profondeur
  const colors = useMemo(() => ({
    surface: new THREE.Color("#006994"),     // Bleu océan profond (plus élégant)
    shallow: new THREE.Color("#005b82"),     // Bleu légèrement plus sombre
    mid: new THREE.Color("#004e70"),         // Bleu-gris profond
    deep: new THREE.Color("#00334d"),        // Bleu nuit
    abyss: new THREE.Color("#001a29"),       // Presque noir
    hadal: new THREE.Color("#000d14"),       // Noir total
  }), []);

  // FIX FLASH: Set initial background immediately on mount
  useMemo(() => {
    scene.background = colors.surface.clone();
    return null;
  }, [scene, colors.surface]);

  useFrame(() => {
    const progress = scrollProgressRef.current;
    const t = Math.min(progress, 1);

    // ✅ INTERPOLATION PAR ÉTAPES pour des transitions réalistes
    let bgColor;

    if (t < 0.15) {
      // Surface → Peu profond (0-15m) - Transition plus rapide
      const localT = t / 0.15;
      bgColor = colors.surface.clone().lerp(colors.shallow, localT);
    } else if (t < 0.3) {
      // Peu profond → Zone crépusculaire (15-30m) - Arrive plus vite
      const localT = (t - 0.15) / 0.15;
      bgColor = colors.shallow.clone().lerp(colors.mid, localT);
    } else if (t < 0.5) {
      // Zone crépusculaire → Profondeur (30-50m) - Sombre dès la moitié
      const localT = (t - 0.3) / 0.2;
      bgColor = colors.mid.clone().lerp(colors.deep, localT);
    } else if (t < 0.8) {
      // Profondeur → Abysses (50-80m)
      const localT = (t - 0.5) / 0.3;
      bgColor = colors.deep.clone().lerp(colors.abyss, localT);
    } else {
      // Abysses → Hadal (80m+)
      const localT = (t - 0.8) / 0.2;
      bgColor = colors.abyss.clone().lerp(colors.hadal, localT);
    }

    scene.background = bgColor;

    // ✅ FOG RÉALISTE avec densité exponentielle
    if (scene.fog instanceof THREE.FogExp2) {
      scene.fog.color.copy(bgColor);

      // Densité augmente exponentiellement avec la profondeur
      // Surface: presque pas de fog, Abysses: fog très dense
      const baseDensity = 0.003; // Très clair en surface
      const maxDensity = 0.025;  // Très dense en profondeur
      const fogCurve = Math.pow(t, 1.5); // Courbe exponentielle
      scene.fog.density = baseDensity + (maxDensity - baseDensity) * fogCurve;
    }

    // ✅ Mise à jour des lumières via refs (pas de re-render)
    if (ambientRef.current) {
      ambientRef.current.intensity = Math.max(0.3, 0.8 * (1 - progress * 0.7));
    }
    if (sunRef.current) {
      sunRef.current.intensity = Math.max(0, 1.5 * (1 - progress * 1.2));
    }
    if (fillRef.current) {
      fillRef.current.intensity = Math.max(0, 0.6 * (1 - progress));
    }
    if (bottomRef.current) {
      bottomRef.current.intensity = 0.2 * (1 - progress * 0.5);
    }
  });

  return (
    <>
      {/* Fog exponentiel pour profondeur réaliste */}
      <fogExp2 attach="fog" args={["#2d9cbc", 0.003]} />

      {/* Lumière ambiante bleutée océanique */}
      <ambientLight ref={ambientRef} intensity={0.8} color="#5ba8c8" />

      {/* Soleil (surface) - disparaît en profondeur */}
      <directionalLight
        ref={sunRef}
        position={[15, 60, 25]}
        intensity={1.5}
        color="#c8e8ff"
      />

      {/* Lumière de remplissage (reflets) */}
      <directionalLight
        ref={fillRef}
        position={[-20, 40, 15]}
        intensity={0.6}
        color="#88bbdd"
      />

      {/* Lumière douce d'en bas (diffusion) - très subtile */}
      <directionalLight
        ref={bottomRef}
        position={[0, -30, 0]}
        intensity={0.2}
        color="#3a5f78"
      />
    </>
  );
});
