'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

interface TopMedicinesProps {
  data: {
    name: string;
    value: number; // units sold
  }[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#050E1A]/95 border border-[#00d4ff]/25 backdrop-blur-md px-3 py-2 rounded-xl text-xs font-mono text-white shadow-[0_0_15px_rgba(0,212,255,0.1)]">
        <p className="font-semibold text-white/80">{payload[0].payload.name}</p>
        <p className="text-[#00FF88] mt-0.5">Sold: <span className="font-bold">{payload[0].value} units</span></p>
      </div>
    );
  }
  return null;
};

export default function TopMedicinesChart({ data }: TopMedicinesProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-72 w-full bg-white/5 border border-white/10 rounded-2xl animate-pulse flex items-center justify-center">
        <span className="text-white/30 text-xs font-mono">Calibrating Analytics...</span>
      </div>
    );
  }

  // Pre-sorted data
  const chartData = data && data.length > 0 ? data : [
    { name: 'Paracetamol 500mg', value: 342 },
    { name: 'Amoxicillin 250mg', value: 218 },
    { name: 'Atorvastatin 10mg', value: 185 },
    { name: 'Metformin 500mg', value: 140 },
    { name: 'Insulin Glargine', value: 98 }
  ];

  const colors = ['#00D4FF', '#00e5a3', '#00b0ff', '#FFB300', '#FF4757'];

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl relative overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.15)] h-[340px]">
      <div className="mb-6">
        <span className="text-white/40 text-[9px] font-mono tracking-wider uppercase">Quantity Vectors</span>
        <h3 className="text-white font-semibold text-sm">Top 5 Selling Medicines</h3>
      </div>

      <div className="w-full h-56 relative min-h-[224px]">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 10, left: 15, bottom: 5 }}
          >
            <XAxis type="number" stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} axisLine={false} hide />
            <YAxis
              dataKey="name"
              type="category"
              stroke="rgba(255,255,255,0.5)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              width={100}
              tickFormatter={(tick) => (tick.length > 15 ? `${tick.substring(0, 13)}...` : tick)}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
