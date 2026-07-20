export interface DashboardSummary {
  totalSales: number;
  todaySales: number;
  weeklySales: number;
  monthlySales: number;
  totalProducts: number;
  lowStockCount: number;
  deadStockCount: number;
  totalCustomers: number;
  totalStaff: number;
}

export interface ActivityLog {
  _id: string;
  storeId?: string;
  userId: string;
  action: string;
  module: string;
  description: string;
  ip?: string;
  device?: string;
  createdAt: string;
}
