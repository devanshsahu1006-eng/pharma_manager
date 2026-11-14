'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: LucideIcon;
  color?: 'cyan' | 'green' | 'red' | 'amber';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 50, damping: 15 });
  const displayValue = useTransform(springValue, (latest) => {
    return `${prefix}${Math.floor(latest).toLocaleString()}${suffix}`;
  });

  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  // Subscribe to changes because react-three/framer-motion sometimes doesn't update direct DOM text elements unless we trigger it
  useEffect(() => {
    return displayValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = latest;
      }
    });
  }, [displayValue]);

  return <span ref={ref} className="font-sans font-bold text-2xl md:text-3xl text-white tracking-tight">{prefix}{value.toLocaleString()}{suffix}</span>;
}

export default function KPICard({ title, value, prefix = '', suffix = '', icon: Icon, color = 'cyan', trend }: KPICardProps) {
  const colorMap = {
    cyan: {
      border: 'hover:border-[#00D4FF]/30',
      glow: 'group-hover:shadow-[0_0_30px_rgba(0,212,255,0.08)]',
      iconBg: 'bg-[#00D4FF]/10 text-[#00D4FF] border-[#00D4FF]/25',
    },
    green: {
      border: 'hover:border-[#00FF88]/30',
      glow: 'group-hover:shadow-[0_0_30px_rgba(0,255,136,0.08)]',
      iconBg: 'bg-[#00FF88]/10 text-[#00FF88] border-[#00FF88]/25',
    },
    red: {
      border: 'hover:border-[#FF4757]/30',
      glow: 'group-hover:shadow-[0_0_30px_rgba(255,71,87,0.08)]',
      iconBg: 'bg-[#FF4757]/10 text-[#FF4757] border-[#FF4757]/25',
    },
    amber: {
      border: 'hover:border-[#FFB300]/30',
      glow: 'group-hover:shadow-[0_0_30px_rgba(255,179,0,0.08)]',
      iconBg: 'bg-[#FFB300]/10 text-[#FFB300] border-[#FFB300]/25',
    },
  };

  const selectedColor = colorMap[color] || colorMap.cyan;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={`group bg-white/5 border border-white/10 ${selectedColor.border} rounded-2xl p-5 backdrop-blur-xl flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${selectedColor.glow} shadow-[0_4px_20px_rgba(0,0,0,0.15)]`}
    >
      {/* Decorative corner light flare */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.01] rounded-full blur-2xl pointer-events-none group-hover:bg-white/[0.03] transition-all" />

      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-white/50 tracking-wider uppercase font-mono">{title}</span>
        <div className={`p-2.5 rounded-xl border flex items-center justify-center transition-all duration-300 ${selectedColor.iconBg}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
        </div>

        {trend && (
          <div className="flex items-center">
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
              trend.isPositive 
                ? 'bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/10' 
                : 'bg-[#FF4757]/10 text-[#FF4757] border border-[#FF4757]/10'
            }`}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
