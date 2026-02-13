import { cn } from "@/lib/utils";

type BadgeVariant =
  | "blue"
  | "yellow"
  | "green"
  | "purple"
  | "emerald"
  | "gold"
  | "red";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  yellow: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  green: "bg-green-500/20 text-green-400 border-green-500/30",
  purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  emerald: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  gold: "bg-primary-400/20 text-primary-400 border-primary-400/30",
  red: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function Badge({
  variant = "gold",
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
