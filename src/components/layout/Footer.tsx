import Link from 'next/link';
import { Gavel, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Gavel className="h-7 w-7 text-burgundy-light" />
              <span className="text-2xl font-heading font-bold tracking-tighter">AUGEO</span>
            </div>
            <p className="text-gray-400 text-base leading-relaxed mb-6">
              Public auctions: art, furniture, vehicles, professional equipment. Augeo supports you in your bids with complete confidence.
            </p>
            <div className="space-y-3 text-base text-gray-400">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded bg-white/5"><Mail className="h-4 w-4 text-burgundy-light" /></div>
                <span>support@augeo.com</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded bg-white/5"><Phone className="h-4 w-4 text-burgundy-light" /></div>
                <span>+33 (0)1 23 45 67 89</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded bg-white/5"><MapPin className="h-4 w-4 text-burgundy-light" /></div>
                <span>Paris, France</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-base uppercase tracking-wider mb-6">Auctions & Lots</h3>
            <ul className="space-y-3 text-base">
              <li><Link href="/auctions" className="text-gray-400 hover:text-white transition-colors">All auctions</Link></li>
              <li><Link href="/categories" className="text-gray-400 hover:text-white transition-colors">Categories</Link></li>
              <li><Link href="/pages/how-it-works" className="text-gray-400 hover:text-white transition-colors">How it works</Link></li>
              <li><Link href="/pages/buyers-premium" className="text-gray-400 hover:text-white transition-colors">Buyer&apos;s Premium</Link></li>
              <li><Link href="/auth/register" className="text-gray-400 hover:text-white transition-colors">Register</Link></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="font-heading font-bold text-base uppercase tracking-wider mb-6">Information</h3>
            <ul className="space-y-3 text-base">
              <li><Link href="/pages/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
              <li><Link href="/pages/authentication-process" className="text-gray-400 hover:text-white transition-colors">Expertise & Authenticity</Link></li>
              <li><Link href="/pages/shipping-taxes" className="text-gray-400 hover:text-white transition-colors">Shipping & Taxes</Link></li>
              <li><Link href="/pages/terms" className="text-gray-400 hover:text-white transition-colors">Terms</Link></li>
              <li><Link href="/pages/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</Link></li>
            </ul>
          </div>

          {/* Sell With Us */}
          <div>
            <h3 className="font-heading font-bold text-base uppercase tracking-wider mb-6">Sell with us</h3>
            <p className="text-gray-400 text-base leading-relaxed mb-6">
              Are you an auction house or an expert? Join the leading platform.
            </p>
            <Link href="/pages/contact" className="inline-flex items-center px-6 py-2.5 bg-burgundy hover:bg-burgundy-dark text-white text-sm font-bold rounded transition-all uppercase tracking-widest">
              Contact us
            </Link>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-gray-500 text-sm font-medium">
              &copy; {new Date().getFullYear()} Augeo Auction Platform. All rights reserved.
            </p>
            <div className="flex items-center gap-8 text-sm font-bold text-gray-500 uppercase tracking-widest leading-none">
              <Link href="/pages/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/pages/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/pages/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
