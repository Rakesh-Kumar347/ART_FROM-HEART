import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return format(new Date(dateString), "dd MMM yyyy");
}

export function formatDateTime(dateString: string): string {
  return format(new Date(dateString), "dd MMM yyyy, hh:mm a");
}

export function generateOrderId(): string {
  const prefix = "AFH";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function getCloudinaryUrl(
  publicId: string,
  options?: { width?: number; height?: number; quality?: string }
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const transforms: string[] = [];

  if (options?.width) transforms.push(`w_${options.width}`);
  if (options?.height) transforms.push(`h_${options.height}`);
  transforms.push(`q_${options?.quality || "auto"}`);
  transforms.push("f_auto");

  const transformStr = transforms.length > 0 ? transforms.join(",") + "/" : "";
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformStr}${publicId}`;
}
