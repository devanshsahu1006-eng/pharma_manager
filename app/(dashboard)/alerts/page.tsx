'use client';

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Calendar, 
  Archive,
  RefreshCw
} from 'lucide-react';
import { useInventoryStore } from '../../../store/useInventoryStore';
import LowStockCard from '../../../components/alerts/LowStockCard';
import ExpiryAlertCard from '../../../components/alerts/ExpiryAlertCard';
import { toast } from 'sonner';

export default function AlertsPage() {
  const medicines = useInventoryStore((state) => state.medicines);
  const updateMedicine = useInventoryStore((state) => state.updateMedicine);

  const [activeTab, setActiveTab] = useState<'ALL' | 'STOCK' | 'EXPIRY'>('ALL');

  const now = new Date();

  // Low Stock Items
  const lowStockMedicines = medicines.filter(
    (m) => (m.quantityAvailable || 0) <= (m.minimumThreshold || 10)
  );

  // Expiring soon (within 90 days)
  const expiringMedicines = medicines.filter((m) => {
    if (!m.expiryDate) return false;
    const exp = new Date(m.expiryDate);
    const diff = exp.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days <= 90;
  });

  const handleRestock = (id: string) => {
    const med = medicines.find(m => m.id === id);
    if (!med) return;
    
    const increment = 100;
    updateMedicine(id, {
      quantityAvailable: (med.quantityAvailable || 0) + increment,
    });
    toast.success(`Restocked ${increment} units of ${med.name}`, { icon: '📦' });
  };

  const handleDispose = (id: string) => {
    const med = medicines.find(m => m.id === id);
    if (!med) return;

    if (confirm(`Confirm decommissioning and removal of all batch stock for: ${med.name}?`)) {
      updateMedicine(id, {
        quantityAvailable: 0,
      });
      toast.error(`Purged all stock units for ${med.name}`, { icon: '🗑️' });
    }
  };

  return (
    <div className="space-y-8 select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Alert Dispatch</h2>
          <p className="text-white/50 text-xs mt-1">Real-time status updates for low stock breaches and short-dated expiries.</p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-white/5 border border-white/10 p-1.5 rounded-xl self-start">
          {(['ALL', 'STOCK', 'EXPIRY'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                activeTab === tab
                  ? 'bg-white/10 text-[#00D4FF] border border-[#00d4ff]/10 shadow-[0_0_10px_rgba(0,212,255,0.05)]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {tab === 'ALL' ? 'All Alerts' : tab === 'STOCK' ? 'Low Stock' : 'Near Expiry'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="space-y-6">
        
        {/* Low Stock Section */}
        {(activeTab === 'ALL' || activeTab === 'STOCK') && (
          <div className="space-y-4">
            <h3 className="text-white/70 text-xs font-mono tracking-wider uppercase flex items-center gap-2">
              <Archive className="h-4 w-4 text-[#FFB300]" /> Stock Depletion Warnings ({lowStockMedicines.length})
            </h3>
            {lowStockMedicines.length === 0 ? (
              <p className="text-white/30 text-xs font-mono bg-white/5 border border-white/5 p-6 rounded-2xl text-center">
                All inventory quantities exceed safety thresholds.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {lowStockMedicines.map((med) => (
                  <LowStockCard
                    key={med.id}
                    medicine={med}
                    onRestock={handleRestock}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Expiry Section */}
        {(activeTab === 'ALL' || activeTab === 'EXPIRY') && (
          <div className="space-y-4 pt-4 border-t border-white/5">
            <h3 className="text-white/70 text-xs font-mono tracking-wider uppercase flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#FF4757]" /> Chemical Shelf Life Expirations ({expiringMedicines.length})
            </h3>
            {expiringMedicines.length === 0 ? (
              <p className="text-white/30 text-xs font-mono bg-white/5 border border-white/5 p-6 rounded-2xl text-center">
                All active inventory shelf life remains stable.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {expiringMedicines.map((med) => (
                  <ExpiryAlertCard
                    key={med.id}
                    medicine={med}
                    onDispose={handleDispose}
                  />
                ))}
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
