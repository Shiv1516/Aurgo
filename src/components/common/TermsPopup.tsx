'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Gavel, FileText, ChevronRight } from 'lucide-react';

export default function TermsPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const accepted = localStorage.getItem('augeo_terms_accepted');
    if (!accepted) {
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('augeo_terms_accepted', 'true');
    setIsOpen(false);
  };

  const handleReject = () => {
    window.location.href = 'https://www.google.com';
  };

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#0a0a0b]/90 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl bg-white rounded-xl overflow-hidden shadow-2xl border border-gray-200"
          >
            {/* Top Branding Accent */}
            <div className="absolute top-0 inset-x-0 h-2 bg-burgundy" />
            
            <div className="p-10 sm:p-8">
              {/* Header */}
              <div className="flex flex-col items-center text-center mb-10">
                <div className="h-20 w-20 bg-burgundy/10 rounded-xl flex items-center justify-center mb-6 border border-burgundy/20 shadow-inner">
                  <Shield className="h-10 w-10 text-burgundy" />
                </div>
                <h2 className="text-5xl font-black text-navy leading-tight mb-6">
                  Conditions <br /><span className="text-burgundy italic">d'utilisation</span>
                </h2>
                <div className="flex items-center gap-3">
                   <div className="h-px w-8 bg-gray-200" />
                   <p className="text-sm font-black text-gray-400 uppercase tracking-[0.1em]">Augeo Institutional Protocol</p>
                   <div className="h-px w-8 bg-gray-200" />
                </div>
              </div>

              {/* Content Area */}
              <div className="bg-white rounded-xl p-8 mb-10 border border-gray-200 max-h-[30vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-6">
                  <div className="flex gap-5">
                    <div className="flex-shrink-0 h-6 w-6 rounded-xl bg-navy flex items-center justify-center mt-1">
                      <FileText className="h-3 w-3 text-burgundy" />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-dark uppercase tracking-wider mb-1">Binding Agreement</h4>
                      <p className="text-base text-gray-500 leading-relaxed font-medium">
                        By entering this platform, you agree to comply with our rigorous bidding standards. Every bid placed is a legally binding contract under international auction laws.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-5">
                    <div className="flex-shrink-0 h-6 w-6 rounded-xl bg-navy flex items-center justify-center mt-1">
                      <Gavel className="h-3 w-3 text-burgundy" />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-dark uppercase tracking-wider mb-1">Financial Integrity</h4>
                      <p className="text-base text-gray-500 leading-relaxed font-medium">
                        You certify that you possess the necessary liquidity to settle all acquisitions and accept our mandatory buyer&apos;s premium and settlement policies.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-5">
                    <div className="flex-shrink-0 h-6 w-6 rounded-xl bg-navy flex items-center justify-center mt-1">
                      <Shield className="h-3 w-3 text-burgundy" />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-dark uppercase tracking-wider mb-1">Authenticated Privacy</h4>
                      <p className="text-base text-gray-500 leading-relaxed font-medium">
                        Your participation is subject to our enhanced KYC/AML verification protocols. We maintain absolute discretion over platform access and bidding privileges.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-5">
                <button
                  onClick={handleAccept}
                  className="flex-[2] px-10 py-5 bg-burgundy hover:bg-burgundy-dark text-white font-black rounded-2xl transition-all duration-500 flex items-center justify-center gap-3 group uppercase tracking-[0.1em] text-sm shadow-2xl shadow-burgundy/10"
                >
                  J'ACCEPTE LES CONDITIONS
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={handleReject}
                  className="flex-1 px-10 py-5 bg-white hover:bg-gray-50 text-gray-400 hover:text-dark font-black rounded-2xl transition-all duration-500 uppercase tracking-widest text-sm border border-gray-200"
                >
                  Exit Site
                </button>
              </div>

              {/* Footer Meta */}
              <p className="text-center text-sm text-gray-400 mt-10 font-bold tracking-widest uppercase">
                Augeo Executive Council &copy; 2026 &bull; Secured with 256-bit Encryption
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
