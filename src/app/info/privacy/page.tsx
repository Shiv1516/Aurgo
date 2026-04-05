"use client";

import Link from "next/link";
import { Shield, Eye, Lock, Database, Globe, ChevronRight, UserCheck } from "lucide-react";

export default function Privacy() {

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <section className="py-24 bg-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-burgundy/5 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-2 text-burgundy text-sm font-black uppercase tracking-[0.1em] mb-4">
            <Lock className="h-3 w-3" /> Privacy Policy
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none mb-6">
            {"Privacy Policy".split(' ').map((word, i, arr) => (
              i === arr.length - 1 ? <span key={i} className="text-burgundy italic">{word}</span> : word + ' '
            ))}
          </h1>
          <p className="text-gray-400 text-2xl font-medium max-w-2xl italic leading-relaxed">
            "Our commitment to the cryptographic protection and absolute privacy of your identity and asset data."
          </p>
          <p className="text-sm font-black text-gray-500 uppercase tracking-widest mt-8">Effective: February 2026</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Main Legal Text */}
            <div className="lg:col-span-2 space-y-12">
               {[
                 { 
                   key: 'collection', 
                   title: "Data Collection", 
                   p1: "In order to facilitate high-value acquisitions, Augeo collects essential identity packets during the Trust Clearance phase. This includes government-issued identification, biometric liveness data, and certified proof of residency.",
                   guaranteeTitle: "The 'Zero-Leach' Guarantee",
                   guaranteeDesc: "We do not sell, rent, or trade your personal data to third-party marketing entities. Your data exists only to ensure the security of the auction ecosystem."
                 },
                 { 
                   key: 'storage', 
                   title: "Storage & Retention", 
                   p1: "Identity data is stored in air-gapped, encrypted environments using AES-256 Bit standards. We retain your data only as long as required for jurisdictional compliance and to maintain your Guild Membership status." 
                 },
                 { 
                   key: 'cookies', 
                   title: "Cookie Protocol", 
                   p1: "Augeo uses essential session cookies to maintain your login status and ensure the stability of real-time bidding sockets. We do not use intrusive tracking or behavioral profiling scripts." 
                 }
               ].map((section) => (
                 <div key={section.key}>
                    <h2 className="text-4xl font-black text-dark tracking-tighter uppercase mb-6 flex items-center gap-4">
                       {section.key === 'collection' ? <Shield className="h-8 w-8 text-burgundy" /> : section.key === 'storage' ? <Database className="h-8 w-8 text-burgundy" /> : <Globe className="h-8 w-8 text-burgundy" />}
                       {section.title}
                    </h2>
                    <p className="text-gray-500 font-medium leading-relaxed mb-6">
                      {section.p1}
                    </p>
                    {section.guaranteeTitle && (
                      <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
                         <h3 className="text-base font-black text-dark uppercase tracking-widest mb-4">
                            {section.guaranteeTitle}
                         </h3>
                         <p className="text-sm text-gray-400 leading-relaxed italic">
                            {section.guaranteeDesc}
                         </p>
                      </div>
                    )}
                 </div>
               ))}
            </div>

            {/* Sidebar Highlights */}
            <div className="space-y-8">
               <div className="p-8 bg-gray-50 rounded-xl border border-gray-200 shadow-xl shadow-black/5">
                  <h3 className="text-2xl font-black text-dark mb-6 uppercase tracking-tight">Privacy FAQ</h3>
                  <div className="space-y-6">
                    {[
                      { q: "Is my data encrypted?", a: "Yes, 100% of identity packets are pre-encrypted before storage." },
                      { q: "Who can see my bids?", a: "Only your Guild Rank is visible. Your real identity remains hidden." },
                      { q: "Can I delete my data?", a: "Yes, per GDPR/CCPA protocols, barring active financial commitments." }
                    ].map((item, i) => (
                      <div key={i} className="space-y-2">
                        <p className="text-sm font-black text-burgundy uppercase tracking-widest">{item.q}</p>
                        <p className="text-sm text-gray-500 font-bold leading-relaxed">{item.a}</p>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="p-10 bg-dark rounded-xl text-white flex flex-col items-center text-center">
                  <UserCheck className="h-12 w-12 text-burgundy mb-6" />
                  <h3 className="text-xl font-black uppercase tracking-tight mb-4">Trust Verified</h3>
                  <p className="text-sm text-gray-400 font-medium italic mb-6">
                    Our privacy framework is audited quarterly by leading cybersecurity agencies.
                  </p>
                  <Link href="/info/authentication-process" className="text-sm font-black text-burgundy uppercase tracking-widest underline decoration-2 underline-offset-4">
                    View Verification Journey
                  </Link>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-black text-dark tracking-tighter uppercase mb-8 leading-tight">
            {"Security Matters".split(' ').map((word, i, arr) => (
              i === arr.length - 1 ? <span key={i} className="text-burgundy italic">{word}</span> : word + ' '
            ))}
          </h2>
          <p className="text-gray-500 text-xl mb-12 font-medium italic">
            For specific data access requests or privacy inquiries, please contact our Compliance Officer.
          </p>
          <Link href="/info/contact" className="btn-primary !px-12 !py-4 uppercase tracking-widest font-black text-sm">
             Contact Compliance
          </Link>
        </div>
      </section>
    </div>
  );
}
