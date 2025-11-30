// components/Canvas/Godrays.tsx
"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface GodRaysProps {
  scrollProgress: number;
}

export function Godrays({ scrollProgress }: GodRaysProps) {
  const groupRef = useRef<THREE.Group>(null);
}

