"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({
  children,
  className,
  hover = false,
  onClick,
}: CardProps) {
  const Component = hover || onClick ? motion.div : "div";
  const motionProps =
    hover || onClick
      ? {
          whileHover: { scale: 1.02, y: -2 },
          transition: { type: "spring" as const, stiffness: 300 },
        }
      : {};

  return (
    <Component
      className={cn(
        "bg-dark-900/50 backdrop-blur-sm border border-dark-700/50 rounded-xl p-6",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      {...motionProps}
    >
      {children}
    </Component>
  );
}
