import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITestimonial extends Document {
  customerName: string;
  customerAvatar?: string;
  rating: number;
  text: string;
  orderId?: mongoose.Types.ObjectId;
  isVisible: boolean;
  createdAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    customerName: { type: String, required: true },
    customerAvatar: { type: String },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    text: { type: String, required: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    isVisible: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial ||
  mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);

export default Testimonial;
