"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
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

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const url = statusFilter !== "all" ? `/api/orders?status=${statusFilter}` : "/api/orders";
        const res = await fetch(url);
        if (res.ok) { const data = await res.json(); setOrders(data.orders || data || []); }
      } catch {} finally { setLoading(false); }
    }
    setLoading(true);
    fetchOrders();
  }, [statusFilter]);

  const filteredOrders = orders.filter((order) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return order.orderId.toLowerCase().includes(q) || order.customerName.toLowerCase().includes(q) || order.customerEmail.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-dark-50">Orders</h1>
        <p className="text-dark-400 text-sm mt-1">Manage and track all customer orders</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-500" />
          <input type="text" placeholder="Search by order ID, name, or email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-dark-900 border border-dark-700 rounded-lg text-dark-50 placeholder:text-dark-500 transition-colors focus:outline-none focus:border-primary-400/50 focus:ring-1 focus:ring-primary-400/30 text-sm" />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-500" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2.5 bg-dark-900 border border-dark-700 rounded-lg text-dark-50 transition-colors focus:outline-none focus:border-primary-400/50 focus:ring-1 focus:ring-primary-400/30 appearance-none text-sm">
            <option value="all">All Statuses</option>
            {ORDER_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16">
          <div className="h-16 w-16 rounded-full bg-dark-800/50 flex items-center justify-center mx-auto mb-4"><Filter className="h-8 w-8 text-dark-500" /></div>
          <p className="text-dark-400 text-lg font-medium">No orders found</p>
          <p className="text-dark-500 text-sm mt-1">{searchQuery ? "Try adjusting your search query" : "Orders will appear here once customers place them"}</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-700">
                  {["Order ID", "Customer", "Persons", "Size", "Frame", "Status", "Total", "Date"].map((h, i) => (
                    <th key={h} className={`${i >= 6 ? "text-right" : "text-left"} py-3 px-4 text-xs font-medium text-dark-400 uppercase tracking-wider`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800/50">
                {filteredOrders.map((order, index) => (
                  <motion.tr key={order._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.03 }}
                    onClick={() => router.push(`/admin/orders/${order._id}`)} className="hover:bg-dark-800/30 cursor-pointer transition-colors">
                    <td className="py-3 px-4 text-sm font-medium text-primary-400">{order.orderId}</td>
                    <td className="py-3 px-4 text-sm text-dark-50">{order.customerName}</td>
                    <td className="py-3 px-4 text-sm text-dark-300">{order.personCount}</td>
                    <td className="py-3 px-4 text-sm text-dark-300">{order.size}</td>
                    <td className="py-3 px-4 text-sm text-dark-300 capitalize">{order.framing}</td>
                    <td className="py-3 px-4">
                      <Badge variant={STATUS_BADGE_MAP[order.status] || "gold"}>{ORDER_STATUSES.find((s) => s.value === order.status)?.label || order.status}</Badge>
                    </td>
                    <td className="py-3 px-4 text-right text-sm font-medium text-dark-50">{formatCurrency(order.totalPrice)}</td>
                    <td className="py-3 px-4 text-right text-sm text-dark-400">{formatDate(order.createdAt)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            {filteredOrders.map((order, index) => (
              <motion.div key={order._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                onClick={() => router.push(`/admin/orders/${order._id}`)}
                className="bg-dark-900/50 border border-dark-700/50 rounded-xl p-4 cursor-pointer hover:bg-dark-800/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-primary-400">{order.orderId}</span>
                  <Badge variant={STATUS_BADGE_MAP[order.status] || "gold"}>{ORDER_STATUSES.find((s) => s.value === order.status)?.label || order.status}</Badge>
                </div>
                <p className="text-sm text-dark-50">{order.customerName}</p>
                <div className="flex items-center justify-between mt-2 text-xs text-dark-400">
                  <span>{order.personCount} person{order.personCount !== 1 ? "s" : ""} / {order.size} / {order.framing}</span>
                  <span className="font-medium text-dark-50">{formatCurrency(order.totalPrice)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
