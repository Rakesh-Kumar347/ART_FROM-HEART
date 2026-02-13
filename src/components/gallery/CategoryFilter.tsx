"use client";

import { motion } from "framer-motion";
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
      aria-label="Gallery categories"
      className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center scrollbar-hide"
    >
      {allCategories.map((cat) => {
        const isActive = selected === cat.value;
        return (
          <button
            key={cat.value}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(cat.value)}
            className="relative shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/50"
          >
            {isActive && (
              <motion.span
                layoutId="activeCategory"
                className="absolute inset-0 rounded-full bg-primary-400"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span
              className={`relative z-10 ${
                isActive ? "text-dark-950" : "text-dark-300 hover:text-dark-50"
              }`}
            >
              {cat.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
