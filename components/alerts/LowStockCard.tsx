'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Archive } from 'lucide-react';
import { Medicine } from '../../types/pharmacy';

interface LowStockCardProps {
  medicine: Medicine;
  onRestock?: (id: string) => void;
}

export default function LowStockCard({ medicine, onRestock }: LowStockCardProps) {
  const stock = medicine.quantityAvailable ?? 0;
  const threshold = medicine.minimumThreshold ?? 10;
  
  let severity: 'critical' | 'warning' | 'notice' = 'notice';
  if (stock === 0) {
    severity = 'critical';
  } else if (stock <= threshold * 0.5) {
    severity = 'warning';
  }

  const styles = {
    critical: {
      bg: 'bg-red-500/10 border-red-500/30',
      text: 'text-[#FF4757]',
      ring: 'bg-[#FF4757]',
      label: 'DEPL-CRITICAL',
    },
    warning: {
      bg: 'bg-amber-500/10 border-amber-500/30',
      text: 'text-[#FFB300]',
      ring: 'bg-[#FFB300]',
      label: 'DEPL-WARNING',
    },
    notice: {
      bg: 'bg-green-500/10 border-green-500/30',
      text: 'text-[#00FF88]',
      ring: 'bg-[#00FF88]',
      label: 'DEPL-NOTICE',
    },
  };

  const currentStyle = styles[severity];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative overflow-hidden rounded-2xl border ${currentStyle.bg} p-5 backdrop-blur-xl backdrop-saturate-150 flex flex-col justify-between h-40 shadow-[0_4px_20px_rgba(0,0,0,0.2)]`}
    >
      {/* Corner pulse light ring */}
      <div className="absolute top-4 right-4 flex items-center justify-center">
        <span className={`absolute inline-flex h-3 w-3 rounded-full opacity-75 animate-ping ${currentStyle.ring}`} />
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${currentStyle.ring}`} />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <AlertCircle className={`h-4 w-4 ${currentStyle.text}`} />
          <span className="text-[10px] font-mono tracking-wider font-semibold opacity-75">{currentStyle.label}</span>
        </div>
        
        <h4 className="text-white font-semibold text-sm tracking-wide truncate pr-6">{medicine.name}</h4>
        {medicine.genericName && (
          <p className="text-xs text-white/50 truncate font-sans">{medicine.genericName}</p>
        )}
      </div>

      <div className="flex items-end justify-between mt-4 pt-3 border-t border-white/5">
        <div className="flex flex-col">
          <span className="text-[9px] font-mono text-white/40 uppercase">Stock / Min</span>
          <span className="text-xs font-bold text-white font-mono mt-0.5">
            {stock} / <span className="text-white/60">{threshold}</span>
          </span>
        </div>

        {onRestock && (
          <button
            onClick={() => onRestock(medicine.id)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold border bg-white/5 border-white/10 hover:border-white/20 text-white cursor-pointer transition-all flex items-center gap-1.5`}
          >
            <Archive className="h-3 w-3" /> Restock
          </button>
        )}
      </div>
    </motion.div>
  );
}
