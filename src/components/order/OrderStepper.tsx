"use client";

import { motion } from "framer-motion";
import { Upload, Brain, Sliders, IndianRupee, CreditCard, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { label: "Upload", icon: Upload },
  { label: "Analysis", icon: Brain },
  { label: "Customize", icon: Sliders },
  { label: "Review", icon: IndianRupee },
  { label: "Payment", icon: CreditCard },
  { label: "Confirm", icon: CheckCircle },
];

interface OrderStepperProps {
  currentStep: number;
}

export default function OrderStepper({ currentStep }: OrderStepperProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          const Icon = step.icon;

          return (
            <div key={step.label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center relative">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                    backgroundColor: isCompleted || isCurrent ? "rgb(212, 165, 116)" : "rgb(30, 30, 30)",
                  }}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors z-10",
                    isCompleted || isCurrent ? "border-primary-400" : "border-dark-700"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isCompleted || isCurrent ? "text-dark-950" : "text-dark-500")} />
                </motion.div>
                <span className={cn("text-xs mt-1.5 font-medium hidden sm:block", isCurrent ? "text-primary-400" : isCompleted ? "text-dark-300" : "text-dark-600")}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 rounded-full bg-dark-800 relative overflow-hidden">
                  {isCompleted && <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} className="absolute inset-y-0 left-0 bg-primary-400 rounded-full" transition={{ duration: 0.3 }} />}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
