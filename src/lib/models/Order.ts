import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrder extends Document {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress?: string;
  referenceImageUrl: string;
  completedSketchUrl?: string;
  size: string;
  framing: string;
  urgency: string;
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
  status: string;
  paymentMarked: boolean;
  paymentVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerAddress: { type: String },
    referenceImageUrl: { type: String, required: true },
    completedSketchUrl: { type: String },
    size: {
      type: String,
      required: true,
      enum: ["A5", "A4", "A3", "A2", "custom"],
    },
    framing: {
      type: String,
      required: true,
      enum: ["none", "basic", "premium"],
    },
    urgency: {
      type: String,
      required: true,
      enum: ["standard", "express", "rush"],
    },
    specialInstructions: { type: String },
    complexityScore: { type: Number, required: true },
    personCount: { type: Number, required: true },
    faceDetailScore: { type: Number, required: true },
    clothingScore: { type: Number, required: true },
    accessoryScore: { type: Number, required: true },
    basePrice: { type: Number, required: true },
    complexityPrice: { type: Number, required: true },
    personPrice: { type: Number, required: true },
    sizePrice: { type: Number, required: true },
    framingPrice: { type: Number, required: true },
    urgencyPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      default: "new",
      enum: [
        "new",
        "payment_pending",
        "confirmed",
        "in_progress",
        "completed",
        "delivered",
      ],
    },
    paymentMarked: { type: Boolean, default: false },
    paymentVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ orderId: 1 });

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
