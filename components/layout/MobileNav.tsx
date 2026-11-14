'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Pill, 
  ShoppingBag, 
  DollarSign, 
  AlertTriangle 
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/inventory', label: 'Stock', icon: Pill },
  { href: '/purchases', label: 'Buy', icon: ShoppingBag },
  { href: '/sales', label: 'Register', icon: DollarSign },
  { href: '/alerts', label: 'Alerts', icon: AlertTriangle },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-4 left-4 right-4 h-16 bg-[#050E1A]/85 border border-[#00d4ff]/20 backdrop-blur-xl rounded-2xl flex items-center justify-around px-2 z-40 shadow-[0_4px_30px_rgba(0,212,255,0.15)] select-none">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link key={item.href} href={item.href} className="flex-1 py-1">
            <motion.div
              whileTap={{ scale: 0.9, y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="flex flex-col items-center justify-center relative h-full gap-0.5 cursor-pointer"
            >
              {/* Active state spot glow */}
              {isActive && (
                <motion.div
                  layoutId="mobileActiveGlow"
                  className="absolute inset-0 bg-[#00D4FF]/5 rounded-xl border border-[#00d4ff]/10"
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                />
              )}

              <Icon className={`h-5 w-5 transition-colors duration-200 ${isActive ? 'text-[#00D4FF]' : 'text-white/40'}`} />
              <span className={`text-[9px] font-medium tracking-wide transition-colors duration-200 ${isActive ? 'text-white font-semibold' : 'text-white/40'}`}>
                {item.label}
              </span>

              {/* Active Underline indicator */}
              {isActive && (
                <motion.div 
                  layoutId="mobileActiveBar"
                  className="absolute bottom-0.5 h-[2px] w-6 rounded-full bg-[#00D4FF] shadow-[0_0_8px_#00D4FF]"
                />
              )}
            </motion.div>
          </Link>
        );
      })}
    </nav>
  );
}
