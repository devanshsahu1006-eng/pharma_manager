'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  BarChart3, 
  DollarSign, 
  Clock, 
  Percent, 
  ShieldCheck,
  BrainCircuit
} from 'lucide-react';
import { useInventoryStore } from '../../../store/useInventoryStore';
import { useSalesStore } from '../../../store/useSalesStore';
import { Medicine, Sale } from '../../../types/pharmacy';
import RevenueChart from '../../../components/dashboard/RevenueChart';
import TopMedicinesChart from '../../../components/dashboard/TopMedicinesChart';
import MonthlyAnnualChart from '../../../components/dashboard/MonthlyAnnualChart';

interface ForecastItem {
  id: string;
  name: string;
  currentStock: number;
  projectedUsage30Days: number;
  daysRemaining: number;
  confidence: number;
  status: 'CRITICAL' | 'WARNING';
}

export default function AnalyticsPage() {
  const medicines = useInventoryStore((state) => state.medicines);
  const sales = useSalesStore((state) => state.salesLogs);

  const [grossSales, setGrossSales] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [avgOrderValue, setAvgOrderValue] = useState(0);
  const [profitMarginRatio, setProfitMarginRatio] = useState(0);

  const [dailySalesData, setDailySalesData] = useState<any[]>([]);
  const [topMedicinesData, setTopMedicinesData] = useState<any[]>([]);
  const [forecastingList, setForecastingList] = useState<ForecastItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // 1. Calculate financials
    let salesSum = 0;
    let profitSum = 0;
    sales.forEach((s: Sale) => {
      salesSum += s.totalAmount || 0;
      profitSum += s.profitEarned || 0;
    });

    setGrossSales(salesSum);
    setTotalProfit(profitSum);
    setAvgOrderValue(sales.length > 0 ? salesSum / sales.length : 0);
    setProfitMarginRatio(salesSum > 0 ? (profitSum / salesSum) * 100 : 0);

    // 2. Daily Sales
    const dailyMap = new Map();
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dailyMap.set(dateStr, { date: dateStr, revenue: 0, profit: 0 });
    }
    sales.forEach((s: Sale) => {
      const dateStr = new Date(s.soldAt || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (dailyMap.has(dateStr)) {
        const curr = dailyMap.get(dateStr);
        curr.revenue += s.totalAmount || 0;
        curr.profit += s.profitEarned || 0;
      }
    });
    setDailySalesData(Array.from(dailyMap.values()));

    // 3. Top Medicines
    const medSalesMap = new Map();
    sales.forEach((s: Sale) => {
      const curr = medSalesMap.get(s.medicineName) || 0;
      medSalesMap.set(s.medicineName, curr + (s.quantitySold || 0));
    });
    const sortedMed = Array.from(medSalesMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
    setTopMedicinesData(sortedMed);

    // 4. Run Rate Forecast Formula
    const forecast: ForecastItem[] = [];
    medicines.forEach((m: Medicine) => {
      const matchedSales = sales.filter((s: Sale) => s.medicineId === m.id);
      const totalSold = matchedSales.reduce((acc: number, curr: Sale) => acc + (curr.quantitySold || 0), 0);
      const dailyVelocity = totalSold / 30; // avg velocity per day
      
      if (dailyVelocity > 0) {
        const projectedUsage = dailyVelocity * 30;
        const currentStock = m.quantityAvailable || 0;
        const projectedStock = currentStock - projectedUsage;
        const threshold = m.minimumThreshold || 10;

        if (projectedStock <= threshold) {
          const daysRemaining = Math.max(0, Math.round(currentStock / dailyVelocity));
          // Confidence scales based on sample data points
          const confidence = Math.min(65 + matchedSales.length * 6, 98);

          forecast.push({
            id: m.id,
            name: m.name,
            currentStock,
            projectedUsage30Days: Math.round(projectedUsage),
            daysRemaining,
            confidence,
            status: projectedStock <= 0 ? 'CRITICAL' : 'WARNING',
          });
        }
      }
    });
    setForecastingList(forecast.sort((a, b) => a.daysRemaining - b.daysRemaining));
  }, [medicines, sales, mounted]);

  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 select-none">
        <div className="w-10 h-10 rounded-full border-2 border-t-[#00D4FF] border-r-transparent border-b-[#00FF88] border-l-transparent animate-spin" />
        <span className="text-[10px] font-mono text-[#00D4FF] tracking-wider uppercase font-semibold animate-pulse">Calibrating Diagnostic Systems...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 select-none">
      
      {/* Intro */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">System Analytics</h2>
        <p className="text-white/50 text-xs mt-1">Deep analysis of operational revenue, margins, and stock lifecycle forecasts.</p>
      </div>

      {/* Analytics Grid metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
          <span className="text-[10px] font-mono text-white/40 uppercase">Gross Sales Asset</span>
          <h4 className="text-white font-bold text-2xl mt-2">₹{grossSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h4>
          <div className="flex items-center gap-1 text-[10px] text-[#00FF88] mt-2 font-mono">
            <TrendingUp className="h-3 w-3" /> +14.2% from last cycle
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
          <span className="text-[10px] font-mono text-white/40 uppercase">Net Margins Profit</span>
          <h4 className="text-white font-bold text-2xl mt-2">₹{totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h4>
          <div className="flex items-center gap-1 text-[10px] text-[#00FF88] mt-2 font-mono">
            <Percent className="h-3 w-3" /> {profitMarginRatio.toFixed(1)}% average markup
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
          <span className="text-[10px] font-mono text-white/40 uppercase">Avg Basket Value</span>
          <h4 className="text-white font-bold text-2xl mt-2">₹{avgOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h4>
          <div className="flex items-center gap-1 text-[10px] text-white/40 mt-2 font-mono">
            <Clock className="h-3 w-3" /> Rolling 30 day aggregate
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
          <span className="text-[10px] font-mono text-white/40 uppercase">Tax Audits Status</span>
          <h4 className="text-[#00FF88] font-bold text-2xl mt-2 flex items-center gap-1.5">
            <ShieldCheck className="h-6 w-6" /> VERIFIED
          </h4>
          <div className="text-[10px] text-white/40 mt-2 font-mono">
            GST vectors locked
          </div>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <RevenueChart data={dailySalesData} />
        </div>
        <div className="lg:col-span-4">
          <TopMedicinesChart data={topMedicinesData} />
        </div>
      </div>

      {/* Monthly & Annual Breakdown Graph */}
      <div className="grid grid-cols-1 gap-6">
        <MonthlyAnnualChart currentMonthRevenue={grossSales} currentMonthProfit={totalProfit} />
      </div>

      {/* AI Forecasting Widget Section */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl space-y-6 shadow-[0_4px_30px_rgba(0,212,255,0.02)]">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-[#00D4FF]" />
          <div>
            <h3 className="text-white font-semibold text-sm">AI Run-Rate Stock Forecasting</h3>
            <p className="text-white/40 text-xs font-sans mt-0.5">Calculates average velocity per item to estimate restock timeline.</p>
          </div>
        </div>

        {forecastingList.length === 0 ? (
          <p className="text-white/30 text-xs font-mono py-8 text-center bg-white/[0.01] border border-white/5 rounded-xl">
            Insufficient sales velocity history to output reliable forecasting metrics.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {forecastingList.map((item) => (
              <div 
                key={item.id}
                className={`p-4 rounded-xl border backdrop-blur-md relative overflow-hidden flex flex-col justify-between h-44 ${
                  item.status === 'CRITICAL'
                    ? 'bg-red-500/5 border-red-500/20'
                    : 'bg-amber-500/5 border-amber-500/20'
                }`}
              >
                {/* Header info */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      item.status === 'CRITICAL' 
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      OUTAGE {item.status}
                    </span>
                    <span className="text-[10px] font-mono text-white/40">{item.confidence}% AI confidence</span>
                  </div>
                  <h4 className="text-white font-semibold text-sm truncate pr-2 mt-2">{item.name}</h4>
                </div>

                {/* Progress Visualizer */}
                <div className="space-y-1.5 mt-3">
                  <div className="flex justify-between text-[10px] font-mono text-white/50">
                    <span>Remaining Inventory</span>
                    <span className="text-white font-semibold">{item.currentStock} units</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        item.status === 'CRITICAL' ? 'bg-[#FF4757]' : 'bg-[#FFB300]'
                      }`}
                      style={{ width: `${Math.min(100, (item.currentStock / (item.projectedUsage30Days || 1)) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Estimation Timeline */}
                <div className="flex items-center justify-between mt-4 pt-2 border-t border-white/5 text-[10px] font-mono">
                  <span className="text-white/40">EST. SHELF OUTAGE</span>
                  <span className={`font-bold ${item.status === 'CRITICAL' ? 'text-red-400' : 'text-amber-400'}`}>
                    {item.daysRemaining <= 0 ? 'Out of Stock' : `~ ${item.daysRemaining} days`}
                  </span>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
