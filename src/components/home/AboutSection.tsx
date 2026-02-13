"use client";

import { motion } from "framer-motion";
import { Pencil } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="section-padding">
      <div className="container-width">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Artist image placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-2xl bg-dark-900 border border-dark-700/50 flex items-center justify-center overflow-hidden">
              <div className="text-center">
                <Pencil className="w-16 h-16 text-primary-400/30 mx-auto mb-4" />
                <p className="text-dark-500 text-sm">Artist Photo</p>
              </div>
            </div>
            {/* Decorative border */}
            <div className="absolute -bottom-4 -right-4 w-full h-full rounded-2xl border-2 border-primary-400/20 -z-10" />
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-dark-50 mb-6">
              The Artist Behind{" "}
              <span className="gold-text">the Strokes</span>
            </h2>
            <p className="text-dark-300 leading-relaxed mb-4">
              With a passion for capturing emotions through pencil strokes, I
              transform your cherished photographs into timeless works of art.
              Every sketch is crafted with meticulous attention to detail,
              ensuring each face, expression, and moment is preserved forever.
            </p>
            <p className="text-dark-300 leading-relaxed mb-8">
              From single portraits to family group sketches, I specialize in
              bringing out the soul of every subject. Whether it&apos;s a
              wedding photo, a beloved pet, or a childhood memory, I pour my
              heart into every line.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { number: "500+", label: "Sketches" },
                { number: "5+", label: "Years" },
                { number: "100%", label: "Handmade" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl sm:text-3xl font-serif font-bold gold-text">
                    {stat.number}
                  </p>
                  <p className="text-dark-400 text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
