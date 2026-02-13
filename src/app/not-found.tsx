import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-serif font-bold gold-text mb-4">404</h1>
        <h2 className="text-2xl font-serif font-bold text-dark-50 mb-3">
          Page Not Found
        </h2>
        <p className="text-dark-400 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-400 to-primary-500 text-dark-950 rounded-lg font-medium hover:from-primary-300 hover:to-primary-400 transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-primary-400/50 text-primary-400 rounded-lg font-medium hover:bg-primary-400/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            View Gallery
          </Link>
        </div>
      </div>
    </div>
  );
}
