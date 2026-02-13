"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import toast from "react-hot-toast";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success("Message sent successfully!");
        setForm({ name: "", email: "", message: "" });
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section-padding bg-dark-900/30">
      <div className="container-width">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-dark-50">
            Get In <span className="gold-text">Touch</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-5"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Input
              label="Name"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <Textarea
              label="Message"
              placeholder="Tell us about what you'd like..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            />
            <Button type="submit" loading={loading}>
              Send Message
            </Button>
          </motion.form>

          {/* Contact Info */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="glass-card p-6">
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-primary-400 mt-1" />
                <div>
                  <h4 className="text-dark-100 font-medium">Email</h4>
                  <p className="text-dark-400 text-sm">
                    artfromheart@email.com
                  </p>
                </div>
              </div>
            </div>
            <div className="glass-card p-6">
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-primary-400 mt-1" />
                <div>
                  <h4 className="text-dark-100 font-medium">Phone</h4>
                  <p className="text-dark-400 text-sm">+91 98765 43210</p>
                </div>
              </div>
            </div>
            <div className="glass-card p-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-primary-400 mt-1" />
                <div>
                  <h4 className="text-dark-100 font-medium">Location</h4>
                  <p className="text-dark-400 text-sm">India</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
