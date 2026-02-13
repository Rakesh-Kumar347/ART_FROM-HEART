"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    rating: 5,
    text: "The sketch of my wedding photo was absolutely stunning. Every detail was captured perfectly. It brought tears of joy!",
  },
  {
    name: "Rahul Verma",
    rating: 5,
    text: "I ordered a family portrait sketch as a gift for my parents' anniversary. They loved it! The attention to detail is remarkable.",
  },
  {
    name: "Ananya Patel",
    rating: 5,
    text: "Got a sketch of my pet dog and it looks so lifelike. The artist truly has a gift. Fast delivery and great communication!",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="section-padding bg-dark-900/30">
      <div className="container-width">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-dark-50">
            What Our <span className="gold-text">Clients Say</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="glass-card p-6 relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <Quote className="w-8 h-8 text-primary-400/20 mb-4" />
              <p className="text-dark-300 text-sm leading-relaxed mb-4">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className="w-4 h-4 text-primary-400 fill-primary-400"
                  />
                ))}
              </div>
              <p className="text-dark-50 font-medium text-sm">{t.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
