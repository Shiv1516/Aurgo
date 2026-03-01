import Link from "next/link";
import { Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-gold/10 rounded-full">
            <Search className="h-12 w-12 text-gold" />
          </div>
        </div>
        <h2 className="text-4xl font-heading font-bold text-dark mb-4">
          404 - Page Not Found
        </h2>
        <p className="text-gray-600 mb-10 leading-relaxed">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <Link href="/" className="btn-primary px-10">
          Return to Auctions
        </Link>
      </div>
    </div>
  );
}
