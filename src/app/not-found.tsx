import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-8xl font-serif font-bold gold-text mb-4">404</p>
        <h2 className="text-2xl font-serif font-bold text-dark-50 mb-2">Page Not Found</h2>
        <p className="text-dark-400 mb-8">The page you are looking for doesn&apos;t exist or has been moved.</p>
        <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg gold-gradient text-dark-950 font-medium hover:opacity-90 transition-opacity">
          <Home className="h-4 w-4" /> Back to Home
        </Link>
      </div>
    </div>
  );
}
