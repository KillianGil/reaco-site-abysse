"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function VolumetricLight({ scrollProgress }: { scrollProgress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 1 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uOpacity;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          float rays = sin(vPosition.x * 0.2 + uTime * 0.3) * 0.5 + 0.5;
          rays *= sin(vPosition.z * 0.15 - uTime * 0.2) * 0.5 + 0.5;
          
          float fade = 1.0 - vUv.y;
          fade = pow(fade, 2.0);
          
          vec3 color = vec3(0.6, 0.8, 1.0);
          float alpha = rays * fade * uOpacity * 0.15;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      shaderMaterial.uniforms.uTime.value = state.clock.elapsedTime;
      shaderMaterial.uniforms.uOpacity.value = Math.max(0, 1 - scrollProgress * 1.8);
    }
  });

  if (scrollProgress > 0.6) return null;

  return (
    <mesh
      ref={meshRef}
      position={[0, 40, -25]}
      rotation={[-Math.PI / 2.5, 0, 0]}
      scale={[80, 60, 1]}
    >
      <planeGeometry args={[1, 1, 32, 32]} />
      <primitive object={shaderMaterial} attach="material" />
    </mesh>
  );
}