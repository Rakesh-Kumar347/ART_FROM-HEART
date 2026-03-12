"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import { useOrderStore } from "@/store/order-store";
import { SIZES, FRAMING_OPTIONS, URGENCY_OPTIONS, DEFAULT_PRICING } from "@/lib/constants";
import { calculatePrice } from "@/lib/ai/pricing-calculator";

export default function OrderCustomizer() {
  const {
    selectedSize, selectedFraming, selectedUrgency, specialInstructions, complexityResult,
    setSelectedSize, setSelectedFraming, setSelectedUrgency, setSpecialInstructions, setPriceBreakdown,
    nextStep, prevStep,
  } = useOrderStore();

  useEffect(() => {
    if (complexityResult) {
      const breakdown = calculatePrice(complexityResult, selectedSize, selectedFraming, selectedUrgency, DEFAULT_PRICING);
      setPriceBreakdown(breakdown);
    }
  }, [complexityResult, selectedSize, selectedFraming, selectedUrgency, setPriceBreakdown]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold text-dark-50">Customize Your Order</h2>
        <p className="text-dark-400 mt-2">Choose your preferred size, framing, and delivery options</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-8">
        {/* Size Selection */}
        <div>
          <h3 className="text-sm font-medium text-dark-300 uppercase tracking-wider mb-3">Paper Size</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {SIZES.map((size) => (
              <motion.button key={size.value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setSelectedSize(size.value)}
                className={cn("p-4 rounded-xl border-2 text-center transition-colors", selectedSize === size.value ? "border-primary-400 bg-primary-400/10" : "border-dark-700 bg-dark-900/50 hover:border-dark-500")}>
                <p className={cn("text-lg font-bold", selectedSize === size.value ? "text-primary-400" : "text-dark-50")}>{size.label}</p>
                <p className="text-xs text-dark-400 mt-1">{size.dimensions}</p>
                {DEFAULT_PRICING.sizeFactors[size.value] > 0 && <p className="text-xs text-primary-400 mt-1">+₹{DEFAULT_PRICING.sizeFactors[size.value]}</p>}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Framing Selection */}
        <div>
          <h3 className="text-sm font-medium text-dark-300 uppercase tracking-wider mb-3">Framing Option</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {FRAMING_OPTIONS.map((option) => (
              <motion.button key={option.value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setSelectedFraming(option.value)}
                className={cn("p-4 rounded-xl border-2 text-left transition-colors", selectedFraming === option.value ? "border-primary-400 bg-primary-400/10" : "border-dark-700 bg-dark-900/50 hover:border-dark-500")}>
                <p className={cn("font-medium", selectedFraming === option.value ? "text-primary-400" : "text-dark-50")}>{option.label}</p>
                <p className="text-xs text-dark-400 mt-1">{option.description}</p>
                {DEFAULT_PRICING.framingFactors[option.value] > 0 && <p className="text-xs text-primary-400 mt-2">+₹{DEFAULT_PRICING.framingFactors[option.value]}</p>}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Urgency Selection */}
        <div>
          <h3 className="text-sm font-medium text-dark-300 uppercase tracking-wider mb-3">Delivery Speed</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {URGENCY_OPTIONS.map((option) => (
              <motion.button key={option.value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setSelectedUrgency(option.value)}
                className={cn("p-4 rounded-xl border-2 text-left transition-colors", selectedUrgency === option.value ? "border-primary-400 bg-primary-400/10" : "border-dark-700 bg-dark-900/50 hover:border-dark-500")}>
                <p className={cn("font-medium", selectedUrgency === option.value ? "text-primary-400" : "text-dark-50")}>{option.label}</p>
                <p className="text-xs text-dark-400 mt-0.5">{option.days}</p>
                <p className="text-xs text-dark-500 mt-1">{option.description}</p>
                {DEFAULT_PRICING.urgencyFactors[option.value] > 0 && <p className="text-xs text-primary-400 mt-2">+₹{DEFAULT_PRICING.urgencyFactors[option.value]}</p>}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Special Instructions */}
        <div>
          <Textarea label="Special Instructions (optional)" placeholder="Any specific requirements for your sketch..." value={specialInstructions} onChange={(e) => setSpecialInstructions(e.target.value)} />
        </div>

        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={prevStep}>Go Back</Button>
          <Button onClick={nextStep}>Review Order</Button>
        </div>
      </div>
    </div>
  );
}
