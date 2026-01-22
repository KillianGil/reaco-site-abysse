"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useRef, useMemo, memo, useEffect, createContext, useContext } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
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
import { useAccessibility } from "@/contexts/AccessibilityContext";

// Configure Draco decoder globally for all GLTF models
// MeshOpt decoder is loaded automatically by drei when meshoptimizer package is installed
useGLTF.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");

// Scroll progress ref context - permet aux composants 3D de lire sans re-render
const ScrollProgressRefContext = createContext<React.MutableRefObject<number>>({ current: 0 });
export const useScrollProgressRef = () => useContext(ScrollProgressRefContext);

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

// Texture cache - created once outside component
let circleTextureCache: THREE.CanvasTexture | null = null;
function getCircleTexture() {
  if (circleTextureCache) return circleTextureCache;
  circleTextureCache = createCircleTexture();
  return circleTextureCache;
}

// MARINE SNOW OPTIMISÉ - lit depuis le ref context
const MarineSnow = memo(function MarineSnow() {
  const ref = useRef<THREE.Points>(null);
  const scrollProgressRef = useScrollProgressRef();

  // Cache texture in useMemo
  const circleTexture = useMemo(() => getCircleTexture(), []);

  const { positions, velocities } = useMemo(() => {
    const count = 600;
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
    const count = posArray.length / 3;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      posArray[i3] += velocities[i3];
      posArray[i3 + 1] += velocities[i3 + 1];
      posArray[i3 + 2] += velocities[i3 + 2];

      if (posArray[i3 + 1] < -175) {
        posArray[i3 + 1] = 175;
        posArray[i3] = (Math.random() - 0.5) * 120;
      }
    }

    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.position.y = scrollProgressRef.current * 100;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={600}
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
        map={circleTexture}
      />
    </points>
  );
});

// CAUSTICS - lit depuis le ref context
const WaterCaustics = memo(function WaterCaustics() {
  const meshRef = useRef<THREE.Mesh>(null);
  const scrollProgressRef = useScrollProgressRef();
  const visibleRef = useRef(true);

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
          vec2 p = mod(uv * 4.5 + vec2(time * 0.25, time * 0.18), 1.0) - 0.5;
          float d = length(p);
          float c = sin(d * 18.0 - time * 2.5) * 0.5 + 0.5;
          c += sin(d * 12.0 - time * 1.8) * 0.3;
          c *= 1.0 - smoothstep(0.25, 0.6, d);
          return pow(c, 2.5);
        }

        void main() {
          float c1 = caustic(vUv, uTime);
          float c2 = caustic(vUv * 1.5 + 0.5, uTime * 1.2);
          float c3 = caustic(vUv * 0.9 + 0.25, uTime * 0.85);
          float c4 = caustic(vUv * 1.8 + 0.7, uTime * 0.7);
          float caustics = (c1 * 1.2 + c2 * 0.8 + c3 * 0.6 + c4 * 0.5) * 2.0;
          vec3 color = vec3(0.6, 0.85, 1.0);
          float alpha = caustics * uOpacity * 0.65;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  useFrame((state) => {
    const progress = scrollProgressRef.current;
    visibleRef.current = progress <= 0.7;

    if (meshRef.current && visibleRef.current) {
      meshRef.current.visible = true;
      material.uniforms.uTime.value = state.clock.elapsedTime;
      material.uniforms.uOpacity.value = Math.max(0, 1 - progress * 1.2);
    } else if (meshRef.current) {
      meshRef.current.visible = false;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, 35, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={[180, 180, 1]}
    >
      <planeGeometry args={[1, 1, 1, 1]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
});

// VOLUMETRIC LIGHT RAYS - lit depuis le ref context
const VolumetricLight = memo(function VolumetricLight() {
  const meshRef = useRef<THREE.Mesh>(null);
  const scrollProgressRef = useScrollProgressRef();

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
    const progress = scrollProgressRef.current;
    if (meshRef.current) {
      meshRef.current.visible = progress <= 0.6;
      if (meshRef.current.visible) {
        shaderMaterial.uniforms.uTime.value = state.clock.elapsedTime;
        shaderMaterial.uniforms.uOpacity.value = Math.max(0, 1 - progress * 1.8);
      }
    }
  });

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
});

// Contenu interne
const SceneContent = memo(function SceneContent({ scrollProgress, reducedMotion }: { scrollProgress: number; reducedMotion: boolean }) {
  return (
    <>
      <color attach="background" args={["#006994"]} />

      <Suspense fallback={null}>
        <OceanEnvironment scrollProgress={scrollProgress} />

        {/* Effets visuels optimisés - lisent depuis le ref context */}
        {!reducedMotion && <WaterCaustics />}
        {!reducedMotion && <VolumetricLight />}
        {!reducedMotion && <MarineSnow />}

        <OceanDecorations scrollProgress={scrollProgress} />
        {/* Créatures */}
        <Submarine scrollProgress={scrollProgress} />
        <Jellyfish scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
        <FishSchool scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
        <FastFish scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
        <Seaweed scrollProgress={scrollProgress} />
        <MantaRay scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
        <Anglerfish scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
      </Suspense>
    </>
  );
});

export const Scene = memo(function Scene({ scrollProgress }: SceneProps) {
  const { reducedMotion } = useAccessibility();
  const scrollProgressRef = useRef(scrollProgress);

  // Update ref without causing re-renders
  useEffect(() => {
    scrollProgressRef.current = scrollProgress;
  }, [scrollProgress]);

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
        <ScrollProgressRefContext.Provider value={scrollProgressRef}>
          <SceneContent scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
        </ScrollProgressRefContext.Provider>
      </Canvas>
    </div>
  );
});