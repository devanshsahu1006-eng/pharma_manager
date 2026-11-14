'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Pill, 
  ShoppingBag, 
  DollarSign, 
  AlertTriangle, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import dynamic from 'next/dynamic';

const MoleculeOrbit = dynamic(() => import('../3d/MoleculeOrbit'), { ssr: false });

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/inventory', label: 'Inventory', icon: Pill },
  { href: '/purchases', label: 'Purchases', icon: ShoppingBag },
  { href: '/sales', label: 'Sales Register', icon: DollarSign },
  { href: '/alerts', label: 'Alerts', icon: AlertTriangle },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="hidden md:flex flex-col h-screen bg-[#050E1A]/80 border-r border-[#00d4ff]/15 backdrop-blur-xl sticky top-0 text-white overflow-hidden shrink-0 z-30 select-none"
    >
      {/* Header / Brand */}
      <div className="flex items-center justify-between p-6 border-b border-[#00d4ff]/10 h-20 shrink-0">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-[#00D4FF] to-[#00FF88] flex items-center justify-center shadow-[0_0_15px_rgba(0,212,255,0.4)]">
            <Pill className="h-5 w-5 text-[#050E1A]" />
          </div>
          {!collapsed && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 tracking-wider"
            >
              Pharma<span className="text-[#00D4FF]">OS</span>
            </motion.span>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hover:bg-white/5 p-1.5 rounded-lg border border-white/5 hover:border-[#00d4ff]/25 text-white/60 hover:text-white transition-all cursor-pointer"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 relative group cursor-pointer ${
                  isActive
                    ? 'text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.03] border border-transparent hover:border-[#00d4ff]/10'
                }`}
              >
                {/* Active Glowing Background */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-[#00D4FF]/10 to-[#00FF88]/5 border border-[#00d4ff]/25 rounded-xl shadow-[0_0_20px_rgba(0,212,255,0.05)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}

                {/* Left Active neon line */}
                {isActive && (
                  <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] rounded-r bg-[#00D4FF] shadow-[0_0_8px_#00D4FF]" />
                )}

                <Icon className={`h-5 w-5 shrink-0 transition-transform group-hover:scale-105 duration-200 ${isActive ? 'text-[#00D4FF]' : 'text-white/60 group-hover:text-white'}`} />
                
                {!collapsed && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm font-medium tracking-wide"
                  >
                    {item.label}
                  </motion.span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer decorative 3D molecule */}
      <div className="p-4 border-t border-[#00d4ff]/10 shrink-0 bg-[#050E1A]/40">
        <MoleculeOrbit />
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-2"
          >
            <p className="text-[10px] font-mono text-white/30 tracking-wider">SECURE LINK STATUS</p>
            <p className="text-[10px] font-mono text-[#00FF88] flex items-center justify-center gap-1.5 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00FF88] animate-ping" />
              SYSTEM ACTIVE
            </p>
          </motion.div>
        )}
      </div>
    </motion.aside>
  );
}
