"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useOrderStore } from "@/store/order-store";

export default function OrderConfirmationPage({ params }: { params: { id: string } }) {
  const { priceBreakdown, reset } = useOrderStore();
  const orderId = params.id;

  useEffect(() => {
    // Reset the order store after showing confirmation
    return () => { reset(); };
  }, [reset]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-dark-950 pt-24 pb-16">
        <div className="container-width section-padding">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="h-10 w-10 text-green-400" />
            </motion.div>

            <h1 className="text-3xl font-serif font-bold text-dark-50 mb-2">Order Placed!</h1>
            <p className="text-dark-400">Thank you for your order. We&apos;ll start working on your sketch soon.</p>

            <Card className="mt-8 text-left">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-dark-400">Order ID</span>
                  <span className="text-sm font-mono font-bold text-primary-400">{orderId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-dark-400">Status</span>
                  <span className="text-sm text-yellow-400 font-medium">Payment Pending Verification</span>
                </div>
                {priceBreakdown && (
                  <div className="flex justify-between items-center pt-2 border-t border-dark-800">
                    <span className="text-sm font-medium text-dark-50">Total Paid</span>
                    <span className="text-lg font-serif font-bold text-primary-400">₹{priceBreakdown.total.toLocaleString("en-IN")}</span>
                  </div>
                )}
              </div>
            </Card>

            <div className="mt-8 space-y-3">
              <div className="flex items-start gap-3 text-left bg-dark-900/50 rounded-lg p-4 border border-dark-700/50">
                <Package className="h-5 w-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-dark-50">What happens next?</p>
                  <p className="text-xs text-dark-400 mt-1">We&apos;ll verify your payment and start working on your pencil sketch. You&apos;ll receive email updates on your order progress.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/gallery">
                <Button variant="outline">View Gallery</Button>
              </Link>
              <Link href="/">
                <Button>
                  Back to Home <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
