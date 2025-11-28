"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Submarine } from "./Submarine";
import { OceanEnvironment } from "./OceanEnvironment";
import { FishSchool } from "./FishSchool";
import { Anglerfish } from "./Anglerfish";
import { OceanDecorations } from "./OceanDecorations";
import { FastFish } from "./FastFish";
import { Seaweed } from "./SeaWeed";
import { Jellyfish } from "./JellyFish";
import { MantaRay } from "./MantaRay";

interface SceneProps {
  scrollProgress: number;
}

function createCircleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// ✅ MARINE SNOW OPTIMISÉ
function MarineSnow({ scrollProgress }: { scrollProgress: number }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, velocities } = useMemo(() => {
    const count = 800; // Augmenté pour plus de réalisme
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 120;
      pos[i * 3 + 1] = Math.random() * 350 - 175;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 100 - 20;

      vel[i * 3] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 1] = -Math.random() * 0.05 - 0.02;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }

    return { positions: pos, velocities: vel };
  }, []);

  useFrame(() => {
    if (!ref.current) return;

    const posArray = ref.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < posArray.length / 3; i++) {
      posArray[i * 3] += velocities[i * 3];
      posArray[i * 3 + 1] += velocities[i * 3 + 1];
      posArray[i * 3 + 2] += velocities[i * 3 + 2];

      // Reset si trop bas
      if (posArray[i * 3 + 1] < -175) {
        posArray[i * 3 + 1] = 175;
        posArray[i * 3] = (Math.random() - 0.5) * 120;
      }
    }

    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.position.y = scrollProgress * 100;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={800}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#ffffff"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        alphaTest={0.01}
        map={createCircleTexture()}
      />
    </points>
  );
}

// ✅ WATER CAUSTICS (lumière qui danse)
function WaterCaustics({ scrollProgress }: { scrollProgress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 1 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uOpacity;
        varying vec2 vUv;
        
        float caustic(vec2 uv, float time) {
          vec2 p = mod(uv * 6.0 + vec2(time * 0.2, time * 0.15), 1.0) - 0.5;
          float d = length(p);
          float c = sin(d * 15.0 - time * 2.0) * 0.5 + 0.5;
          c *= 1.0 - smoothstep(0.3, 0.5, d);
          return pow(c, 3.0);
        }
        
        void main() {
          float c1 = caustic(vUv, uTime);
          float c2 = caustic(vUv * 1.3 + 0.5, uTime * 1.1);
          float c3 = caustic(vUv * 0.8 + 0.25, uTime * 0.9);
          
          float caustics = (c1 + c2 * 0.6 + c3 * 0.4) * 1.5;
          
          vec3 color = vec3(0.7, 0.9, 1.0);
          float alpha = caustics * uOpacity * 0.4;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      material.uniforms.uTime.value = state.clock.elapsedTime;
      material.uniforms.uOpacity.value = Math.max(0, 1 - scrollProgress * 1.5);
    }
  });

  if (scrollProgress > 0.6) return null;

  return (
    <mesh
      ref={meshRef}
      position={[0, 35, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={[150, 150, 1]}
    >
      <planeGeometry args={[1, 1, 1, 1]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

// ✅ VOLUMETRIC LIGHT RAYS
function VolumetricLight({ scrollProgress }: { scrollProgress: number }) {
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

export function Scene({ scrollProgress }: SceneProps) {
  return (
    <div className="canvas-container">
      <Canvas
        camera={{
          position: [0, 0, 12],
          fov: 50,
          near: 0.1,
          far: 500
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        style={{ background: "#006994" }}
      >
        <color attach="background" args={["#006994"]} />

        <Suspense fallback={null}>
          <OceanEnvironment scrollProgress={scrollProgress} />

          {/* ✅ Effets visuels */}
          <WaterCaustics scrollProgress={scrollProgress} />
          <VolumetricLight scrollProgress={scrollProgress} />
          <MarineSnow scrollProgress={scrollProgress} />

          <OceanDecorations scrollProgress={scrollProgress} />
          {/* ✅ Créatures */}
          <Submarine scrollProgress={scrollProgress} />
          <Jellyfish scrollProgress={scrollProgress} />
          <FishSchool scrollProgress={scrollProgress} />
          <FastFish scrollProgress={scrollProgress} />
          <Seaweed scrollProgress={scrollProgress} />
          <MantaRay scrollProgress={scrollProgress} />
          <Anglerfish scrollProgress={scrollProgress} />
        </Suspense>
      </Canvas>
    </div>
  );
}