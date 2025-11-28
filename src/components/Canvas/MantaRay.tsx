// components/Canvas/MantaRay.tsx
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface MantaRayProps {
    scrollProgress: number;
}

export function MantaRay({ scrollProgress }: MantaRayProps) {
    const { scene } = useGLTF("/models/manta.glb");
    const groupRef = useRef<THREE.Group>(null);

    useFrame(({ clock }) => {
        if (!groupRef.current) return;
        const t = clock.getElapsedTime();

        // Apparition entre la méduse et les plantes (0.6 - 0.9)
        const isVisible = scrollProgress > 0.6 && scrollProgress < 0.95;
        groupRef.current.visible = isVisible;

        if (isVisible) {
            // Nage majestueuse (plus lente que le requin)
            // Traverse l'écran en diagonale
            const swimProgress = (t * 0.08) % 1; // Très lent

            // Trajectoire large
            const xPos = 20 - swimProgress * 40; // De droite à gauche
            const yPos = -65 + Math.sin(t * 0.5) * 3; // Ondulation verticale douce
            const zPos = -25 + Math.cos(t * 0.3) * 5; // Profondeur variable

            groupRef.current.position.set(xPos, yPos, zPos);

            // Rotation fluide
            groupRef.current.rotation.y = -Math.PI / 2 + Math.sin(t * 0.5) * 0.2; // Cap vers la gauche avec variation
            groupRef.current.rotation.z = Math.sin(t * 1) * 0.15; // Roulis (banking)
            groupRef.current.rotation.x = Math.sin(t * 0.5) * 0.1; // Tangage
        }
    });

    return (
        <group ref={groupRef} visible={false}>
            <primitive
                object={scene}
                scale={3.5} // Imposante
            />
        </group>
    );
}

useGLTF.preload("/models/manta.glb");
