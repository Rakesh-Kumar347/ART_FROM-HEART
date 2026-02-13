export interface DashboardStats {
  totalOrders: number;
  ordersThisMonth: number;
  revenueThisMonth: number;
  pendingOrders: number;
  completedOrders: number;
  ordersByCategory: Record<string, number>;
}

export interface AdminSession {
  authenticated: boolean;
  expiresAt?: string;
}
