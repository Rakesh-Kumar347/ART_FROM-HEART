"use client";

import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import PriceBreakdown from "./PriceBreakdown";
import { useOrderStore } from "@/store/order-store";
import { SIZES, FRAMING_OPTIONS, URGENCY_OPTIONS } from "@/lib/constants";

export default function OrderSummary() {
  const { imagePreview, complexityResult, selectedSize, selectedFraming, selectedUrgency, specialInstructions, nextStep, prevStep } = useOrderStore();

  const sizeLabel = SIZES.find((s) => s.value === selectedSize)?.label || selectedSize;
  const framingLabel = FRAMING_OPTIONS.find((f) => f.value === selectedFraming)?.label || selectedFraming;
  const urgencyLabel = URGENCY_OPTIONS.find((u) => u.value === selectedUrgency)?.label || selectedUrgency;
  const urgencyDays = URGENCY_OPTIONS.find((u) => u.value === selectedUrgency)?.days || "";

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold text-dark-50">Review Your Order</h2>
        <p className="text-dark-400 mt-2">Please review the details before proceeding to payment</p>
      </div>

      <div className="max-w-2xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {imagePreview && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card>
                <h3 className="text-sm font-medium text-dark-400 uppercase tracking-wider mb-3">Reference Image</h3>
                <div className="rounded-lg overflow-hidden bg-dark-800">
                  <img src={imagePreview} alt="Reference" className="w-full h-auto max-h-[250px] object-contain" />
                </div>
              </Card>
            </motion.div>
          )}

          <Card>
            <h3 className="text-sm font-medium text-dark-400 uppercase tracking-wider mb-3">Order Details</h3>
            <dl className="space-y-2.5">
              <div className="flex justify-between"><dt className="text-sm text-dark-400">Complexity</dt><dd className="text-sm text-dark-50 font-medium">{complexityResult?.overallScore.toFixed(1)}/10</dd></div>
              <div className="flex justify-between"><dt className="text-sm text-dark-400">Persons Detected</dt><dd className="text-sm text-dark-50">{complexityResult?.personCount}</dd></div>
              <div className="flex justify-between"><dt className="text-sm text-dark-400">Paper Size</dt><dd className="text-sm text-dark-50">{sizeLabel}</dd></div>
              <div className="flex justify-between"><dt className="text-sm text-dark-400">Framing</dt><dd className="text-sm text-dark-50">{framingLabel}</dd></div>
              <div className="flex justify-between"><dt className="text-sm text-dark-400">Delivery</dt><dd className="text-sm text-dark-50">{urgencyLabel} ({urgencyDays})</dd></div>
              {specialInstructions && (
                <div className="pt-2 border-t border-dark-800">
                  <dt className="text-sm text-dark-400 mb-1">Special Instructions</dt>
                  <dd className="text-sm text-dark-200 bg-dark-800/50 rounded-lg p-3">{specialInstructions}</dd>
                </div>
              )}
            </dl>
          </Card>
        </div>

        <div>
          <PriceBreakdown />
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        <Button variant="outline" onClick={prevStep}>Go Back</Button>
        <Button onClick={nextStep} size="lg">Proceed to Payment</Button>
      </div>
    </div>
  );
}
