'use client';

import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Trash2, 
  CheckCircle,
  Truck,
  FileSpreadsheet
} from 'lucide-react';
import { useInventoryStore } from '../../../store/useInventoryStore';
import { calculateGST, calculateFinalPrice } from '../../../lib/calculations';
import { toast } from 'sonner';

interface IngestionItem {
  name: string;
  genericName: string;
  batchNumber: string;
  manufacturerName: string;
  expiryDate: string;
  purchasePrice: number;
  mrp: number;
  sellingPrice: number;
  gstPercentage: number;
  quantityAvailable: number;
  minimumThreshold: number;
}

export default function PurchasesPage() {
  const addMedicine = useInventoryStore((state) => state.addMedicine);
  const medicines = useInventoryStore((state) => state.medicines);

  // Form states
  const [supplierName, setSupplierName] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().substring(0, 10));

  // Current draft list
  const [draftCargo, setDraftCargo] = useState<IngestionItem[]>([]);

  // Draft item fields
  const [name, setName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [manufacturerName, setManufacturerName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [purchasePrice, setPurchasePrice] = useState<number>(0);
  const [mrp, setMrp] = useState<number>(0);
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [gstPercentage, setGstPercentage] = useState<number>(12);
  const [quantityAvailable, setQuantityAvailable] = useState<number>(0);
  const [minimumThreshold, setMinimumThreshold] = useState<number>(10);

  const addCargoToDraft = () => {
    if (!name || !batchNumber || quantityAvailable <= 0 || purchasePrice <= 0) {
      toast.error('Complete name, batch code, quantity, and cost value to append.');
      return;
    }

    setDraftCargo([
      ...draftCargo,
      {
        name,
        genericName,
        batchNumber,
        manufacturerName,
        expiryDate,
        purchasePrice,
        mrp,
        sellingPrice,
        gstPercentage,
        quantityAvailable,
        minimumThreshold,
      }
    ]);

    // Clear fields
    setName('');
    setGenericName('');
    setBatchNumber('');
    setManufacturerName('');
    setExpiryDate('');
    setPurchasePrice(0);
    setMrp(0);
    setSellingPrice(0);
    setGstPercentage(12);
    setQuantityAvailable(0);
    setMinimumThreshold(10);

    toast.success('Appended to cargo list');
  };

  const removeDraftItem = (index: number) => {
    const updated = [...draftCargo];
    updated.splice(index, 1);
    setDraftCargo(updated);
  };

  const handleIngestShipment = () => {
    if (!supplierName || !invoiceNumber) {
      toast.error('Supplier identity and Invoice code are required.');
      return;
    }
    if (draftCargo.length === 0) {
      toast.error('Cargo draft list is empty.');
      return;
    }

    // Ingest each medicine draft item into inventory store
    draftCargo.forEach((item) => {
      addMedicine({
        ...item,
        supplierName,
        invoiceNumber,
        purchaseDate: new Date(purchaseDate),
      });
    });

    toast.success(`Shipment cargo successfully ingested! Register updated.`, {
      icon: <CheckCircle className="text-[#00FF88]" />
    });

    setDraftCargo([]);
    setSupplierName('');
    setInvoiceNumber('');
  };

  // Aggregates
  const totalCost = draftCargo.reduce((acc, curr) => {
    const gstAmt = calculateGST(curr.purchasePrice, curr.gstPercentage);
    const final = calculateFinalPrice(curr.purchasePrice, gstAmt);
    return acc + final * curr.quantityAvailable;
  }, 0);

  return (
    <div className="space-y-8 select-none">
      
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Purchase Operations</h2>
        <p className="text-white/50 text-xs mt-1">Receive new chemical supplies and bulk shipments into the registry.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Draft Cargo Form */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* Shipment Headers */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl space-y-4">
            <h3 className="text-white font-semibold text-sm flex items-center gap-2">
              <Truck className="h-4.5 w-4.5 text-[#00D4FF]" /> 1. Shipment Meta Info
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/50">Supplier name *</label>
                <input
                  type="text"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  placeholder="e.g. Apex Biotech"
                  className="bg-white/5 border border-white/10 focus:border-[#00D4FF]/40 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-white transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/50">Invoice Number *</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="e.g. SHIP-77980"
                  className="bg-white/5 border border-white/10 focus:border-[#00D4FF]/40 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-white transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/50">Date Received</label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="bg-white/5 border border-white/10 focus:border-[#00D4FF]/40 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-white transition-all text-white/95"
                />
              </div>
            </div>
          </div>

          {/* Add Item form */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl space-y-4">
            <h3 className="text-white font-semibold text-sm flex items-center gap-2">
              <ShoppingBag className="h-4.5 w-4.5 text-[#00D4FF]" /> 2. Append Cargo Item
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/50">Medicine Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Paracetamol 500mg"
                  className="bg-white/5 border border-white/10 focus:border-[#00D4FF]/40 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-white transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/50">Generic Compound</label>
                <input
                  type="text"
                  value={genericName}
                  onChange={(e) => setGenericName(e.target.value)}
                  placeholder="e.g. Acetaminophen"
                  className="bg-white/5 border border-white/10 focus:border-[#00D4FF]/40 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/50">Batch Code *</label>
                <input
                  type="text"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  placeholder="e.g. PR-22"
                  className="bg-white/5 border border-white/10 focus:border-[#00D4FF]/40 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-white transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/50">Manufacturer</label>
                <input
                  type="text"
                  value={manufacturerName}
                  onChange={(e) => setManufacturerName(e.target.value)}
                  placeholder="e.g. GSK Labs"
                  className="bg-white/5 border border-white/10 focus:border-[#00D4FF]/40 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-white transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/50">Expiry Date</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="bg-white/5 border border-white/10 focus:border-[#00D4FF]/40 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-white transition-all text-white/95"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/50">Purchase Cost (₹) *</label>
                <input
                  type="number"
                  step="any"
                  value={purchasePrice || ''}
                  onChange={(e) => setPurchasePrice(Number(e.target.value))}
                  placeholder="0.00"
                  className="bg-white/5 border border-white/10 focus:border-[#00D4FF]/40 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-white transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/50">MRP (₹)</label>
                <input
                  type="number"
                  step="any"
                  value={mrp || ''}
                  onChange={(e) => setMrp(Number(e.target.value))}
                  placeholder="0.00"
                  className="bg-white/5 border border-white/10 focus:border-[#00D4FF]/40 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-white transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/50">Selling Price (₹)</label>
                <input
                  type="number"
                  step="any"
                  value={sellingPrice || ''}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  placeholder="0.00"
                  className="bg-white/5 border border-white/10 focus:border-[#00D4FF]/40 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-white transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/50">GST (%)</label>
                <input
                  type="number"
                  value={gstPercentage || ''}
                  onChange={(e) => setGstPercentage(Number(e.target.value))}
                  placeholder="12%"
                  className="bg-white/5 border border-white/10 focus:border-[#00D4FF]/40 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/50">Quantity Received *</label>
                <input
                  type="number"
                  value={quantityAvailable || ''}
                  onChange={(e) => setQuantityAvailable(Number(e.target.value))}
                  placeholder="e.g. 500"
                  className="bg-white/5 border border-white/10 focus:border-[#00D4FF]/40 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-white transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/50">Low Threshold</label>
                <input
                  type="number"
                  value={minimumThreshold || ''}
                  onChange={(e) => setMinimumThreshold(Number(e.target.value))}
                  placeholder="e.g. 15"
                  className="bg-white/5 border border-white/10 focus:border-[#00D4FF]/40 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-white transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={addCargoToDraft}
                className="flex items-center gap-1 text-xs font-bold text-[#00D4FF] hover:text-[#00FF88] border border-[#00D4FF]/25 hover:border-[#00FF88]/30 bg-white/5 px-4 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Append to Shipment list
              </button>
            </div>
          </div>

        </div>

        {/* Right Side: Cargo Summary and action triggers */}
        <div className="xl:col-span-4 bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl flex flex-col justify-between min-h-[460px] shadow-[0_4px_30px_rgba(0,0,0,0.15)] relative">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-white font-semibold text-sm">Cargo Checklist</h3>
              <span className="text-[10px] font-mono text-white/40">{draftCargo.length} Item(s)</span>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
              {draftCargo.length === 0 ? (
                <div className="text-center py-16 text-white/30 font-mono text-xs flex flex-col items-center gap-2">
                  <FileSpreadsheet className="h-8 w-8 text-white/20" />
                  Cargo empty. Append items to register shipment.
                </div>
              ) : (
                draftCargo.map((item, idx) => {
                  const gst = calculateGST(item.purchasePrice, item.gstPercentage);
                  const finalCost = calculateFinalPrice(item.purchasePrice, gst);
                  return (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04]">
                      <div className="flex flex-col min-w-0 flex-1 pr-2">
                        <span className="text-xs font-semibold text-white truncate">{item.name}</span>
                        <span className="text-[10px] text-white/40 font-mono">
                          Batch: {item.batchNumber} | Cost: ₹{finalCost.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs font-mono text-white/70">{item.quantityAvailable} units</span>
                        <button
                          onClick={() => removeDraftItem(idx)}
                          className="text-white/30 hover:text-[#FF4757] p-1 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-white/40">TOTAL COST ESTIMATE</span>
              <span className="text-white font-bold text-base">₹{totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            
            <button
              onClick={handleIngestShipment}
              disabled={draftCargo.length === 0 || !supplierName || !invoiceNumber}
              className="w-full bg-gradient-to-r from-[#00D4FF] to-[#00FF88] text-[#050E1A] font-bold text-xs py-3 rounded-xl hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01] cursor-pointer transition-all uppercase tracking-wider"
            >
              Ingest Cargo Shipment
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
