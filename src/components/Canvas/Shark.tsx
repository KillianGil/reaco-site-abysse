// components/Canvas/Shark.tsx
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface SharkProps {
    scrollProgress: number;
}

export function Shark({ scrollProgress }: SharkProps) {
    // On utilise le modèle "deep-sea-fish2" qui est plus stable que le Manta
    const { scene } = useGLTF("/models/deep-sea-fish2.glb");
    const groupRef = useRef<THREE.Group>(null);

    useFrame(({ clock }) => {
        if (!groupRef.current) return;
        const t = clock.getElapsedTime();

        // Apparition à mi-profondeur (entre 0.6 et 0.9)
        const isVisible = scrollProgress > 0.6 && scrollProgress < 0.95;
        groupRef.current.visible = isVisible;

        if (isVisible) {
            // Mouvement de nage (sinusoïdal)
            // Il traverse l'écran de droite à gauche
            const swimProgress = (t * 0.1) % 1; // 0 à 1 en boucle
            const xPos = 15 - swimProgress * 30; // De +15 à -15

            groupRef.current.position.set(
                xPos,
                -60 + Math.sin(t * 0.5) * 2, // Hauteur variable
                -20 // Profondeur
            );

            // Rotation pour faire face à la direction (vers la gauche)
            groupRef.current.rotation.y = -Math.PI / 2 + Math.sin(t * 2) * 0.1;
            groupRef.current.rotation.z = Math.sin(t * 1) * 0.05;
        }
    });

    return (
        <group ref={groupRef} visible={false}>
            <primitive
                object={scene}
                scale={2} // Assez gros
            />
        </group>
    );
}

useGLTF.preload("/models/deep-sea-fish2.glb");
