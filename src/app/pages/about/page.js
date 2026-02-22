"use client";

import Link from "next/link";
import { Gavel, Shield, Globe, Award, Star, Users, TrendingUp, Landmark } from "lucide-react";

export default function About() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 bg-dark text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gold/5 blur-[120px] rounded-full translate-x-1/4" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-gold text-xs font-black uppercase tracking-[0.5em] mb-6 block animate-fade-in">Established 2026</span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-none uppercase">
            The Soul of <br /><span className="text-gold italic">Augeo</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed italic font-heading">
            "Redefining the horizon of global acquisition through certified integrity and institutional-grade excellence."
          </p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-square bg-gray-50 rounded-[3rem] overflow-hidden border border-gray-100 p-12">
                 <div className="h-full w-full border-2 border-dashed border-gold/20 rounded-[2rem] flex items-center justify-center p-8">
                    <Landmark className="h-32 w-32 text-gold opacity-30" />
                 </div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-gold rounded-[2rem] flex flex-col items-center justify-center p-6 shadow-2xl shadow-gold/20">
                <span className="text-4xl font-black text-dark mb-1">$420M+</span>
                <span className="text-[10px] font-black text-dark/60 uppercase tracking-widest text-center">Asset Value Settled</span>
              </div>
            </div>

            <div className="space-y-8">
              <h2 className="text-4xl font-black text-dark tracking-tighter uppercase leading-none">
                Our <span className="text-gold italic">Origins</span>
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed">
                Augeo was born from a singular vision: to bridge the gap between world-class auction houses and the next generation of global connoisseurs. We recognized that the traditional auction model, while prestigious, often lacked the transparency and technological agility required in the digital age.
              </p>
              <p className="text-gray-500 text-lg leading-relaxed">
                By integrating military-grade encryption, institutional-grade financial processing, and a rigorous multi-stage authentication protocol, we've created a "Gated Marketplace" where integrity is the only currency that matters.
              </p>
              <div className="pt-4 grid grid-cols-2 gap-8">
                <div>
                   <span className="text-2xl font-black text-dark">100%</span>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Authenticated Listings</p>
                </div>
                <div>
                   <span className="text-2xl font-black text-dark">120+</span>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Global Jurisdictions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black tracking-tighter mb-4 uppercase">
              The Guild <span className="text-gold italic">Principles</span>
            </h2>
            <div className="h-1 w-20 bg-gold mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                icon: Shield, 
                title: "Radical Integrity", 
                desc: "Every asset passes through a triple-blind verification process before entering the vault." 
              },
              { 
                icon: Globe, 
                title: "Borderless Access", 
                desc: "Connecting the world's most exclusive liquid assets with collectors regardless of geography." 
              },
              { 
                icon: TrendingUp, 
                title: "Asset Fluidity", 
                desc: "Creating a highly-liquid secondary market for ultra-rare items through secure settlement." 
              }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="group p-10 bg-white/5 rounded-[2rem] border border-white/5 hover:border-gold/30 hover:bg-white/10 transition-all duration-500">
                  <div className="h-14 w-14 bg-gold/10 rounded-2xl flex items-center justify-center mb-8 transform group-hover:scale-110 transition-transform">
                    <Icon className="h-7 w-7 text-gold" />
                  </div>
                  <h3 className="text-xl font-black mb-4 uppercase tracking-tight group-hover:text-gold transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership / Governance CTA */}
      <section className="py-32 bg-white relative">
         <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-black text-dark tracking-tighter mb-8 uppercase">
               Join the <span className="text-gold italic">Executive Council</span>
            </h2>
            <p className="text-gray-500 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
               Augeo is more than a platform—it's a community of discerning buyers and sellers committed to excellence. Start your journey with us today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
               <Link href="/auth/register" className="btn-primary !px-12 !py-4 uppercase tracking-widest font-black text-xs">
                  Create Membership
               </Link>
               <Link href="/pages/contact" className="px-12 py-4 border border-gray-200 hover:border-gold rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                  Contact Concierge
               </Link>
            </div>
         </div>
      </section>
    </div>
  );
}
