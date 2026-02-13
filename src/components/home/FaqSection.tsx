"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "How does the AI pricing work?",
    a: "Our AI analyzes your uploaded photo for the number of people, facial detail, clothing complexity, and accessories. Based on this analysis, it generates a complexity score (1-10) that determines the base sketch price. You then choose size, framing, and delivery speed for the final quote.",
  },
  {
    q: "What is the typical turnaround time?",
    a: "Standard orders take 7-14 days, Express orders 3-5 days, and Rush orders 1-2 days. The timer starts after payment is verified by the artist.",
  },
  {
    q: "Can I request revisions?",
    a: "Yes! We offer one round of minor revisions free of charge. This includes small adjustments to shading, proportions, or details. Major changes may incur an additional fee.",
  },
  {
    q: "How is the sketch delivered?",
    a: "Sketches are drawn on premium acid-free paper. They are carefully packaged in a rigid mailer to prevent damage. You can also opt for framing before delivery. Shipping is available across India.",
  },
  {
    q: "What kind of photos work best?",
    a: "High-resolution photos with good lighting and clear faces produce the best sketches. Avoid blurry, dark, or heavily filtered images. Close-up portraits with visible facial features give the best results.",
  },
  {
    q: "Do you offer framing options?",
    a: "Yes! We offer Basic frames (simple wooden with glass) and Premium frames (elegant frame with mat board and UV-protective glass). You can select framing during the order process.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="section-padding">
      <div className="container-width max-w-3xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-dark-50">
            Frequently Asked <span className="gold-text">Questions</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className="glass-card overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <button
                className="w-full px-6 py-4 flex items-center justify-between text-left"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
              >
                <span className="text-dark-100 font-medium text-sm sm:text-base pr-4">
                  {faq.q}
                </span>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-primary-400 shrink-0 transition-transform duration-300",
                    openIndex === i && "rotate-180"
                  )}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-4">
                      <p className="text-dark-400 text-sm leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
