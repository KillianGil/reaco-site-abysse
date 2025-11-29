"use client";

import { useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface OceanEnvironmentProps {
  scrollProgress: number;
}

export function OceanEnvironment({ scrollProgress }: OceanEnvironmentProps) {
  const { scene } = useThree();

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
    const t = Math.min(scrollProgress, 1);

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
  });

  // Lumière ambiante qui diminue avec la profondeur
  const ambientIntensity = Math.max(0.3, 0.8 * (1 - scrollProgress * 0.7));

  // Lumière directionnelle (soleil) qui disparaît progressivement
  const sunIntensity = Math.max(0, 1.5 * (1 - scrollProgress * 1.2));

  // Lumière de remplissage légère (reflets de surface)
  const fillIntensity = Math.max(0, 0.6 * (1 - scrollProgress));

  return (
    <>
      {/* Fog exponentiel pour profondeur réaliste */}
      <fogExp2 attach="fog" args={["#2d9cbc", 0.003]} />

      {/* Lumière ambiante bleutée océanique */}
      <ambientLight intensity={ambientIntensity} color="#5ba8c8" />

      {/* Soleil (surface) - disparaît en profondeur */}
      <directionalLight
        position={[15, 60, 25]}
        intensity={sunIntensity}
        color="#c8e8ff"
      />

      {/* Lumière de remplissage (reflets) */}
      <directionalLight
        position={[-20, 40, 15]}
        intensity={fillIntensity}
        color="#88bbdd"
      />

      {/* Lumière douce d'en bas (diffusion) - très subtile */}
      <directionalLight
        position={[0, -30, 0]}
        intensity={0.2 * (1 - scrollProgress * 0.5)}
        color="#3a5f78"
      />
    </>
  );
}
