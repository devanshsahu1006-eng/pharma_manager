'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  Edit2, 
  Trash2, 
  Thermometer, 
  Home, 
  Lock 
} from 'lucide-react';
import { Medicine } from '../../types/pharmacy';

interface MedicineTableProps {
  medicines: Medicine[];
  onEdit?: (medicine: Medicine) => void;
  onDelete?: (id: string) => void;
}

type SortField = 'name' | 'quantityAvailable' | 'expiryDate' | 'sellingPrice';
type SortOrder = 'asc' | 'desc';

export default function MedicineTable({ medicines, onEdit, onDelete }: MedicineTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [filterStorage, setFilterStorage] = useState<string>('ALL');

  const itemsPerPage = 6;

  // Sorting logic
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filter & Sort list
  const processedMedicines = useMemo(() => {
    let list = [...medicines];

    // Filter by storage category
    if (filterStorage !== 'ALL') {
      list = list.filter((m) => m.storageCategory === filterStorage);
    }

    // Sort list
    list.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      // Handle nulls
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      // Type checks
      if (sortField === 'expiryDate') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [medicines, sortField, sortOrder, filterStorage]);

  // Pagination bounds
  const totalPages = Math.max(Math.ceil(processedMedicines.length / itemsPerPage), 1);
  const paginatedMedicines = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedMedicines.slice(start, start + itemsPerPage);
  }, [processedMedicines, currentPage]);

  const formatDate = (dateString?: string | Date | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: '2-digit',
      month: 'short',
    });
  };

  const getStatusBadge = (med: Medicine) => {
    const qty = med.quantityAvailable ?? 0;
    const thresh = med.minimumThreshold ?? 10;
    
    if (qty === 0) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-red-500/10 text-[#FF4757] border border-red-500/20">
          OUT OF STOCK
        </span>
      );
    }
    if (qty <= thresh) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-amber-500/10 text-[#FFB300] border border-amber-500/20">
          LOW STOCK
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-green-500/10 text-[#00FF88] border border-green-500/20">
        IN STOCK
      </span>
    );
  };

  const getStorageIcon = (category?: string | null) => {
    switch (category) {
      case 'REFRIGERATED':
        return <span title="Cold Storage Required"><Thermometer className="h-3.5 w-3.5 text-[#00D4FF]" /></span>;
      case 'CONTROLLED':
        return <span title="Controlled Substance"><Lock className="h-3.5 w-3.5 text-[#FF4757]" /></span>;
      default:
        return <span title="Room Temp Storage"><Home className="h-3.5 w-3.5 text-white/40" /></span>;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Table Headers / Filters toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          {['ALL', 'ROOM_TEMP', 'REFRIGERATED', 'CONTROLLED'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setFilterStorage(cat);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border transition-all ${
                filterStorage === cat
                  ? 'bg-[#00D4FF]/10 border-[#00D4FF]/40 text-[#00D4FF]'
                  : 'bg-white/5 border-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>
        <span className="text-xs font-mono text-white/40">
          Showing {processedMedicines.length} Item(s)
        </span>
      </div>

      {/* Grid Container with responsive horizontal scroll scrollbar */}
      <div className="w-full overflow-x-auto bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02] text-white/50 text-[10px] font-mono tracking-wider uppercase select-none">
              <th className="p-4 pl-6">Storage</th>
              <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1">Medicine Name <ArrowUpDown className="h-3 w-3" /></div>
              </th>
              <th className="p-4">Batch Code</th>
              <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('expiryDate')}>
                <div className="flex items-center gap-1">Expiry <ArrowUpDown className="h-3 w-3" /></div>
              </th>
              <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('sellingPrice')}>
                <div className="flex items-center gap-1">Selling Price <ArrowUpDown className="h-3 w-3" /></div>
              </th>
              <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('quantityAvailable')}>
                <div className="flex items-center gap-1">Quantity <ArrowUpDown className="h-3 w-3" /></div>
              </th>
              <th className="p-4">Status</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMedicines.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-white/30 font-mono text-xs">
                  No medicine matches the current profile filters.
                </td>
              </tr>
            ) : (
              paginatedMedicines.map((med, index) => (
                <motion.tr
                  key={med.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group text-sm font-sans"
                >
                  <td className="p-4 pl-6">{getStorageIcon(med.storageCategory)}</td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-white group-hover:text-[#00D4FF] transition-colors">{med.name}</span>
                      <span className="text-[11px] text-white/40">{med.genericName || 'No generic label'}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-xs text-white/70">{med.batchNumber || 'N/A'}</td>
                  <td className="p-4 font-mono text-xs text-white/70">{formatDate(med.expiryDate)}</td>
                  <td className="p-4 font-mono text-xs text-white/70">
                    ₹{(med.sellingPrice ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4 font-mono text-xs text-white/70">
                    {med.quantityAvailable} <span className="text-white/30">units</span>
                  </td>
                  <td className="p-4">{getStatusBadge(med)}</td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(med)}
                          className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-white/70 hover:text-[#00D4FF] border border-white/5 hover:border-[#00D4FF]/20 transition-all cursor-pointer"
                          title="Edit Registry"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(med.id)}
                          className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-white/70 hover:text-[#FF4757] border border-white/5 hover:border-[#FF4757]/20 transition-all cursor-pointer"
                          title="Delete Item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 mt-2">
          <button
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/75 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>
          <span className="text-xs font-mono text-white/50">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/75 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
