export type OrderStatus =
  | "new"
  | "payment_pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "delivered";

export type ArtSize = "A5" | "A4" | "A3" | "A2" | "custom";

export type FrameOption = "none" | "basic" | "premium";

export type Urgency = "standard" | "express" | "rush";

export interface PriceBreakdown {
  basePrice: number;
  complexityCharge: number;
  personCharge: number;
  sizeCharge: number;
  framingCharge: number;
  urgencyCharge: number;
  total: number;
}

export interface Order {
  _id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress?: string;
  referenceImageUrl: string;
  completedSketchUrl?: string;
  size: ArtSize;
  framing: FrameOption;
  urgency: Urgency;
  specialInstructions?: string;
  complexityScore: number;
  personCount: number;
  faceDetailScore: number;
  clothingScore: number;
  accessoryScore: number;
  basePrice: number;
  complexityPrice: number;
  personPrice: number;
  sizePrice: number;
  framingPrice: number;
  urgencyPrice: number;
  totalPrice: number;
  status: OrderStatus;
  paymentMarked: boolean;
  paymentVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderInput {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress?: string;
  referenceImageUrl: string;
  size: ArtSize;
  framing: FrameOption;
  urgency: Urgency;
  specialInstructions?: string;
  complexityScore: number;
  personCount: number;
  faceDetailScore: number;
  clothingScore: number;
  accessoryScore: number;
  basePrice: number;
  complexityPrice: number;
  personPrice: number;
  sizePrice: number;
  framingPrice: number;
  urgencyPrice: number;
  totalPrice: number;
}
