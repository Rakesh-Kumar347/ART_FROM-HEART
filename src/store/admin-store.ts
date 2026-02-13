"use client";

import { create } from "zustand";
import { OrderStatus } from "@/types/order";

interface AdminStore {
  // Order filters
  statusFilter: OrderStatus | "all";
  searchQuery: string;
  selectedOrderId: string | null;

  // Actions
  setStatusFilter: (status: OrderStatus | "all") => void;
  setSearchQuery: (query: string) => void;
  setSelectedOrderId: (id: string | null) => void;
  reset: () => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  statusFilter: "all",
  searchQuery: "",
  selectedOrderId: null,

  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedOrderId: (selectedOrderId) => set({ selectedOrderId }),
  reset: () =>
    set({
      statusFilter: "all",
      searchQuery: "",
      selectedOrderId: null,
    }),
}));
