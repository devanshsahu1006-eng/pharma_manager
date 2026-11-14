'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Particles() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 800;

  const [positions, phases] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const phs = new Float32Array(count);
    let index = 0;
    for (let i = 0; i < count; i++) {
      // Circular distribution
      const theta = Math.random() * 2.0 * Math.PI;
      const r = 12 + Math.random() * 18;
      
      pos[index++] = r * Math.cos(theta);
      pos[index++] = (Math.random() - 0.5) * 15;
      pos[index++] = r * Math.sin(theta);

      phs[i] = Math.random() * Math.PI * 2;
    }
    return [pos, phs];
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.015;
      pointsRef.current.rotation.x = Math.sin(time * 0.05) * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#00D4FF"
        size={0.12}
        sizeAttenuation={true}
        transparent={true}
        opacity={0.5}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function SceneBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="fixed inset-0 -z-10 bg-[#050E1A]" />;
  }

  return (
    <div className="fixed inset-0 -z-10 bg-[#050E1A] overflow-hidden pointer-events-none">
      {/* Neon mesh / blur effect backdrops */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#00D4FF]/5 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#00FF88]/5 blur-[120px]" />
      
      <Canvas camera={{ position: [0, 0, 25], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <Particles />
      </Canvas>
    </div>
  );
}
