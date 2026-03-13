"use client";

import Link from "next/link";
import { ShieldCheck, UserCheck, FileText, CheckCircle2, Lock, Fingerprint, ShieldAlert, ChevronRight } from "lucide-react";

export default function AuthenticationProcess() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <section className="py-24 bg-gray-50 border-b border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-burgundy/5 blur-[100px] rounded-full translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-2 text-burgundy text-sm font-black uppercase tracking-[0.4em] mb-4">
            <Lock className="h-3 w-3" /> Secure Protocol
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-dark tracking-tighter uppercase leading-none mb-6">
            Trust <span className="text-burgundy italic">Clearance</span>
          </h1>
          <p className="text-gray-500 text-2xl font-medium max-w-2xl italic leading-relaxed">
            Our multi-layer verification system ensures every participant in the Augeo ecosystem is rigorously vetted for the protection of all guild members.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {[
              {
                icon: UserCheck,
                title: "Primary Intake",
                desc: "Initial profiling and algorithmic cross-referencing of global watchlists and institutional databases.",
                time: "Instant"
              },
              {
                icon: FileText,
                title: "Document Nexus",
                desc: "Secure upload of government-issued identification and certified proof of residency.",
                time: "2-5 Minutes"
              },
              {
                icon: Fingerprint,
                title: "Biometric Audit",
                desc: "AI-driven liveness detection and visual mapping to ensure zero-risk identity confirmation.",
                time: "Real-time"
              },
              {
                icon: ShieldCheck,
                title: "Executive Review",
                desc: "Final manual clearance by our security council for high-limit bidding privileges.",
                time: "12-24 Hours"
              }
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="relative group">
                   <div className="p-8 bg-white border border-gray-100 rounded-[2.5rem] hover:border-burgundy/30 hover:shadow-2xl hover:shadow-burgundy/5 transition-all h-full flex flex-col">
                      <div className="flex justify-between items-start mb-10">
                         <div className="w-16 h-16 bg-dark rounded-2xl flex items-center justify-center group-hover:bg-burgundy transition-colors duration-500">
                            <Icon className="h-8 w-8 text-burgundy group-hover:text-dark transition-colors duration-500" />
                         </div>
                         <span className="text-sm font-black text-gray-300 uppercase tracking-widest">Stage 0{i+1}</span>
                      </div>
                      <h3 className="text-2xl font-black text-dark mb-4 uppercase tracking-tight">
                        {step.title}
                      </h3>
                      <p className="text-gray-500 font-medium leading-relaxed mb-8 flex-grow">
                        {step.desc}
                      </p>
                      <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                         <span className="text-sm font-black text-burgundy uppercase tracking-widest">Latency</span>
                         <span className="text-sm font-bold text-dark uppercase">{step.time}</span>
                      </div>
                   </div>
                   {i < 3 && (
                     <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-20">
                        <ChevronRight className="h-6 w-6 text-gray-200" />
                     </div>
                   )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security Infrastructure */}
      <section className="py-24 bg-dark text-white overflow-hidden relative">
         <div className="absolute inset-0 bg-burgundy/5 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]" />
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
               <div>
                  <h2 className="text-5xl font-black tracking-tighter uppercase mb-8">
                    Institutional <span className="text-burgundy italic">Encryption</span>
                  </h2>
                  <div className="space-y-6">
                    {[
                      "AES-256 Bit End-to-End Encryption for all identity packets.",
                      "Zero-Knowledge Proof (ZKP) protocols for data privacy.",
                      "Cloudflare Advanced DDoS & Bot Mitigation.",
                      "Real-time monitoring by Certified Security Analysts."
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="mt-1 h-5 w-5 rounded-full border border-burgundy/50 flex items-center justify-center p-1">
                           <div className="h-2 w-2 rounded-full bg-burgundy" />
                        </div>
                        <p className="text-gray-400 font-medium">{item}</p>
                      </div>
                    ))}
                  </div>
               </div>
               <div className="relative">
                  <div className="p-12 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-xl">
                     <ShieldAlert className="h-40 w-40 text-burgundy/20 mx-auto mb-8" />
                     <div className="text-center">
                        <p className="text-burgundy font-black uppercase tracking-[0.3em] text-sm mb-2">Our Security Guarantee</p>
                        <h3 className="text-3xl font-black uppercase tracking-tight">Zero-Leach Infrastructure</h3>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-black text-dark tracking-tighter uppercase mb-8">Ready for <span className="text-burgundy italic">Clearance?</span></h2>
          <p className="text-gray-500 text-xl mb-12 font-medium italic">
            Most members achieve full verification status in under 15 minutes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/dashboard/profile" className="btn-primary !px-12 !py-4 uppercase tracking-widest font-black text-sm">
              Begin Verification
            </Link>
            <Link href="/pages/how-it-works" className="px-12 py-4 border border-gray-200 hover:border-burgundy rounded-2xl font-black text-sm uppercase tracking-widest transition-all">
               View Bidding Rules
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
