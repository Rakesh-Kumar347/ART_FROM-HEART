"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Package, Calendar, IndianRupee, Clock } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import { Order } from "@/types/order";
import { ORDER_STATUSES } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";

type BadgeVariant = "blue" | "yellow" | "green" | "purple" | "emerald" | "gold" | "red";
const STATUS_BADGE_MAP: Record<string, BadgeVariant> = {
  new: "blue", payment_pending: "yellow", confirmed: "green",
  in_progress: "purple", completed: "emerald", delivered: "gold",
};

function StatCard({ title, value, icon, description }: { title: string; value: string | number; icon: React.ReactNode; description: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-lg bg-primary-400/10 flex items-center justify-center flex-shrink-0">{icon}</div>
        <div className="min-w-0">
          <p className="text-sm text-dark-400">{title}</p>
          <p className="text-2xl font-serif font-bold text-dark-50 mt-1">{value}</p>
          <p className="text-xs text-dark-500 mt-1">{description}</p>
        </div>
      </Card>
    </motion.div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders");
        if (res.ok) { const data = await res.json(); setOrders(data.orders || data || []); }
      } catch {} finally { setLoading(false); }
    }
    fetchOrders();
  }, []);

  const now = new Date();
  const monthOrders = orders.filter((o) => { const d = new Date(o.createdAt); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); });
  const monthRevenue = monthOrders.reduce((sum, o) => sum + o.totalPrice, 0);
  const pendingOrders = orders.filter((o) => o.status === "new" || o.status === "payment_pending").length;
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  const statusCounts = ORDER_STATUSES.map((s) => ({ ...s, count: orders.filter((o) => o.status === s.value).length }));
  const maxCount = Math.max(...statusCounts.map((s) => s.count), 1);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 mb-2" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-dark-50">Dashboard</h1>
        <p className="text-dark-400 text-sm mt-1">Overview of your art business</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Orders" value={orders.length} icon={<Package className="h-6 w-6 text-primary-400" />} description="All time orders" />
        <StatCard title="This Month" value={monthOrders.length} icon={<Calendar className="h-6 w-6 text-primary-400" />} description={`Orders in ${now.toLocaleString("default", { month: "long" })}`} />
        <StatCard title="Revenue" value={formatCurrency(monthRevenue)} icon={<IndianRupee className="h-6 w-6 text-primary-400" />} description="This month's revenue" />
        <StatCard title="Pending" value={pendingOrders} icon={<Clock className="h-6 w-6 text-primary-400" />} description="Awaiting action" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-serif font-semibold text-dark-50 mb-4">Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <p className="text-dark-500 text-sm py-8 text-center">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order._id} onClick={() => router.push(`/admin/orders/${order._id}`)} role="button" tabIndex={0}
                  className="flex items-center justify-between p-3 rounded-lg bg-dark-800/30 hover:bg-dark-800/60 transition-colors cursor-pointer">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-dark-50 truncate">{order.orderId}</span>
                      <Badge variant={STATUS_BADGE_MAP[order.status] || "gold"}>
                        {ORDER_STATUSES.find((s) => s.value === order.status)?.label || order.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-dark-400 mt-1 truncate">{order.customerName}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="text-sm font-medium text-primary-400">{formatCurrency(order.totalPrice)}</p>
                    <p className="text-xs text-dark-500">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-lg font-serif font-semibold text-dark-50 mb-4">Orders by Status</h2>
          <div className="space-y-3">
            {statusCounts.map((item) => (
              <div key={item.value} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-dark-300">{item.label}</span>
                  <span className="text-dark-50 font-medium">{item.count}</span>
                </div>
                <div className="h-2 w-full bg-dark-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                    style={{ width: `${(item.count / maxCount) * 100}%`, minWidth: item.count > 0 ? "8px" : "0px" }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
