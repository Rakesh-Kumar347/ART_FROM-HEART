import type { Metadata } from "next";
import { Playfair_Display, Inter, Cormorant_Garamond } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Art From Heart | Custom Pencil Sketch Portraits",
    template: "%s | Art From Heart",
  },
  description:
    "Custom pencil sketch portraits crafted with love. Upload your photo, get an instant AI-powered quote, and receive a hand-drawn masterpiece.",
  keywords: [
    "pencil sketch",
    "portrait",
    "custom art",
    "hand drawn",
    "sketch artist",
    "gift",
  ],
  openGraph: {
    title: "Art From Heart | Custom Pencil Sketch Portraits",
    description:
      "Custom pencil sketch portraits crafted with love. Upload your photo and get an instant AI-powered quote.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${playfair.variable} ${inter.variable} ${cormorant.variable} font-sans antialiased bg-dark-950 text-dark-50`}
      >
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1a1a1a",
              color: "#f7f7f7",
              border: "1px solid #434343",
            },
          }}
        />
      </body>
    </html>
  );
}
