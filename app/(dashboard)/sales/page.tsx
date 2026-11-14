'use client';

import React, { useEffect } from 'react';
import { useInventoryStore } from '../../../store/useInventoryStore';
import { useSalesStore } from '../../../store/useSalesStore';
import SaleForm from '../../../components/sales/SaleForm';
import SalesTable from '../../../components/sales/SalesTable';
import { SaleItem } from '../../../types/pharmacy';
import { toast } from 'sonner';

export default function SalesPage() {
  const medicines = useInventoryStore((state) => state.medicines);
  const updateMedicine = useInventoryStore((state) => state.updateMedicine);
  const salesLogs = useSalesStore((state) => state.salesLogs);
  const checkout = useSalesStore((state) => state.checkout);
  const addToCart = useSalesStore((state) => state.addToCart);
  const clearCart = useSalesStore((state) => state.clearCart);
  const fetchSales = useSalesStore((state) => state.fetchSales);

  // Sync logs on mount
  useEffect(() => {
    fetchSales();
  }, []);

  const handleSaleSubmit = async (cartItems: SaleItem[], invoiceNumber: string) => {
    try {
      // 1. Stage checkout items in Zustand Store
      clearCart();
      cartItems.forEach((item) => {
        const med = medicines.find((m) => m.id === item.medicineId);
        if (med) {
          addToCart(med, item.quantitySold);
        }
      });

      // 2. Process checkout (updates db sales, falls back to local memory if offline)
      const newSales = await checkout(invoiceNumber);

      // 3. Update inventory stocks inside local inventory store to ensure dashboard reflects stock changes immediately
      cartItems.forEach((item) => {
        const med = medicines.find((m) => m.id === item.medicineId);
        if (med) {
          const currentQty = med.quantityAvailable || 0;
          updateMedicine(item.medicineId, {
            quantityAvailable: Math.max(0, currentQty - item.quantitySold),
          });
        }
      });

      toast.success('Sales checkout registered successfully!', { duration: 2500 });
    } catch (err) {
      console.error('POS Checkout failed:', err);
      toast.error('Could not complete checkout flow.');
    }
  };

  return (
    <div className="space-y-8 select-none">
      
      {/* Intro Breadcrumb Title */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Sales Register</h2>
        <p className="text-white/50 text-xs mt-1">Dispense medicines, read barcodes via camera, and output PDF tax invoices.</p>
      </div>

      {/* POS Cart Forms */}
      <SaleForm 
        medicines={medicines} 
        onSubmit={handleSaleSubmit} 
      />

      {/* Invoice Logs */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl space-y-4 shadow-[0_4px_30px_rgba(0,0,0,0.15)]">
        <SalesTable sales={salesLogs} />
      </div>

    </div>
  );
}
