"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-6">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-dark-50 mb-3">
          Something went wrong
        </h1>
        <p className="text-dark-400 mb-8">
          An unexpected error occurred. Please try again or return to the home
          page.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button variant="primary" onClick={reset}>
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
          <Link href="/">
            <Button variant="outline">
              <Home className="w-4 h-4" />
              Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
