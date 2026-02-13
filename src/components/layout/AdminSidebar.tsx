"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Image,
  Settings,
  ArrowLeft,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { SITE_NAME } from "@/lib/constants";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/portfolio", label: "Portfolio", icon: Image },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-dark-900 border border-dark-700 rounded-lg"
        onClick={() => setCollapsed(!collapsed)}
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5 text-dark-300" />
      </button>

      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-dark-950 border-r border-dark-800 transition-all duration-300 z-40",
          collapsed ? "-translate-x-full lg:translate-x-0" : "translate-x-0",
          "w-64"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-6 py-6 border-b border-dark-800">
            <h2 className="text-lg font-serif font-bold gold-text">
              {SITE_NAME}
            </h2>
            <p className="text-xs text-dark-500 mt-1">Admin Panel</p>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {adminLinks.map((link) => {
              const isActive =
                link.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(link.href);
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setCollapsed(true)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary-400/10 text-primary-400"
                      : "text-dark-400 hover:text-dark-50 hover:bg-dark-800/50"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Back to Site */}
          <div className="px-3 py-4 border-t border-dark-800">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-dark-400 hover:text-dark-50 hover:bg-dark-800/50 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Site
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
