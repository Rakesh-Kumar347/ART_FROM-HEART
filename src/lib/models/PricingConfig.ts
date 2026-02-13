import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPricingConfig extends Document {
  key: string;
  value: mongoose.Schema.Types.Mixed;
  description?: string;
  updatedAt: Date;
}

const PricingConfigSchema = new Schema<IPricingConfig>(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

const PricingConfig: Model<IPricingConfig> =
  mongoose.models.PricingConfig ||
  mongoose.model<IPricingConfig>("PricingConfig", PricingConfigSchema);

export default PricingConfig;
