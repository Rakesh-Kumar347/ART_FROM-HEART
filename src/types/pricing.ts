export interface ComplexityBreakdown {
  persons: { score: number; count: number; description: string };
  faces: { score: number; count: number; description: string };
  clothing: { score: number; description: string };
  accessories: { score: number; count: number; description: string };
}

export interface ComplexityResult {
  overallScore: number;
  personCount: number;
  faceDetailScore: number;
  clothingScore: number;
  accessoryScore: number;
  breakdown: ComplexityBreakdown;
}

export interface PricingConfig {
  basePrice: number;
  complexityMultiplier: number;
  personCharge: number;
  sizeFactors: Record<string, number>;
  framingFactors: Record<string, number>;
  urgencyFactors: Record<string, number>;
}
