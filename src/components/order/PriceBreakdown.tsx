"use client";

import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import { useOrderStore } from "@/store/order-store";
import { formatCurrency } from "@/lib/utils";

export default function PriceBreakdown() {
  const { priceBreakdown, complexityResult, selectedSize, selectedFraming, selectedUrgency } = useOrderStore();

  if (!priceBreakdown) return null;

  const items = [
    { label: "Base Price", value: priceBreakdown.basePrice },
    { label: `Complexity (${complexityResult?.overallScore.toFixed(1) || 0}/10)`, value: priceBreakdown.complexityCharge },
    { label: `Persons (${complexityResult?.personCount || 0})`, value: priceBreakdown.personCharge },
    { label: `Size (${selectedSize})`, value: priceBreakdown.sizeCharge },
    { label: `Framing (${selectedFraming})`, value: priceBreakdown.framingCharge },
    { label: `Urgency (${selectedUrgency})`, value: priceBreakdown.urgencyCharge },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <h3 className="text-sm font-medium text-dark-400 uppercase tracking-wider mb-4">Price Breakdown</h3>
        <dl className="space-y-2.5">
          {items.map((item) => (
            <div key={item.label} className="flex justify-between">
              <dt className="text-sm text-dark-400">{item.label}</dt>
              <dd className="text-sm text-dark-50">{formatCurrency(item.value)}</dd>
            </div>
          ))}
          <div className="flex justify-between pt-3 border-t border-dark-700">
            <dt className="text-sm font-semibold text-dark-50">Total</dt>
            <dd className="text-xl font-serif font-bold text-primary-400">{formatCurrency(priceBreakdown.total)}</dd>
          </div>
        </dl>
      </Card>
    </motion.div>
  );
}
