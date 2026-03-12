"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-8 w-8 text-red-400" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-dark-50 mb-2">Something went wrong</h2>
        <p className="text-dark-400 mb-6">An unexpected error occurred. Please try again.</p>
        <Button onClick={reset}>Try Again</Button>
      </div>
    </div>
  );
}
