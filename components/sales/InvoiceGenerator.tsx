'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Download, FileText } from 'lucide-react';
import { SaleItem } from '../../types/pharmacy';
import { InvoiceDocument } from '../../lib/pdf';

// Dynamically import PDFDownloadLink because react-pdf is a client-only library and would throw hydration errors on SSR.
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

interface InvoiceGeneratorProps {
  invoiceNumber: string;
  items: SaleItem[];
  totalAmount: number;
}

export default function InvoiceGenerator({ invoiceNumber, items, totalAmount }: InvoiceGeneratorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-xs font-bold text-white/50 cursor-not-allowed">
        <FileText className="h-4 w-4 text-white/30" /> Preparing engine...
      </button>
    );
  }

  // Map items to match InvoiceProps in lib/pdf.ts
  const mappedSales = items.map((item) => {
    const total = item.totalAmount ?? 0;
    // Assume 18% GST embedded
    const gstPercentage = 18;
    return {
      name: item.medicineName,
      batchNumber: item.batchNumber || 'N/A',
      quantity: item.quantitySold,
      sellingPrice: item.sellingPrice,
      gstPercentage,
      total,
    };
  });

  const subtotal = mappedSales.reduce((acc, item) => acc + (item.total / 1.18), 0);
  const totalGST = totalAmount - subtotal;

  return (
    <div className="inline-block select-none">
      <PDFDownloadLink
        document={
          <InvoiceDocument
            invoiceNumber={invoiceNumber}
            date={new Date().toLocaleDateString()}
            customerName="Walk-in Customer"
            customerPhone="N/A"
            sales={mappedSales}
            subtotal={subtotal}
            totalGST={totalGST}
            discount={0}
            finalAmount={totalAmount}
          />
        }
        fileName={`${invoiceNumber}.pdf`}
      >
        {({ blob, url, loading, error }) => {
          if (loading) {
            return (
              <button 
                disabled 
                className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-xs font-semibold text-white/50 cursor-not-allowed animate-pulse"
              >
                <FileText className="h-4 w-4 text-[#00D4FF] animate-spin" /> Compiling Document Vector...
              </button>
            );
          }

          if (error) {
            console.error('Invoice compiler error:', error);
            return (
              <button 
                disabled 
                className="flex items-center gap-2 bg-red-500/10 border border-red-500/25 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#FF4757] cursor-not-allowed"
              >
                <FileText className="h-4 w-4" /> System compilation failed
              </button>
            );
          }

          return (
            <button
              className="flex items-center gap-2 bg-[#00D4FF]/10 hover:bg-[#00D4FF]/20 border border-[#00D4FF]/25 hover:border-[#00D4FF]/50 px-4 py-2.5 rounded-xl text-xs font-bold text-[#00D4FF] hover:scale-[1.02] transition-all cursor-pointer shadow-[0_0_15px_rgba(0,212,255,0.1)]"
            >
              <Download className="h-4 w-4" /> Download PDF Invoice
            </button>
          );
        }}
      </PDFDownloadLink>
    </div>
  );
}
