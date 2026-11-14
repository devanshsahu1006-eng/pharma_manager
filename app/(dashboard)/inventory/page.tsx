'use client';

import React, { useState } from 'react';
import { Plus, Search, Activity, Pill } from 'lucide-react';
import { useInventoryStore } from '../../../store/useInventoryStore';
import MedicineTable from '../../../components/inventory/MedicineTable';
import AddMedicineModal from '../../../components/inventory/AddMedicineModal';
import { Medicine } from '../../../types/pharmacy';
import { toast } from 'sonner';

export default function InventoryPage() {
  const medicines = useInventoryStore((state) => state.medicines);
  const addMedicine = useInventoryStore((state) => state.addMedicine);
  const updateMedicine = useInventoryStore((state) => state.updateMedicine);
  const deleteMedicine = useInventoryStore((state) => state.deleteMedicine);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);

  // Filter medicines by search query
  const filteredMedicines = medicines.filter((m) => {
    const term = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(term) ||
      (m.genericName?.toLowerCase() || '').includes(term) ||
      (m.batchNumber?.toLowerCase() || '').includes(term) ||
      (m.supplierName?.toLowerCase() || '').includes(term)
    );
  });

  const handleOpenAddModal = () => {
    setEditingMedicine(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this compound from the registry?')) {
      deleteMedicine(id);
      toast.success('Compound reference purged successfully.');
    }
  };

  const handleSubmit = (data: any) => {
    if (editingMedicine) {
      updateMedicine(editingMedicine.id, data);
      toast.success(`Successfully configured: ${data.name}`);
    } else {
      addMedicine(data);
      toast.success(`Successfully registered compound: ${data.name}`);
    }
  };

  return (
    <div className="space-y-8 select-none">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">Inventory Registry</h2>
          <p className="text-white/50 text-xs mt-1">Configure batch codes, pricing matrices, and environmental guidelines.</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 bg-gradient-to-r from-[#00D4FF] to-[#00FF88] hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] px-5 py-2.5 rounded-xl text-xs font-bold text-[#050E1A] hover:scale-[1.02] cursor-pointer transition-all shrink-0"
        >
          <Plus className="h-4 w-4" /> Register Compound
        </button>
      </div>

      {/* Toolbar / Search */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-white/30" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, generic formula, batch..."
            className="w-full bg-white/5 border border-white/10 focus:border-[#00D4FF]/40 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none text-white transition-all placeholder:text-white/30"
          />
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-white/40 ml-auto">
          <Pill className="h-4 w-4 text-[#00D4FF]" />
          <span>Active Items: {medicines.length}</span>
        </div>
      </div>

      {/* Inventory Table List */}
      <MedicineTable
        medicines={filteredMedicines}
        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
      />

      {/* Add / Edit Modal Drawer */}
      <AddMedicineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        medicineToEdit={editingMedicine}
      />

    </div>
  );
}
