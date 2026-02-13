"use client";

import * as tf from "@tensorflow/tfjs";
import { DetectedObject } from "./person-detection";

export interface ClothingAnalysisResult {
  clothingScore: number;
  edgeDensity: number;
  description: string;
}

export async function analyzeClothingComplexity(
  imageElement: HTMLImageElement | HTMLCanvasElement,
  persons: DetectedObject[]
): Promise<ClothingAnalysisResult> {
  if (persons.length === 0) {
    return {
      clothingScore: 1,
      edgeDensity: 0,
      description: "No persons detected for clothing analysis",
    };
  }

  // Create canvas for image manipulation
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  const imgWidth =
    imageElement instanceof HTMLImageElement
      ? imageElement.naturalWidth
      : imageElement.width;
  const imgHeight =
    imageElement instanceof HTMLImageElement
      ? imageElement.naturalHeight
      : imageElement.height;

  canvas.width = imgWidth;
  canvas.height = imgHeight;
  ctx.drawImage(imageElement, 0, 0);

  let totalEdgeDensity = 0;

  for (const person of persons) {
    const [x, y, w, h] = person.bbox;

    // Focus on the body area (below the head, roughly lower 70% of person bbox)
    const bodyY = Math.round(y + h * 0.3);
    const bodyH = Math.round(h * 0.7);
    const cropX = Math.max(0, Math.round(x));
    const cropW = Math.min(Math.round(w), imgWidth - cropX);
    const cropH = Math.min(bodyH, imgHeight - bodyY);

    if (cropW <= 0 || cropH <= 0) continue;

    const imageData = ctx.getImageData(cropX, bodyY, cropW, cropH);

    // Convert to grayscale tensor and apply Sobel filter
    const edgeDensity = await computeEdgeDensity(imageData, cropW, cropH);
    totalEdgeDensity += edgeDensity;
  }

  const avgEdgeDensity = totalEdgeDensity / persons.length;

  // Map edge density to score (0-10)
  // Calibrated thresholds: plain clothing ~0.05, patterned ~0.15, very detailed ~0.25+
  let clothingScore: number;
  if (avgEdgeDensity < 0.05) clothingScore = 2;
  else if (avgEdgeDensity < 0.08) clothingScore = 3;
  else if (avgEdgeDensity < 0.12) clothingScore = 5;
  else if (avgEdgeDensity < 0.18) clothingScore = 7;
  else if (avgEdgeDensity < 0.25) clothingScore = 8;
  else clothingScore = 10;

  let description: string;
  if (clothingScore <= 3) description = "Simple/plain clothing - minimal detail work";
  else if (clothingScore <= 5)
    description = "Moderate clothing detail - some patterns or textures";
  else if (clothingScore <= 7)
    description = "Detailed clothing - visible patterns and textures";
  else description = "Highly detailed clothing - intricate patterns (saree, embroidery, etc.)";

  return {
    clothingScore,
    edgeDensity: avgEdgeDensity,
    description,
  };
}

async function computeEdgeDensity(
  imageData: ImageData,
  width: number,
  height: number
): Promise<number> {
  return tf.tidy(() => {
    // Convert to grayscale
    const pixels = new Float32Array(width * height);
    for (let i = 0; i < width * height; i++) {
      const r = imageData.data[i * 4];
      const g = imageData.data[i * 4 + 1];
      const b = imageData.data[i * 4 + 2];
      pixels[i] = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    }

    const grayscale = tf.tensor4d(pixels, [1, height, width, 1]);

    // Sobel X kernel
    const sobelX = tf.tensor4d(
      [-1, 0, 1, -2, 0, 2, -1, 0, 1],
      [3, 3, 1, 1]
    );

    // Sobel Y kernel
    const sobelY = tf.tensor4d(
      [-1, -2, -1, 0, 0, 0, 1, 2, 1],
      [3, 3, 1, 1]
    );

    const gx = tf.conv2d(grayscale, sobelX, 1, "same");
    const gy = tf.conv2d(grayscale, sobelY, 1, "same");

    const magnitude = tf.sqrt(tf.add(tf.square(gx), tf.square(gy)));

    // Threshold: count pixels where gradient magnitude > threshold
    const threshold = 0.1;
    const edgePixels = tf.greater(magnitude, threshold);
    const edgeCount = tf.sum(tf.cast(edgePixels, "float32")).dataSync()[0];
    const totalPixels = width * height;

    return edgeCount / totalPixels;
  });
}
