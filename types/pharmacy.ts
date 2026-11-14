export type Role = 'OWNER' | 'PHARMACIST' | 'ASSISTANT';

export type StorageCategory = 'REFRIGERATED' | 'ROOM_TEMP' | 'CONTROLLED';

export interface UserProfile {
  id: string;
  email: string;
  role: Role;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface Medicine {
  id: string;
  name: string;
  genericName?: string | null;
  batchNumber?: string | null;
  supplierName?: string | null;
  manufacturerName?: string | null;
  invoiceNumber?: string | null;
  manufacturingDate?: string | Date | null;
  expiryDate?: string | Date | null;
  purchaseDate?: string | Date | null;
  purchasePrice?: number | null;
  mrp?: number | null;
  sellingPrice?: number | null;
  gstPercentage?: number | null;
  gstAmount?: number | null;
  finalPrice?: number | null;
  quantityAvailable?: number | null;
  minimumThreshold?: number | null;
  storageCategory?: StorageCategory | null;
  purchaseStackId?: string | null;
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
}

export interface PurchaseStack {
  id: string;
  supplierName: string;
  invoiceNumber: string;
  purchaseDate: string | Date;
  medicines?: Medicine[];
  totalAmount: number;
  totalGST: number;
  createdAt?: string | Date;
}

export interface SaleItem {
  medicineId: string;
  medicineName: string;
  batchNumber: string;
  quantitySold: number;
  sellingPrice: number;
  totalAmount: number;
  profitEarned: number;
}

export interface Sale {
  id: string;
  medicineId: string;
  medicineName: string;
  batchNumber: string;
  quantitySold: number;
  sellingPrice: number;
  totalAmount: number;
  profitEarned: number;
  soldAt?: string | Date;
  invoiceNumber: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  userId: string;
  details: Record<string, any>;
  createdAt?: string | Date;
}

export interface DashboardKPIs {
  totalInventoryValue: number;
  todayRevenue: number;
  monthlyProfit: number;
  lowStockItemsCount: number;
  expiringSoonCount: number;
  totalMedicinesInStock: number;
}
