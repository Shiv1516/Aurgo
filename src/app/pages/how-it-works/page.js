"use client";

import Link from "next/link";
import { Hammer, ShieldCheck, Wallet, ChevronRight, Gavel, Award, TrendingUp, Info } from "lucide-react";

export default function HowItWork() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="py-24 bg-dark text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gold/5 blur-[120px] rounded-full translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6 leading-none">
            The Augeo <span className="text-gold italic">Method</span>
          </h1>
          <p className="text-gray-400 text-xl font-medium max-w-2xl mx-auto italic font-heading">
            Authenticating liquid assets and empowering global collectors through a frictionless 3-stage protocol.
          </p>
        </div>
      </section>

      {/* The 3-Step Protocol */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-32">
            
            {/* Step 1 */}
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="order-2 lg:order-1">
                <div className="flex items-center gap-3 text-gold mb-6">
                  <span className="text-4xl font-black italic">01</span>
                  <div className="h-px flex-grow bg-gold/20" />
                </div>
                <h2 className="text-4xl font-black text-dark tracking-tighter uppercase mb-6 leading-none">
                  Identity <span className="text-gold italic">Clearance</span>
                </h2>
                <div className="space-y-6">
                   <p className="text-gray-500 text-lg leading-relaxed">
                     To maintain the integrity of our gated marketplace, all participants must undergo initial Trust Clearance. This protects the ecosystem from fraudulent activity and ensures a zero-risk environment for high-value transactions.
                   </p>
                   <ul className="space-y-4">
                     {[
                       "Submit government-issued identification.",
                       "Pass AI-driven biometric liveness checks.",
                       "Receive instant guild tier assignment."
                     ].map((item, i) => (
                       <li key={i} className="flex items-center gap-3 text-dark font-bold">
                         <div className="h-2 w-2 rounded-full bg-gold" />
                         {item}
                       </li>
                     ))}
                   </ul>
                   <Link href="/pages/authentication-process" className="inline-flex items-center gap-2 text-gold font-black uppercase tracking-widest text-xs group">
                     Detail the Process <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                   </Link>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                 <div className="aspect-[4/3] bg-gray-50 rounded-[3rem] flex items-center justify-center p-12 border border-gray-100 shadow-2xl shadow-black/5 relative overflow-hidden">
                    <ShieldCheck className="h-40 w-40 text-gold/20" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-gold/5" />
                 </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div>
                 <div className="aspect-[4/3] bg-dark rounded-[3rem] flex items-center justify-center p-12 border border-white/5 shadow-2xl shadow-gold/5 relative overflow-hidden">
                    <Hammer className="h-40 w-40 text-gold/20" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-gold/0 to-gold/10" />
                 </div>
              </div>
              <div>
                <div className="flex items-center gap-3 text-gold mb-6">
                  <span className="text-4xl font-black italic">02</span>
                  <div className="h-px flex-grow bg-gold/20" />
                </div>
                <h2 className="text-4xl font-black text-dark tracking-tighter uppercase mb-6 leading-none">
                  Strategic <span className="text-gold italic">Acquisition</span>
                </h2>
                <div className="space-y-6">
                   <p className="text-gray-500 text-lg leading-relaxed">
                     Once cleared, gain access to live auctions and upcoming drops. Our real-time bidding infrastructure uses low-latency sockets to ensure your bids are captured instantly, even in the final seconds.
                   </p>
                   <div className="grid grid-cols-2 gap-6">
                      <div className="p-6 bg-gray-50 rounded-3xl">
                         <Gavel className="h-8 w-8 text-gold mb-3" />
                         <p className="font-black text-dark uppercase tracking-tight text-sm">Real-time Pulse</p>
                         <p className="text-xs text-gray-500 mt-1">Millisecond-grade bidding latency.</p>
                      </div>
                      <div className="p-6 bg-gray-50 rounded-3xl">
                         <TrendingUp className="h-8 w-8 text-gold mb-3" />
                         <p className="font-black text-dark uppercase tracking-tight text-sm">Auto-Bidding</p>
                         <p className="text-xs text-gray-500 mt-1">Set limits and let the system defend your position.</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="order-2 lg:order-1">
                <div className="flex items-center gap-3 text-gold mb-6">
                  <span className="text-4xl font-black italic">03</span>
                  <div className="h-px flex-grow bg-gold/20" />
                </div>
                <h2 className="text-4xl font-black text-dark tracking-tighter uppercase mb-6 leading-none">
                  Secure <span className="text-gold italic">Settlement</span>
                </h2>
                <div className="space-y-6">
                   <p className="text-gray-500 text-lg leading-relaxed">
                     Winning bidders enter the settlement phase immediately. Our integration with Stripe Capital ensures institutional-grade fund transfer, followed by insured global logistics for physical assets.
                   </p>
                   <div className="flex items-start gap-4 p-6 border border-gold/20 bg-gold/5 rounded-3xl">
                      <Award className="h-10 w-10 text-gold flex-shrink-0" />
                      <div>
                         <p className="font-black text-dark uppercase tracking-wide text-sm">Certificate of Provenance</p>
                         <p className="text-xs text-gray-500 mt-1 leading-relaxed">Every winning bid is closed with a certified, cryptographically signed record of authenticity and ownership transfer.</p>
                      </div>
                   </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                 <div className="aspect-[4/3] bg-gray-50 rounded-[3rem] flex items-center justify-center p-12 border border-gray-100 shadow-2xl shadow-black/5 relative overflow-hidden">
                    <Wallet className="h-40 w-40 text-gold/20" />
                    <div className="absolute inset-0 bg-gradient-to-bl from-white/0 to-gold/5" />
                 </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-[3rem] p-12 lg:p-20 shadow-xl shadow-black/5 border border-gray-100 flex flex-col lg:flex-row items-center justify-between gap-12">
               <div className="max-w-xl text-center lg:text-left">
                  <div className="flex items-center gap-3 text-gold mb-6 justify-center lg:justify-start">
                    <Info className="h-6 w-6" />
                    <span className="text-xs font-black uppercase tracking-[0.4em]">Resource Center</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-dark tracking-tighter uppercase mb-6 leading-tight">
                    Still Have <span className="text-gold italic">Inquiries?</span>
                  </h2>
                  <p className="text-gray-500 text-lg font-medium leading-relaxed italic">
                    Our concierge team is available 24/7 for tailored inquiries regarding high-value acquisitions.
                  </p>
               </div>
               <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto">
                  <Link href="/pages/contact" className="btn-primary !px-12 !py-5 uppercase tracking-widest font-black text-xs text-center">
                    Contact Concierge
                  </Link>
                  <Link href="/pages/buyers-premium" className="px-12 py-5 border border-gray-200 hover:border-gold bg-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all text-center">
                    Fee Structure
                  </Link>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
