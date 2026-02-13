"use client";

import { useState, useCallback } from "react";
import { ComplexityResult } from "@/types/pricing";
import {
  analyzeImageComplexity,
  AnalysisStep,
} from "@/lib/ai/complexity-analyzer";

interface UseComplexityAnalysisReturn {
  analyze: (file: File) => Promise<ComplexityResult | null>;
  result: ComplexityResult | null;
  isAnalyzing: boolean;
  progress: AnalysisStep;
  error: string | null;
  reset: () => void;
}

export function useComplexityAnalysis(): UseComplexityAnalysisReturn {
  const [result, setResult] = useState<ComplexityResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState<AnalysisStep>({
    step: "",
    percent: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(
    async (file: File): Promise<ComplexityResult | null> => {
      setIsAnalyzing(true);
      setError(null);
      setProgress({ step: "Loading image...", percent: 0 });

      try {
        // Load image into an HTMLImageElement
        const imageUrl = URL.createObjectURL(file);
        const img = new Image();
        img.crossOrigin = "anonymous";

        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("Failed to load image"));
          img.src = imageUrl;
        });

        // Resize to max 640x640 for performance
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        const maxSize = 640;
        let { naturalWidth: w, naturalHeight: h } = img;

        if (w > maxSize || h > maxSize) {
          const scale = maxSize / Math.max(w, h);
          w = Math.round(w * scale);
          h = Math.round(h * scale);
        }

        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);

        // Run analysis
        const analysisResult = await analyzeImageComplexity(
          canvas,
          setProgress
        );

        setResult(analysisResult);
        URL.revokeObjectURL(imageUrl);

        return analysisResult;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Analysis failed";
        setError(errorMessage);
        return null;
      } finally {
        setIsAnalyzing(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setResult(null);
    setIsAnalyzing(false);
    setProgress({ step: "", percent: 0 });
    setError(null);
  }, []);

  return {
    analyze,
    result,
    isAnalyzing,
    progress,
    error,
    reset,
  };
}
