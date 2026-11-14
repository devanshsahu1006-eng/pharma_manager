'use client';

import React, { useState, useEffect } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid 
} from 'recharts';

interface RevenueChartProps {
  data: {
    date: string;
    revenue: number;
    profit: number;
  }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#050E1A]/95 border border-[#00d4ff]/25 backdrop-blur-md p-3.5 rounded-xl shadow-[0_0_20px_rgba(0,212,255,0.1)] text-xs font-mono text-white">
        <p className="font-semibold text-white/50 mb-1">{label}</p>
        <p className="text-[#00D4FF]">Revenue: <span className="font-bold">₹{payload[0].value.toLocaleString()}</span></p>
        <p className="text-[#00FF88]">Profit: <span className="font-bold">₹{payload[1].value.toLocaleString()}</span></p>
      </div>
    );
  }
  return null;
};

export default function RevenueChart({ data }: RevenueChartProps) {
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

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl relative overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.15)] h-[340px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-white/40 text-[9px] font-mono tracking-wider uppercase">Financial Vector</span>
          <h3 className="text-white font-semibold text-sm">Revenue vs Net Profit Margin</h3>
        </div>
        <div className="flex gap-4 text-[10px] font-mono">
          <span className="flex items-center gap-1.5 text-white/70">
            <span className="h-2 w-2 rounded bg-[#00D4FF]" /> Revenue
          </span>
          <span className="flex items-center gap-1.5 text-white/70">
            <span className="h-2 w-2 rounded bg-[#00FF88]" /> Profit
          </span>
        </div>
      </div>

      <div className="w-full h-56 relative min-h-[224px]">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#00D4FF" stopOpacity={0.0}/>
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00FF88" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#00FF88" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis 
              dataKey="date" 
              stroke="rgba(255,255,255,0.3)" 
              fontSize={9} 
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.3)" 
              fontSize={9} 
              tickLine={false}
              axisLine={false}
              dx={-5}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#00D4FF" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
            />
            <Area 
              type="monotone" 
              dataKey="profit" 
              stroke="#00FF88" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorProfit)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
