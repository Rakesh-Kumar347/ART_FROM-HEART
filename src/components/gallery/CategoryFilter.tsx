"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/constants";
import { ArtCategory } from "@/types/portfolio";

interface CategoryFilterProps {
  selected: ArtCategory | "all";
  onSelect: (category: ArtCategory | "all") => void;
}

const allCategories: { value: ArtCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  ...CATEGORIES,
];

export default function CategoryFilter({
  selected,
  onSelect,
}: CategoryFilterProps) {
  return (
    <nav
      role="tablist"
      aria-label="Filter artworks by category"
      className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center"
    >
      {allCategories.map((category) => {
        const isActive = selected === category.value;

        return (
          <button
            key={category.value}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(category.value)}
            className={cn(
              "relative whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-950",
              isActive
                ? "text-dark-950"
                : "bg-dark-800 text-dark-300 hover:text-dark-50 hover:bg-dark-700"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="activeCategory"
                className="absolute inset-0 rounded-full bg-primary-400"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">{category.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
