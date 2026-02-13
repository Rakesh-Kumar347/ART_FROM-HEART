"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        isScrolled
          ? "bg-dark-950/90 backdrop-blur-md border-b border-dark-800/50 py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container-width flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-serif font-bold gold-text">
            {SITE_NAME}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href.replace("/#", "/"));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors relative",
                  link.label === "Order Now"
                    ? "px-5 py-2 rounded-lg bg-gradient-to-r from-primary-400 to-primary-500 text-dark-950 hover:from-primary-300 hover:to-primary-400"
                    : isActive
                    ? "text-primary-400"
                    : "text-dark-300 hover:text-dark-50"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 text-dark-300 hover:text-dark-50"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle menu"
        >
          {isMobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-72 bg-dark-950/95 backdrop-blur-lg border-l border-dark-800 md:hidden z-50"
          >
            <div className="flex flex-col pt-20 px-6 gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-lg text-base font-medium transition-colors",
                    link.label === "Order Now"
                      ? "bg-gradient-to-r from-primary-400 to-primary-500 text-dark-950 text-center mt-4"
                      : pathname === link.href
                      ? "text-primary-400 bg-primary-400/10"
                      : "text-dark-300 hover:text-dark-50 hover:bg-dark-800/50"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
