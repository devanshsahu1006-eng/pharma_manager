import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Medicine } from '../types/pharmacy';

interface InventoryState {
  medicines: Medicine[];
  isLoading: boolean;
  searchQuery: string;
  selectedMedicine: Medicine | null;
  setSearchQuery: (query: string) => void;
  setSelectedMedicine: (medicine: Medicine | null) => void;
  fetchMedicines: () => Promise<void>;
  addMedicine: (medicine: Omit<Medicine, 'id'>) => Promise<void>;
  updateMedicine: (id: string, medicine: Partial<Medicine>) => Promise<void>;
  deleteMedicine: (id: string) => Promise<void>;
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      medicines: [],
      isLoading: false,
      searchQuery: '',
      selectedMedicine: null,

      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedMedicine: (medicine) => set({ selectedMedicine: medicine }),

      fetchMedicines: async () => {
        set({ isLoading: true });
        try {
          const response = await fetch('/api/medicines');
          if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
              set({ medicines: data });
            }
          }
        } catch (error) {
          console.warn('API error, using local fallback state:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      addMedicine: async (medicineData) => {
        try {
          const response = await fetch('/api/medicines', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(medicineData),
          });

          if (response.ok) {
            const newMedicine = await response.json();
            set((state) => ({ medicines: [newMedicine, ...state.medicines] }));
          } else {
            throw new Error('Failed to create via API');
          }
        } catch (error) {
          console.warn('API add failed, appending locally:', error);
          const newMed: Medicine = {
            ...medicineData,
            id: 'local_' + Math.random().toString(36).substring(2, 9),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          set((state) => ({ medicines: [newMed, ...state.medicines] }));
        }
      },

      updateMedicine: async (id, updatedFields) => {
        try {
          const response = await fetch(`/api/medicines?id=${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedFields),
          });

          if (response.ok) {
            const updatedMed = await response.json();
            set((state) => ({
              medicines: state.medicines.map((m) => (m.id === id ? updatedMed : m)),
            }));
          } else {
            throw new Error('Failed to update via API');
          }
        } catch (error) {
          console.warn('API update failed, updating locally:', error);
          set((state) => ({
            medicines: state.medicines.map((m) =>
              m.id === id ? { ...m, ...updatedFields, updatedAt: new Date().toISOString() } : m
            ),
          }));
        }
      },

      deleteMedicine: async (id) => {
        try {
          const response = await fetch(`/api/medicines?id=${id}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            set((state) => ({
              medicines: state.medicines.filter((m) => m.id !== id),
            }));
          } else {
            throw new Error('Failed to delete via API');
          }
        } catch (error) {
          console.warn('API delete failed, removing locally:', error);
          set((state) => ({
            medicines: state.medicines.filter((m) => m.id !== id),
          }));
        }
      },
    }),
    {
      name: 'pharmaos-inventory',
    }
  )
);
