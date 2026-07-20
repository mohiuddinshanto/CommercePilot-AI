export interface SaleItem {
  productId?: string;
  bundleId?: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Sale {
  _id: string;
  storeId: string;
  invoiceNumber: string;
  customerId: string | null;
  customerName: string;
  customerPhone: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  notes: string;
  isDeleted: boolean;
  deletedAt: string | null;
  deletedBy: string | null;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSaleInput {
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  items: {
    productId?: string;
    bundleId?: string;
    name: string;
    sku: string;
    quantity: number;
    unitPrice: number;
  }[];
  discount?: number;
  tax?: number;
  shipping?: number;
  paidAmount: number;
  paymentMethod: string;
  notes?: string;
}

export interface UpdateSaleInput {
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  paidAmount?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  status?: string;
  notes?: string;
}

export interface SaleQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface SalesSummary {
  totalSales: number;
  totalRevenue: number;
  totalPaid: number;
  totalDue: number;
  avgSaleValue: number;
}
