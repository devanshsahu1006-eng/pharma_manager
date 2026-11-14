'use client';

import React, { useState } from 'react';
import { Pill, Activity, ShieldAlert, KeyRound, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';

const MoleculeOrbit = dynamic(() => import('../../../components/3d/MoleculeOrbit'), { ssr: false });
const SceneBackground = dynamic(() => import('../../../components/3d/SceneBackground'), { ssr: false });

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMagicLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Specify an email address to dispatch the access token.');
      return;
    }
    setLoading(true);
    toast.success('Access Link dispatched to inbox!', { description: 'Verify your email to authenticate.' });
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate auth token check
    setTimeout(() => {
      setLoading(false);
      toast.success('Authentication Vector matches. Initializing session...', { duration: 1500 });
      router.push('/');
    }, 1200);
  };

  const handleBypass = () => {
    toast.success('Bypassing verification gates. Loading session as Dev Owner...', { duration: 1200 });
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#050E1A] flex items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Three.js Background particles */}
      <SceneBackground />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-[#050E1A]/85 border border-[#00d4ff]/20 rounded-3xl p-8 backdrop-blur-xl shadow-[0_10px_50px_rgba(0,212,255,0.1)] relative z-10 space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-[#00D4FF] to-[#00FF88] flex items-center justify-center shadow-[0_0_20px_rgba(0,212,255,0.4)]">
            <Pill className="h-6 w-6 text-[#050E1A]" />
          </div>
          <h2 className="text-xl font-bold tracking-wider text-white mt-2">
            Pharma<span className="text-[#00D4FF]">OS</span> Enterprise
          </h2>
          <p className="text-xs text-white/50">Next-Generation Pharmaceutical Operations System</p>
        </div>

        {/* 3D Molecule widget in center of panel */}
        <div className="h-24 relative overflow-hidden bg-white/[0.01] border border-white/5 rounded-2xl flex items-center justify-center">
          <div className="absolute inset-0 scale-75">
            <MoleculeOrbit />
          </div>
          <span className="absolute bottom-2 text-[8px] font-mono text-white/30 tracking-wider">HOLOGRAPHIC ENCRYPT ACTIVE</span>
        </div>

        {/* Forms */}
        <form onSubmit={handlePasswordLogin} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono text-white/50 uppercase">Secure Email Identity</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@pharmaos.com"
              className="bg-white/5 border border-white/10 focus:border-[#00D4FF]/40 rounded-xl px-4 py-2.5 text-xs focus:outline-none text-white transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono text-white/50 uppercase">Access Passphrase</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-white/5 border border-white/10 focus:border-[#00D4FF]/40 rounded-xl px-4 py-2.5 text-xs focus:outline-none text-white transition-all"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-[#00D4FF] to-[#00FF88] text-[#050E1A] font-bold text-xs py-2.5 rounded-xl hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] disabled:opacity-50 cursor-pointer transition-all hover:scale-[1.01]"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={handleMagicLink}
              disabled={loading}
              className="flex-1 bg-white/5 border border-white/10 hover:border-white/20 text-white font-semibold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
            >
              Magic Link
            </button>
          </div>
        </form>

        {/* Developer Console Bypass */}
        <div className="border-t border-white/5 pt-4 text-center">
          <button
            type="button"
            onClick={handleBypass}
            className="w-full flex items-center justify-center gap-1.5 text-[10px] font-mono text-[#00FF88] hover:text-white border border-[#00FF88]/20 bg-[#00FF88]/5 hover:bg-[#00FF88]/15 px-4 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <KeyRound className="h-3.5 w-3.5" /> Initialize Dev Owner Bypass
          </button>
        </div>

        {/* Footer notification */}
        <p className="text-[9px] text-center font-mono text-white/30 flex items-center justify-center gap-1.5">
          <Activity className="h-2.5 w-2.5 text-[#00FF88] animate-pulse" />
          SECURE CHANNEL ENCRYPTED
        </p>

      </motion.div>
    </div>
  );
}
