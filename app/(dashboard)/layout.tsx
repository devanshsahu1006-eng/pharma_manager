'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/TopBar';
import MobileNav from '../../components/layout/MobileNav';
import SceneBackground from '../../components/3d/SceneBackground';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';

import { useInventoryStore } from '../../store/useInventoryStore';
import { useSalesStore } from '../../store/useSalesStore';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const fetchMedicines = useInventoryStore((state) => state.fetchMedicines);
  const fetchSales = useSalesStore((state) => state.fetchSales);

  useEffect(() => {
    setMounted(true);
    fetchMedicines();
    fetchSales();
  }, [fetchMedicines, fetchSales]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#050E1A] flex items-center justify-center">
        <div className="text-sm font-mono text-[#00D4FF] animate-pulse">BOOTING PHARMAOS CONSOLE...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#050E1A] text-white relative font-sans overflow-x-hidden">
      {/* 3D Dynamic Particle Background Mesh */}
      <SceneBackground />

      {/* Desktop Navigation Drawer */}
      <Sidebar />

      {/* Main Panel Viewport */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0 relative z-10">
        <TopBar />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Floating Bottom Bar */}
      <MobileNav />

      {/* Toast Notification Provider */}
      <Toaster 
        theme="dark" 
        position="top-right" 
        toastOptions={{
          style: {
            background: 'rgba(5, 14, 26, 0.95)',
            border: '1px solid rgba(0, 212, 255, 0.15)',
            color: '#fff',
            backdropFilter: 'blur(12px)',
          }
        }}
      />
    </div>
  );
}
