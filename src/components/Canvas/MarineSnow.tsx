"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function MarineSnow({ scrollProgress }: { scrollProgress: number }) {
    const ref = useRef<THREE.Points>(null);

    const { positions, velocities } = useMemo(() => {
        const count = 800; // Augmenté pour plus de réalisme
        const pos = new Float32Array(count * 3);
        const vel = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 120;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 120;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 50 - 10;

            vel[i * 3] = (Math.random() - 0.5) * 0.02;
            vel[i * 3 + 1] = -Math.random() * 0.05 - 0.01; // Tombe vers le bas
            vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
        }

        return { positions: pos, velocities: vel };
    }, []);

    useFrame(() => {
        if (!ref.current) return;

        const positionsAttribute = ref.current.geometry.attributes.position;

        for (let i = 0; i < 800; i++) {
            let x = positionsAttribute.getX(i);
            let y = positionsAttribute.getY(i);
            let z = positionsAttribute.getZ(i);

            x += velocities[i * 3];
            y += velocities[i * 3 + 1];
            z += velocities[i * 3 + 2];

            // Reset si sort de la zone
            if (y < -60) y = 60;

            positionsAttribute.setXYZ(i, x, y, z);
        }

        positionsAttribute.needsUpdate = true;

        // Suivre le scroll (pour donner l'impression qu'on descend)
        ref.current.position.y = scrollProgress * 100;
    });

    const texture = useMemo(() => {
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

        const t = new THREE.CanvasTexture(canvas);
        t.needsUpdate = true;
        return t;
    }, []);

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                map={texture}
                size={0.4}
                transparent
                opacity={0.6}
                vertexColors={false}
                color="#ffffff"
                sizeAttenuation
                depthWrite={false}
            />
        </points>
    );
}
