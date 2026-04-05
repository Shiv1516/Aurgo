'use client';

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
              Augeo is the world's premier destination for high-value asset acquisitions, powered by institutional-grade authentication.
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
            <h3 className="font-heading font-bold text-base uppercase tracking-wider mb-6">Quick Links</h3>
            <ul className="space-y-3 text-base">
               <li><Link href="/auctions" className="text-gray-400 hover:text-white transition-colors">All auctions</Link></li>
               <li><Link href="/categories" className="text-gray-400 hover:text-white transition-colors">Categories</Link></li>
               <li><Link href="/pages/how-it-works" className="text-gray-400 hover:text-white transition-colors">How it works</Link></li>
               <li><Link href="/pages/buyers-premium" className="text-gray-400 hover:text-white transition-colors">Buyer's Premium</Link></li>
               <li><Link href="/auth/register" className="text-gray-400 hover:text-white transition-colors">Register</Link></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="font-heading font-bold text-base uppercase tracking-wider mb-6">Information</h3>
            <ul className="space-y-3 text-base">
               <li><Link href="/info/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
               <li><Link href="/info/authentication-process" className="text-gray-400 hover:text-white transition-colors">Expertise</Link></li>
               <li><Link href="/info/shipping-taxes" className="text-gray-400 hover:text-white transition-colors">Shipping & Taxes</Link></li>
               <li><Link href="/info/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
               <li><Link href="/info/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Sell With Us */}
          <div>
            <h3 className="font-heading font-bold text-base uppercase tracking-wider mb-6">Sell With Us</h3>
            <p className="text-gray-400 text-base leading-relaxed mb-6">
              Partner with Augeo to reach our global network of verified collectors and institutions.
            </p>
            <Link href="/info/contact" className="inline-flex items-center px-6 py-2.5 bg-burgundy hover:bg-burgundy-dark text-white text-sm font-bold rounded transition-all uppercase tracking-widest">
               Contact Concierge
            </Link>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-gray-500 text-sm font-medium">
              &copy; {new Date().getFullYear()} Augeo Plattform. All rights reserved.
            </p>
            <div className="flex items-center gap-8 text-sm font-bold text-gray-500 uppercase tracking-widest leading-none">
               <Link href="/info/terms" className="hover:text-white transition-colors">Terms</Link>
               <Link href="/info/privacy" className="hover:text-white transition-colors">Privacy</Link>
               <Link href="/info/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
