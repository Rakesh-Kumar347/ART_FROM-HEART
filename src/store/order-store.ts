"use client";

import { create } from "zustand";
import { ArtSize, FrameOption, Urgency, PriceBreakdown } from "@/types/order";
import { ComplexityResult } from "@/types/pricing";

interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface OrderStore {
  // Step tracking
  step: number;

  // Step 1: Image
  imageFile: File | null;
  imagePreview: string | null;

  // Step 2: AI Analysis
  complexityResult: ComplexityResult | null;
  isAnalyzing: boolean;
  analysisProgress: { step: string; percent: number };

  // Step 3: Customization
  selectedSize: ArtSize;
  selectedFraming: FrameOption;
  selectedUrgency: Urgency;
  specialInstructions: string;

  // Step 4: Price
  priceBreakdown: PriceBreakdown | null;

  // Step 5: Payment & Contact
  customerDetails: CustomerDetails;
  paymentMarked: boolean;

  // Step 6: Confirmation
  orderId: string | null;

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setImageFile: (file: File | null) => void;
  setImagePreview: (preview: string | null) => void;
  setComplexityResult: (result: ComplexityResult | null) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
  setAnalysisProgress: (progress: { step: string; percent: number }) => void;
  setSelectedSize: (size: ArtSize) => void;
  setSelectedFraming: (framing: FrameOption) => void;
  setSelectedUrgency: (urgency: Urgency) => void;
  setSpecialInstructions: (instructions: string) => void;
  setPriceBreakdown: (breakdown: PriceBreakdown | null) => void;
  setCustomerDetails: (details: Partial<CustomerDetails>) => void;
  setPaymentMarked: (marked: boolean) => void;
  setOrderId: (id: string) => void;
  reset: () => void;
}

const initialState = {
  step: 1,
  imageFile: null,
  imagePreview: null,
  complexityResult: null,
  isAnalyzing: false,
  analysisProgress: { step: "", percent: 0 },
  selectedSize: "A4" as ArtSize,
  selectedFraming: "none" as FrameOption,
  selectedUrgency: "standard" as Urgency,
  specialInstructions: "",
  priceBreakdown: null,
  customerDetails: { name: "", email: "", phone: "", address: "" },
  paymentMarked: false,
  orderId: null,
};

export const useOrderStore = create<OrderStore>((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),
  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 6) })),
  prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),

  setImageFile: (imageFile) => set({ imageFile }),
  setImagePreview: (imagePreview) => set({ imagePreview }),

  setComplexityResult: (complexityResult) => set({ complexityResult }),
  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setAnalysisProgress: (analysisProgress) => set({ analysisProgress }),

  setSelectedSize: (selectedSize) => set({ selectedSize }),
  setSelectedFraming: (selectedFraming) => set({ selectedFraming }),
  setSelectedUrgency: (selectedUrgency) => set({ selectedUrgency }),
  setSpecialInstructions: (specialInstructions) => set({ specialInstructions }),

  setPriceBreakdown: (priceBreakdown) => set({ priceBreakdown }),

  setCustomerDetails: (details) =>
    set((state) => ({
      customerDetails: { ...state.customerDetails, ...details },
    })),

  setPaymentMarked: (paymentMarked) => set({ paymentMarked }),
  setOrderId: (orderId) => set({ orderId }),

  reset: () => set(initialState),
}));
