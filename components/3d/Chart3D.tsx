'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

interface Chart3DProps {
  data: { label: string; value: number }[];
  type?: 'bar' | 'pie';
}

function Bar({ position, height, label, value, color }: any) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      const targetScale = hovered ? 1.15 : 1.0;
      meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1);
      meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, targetScale, 0.1);
    }
  });

  // Clamp height to ensure it renders even if value is 0
  const adjustedHeight = Math.max(height, 0.1);

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        position={[0, adjustedHeight / 2, 0]}
      >
        <cylinderGeometry args={[0.3, 0.3, adjustedHeight, 32]} />
        <meshStandardMaterial
          color={hovered ? '#00FF88' : color}
          roughness={0.1}
          metalness={0.8}
          emissive={hovered ? '#00FF88' : '#000000'}
          emissiveIntensity={hovered ? 0.4 : 0}
        />
      </mesh>
      
      {/* Floating HTML tooltip */}
      <Html position={[0, adjustedHeight + 0.4, 0]} center distanceFactor={8} className="pointer-events-none select-none">
        <div className={`px-2 py-1 rounded bg-[#050E1A]/95 border border-white/10 text-white font-mono text-[9px] whitespace-nowrap transition-all duration-200 ${hovered ? 'scale-110 border-[#00D4FF]/50 shadow-[0_0_15px_rgba(0,212,255,0.4)]' : 'opacity-80'}`}>
          <div className="font-semibold">{label}</div>
          <div className="text-[#00D4FF] font-bold">${value.toLocaleString()}</div>
        </div>
      </Html>
    </group>
  );
}

function ChartScene({ data }: { data: { label: string; value: number }[] }) {
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const scaleFactor = 3.5; // Target height units

  return (
    <group position={[0, -1.2, 0]}>
      {data.map((d, index) => {
        const height = (d.value / maxVal) * scaleFactor;
        const xPos = (index - (data.length - 1) / 2) * 1.1;
        // Cyan color palette gradient
        const color = index % 2 === 0 ? '#00D4FF' : '#0083B0';
        return (
          <Bar
            key={index}
            position={[xPos, 0, 0]}
            height={height}
            label={d.label}
            value={d.value}
            color={color}
          />
        );
      })}
      
      {/* Holographic grid floor */}
      <gridHelper args={[12, 12, '#00D4FF', '#00D4FF']} position={[0, 0, 0]} />
    </group>
  );
}

export default function Chart3D({ data, type = 'bar' }: Chart3DProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-60 w-full flex items-center justify-center bg-white/5 border border-white/10 rounded-xl backdrop-blur-xl animate-pulse">
        <span className="text-white/40 text-xs font-mono">Loading 3D Visualizer...</span>
      </div>
    );
  }

  // Handle empty chart cases gracefully
  const chartData = data && data.length > 0 ? data : [
    { label: 'Jan', value: 2000 },
    { label: 'Feb', value: 3400 },
    { label: 'Mar', value: 4500 },
    { label: 'Apr', value: 3000 },
    { label: 'May', value: 5500 }
  ];

  return (
    <div className="h-60 w-full bg-white/5 border border-[#00d4ff]/10 rounded-xl backdrop-blur-xl overflow-hidden relative group shadow-[0_0_30px_rgba(0,212,255,0.02)]">
      <div className="absolute top-3 left-4 z-10 flex flex-col select-none pointer-events-none">
        <span className="text-white/40 text-[9px] font-mono tracking-wider uppercase">Analytics 3D Mode</span>
        <span className="text-white font-semibold text-xs">Revenue & Performance Curve</span>
      </div>
      <Canvas camera={{ position: [0, 2.5, 6.5], fov: 42 }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[5, 8, 5]} intensity={1.5} />
        <pointLight position={[-5, 4, -5]} intensity={0.5} />
        <ChartScene data={chartData} />
        <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2.2} minPolarAngle={Math.PI / 6} />
      </Canvas>
    </div>
  );
}
