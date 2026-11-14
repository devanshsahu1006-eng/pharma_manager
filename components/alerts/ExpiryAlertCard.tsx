'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Trash2 } from 'lucide-react';
import { Medicine } from '../../types/pharmacy';

interface ExpiryAlertCardProps {
  medicine: Medicine;
  onDispose?: (id: string) => void;
}

export default function ExpiryAlertCard({ medicine, onDispose }: ExpiryAlertCardProps) {
  const expiryDate = medicine.expiryDate ? new Date(medicine.expiryDate) : null;
  
  // Calculate days remaining
  let daysToExpiry = 9999;
  if (expiryDate) {
    const diff = expiryDate.getTime() - new Date().getTime();
    daysToExpiry = Math.ceil(diff / (1000 * 3600 * 24));
  }

  let severity: 'critical' | 'warning' | 'notice' = 'notice';
  if (daysToExpiry <= 30) {
    severity = 'critical';
  } else if (daysToExpiry <= 60) {
    severity = 'warning';
  }

  const styles = {
    critical: {
      bg: 'bg-red-500/10 border-red-500/30',
      text: 'text-[#FF4757]',
      ring: 'bg-[#FF4757]',
      label: 'EXP-CRITICAL',
    },
    warning: {
      bg: 'bg-amber-500/10 border-amber-500/30',
      text: 'text-[#FFB300]',
      ring: 'bg-[#FFB300]',
      label: 'EXP-WARNING',
    },
    notice: {
      bg: 'bg-green-500/10 border-green-500/30',
      text: 'text-[#00FF88]',
      ring: 'bg-[#00FF88]',
      label: 'EXP-NOTICE',
    },
  };

  const currentStyle = styles[severity];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative overflow-hidden rounded-2xl border ${currentStyle.bg} p-5 backdrop-blur-xl flex flex-col justify-between h-40 shadow-[0_4px_20px_rgba(0,0,0,0.2)]`}
    >
      {/* Corner pulse dot */}
      <div className="absolute top-4 right-4 flex items-center justify-center">
        <span className={`absolute inline-flex h-3 w-3 rounded-full opacity-75 animate-ping ${currentStyle.ring}`} />
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${currentStyle.ring}`} />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <Calendar className={`h-4 w-4 ${currentStyle.text}`} />
          <span className="text-[10px] font-mono tracking-wider font-semibold opacity-75">{currentStyle.label}</span>
        </div>
        
        <h4 className="text-white font-semibold text-sm tracking-wide truncate pr-6">{medicine.name}</h4>
        <p className="text-[10px] text-white/50 font-mono">Batch: {medicine.batchNumber || 'N/A'}</p>
      </div>

      <div className="flex items-end justify-between mt-4 pt-3 border-t border-white/5">
        <div className="flex flex-col">
          <span className="text-[9px] font-mono text-white/40 uppercase">Expiry / Remaining</span>
          <span className="text-xs font-bold text-white font-mono mt-0.5">
            {expiryDate ? formatDate(expiryDate) : 'N/A'}{' '}
            <span className={`text-[10px] font-normal ${currentStyle.text}`}>
              ({daysToExpiry <= 0 ? 'Expired' : `${daysToExpiry} days left`})
            </span>
          </span>
        </div>

        {onDispose && (
          <button
            onClick={() => onDispose(medicine.id)}
            className="px-3 py-1.5 rounded-lg text-[10px] font-semibold border border-[#FF4757]/20 bg-[#FF4757]/5 hover:bg-[#FF4757]/15 text-[#FF4757] hover:border-[#FF4757]/30 cursor-pointer transition-all flex items-center gap-1.5"
          >
            <Trash2 className="h-3 w-3" /> Discard
          </button>
        )}
      </div>
    </motion.div>
  );
}
