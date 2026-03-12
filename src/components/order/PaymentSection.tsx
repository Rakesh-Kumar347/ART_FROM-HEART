"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Smartphone, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import PriceBreakdown from "./PriceBreakdown";
import { useOrderStore } from "@/store/order-store";
import { formatCurrency } from "@/lib/utils";

export default function PaymentSection() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const {
    imageFile, complexityResult, selectedSize, selectedFraming, selectedUrgency,
    specialInstructions, priceBreakdown, customerDetails, paymentMarked,
    setCustomerDetails, setPaymentMarked, setOrderId, prevStep,
  } = useOrderStore();

  const isFormValid = customerDetails.name.trim() && customerDetails.email.trim() && customerDetails.phone.trim() && paymentMarked;

  async function handleSubmit() {
    if (!isFormValid || !priceBreakdown || !complexityResult) return;
    setSubmitting(true);

    try {
      // Upload reference image
      const formData = new FormData();
      if (imageFile) {
        formData.append("file", imageFile);
        formData.append("folder", "art-from-heart/orders");
      }
      let referenceImageUrl = "";
      if (imageFile) {
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        if (!uploadRes.ok) { toast.error("Failed to upload image"); setSubmitting(false); return; }
        const uploadData = await uploadRes.json();
        referenceImageUrl = uploadData.url || uploadData.secure_url;
      }

      // Create order
      const orderPayload = {
        customerName: customerDetails.name,
        customerEmail: customerDetails.email,
        customerPhone: customerDetails.phone,
        customerAddress: customerDetails.address || undefined,
        referenceImageUrl,
        size: selectedSize,
        framing: selectedFraming,
        urgency: selectedUrgency,
        specialInstructions: specialInstructions || undefined,
        complexityScore: complexityResult.overallScore,
        personCount: complexityResult.personCount,
        faceDetailScore: complexityResult.faceDetailScore,
        clothingScore: complexityResult.clothingScore,
        accessoryScore: complexityResult.accessoryScore,
        basePrice: priceBreakdown.basePrice,
        complexityPrice: priceBreakdown.complexityCharge,
        personPrice: priceBreakdown.personCharge,
        sizePrice: priceBreakdown.sizeCharge,
        framingPrice: priceBreakdown.framingCharge,
        urgencyPrice: priceBreakdown.urgencyCharge,
        totalPrice: priceBreakdown.total,
        paymentMarked: true,
      };

      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!orderRes.ok) { toast.error("Failed to place order"); setSubmitting(false); return; }

      const orderData = await orderRes.json();
      const newOrderId = orderData.orderId || orderData.order?.orderId;
      setOrderId(newOrderId);
      toast.success("Order placed successfully!");
      router.push(`/order/confirmation/${newOrderId}`);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold text-dark-50">Payment & Details</h2>
        <p className="text-dark-400 mt-2">Complete your details and make payment via PhonePe</p>
      </div>

      <div className="max-w-3xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Customer Details */}
          <Card>
            <h3 className="text-sm font-medium text-dark-400 uppercase tracking-wider mb-4">Your Details</h3>
            <div className="space-y-4">
              <Input label="Full Name *" placeholder="Your name" value={customerDetails.name} onChange={(e) => setCustomerDetails({ name: e.target.value })} />
              <Input label="Email *" type="email" placeholder="your@email.com" value={customerDetails.email} onChange={(e) => setCustomerDetails({ email: e.target.value })} />
              <Input label="Phone *" type="tel" placeholder="+91 XXXXX XXXXX" value={customerDetails.phone} onChange={(e) => setCustomerDetails({ phone: e.target.value })} />
              <Input label="Delivery Address" placeholder="Full delivery address (optional)" value={customerDetails.address} onChange={(e) => setCustomerDetails({ address: e.target.value })} />
            </div>
          </Card>

          {/* PhonePe Payment */}
          <Card>
            <h3 className="text-sm font-medium text-dark-400 uppercase tracking-wider mb-4">Payment via PhonePe</h3>
            <div className="text-center space-y-4">
              <div className="w-48 h-48 mx-auto rounded-xl bg-white p-3 flex items-center justify-center">
                <div className="text-center">
                  <Smartphone className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                  <p className="text-dark-900 text-xs font-medium">Scan QR Code</p>
                  <p className="text-dark-500 text-xs">via PhonePe App</p>
                </div>
              </div>

              {priceBreakdown && (
                <div className="bg-dark-800/50 rounded-lg p-3">
                  <p className="text-dark-400 text-sm">Amount to Pay</p>
                  <p className="text-2xl font-serif font-bold text-primary-400">{formatCurrency(priceBreakdown.total)}</p>
                </div>
              )}

              <label className="flex items-center gap-3 justify-center cursor-pointer">
                <input type="checkbox" checked={paymentMarked} onChange={(e) => setPaymentMarked(e.target.checked)}
                  className="h-5 w-5 rounded border-dark-700 bg-dark-900 text-primary-400 focus:ring-primary-400/30" />
                <span className="text-sm text-dark-300">I have completed the payment</span>
              </label>
            </div>
          </Card>
        </div>

        <div>
          <PriceBreakdown />
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        <Button variant="outline" onClick={prevStep}>Go Back</Button>
        <Button onClick={handleSubmit} loading={submitting} disabled={!isFormValid} size="lg">
          <CheckCircle className="h-5 w-5" />
          Place Order
        </Button>
      </div>
    </div>
  );
}
