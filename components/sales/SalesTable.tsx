'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  DollarSign
} from 'lucide-react';
import { Sale } from '../../types/pharmacy';
import InvoiceGenerator from './InvoiceGenerator';

interface SalesTableProps {
  sales: Sale[];
}

export default function SalesTable({ sales }: SalesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<'soldAt' | 'totalAmount'>('soldAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const itemsPerPage = 5;

  const handleSort = (field: 'soldAt' | 'totalAmount') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc'); // default desc for dates/amounts
    }
  };

  const processedSales = useMemo(() => {
    const list = [...sales];
    list.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === 'soldAt') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [sales, sortField, sortOrder]);

  const totalPages = Math.max(Math.ceil(processedSales.length / itemsPerPage), 1);
  const paginatedSales = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedSales.slice(start, start + itemsPerPage);
  }, [processedSales, currentPage]);

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold text-sm">Completed Invoices Logs</h3>
        <span className="text-xs font-mono text-white/40">Total Sales: {processedSales.length}</span>
      </div>

      <div className="w-full overflow-x-auto bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[750px]">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02] text-white/50 text-[10px] font-mono tracking-wider uppercase select-none">
              <th className="p-4 pl-6">Invoice ID</th>
              <th className="p-4">Medicine Item</th>
              <th className="p-4">Batch</th>
              <th className="p-4">Qty</th>
              <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('soldAt')}>
                <div className="flex items-center gap-1">Timestamp <ArrowUpDown className="h-3 w-3" /></div>
              </th>
              <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('totalAmount')}>
                <div className="flex items-center gap-1">Net Sale <ArrowUpDown className="h-3 w-3" /></div>
              </th>
              <th className="p-4">Margin Profit</th>
              <th className="p-4 pr-6 text-right">Compile Invoice</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSales.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-white/30 font-mono text-xs">
                  No invoice logs found in sales records.
                </td>
              </tr>
            ) : (
              paginatedSales.map((sale, index) => (
                <motion.tr
                  key={sale.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.25 }}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group text-sm font-sans"
                >
                  <td className="p-4 pl-6 font-mono text-xs text-[#00D4FF] font-semibold">{sale.invoiceNumber}</td>
                  <td className="p-4 font-semibold text-white">{sale.medicineName}</td>
                  <td className="p-4 font-mono text-xs text-white/60">{sale.batchNumber || 'N/A'}</td>
                  <td className="p-4 font-mono text-xs text-white/70">{sale.quantitySold} units</td>
                  <td className="p-4 font-mono text-xs text-white/50">{formatDate(sale.soldAt)}</td>
                  <td className="p-4 font-mono text-xs font-bold text-white">₹{sale.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="p-4 font-mono text-xs text-[#00FF88] font-semibold">+₹{(sale.profitEarned || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="p-4 pr-6 text-right">
                    <InvoiceGenerator
                      invoiceNumber={sale.invoiceNumber}
                      items={[
                        {
                          medicineId: sale.medicineId,
                          medicineName: sale.medicineName,
                          batchNumber: sale.batchNumber,
                          quantitySold: sale.quantitySold,
                          sellingPrice: sale.sellingPrice,
                          totalAmount: sale.totalAmount,
                          profitEarned: sale.profitEarned || 0,
                        }
                      ]}
                      totalAmount={sale.totalAmount}
                    />
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
