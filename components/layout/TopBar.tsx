'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Search, Bell, Shield, LogOut, ChevronRight } from 'lucide-react';
import { useInventoryStore } from '../../store/useInventoryStore';
import { toast } from 'sonner';

export default function TopBar() {
  const pathname = usePathname();
  const medicines = useInventoryStore((state) => state.medicines);
  const [alertCount, setAlertCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  // Derive page title from pathname
  const getPageTitle = () => {
    switch (pathname) {
      case '/': return 'Dashboard Overview';
      case '/inventory': return 'Inventory Registry';
      case '/purchases': return 'Purchase Operations';
      case '/sales': return 'Point of Sale (POS)';
      case '/alerts': return 'Critical System Alerts';
      case '/analytics': return 'Performance & Profit Analytics';
      case '/settings': return 'System Settings';
      default: return 'PharmaOS Console';
    }
  };

  // Scan inventory alerts count
  useEffect(() => {
    const lowStock = medicines.filter(
      (m) => (m.quantityAvailable || 0) <= (m.minimumThreshold || 0)
    ).length;
    
    const expiring = medicines.filter((m) => {
      if (!m.expiryDate) return false;
      const days = Math.ceil(
        (new Date(m.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
      );
      return days <= 90;
    }).length;

    setAlertCount(lowStock + expiring);
  }, [medicines]);

  return (
    <header className="h-20 border-b border-[#00d4ff]/10 bg-[#050E1A]/40 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20 w-full select-none">
      {/* Page Title & Breadcrumbs */}
      <div className="flex items-center gap-2">
        <span className="text-white/40 text-xs font-mono tracking-wider">SYSTEM</span>
        <ChevronRight className="h-3 w-3 text-white/30" />
        <span className="text-white font-medium text-sm tracking-wide">{getPageTitle()}</span>
      </div>

      {/* Center Search / Cmd+K helper */}
      <div 
        onClick={() => {
          // Dispatch custom event to toggle Cmd+K palette
          window.dispatchEvent(new CustomEvent('toggle-command-palette'));
        }}
        className="hidden sm:flex items-center gap-3 bg-white/5 border border-white/10 hover:border-[#00D4FF]/30 px-4 py-2 rounded-xl text-white/40 text-xs font-mono w-64 md:w-80 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.2)]"
      >
        <Search className="h-4 w-4 text-white/30" />
        <span>Search anything...</span>
        <span className="ml-auto px-1.5 py-0.5 rounded bg-white/10 border border-white/5 text-[9px] text-white/60">Cmd+K</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Alerts Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-[#00D4FF]/30 text-white/70 hover:text-white transition-all cursor-pointer relative"
          >
            <Bell className="h-4 w-4" />
            {alertCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#FF4757] shadow-[0_0_8px_#FF4757] animate-pulse" />
            )}
          </button>

          {/* Quick Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-[#050E1A]/95 border border-[#00d4ff]/20 shadow-[0_10px_30px_rgba(0,212,255,0.15)] backdrop-blur-xl p-4 text-white z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                <span className="font-semibold text-xs tracking-wide">Notifications</span>
                <span className="text-[10px] font-mono bg-[#FF4757]/10 text-[#FF4757] px-2 py-0.5 rounded-full">
                  {alertCount} alert(s)
                </span>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                {alertCount === 0 ? (
                  <p className="text-white/40 text-xs text-center py-4 font-mono">System running optimal. No alerts.</p>
                ) : (
                  <>
                    {medicines.filter(m => (m.quantityAvailable || 0) <= (m.minimumThreshold || 0)).slice(0, 3).map(m => (
                      <div key={m.id} className="p-2.5 rounded-xl bg-white/5 border border-[#FF4757]/20 flex flex-col gap-1">
                        <span className="font-medium text-xs text-[#FF4757]">{m.name}</span>
                        <span className="text-[10px] text-white/50">Stock depleted: {m.quantityAvailable} units remaining</span>
                      </div>
                    ))}
                    {medicines.filter(m => {
                      if (!m.expiryDate) return false;
                      const days = Math.ceil((new Date(m.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                      return days <= 90;
                    }).slice(0, 3).map(m => {
                      const days = Math.ceil((new Date(m.expiryDate!).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                      return (
                        <div key={m.id} className="p-2.5 rounded-xl bg-white/5 border border-[#FFB300]/20 flex flex-col gap-1">
                          <span className="font-medium text-xs text-[#FFB300]">{m.name}</span>
                          <span className="text-[10px] text-white/50">Expiring in {days} days ({m.batchNumber})</span>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Identity / Role Panel */}
        <div className="flex items-center gap-3 border-l border-white/10 pl-4">
          <div className="flex flex-col text-right hidden xs:flex">
            <span className="text-white font-medium text-xs">Admin Owner</span>
            <span className="text-[9px] text-[#00FF88] font-mono tracking-wider flex items-center justify-end gap-1">
              <Shield className="h-2.5 w-2.5" /> OWNER
            </span>
          </div>
          
          {/* Mock avatar */}
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#00D4FF] to-[#00FF88] p-[1.5px] cursor-pointer shadow-[0_0_10px_rgba(0,212,255,0.2)]">
            <div className="h-full w-full rounded-full bg-[#050E1A] flex items-center justify-center text-white font-bold text-xs font-mono">
              AO
            </div>
          </div>

          <button
            onClick={() => {
              toast.info('Session termination initialized. Logging out...', { duration: 2000 });
              setTimeout(() => {
                window.location.href = '/login';
              }, 1500);
            }}
            className="p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-[#FF4757] transition-all cursor-pointer"
            title="Terminate Session"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
