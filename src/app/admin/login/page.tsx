"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { SITE_NAME } from "@/lib/constants";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.authenticated) {
        router.push("/admin");
      } else {
        setError(data.error || "Invalid password");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold gold-text mb-2">{SITE_NAME}</h1>
          <p className="text-dark-400 text-sm">Admin Panel</p>
        </div>
        <div className="bg-dark-900/50 backdrop-blur-sm border border-dark-700/50 rounded-xl p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="h-12 w-12 rounded-full bg-primary-400/10 flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary-400" />
            </div>
          </div>
          <h2 className="text-xl font-serif font-semibold text-dark-50 text-center mb-6">Admin Login</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                label="Password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={error}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[34px] text-dark-400 hover:text-dark-200 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Button type="submit" loading={loading} className="w-full" size="lg">Sign In</Button>
          </form>
        </div>
        <p className="text-center text-dark-600 text-xs mt-6">Protected area. Authorized access only.</p>
      </motion.div>
    </div>
  );
}
