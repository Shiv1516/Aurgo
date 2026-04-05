"use client";

import Link from "next/link";
import { Receipt, Info, CheckCircle2, AlertCircle, Percent, Gavel, FileText } from "lucide-react";

export default function Buyers() {

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="py-24 bg-gray-50 border-b border-gray-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-burgundy/5 blur-[120px] rounded-full translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-2 text-burgundy text-sm font-black uppercase tracking-[0.1em] mb-4">
            <Percent className="h-3 w-3" /> Buyers Premium
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-dark tracking-tighter uppercase leading-none mb-6">
            {"Buyers Premium".split(' ').map((word, i, arr) => (
              i === arr.length - 1 ? <span key={i} className="text-burgundy italic">{word}</span> : word + ' '
            ))}
          </h1>
          <p className="text-gray-500 text-2xl font-medium max-w-2xl italic leading-relaxed">
            A comprehensive guide to our standardized fee structures, designed to maintain the Augeo platform's world-class operational integrity.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left: Explanation */}
            <div className="lg:col-span-2 space-y-12">
               <div>
                  <h2 className="text-4xl font-black text-dark tracking-tighter uppercase mb-6">
                    {"What is a Buyers Premium?".split(' ').map((word, i, arr) => (
                      i >= arr.length - 2 ? <span key={i} className="text-burgundy italic">{word} </span> : word + ' '
                    ))}
                  </h2>
                  <p className="text-gray-500 text-xl leading-relaxed font-medium italic mb-6">
                    The Buyer's Premium is a standardized industry fee added to the 'Hammer Price' of an asset. This premium directly funds our multi-stage authentication, global logistics infrastructure, and cryptographically secure settlement protocols.
                  </p>
                  <div className="p-8 bg-dark rounded-xl text-white">
                     <div className="flex items-center gap-4 mb-4">
                        <Receipt className="h-6 w-6 text-burgundy" />
                        <h3 className="text-2xl font-black uppercase tracking-tight">
                        Total Payable
                        </h3>
                     </div>
                     <p className="text-gray-400 font-medium text-xl leading-relaxed">
                        Total Payable = Hammer Price + (Hammer Price × Premium Rate) + Applicable Taxes & Logistics
                     </p>
                  </div>
               </div>

               {/* Fee Tiers */}
               <div>
                  <h2 className="text-3xl font-black text-dark tracking-tighter uppercase mb-8">
                    {"Premium Schedules".split(' ').map((word, i, arr) => (
                      i === arr.length - 1 ? <span key={i} className="text-burgundy italic">{word}</span> : word + ' '
                    ))}
                  </h2>
                  <div className="overflow-hidden rounded-xl border border-gray-200 shadow-xl shadow-black/5">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="p-6 text-sm font-black text-gray-400 uppercase tracking-widest border-b border-gray-200">
                            Asset Class
                          </th>
                          <th className="p-6 text-sm font-black text-gray-400 uppercase tracking-widest border-b border-gray-200">
                            Price Threshold
                          </th>
                          <th className="p-6 text-sm font-black text-gray-400 uppercase tracking-widest border-b border-gray-200">
                            Premium Rate
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {[
                          { class: "Fine Art & Classics", threshold: "Up to $100,000", rate: "15%" },
                          { class: "Fine Art & Classics", threshold: "Above $100,000", rate: "12%" },
                          { class: "Rare Horology", threshold: "Any Limit", rate: "18%" },
                          { class: "Investment Spirits", threshold: "Any Limit", rate: "15%" },
                          { class: "Digital Assets", threshold: "High Velocity", rate: "2.5%" },
                        ].map((row, i) => (
                          <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                            <td className="p-6 font-bold text-dark text-base">{row.class}</td>
                            <td className="p-6 text-gray-500 text-base">{row.threshold}</td>
                            <td className="p-6 font-black text-burgundy">{row.rate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </div>
            </div>

            {/* Right: Sidebar Info */}
            <div className="space-y-8">
               <div className="p-8 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="text-2xl font-black text-dark mb-6 uppercase tracking-tight">
                    Key Provisions
                  </h3>
                  <div className="space-y-6">
                    {[
                      { icon: CheckCircle2, text: "All premiums are settled in the final invoice." },
                      { icon: AlertCircle, text: "Rates are subject to specific lot notations." },
                      { icon: Gavel, text: "The premium is legally part of the final contract." },
                      { icon: FileText, text: "Institutional tax forms provided automatically." }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-3">
                        <item.icon className="h-5 w-5 text-burgundy flex-shrink-0" />
                        <p className="text-sm text-gray-500 font-bold leading-relaxed">{item.text}</p>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="p-8 bg-burgundy rounded-xl shadow-xl shadow-burgundy/20 flex flex-col items-center text-center text-white">
                  <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center mb-6">
                    <Info className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-black mb-4 uppercase tracking-tight">
                    Shipping & Taxes
                  </h3>
                  <p className="text-base font-bold italic mb-6">
                    Note: Premiums do not include shipping, insurance, or import duties.
                  </p>
                  <Link href="/info/shipping-taxes" className="text-sm font-black uppercase tracking-widest underline decoration-2 underline-offset-4">
                    View Logistics Guide
                  </Link>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-black text-dark tracking-tighter uppercase mb-8">
            {"Join the Executive Council".split(' ').map((word, i, arr) => (
              i >= arr.length - 2 ? <span key={i} className="text-burgundy italic">{word} </span> : word + ' '
            ))}
          </h2>
          <p className="text-gray-500 text-xl mb-12 font-medium italic">
            Augeo is more than a platform—it's a community of discerning buyers and sellers committed to excellence. Start your journey with us today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
             <Link href="/auctions" className="btn-primary !px-12 !py-4 uppercase tracking-widest font-black text-sm">
                All auctions
             </Link>
             <Link href="/info/how-it-works" className="px-12 py-4 border border-gray-200 hover:border-burgundy rounded-2xl font-black text-sm uppercase tracking-widest transition-all">
                How it works
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
