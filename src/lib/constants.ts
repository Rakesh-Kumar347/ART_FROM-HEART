import { ArtSize, FrameOption, Urgency } from "@/types/order";
import { ArtCategory } from "@/types/portfolio";
import { PricingConfig } from "@/types/pricing";

export const SITE_NAME = "Art From Heart";
export const SITE_DESCRIPTION =
  "Custom pencil sketch portraits crafted with love. Upload your photo, get an instant AI-powered quote, and receive a hand-drawn masterpiece.";

export const CATEGORIES: { value: ArtCategory; label: string }[] = [
  { value: "portraits", label: "Portraits" },
  { value: "couple", label: "Couple Portraits" },
  { value: "family", label: "Family Portraits" },
  { value: "pet_sketches", label: "Pet Sketches" },
  { value: "celebrity", label: "Celebrity Sketches" },
  { value: "custom", label: "Custom" },
];

export const SIZES: { value: ArtSize; label: string; dimensions: string }[] = [
  { value: "A5", label: "A5", dimensions: "148 x 210 mm" },
  { value: "A4", label: "A4", dimensions: "210 x 297 mm" },
  { value: "A3", label: "A3", dimensions: "297 x 420 mm" },
  { value: "A2", label: "A2", dimensions: "420 x 594 mm" },
  { value: "custom", label: "Custom Size", dimensions: "Contact for details" },
];

export const FRAMING_OPTIONS: {
  value: FrameOption;
  label: string;
  description: string;
}[] = [
  {
    value: "none",
    label: "No Frame",
    description: "Sketch on premium paper, shipped flat",
  },
  {
    value: "basic",
    label: "Basic Frame",
    description: "Simple wooden frame with glass protection",
  },
  {
    value: "premium",
    label: "Premium Frame",
    description: "Elegant frame with mat board and UV-protective glass",
  },
];

export const URGENCY_OPTIONS: {
  value: Urgency;
  label: string;
  days: string;
  description: string;
}[] = [
  {
    value: "standard",
    label: "Standard",
    days: "7-14 days",
    description: "Regular delivery timeline",
  },
  {
    value: "express",
    label: "Express",
    days: "3-5 days",
    description: "Prioritized delivery",
  },
  {
    value: "rush",
    label: "Rush",
    days: "1-2 days",
    description: "Fastest turnaround available",
  },
];

export const DEFAULT_PRICING: PricingConfig = {
  basePrice: 500,
  complexityMultiplier: 150,
  personCharge: 300,
  sizeFactors: {
    A5: 0,
    A4: 200,
    A3: 500,
    A2: 1000,
    custom: 800,
  },
  framingFactors: {
    none: 0,
    basic: 400,
    premium: 800,
  },
  urgencyFactors: {
    standard: 0,
    express: 300,
    rush: 700,
  },
};

export const ORDER_STATUSES = [
  { value: "new", label: "New", color: "bg-blue-500" },
  { value: "payment_pending", label: "Payment Pending", color: "bg-yellow-500" },
  { value: "confirmed", label: "Confirmed", color: "bg-green-500" },
  { value: "in_progress", label: "In Progress", color: "bg-purple-500" },
  { value: "completed", label: "Completed", color: "bg-emerald-500" },
  { value: "delivered", label: "Delivered", color: "bg-primary-500" },
] as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/order", label: "Order Now" },
  { href: "/#contact", label: "Contact" },
];
