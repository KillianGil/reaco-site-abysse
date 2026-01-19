
// components/Canvas/MantaRay.tsx
"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

interface MantaRayProps {
    scrollProgress: number;
    reducedMotion?: boolean;
}

export function MantaRay({ scrollProgress, reducedMotion = false }: MantaRayProps) {
    // RETOUR AUX SOURCES : On charge la scène brute, sans clonage ni modification de matériau
    // Cela devrait garantir que la texture originale s'affiche correctement
    const { scene, animations } = useGLTF("/models/manta-final.glb", true);
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
                        if (reducedMotion) {
                            // En mode calme, mettre en pause l'animation
                            action.paused = true;
                        } else {
                            action.paused = false;
                            if (!action.isRunning()) {
                                action.reset().fadeIn(0.5).play();
                            }
                            action.timeScale = 1.5;
                        }
                    }
                });
            }
        }
    }, [actions, reducedMotion]);

    // Temps figé et offset pour reprise fluide
    const frozenTimeRef = useRef<number>(0);
    const timeOffsetRef = useRef<number>(0);
    const wasReducedRef = useRef<boolean>(false);

    useFrame(({ clock }) => {
        if (!groupRef.current) return;

        // Visible UNIQUEMENT pendant la plage de scroll (comme une "fenêtre")
        const scrollInRange = scrollProgress >= START_SCROLL && scrollProgress <= END_SCROLL;
        groupRef.current.visible = scrollInRange;

        if (scrollInRange) {
            const realTime = clock.getElapsedTime();

            // Détection du changement de mode pour reprise fluide
            if (reducedMotion && !wasReducedRef.current) {
                frozenTimeRef.current = realTime - timeOffsetRef.current;
            } else if (!reducedMotion && wasReducedRef.current) {
                timeOffsetRef.current = realTime - frozenTimeRef.current;
            }
            wasReducedRef.current = reducedMotion;

            // Temps d'animation avec reprise fluide
            const t = reducedMotion ? frozenTimeRef.current : realTime - timeOffsetRef.current;

            // MOUVEMENT AUTONOME basé sur le TEMPS - figé en mode calme
            const timeOffset = START_SCROLL * 50;
            const swimProgress = reducedMotion ? 0.5 : ((t + timeOffset) * 0.08) % 1; // Position centrale en mode calme

            // Traverse de droite à gauche - figée au centre en mode calme
            const floatX = 50 - swimProgress * 90;
            const floatY = reducedMotion ? 0 : Math.sin(t * 0.7) * 6;
            const floatZ = reducedMotion ? 0 : Math.cos(t * 0.5) * 7;

            // Position finale AVEC cameraY pour rester visible
            const cameraY = scrollProgress * 100;
            groupRef.current.position.set(
                floatX,
                -55 + cameraY + floatY,
                -22 + floatZ
            );

            // Rotation fluide - figée en mode calme
            const targetRotationY = reducedMotion ? -Math.PI / 2 : -Math.PI / 2 + Math.sin(t * 0.6) * 0.18;
            const targetRotationZ = reducedMotion ? 0 : Math.sin(t * 0.8) * 0.12;
            const targetRotationX = reducedMotion ? 0 : Math.sin(t * 0.6) * 0.1;

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

useGLTF.preload("/models/manta-final.glb", true);
