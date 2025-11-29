
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
    const { scene, animations } = useGLTF("/models/manta_ray.glb");
    const { actions } = useAnimations(animations, scene);
    const groupRef = useRef<THREE.Group>(null);

    // Plage de visibilité
    const START_SCROLL = 0.35;
    const END_SCROLL = 0.75;

    useEffect(() => {
        // Jouer les animations si présentes
        if (actions) {
            const actionKeys = Object.keys(actions);
            if (actionKeys.length > 0) {
                actionKeys.forEach(key => {
                    const action = actions[key];
                    if (action) {
                        action.reset().fadeIn(0.5).play();
                        action.timeScale = 0.6; // Nage lente et majestueuse
                    }
                });
            }
        }

        // Configurer UNIQUEMENT la transparence pour conserver la texture originale
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                if (mesh.material) {
                    const mat = mesh.material as THREE.MeshStandardMaterial;
                    // Ne modifier QUE la transparence, garder toutes les autres propriétés
                    mat.transparent = true;
                    mat.opacity = 0; // Commence invisible pour le fade-in
                    // NE PAS modifier roughness, metalness, map, color, etc.
                }
            }
        });
    }, [scene, actions]);

    useFrame(({ clock }) => {
        if (!groupRef.current) return;
        const t = clock.getElapsedTime();

        // Gestion visibilité avec FADE
        const isVisibleRange = scrollProgress > START_SCROLL - 0.1 && scrollProgress < END_SCROLL + 0.1;

        // Calcul de l'opacité cible
        let targetOpacity = 0;
        if (isVisibleRange) {
            const distFromStart = scrollProgress - (START_SCROLL - 0.1);
            const distFromEnd = (END_SCROLL + 0.1) - scrollProgress;
            const fade = Math.min(distFromStart, distFromEnd) * 6;
            targetOpacity = Math.max(0, Math.min(1.0, fade));
        }

        // Appliquer l'opacité progressivement
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                if (mesh.material) {
                    const mat = mesh.material as THREE.MeshStandardMaterial;
                    mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.1);
                }
            }
        });

        groupRef.current.visible = true;

        // Position qui suit le scroll
        const cameraY = scrollProgress * 100;

        // Mouvement de nage lent
        const swimProgress = (t * 0.04) % 1;

        // Trajectoire latérale - COMMENCE HORS ÉCRAN à droite
        const floatX = 30 - swimProgress * 55; // De droite (hors écran) à gauche (hors écran)
        const floatY = Math.sin(t * 0.4) * 6; // Ondulation verticale douce
        const floatZ = Math.cos(t * 0.25) * 10; // Profondeur variable

        // Position finale
        groupRef.current.position.set(
            floatX,
            -55 + cameraY + floatY, // Un peu plus bas que la méduse
            -22 + floatZ // Assez proche mais pas trop
        );

        // Rotation fluide et naturelle
        const targetRotationY = -Math.PI / 2 + Math.sin(t * 0.4) * 0.15;
        const targetRotationZ = Math.sin(t * 0.8) * 0.1;
        const targetRotationX = Math.sin(t * 0.4) * 0.06;

        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.05);
        groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotationZ, 0.05);
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.05);

        // Pulsation légère (respiration)
        const pulse = Math.sin(t * 1.5) * 0.03;
        const baseScale = 1.4; // Réduit pour être plus naturel et proportionnel
        groupRef.current.scale.set(
            baseScale + pulse,
            baseScale - pulse * 0.5,
            baseScale + pulse
        );
    });

    return (
        <group ref={groupRef}>
            <primitive object={scene} />
        </group>
    );
}

useGLTF.preload("/models/manta_ray.glb");
