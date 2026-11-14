'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Save, Activity } from 'lucide-react';
import { Medicine } from '../../types/pharmacy';
import { calculateGST, calculateFinalPrice } from '../../lib/calculations';

interface AddMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  medicineToEdit?: Medicine | null;
}

export default function AddMedicineModal({ isOpen, onClose, onSubmit, medicineToEdit }: AddMedicineModalProps) {
  const [name, setName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [manufacturerName, setManufacturerName] = useState('');
  const [manufacturingDate, setManufacturingDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [purchasePrice, setPurchasePrice] = useState<number>(0);
  const [mrp, setMrp] = useState<number>(0);
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [gstPercentage, setGstPercentage] = useState<number>(12);
  const [quantityAvailable, setQuantityAvailable] = useState<number>(0);
  const [minimumThreshold, setMinimumThreshold] = useState<number>(10);
  const [storageCategory, setStorageCategory] = useState<string>('ROOM_TEMP');

  // Load existing medicine values if editing
  useEffect(() => {
    if (medicineToEdit) {
      setName(medicineToEdit.name || '');
      setGenericName(medicineToEdit.genericName || '');
      setBatchNumber(medicineToEdit.batchNumber || '');
      setSupplierName(medicineToEdit.supplierName || '');
      setManufacturerName(medicineToEdit.manufacturerName || '');
      setManufacturingDate(medicineToEdit.manufacturingDate ? new Date(medicineToEdit.manufacturingDate).toISOString().substring(0, 10) : '');
      setExpiryDate(medicineToEdit.expiryDate ? new Date(medicineToEdit.expiryDate).toISOString().substring(0, 10) : '');
      setPurchasePrice(medicineToEdit.purchasePrice || 0);
      setMrp(medicineToEdit.mrp || 0);
      setSellingPrice(medicineToEdit.sellingPrice || 0);
      setGstPercentage(medicineToEdit.gstPercentage || 0);
      setQuantityAvailable(medicineToEdit.quantityAvailable || 0);
      setMinimumThreshold(medicineToEdit.minimumThreshold || 0);
      setStorageCategory(medicineToEdit.storageCategory || 'ROOM_TEMP');
    } else {
      // Clear forms
      setName('');
      setGenericName('');
      setBatchNumber('');
      setSupplierName('');
      setManufacturerName('');
      setManufacturingDate('');
      setExpiryDate('');
      setPurchasePrice(0);
      setMrp(0);
      setSellingPrice(0);
      setGstPercentage(12);
      setQuantityAvailable(0);
      setMinimumThreshold(10);
      setStorageCategory('ROOM_TEMP');
    }
  }, [medicineToEdit, isOpen]);

  // Derived real-time calculations
  const gstAmount = calculateGST(purchasePrice, gstPercentage);
  const finalPrice = calculateFinalPrice(purchasePrice, gstAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    onSubmit({
      name,
      genericName: genericName || null,
      batchNumber: batchNumber || null,
      supplierName: supplierName || null,
      manufacturerName: manufacturerName || null,
      manufacturingDate: manufacturingDate || null,
      expiryDate: expiryDate || null,
      purchasePrice,
      mrp,
      sellingPrice,
      gstPercentage,
      quantityAvailable,
      minimumThreshold,
      storageCategory,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay glass panel backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#050E1A]/85 backdrop-blur-md cursor-pointer"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="bg-[#050E1A]/95 border border-[#00d4ff]/20 w-full max-w-2xl rounded-2xl shadow-[0_10px_40px_rgba(0,212,255,0.15)] relative overflow-hidden flex flex-col max-h-[90vh] text-white z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10 shrink-0 bg-white/[0.01]">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-[#00D4FF]" />
                <span className="font-bold tracking-wide">
                  {medicineToEdit ? 'Configure Stock Reference' : 'Register New Compound'}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-white/5 border border-transparent hover:border-white/15 rounded-lg text-white/50 hover:text-white transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form Scroll Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              
              {/* Basic Section */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono text-[#00D4FF] tracking-wider uppercase border-b border-white/5 pb-1">Compound Specifications</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-white/60">Medicine Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Lipitor 10mg"
                      className="bg-white/5 border border-white/10 focus:border-[#00D4FF]/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-white/60">Generic Chemical Compound</label>
                    <input
                      type="text"
                      value={genericName}
                      onChange={(e) => setGenericName(e.target.value)}
                      placeholder="e.g. Atorvastatin Calcium"
                      className="bg-white/5 border border-white/10 focus:border-[#00D4FF]/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-white/60">Batch Reference Code</label>
                    <input
                      type="text"
                      value={batchNumber}
                      onChange={(e) => setBatchNumber(e.target.value)}
                      placeholder="e.g. B-LPT90"
                      className="bg-white/5 border border-white/10 focus:border-[#00D4FF]/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-white/60">Supplier Channel</label>
                    <input
                      type="text"
                      value={supplierName}
                      onChange={(e) => setSupplierName(e.target.value)}
                      placeholder="e.g. Apex Druggists"
                      className="bg-white/5 border border-white/10 focus:border-[#00D4FF]/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-white/60">Manufacturer Entity</label>
                    <input
                      type="text"
                      value={manufacturerName}
                      onChange={(e) => setManufacturerName(e.target.value)}
                      placeholder="e.g. Pfizer Healthcare"
                      className="bg-white/5 border border-white/10 focus:border-[#00D4FF]/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Manufacturing & Storage */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono text-[#00D4FF] tracking-wider uppercase border-b border-white/5 pb-1">Lifecycle & Logistics</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-white/60">Mfg Date</label>
                    <input
                      type="date"
                      value={manufacturingDate}
                      onChange={(e) => setManufacturingDate(e.target.value)}
                      className="bg-white/5 border border-white/10 focus:border-[#00D4FF]/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-white/95 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-white/60">Exp Date</label>
                    <input
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="bg-white/5 border border-white/10 focus:border-[#00D4FF]/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-white/95 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-white/60">Storage Environment</label>
                    <select
                      value={storageCategory}
                      onChange={(e) => setStorageCategory(e.target.value)}
                      className="bg-white/5 border border-white/10 focus:border-[#00D4FF]/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-white/95 transition-all appearance-none [&>option]:bg-[#050E1A]"
                    >
                      <option value="ROOM_TEMP">Room Temp (20-25°C)</option>
                      <option value="REFRIGERATED">Cold Storage (2-8°C)</option>
                      <option value="CONTROLLED">Controlled Lockbox</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Financials & Stocking */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono text-[#00D4FF] tracking-wider uppercase border-b border-white/5 pb-1">Quantities & Valuation</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-white/60">Purchase Price (₹)</label>
                    <input
                      type="number"
                      step="any"
                      value={purchasePrice || ''}
                      onChange={(e) => setPurchasePrice(Number(e.target.value))}
                      placeholder="Cost"
                      className="bg-white/5 border border-white/10 focus:border-[#00D4FF]/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-white/60">MRP (₹)</label>
                    <input
                      type="number"
                      step="any"
                      value={mrp || ''}
                      onChange={(e) => setMrp(Number(e.target.value))}
                      placeholder="Retail"
                      className="bg-white/5 border border-white/10 focus:border-[#00D4FF]/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-white/60">Selling Price (₹)</label>
                    <input
                      type="number"
                      step="any"
                      value={sellingPrice || ''}
                      onChange={(e) => setSellingPrice(Number(e.target.value))}
                      placeholder="POS price"
                      className="bg-white/5 border border-white/10 focus:border-[#00D4FF]/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-white/60">GST Rate (%)</label>
                    <input
                      type="number"
                      value={gstPercentage || ''}
                      onChange={(e) => setGstPercentage(Number(e.target.value))}
                      placeholder="12%"
                      className="bg-white/5 border border-white/10 focus:border-[#00D4FF]/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Auto calculations display */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 grid grid-cols-2 gap-4 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-white/40">Auto-GST Amt:</span>
                    <span className="text-[#00D4FF] font-semibold">₹{gstAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-l border-white/10 pl-4">
                    <span className="text-white/40">Auto-Final Cost:</span>
                    <span className="text-[#00FF88] font-semibold">₹{finalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-white/60">Quantity Available</label>
                    <input
                      type="number"
                      value={quantityAvailable || ''}
                      onChange={(e) => setQuantityAvailable(Number(e.target.value))}
                      placeholder="e.g. 100"
                      className="bg-white/5 border border-white/10 focus:border-[#00D4FF]/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-white/60">Minimum Stock Threshold</label>
                    <input
                      type="number"
                      value={minimumThreshold || ''}
                      onChange={(e) => setMinimumThreshold(Number(e.target.value))}
                      placeholder="e.g. 20"
                      className="bg-white/5 border border-white/10 focus:border-[#00D4FF]/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-white/80 hover:text-white hover:bg-white/5 cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-gradient-to-r from-[#00D4FF] to-[#00FF88] hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] px-5 py-2.5 rounded-xl text-xs font-bold text-[#050E1A] hover:scale-[1.02] cursor-pointer transition-all"
                >
                  {medicineToEdit ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  {medicineToEdit ? 'Save Changes' : 'Enroll Compound'}
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
