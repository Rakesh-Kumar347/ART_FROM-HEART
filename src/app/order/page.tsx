"use client";

import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import OrderStepper from "@/components/order/OrderStepper";
import ImageUploader from "@/components/order/ImageUploader";
import ComplexityAnalyzer from "@/components/order/ComplexityAnalyzer";
import OrderCustomizer from "@/components/order/OrderCustomizer";
import OrderSummary from "@/components/order/OrderSummary";
import PaymentSection from "@/components/order/PaymentSection";
import { useOrderStore } from "@/store/order-store";

const stepComponents: Record<number, React.ComponentType> = {
  1: ImageUploader,
  2: ComplexityAnalyzer,
  3: OrderCustomizer,
  4: OrderSummary,
  5: PaymentSection,
};

export default function OrderPage() {
  const { step } = useOrderStore();

  const StepComponent = stepComponents[step];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-dark-950 pt-24 pb-16">
        <div className="container-width section-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <OrderStepper currentStep={step} />
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {StepComponent && <StepComponent />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  );
}
