import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPortfolioItem extends Document {
  title: string;
  description?: string;
  category: string;
  imageUrl: string;
  thumbnailUrl?: string;
  size?: string;
  timeTaken?: string;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioItemSchema = new Schema<IPortfolioItem>(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: {
      type: String,
      required: true,
      enum: ["portraits", "couple", "family", "pet_sketches", "celebrity", "custom"],
    },
    imageUrl: { type: String, required: true },
    thumbnailUrl: { type: String },
    size: { type: String },
    timeTaken: { type: String },
    isFeatured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

PortfolioItemSchema.index({ category: 1, displayOrder: 1 });
PortfolioItemSchema.index({ isFeatured: 1 });

const PortfolioItem: Model<IPortfolioItem> =
  mongoose.models.PortfolioItem ||
  mongoose.model<IPortfolioItem>("PortfolioItem", PortfolioItemSchema);

export default PortfolioItem;
