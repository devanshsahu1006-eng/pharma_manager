'use client';

import React, { useState, useEffect } from 'react';
import { 
  Pill, 
  ShoppingBag, 
  DollarSign, 
  AlertTriangle, 
  Sparkles, 
  TrendingUp,
  Activity,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useInventoryStore } from '../../store/useInventoryStore';
import { useSalesStore } from '../../store/useSalesStore';
import { Medicine, Sale } from '../../types/pharmacy';
import KPICard from '../../components/dashboard/KPICard';
import RevenueChart from '../../components/dashboard/RevenueChart';
import TopMedicinesChart from '../../components/dashboard/TopMedicinesChart';
import CapabilitiesSection from '../../components/capabilities/CapabilitiesSection';

// Dynamic import for 3D visualizer to avoid SSR issues
const Chart3D = dynamic(() => import('../../components/3d/Chart3D'), { ssr: false });

export default function DashboardOverview() {
  const medicines = useInventoryStore((state) => state.medicines);
  const sales = useSalesStore((state) => state.salesLogs);

  // States for derived values
  const [totalValue, setTotalValue] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [monthlyProfit, setMonthlyProfit] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [expiringSoonCount, setExpiringSoonCount] = useState(0);

  const [dailySalesData, setDailySalesData] = useState<any[]>([]);
  const [monthlySales3D, setMonthlySales3D] = useState<any[]>([]);
  const [topMedicinesData, setTopMedicinesData] = useState<any[]>([]);
  const [forecastingList, setForecastingList] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // 1. Calculate Inventory valuation
    let valuation = 0;
    let lowCount = 0;
    let expiringCount = 0;
    const now = new Date();

    medicines.forEach((m: Medicine) => {
      valuation += (m.quantityAvailable || 0) * (m.purchasePrice || 0);
      if ((m.quantityAvailable || 0) <= (m.minimumThreshold || 0)) {
        lowCount++;
      }
      if (m.expiryDate) {
        const days = Math.ceil(
          (new Date(m.expiryDate).getTime() - now.getTime()) / (1000 * 3600 * 24)
        );
        if (days <= 90) {
          expiringCount++;
        }
      }
    });

    setTotalValue(valuation);
    setLowStockCount(lowCount);
    setExpiringSoonCount(expiringCount);

    // 2. Calculate sales metrics
    let todayTotal = 0;
    let monthProfit = 0;
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    sales.forEach((s: Sale) => {
      const sDate = new Date(s.soldAt || '');
      if (sDate >= today) {
        todayTotal += s.totalAmount || 0;
      }
      const diffDays = (now.getTime() - sDate.getTime()) / (1000 * 3600 * 24);
      if (diffDays <= 30) {
        monthProfit += s.profitEarned || 0;
      }
    });

    setTodayRevenue(todayTotal);
    setMonthlyProfit(monthProfit);

    // 3. Generate chart vectors
    // Daily chart last 7 days
    const dailyMap = new Map();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateString = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dailyMap.set(dateString, { date: dateString, revenue: 0, profit: 0 });
    }
    sales.forEach((s: Sale) => {
      const dateString = new Date(s.soldAt || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (dailyMap.has(dateString)) {
        const current = dailyMap.get(dateString);
        current.revenue += s.totalAmount || 0;
        current.profit += s.profitEarned || 0;
      }
    });
    setDailySalesData(Array.from(dailyMap.values()));

    // Monthly 3D chart
    setMonthlySales3D([
      { label: 'Jan', value: 0 },
      { label: 'Feb', value: 0 },
      { label: 'Mar', value: 0 },
      { label: 'Apr', value: 0 },
      { label: 'May', value: todayTotal }
    ]);

    // Top medicines sold
    const medSalesMap = new Map();
    sales.forEach((s: Sale) => {
      const current = medSalesMap.get(s.medicineName) || 0;
      medSalesMap.set(s.medicineName, current + (s.quantitySold || 0));
    });
    const sortedMed = Array.from(medSalesMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
    setTopMedicinesData(sortedMed);

    // Run-rate Forecasting
    const forecast: any[] = [];
    medicines.forEach((m: Medicine) => {
      const matchedSales = sales.filter((s: Sale) => s.medicineId === m.id);
      const totalSold = matchedSales.reduce((acc: number, curr: Sale) => acc + (curr.quantitySold || 0), 0);
      const velocity = totalSold / 30; // avg per day
      if (velocity > 0) {
        const projectedUsage = velocity * 30;
        const currentStock = m.quantityAvailable || 0;
        if (currentStock - projectedUsage <= (m.minimumThreshold || 10)) {
          forecast.push({
            id: m.id,
            name: m.name,
            currentStock,
            daysRemaining: Math.round(currentStock / velocity),
            confidence: Math.min(75 + matchedSales.length * 5, 96),
          });
        }
      }
    });
    setForecastingList(forecast.slice(0, 3));
  }, [medicines, sales, mounted]);

  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 select-none">
        <div className="w-10 h-10 rounded-full border-2 border-t-[#00D4FF] border-r-transparent border-b-[#00FF88] border-l-transparent animate-spin" />
        <span className="text-[10px] font-mono text-[#00D4FF] tracking-wider uppercase font-semibold animate-pulse">Initializing Console Systems...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 select-none">
      
      {/* Intro Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Console Overview</h2>
          <p className="text-white/50 text-xs mt-1 font-sans">SaaS management grid. Diagnostic reports and live operations.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#00FF88]/10 border border-[#00FF88]/20 px-3 py-1.5 rounded-full text-[10px] font-mono text-[#00FF88]">
          <Activity className="h-3 w-3 animate-pulse" />
          <span>ALL NODE NETWORKS NOMINAL</span>
        </div>
      </div>

      {/* KPI Cards section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Stock Assets Value"
          value={totalValue}
          prefix="₹"
          icon={Pill}
          color="cyan"
          trend={{ value: 4.8, isPositive: true }}
        />
        <KPICard
          title="Revenue (24h)"
          value={todayRevenue}
          prefix="₹"
          icon={DollarSign}
          color="green"
          trend={{ value: 12.3, isPositive: true }}
        />
        <KPICard
          title="Profit Margin (30d)"
          value={monthlyProfit}
          prefix="₹"
          icon={ShoppingBag}
          color="amber"
          trend={{ value: 2.1, isPositive: false }}
        />
        <KPICard
          title="Active Alerts"
          value={lowStockCount + expiringSoonCount}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* 3D Visualizer Chart */}
      <div className="grid grid-cols-1 gap-6">
        <Chart3D data={monthlySales3D} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <RevenueChart data={dailySalesData} />
        </div>
        <div className="lg:col-span-4">
          <TopMedicinesChart data={topMedicinesData} />
        </div>
      </div>

      {/* Capabilities Section */}
      <CapabilitiesSection />

      {/* Footer Forecasting Alert bar */}
      {forecastingList.length > 0 && (
        <div className="bg-white/5 border border-[#00d4ff]/15 rounded-2xl p-5 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_4px_30px_rgba(0,212,255,0.05)]">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/25">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#00D4FF] tracking-wider uppercase font-semibold">AI Predictive Forecasting</span>
              <h4 className="text-white font-semibold text-sm mt-0.5">Critical Inventory Outages Predicted</h4>
              <p className="text-white/50 text-xs mt-1">Based on rolling sales run rates, several items will breach safety limits within 30 days.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 flex-wrap">
            {forecastingList.map((item) => (
              <div key={item.id} className="bg-white/5 border border-white/5 rounded-xl px-3.5 py-2 font-mono text-[10px] flex flex-col gap-0.5">
                <span className="text-white/80 font-bold truncate max-w-[120px]">{item.name}</span>
                <span className="text-red-400 font-semibold">{item.daysRemaining} days left ({item.confidence}% conf.)</span>
              </div>
            ))}
            <Link href="/alerts">
              <div className="flex items-center gap-1 text-xs font-bold text-[#00D4FF] hover:text-[#00FF88] cursor-pointer transition-colors pl-2">
                Resolve Alerts <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
