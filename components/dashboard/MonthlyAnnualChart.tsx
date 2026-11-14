'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  Legend
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, TrendingUp } from 'lucide-react';

interface MonthlyAnnualChartProps {
  currentMonthRevenue: number;
  currentMonthProfit: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#050E1A]/95 border border-[#00d4ff]/25 backdrop-blur-md p-3.5 rounded-xl shadow-[0_0_20px_rgba(0,212,255,0.1)] text-xs font-mono text-white">
        <p className="font-semibold text-white/50 mb-1">{label}</p>
        <p className="text-[#00D4FF]">Gross Sales: <span className="font-bold">₹{payload[0].value.toLocaleString()}</span></p>
        <p className="text-[#00FF88]">Net Profit: <span className="font-bold">₹{payload[1].value.toLocaleString()}</span></p>
      </div>
    );
  }
  return null;
};

export default function MonthlyAnnualChart({ currentMonthRevenue, currentMonthProfit }: MonthlyAnnualChartProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'monthly' | 'annual'>('monthly');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-80 w-full bg-white/5 border border-white/10 rounded-2xl animate-pulse flex items-center justify-center">
        <span className="text-white/30 text-xs font-mono">Calibrating Analytics...</span>
      </div>
    );
  }

  // Monthly data (Last 6 Months)
  const monthlyData = [
    { name: 'Dec', sales: 0, profit: 0 },
    { name: 'Jan', sales: 0, profit: 0 },
    { name: 'Feb', sales: 0, profit: 0 },
    { name: 'Mar', sales: 0, profit: 0 },
    { name: 'Apr', sales: 0, profit: 0 },
    { name: 'May (Current)', sales: currentMonthRevenue, profit: currentMonthProfit },
  ];

  // Annual data (Last 3 Years)
  const annualData = [
    { name: '2024', sales: 0, profit: 0 },
    { name: '2025', sales: 0, profit: 0 },
    { name: '2026', sales: currentMonthRevenue, profit: currentMonthProfit },
  ];

  const chartData = activeTab === 'monthly' ? monthlyData : annualData;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.15)] min-h-[400px] flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-white/40 text-[9px] font-mono tracking-wider uppercase flex items-center gap-1">
            <Calendar className="h-3 w-3 text-[#00D4FF]" /> Time-Series Financial Vector
          </span>
          <h3 className="text-white font-semibold text-sm mt-0.5">Sales & Profit Breakdown</h3>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 self-start">
          <button
            onClick={() => setActiveTab('monthly')}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all duration-300 ${
              activeTab === 'monthly'
                ? 'bg-white/10 text-white shadow-md'
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setActiveTab('annual')}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all duration-300 ${
              activeTab === 'annual'
                ? 'bg-white/10 text-white shadow-md'
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            Annual
          </button>
        </div>
      </div>

      <div className="w-full h-64 relative min-h-[256px] flex-1">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis 
              dataKey="name" 
              stroke="rgba(255,255,255,0.4)" 
              fontSize={10} 
              tickLine={false}
              axisLine={false}
              dy={8}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.4)" 
              fontSize={10} 
              tickLine={false}
              axisLine={false}
              dx={-5}
              tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconSize={10}
              iconType="circle"
              wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', paddingTop: '15px' }}
            />
            <Bar 
              dataKey="sales" 
              name="Gross Sales" 
              fill="#00D4FF" 
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
            <Bar 
              dataKey="profit" 
              name="Net Profit" 
              fill="#00FF88" 
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
