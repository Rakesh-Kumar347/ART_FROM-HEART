"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "children" | "className"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-primary-400 to-primary-500 text-dark-950 hover:from-primary-300 hover:to-primary-400 shadow-lg shadow-primary-400/20",
  secondary:
    "bg-dark-800 text-dark-50 hover:bg-dark-700 border border-dark-700",
  outline:
    "border border-primary-400/50 text-primary-400 hover:bg-primary-400/10",
  ghost: "text-dark-300 hover:text-dark-50 hover:bg-dark-800/50",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3 text-base",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:ring-offset-2 focus:ring-offset-dark-950 disabled:opacity-50 disabled:cursor-not-allowed",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;
