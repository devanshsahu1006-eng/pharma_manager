import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Sale, Medicine } from '../types/pharmacy';
import { calculateGST, calculateFinalPrice, calculateProfit } from '../lib/calculations';

interface CartItem {
  medicine: Medicine;
  quantity: number;
  sellingPrice: number;
  gstAmount: number;
  totalAmount: number;
}

interface SalesState {
  cart: CartItem[];
  salesLogs: Sale[];
  isLoading: boolean;
  addToCart: (medicine: Medicine, quantity: number) => void;
  removeFromCart: (medicineId: string) => void;
  updateQuantity: (medicineId: string, quantity: number) => void;
  clearCart: () => void;
  checkout: (invoiceNumber: string) => Promise<any>;
  fetchSales: () => Promise<void>;
}

export const useSalesStore = create<SalesState>()(
  persist(
    (set, get) => ({
      cart: [],
      salesLogs: [],
      isLoading: false,

      addToCart: (medicine, quantity) => {
        const { cart } = get();
        const existing = cart.find((item) => item.medicine.id === medicine.id);

        const price = medicine.sellingPrice || 0;
        const gstPercent = medicine.gstPercentage || 0;
        const gstAmount = calculateGST(price, gstPercent);
        const lineTotal = calculateFinalPrice(price, gstAmount) * quantity;

        if (existing) {
          set({
            cart: cart.map((item) =>
              item.medicine.id === medicine.id
                ? {
                    ...item,
                    quantity: item.quantity + quantity,
                    totalAmount: calculateFinalPrice(price, gstAmount) * (item.quantity + quantity),
                  }
                : item
            ),
          });
        } else {
          set({
            cart: [
              ...cart,
              {
                medicine,
                quantity,
                sellingPrice: price,
                gstAmount: gstAmount * quantity,
                totalAmount: lineTotal,
              },
            ],
          });
        }
      },

      removeFromCart: (medicineId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.medicine.id !== medicineId),
        }));
      },

      updateQuantity: (medicineId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(medicineId);
          return;
        }
        set((state) => ({
          cart: state.cart.map((item) => {
            if (item.medicine.id === medicineId) {
              const price = item.medicine.sellingPrice || 0;
              const gstPercent = item.medicine.gstPercentage || 0;
              const gstAmount = calculateGST(price, gstPercent);
              return {
                ...item,
                quantity,
                gstAmount: gstAmount * quantity,
                totalAmount: calculateFinalPrice(price, gstAmount) * quantity,
              };
            }
            return item;
          }),
        }));
      },

      clearCart: () => set({ cart: [] }),

      checkout: async (invoiceNumber) => {
        const { cart } = get();
        if (cart.length === 0) return;

        set({ isLoading: true });
        try {
          // Loop through items in cart and submit to API
          const promises = cart.map(async (item) => {
            const profit = calculateProfit(
              item.sellingPrice,
              item.medicine.purchasePrice || 0,
              item.quantity
            );

            const salePayload = {
              medicineId: item.medicine.id,
              medicineName: item.medicine.name,
              batchNumber: item.medicine.batchNumber || 'N/A',
              quantitySold: item.quantity,
              sellingPrice: item.sellingPrice,
              totalAmount: item.totalAmount,
              profitEarned: profit,
              invoiceNumber: `${invoiceNumber}-${item.medicine.id.substring(0, 4)}`,
            };

            const res = await fetch('/api/sales', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(salePayload),
            });

            if (!res.ok) throw new Error('Checkout API failure');
            return res.json();
          });

          const newSales = await Promise.all(promises);
          set((state) => ({
            salesLogs: [...newSales, ...state.salesLogs],
            cart: [],
          }));
          return newSales;
        } catch (error) {
          console.warn('API checkout failed, performing local transaction:', error);

          // Local fallback
          const localSales: Sale[] = cart.map((item, idx) => ({
            id: 'sale_' + Math.random().toString(36).substring(2, 9),
            medicineId: item.medicine.id,
            medicineName: item.medicine.name,
            batchNumber: item.medicine.batchNumber || 'LOCAL',
            quantitySold: item.quantity,
            sellingPrice: item.sellingPrice,
            totalAmount: item.totalAmount,
            profitEarned: calculateProfit(
              item.sellingPrice,
              item.medicine.purchasePrice || 0,
              item.quantity
            ),
            soldAt: new Date().toISOString(),
            invoiceNumber: `${invoiceNumber}-${idx}`,
          }));

          set((state) => ({
            salesLogs: [...localSales, ...state.salesLogs],
            cart: [],
          }));

          return localSales;
        } finally {
          set({ isLoading: false });
        }
      },

      fetchSales: async () => {
        set({ isLoading: true });
        try {
          const response = await fetch('/api/sales');
          if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
              set({ salesLogs: data });
            }
          }
        } catch (error) {
          console.warn('API error, using local fallback state:', error);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'pharmaos-sales',
    }
  )
);
