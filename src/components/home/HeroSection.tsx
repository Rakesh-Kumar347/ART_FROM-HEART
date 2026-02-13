"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pencil-texture">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-950/90 to-dark-950" />

      {/* Decorative pencil stroke lines */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 1200 800" fill="none">
          <path
            d="M100,400 Q300,100 500,350 T900,300"
            stroke="#d4a574"
            strokeWidth="1"
            className="animate-pencil-draw"
            strokeDasharray="1000"
          />
          <path
            d="M200,500 Q400,200 600,450 T1000,400"
            stroke="#d4a574"
            strokeWidth="0.5"
            className="animate-pencil-draw"
            strokeDasharray="1000"
            style={{ animationDelay: "0.5s" }}
          />
        </svg>
      </div>

      <div className="relative z-10 container-width px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-light tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="gold-text">Art</span>{" "}
            <span className="text-dark-200">From</span>{" "}
            <span className="gold-text">Heart</span>
          </motion.h1>

          <motion.p
            className="mt-6 text-lg sm:text-xl md:text-2xl text-dark-300 font-serif"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Where Your Memories Become Timeless Pencil Art
          </motion.p>

          <motion.p
            className="mt-4 text-sm sm:text-base text-dark-400 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Upload your favourite photo and our AI will instantly estimate the
            complexity. Get a custom hand-drawn pencil sketch crafted with love.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <Link href="/order">
              <Button size="lg">Order Your Sketch</Button>
            </Link>
            <Link href="/gallery">
              <Button variant="outline" size="lg">
                View Gallery
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-dark-500 flex justify-center pt-2">
            <div className="w-1 h-2 bg-primary-400 rounded-full" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
