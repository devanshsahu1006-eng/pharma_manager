'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Trash2, 
  Plus, 
  Minus, 
  CheckCircle, 
  AlertCircle, 
  Barcode, 
  X,
  Volume2
} from 'lucide-react';
import { Medicine, SaleItem } from '../../types/pharmacy';
import { toast } from 'sonner';

interface SaleFormProps {
  medicines: Medicine[];
  onSubmit: (items: SaleItem[], invoiceNumber: string) => void;
}

export default function SaleForm({ medicines, onSubmit }: SaleFormProps) {
  const [selectedMedId, setSelectedMedId] = useState('');
  const [qty, setQty] = useState(1);
  const [customPrice, setCustomPrice] = useState<string>('');
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  
  // Barcode Scanner states
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<any>(null);

  // Generate unique invoice number on load
  useEffect(() => {
    const rnd = Math.floor(100000 + Math.random() * 900000);
    setInvoiceNumber(`INV-${new Date().getFullYear()}-${rnd}`);
  }, []);

  // Set default price of selected medicine
  const selectedMed = medicines.find(m => m.id === selectedMedId);
  useEffect(() => {
    if (selectedMed) {
      setCustomPrice((selectedMed.sellingPrice || 0).toString());
    } else {
      setCustomPrice('');
    }
  }, [selectedMedId, selectedMed]);

  // Handle barcode scanner toggle
  useEffect(() => {
    if (isScanning) {
      startScanner();
    } else {
      stopScanner();
    }
    return () => stopScanner();
  }, [isScanning]);

  const startScanner = async () => {
    try {
      const { BrowserMultiFormatReader } = await import('@zxing/library');
      const reader = new BrowserMultiFormatReader();
      codeReaderRef.current = reader;

      if (!videoRef.current) return;

      toast.info('Accessing camera feed. Standby...', { duration: 1500 });

      // Start decoding from camera stream
      await reader.decodeFromVideoDevice(
        null, // default camera
        videoRef.current,
        (result, err) => {
          if (result) {
            const barcodeText = result.getText();
            toast.success(`Scanned Code: "${barcodeText}"`, { icon: '🏷️' });
            playBeepSound();
            
            // Search inventory for matching barcode or batchCode
            const matched = medicines.find(
              (m) => m.batchNumber === barcodeText || m.id === barcodeText
            );

            if (matched) {
              handleScanMatch(matched);
            } else {
              // Try to fuzzy match first name match
              const fuzzyMatched = medicines.find((m) =>
                m.name.toLowerCase().includes(barcodeText.toLowerCase())
              );
              if (fuzzyMatched) {
                handleScanMatch(fuzzyMatched);
              } else {
                toast.warning(`No matching inventory record for code: "${barcodeText}"`);
              }
            }
            setIsScanning(false);
          }
        }
      );
    } catch (err) {
      console.error('Barcode camera access error:', err);
      toast.error('Could not activate camera. Verify permissions.');
      setIsScanning(false);
    }
  };

  const stopScanner = () => {
    if (codeReaderRef.current) {
      try {
        codeReaderRef.current.reset();
      } catch (e) {}
      codeReaderRef.current = null;
    }
  };

  const playBeepSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch (e) {}
  };

  const handleScanMatch = (med: Medicine) => {
    setSelectedMedId(med.id);
    toast.success(`Loaded target compound: ${med.name}`, { duration: 2000 });
  };

  const addToCart = () => {
    if (!selectedMedId) return;
    const med = medicines.find(m => m.id === selectedMedId);
    if (!med) return;

    const available = med.quantityAvailable ?? 0;
    if (available < qty) {
      toast.error(`Out of bounds. Only ${available} units available in inventory.`, {
        icon: <AlertCircle className="text-red-500" />
      });
      return;
    }

    const price = Number(customPrice) || med.sellingPrice || 0;
    
    // Check if item already exists in cart
    const existingIndex = cart.findIndex(item => item.medicineId === med.id);

    if (existingIndex > -1) {
      const updatedCart = [...cart];
      const newQty = updatedCart[existingIndex].quantitySold + qty;
      if (available < newQty) {
        toast.error(`Aggregate quantity overrides limit (${available} units).`);
        return;
      }
      updatedCart[existingIndex].quantitySold = newQty;
      updatedCart[existingIndex].totalAmount = newQty * price;
      setCart(updatedCart);
    } else {
      setCart([
        ...cart,
        {
          medicineId: med.id,
          medicineName: med.name,
          batchNumber: med.batchNumber || 'N/A',
          quantitySold: qty,
          sellingPrice: price,
          totalAmount: qty * price,
          profitEarned: qty * (price - (med.purchasePrice || 0)),
        }
      ]);
    }

    toast.success(`Appended to sales register: ${med.name}`);
    setSelectedMedId('');
    setQty(1);
    setCustomPrice('');
  };

  const removeFromCart = (index: number) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  const handleCartQty = (index: number, delta: number) => {
    const updated = [...cart];
    const item = updated[index];
    const med = medicines.find(m => m.id === item.medicineId);
    if (!med) return;

    const newQty = item.quantitySold + delta;
    if (newQty <= 0) {
      removeFromCart(index);
      return;
    }

    const available = med.quantityAvailable ?? 0;
    if (available < newQty) {
      toast.error(`Stock capacity reached (${available} max)`);
      return;
    }

    item.quantitySold = newQty;
    item.totalAmount = newQty * item.sellingPrice;
    item.profitEarned = newQty * (item.sellingPrice - (med.purchasePrice || 0));
    setCart(updated);
  };

  // Calculations
  const cartSubtotal = cart.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalItems = cart.reduce((acc, curr) => acc + curr.quantitySold, 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('The checkout register cart is currently empty.');
      return;
    }
    onSubmit(cart, invoiceNumber);
    setCart([]);
    // Regenerate invoice code
    const rnd = Math.floor(100000 + Math.random() * 900000);
    setInvoiceNumber(`INV-${new Date().getFullYear()}-${rnd}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Left panel: Cart configuration */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-white font-semibold text-sm">Register Cart Items</h3>
            <span className="text-xs font-mono text-[#00D4FF] font-semibold">{invoiceNumber}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/50">Select Compound</label>
              <select
                value={selectedMedId}
                onChange={(e) => setSelectedMedId(e.target.value)}
                className="bg-white/5 border border-white/10 focus:border-[#00D4FF]/40 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-white/95 transition-all appearance-none [&>option]:bg-[#050E1A]"
              >
                <option value="">-- Choose Medicine --</option>
                {medicines.filter(m => (m.quantityAvailable || 0) > 0).map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.quantityAvailable} units)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-xs text-white/50">Unit Price (₹)</label>
                <input
                  type="number"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  placeholder="Price"
                  className="bg-white/5 border border-white/10 focus:border-[#00D4FF]/40 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-white transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5 w-24">
                <label className="text-xs text-white/50">Qty</label>
                <input
                  type="number"
                  min="1"
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                  className="bg-white/5 border border-white/10 focus:border-[#00D4FF]/40 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-white text-center transition-all"
                />
              </div>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsScanning(!isScanning)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                isScanning 
                  ? 'bg-red-500/10 border-red-500/30 text-[#FF4757] hover:bg-red-500/20' 
                  : 'bg-white/5 border-white/10 hover:border-[#00D4FF]/30 text-white/80 hover:text-white'
              }`}
            >
              <Camera className="h-4 w-4" /> 
              {isScanning ? 'Disable Camera' : 'Camera Scan Barcode'}
            </button>

            <button
              type="button"
              disabled={!selectedMedId}
              onClick={addToCart}
              className="flex items-center gap-1.5 bg-[#00D4FF]/10 hover:bg-[#00D4FF]/20 border border-[#00D4FF]/30 hover:border-[#00D4FF]/50 text-[#00D4FF] px-5 py-2.5 rounded-xl text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
            >
              <Plus className="h-4 w-4" /> Add Item
            </button>
          </div>
        </div>

        {/* Video Viewfinder (Conditionally visible) */}
        {isScanning && (
          <div className="bg-black border border-[#FF4757]/30 rounded-2xl overflow-hidden relative aspect-video flex items-center justify-center">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
            {/* Viewfinder crosshairs */}
            <div className="absolute inset-8 border border-white/20 pointer-events-none rounded-xl flex items-center justify-center">
              <div className="w-48 h-0.5 bg-[#FF4757] opacity-60 animate-pulse" />
            </div>
            <button
              onClick={() => setIsScanning(false)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
            <span className="absolute bottom-3 left-3 bg-black/70 px-2 py-0.5 rounded text-[9px] font-mono text-white/70">
              ALIGN BARCODE OR BATCH CODE IN CAMERA
            </span>
          </div>
        )}
      </div>

      {/* Right panel: Cart contents details and checkout button */}
      <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl flex flex-col justify-between min-h-[380px] shadow-[0_4px_30px_rgba(0,0,0,0.15)] relative">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-white font-semibold text-sm">Receipt Summary</h3>
            <span className="text-[10px] font-mono text-white/40">{totalItems} Item(s) in checklist</span>
          </div>

          {/* Cart item loop */}
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="text-center py-10 text-white/30 font-mono text-xs flex flex-col items-center gap-2">
                <Barcode className="h-8 w-8 text-white/20" />
                No checkout items. Add products to begin checkout.
              </div>
            ) : (
              cart.map((item, idx) => (
                <div 
                  key={`${item.medicineId}-${idx}`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all"
                >
                  <div className="flex flex-col min-w-0 flex-1 pr-2">
                    <span className="text-xs font-semibold text-white truncate">{item.medicineName}</span>
                    <span className="text-[10px] text-white/40 font-mono">
                      Batch: {item.batchNumber} @ ₹{item.sellingPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1.5 bg-white/5 rounded-lg border border-white/5 px-1 py-0.5">
                      <button
                        onClick={() => handleCartQty(idx, -1)}
                        className="p-0.5 hover:bg-white/5 rounded text-white/60 hover:text-white cursor-pointer"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-xs font-mono font-bold w-5 text-center text-white">{item.quantitySold}</span>
                      <button
                        onClick={() => handleCartQty(idx, 1)}
                        className="p-0.5 hover:bg-white/5 rounded text-white/60 hover:text-white cursor-pointer"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="text-xs font-bold font-mono text-[#00FF88] w-18 text-right">
                      ₹{item.totalAmount.toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(idx)}
                      className="text-white/30 hover:text-[#FF4757] p-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Valuation and trigger */}
        <div className="mt-6 pt-4 border-t border-white/10 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-white/40">TOTAL TAX INCL.</span>
            <span className="text-white font-bold text-lg">₹{cartSubtotal.toFixed(2)}</span>
          </div>

          <button
            type="button"
            disabled={cart.length === 0}
            onClick={handleCheckout}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#00D4FF] to-[#00FF88] text-[#050E1A] font-bold text-xs py-3 rounded-xl hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01] cursor-pointer transition-all uppercase tracking-wider"
          >
            <CheckCircle className="h-4 w-4" /> Finalize Sale & Invoice
          </button>
        </div>
      </div>

    </div>
  );
}
