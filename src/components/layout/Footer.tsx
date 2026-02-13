import Link from "next/link";
import { Instagram, Facebook, MessageCircle } from "lucide-react";
import { SITE_NAME, NAV_LINKS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-dark-950 border-t border-dark-800/50">
      <div className="container-width section-padding">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-serif font-bold gold-text mb-3">
              {SITE_NAME}
            </h3>
            <p className="text-dark-400 text-sm leading-relaxed">
              Turning your precious moments into timeless pencil sketch art.
              Every stroke crafted with love and attention to detail.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-dark-200 uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-dark-400 hover:text-primary-400 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold text-dark-200 uppercase tracking-wider mb-4">
              Connect With Us
            </h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2.5 rounded-lg bg-dark-800/50 text-dark-400 hover:text-primary-400 hover:bg-dark-800 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2.5 rounded-lg bg-dark-800/50 text-dark-400 hover:text-primary-400 hover:bg-dark-800 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2.5 rounded-lg bg-dark-800/50 text-dark-400 hover:text-primary-400 hover:bg-dark-800 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-dark-800/50 text-center">
          <p className="text-dark-500 text-sm">
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
