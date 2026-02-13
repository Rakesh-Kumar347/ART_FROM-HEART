import { ArtSize, FrameOption, Urgency, PriceBreakdown } from "@/types/order";
import { PricingConfig, ComplexityResult } from "@/types/pricing";
import { DEFAULT_PRICING } from "@/lib/constants";

export function calculatePrice(
  complexityResult: ComplexityResult,
  size: ArtSize,
  framing: FrameOption,
  urgency: Urgency,
  config: PricingConfig = DEFAULT_PRICING
): PriceBreakdown {
  const basePrice = config.basePrice;
  const complexityCharge = complexityResult.overallScore * config.complexityMultiplier;
  const personCharge =
    complexityResult.personCount > 1
      ? (complexityResult.personCount - 1) * config.personCharge
      : 0;
  const sizeCharge = config.sizeFactors[size] || 0;
  const framingCharge = config.framingFactors[framing] || 0;
  const urgencyCharge = config.urgencyFactors[urgency] || 0;

  const total = Math.round(
    basePrice +
      complexityCharge +
      personCharge +
      sizeCharge +
      framingCharge +
      urgencyCharge
  );

  return {
    basePrice,
    complexityCharge: Math.round(complexityCharge),
    personCharge,
    sizeCharge,
    framingCharge,
    urgencyCharge,
    total,
  };
}
