"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface GodraysProps {
  scrollProgress: number;
}

export function Godrays({ scrollProgress }: GodraysProps) {
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
        
        // Simplex noise
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
        
        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy));
          vec2 x0 = v - i + dot(i, C.xx);
          vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m;
          m = m*m;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }
        
        void main() {
          // Rayons qui bougent
          float noise1 = snoise(vec2(vPosition.x * 0.1 + uTime * 0.05, vPosition.z * 0.1));
          float noise2 = snoise(vec2(vPosition.x * 0.15 - uTime * 0.03, vPosition.z * 0.12));
          
          float rays = noise1 * 0.6 + noise2 * 0.4;
          rays = smoothstep(0.3, 0.7, rays);
          
          // Fade avec la profondeur
          float depthFade = 1.0 - vUv.y;
          depthFade = pow(depthFade, 1.5);
          
          // Couleur cyan-vert océan
          vec3 color = mix(vec3(0.4, 0.7, 0.9), vec3(0.6, 0.9, 1.0), rays);
          
          float alpha = rays * depthFade * uOpacity * 0.15;
          
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
      // Disparaît progressivement en profondeur
      shaderMaterial.uniforms.uOpacity.value = Math.max(0, 1 - scrollProgress * 1.2);
    }
  });

  if (scrollProgress > 0.7) return null;

  return (
    <mesh
      ref={meshRef}
      position={[0, 45, -20]}
      rotation={[-Math.PI / 3, 0, 0]}
      scale={[60, 80, 1]}
    >
      <planeGeometry args={[1, 1, 64, 64]} />
      <primitive object={shaderMaterial} attach="material" />
    </mesh>
  );
}