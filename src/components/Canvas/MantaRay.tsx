
// components/Canvas/MantaRay.tsx
"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

interface MantaRayProps {
    scrollProgress: number;
}

export function MantaRay({ scrollProgress }: MantaRayProps) {
    // RETOUR AUX SOURCES : On charge la scène brute, sans clonage ni modification de matériau
    // Cela devrait garantir que la texture originale s'affiche correctement
    const { scene, animations } = useGLTF("/models/manta-final.glb");
    const { actions } = useAnimations(animations, scene);
    const groupRef = useRef<THREE.Group>(null);

    // Plage de visibilité
    const START_SCROLL = 0.35;
    const END_SCROLL = 0.75;

    useEffect(() => {
        if (actions) {
            const actionKeys = Object.keys(actions);
            if (actionKeys.length > 0) {
                actionKeys.forEach(key => {
                    const action = actions[key];
                    if (action) {
                        action.reset().fadeIn(0.5).play();
                        action.timeScale = 1.5; // Animation plus rapide pour nage fluide
                    }
                });
            }
        }
    }, [actions]);

    useFrame(({ clock }) => {
        if (!groupRef.current) return;
        const t = clock.getElapsedTime();

        // Visible UNIQUEMENT pendant la plage de scroll (comme une "fenêtre")
        const scrollInRange = scrollProgress >= START_SCROLL && scrollProgress <= END_SCROLL;
        groupRef.current.visible = scrollInRange;

        if (scrollInRange) {
            // MOUVEMENT AUTONOME basé sur le TEMPS
            // Ajustement pour qu'elle commence HORS ÉCRAN quand on entre dans la plage
            const timeOffset = START_SCROLL * 50; // Offset basé sur le scroll start
            const swimProgress = ((t + timeOffset) * 0.03) % 1; // Cycle de 33 secondes

            // Traverse de droite à gauche de façon autonome
            const floatX = 50 - swimProgress * 90; // De 50 (hors écran droite) à -40 (hors écran gauche)
            const floatY = Math.sin(t * 0.7) * 6; // Ondulation naturelle
            const floatZ = Math.cos(t * 0.5) * 7;

            // Position finale AVEC cameraY pour rester visible
            const cameraY = scrollProgress * 100;
            groupRef.current.position.set(
                floatX,
                -55 + cameraY + floatY,
                -22 + floatZ
            );

            // Rotation fluide basée sur le temps
            const targetRotationY = -Math.PI / 2 + Math.sin(t * 0.6) * 0.18;
            const targetRotationZ = Math.sin(t * 0.8) * 0.12;
            const targetRotationX = Math.sin(t * 0.6) * 0.1;

            // Lerp ENCORE PLUS rapide pour fluidité maximale
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.3);
            groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotationZ, 0.3);
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.3);
        }

        // Taille naturelle
        const baseScale = 0.9;
        groupRef.current.scale.set(baseScale, baseScale, baseScale);
    });

    return (
        <group ref={groupRef}>
            <primitive object={scene} />
        </group>
    );
}

useGLTF.preload("/models/manta-final.glb");
