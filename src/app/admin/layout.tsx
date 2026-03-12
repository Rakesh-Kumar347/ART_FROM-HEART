"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/layout/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) { setAuthenticated(false); return; }
    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/auth");
        const data = await res.json();
        setAuthenticated(data.authenticated);
      } catch { setAuthenticated(false); }
    }
    checkAuth();
  }, [isLoginPage, pathname]);

  if (isLoginPage) {
    return <div className="min-h-screen bg-dark-950">{children}</div>;
  }

  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-dark-400 text-sm">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    if (typeof window !== "undefined") window.location.href = "/admin/login";
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <p className="text-dark-400 text-sm">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <AdminSidebar />
      <main className="lg:ml-64 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-6">{children}</div>
      </main>
    </div>
  );
}
