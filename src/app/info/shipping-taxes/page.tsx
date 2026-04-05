"use client";

import Link from "next/link";
import { Truck, Globe, MapPin, ShieldCheck, Anchor, Plane, FileText, ChevronRight } from "lucide-react";

export default function ShippingTaxes() {

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="py-24 bg-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-burgundy/5 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/world-map.png')]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-2 text-burgundy text-sm font-black uppercase tracking-[0.1em] mb-4">
            <Globe className="h-3 w-3" /> Live Auctions
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none mb-6">
            {"Logistics & Settlement".split('&').map((word, i) => (
              i === 1 ? <span key={i}>& <span className="text-burgundy italic">{word}</span></span> : word
            ))}
          </h1>
          <p className="text-gray-400 text-2xl font-medium max-w-2xl italic leading-relaxed">
            "From the vault to your doorstep—insured, authenticated, and cryptographically tracked across 120+ jurisdictions."
          </p>
        </div>
      </section>

      {/* Logistics Overview */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-5xl font-black text-dark tracking-tighter uppercase leading-none">
                {"The Augeo Transit Protocol".split(' ').map((word, i, arr) => (
                  i >= arr.length - 2 ? <span key={i} className="text-burgundy italic">{word} </span> : word + ' '
                ))}
              </h2>
              <p className="text-gray-500 text-xl leading-relaxed font-medium">
                Winning bids for physical assets trigger our standardized logistics protocol. We partner with specialized white-glove couriers to ensure the provenance and condition of your acquisition remain pristine during transit.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { icon: Plane, title: "Air Priority", desc: "48-72 hour global transit for watch and jewelry lots." },
                  { icon: Anchor, title: "Marine Fragile", desc: "Temperature-controlled sea freight for bulk spirits." },
                  { icon: Truck, title: "White Glove", desc: "Last-mile home installation for fine art collections." },
                  { icon: MapPin, title: "Vault Pickup", desc: "Direct collection from our secure facilities globally." }
                ].map((item, i) => (
                  <div key={i} className="p-6 bg-gray-50 rounded-xl border border-gray-200 group hover:border-burgundy/30 transition-all">
                    <item.icon className="h-6 w-6 text-burgundy mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="font-black text-dark uppercase tracking-tight text-base mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 font-bold leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
               <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-200 p-8">
                  <div className="h-full w-full border-2 border-dashed border-burgundy/20 rounded-xl flex flex-col items-center justify-center p-8 text-center">
                     <ShieldCheck className="h-32 w-32 text-burgundy opacity-30 mb-6" />
                     <h3 className="text-3xl font-black text-dark uppercase tracking-tighter">
                        100% Insured Valuations
                     </h3>
                     <p className="text-sm text-gray-400 font-bold mt-2 uppercase tracking-widest">
                        Powered by Lloyd's of London
                     </p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tax & Duty Navigator */}
      <section className="py-24 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                 <h2 className="text-4xl font-black text-dark tracking-tighter uppercase mb-6 leading-tight">
                     {"Jurisdictional Compliance".split(' ').map((word, i, arr) => (
                       i === arr.length - 1 ? <span key={i} className="text-burgundy italic">{word}</span> : word + ' '
                     ))}
                 </h2>
                  <p className="text-gray-500 font-medium italic mb-8">
                    Taxes and duties are calculated based on the destination of the asset and its classification.
                  </p>
                 <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-200 italic font-bold text-sm text-gray-400">
                    <FileText className="h-4 w-4 text-burgundy" />
                    "Customs documentation prepared automatically per lot."
                 </div>
              </div>
              
              <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
                 {[
                    { title: "European Union", desc: "Standardized VAT applies per member state." },
                    { title: "North America", desc: "Certain art classes exempted from US import duties." },
                    { title: "Asia Pacific", desc: "Complex duties apply for spirits and luxury tech." },
                    { title: "Middle East", desc: "Exemptions available for Free Trade Zone delivery." }
                  ].map((region, i) => (
                    <div key={i} className="p-8 bg-white rounded-xl border border-gray-200 shadow-lg shadow-black/5">
                      <h3 className="text-xl font-black text-dark uppercase tracking-tight mb-4">
                         {region.title}
                      </h3>
                      <div className="flex gap-10 mb-6">
                         <div>
                            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Import Duty</p>
                            <p className="text-2xl font-black text-burgundy mt-1">5%</p>
                         </div>
                         <div>
                            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">VAT/GST</p>
                            <p className="text-2xl font-black text-dark mt-1">20%</p>
                         </div>
                      </div>
                      <p className="text-sm text-gray-400 font-medium leading-relaxed italic border-t border-gray-200 pt-4">
                        {region.desc}
                      </p>
                    </div>
                  ))}
              </div>
           </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-black text-dark tracking-tighter uppercase mb-8 leading-tight">
            Tailored <span className="text-burgundy italic">Logistics Quotation</span>
          </h2>
          <p className="text-gray-500 text-xl mb-12 font-medium italic">
            Every lot has unique shipping requirements. For an exact quote to your location, please contact our logistics desk.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/info/contact" className="btn-primary !px-12 !py-4 uppercase tracking-widest font-black text-sm">
              Contact Logistics Desk
            </Link>
            <Link href="/info/buyers-premium" className="px-12 py-4 border border-gray-200 hover:border-burgundy rounded-2xl font-black text-sm uppercase tracking-widest transition-all">
                Buyer's Premium
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
